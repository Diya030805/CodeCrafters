'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, BookOpen, Cpu, LineChart } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useAccent } from '@/components/accent-provider';
import { cn } from '@/lib/utils';

interface StepItem {
  number: string;
  icon: React.ComponentType<any>;
  title: string;
  description: string;
}

const stepsList: StepItem[] = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create your account",
    description: "Sign up in seconds to initiate your personal learning profile and baseline memory diagnostics."
  },
  {
    number: "02",
    icon: BookOpen,
    title: "Choose a course",
    description: "Import study materials, link your academic calendar, or pick an intellectual path to pursue."
  },
  {
    number: "03",
    icon: Cpu,
    title: "Learn with AI",
    description: "Engage with the conversational tutor, generate modular quiz runs, and practice with flashcards."
  },
  {
    number: "04",
    icon: LineChart,
    title: "Track your progress",
    description: "Review cognitive graphs, retention summaries, and real-time statistics to secure continuous study momentum."
  }
];

export function HowItWorks() {
  const { darkMode } = useTheme();
  const { meta } = useAccent();

  return (
    <section className="w-full py-20 px-4 bg-transparent relative overflow-hidden" id="how-it-works">
      {/* Background ambient light */}
      <div className="w-[500px] h-[500px] bg-amber-500/[0.02] dark:bg-amber-600/[0.03] blur-[150px] rounded-full absolute bottom-0 left-0 -translate-x-1/2 -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] uppercase tracking-widest font-black mb-4"
          >
            <span>ENGINE WORKFLOW</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-heading font-black tracking-tight mb-4 text-slate-900 dark:text-white"
          >
            How EduSpark Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm md:text-base font-medium"
          >
            A high-efficiency workflow designed to take you from initial goals to total memory mastery.
          </motion.p>
        </div>

        {/* Timeline container */}
        <div className="relative mt-12">
          {/* Connecting Line (Only visible on large screens) */}
          <div className="hidden lg:block absolute top-[68px] left-[10%] right-[10%] h-[2px] bg-slate-200 dark:bg-white/[0.06] -z-10 overflow-hidden">
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-600 to-amber-500 origin-left"
            />
          </div>

          {/* Timeline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {stepsList.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Step Bubble & Icon */}
                  <div className="relative mb-6">
                    <div className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 border shadow-lg group-hover:scale-110 relative z-10",
                      darkMode 
                        ? "bg-[#121316] border-white/[0.08] text-slate-300 group-hover:border-amber-500/50 group-hover:shadow-amber-500/10" 
                        : "bg-white border-black/[0.06] text-slate-700 group-hover:border-amber-500/30 group-hover:shadow-amber-500/5"
                    )}>
                      <Icon className="w-6 h-6 transition-transform group-hover:scale-110" />
                    </div>

                    {/* Step Number Tag */}
                    <div 
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-md z-20 transition-all duration-300"
                      style={{ backgroundColor: meta.hex }}
                    >
                      {step.number}
                    </div>

                    {/* Outer pulse effect on hover */}
                    <div 
                      className="absolute inset-0 rounded-full scale-100 group-hover:scale-125 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-md -z-10"
                      style={{ backgroundColor: `${meta.hex}15` }}
                    />
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-extrabold text-lg text-slate-800 dark:text-white mb-2 transition-colors duration-300 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed font-medium max-w-[260px]">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
