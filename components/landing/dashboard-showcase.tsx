'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  BarChart3, 
  TrendingUp, 
  Award, 
  Flame, 
  Lightbulb, 
  Send,
  CheckCircle2,
  Brain,
  MessageSquareCode,
  Calendar,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useAccent } from '@/components/accent-provider';
import { cn } from '@/lib/utils';

export function DashboardShowcase() {
  const { darkMode } = useTheme();
  const { meta } = useAccent();
  const activeAccentClasses = darkMode ? meta.dark : meta.light;

  // AI Tutor Widget state
  const [tutorMessage, setTutorMessage] = React.useState('');
  const [tutorMessages, setTutorMessages] = React.useState<Array<{ sender: string, text: string }>>([]);
  const [hasAnimated, setHasAnimated] = React.useState(false);
  const [showClearConfirm, setShowClearConfirm] = React.useState(false);
  const chatBottomRef = React.useRef<HTMLDivElement>(null);

  const initialConversation = [
    { sender: 'tutor', text: "Welcome back! I noticed you struggled with tree traversal complexity yesterday. Would you like to run a custom diagnostic sync on Binary Trees?" },
    { sender: 'user', text: "Yes, please! Let's focus on average-case depth." },
    { sender: 'tutor', text: "Perfect. For a balanced binary tree, average depth is O(log N). Let's test this with a simulated node structure..." }
  ];

  const startSimulation = () => {
    if (hasAnimated) return;
    setHasAnimated(true);

    // Initial message
    setTutorMessages([initialConversation[0]]);

    // Stagger user response with a clean delay
    setTimeout(() => {
      setTutorMessages(prev => [...prev, initialConversation[1]]);
    }, 1000);

    // Stagger subsequent AI response with a clean delay
    setTimeout(() => {
      setTutorMessages(prev => [...prev, initialConversation[2]]);
    }, 2200);
  };

  React.useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [tutorMessages]);

  const handleSendTutorMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorMessage.trim()) return;
    const newMsgs = [...tutorMessages, { sender: 'user', text: tutorMessage }];
    setTutorMessages(newMsgs);
    setTutorMessage('');

    // Simulate Tutor response
    setTimeout(() => {
      setTutorMessages(prev => [
        ...prev,
        { sender: 'tutor', text: "Excellent query. I've updated your daily weakness graph with this node topic. Generating a customized practice query for you now!" }
      ]);
    }, 1000);
  };

  // Streak Tracker Days
  const daysOfWeek = [
    { name: 'Mon', active: true, label: '2.4h' },
    { name: 'Tue', active: true, label: '3.1h' },
    { name: 'Wed', active: true, label: '4.8h' },
    { name: 'Thu', active: true, label: '1.5h' },
    { name: 'Fri', active: true, label: '3.6h' },
    { name: 'Sat', active: true, label: '5.0h' },
    { name: 'Sun', active: true, label: 'Today' }
  ];

  // AI recommendations state
  const [recommendations, setRecommendations] = React.useState([
    { id: 1, title: "Review Heap Sort complexity profile", priority: "HIGH", dismissed: false },
    { id: 2, title: "Generate 5 flashcards for graph search", priority: "MEDIUM", dismissed: false },
    { id: 3, title: "Take 10-question practice quiz on SQL", priority: "LOW", dismissed: false }
  ]);

  const dismissRecommendation = (id: number) => {
    setRecommendations(prev => prev.map(rec => rec.id === id ? { ...rec, dismissed: true } : rec));
  };

  const activeRecs = recommendations.filter(rec => !rec.dismissed);

  return (
    <section className="w-full py-20 px-4 bg-transparent relative overflow-hidden" id="dashboard-showcase">
      {/* Decorative background visual ambient colors */}
      <div className="w-[600px] h-[600px] bg-amber-500/[0.02] dark:bg-amber-600/[0.04] blur-[150px] rounded-full absolute top-10 right-10 -z-10 pointer-events-none" />

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
            <span>SHOWCASE WORKSPACE</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-heading font-black tracking-tight mb-4 text-slate-900 dark:text-white"
          >
            Explore the Premium Workspace
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm md:text-base font-medium"
          >
            A cohesive hub integrating real-time telemetry, conversational AI support, and automated diagnostic systems.
          </motion.p>
        </div>

        {/* 12-Column Responsive Dashboard Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
          
          {/* WIDGET 1: AI TUTOR WIDGET (Span 7 Columns) */}
          <motion.div 
            onViewportEnter={startSimulation}
            viewport={{ once: true, margin: "-100px" }}
            className={cn(
              "lg:col-span-7 rounded-[32px] p-6 border transition-all duration-500 hover:shadow-2xl flex flex-col h-[450px] relative overflow-hidden",
              darkMode 
                ? "bg-[#121316]/40 border-white/[0.08]" 
                : "bg-white/50 border-black/[0.06]"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.05] pb-4 mb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Brain className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800 dark:text-white flex items-center gap-1.5">
                    Conversational AI Tutor
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </h3>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold tracking-wider uppercase">Active Session • Llama-3-Sync</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase bg-slate-100 dark:bg-white/[0.03] px-2.5 py-1 rounded-full border border-black/[0.04] dark:border-white/[0.04]">
                  TUTOR-01
                </span>
                {tutorMessages.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(true)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="Clear Chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Chat Thread */}
            <div className="flex-1 overflow-y-auto no-scrollbar pr-1 space-y-3 py-2 flex flex-col min-h-0">
              <AnimatePresence initial={false}>
                {tutorMessages.map((msg, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 260, 
                      damping: 20 
                    }}
                    className={cn(
                      "flex max-w-[85%] flex-col rounded-2xl p-3.5 text-xs font-medium leading-relaxed shadow-sm",
                      msg.sender === 'tutor'
                        ? "bg-slate-100/80 dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04] text-slate-700 dark:text-slate-300 self-start rounded-tl-none"
                        : "text-white self-end rounded-tr-none"
                    )}
                    style={msg.sender === 'user' ? { backgroundColor: meta.hex } : {}}
                  >
                    <p>{msg.text}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={chatBottomRef} />
            </div>

            {/* Input form */}
            <form onSubmit={handleSendTutorMessage} className="relative mt-4">
              <input
                type="text"
                placeholder="Ask your AI Tutor anything..."
                value={tutorMessage}
                disabled={showClearConfirm}
                onChange={(e) => setTutorMessage(e.target.value)}
                className="w-full h-11 pl-4 pr-12 rounded-xl bg-slate-100 dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.05] text-xs font-bold text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all"
              />
              <button 
                type="submit"
                disabled={showClearConfirm}
                className="absolute right-1 top-1 bottom-1 w-9 rounded-lg flex items-center justify-center text-white hover:scale-105 transition-all cursor-pointer disabled:opacity-50"
                style={{ backgroundColor: meta.hex }}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Confirmation Dialog Overlay */}
            <AnimatePresence>
              {showClearConfirm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-6"
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ type: "spring", duration: 0.4 }}
                    className={cn(
                      "max-w-xs w-full p-5 rounded-2xl border text-center shadow-xl",
                      darkMode 
                        ? "bg-zinc-900 border-zinc-800 text-white" 
                        : "bg-white border-slate-150 text-slate-800"
                    )}
                  >
                    <div className="mx-auto w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mb-3">
                      <Trash2 className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-sm mb-1 text-slate-900 dark:text-white">Clear Chat History?</h4>
                    <p className="text-[11px] text-slate-400 dark:text-zinc-400 mb-4 leading-normal">
                      This will reset your conversation. This action cannot be undone.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setShowClearConfirm(false)}
                        className="h-8 rounded-lg text-xs font-bold border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setTutorMessages([]);
                          setShowClearConfirm(false);
                        }}
                        className="h-8 rounded-lg text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* WIDGET 2: WEEKLY ANALYTICS (Span 5 Columns) */}
          <div className={cn(
            "lg:col-span-5 rounded-[32px] p-6 border transition-all duration-500 hover:shadow-2xl flex flex-col justify-between h-[450px]",
            darkMode 
              ? "bg-[#121316]/40 border-white/[0.08]" 
              : "bg-white/50 border-black/[0.06]"
          )}>
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-amber-500" />
                  <span className="text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-400 uppercase">
                    WEEKLY TELEMETRY
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-500">
                  <TrendingUp className="w-3 h-3" />
                  +18.4% Efficiency
                </div>
              </div>

              {/* Progress metrics */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Cognitive Capacity</span>
                    <span className="text-xs font-black text-slate-800 dark:text-white">92.4%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-white/[0.03] rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full rounded-full"
                      style={{ backgroundColor: meta.hex, width: '92.4%' }}
                      initial={{ width: 0 }}
                      whileInView={{ width: '92.4%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Recall Strength</span>
                    <span className="text-xs font-black text-slate-800 dark:text-white">84.1%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-white/[0.03] rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full rounded-full bg-blue-500"
                      initial={{ width: 0 }}
                      whileInView={{ width: '84.1%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Focus Index</span>
                    <span className="text-xs font-black text-slate-800 dark:text-white">76.8%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-white/[0.03] rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full rounded-full bg-emerald-500"
                      initial={{ width: 0 }}
                      whileInView={{ width: '76.8%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>
              </div>

              {/* Weekly active bar simulator */}
              <div className="mt-8 pt-4 border-t border-slate-200 dark:border-white/[0.05]">
                <div className="flex justify-between items-end h-24 pt-4">
                  {[40, 65, 80, 50, 95, 70, 85].map((height, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 flex-1 group/bar">
                      <div className="w-full px-1.5 flex justify-center items-end h-full">
                        <motion.div 
                          className={cn(
                            "w-4 rounded-t-sm transition-all duration-300 cursor-pointer",
                            i === 6 ? activeAccentClasses.button : "bg-slate-200 dark:bg-white/[0.05] hover:bg-slate-300 dark:hover:bg-white/[0.1]"
                          )}
                          style={{ height: `${height}%` }}
                          initial={{ height: 0 }}
                          whileInView={{ height: `${height}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: i * 0.05 }}
                        />
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* WIDGET 3: QUIZ PERFORMANCE CARD (Span 4 Columns) */}
          <div className={cn(
            "lg:col-span-4 rounded-[32px] p-6 border transition-all duration-500 hover:shadow-2xl flex flex-col justify-between h-[360px]",
            darkMode 
              ? "bg-[#121316]/40 border-white/[0.08]" 
              : "bg-white/50 border-black/[0.06]"
          )}>
            <div>
              {/* Header */}
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  QUIZ PERFORMANCE
                </span>
              </div>

              {/* Radial Score Gauge */}
              <div className="relative flex items-center justify-center h-28 my-2">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    className="stroke-slate-200 dark:stroke-white/[0.04]"
                    strokeWidth="6"
                    fill="transparent"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke={meta.hex}
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset="22.6" /* 91% correct */
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute text-center">
                  <p className="text-xl font-black text-slate-800 dark:text-white leading-none">91%</p>
                  <p className="text-[8px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-wider mt-1">ACCURACY</p>
                </div>
              </div>

              {/* History list */}
              <div className="space-y-2 mt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-600 dark:text-slate-400">Data Structures I</span>
                  <span className="font-black text-emerald-500">95% (A)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-600 dark:text-slate-400">Memory Architectures</span>
                  <span className="font-black text-emerald-500">88% (B)</span>
                </div>
              </div>
            </div>
          </div>

          {/* WIDGET 4: STUDY STREAK (Span 4 Columns) */}
          <div className={cn(
            "lg:col-span-4 rounded-[32px] p-6 border transition-all duration-500 hover:shadow-2xl flex flex-col justify-between h-[360px]",
            darkMode 
              ? "bg-[#121316]/40 border-white/[0.08]" 
              : "bg-white/50 border-black/[0.06]"
          )}>
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    STREAK ENGINE
                  </span>
                </div>
                <span className="text-xs font-black text-orange-500 flex items-center gap-1 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
                  7 DAYS 🔥
                </span>
              </div>

              <div className="text-center py-2">
                <p className="text-2xl font-black text-slate-800 dark:text-white">Active Momentum</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Continuous engagement boosts your AI memory sync by 1.2x.</p>
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1.5 mt-6">
                {daysOfWeek.map((day, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1.5">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center border text-xs font-bold transition-all duration-300",
                      day.active 
                        ? "bg-orange-500/10 border-orange-500/30 text-orange-500" 
                        : "bg-slate-100 dark:bg-white/[0.02] border-black/[0.04] dark:border-white/[0.04] text-slate-400"
                    )}>
                      {day.name[0]}
                    </div>
                    <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 tracking-wider">
                      {day.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* WIDGET 5: AI RECOMMENDATIONS (Span 4 Columns) */}
          <div className={cn(
            "lg:col-span-4 rounded-[32px] p-6 border transition-all duration-500 hover:shadow-2xl flex flex-col justify-between h-[360px]",
            darkMode 
              ? "bg-[#121316]/40 border-white/[0.08]" 
              : "bg-white/50 border-black/[0.06]"
          )}>
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    AI INTELLIGENCE CORES
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 dark:text-slate-500 mb-4 leading-relaxed">
                Smart recommendations updated continuously based on active study sessions.
              </p>

              {/* Recommendation list */}
              <div className="space-y-2.5 h-[190px] overflow-y-auto no-scrollbar">
                <AnimatePresence initial={false}>
                  {activeRecs.length > 0 ? (
                    activeRecs.map((rec) => (
                      <motion.div
                        key={rec.id}
                        initial={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-3 rounded-xl bg-slate-100/50 dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04] flex items-start justify-between gap-3 group/rec"
                      >
                        <div className="flex items-start gap-2.5">
                          <CheckCircle2 
                            className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5 cursor-pointer hover:scale-110 transition-transform" 
                            onClick={() => dismissRecommendation(rec.id)}
                          />
                          <div>
                            <p className="text-[11px] font-bold text-slate-800 dark:text-white leading-tight">
                              {rec.title}
                            </p>
                            <span className={cn(
                              "text-[8px] font-black uppercase tracking-wider block mt-1.5",
                              rec.priority === 'HIGH' ? "text-rose-500" : rec.priority === 'MEDIUM' ? "text-amber-500" : "text-blue-500"
                            )}>
                              {rec.priority} PRIORITY
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center py-6">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
                      <p className="text-xs font-bold text-slate-400 dark:text-slate-500">All tasks optimized!</p>
                      <button 
                        onClick={() => setRecommendations([
                          { id: 1, title: "Review Heap Sort complexity profile", priority: "HIGH", dismissed: false },
                          { id: 2, title: "Generate 5 flashcards for graph search", priority: "MEDIUM", dismissed: false },
                          { id: 3, title: "Take 10-question practice quiz on SQL", priority: "LOW", dismissed: false }
                        ])}
                        className="text-[10px] font-black text-amber-500 uppercase tracking-widest mt-2 hover:underline cursor-pointer"
                      >
                        Reset recommendations
                      </button>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
