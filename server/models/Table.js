import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema({
  tableId: { type: Number, required: true, unique: true },
  number: { type: String, required: true },
  seats: { type: Number, required: true },
  status: { type: String, enum: ['Available', 'Occupied', 'Reserved'], default: 'Available' },
  currentOrder: { type: String, default: '-' }
}, { timestamps: true });

const Table = mongoose.model('Table', tableSchema);
export default Table;
