'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

interface TestimonialItem {
  name: string;
  university: string;
  avatarBg: string;
  initials: string;
  rating: number;
  review: string;
}

const testimonialsList: TestimonialItem[] = [
  {
    name: "Alex Rivera",
    university: "Stanford University (Computer Science)",
    avatarBg: "bg-gradient-to-tr from-amber-500 to-orange-600",
    initials: "AR",
    rating: 5,
    review: "The AI Personal Tutor completely revolutionized how I prepare for my algorithm exams. Being able to explain complex memory heaps in simple terms saved me hours of frustration. My retention capacity is at an all-time high."
  },
  {
    name: "Samantha Chen",
    university: "MIT (Neuroscience & Cognitive Science)",
    avatarBg: "bg-gradient-to-tr from-blue-500 to-indigo-600",
    initials: "SC",
    rating: 5,
    review: "I upload long research publications and textbooks to EduSpark. The AI PDF Learning is incredibly precise—I can search, query, and synthesize complex insights instantaneously without wasting hours taking notes."
  },
  {
    name: "Marcus Vance",
    university: "UC Berkeley (Data Systems Engineering)",
    avatarBg: "bg-gradient-to-tr from-emerald-500 to-teal-600",
    initials: "MV",
    rating: 5,
    review: "I use the AI Quiz Generator and Flashcards to study. The spaced repetition algorithms are top-tier. My GPA increased from 3.4 to 3.9 this semester, and my study velocity is easily 4.8x faster."
  }
];

export function Testimonials() {
  const { darkMode } = useTheme();

  return (
    <section className="w-full py-20 px-4 bg-transparent relative overflow-hidden" id="testimonials">
      {/* Background glowing dot */}
      <div className="w-80 h-80 bg-orange-500/[0.03] dark:bg-orange-500/[0.05] blur-[120px] rounded-full absolute top-1/2 left-1/4 -z-10 pointer-events-none" />

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
            <span>SOCIAL PROOF</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-heading font-black tracking-tight mb-4 text-slate-900 dark:text-white"
          >
            Loved by Students
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm md:text-base font-medium"
          >
            Read reviews from students worldwide who have transformed their grades and boosted their recall potential.
          </motion.p>
        </div>

        {/* 3-Column Testimonials Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {testimonialsList.map((test, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "rounded-[32px] p-8 border transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 relative group flex flex-col justify-between h-full",
                darkMode 
                  ? "bg-[#121316]/40 border-white/[0.08] hover:border-amber-500/30" 
                  : "bg-white/50 border-black/[0.06] hover:border-amber-500/20"
              )}
            >
              {/* Quote frame */}
              <div className="absolute top-6 right-8 opacity-5 text-slate-400 dark:text-white group-hover:scale-110 transition-transform duration-500">
                <Quote className="w-16 h-16" />
              </div>

              <div>
                {/* Stars */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>

                {/* Review */}
                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-8">
                  &ldquo;{test.review}&rdquo;
                </p>
              </div>

              {/* User Bio */}
              <div className="flex items-center gap-4 border-t border-slate-200 dark:border-white/[0.05] pt-6">
                {/* Initials Avatar */}
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-sm shadow-md",
                  test.avatarBg
                )}>
                  {test.initials}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white">
                    {test.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider mt-0.5">
                    {test.university}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
