'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Mail, 
  ArrowLeft, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

import { API_ENDPOINTS } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch(API_ENDPOINTS.FORGOT_PASSWORD, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Something went wrong');

      setMessage({ type: 'success', text: 'Reset link sent! Please check your email.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] relative overflow-hidden p-4">
      {/* Subtle Professional Gradient Orbs */}
      <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[30%] h-[30%] bg-indigo-200/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-slate-200/50 rounded-full blur-[100px]" />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="bg-white rounded-[32px] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100 mx-auto mb-6">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[#1E293B]">Reset Password</h1>
            <p className="text-slate-500 font-medium mt-2 text-sm max-w-[280px] mx-auto">Instructions will be sent to your work email</p>
          </div>

          {message.text && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-[11px] font-bold ${
                message.type === 'success' 
                  ? 'bg-emerald-50/50 text-emerald-600 border border-emerald-100' 
                  : 'bg-red-50/50 text-red-600 border border-red-100'
              }`}
            >
              {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              {message.text}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 ml-1 uppercase tracking-widest">Work Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-semibold text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Instructions'}
              </button>
              
              <Link 
                href="/login" 
                className="flex items-center justify-center gap-2 text-[11px] font-bold text-slate-400 hover:text-indigo-600 transition-all uppercase tracking-widest"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
              </Link>
            </div>
          </form>
        </div>

        <p className="text-center mt-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          Secured by <span className="text-indigo-600">Enterprise Auth v2.0</span>
        </p>
      </motion.div>
    </div>
  );
}
