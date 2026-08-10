'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  label?: string;
  className?: string;
}

export function LoadingSpinner({ label = 'Loading...', className }: LoadingSpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4 text-center', className)}>
      <div className="relative flex items-center justify-center">
        <div className="h-14 w-14 rounded-full border border-white/10 border-t-cyan-400/80 animate-spin" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/20 via-transparent to-violet-500/10" />
      </div>
      <p className="text-sm font-medium text-slate-300">{label}</p>
    </div>
  );
}

interface SkeletonBlockProps {
  className?: string;
}

export function SkeletonBlock({ className }: SkeletonBlockProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-3xl bg-white/5 border border-white/[0.04] shadow-[0_10px_30px_rgba(15,23,42,0.2)]',
        className
      )}
    />
  );
}

export function SkeletonRow({ className }: SkeletonBlockProps) {
  return (
    <div
      className={cn(
        'animate-pulse h-4 rounded-full bg-white/5 border border-white/[0.04] shadow-sm',
        className
      )}
    />
  );
}
