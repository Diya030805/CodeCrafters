'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layers,
  RotateCcw,
  Shuffle,
  Star,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Plus,
  Search,
  FileText,
  MessageSquare,
  Play,
  Pause,
  Clock,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Trash2,
  Filter,
  Check,
  Zap,
  BookOpen,
  BrainCircuit,
  RefreshCw,
  SlidersHorizontal,
  X,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  Bookmark,
  Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { glassStyles } from '@/lib/glass';
import { useAccent } from '@/components/accent-provider';
import { useTheme } from '@/components/theme-provider';
import { Tooltip } from '@/components/ui/tooltip';

// ----------------------------------------------------------------------
// TYPES & INTERFACES
// ----------------------------------------------------------------------

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';
export type CardStatus = 'unstudied' | 'known' | 'review';

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  explanation: string;
  subject: string;
  topic: string;
  difficulty: DifficultyLevel;
  status: CardStatus;
  isFavorite: boolean;
  tags: string[];
  createdFrom?: 'default' | 'pdf' | 'tutor' | 'ai' | 'manual';
}

// ----------------------------------------------------------------------
// INITIAL MOCK FLASHCARDS DATASET
// ----------------------------------------------------------------------

const INITIAL_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-1',
    question: 'What is the physical significance of a Hermitian operator in Quantum Mechanics?',
    answer: 'Hermitian operators represent physical observables (like momentum, position, energy) because their eigenvalues are always real numbers.',
    explanation: 'In quantum mechanics, every physical measurement corresponds to a Hermitian operator. Since physical quantities must be real-valued measurements, operator Hermiticity (A = A†) guarantees real eigenvalues and orthogonal eigenvectors.',
    subject: 'Quantum Physics',
    topic: 'Quantum Operators',
    difficulty: 'Hard',
    status: 'unstudied',
    isFavorite: true,
    tags: ['Operators', 'Observable', 'Linear Algebra'],
    createdFrom: 'pdf'
  },
  {
    id: 'fc-2',
    question: 'What is the time complexity of searching in a balanced Binary Search Tree (AVL / Red-Black Tree)?',
    answer: 'O(log n) in both average and worst cases.',
    explanation: 'Because self-balancing trees maintain their height h proportional to log₂(n) through rotations, search, insertion, and deletion operations are strictly bounded by O(log n).',
    subject: 'Computer Science',
    topic: 'Data Structures',
    difficulty: 'Easy',
    status: 'unstudied',
    isFavorite: false,
    tags: ['Trees', 'Algorithms', 'Big-O'],
    createdFrom: 'default'
  },
  {
    id: 'fc-3',
    question: 'How do React Server Components (RSC) differ fundamentally from Client Components?',
    answer: 'RSCs render exclusively on the server, output zero client JavaScript bundle, and can directly access databases and secrets.',
    explanation: 'Client Components run on both server (during SSR) and client, maintaining stateful interactivity. Server Components never execute on the client browser, drastically reducing bundle size and network roundtrips.',
    subject: 'Web Engineering',
    topic: 'React & Next.js',
    difficulty: 'Medium',
    status: 'unstudied',
    isFavorite: true,
    tags: ['React', 'Next.js', 'SSR'],
    createdFrom: 'tutor'
  },
  {
    id: 'fc-4',
    question: 'What is the difference between Clustered and Non-Clustered database indexes in PostgreSQL / MySQL?',
    answer: 'A clustered index determines the physical disk storage order of table rows (1 per table), while a non-clustered index is a separate structure with pointers.',
    explanation: 'Because physical data rows on disk can only be sorted in one single order, a table can have only one clustered index. Non-clustered B-Tree indexes store indexed column values alongside primary key or row IDs.',
    subject: 'Database Systems',
    topic: 'Storage & Indexing',
    difficulty: 'Medium',
    status: 'unstudied',
    isFavorite: false,
    tags: ['B-Tree', 'PostgreSQL', 'Performance'],
    createdFrom: 'default'
  },
  {
    id: 'fc-5',
    question: 'What is the Heisenberg Uncertainty Principle in mathematical terms?',
    answer: 'Δx · Δp ≥ ℏ/2 (The product of uncertainty in position and momentum is bounded below by ℏ/2).',
    explanation: 'This principle arises from the non-commutative property of position and momentum operators ([x, p] = iℏ). It proves that precise simultaneous measurement of conjugate variables is physically impossible.',
    subject: 'Quantum Physics',
    topic: 'Wave Mechanics',
    difficulty: 'Hard',
    status: 'unstudied',
    isFavorite: true,
    tags: ['Uncertainty', 'Commutator', 'Physics'],
    createdFrom: 'pdf'
  },
  {
    id: 'fc-6',
    question: 'What is dynamic programming and when should it be applied over greedy algorithms?',
    answer: 'Dynamic Programming breaks problems into overlapping subproblems with optimal substructure, storing answers (memoization / tabulation).',
    explanation: 'Use DP when choices made now impact future subproblems and local greedy choices do not guarantee a global optimum (e.g. 0/1 Knapsack, Shortest Path with arbitrary constraints).',
    subject: 'Computer Science',
    topic: 'Algorithms',
    difficulty: 'Medium',
    status: 'unstudied',
    isFavorite: false,
    tags: ['Memoization', 'Optimization', 'DP'],
    createdFrom: 'tutor'
  },
  {
    id: 'fc-7',
    question: 'What is SN2 nucleophilic substitution in Organic Chemistry and what is its stereochemical outcome?',
    answer: 'Bimolecular nucleophilic substitution proceeding via a 1-step concerted mechanism with complete inversion of configuration (Walden inversion).',
    explanation: 'The nucleophile attacks from the backside opposite the leaving group, causing a transition state with 5 partial bonds, resulting in stereospecific optical inversion (R to S or S to R).',
    subject: 'Organic Chemistry',
    topic: 'Reaction Mechanisms',
    difficulty: 'Hard',
    status: 'unstudied',
    isFavorite: false,
    tags: ['Mechanisms', 'Stereochemistry', 'SN2'],
    createdFrom: 'default'
  },
  {
    id: 'fc-8',
    question: 'What is BCNF (Boyce-Codd Normal Form) in database relational design?',
    answer: 'A table is in BCNF if for every non-trivial functional dependency X → Y, X is a superkey.',
    explanation: 'BCNF is a stricter 3.5 Normal Form that eliminates all redundancy from functional dependencies. It ensures every determinant is a candidate key, preventing update and insertion anomalies.',
    subject: 'Database Systems',
    topic: 'Relational Design',
    difficulty: 'Medium',
    status: 'unstudied',
    isFavorite: false,
    tags: ['Normalization', 'BCNF', 'Schema'],
    createdFrom: 'default'
  },
  {
    id: 'fc-9',
    question: 'What is the purpose of React `useCallback` hook vs `useMemo` hook?',
    answer: '`useCallback` memoizes a callback function reference, while `useMemo` memoizes the calculated result value of a computation.',
    explanation: 'Use `useCallback(fn, deps)` to prevent unnecessary child re-renders when passing functions to memoized components. Use `useMemo(() => compute(), deps)` for expensive mathematical operations.',
    subject: 'Web Engineering',
    topic: 'React Hooks',
    difficulty: 'Easy',
    status: 'unstudied',
    isFavorite: false,
    tags: ['Performance', 'Hooks', 'Optimization'],
    createdFrom: 'default'
  },
  {
    id: 'fc-10',
    question: 'What is Quantum Superposition and how is it represented using Dirac bra-ket notation?',
    answer: 'A qubit state |Ψ⟩ = α|0⟩ + β|1⟩ where |α|² + |β|² = 1.',
    explanation: 'Superposition allows quantum systems to exist in a linear combination of basis states simultaneously until measurement collapses the wave function into one definite eigenvalue state.',
    subject: 'Quantum Physics',
    topic: 'Quantum Mechanics',
    difficulty: 'Medium',
    status: 'unstudied',
    isFavorite: true,
    tags: ['Qubit', 'Bra-Ket', 'Superposition'],
    createdFrom: 'pdf'
  }
];

// Mock PDFs for AI Generation modal
const MOCK_PDF_SOURCES = [
  { id: 'pdf-1', title: 'Quantum_Mechanics_Ch4_Operators.pdf', pages: 28, subject: 'Quantum Physics' },
  { id: 'pdf-2', title: 'Data_Structures_Algorithms_Masterclass.pdf', pages: 45, subject: 'Computer Science' },
  { id: 'pdf-3', title: 'Database_Systems_Normalization_Indexing.pdf', pages: 32, subject: 'Database Systems' },
  { id: 'pdf-4', title: 'React_Server_Components_Deep_Dive.pdf', pages: 19, subject: 'Web Engineering' }
];

// Mock AI Tutor Chat Sessions for AI Generation modal
const MOCK_TUTOR_SESSIONS = [
  { id: 'tut-1', title: 'Hermitian Operators & Wave Functions Session', date: 'Yesterday', topic: 'Quantum Physics' },
  { id: 'tut-2', title: 'Dynamic Programming & Graph Traversal Breakdown', date: '3 days ago', topic: 'Algorithms' },
  { id: 'tut-3', title: 'Database Normalization 3NF vs BCNF Discussion', date: '1 week ago', topic: 'Database Systems' }
];

export function FlashcardsView() {
  const { meta } = useAccent();
  const { darkMode } = useTheme();

  // Primary Flashcard State
  const [cards, setCards] = React.useState<Flashcard[]>(INITIAL_FLASHCARDS);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [showExplanationHint, setShowExplanationHint] = React.useState(false);

  // View Mode: 'study' (3D card flip viewer) or 'topics' (topic deck overview)
  const [viewMode, setViewMode] = React.useState<'study' | 'topics'>('study');

  // Search & Filters
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedSubject, setSelectedSubject] = React.useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<string>('All');
  const [selectedStatus, setSelectedStatus] = React.useState<string>('All');
  const [favoritesOnly, setFavoritesOnly] = React.useState(false);

  // Study Timer
  const [timerSeconds, setTimerSeconds] = React.useState(0);
  const [isTimerRunning, setIsTimerRunning] = React.useState(true);

  // Modals & AI Actions State
  const [activeModal, setActiveModal] = React.useState<'create' | 'pdf_gen' | 'tutor_gen' | null>(null);
  const [isAiGenerating, setIsAiGenerating] = React.useState(false);
  const [aiGenProgress, setAiGenProgress] = React.useState(0);
  const [aiGenStatusText, setAiGenStatusText] = React.useState('');

  // New Flashcard Form
  const [newQuestion, setNewQuestion] = React.useState('');
  const [newAnswer, setNewAnswer] = React.useState('');
  const [newExplanation, setNewExplanation] = React.useState('');
  const [newSubject, setNewSubject] = React.useState('Computer Science');
  const [newTopic, setNewTopic] = React.useState('General');
  const [newDifficulty, setNewDifficulty] = React.useState<DifficultyLevel>('Medium');

  // AI Modal Options
  const [selectedPdfId, setSelectedPdfId] = React.useState(MOCK_PDF_SOURCES[0].id);
  const [selectedTutorId, setSelectedTutorId] = React.useState(MOCK_TUTOR_SESSIONS[0].id);
  const [targetCardCount, setTargetCardCount] = React.useState(5);

  // ----------------------------------------------------------------------
  // STUDY TIMER EFFECT
  // ----------------------------------------------------------------------
  React.useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ----------------------------------------------------------------------
  // FILTERING LOGIC
  // ----------------------------------------------------------------------
  const subjects = React.useMemo(() => {
    const set = new Set(cards.map((c) => c.subject));
    return ['All', ...Array.from(set)];
  }, [cards]);

  const filteredCards = React.useMemo(() => {
    return cards.filter((card) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQ = card.question.toLowerCase().includes(q);
        const matchesA = card.answer.toLowerCase().includes(q);
        const matchesTopic = card.topic.toLowerCase().includes(q);
        const matchesSubj = card.subject.toLowerCase().includes(q);
        if (!matchesQ && !matchesA && !matchesTopic && !matchesSubj) return false;
      }
      // Subject
      if (selectedSubject !== 'All' && card.subject !== selectedSubject) return false;
      // Difficulty
      if (selectedDifficulty !== 'All' && card.difficulty !== selectedDifficulty) return false;
      // Status
      if (selectedStatus !== 'All') {
        if (selectedStatus === 'Known' && card.status !== 'known') return false;
        if (selectedStatus === 'Needs Review' && card.status !== 'review') return false;
        if (selectedStatus === 'Unstudied' && card.status !== 'unstudied') return false;
      }
      // Favorites
      if (favoritesOnly && !card.isFavorite) return false;

      return true;
    });
  }, [cards, searchQuery, selectedSubject, selectedDifficulty, selectedStatus, favoritesOnly]);

  // Safe active card index
  const activeIndex = currentIndex >= filteredCards.length ? 0 : currentIndex;
  const currentCard = filteredCards[activeIndex];

  // ----------------------------------------------------------------------
  // PROGRESS & STATS
  // ----------------------------------------------------------------------
  const stats = React.useMemo(() => {
    const total = cards.length;
    const known = cards.filter((c) => c.status === 'known').length;
    const review = cards.filter((c) => c.status === 'review').length;
    const studied = known + review;
    const remaining = total - studied;
    const completionPercent = total > 0 ? Math.round((studied / total) * 100) : 0;
    const favoriteCount = cards.filter((c) => c.isFavorite).length;

    return { total, known, review, studied, remaining, completionPercent, favoriteCount };
  }, [cards]);

  // ----------------------------------------------------------------------
  // HANDLERS
  // ----------------------------------------------------------------------
  const handleNextCard = React.useCallback(() => {
    if (filteredCards.length <= 1) return;
    setIsFlipped(false);
    setShowExplanationHint(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
    }, 120);
  }, [filteredCards.length]);

  const handlePrevCard = React.useCallback(() => {
    if (filteredCards.length <= 1) return;
    setIsFlipped(false);
    setShowExplanationHint(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
    }, 120);
  }, [filteredCards.length]);

  const handleFlipCard = React.useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleShuffle = () => {
    setIsFlipped(false);
    setShowExplanationHint(false);
    setCards((prev) => [...prev].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
  };

  const handleRestartSession = () => {
    setIsFlipped(false);
    setShowExplanationHint(false);
    setCurrentIndex(0);
    setTimerSeconds(0);
  };

  const handleMarkStatus = (status: CardStatus) => {
    if (!currentCard) return;
    setCards((prev) =>
      prev.map((c) => (c.id === currentCard.id ? { ...c, status } : c))
    );
    // Auto advance to next card
    setTimeout(() => {
      handleNextCard();
    }, 200);
  };

  const handleToggleFavorite = (cardId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isFavorite: !c.isFavorite } : c))
    );
  };

  const handleDeleteCard = (cardId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCards((prev) => prev.filter((c) => c.id !== cardId));
    setIsFlipped(false);
    setShowExplanationHint(false);
    if (currentIndex >= filteredCards.length - 1) {
      setCurrentIndex(0);
    }
  };

  const handleCreateManualCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    const newCard: Flashcard = {
      id: `fc-user-${Date.now()}`,
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
      explanation: newExplanation.trim() || newAnswer.trim(),
      subject: newSubject,
      topic: newTopic.trim() || 'General',
      difficulty: newDifficulty,
      status: 'unstudied',
      isFavorite: false,
      tags: [newSubject, newTopic.trim() || 'General'],
      createdFrom: 'manual'
    };

    setCards((prev) => [newCard, ...prev]);
    setNewQuestion('');
    setNewAnswer('');
    setNewExplanation('');
    setActiveModal(null);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // AI Flashcard Generation simulation
  const runAiGeneration = (sourceName: string, count: number, createdFrom: 'pdf' | 'tutor' | 'ai') => {
    setIsAiGenerating(true);
    setAiGenProgress(10);
    setAiGenStatusText(`Analyzing ${sourceName}...`);

    setTimeout(() => {
      setAiGenProgress(40);
      setAiGenStatusText('Extracting key definitions & mathematical concepts...');
    }, 800);

    setTimeout(() => {
      setAiGenProgress(75);
      setAiGenStatusText('Formulating spaced-repetition QA cards with explanation hints...');
    }, 1600);

    setTimeout(() => {
      setAiGenProgress(100);
      setAiGenStatusText('Flashcards successfully synthesized!');

      const generatedCards: Flashcard[] = Array.from({ length: count }).map((_, i) => ({
        id: `fc-ai-${Date.now()}-${i}`,
        question: `[AI Generated #${i + 1}] Key concept extracted from ${sourceName}: What is the core theorem or operational principle?`,
        answer: `Core principle ${i + 1}: The system establishes optimal boundary conditions ensuring energy conservation and zero information leak.`,
        explanation: `Generated from AI Analysis of ${sourceName}. This card emphasizes critical exam-tested definitions and derivations.`,
        subject: selectedSubject !== 'All' ? selectedSubject : 'Quantum Physics',
        topic: 'AI Generated Deck',
        difficulty: (['Easy', 'Medium', 'Hard'][i % 3]) as DifficultyLevel,
        status: 'unstudied',
        isFavorite: false,
        tags: ['AI Generated', sourceName],
        createdFrom
      }));

      setCards((prev) => [...generatedCards, ...prev]);
      setIsAiGenerating(false);
      setActiveModal(null);
      setCurrentIndex(0);
      setIsFlipped(false);
    }, 2400);
  };

  // Generate 3 More AI Cards for Current Active Subject
  const handleGenerateMoreAiCards = () => {
    runAiGeneration('Active Curriculum', 3, 'ai');
  };

  // Regenerate Current Card Answer using AI
  const handleRegenerateCurrentCard = () => {
    if (!currentCard) return;
    setIsAiGenerating(true);
    setAiGenProgress(50);
    setAiGenStatusText(`Regenerating explanation for "${currentCard.topic}"...`);

    setTimeout(() => {
      setCards((prev) =>
        prev.map((c) =>
          c.id === currentCard.id
            ? {
                ...c,
                answer: `[AI Refined] ${c.answer} (Clarified with simplified intuitive mental model).`,
                explanation: `[AI Simplified Explanation] ${c.explanation}`
              }
            : c
        )
      );
      setIsAiGenerating(false);
      setAiGenProgress(100);
    }, 1200);
  };

  // Group Flashcards by Topic for Topic View
  const topicGroups = React.useMemo(() => {
    const groups: Record<string, Flashcard[]> = {};
    filteredCards.forEach((card) => {
      const key = `${card.subject} • ${card.topic}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(card);
    });
    return groups;
  }, [filteredCards]);

  // Keyboard navigation shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'ArrowRight') {
        handleNextCard();
      } else if (e.key === 'ArrowLeft') {
        handlePrevCard();
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        handleFlipCard();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextCard, handlePrevCard, handleFlipCard]);

  // Reset Filters helper
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSubject('All');
    setSelectedDifficulty('All');
    setSelectedStatus('All');
    setFavoritesOnly(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
              <Layers className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              Flashcards Workspace
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                AI Powered
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Master complex concepts using 3D tactile flashcards with spaced repetition and AI card generation.
          </p>
        </div>

        {/* AI Action Header Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveModal('pdf_gen')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-200 hover:border-amber-500/40 hover:text-amber-600 dark:hover:text-amber-400 transition-all flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-amber-500" />
            <span>From PDF</span>
          </button>

          <button
            onClick={() => setActiveModal('tutor_gen')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-200 hover:border-amber-500/40 hover:text-amber-600 dark:hover:text-amber-400 transition-all flex items-center gap-2 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
            <span>From AI Tutor</span>
          </button>

          <button
            onClick={handleGenerateMoreAiCards}
            disabled={isAiGenerating}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            <span>Generate More</span>
          </button>

          <button
            onClick={() => setActiveModal('create')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Card</span>
          </button>
        </div>
      </div>

      {/* STATS & STUDY TIMER DASHBOARD ROW */}
      <div className={cn("p-4 sm:p-5 rounded-3xl grid grid-cols-2 lg:grid-cols-5 gap-4 items-center shadow-sm", glassStyles.card)}>
        {/* Total Cards */}
        <div className="space-y-1">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500">Total Cards</p>
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{stats.total}</span>
            <span className="text-xs font-semibold text-slate-400">in deck</span>
          </div>
        </div>

        {/* Studied */}
        <div className="space-y-1 border-l border-slate-200 dark:border-white/10 pl-4">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Cards Studied</p>
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-black text-emerald-500">{stats.studied}</span>
            <span className="text-xs font-semibold text-slate-400">({stats.known} known)</span>
          </div>
        </div>

        {/* Remaining */}
        <div className="space-y-1 border-l border-slate-200 dark:border-white/10 pl-4">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500">Remaining</p>
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-black text-slate-700 dark:text-zinc-200">{stats.remaining}</span>
            <span className="text-xs font-semibold text-amber-500">({stats.review} review)</span>
          </div>
        </div>

        {/* Progress Gauge */}
        <div className="space-y-1.5 border-l border-slate-200 dark:border-white/10 pl-4 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-widest">
            <span className="text-slate-400 dark:text-zinc-500">Mastery Rate</span>
            <span className="text-amber-500">{stats.completionPercent}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-white/10 h-2 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${stats.completionPercent}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>

        {/* Study Timer Box */}
        <div className="space-y-1 border-l border-slate-200 dark:border-white/10 pl-4 col-span-2 lg:col-span-1 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500 flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-500" /> Study Timer
            </p>
            <span className="text-lg font-mono font-black text-slate-900 dark:text-white">
              {formatTimer(timerSeconds)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Tooltip content={isTimerRunning ? 'Pause Study Timer' : 'Start Study Timer'} side="top">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="p-2 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-amber-500 hover:text-white text-slate-700 dark:text-zinc-300 transition-all cursor-pointer"
                aria-label={isTimerRunning ? 'Pause Timer' : 'Start Timer'}
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
            </Tooltip>

            <Tooltip content="Reset Study Timer" side="top">
              <button
                onClick={() => setTimerSeconds(0)}
                className="p-2 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-zinc-300 transition-all cursor-pointer"
                aria-label="Reset Timer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTER TOOLBAR */}
      <div className={cn("p-4 rounded-2xl border border-slate-300 dark:border-white/10 bg-slate-100/80 dark:bg-zinc-950/60 space-y-3 shadow-sm", glassStyles.card)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="relative lg:col-span-4">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions, terms, formulas, topics..."
              className="w-full pl-10 pr-8 py-2 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-white/[0.04] text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40"
            />
            {searchQuery && (
              <Tooltip content="Clear Search Query" side="left">
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                  aria-label="Clear Search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </Tooltip>
            )}
          </div>

          {/* Subject Filter */}
          <div className="lg:col-span-3">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-zinc-900 text-xs font-semibold text-slate-800 dark:text-zinc-200 focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Subjects ({cards.length})</option>
              {subjects.filter(s => s !== 'All').map(subj => (
                <option key={subj} value={subj}>
                  {subj} ({cards.filter(c => c.subject === subj).length})
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="lg:col-span-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-zinc-900 text-xs font-semibold text-slate-800 dark:text-zinc-200 focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Favorites Only Toggle */}
          <div className="lg:col-span-3 flex items-center justify-end gap-2">
            <button
              onClick={() => setFavoritesOnly(!favoritesOnly)}
              className={cn(
                "px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border",
                favoritesOnly
                  ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                  : "bg-white dark:bg-white/[0.04] border-slate-300 dark:border-white/10 text-slate-600 dark:text-zinc-300 hover:border-amber-500/40"
              )}
            >
              <Star className={cn("w-3.5 h-3.5", favoritesOnly ? "fill-white" : "text-amber-500")} />
              <span>Favorites ({stats.favoriteCount})</span>
            </button>

            {/* View Mode Toggle: Study vs Topics */}
            <div className="flex items-center p-1 rounded-xl bg-slate-200 dark:bg-white/10 border border-slate-300/50 dark:border-white/10">
              <button
                onClick={() => setViewMode('study')}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer",
                  viewMode === 'study'
                    ? "bg-amber-500 text-white shadow-sm"
                    : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                Study
              </button>
              <button
                onClick={() => setViewMode('topics')}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer",
                  viewMode === 'topics'
                    ? "bg-amber-500 text-white shadow-sm"
                    : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                Topics
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI GENERATION RUNNING OVERLAY */}
      <AnimatePresence>
        {isAiGenerating && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 space-y-2"
          >
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin text-amber-500" />
                {aiGenStatusText}
              </span>
              <span>{aiGenProgress}%</span>
            </div>
            <div className="w-full bg-amber-500/20 h-1.5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-amber-500 rounded-full"
                animate={{ width: `${aiGenProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT AREA */}
      {filteredCards.length === 0 ? (
        /* PREMIUM EMPTY STATE WHEN NO CARDS MATCH FILTERS */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn("p-12 rounded-3xl border border-dashed border-slate-300 dark:border-white/10 text-center space-y-4 max-w-2xl mx-auto my-8", glassStyles.container)}
        >
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mx-auto">
            <Layers className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">No Flashcards Found</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
              We couldn&apos;t find any flashcards matching your current search query or active filter selections.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white text-xs font-bold transition-all cursor-pointer"
            >
              Reset All Filters
            </button>
            <button
              onClick={() => setActiveModal('pdf_gen')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-amber-500/20 flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generate AI Flashcards
            </button>
          </div>
        </motion.div>
      ) : viewMode === 'study' ? (
        <div className="flex flex-col items-center space-y-6">
          {/* 3D INTERACTIVE FLASHCARD STUDY MODE */}
          {/* Deck Header & Card Counter */}
          <div className="w-full max-w-2xl flex items-center justify-between text-xs font-bold text-slate-500 dark:text-zinc-400 px-2">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Card {currentIndex + 1} of {filteredCards.length}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Press [Space] to Flip • [← / →] to Navigate
            </span>
          </div>

          {/* 3D PERSPECTIVE FLIP CARD CONTAINER */}
          <div className="w-full max-w-2xl min-h-[380px] sm:min-h-[420px] relative perspective-1000">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCard?.id || currentIndex}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                onClick={handleFlipCard}
                className={cn(
                  "w-full h-full min-h-[380px] sm:min-h-[420px] p-6 sm:p-8 rounded-3xl border shadow-xl cursor-pointer select-none transition-all duration-500 relative flex flex-col justify-between transform-style-3d",
                  isFlipped
                    ? "bg-gradient-to-br from-slate-900 to-amber-950/40 text-white border-amber-500/40 shadow-amber-500/10"
                    : "bg-white dark:bg-zinc-950 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white hover:border-amber-500/30",
                  glassStyles.container
                )}
                style={{
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* ---------------- FRONT OF CARD ---------------- */}
                <div
                  className={cn(
                    "w-full h-full flex flex-col justify-between space-y-6 backface-hidden",
                    isFlipped && "hidden"
                  )}
                >
                  {/* Card Top Metadata */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        {currentCard?.subject}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-zinc-300">
                        {currentCard?.topic}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Difficulty Badge */}
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-widest",
                          currentCard?.difficulty === 'Easy' && "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
                          currentCard?.difficulty === 'Medium' && "bg-amber-500/10 text-amber-500 border border-amber-500/20",
                          currentCard?.difficulty === 'Hard' && "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                        )}
                      >
                        {currentCard?.difficulty}
                      </span>

                      {/* Favorite Button */}
                      <Tooltip content={currentCard?.isFavorite ? "Remove from Favorites" : "Add to Favorites"} side="left">
                        <button
                          onClick={(e) => handleToggleFavorite(currentCard.id, e)}
                          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
                          aria-label="Favorite Card"
                        >
                          <Star
                            className={cn(
                              "w-4 h-4 transition-colors",
                              currentCard?.isFavorite ? "fill-amber-400 text-amber-400" : "text-slate-400"
                            )}
                          />
                        </button>
                      </Tooltip>
                    </div>
                  </div>

                  {/* Card Question Main Body */}
                  <div className="my-auto py-4 space-y-3">
                    <div className="text-xs font-extrabold uppercase tracking-widest text-amber-500 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5" /> Question / Term
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold leading-relaxed text-slate-900 dark:text-white">
                      {currentCard?.question}
                    </h2>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {currentCard?.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-white/[0.04] px-2 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom Hint & Flip Prompt */}
                  <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-white/10 pt-4 text-xs">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowExplanationHint(!showExplanationHint);
                      }}
                      className="text-amber-600 dark:text-amber-400 hover:underline font-bold flex items-center gap-1 text-[11px]"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      {showExplanationHint ? 'Hide Hint' : 'Show Hint'}
                    </button>

                    <div className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 flex items-center gap-1">
                      <span>Click to reveal answer</span>
                      <RotateCcw className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Optional Hint Box */}
                  {showExplanationHint && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-200 mt-2"
                    >
                      💡 <strong>Hint:</strong> Think about {currentCard?.topic} and key mathematical/architectural properties.
                    </motion.div>
                  )}
                </div>

                {/* ---------------- BACK OF CARD ---------------- */}
                <div
                  className={cn(
                    "w-full h-full flex flex-col justify-between space-y-6 backface-hidden [transform:rotateY(180deg)]",
                    !isFlipped && "hidden"
                  )}
                >
                  {/* Card Top Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Answer & Explanation
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {currentCard?.topic}
                    </span>
                  </div>

                  {/* Card Answer Content */}
                  <div className="my-auto space-y-4">
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-slate-100 text-sm font-semibold leading-relaxed">
                      {currentCard?.answer}
                    </div>

                    <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
                        Detailed Explanation
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {currentCard?.explanation}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom Quick Status Action Bar */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex flex-wrap items-center justify-between border-t border-white/10 pt-4 gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleMarkStatus('known')}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" /> Mark Known
                      </button>

                      <button
                        onClick={() => handleMarkStatus('review')}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <AlertCircle className="w-3.5 h-3.5" /> Needs Review
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <Tooltip content="AI Regenerate or Simplify Answer" side="top">
                        <button
                          onClick={handleRegenerateCurrentCard}
                          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition-all cursor-pointer"
                          aria-label="AI Regenerate or Simplify Answer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      </Tooltip>

                      <Tooltip content="Delete Flashcard" side="top">
                        <button
                          onClick={(e) => handleDeleteCard(currentCard.id, e)}
                          className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition-all cursor-pointer"
                          aria-label="Delete Card"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* STUDY NAVIGATION & SESSION CONTROL BAR */}
          <div className="w-full max-w-2xl flex flex-wrap items-center justify-between gap-3 pt-2">
            {/* Prev & Next Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevCard}
                className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-amber-500 hover:text-white text-slate-800 dark:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              <button
                onClick={handleNextCard}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Session Controls: Shuffle & Restart */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleShuffle}
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-300 dark:border-white/10 text-slate-700 dark:text-zinc-200 hover:border-amber-500/40 hover:text-amber-600 dark:hover:text-amber-400 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Shuffle</span>
              </button>

              <button
                onClick={handleRestartSession}
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-300 dark:border-white/10 text-slate-700 dark:text-zinc-200 hover:border-amber-500/40 hover:text-amber-600 dark:hover:text-amber-400 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* TOPIC GROUPS DECK OVERVIEW MODE */}
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-500" /> Flashcards Grouped by Topic
            </h3>
            <span className="text-xs font-bold text-slate-500">
              {Object.keys(topicGroups).length} Active Topics
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(topicGroups).map(([groupTitle, groupCards]) => {
              const knownInGroup = groupCards.filter((c) => c.status === 'known').length;
              const percent = Math.round((knownInGroup / groupCards.length) * 100);

              return (
                <div
                  key={groupTitle}
                  className={cn("p-5 rounded-3xl border border-slate-300 dark:border-white/10 bg-white/80 dark:bg-zinc-950/50 space-y-4 shadow-sm", glassStyles.card)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                        {groupTitle.split('•')[0].trim()}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                        {groupTitle.split('•')[1]?.trim() || groupTitle}
                      </h4>
                    </div>

                    <span className="text-xs font-black text-slate-700 dark:text-zinc-300 bg-slate-100 dark:bg-white/10 px-2.5 py-1 rounded-xl">
                      {groupCards.length} Cards
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-extrabold text-slate-400">
                      <span>Retention</span>
                      <span className="text-emerald-500">{percent}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                  </div>

                  {/* Cards Preview List */}
                  <div className="space-y-2 pt-1 border-t border-slate-200 dark:border-white/10">
                    {groupCards.slice(0, 3).map((card) => (
                      <div
                        key={card.id}
                        onClick={() => {
                          const idx = filteredCards.findIndex((c) => c.id === card.id);
                          if (idx >= 0) setCurrentIndex(idx);
                          setViewMode('study');
                        }}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] hover:bg-amber-500/10 border border-slate-200 dark:border-white/5 text-xs text-slate-800 dark:text-zinc-200 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <span className="truncate pr-2 font-medium">{card.question}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      const firstCard = groupCards[0];
                      const idx = filteredCards.findIndex((c) => c.id === firstCard.id);
                      if (idx >= 0) setCurrentIndex(idx);
                      setViewMode('study');
                    }}
                    className="w-full py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Study This Topic</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODALS & DRAWERS */}

      {/* 1. MANUALLY ADD FLASHCARD MODAL */}
      {activeModal === 'create' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn("w-full max-w-lg p-6 sm:p-8 rounded-3xl border border-slate-300 dark:border-white/10 bg-white dark:bg-zinc-950 space-y-6 shadow-2xl", glassStyles.container)}
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-500" /> Create Custom Flashcard
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualCard} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                  Question / Term
                </label>
                <input
                  type="text"
                  required
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="e.g. What is Schrödinger's time-dependent wave equation?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                  Answer (Direct Response)
                </label>
                <textarea
                  required
                  rows={2}
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="e.g. iℏ ∂Ψ/∂t = ĤΨ"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                  Detailed Explanation / Derivation
                </label>
                <textarea
                  rows={2}
                  value={newExplanation}
                  onChange={(e) => setNewExplanation(e.target.value)}
                  placeholder="Additional context or proof details..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                    Topic
                  </label>
                  <input
                    type="text"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as DifficultyLevel)}
                    className="w-full px-2 py-2 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-zinc-900 text-xs font-medium text-slate-900 dark:text-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-md shadow-amber-500/20"
                >
                  Save Flashcard
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* 2. GENERATE FROM PDF MODAL */}
      {activeModal === 'pdf_gen' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn("w-full max-w-md p-6 sm:p-8 rounded-3xl border border-slate-300 dark:border-white/10 bg-white dark:bg-zinc-950 space-y-6 shadow-2xl", glassStyles.container)}
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-500" /> Generate Flashcards from PDF
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                  Select Document Source
                </label>
                <div className="space-y-2">
                  {MOCK_PDF_SOURCES.map((pdf) => (
                    <div
                      key={pdf.id}
                      onClick={() => setSelectedPdfId(pdf.id)}
                      className={cn(
                        "p-3 rounded-2xl border text-xs font-medium cursor-pointer transition-all flex items-center justify-between",
                        selectedPdfId === pdf.id
                          ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] text-slate-700 dark:text-zinc-300"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-amber-500" />
                        <div>
                          <p className="font-bold">{pdf.title}</p>
                          <span className="text-[10px] text-slate-400">{pdf.subject} • {pdf.pages} Pages</span>
                        </div>
                      </div>
                      {selectedPdfId === pdf.id && <Check className="w-4 h-4 text-amber-500" />}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                  Number of Cards to Generate
                </label>
                <div className="flex gap-2">
                  {[5, 10, 15].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setTargetCardCount(num)}
                      className={cn(
                        "flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer",
                        targetCardCount === num
                          ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                          : "bg-slate-100 dark:bg-white/[0.04] border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-300"
                      )}
                    >
                      {num} Cards
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const selectedPdf = MOCK_PDF_SOURCES.find(p => p.id === selectedPdfId);
                    runAiGeneration(selectedPdf?.title || 'Selected PDF', targetCardCount, 'pdf');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-md shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate Cards
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* 3. GENERATE FROM AI TUTOR MODAL */}
      {activeModal === 'tutor_gen' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn("w-full max-w-md p-6 sm:p-8 rounded-3xl border border-slate-300 dark:border-white/10 bg-white dark:bg-zinc-950 space-y-6 shadow-2xl", glassStyles.container)}
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-500" /> Extract Cards from AI Tutor
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                  Select AI Tutor Chat Session
                </label>
                <div className="space-y-2">
                  {MOCK_TUTOR_SESSIONS.map((tut) => (
                    <div
                      key={tut.id}
                      onClick={() => setSelectedTutorId(tut.id)}
                      className={cn(
                        "p-3 rounded-2xl border text-xs font-medium cursor-pointer transition-all flex items-center justify-between",
                        selectedTutorId === tut.id
                          ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] text-slate-700 dark:text-zinc-300"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <BrainCircuit className="w-4 h-4 text-amber-500" />
                        <div>
                          <p className="font-bold">{tut.title}</p>
                          <span className="text-[10px] text-slate-400">{tut.topic} • {tut.date}</span>
                        </div>
                      </div>
                      {selectedTutorId === tut.id && <Check className="w-4 h-4 text-amber-500" />}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const selectedTut = MOCK_TUTOR_SESSIONS.find(t => t.id === selectedTutorId);
                    runAiGeneration(selectedTut?.title || 'Tutor Chat', 5, 'tutor');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-md shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  Extract Flashcards
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
