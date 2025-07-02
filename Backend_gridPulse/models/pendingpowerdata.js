
import mongoose from 'mongoose';

const pendingPowerDataSchema = new mongoose.Schema({
    data: {
        type: Object,
        required: true
      },
  substation: {
    type: String,
    required: true
  },
  attendantEmail: {
    type: String,
    required: true
  },
  date: String,
  time: String,
  newFields: {
    type: Object,
    default: {}
  }
});

const PendingPowerData = mongoose.model('PendingPowerData', pendingPowerDataSchema);
export default PendingPowerData;
