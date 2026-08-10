'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Sparkles, X, Plus, Save, Copy, Check, Trash2, 
  Search, Folder, HelpCircle, FileEdit, BookOpen, Clock, 
  CheckSquare, AlignLeft, Maximize2, Zap, ArrowRight, Loader2,
  ListCollapse
} from 'lucide-react';
import { useAccent } from '@/components/accent-provider';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import { glassStyles } from '@/lib/glass';

interface QuickNoteItem {
  id: string;
  title: string;
  content: string;
  folder: string;
  tags: string[];
  date: string;
}

const DEFAULT_FOLDERS = ['Biology', 'History', 'Mathematics', 'Computer Science', 'General'];

export function QuickNote() {
  const { meta, accentColor } = useAccent();
  const { darkMode } = useTheme();
  
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'create' | 'history'>('create');
  
  // Note Form State
  const [noteId, setNoteId] = React.useState<string | null>(null); // For editing existing
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [folder, setFolder] = React.useState('General');
  const [tags, setTags] = React.useState<string[]>([]);
  const [currentTag, setCurrentTag] = React.useState('');
  
  // AI Helper State
  const [aiAction, setAiAction] = React.useState<'summarize' | 'expand' | 'polish' | 'quiz' | 'mindmap' | null>(null);
  const [customPrompt, setCustomPrompt] = React.useState('');
  const [isAiLoading, setIsAiLoading] = React.useState(false);
  const [showAiConsole, setShowAiConsole] = React.useState(false);
  const [showCustomPrompt, setShowCustomPrompt] = React.useState(false);

  // Notes history
  const [savedNotes, setSavedNotes] = React.useState<QuickNoteItem[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('study_quick_notes');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setTimeout(() => {
            setSavedNotes(parsed);
          }, 0);
        } catch (e) {
          console.error('Failed to parse study_quick_notes from localStorage', e);
        }
      }
    }
  }, []);
  
  // Toast notifications
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const triggerToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleSaveNote = () => {
    if (!title.trim() && !content.trim()) {
      triggerToast('Cannot save an empty note', 'error');
      return;
    }

    const noteTitle = title.trim() || `Untitled Note (${new Date().toLocaleDateString()})`;
    const dateStr = new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    
    let updated: QuickNoteItem[];

    if (noteId) {
      // Editing existing note
      updated = savedNotes.map(n => n.id === noteId ? {
        ...n,
        title: noteTitle,
        content: content,
        folder: folder,
        tags: tags,
        date: dateStr
      } : n);
      triggerToast('Note updated successfully!');
    } else {
      // Creating new note
      const newNote: QuickNoteItem = {
        id: Math.random().toString(36).substr(2, 9),
        title: noteTitle,
        content: content,
        folder: folder,
        tags: tags,
        date: dateStr
      };
      updated = [newNote, ...savedNotes];
      setNoteId(newNote.id);
      triggerToast('Note saved successfully!');
    }

    setSavedNotes(updated);
    localStorage.setItem('study_quick_notes', JSON.stringify(updated));
  };

  const handleNewNote = () => {
    setNoteId(null);
    setTitle('');
    setContent('');
    setFolder('General');
    setTags([]);
    setCurrentTag('');
    setShowAiConsole(false);
    setShowCustomPrompt(false);
    setActiveTab('create');
  };

  const handleLoadNote = (note: QuickNoteItem) => {
    setNoteId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setFolder(note.folder);
    setTags(note.tags);
    setActiveTab('create');
    triggerToast('Loaded note details', 'info');
  };

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedNotes.filter(n => n.id !== id);
    setSavedNotes(updated);
    localStorage.setItem('study_quick_notes', JSON.stringify(updated));
    triggerToast('Note deleted');
    if (noteId === id) {
      handleNewNote();
    }
  };

  const handleCopyToClipboard = () => {
    if (!content.trim()) {
      triggerToast('No content to copy!', 'error');
      return;
    }
    const fullText = `Title: ${title || 'Untitled Note'}\nFolder: ${folder}\nTags: ${tags.join(', ') || 'None'}\n\n${content}`;
    navigator.clipboard.writeText(fullText);
    triggerToast('Copied note to clipboard!');
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const t = currentTag.trim().toLowerCase();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleAiAction = async (action: 'summarize' | 'expand' | 'polish' | 'quiz' | 'mindmap' | 'custom') => {
    if (!content.trim()) {
      triggerToast('Write some content first for AI to analyze!', 'error');
      return;
    }

    setIsAiLoading(true);
    setShowAiConsole(true);
    
    try {
      const response = await fetch('/api/notes/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          action,
          customPrompt: action === 'custom' ? customPrompt : undefined,
          subject: folder
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        triggerToast(data.error, 'error');
      } else if (data.text) {
        // We append or replace depending on what the user wants.
        // For expanding, summarizing, polishing, we let them see a choice or replace the text cleanly.
        setContent(data.text);
        triggerToast('AI assistance complete!');
        if (action === 'custom') {
          setCustomPrompt('');
          setShowCustomPrompt(false);
        }
      }
    } catch (err) {
      console.error(err);
      triggerToast('Failed to contact AI service.', 'error');
    } finally {
      setIsAiLoading(false);
    }
  };

  const filteredNotes = savedNotes.filter(note => {
    const q = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(q) ||
      note.content.toLowerCase().includes(q) ||
      note.folder.toLowerCase().includes(q) ||
      note.tags.some(t => t.toLowerCase().includes(q))
    );
  });

  // Calculate coordinates for neat responsive styles
  const activeColorTheme = meta?.dark?.text || 'text-amber-500';
  const activeBgTheme = meta?.dark?.button || 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20';
  const accentBorderTheme = accentColor === 'amber' ? 'focus:border-amber-500/50 focus:ring-amber-500/25' :
                              accentColor === 'blue' ? 'focus:border-blue-500/50 focus:ring-blue-500/25' :
                              accentColor === 'green' ? 'focus:border-emerald-500/50 focus:ring-emerald-500/25' :
                              'focus:border-rose-500/50 focus:ring-rose-500/25';

  return (
    <>
      {/* FLOATING QUICK NOTE ACTION BUTTON */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          id="quick-note-floating-trigger"
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl backdrop-blur-md relative overflow-hidden transition-all duration-300 group z-50",
            isOpen 
              ? "bg-slate-800 dark:bg-slate-900 border border-white/10 hover:bg-slate-700" 
              : activeBgTheme
          )}
          aria-label="Toggle Quick Note Dashboard"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                <FileText className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* DASHBOARD MODAL PANEL */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Dim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />

            {/* Quick Note Main Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30, x: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30, x: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className={cn(
                "fixed bottom-24 right-6 w-[92vw] sm:w-[540px] md:w-[680px] h-[calc(100vh-140px)] max-h-[640px] z-40 overflow-hidden flex flex-col border border-black/10 dark:border-white/10 shadow-2xl rounded-3xl",
                "bg-white/95 dark:bg-[#121316]/95 backdrop-blur-xl text-slate-800 dark:text-white"
              )}
            >
              {/* Header Tab Controls */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/10">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-xl bg-indigo-500/10 text-indigo-500", meta.dark.text)}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                      BrainBoost AI Snippet Workspace
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Jot ideas down instantly with real-time AI formatting</p>
                  </div>
                </div>

                {/* Main Tabs */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-0.5 rounded-lg text-xs font-semibold">
                  <button
                    onClick={() => setActiveTab('create')}
                    className={cn(
                      "px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5",
                      activeTab === 'create'
                        ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    )}
                  >
                    <FileEdit className="w-3.5 h-3.5" />
                    Editor
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className={cn(
                      "px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 relative",
                      activeTab === 'history'
                        ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    )}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Snippets ({savedNotes.length})
                  </button>
                </div>
              </div>

              {/* Central Panel Body */}
              <div className="flex-grow overflow-hidden relative flex flex-col">
                
                {/* 1. EDITOR TAB CONTENT */}
                {activeTab === 'create' && (
                  <div className="flex-grow flex flex-col md:flex-row overflow-hidden h-full">
                    
                    {/* Left/Main Form Area */}
                    <div className="flex-grow flex flex-col p-5 overflow-y-auto custom-scrollbar space-y-4">
                      
                      {/* Note Title and Folder */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Snippet Title</label>
                          <input 
                            type="text"
                            placeholder="e.g. Krebs Cycle Overview..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={cn(
                              "w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-xl px-3.5 py-2 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all",
                              accentBorderTheme
                            )}
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Subject</label>
                          <select
                            value={folder}
                            onChange={(e) => setFolder(e.target.value)}
                            className={cn(
                              "w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-xl px-2.5 py-2 text-sm text-slate-800 dark:text-slate-200 outline-none transition-all cursor-pointer",
                              accentBorderTheme
                            )}
                          >
                            {DEFAULT_FOLDERS.map(f => (
                              <option key={f} value={f}>{f}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="flex-grow flex flex-col min-h-[160px] relative">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Jot down thoughts & details</label>
                        <textarea
                          placeholder="Type quick definitions, rough bullet points, outline concepts, paste study snippets..."
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          className={cn(
                            "w-full flex-grow bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-2xl p-4 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all resize-none font-sans leading-relaxed custom-scrollbar",
                            accentBorderTheme,
                            isAiLoading && "animate-pulse border-amber-500/30"
                          )}
                        />
                        
                        {/* Word Count Indicator */}
                        <div className="absolute bottom-2.5 right-3 text-[10px] text-slate-400 bg-slate-200/50 dark:bg-black/40 px-2 py-0.5 rounded-full font-semibold">
                          {content.trim() === '' ? 0 : content.trim().split(/\s+/).length} words
                        </div>
                      </div>

                      {/* Tags Section */}
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Add Tags</label>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <AnimatePresence>
                            {tags.map(t => (
                              <motion.span 
                                key={t}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 px-2.5 py-0.5 rounded-full text-xs font-bold"
                              >
                                #{t}
                                <button onClick={() => handleRemoveTag(t)} className="hover:text-red-500 transition-colors">
                                  <X className="w-3 h-3" />
                                </button>
                              </motion.span>
                            ))}
                          </AnimatePresence>
                        </div>

                        <form onSubmit={handleAddTag} className="flex gap-2 max-w-xs">
                          <input 
                            type="text"
                            placeholder="Press enter to add..."
                            value={currentTag}
                            onChange={(e) => setCurrentTag(e.target.value)}
                            className={cn(
                              "flex-grow bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 outline-none transition-all",
                              accentBorderTheme
                            )}
                          />
                        </form>
                      </div>

                      {/* Save Controls Panel */}
                      <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5 gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleNewNote}
                            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-all flex items-center gap-1.5"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Clear Workspace
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleCopyToClipboard}
                            disabled={!content.trim()}
                            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 disabled:opacity-50 transition-all flex items-center justify-center"
                            title="Copy to clipboard"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={handleSaveNote}
                            className={cn(
                              "px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-2 transition-all hover:scale-[1.02]",
                              activeBgTheme
                            )}
                          >
                            <Save className="w-4 h-4" />
                            {noteId ? 'Update Snippet' : 'Save Snippet'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* AI Assistance Toolbar Panel */}
                    <div className="w-full md:w-[220px] bg-slate-50/50 dark:bg-black/15 p-4 border-t md:border-t-0 md:border-l border-slate-100 dark:border-white/5 flex flex-col justify-between overflow-y-auto custom-scrollbar space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                          AI Quick Actions
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                          <button
                            onClick={() => handleAiAction('polish')}
                            disabled={isAiLoading || !content.trim()}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/[0.04] hover:bg-indigo-500/5 hover:border-indigo-500/20 hover:text-indigo-500 dark:hover:text-indigo-400 text-slate-700 dark:text-slate-300 text-left transition-colors disabled:opacity-50"
                          >
                            <Zap className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                            <span>Magic Polish</span>
                          </button>
                          
                          <button
                            onClick={() => handleAiAction('summarize')}
                            disabled={isAiLoading || !content.trim()}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/[0.04] hover:bg-emerald-500/5 hover:border-emerald-500/20 hover:text-emerald-500 dark:hover:text-emerald-400 text-slate-700 dark:text-slate-300 text-left transition-colors disabled:opacity-50"
                          >
                            <AlignLeft className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                            <span>Summarize note</span>
                          </button>
                          
                          <button
                            onClick={() => handleAiAction('expand')}
                            disabled={isAiLoading || !content.trim()}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/[0.04] hover:bg-amber-500/5 hover:border-amber-500/20 hover:text-amber-500 dark:hover:text-amber-400 text-slate-700 dark:text-slate-300 text-left transition-colors disabled:opacity-50"
                          >
                            <Maximize2 className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                            <span>Flesh Out Note</span>
                          </button>
                          
                          <button
                            onClick={() => handleAiAction('quiz')}
                            disabled={isAiLoading || !content.trim()}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/[0.04] hover:bg-rose-500/5 hover:border-rose-500/20 hover:text-rose-500 dark:hover:text-rose-400 text-slate-700 dark:text-slate-300 text-left transition-colors disabled:opacity-50"
                          >
                            <HelpCircle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                            <span>Active Recall Quiz</span>
                          </button>

                          <button
                            onClick={() => handleAiAction('mindmap')}
                            disabled={isAiLoading || !content.trim()}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/[0.04] hover:bg-blue-500/5 hover:border-blue-500/20 hover:text-blue-500 dark:hover:text-blue-400 text-slate-700 dark:text-slate-300 text-left transition-colors disabled:opacity-50"
                          >
                            <ListCollapse className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                            <span>Mindmap Outline</span>
                          </button>
                        </div>
                      </div>

                      {/* Custom Prompt Toggle */}
                      <div className="space-y-2 border-t border-slate-100 dark:border-white/5 pt-3">
                        {!showCustomPrompt ? (
                          <button
                            onClick={() => setShowCustomPrompt(true)}
                            className="w-full text-center text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors uppercase tracking-wider"
                          >
                            + Custom AI Instruction
                          </button>
                        ) : (
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-indigo-500 uppercase tracking-wider block">Custom Prompt</label>
                            <textarea
                              placeholder="e.g., Translate to French, explain like I'm 5..."
                              value={customPrompt}
                              onChange={(e) => setCustomPrompt(e.target.value)}
                              rows={2}
                              className="w-full text-[11px] bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-xl px-2.5 py-1.5 text-slate-700 dark:text-slate-300 placeholder-slate-400 outline-none focus:border-indigo-500/50 resize-none"
                            />
                            <div className="flex gap-1.5 justify-end">
                              <button
                                onClick={() => setShowCustomPrompt(false)}
                                className="px-2 py-1 rounded bg-slate-200/50 dark:bg-white/5 text-[9px] font-bold text-slate-500"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleAiAction('custom')}
                                disabled={isAiLoading || !customPrompt.trim() || !content.trim()}
                                className="px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-[9px] font-bold text-white flex items-center gap-1 disabled:opacity-50"
                              >
                                Run <ArrowRight className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* AI Loading State */}
                      {showAiConsole && (
                        <div className="p-3 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 space-y-2 mt-auto">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-wider flex items-center gap-1">
                              {isAiLoading ? (
                                <><Loader2 className="w-3 h-3 animate-spin" /> AI Synthesizing...</>
                              ) : (
                                <><Check className="w-3 h-3 text-emerald-500" /> Complete</>
                              )}
                            </span>
                            <button onClick={() => setShowAiConsole(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-[10px] text-slate-500 leading-normal">
                            {isAiLoading 
                              ? "Refining formatting and optimizing your notes structure using Gemini 3.6-Flash..."
                              : "AI finished polishing your study notes successfully. See editor panel."}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. HISTORY / RECENT SNIPPETS TAB */}
                {activeTab === 'history' && (
                  <div className="flex-grow flex flex-col p-6 overflow-hidden h-full">
                    {/* Search bar */}
                    <div className="relative mb-5">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text"
                        placeholder="Search through saved notes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 outline-none focus:border-indigo-500/50"
                      />
                    </div>

                    {/* Notes grid */}
                    <div className="flex-grow overflow-y-auto custom-scrollbar pr-1">
                      {filteredNotes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-slate-400" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm">No Saved Notes Found</h4>
                            <p className="text-xs text-slate-500 max-w-xs mt-1">Jot down something in the editor tab to save your first rapid-capture snippet.</p>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {filteredNotes.map(note => (
                            <div
                              key={note.id}
                              onClick={() => handleLoadNote(note)}
                              className="group p-4 bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04] hover:border-indigo-500/20 dark:hover:border-indigo-500/20 rounded-2xl cursor-pointer transition-all hover:translate-y-[-2px] flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                                    {note.folder}
                                  </span>
                                  
                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigator.clipboard.writeText(note.content);
                                        triggerToast('Copied content!');
                                      }}
                                      className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                                      title="Copy content"
                                    >
                                      <Copy className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                      onClick={(e) => handleDeleteNote(note.id, e)}
                                      className="p-1 rounded-lg hover:bg-red-500/15 text-slate-400 hover:text-red-500"
                                      title="Delete Note"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                                  {note.title}
                                </h4>
                                
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-3 leading-relaxed">
                                  {note.content}
                                </p>
                              </div>

                              <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-2.5 mt-3 text-[10px] text-slate-400">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{note.date}</span>
                                </div>
                                <span className="text-indigo-500 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                                  Open <ArrowRight className="w-2.5 h-2.5" />
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Toast Messages Layer */}
              <AnimatePresence>
                {toast && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 dark:bg-white/95 text-white dark:text-slate-900 px-4 py-2 rounded-xl shadow-lg text-xs font-bold flex items-center gap-2 border border-white/10 dark:border-black/5"
                  >
                    {toast.type === 'success' && <Check className="w-4 h-4 text-emerald-500" />}
                    {toast.type === 'error' && <X className="w-4 h-4 text-red-500" />}
                    {toast.type === 'info' && <FileText className="w-4 h-4 text-blue-500" />}
                    {toast.message}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
