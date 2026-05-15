'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  AreaChart,
  Area,
  Sector
} from 'recharts';
import { 
  CheckCircle2, 
  Clock, 
  Activity, 
  ClipboardList,
  Bell,
  TrendingUp,
  Plus,
  X,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Task {
  _id: string;
  status: 'pending' | 'in-progress' | 'pending-approval' | 'completed';
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  assignedTo: { name: string };
  createdAt: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 8} startAngle={startAngle} endAngle={endAngle} fill={fill} />
      <Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={outerRadius + 10} outerRadius={outerRadius + 14} fill={fill} />
    </g>
  );
};

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
  sender: { name: string; avatar?: string };
}

export default function Dashboard() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [taskRes, notifRes] = await Promise.all([
        fetch('http://localhost:5000/api/tasks', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/notifications', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      const [taskData, notifData] = await Promise.all([taskRes.json(), notifRes.json()]);
      
      if (taskRes.ok) setTasks(taskData.data.tasks);
      if (notifRes.ok) setNotifications(notifData.data.notifications);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchDashboardData();
  }, [token]);

  const handleNotificationClick = async (notif: Notification) => {
    try {
      // Mark as read in backend
      await fetch(`http://localhost:5000/api/notifications/${notif._id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      setNotifications(notifications.map(n => n._id === notif._id ? { ...n, isRead: true } : n));
      
      // Navigate to task page
      if (notif.link) router.push(notif.link);
      
      // Close dropdown
      setShowNotifications(false);
    } catch (err) {
      console.error('Error handling notification click:', err);
    }
  };

  const markAllRead = async () => {
    try {
      await fetch('http://localhost:5000/api/notifications/mark-all-read', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const stats = [
    { label: 'Total Tasks', value: tasks.length, icon: ClipboardList, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+12%' },
    { label: 'Pending', value: tasks.filter(t => t.status === 'pending').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', trend: '+5%' },
    { label: 'Approval Required', value: tasks.filter(t => t.status === 'pending-approval').length, icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50', trend: '-2%' },
    { label: 'Completed', value: tasks.filter(t => t.status === 'completed').length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+20%' },
  ];

  const distributionData = [
    { name: 'Pending', value: tasks.filter(t => t.status === 'pending').length, color: '#6366f1' },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, color: '#a855f7' },
    { name: 'Approval Required', value: tasks.filter(t => t.status === 'pending-approval').length, color: '#f59e0b' },
    { name: 'Completed', value: tasks.filter(t => t.status === 'completed').length, color: '#10b981' },
  ];

  const priorityData = [
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: '#10b981' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: '#f59e0b' },
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: '#ef4444' },
  ];

  // Mock performance data (since we don't have historical aggregation yet)
  const performanceData = [
    { name: 'Mon', tasks: 4 }, { name: 'Tue', tasks: 7 }, { name: 'Wed', tasks: 5 },
    { name: 'Thu', tasks: 9 }, { name: 'Fri', tasks: 12 }, { name: 'Sat', tasks: 8 }, { name: 'Sun', tasks: 10 },
  ];

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' });

  const unreadCount = notifications.filter(n => !n.isRead).length;


  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-8 space-y-8 max-w-7xl mx-auto pb-10">
      {/* Advanced Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            Hey <span className="gradient-text">{user?.name?.split(' ')[0] || 'User'}</span> 👋
          </h1>
          <p className="text-muted-foreground font-medium">{today} • Team Performance Overview</p>
        </div>
        
        <div className="flex items-center gap-3 relative">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 bg-white border border-border rounded-xl text-muted-foreground hover:text-primary transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>

            {/* Notification Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-80 bg-white rounded-[24px] shadow-2xl border border-border z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
                    <h3 className="font-bold text-sm">Notifications ({unreadCount})</h3>
                    <button onClick={() => setShowNotifications(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-xs text-muted-foreground font-medium">No notifications yet</div>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n._id} 
                          onClick={() => handleNotificationClick(n)}
                          className={`p-4 border-b border-border last:border-0 hover:bg-muted/10 transition-colors cursor-pointer flex gap-3 ${!n.isRead ? 'bg-indigo-50/30' : ''}`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            n.type === 'task_completed' ? 'bg-amber-100 text-amber-600' :
                            n.type === 'task_approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'
                          }`}>
                            <MessageSquare className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold">{n.title}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{n.message}</p>
                            <p className="text-[9px] text-indigo-600 font-bold mt-1 uppercase tracking-tighter">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="p-3 text-center bg-muted/30">
                      <button onClick={markAllRead} className="text-[10px] font-bold text-primary hover:underline">Mark all as read</button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/tasks/create">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
              <Plus className="w-5 h-5" /> New Task
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={itemVariants} className="glass-card hover-lift p-6 rounded-[20px] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-2xl ${stat.bg}`}><stat.icon className={`w-6 h-6 ${stat.color}`} /></div>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full"><TrendingUp className="w-3 h-3" />{stat.trend}</div>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-3xl font-black text-foreground mt-1">{loading ? '...' : stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-card p-8 rounded-[20px]">
          <div className="flex items-center justify-between mb-8"><h2 className="text-xl font-bold">Team Productivity</h2></div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs><linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="tasks" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorTasks)" style={{ cursor: 'pointer', outline: 'none' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card p-8 rounded-[20px] outline-none">
          <h2 className="text-xl font-bold mb-8">Task Status</h2>
          <div className="h-[300px] w-full outline-none focus:outline-none">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  {...(activeIndex !== null ? { activeIndex } : {})}
                  activeShape={renderActiveShape} 
                  data={distributionData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={70} 
                  outerRadius={100} 
                  paddingAngle={8} 
                  dataKey="value" 
                  stroke="none" 
                  onMouseEnter={(_, i) => setActiveIndex(i)} 
                  onMouseLeave={() => setActiveIndex(null)} 
                  style={{ cursor: 'pointer', outline: 'none' }}
                >
                  {distributionData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Legend iconType="circle" verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div variants={itemVariants} className="glass-card p-8 rounded-[20px]">
          <div className="flex items-center justify-between mb-8"><h2 className="text-xl font-bold">Recent Tasks</h2></div>
          <div className="space-y-6">
            {tasks.slice(0, 3).map((task) => (
              <div key={task._id} className="flex items-start gap-4 group cursor-pointer">
                <div className="mt-1 w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><TrendingUp className="w-5 h-5" /></div>
                <div className="flex-1 border-b border-border pb-4 last:border-0">
                  <div className="flex justify-between items-start"><h4 className="font-bold text-foreground">{task.title}</h4><span className="text-xs text-muted-foreground font-medium">New</span></div>
                  <p className="text-sm text-muted-foreground mt-1">Assigned to <span className="text-indigo-600 font-semibold">{task.assignedTo?.name}</span></p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card p-8 rounded-[20px]">
          <h2 className="text-xl font-bold mb-8">Task Priorities</h2>
          <div className="h-[300px] w-full outline-none focus:outline-none">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'rgba(0,0,0,0.02)'}} contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={40} style={{ cursor: 'pointer', outline: 'none' }}>
                  {priorityData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
