import mongoose from "mongoose";
const transformerSchema = new mongoose.Schema({
  transformerId: { type: String, required: true },
  substation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Substation',
    required: true
  }
});

const Transformer = mongoose.model('Transformer', transformerSchema);
export default Transformer;
