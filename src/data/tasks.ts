export interface Task {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  dueDate: string;
  category?: string;
  reminderTime?: string;
  reminderFired?: boolean;
}

export const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Review Organic Chemistry Notes',
    priority: 'high',
    status: 'todo',
    dueDate: '2024-03-12',
    category: 'Study',
  },
  {
    id: '2',
    title: 'Complete Math Problem Set 4',
    priority: 'medium',
    status: 'in-progress',
    dueDate: '2024-03-15',
    category: 'Coding',
  },
  {
    id: '3',
    title: 'Research Paper Bibliography',
    priority: 'low',
    status: 'completed',
    dueDate: '2024-03-18',
    category: 'Research',
  },
];
