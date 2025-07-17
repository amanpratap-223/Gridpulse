import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { PowerData } from "../models/powerData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load .env properly with absolute path
dotenv.config({ path: path.resolve(__dirname, "../.env") });

console.log("Loaded MONGO_URI:", process.env.MONGODB_URI); // ✅ Real debug log

const updateSerialNumbers = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGO_URI is undefined. Check your .env file!");
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");

    const entries = await PowerData.find({}).sort({ dateOfReading: 1 });

    let serialNo = 1;
    for (const entry of entries) {
      entry.SNo = serialNo++;
      await entry.save();
    }

    console.log("✅ Serial numbers updated successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating serial numbers:", error.message);
    process.exit(1);
  }
};

updateSerialNumbers();
