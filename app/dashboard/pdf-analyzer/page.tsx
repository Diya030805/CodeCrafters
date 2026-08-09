'use client';


export const dynamic = 'force-dynamic';

import * as React from 'react';
import { motion } from 'motion/react';
import nextDynamic from 'next/dynamic';

const PDFAnalyzerView = nextDynamic(
  () => import('@/components/dashboard/pdf-analyzer-view').then((mod) => mod.PDFAnalyzerView),
  { ssr: false, loading: () => <div className="h-96 rounded-2xl bg-slate-100/50 dark:bg-white/[0.02] animate-pulse" /> }
);

export default function PDFAnalyzerPage() {
  return (
    <motion.div
      key="pdf-analyzer-workspace"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full"
    >
      <PDFAnalyzerView />
    </motion.div>
  );
}
