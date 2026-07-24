'use client';

import * as React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

interface HeroProps {
  onStartFreeTrial?: () => void;
}

export function Hero({ onStartFreeTrial }: HeroProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section className="pt-32 pb-20 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] uppercase tracking-widest font-bold mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span>System Active • v2.4.0</span>
            </div>
            <h1 className="text-6xl lg:text-7xl font-heading font-bold tracking-tighter mb-6 leading-[0.9] text-slate-900 dark:text-white">
              Learn Smarter <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 font-serif italic">With EducAI.</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-lg leading-relaxed">
              Personalized study pathways designed to maximize retention and minimize friction using EducAI&apos;s neural feedback.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                size="lg" 
                onClick={(e) => {
                  e.preventDefault();
                  if (onStartFreeTrial) {
                    onStartFreeTrial();
                  }
                }}
                className="rounded-full px-8 h-14 text-base font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/20 hover:scale-105 transition-all duration-300 active:scale-[0.97] cursor-pointer"
              >
                Start Free Trial <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base font-bold border-black/[0.08] dark:border-white/[0.1] hover:bg-black/[0.02] dark:hover:bg-white/[0.05] text-slate-800 dark:text-white">
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-100 dark:border-[#0B0C0E] bg-muted flex items-center justify-center overflow-hidden relative">
                    <Image 
                      src={`https://picsum.photos/seed/${i + 10}/100/100`} 
                      alt="Student" 
                      fill
                      sizes="40px"
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-amber-500">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                </div>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Trusted by <span className="text-slate-900 dark:text-white font-bold">10k+ students</span>
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: '1000px' }}
          >
            <motion.div
              style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }}
              className="relative aspect-square rounded-3xl overflow-hidden frosted-glass p-8 group"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Abstract AI Graphic */}
              <svg viewBox="0 0 400 400" className="w-full h-full text-primary drop-shadow-2xl">
                <motion.path
                  d="M200,100 C250,100 300,150 300,200 C300,250 250,300 200,300 C150,300 100,250 100,200 C100,150 150,100 200,100 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  animate={{
                    d: [
                      "M200,100 C250,100 300,150 300,200 C300,250 250,300 200,300 C150,300 100,250 100,200 C100,150 150,100 200,100 Z",
                      "M200,80 C280,80 320,160 320,200 C320,240 280,320 200,320 C120,320 80,240 80,200 C80,160 120,80 200,80 Z",
                      "M200,100 C250,100 300,150 300,200 C300,250 250,300 200,300 C150,300 100,250 100,200 C100,150 150,100 200,100 Z"
                    ]
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                <circle cx="200" cy="200" r="10" fill="currentColor" />
                {[0, 60, 120, 180, 240, 300].map((angle) => (
                  <motion.line
                    key={angle}
                    x1="200"
                    y1="200"
                    x2={Number((200 + 100 * Math.cos((angle * Math.PI) / 180)).toFixed(2))}
                    y2={Number((200 + 100 * Math.sin((angle * Math.PI) / 180)).toFixed(2))}
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                ))}
                {/* Brain-like nodes */}
                {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                  <motion.circle
                    key={i}
                    cx={Number((200 + 100 * Math.cos((angle * Math.PI) / 180)).toFixed(2))}
                    cy={Number((200 + 100 * Math.sin((angle * Math.PI) / 180)).toFixed(2))}
                    r="5"
                    fill="currentColor"
                    animate={{ r: [5, 8, 5] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                  />
                ))}
              </svg>

              <div className="absolute bottom-8 left-8 right-8 p-6 rounded-2xl bg-white/70 dark:bg-white/5 border border-black/[0.04] dark:border-white/10 backdrop-blur-sm overflow-hidden">
                {/* Floating particle shadow micro-glows */}
                <div className="absolute -top-3 -right-3 w-6 h-6 text-amber-500/80 animate-[spin_8s_linear_infinite] pointer-events-none">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
                    <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z" />
                  </svg>
                </div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500/30 rounded-full animate-[pulse_2.5s_ease-in-out_infinite] pointer-events-none blur-[1px]" />

                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-700 dark:text-white opacity-60">AI Engine Online</span>
                </div>
                <div className="h-1 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary"
                    animate={{ width: ['0%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
