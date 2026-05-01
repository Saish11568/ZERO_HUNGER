import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:5000/api';

export default function AnimalFeeding() {
  const [fallbackFood, setFallbackFood] = useState([]);
  const [locations, setLocations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [stats, setStats] = useState({ totalFed: 0, totalAnimals: 0, activeVolunteers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [foodRes, locRes, volRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/animal-feeding/fallback`).then(r => r.json()),
        fetch(`${API_BASE}/animal-feeding/locations`).then(r => r.json()),
        fetch(`${API_BASE}/volunteers`).then(r => r.json()),
        fetch(`${API_BASE}/animal-feeding/stats`).then(r => r.json())
      ]);
      setFallbackFood(foodRes);
      setLocations(locRes);
      setVolunteers(volRes.filter(v => v.status === 'Available'));
      setStats(statsRes);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching animal feeding data:", err);
      setLoading(false);
    }
  };

  const handleAssign = async (orderId, locationId) => {
    const volunteerId = volunteers[0]?.id; // Auto-assign first available
    if (!volunteerId) {
      alert("No available volunteers nearby!");
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/animal-feeding/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, locationId, volunteerId })
      });
      if (response.ok) {
        fetchData();
        alert("Volunteer assigned successfully!");
      } else {
        alert("Assignment failed!");
      }
    } catch (err) {
      console.error("Assignment failed:", err);
    }
  };

  const isSuitable = (item) => {
    if (item.isSpicy || item.isOily) return false;
    return true;
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading module...</div>;

  return (
    <div className="p-8 space-y-8 bg-[#F8F6F0] min-h-screen font-['Inter']">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <span className="material-symbols-outlined text-4xl text-primary">pets</span>
            Animal Feeding Dashboard
          </h1>
          <p className="text-slate-500 mt-1">Structured fallback system for food redistribution.</p>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Fed</p>
            <p className="text-2xl font-black text-primary">{stats.totalFed}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Animals Fed</p>
            <p className="text-2xl font-black text-orange-500">{stats.totalAnimals}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Volunteers</p>
            <p className="text-2xl font-black text-teal-600">{stats.activeVolunteers}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Fallback Food */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="material-symbols-outlined">pending_actions</span>
            Pending Fallback Food
          </h2>
          
          <div className="space-y-4">
            {fallbackFood.length === 0 ? (
              <div className="bg-white/50 border-2 border-dashed border-slate-200 p-12 rounded-3xl text-center">
                <p className="text-slate-400 font-medium">No fallback food items currently available.</p>
              </div>
            ) : (
              fallbackFood.map(item => (
                <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-slate-900">{item.food}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter ${item.status === 'Expired' ? 'bg-error-container text-error' : 'bg-orange-100 text-orange-700'}`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">restaurant</span> {item.source} • {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-error flex items-center justify-end gap-1">
                        <span className="material-symbols-outlined text-sm">timer</span> 
                        {item.expiresIn}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 uppercase font-bold tracking-widest">Expires Soon</p>
                    </div>
                  </div>

                  {/* Suitability Warning */}
                  {!isSuitable(item) && (
                    <div className="mb-4 flex items-center gap-2 bg-error-container/30 text-error p-3 rounded-xl border border-error/10 text-xs font-medium">
                      <span className="material-symbols-outlined text-sm">warning</span>
                      Note: This food may be spicy/oily. Prefer feeding cows or mix with plain rice.
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-slate-400">info</span>
                      <span className="text-xs text-slate-500 font-medium">Auto-moved to fallback queue</span>
                    </div>
                    <div className="flex gap-2">
                      <select 
                        className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 font-medium"
                        id={`loc-select-${item.id}`}
                      >
                        <option value="">Select Feeding Zone</option>
                        {locations.map(loc => (
                          <option key={loc.id} value={loc.id}>{loc.name} ({loc.distance})</option>
                        ))}
                      </select>
                      <button 
                        onClick={() => {
                          const locId = document.getElementById(`loc-select-${item.id}`).value;
                          if (!locId) return alert("Select a location first");
                          handleAssign(item.id, locId);
                        }}
                        className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-primary-variant transition-colors"
                      >
                        Assign Nearest Volunteer
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar: Locations & Analytics */}
        <div className="space-y-8">
          {/* Feeding Locations */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">location_on</span>
              Feeding Zones
            </h3>
            <div className="space-y-4">
              {locations.map(loc => (
                <div key={loc.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-teal-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-800 text-sm">{loc.name}</h4>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-slate-200 font-bold text-slate-500">{loc.distance}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-slate-400">pets</span>
                        <span className="text-xs text-slate-500 font-medium">{loc.animals} animals</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-slate-400">category</span>
                        <span className="text-xs text-slate-500 font-medium">{loc.type}</span>
                      </div>
                    </div>
                    <button className="text-[10px] font-black text-primary hover:underline">VIEW MAP</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Feed */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 relative z-10">
              <span className="material-symbols-outlined text-primary">analytics</span>
              Live Feed
            </h3>
            <div className="space-y-4 relative z-10">
              <div className="flex gap-3 text-xs border-l-2 border-primary/30 pl-4 py-1">
                <div className="w-2 h-2 bg-primary rounded-full mt-1 shrink-0 animate-pulse"></div>
                <div>
                  <p className="font-bold">Rahul S. picked up Rice & Sambar</p>
                  <p className="text-slate-400 mt-0.5">2 mins ago • En route to Cubbon Park</p>
                </div>
              </div>
              <div className="flex gap-3 text-xs border-l-2 border-slate-700 pl-4 py-1">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1 shrink-0"></div>
                <div>
                  <p className="font-bold">Feeding Completed at Lalbagh</p>
                  <p className="text-slate-400 mt-0.5">15 mins ago • 12 animals fed</p>
                </div>
              </div>
            </div>
            <button className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all border border-white/5">
              View All History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
