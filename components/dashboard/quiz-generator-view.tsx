'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileQuestion,
  Sparkles,
  FileText,
  MessageSquare,
  Layers,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BarChart3,
  RotateCcw,
  Plus,
  ArrowRight,
  ArrowLeft,
  Check,
  Award,
  Zap,
  Bookmark,
  BookmarkCheck,
  Search,
  Filter,
  Trash2,
  Play,
  Pause,
  AlertCircle,
  SlidersHorizontal,
  ChevronRight,
  Lightbulb,
  BrainCircuit,
  TrendingUp,
  History,
  Target,
  Share2,
  Download,
  BookOpen,
  Edit3,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { glassStyles } from '@/lib/glass';
import { useAccent } from '@/components/accent-provider';
import { useTheme } from '@/components/theme-provider';
import { Tooltip } from '@/components/ui/tooltip';

// ----------------------------------------------------------------------
// TYPES & INTERFACES
// ----------------------------------------------------------------------

export type QuestionType = 'multiple-choice' | 'true-false' | 'fill-blank' | 'short-answer';
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';
export type QuizSource = 'pdf' | 'tutor' | 'flashcards' | 'manual';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | boolean;
  explanation: string;
  tip: string;
  topic: string;
  difficulty: DifficultyLevel;
}

export interface QuizConfig {
  title: string;
  source: QuizSource;
  sourceDetail: string;
  questionCount: number;
  difficulty: DifficultyLevel;
  questionTypes: QuestionType[];
  timeLimitMinutes: number; // 0 = no limit
  customInstructions?: string;
}

export interface TopicBreakdown {
  topic: string;
  score: number;
  total: number;
  percentage: number;
}

export interface QuizResult {
  id: string;
  quizTitle: string;
  source: QuizSource;
  sourceDetail: string;
  completedAt: string;
  questions: QuizQuestion[];
  userAnswers: Record<string, string | boolean>;
  bookmarkedQuestionIds: string[];
  score: number;
  total: number;
  percentage: number;
  accuracy: number;
  timeTakenSeconds: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  difficulty: DifficultyLevel;
  topicBreakdown: TopicBreakdown[];
}

// ----------------------------------------------------------------------
// MOCK SOURCES DATASET
// ----------------------------------------------------------------------

const MOCK_PDFS = [
  { id: 'pdf1', name: 'Data_Structures_&_Algorithms_Guide.pdf', pages: 42, topic: 'Computer Science' },
  { id: 'pdf2', name: 'Quantum_Computing_Principles_Lectures.pdf', pages: 28, topic: 'Physics' },
  { id: 'pdf3', name: 'Biochemistry_Ch4_Enzyme_Kinetics.pdf', pages: 18, topic: 'Biology' },
  { id: 'pdf4', name: 'Linear_Algebra_Vector_Spaces.pdf', pages: 35, topic: 'Mathematics' },
];

const MOCK_TUTOR_SESSIONS = [
  { id: 'tut1', title: 'C++ Monads & Optional Chaining', messagesCount: 14, date: 'Today' },
  { id: 'tut2', title: 'SQL vs NoSQL Database Architectures', messagesCount: 22, date: 'Yesterday' },
  { id: 'tut3', title: 'German Perfekt Auxiliary Verbs (haben/sein)', messagesCount: 18, date: '3 days ago' },
  { id: 'tut4', title: 'Neural Networks Gradient Descent Math', messagesCount: 30, date: '5 days ago' },
];

const MOCK_FLASHCARD_DECKS = [
  { id: 'deck1', title: 'Algorithms & Data Structures', cardCount: 24, subject: 'Computer Science' },
  { id: 'deck2', title: 'German Grammar A2 Core', cardCount: 18, subject: 'Languages' },
  { id: 'deck3', title: 'Database Systems & SQL Queries', cardCount: 12, subject: 'Databases' },
  { id: 'deck4', title: 'Organic Chemistry Reactions', cardCount: 30, subject: 'Chemistry' },
];

const SUGGESTED_TOPICS = [
  'Machine Learning & Neural Networks',
  'Data Structures & Time Complexity',
  'Quantum Computing & Qubits',
  'Biochemistry Enzyme Kinetics',
  'System Design & Microservices',
  'Linear Algebra Eigenvalues',
  'Spanish Subjunctive Mood',
  'Operating Systems Memory Management'
];

// ----------------------------------------------------------------------
// SAMPLE QUESTION BANK FOR DYNAMIC QUIZ GENERATION
// ----------------------------------------------------------------------

const SAMPLE_QUESTION_BANK: Record<string, QuizQuestion[]> = {
  'Data Structures & Time Complexity': [
    {
      id: 'q_ds_1',
      type: 'multiple-choice',
      question: 'What is the average time complexity of searching for an element in a balanced Binary Search Tree (BST)?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correctAnswer: 'O(log n)',
      explanation: 'In a balanced BST, each step divides the search space in half, resulting in a logarithmic time complexity of O(log n).',
      tip: 'Remember that tree height is h = log₂(n) when balanced.',
      topic: 'Binary Trees',
      difficulty: 'Medium'
    },
    {
      id: 'q_ds_2',
      type: 'true-false',
      question: 'A hash table guarantees O(1) worst-case time complexity for search operations.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'While average-case search in a hash table is O(1), worst-case search degraded by hash collisions is O(n).',
      tip: 'Worst-case occurs when all keys hash to the same bucket.',
      topic: 'Hash Tables',
      difficulty: 'Medium'
    },
    {
      id: 'q_ds_3',
      type: 'fill-blank',
      question: 'The abstract data type that follows the Last-In, First-Out (LIFO) principle is called a ________.',
      correctAnswer: 'Stack',
      explanation: 'A Stack enforces LIFO access, where elements added last are removed first via push and pop operations.',
      tip: 'Think of a stack of plates or browser back history.',
      topic: 'Linear Data Structures',
      difficulty: 'Easy'
    },
    {
      id: 'q_ds_4',
      type: 'short-answer',
      question: 'Briefly explain the primary difference between a Stack and a Queue in data structure operations.',
      correctAnswer: 'A Stack follows Last-In-First-Out (LIFO), whereas a Queue follows First-In-First-Out (FIFO).',
      explanation: 'Stacks process elements in reverse order of entry (LIFO), while Queues process elements in arrival order (FIFO).',
      tip: 'Focus on LIFO vs FIFO ordering guarantees.',
      topic: 'Linear Data Structures',
      difficulty: 'Easy'
    },
    {
      id: 'q_ds_5',
      type: 'multiple-choice',
      question: 'Which sorting algorithm has a worst-case time complexity of O(n²)?',
      options: ['Merge Sort', 'Quick Sort', 'Heap Sort', 'Radix Sort'],
      correctAnswer: 'Quick Sort',
      explanation: 'Quick Sort exhibits O(n²) time complexity in worst-case scenarios when pivots chosen are poorly unbalanced.',
      tip: 'Merge Sort and Heap Sort maintain O(n log n) worst-case guarantees.',
      topic: 'Sorting Algorithms',
      difficulty: 'Hard'
    }
  ],
  'Machine Learning & Neural Networks': [
    {
      id: 'q_ml_1',
      type: 'multiple-choice',
      question: 'Which activation function outputs values in the range (-1, 1) and is centered around zero?',
      options: ['Sigmoid', 'ReLU', 'Tanh', 'Leaky ReLU'],
      correctAnswer: 'Tanh',
      explanation: 'Hyperbolic Tangent (Tanh) maps real inputs to (-1, 1), making zero-centered output suitable for deep network hidden layers.',
      tip: 'Sigmoid maps to (0, 1), while Tanh maps to (-1, 1).',
      topic: 'Activation Functions',
      difficulty: 'Easy'
    },
    {
      id: 'q_ml_2',
      type: 'true-false',
      question: 'Overfitting occurs when a machine learning model performs well on training data but poorly on unseen test data.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Overfitting happens when a high-variance model memorizes training noise rather than learning generalizable patterns.',
      tip: 'Use regularization, dropout, or cross-validation to mitigate overfitting.',
      topic: 'Model Evaluation',
      difficulty: 'Easy'
    },
    {
      id: 'q_ml_3',
      type: 'fill-blank',
      question: 'The algorithm used to calculate gradients of loss with respect to network weights via the chain rule is called ________.',
      correctAnswer: 'Backpropagation',
      explanation: 'Backpropagation propagates prediction errors backward through neural network layers using the calculus chain rule.',
      tip: 'Short for "backward propagation of errors".',
      topic: 'Optimization',
      difficulty: 'Medium'
    },
    {
      id: 'q_ml_4',
      type: 'short-answer',
      question: 'What is the main purpose of adding a Dropout layer during neural network training?',
      correctAnswer: 'Dropout randomly deactivates neurons during training to prevent co-adaptation and reduce overfitting.',
      explanation: 'By dropping out a fraction of units, the network builds redundant representations, improving generalization.',
      tip: 'Mention preventing co-adaptation and reducing overfitting.',
      topic: 'Regularization',
      difficulty: 'Medium'
    },
    {
      id: 'q_ml_5',
      type: 'multiple-choice',
      question: 'In convolutional neural networks (CNNs), what operation reduces spatial dimensions while retaining essential features?',
      options: ['Convolution', 'Pooling', 'Batch Normalization', 'Softmax'],
      correctAnswer: 'Pooling',
      explanation: 'Pooling layers (e.g., Max Pooling) downsample feature maps, reducing spatial resolution and computational burden.',
      tip: 'Max Pooling takes the peak activation in each sliding kernel region.',
      topic: 'CNN Architectures',
      difficulty: 'Medium'
    }
  ]
};

// Default questions fallback for any topic
const GENERAL_MOCK_QUESTIONS: QuizQuestion[] = [
  {
    id: 'gen_1',
    type: 'multiple-choice',
    question: 'What is the primary benefit of modular code organization in modern software engineering?',
    options: [
      'Increases compilation speed only',
      'Improves maintainability, reusability, and separation of concerns',
      'Eliminates memory overhead completely',
      'Guarantees zero bug execution'
    ],
    correctAnswer: 'Improves maintainability, reusability, and separation of concerns',
    explanation: 'Modular design isolates functionality into distinct, self-contained components, simplifying testing and future expansion.',
    tip: 'Look for core software architectural principles like separation of concerns.',
    topic: 'Software Architecture',
    difficulty: 'Easy'
  },
  {
    id: 'gen_2',
    type: 'true-false',
    question: 'Asynchronous programming blocks the main execution thread until I/O operations finish.',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation: 'Asynchronous non-blocking I/O allows execution to proceed on other tasks while waiting for operations to complete.',
    tip: 'Blocking vs non-blocking execution models.',
    topic: 'Asynchronous Systems',
    difficulty: 'Medium'
  },
  {
    id: 'gen_3',
    type: 'fill-blank',
    question: 'The process of converting human-readable high-level code into machine instructions is called ________.',
    correctAnswer: 'Compilation',
    explanation: 'Compilers translate source code into machine bytecode or native binary instructions for hardware execution.',
    tip: 'Think about build tools like gcc, clang, or javac.',
    topic: 'Compiler Design',
    difficulty: 'Easy'
  },
  {
    id: 'gen_4',
    type: 'short-answer',
    question: 'Define the concept of Idempotency in HTTP REST API design.',
    correctAnswer: 'An operation is idempotent if executing it multiple times produces the exact same outcome as executing it once.',
    explanation: 'HTTP GET, PUT, and DELETE methods are idempotent because repeated requests do not alter server state beyond the initial call.',
    tip: 'Key phrase: Multiple requests yield the exact same result.',
    topic: 'Web API Design',
    difficulty: 'Hard'
  },
  {
    id: 'gen_5',
    type: 'multiple-choice',
    question: 'Which data structure is optimal for implementing Breadth-First Search (BFS) graph traversal?',
    options: ['Stack', 'Queue', 'Priority Queue', 'Linked List'],
    correctAnswer: 'Queue',
    explanation: 'BFS explores graph nodes level by level using a FIFO Queue to maintain node discovery order.',
    tip: 'BFS uses a Queue (FIFO), whereas DFS uses a Stack (LIFO).',
    topic: 'Graph Algorithms',
    difficulty: 'Medium'
  }
];

// ----------------------------------------------------------------------
// INITIAL COMPLETED QUIZ HISTORY
// ----------------------------------------------------------------------

const INITIAL_QUIZ_HISTORY: QuizResult[] = [
  {
    id: 'hist_1',
    quizTitle: 'Data Structures Master Exam',
    source: 'pdf',
    sourceDetail: 'Data_Structures_&_Algorithms_Guide.pdf',
    completedAt: 'Today, 10:15 AM',
    questions: SAMPLE_QUESTION_BANK['Data Structures & Time Complexity'],
    userAnswers: {
      'q_ds_1': 'O(log n)',
      'q_ds_2': 'False',
      'q_ds_3': 'Stack',
      'q_ds_4': 'A Stack follows Last-In-First-Out (LIFO), whereas a Queue follows First-In-First-Out (FIFO).',
      'q_ds_5': 'Quick Sort'
    },
    bookmarkedQuestionIds: ['q_ds_5'],
    score: 5,
    total: 5,
    percentage: 100,
    accuracy: 100,
    timeTakenSeconds: 215,
    grade: 'A+',
    difficulty: 'Medium',
    topicBreakdown: [
      { topic: 'Binary Trees', score: 1, total: 1, percentage: 100 },
      { topic: 'Hash Tables', score: 1, total: 1, percentage: 100 },
      { topic: 'Linear Data Structures', score: 2, total: 2, percentage: 100 },
      { topic: 'Sorting Algorithms', score: 1, total: 1, percentage: 100 }
    ]
  },
  {
    id: 'hist_2',
    quizTitle: 'Machine Learning Fundamentals',
    source: 'tutor',
    sourceDetail: 'Neural Networks Gradient Descent Math',
    completedAt: 'Yesterday, 4:30 PM',
    questions: SAMPLE_QUESTION_BANK['Machine Learning & Neural Networks'],
    userAnswers: {
      'q_ml_1': 'Tanh',
      'q_ml_2': 'True',
      'q_ml_3': 'Backpropagation',
      'q_ml_4': 'Reduces parameter size and increases memory.',
      'q_ml_5': 'Pooling'
    },
    bookmarkedQuestionIds: ['q_ml_4'],
    score: 4,
    total: 5,
    percentage: 80,
    accuracy: 80,
    timeTakenSeconds: 310,
    grade: 'A',
    difficulty: 'Medium',
    topicBreakdown: [
      { topic: 'Activation Functions', score: 1, total: 1, percentage: 100 },
      { topic: 'Model Evaluation', score: 1, total: 1, percentage: 100 },
      { topic: 'Optimization', score: 1, total: 1, percentage: 100 },
      { topic: 'Regularization', score: 0, total: 1, percentage: 0 },
      { topic: 'CNN Architectures', score: 1, total: 1, percentage: 100 }
    ]
  },
  {
    id: 'hist_3',
    quizTitle: 'General Computer Science Warmup',
    source: 'manual',
    sourceDetail: 'System Design & Async Programming',
    completedAt: '3 days ago',
    questions: GENERAL_MOCK_QUESTIONS,
    userAnswers: {
      'gen_1': 'Increases compilation speed only',
      'gen_2': 'False',
      'gen_3': 'Compilation',
      'gen_4': 'An operation produces identical outcome regardless of calls.',
      'gen_5': 'Queue'
    },
    bookmarkedQuestionIds: [],
    score: 4,
    total: 5,
    percentage: 80,
    accuracy: 80,
    timeTakenSeconds: 240,
    grade: 'A',
    difficulty: 'Easy',
    topicBreakdown: [
      { topic: 'Software Architecture', score: 0, total: 1, percentage: 0 },
      { topic: 'Asynchronous Systems', score: 1, total: 1, percentage: 100 },
      { topic: 'Compiler Design', score: 1, total: 1, percentage: 100 },
      { topic: 'Web API Design', score: 1, total: 1, percentage: 100 },
      { topic: 'Graph Algorithms', score: 1, total: 1, percentage: 100 }
    ]
  }
];

// Helper to compute grade from percentage
function calculateGrade(percentage: number): 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' {
  if (percentage >= 95) return 'A+';
  if (percentage >= 85) return 'A';
  if (percentage >= 75) return 'B';
  if (percentage >= 65) return 'C';
  if (percentage >= 55) return 'D';
  return 'F';
}

function getGradientClass(color: string) {
  switch (color) {
    case 'blue':
      return 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white';
    case 'green':
      return 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white';
    case 'crimson':
      return 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white';
    case 'amber':
    default:
      return 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white';
  }
}

// ----------------------------------------------------------------------
// COUNTDOWN TIMER COMPONENT (MINUTES & SECONDS)
// ----------------------------------------------------------------------
interface QuizCountdownTimerProps {
  secondsRemaining: number;
  totalSeconds: number;
  isTimerEnabled: boolean;
  isPaused: boolean;
  onTogglePause: () => void;
}

function QuizCountdownTimer({
  secondsRemaining,
  totalSeconds,
  isTimerEnabled,
  isPaused,
  onTogglePause,
}: QuizCountdownTimerProps) {
  if (!isTimerEnabled || totalSeconds <= 0) {
    return (
      <div className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-white/5 text-slate-600 dark:text-zinc-400 text-xs font-semibold flex items-center gap-2 shadow-sm">
        <Clock className="w-3.5 h-3.5 text-slate-400" />
        <span>Untimed Practice</span>
      </div>
    );
  }

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  
  const isCritical = secondsRemaining <= 60 || (totalSeconds > 0 && secondsRemaining / totalSeconds <= 0.2);
  const progressPercent = totalSeconds > 0 ? Math.max(0, Math.min(100, (secondsRemaining / totalSeconds) * 100)) : 100;

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "px-3.5 py-1.5 rounded-xl border flex items-center gap-2.5 text-xs font-mono font-bold transition-all shadow-sm relative overflow-hidden",
          isPaused
            ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
            : isCritical
            ? "bg-rose-500/15 border-rose-500/40 text-rose-600 dark:text-rose-400 animate-pulse shadow-rose-500/10"
            : "bg-slate-900/90 dark:bg-white/10 border-slate-700 dark:border-white/20 text-white dark:text-zinc-100"
        )}
      >
        {/* Subtle background progress fill */}
        <div 
          className={cn(
            "absolute left-0 bottom-0 top-0 opacity-15 transition-all duration-1000",
            isCritical ? "bg-rose-500" : "bg-amber-500"
          )}
          style={{ width: `${progressPercent}%` }}
        />

        <Clock className={cn(
          "w-4 h-4 shrink-0 relative z-10",
          isPaused ? "text-amber-500" : isCritical ? "text-rose-500 animate-bounce" : "text-amber-400"
        )} />
        
        <div className="flex items-center gap-1.5 relative z-10">
          <span className="tracking-widest font-black text-sm">{formattedTime}</span>
          {isPaused && (
            <span className="text-[10px] font-sans font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500">
              PAUSED
            </span>
          )}
        </div>
      </div>

      <Tooltip content={isPaused ? 'Resume Quiz Timer' : 'Pause Quiz Timer'} side="bottom">
        <button
          onClick={onTogglePause}
          className={cn(
            "p-2 rounded-xl transition-all cursor-pointer border shadow-sm",
            isPaused
              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25"
              : "bg-slate-100 dark:bg-white/10 border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-zinc-300"
          )}
        >
          {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
        </button>
      </Tooltip>
    </div>
  );
}

export function QuizGeneratorView() {
  const { darkMode } = useTheme();
  const { accentColor, meta } = useAccent();

  // ----------------------------------------------------------------------
  // VIEW & WORKSPACE STATE
  // ----------------------------------------------------------------------
  const [activeTab, setActiveTab] = React.useState<'creator' | 'taking' | 'results' | 'history'>('creator');
  
  // History storage
  const [quizHistory, setQuizHistory] = React.useState<QuizResult[]>(INITIAL_QUIZ_HISTORY);
  const [historySearch, setHistorySearch] = React.useState('');

  // ----------------------------------------------------------------------
  // QUIZ CONFIGURATION STATE (STEP 1: CREATOR)
  // ----------------------------------------------------------------------
  const [quizTitle, setQuizTitle] = React.useState('Data Structures & Algorithms Quiz');
  const [selectedSource, setSelectedSource] = React.useState<QuizSource>('manual');
  const [selectedPdf, setSelectedPdf] = React.useState(MOCK_PDFS[0].name);
  const [selectedTutorSession, setSelectedTutorSession] = React.useState(MOCK_TUTOR_SESSIONS[0].title);
  const [selectedDeck, setSelectedDeck] = React.useState(MOCK_FLASHCARD_DECKS[0].title);
  const [manualTopic, setManualTopic] = React.useState('Data Structures & Time Complexity');
  const [customInstructions, setCustomInstructions] = React.useState('');

  const [questionCount, setQuestionCount] = React.useState<number>(5);
  const [difficulty, setDifficulty] = React.useState<DifficultyLevel>('Medium');
  const [selectedTypes, setSelectedTypes] = React.useState<QuestionType[]>([
    'multiple-choice',
    'true-false',
    'fill-blank',
    'short-answer'
  ]);
  const [timeLimitMinutes, setTimeLimitMinutes] = React.useState<number>(5);
  const [isTimerEnabled, setIsTimerEnabled] = React.useState<boolean>(true);
  const [totalTimerSeconds, setTotalTimerSeconds] = React.useState<number>(300);
  const [isCustomizationModalOpen, setIsCustomizationModalOpen] = React.useState<boolean>(false);

  // Generation loading state
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generationStep, setGenerationStep] = React.useState('');

  // ----------------------------------------------------------------------
  // ACTIVE QUIZ SESSION STATE (STEP 2: TAKING)
  // ----------------------------------------------------------------------
  const [activeQuestions, setActiveQuestions] = React.useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState<number>(0);
  const [userAnswers, setUserAnswers] = React.useState<Record<string, string | boolean>>({});
  const [bookmarkedIds, setBookmarkedIds] = React.useState<string[]>([]);
  const [secondsRemaining, setSecondsRemaining] = React.useState<number>(0);
  const [isTimerPaused, setIsTimerPaused] = React.useState<boolean>(false);
  const [startTimeMs, setStartTimeMs] = React.useState<number>(0);
  const [showExitConfirmModal, setShowExitConfirmModal] = React.useState(false);

  // Auto-save notification feedback indicator
  const [lastSavedMessage, setLastSavedMessage] = React.useState<string | null>(null);

  // ----------------------------------------------------------------------
  // COMPLETED QUIZ RESULT & REVIEW STATE (STEP 3: RESULTS)
  // ----------------------------------------------------------------------
  const [activeResult, setActiveResult] = React.useState<QuizResult | null>(INITIAL_QUIZ_HISTORY[0]);
  const [reviewFilter, setReviewFilter] = React.useState<'all' | 'correct' | 'incorrect' | 'bookmarked'>('all');

  // Notification Toast
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ----------------------------------------------------------------------
  // HANDLERS & LOGIC
  // ----------------------------------------------------------------------

  const handleSubmitQuiz = React.useCallback(() => {
    const elapsedSeconds = Math.max(1, Math.floor((Date.now() - startTimeMs) / 1000));
    
    let correctCount = 0;
    const topicStats: Record<string, { score: number; total: number }> = {};

    activeQuestions.forEach((q) => {
      const uAns = userAnswers[q.id];
      let isCorrect = false;

      if (typeof q.correctAnswer === 'boolean') {
        isCorrect = String(uAns).toLowerCase() === String(q.correctAnswer).toLowerCase();
      } else {
        const cleanUser = String(uAns || '').trim().toLowerCase();
        const cleanCorrect = String(q.correctAnswer).trim().toLowerCase();
        isCorrect = cleanUser === cleanCorrect || (cleanUser.length > 0 && cleanCorrect.includes(cleanUser));
      }

      if (isCorrect) correctCount++;

      if (!topicStats[q.topic]) {
        topicStats[q.topic] = { score: 0, total: 0 };
      }
      topicStats[q.topic].total += 1;
      if (isCorrect) topicStats[q.topic].score += 1;
    });

    const totalCount = activeQuestions.length;
    const pct = Math.round((correctCount / totalCount) * 100);
    const gradeVal = calculateGrade(pct);

    const breakdown: TopicBreakdown[] = Object.keys(topicStats).map((tp) => ({
      topic: tp,
      score: topicStats[tp].score,
      total: topicStats[tp].total,
      percentage: Math.round((topicStats[tp].score / topicStats[tp].total) * 100)
    }));

    let sourceDetailName = '';
    if (selectedSource === 'pdf') sourceDetailName = selectedPdf;
    else if (selectedSource === 'tutor') sourceDetailName = selectedTutorSession;
    else if (selectedSource === 'flashcards') sourceDetailName = selectedDeck;
    else sourceDetailName = manualTopic || 'Custom Subject';

    const newResult: QuizResult = {
      id: `res_${Date.now()}`,
      quizTitle: quizTitle || 'AI Practice Quiz',
      source: selectedSource,
      sourceDetail: sourceDetailName,
      completedAt: 'Just now',
      questions: activeQuestions,
      userAnswers: userAnswers,
      bookmarkedQuestionIds: bookmarkedIds,
      score: correctCount,
      total: totalCount,
      percentage: pct,
      accuracy: pct,
      timeTakenSeconds: elapsedSeconds,
      grade: gradeVal,
      difficulty: difficulty,
      topicBreakdown: breakdown
    };

    setQuizHistory((prev) => [newResult, ...prev]);
    setActiveResult(newResult);
    setActiveTab('results');
    showToast(`Quiz completed! Score: ${correctCount}/${totalCount} (${pct}%)`);
  }, [startTimeMs, activeQuestions, userAnswers, selectedSource, selectedPdf, selectedTutorSession, selectedDeck, manualTopic, quizTitle, bookmarkedIds, difficulty]);

  // ----------------------------------------------------------------------
  // COUNTDOWN TIMER EFFECT
  // ----------------------------------------------------------------------
  React.useEffect(() => {
    if (activeTab !== 'taking' || !isTimerEnabled || isTimerPaused || secondsRemaining <= 0) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz(); // Auto submit on timer expiry
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTab, isTimerEnabled, isTimerPaused, secondsRemaining, handleSubmitQuiz]);

  const toggleQuestionType = (type: QuestionType) => {
    if (selectedTypes.includes(type)) {
      if (selectedTypes.length === 1) {
        showToast('At least one question type must be selected.');
        return;
      }
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleGenerateQuiz = () => {
    setIsGenerating(true);
    setGenerationStep('Analyzing study context...');

    setTimeout(() => {
      setGenerationStep('Synthesizing questions & distractor choices...');
    }, 800);

    setTimeout(() => {
      setGenerationStep('Formatting AI hints and explanations...');
    }, 1600);

    setTimeout(() => {
      // Determine base question set from mock sample or general fallback
      let baseQuestions: QuizQuestion[] = [];
      const topicKey = manualTopic.trim();
      
      if (SAMPLE_QUESTION_BANK[topicKey]) {
        baseQuestions = [...SAMPLE_QUESTION_BANK[topicKey]];
      } else {
        baseQuestions = [...GENERAL_MOCK_QUESTIONS];
      }

      // Filter or adjust questions based on requested count and selected types
      let filtered = baseQuestions.filter((q) => selectedTypes.includes(q.type));
      if (filtered.length === 0) filtered = [...baseQuestions];

      // Re-map or sliced to requested questionCount
      let preparedQuestions: QuizQuestion[] = [];
      for (let i = 0; i < questionCount; i++) {
        const sourceQ = filtered[i % filtered.length];
        preparedQuestions.push({
          ...sourceQ,
          id: `gen_q_${i}_${Date.now()}`,
          difficulty: difficulty
        });
      }

      setActiveQuestions(preparedQuestions);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setBookmarkedIds([]);
      
      const initialSecs = isTimerEnabled && timeLimitMinutes > 0 ? timeLimitMinutes * 60 : 0;
      setSecondsRemaining(initialSecs);
      setTotalTimerSeconds(initialSecs);
      
      setIsTimerPaused(false);
      setStartTimeMs(Date.now());
      setIsGenerating(false);
      setActiveTab('taking');
      showToast(`Quiz ready! ${preparedQuestions.length} questions loaded.`);
    }, 2400);
  };

  const handleAnswerChange = (questionId: string, answer: string | boolean) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer
    }));
    setLastSavedMessage('Answer auto-saved');
    setTimeout(() => setLastSavedMessage(null), 2000);
  };

  const handleToggleBookmark = (questionId: string) => {
    if (bookmarkedIds.includes(questionId)) {
      setBookmarkedIds(bookmarkedIds.filter((id) => id !== questionId));
      showToast('Removed from bookmarked questions');
    } else {
      setBookmarkedIds([...bookmarkedIds, questionId]);
      showToast('Question bookmarked for review');
    }
  };

  // ----------------------------------------------------------------------
  // AI ACTIONS HANDLERS
  // ----------------------------------------------------------------------
  const handleRetryIncorrect = () => {
    if (!activeResult) return;
    const missedQuestions = activeResult.questions.filter((q) => {
      const uAns = activeResult.userAnswers[q.id];
      return String(uAns).trim().toLowerCase() !== String(q.correctAnswer).trim().toLowerCase();
    });

    if (missedQuestions.length === 0) {
      showToast('You answered all questions correctly! Great job!');
      return;
    }

    setActiveQuestions(missedQuestions);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setBookmarkedIds([]);
    setSecondsRemaining(missedQuestions.length * 60);
    setIsTimerPaused(false);
    setStartTimeMs(Date.now());
    setActiveTab('taking');
    showToast(`Retrying ${missedQuestions.length} incorrect questions...`);
  };

  const handleIncreaseDifficulty = () => {
    setDifficulty('Hard');
    setActiveTab('creator');
    showToast('Difficulty adjusted to Hard. Click Generate Quiz when ready.');
  };

  const handlePracticeWeakTopics = () => {
    if (!activeResult) return;
    const weak = activeResult.topicBreakdown.filter((t) => t.percentage < 100);
    if (weak.length === 0) {
      showToast('100% Mastery in all topics!');
      return;
    }
    const weakTopicNames = weak.map((w) => w.topic).join(', ');
    setManualTopic(weakTopicNames);
    setSelectedSource('manual');
    setQuestionCount(5);
    setActiveTab('creator');
    showToast(`Configured quiz for weak topics: ${weakTopicNames}`);
  };

  const handleDeleteHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setQuizHistory(quizHistory.filter((item) => item.id !== id));
    if (activeResult?.id === id) {
      setActiveResult(quizHistory.find((item) => item.id !== id) || null);
    }
    showToast('Quiz attempt deleted from history.');
  };

  // Filtered review questions
  const reviewQuestions = React.useMemo(() => {
    if (!activeResult) return [];
    return activeResult.questions.filter((q) => {
      const uAns = activeResult.userAnswers[q.id];
      const isCorrect = String(uAns).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
      if (reviewFilter === 'correct') return isCorrect;
      if (reviewFilter === 'incorrect') return !isCorrect;
      if (reviewFilter === 'bookmarked') return activeResult.bookmarkedQuestionIds.includes(q.id);
      return true;
    });
  }, [activeResult, reviewFilter]);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // ----------------------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------------------
  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl bg-slate-900/95 dark:bg-zinc-900/95 text-white border border-slate-700/80 dark:border-zinc-700/80 shadow-2xl backdrop-blur-md flex items-center gap-2.5 text-xs font-semibold"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20")}>
              AI Assessment Studio
            </span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium flex items-center gap-1">
              <BrainCircuit className="w-3.5 h-3.5 text-amber-500" /> Dynamic Practice
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            AI Quiz Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-1 max-w-2xl">
            Generate customized practice quizzes from uploaded PDFs, AI Tutor conversations, flashcard decks, or target subjects.
          </p>
        </div>

        {/* WORKSPACE NAVIGATION TABS */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-200/80 dark:bg-white/[0.05] border border-slate-300/50 dark:border-white/10 self-start md:self-auto">
          <Tooltip content="Configure & generate a new AI Quiz" side="bottom">
            <button
              onClick={() => setActiveTab('creator')}
              className={cn(
                "px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                activeTab === 'creator'
                  ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-md"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <Plus className="w-3.5 h-3.5 text-amber-500" />
              <span>Create Quiz</span>
            </button>
          </Tooltip>

          {activeQuestions.length > 0 && (
            <Tooltip content="Continue active quiz session" side="bottom">
              <button
                onClick={() => setActiveTab('taking')}
                className={cn(
                  "px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer relative",
                  activeTab === 'taking'
                    ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-md"
                    : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping absolute top-1.5 right-1.5" />
                <Play className="w-3.5 h-3.5 text-emerald-500" />
                <span>Active Quiz</span>
              </button>
            </Tooltip>
          )}

          {activeResult && (
            <Tooltip content="View latest score & detailed review" side="bottom">
              <button
                onClick={() => setActiveTab('results')}
                className={cn(
                  "px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                  activeTab === 'results'
                    ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-md"
                    : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>Results</span>
              </button>
            </Tooltip>
          )}

          <Tooltip content="Past quiz attempts & score progress" side="bottom">
            <button
              onClick={() => setActiveTab('history')}
              className={cn(
                "px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                activeTab === 'history'
                  ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-md"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <History className="w-3.5 h-3.5 text-blue-500" />
              <span>History</span>
            </button>
          </Tooltip>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: CREATOR WORKSPACE (STEP 1 & REQUIREMENTS 2, 3)                */}
      {/* ==================================================================== */}
      {activeTab === 'creator' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="space-y-8"
        >
          {/* SOURCE SELECTION SECTION */}
          <div className={cn("p-6 sm:p-8 rounded-3xl space-y-6", glassStyles.container)}>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FileQuestion className="w-4 h-4 text-amber-500" /> Select Quiz Material Source
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                Choose where the AI should generate questions from.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* SOURCE 1: PDF */}
              <button
                onClick={() => setSelectedSource('pdf')}
                className={cn(
                  "p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-4 relative overflow-hidden group",
                  selectedSource === 'pdf'
                    ? "border-amber-500 bg-amber-500/10 dark:bg-amber-500/10 shadow-lg"
                    : "border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.05]"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  {selectedSource === 'pdf' && <CheckCircle2 className="w-4 h-4 text-amber-500" />}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">Uploaded PDF</h3>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">Extract from uploaded study documents</p>
                </div>
              </button>

              {/* SOURCE 2: TUTOR */}
              <button
                onClick={() => setSelectedSource('tutor')}
                className={cn(
                  "p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-4 relative overflow-hidden group",
                  selectedSource === 'tutor'
                    ? "border-blue-500 bg-blue-500/10 dark:bg-blue-500/10 shadow-lg"
                    : "border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.05]"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  {selectedSource === 'tutor' && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">AI Tutor Chat</h3>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">Convert recent chat conversations</p>
                </div>
              </button>

              {/* SOURCE 3: FLASHCARDS */}
              <button
                onClick={() => setSelectedSource('flashcards')}
                className={cn(
                  "p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-4 relative overflow-hidden group",
                  selectedSource === 'flashcards'
                    ? "border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/10 shadow-lg"
                    : "border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.05]"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                    <Layers className="w-5 h-5" />
                  </div>
                  {selectedSource === 'flashcards' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">Flashcard Decks</h3>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">Test knowledge from active decks</p>
                </div>
              </button>

              {/* SOURCE 4: MANUAL */}
              <button
                onClick={() => setSelectedSource('manual')}
                className={cn(
                  "p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-4 relative overflow-hidden group",
                  selectedSource === 'manual'
                    ? "border-pink-500 bg-pink-500/10 dark:bg-pink-500/10 shadow-lg"
                    : "border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.05]"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-500 flex items-center justify-center">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  {selectedSource === 'manual' && <CheckCircle2 className="w-4 h-4 text-pink-500" />}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">Manual Topic Input</h3>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">Enter any subject or prompt</p>
                </div>
              </button>
            </div>

            {/* DYNAMIC SOURCE SELECTION DETAILS */}
            <div className="pt-2 border-t border-slate-200/60 dark:border-white/10">
              {selectedSource === 'pdf' && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Select PDF Document</label>
                  <select
                    value={selectedPdf}
                    onChange={(e) => {
                      setSelectedPdf(e.target.value);
                      setQuizTitle(`Quiz: ${e.target.value.replace('.pdf', '')}`);
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-zinc-900 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  >
                    {MOCK_PDFS.map((pdf) => (
                      <option key={pdf.id} value={pdf.name}>
                        📄 {pdf.name} ({pdf.pages} pages • {pdf.topic})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectedSource === 'tutor' && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Select AI Tutor Conversation</label>
                  <select
                    value={selectedTutorSession}
                    onChange={(e) => {
                      setSelectedTutorSession(e.target.value);
                      setQuizTitle(`Quiz: ${e.target.value}`);
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-zinc-900 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  >
                    {MOCK_TUTOR_SESSIONS.map((tut) => (
                      <option key={tut.id} value={tut.title}>
                        💬 {tut.title} ({tut.messagesCount} messages • {tut.date})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectedSource === 'flashcards' && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Select Flashcard Deck</label>
                  <select
                    value={selectedDeck}
                    onChange={(e) => {
                      setSelectedDeck(e.target.value);
                      setQuizTitle(`Quiz: ${e.target.value}`);
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-zinc-900 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    {MOCK_FLASHCARD_DECKS.map((dk) => (
                      <option key={dk.id} value={dk.title}>
                        🎴 {dk.title} ({dk.cardCount} cards • {dk.subject})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectedSource === 'manual' && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Target Topic or Subject Prompt</label>
                  <input
                    type="text"
                    value={manualTopic}
                    onChange={(e) => {
                      setManualTopic(e.target.value);
                      if (e.target.value) setQuizTitle(`${e.target.value} Practice Quiz`);
                    }}
                    placeholder="e.g. Quantum Computing Qubits & Superposition..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-zinc-900 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-pink-500"
                  />

                  {/* SUGGESTED TOPIC PRESETS */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">Quick Suggested Topics:</span>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTED_TOPICS.map((topic) => (
                        <button
                          key={topic}
                          onClick={() => {
                            setManualTopic(topic);
                            setQuizTitle(`${topic} Quiz`);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-200/70 dark:bg-white/10 hover:bg-amber-500 hover:text-white text-[11px] font-semibold text-slate-700 dark:text-zinc-300 transition-all cursor-pointer"
                        >
                          + {topic}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* QUIZ CUSTOMIZATION & PARAMETERS SECTION (REQUIREMENT 3) */}
          <div className={cn("p-6 sm:p-8 rounded-3xl space-y-6", glassStyles.container)}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-amber-500" /> Quiz Parameters & Customization
                </h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                  Configure question count, difficulty, question types, and timer settings.
                </p>
              </div>

              <button
                onClick={() => setIsCustomizationModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-sm"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Customize Modal</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* QUIZ TITLE */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Quiz Title</label>
                <input
                  type="text"
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-zinc-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* NUMBER OF QUESTIONS */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Number of Questions</label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 20, 50].map((num) => (
                    <button
                      key={num}
                      onClick={() => setQuestionCount(num)}
                      className={cn(
                        "py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer",
                        questionCount === num
                          ? "bg-amber-500 text-white border-amber-500 shadow-md"
                          : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-white/[0.08]"
                      )}
                    >
                      {num} Questions
                    </button>
                  ))}
                </div>
              </div>

              {/* DIFFICULTY */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Difficulty Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Easy', 'Medium', 'Hard'] as DifficultyLevel[]).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={cn(
                        "py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer flex items-center justify-center gap-1.5",
                        difficulty === d
                          ? d === 'Easy'
                            ? "bg-emerald-500 text-white border-emerald-500 shadow-md"
                            : d === 'Medium'
                            ? "bg-amber-500 text-white border-amber-500 shadow-md"
                            : "bg-rose-600 text-white border-rose-600 shadow-md"
                          : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-white/[0.08]"
                      )}
                    >
                      <span className={cn(
                        "w-2 h-2 rounded-full",
                        d === 'Easy' ? "bg-emerald-400" : d === 'Medium' ? "bg-amber-400" : "bg-rose-400"
                      )} />
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* TIMER SETTINGS (TOGGLE & DURATION) */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span>Countdown Timer</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                      Displays countdown during quiz & auto-submits on expiry.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-600 dark:text-zinc-400">
                      {isTimerEnabled ? 'ON' : 'OFF'}
                    </span>
                    <button
                      onClick={() => {
                        const newEnabled = !isTimerEnabled;
                        setIsTimerEnabled(newEnabled);
                        if (newEnabled && timeLimitMinutes === 0) {
                          setTimeLimitMinutes(5);
                        }
                      }}
                      className={cn(
                        "w-12 h-6 rounded-full transition-colors relative cursor-pointer p-1 flex items-center",
                        isTimerEnabled ? "bg-amber-500" : "bg-slate-300 dark:bg-zinc-700"
                      )}
                    >
                      <motion.div
                        className="w-4 h-4 rounded-full bg-white shadow-md"
                        animate={{ x: isTimerEnabled ? 24 : 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>
                </div>

                {isTimerEnabled ? (
                  <div className="pt-2 border-t border-slate-200/60 dark:border-white/10 space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600 dark:text-zinc-400">Time Limit Duration</label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {[3, 5, 10, 15, 30].map((mins) => (
                        <button
                          key={mins}
                          onClick={() => setTimeLimitMinutes(mins)}
                          className={cn(
                            "py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer",
                            timeLimitMinutes === mins
                              ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                              : "border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-white/[0.08]"
                          )}
                        >
                          {mins}m
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-slate-200/60 dark:border-white/10 text-[11px] font-medium text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Untimed Practice — answer questions without timer pressure.</span>
                  </div>
                )}
              </div>
            </div>

            {/* QUESTION TYPES SELECTION */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Included Question Types</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'multiple-choice', label: 'Multiple Choice', desc: '4 options with 1 correct' },
                  { id: 'true-false', label: 'True / False', desc: 'Binary verification' },
                  { id: 'fill-blank', label: 'Fill in the Blanks', desc: 'Exact key phrase matching' },
                  { id: 'short-answer', label: 'Short Answer', desc: 'Concise explanation' },
                ].map((qt) => {
                  const isChecked = selectedTypes.includes(qt.id as QuestionType);
                  return (
                    <button
                      key={qt.id}
                      onClick={() => toggleQuestionType(qt.id as QuestionType)}
                      className={cn(
                        "p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3",
                        isChecked
                          ? "border-amber-500/80 bg-amber-500/10 text-slate-900 dark:text-white"
                          : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] text-slate-500 dark:text-zinc-400"
                      )}
                    >
                      <div className={cn(
                        "w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                        isChecked ? "bg-amber-500 border-amber-500 text-white" : "border-slate-300 dark:border-zinc-700"
                      )}>
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold">{qt.label}</div>
                        <div className="text-[10px] opacity-75">{qt.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CUSTOM AI PROMPT INSTRUCTIONS */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Custom Focus Instructions (Optional)</label>
              <input
                type="text"
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="e.g. Focus heavily on code syntax, edge cases, and time complexity tradeoffs..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-zinc-900 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* ACTION GENERATE BUTTON */}
            <div className="pt-4 flex justify-end">
              <button
                onClick={handleGenerateQuiz}
                disabled={isGenerating}
                className={cn(
                  "w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-xl active:scale-95 cursor-pointer",
                  getGradientClass(accentColor)
                )}
              >
                {isGenerating ? (
                  <>
                    <Zap className="w-4 h-4 animate-spin text-amber-300" />
                    <span>{generationStep}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-current" />
                    <span>Generate AI Quiz Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: ACTIVE QUIZ INTERFACE (REQUIREMENT 4)                          */}
      {/* ==================================================================== */}
      {activeTab === 'taking' && activeQuestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="space-y-6 max-w-4xl mx-auto"
        >
          {/* QUIZ HEADER & STATUS BAR */}
          <div className={cn("p-5 sm:p-6 rounded-3xl space-y-4", glassStyles.container)}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  {quizTitle}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
                    Question {currentQuestionIndex + 1} of {activeQuestions.length}
                  </span>
                  <span className="text-slate-300 dark:text-zinc-700">•</span>
                  <span className="text-xs font-semibold text-amber-500">
                    {activeQuestions[currentQuestionIndex]?.topic}
                  </span>
                </div>
              </div>

              {/* TIMER & CONTROLS */}
              <div className="flex items-center gap-3">
                <QuizCountdownTimer
                  secondsRemaining={secondsRemaining}
                  totalSeconds={totalTimerSeconds}
                  isTimerEnabled={isTimerEnabled}
                  isPaused={isTimerPaused}
                  onTogglePause={() => setIsTimerPaused(!isTimerPaused)}
                />

                <Tooltip content="Bookmark this question for review" side="bottom">
                  <button
                    onClick={() => handleToggleBookmark(activeQuestions[currentQuestionIndex].id)}
                    className={cn(
                      "p-2 rounded-xl transition-colors cursor-pointer border",
                      bookmarkedIds.includes(activeQuestions[currentQuestionIndex].id)
                        ? "bg-amber-500/20 border-amber-500/40 text-amber-500"
                        : "bg-slate-100 dark:bg-white/10 border-transparent text-slate-500 dark:text-zinc-400"
                    )}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </Tooltip>

                <Tooltip content="Exit quiz session" side="bottom">
                  <button
                    onClick={() => setShowExitConfirmModal(true)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </Tooltip>
              </div>
            </div>

            {/* PROGRESS BAR */}
            <div className="space-y-1.5">
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestionIndex + 1) / activeQuestions.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* QUICK QUESTION JUMP DOTS */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {activeQuestions.map((q, idx) => {
                const isAnswered = userAnswers[q.id] !== undefined && userAnswers[q.id] !== '';
                const isCurrent = idx === currentQuestionIndex;
                const isBookmarked = bookmarkedIds.includes(q.id);

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={cn(
                      "w-7 h-7 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center relative cursor-pointer shrink-0 border",
                      isCurrent
                        ? "bg-amber-500 text-white border-amber-500 shadow-md scale-110"
                        : isAnswered
                        ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                        : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-zinc-500 border-transparent"
                    )}
                  >
                    {idx + 1}
                    {isBookmarked && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute top-0.5 right-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* QUESTION CARD */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className={cn("p-6 sm:p-8 rounded-3xl space-y-6 relative overflow-hidden", glassStyles.container)}
            >
              {/* BADGES & DIFFICULTY */}
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-white/10">
                  {activeQuestions[currentQuestionIndex].type.replace('-', ' ')}
                </span>

                <span className={cn(
                  "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                  activeQuestions[currentQuestionIndex].difficulty === 'Easy'
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                    : activeQuestions[currentQuestionIndex].difficulty === 'Medium'
                    ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                    : "bg-rose-500/10 border-rose-500/20 text-rose-500"
                )}>
                  {activeQuestions[currentQuestionIndex].difficulty}
                </span>
              </div>

              {/* QUESTION TEXT */}
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
                {activeQuestions[currentQuestionIndex].question}
              </h3>

              {/* QUESTION ANSWER INPUTS BASED ON TYPE */}
              <div className="pt-2">
                {/* 1. MULTIPLE CHOICE */}
                {activeQuestions[currentQuestionIndex].type === 'multiple-choice' && (
                  <div className="grid grid-cols-1 gap-3">
                    {activeQuestions[currentQuestionIndex].options?.map((opt, oIdx) => {
                      const letter = String.fromCharCode(65 + oIdx);
                      const isSelected = userAnswers[activeQuestions[currentQuestionIndex].id] === opt;

                      return (
                        <button
                          key={opt}
                          onClick={() => handleAnswerChange(activeQuestions[currentQuestionIndex].id, opt)}
                          className={cn(
                            "w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between group",
                            isSelected
                              ? "border-amber-500 bg-amber-500/15 dark:bg-amber-500/20 text-slate-900 dark:text-white font-bold shadow-md"
                              : "border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-white/[0.06]"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <span className={cn(
                              "w-7 h-7 rounded-xl text-xs font-black flex items-center justify-center transition-colors",
                              isSelected
                                ? "bg-amber-500 text-white"
                                : "bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-zinc-400 group-hover:bg-slate-300 dark:group-hover:bg-white/20"
                            )}>
                              {letter}
                            </span>
                            <span className="text-xs sm:text-sm">{opt}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-amber-500 stroke-[3]" />}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* 2. TRUE / FALSE */}
                {activeQuestions[currentQuestionIndex].type === 'true-false' && (
                  <div className="grid grid-cols-2 gap-4">
                    {['True', 'False'].map((tf) => {
                      const isSelected = String(userAnswers[activeQuestions[currentQuestionIndex].id]) === tf;

                      return (
                        <button
                          key={tf}
                          onClick={() => handleAnswerChange(activeQuestions[currentQuestionIndex].id, tf)}
                          className={cn(
                            "p-6 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2",
                            isSelected
                              ? tf === 'True'
                                ? "border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold shadow-md"
                                : "border-rose-500 bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold shadow-md"
                              : "border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-white/[0.06]"
                          )}
                        >
                          <span className="text-base font-black">{tf}</span>
                          {isSelected && <CheckCircle2 className="w-5 h-5" />}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* 3. FILL IN THE BLANKS */}
                {activeQuestions[currentQuestionIndex].type === 'fill-blank' && (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={String(userAnswers[activeQuestions[currentQuestionIndex].id] || '')}
                      onChange={(e) => handleAnswerChange(activeQuestions[currentQuestionIndex].id, e.target.value)}
                      placeholder="Type your answer here..."
                      className="w-full px-5 py-3.5 rounded-2xl border border-slate-300 dark:border-white/10 bg-white dark:bg-zinc-900 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                    />
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                      <span>{activeQuestions[currentQuestionIndex].tip}</span>
                    </p>
                  </div>
                )}

                {/* 4. SHORT ANSWER */}
                {activeQuestions[currentQuestionIndex].type === 'short-answer' && (
                  <div className="space-y-3">
                    <textarea
                      rows={3}
                      value={String(userAnswers[activeQuestions[currentQuestionIndex].id] || '')}
                      onChange={(e) => handleAnswerChange(activeQuestions[currentQuestionIndex].id, e.target.value)}
                      placeholder="Write your explanation..."
                      className="w-full p-4 rounded-2xl border border-slate-300 dark:border-white/10 bg-white dark:bg-zinc-900 text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                    />
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                      <BrainCircuit className="w-3.5 h-3.5 text-blue-500" />
                      <span>{activeQuestions[currentQuestionIndex].tip}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* SAVE FEEDBACK INDICATOR */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                  {lastSavedMessage ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> {lastSavedMessage}
                    </>
                  ) : (
                    <span className="text-slate-400 dark:text-zinc-500">Auto-saved to cloud</span>
                  )}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* QUIZ NAVIGATION CONTROLS */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-800 dark:text-zinc-200 font-bold text-xs flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Question</span>
            </button>

            {currentQuestionIndex < activeQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.min(activeQuestions.length - 1, prev + 1))}
                className={cn(
                  "px-6 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg active:scale-95 cursor-pointer",
                  getGradientClass(accentColor)
                )}
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                className="px-7 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xl active:scale-95 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Finish & Submit Quiz</span>
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* EXIT CONFIRMATION MODAL */}
      <AnimatePresence>
        {showExitConfirmModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3 text-rose-500">
                <AlertCircle className="w-6 h-6" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Exit Active Quiz?</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400">
                Your current answer progress will be discarded unless submitted. Are you sure you want to exit?
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowExitConfirmModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-zinc-300 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowExitConfirmModal(false);
                    setActiveTab('creator');
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold cursor-pointer"
                >
                  Exit Session
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================================== */}
      {/* TAB 3: RESULTS DASHBOARD & REVIEW MODE (REQUIREMENTS 5, 6, 7)         */}
      {/* ==================================================================== */}
      {activeTab === 'results' && activeResult && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="space-y-8"
        >
          {/* RESULTS SUMMARY HERO CARD (REQUIREMENT 5) */}
          <div className={cn("p-6 sm:p-8 rounded-3xl space-y-6 relative overflow-hidden", glassStyles.container)}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    {activeResult.difficulty} Difficulty
                  </span>
                  <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                    Completed {activeResult.completedAt}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  {activeResult.quizTitle}
                </h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Source: {activeResult.sourceDetail}
                </p>
              </div>

              {/* GRADE BADGE */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/40 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-black text-2xl shadow-xl">
                  {activeResult.grade}
                </div>
                <div>
                  <div className="text-xl font-black text-slate-900 dark:text-white">
                    {activeResult.percentage}% Score
                  </div>
                  <div className="text-xs font-semibold text-emerald-500">
                    {activeResult.score} / {activeResult.total} Questions Correct
                  </div>
                </div>
              </div>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 text-center">
                <div className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase">Total Score</div>
                <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{activeResult.score}/{activeResult.total}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 text-center">
                <div className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase">Percentage</div>
                <div className="text-lg font-black text-amber-500 mt-0.5">{activeResult.percentage}%</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 text-center">
                <div className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase">Correct</div>
                <div className="text-lg font-black text-emerald-500 mt-0.5">{activeResult.score}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 text-center">
                <div className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase">Wrong</div>
                <div className="text-lg font-black text-rose-500 mt-0.5">{activeResult.total - activeResult.score}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 text-center">
                <div className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase">Accuracy</div>
                <div className="text-lg font-black text-blue-500 mt-0.5">{activeResult.accuracy}%</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 text-center">
                <div className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase">Time Taken</div>
                <div className="text-lg font-black text-purple-500 mt-0.5">{formatTime(activeResult.timeTakenSeconds)}</div>
              </div>
            </div>

            {/* TOPIC BREAKDOWN BARS */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-slate-700 dark:text-zinc-300">Topic Performance Breakdown</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeResult.topicBreakdown.map((tb) => (
                  <div key={tb.topic} className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 dark:text-zinc-200">{tb.topic}</span>
                      <span className="font-semibold text-slate-500 dark:text-zinc-400">{tb.score}/{tb.total} ({tb.percentage}%)</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          tb.percentage >= 80 ? "bg-emerald-500" : tb.percentage >= 50 ? "bg-amber-500" : "bg-rose-500"
                        )}
                        style={{ width: `${tb.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI ACTIONS BAR (REQUIREMENT 7) */}
          <div className={cn("p-6 rounded-3xl space-y-4", glassStyles.container)}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> AI Follow-Up Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                onClick={handleRetryIncorrect}
                className="p-3.5 rounded-2xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-all font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retry Incorrect ({activeResult.total - activeResult.score})</span>
              </button>

              <button
                onClick={() => setActiveTab('creator')}
                className="p-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 transition-all font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate New Quiz</span>
              </button>

              <button
                onClick={handleIncreaseDifficulty}
                className="p-3.5 rounded-2xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-all font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Increase Difficulty to Hard</span>
              </button>

              <button
                onClick={handlePracticeWeakTopics}
                className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-all font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Target className="w-4 h-4" />
                <span>Practice Weak Topics</span>
              </button>
            </div>
          </div>

          {/* REVIEW MODE (REQUIREMENT 6) */}
          <div className={cn("p-6 sm:p-8 rounded-3xl space-y-6", glassStyles.container)}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-500" /> Detailed Question Review & AI Explanations
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                  Inspect correct answers, AI reasoning, user selection highlights, and study tips.
                </p>
              </div>

              {/* REVIEW FILTER TABS */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/80 dark:bg-white/[0.05]">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'correct', label: 'Correct' },
                  { id: 'incorrect', label: 'Incorrect' },
                  { id: 'bookmarked', label: 'Bookmarked' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setReviewFilter(f.id as any)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                      reviewFilter === f.id
                        ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-sm"
                        : "text-slate-600 dark:text-zinc-400"
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* REVIEW QUESTIONS LIST */}
            <div className="space-y-4">
              {reviewQuestions.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 dark:text-zinc-400">
                  No questions match the selected review filter.
                </div>
              ) : (
                reviewQuestions.map((q, idx) => {
                  const uAns = activeResult.userAnswers[q.id];
                  const isCorrect = String(uAns).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();

                  return (
                    <div
                      key={q.id}
                      className={cn(
                        "p-5 sm:p-6 rounded-2xl border space-y-4 transition-all",
                        isCorrect
                          ? "border-emerald-500/30 bg-emerald-500/[0.03]"
                          : "border-rose-500/30 bg-rose-500/[0.03]"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center text-white",
                            isCorrect ? "bg-emerald-500" : "bg-rose-500"
                          )}>
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                            {q.topic}
                          </span>
                        </div>

                        <span className={cn(
                          "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1",
                          isCorrect ? "bg-emerald-500/20 text-emerald-500" : "bg-rose-500/20 text-rose-500"
                        )}>
                          {isCorrect ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {q.question}
                      </h4>

                      {/* USER VS CORRECT ANSWER HIGHLIGHT */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className={cn(
                          "p-3 rounded-xl border",
                          isCorrect
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                            : "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300"
                        )}>
                          <span className="font-bold block text-[10px] uppercase opacity-75">Your Answer:</span>
                          <span className="font-semibold">{String(uAns || 'No Answer Provided')}</span>
                        </div>

                        <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                          <span className="font-bold block text-[10px] uppercase opacity-75">Correct Answer:</span>
                          <span className="font-semibold">{String(q.correctAnswer)}</span>
                        </div>
                      </div>

                      {/* AI EXPLANATION */}
                      <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 space-y-1">
                        <div className="text-[11px] font-bold text-amber-500 flex items-center gap-1.5">
                          <BrainCircuit className="w-3.5 h-3.5" /> AI Explanation
                        </div>
                        <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed">
                          {q.explanation}
                        </p>
                      </div>

                      {/* STUDY TIP */}
                      <div className="text-[11px] text-slate-500 dark:text-zinc-400 flex items-center gap-1.5 italic">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>Learning Tip: {q.tip}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* ==================================================================== */}
      {/* TAB 4: QUIZ HISTORY & ANALYTICS (REQUIREMENTS 8, 9)                   */}
      {/* ==================================================================== */}
      {activeTab === 'history' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="space-y-8"
        >
          {quizHistory.length === 0 ? (
            /* PREMIUM EMPTY STATE (REQUIREMENT 9) */
            <div className={cn("p-12 rounded-3xl text-center space-y-6 max-w-2xl mx-auto", glassStyles.container)}>
              <div className="w-20 h-20 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto shadow-inner">
                <FileQuestion className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">No Quiz History Found</h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-md mx-auto">
                  You haven&apos;t completed any quizzes yet. Generate a quiz from your study materials to track your mastery progress!
                </p>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('creator')}
                  className={cn("px-6 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer", getGradientClass(accentColor))}
                >
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>Create Your First Quiz</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* HISTORY STATS CARDS & SCORE TREND GRAPH (REQUIREMENT 8) */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className={cn("p-5 rounded-2xl space-y-1", glassStyles.card)}>
                  <div className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase">Best Score</div>
                  <div className="text-2xl font-black text-emerald-500">
                    {Math.max(...quizHistory.map((q) => q.percentage))}%
                  </div>
                </div>

                <div className={cn("p-5 rounded-2xl space-y-1", glassStyles.card)}>
                  <div className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase">Recent Score</div>
                  <div className="text-2xl font-black text-amber-500">
                    {quizHistory[0]?.percentage || 0}%
                  </div>
                </div>

                <div className={cn("p-5 rounded-2xl space-y-1", glassStyles.card)}>
                  <div className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase">Total Completed</div>
                  <div className="text-2xl font-black text-blue-500">
                    {quizHistory.length} Quizzes
                  </div>
                </div>

                <div className={cn("p-5 rounded-2xl space-y-1", glassStyles.card)}>
                  <div className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase">Average Accuracy</div>
                  <div className="text-2xl font-black text-purple-500">
                    {Math.round(quizHistory.reduce((acc, curr) => acc + curr.percentage, 0) / quizHistory.length)}%
                  </div>
                </div>
              </div>

              {/* IMPROVEMENT GRAPH SVG */}
              <div className={cn("p-6 sm:p-8 rounded-3xl space-y-4", glassStyles.container)}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-amber-500" /> Score Trajectory & Improvement Trend
                  </h3>
                  <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +15% Avg Growth
                  </span>
                </div>

                {/* VISUAL SVG GRAPH */}
                <div className="w-full h-40 pt-4 flex items-end justify-between gap-4 px-4 border-b border-slate-200 dark:border-white/10 relative">
                  {quizHistory.slice().reverse().map((item, idx) => (
                    <div key={item.id} className="flex-1 flex flex-col items-center gap-2 group relative">
                      <div
                        className="w-full max-w-[40px] bg-gradient-to-t from-amber-500 to-orange-400 rounded-t-xl transition-all duration-500 group-hover:brightness-125 relative"
                        style={{ height: `${item.percentage}%` }}
                      >
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-900 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.percentage}%
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-500 dark:text-zinc-400 truncate max-w-[60px]">
                        Quiz {idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* PREVIOUS ATTEMPTS TABLE / LIST */}
              <div className={cn("p-6 sm:p-8 rounded-3xl space-y-6", glassStyles.container)}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <History className="w-4 h-4 text-amber-500" /> Past Quiz Attempts
                  </h3>

                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={historySearch}
                      onChange={(e) => setHistorySearch(e.target.value)}
                      placeholder="Search history..."
                      className="pl-9 pr-4 py-1.5 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-zinc-900 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {quizHistory
                    .filter((item) => item.quizTitle.toLowerCase().includes(historySearch.toLowerCase()))
                    .map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setActiveResult(item);
                          setActiveTab('results');
                        }}
                        className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase">
                              {item.difficulty}
                            </span>
                            <span className="text-xs text-slate-400 dark:text-zinc-500">
                              {item.completedAt}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                            {item.quizTitle}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                            Source: {item.sourceDetail}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 self-end sm:self-center">
                          <div className="text-right">
                            <div className="text-sm font-black text-slate-900 dark:text-white">
                              {item.score}/{item.total} ({item.percentage}%)
                            </div>
                            <div className="text-[10px] font-semibold text-emerald-500">
                              Grade {item.grade}
                            </div>
                          </div>

                          <Tooltip content="Delete quiz attempt" side="left">
                            <button
                              onClick={(e) => handleDeleteHistory(item.id, e)}
                              className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </Tooltip>

                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* QUIZ CUSTOMIZATION & TIMER SETTINGS MODAL */}
      <AnimatePresence>
        {isCustomizationModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                    <SlidersHorizontal className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">Quiz & Timer Settings</h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">Configure countdown timer and session parameters</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCustomizationModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
                {/* TIMER TOGGLE SETTING */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-amber-500" />
                        <span>Quiz Countdown Timer</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                        Automatically count down and submit when time expires
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-600 dark:text-zinc-400">
                        {isTimerEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                      <button
                        onClick={() => {
                          const newEnabled = !isTimerEnabled;
                          setIsTimerEnabled(newEnabled);
                          if (newEnabled && timeLimitMinutes === 0) {
                            setTimeLimitMinutes(5);
                          }
                        }}
                        className={cn(
                          "w-12 h-6 rounded-full transition-colors relative cursor-pointer p-1 flex items-center",
                          isTimerEnabled ? "bg-amber-500" : "bg-slate-300 dark:bg-zinc-700"
                        )}
                      >
                        <motion.div
                          className="w-4 h-4 rounded-full bg-white shadow-md"
                          animate={{ x: isTimerEnabled ? 24 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </button>
                    </div>
                  </div>

                  {/* TIMER DURATION SELECTOR IF ENABLED */}
                  {isTimerEnabled && (
                    <div className="pt-2 border-t border-slate-200/60 dark:border-white/10 space-y-2">
                      <label className="text-[11px] font-bold text-slate-700 dark:text-zinc-300">
                        Timer Duration (Minutes)
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {[3, 5, 10, 15, 30].map((mins) => (
                          <button
                            key={mins}
                            onClick={() => setTimeLimitMinutes(mins)}
                            className={cn(
                              "py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer",
                              timeLimitMinutes === mins
                                ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                                : "border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-100"
                            )}
                          >
                            {mins}m
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* QUESTION COUNT */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Question Count</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[5, 10, 20, 50].map((num) => (
                      <button
                        key={num}
                        onClick={() => setQuestionCount(num)}
                        className={cn(
                          "py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer",
                          questionCount === num
                            ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                            : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] text-slate-700 dark:text-zinc-300"
                        )}
                      >
                        {num} Qs
                      </button>
                    ))}
                  </div>
                </div>

                {/* DIFFICULTY */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Difficulty Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Easy', 'Medium', 'Hard'] as DifficultyLevel[]).map((d) => (
                      <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className={cn(
                          "py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer",
                          difficulty === d
                            ? d === 'Easy'
                              ? "bg-emerald-500 text-white border-emerald-500"
                              : d === 'Medium'
                              ? "bg-amber-500 text-white border-amber-500"
                              : "bg-rose-600 text-white border-rose-600"
                            : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] text-slate-700 dark:text-zinc-300"
                        )}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* QUESTION TYPES */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Question Types</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'multiple-choice', label: 'Multiple Choice' },
                      { id: 'true-false', label: 'True / False' },
                      { id: 'fill-blank', label: 'Fill in Blank' },
                      { id: 'short-answer', label: 'Short Answer' },
                    ].map((qt) => {
                      const isChecked = selectedTypes.includes(qt.id as QuestionType);
                      return (
                        <button
                          key={qt.id}
                          onClick={() => toggleQuestionType(qt.id as QuestionType)}
                          className={cn(
                            "p-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer",
                            isChecked
                              ? "border-amber-500 bg-amber-500/10 text-slate-900 dark:text-white"
                              : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] text-slate-500"
                          )}
                        >
                          <div className={cn(
                            "w-4 h-4 rounded border flex items-center justify-center shrink-0",
                            isChecked ? "bg-amber-500 border-amber-500 text-white" : "border-slate-300 dark:border-zinc-700"
                          )}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span>{qt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-white/10">
                <button
                  onClick={() => setIsCustomizationModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-white shadow-md hover:bg-amber-600 transition-colors cursor-pointer"
                >
                  Save & Apply Settings
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
