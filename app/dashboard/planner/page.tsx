import { StudyPlannerView } from '@/components/dashboard/study-planner-view';

export const metadata = {
  title: 'Smart Study Planner | EducAI',
  description: 'AI-powered Study Planner to organize learning goals, schedule tasks, track deadlines, and optimize study habits.',
};

export default function PlannerPage() {
  return <StudyPlannerView />;
}
