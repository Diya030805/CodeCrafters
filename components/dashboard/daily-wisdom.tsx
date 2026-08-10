'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb, Sparkles, RefreshCw, Quote, ArrowRight, BookOpen } from 'lucide-react';
import { useAccent } from '@/components/accent-provider';
import { cn } from '@/lib/utils';

interface WisdomTip {
  quote: string;
  author: string;
  category: string;
  actionableTip: string;
}

const WISDOM_TIPS: WisdomTip[] = [
  {
    quote: "Learning is not attained by chance, it must be sought for with ardor and attended to with diligence.",
    author: "Abigail Adams",
    category: "Cognitive Endurance",
    actionableTip: "Break your study session into strict 25-minute Pomodoro sprints with zero digital distractions."
  },
  {
    quote: "Tell me and I forget, teach me and I remember, involve me and I learn.",
    author: "Benjamin Franklin",
    category: "Active Recall",
    actionableTip: "Close your notes right now and try explaining the core concept out loud in your own words."
  },
  {
    quote: "The expert in anything was once a beginner.",
    author: "Helen Hayes",
    category: "Growth Mindset",
    actionableTip: "Don't get discouraged by difficult problem sets; treat errors as high-value telemetry for your brain."
  },
  {
    quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi",
    category: "Curiosity Loop",
    actionableTip: "Connect today's study topic to a real-world problem you care about solving."
  },
  {
    quote: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
    author: "Malcolm X",
    category: "Strategic Planning",
    actionableTip: "Review your task backlog and prioritize the single hardest topic while your mental energy is peak."
  },
  {
    quote: "Any fool can know. The point is to understand.",
    author: "Albert Einstein",
    category: "Deep Comprehension",
    actionableTip: "Use the Feynman Technique: simplify a complex theorem until a 10-year-old could grasp it."
  },
  {
    quote: "The beautiful thing about learning is that no one can take it away from you.",
    author: "B.B. King",
    category: "Mastery Focus",
    actionableTip: "Revisit flashcards from 3 days ago to cement spaced repetition in your long-term memory."
  }
];

export function DailyWisdom() {
  const { meta } = useAccent();
  const [currentIndex, setCurrentIndex] = React.useState<number>(() => {
    // Pick initial based on day of year for daily consistency
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    return dayOfYear % WISDOM_TIPS.length;
  });

  const [isRotating, setIsRotating] = React.useState(false);

  const currentTip = WISDOM_TIPS[currentIndex];

  const handleNextTip = () => {
    setIsRotating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % WISDOM_TIPS.length);
      setIsRotating(false);
    }, 200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-[color:var(--card-bg)]/80 border border-[color:var(--border)] p-6 sm:p-8 shadow-2xl group"
      style={{ borderColor: `${meta.hex}25` }}
    >
      {/* Background radial glow */}
      <div
        className="absolute -left-10 -bottom-10 h-48 w-48 rounded-full blur-3xl pointer-events-none opacity-30 group-hover:opacity-60 transition-opacity"
        style={{ backgroundColor: `${meta.hex}20` }}
      />

      <div className="flex items-start justify-between gap-4 relative z-10 mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shrink-0 relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${meta.hex}, #ffffff22)` }}
          >
            <Lightbulb className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full text-amber-400 border border-amber-500/20" style={{ color: meta.hex, backgroundColor: `${meta.hex}15`, borderColor: `${meta.hex}30` }}>
                Daily Wisdom & Productivity
              </span>
              <span className="text-[10px] font-bold text-slate-500">Tip #{currentIndex + 1} of {WISDOM_TIPS.length}</span>
            </div>
            <h3 className="text-lg font-black text-white tracking-tight mt-0.5">
              {currentTip.category}
            </h3>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, rotate: 15 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNextTip}
          className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer shadow-md flex items-center gap-1.5 text-xs font-semibold"
          title="Shuffle Wisdom Tip"
        >
          <RefreshCw className={cn("w-4 h-4 transition-transform duration-500", isRotating && "rotate-180")} />
          <span className="hidden sm:inline">Shuffle</span>
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="relative z-10 space-y-4"
        >
          {/* Quote container */}
          <div className="relative pl-6 border-l-2 py-1" style={{ borderColor: meta.hex }}>
            <Quote className="absolute -top-2 -left-3 w-4 h-4 text-slate-600 opacity-50" />
            <p className="text-slate-200 text-sm sm:text-base font-medium italic leading-relaxed">
              &ldquo;{currentTip.quote}&rdquo;
            </p>
            <p className="text-xs font-bold text-slate-400 mt-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: meta.hex }} />
              {currentTip.author}
            </p>
          </div>

          {/* Actionable Strategy Box */}
          <div className="p-4 rounded-2xl bg-[color:var(--bg-secondary)] border border-[color:var(--border)] flex items-start gap-3 mt-4">
            <div className="p-2 rounded-xl bg-white/[0.04] text-amber-400 mt-0.5 shrink-0" style={{ color: meta.hex, backgroundColor: `${meta.hex}15` }}>
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Actionable Study Protocol</span>
              <p className="text-xs font-semibold text-slate-300 leading-snug">
                {currentTip.actionableTip}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

    </motion.div>
  );
}
