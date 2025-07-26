import mongoose from 'mongoose';

// Substation Schema
const substationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  temperature: { type: Number, required: true },
  attendants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

export const Substation = mongoose.model('Substation', substationSchema);

// Power Data Schema
const powerDataSchema = new mongoose.Schema({
  substation: { type: mongoose.Schema.Types.ObjectId, ref: 'Substation', required: true },
  dateOfReading: { type: Date, required: true },
  transformers: [{
    transformer: { type: mongoose.Schema.Types.ObjectId, ref: 'Transformer', required: true },
    voltage: { type: Number, required: true },
    current: { type: Number, required: true },
    power: { type: Number, required: true }
  }],
  areas: [{
    area: { type: mongoose.Schema.Types.ObjectId, ref: 'Area', required: true },
    power: { type: Number, required: true }
  }],
  totalUnitConsumed: { type: Number },
  temperature: { type: Number },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

export const PowerData = mongoose.model('PowerData', powerDataSchema);
