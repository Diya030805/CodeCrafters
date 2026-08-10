'use client';

import { LoadingSpinner } from '@/components/ui/loading';

export function DashboardRouteLoading() {
  return (
    <div className="rounded-[32px] border border-white/[0.05] bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
            loading section
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">Preparing your study workspace</h2>
          <p className="mt-2 max-w-xl text-sm text-slate-400">
            Fast route transitions keep your dashboard focused while new AI tools and analytics render.
          </p>
        </div>
        <LoadingSpinner label="Almost there…" className="text-slate-300" />
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="h-28 rounded-[24px] bg-white/5 animate-pulse" />
        <div className="h-28 rounded-[24px] bg-white/5 animate-pulse" />
        <div className="h-28 rounded-[24px] bg-white/5 animate-pulse" />
        <div className="h-28 rounded-[24px] bg-white/5 animate-pulse" />
      </div>
    </div>
  );
}
