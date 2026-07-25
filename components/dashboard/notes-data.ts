import { 
  FileText, Network, FileDown, Layers, MousePointer2, Maximize, Target, Loader2,
  File, Copy, Printer, AlignLeft, Zap, Lightbulb
} from 'lucide-react';

export const FOLDERS = ['Biology', 'History', 'Mathematics', 'Computer Science'];
export const RECENT_NOTES = [
  { id: '1', title: 'Cellular Respiration', folder: 'Biology', date: '2 hours ago', isFavorite: true },
  { id: '2', title: 'World War II Timeline', folder: 'History', date: 'Yesterday', isFavorite: false },
  { id: '3', title: 'Neural Networks Basics', folder: 'Computer Science', date: 'Oct 15', isFavorite: true },
  { id: '4', title: 'Calculus: Derivatives', folder: 'Mathematics', date: 'Oct 12', isFavorite: false },
];

export const AI_QUICK_ACTIONS = [
  { icon: FileText, label: 'Generate Notes' },
  { icon: AlignLeft, label: 'Summarize Notes' },
  { icon: Maximize, label: 'Expand Notes' },
  { icon: Zap, label: 'Simplify Topic' },
  { icon: Layers, label: 'Create Flashcards' },
  { icon: Target, label: 'Generate Quiz' },
  { icon: Network, label: 'Generate Mind Map' },
  { icon: Lightbulb, label: 'Explain Topic' },
];

export const VERSIONS = [
  { id: 'v5', time: 'Just now', type: 'auto-save', title: 'Current Version' },
  { id: 'v4', time: '10 mins ago', type: 'manual', title: 'Added Krebs Cycle details' },
  { id: 'v3', time: '1 hour ago', type: 'auto-save', title: 'AI Summary generated' },
  { id: 'v2', time: 'Yesterday, 2:30 PM', type: 'auto-save', title: 'Initial draft' },
  { id: 'v1', time: 'Yesterday, 1:15 PM', type: 'manual', title: 'Empty note created' },
];

export const EXPORT_OPTIONS = [
  { icon: FileDown, label: 'Export PDF' },
  { icon: FileText, label: 'Export Markdown' },
  { icon: File, label: 'Export DOCX' },
  { icon: Copy, label: 'Copy Notes' },
  { icon: Printer, label: 'Print' },
];
