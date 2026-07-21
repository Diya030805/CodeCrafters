'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  RotateCw, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Trash2, 
  Layers, 
  CheckCircle, 
  AlertCircle,
  GraduationCap,
  Sparkles,
  Search,
  Check,
  Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { glassStyles } from '@/lib/glass';
import { useAccent } from '@/components/accent-provider';
import { useTheme } from '@/components/theme-provider';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  status: 'new' | 'review' | 'known';
}

const DEFAULT_FLASHCARDS: Flashcard[] = [
  {
    id: '1',
    question: "What is the time complexity of searching in a balanced Binary Search Tree (BST)?",
    answer: "O(log n) in both average and worst cases, because the height is maintained proportionally to log n.",
    category: "CS",
    status: 'new',
  },
  {
    id: '2',
    question: "What does the Heisenberg Uncertainty Principle state mathematically?",
    answer: "It states that the product of the uncertainties in position (Δx) and momentum (Δp) is bounded below by ℏ/2 (Δx * Δp ≥ ℏ/2).",
    category: "Physics",
    status: 'new',
  },
  {
    id: '3',
    question: "How do React Server Components (RSC) differ from standard Client Components?",
    answer: "React Server Components run exclusively on the server, have direct database access, send zero client-side JS bundle weight, and cannot use client-only hooks like useState or useEffect.",
    category: "Frontend",
    status: 'new',
  },
  {
    id: '4',
    question: "What is the primary difference between Clustered and Non-Clustered database indexes?",
    answer: "A clustered index defines the physical storage order of the data rows on disk (one per table), whereas a non-clustered index is a separate structural pointer table pointing to actual row locations.",
    category: "Database",
    status: 'new',
  },
  {
    id: '5',
    question: "What is quantum superposition?",
    answer: "Superposition is a principle of quantum mechanics where a system (like a qubit) can exist in a linear combination of multiple states simultaneously until a measurement collapses it into a single state.",
    category: "Physics",
    status: 'new',
  }
];

export function FlashcardStudy() {
  const { meta } = useAccent();
  const { darkMode } = useTheme();

  // Cards State
  const [cards, setCards] = React.useState<Flashcard[]>(DEFAULT_FLASHCARDS);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState<string>('All');

  // Mini Creation Form State
  const [isAdding, setIsAdding] = React.useState(false);
  const [newQuestion, setNewQuestion] = React.useState('');
  const [newAnswer, setNewAnswer] = React.useState('');
  const [newCategory, setNewCategory] = React.useState('CS');

  // Filter cards based on active category
  const filteredCards = React.useMemo(() => {
    if (activeCategory === 'All') return cards;
    return cards.filter(c => c.category.toLowerCase() === activeCategory.toLowerCase());
  }, [cards, activeCategory]);

  // Adjust active index when filters change
  const handleSelectCategory = (cat: string) => {
    setActiveCategory(cat);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // Categories extracted dynamically from card set
  const categories = React.useMemo(() => {
    const list = new Set(cards.map(c => c.category));
    return ['All', ...Array.from(list)];
  }, [cards]);

  // Status Counts
  const stats = React.useMemo(() => {
    const total = filteredCards.length;
    const known = filteredCards.filter(c => c.status === 'known').length;
    const review = filteredCards.filter(c => c.status === 'review').length;
    const remaining = total - known - review;
    const completionPercent = total > 0 ? Math.round((known / total) * 100) : 0;
    return { total, known, review, remaining, completionPercent };
  }, [filteredCards]);

  const handleNext = () => {
    if (filteredCards.length === 0) return;
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % filteredCards.length);
    }, 150);
  };

  const handlePrev = () => {
    if (filteredCards.length === 0) return;
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(prev => (prev - 1 + filteredCards.length) % filteredCards.length);
    }, 150);
  };

  const markStatus = (status: 'known' | 'review') => {
    if (filteredCards.length === 0) return;
    const activeCard = filteredCards[currentIndex];
    
    // Update matching card in main state
    setCards(prev => prev.map(c => {
      if (c.id === activeCard.id) {
        return { ...c, status };
      }
      return c;
    }));

    // Auto progress to next card after a small delay
    setTimeout(() => {
      handleNext();
    }, 200);
  };

  const handleResetProgress = () => {
    setCards(prev => prev.map(c => ({ ...c, status: 'new' })));
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    const newCard: Flashcard = {
      id: Date.now().toString(),
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
      category: newCategory.trim() || 'General',
      status: 'new'
    };

    setCards(prev => [newCard, ...prev]);
    setNewQuestion('');
    setNewAnswer('');
    setIsAdding(false);
    // Switch to category if not showing all or matching category
    if (activeCategory !== 'All' && activeCategory.toLowerCase() !== newCard.category.toLowerCase()) {
      setActiveCategory('All');
    }
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleDeleteCard = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCards(prev => prev.filter(c => c.id !== id));
    if (currentIndex >= Math.max(1, filteredCards.length - 1)) {
      setCurrentIndex(0);
    }
    setIsFlipped(false);
  };

  const currentCard = filteredCards[currentIndex];

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-amber-500" style={{ color: meta.hex }} />
          Flashcards Sandbox
        </h3>
        <p className="text-xs text-slate-400">
          Reinforce your knowledge with smooth 3D tactile flashcards. Tap any card to flip it and log your retention.
        </p>
      </div>

      {/* Categories Toolbar & Create CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleSelectCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 relative cursor-pointer",
                activeCategory === cat
                  ? "text-white font-extrabold shadow-md"
                  : "text-slate-400 bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] hover:text-slate-200"
              )}
              style={activeCategory === cat ? { backgroundColor: meta.hex } : {}}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Mini Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleResetProgress}
            className="px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 border border-white/[0.05] hover:bg-white/[0.03] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            title="Reset study progress"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Progress
          </button>
          <button
            onClick={() => setIsAdding(true)}
            className="px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white border border-white/[0.06] bg-amber-500/10 hover:bg-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            style={{ color: meta.hex, borderColor: `${meta.hex}25` }}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Flashcard
          </button>
        </div>
      </div>

      {/* Progress & Quick Stats Card */}
      <div className={cn("p-5 rounded-3xl grid grid-cols-2 md:grid-cols-4 gap-4 items-center", glassStyles.card)}>
        {/* Stat 1 */}
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Mastered</p>
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold text-emerald-400">{stats.known}</span>
            <span className="text-xs text-slate-500">/ {stats.total} cards</span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="space-y-1 border-l border-white/[0.05] pl-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Needs Review</p>
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold text-rose-400">{stats.review}</span>
            <span className="text-xs text-slate-500">flagged</span>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="space-y-1 border-l border-white/[0.05] pl-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Unstudied</p>
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold text-slate-300">{stats.remaining}</span>
            <span className="text-xs text-slate-500">remaining</span>
          </div>
        </div>

        {/* Stat 4: Circular or Simple Progress Gauge */}
        <div className="space-y-1 border-l border-white/[0.05] pl-4 col-span-2 md:col-span-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Retention Ratio</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-white/[0.03] h-2 rounded-full overflow-hidden border border-white/[0.04]">
              <motion.div 
                className="h-full rounded-full"
                style={{ backgroundColor: meta.hex }}
                initial={{ width: 0 }}
                animate={{ width: `${stats.completionPercent}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <span className="text-sm font-black text-white">{stats.completionPercent}%</span>
          </div>
        </div>
      </div>

      {/* Main Flashcard Sandbox */}
      <div className="relative flex flex-col items-center">
        {filteredCards.length > 0 ? (
          <div className="w-full max-w-xl space-y-6">
            
            {/* 3D Card Area */}
            <div 
              onClick={() => setIsFlipped(!isFlipped)}
              className="relative w-full h-[320px] cursor-pointer group"
              style={{ perspective: "1500px" }}
            >
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                whileHover={{ y: -6, scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                transition={{ 
                  rotateY: { type: "spring", stiffness: 140, damping: 20 },
                  y: { type: "spring", stiffness: 300, damping: 25 },
                  scale: { type: "spring", stiffness: 300, damping: 25 }
                }}
                className="w-full h-full relative"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* FRONT CARD (Question) */}
                <div 
                  className={cn(
                    "absolute inset-0 w-full h-full rounded-[32px] p-8 flex flex-col justify-between border shadow-2xl transition-all duration-300",
                    darkMode 
                      ? "bg-slate-900/95 border-white/[0.08]" 
                      : "bg-white border-black/[0.06]"
                  )}
                  style={{ 
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden" 
                  }}
                >
                  {/* Card Header decoration */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-amber-500" style={{ color: meta.hex }} />
                      <span className="text-[10px] font-black tracking-widest uppercase text-slate-500">Study Question</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/[0.05] text-amber-500 uppercase flex items-center gap-1" style={{ color: meta.hex }}>
                        <Tag className="w-3 h-3" />
                        {currentCard.category}
                      </span>
                      {currentCard.status !== 'new' && (
                        <span className={cn(
                          "text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider",
                          currentCard.status === 'known' ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                        )}>
                          {currentCard.status}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Question Text */}
                  <div className="flex flex-col items-center justify-center text-center flex-1 px-4">
                    <p className="text-lg md:text-xl font-bold text-slate-800 dark:text-white leading-relaxed">
                      {currentCard.question}
                    </p>
                  </div>

                  {/* Card Footer decoration */}
                  <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
                    <span className="text-[10px] font-bold">Card {currentIndex + 1} of {filteredCards.length}</span>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-500/80 group-hover:text-amber-500 transition-colors" style={{ color: meta.hex }}>
                      <RotateCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
                      <span>Click to flip card</span>
                    </div>
                  </div>
                </div>

                {/* BACK CARD (Answer) */}
                <div 
                  className={cn(
                    "absolute inset-0 w-full h-full rounded-[32px] p-8 flex flex-col justify-between border shadow-2xl transition-all duration-300",
                    darkMode 
                      ? "bg-zinc-950/95 border-white/[0.08]" 
                      : "bg-slate-50 border-black/[0.08]"
                  )}
                  style={{ 
                    backfaceVisibility: "hidden", 
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)" 
                  }}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      <span className="text-[10px] font-black tracking-widest uppercase text-emerald-500">Answer Explanation</span>
                    </div>
                    <button
                      onClick={(e) => handleDeleteCard(currentCard.id, e)}
                      className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 transition-colors cursor-pointer"
                      title="Delete card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Explanation Text */}
                  <div className="flex flex-col items-center justify-center text-center flex-1 px-4 overflow-y-auto no-scrollbar py-4">
                    <p className="text-sm md:text-base font-medium text-slate-700 dark:text-slate-300 leading-relaxed max-h-[160px]">
                      {currentCard.answer}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
                    <span className="text-[10px] font-bold">Press feedback action below</span>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500/85">
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Tap to flip back</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Response Loggers & Nav Buttons */}
            <div className="flex flex-col gap-4">
              {/* Review / Known Buttons (Active when flipped or visible for study convenience) */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => markStatus('review')}
                  className="h-12 rounded-2xl flex items-center justify-center gap-2 font-black uppercase text-xs tracking-widest text-rose-400 border border-rose-500/10 hover:border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 active:scale-98 transition-all cursor-pointer"
                >
                  <AlertCircle className="w-4 h-4" />
                  Need Review
                </button>
                <button
                  onClick={() => markStatus('known')}
                  className="h-12 rounded-2xl flex items-center justify-center gap-2 font-black uppercase text-xs tracking-widest text-emerald-400 border border-emerald-500/10 hover:border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 active:scale-98 transition-all cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark Known
                </button>
              </div>

              {/* Slider Nav Controls */}
              <div className="flex items-center justify-between px-2 pt-2">
                <button
                  onClick={handlePrev}
                  className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] text-slate-400 hover:text-white transition-all cursor-pointer"
                  title="Previous Card"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white/[0.02] border border-white/[0.05] px-4 py-1.5 rounded-full">
                  Index: {currentIndex + 1} / {filteredCards.length}
                </div>

                <button
                  onClick={handleNext}
                  className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] text-slate-400 hover:text-white transition-all cursor-pointer"
                  title="Next Card"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

          </div>
        ) : (
          <div className={cn("w-full max-w-xl p-12 text-center rounded-3xl border border-dashed flex flex-col items-center justify-center gap-4", glassStyles.card)}>
            <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-slate-500">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">No flashcards found</h3>
              <p className="text-xs text-slate-400 mt-1">Change your category filter or create a custom card to get started studying.</p>
            </div>
            <button
              onClick={() => setIsAdding(true)}
              className="mt-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all cursor-pointer"
              style={{ backgroundColor: meta.hex }}
            >
              Add first card
            </button>
          </div>
        )}
      </div>

      {/* Add Custom Flashcard Dialog */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={cn("w-full max-w-lg p-8 relative", glassStyles.container)}
            >
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-500 animate-pulse" style={{ color: meta.hex }} />
                  <h2 className="text-lg font-black text-white tracking-tight">Create Study Flashcard</h2>
                </div>
                <button 
                  onClick={() => setIsAdding(false)}
                  className="p-1.5 rounded-lg hover:bg-white/[0.05] text-slate-400 hover:text-white transition-colors cursor-pointer text-xs uppercase font-black tracking-widest"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleAddCard} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Question / Prompt</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Enter the front side study question..."
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    className={cn("w-full px-4 py-3 text-xs font-bold outline-none resize-none", glassStyles.input)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Answer / Explanation</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Enter the back side hidden explanation..."
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    className={cn("w-full px-4 py-3 text-xs font-bold outline-none resize-none", glassStyles.input)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Category Tag</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CS, Physics, Math"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className={cn("w-full px-4 h-11 text-xs font-bold outline-none", glassStyles.input)}
                    />
                  </div>
                  <div className="flex items-end">
                    <button 
                      type="submit"
                      className="w-full h-11 rounded-xl text-white font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 cursor-pointer"
                      style={{ backgroundColor: meta.hex }}
                    >
                      <Plus className="w-4 h-4" />
                      Add to Deck
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
