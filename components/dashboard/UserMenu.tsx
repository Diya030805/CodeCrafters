'use client';

import { cn } from '@/lib/utils';
import { useAccent } from '@/components/accent-provider';
import { useTheme } from '@/components/theme-provider';
import { useUser } from '@clerk/nextjs';

export function UserMenu() {
  const { meta } = useAccent();
  const { darkMode } = useTheme();
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-slate-200/20 dark:bg-white/[0.02] border border-slate-300/20 dark:border-white/[0.04] animate-pulse">
        <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-zinc-800 shrink-0" />
        <div className="flex-1 space-y-1.5 min-w-0">
          <div className="h-3 w-20 bg-slate-300 dark:bg-zinc-800 rounded" />
          <div className="h-2.5 w-28 bg-slate-200 dark:bg-zinc-850 rounded" />
        </div>
      </div>
    );
  }

  // Fallback default info if not signed in for some reason (handled gracefully)
  const userImageUrl = isSignedIn && user?.imageUrl;
  const fullName = (isSignedIn && user?.fullName) || "EducAI Scholar";
  const email = (isSignedIn && user?.primaryEmailAddress?.emailAddress) || "scholar@educai.dev";
  const initials = (isSignedIn && user?.firstName) 
    ? (user.firstName.charAt(0) + (user.lastName?.charAt(0) || "")) 
    : "EA";

  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-slate-200/20 dark:bg-white/[0.02] border border-slate-300/20 dark:border-white/[0.04] transition-all hover:bg-slate-200/40 dark:hover:bg-white/[0.04]">
      <div className="flex-shrink-0">
        <div 
          className="w-8 h-8 rounded-full border border-slate-300 dark:border-white/10 flex items-center justify-center font-bold text-xs overflow-hidden bg-slate-100 dark:bg-zinc-900"
          style={{ backgroundColor: userImageUrl ? undefined : `${meta.hex}20`, color: userImageUrl ? undefined : meta.hex }}
        >
          {userImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={userImageUrl} 
              alt={fullName} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            initials
          )}
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
