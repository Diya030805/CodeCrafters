'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Trophy, Calendar, Check, Zap, Sparkles, ArrowUpRight, RotateCcw } from 'lucide-react';
import { useAccent } from '@/components/accent-provider';
import { cn } from '@/lib/utils';

export function StreakCounter() {
  const { meta } = useAccent();

  // Streak state with persistence
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

  const [bestStreak, setBestStreak] = React.useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('study_best_streak');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed)) return parsed;
      }
    }
    return 21;
  });

  const todayStr = React.useMemo(() => new Date().toISOString().split('T')[0], []);

  const [streakLastLogged, setStreakLastLogged] = React.useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('study_streak_last_logged');
      if (saved) return saved;
    }
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  });

  const isLoggedToday = streakLastLogged === todayStr;

  // 7-day rolling view state
  const [weeklyStatus, setWeeklyStatus] = React.useState<Array<{ day: string; date: string; completed: boolean }>>(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const currentDayIndex = (today.getDay() + 6) % 7; // Monday = 0

    return days.map((d, index) => {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() - (currentDayIndex - index));
      const dateString = targetDate.toISOString().split('T')[0];
      
      const completed = index < currentDayIndex ? true : (index === currentDayIndex ? (streakLastLogged === dateString) : false);
      return {
        day: d,
        date: targetDate.getDate().toString(),
        completed
      };
    });
  });

  const claimStreak = () => {
    if (isLoggedToday) return;
    const nextStreak = streakCount + 1;
    setStreakCount(nextStreak);
    localStorage.setItem('study_streak_count', nextStreak.toString());

    if (nextStreak > bestStreak) {
      setBestStreak(nextStreak);
      localStorage.setItem('study_best_streak', nextStreak.toString());
    }

    setStreakLastLogged(todayStr);
    localStorage.setItem('study_streak_last_logged', todayStr);

    setWeeklyStatus(prev => prev.map(item => {
      const todayNum = new Date().getDate().toString();
      if (item.date === todayNum) {
        return { ...item, completed: true };
      }
      return item;
    }));
  };

  const resetStreak = () => {
    setStreakCount(0);
    localStorage.setItem('study_streak_count', '0');
    const past = new Date();
    past.setDate(past.getDate() - 3);
    const dateStr = past.toISOString().split('T')[0];
    setStreakLastLogged(dateStr);
    localStorage.setItem('study_streak_last_logged', dateStr);
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

  const nextMilestone = Math.ceil((streakCount + 1) / 7) * 7;
  const progressToMilestone = Math.min(100, Math.round((streakCount / nextMilestone) * 100));

  if (!mounted) {
    return (
      <div className="h-[220px] rounded-3xl bg-[#121316]/70 border border-white/[0.06] animate-pulse" />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-[#121316]/70 border border-white/[0.06] p-6 sm:p-8 shadow-2xl group"
      style={{ borderColor: `${meta.hex}25` }}
    >
      {/* Background radial glow */}
      <div 
        className="absolute -right-10 -top-10 h-48 w-48 rounded-full blur-3xl pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity" 
        style={{ backgroundColor: `${meta.hex}20` }} 
      />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        
        {/* Left: Streak Header & Count */}
        <div className="flex items-center gap-5">
          <div 
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shadow-xl shrink-0 relative overflow-hidden group/flame"
            style={{ background: `linear-gradient(135deg, ${meta.hex}, #ffffff22)` }}
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/flame:opacity-100 transition-opacity" />
            <Flame className="w-9 h-9 text-white animate-pulse" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20" style={{ color: meta.hex, backgroundColor: `${meta.hex}15`, borderColor: `${meta.hex}30` }}>
                Daily Consistency Streak
              </span>
              <span className="text-[10px] font-bold text-slate-400">Personal Best: {bestStreak}d</span>
            </div>
            <div className="flex items-baseline gap-2.5">
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {streakCount} <span className="text-lg font-bold text-slate-400">Days Unbroken</span>
              </h2>
            </div>
            <p className="text-slate-400 text-xs font-medium">
              {isLoggedToday 
                ? "🔥 Today's session is secured! Keep your cognitive momentum going." 
                : "⚡ Complete your daily learning session or click below to lock in today's streak."}
            </p>
          </div>
        </div>

        {/* Right: Quick Action / Claim Button */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
          <div className="hidden sm:flex flex-col text-right pr-2">
            <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest">Milestone Goal</span>
            <span className="text-xs font-black text-white">{nextMilestone} Days Target</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.03, boxShadow: `0 0 30px ${meta.hex}35` }}
            whileTap={{ scale: 0.97 }}
            onClick={claimStreak}
            disabled={isLoggedToday}
            className={cn(
              "flex-1 sm:flex-none px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2.5 shadow-xl cursor-pointer",
              isLoggedToday 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default" 
                : "text-white"
            )}
            style={!isLoggedToday ? { backgroundColor: meta.hex } : {}}
          >
            {isLoggedToday ? (
              <>
                <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                <span>Streak Secured Today</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current text-white animate-bounce" />
                <span>Claim Today&apos;s Streak</span>
              </>
            )}
          </motion.button>

          <button
            onClick={resetStreak}
            className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
            title="Reset streak counter"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Weekly Check-in Bar & Milestone Progress */}
      <div className="mt-6 pt-6 border-t border-white/[0.04] grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* 7-Day Pill Bar (7 cols) */}
        <div className="md:col-span-7 flex items-center justify-between gap-2">
          {weeklyStatus.map((item, index) => (
            <div 
              key={index}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl border transition-all duration-300",
                item.completed 
                  ? "bg-white/[0.04] border-white/[0.1] text-white" 
                  : "bg-white/[0.01] border-white/[0.03] text-slate-500"
              )}
              style={item.completed ? { borderColor: `${meta.hex}40`, backgroundColor: `${meta.hex}10` } : {}}
            >
              <span className="text-[9px] font-extrabold uppercase tracking-widest">{item.day}</span>
              <div className="my-1">
                {item.completed ? (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-white font-black text-[10px]" style={{ backgroundColor: meta.hex }}>
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                ) : (
                  <span className="text-xs font-bold">{item.date}</span>
                )}
              </div>
              <span className={cn("text-[7px] font-bold uppercase", item.completed ? "text-emerald-400" : "text-slate-600")}>
                {item.completed ? "Done" : "Pending"}
              </span>
            </div>
          ))}
        </div>

        {/* Milestone Progress Bar (5 cols) */}
        <div className="md:col-span-5 space-y-2 bg-white/[0.01] p-4 rounded-2xl border border-white/[0.03]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Milestone Progress</span>
            <span className="text-white font-extrabold text-[10px]">{streakCount} / {nextMilestone} Days</span>
          </div>
          <div className="h-2 rounded-full bg-white/[0.03] border border-white/[0.05] overflow-hidden p-[1px]">
            <motion.div 
              className="h-full rounded-full"
              style={{ backgroundColor: meta.hex }}
              initial={{ width: 0 }}
              animate={{ width: `${progressToMilestone}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <div className="flex items-center justify-between text-[9px] text-slate-500 font-medium">
            <span>Consistent recall loop active</span>
            <span className="text-amber-400 font-bold" style={{ color: meta.hex }}>{nextMilestone - streakCount} days to milestone</span>
          </div>
        </div>

      </div>

    </motion.div>
  );
}
