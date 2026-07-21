'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Check, HelpCircle, Sparkles, Zap } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useAccent } from '@/components/accent-provider';
import { cn } from '@/lib/utils';

interface PricingProps {
  onSelectPlan: (plan: 'free' | 'pro') => void;
}

export function Pricing({ onSelectPlan }: PricingProps) {
  const { darkMode } = useTheme();
  const { meta } = useAccent();
  const activeAccentClasses = darkMode ? meta.dark : meta.light;

  return (
    <section className="w-full py-20 px-4 bg-transparent relative overflow-hidden" id="pricing">
      {/* Background ambient glowing bubble */}
      <div className="w-96 h-96 bg-amber-500/[0.03] dark:bg-amber-600/[0.05] blur-[120px] rounded-full absolute top-10 left-1/2 -translate-x-1/2 -z-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] uppercase tracking-widest font-black mb-4"
          >
            <span>FLEXIBLE PLANS</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-heading font-black tracking-tight mb-4 text-slate-900 dark:text-white"
          >
            Simple Pricing
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-sm md:text-base font-medium"
          >
            Start studying for free today, or upgrade to Pro to unlock maximum speed and AI capacity.
          </motion.p>
        </div>

        {/* Two-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch relative z-10 max-w-4xl mx-auto">
          
          {/* FREE CARD */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "rounded-[32px] p-8 border flex flex-col justify-between transition-all duration-500 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden",
              darkMode 
                ? "bg-[#121316]/40 border-white/[0.08]" 
                : "bg-white/50 border-black/[0.06]"
            )}
          >
            <div>
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                STUDENT BASE
              </span>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-2">
                Free
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">
                Perfect for standard homework queries and simple note taking.
              </p>

              {/* Price */}
              <div className="my-8">
                <span className="text-5xl font-black text-slate-800 dark:text-white font-heading">$0</span>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 ml-2">/ month</span>
              </div>

              {/* Features list */}
              <ul className="space-y-4 border-t border-slate-200 dark:border-white/[0.05] pt-6">
                {[
                  "AI Tutor (Limited)",
                  "Notes",
                  "Quiz",
                  "Dashboard"
                ].map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-300">
                    <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.04] flex items-center justify-center text-slate-500 shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>

            {/* Button */}
            <button
              onClick={() => onSelectPlan('free')}
              className="w-full h-12 rounded-xl border border-slate-200 dark:border-white/[0.1] bg-slate-100/50 dark:bg-white/[0.02] hover:bg-slate-200 dark:hover:bg-white/[0.05] text-slate-700 dark:text-slate-200 font-black text-xs uppercase tracking-widest transition-all mt-8 cursor-pointer active:scale-[0.98]"
            >
              Get Started
            </button>
          </motion.div>

          {/* PRO CARD (Highlighted) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "rounded-[32px] p-8 border flex flex-col justify-between transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden",
              darkMode 
                ? "bg-[#121316] border-amber-500/40 shadow-[0_15px_40px_rgba(245,158,11,0.1)]" 
                : "bg-white border-amber-500/30 shadow-[0_15px_40px_rgba(245,158,11,0.05)]"
            )}
          >
            {/* Top popular badge */}
            <div 
              className="absolute top-0 right-0 rounded-bl-2xl px-4 py-1.5 text-[9px] font-black tracking-widest text-white uppercase flex items-center gap-1"
              style={{ backgroundColor: meta.hex }}
            >
              <Sparkles className="w-3 h-3 animate-pulse" />
              Most Popular
            </div>

            <div>
              <span className="text-[10px] font-black tracking-widest text-amber-500 uppercase">
                COGNITIVE UNLEASHED
              </span>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-2">
                Pro
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">
                For students who require continuous, unlimited learning velocity.
              </p>

              {/* Price */}
              <div className="my-8">
                <span className="text-5xl font-black text-slate-800 dark:text-white font-heading">$15</span>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 ml-2">/ month</span>
              </div>

              {/* Features list */}
              <ul className="space-y-4 border-t border-slate-200 dark:border-white/[0.05] pt-6">
                {[
                  "Unlimited AI Tutor",
                  "Unlimited Notes",
                  "PDF Learning",
                  "Flashcards",
                  "Advanced Analytics",
                  "Priority Support"
                ].map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-200">
                    <div 
                      className="w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0"
                      style={{ backgroundColor: meta.hex }}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>

            {/* Button */}
            <button
              onClick={() => onSelectPlan('pro')}
              className={cn(
                "w-full h-12 rounded-xl text-white font-black text-xs uppercase tracking-widest transition-all mt-8 cursor-pointer hover:scale-105 active:scale-[0.98] flex items-center justify-center gap-2",
                activeAccentClasses.button
              )}
            >
              Upgrade to Pro
              <Zap className="w-3.5 h-3.5" />
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
