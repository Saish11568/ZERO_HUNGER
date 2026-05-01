import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function IncomingDeliveries() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const allOrders = await api.getOrders();
        const filtered = (allOrders || []).filter(o => o.ngoStatus === 'accepted');
        setOrders(filtered);
        if (filtered.length > 0) setSelectedOrder(filtered[0]);
      } catch (err) { console.error(err); }
    };
    load();
  }, []);

  const statuses = [
    'Order Accepted',
    'Food Prepared',
    'Ready for Pickup',
    'Out for Delivery',
    'Delivered'
  ];

  const simulateNextStatus = async () => {
    if (!selectedOrder) return;
    const currentIndex = statuses.indexOf(selectedOrder.status);
    if (currentIndex < statuses.length - 1) {
      try {
        const nextStatus = statuses[currentIndex + 1];
        const updated = await api.updateOrderStatus(selectedOrder.id, nextStatus);
        setSelectedOrder(updated);
        setOrders(orders.map(o => o.id === updated.id ? updated : o));
      } catch (err) { console.error(err); }
    }
  };

  const getStepStatus = (statusIndex, currentStatusIndex) => {
    if (statusIndex < currentStatusIndex) return 'completed';
    if (statusIndex === currentStatusIndex) return 'current';
    return 'pending';
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#FFFBF5] min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Primary Column (Deliveries) */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold text-[#251913]">Live Tracking</h2>
              <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
                <div className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-orange-700">Real-time Monitoring</span>
              </div>
            </div>
            {selectedOrder && selectedOrder.status !== 'Delivered' && (
              <button 
                onClick={simulateNextStatus}
                className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/20 transition-colors"
              >
                Simulate Status Update
              </button>
            )}
          </div>

          {selectedOrder ? (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#f6ded3] relative p-8">
              <h3 className="text-xl font-bold text-[#251913] mb-6">Delivery Progress: {selectedOrder.food}</h3>
              
              {/* Amazon-like Progress Tracker */}
              <div className="relative mb-12 mt-4">
                <div className="absolute top-5 left-8 right-8 h-1 bg-slate-100 rounded-full -z-10"></div>
                
                {/* Active Progress Bar */}
                <div 
                  className="absolute top-5 left-8 h-1 bg-primary rounded-full transition-all duration-500 -z-10"
                  style={{ width: `calc(${statuses.indexOf(selectedOrder.status) / (statuses.length - 1) * 100}% - 4rem)` }}
                ></div>

                <div className="flex justify-between relative">
                  {statuses.map((status, index) => {
                    const currentStatusIndex = statuses.indexOf(selectedOrder.status);
                    const stepState = getStepStatus(index, currentStatusIndex);
                    
                    return (
                      <div key={status} className="flex flex-col items-center gap-3 w-32">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 bg-white
                          ${stepState === 'completed' ? 'border-primary text-primary' : 
                            stepState === 'current' ? 'border-primary bg-primary text-white scale-110 shadow-lg shadow-primary/30' : 
                            'border-slate-200 text-slate-300'}`}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {stepState === 'completed' ? 'check' : 
                             index === 0 ? 'assignment_turned_in' :
                             index === 1 ? 'soup_kitchen' :
                             index === 2 ? 'takeout_dining' :
                             index === 3 ? 'two_wheeler' : 'home'}
                          </span>
                        </div>
                        <div className="text-center">
                          <p className={`text-sm font-bold ${stepState === 'pending' ? 'text-slate-400' : 'text-slate-900'}`}>
                            {status}
                          </p>
                          {stepState !== 'pending' && (
                            <p className="text-xs text-slate-500 mt-1">
                              {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Details Card */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 flex flex-col sm:flex-row gap-6">
                <div className="w-full sm:w-48 h-32 rounded-lg overflow-hidden shrink-0">
                  <img src={selectedOrder.img || 'https://via.placeholder.com/300?text=Food'} alt={selectedOrder.food} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">{selectedOrder.food}</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-green-100 text-green-800 px-2.5 py-1 rounded-full text-xs font-semibold">{selectedOrder.quantity}</span>
                      <span className="bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-full text-xs font-semibold">{selectedOrder.type}</span>
                      <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full text-xs font-semibold">TRL: {selectedOrder.trl}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="material-symbols-outlined text-[18px]">storefront</span>
                    <span>From: {selectedOrder.source}</span>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center border border-slate-100 shadow-sm">
              <span className="material-symbols-outlined text-4xl text-slate-300 mb-3">inbox</span>
              <p className="text-slate-500 font-medium">No active deliveries at the moment.</p>
            </div>
          )}
        </div>

        {/* Secondary Column */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          {/* Active Deliveries List */}
          <div className="bg-white rounded-xl border border-[#f6ded3] shadow-sm p-6">
            <h3 className="text-lg font-bold text-[#251913] mb-4">Active Orders</h3>
            <div className="space-y-3">
              {orders.map(order => (
                <div 
                  key={order.id} 
                  onClick={() => setSelectedOrder(order)}
                  className={`p-4 rounded-lg cursor-pointer border transition-colors ${selectedOrder?.id === order.id ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-primary/30'}`}
                >
                  <p className="font-semibold text-slate-900 text-sm mb-1">{order.food}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">{order.status}</span>
                    <span className="font-medium text-primary">{order.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {selectedOrder?.volunteer && (
            <div className="bg-white rounded-xl border border-[#f6ded3] shadow-sm p-6">
              <h3 className="text-lg font-bold text-[#251913] mb-4">Volunteer Info</h3>
              <div className="flex items-center gap-3 bg-orange-50/50 p-3 rounded-lg">
                <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">{selectedOrder.volunteer.name}</p>
                  <p className="text-xs text-slate-500">{selectedOrder.volunteer.phone}</p>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <a 
                  href={`tel:${selectedOrder.volunteer.phone.replace(/\s/g, '')}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-50 text-green-700 border border-green-200 font-semibold py-2.5 rounded-lg hover:bg-green-100 transition-colors text-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">call</span>
                  Call
                </a>
                <button className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 font-semibold py-2.5 rounded-lg hover:bg-blue-100 transition-colors text-sm">
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  Message
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
