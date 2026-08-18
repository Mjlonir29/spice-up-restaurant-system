import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  table: { type: String, required: true },
  items: { type: String, required: true },
  customizations: { type: String, default: '' },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Preparing', 'Ready', 'Completed'], default: 'Pending' },
  time: { type: String, default: () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
