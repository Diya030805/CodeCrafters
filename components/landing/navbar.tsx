'use client';

import * as React from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/theme-provider';
import { Moon, Sun, Sparkles, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { glassStyles } from '@/lib/glass';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  view?: 'landing' | 'dashboard';
  onGetStarted?: () => void;
  onBrandClick?: () => void;
  activeSection?: string;
  onNavigate?: (section: string) => void;
}

export function Navbar({ view = 'landing', onGetStarted, onBrandClick, activeSection, onNavigate }: NavbarProps) {
  const { darkMode, setDarkMode } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();
  const isLanding = view === 'landing';

  React.useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  return (
    <nav className={cn("fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl z-[100]", glassStyles.navbar)}>
      <div className="flex items-center justify-between w-full h-12">
        <Link
          href="/"
          onClick={(e) => {
            if (onBrandClick) {
              e.preventDefault();
              onBrandClick();
            }
          }}
          className="flex items-center gap-2 group outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center shadow-[0_0_15px_rgba(217,119,6,0.4)] group-hover:scale-110 transition-transform duration-200">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-heading font-bold tracking-tight text-slate-900 dark:text-white">
            BrainBoost AI<span className="text-amber-500">.</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        {isLanding && (
          <div className="hidden md:flex items-center gap-8">
            {[
              { name: 'Features', id: 'features' },
              { name: 'How It Works', id: 'how-it-works' },
              { name: 'Pricing', id: 'pricing' },
              { name: 'FAQ', id: 'faq' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate?.(item.id)}
                className={cn(
                  "text-sm font-medium transition-all duration-200 cursor-pointer",
                  activeSection === item.id
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                {item.name}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 md:gap-4">
          <Tooltip content={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'} side="bottom">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="relative flex items-center justify-center w-10 h-10 rounded-full border border-black/[0.08] dark:border-white/[0.08] bg-white/50 dark:bg-zinc-900/50 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 transition-all duration-300 cursor-pointer shadow-sm active:scale-95 outline-none"
              aria-label="Toggle theme"
            >
              {/* Sun Icon: visible in light mode (scale-100), spin-fades to 0 in dark mode */}
              <Sun className="w-5 h-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 absolute" />

              {/* Moon Icon: invisible in light mode (scale-0), spin-fades to 100 in dark mode */}
              <Moon className="w-5 h-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 absolute" />
            </button>
          </Tooltip>

          {/* Desktop Call to Action Button */}
          {isLanding && (
            <div className="hidden md:flex items-center relative">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  if (onGetStarted) {
                    onGetStarted();
                  } else {
                    router.push('/dashboard');
                  }
                }}
                className="rounded-full px-5 h-10 bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all duration-300 active:scale-[0.97] cursor-pointer"
              >
                Get Started
              </Button>
            </div>
          )}

          {/* Hamburger Menu Toggle Button */}
          {isLanding && (
            <Tooltip content={isOpen ? 'Close Menu' : 'Open Navigation Menu'} side="bottom" className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-black/[0.08] dark:border-white/[0.08] bg-white/50 dark:bg-zinc-900/50 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 transition-all duration-300 cursor-pointer shadow-sm active:scale-95 outline-none"
                aria-label="Toggle navigation menu"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Mobile Navigation Drawer Overlay */}
      <AnimatePresence>
        {isLanding && isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-14 left-0 right-0 overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-slate-900/95 dark:bg-zinc-950/95 backdrop-blur-xl shadow-2xl md:hidden z-50 flex flex-col gap-4 p-5 text-white"
          >
            <div className="flex flex-col gap-1">
              {[
                { name: 'Features', id: 'features' },
                { name: 'How It Works', id: 'how-it-works' },
                { name: 'Pricing', id: 'pricing' },
                { name: 'FAQ', id: 'faq' }
              ].map((item, index) => (
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={item.id}
                  onClick={() => {
                    setIsOpen(false);
                    onNavigate?.(item.id);
                  }}
                  className={cn(
                    "text-left text-sm font-medium py-2.5 px-3 rounded-lg transition-all duration-200 cursor-pointer hover:bg-white/[0.05] flex items-center justify-between",
                    activeSection === item.id
                      ? "text-amber-400 bg-white/[0.06] font-bold"
                      : "text-zinc-300 hover:text-white"
                  )}
                >
                  <span>{item.name}</span>
                  {activeSection === item.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  )}
                </motion.button>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="pt-2 border-t border-white/[0.06]"
            >
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpen(false);
                  if (onGetStarted) {
                    onGetStarted();
                  } else {
                    router.push('/dashboard');
                  }
                }}
                className="w-full rounded-full h-10 bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all duration-300 active:scale-[0.98] cursor-pointer"
              >
                Get Started
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
