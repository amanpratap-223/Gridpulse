// scripts/createSubstation.js
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = "mongodb://127.0.0.1:27017/gridpulse";

await mongoose.connect(MONGODB_URI);
console.log("✅ Connected to MongoDB");

// ✅ Define the Substation schema here using the SAME mongoose instance
const substationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  temperature: { type: Number, required: true },
  attendants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attendant'
  }]
});

const Substation = mongoose.model("Substation", substationSchema);

try {
  let sub = await Substation.findOne({ name: "5" });
  if (!sub) {
    sub = await Substation.create({
      name: "5",
      location: "Unknown",
      temperature: 0,
      attendants: [],
    });
    console.log("✅ Substation 5 created:", sub._id);
  } else {
    console.log("ℹ️ Substation 5 already exists:", sub._id);
  }
} catch (err) {
  console.error("❌ Error:", err);
} finally {
  await mongoose.disconnect();
  process.exit();
}
