import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../services/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function DonorDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({ food: '', quantity: '', type: 'Cooked Meals' });

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await api.getOrders();
        setOrders(data || []);
      } catch (err) { console.error(err); }
    };
    loadOrders();
  }, []);

  const navigate = useNavigate();
  const handleListSurplus = async () => {
    if (!formData.food || !formData.quantity) return;
    try {
      const newOrder = await api.addOrder({
        food: formData.food,
        quantity: formData.quantity,
        type: formData.type,
        source: user?.name || 'Anonymous Donor'
      });
      setOrders([newOrder, ...orders]);
      setFormData({ food: '', quantity: '', type: 'Cooked Meals' });
      navigate('/donations');
    } catch (err) { console.error(err); }
  };
  return (
    <div className="p-12 max-w-7xl mx-auto w-full">
      {/* Greeting */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#141b2b] mb-2">Good afternoon, Meghana's Kitchen 🙏</h1>
        <p className="text-[#3e4949] font-medium">Here is your impact and current activity summary.</p>
      </div>

      {/* Row 1: Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <div className="bg-white rounded-[20px] p-6 shadow-lg border border-slate-100 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-[#0d7377] bg-teal-50 p-2 rounded-lg">local_dining</span>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-[#0d7377]">142</h2>
            <p className="text-[10px] font-bold text-[#3e4949] uppercase tracking-wider mt-1">Meals Donated</p>
          </div>
        </div>
        <div className="bg-white rounded-[20px] p-6 shadow-lg border border-slate-100 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-[#fea619] bg-amber-50 p-2 rounded-lg">recycling</span>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-[#fea619]">38kg</h2>
            <p className="text-[10px] font-bold text-[#3e4949] uppercase tracking-wider mt-1">Waste Prevented</p>
          </div>
        </div>
        <div className="bg-white rounded-[20px] p-6 shadow-lg border border-slate-100 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-[#007751] bg-[#007751]/10 p-2 rounded-lg">group</span>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-[#007751]">312</h2>
            <p className="text-[10px] font-bold text-[#3e4949] uppercase tracking-wider mt-1">People Fed</p>
          </div>
        </div>
        <div className="bg-white rounded-[20px] p-6 shadow-lg border-l-4 border-l-[#ba1a1a] border border-slate-100 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-[#ba1a1a] bg-[#ba1a1a]/10 p-2 rounded-lg">warning</span>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-[#ba1a1a]">2</h2>
            <p className="text-[10px] font-bold text-[#3e4949] uppercase tracking-wider mt-1">Urgent Pickups</p>
          </div>
        </div>
      </div>

      {/* Row 2: TRL Hero & Quick List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* TRL Monitor */}
        <div className="lg:col-span-7 bg-white rounded-[20px] shadow-lg border border-slate-100 border-t-4 border-t-[#0d7377] p-8">
          <h3 className="text-xl font-bold text-[#141b2b] mb-8 border-b border-slate-50 pb-4">Active Donation — TRL Monitor</h3>
          <div className="flex flex-col sm:flex-row gap-10 items-center">
            {/* Left: TRL Ring */}
            <div className="flex flex-col items-center gap-4 border-r border-slate-50 pr-10">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle className="text-slate-100" cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="3" />
                  <circle className="text-[#fea619]" cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="64, 100" />
                </svg>
                <div className="flex flex-col items-center z-10">
                  <span className="text-4xl font-bold text-[#fea619]">64</span>
                  <span className="text-[10px] font-bold text-[#3e4949] uppercase">TRL</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-[#141b2b]">Dal Makhani + Rice</p>
                <p className="text-xs text-[#3e4949] font-medium">28 meals</p>
              </div>
            </div>
            
            {/* Center: Details */}
            <div className="flex-1 flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-slate-400">location_on</span>
                <span className="text-sm font-bold text-[#141b2b]">Koramangala</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#ba1a1a]">timer</span>
                <span className="text-sm font-bold text-[#ba1a1a]">1hr 42min exp</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-slate-400">thermostat</span>
                <span className="text-sm font-bold text-[#141b2b]">34°C</span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-col gap-4 min-w-[180px]">
              <div className="bg-slate-50 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 border border-slate-100">
                <span className="w-2 h-2 rounded-full bg-[#fea619] animate-pulse"></span>
                <span className="text-xs font-bold text-[#141b2b]">Awaiting Volunteer</span>
              </div>
              <button className="w-full py-2.5 rounded-lg border border-[#ba1a1a] text-[#ba1a1a] text-xs font-bold hover:bg-[#ba1a1a]/5 transition-colors">
                Escalate Urgency
              </button>
              <button className="w-full py-2.5 rounded-lg border border-[#0d7377] text-[#0d7377] text-xs font-bold hover:bg-teal-50 transition-colors">
                Edit Listing
              </button>
            </div>
          </div>
        </div>

        {/* Quick List */}
        <div className="lg:col-span-5 bg-white rounded-[20px] shadow-lg border border-slate-100 border-l-4 border-l-[#fea619] p-8">
          <h3 className="text-xl font-bold text-[#141b2b] mb-6 border-b border-slate-50 pb-4">List New Surplus</h3>
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-bold text-[#3e4949] uppercase tracking-wider block mb-2">Food Name</label>
              <input 
                value={formData.food}
                onChange={(e) => setFormData({...formData, food: e.target.value})}
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0d7377] transition-all"
                placeholder="e.g. Mixed Vegetable Curry" 
                type="text" 
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-[10px] font-bold text-[#3e4949] uppercase tracking-wider block mb-2">Quantity</label>
                <input 
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0d7377] transition-all"
                  placeholder="Meals/Kg" 
                  type="text" 
                />
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-bold text-[#3e4949] uppercase tracking-wider block mb-2">Category</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0d7377] transition-all appearance-none bg-white"
                >
                  <option>Cooked Meals</option>
                  <option>Raw Produce</option>
                  <option>Packaged</option>
                </select>
              </div>
            </div>
            <button 
              onClick={handleListSurplus}
              className="w-full bg-[#fea619] text-white font-bold py-4 rounded-lg shadow-md hover:bg-[#D97706] transition-all"
            >
              Calculate TRL + List
            </button>
          </div>
        </div>
      </div>

      {/* Recent Donations */}
      <div className="bg-white rounded-[20px] shadow-lg border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <h3 className="text-xl font-bold text-[#141b2b]">Recent Donations</h3>
          <button className="text-[#0d7377] text-sm font-bold hover:underline flex items-center gap-1">
            View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-[#3e4949] uppercase tracking-wider border-b border-slate-100">
                <th className="py-4 px-8">Date</th>
                <th className="py-4 px-8">Item</th>
                <th className="py-4 px-8">Qty</th>
                <th className="py-4 px-8 text-center">TRL</th>
                <th className="py-4 px-8">Status</th>
                <th className="py-4 px-8">Volunteer</th>
              </tr>
            </thead>
            <tbody className="text-sm text-[#141b2b] divide-y divide-slate-50">
              {orders.slice(0, 5).map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-8 text-[#3e4949] font-medium">{new Date(row.timestamp).toLocaleDateString()}</td>
                  <td className="py-4 px-8 font-bold">{row.food}</td>
                  <td className="py-4 px-8 font-medium">{row.quantity}</td>
                  <td className="py-4 px-8 text-center font-bold text-[#fea619]">{row.trl}</td>
                  <td className="py-4 px-8">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold ${row.status === 'Delivered' ? 'bg-[#007751]/10 text-[#007751] border border-[#007751]/20' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-4 px-8 text-[#3e4949] font-bold flex items-center gap-2">
                    {row.volunteer ? (
                      <>
                        <div className="w-6 h-6 rounded-full bg-teal-50 flex items-center justify-center text-[10px] text-[#0d7377]">{row.volunteer.name.split(' ').map(n=>n[0]).join('')}</div>
                        {row.volunteer.name}
                      </>
                    ) : (
                      <span className="text-slate-400 italic font-medium">Pending...</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
