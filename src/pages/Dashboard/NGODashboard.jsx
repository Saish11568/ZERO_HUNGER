import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';

function TRLModal({ order, onClose, onRespond }) {
  if (!order) return null;

  const getTRLColor = (score) => {
    if (score >= 70) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Review Food Alert</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center ${getTRLColor(order.trl)}`}>
            <span className="material-symbols-outlined text-4xl mb-2">health_and_safety</span>
            <div className="text-3xl font-black mb-1">{order.trl}</div>
            <div className="text-xs font-bold uppercase tracking-wider">TRL Viability Score</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
              <span className="text-xs text-slate-500 font-semibold uppercase block mb-1">Food Details</span>
              <span className="font-bold text-slate-900 dark:text-white">{order.food}</span>
              <span className="block text-sm text-slate-600 mt-1">{order.quantity} • {order.type}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
              <span className="text-xs text-slate-500 font-semibold uppercase block mb-1">Source</span>
              <span className="font-bold text-slate-900 dark:text-white">{order.source}</span>
              <span className="block text-sm text-error mt-1 flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[14px]">timer</span>
                Expires in {order.expiresIn}
              </span>
            </div>
          </div>
          
          <div className="bg-surface-container-low p-4 rounded-xl">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">ac_unit</span>
              Storage Conditions
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Maintained below 4°C. Needs immediate refrigeration upon arrival.</p>
          </div>
        </div>
        
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row gap-4">
          <button onClick={() => onRespond('decline')} className="flex-1 bg-white border border-slate-300 text-slate-700 px-4 py-3 rounded-lg font-bold hover:bg-slate-50 transition-colors">
            Decline
          </button>
          
          <a 
            href={`/Tero.html?orderId=${order.id}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-[1.5] bg-purple-100 text-purple-700 border border-purple-200 px-4 py-3 rounded-lg font-bold hover:bg-purple-200 transition-colors flex items-center justify-center gap-2 text-center"
          >
            <span className="material-symbols-outlined text-[18px]">verified</span>
            Verify with Tero
          </a>

          <button onClick={() => onRespond('accept')} className="flex-[1.5] bg-primary text-white px-4 py-3 rounded-lg font-bold hover:bg-primary-container transition-colors shadow-sm flex items-center justify-center gap-2">
            Accept Order
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NGODashboard() {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();
  const seenIdsRef = useRef(new Set());
  const selectedRef = useRef(null);

  useEffect(() => {
    selectedRef.current = selectedOrder;
  }, [selectedOrder]);

  const fetchPendingOrders = async () => {
    try {
      const orders = await api.getOrders();
      const pending = (orders || []).filter(o => o.ngoStatus === 'pending');
      setPendingOrders(pending);
      
      if (pending.length > 0) {
        const newOrders = pending.filter(o => !seenIdsRef.current.has(o.id));
        if (newOrders.length > 0) {
          newOrders.forEach(o => seenIdsRef.current.add(o.id));
          if (!selectedRef.current) {
            setSelectedOrder(newOrders[0]);
          }
        }
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchPendingOrders();
    const interval = setInterval(fetchPendingOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleRespond = async (action) => {
    if (selectedOrder) {
      try {
        await api.updateOrderNGOStatus(selectedOrder.id, action);
        setSelectedOrder(null);
        fetchPendingOrders();
        if (action === 'accept') {
          navigate('/deliveries');
        }
      } catch (err) { console.error(err); }
    }
  };

  return (
    <div className="p-12 max-w-7xl mx-auto w-full">
      {pendingOrders.length > 0 && (
        <div className="mb-10 bg-secondary-container/10 border-l-[6px] border-secondary-container rounded-r-xl p-6 shadow-lg flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 opacity-5">
            <span className="material-symbols-outlined text-[120px]">warning</span>
          </div>
          <div className="flex-1 relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>campaign</span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">New Food Alert — Action Required</h2>
              <span className="bg-error/10 text-error text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ml-4 border border-error/20">
                <span className="material-symbols-outlined text-[14px]">timer</span>
                Respond ASAP
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 flex items-center flex-wrap gap-2">
              <span className="font-bold text-slate-900 dark:text-white">{pendingOrders[0].quantity}</span> of {pendingOrders[0].food} available 
              <span className="flex items-center bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-sm font-medium">
                <span className="material-symbols-outlined text-[16px] mr-1">location_on</span> From {pendingOrders[0].source}
              </span>
              — expires in {pendingOrders[0].expiresIn} — 
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-sm font-bold border ${pendingOrders[0].trl >= 70 ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}`}>
                <span className="material-symbols-outlined text-[16px]">health_and_safety</span> TRL Score: {pendingOrders[0].trl}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3 w-full lg:w-auto relative z-10">
            <button 
              onClick={() => setSelectedOrder(pendingOrders[0])}
              className="flex-1 lg:flex-none bg-primary text-white font-bold px-6 py-3 rounded-lg hover:bg-primary-container transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              View Details
              <span className="material-symbols-outlined text-[18px]">visibility</span>
            </button>
          </div>
        </div>
      )}

      {selectedOrder && (
        <TRLModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
          onRespond={handleRespond} 
        />
      )}

      {/* Row 2: Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Meals Received</h3>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">volunteer_activism</span>
            </div>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-5xl font-bold text-slate-900">890</span>
          </div>
        </div>
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Active Deliveries</h3>
            <div className="w-10 h-10 rounded-full bg-secondary-container/10 flex items-center justify-center text-secondary-container">
              <span className="material-symbols-outlined">local_shipping</span>
            </div>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-5xl font-bold text-slate-900">2</span>
          </div>
        </div>
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Tonight's Forecast</h3>
            <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">insights</span>
            </div>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-5xl font-bold text-slate-900">~45</span>
          </div>
        </div>
      </div>

      {/* Row 3: Recent Activity */}
      <div className="bg-white rounded-[20px] p-8 shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-50 pb-4">Recent NGO Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'Order Accepted', item: '12kg Mixed Veg Curry', time: '2 hours ago', icon: 'check_circle', color: 'text-green-600 bg-green-50' },
            { action: 'Delivery Completed', item: '45 portions Assorted Artisan Breads', time: '5 hours ago', icon: 'local_shipping', color: 'text-blue-600 bg-blue-50' },
            { action: 'Food Alert Declined', item: '2kg Expired Dairy', time: '1 day ago', icon: 'cancel', color: 'text-red-600 bg-red-50' }
          ].map((activity, idx) => (
            <div key={idx} className="flex items-center gap-4 p-4 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.color}`}>
                <span className="material-symbols-outlined text-[20px]">{activity.icon}</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-900">{activity.action}</p>
                <p className="text-sm text-slate-500">{activity.item}</p>
              </div>
              <div className="text-sm font-semibold text-slate-400">
                {activity.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
