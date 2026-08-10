'use client';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#090A0E] text-slate-200">
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-[0_20px_50px_rgba(15,23,42,0.45)]">
          <div className="h-12 w-12 rounded-full border-t-2 border-cyan-400 animate-spin" />
        </div>
        <div className="mt-6 space-y-3 w-full max-w-xs">
          <div className="h-3.5 rounded-full bg-slate-800/80 animate-pulse" />
          <div className="h-3 rounded-full bg-slate-800/70 animate-pulse w-4/6 mx-auto" />
        </div>
      </div>
    </div>
  );
}
