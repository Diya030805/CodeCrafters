'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  FileText, 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  BookOpen, 
  Layers, 
  Key, 
  Calendar, 
  Users, 
  HelpCircle, 
  Zap, 
  ArrowRight, 
  RotateCcw, 
  Copy, 
  Check, 
  X, 
  Brain, 
  GraduationCap, 
  MessageSquare, 
  Lightbulb, 
  FileCheck, 
  Code, 
  FileSearch,
  Bookmark,
  ChevronRight,
  Send,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { glassStyles } from '@/lib/glass';
import { useAccent } from '@/components/accent-provider';
import { useTheme } from '@/components/theme-provider';
import { Tooltip } from '@/components/ui/tooltip';

// PDF Document Interface
interface UploadedPDF {
  name: string;
  size: string;
  pages: number;
  wordCount: number;
  readTime: string;
  category: string;
}

// Sample PDFs for instant preview testing
const SAMPLE_PDFS: Array<UploadedPDF & { id: string; description: string }> = [
  {
    id: 'quantum',
    name: 'Quantum_Mechanics_Lectures_2026.pdf',
    size: '4.8 MB',
    pages: 34,
    wordCount: 12450,
    readTime: '45 mins',
    category: 'Quantum Physics',
    description: 'Wave-particle duality, Schrödinger equation, and quantum state collapse.'
  },
  {
    id: 'machine_learning',
    name: 'Neural_Networks_&_Deep_Learning.pdf',
    size: '3.2 MB',
    pages: 28,
    wordCount: 9800,
    readTime: '35 mins',
    category: 'Computer Science',
    description: 'Gradient descent, backpropagation, transformers, and loss optimization.'
  },
  {
    id: 'history',
    name: 'European_History_Cold_War_Era.pdf',
    size: '2.5 MB',
    pages: 22,
    wordCount: 8100,
    readTime: '30 mins',
    category: 'History',
    description: 'Yalta Conference, Truman Doctrine, Marshall Plan, and the Berlin Wall.'
  }
];

// Realistic mock analysis output datasets per sample/uploaded PDF
const ANALYSIS_DATA = {
  summary: `This comprehensive document provides a rigorous academic overview of core principles, mathematical foundations, and real-world applications. The text systematically develops fundamental concepts starting from basic state postulates to advanced operator mechanics. It highlights key theoretical breakthroughs, empirical formulas, historical milestones, and influential contributors. Designed for advanced undergraduate and graduate study, the material emphasizes conceptual depth, problem-solving methodologies, and exam-critical analytical frameworks.`,
  
  keyTopics: [
    { title: 'Foundational Postulates & Wave Equations', complexity: 'Core', importance: '98%', description: 'Detailed mathematical formulation of state vectors, Hilbert space, and temporal evolution equations.' },
    { title: 'Operator Algebra & Eigenvalue Spectrum', complexity: 'Advanced', importance: '94%', description: 'Hermitian operators, commutation relations, observables, and boundary condition constraints.' },
    { title: 'Probability Densities & Conservation Laws', complexity: 'Intermediate', importance: '90%', description: 'Normalization criteria, continuity equations, and probability current conservation.' },
    { title: 'Perturbation Theory & Approximation Techniques', complexity: 'High Yield', importance: '95%', description: 'Time-independent and time-dependent Rayleigh-Schrödinger perturbation expansions.' }
  ],

  definitions: [
    { term: 'Wave Function (Ψ)', category: 'Quantum State', definition: 'A mathematical description of the quantum state of an isolated quantum system, whose squared modulus gives probability density.' },
    { term: 'Hermitian Operator', category: 'Mathematical Methods', definition: 'A linear operator that equals its own adjoint (A = A†), guaranteeing real eigenvalues corresponding to physical observables.' },
    { term: 'Commutator [A, B]', category: 'Algebra', definition: 'The operator defined as AB - BA; if non-zero, the observables cannot be simultaneously measured with arbitrary precision.' },
    { term: 'Eigenstate & Eigenvalue', category: 'Linear Algebra', definition: 'A state that remains invariant in direction under operator transformation, scaled by a scalar eigenvalue.' }
  ],

  formulas: [
    { 
      title: 'Time-Dependent Schrödinger Equation', 
      math: 'iℏ ∂Ψ(r,t) / ∂t = Ĥ Ψ(r,t)', 
      parameters: [
        { symbol: 'i', desc: 'Imaginary unit' },
        { symbol: 'ℏ', desc: 'Reduced Planck constant (h / 2π)' },
        { symbol: 'Ψ(r,t)', desc: 'Wavefunction in position and time' },
        { symbol: 'Ĥ', desc: 'Hamiltonian operator (total energy)' }
      ]
    },
    { 
      title: 'Heisenberg Uncertainty Principle', 
      math: 'σ_x · σ_p ≥ ℏ / 2', 
      parameters: [
        { symbol: 'σ_x', desc: 'Standard deviation of position' },
        { symbol: 'σ_p', desc: 'Standard deviation of momentum' },
        { symbol: 'ℏ', desc: 'Reduced Planck constant' }
      ]
    }
  ],

  dates: [
    { date: '1900', title: 'Planck Quantum Hypothesis', detail: 'Max Planck introduces quantization of energy (E = hν) to resolve blackbody radiation.' },
    { date: '1925', title: 'Matrix Mechanics', detail: 'Werner Heisenberg formulates matrix quantum mechanics during his stay on Helgoland.' },
    { date: '1926', title: 'Schrödinger Wave Equation', detail: 'Erwin Schrödinger publishes four papers founding wave mechanics in Annalen der Physik.' },
    { date: '1927', title: 'Copenhagen Interpretation', detail: 'Niels Bohr and Werner Heisenberg formalize the probabilistic interpretation of quantum theory.' }
  ],

  people: [
    { name: 'Erwin Schrödinger', role: 'Physicist', contribution: 'Developed the wave equation governing quantum states and probability evolution.', quote: 'The wave function is the fundamental entity of quantum mechanics.' },
    { name: 'Werner Heisenberg', role: 'Theoretical Physicist', contribution: 'Formulated matrix mechanics and established the Uncertainty Principle.', quote: 'What we observe is not nature itself, but nature exposed to our method of questioning.' },
    { name: 'Niels Bohr', role: 'Atomic Physicist', contribution: 'Created the Bohr model of the atom and led the Copenhagen interpretation.', quote: 'Anyone who is not shocked by quantum theory has not understood it.' }
  ],

  examQuestions: [
    {
      question: 'Derive the probability conservation equation (continuity equation) from the Schrödinger equation.',
      difficulty: 'High Yield',
      topic: 'Conservation Laws',
      answer: 'By multiplying the Schrödinger equation by Ψ* and its complex conjugate by Ψ, taking the difference, and applying the definition of probability density ρ = |Ψ|² and probability flux J = (ℏ / 2mi)(Ψ*∇Ψ - Ψ∇Ψ*), we arrive at ∂ρ/∂t + ∇·J = 0.'
    },
    {
      question: 'Why must physical observables be represented by Hermitian operators in quantum mechanics?',
      difficulty: 'Medium',
      topic: 'Operator Theory',
      answer: 'Hermitian operators guarantee that all eigenvalues are real numbers (which correspond to physical measurement outcomes) and that eigenfunctions corresponding to distinct eigenvalues are orthogonal.'
    },
    {
      question: 'Explain the physical significance of a non-zero commutator [A, B] = iℏ.',
      difficulty: 'Core',
      topic: 'Heisenberg Principle',
      answer: 'A non-vanishing commutator indicates that the two physical observables A and B are incompatible; measuring one introduces fundamentally unavoidable uncertainty into the other.'
    }
  ],

  takeaways: [
    'Quantum systems exist in linear superpositions governed by deterministic wave equations until measurement.',
    'Hermitian operators provide the complete orthogonal basis needed to project observable state amplitudes.',
    'Uncertainty principles represent intrinsic wave packet physics rather than experimental measurement error.',
    'Perturbation expansion offers analytical solutions for complex multi-body quantum potential wells.'
  ]
};

// Flashcards Dataset
const MOCK_FLASHCARDS = [
  {
    front: 'What is the physical interpretation of |Ψ(x,t)|²?',
    back: 'It represents the probability density of finding the particle at position x at time t (Born Rule).'
  },
  {
    front: 'What condition makes an operator Hermitian?',
    back: 'An operator A is Hermitian if <f | A g> = <A f | g> for all state vectors f and g, ensuring real eigenvalues.'
  },
  {
    front: 'State the Heisenberg Uncertainty Relation between energy and time.',
    back: 'ΔE · Δt ≥ ℏ / 2, meaning a state with lifetime Δt has an energy uncertainty of at least ΔE.'
  }
];

// Quiz Dataset
const MOCK_QUIZ = [
  {
    question: 'Which of the following guarantees that physical measurement values are strictly real numbers?',
    options: ['Unitary Operators', 'Hermitian Operators', 'Projection Operators', 'Differential Operators'],
    correct: 1,
    explanation: 'Hermitian operators (A = A†) mathematically guarantee real eigenvalues.'
  },
  {
    question: 'Who introduced the fundamental wave equation governing temporal quantum evolution in 1926?',
    options: ['Max Planck', 'Werner Heisenberg', 'Erwin Schrödinger', 'Niels Bohr'],
    correct: 2,
    explanation: 'Erwin Schrödinger formulated wave mechanics in 1926.'
  },
  {
    question: 'What is the commutator value [x, p_x] between position and momentum operators?',
    options: ['0', 'iℏ', 'ℏ/2', '1'],
    correct: 1,
    explanation: 'The fundamental canonical commutation relation is [x, p_x] = iℏ.'
  }
];

// Quick suggestion keywords for instant document searching
const SUGGESTED_KEYWORDS = [
  'Schrödinger',
  'Hermitian',
  'Wave Function',
  'Uncertainty',
  'Commutator',
  '1926',
  'Probability'
];

// Helper to highlight matching search text with vibrant visual effect
function highlightText(text: string, query: string): React.ReactNode {
  if (!query || !query.trim()) return text;
  const trimmed = query.trim();
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  if (parts.length === 1) return text;

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-amber-400 dark:bg-amber-400 text-slate-950 font-black rounded px-1.5 py-0.5 shadow-sm shadow-amber-500/30 border border-amber-300 dark:border-amber-200 inline-block my-0.5 ring-2 ring-amber-500/40"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

export function PDFAnalyzerView() {
  const { accentColor } = useAccent();

  // State Management
  const [currentFile, setCurrentFile] = React.useState<UploadedPDF | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysisStep, setAnalysisStep] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState<'overview' | 'topics' | 'definitions' | 'formulas' | 'dates' | 'people' | 'questions' | 'takeaways'>('overview');

  // Search Bar State
  const [searchQuery, setSearchQuery] = React.useState('');

  // Study Action Modals
  const [activeModal, setActiveModal] = React.useState<'flashcards' | 'quiz' | 'ask_ai' | 'explain' | 'notes' | null>(null);
  const [flashcardIdx, setFlashcardIdx] = React.useState(0);
  const [isFlipped, setIsFlipped] = React.useState(false);
  
  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = React.useState(false);

  // Ask AI & Explain state
  const [aiQuestion, setAiQuestion] = React.useState('');
  const [aiAnswer, setAiAnswer] = React.useState<string | null>(null);
  const [isAiAnswering, setIsAiAnswering] = React.useState(false);
  const [selectedTopicToExplain, setSelectedTopicToExplain] = React.useState(ANALYSIS_DATA.keyTopics[0].title);
  const [explanationText, setExplanationText] = React.useState<string | null>(null);
  const [copiedNotes, setCopiedNotes] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Search & Filtering calculations
  const isQueryActive = searchQuery.trim().length > 0;
  const queryLower = searchQuery.toLowerCase().trim();

  const matchesQuery = (str: string) => str.toLowerCase().includes(queryLower);

  const filteredSummaryMatches = matchesQuery(ANALYSIS_DATA.summary) ? 1 : 0;

  const filteredTopics = ANALYSIS_DATA.keyTopics.filter(
    (t) => matchesQuery(t.title) || matchesQuery(t.description) || matchesQuery(t.complexity)
  );

  const filteredDefinitions = ANALYSIS_DATA.definitions.filter(
    (d) => matchesQuery(d.term) || matchesQuery(d.definition) || matchesQuery(d.category)
  );

  const filteredFormulas = ANALYSIS_DATA.formulas.filter(
    (f) =>
      matchesQuery(f.title) ||
      matchesQuery(f.math) ||
      f.parameters.some((p) => matchesQuery(p.symbol) || matchesQuery(p.desc))
  );

  const filteredDates = ANALYSIS_DATA.dates.filter(
    (d) => matchesQuery(d.date) || matchesQuery(d.title) || matchesQuery(d.detail)
  );

  const filteredPeople = ANALYSIS_DATA.people.filter(
    (p) =>
      matchesQuery(p.name) ||
      matchesQuery(p.role) ||
      matchesQuery(p.contribution) ||
      matchesQuery(p.quote)
  );

  const filteredQuestions = ANALYSIS_DATA.examQuestions.filter(
    (q) => matchesQuery(q.question) || matchesQuery(q.topic) || matchesQuery(q.answer)
  );

  const filteredTakeaways = ANALYSIS_DATA.takeaways.filter((t) => matchesQuery(t));

  const totalMatchesCount =
    filteredSummaryMatches +
    filteredTopics.length +
    filteredDefinitions.length +
    filteredFormulas.length +
    filteredDates.length +
    filteredPeople.length +
    filteredQuestions.length +
    filteredTakeaways.length;

  const tabMatchCounts: Record<string, number> = {
    overview: filteredSummaryMatches,
    topics: filteredTopics.length,
    definitions: filteredDefinitions.length,
    formulas: filteredFormulas.length,
    dates: filteredDates.length,
    people: filteredPeople.length,
    questions: filteredQuestions.length,
    takeaways: filteredTakeaways.length
  };

  // Helper gradient styling
  const getGradientClass = () => {
    switch (accentColor) {
      case 'amber':
        return 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 shadow-amber-500/20';
      case 'blue':
        return 'bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 shadow-blue-500/20';
      case 'green':
        return 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 shadow-emerald-500/20';
      case 'crimson':
        return 'bg-gradient-to-r from-pink-500 via-rose-500 to-rose-600 shadow-rose-500/20';
      default:
        return 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 shadow-amber-500/20';
    }
  };

  // Simulate File Upload & Analysis Process
  const startFileAnalysis = (pdfData: UploadedPDF) => {
    setCurrentFile(pdfData);
    setIsUploading(true);
    setUploadProgress(0);

    // Upload Progress Simulation
    let progress = 0;
    const uploadInterval = setInterval(() => {
      progress += 15;
      if (progress >= 100) {
        setUploadProgress(100);
        clearInterval(uploadInterval);
        setTimeout(() => {
          setIsUploading(false);
          runAnalysisPipeline();
        }, 400);
      } else {
        setUploadProgress(progress);
      }
    }, 120);
  };

  const runAnalysisPipeline = () => {
    setIsAnalyzing(true);
    setAnalysisStep(0);

    const steps = [
      'Extracting document structure & OCR text...',
      'Synthesizing core summary & key topics...',
      'Identifying math formulas & parameter definitions...',
      'Structuring historical dates & key contributors...',
      'Formulating exam questions & high-yield takeaways...'
    ];

    let currentStep = 0;
    const stepInterval = setInterval(() => {
      currentStep += 1;
      if (currentStep >= steps.length) {
        clearInterval(stepInterval);
        setTimeout(() => {
          setIsAnalyzing(false);
        }, 500);
      } else {
        setAnalysisStep(currentStep);
      }
    }, 700);
  };

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const pdfObj: UploadedPDF = {
        name: file.name.endsWith('.pdf') ? file.name : `${file.name}.pdf`,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        pages: Math.floor(Math.random() * 20) + 15,
        wordCount: Math.floor(Math.random() * 5000) + 6000,
        readTime: '25 mins',
        category: 'Custom Document'
      };
      startFileAnalysis(pdfObj);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const pdfObj: UploadedPDF = {
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        pages: Math.floor(Math.random() * 20) + 18,
        wordCount: Math.floor(Math.random() * 5000) + 7000,
        readTime: '30 mins',
        category: 'User Upload'
      };
      startFileAnalysis(pdfObj);
    }
  };

  const handleAskAI = () => {
    if (!aiQuestion.trim()) return;
    setIsAiAnswering(true);
    setTimeout(() => {
      setAiAnswer(`Based on **${currentFile?.name || 'this document'}**, the text specifies that this topic relies heavily on linear operators and state vector projections. For exam purposes, remember that observables correspond directly to Hermitian matrices.`);
      setIsAiAnswering(false);
    }, 1000);
  };

  const handleExplainTopic = () => {
    setIsAiAnswering(true);
    setTimeout(() => {
      setExplanationText(`Here is **${selectedTopicToExplain}** explained simply:\n\nImagine you have a magic dice that changes its numbers based on how you look at it. Instead of showing fixed numbers all the time, it holds a cloud of probabilities. The moment you roll it (measure it), it locks into one solid number! That's how wave functions and quantum operators work.`);
      setIsAiAnswering(false);
    }, 900);
  };

  const handleCopyStudyNotes = () => {
    const notesText = `# Study Notes: ${currentFile?.name}\n\n## Summary\n${ANALYSIS_DATA.summary}\n\n## Key Takeaways\n${ANALYSIS_DATA.takeaways.map(t => `- ${t}`).join('\n')}`;
    navigator.clipboard.writeText(notesText);
    setCopiedNotes(true);
    setTimeout(() => setCopiedNotes(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
              <FileSearch className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              AI PDF Analyzer
            </h1>
          </div>
          <p className="text-slate-500 dark:text-zinc-400 text-xs sm:text-sm font-medium mt-1">
            Upload course materials, lecture slides, or textbooks to extract key insights, formulas, and study tools.
          </p>
        </div>

        {currentFile && !isAnalyzing && (
          <button 
            onClick={() => {
              setCurrentFile(null);
              setUploadProgress(0);
            }}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-200/50 dark:bg-white/[0.04] hover:bg-slate-300/50 dark:hover:bg-white/[0.08] text-slate-700 dark:text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer self-start md:self-auto"
          >
            <UploadCloud className="w-4 h-4 text-amber-500" />
            <span>Upload Another PDF</span>
          </button>
        )}
      </div>

      {/* STATE 1: NO PDF UPLOADED (EMPTY STATE & DRAG/DROP ZONE) */}
      {!currentFile && !isUploading && !isAnalyzing && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* DRAG & DROP UPLOAD BOX */}
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "relative p-8 sm:p-12 rounded-3xl border-2 border-dashed transition-all duration-300 text-center flex flex-col items-center justify-center gap-5 overflow-hidden group cursor-pointer",
              isDragging 
                ? "border-amber-500 bg-amber-500/10 scale-[1.01]" 
                : "border-slate-300 dark:border-white/10 hover:border-amber-500/40 bg-slate-100/80 dark:bg-white/[0.02]",
              glassStyles.container
            )}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-amber-600/30 border border-amber-500/30 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300 relative">
              <div className="absolute inset-0 blur-xl rounded-full bg-amber-500/20 pointer-events-none" />
              <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500 relative z-10" />
            </div>

            <div className="max-w-md space-y-2">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {isDragging ? 'Drop your PDF here!' : 'Drag & drop your PDF here'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 font-medium leading-relaxed">
                Supports lecture notes, research papers, syllabus guides, or textbook chapters up to 50MB.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className={cn(
                  "px-6 py-3 rounded-2xl text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95 shadow-lg border border-white/20 cursor-pointer",
                  getGradientClass()
                )}
              >
                <FileSearch className="w-4 h-4" />
                Browse Files
              </button>
            </div>

            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Instant AI Summary • Exam Practice • Formulas & Dates</span>
            </div>
          </div>

          {/* QUICK START WITH SAMPLE PDFs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Or Try Sample Documents
              </h3>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500">
                1-Click Analysis Demo
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SAMPLE_PDFS.map((sample) => (
                <motion.div
                  key={sample.id}
                  whileHover={{ y: -3, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => startFileAnalysis(sample)}
                  className={cn(
                    "p-5 rounded-2xl border border-slate-300/80 dark:border-white/10 bg-slate-100/90 dark:bg-white/[0.02] hover:bg-slate-200/80 dark:hover:bg-white/[0.06] transition-all cursor-pointer flex flex-col justify-between gap-4 group shadow-sm",
                    glassStyles.card
                  )}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                        {sample.category}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500">
                        {sample.size}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors line-clamp-1">
                      {sample.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {sample.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-white/5 text-[10px] font-bold text-slate-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-amber-500" />
                      {sample.pages} Pages
                    </span>
                    <span className="text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Analyze Now <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* STATE 2: UPLOADING & ANALYZING PROGRESS ANIMATION */}
      {(isUploading || isAnalyzing) && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn("p-8 sm:p-12 rounded-3xl text-center flex flex-col items-center justify-center space-y-6 max-w-xl mx-auto shadow-2xl my-8 border border-slate-300 dark:border-white/10", glassStyles.container)}
        >
          {/* Glowing Animated Spinner */}
          <div className="relative flex items-center justify-center">
            <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center animate-pulse">
              <Brain className="w-10 h-10 text-amber-500" />
            </div>
            <div className="absolute inset-0 rounded-3xl border-2 border-amber-500 border-t-transparent animate-spin" />
          </div>

          <div className="space-y-2 w-full">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {isUploading ? 'Uploading Document...' : 'AI Deep Analysis in Progress'}
            </h3>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-bold flex items-center justify-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              {currentFile?.name} ({currentFile?.size})
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full space-y-2">
            <div className="flex justify-between text-[11px] font-black text-slate-500 dark:text-zinc-400">
              <span>
                {isUploading 
                  ? `Uploading... ${uploadProgress}%` 
                  : `Step ${analysisStep + 1} of 5`}
              </span>
              <span>{isUploading ? `${uploadProgress}%` : 'Processing'}</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden p-0.5">
              <motion.div 
                className={cn("h-full rounded-full transition-all duration-300", getGradientClass())}
                style={{ 
                  width: isUploading 
                    ? `${uploadProgress}%` 
                    : `${((analysisStep + 1) / 5) * 100}%` 
                }}
              />
            </div>
          </div>

          {/* Analysis Step Messaging */}
          {!isUploading && (
            <div className="px-4 py-2 rounded-xl bg-slate-200/60 dark:bg-white/[0.03] border border-slate-300 dark:border-white/5 text-xs font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
              <span>
                {[
                  'Extracting document structure & OCR text...',
                  'Synthesizing core summary & key topics...',
                  'Identifying math formulas & parameter definitions...',
                  'Structuring historical dates & key contributors...',
                  'Formulating exam questions & high-yield takeaways...'
                ][analysisStep]}
              </span>
            </div>
          )}
        </motion.div>
      )}

      {/* STATE 3: ANALYSIS COMPLETED DASHBOARD */}
      {currentFile && !isUploading && !isAnalyzing && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* UPLOADED FILE INFO HEADER BANNER */}
          <div className={cn("p-5 rounded-2xl border border-slate-300 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-100/90 dark:bg-zinc-950/60 shadow-md", glassStyles.card)}>
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
                <FileCheck className="w-6 h-6 text-amber-500" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
                    {currentFile.name}
                  </h3>
                  <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3 h-3" /> Analyzed
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
                  <span>Size: {currentFile.size}</span>
                  <span>•</span>
                  <span>Pages: {currentFile.pages}</span>
                  <span>•</span>
                  <span>Words: {currentFile.wordCount.toLocaleString()}</span>
                  <span>•</span>
                  <span>Est. Read: {currentFile.readTime}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={runAnalysisPipeline}
                className="px-3 py-2 rounded-xl bg-slate-200/80 dark:bg-white/[0.06] hover:bg-slate-300 dark:hover:bg-white/[0.1] text-slate-700 dark:text-zinc-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                title="Re-run AI Analysis"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-analyze</span>
              </button>
              <button 
                onClick={handleCopyStudyNotes}
                className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-amber-500/30"
              >
                {copiedNotes ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedNotes ? 'Copied!' : 'Export Summary'}</span>
              </button>
            </div>
          </div>

          {/* STUDY ACTIONS SECTION */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-amber-500" />
              Study Actions Workspace
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <button 
                onClick={() => setActiveModal('flashcards')}
                className="p-3.5 rounded-2xl border border-slate-300 dark:border-white/10 bg-slate-100/90 dark:bg-white/[0.03] hover:bg-slate-200 dark:hover:bg-white/[0.08] transition-all text-left flex flex-col gap-2 group cursor-pointer shadow-sm"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Generate Flashcards</h4>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400">Interactive study cards</p>
                </div>
              </button>

              <button 
                onClick={() => setActiveModal('quiz')}
                className="p-3.5 rounded-2xl border border-slate-300 dark:border-white/10 bg-slate-100/90 dark:bg-white/[0.03] hover:bg-slate-200 dark:hover:bg-white/[0.08] transition-all text-left flex flex-col gap-2 group cursor-pointer shadow-sm"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Generate Quiz</h4>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400">Practice questions</p>
                </div>
              </button>

              <button 
                onClick={() => setActiveModal('ask_ai')}
                className="p-3.5 rounded-2xl border border-slate-300 dark:border-white/10 bg-slate-100/90 dark:bg-white/[0.03] hover:bg-slate-200 dark:hover:bg-white/[0.08] transition-all text-left flex flex-col gap-2 group cursor-pointer shadow-sm"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Ask AI About PDF</h4>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400">Chat with document</p>
                </div>
              </button>

              <button 
                onClick={() => setActiveModal('explain')}
                className="p-3.5 rounded-2xl border border-slate-300 dark:border-white/10 bg-slate-100/90 dark:bg-white/[0.03] hover:bg-slate-200 dark:hover:bg-white/[0.08] transition-all text-left flex flex-col gap-2 group cursor-pointer shadow-sm"
              >
                <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Explain Hard Topics</h4>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400">Feynman breakdown</p>
                </div>
              </button>

              <button 
                onClick={() => setActiveModal('notes')}
                className="p-3.5 rounded-2xl border border-slate-300 dark:border-white/10 bg-slate-100/90 dark:bg-white/[0.03] hover:bg-slate-200 dark:hover:bg-white/[0.08] transition-all text-left flex flex-col gap-2 group cursor-pointer shadow-sm col-span-2 sm:col-span-1"
              >
                <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform">
                  <Bookmark className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Create Study Notes</h4>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400">Markdown summary</p>
                </div>
              </button>
            </div>
          </div>

          {/* DOCUMENT SEARCH BAR SECTION */}
          <div className={cn("p-4 sm:p-5 rounded-2xl border border-slate-300 dark:border-white/10 bg-slate-100/90 dark:bg-zinc-950/70 space-y-4 shadow-sm", glassStyles.card)}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-bold">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    Search Document Content
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                    Find specific text, equations, dates, or concepts across all PDF sections
                  </p>
                </div>
              </div>

              {/* Match Results Counter */}
              <div className="flex items-center gap-2 self-start sm:self-center">
                <div className={cn(
                  "px-3 py-1.5 rounded-xl border text-xs font-black flex items-center gap-2 transition-all",
                  isQueryActive
                    ? totalMatchesCount > 0
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 shadow-sm"
                      : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
                    : "bg-slate-200/70 dark:bg-white/[0.05] text-slate-500 dark:text-zinc-400 border-slate-300/50 dark:border-white/10"
                )}>
                  <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                  <span>
                    {isQueryActive
                      ? `${totalMatchesCount} ${totalMatchesCount === 1 ? 'match' : 'matches'} found`
                      : '0 matches'}
                  </span>
                </div>
                {isQueryActive && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1.5 rounded-lg bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white text-xs font-bold transition-colors cursor-pointer"
                    title="Reset Search"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Form with Input Field and Find Button */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // If user clicks Find and activeTab has 0 matches, switch to first tab with matches
                if (isQueryActive && tabMatchCounts[activeTab] === 0) {
                  const tabWithMatch = Object.keys(tabMatchCounts).find((tabKey) => tabMatchCounts[tabKey] > 0);
                  if (tabWithMatch) {
                    setActiveTab(tabWithMatch as any);
                  }
                }
              }}
              className="flex flex-col sm:flex-row items-stretch gap-2"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type keyword, formula, date, or topic to search..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-white/[0.04] text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                    title="Clear text"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Explicit 'Find' Button */}
              <button
                type="submit"
                className={cn(
                  "px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-[0.98]",
                  "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border border-amber-400/30 shadow-amber-500/20"
                )}
              >
                <Search className="w-3.5 h-3.5" />
                <span>Find</span>
              </button>
            </form>

            {/* Quick Search Keywords */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mr-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" /> Quick Search:
              </span>
              {SUGGESTED_KEYWORDS.map((kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => setSearchQuery(kw)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer border",
                    searchQuery.toLowerCase() === kw.toLowerCase()
                      ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                      : "bg-white/80 dark:bg-white/[0.04] border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-300 hover:border-amber-500/40 hover:text-amber-600 dark:hover:text-amber-400"
                  )}
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>

          {/* DASHBOARD TAB NAVIGATION BAR */}
          <div className="flex items-center gap-1 border-b border-slate-200 dark:border-white/10 overflow-x-auto custom-scrollbar pb-px">
            {[
              { id: 'overview', label: 'Document Summary', icon: BookOpen },
              { id: 'topics', label: 'Key Topics', icon: Layers },
              { id: 'definitions', label: 'Definitions', icon: Key },
              { id: 'formulas', label: 'Formulas', icon: Code },
              { id: 'dates', label: 'Important Dates', icon: Calendar },
              { id: 'people', label: 'Key People', icon: Users },
              { id: 'questions', label: 'Exam Questions', icon: HelpCircle },
              { id: 'takeaways', label: 'Takeaways', icon: Zap },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const matchCount = tabMatchCounts[tab.id] || 0;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "py-3 px-4 text-xs font-bold transition-all duration-200 border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-2",
                    isActive 
                      ? "border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-500/5 font-extrabold" 
                      : "border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  <Icon className={cn("w-3.5 h-3.5", isActive ? "text-amber-500" : "text-slate-400")} />
                  <span>{tab.label}</span>
                  {isQueryActive && (
                    <span className={cn(
                      "px-1.5 py-0.5 rounded-full text-[9px] font-extrabold ml-1",
                      matchCount > 0 
                        ? "bg-amber-500 text-white" 
                        : "bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-zinc-500"
                    )}>
                      {matchCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* DISPLAY ANALYSIS DASHBOARD CONTENT PANELS */}
          <div className="min-h-[350px]">
            
            {/* SEARCH MATCH CALLOUT FOR OTHER TABS WHEN CURRENT TAB HAS 0 MATCHES */}
            {isQueryActive && tabMatchCounts[activeTab] === 0 && (
              <div className="p-8 rounded-2xl border border-dashed border-slate-300 dark:border-white/10 text-center space-y-3 bg-slate-50/50 dark:bg-white/[0.01]">
                <Search className="w-8 h-8 text-amber-500/50 mx-auto" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200">
                    No matches for &quot;{searchQuery}&quot; in current tab
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    {totalMatchesCount > 0 
                      ? `Found ${totalMatchesCount} total matches in other sections!`
                      : `Try searching for different keywords like "Schrödinger", "Hermitian", or "Equation".`}
                  </p>
                </div>
                {totalMatchesCount > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 pt-2">
                    {Object.entries(tabMatchCounts)
                      .filter(([_, count]) => count > 0)
                      .map(([tabId, count]) => {
                        const tabNames: Record<string, string> = {
                          overview: 'Summary',
                          topics: 'Key Topics',
                          definitions: 'Definitions',
                          formulas: 'Formulas',
                          dates: 'Dates',
                          people: 'People',
                          questions: 'Questions',
                          takeaways: 'Takeaways'
                        };
                        return (
                          <button
                            key={tabId}
                            onClick={() => setActiveTab(tabId as any)}
                            className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs border border-amber-500/30 flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>View {count} in {tabNames[tabId]}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        );
                      })}
                  </div>
                )}
              </div>
            )}

            {/* 1. DOCUMENT SUMMARY TAB */}
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className={cn(
                  "p-6 rounded-3xl border space-y-4 shadow-sm transition-all duration-300",
                  isQueryActive && matchesQuery(ANALYSIS_DATA.summary)
                    ? "border-amber-500/50 dark:border-amber-500/40 bg-amber-500/[0.04] dark:bg-amber-500/[0.06] ring-1 ring-amber-500/30 shadow-md shadow-amber-500/10"
                    : "border-slate-300 dark:border-white/10 bg-white/80 dark:bg-zinc-950/50",
                  glassStyles.container
                )}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                        <BookOpen className="w-4 h-4" />
                      </span>
                      <h3 className="text-base font-black text-slate-900 dark:text-white">Executive Summary</h3>
                    </div>
                    {isQueryActive && matchesQuery(ANALYSIS_DATA.summary) && (
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                        Keyword Match
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
                    {highlightText(ANALYSIS_DATA.summary, searchQuery)}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={cn("p-5 rounded-2xl border border-slate-300 dark:border-white/10 bg-slate-100/80 dark:bg-white/[0.02]", glassStyles.card)}>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
                      Academic Scope & Depth
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-700 dark:text-zinc-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{highlightText("Covers formal proof techniques and state vector transformations", searchQuery)}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{highlightText("Includes worked-out mathematical derivations and units", searchQuery)}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{highlightText("High correlation with standard university final exams", searchQuery)}</span>
                      </li>
                    </ul>
                  </div>

                  <div className={cn("p-5 rounded-2xl border border-slate-300 dark:border-white/10 bg-slate-100/80 dark:bg-white/[0.02]", glassStyles.card)}>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
                      Recommended Focus Strategy
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed mb-3">
                      {highlightText("Prioritize memorizing Hermitian operator definitions and practice deriving probability flux conservation.", searchQuery)}
                    </p>
                    <button 
                      onClick={() => setActiveModal('quiz')}
                      className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Take 3-Min Practice Quiz <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. KEY TOPICS TAB */}
            {activeTab === 'topics' && filteredTopics.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTopics.map((topic, i) => {
                  const isCardMatched = isQueryActive && (
                    matchesQuery(topic.title) || matchesQuery(topic.description) || matchesQuery(topic.complexity)
                  );
                  return (
                    <div
                      key={i}
                      className={cn(
                        "p-5 rounded-2xl border space-y-3 shadow-sm transition-all duration-300",
                        isCardMatched
                          ? "border-amber-500/50 dark:border-amber-500/40 bg-amber-500/[0.03] dark:bg-amber-500/[0.05] ring-1 ring-amber-500/30 shadow-md shadow-amber-500/10"
                          : "border-slate-300 dark:border-white/10 bg-white/80 dark:bg-zinc-950/50",
                        glassStyles.card
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md">
                          {highlightText(topic.complexity, searchQuery)}
                        </span>
                        <div className="flex items-center gap-2">
                          {isCardMatched && (
                            <span className="text-[9px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-md">
                              Search Match
                            </span>
                          )}
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            Importance: {topic.importance}
                          </span>
                        </div>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {highlightText(topic.title, searchQuery)}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                        {highlightText(topic.description, searchQuery)}
                      </p>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* 3. IMPORTANT DEFINITIONS TAB */}
            {activeTab === 'definitions' && filteredDefinitions.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDefinitions.map((def, i) => (
                  <div key={i} className={cn("p-5 rounded-2xl border border-slate-300 dark:border-white/10 bg-white/80 dark:bg-zinc-950/50 space-y-2 shadow-sm", glassStyles.card)}>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Key className="w-3.5 h-3.5 text-amber-500" />
                        {highlightText(def.term, searchQuery)}
                      </h4>
                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400 bg-slate-200 dark:bg-white/10 px-2 py-0.5 rounded">
                        {highlightText(def.category, searchQuery)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                      {highlightText(def.definition, searchQuery)}
                    </p>
                  </div>
                ))}
              </motion.div>
            )}

            {/* 4. IMPORTANT FORMULAS TAB */}
            {activeTab === 'formulas' && filteredFormulas.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {filteredFormulas.map((form, i) => (
                  <div key={i} className={cn("p-6 rounded-3xl border border-slate-300 dark:border-white/10 bg-white/80 dark:bg-zinc-950/50 space-y-4 shadow-sm", glassStyles.container)}>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Code className="w-4 h-4 text-amber-500" />
                        {highlightText(form.title, searchQuery)}
                      </h4>
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Core Equation</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900 text-amber-400 font-mono text-sm sm:text-base text-center border border-slate-800 shadow-inner">
                      {highlightText(form.math, searchQuery)}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                      {form.parameters.map((p, j) => (
                        <div key={j} className="text-xs p-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{highlightText(p.symbol, searchQuery)}:</span>
                          <span className="text-slate-600 dark:text-zinc-300">{highlightText(p.desc, searchQuery)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* 5. IMPORTANT DATES TAB */}
            {activeTab === 'dates' && filteredDates.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                {filteredDates.map((d, i) => (
                  <div key={i} className={cn("p-4 rounded-2xl border border-slate-300 dark:border-white/10 bg-white/80 dark:bg-zinc-950/50 flex items-start gap-4 shadow-sm", glassStyles.card)}>
                    <div className="px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-black text-sm shrink-0">
                      {highlightText(d.date, searchQuery)}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {highlightText(d.title, searchQuery)}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                        {highlightText(d.detail, searchQuery)}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* 6. IMPORTANT PEOPLE TAB */}
            {activeTab === 'people' && filteredPeople.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredPeople.map((person, i) => (
                  <div key={i} className={cn("p-5 rounded-2xl border border-slate-300 dark:border-white/10 bg-white/80 dark:bg-zinc-950/50 space-y-3 shadow-sm", glassStyles.card)}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-black text-amber-500 text-sm">
                        {person.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {highlightText(person.name, searchQuery)}
                        </h4>
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-zinc-400">
                          {highlightText(person.role, searchQuery)}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                      {highlightText(person.contribution, searchQuery)}
                    </p>
                    <blockquote className="text-[11px] italic text-slate-500 dark:text-zinc-400 border-l-2 border-amber-500 pl-2">
                      &quot;{highlightText(person.quote, searchQuery)}&quot;
                    </blockquote>
                  </div>
                ))}
              </motion.div>
            )}

            {/* 7. IMPORTANT QUESTIONS FOR EXAM TAB */}
            {activeTab === 'questions' && filteredQuestions.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {filteredQuestions.map((q, i) => (
                  <div key={i} className={cn("p-5 rounded-2xl border border-slate-300 dark:border-white/10 bg-white/80 dark:bg-zinc-950/50 space-y-3 shadow-sm", glassStyles.card)}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded">
                        {highlightText(q.difficulty, searchQuery)}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-400">
                        Topic: {highlightText(q.topic, searchQuery)}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>{highlightText(q.question, searchQuery)}</span>
                    </h4>

                    <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 text-xs text-slate-700 dark:text-zinc-300 leading-relaxed">
                      <strong className="text-amber-600 dark:text-amber-400 block mb-1">Model Solution / Explanation:</strong>
                      {highlightText(q.answer, searchQuery)}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* 8. KEY TAKEAWAYS TAB */}
            {activeTab === 'takeaways' && filteredTakeaways.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                {filteredTakeaways.map((takeaway, i) => (
                  <div key={i} className={cn("p-4 rounded-2xl border border-slate-300 dark:border-white/10 bg-white/80 dark:bg-zinc-950/50 flex items-start gap-3 shadow-sm", glassStyles.card)}>
                    <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 font-medium leading-relaxed">
                      {highlightText(takeaway, searchQuery)}
                    </p>
                  </div>
                ))}
              </motion.div>
            )}

          </div>
        </motion.div>
      )}

      {/* STUDY MODALS OVERLAY */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn("w-full max-w-2xl p-6 sm:p-8 rounded-3xl border border-slate-300 dark:border-white/10 bg-white dark:bg-zinc-950 shadow-2xl relative space-y-6 overflow-hidden max-h-[90vh] overflow-y-auto")}
            >
              {/* Close Button */}
              <Tooltip content="Close Modal" side="left">
                <button 
                  onClick={() => setActiveModal(null)}
                  className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
                  aria-label="Close Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </Tooltip>

              {/* MODAL 1: FLASHCARDS */}
              {activeModal === 'flashcards' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                      <Brain className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">AI Generated Flashcards</h3>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">Card {flashcardIdx + 1} of {MOCK_FLASHCARDS.length}</p>
                    </div>
                  </div>

                  {/* Flashcard Flip Surface */}
                  <div 
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="h-64 rounded-3xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-transparent p-8 flex flex-col items-center justify-center text-center cursor-pointer shadow-lg hover:border-amber-500 transition-all select-none relative group"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-4 bg-amber-500/10 px-3 py-1 rounded-full">
                      {isFlipped ? 'Answer (Click to Flip)' : 'Question (Click to Flip)'}
                    </span>
                    <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white max-w-md leading-relaxed">
                      {isFlipped ? MOCK_FLASHCARDS[flashcardIdx].back : MOCK_FLASHCARDS[flashcardIdx].front}
                    </p>
                    <span className="absolute bottom-4 text-[10px] text-slate-400 dark:text-zinc-500 font-semibold group-hover:text-amber-500 transition-colors">
                      Tap card to flip over
                    </span>
                  </div>

                  {/* Navigation controls */}
                  <div className="flex items-center justify-between">
                    <button 
                      onClick={() => {
                        setFlashcardIdx((prev) => (prev > 0 ? prev - 1 : MOCK_FLASHCARDS.length - 1));
                        setIsFlipped(false);
                      }}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white font-bold text-xs cursor-pointer"
                    >
                      Previous Card
                    </button>
                    <button 
                      onClick={() => {
                        setFlashcardIdx((prev) => (prev < MOCK_FLASHCARDS.length - 1 ? prev + 1 : 0));
                        setIsFlipped(false);
                      }}
                      className={cn("px-5 py-2.5 rounded-xl text-white font-bold text-xs cursor-pointer shadow-md", getGradientClass())}
                    >
                      Next Card
                    </button>
                  </div>
                </div>
              )}

              {/* MODAL 2: QUIZ */}
              {activeModal === 'quiz' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500">
                      <HelpCircle className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">AI Quick Quiz</h3>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">Test your comprehension from this document</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {MOCK_QUIZ.map((q, qIdx) => (
                      <div key={qIdx} className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 space-y-3 bg-slate-50 dark:bg-white/[0.02]">
                        <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {qIdx + 1}. {q.question}
                        </p>

                        <div className="grid grid-cols-1 gap-2">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = selectedAnswers[qIdx] === optIdx;
                            const isCorrect = optIdx === q.correct;
                            return (
                              <button
                                key={optIdx}
                                onClick={() => {
                                  if (!quizSubmitted) {
                                    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
                                  }
                                }}
                                className={cn(
                                  "p-3 rounded-xl text-xs font-semibold text-left border transition-all cursor-pointer flex items-center justify-between",
                                  quizSubmitted
                                    ? isCorrect 
                                      ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold"
                                      : isSelected 
                                        ? "bg-rose-500/10 border-rose-500/40 text-rose-600 dark:text-rose-400 font-bold"
                                        : "bg-transparent border-slate-200 dark:border-white/5 opacity-50"
                                    : isSelected 
                                      ? "bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 font-bold" 
                                      : "bg-white dark:bg-white/[0.04] border-slate-200 dark:border-white/10 hover:border-amber-500/40"
                                )}
                              >
                                <span>{opt}</span>
                                {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted && (
                          <p className="text-[11px] text-slate-500 dark:text-zinc-400 italic pt-1">
                            Explanation: {q.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {!quizSubmitted ? (
                    <button 
                      onClick={() => setQuizSubmitted(true)}
                      className={cn("w-full py-3 rounded-xl text-white font-bold text-xs cursor-pointer shadow-lg", getGradientClass())}
                    >
                      Submit Answers
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        setSelectedAnswers({});
                        setQuizSubmitted(false);
                      }}
                      className="w-full py-3 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white font-bold text-xs cursor-pointer"
                    >
                      Reset Quiz
                    </button>
                  )}
                </div>
              )}

              {/* MODAL 3: ASK AI ABOUT PDF */}
              {activeModal === 'ask_ai' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                      <MessageSquare className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">Ask AI About Document</h3>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">Contextual QA trained specifically on {currentFile?.name}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={aiQuestion}
                        onChange={(e) => setAiQuestion(e.target.value)}
                        placeholder="e.g. What are the key formulas on page 12?"
                        className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/[0.04] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                        onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                      />
                      <button 
                        onClick={handleAskAI}
                        disabled={isAiAnswering}
                        className={cn("px-5 py-3 rounded-xl text-white font-bold text-xs flex items-center gap-2 cursor-pointer shrink-0", getGradientClass())}
                      >
                        <Send className="w-4 h-4" />
                        <span>Ask</span>
                      </button>
                    </div>

                    {isAiAnswering && (
                      <div className="p-4 rounded-xl bg-slate-100 dark:bg-white/[0.03] text-xs font-semibold text-slate-600 dark:text-zinc-300 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                        Analyzing document context...
                      </div>
                    )}

                    {aiAnswer && !isAiAnswering && (
                      <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-500">AI Response</span>
                        <div className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {aiAnswer}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* MODAL 4: EXPLAIN HARD TOPICS */}
              {activeModal === 'explain' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500">
                      <Lightbulb className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">Explain Difficult Concept</h3>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">Simplified analogies for complex theoretical ideas</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-2">
                        Select Topic to Explain Simply:
                      </label>
                      <select
                        value={selectedTopicToExplain}
                        onChange={(e) => setSelectedTopicToExplain(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-zinc-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      >
                        {ANALYSIS_DATA.keyTopics.map((t, idx) => (
                          <option key={idx} value={t.title}>{t.title}</option>
                        ))}
                      </select>
                    </div>

                    <button 
                      onClick={handleExplainTopic}
                      disabled={isAiAnswering}
                      className={cn("w-full py-3 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg", getGradientClass())}
                    >
                      <Brain className="w-4 h-4" />
                      <span>Simplify Concept Now</span>
                    </button>

                    {isAiAnswering && (
                      <div className="p-4 rounded-xl bg-slate-100 dark:bg-white/[0.03] text-xs font-semibold text-slate-600 dark:text-zinc-300 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                        Generating simple analogy...
                      </div>
                    )}

                    {explanationText && !isAiAnswering && (
                      <div className="p-5 rounded-2xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-rose-500">Simple Explanation</span>
                        <div className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {explanationText}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* MODAL 5: STUDY NOTES */}
              {activeModal === 'notes' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 rounded-xl bg-sky-500/10 text-sky-500">
                      <Bookmark className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">Structured Study Notes</h3>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">Ready-to-copy Markdown format</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs max-h-72 overflow-y-auto space-y-3 border border-slate-800">
                    <p className="text-amber-400 font-bold"># Study Notes: {currentFile?.name}</p>
                    <div>
                      <p className="text-sky-400 font-bold">## Summary</p>
                      <p className="text-slate-300">{ANALYSIS_DATA.summary}</p>
                    </div>
                    <div>
                      <p className="text-sky-400 font-bold">## Key Takeaways</p>
                      {ANALYSIS_DATA.takeaways.map((t, idx) => (
                        <p key={idx} className="text-slate-300">- {t}</p>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={handleCopyStudyNotes}
                    className={cn("w-full py-3 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg", getGradientClass())}
                  >
                    {copiedNotes ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedNotes ? 'Copied to Clipboard!' : 'Copy Markdown Notes'}</span>
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
