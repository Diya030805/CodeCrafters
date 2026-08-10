'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { 
  Sparkles, 
  FileText, 
  HelpCircle, 
  Calendar, 
  BarChart3, 
  Layers, 
  FileDown, 
  Activity,
  ArrowRight
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useAccent } from '@/components/accent-provider';
import { cn } from '@/lib/utils';

interface FeatureItem {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  tag?: string;
  accentColor: string;
}

const featuresList: FeatureItem[] = [
  {
    icon: Sparkles,
    title: "AI Personal Tutor",
    description: "Get real-time feedback, detailed explanations, and 24/7 conversational study support tailored to your pace.",
    tag: "Popular",
    accentColor: "#F59E0B" // Amber
  },
  {
    icon: FileText,
    title: "Smart Notes Generator",
    description: "Synthesize lengthy lecture transcripts and study materials into clean, bulleted, highly readable summaries.",
    accentColor: "#3B82F6" // Blue
  },
  {
    icon: HelpCircle,
    title: "AI Quiz Generator",
    description: "Convert any lesson, text selection, or notes repository into interactive practice quizzes instantly.",
    tag: "New",
    accentColor: "#10B981" // Emerald
  },
  {
    icon: Calendar,
    title: "Study Planner",
    description: "Create an adaptive, optimized learning calendar that adjusts dynamically to your exams and tasks.",
    accentColor: "#8B5CF6" // Violet
  },
  {
    icon: BarChart3,
    title: "Learning Analytics",
    description: "Track retention velocity, cognitive capacity curves, and weekly active work metrics with real-time telemetry.",
    accentColor: "#EC4899" // Pink
  },
  {
    icon: Layers,
    title: "AI Flashcards",
    description: "Spaced repetition deck generation designed to secure high-priority knowledge in your long-term memory.",
    accentColor: "#F43F5E" // Rose
  },
  {
    icon: FileDown,
    title: "AI PDF Learning",
    description: "Upload textbook chapters and research papers to converse directly with your documents and extract key facts.",
    accentColor: "#06B6D4" // Cyan
  },
  {
    icon: Activity,
    title: "AI Weakness Analyzer",
    description: "Locate knowledge gaps across study runs and receive target diagnostic material to correct misunderstandings.",
    accentColor: "#14B8A6" // Teal
  }
];

export function Features() {
  const { darkMode } = useTheme();
  const { meta } = useAccent();
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);
  
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, clientWidth } = carouselRef.current;
    if (clientWidth > 0) {
      // Calculate active index based on scroll position
      const index = Math.round(scrollLeft / (clientWidth * 0.82 + 16));
      setActiveIndex(Math.max(0, Math.min(featuresList.length - 1, index)));
    }
  };

  // Drifting ambient backgrounds (with standard smooth infinite values)
  const driftTransition: any = (mounted && prefersReducedMotion) 
    ? {} 
    : {
        duration: 25,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut"
      };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  return (
    <section className="w-full py-24 px-4 bg-transparent relative overflow-hidden" id="features">
      {/* Premium Ambient Floating Blobs */}
      {mounted && !prefersReducedMotion && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Violet Blob */}
          <motion.div 
            animate={{ 
              y: [0, -35, 0], 
              x: [0, 25, 0],
              scale: [1, 1.1, 1]
            }}
            transition={driftTransition}
            className="absolute top-[10%] left-[-5%] w-[450px] h-[450px] bg-violet-600/5 dark:bg-violet-600/10 blur-[130px] rounded-full"
          />
          {/* Indigo Blob */}
          <motion.div 
            animate={{ 
              y: [0, 40, 0], 
              x: [0, -30, 0],
              scale: [1, 1.05, 1]
            }}
            transition={driftTransition}
            className="absolute bottom-[15%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/5 dark:bg-indigo-600/10 blur-[150px] rounded-full"
          />
          {/* Neon Cyan Blob */}
          <motion.div 
            animate={{ 
              y: [0, -25, 0], 
              x: [0, -25, 0],
              scale: [1, 1.15, 1]
            }}
            transition={driftTransition}
            className="absolute bottom-[-10%] left-[20%] w-[380px] h-[380px] bg-cyan-500/5 dark:bg-cyan-500/5 blur-[120px] rounded-full"
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Module Header */}
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] uppercase tracking-widest font-black mb-4 shadow-sm"
          >
            <span>ENGINEERED FEATURES MODULE</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-heading font-black tracking-tight mb-5 text-slate-900 dark:text-white"
          >
            Everything You Need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-400 dark:to-amber-500">Learn Smarter</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-500 dark:text-zinc-400 max-w-2xl mx-auto text-sm md:text-lg font-medium leading-relaxed"
          >
            A suite of high-performance artificial intelligence tools engineered to accelerate retention, expand cognitive velocity, and optimize your academic potential.
          </motion.p>
        </div>

        {/* 1. DESKTOP VIEW: High-end Grid (visible from Medium Screens upwards) */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {featuresList.map((feat, idx) => (
            <FeatureCard key={idx} feat={feat} index={idx} />
          ))}
        </motion.div>

        {/* 2. MOBILE VIEW: High-performance horizontal swipeable carousel */}
        <div className="md:hidden relative px-4 -mx-8">
          <div 
            ref={carouselRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-4 pb-8 px-8 scroll-smooth"
            style={{
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {featuresList.map((feat, idx) => (
              <div 
                key={idx} 
                className="w-[82vw] shrink-0 snap-center first:pl-0 last:pr-0"
              >
                <FeatureCard feat={feat} index={idx} isMobile={true} />
              </div>
            ))}
          </div>

          {/* Sync Pagination Dots & Progress Bar Indicator */}
          <div className="flex flex-col items-center gap-4 mt-2">
            {/* Pagination dots */}
            <div className="flex items-center gap-2">
              {featuresList.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (carouselRef.current) {
                      const clientWidth = carouselRef.current.clientWidth;
                      carouselRef.current.scrollTo({ 
                        left: i * (clientWidth * 0.82 + 16), 
                        behavior: 'smooth' 
                      });
                    }
                  }}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    activeIndex === i 
                      ? "w-6 bg-amber-500" 
                      : "w-2 bg-slate-300 dark:bg-white/10"
                  )}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Micro progress line indicator */}
            <div className="w-40 h-[2px] bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 transition-all duration-300"
                style={{ width: `${((activeIndex + 1) / featuresList.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  feat: FeatureItem;
  index: number;
  isMobile?: boolean;
}

function FeatureCard({ feat, index, isMobile = false }: FeatureCardProps) {
  const Icon = feat.icon;
  const cardRef = React.useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { meta } = useAccent();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  // Mathematical Parallax 3D Tilt Coordinates
  const [rotateX, setRotateX] = React.useState(0);
  const [rotateY, setRotateY] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((mounted && prefersReducedMotion) || isMobile || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Smooth responsive degree rotation mapping (capped at 8 degrees)
    const rX = -(mouseY / (height / 2)) * 8;
    const rY = (mouseX / (width / 2)) * 8;
    
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={isMobile ? {} : { opacity: 0, y: 24 }}
      whileInView={isMobile ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ 
        type: 'spring',
        stiffness: 85,
        damping: 16,
        delay: index * 0.05
      }}
      className={cn(
        "relative rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer select-none border will-change-transform",
        "bg-white/5 dark:bg-zinc-900/30 backdrop-blur-xl border-black/[0.08] dark:border-white/[0.08]",
        "hover:border-black/20 dark:hover:border-white/20"
      )}
      style={{
        transform: mounted && !prefersReducedMotion && !isMobile
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${isHovered ? '-6px' : '0px'})`
          : undefined,
        boxShadow: isHovered 
          ? `0 20px 40px -15px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.08), 0 0 35px ${feat.accentColor}18`
          : '0 4px 20px -5px rgba(0,0,0,0.03), inset 0 1px 1px rgba(255,255,255,0.03)',
      }}
    >
      {/* 1px glowing top edge accent that fades in on hover */}
      <div 
        className="absolute top-0 left-0 right-0 h-[3px] transition-transform duration-500 origin-left"
        style={{ 
          background: `linear-gradient(90deg, ${feat.accentColor}, ${feat.accentColor}80, transparent)`,
          transform: isHovered ? 'scaleX(1)' : 'scaleX(0)'
        }}
      />

      {/* Radiant radial background flare tracking cursor */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle 120px at 50% 50%, ${feat.accentColor}06, transparent)`
        }}
      />

      <div>
        {/* Glowing Icon Frame */}
        <div 
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500"
          style={{
            backgroundColor: isHovered ? `${feat.accentColor}20` : 'rgba(255, 255, 255, 0.03)',
            color: isHovered ? feat.accentColor : '#94A3B8',
            border: `1px solid ${isHovered ? `${feat.accentColor}40` : 'rgba(255, 255, 255, 0.05)'}`,
            boxShadow: isHovered ? `0 0 18px ${feat.accentColor}25` : 'none'
          }}
        >
          <Icon className="w-5 h-5 transition-transform duration-300" />
        </div>

        {/* Title & Glowing Accent Badges */}
        <div className="flex items-center gap-2.5 mb-3">
          <h3 
            className="font-bold text-base transition-colors duration-300 text-slate-800 dark:text-white"
            style={{ color: isHovered ? feat.accentColor : undefined }}
          >
            {feat.title}
          </h3>
          {feat.tag && (
            <span 
              className="text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full border flex items-center justify-center"
              style={{ 
                borderColor: `${feat.accentColor}40`, 
                color: feat.accentColor, 
                backgroundColor: `${feat.accentColor}10`,
                boxShadow: `0 0 8px ${feat.accentColor}15`
              }}
            >
              {feat.tag}
            </span>
          )}
        </div>

        {/* Description Body */}
        <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-medium">
          {feat.description}
        </p>
      </div>

      {/* Interactive CTA Section */}
      <div className="mt-8 flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 tracking-wider uppercase">
          BrainBoost AI Core
        </span>
        <motion.div 
          className="flex items-center gap-1.5 text-xs font-black tracking-wider uppercase text-slate-700 dark:text-zinc-200"
          style={{ color: isHovered ? feat.accentColor : undefined }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative">
            Try now
            <span 
              className="absolute bottom-0 left-0 right-0 h-[1.5px] origin-left transition-transform duration-300"
              style={{ 
                backgroundColor: feat.accentColor,
                transform: isHovered ? 'scaleX(1)' : 'scaleX(0)'
              }}
            />
          </span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </motion.div>
      </div>
    </motion.div>
  );
}
