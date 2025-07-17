// scripts/uploadcsv.js
import mongoose from "mongoose";
import csv from "csvtojson";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { Substation, PowerData } from "../models/powerData.js";
import Transformer from "../models/transformer.js";
import Area from "../models/area.js";
import Attendant from "../models/attendant.js";

// ✅ Correct DB name
const MONGODB_URI = "mongodb://127.0.0.1:27017/gridpulse";
await mongoose.connect(MONGODB_URI);
console.log("✅ Connected to MongoDB");

// ✅ Delete existing PowerData
await PowerData.deleteMany({});
console.log("🗑️ Deleted all existing PowerData documents");

// ✅ Ensure Substation 5 exists
let substationDoc = await Substation.findOne({ name: "5" });
if (!substationDoc) {
  substationDoc = await Substation.create({
    name: "5",
    location: "Unknown",
    temperature: 0,
    attendants: [],
  });
}
const substationId = substationDoc._id;
console.log("✅ Using Substation:", substationId);

// ✅ Ensure Attendant exists
let attendantDoc = await Attendant.findOne({ email: "vishwasmakkar123@gmail.com" });
if (!attendantDoc) {
  attendantDoc = await Attendant.create({
    name: "Vishwas Makkar",
    email: "vishwasmakkar123@gmail.com",
    password: "1234", // will be hashed by pre-save hook
    substation: substationId,
  });
}
const attendantId = attendantDoc._id;
console.log("✅ Using Attendant:", attendantId);

// ✅ CSV Path
const CSV_PATH = path.join(__dirname, "..", "data", "readings.csv");
console.log("→ Reading CSV:", CSV_PATH);

const rows = await csv().fromFile(CSV_PATH);
let counter = 0;

for (const [index, row] of rows.entries()) {
  try {
    // ✅ Convert DD-MM-YYYY → YYYY-MM-DD
    let rawDate = row["Date"]?.trim();
    let date;

    if (rawDate && /^\d{2}-\d{2}-\d{4}$/.test(rawDate)) {
      const [d, m, y] = rawDate.split("-");
      date = new Date(`${y}-${m}-${d}`);
    } else {
      date = new Date(rawDate);
    }

    if (isNaN(date)) {
      console.warn(`⏩ Skipping row ${index + 1} due to invalid date: ${rawDate}`);
      continue;
    }

    // ✅ Transformers
    const transformersMap = [
      {
        transformerId: "TR-1",
        voltage: parseFloat(row["TR-1 Voltage (V)"]),
        current: parseFloat(row["TR-1 Current (A)"]),
        power: parseFloat(row["TR-1 KWH"]),
      },
      {
        transformerId: "TR-2",
        voltage: parseFloat(row["TR-2 Voltage (V)"]),
        current: parseFloat(row["TR-2 Current (A)"]),
        power: parseFloat(row["TR-2 KWH"]),
      },
    ];
    const transformerData = [];
    for (const t of transformersMap) {
      if (!isNaN(t.voltage) && !isNaN(t.current) && !isNaN(t.power)) {
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

        transformerData.push({
          transformer: transformerDoc._id,
          voltage: t.voltage,
          current: t.current,
          power: t.power,
        });
      }
    }

    // ✅ Areas
    const skipCols = [
      "Date",
      "TR-1 KWH", "TR-1 Voltage (V)", "TR-1 Current (A)",
      "TR-2 KWH", "TR-2 Voltage (V)", "TR-2 Current (A)",
      "Total Unit Consumed in KWH", "Temperature_C",
    ];
    const areaData = [];
    for (const [key, value] of Object.entries(row)) {
      if (!skipCols.includes(key) && value && !isNaN(value)) {
        let areaDoc = await Area.findOne({ name: key, substation: substationId });
        if (!areaDoc) {
          areaDoc = await Area.create({ name: key, substation: substationId });
        }

        areaData.push({
          area: areaDoc._id,
          power: parseFloat(value),
        });
      }
    }

    // ✅ Insert PowerData with Serial Number
    const newEntry = new PowerData({
      SNo: counter + 1, // Serial number starts from 1
      substation: substationId,
      dateOfReading: date,
      transformers: transformerData,
      areas: areaData,
      totalUnitConsumed: parseFloat(row["Total Unit Consumed in KWH"]) || 0,
      temperature: parseFloat(row["Temperature_C"]) || 0,
      submittedBy: attendantId,
    });

    await newEntry.save();
    counter++;
    console.log(`✅ Inserted row ${counter}/${rows.length}`);
  } catch (err) {
    console.error(`❌ Failed row ${index + 1}:`, err.message);
  }
}

console.log(`✅ Completed: Inserted ${counter}/${rows.length} rows`);
await mongoose.disconnect();
process.exit();
