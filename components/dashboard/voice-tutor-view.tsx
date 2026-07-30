'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  Zap,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Trash2,
  Settings,
  BrainCircuit,
  MessageSquare,
  Globe,
  Gauge,
  Clock,
  CheckCircle2,
  AlertCircle,
  Activity,
  History,
  Lightbulb,
  FileText,
  Briefcase,
  Languages,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import { useAccent } from '@/components/accent-provider';
import { cn } from '@/lib/utils';

// Types
type AppState = 'idle' | 'listening' | 'thinking' | 'speaking';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

// Mock Data
const QUICK_ACTIONS = [
  { id: 'explain', icon: Lightbulb, label: 'Explain this topic' },
  { id: 'ask', icon: MessageSquare, label: 'Ask a question' },
  { id: 'summarize', icon: FileText, label: 'Summarize chapter' },
  { id: 'solve', icon: BrainCircuit, label: 'Solve a problem' },
  { id: 'interview', icon: Briefcase, label: 'Practice interview' },
  { id: 'pronunciation', icon: Languages, label: 'Practice pronunciation' },
];

const RECENT_SESSIONS = [
  { id: '1', title: 'Cell Biology Review', duration: '14:20', date: 'Today, 2:30 PM' },
  { id: '2', title: 'Calculus Derivatives', duration: '28:45', date: 'Yesterday, 10:15 AM' },
  { id: '3', title: 'French Pronunciation', duration: '09:12', date: 'Mon, 4:00 PM' },
];

export function VoiceTutorView() {
  const { meta } = useAccent();
  const [appState, setAppState] = React.useState<AppState>('idle');
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isMuted, setIsMuted] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  
  // Settings state
  const [language, setLanguage] = React.useState('English (US)');
  const [voiceStyle, setVoiceStyle] = React.useState('Friendly');
  const [speakingSpeed, setSpeakingSpeed] = React.useState(1);
  const [volume, setVolume] = React.useState(80);

  const [sessionDuration, setSessionDuration] = React.useState(0);

  // Timer effect for session duration
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (appState !== 'idle') {
      interval = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [appState]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartListening = () => {
    if (appState === 'idle' || appState === 'speaking') {
      setAppState('listening');
      // Simulate speech to text ending after a few seconds
      setTimeout(() => {
        if (appState !== 'idle') {
          handleStopListening();
        }
      }, 3000);
    }
  };

  const handleStopListening = () => {
    if (appState === 'listening') {
      const newUserMsg: Message = {
        id: Date.now().toString(),
        sender: 'user',
        text: "Could you explain how backpropagation works in neural networks?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, newUserMsg]);
      setAppState('thinking');
      
      // Simulate AI response
      setTimeout(() => {
        setAppState('speaking');
        const newAiMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: "Sure! Imagine you're throwing a ball at a target but missing. Backpropagation is like adjusting your aim backward step-by-step to figure out exactly how much to change your throw next time. In neural networks, it calculates the error at the output and works backward to adjust the weights, minimizing the error.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, newAiMsg]);
        
        // Return to idle after speaking
        setTimeout(() => {
          setAppState('idle');
        }, 5000);
      }, 1500);
    }
  };

  const handleClear = () => {
    setMessages([]);
    setAppState('idle');
    setSessionDuration(0);
  };

  const renderWaveformVisualizer = (isActive: boolean) => (
    <div className="flex h-16 w-48 items-center justify-center gap-1.5">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            height: isActive ? ['20%', '80%', '40%', '100%', '30%', '70%', '20%'] : '10%',
            opacity: isActive ? 1 : 0.3
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
            delay: isActive ? i * 0.1 : 0
          }}
          className={cn(
            'w-2 rounded-full bg-gradient-to-t from-indigo-500 to-emerald-400',
            appState === 'speaking' ? 'shadow-[0_0_16px_rgba(99,102,241,0.25)]' : 'shadow-[0_0_16px_rgba(16,185,129,0.25)]'
          )}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <header className="relative overflow-hidden rounded-[30px] border border-zinc-800/80 bg-zinc-900/60 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-8">
          <div className="absolute right-0 top-0 -mr-14 -mt-14 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                <Mic className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-white">Voice AI Tutor</h1>
                <p className="text-sm text-zinc-400">Interactive conversational learning with a premium studio feel</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="rounded-2xl border border-zinc-800 bg-zinc-800/70 p-3 text-zinc-300 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-700/70 hover:text-white"
              >
                <Settings className="h-5 w-5" />
              </button>
              <button
                onClick={handleClear}
                className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-3 text-rose-400 transition-all duration-300 hover:bg-rose-500/20"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.7fr]">
          <div className="flex flex-col gap-6">
            <section className="relative overflow-hidden rounded-[30px] border border-zinc-800/80 bg-zinc-900/70 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:p-8 lg:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(129,140,248,0.14),transparent_45%)]" />
              <div className="relative z-10 flex flex-col items-center justify-center gap-8">
                <div className="flex w-full items-center justify-between rounded-full border border-zinc-800/80 bg-zinc-950/70 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">
                  <div className="flex items-center gap-2">
                    <div className="relative flex h-2.5 w-2.5">
                      {appState !== 'idle' && (
                        <span className={cn(
                          'absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping',
                          appState === 'speaking' ? 'bg-indigo-400' : appState === 'thinking' ? 'bg-amber-400' : 'bg-emerald-400'
                        )} />
                      )}
                      <span className={cn(
                        'relative inline-flex h-2.5 w-2.5 rounded-full',
                        appState === 'speaking' ? 'bg-indigo-500' : appState === 'thinking' ? 'bg-amber-500' : appState === 'listening' ? 'bg-emerald-500' : 'bg-zinc-500'
                      )} />
                    </div>
                    <span>
                      {appState === 'idle' ? 'Ready' : appState === 'listening' ? 'Listening' : appState === 'thinking' ? 'Analyzing' : 'AI Speaking'}
                    </span>
                  </div>
                  <span className="text-zinc-500">Live practice mode</span>
                </div>

                <div className="flex flex-col items-center gap-8 sm:flex-row sm:gap-10">
                  <div className="flex flex-col items-center gap-3">
                    <div className={cn(
                      'relative flex h-20 w-20 items-center justify-center rounded-full border-2 transition-all duration-300',
                      appState === 'listening' ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.25)]' : 'border-transparent bg-zinc-800/70'
                    )}>
                      {appState === 'listening' && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute inset-0 rounded-full border border-emerald-500"
                        />
                      )}
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 text-lg font-semibold text-zinc-200">
                        U
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">You</span>
                  </div>

                  <div className="hidden sm:block">
                    {renderWaveformVisualizer(appState === 'listening' || appState === 'speaking')}
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    <div className={cn(
                      'relative flex h-20 w-20 items-center justify-center rounded-full border-2 transition-all duration-300',
                      appState === 'speaking' ? 'border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.25)]' : appState === 'thinking' ? 'border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.25)]' : 'border-transparent bg-zinc-800/70'
                    )}>
                      {appState === 'speaking' && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute inset-0 rounded-full border border-indigo-500"
                        />
                      )}
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400">
                        <BrainCircuit className={cn('h-8 w-8', appState === 'thinking' && 'animate-pulse')} />
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">AI Tutor</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-6">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="rounded-full border border-zinc-800 bg-zinc-800/70 p-4 text-zinc-300 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-700/70 hover:text-white"
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </button>

                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={appState === 'listening' ? handleStopListening : handleStartListening}
                    className={cn(
                      'group relative flex h-24 w-24 items-center justify-center rounded-full transition-all duration-300',
                      appState === 'listening'
                        ? 'bg-rose-500 text-white shadow-[0_0_35px_rgba(244,63,94,0.28)] hover:bg-rose-600'
                        : 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-[0_0_35px_rgba(16,185,129,0.28)] hover:-translate-y-0.5'
                    )}
                  >
                    {appState === 'listening' && (
                      <motion.div
                        animate={{ scale: [1, 1.35, 1], opacity: [0.35, 0, 0.35] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-rose-500"
                      />
                    )}
                    <Mic className={cn('relative z-10 h-10 w-10', appState === 'listening' && 'animate-pulse')} />
                  </motion.button>

                  <button className="rounded-full border border-zinc-800 bg-zinc-800/70 p-4 text-zinc-300 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-700/70 hover:text-white">
                    <RotateCcw className="h-5 w-5" />
                  </button>
                </div>

                <div className="text-sm font-medium text-zinc-400">
                  {appState === 'listening' ? 'Tap the mic to stop speaking' : 'Tap the mic to start a conversation'}
                </div>
              </div>
            </section>

            <section className="flex min-h-[320px] flex-col rounded-[30px] border border-zinc-800/80 bg-zinc-900/70 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.25)] backdrop-blur-2xl">
              <div className="mb-6 flex items-center justify-between border-b border-zinc-800/80 pb-4">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-zinc-400">
                  <FileText className="h-4 w-4 text-indigo-400" />
                  Live Transcript
                </div>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center rounded-[24px] border border-dashed border-zinc-800 bg-zinc-950/50 px-6 py-10 text-center text-zinc-400">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/80 text-zinc-300">
                      <MessageSquare className="h-7 w-7" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-zinc-200">No conversation yet</h3>
                    <p className="max-w-sm text-sm leading-6 text-zinc-500">Start speaking and your live transcript will appear here with polished, readable responses.</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={msg.id}
                      className={cn(
                        'max-w-[88%] rounded-2xl border p-4 shadow-sm',
                        msg.sender === 'user'
                          ? 'ml-auto rounded-tr-md border-zinc-800 bg-zinc-800/70 text-zinc-100'
                          : 'mr-auto rounded-tl-md border-indigo-500/20 bg-indigo-500/10 text-zinc-100'
                      )}
                    >
                      <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                        {msg.sender === 'user' ? 'You' : 'AI Tutor'}
                        <span className="font-normal normal-case text-zinc-400">{msg.timestamp}</span>
                      </div>
                      <p className="text-sm leading-7 text-zinc-300">{msg.text}</p>
                    </motion.div>
                  ))
                )}
              </div>
            </section>
          </div>

          <aside className="flex flex-col gap-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <div className="rounded-[24px] border border-zinc-800/80 bg-zinc-900/60 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.2)] backdrop-blur-xl">
                <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500">Microphone</div>
                <div className="flex items-center gap-2">
                  <div className={cn('h-2.5 w-2.5 rounded-full', appState === 'listening' ? 'animate-pulse bg-emerald-500' : 'bg-zinc-600')} />
                  <span className="text-sm font-semibold text-zinc-100">{appState === 'listening' ? 'Active' : 'Standby'}</span>
                </div>
              </div>

              <div className="rounded-[24px] border border-zinc-800/80 bg-zinc-900/60 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.2)] backdrop-blur-xl">
                <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500">Voice AI</div>
                <div className="flex items-center gap-2">
                  <div className={cn('h-2.5 w-2.5 rounded-full', appState === 'speaking' || appState === 'thinking' ? 'bg-indigo-500' : 'bg-emerald-500')} />
                  <span className="text-sm font-semibold text-zinc-100">{appState === 'idle' ? 'Connected' : appState === 'listening' ? 'Listening' : 'Processing'}</span>
                </div>
              </div>

              <div className="rounded-[24px] border border-zinc-800/80 bg-zinc-900/60 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.2)] backdrop-blur-xl">
                <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500">Signal Quality</div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-semibold text-zinc-100">Excellent</span>
                </div>
              </div>

              <div className="rounded-[24px] border border-zinc-800/80 bg-zinc-900/60 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.2)] backdrop-blur-xl">
                <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500">Session Time</div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-semibold text-zinc-100">{formatDuration(sessionDuration)}</span>
                </div>
              </div>
            </div>

            <section className="rounded-[30px] border border-zinc-800/80 bg-zinc-900/60 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.25)] backdrop-blur-2xl">
              <div className="mb-4 flex items-center gap-2 border-b border-zinc-800/80 pb-4 text-sm font-semibold uppercase tracking-[0.24em] text-zinc-400">
                <Zap className="h-4 w-4 text-amber-400" />
                Quick Actions
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {QUICK_ACTIONS.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-zinc-800/80 bg-zinc-950/50 p-4 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-500/30 hover:bg-zinc-800/80"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800/70 text-zinc-300 transition-colors duration-300 group-hover:bg-indigo-500/10 group-hover:text-indigo-400">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium text-zinc-300">{action.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-[30px] border border-zinc-800/80 bg-zinc-900/60 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.25)] backdrop-blur-2xl">
              <div className="mb-4 flex items-center gap-2 border-b border-zinc-800/80 pb-4 text-sm font-semibold uppercase tracking-[0.24em] text-zinc-400">
                <History className="h-4 w-4 text-zinc-400" />
                Recent Sessions
              </div>
              <div className="space-y-3">
                {RECENT_SESSIONS.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between rounded-2xl border border-zinc-800/80 bg-zinc-950/50 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-700 hover:bg-zinc-800/70"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                        <Mic className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-zinc-100">{session.title}</h4>
                        <p className="text-xs text-zinc-500">{session.date}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-zinc-400">{session.duration}</span>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>

        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="relative z-20 rounded-[28px] border border-zinc-800/80 bg-zinc-900/80 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:w-[360px] sm:self-end"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
                  <Settings className="h-4 w-4 text-indigo-400" />
                  Voice Settings
                </div>
                <button onClick={() => setShowSettings(false)} className="text-zinc-500 transition-colors hover:text-zinc-300">
                  <Trash2 className="h-4 w-4 opacity-0" />
                </button>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500">AI Voice Style</label>
                  <select
                    value={voiceStyle}
                    onChange={(e) => setVoiceStyle(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/70 p-3 text-sm font-medium text-zinc-200 outline-none ring-0 focus:border-indigo-500/40"
                  >
                    <option>Friendly & Encouraging</option>
                    <option>Professional & Direct</option>
                    <option>Academic</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/70 p-3 text-sm font-medium text-zinc-200 outline-none ring-0 focus:border-indigo-500/40"
                  >
                    <option>English (US)</option>
                    <option>English (UK)</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500">Speaking Speed</label>
                    <span className="text-sm font-semibold text-indigo-400">{speakingSpeed}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={speakingSpeed}
                    onChange={(e) => setSpeakingSpeed(parseFloat(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500">Volume</label>
                    <span className="text-sm font-semibold text-indigo-400">{volume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(parseInt(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
