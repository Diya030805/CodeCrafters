'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Target, 
  Flame, 
  TrendingUp, 
  Plus, 
  Check, 
  X, 
  Edit3, 
  Trash2, 
  RefreshCw, 
  AlertTriangle, 
  BookOpen, 
  Layers, 
  Award, 
  Lightbulb, 
  Bell, 
  ChevronRight, 
  ChevronLeft, 
  Filter, 
  Coffee, 
  Zap, 
  CalendarDays, 
  ListFilter, 
  PieChart, 
  Search, 
  CheckSquare, 
  Hourglass, 
  ArrowUpRight, 
  Flag, 
  Sun, 
  Brain, 
  BarChart3,
  SlidersHorizontal,
  Bookmark
} from 'lucide-react';

import { Navbar } from '@/components/landing/navbar';
import { Sidebar } from '@/components/dashboard/sidebar';
import { cn } from '@/lib/utils';
import { glassStyles } from '@/lib/glass';
import { useAccent } from '@/components/accent-provider';
import { useTheme } from '@/components/theme-provider';
import { Tooltip } from '@/components/ui/tooltip';

import { 
  StudyGoalPlan, 
  StudyTask, 
  DeadlineItem, 
  AIRecommendation, 
  ReminderItem, 
  PriorityLevel, 
  TaskType, 
  TaskStatus 
} from '@/src/types/planner';

import { 
  initialStudyPlans, 
  initialTasks, 
  initialDeadlines, 
  initialAIRecommendations, 
  initialReminders 
} from '@/src/data/mockPlannerData';

// Helper date utilities
const getOffsetDateStr = (days: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

const formatDateLabel = (dateStr: string): string => {
  if (!dateStr) return '';
  const dateObj = new Date(dateStr + 'T00:00:00');
  const todayStr = new Date().toISOString().split('T')[0];
  
  if (dateStr === todayStr) return 'Today';
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (dateStr === tomorrow.toISOString().split('T')[0]) return 'Tomorrow';
  
  return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getDaysUntil = (dateStr: string): number => {
  const target = new Date(dateStr + 'T00:00:00').getTime();
  const today = new Date(new Date().toISOString().split('T')[0] + 'T00:00:00').getTime();
  const diffTime = target - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export function StudyPlannerView() {
  const { darkMode } = useTheme();
  const { accentColor, meta } = useAccent();
  const activeAccentClasses = darkMode ? meta.dark : meta.light;

  // Primary State
  const [plans, setPlans] = React.useState<StudyGoalPlan[]>(initialStudyPlans);
  const [activePlanId, setActivePlanId] = React.useState<string>(initialStudyPlans[0]?.id || '');
  const [tasks, setTasks] = React.useState<StudyTask[]>(initialTasks);
  const [deadlines, setDeadlines] = React.useState<DeadlineItem[]>(initialDeadlines);
  const [aiRecommendations, setAiRecommendations] = React.useState<AIRecommendation[]>(initialAIRecommendations);
  const [reminders, setReminders] = React.useState<ReminderItem[]>(initialReminders);

  // Tab & Filter States
  const [activePlannerTab, setActivePlannerTab] = React.useState<'overview' | 'calendar' | 'recommendations' | 'reminders'>('overview');
  const [taskFilterStatus, setTaskFilterStatus] = React.useState<'all' | 'pending' | 'completed' | 'skipped'>('all');
  const [calendarSubView, setCalendarSubView] = React.useState<'monthly' | 'weekly' | 'daily'>('monthly');
  const [reminderCategoryFilter, setReminderCategoryFilter] = React.useState<'all' | 'exam' | 'assignment' | 'revision' | 'quiz'>('all');

  // Modals & Interactive States
  const [isCreatePlanModalOpen, setIsCreatePlanModalOpen] = React.useState(false);
  const [isGeneratingPlanAI, setIsGeneratingPlanAI] = React.useState(false);
  const [generationStepText, setGenerationStepText] = React.useState('');
  
  // Create Plan Form Fields
  const [newPlanGoal, setNewPlanGoal] = React.useState('');
  const [newPlanSubject, setNewPlanSubject] = React.useState('');
  const [newPlanTargetDate, setNewPlanTargetDate] = React.useState(getOffsetDateStr(14));
  const [newPlanDailyHours, setNewPlanDailyHours] = React.useState<number>(2.5);
  const [newPlanPriority, setNewPlanPriority] = React.useState<PriorityLevel>('High');

  // Task Editing & Rescheduling
  const [editingTask, setEditingTask] = React.useState<StudyTask | null>(null);
  const [reschedulingTask, setReschedulingTask] = React.useState<StudyTask | null>(null);
  const [rescheduleDate, setRescheduleDate] = React.useState(getOffsetDateStr(1));
  const [rescheduleTime, setRescheduleTime] = React.useState('10:00 AM');

  // New Deadline Modal
  const [isAddDeadlineModalOpen, setIsAddDeadlineModalOpen] = React.useState(false);
  const [newDeadlineTitle, setNewDeadlineTitle] = React.useState('');
  const [newDeadlineSubject, setNewDeadlineSubject] = React.useState('');
  const [newDeadlineDate, setNewDeadlineDate] = React.useState(getOffsetDateStr(7));
  const [newDeadlineType, setNewDeadlineType] = React.useState<'exam' | 'assignment' | 'project' | 'quiz'>('exam');
  const [newDeadlinePriority, setNewDeadlinePriority] = React.useState<PriorityLevel>('High');

  // New Reminder Modal
  const [isAddReminderModalOpen, setIsAddReminderModalOpen] = React.useState(false);
  const [newReminderTitle, setNewReminderTitle] = React.useState('');
  const [newReminderType, setNewReminderType] = React.useState<'exam' | 'assignment' | 'revision' | 'quiz'>('assignment');
  const [newReminderDate, setNewReminderDate] = React.useState(getOffsetDateStr(2));
  const [newReminderTime, setNewReminderTime] = React.useState('05:00 PM');
  const [newReminderPriority, setNewReminderPriority] = React.useState<PriorityLevel>('Medium');

  // Calendar selected date filter
  const [selectedCalendarDate, setSelectedCalendarDate] = React.useState<string>(getOffsetDateStr(0));

  // Toast feedback
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Sound Chime Effect for Task Completion
  const playCompletionChime = () => {
    if (typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      
      const playNote = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.12, start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + duration);
      };

      playNote(523.25, now, 0.2); // C5
      playNote(659.25, now + 0.08, 0.2); // E5
      playNote(783.99, now + 0.16, 0.35); // G5
    } catch (e) {
      // Audio fallback
    }
  };

  const fireConfetti = () => {
    if (typeof window === 'undefined') return;
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899']
    });
  };

  // ----------------------------------------------------------------------
  // TASK MANAGEMENT HANDLERS
  // ----------------------------------------------------------------------

  const handleToggleCompleteTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newStatus: TaskStatus = t.status === 'completed' ? 'pending' : 'completed';
          if (newStatus === 'completed') {
            playCompletionChime();
            fireConfetti();
            showToast(`Task completed! Keep up the momentum 🎉`);
          } else {
            showToast(`Task marked as pending.`);
          }
          return { ...t, status: newStatus };
        }
        return t;
      })
    );
  };

  const handleSkipTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          showToast(`Task skipped. Schedule updated.`);
          return { ...t, status: 'skipped' };
        }
        return t;
      })
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    showToast(`Task deleted.`);
  };

  const handleOpenRescheduleModal = (task: StudyTask) => {
    setReschedulingTask(task);
    setRescheduleDate(task.scheduledDate);
    setRescheduleTime(task.scheduledTime);
  };

  const handleConfirmReschedule = () => {
    if (!reschedulingTask) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === reschedulingTask.id
          ? { ...t, scheduledDate: rescheduleDate, scheduledTime: rescheduleTime, status: 'pending' }
          : t
      )
    );
    showToast(`Task rescheduled to ${formatDateLabel(rescheduleDate)} at ${rescheduleTime}`);
    setReschedulingTask(null);
  };

  const handleSaveEditTask = () => {
    if (!editingTask) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === editingTask.id ? editingTask : t))
    );
    showToast(`Task updated successfully.`);
    setEditingTask(null);
  };

  // ----------------------------------------------------------------------
  // AI STUDY PLAN GENERATION
  // ----------------------------------------------------------------------

  const handleGenerateAIStudyPlan = async () => {
    if (!newPlanGoal.trim()) {
      showToast('Please enter a learning goal or title.');
      return;
    }

    setIsGeneratingPlanAI(true);
    setGenerationStepText('Analyzing study objective & syllabus complexity...');

    await new Promise((r) => setTimeout(r, 600));
    setGenerationStepText('Mapping key topics & building spaced repetition curves...');

    await new Promise((r) => setTimeout(r, 700));
    setGenerationStepText('Calculating optimal study blocks & micro-breaks...');

    await new Promise((r) => setTimeout(r, 600));

    const newPlanId = `plan_${Date.now()}`;
    const subjectName = newPlanSubject.trim() || 'General Learning';

    const generatedNewPlan: StudyGoalPlan = {
      id: newPlanId,
      goalTitle: newPlanGoal,
      subject: subjectName,
      targetCompletionDate: newPlanTargetDate,
      dailyHours: newPlanDailyHours,
      priority: newPlanPriority,
      createdAt: getOffsetDateStr(0),
      progressPercent: 0,
      tasks: []
    };

    // AI generated structured task schedule for 3 days
    const generatedTasks: StudyTask[] = [
      {
        id: `t_${Date.now()}_1`,
        planId: newPlanId,
        title: `Module 1: Core Fundamentals & Concept Foundations of ${newPlanGoal}`,
        subject: subjectName,
        type: 'study',
        estimatedMinutes: 50,
        scheduledTime: '09:00 AM',
        scheduledDate: getOffsetDateStr(0),
        status: 'pending',
        priority: newPlanPriority,
        notes: 'Read primary lecture summary and outline key takeaways.'
      },
      {
        id: `t_${Date.now()}_2`,
        planId: newPlanId,
        title: 'Cognitive Reset & 15-Min Hydration Break',
        subject: 'Wellness',
        type: 'break',
        estimatedMinutes: 15,
        scheduledTime: '09:50 AM',
        scheduledDate: getOffsetDateStr(0),
        status: 'pending',
        priority: 'Low',
        notes: 'Step away from screen and stretch.'
      },
      {
        id: `t_${Date.now()}_3`,
        planId: newPlanId,
        title: `Spaced Repetition Flashcard Review: ${subjectName} Terms`,
        subject: subjectName,
        type: 'revision',
        estimatedMinutes: 30,
        scheduledTime: '10:05 AM',
        scheduledDate: getOffsetDateStr(0),
        status: 'pending',
        priority: 'High',
        notes: 'Target active recall on key formulas and definitions.'
      },
      {
        id: `t_${Date.now()}_4`,
        planId: newPlanId,
        title: `Interactive Practice Session: 10 Diagnostic Questions`,
        subject: subjectName,
        type: 'practice',
        estimatedMinutes: 35,
        scheduledTime: '11:00 AM',
        scheduledDate: getOffsetDateStr(0),
        status: 'pending',
        priority: 'Medium',
        notes: 'Test understanding under time constraints.'
      },
      {
        id: `t_${Date.now()}_5`,
        planId: newPlanId,
        title: `Module 2: Advanced Applications & Problem Solving`,
        subject: subjectName,
        type: 'study',
        estimatedMinutes: 60,
        scheduledTime: '09:00 AM',
        scheduledDate: getOffsetDateStr(1),
        status: 'pending',
        priority: 'High',
        notes: 'Apply learned concepts to complex case studies.'
      },
      {
        id: `t_${Date.now()}_6`,
        planId: newPlanId,
        title: `Consolidation Quiz & Self-Assessment`,
        subject: subjectName,
        type: 'practice',
        estimatedMinutes: 40,
        scheduledTime: '10:30 AM',
        scheduledDate: getOffsetDateStr(1),
        status: 'pending',
        priority: 'Medium',
        notes: 'Review missed answers and summarize key takeaways.'
      }
    ];

    setPlans((prev) => [generatedNewPlan, ...prev]);
    setTasks((prev) => [...generatedTasks, ...prev]);
    setActivePlanId(newPlanId);

    setIsGeneratingPlanAI(false);
    setIsCreatePlanModalOpen(false);
    setNewPlanGoal('');
    setNewPlanSubject('');

    fireConfetti();
    showToast(`AI Study Plan generated successfully! 🚀`);
  };

  // ----------------------------------------------------------------------
  // DEADLINE & REMINDER HANDLERS
  // ----------------------------------------------------------------------

  const handleAddDeadline = () => {
    if (!newDeadlineTitle.trim()) return;
    const item: DeadlineItem = {
      id: `dl_${Date.now()}`,
      title: newDeadlineTitle.trim(),
      subject: newDeadlineSubject.trim() || 'General',
      dueDate: newDeadlineDate,
      type: newDeadlineType,
      priority: newDeadlinePriority
    };
    setDeadlines((prev) => [item, ...prev]);
    setIsAddDeadlineModalOpen(false);
    setNewDeadlineTitle('');
    setNewDeadlineSubject('');
    showToast(`Upcoming deadline added!`);
  };

  const handleDeleteDeadline = (id: string) => {
    setDeadlines((prev) => prev.filter((d) => d.id !== id));
    showToast(`Deadline removed.`);
  };

  const handleAddReminder = () => {
    if (!newReminderTitle.trim()) return;
    const rem: ReminderItem = {
      id: `rem_${Date.now()}`,
      title: newReminderTitle.trim(),
      type: newReminderType,
      datetime: `${formatDateLabel(newReminderDate)} at ${newReminderTime}`,
      priority: newReminderPriority,
      isCompleted: false
    };
    setReminders((prev) => [rem, ...prev]);
    setIsAddReminderModalOpen(false);
    setNewReminderTitle('');
    showToast(`Reminder created.`);
  };

  const handleToggleReminderComplete = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isCompleted: !r.isCompleted } : r))
    );
  };

  const handleDeleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    showToast(`Reminder deleted.`);
  };

  // ----------------------------------------------------------------------
  // DERIVED METRICS & FILTERS
  // ----------------------------------------------------------------------

  const todayStr = getOffsetDateStr(0);

  const todayTasks = tasks.filter((t) => t.scheduledDate === todayStr);

  const filteredTasks = todayTasks.filter((t) => {
    if (taskFilterStatus === 'all') return true;
    return t.status === taskFilterStatus;
  });

  const totalCompletedTasks = tasks.filter((t) => t.status === 'completed').length;
  const totalPendingTasks = tasks.filter((t) => t.status === 'pending').length;

  const totalStudyMinutesCompleted = tasks
    .filter((t) => t.status === 'completed')
    .reduce((acc, curr) => acc + curr.estimatedMinutes, 0);
  const totalStudyHoursLogged = (totalStudyMinutesCompleted / 60).toFixed(1);

  const totalPlannedTasksCount = tasks.length || 1;
  const overallGoalCompletionPct = Math.round((totalCompletedTasks / totalPlannedTasksCount) * 100);

  const weeklyGoalPct = Math.min(100, Math.round((totalCompletedTasks / Math.max(1, totalPlannedTasksCount)) * 100) + 15);

  const sortedDeadlines = [...deadlines].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  // Week days for weekly schedule
  const getWeekDays = () => {
    const days = [];
    const now = new Date();
    const currentDayOfWeek = now.getDay(); // 0 is Sun
    const distanceToMon = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    
    const monday = new Date(now);
    monday.setDate(now.getDate() + distanceToMon);

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      
      const dayTasks = tasks.filter((t) => t.scheduledDate === dateStr);
      const completedCount = dayTasks.filter((t) => t.status === 'completed').length;
      
      days.push({
        dateStr,
        dayName,
        dayNum,
        isToday: dateStr === todayStr,
        totalTasks: dayTasks.length,
        completedTasks: completedCount,
        dayTasks
      });
    }
    return days;
  };

  const weekDays = getWeekDays();

  return (
    <>
      <div className="space-y-6 w-full">
            
            {/* HEADER BANNER */}
            <div className={cn("p-6 sm:p-8 rounded-3xl relative overflow-hidden", glassStyles.container)}>
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <CalendarDays className="w-48 h-48 text-amber-500" />
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    <span>AI-Powered Learning Schedule</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    Smart Study Planner
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                    Organize study sessions, balance learning workload, track exam deadlines, and achieve your learning goals with personalized AI recommendations.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setIsCreatePlanModalOpen(true)}
                    className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Create AI Study Plan</span>
                  </button>
                </div>
              </div>

              {/* ACTIVE PLANS TAB SWITCHER */}
              {plans.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-200/60 dark:border-white/10 flex items-center gap-2 overflow-x-auto pb-1">
                  <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 shrink-0 mr-1 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-amber-500" />
                    <span>Active Goals:</span>
                  </span>
                  {plans.map((p) => {
                    const isActive = p.id === activePlanId;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setActivePlanId(p.id)}
                        className={cn(
                          "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border flex items-center gap-2",
                          isActive
                            ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                            : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-white/10"
                        )}
                      >
                        <span>{p.goalTitle}</span>
                        <span className={cn(
                          "px-1.5 py-0.5 rounded text-[10px] font-extrabold",
                          isActive ? "bg-black/20 text-white" : "bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-zinc-400"
                        )}>
                          {p.subject}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* REQUIREMENT 6: STUDY PROGRESS OVERVIEW (PREMIUM METRICS CARDS) */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
              {/* TASKS COMPLETED */}
              <div className={cn("p-4 sm:p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between", glassStyles.container)}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Completed</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {totalCompletedTasks} <span className="text-xs font-medium text-slate-400">/ {tasks.length}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${overallGoalCompletionPct}%` }} />
                  </div>
                </div>
              </div>

              {/* TASKS REMAINING */}
              <div className={cn("p-4 sm:p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between", glassStyles.container)}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Remaining</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <Hourglass className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {totalPendingTasks} <span className="text-xs font-medium text-slate-400">tasks</span>
                  </div>
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
                    {todayTasks.filter(t => t.status === 'pending').length} scheduled today
                  </p>
                </div>
              </div>

              {/* STUDY HOURS */}
              <div className={cn("p-4 sm:p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between", glassStyles.container)}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Study Hours</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {totalStudyHoursLogged} <span className="text-xs font-medium text-slate-400">hrs</span>
                  </div>
                  <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-1">
                    Logged study time
                  </p>
                </div>
              </div>

              {/* WEEKLY PROGRESS */}
              <div className={cn("p-4 sm:p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between", glassStyles.container)}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Weekly Pace</span>
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {weeklyGoalPct}%
                  </div>
                  <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-1">
                    Weekly target pace
                  </p>
                </div>
              </div>

              {/* GOAL COMPLETION PERCENTAGE */}
              <div className={cn("col-span-2 lg:col-span-1 p-4 sm:p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between", glassStyles.container)}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Goal Progress</span>
                  <div className="w-8 h-8 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center">
                    <Flame className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {overallGoalCompletionPct}%
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-500 to-pink-500 h-full rounded-full transition-all duration-500" style={{ width: `${overallGoalCompletionPct}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* MAIN NAVIGATION TABS */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2 overflow-x-auto">
              {[
                { id: 'overview', label: "Dashboard & Daily Plan", icon: CalendarDays },
                { id: 'calendar', label: "Interactive Calendar Views", icon: Calendar },
                { id: 'recommendations', label: "AI Recommendations", icon: Brain },
                { id: 'reminders', label: `Reminders (${reminders.filter(r => !r.isCompleted).length})`, icon: Bell },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activePlannerTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActivePlannerTab(tab.id as any)}
                    className={cn(
                      "px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer border",
                      isActive
                        ? "bg-slate-900 text-white dark:bg-white dark:text-black border-slate-900 dark:border-white shadow-md"
                        : "border-transparent text-slate-600 dark:text-zinc-400 hover:bg-slate-200/60 dark:hover:bg-white/5"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT 1: OVERVIEW & 4 MAIN SECTIONS */}
            {activePlannerTab === 'overview' && (
              <div className="space-y-6">
                
                {/* REQUIREMENT 10: PREMIUM EMPTY STATE IF NO STUDY PLAN OR NO TASKS */}
                {plans.length === 0 ? (
                  <div className={cn("p-10 text-center rounded-3xl border border-dashed border-amber-500/30 space-y-4", glassStyles.container)}>
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                      <Sparkles className="w-8 h-8 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">No Active Study Plan Exists</h3>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-md mx-auto">
                        Let EducAI build a milestone-driven, personalized study schedule tailored to your learning goals and daily time availability.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsCreatePlanModalOpen(true)}
                      className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/25 inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>Create AI Study Plan</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* LEFT COLUMN: SECTION 1 - TODAY'S STUDY PLAN (7 COLS) */}
                    <div className="lg:col-span-7 space-y-6">
                      <div className={cn("p-6 rounded-3xl space-y-5", glassStyles.container)}>
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                              <CheckSquare className="w-4 h-4 text-amber-500" /> Today&apos;s Study Plan
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                              {formatDateLabel(todayStr)} • {filteredTasks.length} tasks listed
                            </p>
                          </div>

                          {/* TASK STATUS FILTER */}
                          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs">
                            {(['all', 'pending', 'completed', 'skipped'] as const).map((st) => (
                              <button
                                key={st}
                                onClick={() => setTaskFilterStatus(st)}
                                className={cn(
                                  "px-2.5 py-1 rounded-lg font-bold capitalize transition-colors cursor-pointer",
                                  taskFilterStatus === st
                                    ? "bg-amber-500 text-white shadow-xs"
                                    : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                                )}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* TASK LIST */}
                        <div className="space-y-3">
                          {filteredTasks.length === 0 ? (
                            <div className="p-8 text-center rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]">
                              <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                                No tasks found matching &quot;{taskFilterStatus}&quot; status for today.
                              </p>
                            </div>
                          ) : (
                            filteredTasks.map((task) => {
                              const isCompleted = task.status === 'completed';
                              const isSkipped = task.status === 'skipped';

                              const typeTagStyles: Record<TaskType, { bg: string; text: string; label: string }> = {
                                study: { bg: 'bg-blue-500/10 border-blue-500/20', text: 'text-blue-600 dark:text-blue-400', label: 'Core Study' },
                                break: { bg: 'bg-emerald-500/10 border-emerald-500/20', text: 'text-emerald-600 dark:text-emerald-400', label: 'Break' },
                                revision: { bg: 'bg-purple-500/10 border-purple-500/20', text: 'text-purple-600 dark:text-purple-400', label: 'Revision' },
                                practice: { bg: 'bg-amber-500/10 border-amber-500/20', text: 'text-amber-600 dark:text-amber-400', label: 'Practice Quiz' },
                              };

                              const metaType = typeTagStyles[task.type] || typeTagStyles.study;

                              return (
                                <motion.div
                                  key={task.id}
                                  layout
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className={cn(
                                    "p-4 rounded-2xl border transition-all space-y-3 group",
                                    isCompleted
                                      ? "bg-slate-100/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/5 opacity-70"
                                      : isSkipped
                                      ? "bg-slate-100/30 dark:bg-white/[0.01] border-slate-200 dark:border-white/5 opacity-50"
                                      : "bg-white/80 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-amber-500/40 shadow-xs"
                                  )}
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-3">
                                      {/* Complete Checkbox */}
                                      <button
                                        onClick={() => handleToggleCompleteTask(task.id)}
                                        className={cn(
                                          "mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-all cursor-pointer shrink-0",
                                          isCompleted
                                            ? "bg-emerald-500 border-emerald-500 text-white"
                                            : "border-slate-300 dark:border-zinc-600 hover:border-amber-500"
                                        )}
                                      >
                                        {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                      </button>

                                      <div className="space-y-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <span className={cn("text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border", metaType.bg, metaType.text)}>
                                            {metaType.label}
                                          </span>
                                          <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded-md">
                                            {task.subject}
                                          </span>
                                          <span className={cn(
                                            "text-[10px] font-bold px-1.5 py-0.5 rounded",
                                            task.priority === 'High' ? "text-rose-500 bg-rose-500/10" : "text-slate-500 bg-slate-500/10"
                                          )}>
                                            {task.priority} Priority
                                          </span>
                                        </div>

                                        <h4 className={cn("text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug", isCompleted && "line-through text-slate-400")}>
                                          {task.title}
                                        </h4>

                                        {task.notes && (
                                          <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                                            {task.notes}
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    {/* Action Buttons (Requirement 5) */}
                                    <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                      {!isCompleted && !isSkipped && (
                                        <Tooltip content="Skip Task" side="top">
                                          <button
                                            onClick={() => handleSkipTask(task.id)}
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                                          >
                                            <X className="w-3.5 h-3.5" />
                                          </button>
                                        </Tooltip>
                                      )}

                                      <Tooltip content="Reschedule Task" side="top">
                                        <button
                                          onClick={() => handleOpenRescheduleModal(task)}
                                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                                        >
                                          <Calendar className="w-3.5 h-3.5" />
                                        </button>
                                      </Tooltip>

                                      <Tooltip content="Edit Task" side="top">
                                        <button
                                          onClick={() => setEditingTask(task)}
                                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                                        >
                                          <Edit3 className="w-3.5 h-3.5" />
                                        </button>
                                      </Tooltip>

                                      <Tooltip content="Delete Task" side="top">
                                        <button
                                          onClick={() => handleDeleteTask(task.id)}
                                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </Tooltip>
                                    </div>
                                  </div>

                                  <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400">
                                    <div className="flex items-center gap-3">
                                      <span className="flex items-center gap-1 font-mono font-medium">
                                        <Clock className="w-3 h-3 text-amber-500" />
                                        {task.scheduledTime}
                                      </span>
                                      <span className="flex items-center gap-1 font-medium">
                                        <Hourglass className="w-3 h-3 text-slate-400" />
                                        {task.estimatedMinutes} mins
                                      </span>
                                    </div>

                                    {isSkipped && (
                                      <span className="text-[10px] font-extrabold text-amber-500 uppercase tracking-wider">
                                        SKIPPED
                                      </span>
                                    )}
                                  </div>
                                </motion.div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: SECTION 2 - WEEKLY SCHEDULE & SECTION 3 - UPCOMING DEADLINES (5 COLS) */}
                    <div className="lg:col-span-5 space-y-6">
                      
                      {/* SECTION 2: WEEKLY STUDY SCHEDULE */}
                      <div className={cn("p-6 rounded-3xl space-y-4", glassStyles.container)}>
                        <div className="flex items-center justify-between">
                          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-amber-500" /> Weekly Schedule
                          </h2>
                          <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">7-Day Overview</span>
                        </div>

                        <div className="grid grid-cols-7 gap-1.5 pt-2">
                          {weekDays.map((day) => {
                            const isSelected = selectedCalendarDate === day.dateStr;
                            return (
                              <button
                                key={day.dateStr}
                                onClick={() => setSelectedCalendarDate(day.dateStr)}
                                className={cn(
                                  "p-2 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1",
                                  day.isToday
                                    ? "bg-amber-500 text-white border-amber-500 shadow-md"
                                    : isSelected
                                    ? "bg-slate-900 text-white dark:bg-white dark:text-black border-slate-900 dark:border-white"
                                    : "bg-slate-50/70 dark:bg-white/[0.02] border-slate-200 dark:border-white/10 hover:bg-slate-100"
                                )}
                              >
                                <span className="text-[10px] font-bold uppercase">{day.dayName}</span>
                                <span className="text-sm font-black">{day.dayNum}</span>
                                <div className="flex items-center gap-0.5 mt-0.5">
                                  {day.totalTasks > 0 ? (
                                    <span className={cn(
                                      "w-1.5 h-1.5 rounded-full",
                                      day.completedTasks === day.totalTasks ? "bg-emerald-400" : "bg-amber-400"
                                    )} />
                                  ) : (
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-zinc-700" />
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* SECTION 3: UPCOMING DEADLINES */}
                      <div className={cn("p-6 rounded-3xl space-y-4", glassStyles.container)}>
                        <div className="flex items-center justify-between">
                          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <Flag className="w-4 h-4 text-rose-500" /> Upcoming Deadlines
                          </h2>
                          <button
                            onClick={() => setIsAddDeadlineModalOpen(true)}
                            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>
                        </div>

                        <div className="space-y-3">
                          {sortedDeadlines.length === 0 ? (
                            <p className="text-xs text-slate-500 dark:text-zinc-400 text-center py-4">No upcoming deadlines.</p>
                          ) : (
                            sortedDeadlines.slice(0, 4).map((dl) => {
                              const daysLeft = getDaysUntil(dl.dueDate);
                              const isUrgent = daysLeft <= 3;

                              return (
                                <div
                                  key={dl.id}
                                  className={cn(
                                    "p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3",
                                    isUrgent
                                      ? "bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-100"
                                      : "bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/10"
                                  )}
                                >
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-black/10 dark:bg-white/10">
                                        {dl.type}
                                      </span>
                                      <span className="text-[10px] font-semibold text-slate-500 dark:text-zinc-400">
                                        {dl.subject}
                                      </span>
                                    </div>
                                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                      {dl.title}
                                    </h4>
                                  </div>

                                  <div className="text-right shrink-0">
                                    <span className={cn(
                                      "px-2.5 py-1 rounded-xl text-xs font-extrabold inline-block",
                                      isUrgent ? "bg-rose-500 text-white shadow-xs" : "bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-zinc-300"
                                    )}>
                                      {daysLeft <= 0 ? 'Today' : `${daysLeft}d left`}
                                    </span>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 2: REQUIREMENT 7 - INTERACTIVE CALENDAR VIEWS */}
            {activePlannerTab === 'calendar' && (
              <div className={cn("p-6 sm:p-8 rounded-3xl space-y-6", glassStyles.container)}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-amber-500" /> Calendar & Timelines
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                      View monthly study grids, weekly board breakdown, and daily hourly agenda
                    </p>
                  </div>

                  {/* CALENDAR SUB-VIEW TOGGLES */}
                  <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold">
                    {(['monthly', 'weekly', 'daily'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setCalendarSubView(mode)}
                        className={cn(
                          "px-3.5 py-1.5 rounded-xl capitalize transition-all cursor-pointer",
                          calendarSubView === mode
                            ? "bg-amber-500 text-white shadow-sm"
                            : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                        )}
                      >
                        {mode} Planner
                      </button>
                    ))}
                  </div>
                </div>

                {/* MONTHLY CALENDAR GRID */}
                {calendarSubView === 'monthly' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400">
                      <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                      {Array.from({ length: 28 }).map((_, idx) => {
                        const dayNum = idx + 1;
                        const dateStr = getOffsetDateStr(idx - 5);
                        const dayTasks = tasks.filter((t) => t.scheduledDate === dateStr);
                        const hasDeadline = deadlines.some((d) => d.dueDate === dateStr);
                        const isToday = dateStr === todayStr;

                        return (
                          <div
                            key={idx}
                            onClick={() => setSelectedCalendarDate(dateStr)}
                            className={cn(
                              "p-2.5 min-h-[85px] rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group",
                              isToday
                                ? "bg-amber-500/10 border-amber-500/50"
                                : selectedCalendarDate === dateStr
                                ? "bg-slate-200/80 dark:bg-white/10 border-slate-400 dark:border-white/30"
                                : "bg-slate-50/60 dark:bg-white/[0.02] border-slate-200 dark:border-white/10 hover:border-amber-500/30"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <span className={cn(
                                "text-xs font-black w-6 h-6 rounded-full flex items-center justify-center",
                                isToday ? "bg-amber-500 text-white" : "text-slate-700 dark:text-zinc-300"
                              )}>
                                {dayNum}
                              </span>

                              {/* Highlight Important Deadlines */}
                              {hasDeadline && (
                                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" title="Important Deadline" />
                              )}
                            </div>

                            <div className="space-y-1">
                              {dayTasks.slice(0, 2).map((t) => (
                                <div key={t.id} className="text-[10px] font-medium truncate px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-zinc-200">
                                  {t.title}
                                </div>
                              ))}
                              {dayTasks.length > 2 && (
                                <span className="text-[9px] font-bold text-amber-500 px-1">
                                  +{dayTasks.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* WEEKLY PLANNER COLUMNS */}
                {calendarSubView === 'weekly' && (
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                    {weekDays.map((day) => (
                      <div key={day.dateStr} className="p-3 rounded-2xl bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-3">
                        <div className="border-b border-slate-200 dark:border-white/10 pb-2 text-center">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{day.dayName}</span>
                          <h4 className="text-sm font-black text-slate-900 dark:text-white">{day.dayNum}</h4>
                        </div>

                        <div className="space-y-2">
                          {day.dayTasks.length === 0 ? (
                            <p className="text-[11px] text-slate-400 text-center py-4">No tasks</p>
                          ) : (
                            day.dayTasks.map((t) => (
                              <div key={t.id} className="p-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs space-y-1">
                                <span className="text-[9px] font-bold text-amber-500 uppercase">{t.type}</span>
                                <p className="font-bold text-slate-900 dark:text-white leading-tight">{t.title}</p>
                                <span className="text-[10px] text-slate-400">{t.scheduledTime}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* DAILY AGENDA HOURLY TIMELINE */}
                {calendarSubView === 'daily' && (
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-500 dark:text-zinc-400">
                      Agenda for: <span className="text-amber-500">{formatDateLabel(selectedCalendarDate)}</span>
                    </div>

                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                      {['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'].map((slotTime) => {
                        const matchingTasks = tasks.filter((t) => t.scheduledDate === selectedCalendarDate && t.scheduledTime === slotTime);

                        return (
                          <div key={slotTime} className="flex items-start gap-4 p-3 rounded-2xl bg-slate-50/50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5">
                            <span className="text-xs font-mono font-bold text-slate-400 shrink-0 w-20">{slotTime}</span>
                            <div className="flex-1 space-y-2">
                              {matchingTasks.length === 0 ? (
                                <span className="text-xs text-slate-400 italic">Available study window</span>
                              ) : (
                                matchingTasks.map((t) => (
                                  <div key={t.id} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs flex items-center justify-between">
                                    <span className="font-bold text-slate-900 dark:text-white">{t.title}</span>
                                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-500 text-white">{t.type}</span>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 3: REQUIREMENT 8 - AI RECOMMENDATIONS PANEL */}
            {activePlannerTab === 'recommendations' && (
              <div className={cn("p-6 sm:p-8 rounded-3xl space-y-6", glassStyles.container)}>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Brain className="w-5 h-5 text-amber-500" /> AI Insights & Recommendations
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                    Personalized study time optimization, spaced repetition intervals, and daily motivation
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiRecommendations.map((rec) => (
                    <div key={rec.id} className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/[0.02] space-y-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{rec.title}</h4>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                        {rec.description}
                      </p>

                      {rec.actionText && (
                        <button
                          onClick={() => showToast(`AI action applied: ${rec.actionText}`)}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>{rec.actionText}</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: REQUIREMENT 9 - REMINDERS SECTION */}
            {activePlannerTab === 'reminders' && (
              <div className={cn("p-6 sm:p-8 rounded-3xl space-y-6", glassStyles.container)}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <Bell className="w-5 h-5 text-amber-500" /> Reminders & Exam Alerts
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                      Never miss an exam, lab report, or revision session
                    </p>
                  </div>

                  <button
                    onClick={() => setIsAddReminderModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-amber-600 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Reminder</span>
                  </button>
                </div>

                {/* CATEGORY FILTER */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {(['all', 'exam', 'assignment', 'revision', 'quiz'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setReminderCategoryFilter(cat)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer border",
                        reminderCategoryFilter === cat
                          ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                          : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-zinc-400"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  {reminders
                    .filter((r) => reminderCategoryFilter === 'all' || r.type === reminderCategoryFilter)
                    .map((rem) => (
                      <div
                        key={rem.id}
                        className={cn(
                          "p-4 rounded-2xl border transition-all flex items-center justify-between gap-4",
                          rem.isCompleted
                            ? "bg-slate-100/50 dark:bg-white/[0.01] opacity-60 border-slate-200 dark:border-white/5"
                            : "bg-slate-50/70 dark:bg-white/[0.02] border-slate-200 dark:border-white/10"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleToggleReminderComplete(rem.id)}
                            className={cn(
                              "w-5 h-5 rounded-lg border flex items-center justify-center cursor-pointer transition-all shrink-0",
                              rem.isCompleted ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 dark:border-zinc-600"
                            )}
                          >
                            {rem.isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </button>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-500">
                                {rem.type}
                              </span>
                              <span className="text-[11px] font-mono text-slate-400">{rem.datetime}</span>
                            </div>
                            <h4 className={cn("text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1", rem.isCompleted && "line-through")}>
                              {rem.title}
                            </h4>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteReminder(rem.id)}
                          className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}

          </div>

      {/* REQUIREMENT 3: CREATE STUDY PLAN MODAL WITH AI AUTO-GENERATION */}
      <AnimatePresence>
        {isCreatePlanModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl p-6 sm:p-8 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">Create AI Study Plan</h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">Generate milestone-driven study tasks & break intervals</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCreatePlanModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isGeneratingPlanAI ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin mx-auto" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">AI Crafting Your Study Schedule</h4>
                    <p className="text-xs text-amber-500 font-medium animate-pulse">{generationStepText}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* GOAL */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Learning Goal / Exam Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Learn React 19, Prepare for Organic Chemistry Final"
                      value={newPlanGoal}
                      onChange={(e) => setNewPlanGoal(e.target.value)}
                      className={cn("w-full px-4 py-3 text-xs sm:text-sm outline-none transition-all", glassStyles.input)}
                    />
                    
                    {/* QUICK PRESET CHIPS */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {['Master Next.js App Router', 'MCAT Biology Prep', 'Calculus II Integration', 'Data Structures & Algorithms'].map((preset) => (
                        <button
                          key={preset}
                          onClick={() => {
                            setNewPlanGoal(preset);
                            setNewPlanSubject(preset.includes('Calculus') ? 'Mathematics' : preset.includes('Biology') ? 'Medicine' : 'Computer Science');
                          }}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-white/5 hover:bg-amber-500/10 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
                        >
                          + {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SUBJECT */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Subject / Discipline</label>
                    <input
                      type="text"
                      placeholder="e.g., Computer Science, Pre-Med, Physics"
                      value={newPlanSubject}
                      onChange={(e) => setNewPlanSubject(e.target.value)}
                      className={cn("w-full px-4 py-3 text-xs sm:text-sm outline-none transition-all", glassStyles.input)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* TARGET DATE */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Target Completion Date</label>
                      <input
                        type="date"
                        value={newPlanTargetDate}
                        onChange={(e) => setNewPlanTargetDate(e.target.value)}
                        className={cn("w-full px-4 py-3 text-xs outline-none transition-all", glassStyles.input)}
                      />
                    </div>

                    {/* DAILY TIME */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Daily Study Time</label>
                      <select
                        value={newPlanDailyHours}
                        onChange={(e) => setNewPlanDailyHours(parseFloat(e.target.value))}
                        className={cn("w-full px-4 py-3 text-xs outline-none transition-all bg-transparent", glassStyles.input)}
                      >
                        <option value={1.0} className="dark:bg-zinc-900">1.0 Hour / Day</option>
                        <option value={2.0} className="dark:bg-zinc-900">2.0 Hours / Day</option>
                        <option value={2.5} className="dark:bg-zinc-900">2.5 Hours / Day</option>
                        <option value={3.5} className="dark:bg-zinc-900">3.5 Hours / Day</option>
                        <option value={5.0} className="dark:bg-zinc-900">5.0 Hours / Day</option>
                      </select>
                    </div>
                  </div>

                  {/* PRIORITY */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Priority Level</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['High', 'Medium', 'Low'] as PriorityLevel[]).map((p) => (
                        <button
                          key={p}
                          onClick={() => setNewPlanPriority(p)}
                          className={cn(
                            "py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer",
                            newPlanPriority === p
                              ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                              : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-zinc-300"
                          )}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-3">
                    <button
                      onClick={() => setIsCreatePlanModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleGenerateAIStudyPlan}
                      className="px-6 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-white shadow-lg shadow-amber-500/25 hover:bg-amber-600 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Generate AI Schedule</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RESCHEDULE MODAL */}
      <AnimatePresence>
        {reschedulingTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl p-6 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
                <h3 className="text-base font-black text-slate-900 dark:text-white">Reschedule Task</h3>
                <button onClick={() => setReschedulingTask(null)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-700 dark:text-zinc-300">{reschedulingTask.title}</p>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Select New Date</label>
                  <input
                    type="date"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className={cn("w-full px-4 py-2.5 text-xs outline-none", glassStyles.input)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Select Scheduled Time</label>
                  <input
                    type="text"
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    placeholder="e.g., 10:00 AM"
                    className={cn("w-full px-4 py-2.5 text-xs outline-none", glassStyles.input)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
                <button
                  onClick={() => setReschedulingTask(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReschedule}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 shadow-sm cursor-pointer"
                >
                  Save Schedule
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT TASK MODAL */}
      <AnimatePresence>
        {editingTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
                <h3 className="text-base font-black text-slate-900 dark:text-white">Edit Task</h3>
                <button onClick={() => setEditingTask(null)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Task Title</label>
                  <input
                    type="text"
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                    className={cn("w-full px-4 py-2.5 text-xs outline-none", glassStyles.input)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Subject</label>
                    <input
                      type="text"
                      value={editingTask.subject}
                      onChange={(e) => setEditingTask({ ...editingTask, subject: e.target.value })}
                      className={cn("w-full px-4 py-2.5 text-xs outline-none", glassStyles.input)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Est. Minutes</label>
                    <input
                      type="number"
                      value={editingTask.estimatedMinutes}
                      onChange={(e) => setEditingTask({ ...editingTask, estimatedMinutes: parseInt(e.target.value) || 30 })}
                      className={cn("w-full px-4 py-2.5 text-xs outline-none", glassStyles.input)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Notes & Focus Highlights</label>
                  <textarea
                    rows={2}
                    value={editingTask.notes || ''}
                    onChange={(e) => setEditingTask({ ...editingTask, notes: e.target.value })}
                    className={cn("w-full px-4 py-2.5 text-xs outline-none resize-none", glassStyles.input)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
                <button
                  onClick={() => setEditingTask(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEditTask}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 shadow-sm cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD DEADLINE MODAL */}
      <AnimatePresence>
        {isAddDeadlineModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
                <h3 className="text-base font-black text-slate-900 dark:text-white">Add Upcoming Deadline</h3>
                <button onClick={() => setIsAddDeadlineModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Deadline Title</label>
                  <input
                    type="text"
                    placeholder="e.g., CS 301 Final Project Submission"
                    value={newDeadlineTitle}
                    onChange={(e) => setNewDeadlineTitle(e.target.value)}
                    className={cn("w-full px-4 py-2.5 text-xs outline-none", glassStyles.input)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Subject</label>
                    <input
                      type="text"
                      placeholder="e.g. Computer Science"
                      value={newDeadlineSubject}
                      onChange={(e) => setNewDeadlineSubject(e.target.value)}
                      className={cn("w-full px-4 py-2.5 text-xs outline-none", glassStyles.input)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Due Date</label>
                    <input
                      type="date"
                      value={newDeadlineDate}
                      onChange={(e) => setNewDeadlineDate(e.target.value)}
                      className={cn("w-full px-4 py-2.5 text-xs outline-none", glassStyles.input)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Type</label>
                  <select
                    value={newDeadlineType}
                    onChange={(e) => setNewDeadlineType(e.target.value as any)}
                    className={cn("w-full px-4 py-2.5 text-xs outline-none bg-transparent", glassStyles.input)}
                  >
                    <option value="exam" className="dark:bg-zinc-900">Exam</option>
                    <option value="assignment" className="dark:bg-zinc-900">Assignment</option>
                    <option value="project" className="dark:bg-zinc-900">Project</option>
                    <option value="quiz" className="dark:bg-zinc-900">Quiz</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
                <button
                  onClick={() => setIsAddDeadlineModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddDeadline}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 shadow-sm cursor-pointer"
                >
                  Add Deadline
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD REMINDER MODAL */}
      <AnimatePresence>
        {isAddReminderModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
                <h3 className="text-base font-black text-slate-900 dark:text-white">Create New Reminder</h3>
                <button onClick={() => setIsAddReminderModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Reminder Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Review Organic Chemistry Flashcards"
                    value={newReminderTitle}
                    onChange={(e) => setNewReminderTitle(e.target.value)}
                    className={cn("w-full px-4 py-2.5 text-xs outline-none", glassStyles.input)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Date</label>
                    <input
                      type="date"
                      value={newReminderDate}
                      onChange={(e) => setNewReminderDate(e.target.value)}
                      className={cn("w-full px-4 py-2.5 text-xs outline-none", glassStyles.input)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Time</label>
                    <input
                      type="text"
                      placeholder="e.g. 05:00 PM"
                      value={newReminderTime}
                      onChange={(e) => setNewReminderTime(e.target.value)}
                      className={cn("w-full px-4 py-2.5 text-xs outline-none", glassStyles.input)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Category</label>
                  <select
                    value={newReminderType}
                    onChange={(e) => setNewReminderType(e.target.value as any)}
                    className={cn("w-full px-4 py-2.5 text-xs outline-none bg-transparent", glassStyles.input)}
                  >
                    <option value="exam" className="dark:bg-zinc-900">Upcoming Exam</option>
                    <option value="assignment" className="dark:bg-zinc-900">Assignment Deadline</option>
                    <option value="revision" className="dark:bg-zinc-900">Revision Reminder</option>
                    <option value="quiz" className="dark:bg-zinc-900">Quiz Reminder</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
                <button
                  onClick={() => setIsAddReminderModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddReminder}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 shadow-sm cursor-pointer"
                >
                  Create Reminder
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-slate-900/90 dark:bg-black/90 text-white border border-white/10 shadow-2xl text-xs font-bold flex items-center gap-2.5 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
