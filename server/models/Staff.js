import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    default: 'Staff Member'
  },
  email: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Active', 'On Duty', 'Off Duty'],
    default: 'Active'
  }
}, { timestamps: true });

export default mongoose.model('Staff', staffSchema);
