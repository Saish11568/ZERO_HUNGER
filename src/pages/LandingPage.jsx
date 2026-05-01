import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8F6F0]">
      {/* Top Nav */}
      <header className="h-20 w-full sticky top-0 z-40 bg-[#F8F6F0]/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-[1440px] mx-auto px-12 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-black text-slate-900 tracking-tight">ZeroHunger</span>
          </div>
          <div className="flex items-center">
            <Link to="/login" className="bg-[#0d7377] text-white rounded-[10px] px-6 py-2.5 font-semibold hover:bg-[#00595c] transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-12 py-12">
        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row items-center justify-between gap-12 pt-12 pb-24 min-h-[716px] relative overflow-hidden">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img 
              alt="Background" 
              className="w-full h-full object-cover opacity-40 filter grayscale-[10%] sepia-[5%] brightness-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-LTGG571lJu2-7fNPr2CmrhdJymRmdf6U4jUsLH53BVcOFhlWVZ-FY7epfAwJ-giwSK5jBEJE4vHPU723oZuhnL5E7XdwvvD9PzGKTIvdMmdsSu0GX-iM4ggPupdfXuhdqNQKC1Vt-RGHx9F5w0GTEG3eRhctuBUtiNG86oRbNgs0k0JsNdnCqjRcZQPMtFyS9_ESBzWpwBP7PRR6szR0b8wrLFJ8eetQT42kuS_QCuaXcOXX67-algGlfaoWRFsYSF6oadIWVyzc"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#F8F6F0] via-[#F8F6F0]/85 to-[#0D7377]/10"></div>
          </div>

          {/* Left Content */}
          <div className="w-full lg:w-1/2 flex flex-col gap-8 z-10">
            <div className="flex flex-col gap-4">
              <h1 className="text-7xl font-bold text-slate-900 leading-tight">Feed More.<br/>Waste Less.</h1>
              <p className="text-lg text-slate-600 max-w-xl">
                Connect surplus food to people who need it — in minutes, not hours. A logistics platform designed for impact.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link to="/login" className="bg-[#0d7377] text-white rounded-[10px] px-8 py-4 font-semibold shadow-lg hover:-translate-y-0.5 transition-transform flex items-center gap-2">
                Join as Restaurant
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
              <Link to="/login" className="bg-[#fea619] text-[#684000] rounded-[10px] px-8 py-4 font-semibold shadow-lg hover:-translate-y-0.5 transition-transform flex items-center gap-2">
                Join as NGO
                <span className="material-symbols-outlined text-sm">favorite</span>
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-4 text-slate-500 text-xs uppercase tracking-widest border-t border-slate-200 pt-6 font-bold">
              <span>142 NGOs</span>
              <span className="text-slate-300">•</span>
              <span>890 Restaurants</span>
              <span className="text-slate-300">•</span>
              <span>48,000 Meals Delivered</span>
            </div>
          </div>

          {/* Right Visual */}
          <div className="w-full lg:w-1/2 flex justify-end relative mt-12 lg:mt-0">
            <div className="bg-white rounded-[20px] shadow-2xl p-6 w-full max-w-md border border-slate-100 transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-[#0d7377]">
                    <span className="material-symbols-outlined">storefront</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Spice Symphony</h3>
                    <p className="text-xs text-slate-500">Surplus Listed • 2 mins ago</p>
                  </div>
                </div>
                <span className="bg-amber-50 text-[#fea619] px-3 py-1 rounded-full text-xs font-bold">High Priority</span>
              </div>
              <div className="space-y-4 mb-6">
                <div className="bg-slate-50 rounded-[10px] p-4 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#0d7377]">restaurant</span>
                    <span className="text-slate-700 font-medium">45 Servings Rice & Curry</span>
                  </div>
                  <span className="font-bold text-slate-900">12:30 PM</span>
                </div>
                <div className="bg-slate-50 rounded-[10px] p-4 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#0d7377]">bakery_dining</span>
                    <span className="text-slate-700 font-medium">20 Loaves Bread</span>
                  </div>
                  <span className="font-bold text-slate-900">01:15 PM</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#0d7377] w-3/4 h-full rounded-full"></div>
                </div>
                <span className="text-xs text-[#0d7377] font-bold">Dispatching</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-24">
          <div className="bg-white rounded-[20px] p-8 shadow-lg border border-slate-100 hover:border-slate-200 transition-colors flex flex-col gap-4">
            <div className="w-12 h-12 rounded-[10px] bg-teal-50 flex items-center justify-center text-[#0d7377] mb-2">
              <span className="material-symbols-outlined">science</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Expiry DNA Scoring</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Real-time food viability assessment — smarter than printed dates to ensure safety and minimize waste.
            </p>
          </div>
          <div className="bg-white rounded-[20px] p-8 shadow-lg border border-slate-100 hover:border-slate-200 transition-colors flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#fea619]"></div>
            <div className="w-12 h-12 rounded-[10px] bg-amber-50 flex items-center justify-center text-[#fea619] mb-2">
              <span className="material-symbols-outlined">my_location</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Zone-Based Dispatch</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Targeted alerts reach the right NGO in under 60 seconds, optimizing logistics for maximum freshness.
            </p>
          </div>
          <div className="bg-white rounded-[20px] p-8 shadow-lg border border-slate-100 hover:border-slate-200 transition-colors flex flex-col gap-4">
            <div className="w-12 h-12 rounded-[10px] bg-[#007751]/10 flex items-center justify-center text-[#007751] mb-2">
              <span className="material-symbols-outlined">hub</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Micro-Surplus Clusters</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Even 8 leftover rotis count — we bundle them into full meal runs to maximize impact across the city.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
