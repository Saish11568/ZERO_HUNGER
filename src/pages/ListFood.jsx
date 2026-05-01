import React, { useState } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

const categories = [
  { name: 'Grains', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArQm8R3vkhJNXZE1YGOEY_Ic_w5hUnOOwLTHqhFGkc_UWj5EE2uk5eMt1BInAMg6014Q5MHSPuqjqoPHE5B6iDOrkNYW-C-watF073_ryAX-8leK_PSA4r5aHf-lN_v5zwvoaSQNpaI9X0TjYfCQcoiA6oAGxNMpafbpDfIBnusjL5si-dz6ZjwHI2SiQCHbu-lF8xhpLmiDYbNW9BzFdOQkENiv2xDzBaJYpLJRyRRLoWLIeLdKTfZawsBdrURNAX-LpMQMS-RHFr' },
  { name: 'Curries', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjtbNufblmMG7nEBrGEppuOA13jrnAwHSmfWw1sF6BB2UbjvMHsZcwhAckonMhCuk9i7HkqYy_bvKszvbaC6euMh0OdBilFosfOIUZpYLrO8rUZEJBe0Zl9F-wU-KFTKF748-0HtoHFZWhX-AQcsAQWDQn5dc6P0Gv7MpBfVJiQ4P1JXtGiUXYag4LayJfnd8Wrst9H3f5ZIQEJLkPaLVjuARO7CH9BauEmy8klcUhh8QaSm2L8Gvps2S-QLnqcC-w_lNbYXvCc8aC' },
  { name: 'Breads', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcHt3WmblLWAJ0k9i9WNoaxRabMxis7GyDFxQCFHU3niIHpx4FohkkJ235pxg8qUVM1G8GHbmlLTt0O1kEeo1gQ2RswT7lFc9JQMn4RhaZfI1y79ILNZ5ahhbGUd2ZjbZSJWiX-l3JAkkzsa6qnlEwEuPY79eZIjwjgcacvQiLptUbikoPtiifR_1sB_2sfJDgFBlHL8HeDrFhmQaQ3Q-DmFlf0dDx6fwo6iNGsd9E4_eO5MySC_mQFc7poW2wF0a5NWMQtNwjjTbT' },
  { name: 'Salads', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkeYJ0zouM1V_Il15d0r6DZg4fv1R_r-ffcdmUS8BgW6ohbEkeat5BxCPVZFoRfO9ggtT8fCMc7SdT0Gd4EYpjUbzsWINKIf5VrvdhLt__3Y5wijxX9xOErWcuOoj3btHP640CGx-hFROkHnbiUD8Is_KUmU-hFfkhbbx3KLgAXNFyWVHFrAx3YeUl9PZVMxWx2DpvwCrXt6zNC0tu_PU0pWLba1qHD_DuSz836DFO3R3bJw3PwuVujhcrvni3aoUMAp6ef3bt5cg0' },
  { name: 'Desserts', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpN6m0X3XBIh3tZPnLnEt_n4Qna1jLS5niDb4O3FcpJlJWNPchrNqSsqBEmQq9jEwI8i1hpEDKJtilTrHz5fq1q2mwlDWV6fmBtYfXwmWBJMxJE6gOdRislrGhDLmR3Vn0DSrfWd0j2cCDmObQRPGkqxqhgJIq0b6Ujnzi4bCC1fyHddF2aXGzDQlc9FxKkSgHdADNwb-qXCSXm1mTMz8_qvFpxAJcqktnc7zXQqvRmxdmHb4kXNrI-JwuC_QjghvLr94vNeFhL2Ex' },
];

export default function ListFood() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Breads');
  const [foodName, setFoodName] = useState('Assorted Artisan Breads');
  const [portions, setPortions] = useState(45);
  const [weight, setWeight] = useState(12.5);
  const [condition, setCondition] = useState('Ambient');

  const handleListDonation = async () => {
    try {
      await api.addOrder({
        food: foodName,
        quantity: `${portions} Portions`,
        type: selectedCategory,
        source: 'Local Donor',
      });
      navigate('/donations');
    } catch (err) { console.error(err); }
  };

  return (
    <div className="flex-1 p-12 max-w-7xl mx-auto w-full">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-[#141b2b]">List Surplus Food</h2>
        <p className="text-[#3e4949] mt-2">Quickly categorize and detail the surplus food you have available for donation.</p>
      </div>

      {/* Quick Select Bar */}
      <div className="mb-10">
        <h3 className="text-xs font-semibold text-[#3e4949] uppercase tracking-wider mb-4">Quick Select Category</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((cat) => (
            <button 
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden relative group cursor-pointer border-2 transition-all ${
                selectedCategory === cat.name ? 'border-[#0d7377]' : 'border-transparent hover:border-[#0d7377]'
              }`}
            >
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
                <span className="text-white text-sm font-semibold flex items-center gap-1">
                  {selectedCategory === cat.name && <span className="material-symbols-outlined text-[14px]">check_circle</span>}
                  {cat.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Central Form */}
        <div className="flex-1 w-full">
          <div className="bg-white rounded-[20px] shadow-lg p-8 border-l-4 border-[#fea619] border border-slate-100">
            <div className="mb-8">
              <label className="block text-xs font-bold text-[#3e4949] uppercase mb-2">What are you donating today?</label>
              <input 
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-[#0d7377] transition-all"
                placeholder="e.g., 50 boxes of vegetable biryani" 
                type="text" 
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-xs font-bold text-[#3e4949] uppercase mb-2">Quantity (Portions)</label>
                <input 
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#0d7377] transition-all"
                  type="number" 
                  value={portions}
                  onChange={(e) => setPortions(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#3e4949] uppercase mb-2">Estimated Weight (kg)</label>
                <input 
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#0d7377] transition-all"
                  type="number" 
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-xs font-bold text-[#3e4949] uppercase mb-3">Storage Condition</label>
              <div className="flex gap-3">
                {['Ambient', 'Refrigerated', 'Hot'].map((cond) => (
                  <button 
                    key={cond}
                    onClick={() => setCondition(cond)}
                    className={`px-5 py-2 rounded-full border transition-colors text-sm font-semibold ${
                      condition === cond ? 'bg-[#0d7377] border-[#0d7377] text-white' : 'border-slate-200 text-[#3e4949] hover:border-[#0d7377] hover:text-[#0d7377]'
                    }`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button 
                onClick={handleListDonation}
                className="bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center gap-2 shadow-md"
              >
                <span className="material-symbols-outlined text-[18px]">campaign</span>
                List Donation
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: TRL Estimate */}
        <div className="w-full lg:w-[320px] shrink-0">
          <div className="bg-white rounded-[20px] shadow-lg p-6 border border-slate-100">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-[#0d7377]">timer</span>
              <h3 className="text-xl font-bold text-[#141b2b]">TRL Estimate</h3>
            </div>
            <p className="text-sm text-[#3e4949] mb-8">True Remaining Life based on selected category and {condition.toLowerCase()} storage.</p>
            
            <div className="flex justify-center mb-8 relative">
              {/* Simple Gauge Visual */}
              <div className="w-40 h-40 rounded-full border-8 border-slate-50 relative flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-8 border-t-[#007751] border-r-[#007751] border-b-transparent border-l-transparent transform rotate-45"></div>
                <div className="text-center">
                  <span className="block text-5xl font-bold text-[#0d7377]">4</span>
                  <span className="block text-xs font-bold text-[#3e4949] uppercase">Hours</span>
                </div>
              </div>
            </div>

            <div className="bg-[#f1f3ff] p-4 rounded-xl flex items-start gap-3 border border-slate-100">
              <span className="material-symbols-outlined text-[#007751] mt-0.5">verified_user</span>
              <div>
                <p className="text-sm font-bold text-[#141b2b]">Safe to Donate</p>
                <p className="text-xs text-[#3e4949] mt-1 leading-relaxed">This timeline meets the logistics requirements for local NGOs.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
