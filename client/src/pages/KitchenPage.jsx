import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import KitchenDisplaySystem from '../components/KitchenDisplaySystem';
import { Flame, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';

const KitchenPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/orders`);
      if (res.data?.success) {
        setOrders(res.data.orders);
      }
    } catch (e) {
      console.log('KDS fetch error:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (orderId, targetStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: targetStatus } : o));
    setToastMsg(`Order #${orderId} moved to ${targetStatus}!`);
    setTimeout(() => setToastMsg(''), 3000);

    try {
      await axios.put(`${API_BASE_URL}/api/orders/${orderId}`, { status: targetStatus });
    } catch (e) {}
  };

  return (
    <div className="min-h-screen w-full bg-[#0d1117] text-[#f0f6fc] font-sans p-4 md:p-8 relative overflow-hidden">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white font-semibold px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2 animate-fade-in text-xs border border-emerald-400/30">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="max-w-7xl mx-auto flex items-center justify-between border-b border-[#30363d] pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-md shadow-emerald-950/40">
            <Flame className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-heading text-white flex items-center gap-2">
              Chef Kitchen KDS View
            </h1>
            <p className="text-xs text-[#8b949e]">Dedicated kitchen touchscreen display for line cooks & chefs</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            className="p-2 rounded-lg bg-[#21262d] border border-[#30363d] text-[#8b949e] hover:text-white transition-colors"
            title="Refresh Live Orders"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>

          <button
            onClick={() => navigate('/admin')}
            className="py-2 px-3 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] font-medium rounded-lg border border-[#30363d] text-xs flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to POS Admin
          </button>
        </div>
      </div>

      {/* KDS Main Pipeline */}
      <div className="max-w-7xl mx-auto">
        <KitchenDisplaySystem orders={orders} onStatusChange={handleStatusChange} />
      </div>

    </div>
  );
};

export default KitchenPage;
