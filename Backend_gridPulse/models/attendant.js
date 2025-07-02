import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const attendantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  substation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Substation',
    required: true
  }
});

// 🔐 Hash password before saving
attendantSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔍 Method to compare entered password with hashed one
attendantSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const Attendant = mongoose.model('Attendant', attendantSchema);
export default Attendant;
