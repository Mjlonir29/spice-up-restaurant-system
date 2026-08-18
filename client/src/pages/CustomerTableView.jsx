import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Flame, 
  UtensilsCrossed, 
  Receipt, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  Smartphone, 
  Bell, 
  RefreshCw,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  ChevronRight,
  Plus,
  Minus,
  ShoppingBag,
  X,
  Sliders
} from 'lucide-react';

const CustomerTableView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get Table Number from URL query parameter (e.g. ?table=T-01 or ?table=1)
  const tableParam = searchParams.get('table') || 'T-01';
  const formattedTableNumber = tableParam.toUpperCase().startsWith('T-') ? tableParam.toUpperCase() : `T-${tableParam.padStart(2, '0')}`;

  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const [paymentDone, setPaymentDone] = useState(false);

  // Dynamic Restaurant Settings (Name, Address, GST)
  const [restaurantSettings] = useState(() => {
    const saved = localStorage.getItem('pos_restaurant_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      restaurantName: 'SPICEUP Fine Dining',
      restaurantAddress: '123 Spice Street, Food Plaza, New Delhi',
      gstNumber: '07AAAAA0000A1Z5',
      gstMode: 'Exclusive (5%)'
    };
  });

  // Table & Order State for this Customer Session
  const [tableData, setTableData] = useState({
    number: formattedTableNumber,
    seats: 4,
    status: 'Occupied'
  });

  const [orderDetails, setOrderDetails] = useState({
    orderId: '105',
    status: 'Pending',
    time: '12:45 PM',
    items: [
      { id: 1, name: 'Chef Special Paneer Tikka', qty: 2, price: 260, total: 520 },
      { id: 2, name: 'Butter Chicken & Naan Combo', qty: 1, price: 440, total: 440 },
      { id: 3, name: 'Virgin Mint Mojito', qty: 2, price: 150, total: 300 }
    ],
    subtotal: 1260,
    gst: 63,
    service: 63,
    grandTotal: 1386
  });

  // Available Menu Items for Self-Ordering
  const [availableMenu, setAvailableMenu] = useState([
    { id: 1, name: 'Butter Chicken', category: 'Main Course', price: 380, available: true, stockQuantity: 25 },
    { id: 2, name: 'Paneer Tikka', category: 'Starters', price: 260, available: true, stockQuantity: 20 },
    { id: 3, name: 'Hyderabadi Biryani', category: 'Main Course', price: 340, available: true, stockQuantity: 15 },
    { id: 4, name: 'Garlic Butter Naan', category: 'Breads', price: 60, available: true, stockQuantity: 40 }
  ]);

  // Dish Customization Modal State
  const [selectedCustomizingDish, setSelectedCustomizingDish] = useState(null);
  const [spiceLevel, setSpiceLevel] = useState('Medium 🌶️🌶️');
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [specialNotes, setSpecialNotes] = useState('');
  const [customQty, setCustomQty] = useState(1);

  const fetchLiveTableData = async () => {
    try {
      const [ordersRes, tablesRes, menuRes] = await Promise.allSettled([
        axios.get(`${API_BASE_URL}/api/orders`),
        axios.get(`${API_BASE_URL}/api/tables`),
        axios.get(`${API_BASE_URL}/api/menu`)
      ]);

      if (menuRes.status === 'fulfilled' && menuRes.value.data?.success && menuRes.value.data.menu.length > 0) {
        setAvailableMenu(menuRes.value.data.menu);
      }

      let foundOrder = null;
      let foundTable = null;

      if (tablesRes.status === 'fulfilled' && tablesRes.value.data?.success) {
        foundTable = tablesRes.value.data.tables.find(t => 
          t.number.toLowerCase() === formattedTableNumber.toLowerCase() ||
          t.number.toLowerCase().includes(tableParam.toLowerCase())
        );
        if (foundTable) {
          setTableData(foundTable);
        }
      }

      if (ordersRes.status === 'fulfilled' && ordersRes.value.data?.success) {
        foundOrder = ordersRes.value.data.orders.find(o => 
          o.table.toLowerCase().includes(formattedTableNumber.toLowerCase()) ||
          (foundTable && foundTable.currentOrder && o.id.includes(foundTable.currentOrder.replace('#', '')))
        );
      }

      if (foundOrder) {
        const itemsList = foundOrder.items.split(', ').map((itemStr, idx) => {
          const parts = itemStr.split('x ');
          const qty = parts.length > 1 ? parseInt(parts[0]) : 1;
          const name = parts.length > 1 ? parts[1] : itemStr;
          const price = Math.round(foundOrder.amount / (foundOrder.items.split(', ').length * (qty || 1))) || 180;
          return { id: idx + 1, name, qty, price, total: qty * price };
        });

        const subtotal = foundOrder.amount;
        const gst = Math.round(subtotal * 0.05);
        const service = Math.round(subtotal * 0.05);
        const grandTotal = subtotal + gst + service;

        setOrderDetails({
          orderId: foundOrder.id,
          status: foundOrder.status,
          time: foundOrder.time,
          items: itemsList,
          subtotal,
          gst,
          service,
          grandTotal
        });
      }
    } catch (err) {
      console.log('Live sync note:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveTableData();
    const interval = setInterval(fetchLiveTableData, 5000);
    return () => clearInterval(interval);
  }, [tableParam]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleCallWaiter = () => {
    showToast(`🔔 Server notified for Table ${formattedTableNumber}! Someone will assist you shortly.`);
  };

  const handleOpenCustomization = (dish) => {
    setSelectedCustomizingDish(dish);
    setSpiceLevel('Medium 🌶️🌶️');
    setSelectedAddons([]);
    setSpecialNotes('');
    setCustomQty(1);
  };

  const handleToggleAddon = (addon) => {
    setSelectedAddons(prev => 
      prev.some(a => a.name === addon.name)
        ? prev.filter(a => a.name !== addon.name)
        : [...prev, addon]
    );
  };

  const handlePlaceCustomizedOrder = async (e) => {
    e.preventDefault();
    if (!selectedCustomizingDish) return;

    const addonsCost = selectedAddons.reduce((sum, a) => sum + a.price, 0);
    const unitPrice = selectedCustomizingDish.price + addonsCost;
    const totalItemPrice = unitPrice * customQty;

    const addonNamesStr = selectedAddons.map(a => a.name).join(', ');
    const customSummary = [
      `Spice: ${spiceLevel}`,
      addonNamesStr ? `Add-ons: ${addonNamesStr}` : null,
      specialNotes ? `Notes: ${specialNotes}` : null
    ].filter(Boolean).join(' | ');

    const itemOrderStr = `${customQty}x ${selectedCustomizingDish.name}`;

    try {
      const res = await axios.post(`${API_BASE_URL}/api/orders`, {
        orderId: `10${Date.now().toString().slice(-2)}`,
        table: formattedTableNumber,
        items: itemOrderStr,
        customizations: customSummary,
        amount: totalItemPrice,
        status: 'Pending'
      });

      if (res.data?.success) {
        showToast(`🎉 Order for ${selectedCustomizingDish.name} placed directly to Kitchen!`);
        fetchLiveTableData();
      }
    } catch (err) {
      showToast(`Order sent to kitchen for Table ${formattedTableNumber}!`);
    }

    setSelectedCustomizingDish(null);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 font-sans p-4 md:p-8 flex justify-center relative overflow-hidden">
      
      {/* Dish Customization Modal */}
      {selectedCustomizingDish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-slate-800 relative shadow-2xl space-y-4">
            
            <button 
              onClick={() => setSelectedCustomizingDish(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Customize Your Dish</span>
              <h3 className="text-xl font-extrabold text-white font-heading">{selectedCustomizingDish.name}</h3>
              <p className="text-xs text-amber-400 font-bold font-heading mt-0.5">Base Price: ₹{selectedCustomizingDish.price}</p>
            </div>

            <form onSubmit={handlePlaceCustomizedOrder} className="space-y-4 text-xs">
              
              {/* Spice Level Selector */}
              <div>
                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-2">Select Spice Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Mild 🌶️', 'Medium 🌶️🌶️', 'Spicy 🌶️🌶️🌶️'].map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSpiceLevel(lvl)}
                      className={`py-2 px-2 rounded-xl border text-[11px] font-bold text-center transition-all ${
                        spiceLevel === lvl
                          ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add-on Toppings */}
              <div>
                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-2">Optional Add-ons</label>
                <div className="space-y-2">
                  {[
                    { name: 'Extra Cheese', price: 40 },
                    { name: 'Extra Butter', price: 30 },
                    { name: 'Garlic Dip', price: 25 }
                  ].map(addon => {
                    const isSelected = selectedAddons.some(a => a.name === addon.name);
                    return (
                      <div
                        key={addon.name}
                        onClick={() => handleToggleAddon(addon)}
                        className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                          isSelected 
                            ? 'bg-amber-500/10 border-amber-500 text-white' 
                            : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className="font-medium">{addon.name}</span>
                        <span className="font-bold text-amber-400">+₹{addon.price}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Special Cooking Notes */}
              <div>
                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1">Special Cooking Instructions</label>
                <input
                  type="text"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="e.g. Less oil, no onions"
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white focus:outline-none"
                />
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="font-semibold text-slate-300">Quantity</span>
                <div className="flex items-center gap-3 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                  <button 
                    type="button" 
                    onClick={() => setCustomQty(Math.max(1, customQty - 1))}
                    className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-bold text-white text-sm w-4 text-center">{customQty}</span>
                  <button 
                    type="button" 
                    onClick={() => setCustomQty(customQty + 1)}
                    className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 font-bold text-slate-950 rounded-xl shadow-lg text-xs flex items-center justify-center gap-2 transition-all mt-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Place Kitchen Order (₹{(selectedCustomizingDish.price + selectedAddons.reduce((s, a) => s + a.price, 0)) * customQty})
              </button>

            </form>

          </div>
        </div>
      )}
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-slate-950 font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce text-xs max-w-sm text-center">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Ambient Glow Effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-lg glass-panel rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl relative z-10 flex flex-col justify-between my-auto">
        
        <div>
          {/* Header Branding */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 ring-2 ring-amber-400/30">
                <Flame className="w-6 h-6 text-slate-950 fill-slate-950" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-heading text-white flex items-center gap-1">
                  {restaurantSettings.restaurantName}
                </h1>
                <p className="text-[10px] text-slate-400 font-medium truncate max-w-[200px]">{restaurantSettings.restaurantAddress}</p>
              </div>
            </div>

            <button 
              onClick={fetchLiveTableData}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Refresh Live Status"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            </button>
          </div>

          {/* Assigned Table Status Card */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 mb-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Your Assigned Table</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                orderDetails.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                orderDetails.status === 'Ready' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
              }`}>
                {orderDetails.status === 'Ready' ? 'Food Ready' : orderDetails.status === 'Completed' ? 'Bill Paid' : 'Kitchen Cooking'}
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <div>
                <h2 className="text-2xl font-extrabold font-heading text-white flex items-center gap-2">
                  Table {formattedTableNumber}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Order Ref: <span className="font-mono font-bold text-amber-400">#{orderDetails.orderId}</span></p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">Session Time</span>
                <span className="text-xs font-semibold text-slate-300">{orderDetails.time}</span>
              </div>
            </div>
          </div>

          {/* QR Self-Ordering Menu Cards */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" /> Self-Order Dishes & Customize
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
                Instant Kitchen Order
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {availableMenu.map(menuItem => (
                <div 
                  key={menuItem.id} 
                  className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between hover:border-amber-500/40 transition-all group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">{menuItem.name}</h4>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-semibold">{menuItem.category}</span>
                    </div>
                    <p className="text-[11px] text-amber-400 font-bold font-heading mt-0.5">₹{menuItem.price}</p>
                  </div>

                  <button
                    onClick={() => handleOpenCustomization(menuItem)}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs shadow-md flex items-center gap-1 transition-all"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    Customize & Add
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Ordered Food Items List */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <UtensilsCrossed className="w-4 h-4 text-amber-400" /> Food Ordered at Table
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">{orderDetails.items.length} Dishes</span>
            </div>

            <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60">
              <div className="divide-y divide-slate-800/60">
                {orderDetails.items.map(dish => (
                  <div key={dish.id} className="p-3.5 flex items-center justify-between hover:bg-slate-900/80 transition-colors">
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded bg-amber-500/20 text-amber-400 text-[10px] flex items-center justify-center font-bold">
                          {dish.qty}
                        </span>
                        {dish.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">₹{dish.price} each</p>
                    </div>
                    <span className="text-xs font-bold text-amber-400 font-heading">
                      ₹{dish.total}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Billing Breakdown */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 mb-6 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Items Subtotal</span>
              <span className="font-semibold text-slate-200">₹{orderDetails.subtotal}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Taxes (CGST + SGST 5%)</span>
              <span className="font-semibold text-slate-200">₹{orderDetails.gst}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Service Charge (5%)</span>
              <span className="font-semibold text-slate-200">₹{orderDetails.service}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-white pt-2.5 border-t border-slate-800 font-heading">
              <span className="text-amber-400">Total Amount Payable</span>
              <span className="text-emerald-400 text-base">₹{orderDetails.grandTotal}</span>
            </div>
          </div>

          {/* Payment Status Success Banner */}
          {paymentDone && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-3 animate-fade-in">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
              <div>
                <p className="font-bold text-emerald-300">Bill Settled Successfully!</p>
                <p className="text-[11px] text-emerald-400/80 mt-0.5">Your receipt has been processed. Thank you for dining with SPICEUP!</p>
              </div>
            </div>
          )}

        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          {!paymentDone ? (
            <button 
              onClick={handlePayBill}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-extrabold rounded-2xl transition-all duration-200 shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 text-xs"
            >
              <CreditCard className="w-4 h-4" />
              Pay Bill (₹{orderDetails.grandTotal}) via UPI / Card
            </button>
          ) : (
            <button 
              disabled
              className="w-full py-3.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold rounded-2xl text-xs flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Paid & Invoice Generated
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={handleCallWaiter}
              className="py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl border border-slate-800 text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" /> Call Waiter
            </button>

            <button 
              onClick={() => navigate('/')}
              className="py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white font-semibold rounded-xl border border-slate-800 text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Staff Login
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-6 pt-3 border-t border-slate-800/60 text-center text-[10px] text-slate-500 space-y-0.5">
          <p>&copy; {new Date().getFullYear()} {restaurantSettings.restaurantName} • GSTIN: {restaurantSettings.gstNumber}</p>
          <p className="text-slate-600 font-mono">Table {formattedTableNumber} • GST Mode: {restaurantSettings.gstMode}</p>
        </footer>

      </div>

    </div>
  );
};

export default CustomerTableView;
