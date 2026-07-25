'use client';

import { useAccent } from '@/components/accent-provider';

export function UserMenu() {
  const { meta } = useAccent();

  const fullName = "Diya Ghosh";
  const email = "diyaghosh030805@gmail.com";
  const initials = "DG";

  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-slate-200/20 dark:bg-white/[0.02] border border-slate-300/20 dark:border-white/[0.04] transition-all hover:bg-slate-200/40 dark:hover:bg-white/[0.04]">
      <div className="flex-shrink-0">
        <div 
          className="w-8 h-8 rounded-full border border-slate-300 dark:border-white/10 flex items-center justify-center font-bold text-xs overflow-hidden bg-slate-100 dark:bg-zinc-900"
          style={{ backgroundColor: `${meta.hex}20`, color: meta.hex }}
        >
          {initials}
        </div>
      </div>
      <div className="flex-1 min-w-0 flex flex-col text-left">
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-tight">
          {fullName}
        </span>
        <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 truncate mt-0.5">
          {email}
        </span>
      </div>
    </div>
  );
}
