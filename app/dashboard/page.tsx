'use client';

import * as React from 'react';
import { Navbar } from '@/components/landing/navbar';
import { Sidebar } from '@/components/dashboard/sidebar';
import { DashboardOverview } from '@/components/dashboard/dashboard-overview';
import { TaskPlanner } from '@/components/dashboard/task-planner';
import { FocusTimer } from '@/components/dashboard/focus-timer';
import { motion } from 'motion/react';

const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const columnVariants: any = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 18,
    },
  },
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 dark:bg-[#0B0C0E] dark:text-white relative overflow-x-hidden transition-colors duration-300">
      {/* Soft Ambient Radial Background Glows */}
      <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-blue-600/5 dark:bg-blue-600/10 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-[60%] right-[10%] w-[600px] h-[600px] bg-amber-600/5 dark:bg-amber-600/10 blur-[140px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10">
        <Navbar view="dashboard" />
        
        <motion.div
          key="dashboard"
          id="dashboard-workspace"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="pt-28 pb-12 relative z-10"
        >
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full px-4 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            {/* Sidebar - 3 Columns */}
            <motion.div variants={columnVariants} className="lg:col-span-3">
              <Sidebar />
            </motion.div>

            {/* Main Workspace - 6 Columns */}
            <motion.div variants={columnVariants} className="lg:col-span-6 space-y-6">
              <DashboardOverview />
              <TaskPlanner />
            </motion.div>

            {/* Right Focus Workspace - 3 Columns */}
            <motion.div variants={columnVariants} className="lg:col-span-3 space-y-6">
              <FocusTimer />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
