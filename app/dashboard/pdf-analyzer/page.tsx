'use client';

import * as React from 'react';
import { Navbar } from '@/components/landing/navbar';
import { Sidebar } from '@/components/dashboard/sidebar';
import { PDFAnalyzerView } from '@/components/dashboard/pdf-analyzer-view';
import { motion } from 'motion/react';

export default function PDFAnalyzerPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 dark:bg-[#0B0C0E] dark:text-white relative overflow-x-hidden transition-colors duration-300">
      {/* Soft Ambient Radial Background Glows */}
      <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-amber-600/5 dark:bg-amber-600/10 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-[60%] right-[10%] w-[600px] h-[600px] bg-rose-600/5 dark:bg-rose-600/10 blur-[140px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10">
        <Navbar view="dashboard" />
        
        <motion.div
          key="pdf-analyzer-workspace"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="pt-28 pb-12 relative z-10"
        >
          <div className="w-full px-4 max-w-[1600px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Sidebar - 3 Columns */}
              <div className="lg:col-span-3 sticky top-28">
                <Sidebar />
              </div>

              {/* Main PDF Analyzer Workspace - 9 Columns */}
              <div className="lg:col-span-9">
                <PDFAnalyzerView />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
