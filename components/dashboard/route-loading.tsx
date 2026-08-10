'use client';

import { LoadingSpinner } from '@/components/ui/loading';

export function DashboardRouteLoading() {
  return (
    <div className="rounded-[32px] border border-[color:var(--border)] bg-[color:var(--card-bg)]/95 p-8 shadow-2xl shadow-[0_30px_80px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[color:var(--text-secondary)]">
            loading section
          </p>
          <h2 className="mt-2 text-2xl font-bold text-[color:var(--text-primary)]">Preparing your study workspace</h2>
          <p className="mt-2 max-w-xl text-sm text-[color:var(--text-secondary)]">
            Fast route transitions keep your dashboard focused while new AI tools and analytics render.
          </p>
        </div>
        <LoadingSpinner label="Almost there…" className="text-[color:var(--text-secondary)]" />
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="h-28 rounded-[24px] bg-[color:var(--bg-secondary)]/20 animate-pulse" />
        <div className="h-28 rounded-[24px] bg-[color:var(--bg-secondary)]/20 animate-pulse" />
        <div className="h-28 rounded-[24px] bg-[color:var(--bg-secondary)]/20 animate-pulse" />
        <div className="h-28 rounded-[24px] bg-[color:var(--bg-secondary)]/20 animate-pulse" />
      </div>
    </div>
  );
}
