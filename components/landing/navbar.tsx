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
  onSidebarToggle?: () => void;
  sidebarOpen?: boolean;
}

export function Navbar({ view = 'landing', onGetStarted, onBrandClick, activeSection, onNavigate, onSidebarToggle, sidebarOpen = false }: NavbarProps) {
  const { darkMode, setDarkMode } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();
  const isLanding = view === 'landing';
  const isDashboard = view === 'dashboard';

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
            <Sparkles className="w-5 h-5 text-[color:var(--bg-primary)]" />
          </div>
          <span className="text-xl font-heading font-bold tracking-tight text-[color:var(--text-primary)]">
            BrainBoost AI<span className="text-[color:var(--accent)]">.</span>
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
                    ? "text-[color:var(--accent)]"
                    : "text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
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
              className="relative flex items-center justify-center w-10 h-10 rounded-full border border-[color:var(--border)] bg-[color:var(--bg-secondary)]/80 text-[color:var(--text-primary)] hover:bg-[color:var(--bg-secondary)]/95 transition-all duration-300 cursor-pointer shadow-sm active:scale-95 outline-none"
              aria-label="Toggle theme"
            >
              <Sun className={cn("w-5 h-5 transition-all duration-300 absolute", darkMode ? "opacity-0 scale-75" : "opacity-100 scale-100")} />
              <Moon className={cn("w-5 h-5 transition-all duration-300 absolute", darkMode ? "opacity-100 scale-100" : "opacity-0 scale-75")} />
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
                className="rounded-full px-5 h-10 bg-[color:var(--accent)] hover:bg-[color:var(--accent)]/90 text-white font-bold transition-all duration-300 active:scale-[0.97] cursor-pointer"
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
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-[color:var(--border)] bg-[color:var(--bg-secondary)]/45 hover:bg-[color:var(--bg-secondary)]/65 text-[color:var(--text-secondary)] transition-all duration-300 cursor-pointer shadow-sm active:scale-95 outline-none"
                aria-label="Toggle navigation menu"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </Tooltip>
          )}

          {/* Dashboard Sidebar Menu Toggle Button */}
          {isDashboard && (
            <Tooltip content={sidebarOpen ? 'Close Sidebar' : 'Open Sidebar'} side="bottom" className="lg:hidden">
              <button
                onClick={() => onSidebarToggle?.()}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full border border-[color:var(--border)] bg-[color:var(--bg-secondary)]/45 hover:bg-[color:var(--bg-secondary)]/65 text-[color:var(--text-secondary)] transition-all duration-300 cursor-pointer shadow-sm active:scale-95 outline-none"
                aria-label="Toggle sidebar menu"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
            className="absolute top-14 left-0 right-0 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--card-bg)]/95 backdrop-blur-xl shadow-2xl md:hidden z-50 flex flex-col gap-4 p-5 text-[color:var(--text-primary)]"
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
                    "text-left text-sm font-medium py-2.5 px-3 rounded-lg transition-all duration-200 cursor-pointer hover:bg-[color:var(--bg-secondary)] flex items-center justify-between",
                    activeSection === item.id
                      ? "text-[color:var(--accent)] bg-[color:var(--bg-secondary)]/75 font-bold"
                      : "text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
                  )}
                >
                  <span>{item.name}</span>
                  {activeSection === item.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--accent)]" />
                  )}
                </motion.button>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="pt-2 border-t border-[color:var(--border)]"
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
                className="w-full rounded-full h-10 bg-[color:var(--accent)] hover:bg-[color:var(--accent)]/90 text-white font-bold transition-all duration-300 active:scale-[0.98] cursor-pointer"
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
