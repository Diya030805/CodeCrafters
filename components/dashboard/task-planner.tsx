'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Calendar as CalendarIcon, 
  Search,
  Sparkles,
  Bell,
  BellOff,
  BellRing,
  AlertCircle,
  Volume2,
  Check,
  CheckCircle2,
  PartyPopper
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { initialTasks, Task } from '@/src/data/tasks';
import { cn } from '@/lib/utils';
import { glassStyles } from '@/lib/glass';
import { useAccent } from '@/components/accent-provider';
import { useTheme } from '@/components/theme-provider';

const filters = ['All', 'Active', 'Completed', 'Urgent'];

export const categoryMeta: Record<string, { bg: string; border: string; dot: string; label: string }> = {
  Study: {
    bg: 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/20 dark:border-blue-500/30',
    border: 'border-blue-500/20 dark:border-blue-500/30',
    dot: 'bg-blue-500',
    label: 'Study'
  },
  Research: {
    bg: 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/20 dark:border-purple-500/30',
    border: 'border-purple-500/20 dark:border-purple-500/30',
    dot: 'bg-purple-500',
    label: 'Research'
  },
  Coding: {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-500/30',
    border: 'border-emerald-500/20 dark:border-emerald-500/30',
    dot: 'bg-emerald-500',
    label: 'Coding'
  },
  Admin: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/20 dark:border-amber-500/30',
    border: 'border-amber-500/20 dark:border-amber-500/30',
    dot: 'bg-amber-500',
    label: 'Admin'
  },
  Other: {
    bg: 'bg-slate-500/10 dark:bg-slate-500/20 text-slate-600 dark:text-slate-400 border-slate-500/20 dark:border-slate-500/30',
    border: 'border-slate-500/20 dark:border-slate-500/30',
    dot: 'bg-slate-500',
    label: 'Other'
  }
};

export function TaskPlanner() {
  const { darkMode } = useTheme();
  const { accentColor, meta } = useAccent();
  const activeAccentClasses = darkMode ? meta.dark : meta.light;

  const [tasks, setTasks] = React.useState<Task[]>(initialTasks);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [activeFilter, setActiveFilter] = React.useState('All');
  const [activeCategoryFilter, setActiveCategoryFilter] = React.useState('All');
  const [searchQuery, setSearchQuery] = React.useState('');

  // Notification and alarm settings
  const [notifPermission, setNotifPermission] = React.useState<NotificationPermission | 'unsupported'>('default');
  const [testCountdown, setTestCountdown] = React.useState<number | null>(null);

  // Completion celebration states
  const [recentlyCompletedId, setRecentlyCompletedId] = React.useState<string | null>(null);
  const [showCelebrationBanner, setShowCelebrationBanner] = React.useState(false);

  const playCompletionChime = () => {
    if (typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      
      const playNote = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.12, start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + duration);
      };

      playNote(523.25, now, 0.2); // C5
      playNote(659.25, now + 0.08, 0.2); // E5
      playNote(783.99, now + 0.16, 0.35); // G5
    } catch (e) {
      // ignore audio context errors
    }
  };

  const fireConfetti = (isAllDone: boolean = false) => {
    if (typeof window === 'undefined') return;
    
    if (isAllDone) {
      confetti({
        particleCount: 110,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6']
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#10b981', '#f59e0b', '#3b82f6']
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ec4899', '#8b5cf6', '#10b981']
        });
      }, 250);
    } else {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6']
      });
    }
  };
  
  const [newTask, setNewTask] = React.useState<Partial<Task> & { enableReminder?: boolean }>({
    title: '',
    priority: 'medium',
    status: 'todo',
    dueDate: new Date().toISOString().split('T')[0],
    category: 'Study',
    enableReminder: false,
    reminderTime: ''
  });

  // Get current permission on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const isNotifSupported = !('Notification' in window);
      const perm = isNotifSupported ? 'unsupported' : Notification.permission;
      setTimeout(() => {
        setNotifPermission(perm);
      }, 0);
    }
  }, []);

  const getInitialReminderTime = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() + 10); // default to 10 minutes from now
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  };

  const playAlarmSound = () => {
    if (typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.15, start + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + duration);
      };
      
      const now = ctx.currentTime;
      playTone(880, now, 0.4); // A5 note
      playTone(1320, now + 0.15, 0.5); // E6 note
    } catch (e) {
      console.warn("Could not play alarm sound:", e);
    }
  };

  const requestPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    const permission = await Notification.requestPermission();
    setNotifPermission(permission);
  };

  const triggerTestNotification = () => {
    setTestCountdown(5);
  };

  // Test Notification countdown effect
  React.useEffect(() => {
    if (testCountdown === null) return;
    if (testCountdown === 0) {
      setTimeout(() => {
        setTestCountdown(null);
      }, 0);
      playAlarmSound();
      if (typeof window !== 'undefined') {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification("Focus Planner Test Alert", {
            body: "Success! Browser notifications are functional.",
            icon: "/favicon.ico"
          });
        } else {
          alert("Focus Planner Fallback Alert:\nSuccess! Audio and alerts are functional.");
        }
      }
      return;
    }
    const t = setTimeout(() => {
      setTestCountdown(prev => prev !== null ? prev - 1 : null);
    }, 1000);
    return () => clearTimeout(t);
  }, [testCountdown]);

  // Live checker for reminders and alarms
  React.useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      let updated = false;
      const updatedTasks = tasks.map(task => {
        if (task.reminderTime && !task.reminderFired && task.status !== 'completed') {
          const reminderDate = new Date(task.reminderTime);
          if (now >= reminderDate) {
            updated = true;
            playAlarmSound();
            if (typeof window !== 'undefined') {
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(`Focus Alert: ${task.title}`, {
                  body: `Reminder: It is time to start "${task.title}"!`,
                  icon: "/favicon.ico",
                  tag: task.id,
                });
              } else {
                alert(`Focus Planner Alarm:\nTime to start "${task.title}"!`);
              }
            }
            return { ...task, reminderFired: true };
          }
        }
        return task;
      });

      if (updated) {
        setTasks(updatedTasks);
      }
    };

    const intervalId = setInterval(checkReminders, 5000); // Check every 5 seconds
    return () => clearInterval(intervalId);
  }, [tasks]);

  const addTask = () => {
    if (!newTask.title) return;
    const task: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTask.title,
      priority: newTask.priority as any,
      status: newTask.status as any,
      dueDate: newTask.dueDate || new Date().toISOString().split('T')[0],
      category: newTask.category || 'Study',
      reminderTime: newTask.enableReminder ? newTask.reminderTime : undefined,
      reminderFired: false
    };
    setTasks([task, ...tasks]);
    setNewTask({ 
      title: '', 
      priority: 'medium', 
      status: 'todo', 
      dueDate: new Date().toISOString().split('T')[0], 
      category: 'Study',
      enableReminder: false,
      reminderTime: ''
    });
    setIsAddModalOpen(false);
  };

  const updateTask = (updatedTask: Task) => {
    const existingTask = tasks.find(t => t.id === updatedTask.id);
    const isBecomingCompleted = updatedTask.status === 'completed' && existingTask?.status !== 'completed';

    const newTasks = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
    setTasks(newTasks);
    setEditingTask(null);

    if (isBecomingCompleted) {
      const remainingActive = newTasks.filter(t => t.status !== 'completed').length;
      const allCompleted = newTasks.length > 0 && remainingActive === 0;

      playCompletionChime();
      fireConfetti(allCompleted);

      setRecentlyCompletedId(updatedTask.id);
      setTimeout(() => setRecentlyCompletedId(null), 3000);

      if (allCompleted) {
        setShowCelebrationBanner(true);
        setTimeout(() => setShowCelebrationBanner(false), 6000);
      }
    }
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    setEditingTask(null);
  };

  const priorityMeta = {
    low: { color: 'text-emerald-500 border-emerald-500/30', label: 'LOW' },
    medium: { color: 'text-amber-500 border-amber-500/30', label: 'MEDIUM' },
    high: { color: 'text-rose-500 border-rose-500/30', label: 'HIGH' }
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStatus = true;
    if (activeFilter === 'Active') matchesStatus = t.status !== 'completed';
    else if (activeFilter === 'Completed') matchesStatus = t.status === 'completed';
    else if (activeFilter === 'Urgent') matchesStatus = t.priority === 'high';

    let matchesCategory = true;
    if (activeCategoryFilter !== 'All') {
      matchesCategory = t.category === activeCategoryFilter;
    }

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const totalCount = tasks.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className={cn("p-6 space-y-8 relative", glassStyles.container)}>
      {/* Floating Celebration Banner */}
      <AnimatePresence>
        {showCelebrationBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-between shadow-xl backdrop-blur-md z-20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center animate-bounce shadow-lg shadow-emerald-500/30">
                <PartyPopper className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  Daily Goals Met! 🎉
                  <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white rounded-full">
                    100% Streak
                  </span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Outstanding job! You have completed all scheduled tasks for today.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCelebrationBanner(false)}
              className="text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors px-2 py-1"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Stack */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-heading font-bold tracking-tight text-slate-900 dark:text-white mb-1">Focus Planner</h1>
            <p className="text-slate-500 text-sm">Organize your academic trajectory with precision.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative w-64 hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                placeholder="Search tasks..."
                className={cn("w-full pl-11 pr-4 py-2.5 text-sm outline-none", glassStyles.input)}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger nativeButton={true} render={<Button className={cn("rounded-full h-11 px-6 text-white font-bold transition-all duration-300 active:scale-[0.97] shadow-lg cursor-pointer", activeAccentClasses.button)} />}>
                <Plus className="w-4 h-4 mr-2" /> Quick Add
              </DialogTrigger>
              <DialogContent className={cn("sm:max-w-[425px]", glassStyles.container)}>
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">New Focus Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label className="text-slate-700 dark:text-slate-300">Title</Label>
                    <input 
                      className={cn("w-full px-4 py-3 text-sm outline-none", glassStyles.input)}
                      placeholder="Review Quantum Physics Notes"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-700 dark:text-slate-300">Priority</Label>
                      <Select value={newTask.priority} onValueChange={(v) => setNewTask({ ...newTask, priority: v as any })}>
                        <SelectTrigger className={glassStyles.input}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 dark:text-slate-300">Due Date</Label>
                      <input 
                        type="date"
                        className={cn("w-full px-4 py-3 text-sm outline-none", glassStyles.input)}
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 dark:text-slate-300">Category</Label>
                    <Select value={newTask.category || 'Study'} onValueChange={(v) => setNewTask({ ...newTask, category: v as any })}>
                      <SelectTrigger className={glassStyles.input}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Study">Study</SelectItem>
                        <SelectItem value="Research">Research</SelectItem>
                        <SelectItem value="Coding">Coding</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3 pt-3 border-t border-black/[0.04] dark:border-white/[0.04]">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-slate-700 dark:text-slate-300 text-sm font-bold flex items-center gap-2">
                          <Bell className="w-4 h-4 text-slate-500" />
                          Set Alarm Notification
                        </Label>
                        <p className="text-[11px] text-slate-400">Trigger push reminder at exact date & time</p>
                      </div>
                      <input 
                        type="checkbox"
                        className="w-4 h-4 accent-amber-500 cursor-pointer"
                        checked={newTask.enableReminder || false}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setNewTask({ 
                            ...newTask, 
                            enableReminder: checked,
                            reminderTime: checked ? getInitialReminderTime() : ''
                          });
                        }}
                      />
                    </div>
                    {newTask.enableReminder && (
                      <div className="space-y-1.5 animate-fadeIn">
                        <Label className="text-[11px] text-slate-400">Reminder Date & Time</Label>
                        <input 
                          type="datetime-local"
                          className={cn("w-full px-4 py-2.5 text-sm outline-none", glassStyles.input)}
                          value={newTask.reminderTime}
                          onChange={(e) => setNewTask({ ...newTask, reminderTime: e.target.value })}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={addTask} className={cn("w-full rounded-xl py-6 font-bold transition-all duration-300 cursor-pointer", activeAccentClasses.button)}>Launch Task</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Daily Progress Tracker */}
        {totalCount > 0 && (
          <div className="p-4 rounded-2xl bg-slate-200/50 dark:bg-white/[0.03] border border-slate-300/40 dark:border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all duration-300",
                completedCount === totalCount
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 animate-pulse"
                  : "bg-slate-300/50 dark:bg-white/10 text-slate-700 dark:text-slate-300"
              )}>
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  Daily Progress
                  {completedCount === totalCount && (
                    <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-500 text-white rounded-full animate-pulse">
                      Completed! 🎉
                    </span>
                  )}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {completedCount} of {totalCount} tasks finished ({completionPercentage}%)
                </p>
              </div>
            </div>
            <div className="w-full sm:w-52 h-2.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden p-0.5 border border-slate-300/30 dark:border-white/10">
              <motion.div 
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </div>
        )}



        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-black/[0.04] dark:border-white/[0.04] pt-4">
          <div className="flex p-1 bg-slate-200/50 dark:bg-white/[0.03] rounded-full border border-slate-300/40 dark:border-white/[0.05] relative w-fit shrink-0">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-bold transition-all relative z-10 cursor-pointer",
                  activeFilter === filter ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300"
                )}
              >
                {filter}
                {activeFilter === filter && (
                  <motion.div
                    layoutId="filter-bg"
                    className="absolute inset-0 bg-white dark:bg-white/[0.08] border border-slate-200/60 dark:border-white/[0.1] rounded-full shadow-sm dark:shadow-none -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <motion.div
                key={`${task.id}-${accentColor}`}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  scale: task.status === 'completed' ? [1, 1.01, 1] : 1,
                  transition: { 
                    scale: { duration: 0.4, ease: "easeOut" }
                  }
                }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 30,
                  layout: { duration: 0.4, type: "spring", stiffness: 300, damping: 30 }
                }}
              >
                <div className={cn(
                  "group overflow-hidden active:scale-[0.99] flex items-center justify-between transition-all duration-500 relative", 
                  glassStyles.card,
                  task.status === 'completed' && "border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10",
                  recentlyCompletedId === task.id && "ring-2 ring-emerald-500/60 shadow-[0_0_25px_rgba(16,185,129,0.35)]"
                )}>
                  {/* Floating "+10 XP" or "Completed!" badge on completion */}
                  <AnimatePresence>
                    {recentlyCompletedId === task.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: -28, scale: 1 }}
                        exit={{ opacity: 0, y: -35, scale: 0.8 }}
                        transition={{ duration: 0.5, ease: "backOut" }}
                        className="absolute right-14 top-3 px-2.5 py-1 rounded-full bg-emerald-500 text-white font-extrabold text-[11px] shadow-lg flex items-center gap-1 z-20 pointer-events-none"
                      >
                        <Sparkles className="w-3 h-3 animate-spin" /> Completed! +10 XP
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Success Pulse Effect */}
                  <AnimatePresence>
                    {task.status === 'completed' && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.2, 1] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 bg-emerald-500/10 blur-2xl pointer-events-none"
                      />
                    )}
                  </AnimatePresence>
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "px-2 py-0.5 rounded border text-[10px] font-black tracking-tighter",
                          priorityMeta[task.priority].color
                        )}>
                          {priorityMeta[task.priority].label}
                        </span>
                        {task.category && (
                          <span className={cn(
                            "px-2 py-0.5 rounded border text-[10px] font-bold tracking-tighter flex items-center gap-1",
                            categoryMeta[task.category]?.bg || categoryMeta['Other'].bg
                          )}>
                            <span className={cn("w-1 h-1 rounded-full", categoryMeta[task.category]?.dot || categoryMeta['Other'].dot)} />
                            {task.category}
                          </span>
                        )}
                        <h3 className={cn(
                          "font-bold text-sm tracking-tight transition-all duration-300",
                          task.status === 'completed' ? "text-slate-400 dark:text-slate-500 line-through" : "text-slate-800 dark:text-white"
                        )}>
                          {task.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-4 text-slate-500 flex-wrap">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold">
                          <CalendarIcon className={cn("w-3.5 h-3.5 transition-all duration-300", activeAccentClasses.text)} />
                          {task.dueDate}
                        </div>
                        {task.reminderTime && (
                          <div className={cn(
                            "flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md border transition-all duration-300",
                            task.reminderFired 
                              ? "bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-slate-500 border-slate-200 dark:border-white/10" 
                              : "bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse"
                          )}>
                            <Bell className={cn("w-3 h-3", !task.reminderFired && "animate-bounce text-rose-500")} />
                            <span>
                              Alarm: {new Date(task.reminderTime).toLocaleDateString([], { month: 'short', day: 'numeric' })} at {new Date(task.reminderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {task.status !== 'completed' ? (
                      <motion.button 
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => updateTask({ ...task, status: 'completed' })}
                        className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer shadow-sm hover:shadow-emerald-500/30"
                        title="Mark Complete"
                      >
                        <Plus className="w-4 h-4 rotate-45 scale-125" />
                      </motion.button>
                    ) : (
                      <motion.button 
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => updateTask({ ...task, status: 'todo' })}
                        className="w-9 h-9 rounded-full bg-emerald-500 text-white border border-emerald-400 flex items-center justify-center transition-all cursor-pointer shadow-md shadow-emerald-500/20"
                        title="Mark Incomplete"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </motion.button>
                    )}
                    <button 
                      onClick={() => setEditingTask(task)}
                      className={cn(
                        "w-10 h-10 rounded-full bg-slate-200/50 dark:bg-white/5 border border-slate-300/30 dark:border-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-all duration-300 cursor-pointer",
                        accentColor === 'amber' && "hover:text-amber-600 hover:bg-amber-600/10",
                        accentColor === 'blue' && "hover:text-blue-600 hover:bg-blue-600/10",
                        accentColor === 'green' && "hover:text-emerald-600 hover:bg-emerald-600/10",
                        accentColor === 'crimson' && "hover:text-rose-600 hover:bg-rose-600/10"
                      )}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              key="empty-state"
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col items-center justify-center py-14 px-6 text-center border border-dashed border-slate-200 dark:border-white/[0.08] rounded-[24px] bg-slate-100/40 dark:bg-white/[0.01] backdrop-blur-sm"
            >
              <div className="relative mb-6">
                {/* Glowing Background Radial */}
                <div className={cn("absolute -inset-2 blur-xl rounded-full transition-all duration-300", 
                  accentColor === 'amber' && "bg-amber-500/10",
                  accentColor === 'blue' && "bg-blue-500/10",
                  accentColor === 'green' && "bg-emerald-500/10",
                  accentColor === 'crimson' && "bg-rose-500/10"
                )} />
                <div className={cn("relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300", activeAccentClasses.highlight)}>
                  <Sparkles className="w-8 h-8 animate-pulse" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 tracking-tight">No Focus Tasks Found</h3>
              <p className="text-slate-400 text-sm max-w-sm mb-6 leading-relaxed">
                {activeFilter === 'Completed' ? (
                  "You haven't completed any tasks yet. Keep pushing towards your goals!"
                ) : activeFilter === 'Urgent' ? (
                  "No critical items on your radar right now. Nice job keeping the pressure off!"
                ) : searchQuery ? (
                  "We couldn't find any tasks matching your current search criteria."
                ) : (
                  "Your workspace is completely clear. Ready to plan your next academic milestone?"
                )}
              </p>
              {!searchQuery && activeFilter !== 'Completed' && (
                <Button 
                  onClick={() => setIsAddModalOpen(true)}
                  className={cn("rounded-full h-10 px-6 text-white font-bold transition-all duration-300 active:scale-[0.97] shadow-lg cursor-pointer", activeAccentClasses.button)}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Focus Task
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <DialogContent className={cn("sm:max-w-[425px]", glassStyles.container)}>
          <DialogHeader>
            <DialogTitle>Update Strategy</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <input 
                  className={cn("w-full px-4 py-3 text-sm outline-none", glassStyles.input)}
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={editingTask.priority} onValueChange={(v) => setEditingTask({ ...editingTask, priority: v as any })}>
                    <SelectTrigger className={glassStyles.input}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={editingTask.status} onValueChange={(v) => setEditingTask({ ...editingTask, status: v as any })}>
                    <SelectTrigger className={glassStyles.input}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">Todo</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={editingTask.category || 'Study'} onValueChange={(v) => editingTask && setEditingTask({ ...editingTask, category: v as any })}>
                  <SelectTrigger className={glassStyles.input}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Study">Study</SelectItem>
                    <SelectItem value="Research">Research</SelectItem>
                    <SelectItem value="Coding">Coding</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3 pt-3 border-t border-black/[0.04] dark:border-white/[0.04]">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-slate-700 dark:text-slate-300 text-sm font-bold flex items-center gap-2">
                      <Bell className="w-4 h-4 text-slate-500" />
                      Set Alarm Notification
                    </Label>
                    <p className="text-[11px] text-slate-400">Trigger push reminder at exact date & time</p>
                  </div>
                  <input 
                    type="checkbox"
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                    checked={editingTask.reminderTime !== undefined && editingTask.reminderTime !== ''}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setEditingTask({ 
                        ...editingTask, 
                        reminderTime: checked ? getInitialReminderTime() : undefined,
                        reminderFired: checked ? false : undefined
                      });
                    }}
                  />
                </div>
                {editingTask.reminderTime !== undefined && editingTask.reminderTime !== null && (
                  <div className="space-y-1.5 animate-fadeIn">
                    <Label className="text-[11px] text-slate-400">Reminder Date & Time</Label>
                    <input 
                      type="datetime-local"
                      className={cn("w-full px-4 py-2.5 text-sm outline-none", glassStyles.input)}
                      value={editingTask.reminderTime || ''}
                      onChange={(e) => setEditingTask({ ...editingTask, reminderTime: e.target.value, reminderFired: false })}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" className="text-rose-500 hover:bg-rose-500/10 hover:text-rose-500 rounded-xl" onClick={() => editingTask && deleteTask(editingTask.id)}>
              <Trash2 className="w-4 h-4 mr-2" /> Terminate
            </Button>
            <Button className={cn("rounded-xl transition-all duration-300 cursor-pointer", activeAccentClasses.button)} onClick={() => editingTask && updateTask(editingTask)}>Apply Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
