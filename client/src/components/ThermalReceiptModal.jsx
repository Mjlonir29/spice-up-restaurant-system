import React from 'react';
import { Printer, X, CheckCircle2, Flame, Building, FileText } from 'lucide-react';

const ThermalReceiptModal = ({ order, settings, onClose }) => {
  if (!order) return null;

  const restaurantName = settings?.restaurantName || 'SPICEUP Fine Dining';
  const restaurantAddress = settings?.restaurantAddress || '123 Spice Street, Food Plaza, New Delhi';
  const gstNumber = settings?.gstNumber || '07AAAAA0000A1Z5';
  const gstMode = settings?.gstMode || 'Exclusive (5%)';

  const subtotal = order.amount || 0;
  const cgst = Math.round(subtotal * 0.025);
  const sgst = Math.round(subtotal * 0.025);
  const serviceCharge = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + cgst + sgst + serviceCharge;

  const itemsList = typeof order.items === 'string' 
    ? order.items.split(', ').map((str, i) => {
        const parts = str.split('x ');
        const qty = parts.length > 1 ? parseInt(parts[0]) : 1;
        const name = parts.length > 1 ? parts[1] : str;
        const itemPrice = Math.round(subtotal / (order.items.split(', ').length * (qty || 1))) || 180;
        return { id: i, name, qty, price: itemPrice, total: qty * itemPrice };
      })
    : [];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d1117]/85 backdrop-blur-sm p-4 animate-fade-in">
      
      {/* Modal Container */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 max-w-sm w-full shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Top Header & Actions */}
        <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white font-heading">Thermal Invoice Receipt</h3>
          </div>

          <button 
            onClick={onClose}
            className="p-1 rounded-lg bg-[#21262d] text-[#8b949e] hover:text-white border border-[#30363d] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Receipt Paper Container */}
        <div id="printable-thermal-receipt" className="bg-white text-slate-950 p-5 rounded-xl shadow-inner font-mono text-[11px] leading-tight space-y-3 border border-slate-300">
          
          {/* Restaurant Header */}
          <div className="text-center space-y-1 pb-3 border-b border-dashed border-slate-400">
            <div className="flex items-center justify-center gap-1.5">
              <Flame className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              <h2 className="text-sm font-extrabold uppercase font-sans tracking-wide text-slate-950">{restaurantName}</h2>
            </div>
            <p className="text-[10px] text-slate-700 leading-tight">{restaurantAddress}</p>
            <p className="text-[10px] font-bold text-slate-800">GSTIN: {gstNumber}</p>
          </div>

          {/* Receipt Meta Details */}
          <div className="space-y-1 pb-2 border-b border-dashed border-slate-400 text-[10px]">
            <div className="flex justify-between">
              <span>Invoice Ref:</span>
              <span className="font-bold">#INV-{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Table / Session:</span>
              <span className="font-bold">{order.table || 'Table 1'}</span>
            </div>
            <div className="flex justify-between">
              <span>Date & Time:</span>
              <span>{order.time || new Date().toLocaleTimeString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Cashier / Staff:</span>
              <span>Agnibha Dey (Admin)</span>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="space-y-1.5 pb-3 border-b border-dashed border-slate-400">
            <div className="grid grid-cols-12 font-bold text-[10px] uppercase border-b border-slate-300 pb-1">
              <span className="col-span-2">Qty</span>
              <span className="col-span-7">Item Description</span>
              <span className="col-span-3 text-right">Amount</span>
            </div>

            {itemsList.map(item => (
              <div key={item.id} className="grid grid-cols-12 text-[10px]">
                <span className="col-span-2 font-bold">{item.qty}x</span>
                <span className="col-span-7 truncate font-sans font-semibold">{item.name}</span>
                <span className="col-span-3 text-right font-bold">₹{item.total}</span>
              </div>
            ))}
          </div>

          {/* Tax & Financial Breakdown */}
          <div className="space-y-1 pb-3 border-b border-dashed border-slate-400 text-[10px]">
            <div className="flex justify-between">
              <span>Items Subtotal:</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>CGST (2.5%):</span>
              <span>₹{cgst}</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>SGST (2.5%):</span>
              <span>₹{sgst}</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Service Charge (5%):</span>
              <span>₹{serviceCharge}</span>
            </div>

            <div className="flex justify-between text-xs font-extrabold font-heading text-slate-950 pt-2 border-t border-slate-400">
              <span>GRAND TOTAL:</span>
              <span>₹{grandTotal}</span>
            </div>
          </div>

          {/* Receipt Footer */}
          <div className="text-center pt-1 space-y-1">
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-800">GST Mode: {gstMode}</p>
            <p className="text-[10px] font-semibold text-slate-950 font-sans mt-1">Thank you for dining with SPICEUP!</p>
            <p className="text-[9px] text-slate-600">Please visit again • Have a great day!</p>

            {/* Barcode visual */}
            <div className="pt-2 flex justify-center">
              <div className="h-6 w-3/4 bg-slate-900 flex items-center justify-around px-2 text-[8px] text-white tracking-widest font-mono">
                |||| | ||| |||| | ||
              </div>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={handlePrint}
            className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/40 transition-all"
          >
            <Printer className="w-3.5 h-3.5" /> Print Ticket
          </button>

          <button
            onClick={onClose}
            className="py-2.5 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] font-medium rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors border border-[#30363d]"
          >
            Close Invoice
          </button>
        </div>

      </div>

    </div>
  );
};

export default ThermalReceiptModal;
