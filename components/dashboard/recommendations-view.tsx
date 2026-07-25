'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  BookOpen,
  Target,
  Brain,
  Clock,
  Zap,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  Filter,
  CheckCircle2,
  BookMarked,
  Flame,
  LayoutDashboard,
  MessageSquare,
  Layers,
  FileQuestion,
  FileText,
  Calendar,
  X,
  Search,
  Star,
  Activity,
  Award,
  PlayCircle,
  BarChart,
  History,
  TrendingDown,
  Info
} from 'lucide-react';
import { useAccent } from '@/components/accent-provider';
import { cn } from '@/lib/utils';
import { glassStyles } from '@/lib/glass';

// Mock Data Types
type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
type Priority = 'High' | 'Medium' | 'Low';

interface Recommendation {
  id: string;
  title: string;
  subject: string;
  difficulty: Difficulty;
  estimatedTime: string;
  confidenceScore: number;
  reason: string;
  priority: Priority;
  type: 'Topic' | 'Practice' | 'Review' | 'Continue' | 'Weak';
  progress?: number;
}

// Mock Data
const MOCK_RECOMMENDATIONS: Recommendation[] = [
  {
    id: '1',
    title: 'Backpropagation Algorithm',
    subject: 'Machine Learning',
    difficulty: 'Advanced',
    estimatedTime: '45 mins',
    confidenceScore: 94,
    reason: 'Based on your recent interest in Neural Networks and high quiz scores in Calculus.',
    priority: 'High',
    type: 'Topic'
  },
  {
    id: '2',
    title: 'Cellular Respiration Process',
    subject: 'Biology',
    difficulty: 'Intermediate',
    estimatedTime: '30 mins',
    confidenceScore: 88,
    reason: 'You struggled with this topic in your last quiz (Score: 65%).',
    priority: 'High',
    type: 'Weak'
  },
  {
    id: '3',
    title: 'Derivative Rules Practice',
    subject: 'Calculus III',
    difficulty: 'Intermediate',
    estimatedTime: '20 mins',
    confidenceScore: 92,
    reason: 'Optimal time for spaced repetition review to improve long-term retention.',
    priority: 'Medium',
    type: 'Practice'
  },
  {
    id: '4',
    title: 'Introduction to Quantum Mechanics',
    subject: 'Physics',
    difficulty: 'Beginner',
    estimatedTime: '60 mins',
    confidenceScore: 85,
    reason: 'Matches your learning path progression and interest in advanced physics.',
    priority: 'Medium',
    type: 'Topic'
  },
  {
    id: '5',
    title: 'History of the Roman Empire',
    subject: 'World History',
    difficulty: 'Beginner',
    estimatedTime: '15 mins',
    confidenceScore: 96,
    reason: 'Pick up where you left off yesterday. You are 70% complete.',
    priority: 'High',
    type: 'Continue',
    progress: 70
  },
  {
    id: '6',
    title: 'Organic Chemistry Nomenclature',
    subject: 'Chemistry',
    difficulty: 'Advanced',
    estimatedTime: '40 mins',
    confidenceScore: 82,
    reason: 'Identified as a weak point from recent flashcard sessions.',
    priority: 'Medium',
    type: 'Weak'
  }
];

const RECENTLY_VIEWED = [
  { title: 'Thermodynamics Laws', subject: 'Physics', time: '2 hours ago' },
  { title: 'Data Structures: Trees', subject: 'Computer Science', time: '5 hours ago' },
  { title: 'Macroeconomics Intro', subject: 'Economics', time: 'Yesterday' },
];

const AI_INSIGHTS = [
  {
    icon: Clock,
    title: 'Peak Focus Time',
    desc: 'You perform best between 9:00 AM and 11:30 AM.',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20'
  },
  {
    icon: TrendingDown,
    title: 'Attention Needed',
    desc: 'Organic Chemistry quiz scores have dropped by 12% this week.',
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20'
  },
  {
    icon: FileQuestion,
    title: 'Quiz Strategy',
    desc: 'Reviewing incorrect answers within 24 hours improves retention by 40%.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20'
  },
  {
    icon: Layers,
    title: 'Flashcard Reminder',
    desc: 'You have 45 flashcards due for review today.',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20'
  },
  {
    icon: Calendar,
    title: 'Study Planner',
    desc: 'You are ahead of schedule for your Calculus exam.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20'
  }
];

const LEARNING_PATHS = [
  { level: 'Beginner', title: 'Foundations of Computer Science', progress: 100, completed: true },
  { level: 'Intermediate', title: 'Data Structures & Algorithms', progress: 65, completed: false },
  { level: 'Advanced', title: 'Machine Learning & AI', progress: 10, completed: false },
];

export function RecommendationsView() {
  const { meta } = useAccent();
  const [activeFilter, setActiveFilter] = React.useState('Most Relevant');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = React.useState(false);
  const [isEmpty, setIsEmpty] = React.useState(false);

  const filters = ['Most Relevant', 'Subject', 'Difficulty', 'Study Time', 'Recently Added'];

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'High': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'Medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Low': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    }
  };

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'Advanced': return 'text-purple-500';
      case 'Intermediate': return 'text-blue-500';
      case 'Beginner': return 'text-emerald-500';
    }
  };

  // Quick Action Buttons
  const renderQuickActions = () => (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {[
        { icon: MessageSquare, label: 'Start AI Tutor' },
        { icon: Layers, label: 'Open Flashcards' },
        { icon: FileQuestion, label: 'Take Quiz' },
        { icon: FileText, label: 'Review PDF' },
        { icon: Calendar, label: 'Resume Plan' }
      ].map((action, i) => (
        <button
          key={i}
          className={cn(
            "p-3 rounded-2xl flex flex-col items-center justify-center gap-2 text-xs font-bold transition-all hover:-translate-y-1 group",
            "bg-slate-100/50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 hover:border-indigo-500/30"
          )}
        >
          <div className="p-2.5 rounded-xl bg-slate-200/50 dark:bg-white/5 group-hover:bg-indigo-500/10 group-hover:text-indigo-500 transition-colors">
            <action.icon className="w-5 h-5" />
          </div>
          <span className="text-slate-600 dark:text-slate-300">{action.label}</span>
        </button>
      ))}
    </div>
  );

  const renderRecommendationCard = (rec: Recommendation, index: number) => (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={cn("p-5 relative overflow-hidden group flex flex-col h-full", glassStyles.card)}
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Sparkles className="w-24 h-24" />
      </div>
      
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex flex-wrap gap-2">
          <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-[10px] font-bold text-slate-600 dark:text-slate-300 border border-black/5 dark:border-white/10">
            {rec.subject}
          </span>
          <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold border", getPriorityColor(rec.priority))}>
            {rec.priority} Priority
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-[10px] font-bold border border-indigo-500/20">
          <Brain className="w-3 h-3" />
          {rec.confidenceScore}% Match
        </div>
      </div>

      <div className="flex-grow space-y-3 relative z-10">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
          {rec.title}
        </h3>
        
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            {rec.estimatedTime}
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <BarChart className="w-3.5 h-3.5" />
            <span className={getDifficultyColor(rec.difficulty)}>{rec.difficulty}</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {rec.reason}
        </p>

        {rec.progress !== undefined && (
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between text-[10px] font-bold">
              <span className="text-slate-500">Progress</span>
              <span className="text-indigo-500">{rec.progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 rounded-full" 
                style={{ width: `${rec.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/10 relative z-10">
        <button className={cn(
          "w-full py-2.5 rounded-xl text-xs font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95",
          meta.dark.button
        )}>
          <PlayCircle className="w-4 h-4" />
          Start Learning
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className={cn("p-6 md:p-8 relative overflow-hidden", glassStyles.container)}>
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500">
                <Brain className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold tracking-widest uppercase text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                AI Intelligence Center
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Personalized Recommendations
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
              Your personalized learning path, powered by AI. We analyze your performance, focus levels, and goals to suggest the most impactful study actions.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsEmpty(!isEmpty)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100/80 dark:bg-white/5 border border-black/5 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
            >
              Toggle Empty State
            </button>
            <button className={cn(
              "px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg flex items-center gap-2 transition-all hover:opacity-90 active:scale-95",
              meta.dark.button
            )}>
              <Zap className="w-4 h-4" />
              Generate Fresh Path
            </button>
          </div>
        </div>
      </div>

      {isEmpty ? (
        <div className={cn("p-12 text-center flex flex-col items-center justify-center min-h-[400px]", glassStyles.container)}>
          <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600 animate-[spin_10s_linear_infinite]" />
            <Brain className="w-8 h-8 text-slate-400 dark:text-slate-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            Gathering Intelligence
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
            We need a bit more data to generate personalized recommendations. Start by taking a quiz, reviewing some flashcards, or chatting with the AI Tutor.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button className={cn("px-6 py-3 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-2", meta.dark.button)}>
              <MessageSquare className="w-4 h-4" />
              Chat with Tutor
            </button>
            <button className="px-6 py-3 rounded-xl text-xs font-bold bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
              Take a Diagnostic Quiz
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Quick Actions */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                Quick Actions
              </h2>
              {renderQuickActions()}
            </div>

            {/* Daily AI Recommendations */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Star className="w-4 h-4 text-indigo-500" />
                  Daily Top Recommendations
                </h2>
                
                {/* Filters */}
                <div className="relative">
                  <button 
                    onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-black/5 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                  >
                    <Filter className="w-3.5 h-3.5" />
                    {activeFilter}
                  </button>
                  
                  <AnimatePresence>
                    {isFilterMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-48 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xl z-50"
                      >
                        {filters.map(filter => (
                          <button
                            key={filter}
                            onClick={() => {
                              setActiveFilter(filter);
                              setIsFilterMenuOpen(false);
                            }}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors",
                              activeFilter === filter 
                                ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" 
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
                            )}
                          >
                            {filter}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_RECOMMENDATIONS.filter(r => r.type === 'Topic' || r.type === 'Continue').map((rec, i) => (
                  <React.Fragment key={rec.id}>{renderRecommendationCard(rec, i)}</React.Fragment>
                ))}
              </div>
            </div>

            {/* Targeted Improvement (Weak Topics & Practice) */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Target className="w-4 h-4 text-rose-500" />
                Targeted Improvement
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_RECOMMENDATIONS.filter(r => r.type === 'Weak' || r.type === 'Practice').map((rec, i) => (
                  <React.Fragment key={rec.id}>{renderRecommendationCard(rec, i)}</React.Fragment>
                ))}
              </div>
            </div>

          </div>

          {/* Side Column: Insights & Paths */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* AI Insights Panel */}
            <div className={cn("p-6 space-y-5", glassStyles.container)}>
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-100 dark:border-white/5">
                <Info className="w-4 h-4 text-indigo-500" />
                AI Insights
              </div>
              
              <div className="space-y-4">
                {AI_INSIGHTS.map((insight, i) => (
                  <div key={i} className="flex gap-4 group cursor-default">
                    <div className={cn("mt-0.5 p-2 rounded-xl flex-shrink-0 transition-colors", insight.bg, insight.color)}>
                      <insight.icon className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                        {insight.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        {insight.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Paths */}
            <div className={cn("p-6 space-y-5", glassStyles.container)}>
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-100 dark:border-white/5">
                <Activity className="w-4 h-4 text-emerald-500" />
                Learning Paths
              </div>

              <div className="space-y-5">
                {LEARNING_PATHS.map((path, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          {path.level}
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 line-clamp-1">
                          {path.title}
                        </h4>
                      </div>
                      {path.completed ? (
                        <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-500">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-indigo-500">{path.progress}%</span>
                      )}
                    </div>
                    
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${path.progress}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className={cn("h-full rounded-full", path.completed ? "bg-emerald-500" : "bg-indigo-500")} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recently Viewed */}
            <div className={cn("p-6 space-y-4", glassStyles.container)}>
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-100 dark:border-white/5">
                <History className="w-4 h-4 text-slate-400" />
                Recently Viewed
              </div>

              <div className="space-y-3">
                {RECENTLY_VIEWED.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 transition-colors cursor-pointer group">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[10px] font-semibold text-slate-500 mt-0.5">
                        {item.subject}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
