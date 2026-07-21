'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Plus, 
  Trash2, 
  Sparkles, 
  Bot, 
  User, 
  Paperclip, 
  Mic, 
  SendHorizontal, 
  Trash, 
  MessageSquare,
  FileText,
  X,
  ArrowUp,
  ThumbsUp,
  RefreshCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { glassStyles } from '@/lib/glass';
import { useAccent } from '@/components/accent-provider';
import { useTheme } from '@/components/theme-provider';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
}

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
}

const SUGGESTED_PROMPTS = [
  "Explain Monads in C++",
  "Test my German A2 Vocab",
  "Analyze Stats Arithmetic Mean formulas",
  "Summarize Quantum Entanglement"
];

const INITIAL_SESSIONS: ChatSession[] = [
  { id: '1', title: 'Quantum Physics Review', lastMessage: 'The double slit experiment...', timestamp: '2h ago' },
  { id: '2', title: 'German Verb Conjugation', lastMessage: 'Ich habe, du hast...', timestamp: '5h ago' },
  { id: '3', title: 'Calculus III Derivatives', lastMessage: 'Partial derivatives are...', timestamp: '1d ago' },
];

export function AITutorView() {
  const { meta } = useAccent();
  const { darkMode } = useTheme();
  const [sessions, setSessions] = React.useState<ChatSession[]>(INITIAL_SESSIONS);
  const [activeSessionId, setActiveSessionId] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputValue, setInputValue] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const [attachedFile, setAttachedFile] = React.useState<{ name: string; size: string } | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [likedMessages, setLikedMessages] = React.useState<Record<string, boolean>>({});
  const [regeneratingId, setRegeneratingId] = React.useState<string | null>(null);
  
  const [isRecording, setIsRecording] = React.useState(false);
  const [recordingTime, setRecordingTime] = React.useState(0);
  
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (!inputValue.trim() && !attachedFile) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setAttachedFile(null);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: `I've analyzed your query regarding "${newUserMessage.content || 'the attached file'}". Here is a breakdown of the core concepts you should focus on to master this topic...`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const startNewChat = () => {
    setActiveSessionId(null);
    setMessages([]);
  };

  const deleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSessions(prev => prev.filter(s => s.id !== id));
    if (activeSessionId === id) {
      startNewChat();
    }
  };

  const toggleLike = (id: string) => {
    setLikedMessages(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRegenerate = (id: string) => {
    setRegeneratingId(id);
    setTimeout(() => {
      setMessages(prev => prev.map(m => 
        m.id === id 
          ? { ...m, content: m.content + " (Refined for better clarity based on updated context...)" } 
          : m
      ));
      setRegeneratingId(null);
    }, 1500);
  };

  const handleMicClick = () => {
    if (isRecording) {
      setIsRecording(false);
      setInputValue(prev => prev + (prev ? ' ' : '') + "This is a mock transcribed audio note from the microphone.");
    } else {
      setIsRecording(true);
      setRecordingTime(0);
    }
  };

  const filteredSessions = sessions.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-180px)] min-h-[600px]">
      
      {/* Left Panel: Chat History (3 Cols) */}
      <div className={cn("lg:col-span-3 flex flex-col gap-4 overflow-hidden", glassStyles.container)}>
        <div className="p-2 space-y-4 flex flex-col h-full">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input 
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full pl-9 pr-4 py-2.5 text-xs outline-none transition-all duration-300",
                glassStyles.input
              )}
            />
          </div>

          {/* New Chat Button */}
          <button 
            onClick={startNewChat}
            className={cn(
              "w-full py-3 rounded-xl text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg",
              darkMode ? meta.dark : meta.light
            )}
            style={{ backgroundColor: meta.hex }}
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>

          {/* History List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {filteredSessions.map((session) => (
                <motion.div
                  key={session.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onClick={() => setActiveSessionId(session.id)}
                  className={cn(
                    "group relative p-3 rounded-xl cursor-pointer transition-all border border-transparent",
                    activeSessionId === session.id 
                      ? "bg-white/[0.08] border-white/[0.1] shadow-sm" 
                      : "hover:bg-white/[0.04]"
                  )}
                >
                  <div className="flex flex-col gap-1 pr-6">
                    <h4 className="text-xs font-bold text-white truncate">{session.title}</h4>
                    <p className="text-[10px] text-slate-500 truncate">{session.lastMessage}</p>
                  </div>
                  <span className="absolute right-3 top-3 text-[9px] font-bold text-slate-600">
                    {session.timestamp}
                  </span>
                  <button 
                    onClick={(e) => deleteSession(e, session.id)}
                    className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-rose-500/20 text-slate-500 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* AI Core Status */}
          <div className="mt-auto pt-4 border-t border-white/[0.05]">
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.03]">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-75" />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                AI Engine: <span className="text-emerald-500">ONLINE</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Chat Workspace (9 Cols) */}
      <div className={cn("lg:col-span-9 flex flex-col overflow-hidden relative", glassStyles.container)}>
        
        {/* Header */}
        <div className="p-4 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.01]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center border border-white/[0.05]">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">
                {activeSessionId ? sessions.find(s => s.id === activeSessionId)?.title : 'New Academic Inquiry'}
              </h3>
              <div className="flex gap-2 mt-0.5">
                <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 rounded uppercase">Context: Active</span>
                <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 px-1.5 rounded uppercase">Model: Omni-3.5</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setMessages([])}
            className="p-2 rounded-lg hover:bg-white/[0.05] text-slate-500 transition-colors"
            title="Clear Board"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-black/20">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto space-y-8 py-12">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-amber-500/20 to-orange-600/30 border border-amber-500/30 flex items-center justify-center shadow-2xl relative"
              >
                <div className="absolute inset-0 bg-amber-500/10 blur-2xl rounded-full" />
                <Sparkles className="w-10 h-10 text-amber-500 relative z-10" />
              </motion.div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white tracking-tight">Your Personal AI Academic Core</h2>
                <p className="text-sm text-slate-400 font-medium">Ignite your research or master complex subjects through deep cognitive synthesis.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                {SUGGESTED_PROMPTS.map((prompt, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    onClick={() => setInputValue(prompt)}
                    className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] text-left transition-all group relative overflow-hidden"
                  >
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                      style={{ border: `1px solid ${meta.hex}40`, boxShadow: `0 0 20px ${meta.hex}15` }}
                    />
                    <p className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors relative z-10">{prompt}</p>
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 pb-4">
              <AnimatePresence mode="popLayout">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex flex-col gap-2 max-w-[85%]",
                      msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                    )}
                  >
                    <div className={cn(
                      "p-4 rounded-2xl text-sm leading-relaxed relative overflow-hidden",
                      msg.role === 'user' 
                        ? "bg-[#16171B]/90 backdrop-blur-xl border border-white/[0.08] text-white rounded-tr-none shadow-xl" 
                        : "bg-white/[0.03] border border-white/[0.05] text-slate-200 rounded-tl-none shadow-sm"
                    )}>
                      {msg.role === 'ai' && (
                        <div 
                          className="absolute inset-0 opacity-20 pointer-events-none"
                          style={{ border: `1px solid ${meta.hex}30`, boxShadow: `inset 0 0 15px ${meta.hex}10` }}
                        />
                      )}
                      {msg.role === 'ai' ? (
                        <div className="markdown-body prose prose-invert prose-sm max-w-none relative z-10">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                          
                          {/* Reactions Row */}
                          <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center gap-3">
                            <motion.button 
                              whileTap={{ scale: 0.85 }}
                              onClick={() => toggleLike(msg.id)}
                              className={cn(
                                "flex items-center gap-1.5 transition-colors",
                                likedMessages[msg.id] ? "text-amber-500" : "text-slate-500 hover:text-slate-300"
                              )}
                            >
                              <ThumbsUp className={cn("w-3.5 h-3.5", likedMessages[msg.id] && "fill-current")} />
                              <span className="text-[10px] font-black uppercase tracking-widest">
                                {likedMessages[msg.id] ? 'Helpful' : 'Like'}
                              </span>
                            </motion.button>
                            
                            <motion.button 
                              whileTap={{ scale: 0.85 }}
                              onClick={() => handleRegenerate(msg.id)}
                              disabled={regeneratingId === msg.id}
                              className={cn(
                                "flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors disabled:opacity-50",
                                regeneratingId === msg.id && "text-amber-500"
                              )}
                            >
                              <RefreshCcw className={cn("w-3.5 h-3.5", regeneratingId === msg.id && "animate-spin")} />
                              <span className="text-[10px] font-black uppercase tracking-widest">
                                {regeneratingId === msg.id ? 'Refining...' : 'Regenerate'}
                              </span>
                            </motion.button>
                          </div>
                        </div>
                      ) : (
                        <p className="relative z-10">{msg.content}</p>
                      )}
                    </div>
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-1.5">
                      {msg.role === 'user' ? <User className="w-2.5 h-2.5" /> : <Bot className="w-2.5 h-2.5 text-amber-500" />}
                      {msg.timestamp}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-2 mr-auto"
                >
                  <div className="px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex gap-1.5 items-center">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        variants={{
                          jump: {
                            y: [0, -6, 0],
                            transition: {
                              duration: 0.8,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: i * 0.15
                            }
                          }
                        }}
                        animate="jump"
                        className="w-1.5 h-1.5 rounded-full bg-amber-500/60"
                        style={{ backgroundColor: meta.hex }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={scrollRef} />
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white/[0.02] border-t border-white/[0.05]">
          <div className="max-w-4xl mx-auto space-y-2">
            {attachedFile && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20"
              >
                <FileText className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[10px] font-bold text-amber-500">{attachedFile.name} ({attachedFile.size})</span>
                <button onClick={() => setAttachedFile(null)} className="ml-1">
                  <X className="w-3 h-3 text-amber-500 hover:text-amber-600" />
                </button>
              </motion.div>
            )}
            
            <div className="flex items-end gap-3 p-2 rounded-2xl bg-[#16171B]/60 border border-white/[0.08] focus-within:border-amber-500/30 transition-colors shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-1 pb-1">
                <button 
                  onClick={() => setAttachedFile({ name: 'Curriculum_v1.pdf', size: '2.4MB' })}
                  className="p-2 rounded-lg hover:bg-white/[0.05] text-slate-500 transition-colors"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleMicClick}
                  className={cn(
                    "p-2 rounded-lg transition-colors flex items-center gap-1.5",
                    isRecording 
                      ? "bg-rose-500/20 text-rose-500 hover:bg-rose-500/30" 
                      : "hover:bg-white/[0.05] text-slate-500"
                  )}
                >
                  <Mic className={cn("w-4 h-4", isRecording && "animate-pulse")} />
                  {isRecording && <span className="text-[10px] font-bold">{Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}</span>}
                </button>
              </div>

              <textarea 
                rows={1}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask your tutor anything or drop a research file..."
                className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-slate-600 resize-none py-2 px-1 max-h-32"
              />

              <button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim() && !attachedFile}
                className={cn(
                  "p-3 rounded-xl transition-all shadow-lg flex items-center justify-center disabled:opacity-50 disabled:scale-100 active:scale-90",
                  inputValue.trim() || attachedFile ? "bg-amber-500 text-white hover:scale-105" : "bg-white/[0.05] text-slate-600"
                )}
                style={inputValue.trim() || attachedFile ? { backgroundColor: meta.hex } : {}}
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .markdown-body p {
          margin-bottom: 0.5rem;
        }
        .markdown-body p:last-child {
          margin-bottom: 0;
        }
        .markdown-body strong {
          color: white;
          font-weight: 800;
        }
      `}</style>
    </div>
  );
}
