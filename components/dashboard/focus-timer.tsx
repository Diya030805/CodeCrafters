'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { glassStyles } from '@/lib/glass';
import { useAccent } from '@/components/accent-provider';
import { useTheme } from '@/components/theme-provider';
import { Tooltip } from '@/components/ui/tooltip';

export function FocusTimer() {
  const { darkMode, soundEnabled } = useTheme();
  const { meta } = useAccent();
  const activeAccentClasses = darkMode ? meta.dark : meta.light;

  const [timeLeft, setTimeLeft] = React.useState(24 * 60 + 47);
  const [isActive, setIsActive] = React.useState(false);
  const totalTime = 25 * 60;

  const playStartSound = () => {
    if (typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.1, start + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + duration);
      };
      
      playTone(261.63, now, 0.3);       // C4
      playTone(329.63, now + 0.08, 0.3); // E4
      playTone(392.00, now + 0.16, 0.3); // G4
      playTone(523.25, now + 0.24, 0.4); // C5
    } catch (e) {
      console.warn("Could not play start sound:", e);
    }
  };

  const playEndSound = () => {
    if (typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.12, start + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + duration);
      };
      
      playTone(783.99, now, 0.5);       // G5
      playTone(659.25, now + 0.15, 0.5); // E5
      playTone(523.25, now + 0.30, 0.8); // C5
    } catch (e) {
      console.warn("Could not play end sound:", e);
    }
  };

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            if (soundEnabled) {
              playEndSound();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, soundEnabled]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / totalTime) * 100;

  return (
    <div className={cn("p-6 flex flex-col items-center gap-10", glassStyles.container)}>
      <div className="text-center">
        <h3 className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase mb-1">Deep Focus</h3>
        <p className="text-slate-900 dark:text-white font-bold text-lg">Active Session</p>
      </div>

      {/* Circular Timer */}
      <div className="relative w-56 h-56 flex items-center justify-center">
        {/* Floating micro-glow particle */}
        <div 
          className="absolute top-2 left-2 w-3 h-3 rounded-full animate-[pulse_1.5s_ease-in-out_infinite] pointer-events-none blur-[1px]" 
          style={{ backgroundColor: meta.hex }}
        />
        {/* Floating spinning vector star */}
        <div 
          className="absolute bottom-4 right-4 w-5 h-5 animate-[spin_6s_linear_infinite] pointer-events-none"
          style={{ 
            color: meta.hex,
            filter: `drop-shadow(0 0 6px ${meta.hex})`
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z" />
          </svg>
        </div>

        <svg className="w-full h-full -rotate-90">
          <circle
            cx="112"
            cy="112"
            r="100"
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-slate-200/50 dark:text-white/[0.03]"
          />
          <motion.circle
            cx="112"
            cy="112"
            r="100"
            stroke={meta.hex}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray="628"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: 628 - (628 * progress) / 100 }}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 10px ${activeAccentClasses.shadow})` }}
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className={cn("text-5xl font-black tracking-tighter tabular-nums transition-all duration-300", activeAccentClasses.text)}>
            {formatTime(timeLeft)}
          </span>
          <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mt-1">Remaining</span>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-[1fr_auto] gap-4 w-full">
        <button
          onClick={() => {
            const nextActive = !isActive;
            setIsActive(nextActive);
            if (nextActive && soundEnabled) {
              playStartSound();
            }
          }}
          className={cn(
            "h-14 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 active:scale-[0.97] font-bold text-sm cursor-pointer",
            activeAccentClasses.button
          )}
        >
          {isActive ? (
            <>
              <Pause className="w-5 h-5 fill-current" />
              Pause Focus
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              Resume Focus
            </>
          )}
        </button>
        <Tooltip content="Reset Timer Session" side="top">
          <button 
            onClick={() => {
              setIsActive(false);
              setTimeLeft(totalTime);
            }}
            className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all cursor-pointer hover:bg-slate-200 dark:hover:bg-white/10", glassStyles.card)}
            aria-label="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </Tooltip>
      </div>

      {/* Focus Metadata */}
      <div className="w-full grid grid-cols-2 gap-4">
        <div className={cn("text-center", glassStyles.card)}>
          <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">DAILY STREAK</span>
          <span className="text-slate-900 dark:text-white font-black text-xl">14</span>
        </div>
        <div className={cn("text-center", glassStyles.card)}>
          <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">RANK</span>
          <span className="text-amber-500 font-black text-xl">Top 3%</span>
        </div>
      </div>
    </div>
  );
}
