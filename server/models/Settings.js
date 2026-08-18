import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  restaurantName: { type: String, default: 'SPICEUP Fine Dining' },
  restaurantAddress: { type: String, default: '123 Spice Street, Food Plaza, New Delhi' },
  gstNumber: { type: String, default: '07AAAAA0000A1Z5' },
  gstMode: { type: String, default: 'Exclusive (5%)' }
}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);
