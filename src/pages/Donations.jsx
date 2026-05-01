import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../services/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Donations() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const allOrders = await api.getOrders();
        // If we have a specific user/source, filter here. 
        // For now, we show all since it's a demo.
        setDonations(allOrders || []);
      } catch (err) { console.error(err); }
    };
    load();
  }, []);

  return (
    <div className="p-12 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#0d7377]/10 flex items-center justify-center text-[#0d7377]">
            <span className="material-symbols-outlined text-[24px]">volunteer_activism</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">My Donations</h2>
            <p className="text-slate-500">Track your past and active food surplus listings</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/list-food')}
          className="bg-[#fea619] text-white font-bold px-6 py-3 rounded-lg shadow-md hover:bg-[#D97706] transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          List New Surplus
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Meals Rescued</h3>
          <p className="text-4xl font-black text-slate-900 dark:text-white">
            {donations.reduce((sum, d) => sum + (parseInt(d.quantity) || 10), 0)}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Active Listings</h3>
          <p className="text-4xl font-black text-slate-900 dark:text-white">{donations.filter(d => d.status !== 'Delivered').length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">CO2 Saved (kg)</h3>
          <p className="text-4xl font-black text-slate-900 dark:text-white">
            {donations.reduce((sum, d) => sum + Math.round((parseInt(d.quantity) || 10) * 0.4), 0)}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Donation History</h3>
        </div>
        {donations.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No donations found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Food Item</th>
                  <th className="py-4 px-6">Quantity</th>
                  <th className="py-4 px-6 text-center">TRL Score</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Date</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-800">
                {donations.map(donation => (
                  <tr key={donation.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white">{donation.food}</td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-400">{donation.quantity} • {donation.type}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-block px-2 py-1 rounded font-bold text-xs ${donation.trl >= 70 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {donation.trl}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        donation.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                        donation.status === 'Declined' ? 'bg-red-100 text-red-800' : 
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {donation.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-xs">
                      {new Date(donation.timestamp).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
