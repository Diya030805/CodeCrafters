'use client';

export const dynamic = 'force-dynamic';

import * as React from 'react';
import { motion } from 'motion/react';

export default function PreferencesPage() {
  return (
    <motion.div
      key="preferences-workspace"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full"
    >
      <div className="space-y-6 rounded-[32px] border border-white/[0.05] bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[color:var(--text-secondary)]">Preferences</p>
          <h1 className="text-3xl font-bold text-[color:var(--text-primary)]">Personalize your BrainBoost workspace</h1>
          <p className="max-w-2xl text-sm text-[color:var(--text-secondary)]">
            Configure theme preferences, notification behavior, and AI study settings for smoother learning sessions.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[32px] border border-white/[0.05] bg-slate-900/90 p-6">
            <h2 className="text-xl font-semibold text-[color:var(--text-primary)]">Appearance</h2>
            <p className="mt-2 text-sm text-[color:var(--text-secondary)]">Switch themes, accent colors, and dashboard density in one place.</p>
          </div>
          <div className="rounded-[32px] border border-white/[0.05] bg-slate-900/90 p-6">
            <h2 className="text-xl font-semibold text-[color:var(--text-primary)]">Study Behavior</h2>
            <p className="mt-2 text-sm text-[color:var(--text-secondary)]">Adjust auto-scroll, notification reminders, and quiz pacing for your workflow.</p>
          </div>
          <div className="rounded-[32px] border border-white/[0.05] bg-slate-900/90 p-6">
            <h2 className="text-xl font-semibold text-[color:var(--text-primary)]">Notifications</h2>
            <p className="mt-2 text-sm text-[color:var(--text-secondary)]">Control sound effects, reminders, and dashboard prompts.</p>
          </div>
          <div className="rounded-[32px] border border-white/[0.05] bg-slate-900/90 p-6">
            <h2 className="text-xl font-semibold text-[color:var(--text-primary)]">AI Assist</h2>
            <p className="mt-2 text-sm text-[color:var(--text-secondary)]">Optimize model hints, auto-summarization, and assistant behavior.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
