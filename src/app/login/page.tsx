'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  Eye,
  EyeOff,
  Activity,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Login failed');

      login(data.token, data.data.user);
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#fbfbfb] font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden relative p-6 md:p-10 lg:p-14">
      {/* Premium Dot-Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: `radial-gradient(#4f46e5 1px, transparent 1px)`, backgroundSize: '32px 32px' }} 
      />

      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/80 backdrop-blur-xl z-[100] flex items-center justify-center"
          >
            <div className="relative">
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                  borderRadius: ["20%", "50%", "20%"]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-32 h-32 bg-linear-to-tr from-indigo-600 via-purple-500 to-pink-500 opacity-20 blur-3xl"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Activity className="w-10 h-10 text-indigo-600 animate-pulse" />
                </motion.div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600/50">Initializing</span>
                  <div className="flex gap-1 mt-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div 
                        key={i}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        className="w-1.5 h-1.5 bg-indigo-600 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Unified Card Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-7xl h-full bg-white rounded-[48px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] border border-slate-100 flex overflow-hidden relative z-10 mx-auto"
      >
        {/* Left Panel: High-Fidelity Content */}
        <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden bg-slate-50/30">
          {/* Animated Mesh Gradients */}
          <div className="absolute inset-0 opacity-40">
            <motion.div 
              animate={{ 
                x: [0, 50, 0],
                y: [0, 30, 0],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-indigo-100 rounded-full blur-[120px]"
            />
            <motion.div 
              animate={{ 
                x: [0, -40, 0],
                y: [0, -50, 0],
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-purple-100 rounded-full blur-[120px]"
            />
          </div>
          
          <div className="relative z-10 max-w-xl p-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Pulsing Icon */}
              <div className="relative w-fit mb-12">
                <motion.div 
                  animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-indigo-500 rounded-2xl blur-xl"
                />
                <div className="relative w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-200">
                  <Activity className="text-white w-8 h-8" />
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full text-indigo-600 text-[9px] font-black uppercase tracking-[0.2em] mb-6 border border-indigo-100/50">
                 <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" /> Platform Active
              </div>

              <h1 className="text-5xl font-black text-slate-900 leading-[1.1] mb-6 tracking-[-0.03em]">
                The smartest way <br />
                <span className="text-indigo-600">to manage teams.</span>
              </h1>

              <p className="text-slate-400 text-base font-bold mb-10 leading-relaxed max-w-md">
                The all-in-one workspace for high-performance teams to track, approve, and grow effortlessly.
              </p>

              <div className="flex items-center gap-10">
                 <div className="flex flex-col">
                    <span className="text-xl font-black text-slate-900 tracking-tight">100%</span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Data Privacy</span>
                 </div>
                 <div className="w-px h-8 bg-slate-200" />
                 <div className="flex flex-col">
                    <span className="text-xl font-black text-slate-900 tracking-tight">24/7</span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Expert Support</span>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Panel: Clean White Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 bg-white border-l border-slate-100 relative">
          <div className="absolute top-10 left-10 lg:hidden">
             <Activity className="w-8 h-8 text-indigo-600" />
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-sm mx-auto"
          >
            <div className="mb-10">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Sign In</h2>
              <p className="text-slate-400 font-bold mt-2 text-sm uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure Portal v4.0
              </p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 ml-1 uppercase tracking-[0.2em]">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-bold text-slate-700 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Password</label>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-[20px] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-bold text-slate-700 placeholder:text-slate-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4.5 bg-indigo-600 text-white font-black uppercase tracking-widest text-xs rounded-[20px] shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 flex items-center justify-center gap-3 mt-6"
              >
                <ArrowRight className="w-6 h-6" /> Enter Dashboard
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-between">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                © 2026 <span className="text-slate-900">Aman</span>
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Server Secure</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
