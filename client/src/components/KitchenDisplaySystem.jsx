import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Flame, 
  Clock, 
  CheckCircle2, 
  ChefHat, 
  UtensilsCrossed, 
  Bell, 
  RefreshCw, 
  AlertCircle, 
  ArrowRight, 
  Check, 
  Sparkles,
  Sliders
} from 'lucide-react';

const KitchenDisplaySystem = ({ orders = [], onStatusChange }) => {
  const [localOrders, setLocalOrders] = useState(orders);

  useEffect(() => {
    setLocalOrders(orders);
  }, [orders]);

  const handleAdvanceStatus = (orderId, currentStatus) => {
    let nextStatus = 'Preparing';
    if (currentStatus === 'Pending') nextStatus = 'Preparing';
    else if (currentStatus === 'Preparing') nextStatus = 'Ready';
    else if (currentStatus === 'Ready') nextStatus = 'Completed';

    setLocalOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
    if (onStatusChange) {
      onStatusChange(orderId, nextStatus);
    }
  };

  const pendingOrders = localOrders.filter(o => o.status === 'Pending' || !o.status);
  const preparingOrders = localOrders.filter(o => o.status === 'Preparing');
  const readyOrders = localOrders.filter(o => o.status === 'Ready');
  const completedOrders = localOrders.filter(o => o.status === 'Completed');

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#161b22] border border-[#30363d] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
              Kitchen Display System (KDS)
            </h2>
            <p className="text-xs text-[#8b949e]">Live order ticket pipeline & kitchen line cook workflow</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-xs flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {pendingOrders.length + preparingOrders.length} Active Tickets
          </span>
        </div>
      </div>

      {/* KDS 4-Column Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        
        {/* Column 1: Pending Orders */}
        <div className="flex flex-col rounded-xl bg-[#161b22] border border-[#30363d] overflow-hidden">
          <div className="p-3.5 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" /> Pending ({pendingOrders.length})
            </h3>
            <span className="w-2 h-2 rounded-full bg-amber-400" />
          </div>

          <div className="p-3 space-y-3 flex-1 max-h-[600px] overflow-y-auto bg-[#0d1117]/50">
            {pendingOrders.length === 0 ? (
              <div className="p-8 text-center text-[#8b949e] text-xs font-medium">
                No pending tickets
              </div>
            ) : (
              pendingOrders.map(ticket => (
                <div 
                  key={ticket.id}
                  className="p-3.5 rounded-xl bg-[#161b22] border border-amber-500/30 hover:border-amber-500/60 transition-all shadow-sm space-y-2.5"
                >
                  <div className="flex items-center justify-between border-b border-[#30363d] pb-2">
                    <span className="font-mono font-bold text-amber-400 text-xs">#{ticket.id}</span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-semibold text-[11px] border border-amber-500/20">
                      {ticket.table}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-white leading-relaxed">{ticket.items}</h4>
                    {ticket.customizations && (
                      <p className="text-[11px] text-amber-300/90 font-medium mt-1.5 p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        {ticket.customizations}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1.5 border-t border-[#30363d] text-[11px] text-[#8b949e]">
                    <span className="flex items-center gap-1 font-mono"><Clock className="w-3 h-3 text-amber-400" /> {ticket.time || 'Just now'}</span>
                    <span className="text-emerald-400 font-bold font-mono">₹{ticket.amount}</span>
                  </div>

                  <button 
                    onClick={() => handleAdvanceStatus(ticket.id, 'Pending')}
                    className="w-full py-2 bg-[#21262d] hover:bg-amber-500 hover:text-slate-950 text-amber-400 border border-amber-500/30 font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
                  >
                    <span>Start Cooking</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: Preparing Orders */}
        <div className="flex flex-col rounded-xl bg-[#161b22] border border-[#30363d] overflow-hidden">
          <div className="p-3.5 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between">
            <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
              <Flame className="w-4 h-4 text-sky-400" /> Preparing ({preparingOrders.length})
            </h3>
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          </div>

          <div className="p-3 space-y-3 flex-1 max-h-[600px] overflow-y-auto bg-[#0d1117]/50">
            {preparingOrders.length === 0 ? (
              <div className="p-8 text-center text-[#8b949e] text-xs font-medium">
                No orders in preparation
              </div>
            ) : (
              preparingOrders.map(ticket => (
                <div 
                  key={ticket.id}
                  className="p-3.5 rounded-xl bg-[#161b22] border border-sky-500/30 hover:border-sky-500/60 transition-all shadow-sm space-y-2.5"
                >
                  <div className="flex items-center justify-between border-b border-[#30363d] pb-2">
                    <span className="font-mono font-bold text-sky-400 text-xs">#{ticket.id}</span>
                    <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 font-semibold text-[11px] border border-sky-500/20">
                      {ticket.table}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-white leading-relaxed">{ticket.items}</h4>
                  </div>

                  <div className="flex items-center justify-between pt-1.5 border-t border-[#30363d] text-[11px] text-[#8b949e]">
                    <span className="flex items-center gap-1 font-mono"><Clock className="w-3 h-3 text-sky-400" /> {ticket.time || 'In prep'}</span>
                    <span className="text-emerald-400 font-bold font-mono">₹{ticket.amount}</span>
                  </div>

                  <button 
                    onClick={() => handleAdvanceStatus(ticket.id, 'Preparing')}
                    className="w-full py-2 bg-[#21262d] hover:bg-sky-500 hover:text-slate-950 text-sky-400 border border-sky-500/30 font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
                  >
                    <span>Mark as Ready</span>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: Ready Orders */}
        <div className="flex flex-col rounded-xl bg-[#161b22] border border-[#30363d] overflow-hidden">
          <div className="p-3.5 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Ready to Serve ({readyOrders.length})
            </h3>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>

          <div className="p-3 space-y-3 flex-1 max-h-[600px] overflow-y-auto bg-[#0d1117]/50">
            {readyOrders.length === 0 ? (
              <div className="p-8 text-center text-[#8b949e] text-xs font-medium">
                No orders waiting for server
              </div>
            ) : (
              readyOrders.map(ticket => (
                <div 
                  key={ticket.id}
                  className="p-3.5 rounded-xl bg-[#161b22] border border-emerald-500/30 hover:border-emerald-500/60 transition-all shadow-sm space-y-2.5"
                >
                  <div className="flex items-center justify-between border-b border-[#30363d] pb-2">
                    <span className="font-mono font-bold text-emerald-400 text-xs">#{ticket.id}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-semibold text-[11px] border border-emerald-500/20">
                      {ticket.table}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-white leading-relaxed">{ticket.items}</h4>
                  </div>

                  <div className="flex items-center justify-between pt-1.5 border-t border-[#30363d] text-[11px] text-[#8b949e]">
                    <span className="flex items-center gap-1 font-mono"><Clock className="w-3 h-3 text-emerald-400" /> {ticket.time || 'Ready'}</span>
                    <span className="text-emerald-400 font-bold font-mono">₹{ticket.amount}</span>
                  </div>

                  <button 
                    onClick={() => handleAdvanceStatus(ticket.id, 'Ready')}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
                  >
                    <span>Complete / Served</span>
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 4: Completed Orders */}
        <div className="flex flex-col rounded-xl bg-[#161b22] border border-[#30363d] overflow-hidden">
          <div className="p-3.5 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#8b949e] uppercase tracking-wider flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-[#8b949e]" /> Completed ({completedOrders.length})
            </h3>
          </div>

          <div className="p-3 space-y-2.5 flex-1 max-h-[600px] overflow-y-auto bg-[#0d1117]/50">
            {completedOrders.length === 0 ? (
              <div className="p-8 text-center text-[#8b949e] text-xs font-medium">
                No completed orders yet
              </div>
            ) : (
              completedOrders.map(ticket => (
                <div 
                  key={ticket.id}
                  className="p-3 rounded-lg bg-[#161b22] border border-[#30363d] opacity-60 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-[#8b949e] text-xs">#{ticket.id}</span>
                    <span className="text-[10px] text-[#8b949e] font-mono">{ticket.table}</span>
                  </div>
                  <p className="text-xs text-[#c9d1d9] line-clamp-1">{ticket.items}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default KitchenDisplaySystem;
