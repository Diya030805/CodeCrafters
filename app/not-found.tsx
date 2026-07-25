import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mb-6">
        <Home className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-black mb-2">Page Not Found</h1>
      <p className="text-slate-400 text-sm max-w-md mb-8">
        The requested page could not be located in the EducAI application workspace.
      </p>
      <Link
        href="/dashboard"
        className="px-5 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 hover:bg-amber-400 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Dashboard Overview
      </Link>
    </div>
  );
}
