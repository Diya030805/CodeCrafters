'use client';

import * as React from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/theme-provider';
import { Moon, Sun, Sparkles, Menu, X, ChevronDown, LayoutDashboard, User, Settings, ShieldCheck, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { glassStyles } from '@/lib/glass';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth, useClerk, useUser } from '@clerk/nextjs';
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
  const { userId } = useAuth();
  const { signOut } = useClerk();
  const router = useRouter();
  const { user, isSignedIn, isLoaded } = useUser();
  const [showDropdown, setShowDropdown] = React.useState(false);
  const clerk = useClerk();
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
            EducAI<span className="text-amber-500">.</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
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

        <div className="flex items-center gap-2 md:gap-4">
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

          {/* Desktop Call to Action Button / Premium Dropdown */}
          <div className="hidden md:flex items-center relative" ref={dropdownRef}>
            {!isLoaded ? (
              <div className="h-10 w-28 bg-slate-200/10 dark:bg-zinc-800/20 rounded-full animate-pulse border border-black/[0.08] dark:border-white/[0.08]" />
            ) : isSignedIn && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/[0.08] dark:border-white/[0.08] bg-white/50 dark:bg-zinc-900/50 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 transition-all duration-300 cursor-pointer shadow-sm active:scale-95 outline-none group"
                >
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-amber-500/30 group-hover:border-amber-500 transition-colors shrink-0">
                    {user.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={user.imageUrl} 
                        alt={user.fullName || "User Avatar"} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-amber-600 flex items-center justify-center text-white font-bold text-xs">
                        {user.firstName?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 group-hover:text-slate-950 dark:group-hover:text-white transition-colors max-w-[120px] truncate">
                    {user.firstName || "Scholar"}
                  </span>
                  <ChevronDown className={cn("w-3.5 h-3.5 text-slate-500 transition-transform duration-300", showDropdown && "rotate-180")} />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 mt-2 w-64 rounded-2xl border border-black/10 dark:border-white/[0.08] bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl shadow-2xl p-2 z-[110] flex flex-col gap-1"
                    >
                      {/* User Header Block */}
                      <div className="px-3 py-3 border-b border-black/[0.06] dark:border-white/[0.06] flex flex-col text-left mb-1">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {user.fullName || "EducAI Scholar"}
                        </span>
                        <span className="text-[10px] font-medium text-slate-500 dark:text-zinc-400 truncate mt-0.5">
                          {user.primaryEmailAddress?.emailAddress || "scholar@educai.dev"}
                        </span>
                      </div>

                      {/* Menu Options */}
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          router.push('/dashboard');
                        }}
                        className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] hover:text-slate-950 dark:hover:text-white transition-all duration-200 cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        My Dashboard
                      </button>

                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          clerk.openUserProfile();
                        }}
                        className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] hover:text-slate-950 dark:hover:text-white transition-all duration-200 cursor-pointer"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        My Profile
                      </button>

                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          clerk.openUserProfile();
                        }}
                        className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] hover:text-slate-950 dark:hover:text-white transition-all duration-200 cursor-pointer"
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        Settings
                      </button>

                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          clerk.openUserProfile();
                        }}
                        className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] hover:text-slate-950 dark:hover:text-white transition-all duration-200 cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-slate-400" />
                        Manage Account
                      </button>

                      {/* Separator */}
                      <div className="h-px bg-black/[0.06] dark:bg-white/[0.06] my-1" />

                      <button
                        onClick={async () => {
                          setShowDropdown(false);
                          await signOut();
                          router.push('/');
                        }}
                        className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all duration-200 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Button 
                onClick={async (e) => {
                  e.preventDefault();
                  if (onGetStarted) {
                    onGetStarted();
                  } else {
                    router.push('/sign-up');
                  }
                }}
                className="rounded-full px-5 h-10 bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all duration-300 active:scale-[0.97] cursor-pointer"
              >
                Get Started
              </Button>
            )}
          </div>

          {/* Hamburger Menu Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-black/[0.08] dark:border-white/[0.08] bg-white/50 dark:bg-zinc-900/50 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 transition-all duration-300 cursor-pointer shadow-sm active:scale-95 outline-none"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
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
              {!isLoaded ? (
                <div className="h-10 w-full bg-white/[0.04] rounded-full animate-pulse border border-white/[0.06]" />
              ) : isSignedIn && user ? (
                <div className="flex flex-col gap-3">
                  {/* User Header Block (Mobile) */}
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-500/30">
                      {user.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={user.imageUrl} 
                          alt={user.fullName || "User Avatar"} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-amber-600 flex items-center justify-center text-white font-bold text-sm">
                          {user.firstName?.charAt(0) || "U"}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <span className="text-xs font-bold text-white truncate">
                        {user.fullName || "EducAI Scholar"}
                      </span>
                      <span className="text-[10px] font-medium text-zinc-400 truncate mt-0.5">
                        {user.primaryEmailAddress?.emailAddress || "scholar@educai.dev"}
                      </span>
                    </div>
                  </div>

                  {/* Mobile Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => {
                        setIsOpen(false);
                        router.push('/dashboard');
                      }}
                      className="rounded-xl py-2 px-3 bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.06] text-xs font-bold transition-all duration-200"
                    >
                      Dashboard
                    </Button>
                    <Button
                      onClick={() => {
                        setIsOpen(false);
                        clerk.openUserProfile();
                      }}
                      className="rounded-xl py-2 px-3 bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.06] text-xs font-bold transition-all duration-200"
                    >
                      Profile
                    </Button>
                  </div>

                  <Button 
                    onClick={async (e) => {
                      e.preventDefault();
                      setIsOpen(false);
                      await signOut();
                      router.push('/');
                    }}
                    className="w-full rounded-full h-10 bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all duration-300 active:scale-[0.98] cursor-pointer"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                    if (onGetStarted) {
                      onGetStarted();
                    } else {
                      router.push('/sign-up');
                    }
                  }}
                  className="w-full rounded-full h-10 bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all duration-300 active:scale-[0.98] cursor-pointer"
                >
                  Get Started
                </Button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
