export const dynamic = 'force-dynamic';

import { VoiceTutorView } from '@/components/dashboard/voice-tutor-view';

export const metadata = {
  title: 'Voice AI Tutor | EducAI',
  description: 'Interactive voice-based AI learning sessions.',
};

export default function VoiceTutorPage() {
  return <VoiceTutorView />;
}
