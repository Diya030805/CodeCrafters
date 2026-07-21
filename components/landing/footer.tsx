'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowUp, 
  Send,
  Mail,
  BookOpen,
  MessageSquare,
  Globe,
  Briefcase
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useAccent } from '@/components/accent-provider';
import { cn } from '@/lib/utils';

export function Footer() {
  const { darkMode } = useTheme();
  const { meta } = useAccent();
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-200 dark:border-white/[0.05] bg-slate-100/50 dark:bg-black/20 backdrop-blur-xl pt-20 pb-10 transition-colors duration-300 relative overflow-hidden">
      {/* Background ambient subtle glow */}
      <div className="w-64 h-64 bg-amber-500/[0.02] blur-[100px] rounded-full absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          
          {/* Brand Info (Span 2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
                style={{ backgroundColor: meta.hex }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-heading font-black tracking-tight text-slate-900 dark:text-white">
                EduSpark<span className="text-amber-500">.</span>
              </span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm leading-relaxed max-w-xs font-medium">
              Revolutionizing computer science and cognitive learning pathways through responsive, real-time AI telemetries.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {[
                { icon: Globe, href: "#", name: "Website" },
                { icon: Send, href: "#", name: "Telegram" },
                { icon: Briefcase, href: "#", name: "Careers" },
                { icon: MessageSquare, href: "#", name: "Support" }
              ].map((social, i) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={i}
                    href={social.href}
                    title={social.name}
                    className="w-9 h-9 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-white/50 dark:bg-[#121316]/40 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:border-amber-500/20 transition-all hover:scale-110"
                  >
                    <Icon className="w-4 h-4" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="font-extrabold text-xs tracking-wider text-slate-900 dark:text-white uppercase mb-6">
              Product
            </h4>
            <ul className="space-y-3">
              {['AI Tutor', 'Smart Notes', 'Quiz Generator', 'Study Planner', 'Flashcards'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h4 className="font-extrabold text-xs tracking-wider text-slate-900 dark:text-white uppercase mb-6">
              Resources
            </h4>
            <ul className="space-y-3">
              {['Documentation', 'Community', 'Tutorials', 'API Reference', 'Status'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="font-extrabold text-xs tracking-wider text-slate-900 dark:text-white uppercase mb-6">
              Legal
            </h4>
            <ul className="space-y-3">
              {['Privacy Policy', 'Terms of Service', 'Security Rules', 'Cookie Settings'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Subscription (Span 2 Columns on large screen or normal) */}
          <div className="space-y-4 lg:col-span-1 min-w-[200px]">
            <h4 className="font-extrabold text-xs tracking-wider text-slate-900 dark:text-white uppercase">
              Newsletter
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Receive smart research and product updates.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-slate-200/50 dark:bg-white/[0.04] border border-slate-300 dark:border-white/[0.06] text-slate-800 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full h-9 rounded-lg text-white font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5"
                style={{ backgroundColor: meta.hex }}
              >
                <Mail className="w-3.5 h-3.5" />
                {subscribed ? "Subscribed!" : "Subscribe"}
              </button>
            </form>
          </div>

        </div>

        {/* Bottom copyright & Back to Top Row */}
        <div className="pt-8 border-t border-slate-200 dark:border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} EduSpark AI Technologies. All rights reserved. Made for academics.
          </p>

          {/* Back to Top Button */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-white/50 dark:bg-[#121316]/40 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:border-amber-500/20 hover:scale-105 transition-all cursor-pointer shadow-sm"
          >
            Back to top
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
