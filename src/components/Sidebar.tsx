'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  ClipboardList, 
  PlusSquare, 
  Users, 
  LogOut,
  User,
  Settings,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Manage Tasks', href: '/tasks', icon: ClipboardList },
  { label: 'Team Members', href: '/team', icon: Users },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Filter items based on role
  const visibleItems = [...navItems];
  if (user?.role === 'admin') {
    // Insert Create Task for Admins
    visibleItems.splice(2, 0, { label: 'Create Task', href: '/tasks/create', icon: PlusSquare });
  }
  const isPublicPage = pathname === '/login' || 
                       pathname === '/signup' || 
                       pathname === '/forgot-password' || 
                       pathname.startsWith('/reset-password');

  if (isPublicPage) return null;

  return (
    <div className="flex h-screen w-72 flex-col bg-white border-r border-border/50 sticky top-0">
      <div className="p-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-linear-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:rotate-12 transition-transform duration-300">
            <span className="text-xl font-black">T</span>
          </div>
          <span className="text-xl font-black tracking-tight text-foreground">Task Manager</span>
        </Link>
      </div>

      <div className="px-6 py-4">
        <div className="p-4 bg-muted/50 rounded-[20px] border border-border flex items-center gap-4 group cursor-pointer hover:bg-muted transition-colors">
          <div className="relative">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center border-2 border-white shadow-sm">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-indigo-600" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1 overflow-hidden">
            <h2 className="text-sm font-bold text-foreground truncate">{user?.name || 'Aman'}</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{user?.role || 'Guest'}</p>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 mt-6 space-y-1.5">
        <p className="px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Main Menu</p>
        {visibleItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between px-4 py-3 text-sm font-bold rounded-xl transition-all duration-300",
                isActive 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-muted-foreground group-hover:text-indigo-600")} />
                {item.label}
              </div>
              {isActive && (
                <motion.div layoutId="active-pill">
                  <ChevronRight className="w-4 h-4 text-white/70" />
                </motion.div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6">
        <button 
          onClick={logout}
          className="flex w-full items-center gap-3 px-4 py-4 text-sm font-bold text-red-500 bg-red-50 rounded-2xl transition-all hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-200"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
