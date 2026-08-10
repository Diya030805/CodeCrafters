'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Search, 
  Plus, 
  Trash2, 
  Sparkles, 
  Bot, 
  User, 
  ArrowUp,
  Copy,
  Check,
  RefreshCcw,
  Square,
  Code,
  Zap,
  Clock,
  ChevronRight,
  MessageSquare,
  Cpu,
  Trash
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { glassStyles } from '@/lib/glass';
import { useAccent } from '@/components/accent-provider';
import { Tooltip } from '@/components/ui/tooltip';

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
  {
    title: "Explain Monads in C++",
    prompt: "Explain Monads in C++ with practical code examples and a comparison table.",
    tag: "Programming"
  },
  {
    title: "SQL vs NoSQL Comparison",
    prompt: "Compare SQL vs NoSQL databases in a detailed table with pros, cons, and use cases.",
    tag: "Databases"
  },
  {
    title: "Test German A2 Vocab",
    prompt: "Test my German A2 Vocab & Grammar with key phrases, rules, and example sentences.",
    tag: "Language"
  },
  {
    title: "Derive Quadratic Formula",
    prompt: "Derive and explain the Quadratic Formula step-by-step with clear mathematical reasoning.",
    tag: "Mathematics"
  }
];

const INITIAL_SESSIONS: ChatSession[] = [
  { id: '1', title: 'C++ Monads & Optional', lastMessage: 'Monadic chaining in C++23...', timestamp: '10m ago' },
  { id: '2', title: 'SQL vs NoSQL Architecture', lastMessage: 'Relational ACID vs NoSQL Eventual...', timestamp: '2h ago' },
  { id: '3', title: 'German Perfekt Conjugation', lastMessage: 'Difference between haben and sein...', timestamp: '1d ago' },
];

const MOCK_SESSION_MESSAGES: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1_1',
      role: 'user',
      content: 'Explain Monads in C++ with practical code examples and a comparison table.',
      timestamp: '10:14 AM'
    },
    {
      id: 'm1_2',
      role: 'ai',
      content: `A **Monad** in C++ is a computational design pattern that structures logic flow by wrapping values inside a protective context, allowing you to chain operations safely without nested error checks.

### 1. Key Concepts
* **Type Wrapper**: A container type like \`std::optional<T>\` (C++17/23) or \`std::expected<T, E>\` (C++23).
* **Monadic Pipeline**: In C++23, standard containers include monadic member functions: \`.and_then()\`, \`.transform()\`, and \`.or_else()\`.

### 2. Practical C++23 Code Example

\`\`\`cpp
#include <iostream>
#include <optional>
#include <string>

// Monadic step 1: Retrieve user ID safely
std::optional<int> find_user_id(const std::string& username) {
    if (username == "diya") return 42;
    return std::nullopt;
}

// Monadic step 2: Fetch user profile score
std::optional<double> get_user_score(int id) {
    if (id == 42) return 98.5;
    return std::nullopt;
}

int main() {
    std::string user = "diya";

    // Monadic pipeline: Linear chaining with .and_then()
    auto final_score = find_user_id(user)
                        .and_then(get_user_score);

    if (final_score) {
        std::cout << "User Score: " << *final_score << std::endl;
    } else {
        std::cout << "User not found!" << std::endl;
    }
}
\`\`\`

### 3. Comparison Table

| Paradigm | Traditional C++ | Monadic C++23 |
| :--- | :--- | :--- |
| **Error Handling** | Deeply nested \`if (ptr != nullptr)\` checks | Declarative \`.and_then()\` chaining |
| **Code Readability** | High cyclomatic complexity | Clean left-to-right processing stream |
| **Safety** | Risk of null pointer dereferences | Guaranteed compile-time optional unwrapping |`,
      timestamp: '10:15 AM'
    }
  ],
  '2': [
    {
      id: 'm2_1',
      role: 'user',
      content: 'Compare SQL vs NoSQL databases in a detailed table with pros, cons, and use cases.',
      timestamp: '8:30 AM'
    },
    {
      id: 'm2_2',
      role: 'ai',
      content: `Here is a comprehensive architectural breakdown comparing **SQL (Relational)** and **NoSQL (Non-Relational)** databases.

### Key Architectural Differences

| Feature | SQL (Relational) | NoSQL (Non-Relational) |
| :--- | :--- | :--- |
| **Data Model** | Tables with predefined schema (rows & columns) | Key-Value, Document (JSON), Graph, Wide-Column |
| **Scaling** | Vertical (Scale Up with bigger servers) | Horizontal (Scale Out across distributed nodes) |
| **ACID Compliance** | Strict ACID guarantees out of the box | BASE model (Eventually Consistent, highly scalable) |
| **Query Language** | Structured Query Language (SQL) | Unstructured or object-specific APIs |
| **Best For** | Banking, ERP, Complex relational queries | Real-time big data, streaming, flexible catalogs |

### Example SQL Query vs MongoDB NoSQL Query

\`\`\`sql
-- SQL: Retrieve active students with GPA > 3.8
SELECT id, full_name, gpa 
FROM students 
WHERE status = 'active' AND gpa > 3.8 
ORDER BY gpa DESC;
\`\`\`

\`\`\`javascript
// NoSQL (MongoDB): Equivalent Document Query
db.students.find({
  status: "active",
  gpa: { $gt: 3.8 }
}).sort({ gpa: -1 });
\`\`\``,
      timestamp: '8:31 AM'
    }
  ],
  '3': [
    {
      id: 'm3_1',
      role: 'user',
      content: 'Test my German A2 Vocab & Grammar with key phrases, rules, and example sentences.',
      timestamp: 'Yesterday'
    },
    {
      id: 'm3_2',
      role: 'ai',
      content: `Guten Tag! Let's master **German A2 Present Perfect Tense (Perfekt)**!

### 1. The Golden Rule of German Perfekt
In spoken German, past events are built using an auxiliary verb (**haben** or **sein**) plus the **Partizip II** (past participle) placed at the end of the clause.

* **HABEN** is used for ~90% of verbs (transitive verbs, static activities).
* **SEIN** is used for verbs indicating **movement/direction** (e.g. *fahren, gehen*) or a **change of state** (e.g. *einschlafen, sterben*).

### 2. Practice Sentences

* *"Ich habe gestern Deutsch gelernt."* (I learned German yesterday.)
* *"Wir sind nach Berlin gefahren."* (We drove/went to Berlin.)

### Quick Quiz
How would you translate: **"She fell asleep at 10 PM"**?
*(Hint: 'einschlafen' uses 'sein' because falling asleep is a change of state!)*`,
      timestamp: 'Yesterday'
    }
  ]
};

// Syntax tokenizing helper
function renderHighlightedTokens(line: string) {
  if (!line) return ' ';
  
  if (line.trim().startsWith('//') || line.trim().startsWith('#') || line.trim().startsWith('--')) {
    return <span className="text-slate-500 italic dark:text-zinc-500">{line}</span>;
  }

  const tokens = line.split(/(\s+|[(),;{}[\]<>.:=+\-*\/])/);

  const keywords = new Set([
    'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
    'class', 'import', 'from', 'export', 'default', 'async', 'await', 'try', 'catch',
    'def', 'struct', 'public', 'private', 'protected', 'virtual', 'override',
    'template', 'typename', 'auto', 'std::', 'namespace', 'include', 'using',
    'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'ON', 'GROUP', 'BY',
    'ORDER', 'HAVING', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'TABLE', 'INT', 'VARCHAR'
  ]);

  return tokens.map((token, i) => {
    if (!token) return null;
    if (keywords.has(token) || keywords.has(token.toUpperCase())) {
      return <span key={i} className="text-purple-500 dark:text-pink-400 font-bold">{token}</span>;
    }
    if ((token.startsWith('"') && token.endsWith('"')) || (token.startsWith("'") && token.endsWith("'")) || (token.startsWith('`') && token.endsWith('`'))) {
      return <span key={i} className="text-emerald-600 dark:text-teal-300">{token}</span>;
    }
    if (/^\d+(\.\d+)?$/.test(token)) {
      return <span key={i} className="text-amber-600 dark:text-orange-300">{token}</span>;
    }
    if (/^[a-zA-Z_]\w*$/.test(token) && i < tokens.length - 1 && tokens[i + 1] === '(') {
      return <span key={i} className="text-blue-600 dark:text-cyan-300">{token}</span>;
    }
    return <span key={i}>{token}</span>;
  });
}

function CodeBlock({ className, children }: any) {
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const codeString = String(children).replace(/\n$/, '');
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!match) {
    return (
      <code className="bg-slate-200 dark:bg-zinc-800 text-amber-600 dark:text-amber-300 font-mono text-[12px] px-1.5 py-0.5 rounded border border-amber-500/20 font-semibold">
        {children}
      </code>
    );
  }

  const lines = codeString.split('\n');

  return (
    <div className="my-4 rounded-2xl overflow-hidden border border-slate-300 dark:border-zinc-800 bg-slate-900 shadow-xl text-slate-100 font-mono text-xs sm:text-sm">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 text-slate-400 select-none">
        <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
          <Code className="w-3.5 h-3.5" />
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300 hover:text-white transition-colors cursor-pointer px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/60"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto leading-relaxed custom-scrollbar bg-[#0B0C0E]">
        <div className="table w-full">
          {lines.map((line, idx) => (
            <div key={idx} className="table-row">
              <span className="table-cell pr-4 text-right select-none text-slate-600 dark:text-zinc-600 text-[11px] w-8">
                {idx + 1}
              </span>
              <span className="table-cell whitespace-pre">
                {renderHighlightedTokens(line)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function generateId(): string {
  if (typeof window !== 'undefined' && window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }
  return 'msg_' + Math.random().toString(36).substring(2, 9);
}

function getTimeString(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function AITutorView() {
  const { accentColor, meta } = useAccent();
  const [sessions, setSessions] = React.useState<ChatSession[]>(INITIAL_SESSIONS);
  const [activeSessionId, setActiveSessionId] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputValue, setInputValue] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [copiedMsgId, setCopiedMsgId] = React.useState<string | null>(null);

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  // Auto scroll to bottom
  const scrollToBottom = React.useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating, scrollToBottom]);

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

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend || inputValue).trim();
    if (!prompt || isGenerating) return;

    const newUserMessage: Message = {
      id: generateId(),
      role: 'user',
      content: prompt,
      timestamp: getTimeString()
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsGenerating(true);

    // Create abort controller for stop generating requirement
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          prompt
        }),
        signal: controller.signal
      });

      const data = await res.json();
      let responseText = data.text;

      // Fallback response generator if API key is not present or error occurred
      if (!responseText) {
        responseText = generateFallbackResponse(prompt);
      }

      const newAiMessage: Message = {
        id: generateId(),
        role: 'ai',
        content: responseText,
        timestamp: getTimeString()
      };

      setMessages(prev => [...prev, newAiMessage]);

      // Update session title & snippet if new session
      if (!activeSessionId) {
        const newSessionId = generateId();
        const newSession: ChatSession = {
          id: newSessionId,
          title: prompt.slice(0, 32) + (prompt.length > 32 ? '...' : ''),
          lastMessage: responseText.slice(0, 40) + '...',
          timestamp: 'Just now'
        };
        setSessions(prev => [newSession, ...prev]);
        setActiveSessionId(newSessionId);
      } else {
        setSessions(prev => prev.map(s => 
          s.id === activeSessionId 
            ? { ...s, lastMessage: responseText.slice(0, 40) + '...', timestamp: 'Just now' }
            : s
        ));
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        const stoppedMsg: Message = {
          id: generateId(),
          role: 'ai',
          content: '*Generation stopped by user.*',
          timestamp: getTimeString()
        };
        setMessages(prev => [...prev, stoppedMsg]);
      } else {
        const fallbackMsg: Message = {
          id: generateId(),
          role: 'ai',
          content: generateFallbackResponse(prompt),
          timestamp: getTimeString()
        };
        setMessages(prev => [...prev, fallbackMsg]);
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleRegenerate = (msgId: string) => {
    // Find last user prompt
    const userMsgIdx = messages.findIndex(m => m.id === msgId);
    let lastPrompt = '';
    if (userMsgIdx > 0 && messages[userMsgIdx - 1]?.role === 'user') {
      lastPrompt = messages[userMsgIdx - 1].content;
    } else {
      const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
      if (lastUserMsg) lastPrompt = lastUserMsg.content;
    }

    if (lastPrompt) {
      // Remove the AI message and re-trigger
      setMessages(prev => prev.filter(m => m.id !== msgId));
      handleSendMessage(lastPrompt);
    }
  };

  const handleCopyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const startNewChat = () => {
    if (isGenerating) handleStopGenerating();
    setActiveSessionId(null);
    setMessages([]);
  };

  const handleSelectSession = (id: string) => {
    if (isGenerating) handleStopGenerating();
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

  const filteredSessions = sessions.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-170px)] min-h-[620px]">
      
      {/* LEFT PANEL: Chat History Sidebar (3 Cols) */}
      <div className={cn("lg:col-span-3 flex flex-col gap-4 overflow-hidden h-full", glassStyles.container)}>
        <div className="p-3.5 space-y-3.5 flex flex-col h-full">
          
          {/* New Chat Button */}
          <button 
            onClick={startNewChat}
            className={cn(
              "w-full py-3.5 rounded-2xl text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg border border-white/20 cursor-pointer",
              getGradientClass(accentColor)
            )}
          >
            <Plus className="w-4 h-4 font-black" />
            New Chat
          </button>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
            <input 
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full pl-9 pr-3 py-2 text-xs outline-none transition-all duration-300 rounded-xl",
                glassStyles.input
              )}
            />
          </div>

          {/* Conversations History List */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
            <div className="px-1 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              Recent Learning Sessions
            </div>

            <AnimatePresence mode="popLayout">
              {filteredSessions.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400 dark:text-zinc-500 italic">
                  No chat history found
                </div>
              ) : (
                filteredSessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    layout
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ delay: index * 0.04 }}
                    onClick={() => handleSelectSession(session.id)}
                    className={cn(
                      "group relative p-3 rounded-2xl cursor-pointer transition-all border",
                      activeSessionId === session.id 
                        ? "bg-slate-200/80 dark:bg-white/[0.08] border-slate-300 dark:border-white/10 shadow-sm" 
                        : "border-transparent hover:bg-slate-200/40 dark:hover:bg-white/[0.04]"
                    )}
                  >
                    <div className="flex items-start gap-2.5 pr-6">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400 mt-0.5 shrink-0" />
                      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-white truncate">{session.title}</h4>
                        <p className="text-[10px] text-slate-500 dark:text-zinc-400 truncate">{session.lastMessage}</p>
                      </div>
                    </div>
                    <span className="absolute right-3 top-3 text-[9px] font-semibold text-slate-400 dark:text-zinc-500">
                      {session.timestamp}
                    </span>
                    <Tooltip content="Delete Chat Session" side="left">
                      <button 
                        onClick={(e) => deleteSession(e, session.id)}
                        className="absolute right-2.5 bottom-2.5 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-500 cursor-pointer"
                        aria-label="Delete chat session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </Tooltip>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Model Status Badge Footer */}
          <div className="mt-auto pt-3 border-t border-slate-200 dark:border-white/[0.06]">
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl bg-slate-200/60 dark:bg-white/[0.02] border border-slate-300/60 dark:border-white/[0.04]">
              <div className="relative flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] z-10" />
                <div className="absolute w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping opacity-75" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-extrabold text-slate-800 dark:text-white truncate">
                  Gemini 3.6 Flash
                </span>
                <span className="text-[9px] font-semibold text-slate-500 dark:text-zinc-400 flex items-center gap-1">
                  <Cpu className="w-2.5 h-2.5 text-emerald-500" />
                  Active • Server API
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* CENTER & RIGHT PANEL: Main Conversation Workspace (9 Cols) */}
      <div className={cn("lg:col-span-9 flex flex-col overflow-hidden relative h-full", glassStyles.container)}>
        
        {/* Top Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-white/[0.06] flex items-center justify-between bg-slate-100/60 dark:bg-zinc-950/40 backdrop-blur-md">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 text-amber-500" />
            </div>
            <div className="flex flex-col min-w-0">
              <h3 className="text-sm font-black text-slate-900 dark:text-white truncate">
                {activeSessionId ? sessions.find(s => s.id === activeSessionId)?.title : 'New AI Learning Workspace'}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Model Ready
                </span>
                <span className="text-[9px] font-bold text-slate-500 dark:text-zinc-400 hidden sm:inline-block">
                  Markdown & Code Highlighting Enabled
                </span>
              </div>
            </div>
          </div>

          <Tooltip content="Clear Current Conversation" side="left">
            <button 
              onClick={() => setMessages([])}
              className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-white/[0.08] text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              aria-label="Clear Conversation"
            >
              <Trash className="w-4 h-4" />
              <span className="hidden sm:inline">Clear Chat</span>
            </button>
          </Tooltip>
        </div>

        {/* Conversation Stream Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar bg-slate-50/50 dark:bg-black/20">
          {messages.length === 0 ? (
            /* EMPTY STATE: Welcome Section */
            <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-8 px-2">
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-amber-600/30 border border-amber-500/40 flex items-center justify-center shadow-2xl relative mb-6"
              >
                <div className="absolute inset-0 blur-2xl rounded-full bg-amber-500/20 pointer-events-none" />
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500 relative z-10" />
              </motion.div>

              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2"
              >
                How can I help you learn today?
              </motion.h2>

              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 font-medium max-w-md mb-8 leading-relaxed"
              >
                Ask any complex concept, request code explanations with syntax highlighting, or generate comparison tables.
              </motion.p>

              {/* 4 Premium Suggested Prompt Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
                {SUGGESTED_PROMPTS.map((item, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    whileHover={{ y: -3, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSendMessage(item.prompt)}
                    className="p-4 rounded-2xl border border-slate-300/80 dark:border-white/10 bg-slate-100/80 dark:bg-white/[0.02] hover:bg-slate-200/60 dark:hover:bg-white/[0.06] text-left transition-all group relative overflow-hidden cursor-pointer shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                        {item.tag}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-2 mt-1 leading-snug">
                      {item.prompt}
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            /* MESSAGES LIST */
            <div className="space-y-6 pb-2">
              <AnimatePresence mode="popLayout">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className={cn(
                      "flex gap-3 max-w-[92%] sm:max-w-[85%]",
                      msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto flex-row"
                    )}
                  >
                    {/* Role Avatar */}
                    <div className={cn(
                      "w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 border mt-1 shadow-sm font-bold text-xs",
                      msg.role === 'user' 
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-700 dark:border-white/20" 
                        : "bg-amber-500/20 text-amber-500 border-amber-500/30"
                    )}>
                      {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    {/* Message Card Bubble */}
                    <div className={cn(
                      "flex flex-col gap-1.5 min-w-0 flex-1",
                      msg.role === 'user' ? "items-end" : "items-start"
                    )}>
                      <div className={cn(
                        "p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm w-full",
                        msg.role === 'user'
                          ? "bg-slate-900 text-white dark:bg-zinc-800/90 dark:text-white rounded-tr-none border border-slate-800 dark:border-zinc-700/80"
                          : "bg-white text-slate-800 dark:bg-zinc-900/90 dark:text-zinc-200 rounded-tl-none border border-slate-200 dark:border-white/10"
                      )}>
                        {msg.role === 'ai' ? (
                          <div className="markdown-body prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-zinc-200">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                code: CodeBlock,
                                table: ({ children }: any) => (
                                  <div className="my-4 overflow-x-auto rounded-2xl border border-slate-300 dark:border-zinc-800 shadow-md">
                                    <table className="w-full text-left text-xs sm:text-sm border-collapse">{children}</table>
                                  </div>
                                ),
                                thead: ({ children }: any) => (
                                  <thead className="bg-slate-200/90 dark:bg-zinc-800/90 border-b border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white font-black uppercase text-[10px] tracking-wider">
                                    {children}
                                  </thead>
                                ),
                                tbody: ({ children }: any) => (
                                  <tbody className="divide-y divide-slate-200 dark:divide-zinc-800/60 bg-slate-50 dark:bg-zinc-950/50">
                                    {children}
                                  </tbody>
                                ),
                                tr: ({ children }: any) => (
                                  <tr className="hover:bg-slate-200/60 dark:hover:bg-white/[0.03] transition-colors">{children}</tr>
                                ),
                                th: ({ children }: any) => (
                                  <th className="px-4 py-3 font-bold">{children}</th>
                                ),
                                td: ({ children }: any) => (
                                  <td className="px-4 py-3 leading-relaxed">{children}</td>
                                ),
                                ul: ({ children }: any) => (
                                  <ul className="my-2.5 space-y-1 list-disc list-inside pl-1 text-slate-700 dark:text-zinc-300">{children}</ul>
                                ),
                                ol: ({ children }: any) => (
                                  <ol className="my-2.5 space-y-1 list-decimal list-inside pl-1 text-slate-700 dark:text-zinc-300">{children}</ol>
                                ),
                                li: ({ children }: any) => (
                                  <li className="leading-relaxed">{children}</li>
                                ),
                                h1: ({ children }: any) => (
                                  <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-4 mb-2">{children}</h1>
                                ),
                                h2: ({ children }: any) => (
                                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-3 mb-1.5 border-b border-slate-200 dark:border-zinc-800 pb-1">{children}</h2>
                                ),
                                h3: ({ children }: any) => (
                                  <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 mt-2 mb-1">{children}</h3>
                                )
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>

                            {/* Action Buttons Row for Every AI Message */}
                            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {/* Copy Button */}
                                <button
                                  onClick={() => handleCopyMessage(msg.id, msg.content)}
                                  className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10"
                                >
                                  {copiedMsgId === msg.id ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                                      <span className="text-emerald-500">Copied</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" />
                                      <span>Copy</span>
                                    </>
                                  )}
                                </button>

                                {/* Regenerate Button */}
                                <button
                                  onClick={() => handleRegenerate(msg.id)}
                                  disabled={isGenerating}
                                  className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-50"
                                >
                                  <RefreshCcw className="w-3.5 h-3.5" />
                                  <span>Regenerate</span>
                                </button>
                              </div>

                              <span className="text-[10px] font-medium text-slate-400 dark:text-zinc-500">
                                {msg.timestamp}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="whitespace-pre-wrap">{msg.content}</div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Animation while AI is generating */}
              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 mr-auto"
                >
                  <div className="w-8 h-8 rounded-2xl bg-amber-500/20 text-amber-500 border border-amber-500/30 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 flex items-center gap-2 shadow-sm">
                    <div className="flex gap-1.5 items-center">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{
                            y: [0, -5, 0],
                            opacity: [0.4, 1, 0.4]
                          }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: i * 0.18,
                            ease: "easeInOut"
                          }}
                          className="w-2 h-2 rounded-full bg-amber-500"
                        />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 ml-1">
                      AI Tutor is generating...
                    </span>
                  </div>
                </motion.div>
              )}

              <div ref={scrollRef} />
            </div>
          )}
        </div>

        {/* BOTTOM FIXED MESSAGE INPUT BAR */}
        <div className="p-4 bg-slate-100/80 dark:bg-zinc-950/60 border-t border-slate-200 dark:border-white/[0.06] backdrop-blur-md">
          <div className="max-w-4xl mx-auto space-y-2">
            
            <div className="flex items-end gap-3 p-2.5 rounded-2xl bg-white dark:bg-[#121318] border border-slate-300 dark:border-white/10 focus-within:border-amber-500/50 transition-all shadow-xl">
              
              <textarea 
                ref={textareaRef}
                rows={1}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask your AI Tutor anything..."
                className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 resize-none py-2 px-2 max-h-36 font-sans"
              />

              {/* Stop Generating Button or Send Button */}
              {isGenerating ? (
                <Tooltip content="Stop AI Generation" side="top">
                  <button
                    onClick={handleStopGenerating}
                    className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                    aria-label="Stop generating"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Stop</span>
                  </button>
                </Tooltip>
              ) : (
                <Tooltip content="Send Message (Enter)" side="top">
                  <button 
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim()}
                    className={cn(
                      "p-3 rounded-xl transition-all shadow-lg flex items-center justify-center disabled:opacity-40 disabled:scale-100 active:scale-90 cursor-pointer text-white",
                      inputValue.trim() ? getGradientClass(accentColor) : "bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-zinc-500"
                    )}
                    aria-label="Send message"
                  >
                    <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </Tooltip>
              )}
            </div>

            <div className="flex items-center justify-between px-1 text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
              <span>Press <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-mono">Enter</kbd> to send, <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-mono">Shift + Enter</kbd> for new line</span>
              <span className="hidden sm:inline">BrainBoost AI Workspace</span>
            </div>

          </div>
        </div>

      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(150, 150, 150, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(150, 150, 150, 0.4);
        }
      `}</style>
    </div>
  );
}

function generateFallbackResponse(prompt: string): string {
  const p = prompt.toLowerCase();

  if (p.includes('monad')) {
    return `A **Monad** in C++ is a functional design pattern that structures computations by wrapping values in a safe container (like \`std::optional\` or \`std::expected\`), enabling chained operations without explicit null/error branching.

### C++23 Example
\`\`\`cpp
#include <iostream>
#include <optional>

std::optional<int> double_even(int x) {
    if (x % 2 == 0) return x * 2;
    return std::nullopt;
}

int main() {
    std::optional<int> val = 4;
    auto result = val.and_then(double_even); // Returns 8
    
    if (result) std::cout << "Result: " << *result << std::endl;
}
\`\`\`

### Monadic Chaining Benefits
* Eliminates deeply nested \`if (ptr != nullptr)\` checks.
* Makes error propagation declarative and predictable.`;
  }

  if (p.includes('sql') || p.includes('nosql')) {
    return `### SQL vs NoSQL Comparison

| Feature | SQL Databases | NoSQL Databases |
| :--- | :--- | :--- |
| **Schema** | Rigid, predefined schema | Flexible, dynamic JSON/Document/Key-Value |
| **Transactions** | Strict ACID guarantees | BASE model (Eventual consistency) |
| **Scaling** | Vertical scaling | Horizontal distributed scaling |
| **Examples** | PostgreSQL, MySQL, SQLite | MongoDB, Cassandra, Redis |`;
  }

  if (p.includes('german')) {
    return `Guten Tag! Let's practice **German A2 Present Perfect Tense (Perfekt)**!

* **Auxiliary Verb**: Use **haben** for standard transitive verbs, or **sein** for motion/change of state (*gehen, fahren, einschlafen*).
* **Partizip II**: Placed at the very end of the sentence.

Example: *"Ich habe Deutsch gelernt."* (I learned German.)`;
  }

  if (p.includes('quadratic')) {
    return `### Derivation of the Quadratic Formula

Starting with the general quadratic equation:
$$ax^2 + bx + c = 0$$

1. **Divide by $a$**:
   $$x^2 + \\frac{b}{a}x + \\frac{c}{a} = 0$$

2. **Complete the Square**:
   $$\\left(x + \\frac{b}{2a}\\right)^2 = \\frac{b^2 - 4ac}{4a^2}$$

3. **Take Square Root**:
   $$x + \\frac{b}{2a} = \\pm \\frac{\\sqrt{b^2 - 4ac}}{2a}$$

4. **Final Formula**:
   $$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$`;
  }

  return `Here is a structured academic response regarding **"${prompt}"**:

### Core Concept Breakdown
1. **Primary Principle**: Understanding this topic requires isolating core variables and establishing clear foundational definitions.
2. **Key Execution Step**: Analyze the underlying logic flow, construct verifiable test conditions, and verify step-by-step outcomes.
3. **Synthesis**: Apply this rule systematically across related problem domains for maximum mastery.`;
}
