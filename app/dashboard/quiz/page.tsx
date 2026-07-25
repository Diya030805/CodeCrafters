import { QuizGeneratorView } from '@/components/dashboard/quiz-generator-view';

export const metadata = {
  title: 'AI Quiz Generator | EducAI',
  description: 'Create, customize, and practice AI-generated quizzes from PDFs, Tutor sessions, and custom topics.',
};

export default function QuizPage() {
  return <QuizGeneratorView />;
}
