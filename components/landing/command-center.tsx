'use client';

import * as React from 'react';
import { useTheme } from '@/components/theme-provider';
import { useAccent } from '@/components/accent-provider';
import { Search, Zap, Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommandCenterProps {
  onInitialize: () => void;
}

export function CommandCenter({ onInitialize }: CommandCenterProps) {
  const { darkMode } = useTheme();
  const { meta } = useAccent();
  const activeAccentClasses = darkMode ? meta.dark : meta.light;

  // Search input state
  const [searchQuery, setSearchQuery] = React.useState('');

  // Selected node state
  const [selectedNode, setSelectedNode] = React.useState<'data-structures' | 'cognitive-synthesizer'>('data-structures');

  // Interactive Timer states
  const [timeLeft, setTimeLeft] = React.useState(45 * 60); // 45 minutes
  const [isTimerRunning, setIsTimerRunning] = React.useState(false);

  // Timer interval hook
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  // Format stopwatch readout
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Dynamically compute wave data and percentages depending on state
  const retentionPercentage = selectedNode === 'data-structures' ? '98.4%' : '99.2%';
  const studyVelocity = selectedNode === 'data-structures' ? '4.8x' : '5.4x';
  const tokensPerSec = selectedNode === 'data-structures' ? '1,240' : '1,850';

  // Customized SVG paths for dynamic visual charts
  const wavePath = selectedNode === 'data-structures'
    ? "M 10 70 Q 50 30 90 60 T 170 20 T 250 50 T 330 15 T 410 40 L 410 100 L 10 100 Z"
    : "M 10 50 Q 60 80 110 30 T 210 70 T 310 20 T 410 60 L 410 100 L 10 100 Z";

  const waveLinePath = selectedNode === 'data-structures'
    ? "M 10 70 Q 50 30 90 60 T 170 20 T 250 50 T 330 15 T 410 40"
    : "M 10 50 Q 60 80 110 30 T 210 70 T 310 20 T 410 60";

  return (
    <section className="w-full py-16 px-4 bg-transparent relative overflow-hidden">
      {/* Dynamic Background Atmospheric Glowing Spheres */}
      <div className="w-72 h-72 bg-amber-500/10 dark:bg-amber-500/15 blur-[120px] rounded-full absolute -top-12 left-1/4 -z-10 animate-pulse duration-[4000ms] pointer-events-none" />
      <div className="w-72 h-72 bg-blue-500/10 dark:bg-blue-500/15 blur-[120px] rounded-full absolute -bottom-12 right-1/4 -z-10 animate-pulse duration-[5000ms] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tight mb-4 text-slate-800 dark:text-white">
            Command Center Dashboard
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
            Interact with simulated neural diagnostics and diagnostic telemetries before initializing the primary learning workspace.
          </p>
        </div>

        {/* 12-Column Responsive Command Center Grid Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          
          {/* LEFT PANEL: Live Analytics Hub (4 Columns) */}
          <div className={cn(
            "lg:col-span-4 backdrop-blur-xl rounded-[32px] p-8 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(245,158,11,0.08)] hover:-translate-y-1 flex flex-col justify-between h-[450px]",
            darkMode 
              ? "bg-[#121316]/40 border border-white/[0.08]" 
              : "bg-white/50 border border-black/[0.08]"
          )}>
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                    LIVE METRICS
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                  Node: {selectedNode === 'data-structures' ? '01-STRUCT' : '02-SYNTH'}
                </span>
              </div>

              {/* Core Visual: Interactive Micro-chart SVG Wave */}
              <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-100/50 dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04] p-4 flex flex-col justify-between">
                <div className="flex justify-between items-start z-10">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Retention Capacity
                    </p>
                    <p className="text-2xl font-black text-slate-800 dark:text-white transition-all duration-500">
                      {retentionPercentage}
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    STABLE
                  </span>
                </div>

                {/* Simulated Wave SVG Path */}
                <div className="absolute inset-0 pt-12">
                  <svg className="w-full h-full" viewBox="0 0 420 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={darkMode ? meta.hex : meta.hex} stopOpacity="0.15" />
                        <stop offset="100%" stopColor={darkMode ? meta.hex : meta.hex} stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Fill */}
                    <path
                      d={wavePath}
                      fill="url(#chartGrad)"
                      className="transition-all duration-500 ease-in-out"
                    />
                    {/* Line */}
                    <path
                      d={waveLinePath}
                      fill="none"
                      stroke={meta.hex}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="transition-all duration-500 ease-in-out"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Bottom Row metrics */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-4 rounded-2xl bg-slate-100/50 dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04] text-center">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                  Study Velocity
                </p>
                <p className="text-lg font-black text-slate-800 dark:text-white mt-1">
                  {studyVelocity}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-100/50 dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04] text-center">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                  AI Tokens/Sec
                </p>
                <p className="text-lg font-black text-slate-800 dark:text-white mt-1">
                  {tokensPerSec}
                </p>
              </div>
            </div>
          </div>

          {/* CENTER PANEL: Focus Workspace Optimizer (5 Columns) */}
          <div className={cn(
            "lg:col-span-5 backdrop-blur-xl rounded-[32px] p-8 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(245,158,11,0.08)] hover:-translate-y-1 flex flex-col justify-between h-[450px]",
            darkMode 
              ? "bg-[#121316]/40 border border-white/[0.08]" 
              : "bg-white/50 border border-black/[0.08]"
          )}>
            <div>
              {/* Pill Search Capsule */}
              <div className="relative mb-6">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Query neural base..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-11 pr-4 rounded-full bg-slate-100 dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.05] text-xs font-medium text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all"
                />
              </div>

              {/* Learning Nodes Stack Header */}
              <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase block mb-4">
                ACTIVE LEARNING NODES
              </span>

              {/* Vertical Stack of Nodes */}
              <div className="space-y-3">
                {/* Node 1 */}
                {("Data Structures Mastery".toLowerCase().includes(searchQuery.toLowerCase())) && (
                  <button
                    onClick={() => setSelectedNode('data-structures')}
                    className={cn(
                      "w-full text-left p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.01] flex items-center justify-between cursor-pointer group",
                      selectedNode === 'data-structures'
                        ? "bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/30 shadow-[0_4px_20px_rgba(245,158,11,0.1)]"
                        : "bg-slate-100/30 dark:bg-white/[0.01] border-black/[0.03] dark:border-white/[0.04] hover:bg-slate-100/50 dark:hover:bg-white/[0.02]"
                    )}
                  >
                    <div>
                      <h5 className="text-xs font-extrabold text-slate-800 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                        Data Structures Mastery
                      </h5>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                        Heuristic indexing, graphs, & trees.
                      </p>
                    </div>
                    <span className="text-[9px] font-black tracking-widest uppercase bg-rose-500/10 text-rose-500 px-2 py-1 rounded-md border border-rose-500/20">
                      CRITICAL
                    </span>
                  </button>
                )}

                {/* Node 2 */}
                {("Cognitive Synthesizer Routine".toLowerCase().includes(searchQuery.toLowerCase())) && (
                  <button
                    onClick={() => setSelectedNode('cognitive-synthesizer')}
                    className={cn(
                      "w-full text-left p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.01] flex items-center justify-between cursor-pointer group",
                      selectedNode === 'cognitive-synthesizer'
                        ? "bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/30 shadow-[0_4px_20px_rgba(245,158,11,0.1)]"
                        : "bg-slate-100/30 dark:bg-white/[0.01] border-black/[0.03] dark:border-white/[0.04] hover:bg-slate-100/50 dark:hover:bg-white/[0.02]"
                    )}
                  >
                    <div>
                      <h5 className="text-xs font-extrabold text-slate-800 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                        Cognitive Synthesizer Routine
                      </h5>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                        Neural wave sync, active recall.
                      </p>
                    </div>
                    <span className="text-[9px] font-black tracking-widest uppercase bg-slate-500/15 text-slate-500 px-2 py-1 rounded-md border border-slate-500/10">
                      STANDBY
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Action CTA Button */}
            <button
              onClick={onInitialize}
              className={cn(
                "w-full h-12 rounded-full flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest text-white shadow-xl hover:scale-105 transition-all duration-300 active:scale-[0.98] cursor-pointer mt-6",
                activeAccentClasses.button
              )}
            >
              Initialize Learning Matrix
              <Zap className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* RIGHT PANEL: Deep-Work Telemetry Capsule (3 Columns) */}
          <div className={cn(
            "lg:col-span-3 backdrop-blur-xl rounded-[32px] p-8 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(245,158,11,0.08)] hover:-translate-y-1 flex flex-col justify-between h-[450px]",
            darkMode 
              ? "bg-[#121316]/40 border border-white/[0.08]" 
              : "bg-white/50 border border-black/[0.08]"
          )}>
            <div>
              <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase block mb-6 text-center">
                TELEMETRY LOOP
              </span>

              {/* Animated radial progress dial */}
              <div className="relative flex items-center justify-center h-44 w-full">
                {/* SVG Dial with rotating overlay */}
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="68"
                    className="stroke-slate-200 dark:stroke-white/[0.04]"
                    strokeWidth="4"
                    fill="transparent"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="68"
                    className={cn(
                      "transition-all duration-1000",
                      isTimerRunning ? "animate-[spin_20s_linear_infinite]" : ""
                    )}
                    stroke={meta.hex}
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray="20 15 5 10 30 15"
                    strokeLinecap="round"
                    style={{ transformOrigin: '80px 80px' }}
                  />
                </svg>

                {/* central glowing digital stopwatch */}
                <div className="absolute text-center">
                  <p className="text-3xl font-black text-slate-800 dark:text-white font-mono tracking-tight leading-none">
                    {formatTime(timeLeft)}
                  </p>
                  <p className="text-[9px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mt-2">
                    {isTimerRunning ? "ACTIVE WORK" : "STANDBY"}
                  </p>
                </div>
              </div>
            </div>

            {/* Functional Utilities Controls */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="flex-1 h-10 rounded-xl bg-white/[0.04] hover:bg-slate-200/50 dark:hover:bg-white/[0.08] border border-black/[0.06] dark:border-white/[0.05] flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-amber-500" />
                    Pause Matrix
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-500" />
                    Start Matrix
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimeLeft(45 * 60);
                }}
                className="h-10 px-3.5 rounded-xl bg-white/[0.04] hover:bg-slate-200/50 dark:hover:bg-white/[0.08] border border-black/[0.06] dark:border-white/[0.05] flex items-center justify-center text-slate-500 dark:text-slate-400 transition-all cursor-pointer"
                title="Reset Loop"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
