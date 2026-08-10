'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { Check, Zap, RotateCcw } from 'lucide-react';
import { useAccent } from '@/components/accent-provider';
import { cn } from '@/lib/utils';

export function StreakCounter() {
  const { meta } = useAccent();

  const [streakCount, setStreakCount] = React.useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('study_streak_count');
      const parsed = saved ? parseInt(saved, 10) : NaN;
      return !isNaN(parsed) ? parsed : 0;
    }
    return 0;
  });

  const [bestStreak, setBestStreak] = React.useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('study_best_streak');
      const parsed = saved ? parseInt(saved, 10) : NaN;
      return !isNaN(parsed) ? parsed : 21;
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

  const [weeklyStatus, setWeeklyStatus] = React.useState<Array<{ day: string; completed: boolean }>>(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const currentDayIndex = (today.getDay() + 6) % 7;

    return days.map((day, index) => ({
      day,
      completed: index < currentDayIndex || (index === currentDayIndex && streakLastLogged === todayStr),
    }));
  });

  const nextMilestone = Math.max(7, Math.ceil((streakCount + 1) / 7) * 7);
  const progressToMilestone = Math.min(100, Math.round((streakCount / nextMilestone) * 100));

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
    setWeeklyStatus((prev) => prev.map((status, index) => ({
      ...status,
      completed: status.completed || index === ((new Date().getDay() + 6) % 7),
    })));
  };

  const resetStreak = () => {
    setStreakCount(0);
    localStorage.setItem('study_streak_count', '0');
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    const dateString = pastDate.toISOString().split('T')[0];
    setStreakLastLogged(dateString);
    localStorage.setItem('study_streak_last_logged', dateString);
    setWeeklyStatus((prev) => prev.map((status) => ({ ...status, completed: false })));
  };

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  if (!mounted) {
    return (
      <div className="h-[420px] rounded-[24px] bg-slate-950/50 border border-white/[0.05] animate-pulse" />
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-[24px] border border-white/[0.06] bg-gradient-to-br from-[#05091a] via-[#070b18] to-[#020205] p-6 shadow-[0_20px_80px_rgba(15,23,42,0.45)]"
    >
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.12),_transparent_28%)]" />
      <div className="absolute inset-0 bg-white/5 backdrop-blur-2xl" />

      <div className="relative z-10 space-y-8">
        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr] items-start">
          <div className="space-y-4">
            <p className="text-sm font-medium uppercase tracking-[0.32em] text-slate-400">Daily Learning Streak</p>
            <div className="flex flex-wrap items-end gap-4">
              <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white">{streakCount}</h1>
              <span className="text-xl font-semibold text-slate-400">Days</span>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-300">
              Start your streak today and build a habit that keeps your focus sharp, your knowledge rising, and your progress undeniable.
            </p>
          </div>

          <div className="rounded-[22px] border border-white/[0.08] bg-white/5 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.3)]">
            <div className="flex flex-col gap-3">
              <div className="rounded-[18px] bg-slate-900/70 p-4 border border-white/[0.05]">
                <div className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Claim Today's Streak</div>
                <p className="mt-2 text-sm text-slate-300">Lock in your streak with one click and keep the momentum going.</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: `0 0 30px ${meta.hex}35` }}
                whileTap={{ scale: 0.98 }}
                onClick={claimStreak}
                disabled={isLoggedToday}
                className={cn(
                  'w-full rounded-[18px] py-3.5 text-sm font-semibold transition-all duration-300',
                  isLoggedToday
                    ? 'bg-slate-800 text-slate-300 border border-slate-700 cursor-default'
                    : 'bg-gradient-to-r from-[#1d4ed8] to-[#8b5cf6] text-white shadow-[0_12px_40px_rgba(59,130,246,0.35)]'
                )}
              >
                {isLoggedToday ? 'Today’s Streak Claimed' : "Claim Today's Streak"}
              </motion.button>
              <button
                onClick={resetStreak}
                className="rounded-[18px] border border-white/[0.08] bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08]"
              >
                Reset streak
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[22px] border border-white/[0.08] bg-white/5 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.18)]">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Best Streak</p>
            <p className="mt-4 text-3xl font-bold text-white">{bestStreak} days</p>
            <p className="mt-2 text-sm text-slate-400">Your longest consistency run so far.</p>
          </div>
          <div className="rounded-[22px] border border-white/[0.08] bg-white/5 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.18)]">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Current Goal</p>
            <p className="mt-4 text-3xl font-bold text-white">{nextMilestone} days</p>
            <p className="mt-2 text-sm text-slate-400">A fresh target to keep your streak alive.</p>
          </div>
        </div>

        <div className="rounded-[22px] border border-white/[0.08] bg-white/5 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.18)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Weekly Tracker</p>
              <p className="mt-2 text-sm text-slate-300">Check off each day to maintain your momentum.</p>
            </div>
            <div className="rounded-full bg-slate-900/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              {isLoggedToday ? 'Today complete' : 'Today pending'}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-7 gap-3">
            {weeklyStatus.map((item, index) => (
              <div
                key={item.day}
                className={cn(
                  'flex flex-col items-center justify-center rounded-full border px-3 py-3 text-center transition-all',
                  item.completed
                    ? 'bg-gradient-to-br from-[#2563eb] to-[#7c3aed] border-transparent text-white shadow-[0_10px_30px_rgba(59,130,246,0.25)]'
                    : 'bg-white/5 border-white/[0.06] text-slate-400'
                )}
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.25em]">{item.day}</span>
                <span className="mt-1 text-sm font-bold">{index + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[22px] border border-white/[0.08] bg-white/5 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.18)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Milestone Progress</p>
              <p className="mt-2 text-sm text-slate-300">{streakCount} / {nextMilestone} days</p>
            </div>
            <span className="rounded-full bg-slate-900/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
              {progressToMilestone}% complete
            </span>
          </div>

          <div className="mt-5 rounded-full bg-white/[0.06] p-1">
            <motion.div
              className="h-3 rounded-full bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6]"
              initial={{ width: 0 }}
              animate={{ width: `${progressToMilestone}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
