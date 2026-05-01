import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { api } from '../services/api';
import InfoModal from './InfoModal';

export default function Header() {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasNotifications, setHasNotifications] = useState(false);

  useEffect(() => {
    if (user?.role !== 'NGO') return;
    
    const checkNotifications = async () => {
      try {
        const orders = await api.getOrders();
        const pending = (orders || []).filter(o => o.ngoStatus === 'pending');
        setNotifications(pending);
        setHasNotifications(pending.length > 0);
      } catch (err) {
        console.error(err);
      }
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 5000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <>
      <header className="h-20 w-full sticky top-0 z-40 bg-[#F8F6F0]/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800 flex items-center justify-between pl-8 pr-12 font-['Inter'] font-medium">
        <div className="flex items-center">
          <span className="text-[#0D7377] bg-teal-100/50 px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer active:opacity-70">
            {user?.organization || 'Koramangala Zone'}
          </span>
        </div>
        
        <div className="flex items-center gap-6 text-[#0D7377] dark:text-[#26A69A]">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="hover:text-[#0D7377] dark:hover:text-teal-400 transition-colors cursor-pointer active:opacity-70 relative"
            >
              <span className="material-symbols-outlined">notifications</span>
              {hasNotifications && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border border-white animate-pulse"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-4 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-4 z-50 overflow-hidden">
                <div className="px-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Recent Alerts</h4>
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">{notifications.length} NEW</span>
                </div>
                <div className="max-h-[320px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <span className="material-symbols-outlined text-slate-300 text-4xl mb-2">notifications_off</span>
                      <p className="text-xs text-slate-500">All caught up!</p>
                    </div>
                  ) : (
                    notifications.map(n => (
                      <Link 
                        key={n.id} 
                        to="/alerts" 
                        onClick={() => setShowNotifications(false)}
                        className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 dark:border-slate-800 last:border-0"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#fea619]/10 flex items-center justify-center text-[#fea619] shrink-0">
                          <span className="material-symbols-outlined text-lg">restaurant</span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{n.food}</p>
                          <p className="text-[10px] text-slate-500 mt-1">{n.quantity} from {n.source}</p>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
                {notifications.length > 0 && (
                  <Link 
                    to="/alerts" 
                    onClick={() => setShowNotifications(false)}
                    className="block text-center py-3 text-xs font-bold text-primary hover:bg-slate-50 transition-colors border-t border-slate-100 dark:border-slate-800"
                  >
                    View All Alerts
                  </Link>
                )}
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setShowInfo(true)}
            className="hover:text-[#0D7377] dark:hover:text-teal-400 transition-colors cursor-pointer active:opacity-70"
          >
            <span className="material-symbols-outlined">help_outline</span>
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-primary-fixed transition-colors cursor-pointer active:opacity-70 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface"
            >
              <img 
                alt="User profile avatar" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC076x1e8CXQrfZLK5z2RojFjCQZB_jA_qcQ8ijORdk3S6aRH9jfqABuMp_dPljswo4ddeMptjGBTlHKybNu0u8DRi-c2Q_gGiz-Y1BWM4VevoAEoWmjvaPkp3mOIXqRNB460Lyg9VTEVL1nan2Sj8-o6SrIbmKFpnwt1PDuFnB62sYI8lRTovFS2R3opdkVVGzXNtNUA3XBO0VsqUYsYUor80cFRMWD-btHdz59I7LW5TgfcUNOrM0ewW8PzNFE8b7QJfbkpa2n9aP"
              />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email || 'user@example.com'}</p>
                </div>
                <Link 
                  to="/settings" 
                  onClick={() => setShowDropdown(false)}
                  className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Settings
                </Link>
                <button 
                  onClick={logout}
                  className="w-full text-left block px-4 py-2 text-sm text-error hover:bg-error-container/30"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}
    </>
  );
}
