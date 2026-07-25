export type PriorityLevel = 'High' | 'Medium' | 'Low';
export type TaskType = 'study' | 'break' | 'revision' | 'practice';
export type TaskStatus = 'pending' | 'completed' | 'skipped';

export interface StudyTask {
  id: string;
  title: string;
  subject: string;
  type: TaskType;
  estimatedMinutes: number;
  scheduledTime: string; // e.g. "09:00 AM"
  scheduledDate: string; // YYYY-MM-DD
  status: TaskStatus;
  priority: PriorityLevel;
  notes?: string;
  planId?: string;
}

export interface StudyGoalPlan {
  id: string;
  goalTitle: string;
  subject: string;
  targetCompletionDate: string; // YYYY-MM-DD
  dailyHours: number;
  priority: PriorityLevel;
  createdAt: string;
  tasks: StudyTask[];
  progressPercent: number;
}

export interface DeadlineItem {
  id: string;
  title: string;
  subject: string;
  dueDate: string; // YYYY-MM-DD
  type: 'exam' | 'assignment' | 'project' | 'quiz';
  priority: PriorityLevel;
  notes?: string;
}

export interface AIRecommendation {
  id: string;
  category: 'time' | 'revision' | 'break' | 'topic' | 'motivation';
  title: string;
  description: string;
  actionText?: string;
}

export interface ReminderItem {
  id: string;
  title: string;
  type: 'exam' | 'assignment' | 'revision' | 'quiz';
  datetime: string;
  priority: PriorityLevel;
  isCompleted: boolean;
}
