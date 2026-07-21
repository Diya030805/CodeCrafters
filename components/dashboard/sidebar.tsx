'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  Globe, 
  BarChart3, 
  Settings2,
  Search,
  ArrowRight,
  Check,
  Volume2,
  VolumeX,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { glassStyles } from '@/lib/glass';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

import { useAccent, AccentColor } from '@/components/accent-provider';
import { useTheme } from '@/components/theme-provider';
import { UserMenu } from '@/components/dashboard/UserMenu';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
  { icon: Sparkles, label: 'AI Tutor', href: '/dashboard/ai-tutor' },
  { icon: BookOpen, label: 'Study Library', href: '/dashboard/knowledge-base' },
  { icon: Globe, label: 'Global Network', href: '/dashboard/network' },
  { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
  { icon: Settings2, label: 'Preferences', href: '/dashboard/preferences' },
];

const themeAccents = [
  { id: 'amber', name: 'Amber', color: 'bg-amber-600', ring: 'ring-amber-600' },
  { id: 'blue', name: 'Blue', color: 'bg-blue-600', ring: 'ring-blue-600' },
  { id: 'green', name: 'Green', color: 'bg-emerald-600', ring: 'ring-emerald-600' },
  { id: 'crimson', name: 'Crimson', color: 'bg-rose-600', ring: 'ring-rose-600' },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { darkMode, soundEnabled, setSoundEnabled } = useTheme();
  const { accentColor, setAccentColor, meta } = useAccent();

  const activeAccentClasses = darkMode ? meta.dark : meta.light;

  return (
    <aside className={cn("p-6 flex flex-col gap-8 h-full min-h-[calc(100vh-120px)] transition-all duration-300", glassStyles.container)}>
      {/* User Profile Menu */}
      <UserMenu />

      {/* Search Pill */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Search curriculum..."
          className={cn(
            "w-full pl-11 pr-4 py-3 text-sm outline-none transition-all duration-300",
            glassStyles.input
          )}
        />
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.label === 'Overview' && pathname === '/dashboard');
          return (
            <motion.div
              key={item.href}
              onMouseEnter={() => setHoveredItem(item.label)}
              onMouseLeave={() => setHoveredItem(null)}
              className="relative"
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              <AnimatePresence>
                {hoveredItem === item.label && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="absolute left-[calc(100%+16px)] top-1/2 -translate-y-1/2 z-50 px-3 py-1.5 rounded-lg bg-slate-900/90 dark:bg-black/90 backdrop-blur-md border border-white/[0.1] text-white text-[10px] font-bold whitespace-nowrap shadow-xl"
                  >
                    {item.label}
                  </motion.div>
                )}
              </AnimatePresence>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 group",
                  isActive 
                    ? cn(activeAccentClasses.button, "shadow-lg") 
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-white/[0.05] hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn(
                    "w-5 h-5 transition-all duration-300", 
                    isActive 
                       ? "text-white" 
                      : cn("text-slate-500 dark:text-slate-400", activeAccentClasses.text.split(' ').map(c => `group-hover:${c}`).join(' '))
                  )} />
                  <span className={cn(
                    "transition-all duration-300",
                    isActive ? "text-white" : activeAccentClasses.text.split(' ').map(c => `group-hover:${c}`).join(' ')
                  )}>
                    {item.label}
                  </span>
                </div>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <ArrowRight className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Theme Accent Selector */}
      <div className="mt-auto pt-8 border-t border-slate-200 dark:border-white/[0.05]">
        <h3 className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-5 px-2">
          THEME ACCENT
        </h3>
        <div className="flex items-center gap-3 px-2">
          {themeAccents.map((accent) => (
            <button
              key={accent.id}
              onClick={() => setAccentColor(accent.id)}
              className={cn(
                "w-7 h-7 rounded-full transition-all duration-300 relative flex items-center justify-center cursor-pointer hover:scale-110 active:scale-90",
                accent.color,
                accentColor === accent.id 
                  ? `scale-110 ring-2 ring-offset-2 ring-offset-slate-100 dark:ring-offset-[#0B0C0E] ${accent.ring} shadow-md`
                  : "opacity-80 hover:opacity-100"
              )}
            >
              {accentColor === accent.id && <Check className="w-3.5 h-3.5 text-white" />}
            </button>
          ))}
        </div>
      </div>

      {/* Sound Effects Selector */}
      <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/[0.05]">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            {soundEnabled ? (
              <Volume2 className={cn("w-4 h-4 transition-colors", activeAccentClasses.text)} />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400 dark:text-slate-500 transition-colors" />
            )}
            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
              TIMER SOUNDS
            </span>
          </div>
          
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={cn(
              "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-[#0B0C0E]",
              soundEnabled ? meta.ring : "bg-slate-200 dark:bg-white/[0.1]"
            )}
            style={soundEnabled ? { backgroundColor: meta.hex } : {}}
            aria-label="Toggle Sound Effects"
          >
            <span
              className={cn(
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                soundEnabled ? "translate-x-5" : "translate-x-0"
              )}
            />
          </button>
        </div>
      </div>

      {/* AI Engine Status */}
      <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/[0.05]">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-slate-200/30 dark:bg-white/[0.02] border border-slate-300/30 dark:border-white/[0.03]">
          <div className="relative flex items-center justify-center">
            {/* Core Dot */}
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] z-10" />
            
            {/* Pulse Waves */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ 
                  scale: [1, 2.5], 
                  opacity: [0.5, 0] 
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  delay: i * 0.6,
                  ease: "easeOut"
                }}
                className="absolute w-2 h-2 rounded-full bg-emerald-500"
              />
            ))}
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] leading-none">
              AI Engine
            </span>
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">
              ONLINE
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
