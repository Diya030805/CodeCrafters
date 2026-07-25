import { StudyGoalPlan, StudyTask, DeadlineItem, AIRecommendation, ReminderItem } from '@/src/types/planner';

// Helper to calculate date offsets relative to today
const getOffsetDate = (days: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

export const initialStudyPlans: StudyGoalPlan[] = [
  {
    id: 'plan-1',
    goalTitle: 'Master React 19 & Next.js App Router',
    subject: 'Computer Science',
    targetCompletionDate: getOffsetDate(21),
    dailyHours: 2.5,
    priority: 'High',
    createdAt: getOffsetDate(-5),
    progressPercent: 78,
    tasks: []
  },
  {
    id: 'plan-2',
    goalTitle: 'Prepare for Final Exams: Organic Chemistry & Physics',
    subject: 'Pre-Med / Natural Sciences',
    targetCompletionDate: getOffsetDate(14),
    dailyHours: 3.0,
    priority: 'High',
    createdAt: getOffsetDate(-10),
    progressPercent: 65,
    tasks: []
  }
];

export const initialTasks: StudyTask[] = [
  // Today's tasks
  {
    id: 'task-1',
    planId: 'plan-1',
    title: 'Server Components & Client Boundary Architecture',
    subject: 'Computer Science',
    type: 'study',
    estimatedMinutes: 45,
    scheduledTime: '09:00 AM',
    scheduledDate: getOffsetDate(0),
    status: 'completed',
    priority: 'High',
    notes: 'Focus on props serialization and hydration rules.'
  },
  {
    id: 'task-2',
    planId: 'plan-1',
    title: 'Hydration & Mindful Breathing Break',
    subject: 'Wellness',
    type: 'break',
    estimatedMinutes: 15,
    scheduledTime: '09:45 AM',
    scheduledDate: getOffsetDate(0),
    status: 'completed',
    priority: 'Low',
    notes: 'Take a short walk and stretch.'
  },
  {
    id: 'task-3',
    planId: 'plan-1',
    title: 'Spaced Repetition Review: React Hooks & State Mechanics',
    subject: 'Computer Science',
    type: 'revision',
    estimatedMinutes: 30,
    scheduledTime: '10:00 AM',
    scheduledDate: getOffsetDate(0),
    status: 'pending',
    priority: 'High',
    notes: 'Review useMemo, useCallback, and custom hook patterns.'
  },
  {
    id: 'task-4',
    planId: 'plan-1',
    title: 'Interactive Practice Quiz: 15 State Management Questions',
    subject: 'Computer Science',
    type: 'practice',
    estimatedMinutes: 30,
    scheduledTime: '11:00 AM',
    scheduledDate: getOffsetDate(0),
    status: 'pending',
    priority: 'Medium',
    notes: 'Test speed and accuracy on Zustand & Context API.'
  },
  {
    id: 'task-5',
    planId: 'plan-2',
    title: 'Organic Chemistry: Reaction Mechanisms (SN1 vs SN2)',
    subject: 'Pre-Med',
    type: 'study',
    estimatedMinutes: 60,
    scheduledTime: '02:00 PM',
    scheduledDate: getOffsetDate(0),
    status: 'pending',
    priority: 'High',
    notes: 'Draw electron pushing arrows for nucleophilic substitution.'
  },
  {
    id: 'task-6',
    planId: 'plan-2',
    title: 'Physics Practice Problems: Thermodynamics & Entropy',
    subject: 'Pre-Med',
    type: 'practice',
    estimatedMinutes: 45,
    scheduledTime: '03:30 PM',
    scheduledDate: getOffsetDate(0),
    status: 'pending',
    priority: 'Medium',
    notes: 'Solve problem set 4 questions 1-12.'
  },

  // Future tasks (Tomorrow & upcoming)
  {
    id: 'task-7',
    planId: 'plan-1',
    title: 'Next.js Middleware & Authentication Edge Handlers',
    subject: 'Computer Science',
    type: 'study',
    estimatedMinutes: 50,
    scheduledTime: '09:30 AM',
    scheduledDate: getOffsetDate(1),
    status: 'pending',
    priority: 'High',
    notes: 'Implement secure JWT cookie validation.'
  },
  {
    id: 'task-8',
    planId: 'plan-2',
    title: 'Revision Session: Stereochemistry & Enantiomers',
    subject: 'Pre-Med',
    type: 'revision',
    estimatedMinutes: 35,
    scheduledTime: '11:00 AM',
    scheduledDate: getOffsetDate(1),
    status: 'pending',
    priority: 'Medium',
    notes: 'Practice assigning R/S configurations.'
  },
  {
    id: 'task-9',
    planId: 'plan-1',
    title: 'Full Stack App Deployment & Environment Configuration',
    subject: 'Computer Science',
    type: 'study',
    estimatedMinutes: 60,
    scheduledTime: '02:00 PM',
    scheduledDate: getOffsetDate(2),
    status: 'pending',
    priority: 'High',
    notes: 'Deploy to Cloud Run and test HTTPS headers.'
  }
];

export const initialDeadlines: DeadlineItem[] = [
  {
    id: 'dl-1',
    title: 'CS 301 Next.js Full Stack Capstone Submission',
    subject: 'Computer Science',
    dueDate: getOffsetDate(3),
    type: 'project',
    priority: 'High',
    notes: 'Final code commit and video demonstration link required.'
  },
  {
    id: 'dl-2',
    title: 'Organic Chemistry Midterm Examination',
    subject: 'Pre-Med',
    dueDate: getOffsetDate(5),
    type: 'exam',
    priority: 'High',
    notes: 'Covers Chapters 1-8 including reaction synthesis pathways.'
  },
  {
    id: 'dl-3',
    title: 'Physics Thermodynamics Lab Report Assignment',
    subject: 'Pre-Med',
    dueDate: getOffsetDate(8),
    type: 'assignment',
    priority: 'Medium',
    notes: 'Submit PDF with error analysis graphs.'
  },
  {
    id: 'dl-4',
    title: 'Algorithms & Data Structures Speed Quiz',
    subject: 'Computer Science',
    dueDate: getOffsetDate(12),
    type: 'quiz',
    priority: 'Medium',
    notes: 'Timed 20-question quiz on Graph Traversal algorithms.'
  }
];

export const initialAIRecommendations: AIRecommendation[] = [
  {
    id: 'rec-1',
    category: 'time',
    title: 'Peak Cognitive Focus Window',
    description: 'Based on your recent quiz retention, your optimal study window is 09:00 AM – 11:30 AM. Schedule complex technical topics during this morning slot.',
    actionText: 'Auto-Align High Priority Tasks'
  },
  {
    id: 'rec-2',
    category: 'revision',
    title: 'Spaced Repetition Review Due',
    description: 'Optimal memory retention curve indicates it is time to review "Async/Await Mechanics" from 3 days ago before knowledge decay.',
    actionText: 'Start 15-Min Flashcard Review'
  },
  {
    id: 'rec-3',
    category: 'break',
    title: 'Cognitive Fatigue Prevention',
    description: 'You logged 2.5 hours of continuous study yesterday without a break. We recommend 10-minute micro-breaks after every 45-minute focus block.',
    actionText: 'Enable Pomodoro Reminders'
  },
  {
    id: 'rec-4',
    category: 'topic',
    title: 'Targeted Practice Recommendation',
    description: 'Your accuracy in "Thermodynamics Entropy Problems" was 64% on your last practice session. Allocating 30 minutes today will boost mastery.',
    actionText: 'Add 30m Practice Session'
  },
  {
    id: 'rec-5',
    category: 'motivation',
    title: 'Daily Inspiration',
    description: '"Small daily achievements compound exponentially. Consistency is the bridge between goals and mastery."',
    actionText: 'Share Daily Progress'
  }
];

export const initialReminders: ReminderItem[] = [
  {
    id: 'rem-1',
    title: 'CS 301 Midterm Examination',
    type: 'exam',
    datetime: `${getOffsetDate(3)} at 10:00 AM`,
    priority: 'High',
    isCompleted: false
  },
  {
    id: 'rem-2',
    title: 'Submit Thermodynamics Lab Assignment',
    type: 'assignment',
    datetime: `${getOffsetDate(5)} at 11:59 PM`,
    priority: 'High',
    isCompleted: false
  },
  {
    id: 'rem-3',
    title: 'Spaced Repetition Flashcards Review: Organic Synthesis',
    type: 'revision',
    datetime: `${getOffsetDate(0)} at 05:00 PM`,
    priority: 'Medium',
    isCompleted: false
  },
  {
    id: 'rem-4',
    title: 'Weekly Knowledge Check Quiz on Data Structures',
    type: 'quiz',
    datetime: `${getOffsetDate(1)} at 02:00 PM`,
    priority: 'Medium',
    isCompleted: false
  }
];
