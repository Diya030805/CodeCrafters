'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Calendar,
  Clock,
  Activity,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Info,
  Flame,
  Play,
  ArrowRight,
  CheckSquare,
  History,
  BrainCircuit,
  RotateCcw,
  Plus,
  Award,
  Sparkle,
  Check,
  Zap,
  BookOpen,
  ArrowRightLeft,
  Search,
  MessageSquare,
  FileCode,
  Sliders,
  Bell
} from 'lucide-react';
import { useAccent } from '@/components/accent-provider';
import { cn } from '@/lib/utils';
import { StreakCounter } from '@/components/dashboard/streak-counter';
import { DailyWisdom } from '@/components/dashboard/daily-wisdom';

interface Task {
  id: number;
  text: string;
  category: string;
  completed: boolean;
}

export function DashboardOverview() {
  const { meta } = useAccent();
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [activeQuickAction, setActiveQuickAction] = React.useState<string | null>(null);

  // Daily learning hours (target: 4.0h)
  const [achievedHours, setAchievedHours] = React.useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('study_achieved_hours');
      if (saved) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed)) return parsed;
      }
    }
    return 2.5;
  });
  const targetHours = 4.0;

  // Active learning streak
  const [streakCount, setStreakCount] = React.useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('study_streak_count');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed)) return parsed;
      }
    }
    return 14;
  });

  const [streakLastLogged, setStreakLastLogged] = React.useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('study_streak_last_logged');
      if (saved) return saved;
    }
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  });

  const todayStr = React.useMemo(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  const isStreakLoggedToday = streakLastLogged === todayStr;

  // Daily tasks checklist
  const [tasks, setTasks] = React.useState<Task[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('study_dashboard_tasks');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          // Fall back to default
        }
      }
    }
    return [
      { id: 1, text: "Review RAG vector search fine-tuning nodes", category: "AI Core", completed: true },
      { id: 2, text: "Practice 15 flashcards on Dot-Product Attention", category: "Mathematics", completed: false },
      { id: 3, text: "Upload neural network lecture audio recording", category: "Lecture", completed: false },
      { id: 4, text: "Engage in active recall session with Aria AI", category: "Review", completed: true },
    ];
  });

  React.useEffect(() => {
    localStorage.setItem('study_dashboard_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const completedTasksCount = tasks.filter(t => t.completed).length;
  const totalTasksCount = tasks.length;

  const claimStreak = React.useCallback(() => {
    if (streakLastLogged === todayStr) return;
    setStreakCount(prev => {
      const next = prev + 1;
      localStorage.setItem('study_streak_count', next.toString());
      return next;
    });
    setStreakLastLogged(todayStr);
    localStorage.setItem('study_streak_last_logged', todayStr);
  }, [streakLastLogged, todayStr]);

  const resetStreak = () => {
    setStreakCount(0);
    localStorage.setItem('study_streak_count', '0');
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const dateStr = twoDaysAgo.toISOString().split('T')[0];
    setStreakLastLogged(dateStr);
    localStorage.setItem('study_streak_last_logged', dateStr);
  };

  // Auto streak lock if goal hours achieved
  React.useEffect(() => {
    if (achievedHours >= targetHours && streakLastLogged !== todayStr) {
      const t = setTimeout(() => {
        claimStreak();
      }, 300);
      return () => clearTimeout(t);
    }
  }, [achievedHours, targetHours, streakLastLogged, todayStr, claimStreak]);

  const addHalfHour = () => {
    setAchievedHours(prev => {
      const next = Math.min(targetHours, Number((prev + 0.5).toFixed(1)));
      localStorage.setItem('study_achieved_hours', next.toString());
      return next;
    });
  };

  const resetGoal = () => {
    setAchievedHours(0);
    localStorage.setItem('study_achieved_hours', '0');
  };

  const progressPercent = Math.min(100, Math.round((achievedHours / targetHours) * 100));

  // Analytics retention data (10 steps)
  const histogramData = [58, 64, 71, 79, 74, 85, 91, 88, 95, 94];

  // Motion variants with const types to satisfy the compiler
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.03
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 350, damping: 26 }
    }
  };

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    let active = true;
    requestAnimationFrame(() => {
      if (active) setMounted(true);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-10 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto animate-pulse">
        <div className="h-20 rounded-2xl bg-[color:var(--bg-secondary)]" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-40 rounded-3xl bg-[color:var(--bg-secondary)]" />
          <div className="h-40 rounded-3xl bg-[color:var(--bg-secondary)]" />
          <div className="h-40 rounded-3xl bg-[color:var(--bg-secondary)]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto transition-all duration-300 ease-in-out text-[color:var(--text-primary)] selection:bg-[color:var(--accent)]/20">

      {/* HEADER BAR: Clean typographic layout with current time, user profile card & notifications */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-[color:var(--border)]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded bg-[color:var(--bg-secondary)] text-[color:var(--text-secondary)] border border-[color:var(--border)]">
              Workspace Active
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <motion.h1
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-2xl sm:text-3xl font-black text-[color:var(--text-primary)] tracking-tight"
          >
            Welcome Back, <span className="text-[color:var(--text-primary)] relative font-extrabold">
              Diya
            </span>
          </motion.h1>
          <p className="text-[color:var(--text-secondary)] text-xs sm:text-sm font-medium tracking-tight">
            Here is your adaptive coaching overview. Aria has mapped out 2 critical learning directives for today.
          </p>
        </div>

        {/* Status Hub / Calculation Engine */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center gap-4 shrink-0"
        >
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-[10px] font-bold text-[color:var(--text-secondary)] uppercase tracking-wider">Aria AI Version</span>
            <span className="text-xs font-black text-white">v3.5 Active</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[color:var(--bg-secondary)] border border-[color:var(--border)] shadow-xl">
            <div className="h-2 w-2 rounded-full bg-amber-500" style={{ backgroundColor: meta.hex }} />
            <span className="text-xs font-extrabold text-[color:var(--text-secondary)]">Synced</span>
          </div>
        </motion.div>
      </div>

      {/* COACH CHAT BANNER: Premium, original, interactive prompt box representing the AI coach */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="show"
        className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-[color:var(--card-bg)] border border-[color:var(--border)] p-6 sm:p-8 shadow-2xl group"
        style={{ backgroundImage: `linear-gradient(135deg, ${meta.hex}15, transparent 42%)` }}
      >
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-[color:var(--accent)]/10 blur-3xl pointer-events-none transition-all duration-700" />
        <div className="absolute bottom-0 left-12 h-32 w-32 rounded-full bg-[color:var(--accent)]/05 blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start gap-5 relative z-10">
          {/* Aria AI Avatar */}
          <div className="relative shrink-0 mt-1">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, ${meta.hex}, #ffffff33)` }}>
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[color:var(--card-bg)] flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>

          {/* Coach text bubbles */}
          <div className="space-y-4 flex-1">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white tracking-wide">Aria (AI Academic Coach)</span>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-amber-500/90" style={{ color: meta.hex }}>Adaptive Prompt</span>
              </div>
              <p className="text-[color:var(--text-secondary)] text-sm leading-relaxed font-medium">
                &ldquo;Your recall velocity on <strong className="text-white font-black">Transformers Architecture</strong> has accelerated by <span className="text-emerald-400 font-extrabold">+14.8%</span>. However, your temporal decay model suggests reviewing <strong className="text-white font-black">Multi-Head Attention</strong> within 8 hours to avoid neural forgetting.&rdquo;
              </p>
            </div>

            {/* Quick Actions / Micro interactions */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              {[
                { label: "Practice Flashcards", icon: BookOpen, tag: "flashcard" },
                { label: "Analyze Notes PDF", icon: Zap, tag: "notes" },
                { label: "Start AI Tutor Chat", icon: MessageSquare, tag: "chat" },
                { label: "Calibrate Metrics", icon: Sliders, tag: "metrics" }
              ].map((btn) => {
                const Icon = btn.icon;
                const isActive = activeQuickAction === btn.tag;
                return (
                  <motion.button
                    key={btn.label}
                    onClick={() => setActiveQuickAction(isActive ? null : btn.tag)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold tracking-tight transition-all border duration-200 cursor-pointer",
                      isActive
                        ? "bg-[color:var(--accent)] text-white border-[color:var(--accent)]"
                        : "bg-[color:var(--bg-secondary)] text-[color:var(--text-secondary)] border-[color:var(--border)] hover:bg-[color:var(--bg-primary)] hover:text-[color:var(--text-primary)]"
                    )}
                  >
                    <Icon className={cn("w-3.5 h-3.5", isActive ? "text-black" : "text-[color:var(--text-secondary)]")} />
                    <span>{btn.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dynamic inline container triggered by quick action */}
        <AnimatePresence>
          {activeQuickAction && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-5 border-t border-[color:var(--border)] overflow-hidden"
            >
              {activeQuickAction === "flashcard" && (
                <div className="p-4 rounded-2xl bg-[color:var(--bg-secondary)] border border-[color:var(--border)] space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black text-white uppercase tracking-wider">Transformer Decay Block Flashcards</p>
                    <span className="text-[10px] font-bold text-amber-500" style={{ color: meta.hex }}>15 critical cards pending</span>
                  </div>
                  <p className="text-[color:var(--text-secondary)] text-xs font-medium">This set contains automated feedback prompts designed by Aria specifically for your weak nodes from last week&apos;s quiz.</p>
                  <div className="flex items-center gap-3 pt-1">
                    <button className="px-4 py-2 rounded-xl text-xs font-black bg-[color:var(--accent)] text-white hover:brightness-110 transition-all cursor-pointer">Start Practice Drift</button>
                    <button className="px-4 py-2 rounded-xl text-xs font-bold text-[color:var(--text-secondary)] hover:text-white transition-all cursor-pointer">Preview Deck</button>
                  </div>
                </div>
              )}
              {activeQuickAction === "notes" && (
                <div className="p-4 rounded-2xl bg-[color:var(--bg-secondary)] border border-[color:var(--border)] space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black text-white uppercase tracking-wider">Lecture Upload Portal</p>
                    <span className="text-[10px] text-emerald-400 font-bold">Ready to ingest (PDF, MP3, TXT)</span>
                  </div>
                  <div className="border border-dashed border-[color:var(--border)] hover:border-[color:var(--text-secondary)] p-5 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all">
                    <Zap className="w-5 h-5 text-[color:var(--text-secondary)] animate-bounce" />
                    <span className="text-xs font-bold text-[color:var(--text-secondary)]">Drag &amp; drop files here, or click to upload</span>
                  </div>
                </div>
              )}
              {activeQuickAction === "chat" && (
                <div className="p-4 rounded-2xl bg-[color:var(--bg-secondary)] border border-[color:var(--border)] space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black text-white uppercase tracking-wider">Direct Study Channel with Aria</p>
                    <span className="text-[10px] font-bold text-[color:var(--text-secondary)]">Standby mode</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ask Aria to synthesize a topic or design a study track..."
                      className="flex-1 px-4 py-2 text-xs rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border)] focus:outline-none focus:border-amber-500/50 text-white placeholder-[color:var(--text-secondary)]"
                    />
                    <button className="px-4 py-2 rounded-xl text-xs font-black bg-[color:var(--accent)] text-white hover:brightness-110 cursor-pointer">Send</button>
                  </div>
                </div>
              )}
              {activeQuickAction === "metrics" && (
                <div className="p-4 rounded-2xl bg-[color:var(--bg-secondary)] border border-[color:var(--border)] grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-[color:var(--bg-primary)] border border-[color:var(--border)]">
                    <span className="text-[9px] font-bold text-[color:var(--text-secondary)] block mb-1">STABILITY index</span>
                    <span className="text-sm font-black text-white">94% Stable</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[color:var(--bg-primary)] border border-[color:var(--border)]">
                    <span className="text-[9px] font-bold text-[color:var(--text-secondary)] block mb-1">DECAY constant</span>
                    <span className="text-sm font-black text-white">0.024/hr</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[color:var(--bg-primary)] border border-[color:var(--border)]">
                    <span className="text-[9px] font-bold text-[color:var(--text-secondary)] block mb-1">ACTIVE recall cycles</span>
                    <span className="text-sm font-black text-white">8 Runs This Week</span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* DAILY LEARNING STREAK COUNTER COMPONENT */}
      <StreakCounter />

      {/* DAILY WISDOM & PRODUCTIVITY TIP WIDGET */}
      <DailyWisdom />

      {/* ASYMMETRIC GRID ABOVE THE FOLD: Two components of staggered size */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
      >

        {/* LEFT COLUMN (8 cols): Hero "Continue Learning" */}
        <motion.div
          variants={itemVariants}
          whileHover={{
            y: -3,
            borderColor: `${meta.hex}25`,
            boxShadow: `0 20px 45px -15px rgba(0,0,0,0.6), 0 0 50px -10px ${meta.hex}08`
          }}
          className="lg:col-span-8 relative group backdrop-blur-xl bg-[color:var(--card-bg)]/80 border border-[color:var(--border)] rounded-3xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-300"
        >
          {/* Glow backdrop */}
          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-orange-500/[0.02] blur-3xl pointer-events-none group-hover:bg-orange-500/[0.03] transition-all" />

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" style={{ backgroundColor: meta.hex }} />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" style={{ backgroundColor: meta.hex }} />
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-amber-500/90" style={{ color: meta.hex }}>
                  Primary Study Track
                </span>
              </div>
              <span className="text-[10px] font-bold text-[color:var(--text-secondary)]">Updated 4 hours ago</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight group-hover:text-amber-500 transition-colors">
                Advanced Generative AI &amp; LLM Orchestration
              </h2>
              <p className="text-[color:var(--text-secondary)] text-xs sm:text-sm font-medium leading-relaxed max-w-xl">
                Deep dive into custom fine-tuning processes, Retrieval-Augmented Generation (RAG) vector stores, and multi-agent workflow routing pipelines.
              </p>
            </div>

            {/* Course Progress Arc / Visual bar */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[color:var(--text-secondary)] uppercase tracking-wider">Course Progress</span>
                <span className="text-white font-extrabold">74% Complete</span>
              </div>
              <div className="bg-[color:var(--bg-secondary)] h-2 rounded-full overflow-hidden border border-[color:var(--border)] p-[1px]">
                <motion.div
                  className="h-full rounded-full relative"
                  style={{ backgroundColor: meta.hex }}
                  initial={{ width: 0 }}
                  animate={{ width: "74%" }}
                  transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[pulse_2.5s_infinite]" />
                </motion.div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-[color:var(--text-secondary)] font-bold">
                <span>Module 4: Transformers &amp; Attention Blocks</span>
                <span>3 modules remaining</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-[color:var(--border)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border)] flex items-center justify-center shrink-0">
                <BrainCircuit className="w-4.5 h-4.5 text-[color:var(--text-secondary)]" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-[color:var(--text-secondary)] uppercase tracking-widest leading-none mb-1">Next Lesson</p>
                <p className="text-xs font-extrabold text-white">4.4 - Implementing Scaled Dot-Product Attention</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: `0 0 25px ${meta.hex}20` }}
              whileTap={{ scale: 0.98 }}
              className="px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.15em] text-white flex items-center justify-center gap-2.5 shadow-lg group/btn cursor-pointer"
              style={{ backgroundColor: meta.hex }}
            >
              <Play className="w-3 h-3 fill-current text-white group-hover/btn:scale-110 transition-transform" />
              Resume Learning
            </motion.button>
          </div>
        </motion.div>

        {/* RIGHT COLUMN (4 cols): AI Recommendation Card (Second priority) */}
        <motion.div
          variants={itemVariants}
          whileHover={{
            y: -3,
            boxShadow: `0 18px 42px -16px rgba(0,0,0,0.55), 0 0 38px -10px ${meta.hex}10`
          }}
          className="lg:col-span-4 relative group backdrop-blur-xl bg-[color:var(--card-bg)]/85 border border-[color:var(--border)] rounded-3xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-300"
          style={{ borderColor: `${meta.hex}15` }}
        >
          {/* Subtle accent corner glow */}
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full blur-3xl pointer-events-none group-hover:opacity-100 opacity-70 transition-opacity" style={{ backgroundColor: `${meta.hex}12` }} />

          <div className="space-y-5">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[color:var(--bg-secondary)] border border-[color:var(--border)] w-fit">
              <Sparkles className="w-3 h-3" style={{ color: meta.hex }} />
              <span className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-[color:var(--text-secondary)]">Aria recommendation</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-white tracking-tight">
                Active Recall Drill
              </h3>
              <p className="text-[color:var(--text-secondary)] text-xs leading-relaxed font-medium">
                We detected a minor accuracy dip in your recent <strong className="text-white font-bold">Dot-Product Attention</strong> calculations. Aria recommends a quick 5-minute feedback practice to lock in retention before the decay index triggers.
              </p>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-[color:var(--border)] space-y-3.5">
            <div className="flex items-center justify-between text-[10px] text-[color:var(--text-secondary)] font-bold">
              <span>Duration: 5 Min Drill</span>
              <span className="text-emerald-400 font-black">+14.2% Stabilization</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.15em] text-white border hover:bg-[color:var(--bg-secondary)]/20 flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer"
              style={{ backgroundColor: `${meta.hex}05`, borderColor: `${meta.hex}20` }}
            >
              <span>Initialize Drill</span>
              <ArrowRight className="w-3 h-3 text-[color:var(--text-secondary)] group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </motion.div>

      </motion.div>

      {/* STATISTICS GRID: Exactly four highly-crafted stats cards with deep reactive states */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >

        {/* STAT 1: Study Hours */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -3 }}
          className="backdrop-blur-xl bg-[color:var(--card-bg)]/80 border border-[color:var(--border)] rounded-3xl p-6 flex flex-col justify-between shadow-lg transition-all duration-300 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border)] flex items-center justify-center">
                <Clock className="w-4.5 h-4.5 text-[color:var(--text-secondary)]" style={{ color: meta.hex }} />
              {progressPercent}% Target
            </div>
          </div>

          <div className="space-y-1 mt-5">
            <p className="text-[9px] font-black text-[color:var(--text-secondary)] uppercase tracking-widest">Study Hours Today</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white tracking-tight">{achievedHours.toFixed(1)}h</span>
              <span className="text-xs text-[color:var(--text-secondary)]">/ {targetHours.toFixed(1)}h target</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 mt-4 border-t border-[color:var(--border)]">
            <span className="text-[8px] font-bold text-[color:var(--text-secondary)] uppercase tracking-wider">Direct Study Log</span>
            <div className="flex items-center gap-1">
              <button
                onClick={addHalfHour}
                className="px-2 py-1 rounded bg-[color:var(--bg-secondary)] hover:bg-[color:var(--bg-primary)] text-[9px] font-black text-white border border-[color:var(--border)] transition-all cursor-pointer"
                title="Log 30 minutes active study segment"
              >
                +30m
              </button>
              <button
                onClick={resetGoal}
                className="p-1 text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors cursor-pointer"
                title="Reset study log"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* STAT 2: Learning Streak */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -3, borderColor: 'rgba(255,255,255,0.08)' }}
          className="backdrop-blur-xl bg-[color:var(--card-bg)]/80 border border-[color:var(--border)] rounded-3xl p-6 flex flex-col justify-between shadow-lg transition-all duration-300 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border)] flex items-center justify-center">
              <Flame className="w-4.5 h-4.5 text-amber-500" style={{ color: meta.hex }} />
            </div>
            <div className={cn(
              "text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border",
              isStreakLoggedToday
                ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                : "text-amber-400 bg-amber-400/10 border-amber-400/20"
            )}>
              {isStreakLoggedToday ? "Secured 🔥" : "Log pending"}
            </div>
          </div>

          <div className="space-y-1 mt-5">
            <p className="text-[9px] font-black text-[color:var(--text-secondary)] uppercase tracking-widest">Active Streak</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white tracking-tight">{streakCount} Days</span>
              <span className="text-[9px] text-[color:var(--text-secondary)] font-bold uppercase tracking-widest">unbroken</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 mt-4 border-t border-[color:var(--border)]">
            <span className="text-[8px] font-bold text-[color:var(--text-secondary)] uppercase tracking-wider">Daily Milestone</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={claimStreak}
                disabled={isStreakLoggedToday}
                className={cn(
                  "px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider transition-all border",
                  isStreakLoggedToday
                    ? "text-[color:var(--text-secondary)] border-[color:var(--border)] bg-[color:var(--bg-secondary)] cursor-default"
                    : "text-white bg-[color:var(--accent)] border-transparent hover:brightness-110 cursor-pointer"
                )}
                style={!isStreakLoggedToday ? { color: meta.hex, borderColor: `${meta.hex}20` } : {}}
              >
                {isStreakLoggedToday ? "Logged" : "Lock In"}
              </button>
              <button
                onClick={resetStreak}
                className="p-1 text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors cursor-pointer"
                title="Reset active streak count"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* STAT 3: Tasks Completed */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -3, borderColor: 'rgba(255,255,255,0.08)' }}
          className="backdrop-blur-xl bg-[color:var(--card-bg)]/80 border border-[color:var(--border)] rounded-3xl p-6 flex flex-col justify-between shadow-lg transition-all duration-300 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border)] flex items-center justify-center">
              <CheckSquare className="w-4.5 h-4.5 text-[color:var(--text-secondary)]" />
            </div>
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
              Daily Focus
            </div>
          </div>

          <div className="space-y-1 mt-5">
            <p className="text-[9px] font-black text-[color:var(--text-secondary)] uppercase tracking-widest">Tasks Met</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white tracking-tight">{completedTasksCount} / {totalTasksCount}</span>
              <span className="text-xs text-[color:var(--text-secondary)]">Completed</span>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[color:var(--border)] flex items-center justify-between text-[10px]">
            <span className="text-[8px] font-bold text-[color:var(--text-secondary)] uppercase tracking-wider">Task Completion</span>
            <span className="font-extrabold text-indigo-400">{totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0}% Ratio</span>
          </div>
        </motion.div>

        {/* STAT 4: Aria Cognitive Score */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -3, borderColor: 'rgba(255,255,255,0.08)' }}
          className="backdrop-blur-xl bg-[color:var(--card-bg)]/80 border border-[color:var(--border)] rounded-3xl p-6 flex flex-col justify-between shadow-lg transition-all duration-300 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border)] flex items-center justify-center">
              <BrainCircuit className="w-4.5 h-4.5 text-[color:var(--text-secondary)]" />
            </div>
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full" style={{ color: meta.hex, backgroundColor: `${meta.hex}15`, borderColor: `${meta.hex}25` }}>
              Recall curve
            </div>
          </div>

          <div className="space-y-1 mt-5">
            <p className="text-[9px] font-black text-[color:var(--text-secondary)] uppercase tracking-widest">Cognitive Score</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white tracking-tight">94.2%</span>
              <span className="text-[10px] text-emerald-400 font-extrabold flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                +2.5%
              </span>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[color:var(--border)] flex items-center justify-between text-[10px]">
            <span className="text-[8px] font-bold text-[color:var(--text-secondary)] uppercase tracking-wider">Stabilized Nodes</span>
            <span className="font-extrabold text-[color:var(--text-secondary)]">Peak Attention</span>
          </div>
        </motion.div>

      </motion.div>

      {/* SECONDARY VIEWPORT: Spacing separator with clear section labeling */}
      <div className="pt-10 border-t border-[color:var(--border)] space-y-8">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[color:var(--text-secondary)]">
            <Activity className="w-4.5 h-4.5 text-[color:var(--text-secondary)]" />
            <h2 className="text-xs font-black uppercase tracking-[0.2em]">Deep analytics &amp; Task streams</h2>
          </div>
          <p className="text-xs text-[color:var(--text-secondary)] font-medium">Secondary performance charts, active daily checklists, and tutor agendas placed cleanly below the primary fold.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Analytics Line Visualizer (7 Columns) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 backdrop-blur-xl bg-[color:var(--card-bg)]/80 border border-[color:var(--border)] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative"
          >
            <div className="flex items-start justify-between mb-8">
              <div className="space-y-1">
                <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Retention Stability Index</h3>
                <p className="text-[9px] font-bold text-[color:var(--text-secondary)] uppercase tracking-widest">Ebbinghaus Memory Cycle Retention curves</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/10 shadow-sm">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">+14.8% Memory Retention</span>
              </div>
            </div>

            {/* Simulated premium line chart / bar visualizer */}
            <div className="flex-1 min-h-[220px] flex items-end justify-between gap-3.5 relative pb-2 pt-6">
              {histogramData.map((val, i) => (
                <div
                  key={i}
                  className="flex-1 relative group cursor-crosshair h-full flex items-end"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${val}%` }}
                    transition={{ duration: 0.8, delay: 0.15 + (i * 0.03), ease: [0.25, 1, 0.5, 1] }}
                    className="w-full rounded-t-md relative overflow-hidden transition-all duration-300 group-hover:brightness-125"
                    style={{
                      background: `linear-gradient(to top, ${meta.hex}20, ${meta.hex})`
                    }}
                  >
                    <div className="absolute inset-0 bg-[color:var(--text-secondary)]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>

                  {/* Tooltip Overlay */}
                  <AnimatePresence>
                    {hoveredIndex === i && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: -4, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute -top-12 left-1/2 -translate-x-1/2 z-30 px-3 py-1.5 rounded-lg bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)] shadow-2xl flex flex-col items-center min-w-[65px]"
                      >
                        <span className="text-[10px] font-black tracking-tighter leading-none">{val}.0%</span>
                        <span className="text-[7px] font-bold text-[color:var(--text-secondary)] uppercase tracking-tighter mt-0.5">STABILITY</span>
                        <div className="absolute top-[calc(100%-4px)] left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-[color:var(--border)]" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Structural Background Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-[0.02]">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-full h-px bg-[color:var(--border)]" />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 px-1 border-t border-[color:var(--border)] pt-4">
              {['07/11', '07/12', '07/13', '07/14', '07/15', '07/16', '07/17', '07/18', '07/19', 'TODAY'].map((day, i) => (
                <span key={i} className="text-[8px] font-bold text-[color:var(--text-secondary)] uppercase tracking-tighter flex-1 text-center">
                  {day}
                </span>
              ))}
            </div>
          </motion.div>

          {/* COMBINED INTERACTIVE CHECKLIST & CALENDAR AGENDA (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col gap-6">

            {/* Interactive Daily Task Checklist - HANDCRAFTED INTERACTION */}
            <motion.div
              initial={{ opacity: 0, scale: 0.99 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="backdrop-blur-xl bg-[color:var(--card-bg)]/80 border border-[color:var(--border)] rounded-3xl p-6 shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[color:var(--border)] pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[color:var(--text-secondary)]" />
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">Aria Study Directives</h3>
                </div>
                <span className="text-[8px] font-black text-[color:var(--text-secondary)] uppercase tracking-widest bg-[color:var(--bg-secondary)]/70 px-2 py-0.5 rounded border border-[color:var(--border)]">
                  {completedTasksCount}/{totalTasksCount} done
                </span>
              </div>

              <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={cn(
                      "p-3 rounded-xl bg-[color:var(--bg-secondary)] border transition-all flex items-start gap-3 cursor-pointer select-none",
                      task.completed
                        ? "border-[color:var(--border)] opacity-60"
                        : "border-[color:var(--border)] hover:border-[color:var(--text-secondary)] hover:bg-[color:var(--bg-primary)]"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded mt-0.5 flex items-center justify-center transition-all border shrink-0",
                      task.completed
                        ? "bg-amber-500 border-amber-500 text-white"
                        : "border-[color:var(--border)]"
                    )}
                    style={task.completed ? { backgroundColor: meta.hex, borderColor: meta.hex } : {}}
                    >
                      {task.completed && <Check className="w-2.5 h-2.5 text-[#121316] stroke-[3]" />}
                    </div>
                    <div className="space-y-0.5 flex-1">
                      <p className={cn(
                        "text-xs font-bold leading-tight",
                        task.completed ? "line-through text-[color:var(--text-secondary)]" : "text-[color:var(--text-primary)]"
                      )}>
                        {task.text}
                      </p>
                      <span className="text-[8px] font-extrabold uppercase tracking-widest text-[color:var(--text-secondary)] block">
                        {task.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Calendar Agenda Widget */}
            <motion.div
              initial={{ opacity: 0, scale: 0.99 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="backdrop-blur-xl bg-[color:var(--card-bg)]/80 border border-[color:var(--border)] rounded-3xl p-6 shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[color:var(--border)] pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-500" style={{ color: meta.hex }} />
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">Schedules &amp; Quiz Timers</h3>
                </div>
                <span className="text-[8px] font-black text-[color:var(--text-secondary)] uppercase tracking-widest bg-[color:var(--bg-secondary)]/70 px-2 py-0.5 rounded border border-[color:var(--border)]">3 events</span>
              </div>

              <div className="space-y-2.5">
                {/* Event 1 */}
                <div className="p-3 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border)] hover:border-[color:var(--text-secondary)] transition-all flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-[color:var(--text-primary)]">Neural Networks: Midterm Assessment</p>
                    <p className="text-[9px] text-[color:var(--text-secondary)] font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Today, 2:00 PM
                    </p>
                  </div>
                  <span className="text-[8px] font-extrabold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0" style={{ color: meta.hex, backgroundColor: `${meta.hex}15` }}>Quiz</span>
                </div>

                {/* Event 2 */}
                <div className="p-3 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border)] hover:border-[color:var(--text-secondary)] transition-all flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-[color:var(--text-primary)]">Algorithms Complexity Study Circles</p>
                    <p className="text-[9px] text-[color:var(--text-secondary)] font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Tomorrow, 10:30 AM
                    </p>
                  </div>
                  <span className="text-[8px] font-extrabold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0">Session</span>
                </div>

                {/* Event 3 */}
                <div className="p-3 rounded-xl bg-[color:var(--bg-secondary)] border border-[color:var(--border)] hover:border-[color:var(--text-secondary)] transition-all flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-[color:var(--text-primary)]">Aria Tutor Performance Deep-Dive</p>
                    <p className="text-[9px] text-[color:var(--text-secondary)] font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Wed, 4:00 PM
                    </p>
                  </div>
                  <span className="text-[8px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0">AI Coach</span>
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </div>

    </div>
  );
}
