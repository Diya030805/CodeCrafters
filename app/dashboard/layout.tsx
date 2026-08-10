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
    <main className="min-h-screen bg-[color:var(--bg-primary)] text-[color:var(--text-primary)] relative overflow-x-hidden transition-colors duration-300">
      {/* Soft Ambient Radial Background Glows */}
      <div className="absolute top-[22%] left-[8%] w-[360px] h-[360px] rounded-full pointer-events-none z-0 opacity-70" style={{ backgroundColor: 'rgba(59,130,246,0.08)', filter: 'blur(110px)' }} />
      <div className="absolute top-[58%] right-[8%] w-[420px] h-[420px] rounded-full pointer-events-none z-0 opacity-70" style={{ backgroundColor: 'rgba(245,158,11,0.07)', filter: 'blur(120px)' }} />

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
