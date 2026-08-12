'use client';

import * as React from 'react';
import { Navbar } from '@/components/landing/navbar';
import { Sidebar } from '@/components/dashboard/sidebar';
import nextDynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'motion/react';

const QuickNote = nextDynamic(
  () => import('@/components/dashboard/quick-note').then((mod) => mod.QuickNote),
  { ssr: false }
);

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Close sidebar when route changes or on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <main className="min-h-screen bg-[color:var(--bg-primary)] text-[color:var(--text-primary)] relative overflow-x-hidden transition-colors duration-300">
      {/* Soft Ambient Radial Background Glows */}
      <div className="absolute top-[22%] left-[8%] w-[360px] h-[360px] rounded-full pointer-events-none z-0 opacity-70" style={{ backgroundColor: 'rgba(59,130,246,0.08)', filter: 'blur(110px)' }} />
      <div className="absolute top-[58%] right-[8%] w-[420px] h-[420px] rounded-full pointer-events-none z-0 opacity-70" style={{ backgroundColor: 'rgba(245,158,11,0.07)', filter: 'blur(120px)' }} />

      <div className="relative z-10">
        <Navbar view="dashboard" onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />

        {/* Mobile Backdrop Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Mobile Sidebar Drawer - Completely Separate Fixed Element */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed left-0 top-0 h-screen w-4/5 max-w-xs z-50 lg:hidden overflow-y-auto bg-slate-900"
              style={{ overscrollBehavior: 'contain' }}
            >
              <Sidebar isMobile={true} onNavClick={() => setSidebarOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-28 pb-12 relative z-10">
          <div className="w-full px-4 max-w-[1600px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Desktop Persistent Sidebar (3 Columns) */}
              <div className="hidden lg:block lg:col-span-3 sticky top-28 z-20">
                <Sidebar isMobile={false} />
              </div>

              {/* Main Workspace (9 Columns) */}
              <div className="lg:col-span-9 w-full">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Quick Note Workspace */}
      <QuickNote />
    </main>
  );
}
