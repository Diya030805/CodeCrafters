export const dynamic = 'force-dynamic';

import { GamificationView } from '@/components/dashboard/gamification-view';

export const metadata = {
  title: 'Gamification Center | EducAI',
  description: 'Motivating learning through rewards, achievements, and progress.',
};

export default function GamificationPage() {
  return <GamificationView />;
}
