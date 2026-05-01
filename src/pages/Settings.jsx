import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/AuthContext';
import { api } from '../services/api';

export default function Settings() {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: ''
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profileImage, setProfileImage] = useState(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC9tN961Nz4f1c2A10V0Jqz1yFJ2kmTyxF40RdQI-E_k2-jjh1UdxRXtdhvGCQ06To2ZDF0GZ4IH8kaqhqtn43ioRUOQ8eF4Fzd4StPwnsjSm0MIcmYTTzYnaOM-8uM-itsfcybPzpEgekQM2z9CUDI9gQYuHZ3ZvVm5U4zkWiukwqAUz9eM9a__LOEdhR_-LAc1y_D8WwdpPyJH4vfdnWkip8zW28twb5OcrT6iIu9jA1MNzSszpfziqWz2EQjhy0alBcDUI5xIyjT'
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      setSaved(false);
    }
  };

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        organization: user.organization || ''
      });
      if (user.profileImage) {
        setProfileImage(user.profileImage);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedUser = await api.updateUser(user.id, { ...formData, profileImage });
      login(updatedUser); // Update context
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-[1440px] mx-auto pb-32">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-slate-900 dark:text-white mb-2">Account Settings</h2>
        <p className="text-slate-600 dark:text-slate-400">Manage your profile details, platform preferences, and security settings.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-4 flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-sm mb-4 relative group cursor-pointer">
              <img 
                alt="Profile" 
                className="w-full h-full object-cover group-hover:brightness-75 transition-all" 
                src={profileImage}
              />
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-container transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[16px]">edit</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{formData.name || 'User'}</h3>
            <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mt-2">
              {user?.role || 'Role'}
            </span>
            
            <div className="w-full mt-8 space-y-5">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-transparent border-1.5 border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Email Contact</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent border-1.5 border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-transparent border-1.5 border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Organization / Location</label>
                <input 
                  type="text" 
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  className="w-full bg-transparent border-1.5 border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-8 flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">notifications_active</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Communication Preferences</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">Donation Alerts</p>
                  <p className="text-sm text-slate-500">Real-time notifications for relevant food surpluses.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">Weekly Reports</p>
                  <p className="text-sm text-slate-500">Receive a summary of meals rescued.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between pt-8 border-t border-slate-200 dark:border-slate-800">
            <button className="text-error font-semibold px-4 py-2 rounded-lg hover:bg-error-container/30 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">delete_forever</span>
              Delete Account
            </button>
            <div className="flex items-center gap-4">
              {saved && <span className="text-green-600 text-sm font-medium mr-2">Changes saved!</span>}
              <button 
                onClick={handleSave}
                disabled={saving}
                className="bg-primary text-white font-semibold px-8 py-3 rounded-lg shadow-sm hover:bg-primary-container transition-all flex items-center gap-2 disabled:opacity-70"
              >
                {saving ? 'Saving...' : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
