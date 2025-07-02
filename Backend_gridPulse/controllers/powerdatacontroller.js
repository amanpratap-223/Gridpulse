import { PowerData } from '../models/powerData.js';
import Transformer from '../models/transformer.js';
import Area from '../models/area.js';
import { Substation } from '../models/powerData.js';
import mongoose from 'mongoose';

export const submitPowerData = async (req, res) => {
  try {
    const {
      SNo,
      substation,
      totalUnitConsumed,
      temperature,
      dateOfReading,
      transformers,
      areas
    } = req.body;

    if (
      !SNo ||
      !substation ||
      !dateOfReading ||
      !Array.isArray(transformers) || transformers.length === 0 ||
      !Array.isArray(areas)
    ) {
      return res.status(400).json({ error: 'Missing required fields or invalid data.' });
    }

    let substationDoc = await Substation.findOne({ name: substation });
    if (!substationDoc) {
      substationDoc = await Substation.create({
        name: substation,
        location: 'Unknown',
        temperature: temperature || 0,
        attendants: [] // Skip auto-linking for now
      });
    }

    const substationId = substationDoc._id;

    const mappedTransformers = await Promise.all(transformers.map(async (t) => {
      let transformerDoc = await Transformer.findOne({ transformerId: t.transformerId, substation: substationId });

      if (!transformerDoc) {
        transformerDoc = await Transformer.create({
          transformerId: t.transformerId,
          substation: substationId
        });
      }

      return {
        transformer: transformerDoc._id,
        voltage: t.voltage,
        current: t.current,
        power: t.power
      };
    }));

    const mappedAreas = await Promise.all(areas.map(async (a) => {
      let areaDoc = await Area.findOne({ name: a.name, substation: substationId });

      if (!areaDoc) {
        areaDoc = await Area.create({
          name: a.name,
          substation: substationId
        });
      }

      return {
        area: areaDoc._id,
        power: a.power
      };
    }));

    const newEntry = new PowerData({
      SNo,
      substation: substationId,
      totalUnitConsumed,
      temperature,
      dateOfReading,
      transformers: mappedTransformers,
      areas: mappedAreas,
      // Only add `submittedBy` if it exists
      ...(req.attendant && { submittedBy: req.attendant._id })
    });

    await newEntry.save();
    res.status(201).json({ message: 'Power data submitted successfully.', data: newEntry });

  } catch (error) {
    console.error('Error submitting power data:', error.message);
    res.status(500).json({ error: error.message || 'Internal server error.' });
  }
};
