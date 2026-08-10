'use client';

import { useAccent } from '@/components/accent-provider';

export function UserMenu() {
  const { meta } = useAccent();

  const fullName = "Diya Ghosh";
  const email = "diyaghosh030805@gmail.com";
  const initials = "DG";

  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-[color:var(--card-bg)] border border-[color:var(--border)] text-[color:var(--text-primary)] transition-all hover:bg-[color:var(--bg-secondary)]">
      <div className="flex-shrink-0">
        <div
          className="w-8 h-8 rounded-full border border-[color:var(--border)] flex items-center justify-center font-bold text-xs overflow-hidden"
          style={{ backgroundColor: `${meta.hex}20`, color: meta.hex }}
        >
          {initials}
        </div>
      </div>
      <div className="flex-1 min-w-0 flex flex-col text-left">
        <span className="text-xs font-bold text-[color:var(--text-primary)] truncate leading-tight">
          {fullName}
        </span>
        <span className="text-[10px] font-medium text-[color:var(--text-secondary)] truncate mt-0.5">
          {email}
        </span>
      </div>
    </div>
  );
}
