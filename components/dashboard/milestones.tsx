'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { Award, Star, Zap, Flame, Trophy, Lock } from 'lucide-react';
import { useAccent } from '@/components/accent-provider';
import { cn } from '@/lib/utils';

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  unlocked: boolean;
  date?: string;
}

const badges: Badge[] = [
  {
    id: 'first-streak',
    title: 'Ignition',
    description: '3 Day Learning Streak',
    icon: Flame,
    unlocked: true,
    date: 'Oct 12'
  },
  {
    id: 'focus-master',
    title: 'Deep Focus',
    description: '10 Hours Logged',
    icon: Zap,
    unlocked: true,
    date: 'Oct 15'
  },
  {
    id: 'top-performer',
    title: 'Top 5%',
    description: 'High Retention Rate',
    icon: Star,
    unlocked: true,
    date: 'Oct 18'
  },
  {
    id: 'course-complete',
    title: 'Scholar',
    description: 'Complete First Course',
    icon: Award,
    unlocked: false
  },
  {
    id: 'champion',
    title: 'Champion',
    description: 'Win Weekly Leaderboard',
    icon: Trophy,
    unlocked: false
  }
];

export function Milestones() {
  const { meta } = useAccent();

  return (
    <div className="space-y-6 mt-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06]">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">Milestones</h2>
            <p className="text-xs font-bold text-slate-500 tracking-wide uppercase">Unlocked Achievements</p>
          </div>
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white/[0.04] px-3 py-1.5 rounded-full border border-white/[0.06]">
          {badges.filter(b => b.unlocked).length} / {badges.length} Earned
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {badges.map((badge, i) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={badge.unlocked ? { y: -5, scale: 1.02 } : {}}
            className={cn(
              "relative p-5 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center gap-3 group",
              badge.unlocked 
                ? "bg-[#121316]/50 border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.02]" 
                : "bg-[#121316]/20 border-white/[0.02] opacity-60 grayscale"
            )}
          >
            {badge.unlocked && (
              <div 
                className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl pointer-events-none"
                style={{ backgroundImage: `linear-gradient(to bottom right, ${meta.hex}, transparent)` }}
              />
            )}
            
            <div 
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center relative",
                badge.unlocked ? "bg-white/[0.05] border border-white/[0.1]" : "bg-white/[0.02] border border-white/[0.05]"
              )}
            >
              {badge.unlocked && (
                <div 
                  className="absolute inset-0 blur-xl opacity-20 rounded-full"
                  style={{ backgroundColor: meta.hex }}
                />
              )}
              {badge.unlocked ? (
                <badge.icon className="w-5 h-5 relative z-10" style={{ color: meta.hex }} />
              ) : (
                <Lock className="w-5 h-5 relative z-10 text-slate-600" />
              )}
            </div>
            
            <div className="space-y-1 z-10">
              <h4 className={cn("text-sm font-black tracking-tight", badge.unlocked ? "text-white" : "text-slate-500")}>
                {badge.title}
              </h4>
              <p className="text-[10px] font-medium text-slate-500 leading-tight">
                {badge.description}
              </p>
            </div>

            {badge.unlocked && badge.date && (
              <div className="absolute top-2 right-2 text-[8px] font-black uppercase tracking-widest text-slate-600">
                {badge.date}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
