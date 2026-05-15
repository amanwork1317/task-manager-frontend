'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Moon, 
  Sun, 
  Shield, 
  Globe, 
  Mail,
  Lock,
  Loader2,
  CheckCircle2,
  ChevronRight,
  Monitor
} from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Moon },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto pb-20">
      <header>
        <h1 className="text-4xl font-extrabold tracking-tight">App <span className="gradient-text">Settings</span></h1>
        <p className="text-muted-foreground font-medium mt-1">Manage your account preferences and system configurations.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                  : 'hover:bg-white text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-3">
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === tab.id ? 'rotate-90' : ''}`} />
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-8 rounded-[32px] min-h-[500px]"
          >
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-3xl bg-indigo-50 border-4 border-white shadow-xl flex items-center justify-center text-indigo-600 text-4xl font-black">
                    {user?.name?.[0] || 'A'}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{user?.name}</h2>
                    <p className="text-muted-foreground">{user?.role} • {user?.email}</p>
                    <button className="mt-3 text-sm font-bold text-indigo-600 hover:underline">Change Avatar</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold ml-1">Full Name</label>
                    <input type="text" defaultValue={user?.name} className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold ml-1">Email Address</label>
                    <input type="email" defaultValue={user?.email} className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Bell className="w-5 h-5 text-indigo-600" /> Notification Preferences
                </h3>
                <div className="space-y-4">
                  {[
                    { title: 'Email Notifications', desc: 'Receive daily task summaries via email.' },
                    { title: 'Push Notifications', desc: 'Get instant alerts for task assignments.' },
                    { title: 'Weekly Reports', desc: 'Summarized team performance every Monday.' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50">
                      <div>
                        <p className="font-bold">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <div className="w-12 h-6 bg-indigo-600 rounded-full relative p-1 cursor-pointer">
                        <div className="absolute right-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-indigo-600" /> Theme Selection
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'light', label: 'Light Mode', icon: Sun, color: 'bg-white' },
                    { id: 'dark', label: 'Dark Mode', icon: Moon, color: 'bg-slate-900' },
                    { id: 'system', label: 'System Default', icon: Monitor, color: 'bg-slate-100' }
                  ].map((theme) => (
                    <button key={theme.id} className={`p-6 rounded-[24px] border-2 transition-all ${theme.id === 'light' ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-border'}`}>
                      <div className={`w-full h-24 rounded-xl mb-4 ${theme.color} border border-border flex items-center justify-center`}>
                        <theme.icon className={`w-8 h-8 ${theme.id === 'dark' ? 'text-white' : 'text-slate-400'}`} />
                      </div>
                      <p className="font-bold text-sm">{theme.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Lock className="w-5 h-5 text-indigo-600" /> Password & Security
                </h3>
                <div className="space-y-4">
                  <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-4">
                    <Shield className="w-6 h-6 text-amber-600 mt-1" />
                    <div>
                      <p className="font-bold text-amber-900">Two-Factor Authentication</p>
                      <p className="text-sm text-amber-700">Add an extra layer of security to your account. (Coming Soon)</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl" />
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-12 pt-8 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                {showSuccess && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" /> Settings saved successfully!
                  </motion.div>
                )}
              </div>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
