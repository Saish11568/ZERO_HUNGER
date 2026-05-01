import React from 'react';

export default function Analytics() {
  return (
    <div className="flex-1 p-12 max-w-7xl mx-auto w-full">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-[#141b2b]">Platform Analytics</h2>
        <p className="text-[#3e4949] mt-2 max-w-2xl">
          Comprehensive performance metrics for the ZeroHunger platform. Monitor donation trends, donor engagement, and overall impact in the Koramangala zone.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {/* KPI Section */}
        <div className="bg-white rounded-[20px] p-6 shadow-lg border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-[#0d7377]">
              <span className="material-symbols-outlined">restaurant</span>
            </div>
            <h3 className="text-xs font-bold text-[#3e4949] uppercase tracking-wider">Total Meals Rescued</h3>
          </div>
          <div className="mt-auto">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-[#141b2b]">12,450</span>
              <span className="text-sm text-[#3e4949] font-medium">meals</span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-[#0d7377] text-xs font-bold">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>+8% vs last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[20px] p-6 shadow-lg border border-slate-100 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#fea619]"></div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-[#fea619]">
              <span className="material-symbols-outlined">schedule</span>
            </div>
            <h3 className="text-xs font-bold text-[#3e4949] uppercase tracking-wider">Active Donors</h3>
          </div>
          <div className="mt-auto">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-[#141b2b]">84</span>
              <span className="text-lg text-[#3e4949] font-medium ml-1">partners</span>
            </div>
            <p className="text-xs text-[#3e4949] mt-2 font-medium">Currently contributing to the zone.</p>
          </div>
        </div>

        <div className="bg-white rounded-[20px] p-6 shadow-lg border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-[#0d7377]">
              <span className="material-symbols-outlined">radar</span>
            </div>
            <h3 className="text-xs font-bold text-[#3e4949] uppercase tracking-wider">Fleet Efficiency</h3>
          </div>
          <div className="mt-auto">
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-5xl font-bold text-[#141b2b]">98</span>
              <span className="text-lg text-[#3e4949] font-medium ml-1">%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#0d7377] w-[98%] rounded-full"></div>
            </div>
            <p className="text-xs text-[#3e4949] mt-2 font-medium">Successful pickup to delivery ratio.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white rounded-[20px] p-6 shadow-lg border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-[#141b2b]">Monthly Rescue Volume</h3>
              <p className="text-sm text-[#3e4949] mt-1">Total surplus collected per month</p>
            </div>
            <button className="flex items-center gap-2 text-[#0d7377] text-xs font-bold hover:bg-teal-50 px-4 py-2 rounded-lg transition-colors">
              <span>Export Data</span>
              <span className="material-symbols-outlined text-sm">download</span>
            </button>
          </div>
          <div className="h-[300px] w-full flex items-end justify-between gap-2 pt-10 border-b border-slate-100 pb-2 relative">
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[10px] text-slate-400 font-bold w-8 -ml-8">
              <span>150</span>
              <span>100</span>
              <span>50</span>
              <span>0</span>
            </div>
            {[
              { label: '8AM', height: '20%' },
              { label: '10AM', height: '35%' },
              { label: '12PM', height: '60%' },
              { label: '2PM', height: '95%', peak: true },
              { label: '4PM', height: '75%' },
              { label: '6PM', height: '45%' },
              { label: '8PM', height: '25%' },
            ].map((bar, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 w-full group relative">
                {bar.peak && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[#fea619] text-[10px] font-bold flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full whitespace-nowrap">
                    <span className="material-symbols-outlined text-[12px] font-bold">bolt</span> Peak
                  </div>
                )}
                <div 
                  className={`w-full max-w-[40px] rounded-t-md transition-all duration-300 ${
                    bar.peak ? 'bg-[#fea619] shadow-md' : 'bg-[#0d7377] opacity-70 group-hover:opacity-100'
                  }`} 
                  style={{ height: bar.height }}
                ></div>
                <span className={`text-[10px] font-bold ${bar.peak ? 'text-[#141b2b]' : 'text-slate-400'}`}>{bar.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-[20px] p-6 shadow-lg border border-slate-100">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-[#141b2b]">Weekly Density</h3>
            <p className="text-sm text-[#3e4949] mt-1">Historical high-yield days</p>
          </div>
          <div className="space-y-3 mt-4">
            {[
              { day: 'MON', level: 'bg-teal-50' },
              { day: 'TUE', level: 'bg-teal-100' },
              { day: 'WED', level: 'bg-amber-100', text: 'High Volume', active: true },
              { day: 'THU', level: 'bg-teal-100' },
              { day: 'FRI', level: 'bg-[#fea619]', text: 'Peak Day', active: true, peak: true },
              { day: 'SAT', level: 'bg-teal-50' },
              { day: 'SUN', level: 'bg-slate-50' },
            ].map((row, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className={`w-10 text-[10px] font-bold ${row.active ? 'text-[#141b2b]' : 'text-slate-400'}`}>{row.day}</div>
                <div className={`flex-1 h-8 rounded-md relative flex items-center justify-end px-3 ${row.level} ${row.peak ? 'shadow-md' : ''}`}>
                  {row.text && <span className={`text-[10px] font-bold ${row.peak ? 'text-white' : 'text-[#fea619]'}`}>{row.text}</span>}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="material-symbols-outlined text-[#0d7377] text-xl mt-0.5">info</span>
            <p className="text-xs text-[#3e4949] leading-relaxed font-medium">
              Friday evenings consistently show a 40% spike in corporate cafeteria donations. Ensure extra transport capacity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
