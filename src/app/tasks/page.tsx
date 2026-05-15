'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Trash2,
  ChevronDown,
  Activity,
  Search,
  XCircle
} from 'lucide-react';
import { API_ENDPOINTS } from '@/lib/api';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'pending-approval' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignedTo: {
    _id: string;
    name: string;
    email: string;
  };
}

export default function ManageTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { token, user } = useAuth();

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchTasks = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.TASKS, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setTasks(data.data.tasks);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    setUpdatingId(taskId);
    try {
      const res = await fetch(`${API_ENDPOINTS.TASKS}/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (res.ok) {
        setTasks(tasks.map(t => t._id === taskId ? data.data.task : t));
      } else {
        alert(data.message || 'Failed to update task');
      }
    } catch (err) {
      console.error('Error updating task:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleApprove = async (taskId: string) => {
    setUpdatingId(taskId);
    try {
      const res = await fetch(`${API_ENDPOINTS.TASKS}/${taskId}/approve`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setTasks(tasks.map(t => t._id === taskId ? data.data.task : t));
      }
    } catch (err) {
      console.error('Error approving task:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDecline = async (taskId: string) => {
    setUpdatingId(taskId);
    try {
      const res = await fetch(`${API_ENDPOINTS.TASKS}/${taskId}/decline`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setTasks(tasks.map(t => t._id === taskId ? data.data.task : t));
      }
    } catch (err) {
      console.error('Error declining task:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      const res = await fetch(`${API_ENDPOINTS.TASKS}/${taskId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setTasks(tasks.filter(t => t._id !== taskId));
      }
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'high': return 'text-red-600 bg-red-50 border-red-100';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'low': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Manage <span className="gradient-text">Tasks</span></h1>
          <p className="text-muted-foreground font-medium mt-1">
            {user?.role === 'admin' ? 'Monitor and manage team assignments.' : 'Track and update your assigned tasks.'}
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search by title or info..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </header>

      {filteredTasks.length === 0 ? (
        <div className="glass-card p-20 rounded-[32px] text-center space-y-4">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto text-muted-foreground">
            <ClipboardList className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold">{searchTerm ? 'No matches found' : 'No tasks found'}</h3>
          <p className="text-muted-foreground">{searchTerm ? `We couldn't find any tasks matching "${searchTerm}"` : 'Tasks assigned to you will appear here.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredTasks.map((task) => (
            <motion.div 
              layout
              key={task._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-6 rounded-[24px] flex flex-col md:flex-row items-start md:items-center gap-6 hover-lift transition-all"
            >
              <div className={`p-4 rounded-2xl hidden md:block ${
                task.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 
                task.status === 'pending-approval' ? 'bg-amber-100 text-amber-600 animate-pulse' :
                task.status === 'in-progress' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-600'
              }`}>
                {task.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : 
                 task.status === 'pending-approval' ? <Clock className="w-6 h-6" /> :
                 task.status === 'in-progress' ? <Activity className="w-6 h-6" /> : <ClipboardList className="w-6 h-6" />}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-foreground">{task.title}</h3>
                  <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  {task.status === 'pending-approval' && (
                    <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500 text-white shadow-lg shadow-amber-100">
                      Awaiting Approval
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">{task.description || 'No description provided.'}</p>
                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-medium text-muted-foreground">
                   <div className="flex items-center gap-1.5">
                     <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-[10px]">
                       {task.assignedTo?.name?.[0]}
                     </div>
                     <span>{task.assignedTo?.name}</span>
                   </div>
                   <span>•</span>
                   <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-border">
                {task.status === 'pending-approval' && user?.role === 'admin' ? (
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <button 
                      disabled={updatingId === task._id}
                      onClick={() => handleApprove(task._id)}
                      className="flex-1 md:flex-none px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                    >
                      {updatingId === task._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> Approve</>}
                    </button>
                    <button 
                      disabled={updatingId === task._id}
                      onClick={() => handleDecline(task._id)}
                      className="flex-1 md:flex-none px-6 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-red-100 hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                    >
                      {updatingId === task._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><XCircle className="w-4 h-4" /> Decline</>}
                    </button>
                  </div>
                ) : (
                  <div className="relative group flex-1 md:flex-none">
                    <select 
                      disabled={updatingId === task._id || (task.status === 'completed' && user?.role !== 'admin') || (task.status === 'pending-approval' && user?.role !== 'admin')}
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      className={`w-full md:w-44 pl-4 pr-10 py-2.5 bg-muted/50 border border-border rounded-xl text-sm font-bold appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20 ${
                        task.status === 'completed' ? 'text-emerald-600' : 
                        task.status === 'pending-approval' ? 'text-amber-600' : 'text-slate-600'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      {task.status === 'pending-approval' && <option value="pending-approval">Pending Approval</option>}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
                  </div>
                )}

                {user?.role === 'admin' && (
                  <button 
                    onClick={() => handleDelete(task._id)}
                    className="p-2.5 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
