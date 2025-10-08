import mongoose from "mongoose";

const substationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  temperature: { type: Number, required: true },
  attendants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Substation = mongoose.model("Substation", substationSchema);
export default Substation;
