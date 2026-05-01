import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Donor'
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulate login
    const user = {
      name: formData.name || 'Anonymous User',
      email: formData.email,
      role: formData.role,
      token: 'mock_' + Date.now()
    };
    
    login(user);
    // Navigation is handled by ProtectedRoute or manually if needed
    // But login() usually updates state which triggers a redirect in many setups
    // In our App.jsx, the routes are protected.
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    // Map IDs from HTML to formData keys
    const key = id.replace('login-', '');
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex w-full min-h-screen bg-surface font-body text-on-surface antialiased">
      {/* Left Panel: Brand & Impact */}
      <div className="hidden lg:flex w-[40%] bg-[#0d7377] text-white relative flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            className="w-full h-full object-cover mix-blend-overlay" 
            alt="Abstract soft wave pattern" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOmKBzggwSuvgCMbY7bbb4x1V_UPKG5D0qnlh3sRYOjsdnmm6zVmtgB83en7uAGgo8jfp135nMhaTJMRkv6jgQf8rPXqeE1N7Ref83Vl04n-bmwEsAzbrCVLjh5o5lCRuKkJVUbGFieCVuX4c0AVvSZWxzrRngGZRKmy-Z8Qpm29OIVg2ndUBgKTlkHdPA78QsiboDC37AM-6oBPiOs-VndF8pY5tyCmV7SLre7JF82lWdeByQxo2Uf68tOx767TsSVyY07GnpQOMH"
          />
        </div>
        <div className="relative z-10 p-12 lg:p-16 flex flex-col h-full">
          <div className="mb-auto">
            <div className="flex items-center gap-3 mb-12">
              <span className="material-symbols-outlined text-4xl text-white">volunteer_activism</span>
              <span className="text-2xl font-bold text-white">ZeroHunger</span>
            </div>
            <h1 className="text-5xl font-bold text-white max-w-md leading-tight">
              Welcome back to the movement.
            </h1>
          </div>
        </div>
        <svg className="absolute bottom-0 w-full h-32 z-0" fill="none" preserveAspectRatio="none" viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg">
          <path className="text-[#00595c] opacity-50" d="M0 120H1440V0C1440 0 1140 120 720 120C300 120 0 0 0 0V120Z" fill="currentColor"></path>
        </svg>
      </div>

      {/* Right Panel: Login Form */}
      <div className="w-full lg:w-[60%] bg-[#F9F9F9] flex flex-col justify-center items-center p-6 sm:p-12 lg:p-24 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Sign In</h2>
            <p className="text-slate-500">Access your dashboard to manage contributions and impact.</p>
          </div>

          {/* Login Form */}
          <form id="login-form" className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Your Name / Business Name</label>
              <input 
                id="login-name" 
                required 
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-4 text-slate-900 focus:border-[#0d7377] focus:ring-1 focus:ring-[#0d7377] outline-none transition-all" 
                placeholder="e.g. Vedant's Kitchen or Vedant NGO" 
                type="text"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <input 
                id="login-email" 
                required 
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-4 text-slate-900 focus:border-[#0d7377] focus:ring-1 focus:ring-[#0d7377] outline-none transition-all" 
                placeholder="name@example.com" 
                type="email"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Password</label>
                <a href="#" className="text-xs font-bold text-[#0d7377] hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <input 
                  id="login-password" 
                  required 
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-4 text-slate-900 focus:border-[#0d7377] focus:ring-1 focus:ring-[#0d7377] outline-none transition-all" 
                  placeholder="••••••••" 
                  type={showPassword ? "text" : "password"}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0d7377]"
                >
                  <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Dashboard Role</label>
              <select 
                id="login-role" 
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-4 text-slate-900 focus:border-[#0d7377] focus:ring-1 focus:ring-[#0d7377] outline-none transition-all cursor-pointer"
              >
                <option value="Donor">Business Donor</option>
                <option value="NGO">NGO / Demand Centre</option>
                <option value="Volunteer">Volunteer</option>
              </select>
            </div>

            {/* Actions */}
            <div className="pt-4 space-y-4">
              <button 
                className="w-full bg-[#0d7377] text-white rounded-xl py-4 font-bold shadow-lg hover:bg-[#00595c] transition-all active:scale-[0.98] flex justify-center items-center gap-2" 
                type="submit"
              >
                Sign In
                <span className="material-symbols-outlined text-[20px]">login</span>
              </button>
              
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink-0 mx-4 text-sm text-slate-400 font-medium">or</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <button 
                className="w-full bg-white border-2 border-slate-200 text-slate-900 rounded-xl py-3.5 font-semibold hover:bg-slate-50 transition-all flex justify-center items-center gap-3" 
                type="button"
              >
                <img alt="Google Logo" className="w-5 h-5" src="https://www.google.com/favicon.ico"/>
                Continue with Google
              </button>
            </div>

            <div className="text-center pt-6">
              <p className="text-slate-500 text-sm">
                Don't have an account? <a className="text-[#0d7377] font-bold hover:underline" href="/Registration.html">Join ZeroHunger</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
