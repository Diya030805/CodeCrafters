import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Voice AI Tutor | EducAI',
  description: 'Interactive voice-based AI learning sessions.',
};

export default function VoiceTutorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
