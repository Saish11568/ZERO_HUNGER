import React from 'react';

export default function InfoModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">info</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">About ZeroHunger</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Platform Goal</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              ZeroHunger connects surplus food from restaurants and supermarkets with local NGOs in real-time. 
              Our mission is to eliminate food waste while addressing hunger through rapid, tech-enabled logistics.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Key Features</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span>
                <span className="text-sm text-slate-600 dark:text-slate-400"><strong>TRL Scoring:</strong> Real-time food viability and safety assessment.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span>
                <span className="text-sm text-slate-600 dark:text-slate-400"><strong>Zone Dispatch:</strong> Targeted NGO alerts based on location.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span>
                <span className="text-sm text-slate-600 dark:text-slate-400"><strong>Live Tracking:</strong> Amazon-like delivery tracking for food rescue.</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-surface-container-low p-4 rounded-xl">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Contact Support</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">support@zerohunger.org | +1 (555) 123-4567</p>
          </div>
        </div>
        
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-container transition-colors shadow-sm"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
