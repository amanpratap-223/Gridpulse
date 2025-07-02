import mongoose from 'mongoose';

const substationschema = new mongoose.Schema({
  substation: { type: String, required: true },
  location: { type: String, required: true },
  temperature: { type: Number, required: true },
  attendantEmail: {type: String, required: true},
  Date: { type: String },
  Time: { type: String }
});

const substation = mongoose.model('substation', substationschema);
export default substation