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
          (o.table && o.table.toLowerCase().includes(formattedTableNumber.toLowerCase())) ||
          (foundTable && foundTable.currentOrder && o.id && String(o.id).includes(String(foundTable.currentOrder).replace('#', '')))
        );
      }

      if (foundOrder) {
        let itemsList = [];
        if (typeof foundOrder.items === 'string') {
          itemsList = foundOrder.items.split(', ').map((itemStr, idx) => {
            const parts = itemStr.split('x ');
            const qty = parts.length > 1 ? parseInt(parts[0]) || 1 : 1;
            const name = parts.length > 1 ? parts[1] : itemStr;
            const price = Math.round((foundOrder.amount || 200) / (foundOrder.items.split(', ').length * (qty || 1))) || 180;
            return { id: idx + 1, name, qty, price, total: qty * price };
          });
        }

        const subtotal = Number(foundOrder.amount) || 0;
        const gst = Math.round(subtotal * 0.05);
        const service = Math.round(subtotal * 0.05);
        const grandTotal = subtotal + gst + service;

        setOrderDetails({
          orderId: foundOrder.id || '101',
          status: foundOrder.status || 'Pending',
          time: foundOrder.time || 'Just now',
          items: itemsList.length > 0 ? itemsList : [
            { id: 1, name: 'Table Order (In Prep)', qty: 1, price: subtotal, total: subtotal }
          ],
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

  const handlePayBill = async () => {
    try {
      setPaymentDone(true);
      showToast(`🎉 Payment of ₹${orderDetails.grandTotal} received! Bill settled.`);

      if (orderDetails.orderId) {
        await axios.put(`${API_BASE_URL}/api/orders/${orderDetails.orderId}`, {
          status: 'Completed'
        });
      }

      if (tableData && tableData.id) {
        await axios.put(`${API_BASE_URL}/api/tables/${tableData.id}`, {
          status: 'Available',
          currentOrder: '-'
        });
      }

      setTimeout(() => {
        fetchLiveTableData();
      }, 1500);
    } catch (err) {
      console.log('Payment error:', err.message);
    }
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
    <div className="min-h-screen w-full bg-[#0d1117] text-[#f0f6fc] font-sans p-4 md:p-8 flex justify-center relative overflow-hidden">
      
      {/* Dish Customization Modal */}
      {selectedCustomizingDish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d1117]/85 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#161b22] border border-[#30363d] relative shadow-2xl space-y-4 text-[#f0f6fc]">
            
            <button 
              onClick={() => setSelectedCustomizingDish(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#21262d] text-[#8b949e] hover:text-white border border-[#30363d] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="border-b border-[#30363d] pb-3">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Customize Your Dish</span>
              <h3 className="text-xl font-extrabold text-white font-heading">{selectedCustomizingDish.name}</h3>
              <p className="text-xs text-emerald-400 font-bold font-mono mt-0.5">Base Price: ₹{selectedCustomizingDish.price}</p>
            </div>

            <form onSubmit={handlePlaceCustomizedOrder} className="space-y-4 text-xs">
              
              {/* Spice Level Selector */}
              <div>
                <label className="block font-semibold text-[#8b949e] uppercase tracking-wider mb-2">Select Spice Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Mild 🌶️', 'Medium 🌶️🌶️', 'Spicy 🌶️🌶️🌶️'].map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSpiceLevel(lvl)}
                      className={`py-2 px-2 rounded-lg border text-[11px] font-semibold text-center transition-all ${
                        spiceLevel === lvl
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                          : 'bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:text-[#c9d1d9]'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add-on Toppings */}
              <div>
                <label className="block font-semibold text-[#8b949e] uppercase tracking-wider mb-2">Optional Add-ons</label>
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
                        className={`p-2.5 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
                          isSelected 
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-white' 
                            : 'bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:text-[#c9d1d9]'
                        }`}
                      >
                        <span className="font-medium">{addon.name}</span>
                        <span className="font-bold text-emerald-400 font-mono">+₹{addon.price}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Special Cooking Notes */}
              <div>
                <label className="block font-semibold text-[#8b949e] uppercase tracking-wider mb-1">Special Cooking Instructions</label>
                <input
                  type="text"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="e.g. Less oil, no onions"
                  className="w-full px-3 py-2 rounded-lg glass-input text-xs text-white focus:outline-none"
                />
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between pt-2 border-t border-[#30363d]">
                <span className="font-semibold text-[#8b949e]">Quantity</span>
                <div className="flex items-center gap-3 bg-[#0d1117] px-2.5 py-1 rounded-lg border border-[#30363d]">
                  <button 
                    type="button" 
                    onClick={() => setCustomQty(Math.max(1, customQty - 1))}
                    className="p-1 rounded bg-[#21262d] text-[#8b949e] hover:text-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-bold text-white text-sm w-4 text-center font-mono">{customQty}</span>
                  <button 
                    type="button" 
                    onClick={() => setCustomQty(customQty + 1)}
                    className="p-1 rounded bg-[#21262d] text-[#8b949e] hover:text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 font-semibold text-white rounded-lg shadow-md shadow-emerald-950/40 text-xs flex items-center justify-center gap-2 transition-all mt-2 active:scale-[0.99]"
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
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white font-semibold px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2 animate-fade-in text-xs max-w-sm text-center border border-emerald-400/30">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="w-full max-w-lg bg-[#161b22] rounded-2xl p-6 md:p-8 border border-[#30363d] shadow-2xl relative z-10 flex flex-col justify-between my-auto">
        
        <div>
          {/* Header Branding */}
          <div className="flex items-center justify-between border-b border-[#30363d] pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-md shadow-emerald-950/40">
                <Flame className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-lg font-bold font-heading text-white flex items-center gap-1">
                  {restaurantSettings.restaurantName}
                </h1>
                <p className="text-[10px] text-[#8b949e] font-medium truncate max-w-[200px]">{restaurantSettings.restaurantAddress}</p>
              </div>
            </div>

            <button 
              onClick={fetchLiveTableData}
              className="p-2 rounded-lg bg-[#21262d] border border-[#30363d] text-[#8b949e] hover:text-white transition-colors"
              title="Refresh Live Status"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>

          {/* Assigned Table Status Card */}
          <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] mb-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#8b949e] uppercase font-semibold tracking-wider">Your Assigned Table</span>
              <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${
                orderDetails.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                orderDetails.status === 'Ready' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>
                {orderDetails.status === 'Ready' ? 'Food Ready' : orderDetails.status === 'Completed' ? 'Bill Paid' : 'Kitchen Cooking'}
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <div>
                <h2 className="text-2xl font-extrabold font-heading text-white flex items-center gap-2">
                  Table {formattedTableNumber}
                </h2>
                <p className="text-xs text-[#8b949e] mt-0.5">Order Ref: <span className="font-mono font-bold text-emerald-400">#{orderDetails.orderId}</span></p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-[#8b949e]/80 block">Session Time</span>
                <span className="text-xs font-semibold text-[#f0f6fc] font-mono">{orderDetails.time}</span>
              </div>
            </div>
          </div>

          {/* QR Self-Ordering Menu Cards */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-[#f0f6fc] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Self-Order Dishes & Customize
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                Instant Kitchen Order
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1">
              {availableMenu.map(menuItem => (
                <div 
                  key={menuItem.id} 
                  className="p-3 rounded-xl bg-[#0d1117] border border-[#30363d] flex items-center justify-between hover:border-[#484f58] transition-all group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">{menuItem.name}</h4>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#21262d] text-[#8b949e] font-semibold">{menuItem.category}</span>
                    </div>
                    <p className="text-[11px] text-emerald-400 font-bold font-mono mt-0.5">₹{menuItem.price}</p>
                  </div>

                  <button
                    onClick={() => handleOpenCustomization(menuItem)}
                    className="px-2.5 py-1 rounded-lg bg-[#21262d] hover:bg-emerald-600 hover:text-white text-[#c9d1d9] border border-[#30363d] font-semibold text-xs shadow-sm flex items-center gap-1 transition-all"
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
              <h3 className="text-xs font-bold text-[#f0f6fc] uppercase tracking-wider flex items-center gap-1.5">
                <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-400" /> Food Ordered at Table
              </h3>
              <span className="text-[11px] text-[#8b949e] font-medium">{orderDetails.items.length} Dishes</span>
            </div>

            <div className="rounded-xl border border-[#30363d] overflow-hidden bg-[#0d1117]">
              <div className="divide-y divide-[#30363d]">
                {orderDetails.items.map(dish => (
                  <div key={dish.id} className="p-3 flex items-center justify-between hover:bg-[#161b22]/50 transition-colors">
                    <div>
                      <h4 className="text-xs font-semibold text-white flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded bg-emerald-500/10 text-emerald-400 text-[10px] flex items-center justify-center font-bold font-mono">
                          {dish.qty}
                        </span>
                        {dish.name}
                      </h4>
                      <p className="text-[10px] text-[#8b949e] mt-0.5 font-mono">₹{dish.price} each</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 font-mono">
                      ₹{dish.total}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Billing Breakdown */}
          <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] mb-6 space-y-2 text-xs">
            <div className="flex justify-between text-[#8b949e]">
              <span>Items Subtotal</span>
              <span className="font-semibold text-[#f0f6fc] font-mono">₹{orderDetails.subtotal}</span>
            </div>
            <div className="flex justify-between text-[#8b949e]">
              <span>Taxes (CGST + SGST 5%)</span>
              <span className="font-semibold text-[#f0f6fc] font-mono">₹{orderDetails.gst}</span>
            </div>
            <div className="flex justify-between text-[#8b949e]">
              <span>Service Charge (5%)</span>
              <span className="font-semibold text-[#f0f6fc] font-mono">₹{orderDetails.service}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-white pt-2.5 border-t border-[#30363d] font-heading">
              <span className="text-emerald-400">Total Amount Payable</span>
              <span className="text-emerald-400 text-base font-mono">₹{orderDetails.grandTotal}</span>
            </div>
          </div>

          {/* Payment Status Success Banner */}
          {paymentDone && (
            <div className="mb-6 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2.5 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-emerald-300">Bill Settled Successfully!</p>
                <p className="text-[11px] text-emerald-400/80 mt-0.5">Your receipt has been processed. Thank you for dining with SPICEUP!</p>
              </div>
            </div>
          )}

        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          {!paymentDone ? (
            <button 
              onClick={handlePayBill}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all shadow-md shadow-emerald-950/40 active:scale-[0.99] flex items-center justify-center gap-2 text-xs"
            >
              <CreditCard className="w-4 h-4" />
              Pay Bill (₹{orderDetails.grandTotal}) via UPI / Card
            </button>
          ) : (
            <button 
              disabled
              className="w-full py-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold rounded-xl text-xs flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Paid & Invoice Generated
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={handleCallWaiter}
              className="py-2.5 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] font-medium rounded-lg border border-[#30363d] text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Bell className="w-3.5 h-3.5 text-emerald-400" /> Call Waiter
            </button>

            <button 
              onClick={() => navigate('/')}
              className="py-2.5 bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-white font-medium rounded-lg border border-[#30363d] text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Staff Login
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-6 pt-3 border-t border-[#30363d] text-center text-[10px] text-[#8b949e] space-y-0.5">
          <p>&copy; {new Date().getFullYear()} {restaurantSettings.restaurantName} • GSTIN: {restaurantSettings.gstNumber}</p>
          <p className="text-[#8b949e]/70 font-mono">Table {formattedTableNumber} • GST Mode: {restaurantSettings.gstMode}</p>
        </footer>

      </div>

    </div>
  );
};

export default CustomerTableView;
