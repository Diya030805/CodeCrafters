'use client';

import { LoadingSpinner } from '@/components/ui/loading';

export default function DashboardLoading() {
  return (
    <div className="relative z-10 min-h-[calc(100vh-120px)] px-4 py-12">
      <div className="mx-auto w-full max-w-[1600px] rounded-[32px] border border-white/[0.05] bg-slate-950/80 p-10 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
        <div className="grid gap-6 lg:grid-cols-[minmax(320px,280px)_minmax(0,1fr)]">
          <div className="rounded-3xl bg-slate-900/80 p-6 text-left">
            <LoadingSpinner label="Loading your dashboard…" className="text-slate-300" />
          </div>
          <div className="space-y-4 rounded-3xl bg-slate-900/80 p-6">
            <div className="h-4 w-1/2 rounded-full bg-white/5 animate-pulse" />
            <div className="h-4 w-2/3 rounded-full bg-white/5 animate-pulse" />
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="h-24 rounded-[24px] bg-white/5 animate-pulse" />
              <div className="h-24 rounded-[24px] bg-white/5 animate-pulse" />
              <div className="h-24 rounded-[24px] bg-white/5 animate-pulse" />
              <div className="h-24 rounded-[24px] bg-white/5 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
