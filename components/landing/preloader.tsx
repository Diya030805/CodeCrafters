'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PreloaderProps {
  onComplete?: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [mounted, setMounted] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [isExiting, setIsExiting] = React.useState(false);

  React.useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
    // Lock background scroll during preloader active phase
    document.body.style.overflow = 'hidden';

    // Simulate precise loading increments
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Random organic loading increments
        const next = prev + Math.floor(Math.random() * 12) + 5;
        return next > 100 ? 100 : next;
      });
    }, 120);

    return () => {
      clearInterval(interval);
    };
  }, []);

  React.useEffect(() => {
    if (progress === 100) {
      // Trigger exit sequence after full progress with a premium cinematic delay
      const timeout = setTimeout(() => {
        setIsExiting(true);
        const completeTimeout = setTimeout(() => {
          document.body.style.overflow = '';
          onComplete?.();
        }, 800); // match exit transition duration
        return () => clearTimeout(completeTimeout);
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  if (!mounted) return null;

  const brandText = "BrainBoost AI";
  const letters = brandText.split("");

  // Framer Motion spring and stagger configurations
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const letterVariants: any = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 14,
      },
    },
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          id="premium-preloader"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.05,
            filter: 'blur(10px)',
            transition: { 
              duration: 0.8, 
              ease: [0.16, 1, 0.3, 1] 
            }
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#070913] text-white overflow-hidden select-none"
        >
          {/* Kinetic Ambient Glow behind Brand Name */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-amber-500/10 to-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[80px]" />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-10">
            {/* Staggered Letter Entrance inside masks */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex items-center text-4xl sm:text-6xl md:text-7xl font-sans font-black tracking-tight"
            >
              {letters.map((char, index) => {
                const isOrangeAccent = char === 'A' || char === 'i';
                return (
                  <span key={index} className="overflow-hidden inline-block py-2">
                    <motion.span
                      variants={letterVariants}
                      className={cn(
                        "inline-block",
                        isOrangeAccent 
                          ? "text-transparent bg-clip-text bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 font-extrabold drop-shadow-[0_2px_15px_rgba(245,158,11,0.2)]" 
                          : "text-transparent bg-clip-text bg-gradient-to-b from-slate-100 via-white to-slate-300"
                      )}
                    >
                      {char}
                    </motion.span>
                  </span>
                );
              })}
            </motion.div>

            {/* Micro-Interaction: Shimmer Line and Counter */}
            <div className="flex flex-col items-center gap-4 w-48 sm:w-64">
              <div className="relative w-full h-[3px] bg-white/[0.05] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.5)]"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut', duration: 0.1 }}
                />
                
                {/* Horizontal shimmering streak */}
                {progress === 100 && (
                  <motion.div
                    className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                    initial={{ left: '-100%' }}
                    animate={{ left: '200%' }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                  />
                )}
              </div>

              <div className="flex items-center justify-between w-full text-[10px] sm:text-xs font-mono font-bold tracking-widest text-slate-500 dark:text-zinc-500">
                <span>SYSTEM BOOTING</span>
                <span className="text-amber-500">{progress}%</span>
              </div>
            </div>
          </div>

          {/* Minimal Bottom Brand Credits */}
          <div className="absolute bottom-10 text-center font-mono text-[9px] tracking-[0.25em] text-slate-600 dark:text-zinc-600 uppercase">
            Designed for Excellence • BrainBoost AI Core v1.4
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Utility Helper
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
