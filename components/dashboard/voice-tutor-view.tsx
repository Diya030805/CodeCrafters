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
import { glassStyles } from '@/lib/glass';

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
    <div className="flex items-center justify-center gap-1.5 h-16 w-48">
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
            repeatType: "reverse",
            ease: "easeInOut",
            delay: isActive ? i * 0.1 : 0
          }}
          className={cn(
            "w-2 rounded-full",
            appState === 'speaking' ? "bg-indigo-500" : "bg-emerald-500"
          )}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className={cn("p-6 md:p-8 relative overflow-hidden", glassStyles.container)}>
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Voice AI Tutor</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Interactive conversational learning</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors border border-black/5 dark:border-white/10"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button 
              onClick={handleClear}
              className="p-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors border border-rose-500/20"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Conversation Workspace */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Active Voice Interface */}
          <div className={cn("p-8 lg:p-12 flex flex-col items-center justify-center relative min-h-[400px]", glassStyles.container)}>
            {/* Status Indicator */}
            <div className="absolute top-6 left-6 flex items-center gap-2">
              <div className="relative flex h-3 w-3">
                {appState !== 'idle' && (
                  <span className={cn(
                    "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                    appState === 'speaking' ? "bg-indigo-400" :
                    appState === 'thinking' ? "bg-amber-400" : "bg-emerald-400"
                  )}></span>
                )}
                <span className={cn(
                  "relative inline-flex rounded-full h-3 w-3",
                  appState === 'speaking' ? "bg-indigo-500" :
                  appState === 'thinking' ? "bg-amber-500" :
                  appState === 'listening' ? "bg-emerald-500" : "bg-slate-400"
                )}></span>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {appState === 'idle' ? 'Ready' : 
                 appState === 'listening' ? 'Listening...' :
                 appState === 'thinking' ? 'Analyzing...' : 'AI Speaking...'}
              </span>
            </div>

            {/* Avatars and Waveform */}
            <div className="flex flex-col items-center gap-8 mb-12">
              <div className="flex items-center gap-12">
                
                {/* User Avatar */}
                <div className="flex flex-col items-center gap-3">
                  <div className={cn(
                    "w-20 h-20 rounded-full flex items-center justify-center border-4 transition-all duration-300 relative",
                    appState === 'listening' ? "border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]" : "border-transparent bg-slate-100 dark:bg-white/5"
                  )}>
                    {appState === 'listening' && (
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 rounded-full border-2 border-emerald-500"
                      />
                    )}
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-slate-500 font-bold text-xl">
                      U
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">You</span>
                </div>

                {/* Waveform */}
                <div className="hidden sm:block">
                  {renderWaveformVisualizer(appState === 'listening' || appState === 'speaking')}
                </div>

                {/* AI Avatar */}
                <div className="flex flex-col items-center gap-3">
                  <div className={cn(
                    "w-20 h-20 rounded-full flex items-center justify-center border-4 transition-all duration-300 relative",
                    appState === 'speaking' ? "border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.3)]" : 
                    appState === 'thinking' ? "border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.3)]" : "border-transparent bg-slate-100 dark:bg-white/5"
                  )}>
                    {appState === 'speaking' && (
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 rounded-full border-2 border-indigo-500"
                      />
                    )}
                    <div className="w-full h-full rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                      {appState === 'thinking' ? (
                        <BrainCircuit className="w-8 h-8 animate-pulse" />
                      ) : (
                        <BrainCircuit className="w-8 h-8" />
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">AI Tutor</span>
                </div>
              </div>
            </div>

            {/* Main Mic Control */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-4 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors border border-black/5 dark:border-white/10"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>

              <button
                onClick={appState === 'listening' ? handleStopListening : handleStartListening}
                className={cn(
                  "relative group flex items-center justify-center w-24 h-24 rounded-full transition-all duration-300 shadow-xl",
                  appState === 'listening' 
                    ? "bg-rose-500 text-white shadow-rose-500/30 hover:bg-rose-600 hover:shadow-rose-500/50" 
                    : "bg-emerald-500 text-white shadow-emerald-500/30 hover:bg-emerald-600 hover:shadow-emerald-500/50 hover:-translate-y-1"
                )}
              >
                {appState === 'listening' && (
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-rose-500"
                  />
                )}
                <Mic className={cn("w-10 h-10 relative z-10", appState === 'listening' && "animate-pulse")} />
              </button>

              <button
                className="p-4 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors border border-black/5 dark:border-white/10"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mt-6 text-sm font-bold text-slate-500">
              {appState === 'listening' ? 'Tap mic to stop' : 'Tap mic to speak'}
            </div>
          </div>

          {/* Transcript Panel */}
          <div className={cn("p-6 flex-grow flex flex-col min-h-[300px]", glassStyles.container)}>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-white/5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-500" />
                Live Transcript
              </h3>
            </div>
            
            <div className="flex-grow overflow-y-auto space-y-6">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <MessageSquare className="w-8 h-8 mb-3 opacity-20" />
                  <p className="text-sm">No conversation yet. Start speaking!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id}
                    className={cn(
                      "max-w-[85%] rounded-2xl p-4",
                      msg.sender === 'user' 
                        ? "bg-slate-100 dark:bg-white/5 ml-auto rounded-tr-sm" 
                        : "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-900 dark:text-indigo-100 border border-indigo-100 dark:border-indigo-500/20 mr-auto rounded-tl-sm"
                    )}
                  >
                    <div className="text-[10px] font-bold uppercase tracking-wider opacity-50 mb-1.5 flex items-center gap-2">
                      {msg.sender === 'user' ? 'You' : 'AI Tutor'}
                      <span className="font-normal normal-case">{msg.timestamp}</span>
                    </div>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </motion.div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Side Panel: Status & Settings */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* AI Status Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className={cn("p-4 frosted-card")}>
              <div className="text-[10px] font-bold text-slate-500 uppercase mb-2">Microphone</div>
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", appState === 'listening' ? "bg-emerald-500 animate-pulse" : "bg-slate-300 dark:bg-slate-600")} />
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {appState === 'listening' ? 'Active' : 'Standby'}
                </span>
              </div>
            </div>
            
            <div className={cn("p-4 frosted-card")}>
              <div className="text-[10px] font-bold text-slate-500 uppercase mb-2">Voice AI</div>
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", appState === 'speaking' || appState === 'thinking' ? "bg-indigo-500" : "bg-emerald-500")} />
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {appState === 'idle' ? 'Connected' : appState === 'listening' ? 'Listening' : 'Processing'}
                </span>
              </div>
            </div>

            <div className={cn("p-4 frosted-card")}>
              <div className="text-[10px] font-bold text-slate-500 uppercase mb-2">Signal Quality</div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-bold text-slate-900 dark:text-white">Excellent</span>
              </div>
            </div>

            <div className={cn("p-4 frosted-card")}>
              <div className="text-[10px] font-bold text-slate-500 uppercase mb-2">Session Time</div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {formatDuration(sessionDuration)}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className={cn("p-6 space-y-4", glassStyles.container)}>
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100 dark:border-white/5">
              <Zap className="w-4 h-4 text-amber-500" />
              Quick Actions
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {QUICK_ACTIONS.map(action => (
                <button
                  key={action.id}
                  className="p-3 rounded-xl flex flex-col items-center justify-center gap-2 text-xs font-bold transition-all bg-slate-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 hover:border-indigo-500/30 hover:bg-indigo-50 dark:hover:bg-indigo-500/5 group text-center"
                >
                  <action.icon className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  <span className="text-slate-600 dark:text-slate-300">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Sessions */}
          <div className={cn("p-6 space-y-4", glassStyles.container)}>
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100 dark:border-white/5">
              <History className="w-4 h-4 text-slate-400" />
              Recent Sessions
            </div>
            <div className="space-y-3">
              {RECENT_SESSIONS.map(session => (
                <div key={session.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                      <Mic className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                        {session.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{session.date}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">{session.duration}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Settings Overlay (conditionally rendered) */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={cn("absolute right-0 top-20 w-80 p-6 z-50 shadow-2xl", glassStyles.container)}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Settings className="w-4 h-4 text-indigo-500" />
                    Voice Settings
                  </h3>
                  <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600">
                    <Trash2 className="w-4 h-4 opacity-0" /> {/* Spacer */}
                  </button>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">AI Voice Style</label>
                    <select 
                      value={voiceStyle}
                      onChange={(e) => setVoiceStyle(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-black/5 dark:border-white/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    >
                      <option>Friendly & Encouraging</option>
                      <option>Professional & Direct</option>
                      <option>Academic</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Language</label>
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-black/5 dark:border-white/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    >
                      <option>English (US)</option>
                      <option>English (UK)</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Speaking Speed</label>
                      <span className="text-[10px] font-bold text-indigo-500">{speakingSpeed}x</span>
                    </div>
                    <input 
                      type="range" min="0.5" max="2" step="0.1" 
                      value={speakingSpeed}
                      onChange={(e) => setSpeakingSpeed(parseFloat(e.target.value))}
                      className="w-full accent-indigo-500" 
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Volume</label>
                      <span className="text-[10px] font-bold text-indigo-500">{volume}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" 
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
    </div>
  );
}
