'use client';

import * as React from 'react';
import { Navbar } from '@/components/landing/navbar';
import { Sidebar } from '@/components/dashboard/sidebar';
import nextDynamic from 'next/dynamic';

const QuickNote = nextDynamic(
  () => import('@/components/dashboard/quick-note').then((mod) => mod.QuickNote),
  { ssr: false }
);

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 dark:bg-[#0B0C0E] dark:text-white relative overflow-x-hidden transition-colors duration-300">
      {/* Soft Ambient Radial Background Glows */}
      <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-blue-600/5 dark:bg-blue-600/10 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-[60%] right-[10%] w-[600px] h-[600px] bg-amber-600/5 dark:bg-amber-600/10 blur-[140px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10">
        <Navbar view="dashboard" />
        
        <div className="pt-28 pb-12 relative z-10">
          <div className="w-full px-4 max-w-[1600px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Persistent Sidebar (3 Columns) */}
              <div className="lg:col-span-3 sticky top-28 z-20">
                <Sidebar />
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
