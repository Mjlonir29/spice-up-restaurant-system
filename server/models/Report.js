import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  invoiceNo: { type: String, required: true },
  token: { type: String, required: true },
  date: { type: String, required: true },
  table: { type: String, required: true },
  status: { type: String, default: 'Completed' },
  preTax: { type: Number, required: true },
  cgst: { type: Number, required: true },
  sgst: { type: Number, required: true },
  totalTax: { type: Number, required: true },
  grandTotal: { type: Number, required: true },
  staffName: { type: String, default: 'All Staff' }
}, { timestamps: true });

export default mongoose.model('Report', reportSchema);
