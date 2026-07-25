export const dynamic = 'force-dynamic';

import { NotesView } from '@/components/dashboard/notes-view';

export const metadata = {
  title: 'AI Notes & Mind Maps | EducAI',
  description: 'AI-generated notes and interactive mind maps.',
};

export default function NotesPage() {
  return <NotesView />;
}
