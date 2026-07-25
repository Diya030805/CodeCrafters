export const dynamic = 'force-dynamic';

import { AnalyticsView } from '@/components/dashboard/analytics-view';

export const metadata = {
  title: 'Learning Analytics | EducAI',
  description: 'Deep performance intelligence dashboard tracking study hours, retention, quiz scores, AI interactions, and learning goals.',
};

export default function AnalyticsPage() {
  return <AnalyticsView />;
}
