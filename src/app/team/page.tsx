'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Mail, 
  Shield, 
  User as UserIcon, 
  Trash2, 
  Loader2,
  AlertCircle,
  MoreVertical,
  X,
  Lock,
  Plus,
  Edit2,
  Save,
  Ban,
  UserCheck,
  TriangleAlert,
  Key
} from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  active: boolean;
  avatar?: string;
  createdAt: string;
}

const Tooltip = ({ children, text }: { children: React.ReactNode, text: string }) => (
  <div className="relative group">
    {children}
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-2xl scale-90 group-hover:scale-100">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-900" />
    </div>
  </div>
);

export default function TeamMembersPage() {
  const [team, setTeam] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'member', active: true });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{ open: boolean, user: User | null }>({ open: false, user: null });
  
  // Reset Password Modal State
  const [resetPasswordModal, setResetPasswordModal] = useState<{ open: boolean, user: User | null, newPassword: '' }>({ open: false, user: null, newPassword: '' });
  
  const { token, user } = useAuth();

  const fetchTeam = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setTeam(data.data.users);
      }
    } catch (err) {
      console.error('Error fetching team:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchTeam();
  }, [token]);

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'member', active: true });
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (u: User) => {
    setEditingUser(u);
    setFormData({ name: u.name, email: u.email, password: '', role: u.role, active: u.active });
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic Client-side Validation
    if (formData.name.trim().length < 2) {
      return setError('Name must be at least 2 characters long');
    }
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email)) {
      return setError('Please enter a valid email address');
    }
    if (!editingUser && formData.password.length < 6) {
      return setError('Password must be at least 6 characters long');
    }

    setSubmitting(true);

    const url = editingUser 
      ? `http://localhost:5000/api/users/${editingUser._id}`
      : 'http://localhost:5000/api/auth/register';
    
    const method = editingUser ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to process request');

      if (editingUser) {
        setTeam(team.map(t => t._id === editingUser._id ? data.data.user : t));
      } else {
        setTeam([...team, data.data.user]);
      }
      
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const executeToggleAccess = async () => {
    const targetUser = confirmModal.user;
    if (!targetUser) return;

    try {
      const res = await fetch(`http://localhost:5000/api/users/${targetUser._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ active: !targetUser.active }),
      });

      const data = await res.json();
      if (res.ok) {
        setTeam(team.map(t => t._id === targetUser._id ? data.data.user : t));
      }
    } catch (err) {
      console.error('Error toggling access:', err);
    } finally {
      setConfirmModal({ open: false, user: null });
    }
  };

  const executeResetPassword = async () => {
    if (!resetPasswordModal.user || !resetPasswordModal.newPassword) return;
    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/users/${resetPasswordModal.user._id}/reset-password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ password: resetPasswordModal.newPassword }),
      });

      if (res.ok) {
        setResetPasswordModal({ open: false, user: null, newPassword: '' });
        alert('Password updated successfully!');
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      console.error('Error resetting password:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setTeam(team.filter(u => u._id !== id));
      }
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Team <span className="gradient-text">Members</span></h1>
          <p className="text-muted-foreground font-medium mt-1">Manage your team and their access levels.</p>
        </div>
        
        {user?.role === 'admin' && (
          <Tooltip text="Create New Account">
            <button 
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:scale-105 active:scale-95 transition-all"
            >
               <Plus className="w-5 h-5" /> Add Member
            </button>
          </Tooltip>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member) => (
            <motion.div 
              layout
              key={member._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative bg-white rounded-[40px] p-8 border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] hover-lift transition-all duration-500 group ${!member.active ? 'grayscale opacity-70' : ''}`}
            >
              {/* Card Header: Role & Status */}
              <div className="flex items-center justify-between mb-8">
                <div className={`px-4 py-1.5 rounded-2xl flex items-center gap-2 border ${
                  member.role === 'admin' 
                    ? 'bg-indigo-50 border-indigo-100 text-indigo-600' 
                    : 'bg-slate-50 border-slate-100 text-slate-500'
                }`}>
                  <Shield className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-[0.1em]">{member.role}</span>
                </div>
                
                {user?.role === 'admin' && member._id !== user.id && (
                  <Tooltip text={member.active ? 'Revoke Access' : 'Restore Access'}>
                    <div className="flex flex-col items-end gap-1">
                      <button 
                        onClick={() => setConfirmModal({ open: true, user: member })}
                        className={`relative w-12 h-6 rounded-full transition-all duration-500 shadow-inner p-1 ${
                          member.active 
                            ? 'bg-emerald-500/10 border border-emerald-500/20 shadow-emerald-500/20' 
                            : 'bg-slate-100 border border-slate-200'
                        }`}
                      >
                        <div className={`absolute inset-0 transition-opacity duration-500 rounded-full bg-linear-to-r from-emerald-500 to-teal-400 ${member.active ? 'opacity-100' : 'opacity-0'}`}></div>
                        
                        <motion.div 
                          initial={false}
                          animate={{ 
                            x: member.active ? 24 : 0,
                          }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          className={`relative w-4 h-4 rounded-full shadow-lg z-10 flex items-center justify-center transition-colors duration-500 ${
                            member.active ? 'bg-white' : 'bg-slate-400'
                          }`}
                        >
                           {member.active ? (
                             <UserCheck className="w-2.5 h-2.5 text-emerald-600" />
                           ) : (
                             <Ban className="w-2.5 h-2.5 text-white" />
                           )}
                        </motion.div>
                      </button>
                      <span className={`text-[8px] font-black uppercase tracking-widest ${member.active ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {member.active ? 'Active' : 'Suspended'}
                      </span>
                    </div>
                  </Tooltip>
                )}
              </div>

              {/* Profile Section */}
              <div className="flex flex-col items-center text-center mb-8">
                <div className="relative mb-6">
                  <div className={`w-24 h-24 rounded-[32px] bg-slate-50 flex items-center justify-center border-4 border-white shadow-xl overflow-hidden group-hover:scale-105 transition-transform duration-500 ${!member.active ? 'opacity-50' : ''}`}>
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-10 h-10 text-slate-300" />
                    )}
                  </div>
                  {member.active && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full shadow-lg"></div>
                  )}
                </div>
                
                <h3 className="text-2xl font-black text-slate-800 mb-1">{member.name}</h3>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> {member.email}
                </p>
              </div>

              {/* Action Section */}
              {user?.role === 'admin' && member._id !== user.id ? (
                <div className="flex items-center gap-2 pt-6 border-t border-slate-50">
                  <Tooltip text="Modify Details">
                    <button 
                      onClick={() => handleOpenEditModal(member)}
                      className="flex-1 py-3.5 px-6 bg-slate-50 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 rounded-[20px] transition-all flex items-center justify-center gap-2 font-bold text-xs whitespace-nowrap"
                    >
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                  </Tooltip>
                  
                  <Tooltip text="Set New Password">
                    <button 
                      onClick={() => setResetPasswordModal({ open: true, user: member, newPassword: '' })}
                      className="p-3.5 bg-slate-50 hover:bg-amber-50 text-slate-500 hover:text-amber-600 rounded-[20px] transition-all"
                    >
                      <Key className="w-4 h-4" />
                    </button>
                  </Tooltip>

                  <Tooltip text="Remove Member">
                    <button 
                      onClick={() => handleDeleteUser(member._id)}
                      className="p-3.5 bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-[20px] transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </Tooltip>
                </div>
              ) : (
                <div className="pt-6 border-t border-slate-50 text-center">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                    Joined {new Date(member.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      
      {/* Modern Confirmation Modal */}
      <AnimatePresence>
        {confirmModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setConfirmModal({ open: false, user: null })}
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[40px] p-8 shadow-2xl text-center"
            >
              <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${confirmModal.user?.active ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                {confirmModal.user?.active ? <TriangleAlert className="w-10 h-10" /> : <UserCheck className="w-10 h-10" />}
              </div>
              <h2 className="text-2xl font-black mb-2">{confirmModal.user?.active ? 'Revoke Access?' : 'Restore Access?'}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                Are you sure you want to {confirmModal.user?.active ? 'suspend' : 'reinstate'} <strong>{confirmModal.user?.name}</strong>? 
                {confirmModal.user?.active ? ' They will be immediately blocked from all system functions.' : ' They will regain full access to their dashboard.'}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setConfirmModal({ open: false, user: null })}
                  className="py-4 bg-muted text-foreground font-bold rounded-2xl hover:bg-muted/80 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={executeToggleAccess}
                  className={`py-4 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95 ${confirmModal.user?.active ? 'bg-red-500 shadow-red-100' : 'bg-emerald-500 shadow-emerald-100'}`}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add/Edit Member Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-[32px] p-8 shadow-2xl border border-border"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{editingUser ? 'Edit' : 'Add'} Team <span className="gradient-text">Member</span></h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-muted rounded-xl transition-colors"><X className="w-5 h-5" /></button>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm">
                  <AlertCircle className="w-5 h-5" />{error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold ml-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="text" required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className={`w-full pl-10 pr-4 py-2.5 bg-muted/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                        error.includes('Name') ? 'border-red-500' : 'border-border'
                      }`}
                      placeholder="Jane Doe"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="email" required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className={`w-full pl-10 pr-4 py-2.5 bg-muted/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                        error.includes('email') ? 'border-red-500' : 'border-border'
                      }`}
                      placeholder="jane@hrms.com"
                    />
                  </div>
                </div>

                {!editingUser && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold ml-1">Temporary Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input 
                        type="password" required minLength={6}
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className={`w-full pl-10 pr-4 py-2.5 bg-muted/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                          error.includes('Password') ? 'border-red-500' : 'border-border'
                        }`}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold ml-1">Role</label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value as any})} className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                        <option value="member">Team Member</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold ml-1">Account Status</label>
                    <div className="relative">
                      {formData.active ? <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /> : <Ban className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />}
                      <select value={formData.active ? 'true' : 'false'} onChange={(e) => setFormData({...formData, active: e.target.value === 'true'})} className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                        <option value="true">Active</option>
                        <option value="false">Revoked</option>
                      </select>
                    </div>
                  </div>
                </div>
                <button disabled={submitting} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl mt-6 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 flex items-center justify-center gap-2">
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : editingUser ? <><Save className="w-5 h-5" /> Save Changes</> : 'Create Account'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reset Password Modal */}
      <AnimatePresence>
        {resetPasswordModal.open && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl border border-white"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                    <Key className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black">Reset Password</h2>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">User: {resetPasswordModal.user?.name}</p>
                  </div>
                </div>
                <button onClick={() => setResetPasswordModal({ open: false, user: null, newPassword: '' })} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
              </div>

              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 ml-1 uppercase tracking-widest">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                    <input 
                      type="password"
                      value={resetPasswordModal.newPassword}
                      onChange={(e) => setResetPasswordModal({ ...resetPasswordModal, newPassword: e.target.value as any })}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-bold text-slate-700"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setResetPasswordModal({ open: false, user: null, newPassword: '' })} className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
                  <button 
                    onClick={executeResetPassword}
                    disabled={submitting || !resetPasswordModal.newPassword}
                    className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Set Password'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
