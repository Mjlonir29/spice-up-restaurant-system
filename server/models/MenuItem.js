import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  itemId: { type: Number },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  available: { type: Boolean, default: true },
  stockQuantity: { type: Number, default: 30 },
  lowStockThreshold: { type: Number, default: 5 }
}, { timestamps: true });

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
export default MenuItem;
