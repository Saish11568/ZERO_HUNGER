import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const orders = await api.getOrders();
        setAlerts((orders || []).filter(o => o.ngoStatus === 'pending'));
      } catch (err) { console.error(err); }
    };
    load();
  }, []);

  const handleAccept = async (order) => {
    try {
      await api.updateOrderNGOStatus(order.id, 'accept');
      setAlerts(alerts.filter(a => a.id !== order.id));
      navigate('/deliveries');
    } catch (err) { console.error(err); }
  };

  const handleDecline = async (order) => {
    try {
      await api.updateOrderNGOStatus(order.id, 'decline');
      setAlerts(alerts.filter(a => a.id !== order.id));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="flex-1 p-12 max-w-7xl mx-auto w-full flex flex-col gap-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-[#141b2b] mb-2">Food Alerts</h2>
          <p className="text-[#3e4949]">Manage incoming surplus food notifications for your zone.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-[#141b2b] hover:border-[#0d7377] transition-colors">
            <span className="material-symbols-outlined text-[18px]">tune</span>
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-[#141b2b] hover:border-[#0d7377] transition-colors">
            <span className="material-symbols-outlined text-[18px]">restaurant</span>
            Dietary
          </button>
        </div>
      </div>

      {/* Dynamic Alert Cards from Backend */}
      {alerts.length > 0 ? alerts.map(order => (
        <div key={order.id} className="bg-white rounded-[20px] shadow-lg border-l-4 border-l-[#fea619] p-6 relative overflow-hidden flex flex-col gap-6">
          <div className="absolute top-0 right-0 p-4">
            <span className="bg-[#ffdad6] text-[#93000a] px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">warning</span>
              High Priority
            </span>
          </div>
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center">
              {order.img ? (
                <img alt={order.food} className="w-full h-full object-cover" src={order.img} />
              ) : (
                <span className="material-symbols-outlined text-4xl text-slate-300">restaurant</span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-[#141b2b] mb-1">{order.quantity}: {order.food}</h3>
              <p className="text-[#3e4949] mb-4">{order.source} • Expires in {order.expiresIn}</p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
                  <span className="material-symbols-outlined text-[#005c3e]">verified_user</span>
                  <span className="text-xs font-bold text-[#141b2b]">TRL Score: {order.trl} ({order.trl >= 70 ? 'Safe' : 'Moderate'})</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
                  <span className="material-symbols-outlined text-[#6e7979]">scale</span>
                  <span className="text-xs font-bold text-[#141b2b]">~{order.quantity} Total</span>
                </div>
              </div>
            </div>
            <div className="flex flex-row md:flex-col gap-3 shrink-0 self-center w-full md:w-auto">
              <button 
                onClick={() => handleAccept(order)}
                className="flex-1 md:flex-none bg-[#0d7377] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#00595c] transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">check_circle</span>
                Accept Alert
              </button>
              
              <a 
                href={`/Tero.html?orderId=${order.id}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 md:flex-none bg-purple-100 text-purple-700 border border-purple-200 font-semibold px-6 py-3 rounded-lg hover:bg-purple-200 transition-colors flex items-center justify-center gap-2 text-center"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                Verify with Tero
              </a>

              <button 
                onClick={() => handleDecline(order)}
                className="flex-1 md:flex-none bg-transparent border border-[#0d7377] text-[#0d7377] font-semibold px-6 py-3 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )) : (
        <div className="bg-white rounded-[20px] shadow-lg p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">notifications_off</span>
          <p className="text-slate-500 font-medium text-lg">No pending food alerts at the moment.</p>
          <p className="text-slate-400 text-sm mt-2">New alerts will appear here when donors list surplus food.</p>
        </div>
      )}

      <div className="grid grid-cols-12 gap-8 mt-4">
        {/* Scheduled Pickups */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
          <h3 className="text-xl font-bold text-[#141b2b] mb-2">Scheduled Pickups</h3>
          <div className="bg-white rounded-[20px] shadow-lg p-6 flex items-center justify-between border border-transparent hover:border-slate-100 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-[#00595c]">
                <span className="material-symbols-outlined">local_shipping</span>
              </div>
              <div>
                <h4 className="font-bold text-[#141b2b] mb-1">15 Meals: Mixed Veg Curry</h4>
                <p className="text-sm text-[#3e4949]">Corporate Canteen • Pickup at 14:30</p>
              </div>
            </div>
            <button className="text-[#0d7377] font-semibold hover:underline">View Details</button>
          </div>
          <div className="bg-white rounded-[20px] shadow-lg p-6 flex items-center justify-between border border-transparent hover:border-slate-100 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-[#00595c]">
                <span className="material-symbols-outlined">local_shipping</span>
              </div>
              <div>
                <h4 className="font-bold text-[#141b2b] mb-1">40 Sandwiches: Assorted</h4>
                <p className="text-sm text-[#3e4949]">Cafe Coffee Day • Pickup at 16:00</p>
              </div>
            </div>
            <button className="text-[#0d7377] font-semibold hover:underline">View Details</button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
          <h3 className="text-xl font-bold text-[#141b2b] mb-2">Recent Activity</h3>
          <div className="bg-white rounded-[20px] shadow-lg p-6">
            <div className="flex flex-col gap-6">
              <div className="flex gap-3 items-start">
                <span className="material-symbols-outlined text-[#6e7979] mt-0.5">check_circle</span>
                <div>
                  <p className="text-sm text-[#141b2b] font-medium">Accepted 10 Meals from ITC Windsor.</p>
                  <p className="text-xs text-[#3e4949] mt-1">2 hours ago</p>
                </div>
              </div>
              <div className="h-[1px] w-full bg-slate-100"></div>
              <div className="flex gap-3 items-start">
                <span className="material-symbols-outlined text-[#6e7979] mt-0.5">cancel</span>
                <div>
                  <p className="text-sm text-[#141b2b] font-medium">Declined 5 Meals (Distance too far).</p>
                  <p className="text-xs text-[#3e4949] mt-1">Yesterday</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
