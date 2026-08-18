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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 ring-2 ring-amber-400/30">
            <ChefHat className="w-7 h-7 text-slate-950" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-heading text-white flex items-center gap-2">
              Kitchen Display System (KDS)
            </h2>
            <p className="text-xs text-slate-400">Live order ticket pipeline & kitchen line cook workflow</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-xs flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            {pendingOrders.length + preparingOrders.length} Active Tickets
          </span>
        </div>
      </div>

      {/* KDS 4-Column Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        
        {/* Column 1: Pending Orders */}
        <div className="flex flex-col rounded-2xl bg-slate-900/80 border border-slate-800/80 overflow-hidden">
          <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" /> Pending ({pendingOrders.length})
            </h3>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          </div>

          <div className="p-3 space-y-3 flex-1 max-h-[600px] overflow-y-auto">
            {pendingOrders.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs font-medium">
                No pending tickets waiting
              </div>
            ) : (
              pendingOrders.map(ticket => (
                <div 
                  key={ticket.id}
                  className="p-4 rounded-2xl bg-slate-950/90 border border-amber-500/30 hover:border-amber-500 transition-all shadow-lg space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-mono font-bold text-amber-400 text-sm">#{ticket.id}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[11px]">
                      {ticket.table}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white leading-relaxed">{ticket.items}</h4>
                    {ticket.customizations && (
                      <p className="text-[11px] text-amber-400/90 font-medium mt-1.5 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        {ticket.customizations}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-amber-400" /> {ticket.time || 'Just now'}</span>
                    <span className="text-emerald-400 font-bold">₹{ticket.amount}</span>
                  </div>

                  <button 
                    onClick={() => handleAdvanceStatus(ticket.id, 'Pending')}
                    className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
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
        <div className="flex flex-col rounded-2xl bg-slate-900/80 border border-slate-800/80 overflow-hidden">
          <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" /> Preparing ({preparingOrders.length})
            </h3>
            <span className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-pulse" />
          </div>

          <div className="p-3 space-y-3 flex-1 max-h-[600px] overflow-y-auto">
            {preparingOrders.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs font-medium">
                No orders cooking right now
              </div>
            ) : (
              preparingOrders.map(ticket => (
                <div 
                  key={ticket.id}
                  className="p-4 rounded-2xl bg-slate-950/90 border border-orange-500/30 hover:border-orange-500 transition-all shadow-lg space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-mono font-bold text-orange-400 text-sm">#{ticket.id}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-bold text-[11px]">
                      {ticket.table}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white leading-relaxed">{ticket.items}</h4>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-orange-400" /> {ticket.time || 'In prep'}</span>
                    <span className="text-emerald-400 font-bold">₹{ticket.amount}</span>
                  </div>

                  <button 
                    onClick={() => handleAdvanceStatus(ticket.id, 'Preparing')}
                    className="w-full py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
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
        <div className="flex flex-col rounded-2xl bg-slate-900/80 border border-slate-800/80 overflow-hidden">
          <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Ready to Serve ({readyOrders.length})
            </h3>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>

          <div className="p-3 space-y-3 flex-1 max-h-[600px] overflow-y-auto">
            {readyOrders.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs font-medium">
                No orders waiting for pickup
              </div>
            ) : (
              readyOrders.map(ticket => (
                <div 
                  key={ticket.id}
                  className="p-4 rounded-2xl bg-slate-950/90 border border-emerald-500/30 hover:border-emerald-500 transition-all shadow-lg space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-mono font-bold text-emerald-400 text-sm">#{ticket.id}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[11px]">
                      {ticket.table}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white leading-relaxed">{ticket.items}</h4>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-emerald-400" /> {ticket.time || 'Ready'}</span>
                    <span className="text-emerald-400 font-bold">₹{ticket.amount}</span>
                  </div>

                  <button 
                    onClick={() => handleAdvanceStatus(ticket.id, 'Ready')}
                    className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
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
        <div className="flex flex-col rounded-2xl bg-slate-900/80 border border-slate-800/80 overflow-hidden">
          <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-slate-400" /> Completed ({completedOrders.length})
            </h3>
          </div>

          <div className="p-3 space-y-3 flex-1 max-h-[600px] overflow-y-auto">
            {completedOrders.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs font-medium">
                No completed orders yet
              </div>
            ) : (
              completedOrders.map(ticket => (
                <div 
                  key={ticket.id}
                  className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/60 opacity-60 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-400 text-xs">#{ticket.id}</span>
                    <span className="text-[10px] text-slate-400">{ticket.table}</span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-1">{ticket.items}</p>
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
