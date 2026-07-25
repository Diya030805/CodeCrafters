export const dynamic = 'force-dynamic';

import { RecommendationsView } from '@/components/dashboard/recommendations-view';

export const metadata = {
  title: 'AI Recommendations | EducAI',
  description: 'Personalized AI-driven learning guidance and topic recommendations.',
};

export default function RecommendationsPage() {
  return <RecommendationsView />;
}
