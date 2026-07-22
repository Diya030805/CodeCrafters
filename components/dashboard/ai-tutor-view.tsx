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
  Trash, 
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

const MOCK_SESSION_MESSAGES: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1_1',
      role: 'user',
      content: "Can you break down the significance of wave-particle duality in the double-slit experiment? I'm struggling with the observer effect.",
      timestamp: '2h ago'
    },
    {
      id: 'm1_2',
      role: 'ai',
      content: `Certainly, Diya! The **double-slit experiment** is the absolute cornerstone of quantum physics. Here is a simplified cognitive breakdown of how it works:

### 1. The Core Paradox
When particles (like electrons) are fired through two parallel slits, they don't form two simple columns on the back screen as classical bullets would. Instead, they form an **interference pattern** of alternating light and dark bands—exactly like waves rippling in water.

### 2. The Observer Effect
This is the truly mind-bending part:
* **Unobserved**: The particle exists as a mathematical **wave of probability**, passing through *both* slits simultaneously.
* **Observed**: If we place a detector at the slits to measure which slit the particle passes through, the wave function instantly collapses. The particle acts like a physical sphere and the interference pattern disappears, leaving only two straight lines!

### 3. Key Takeaway
At the quantum level, **the act of observation changes physical reality**. The observer is an active participant in the state of the universe, not just a passive witness.`,
      timestamp: '2h ago'
    }
  ],
  '2': [
    {
      id: 'm2_1',
      role: 'user',
      content: "I need help practicing German present perfect tense conjugations (Perfekt). Can we review sein vs haben?",
      timestamp: '5h ago'
    },
    {
      id: 'm2_2',
      role: 'ai',
      content: `Guten Tag, Diya! Let's master the **German Perfekt** present perfect tense. It is the most common way to speak about the past in German.

### The Rule of Thumb
German Perfekt is formed using an auxiliary verb (**haben** or **sein**) + the **Partizip II** (past participle) at the very end of the sentence.

1. **HABEN (Used for 90% of verbs)**:
   * Used for transitive verbs (verbs taking an accusative object) and reflexive verbs.
   * *Example*: "Ich habe ein Buch gelesen." (I read a book.)

2. **SEIN (Used for specific verbs)**:
   * Used for intransitive verbs indicating **movement/direction** (e.g., gehen, fahren, fliegen, kommen) or **change of state** (e.g., aufwachen, sterben).
   * Also used for *sein* (to be) and *werden* (to become) itself.
   * *Example*: "Sie ist nach Berlin gefahren." (She drove to Berlin.)

Let's test you! How would you conjugate **"gehen"** (to go) in the Perfekt for **"wir"** (we)?`,
      timestamp: '5h ago'
    }
  ],
  '3': [
    {
      id: 'm3_1',
      role: 'user',
      content: "What is the geometric meaning of the gradient vector in multivariable calculus? How does it relate to partial derivatives?",
      timestamp: '1d ago'
    },
    {
      id: 'm3_2',
      role: 'ai',
      content: `Excellent mathematical query, Diya! Let's visualize the **gradient vector** geometrically.

Mathematically, the gradient of a multivariable function $f(x, y)$ is simply a vector containing its partial derivatives:
$$\\nabla f(x, y) = \\left\\langle \\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y} \\right\\rangle$$

Here is what this means geometrically on a 3D landscape:

### 1. Direction of Steepest Ascent
If you are standing on a hill represented by $f(x, y)$, the gradient vector points in the direction of the **steepest uphill climb** from your current location. If you walk in the exact opposite direction ($-\\nabla f$), you are walking in the direction of steepest descent.

### 2. Orthogonality to Contour Lines
If you look at a top-down contour map of the hill (where each line represents a constant elevation), the gradient vector is always **perpendicular (orthogonal)** to the contour line passing through your current point.

### 3. Rate of Maximum Increase
The **magnitude** (length) of the gradient vector, $||\\nabla f||$, represents the exact rate of change in that steepest direction. A longer gradient vector means a steeper slope!`,
      timestamp: '1d ago'
    }
  ]
};

export function AITutorView() {
  const { accentColor, meta } = useAccent();
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

  const getGradientClass = (accent: string) => {
    switch (accent) {
      case 'amber':
        return 'bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 hover:brightness-110 shadow-orange-500/20';
      case 'blue':
        return 'bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 hover:brightness-110 shadow-blue-500/20';
      case 'green':
        return 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 hover:brightness-110 shadow-emerald-500/20';
      case 'crimson':
        return 'bg-gradient-to-r from-pink-500 via-rose-500 to-rose-600 hover:brightness-110 shadow-rose-500/20';
      default:
        return 'bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 hover:brightness-110 shadow-orange-500/20';
    }
  };

  const getEmblemStyles = (accent: string) => {
    switch (accent) {
      case 'amber':
        return {
          bg: 'from-amber-500/20 to-orange-600/30 border-amber-500/30',
          glow: 'bg-amber-500/10',
          text: 'text-amber-500'
        };
      case 'blue':
        return {
          bg: 'from-blue-500/20 to-indigo-600/30 border-blue-500/30',
          glow: 'bg-blue-500/10',
          text: 'text-blue-500'
        };
      case 'green':
        return {
          bg: 'from-emerald-500/20 to-teal-600/30 border-emerald-500/30',
          glow: 'bg-emerald-500/10',
          text: 'text-emerald-500'
        };
      case 'crimson':
        return {
          bg: 'from-pink-500/20 to-rose-600/30 border-pink-500/30',
          glow: 'bg-pink-500/10',
          text: 'text-pink-500'
        };
      default:
        return {
          bg: 'from-amber-500/20 to-orange-600/30 border-amber-500/30',
          glow: 'bg-amber-500/10',
          text: 'text-amber-500'
        };
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() && !attachedFile) return;

    const userContent = inputValue;
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setAttachedFile(null);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let aiResponseContent = `I have analyzed your query regarding **"${userContent || 'the attached file'}"**. Here is a high-fidelity diagnostic mapping:

1. **Core Insight**: The fundamental cognitive block here rests on synthesizing immediate context with structural principles.
2. **Key Progression**: We should first isolate variables, establish a safe proof reference, and systematically trace downstream dependencies.
3. **Suggested Experimentation**: Try modifying boundaries to inspect extreme limit states.

Let me know what specific sub-aspect you want to unpack next!`;

      // Custom high-fidelity mock matches
      if (userContent.toLowerCase().includes('monad')) {
        aiResponseContent = `A **Monad** in C++ is a computational pipeline design pattern that wraps values inside a protective context, allowing safe, sequence-oriented function chaining.

### The Modern standard: \`std::optional\`
In C++23, you can chain monadic operations elegantly without explicit null-checks:
\`\`\`cpp
auto final_value = get_id(42)
                   .and_then(fetch_name)
                   .transform(to_uppercase);
\`\`\``;
      } else if (userContent.toLowerCase().includes('german')) {
        aiResponseContent = `Perfekt, Diya! Let's build your German vocabulary and perfect tense mastery.
To conjugate **"gehen"** (to go):
* It uses **sein** as the auxiliary verb because it represents physical displacement.
* Present Perfect: **"Wir sind gegangen"** (We have gone / We went).

Excellent! Let's try another: How would you express *"I fell asleep"* (einschlafen) in the past? Remember that falling asleep is a change of state!`;
      } else if (userContent.toLowerCase().includes('calculus') || userContent.toLowerCase().includes('gradient')) {
        aiResponseContent = `Geometrically, the **gradient vector** $\\nabla f(x, y)$ always points in the direction of the steepest ascent on a 3D graph landscape.
* **Magnitude**: $||\\nabla f||$ equals the slope rate in that steepest direction.
* **Orthogonality**: It slices perpendicularly across the contour level curves.

$$\\nabla f(x, y) = \\left\\langle \\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y} \\right\\rangle$$`;
      } else if (userContent.toLowerCase().includes('quantum')) {
        aiResponseContent = `The **Observer Effect** represents a cornerstone paradigm shift. 
When physical detection is introduced at the slits, the probability wave collapses into a singular particle-like localized trajectory.

Would you like to explore the mathematics behind **Bell's Inequality** or look deeper into the experimental setup?`;
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: aiResponseContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1800);
  };

  const startNewChat = () => {
    setActiveSessionId(null);
    setMessages([]);
  };

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    setMessages(MOCK_SESSION_MESSAGES[id] || []);
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
          ? { ...m, content: m.content + "\n\n*(Refined with optimized cognitive paths based on academic model feedback)*" } 
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

  const handleSelectPrompt = (prompt: string) => {
    setInputValue(prompt);
    // Focus or trigger immediate action
    setTimeout(() => {
      const newUserMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: prompt,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([newUserMessage]);
      setInputValue('');
      setIsTyping(true);

      setTimeout(() => {
        let responseContent = '';
        if (prompt.includes('Monads')) {
          responseContent = `A **Monad** in C++ is a computation design pattern that structures logic flow by wrapping values inside a protective context, allowing you to chain operations safely.

### The Core Concept
Think of a Monad as having three elements:
1. **Type Wrapper**: A template class (e.g., \`std::optional<T>\`, \`std::expected<T, E>\` in C++23) wrapping a raw type \`T\`.
2. **Unit / Return**: A constructor wrapping a plain value of type \`T\` into the Monadic container.
3. **Bind**: An operator or mapped function (like \`.and_then()\`) taking a function \`T -> Monad<U>\` and applying it to the inner value safely.

### Demonstration in C++23:
Monads allow developers to bypass nested \`if\` null checks. Here is a modern monadic chain:

\`\`\`cpp
#include <iostream>
#include <optional>
#include <string>

std::optional<std::string> get_user_name(int id) {
    if (id == 42) return "Diya Ghosh";
    return std::nullopt;
}

std::optional<std::string> to_upper(std::string s) {
    for (char &c : s) c = std::toupper(c);
    return s;
}

int main() {
    // Elegant functional chain using .and_then()
    auto result = get_user_name(42)
                  .and_then(to_upper);
                  
    if (result) {
        std::cout << "User: " << *result << std::endl; // Prints: USER: DIYA GHOSH
    }
}
\`\`\``;
        } else if (prompt.includes('German')) {
          responseContent = `Guten Tag, Diya! Let's practice your German A2 vocabulary! Here is a targeted vocabulary review:

### 1. Key Words:
* **der Bahnhof** ➔ Train station
* **die Verspätung** ➔ Delay
* **die Fahrkarte** ➔ Ticket

### 2. Context Sentence:
*"Der Zug hat leider 10 Minuten Verspätung."* (Unfortunately, the train is 10 minutes late.)

Let's test you. Can you translate this sentence to German?
➔ **"Where is the nearest train station?"**`;
        } else if (prompt.includes('Stats Arithmetic Mean')) {
          responseContent = `Let's analyze the **Arithmetic Mean** formula in statistics!

The arithmetic mean is the sum of a collection of numerical values divided by the count of values in that collection.

### Core Mathematical Formulas:

1. **Population Mean ($\\mu$)**:
   $$\\mu = \\frac{\\sum_{i=1}^{N} X_i}{N}$$
   Where $N$ is the total population size and $X_i$ is each individual value.

2. **Sample Mean ($\\bar{x}$)**:
   $$\\bar{x} = \\frac{\\sum_{i=1}^{n} x_i}{n}$$
   Where $n$ is the sample size.

### Geometric Significance:
The arithmetic mean acts as the **physical balance point** of the dataset. If you put weights equal to your data values on a see-saw, the mean is exactly where the pivot must sit to keep the scale balanced!`;
        } else if (prompt.includes('Quantum Entanglement')) {
          responseContent = `**Quantum Entanglement** is a physical phenomenon where pairs or groups of particles generate or interact in ways such that the quantum state of each particle cannot be described independently of the state of the others.

### Fundamental Aspects:

1. **Einstein's "Spooky Action at a Distance"**:
   If you entangle two electrons and separate them by lightyears, measuring the spin of electron A (e.g., spin UP) instantly dictates that electron B has the opposite spin (spin DOWN) faster than the speed of light.

2. **The Wave Function**:
   The two particles share a single, unified wave function. Neither particle has a definite spin until a measurement is made.

3. **Applications**:
   This is the core physical resource driving modern quantum computing, quantum cryptography, and quantum teleportation!`;
        } else {
          responseContent = `I have received your prompt: "${prompt}". Let me compile the relevant resources and structure a deep cognitive breakdown for you...`;
        }

        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          content: responseContent,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
      }, 1500);
    }, 200);
  };

  const filteredSessions = sessions.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const emblem = getEmblemStyles(accentColor);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-180px)] min-h-[600px]">
      
      {/* Middle Panel: Chat History (3 Cols) */}
      <div className={cn("lg:col-span-3 flex flex-col gap-4 overflow-hidden", glassStyles.container)}>
        <div className="p-2 space-y-4 flex flex-col h-full">
          {/* Search conversations */}
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

          {/* New Chat Button with Dynamic Gradient */}
          <button 
            onClick={startNewChat}
            className={cn(
              "w-full py-3.5 rounded-xl text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg border border-white/10",
              getGradientClass(accentColor)
            )}
          >
            <Plus className="w-4 h-4 font-extrabold" />
            + NEW CHAT
          </button>

          {/* History List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {filteredSessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  layout
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSelectSession(session.id)}
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

          {/* Bottom AI Core Status */}
          <div className="mt-auto pt-4 border-t border-white/[0.05]">
            <div className="flex items-center gap-2 px-2 py-2 rounded-xl bg-slate-200/30 dark:bg-white/[0.02] border border-slate-300/30 dark:border-white/[0.03]">
              <div className="relative flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] z-10" />
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ 
                      scale: [1, 2.5], 
                      opacity: [0.5, 0] 
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      delay: i * 0.6,
                      ease: "easeOut"
                    }}
                    className="absolute w-2 h-2 rounded-full bg-emerald-500"
                  />
                ))}
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                AI ENGINE: <span className="text-emerald-500">ONLINE</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Chat Workspace (9 Cols) */}
      <div className={cn("lg:col-span-9 flex flex-col overflow-hidden relative", glassStyles.container)}>
        
        {/* Workspace Header */}
        <div className="p-4 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.01]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center border border-white/[0.05]">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">
                {activeSessionId ? sessions.find(s => s.id === activeSessionId)?.title : 'New Academic Inquiry'}
              </h3>
              <div className="flex gap-2 mt-1">
                <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider">CONTEXT: ACTIVE</span>
                <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider">MODEL: OMNI-3.5</span>
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
              {/* Central Glowing EducAi emblem with theme-accent glows */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={cn("w-20 h-20 rounded-[28px] bg-gradient-to-br border flex items-center justify-center shadow-2xl relative", emblem.bg)}
              >
                <div className={cn("absolute inset-0 blur-2xl rounded-full", emblem.glow)} />
                <Sparkles className={cn("w-10 h-10 relative z-10", emblem.text)} />
              </motion.div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white tracking-tight">Your Personal AI Academic Core</h2>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">Ignite your research or master complex subjects through deep cognitive synthesis.</p>
              </div>

              {/* 2x2 Interactive Quick Prompt Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                {SUGGESTED_PROMPTS.map((prompt, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    onClick={() => handleSelectPrompt(prompt)}
                    className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] text-left transition-all group relative overflow-hidden cursor-pointer"
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
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id || index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className={cn(
                       "flex flex-col gap-2 max-w-[85%]",
                       msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                    )}
                  >
                    <div className={cn(
                      "p-4 rounded-2xl text-sm leading-relaxed relative overflow-hidden shadow-lg",
                      msg.role === 'user' 
                        ? "bg-[#16171B]/95 backdrop-blur-xl border border-white/[0.08] text-white rounded-tr-none" 
                        : "bg-white/[0.03] backdrop-blur-md border border-white/[0.05] text-slate-200 rounded-tl-none"
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
                                "flex items-center gap-1.5 transition-colors cursor-pointer",
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
                                "flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors disabled:opacity-50 cursor-pointer",
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
                        <p className="relative z-10 whitespace-pre-wrap">{msg.content}</p>
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
                        className="w-1.5 h-1.5 rounded-full"
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
                  className="p-2 rounded-lg hover:bg-white/[0.05] text-slate-500 transition-colors cursor-pointer"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleMicClick}
                  className={cn(
                    "p-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer",
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
                  "p-3 rounded-xl transition-all shadow-lg flex items-center justify-center disabled:opacity-50 disabled:scale-100 active:scale-90 cursor-pointer text-white",
                  inputValue.trim() || attachedFile ? getGradientClass(accentColor) : "bg-white/[0.05] text-slate-600"
                )}
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
