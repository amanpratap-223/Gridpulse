import { PowerData } from '../models/powerData.js';
import Transformer from '../models/transformer.js';
import Area from '../models/area.js';
import { Substation } from '../models/powerData.js';
import mongoose from 'mongoose';

// ✅ Submit Power Data
export const submitPowerData = async (req, res) => {
  try {
    const {
      substation,
      totalUnitConsumed,
      temperature,
      dateOfReading,
      transformers,
      areas,
    } = req.body;

    if (
      !substation ||
      !dateOfReading ||
      !Array.isArray(transformers) ||
      transformers.length === 0 ||
      !Array.isArray(areas)
    ) {
      return res
        .status(400)
        .json({ error: 'Missing required fields or invalid data.' });
    }

    let substationDoc = await Substation.findOne({ name: substation });
    if (!substationDoc) {
      substationDoc = await Substation.create({
        name: substation,
        location: 'Unknown',
        temperature: temperature || 0,
        attendants: [],
      });
    }
    const substationId = substationDoc._id;

    const mappedTransformers = await Promise.all(
      transformers.map(async (t) => {
        let transformerDoc = await Transformer.findOne({
          transformerId: t.transformerId,
          substation: substationId,
        });

        if (!transformerDoc) {
          transformerDoc = await Transformer.create({
            transformerId: t.transformerId,
            substation: substationId,
          });
        }

        return {
          transformer: transformerDoc._id,
          voltage: t.voltage,
          current: t.current,
          power: t.power,
        };
      })
    );

    const mappedAreas = await Promise.all(
      areas.map(async (a) => {
        let areaDoc = await Area.findOne({
          name: a.name,
          substation: substationId,
        });

        if (!areaDoc) {
          areaDoc = await Area.create({
            name: a.name,
            substation: substationId,
          });
        }

        return {
          area: areaDoc._id,
          power: a.power,
        };
      })
    );

    const latestEntry = await PowerData.findOne().sort({ SNo: -1 });
    const nextSNo = latestEntry ? latestEntry.SNo + 1 : 1;

    const newEntry = new PowerData({
      SNo: nextSNo,
      substation: substationId,
      totalUnitConsumed,
      temperature,
      dateOfReading,
      transformers: mappedTransformers,
      areas: mappedAreas,
      ...(req.user && { submittedBy: req.user._id }), // ✅ updated to new auth
    });

    await newEntry.save();
    res
      .status(201)
      .json({ message: 'Power data submitted successfully.', data: newEntry });
  } catch (error) {
    console.error('Error submitting power data:', error.message);
    res.status(500).json({ error: error.message || 'Internal server error.' });
  }
};

// ✅ Get All Power Data (original logic restored)
export const getAllPowerData = async (req, res) => {
  try {
    const { substationId } = req.query;

    const query = substationId ? { substation: substationId } : {};

    const data = await PowerData.find(query)
      .populate("transformers.transformer")
      .populate("areas.area")
      .populate("substation", "name")
      .sort({ dateOfReading: 1 });

    const formatted = data.map((entry) => ({
      date: entry.dateOfReading
        ? new Date(entry.dateOfReading).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "N/A",
      tr1Voltage: entry.transformers[0]?.voltage || 0,
      tr1Current: entry.transformers[0]?.current || 0,
      tr1Power: entry.transformers[0]?.power || 0,
      tr2Voltage: entry.transformers[1]?.voltage || 0,
      tr2Current: entry.transformers[1]?.current || 0,
      tr2Power: entry.transformers[1]?.power || 0,
      totalUnitConsumed: entry.totalUnitConsumed || 0,
      temperature: entry.temperature || 0,
      areas: entry.areas.map((a) => ({
        name: a.area?.name || "Unknown Area",
        value: a.power || 0,
      })),
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching power data:", error.message);
    res.status(500).json({ error: "Failed to fetch power data" });
  }
};


// ✅ Get All Power Data (InfoTable)
export const getAllPowerDataFormatted = async (req, res) => {
  try {
    const data = await PowerData.find({})
      .sort({ SNo: 1 })
      .populate("transformers.transformer")
      .populate("areas.area")
      .populate("substation", "name");

    const formatted = data.map((entry) => ({
      SNo: entry.SNo || 0,
      dateOfReading: entry.dateOfReading
        ? new Date(entry.dateOfReading).toLocaleDateString("en-GB")
        : "N/A",
      tr1Voltage: entry.transformers[0]?.voltage || 0,
      tr1Current: entry.transformers[0]?.current || 0,
      tr1Power: entry.transformers[0]?.power || 0,
      tr2Voltage: entry.transformers[1]?.voltage || 0,
      tr2Current: entry.transformers[1]?.current || 0,
      tr2Power: entry.transformers[1]?.power || 0,
      totalUnitConsumed: entry.totalUnitConsumed || 0,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching formatted power data:", error.message);
    res.status(500).json({ error: "Failed to fetch formatted power data" });
  }
};
