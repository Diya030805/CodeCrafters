'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Flame,
  BookOpen,
  FileSearch,
  MessageSquare,
  Layers,
  FileQuestion,
  Award,
  Calendar,
  Sparkles,
  Zap,
  Target,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Filter,
  Check,
  ChevronRight,
  Brain,
  Lightbulb,
  ShieldCheck,
  Trophy,
  Activity,
  BarChart,
  Download,
  Eye,
  Sliders,
  X,
  PieChart as PieChartIcon,
  Medal,
  Star,
  Milestone
} from 'lucide-react';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart as ReBarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';

import { useAccent } from '@/components/accent-provider';
import { cn } from '@/lib/utils';
import { glassStyles } from '@/lib/glass';

// Filter type
type TimeRange = 'today' | '7days' | '30days' | 'month' | 'custom';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 dark:bg-black/95 backdrop-blur-xl border border-slate-700 dark:border-white/10 p-3 rounded-xl shadow-xl text-white min-w-[120px] z-50">
        {label && <p className="text-xs font-bold text-slate-300 mb-2 pb-2 border-b border-white/10">{label}</p>}
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || (entry.payload && entry.payload.fill) || '#F59E0B' }} />
                <span className="text-slate-400">{entry.name || entry.dataKey}:</span>
              </div>
              <span className="text-white">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};


export function AnalyticsView() {
  const { meta, accentColor } = useAccent();
  const [timeRange, setTimeRange] = React.useState<TimeRange>('30days');
  const [isComparing, setIsComparing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEmptyState, setIsEmptyState] = React.useState(false);
  const [customStartDate, setCustomStartDate] = React.useState('2026-07-01');
  const [customEndDate, setCustomEndDate] = React.useState('2026-07-24');
  const [showCustomDateModal, setShowCustomDateModal] = React.useState(false);
  const [selectedSubject, setSelectedSubject] = React.useState<string | null>(null);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Interactive Goal Tasks
  const [tasks, setTasks] = React.useState([
    { id: 1, title: 'Complete Linear Algebra Chapter 4 Problem Set', completed: true },
    { id: 2, title: 'Review AI Tutor Flashcards on Backpropagation', completed: true },
    { id: 3, title: 'Take Calculus III Practice Quiz #4', completed: true },
    { id: 4, title: 'Analyze 2 Neural Network Papers in PDF Analyzer', completed: false },
    { id: 5, title: 'Finalize Midterm Study Plan in Planner', completed: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    showToast('Goal task updated!');
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const goalProgressPercent = Math.round((completedCount / tasks.length) * 100);

  // Time filter logic
  const handleRangeChange = (range: TimeRange) => {
    if (range === 'custom') {
      setShowCustomDateModal(true);
    }
    setTimeRange(range);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast('Analytics refreshed with live activity log!');
    }, 500);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleExportReport = () => {
    showToast('Exporting Analytics PDF Summary Report...');
    setTimeout(() => {
      const element = document.createElement('a');
      const file = new Blob([
        `EducAI Analytics Report - ${timeRange.toUpperCase()}\n` +
        `Generated on: ${new Date().toLocaleDateString()}\n` +
        `Total Study Hours: 142.5 hrs\n` +
        `Learning Streak: 18 Days\n` +
        `Average Quiz Score: 91.4%\n` +
        `Focus Score: 94/100\n`
      ], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `EducAI_Analytics_Report_${timeRange}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 800);
  };

  // Time range data generator
  const timeData = React.useMemo(() => {
    switch (timeRange) {
      case 'today':
        return {
          studyHours: '4.5 hrs',
          streak: '18 Days',
          topicsCompleted: '3 / 4',
          pdfsAnalyzed: '2 PDFs',
          aiChats: '24 Queries',
          flashcards: '140 Cards',
          quizzes: '2 Quizzes',
          avgScore: '94.0%',
          weeklyProductivity: '96.2%',
          monthlyProgress: '+3.5%',
          studyHoursData: [
            { day: '8 AM', hours: 0.8, focus: 0.7, prevHours: 1.2, prevFocus: 1.0 },
            { day: '10 AM', hours: 1.5, focus: 1.4, prevHours: 1.0, prevFocus: 0.8 },
            { day: '1 PM', hours: 0.5, focus: 0.4, prevHours: 0.9, prevFocus: 0.7 },
            { day: '3 PM', hours: 1.2, focus: 1.1, prevHours: 0.8, prevFocus: 0.6 },
            { day: '6 PM', hours: 0.5, focus: 0.4, prevHours: 1.5, prevFocus: 1.2 },
          ],
          quizTrendData: [
            { quiz: 'Q1', score: 92, target: 80, prevScore: 88 },
            { quiz: 'Q2', score: 96, target: 80, prevScore: 90 },
          ]
        };
      case '7days':
        return {
          studyHours: '32.4 hrs',
          streak: '18 Days',
          topicsCompleted: '14 / 16',
          pdfsAnalyzed: '8 PDFs',
          aiChats: '56 Queries',
          flashcards: '380 Cards',
          quizzes: '9 Quizzes',
          avgScore: '92.5%',
          weeklyProductivity: '91.0%',
          monthlyProgress: '+8.4%',
          studyHoursData: [
            { day: 'Mon', hours: 4.2, focus: 3.8, prevHours: 3.0, prevFocus: 2.5 },
            { day: 'Tue', hours: 5.0, focus: 4.5, prevHours: 3.5, prevFocus: 2.9 },
            { day: 'Wed', hours: 3.8, focus: 3.2, prevHours: 4.0, prevFocus: 3.3 },
            { day: 'Thu', hours: 6.1, focus: 5.5, prevHours: 4.5, prevFocus: 3.7 },
            { day: 'Fri', hours: 4.5, focus: 4.0, prevHours: 5.0, prevFocus: 4.1 },
            { day: 'Sat', hours: 5.2, focus: 4.8, prevHours: 5.5, prevFocus: 4.5 },
            { day: 'Sun', hours: 3.6, focus: 3.0, prevHours: 6.0, prevFocus: 4.9 },
          ],
          quizTrendData: [
            { quiz: 'Quiz 1', score: 85, target: 80, prevScore: 78 },
            { quiz: 'Quiz 2', score: 88, target: 80, prevScore: 81 },
            { quiz: 'Quiz 3', score: 91, target: 80, prevScore: 84 },
            { quiz: 'Quiz 4', score: 89, target: 80, prevScore: 87 },
            { quiz: 'Quiz 5', score: 94, target: 80, prevScore: 90 },
            { quiz: 'Quiz 6', score: 96, target: 80, prevScore: 93 },
          ]
        };
      case 'month':
      case '30days':
      case 'custom':
      default:
        return {
          studyHours: '142.5 hrs',
          streak: '18 Days',
          topicsCompleted: '64 / 80',
          pdfsAnalyzed: '29 PDFs',
          aiChats: '184 Queries',
          flashcards: '1,240 Cards',
          quizzes: '38 Quizzes',
          avgScore: '91.4%',
          weeklyProductivity: '88.5%',
          monthlyProgress: '+24.8%',
          studyHoursData: [
            { day: 'W1', hours: 28.5, focus: 25.0, prevHours: 25.0, prevFocus: 22.0 },
            { day: 'W2', hours: 34.2, focus: 31.0, prevHours: 27.0, prevFocus: 23.5 },
            { day: 'W3', hours: 38.0, focus: 34.5, prevHours: 29.0, prevFocus: 25.0 },
            { day: 'W4', hours: 41.8, focus: 38.2, prevHours: 31.0, prevFocus: 26.5 },
          ],
          quizTrendData: [
            { quiz: 'Test 1', score: 78, target: 80, prevScore: 72 },
            { quiz: 'Test 2', score: 82, target: 80, prevScore: 74 },
            { quiz: 'Test 3', score: 86, target: 80, prevScore: 76 },
            { quiz: 'Test 4', score: 84, target: 80, prevScore: 78 },
            { quiz: 'Test 5', score: 91, target: 80, prevScore: 80 },
            { quiz: 'Test 6', score: 89, target: 80, prevScore: 82 },
            { quiz: 'Test 7', score: 95, target: 80, prevScore: 84 },
            { quiz: 'Test 8', score: 93, target: 80, prevScore: 86 },
            { quiz: 'Test 9', score: 98, target: 80, prevScore: 88 },
          ]
        };
    }
  }, [timeRange]);

  // Subject Wise Data
  const subjectProgressData = [
    { name: 'Computer Science', progress: 94, hours: 48.5, color: '#3B82F6' },
    { name: 'Quantum Physics', progress: 86, hours: 32.0, color: '#8B5CF6' },
    { name: 'Calculus III', progress: 88, hours: 26.5, color: '#10B981' },
    { name: 'Organic Chemistry', progress: 72, hours: 21.0, color: '#F59E0B' },
    { name: 'Neuroscience', progress: 80, hours: 14.5, color: '#EC4899' },
  ];

  // Subject Donut Data
  const subjectPieData = [
    { name: 'Computer Science', value: 48.5, color: '#3B82F6' },
    { name: 'Quantum Physics', value: 32.0, color: '#8B5CF6' },
    { name: 'Calculus III', value: 26.5, color: '#10B981' },
    { name: 'Organic Chemistry', value: 21.0, color: '#F59E0B' },
    { name: 'Neuroscience', value: 14.5, color: '#EC4899' },
  ];

  // Monthly learning line data
  const monthlyLearningData = [
    { month: 'Jan', topics: 12, hours: 24, prevHours: 18 },
    { month: 'Feb', topics: 22, hours: 48, prevHours: 36 },
    { month: 'Mar', topics: 35, hours: 75, prevHours: 52 },
    { month: 'Apr', topics: 48, hours: 102, prevHours: 80 },
    { month: 'May', topics: 58, hours: 124, prevHours: 110 },
    { month: 'Jun', topics: 64, hours: 142.5, prevHours: 130 },
  ];

  // Daily Activity Heatmap Matrix (5 weeks x 7 days)
  const heatmapWeeks = React.useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weeks = [];
    const seedMatrix = [
      [2, 3, 4, 3, 2, 1, 0],
      [3, 4, 4, 2, 3, 2, 1],
      [1, 3, 2, 4, 4, 3, 2],
      [4, 3, 4, 4, 3, 2, 0],
      [3, 4, 3, 4, 4, 3, 2]
    ];

    for (let w = 0; w < 5; w++) {
      const weekDays = [];
      for (let d = 0; d < 7; d++) {
        const level = seedMatrix[w][d];
        const hours = level === 0 ? 0 : (level * 1.5 + (d % 2) * 0.4).toFixed(1);
        weekDays.push({
          day: days[d],
          week: w + 1,
          level,
          hours,
          date: `Jul ${w * 7 + d + 1}`
        });
      }
      weeks.push(weekDays);
    }
    return weeks;
  }, []);

  return (
    <div className="space-y-8 pb-16">
      {/* Toast notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl bg-slate-900/90 dark:bg-black/90 backdrop-blur-xl border border-emerald-500/30 text-white text-xs font-semibold shadow-2xl flex items-center gap-3"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Date Selector Modal */}
      <AnimatePresence>
        {showCustomDateModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={cn("p-6 max-w-md w-full space-y-4", glassStyles.container)}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  Select Custom Date Range
                </h3>
                <button
                  onClick={() => setShowCustomDateModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Start Date</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">End Date</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={() => setShowCustomDateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowCustomDateModal(false);
                    showToast(`Custom range applied: ${customStartDate} to ${customEndDate}`);
                  }}
                  className={cn("px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md", meta.dark.button)}
                >
                  Apply Filter
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className={cn("p-6 md:p-8 relative overflow-hidden", glassStyles.container)}>
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
                <BarChart3 className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold tracking-widest uppercase text-amber-600 dark:text-amber-400">
                Performance Intelligence
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Learning Analytics Dashboard
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
              Track your study performance, quiz scores, AI interactions, retention metrics, and curriculum progress with real-time intelligence.
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsEmptyState(!isEmptyState)}
              className={cn(
                "px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border",
                isEmptyState
                  ? "bg-amber-500 text-white border-amber-500 shadow-md"
                  : "bg-slate-200/50 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border-black/5 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/[0.08]"
              )}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isEmptyState ? 'Show Active Data' : 'Test Empty State'}</span>
            </button>

            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-200/50 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border border-black/5 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/[0.08] transition-all flex items-center gap-2"
            >
              <RefreshCw className={cn("w-3.5 h-3.5", isLoading && "animate-spin text-amber-500")} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleExportReport}
              className={cn(
                "px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-lg flex items-center gap-2 hover:opacity-95 active:scale-95",
                meta.dark.button
              )}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Time Filters Bar */}
        <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-white/[0.06] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Filter className="w-3.5 h-3.5 text-amber-500" />
            <span>Time Window:</span>
          </div>

          
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsComparing(!isComparing)}
              className={cn(
                "px-3.5 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 mr-4",
                isComparing
                  ? "bg-indigo-500 text-white border-indigo-500 shadow-md"
                  : "bg-slate-200/40 dark:bg-white/[0.03] text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-200/70 dark:hover:bg-white/[0.06]"
              )}
            >
              <Activity className="w-3.5 h-3.5" />
              Compare Periods
            </button>

            {[
              { id: 'today', label: 'Today' },
              { id: '7days', label: 'Last 7 Days' },
              { id: '30days', label: 'Last 30 Days' },
              { id: 'month', label: 'This Month' },
              { id: 'custom', label: 'Custom Range' },
            ].map((tab) => {
              const active = timeRange === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleRangeChange(tab.id as TimeRange)}
                  className={cn(
                    "px-3.5 py-2 rounded-xl text-xs font-bold transition-all relative",
                    active
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md"
                      : "bg-slate-200/40 dark:bg-white/[0.03] text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-white/[0.06]"
                  )}
                >
                  {tab.label}
                  {tab.id === 'custom' && timeRange === 'custom' && (
                    <span className="ml-1 text-[10px] opacity-75">
                      ({customStartDate.slice(5)} to {customEndDate.slice(5)})
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Empty State Overlay if toggled */}
      {isEmptyState ? (
        <div className={cn("p-12 text-center space-y-6", glassStyles.container)}>
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 mx-auto flex items-center justify-center">
            <BarChart3 className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Learning Activity Logged Yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Start studying using the AI Tutor, Flashcards, or PDF Analyzer to log your progress metrics in real-time.
            </p>
          </div>
          <div className="pt-4">
            <button
              onClick={() => {
                setIsEmptyState(false);
                showToast('Sample realistic mock data loaded!');
              }}
              className={cn("px-5 py-3 rounded-xl text-xs font-bold text-white shadow-lg inline-flex items-center gap-2", meta.dark.button)}
            >
              <Zap className="w-4 h-4" />
              <span>Load Seed Study Metrics</span>
            </button>
          </div>
        </div>
      ) : isLoading ? (
        /* Loading Skeletons */
        <div className="space-y-8 animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-slate-200/60 dark:bg-white/[0.04]" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 rounded-3xl bg-slate-200/60 dark:bg-white/[0.04]" />
            <div className="h-80 rounded-3xl bg-slate-200/60 dark:bg-white/[0.04]" />
          </div>
        </div>
      ) : (
        <>
          {/* SECTION 1: 10 PREMIUM METRIC CARDS across 6 Core Dashboard Sections */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Performance Overview Metrics
              </h2>
              <span className="text-[11px] font-medium text-emerald-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live Sync
              </span>
            </div>

            <motion.div
              key={timeRange}
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.05 } }
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
            >
              {/* Card 1: Total Study Hours */}
              <motion.div variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }} className={cn("p-4 relative overflow-hidden transition-all duration-300 hover:-translate-y-1", glassStyles.card)}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Learning Overview
                  </span>
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {timeData.studyHours}
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-500 flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" />
                    <span>+14.2% vs last period</span>
                  </div>
                </div>
                <div className="mt-3 text-[10px] text-slate-400 font-medium">Total Study Hours</div>
              </motion.div>

              {/* Card 2: Learning Streak */}
              <motion.div variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }} className={cn("p-4 relative overflow-hidden transition-all duration-300 hover:-translate-y-1", glassStyles.card)}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Streak & Habit
                  </span>
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                    <Flame className="w-4 h-4" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    {timeData.streak}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-bold border border-amber-500/20">
                      Active
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Best: 24 Days
                  </div>
                </div>
                <div className="mt-3 text-[10px] text-slate-400 font-medium">Learning Streak</div>
              </motion.div>

              {/* Card 3: Topics Completed */}
              <motion.div variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }} className={cn("p-4 relative overflow-hidden transition-all duration-300 hover:-translate-y-1", glassStyles.card)}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Study Performance
                  </span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                    <BookOpen className="w-4 h-4" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {timeData.topicsCompleted}
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>80% Syllabus Mastery</span>
                  </div>
                </div>
                <div className="mt-3 text-[10px] text-slate-400 font-medium">Topics Completed</div>
              </motion.div>

              {/* Card 4: PDFs Analyzed */}
              <motion.div variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }} className={cn("p-4 relative overflow-hidden transition-all duration-300 hover:-translate-y-1", glassStyles.card)}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Library Intelligence
                  </span>
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                    <FileSearch className="w-4 h-4" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {timeData.pdfsAnalyzed}
                  </div>
                  <div className="text-[11px] font-semibold text-purple-500">
                    412 Pages Extracted
                  </div>
                </div>
                <div className="mt-3 text-[10px] text-slate-400 font-medium">PDFs Analyzed</div>
              </motion.div>

              {/* Card 5: AI Chats */}
              <motion.div variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }} className={cn("p-4 relative overflow-hidden transition-all duration-300 hover:-translate-y-1", glassStyles.card)}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    AI Tutor Usage
                  </span>
                  <div className="p-2 rounded-xl bg-pink-500/10 text-pink-500">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {timeData.aiChats}
                  </div>
                  <div className="text-[11px] font-semibold text-pink-500">
                    12.4h Interactive Tutoring
                  </div>
                </div>
                <div className="mt-3 text-[10px] text-slate-400 font-medium">AI Tutor Sessions</div>
              </motion.div>

              {/* Card 6: Flashcards Reviewed */}
              <motion.div variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }} className={cn("p-4 relative overflow-hidden transition-all duration-300 hover:-translate-y-1", glassStyles.card)}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Flashcard Stats
                  </span>
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {timeData.flashcards}
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-500">
                    89% Retention Rate
                  </div>
                </div>
                <div className="mt-3 text-[10px] text-slate-400 font-medium">Flashcards Reviewed</div>
              </motion.div>

              {/* Card 7: Quizzes Completed */}
              <motion.div variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }} className={cn("p-4 relative overflow-hidden transition-all duration-300 hover:-translate-y-1", glassStyles.card)}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Quiz Performance
                  </span>
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500">
                    <FileQuestion className="w-4 h-4" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {timeData.quizzes}
                  </div>
                  <div className="text-[11px] font-semibold text-cyan-500">
                    94% Completion Pass Rate
                  </div>
                </div>
                <div className="mt-3 text-[10px] text-slate-400 font-medium">Quizzes Completed</div>
              </motion.div>

              {/* Card 8: Average Quiz Score */}
              <motion.div variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }} className={cn("p-4 relative overflow-hidden transition-all duration-300 hover:-translate-y-1", glassStyles.card)}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Quiz Performance
                  </span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                    <Award className="w-4 h-4" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {timeData.avgScore}
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-500 flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" />
                    <span>+4.2% score improvement</span>
                  </div>
                </div>
                <div className="mt-3 text-[10px] text-slate-400 font-medium">Average Quiz Score</div>
              </motion.div>

              {/* Card 9: Weekly Productivity */}
              <motion.div variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }} className={cn("p-4 relative overflow-hidden transition-all duration-300 hover:-translate-y-1", glassStyles.card)}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Efficiency
                  </span>
                  <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                    <Zap className="w-4 h-4" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {timeData.weeklyProductivity}
                  </div>
                  <div className="text-[11px] font-semibold text-orange-500">
                    Peak: 10 AM - 1 PM
                  </div>
                </div>
                <div className="mt-3 text-[10px] text-slate-400 font-medium">Weekly Productivity</div>
              </motion.div>

              {/* Card 10: Monthly Progress */}
              <motion.div variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }} className={cn("p-4 relative overflow-hidden transition-all duration-300 hover:-translate-y-1", glassStyles.card)}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Study Planner Progress
                  </span>
                  <div className="p-2 rounded-xl bg-teal-500/10 text-teal-500">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {timeData.monthlyProgress}
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-500">
                    3 Days Ahead of Schedule
                  </div>
                </div>
                <div className="mt-3 text-[10px] text-slate-400 font-medium">Monthly Progress</div>
              </motion.div>
            </motion.div>
          </div>

          {/* SECTION 2: 6 INTERACTIVE CHARTS */}
          <div className="space-y-6 pt-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Interactive Analytics Charts
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart 1: Weekly Study Hours */}
              <div className={cn("p-6 space-y-4", glassStyles.container)}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-500" />
                      Weekly Study Hours
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Total study duration vs deep focus hours
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-amber-500">
                      <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> Total
                    </span>
                    <span className="flex items-center gap-1.5 text-blue-500">
                      <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" /> Deep Focus
                    </span>
                  </div>
                </div>

                <div className="h-64 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart data={timeData.studyHoursData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} unit="h" />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(100, 100, 100, 0.1)" }} />
                      <Bar dataKey="hours" fill="#F59E0B" radius={[6, 6, 0, 0]} name="Total Hours" />
                      <Bar dataKey="focus" fill="#3B82F6" radius={[6, 6, 0, 0]} name="Focus Hours" />
                      {isComparing && (
                        <>
                          <Bar dataKey="prevHours" fill="#F59E0B" fillOpacity={0.3} radius={[6, 6, 0, 0]} name="Prev Total" />
                          <Bar dataKey="prevFocus" fill="#3B82F6" fillOpacity={0.3} radius={[6, 6, 0, 0]} name="Prev Focus" />
                        </>
                      )}
                    </ReBarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Monthly Learning Progress */}
              <div className={cn("p-6 space-y-4", glassStyles.container)}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      Monthly Learning Progress
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Cumulative topic completions and total learning hours
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    +142.5 hrs Total
                  </span>
                </div>

                <div className="h-64 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyLearningData}>
                      <defs>
                        <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(100, 100, 100, 0.1)" }} />
                      <Area type="monotone" dataKey="hours" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" name="Hours" />
                      <Line type="monotone" dataKey="topics" stroke="#3B82F6" strokeWidth={2} name="Topics" />
                      {isComparing && (
                        <Area type="monotone" dataKey="prevHours" stroke="#94A3B8" strokeDasharray="4 4" strokeWidth={2} fillOpacity={0.1} fill="#94A3B8" name="Prev Hours" />
                      )}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 3: Quiz Score Trend */}
              <div className={cn("p-6 space-y-4", glassStyles.container)}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Award className="w-4 h-4 text-cyan-500" />
                      Quiz Score Trend
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Test scores over recent quizzes with 80% passing target
                    </p>
                  </div>
                  <span className="text-xs font-bold text-cyan-500 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                    Avg: 91.4%
                  </span>
                </div>

                <div className="h-64 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeData.quizTrendData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="quiz" stroke="#94A3B8" fontSize={11} tickLine={false} />
                      <YAxis domain={[50, 100]} stroke="#94A3B8" fontSize={11} tickLine={false} unit="%" />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(100, 100, 100, 0.1)" }} />
                      <ReferenceLine y={80} stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'Target (80%)', fill: '#EF4444', fontSize: 10 }} />
                      <Line type="monotone" dataKey="score" stroke="#06B6D4" strokeWidth={3} dot={{ r: 5, fill: '#06B6D4' }} activeDot={{ r: 7 }} name="Score %" />
                      {isComparing && (
                        <Line type="monotone" dataKey="prevScore" stroke="#94A3B8" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 4, fill: '#94A3B8' }} activeDot={{ r: 6 }} name="Prev Score %" />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 4: Subject-wise Progress */}
              <div className={cn("p-6 space-y-4", glassStyles.container)}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-purple-500" />
                      Subject-wise Progress
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Mastery level across key academic subjects
                    </p>
                  </div>
                  <span className="text-xs font-bold text-purple-500 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                    5 Subjects
                  </span>
                </div>

                <div className="space-y-4 pt-2">
                  {subjectProgressData.map((sub) => (
                    <div
                      key={sub.name}
                      onClick={() => setSelectedSubject(selectedSubject === sub.name ? null : sub.name)}
                      className={cn(
                        "p-3 rounded-2xl border transition-all cursor-pointer hover:border-purple-500/40",
                        selectedSubject === sub.name
                          ? "bg-purple-500/10 border-purple-500"
                          : "bg-slate-100/50 dark:bg-white/[0.02] border-black/5 dark:border-white/5"
                      )}
                    >
                      <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                        <span className="text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sub.color }} />
                          {sub.name}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-500 dark:text-slate-400">{sub.hours} hrs</span>
                          <span className="font-black text-slate-900 dark:text-white">{sub.progress}%</span>
                        </div>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${sub.progress}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: sub.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart 5: Daily Activity Heatmap */}
              <div className={cn("p-6 space-y-4 lg:col-span-2", glassStyles.container)}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Flame className="w-4 h-4 text-amber-500" />
                      Daily Activity Heatmap
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      GitHub-style study activity intensity over the past 5 weeks
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <span>Less</span>
                    <div className="flex gap-1">
                      {['#334155', '#93C5FD', '#3B82F6', '#2563EB', '#1D4ED8'].map((c, i) => (
                        <span key={i} className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <span>More</span>
                  </div>
                </div>

                <div className="overflow-x-auto pt-2">
                  <div className="min-w-[600px] grid grid-cols-5 gap-3">
                    {heatmapWeeks.map((week, wIndex) => (
                      <div key={wIndex} className="space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                          Week {wIndex + 1}
                        </span>
                        <div className="grid grid-cols-1 gap-2">
                          {week.map((day, dIndex) => {
                            const colors = [
                              'bg-slate-200/60 dark:bg-white/[0.05]',
                              'bg-amber-500/30 text-amber-900 dark:text-amber-200',
                              'bg-amber-500/60 text-white',
                              'bg-amber-500/80 text-white',
                              'bg-amber-500 text-white font-bold shadow-md shadow-amber-500/20'
                            ];
                            return (
                              <div
                                key={dIndex}
                                onClick={() => showToast(`${day.date}: ${day.hours} study hours logged`)}
                                className={cn(
                                  "p-2.5 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-all hover:scale-[1.03]",
                                  colors[day.level]
                                )}
                              >
                                <span>{day.day}</span>
                                <span className="text-[10px] opacity-90">{day.hours}h</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chart 6: Time Spent Per Subject (Donut Chart) */}
              <div className={cn("p-6 space-y-4 lg:col-span-2", glassStyles.container)}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <PieChartIcon className="w-4 h-4 text-pink-500" />
                      Time Spent Per Subject Distribution
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Total study duration allocated by subject category
                    </p>
                  </div>
                  <span className="text-xs font-bold text-pink-500 bg-pink-500/10 px-2.5 py-1 rounded-full border border-pink-500/20">
                    142.5 Total Hours
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-2">
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={subjectPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {subjectPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(100, 100, 100, 0.1)" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-3">
                    {subjectPieData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100/50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="font-semibold text-slate-900 dark:text-white">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-500 dark:text-slate-400">{item.value} hrs</span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {Math.round((item.value / 142.5) * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: AI INSIGHTS PANEL */}
          <div className={cn("p-6 md:p-8 space-y-6 relative overflow-hidden", glassStyles.container)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    AI Intelligence & Learning Insights
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Real-time automated cognitive recommendations to boost study efficiency
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-bold flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5" />
                AI Active
              </span>
            </div>

            {/* AI Insight Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className={cn("p-4 space-y-1.5", glassStyles.innerCard)}>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Strongest Subject
                </span>
                <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Computer Science (96% Mastery)
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">48.5 hrs logged with 98% quiz average.</p>
              </div>

              <div className={cn("p-4 space-y-1.5", glassStyles.innerCard)}>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Weakest Subject
                </span>
                <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  Organic Chemistry (72% Mastery)
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Needs flashcard spaced-repetition review.</p>
              </div>

              <div className={cn("p-4 space-y-1.5", glassStyles.innerCard)}>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Recommended Next Topic
                </span>
                <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-purple-500" />
                  Deep Learning & Backpropagation
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Optimal follow-up for CS & Math curriculum.</p>
              </div>

              <div className={cn("p-4 space-y-1.5", glassStyles.innerCard)}>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Productivity Trend
                </span>
                <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  +18.4% Peak Morning Velocity
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Highest concentration recorded between 10 AM - 1 PM.</p>
              </div>

              <div className={cn("p-4 space-y-1.5", glassStyles.innerCard)}>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Focus Score
                </span>
                <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  94 / 100 Focus Index
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Based on focus-timer sessions with low distractions.</p>
              </div>

              <div className={cn("p-4 space-y-1.5", glassStyles.innerCard)}>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Learning Efficiency
                </span>
                <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  91.2% Recall Retention
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Measured across flashcard reviews & quiz intervals.</p>
              </div>
            </div>

            {/* AI Recommendations Action Cards */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Actionable AI Recommendations
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-slate-900 dark:text-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Organic Chemistry Review Needed
                    </span>
                    <button
                      onClick={() => showToast('Navigating to AI Flashcards for Organic Chemistry...')}
                      className="text-[11px] font-bold underline text-amber-500 hover:text-amber-400"
                    >
                      Start Deck
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Your retention on Organic Chemistry reaction mechanisms dropped to 72%. Review 15 targeted flashcards now to maintain recall stability.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-slate-900 dark:text-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5" /> Schedule Calculus III Quiz #4
                    </span>
                    <button
                      onClick={() => showToast('Opening AI Quiz Generator...')}
                      className="text-[11px] font-bold underline text-blue-500 hover:text-blue-400"
                    >
                      Generate Quiz
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    You completed double integrals unit 2 days ago. Generate an AI quiz to solidify multi-variable calculus concepts before Friday.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: GOAL TRACKING & REMAINING TASKS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Goal Tracking Card */}
            <div className={cn("p-6 space-y-6 lg:col-span-2", glassStyles.container)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      Curriculum Goal Tracking
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Primary academic goal and task completion status
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold">
                  Target: Aug 28, 2026
                </span>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-100/60 dark:bg-white/[0.03] border border-black/5 dark:border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Current Goal</span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Complete Masters Curriculum in AI & Autonomous Systems
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black text-emerald-500">{goalProgressPercent}%</span>
                      <span className="text-[10px] text-slate-400 block">Completed</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${goalProgressPercent}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-emerald-500 rounded-full"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span>Estimated Completion: August 28, 2026</span>
                    <span>{completedCount} of {tasks.length} Tasks Done</span>
                  </div>
                </div>

                {/* Remaining Tasks Checklist */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Remaining Tasks
                  </h4>

                  <div className="space-y-2">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        className={cn(
                          "p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs font-medium",
                          task.completed
                            ? "bg-emerald-500/5 border-emerald-500/20 text-slate-500 line-through"
                            : "bg-slate-100/40 dark:bg-white/[0.02] border-black/5 dark:border-white/5 text-slate-900 dark:text-white hover:border-emerald-500/30"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-4 h-4 rounded-md border flex items-center justify-center transition-all",
                            task.completed
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : "border-slate-400 dark:border-slate-600"
                          )}>
                            {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span>{task.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{task.completed ? 'Done' : 'Pending'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 5: ACHIEVEMENT SUMMARY */}
            <div className={cn("p-6 space-y-6", glassStyles.container)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      Achievements
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Badges, milestones & records
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Badges */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Medal className="w-8 h-8 text-amber-500" />
                  <div>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">12 Badges</span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 block font-bold">Total Earned</span>
                  </div>
                </div>
                <Star className="w-5 h-5 text-amber-500 animate-pulse" />
              </div>

              {/* Study Milestones */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Study Milestones
                </h4>

                <div className="space-y-2">
                  {[
                    { name: '100 Hours Club', desc: 'Crossed 100 cumulative study hours', icon: Clock, color: 'text-blue-500' },
                    { name: 'Quiz Master', desc: 'Scored 90%+ in 10 consecutive quizzes', icon: Award, color: 'text-cyan-500' },
                    { name: 'Night Owl Scholar', desc: 'Completed 20 late-night focus sessions', icon: Sparkles, color: 'text-purple-500' },
                    { name: '14-Day Streak', desc: 'Maintained non-stop learning for 2 weeks', icon: Flame, color: 'text-amber-500' },
                  ].map((m) => (
                    <div key={m.name} className="p-3 rounded-xl bg-slate-100/50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg bg-slate-200/60 dark:bg-white/5", m.color)}>
                        <m.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white">{m.name}</h5>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">{m.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personal Best Records */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Personal Best Records
                </h4>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-slate-100/50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5">
                    <span className="text-[10px] text-slate-400 block font-medium">Longest Streak</span>
                    <span className="text-base font-black text-amber-500">24 Days</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-100/50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5">
                    <span className="text-[10px] text-slate-400 block font-medium">Max Daily Hours</span>
                    <span className="text-base font-black text-blue-500">7.8 hrs</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-100/50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5">
                    <span className="text-[10px] text-slate-400 block font-medium">Top Quiz Score</span>
                    <span className="text-base font-black text-emerald-500">100%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-100/50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5">
                    <span className="text-[10px] text-slate-400 block font-medium">Highest Focus</span>
                    <span className="text-base font-black text-purple-500">98 / 100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
