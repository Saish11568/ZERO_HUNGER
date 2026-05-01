import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();

  // Define generic classes to keep the component clean
  const navItemBaseClass = "flex items-center gap-3 px-6 py-3 transition-all duration-200 ease-in-out rounded-lg";
  const activeClass = "text-[#0D7377] bg-teal-50/50 dark:bg-teal-900/20 font-semibold border-r-4 border-[#0D7377]";
  const inactiveClass = "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:bg-teal-50/30 dark:hover:bg-teal-900/10";

  const getLinks = () => {
    if (!user) return [];
    if (user.role === 'NGO') {
      return [
        { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
        { to: '/alerts', icon: 'campaign', label: 'Food Alerts' },
        { to: '/deliveries', icon: 'local_shipping', label: 'Incoming Deliveries' },
        { to: '/animal-feeding', icon: 'pets', label: 'Animal Feeding' },
      ];
    } else if (user.role === 'Volunteer') {
      return [
        { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
        { to: '/animal-feeding', icon: 'pets', label: 'Animal Feeding' },
      ];
    } else {
      // Donor or Supermarket
      return [
        { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
        { to: '/list-food', icon: 'post_add', label: 'List Food' },
        { to: '/donations', icon: 'volunteer_activism', label: 'My Donations' },
      ];
    }
  };

  const links = getLinks();

  return (
    <nav className="fixed left-0 top-0 w-[240px] h-screen bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 shadow-[24px_0_48px_-12px_rgba(13,115,119,0.08)] z-50 flex flex-col py-8 font-['Inter'] text-sm tracking-tight">
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-on-primary-fixed-variant" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white leading-tight">ZeroHunger</h1>
          <p className="text-xs text-slate-500">Food Surplus Platform</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3">
        <ul className="space-y-1">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink 
                to={link.to}
                className={({ isActive }) => `${navItemBaseClass} ${isActive ? activeClass : inactiveClass}`}
              >
                <span className="material-symbols-outlined">{link.icon}</span>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto px-3">
        <ul className="space-y-1">
          <li>
            <NavLink 
              to="/settings"
              className={({ isActive }) => `${navItemBaseClass} ${isActive ? activeClass : inactiveClass}`}
            >
              <span className="material-symbols-outlined">settings</span>
              Settings
            </NavLink>
          </li>
          <li>
            <button 
              onClick={logout}
              className="flex items-center gap-3 px-6 py-3 text-error hover:bg-error-container/30 transition-colors rounded-lg w-full text-left group"
            >
              <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform">logout</span>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
