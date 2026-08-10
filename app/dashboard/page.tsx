'use client';


export const dynamic = 'force-dynamic';

import * as React from 'react';
import { motion } from 'motion/react';
import nextDynamic from 'next/dynamic';

// Dynamically import the main dashboard views with ssr: false to prevent hydration issues
const DashboardOverview = nextDynamic(
  () => import('@/components/dashboard/dashboard-overview').then((mod) => mod.DashboardOverview),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-6 p-6 rounded-[32px] border border-white/[0.05] bg-slate-950/80 shadow-2xl shadow-slate-950/20 backdrop-blur-xl animate-pulse">
        <div className="h-7 w-1/3 rounded-full bg-white/10" />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-48 rounded-[24px] bg-white/5" />
          <div className="h-48 rounded-[24px] bg-white/5" />
        </div>
      </div>
    ),
  }
);

const TaskPlanner = nextDynamic(
  () => import('@/components/dashboard/task-planner').then((mod) => mod.TaskPlanner),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4 p-6 rounded-[32px] border border-white/[0.05] bg-slate-950/80 shadow-2xl shadow-slate-950/20 backdrop-blur-xl animate-pulse">
        <div className="h-6 w-1/4 rounded-full bg-white/10" />
        <div className="h-40 rounded-[24px] bg-white/5" />
      </div>
    ),
  }
);

const FocusTimer = nextDynamic(
  () => import('@/components/dashboard/focus-timer').then((mod) => mod.FocusTimer),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4 p-6 rounded-[32px] border border-white/[0.05] bg-slate-950/80 shadow-2xl shadow-slate-950/20 backdrop-blur-xl animate-pulse">
        <div className="h-6 w-1/3 rounded-full bg-white/10" />
        <div className="h-64 rounded-[24px] bg-white/5" />
      </div>
    ),
  }
);

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
  hidden: { y: 20, opacity: 0 },
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
    <motion.div
      key="dashboard"
      id="dashboard-workspace"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="relative z-10 w-full"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-9 gap-6 items-start w-full"
      >
        {/* Main Workspace - 6 out of 9 Columns (equivalent to 6/12) */}
        <motion.div variants={columnVariants} className="lg:col-span-6 space-y-6 w-full">
          <DashboardOverview />
          <TaskPlanner />
        </motion.div>

        {/* Right Focus Workspace - 3 out of 9 Columns (equivalent to 3/12) */}
        <motion.div variants={columnVariants} className="lg:col-span-3 space-y-6 w-full">
          <FocusTimer />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
