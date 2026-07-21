'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

interface FAQItem {
  question: string;
  answer: string;
}

const faqList: FAQItem[] = [
  {
    question: "What is EduSpark AI?",
    answer: "EduSpark is an intelligent study platform combining conversational AI tutoring, automated spaced-repetition flashcards, adaptive calendar planning, and real-time retention telemetry to help students maximize cognitive recall and excel academically."
  },
  {
    question: "How does AI Tutor work?",
    answer: "Our AI Tutor utilizes advanced large language models customized specifically for structured learning. It parses study material in real-time, designs step-by-step diagnostic loops, answers theoretical questions, and updates your personalized weakness profile continuously."
  },
  {
    question: "Can I upload PDFs?",
    answer: "Yes! You can upload textbook chapters, course slides, homework sheets, and academic papers up to 50MB. Once uploaded, the system indexes the document to let you extract summaries, run conversational prompts, or generate practice quizzes directly."
  },
  {
    question: "Can I generate quizzes?",
    answer: "Absolutely. You can generate custom quizzes spanning single chapters or whole courses. Simply prompt the AI Tutor, select dynamic difficulty levels (Novice, Adept, Master), and receive automated answer sheets with comprehensive reasoning breakdowns."
  },
  {
    question: "Is there a free plan?",
    answer: "Yes, EduSpark offers a free forever plan that provides access to basic study planners, notes generators, limited AI Tutor sessions, and simple dashboard workspaces. Upgrading to the Pro tier unlocks unlimited AI features, PDF uploads, and premium diagnostics."
  }
];

export function FAQ() {
  const { darkMode } = useTheme();
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <section className="w-full py-20 px-4 bg-transparent relative overflow-hidden" id="faq">
      {/* Background ambient blur */}
      <div className="w-[500px] h-[500px] bg-amber-500/[0.01] dark:bg-amber-600/[0.03] blur-[150px] rounded-full absolute bottom-10 right-10 -z-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] uppercase tracking-widest font-black mb-4"
          >
            <span>FAQ CORE</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-heading font-black tracking-tight mb-4 text-slate-900 dark:text-white"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-sm md:text-base font-medium"
          >
            Got questions? We have direct answers about our platform, features, and billing plans.
          </motion.p>
        </div>

        {/* Accordions Stack */}
        <div className="space-y-4">
          {faqList.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className={cn(
                  "rounded-2xl border transition-all duration-300 overflow-hidden",
                  isOpen 
                    ? (darkMode ? "bg-[#121316]/60 border-amber-500/30" : "bg-white border-amber-500/30 shadow-lg")
                    : (darkMode ? "bg-[#121316]/40 border-white/[0.08]" : "bg-white/50 border-black/[0.06]")
                )}
              >
                {/* Accordion trigger */}
                <button
                  onClick={() => toggleIndex(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer group"
                >
                  <span className={cn(
                    "font-bold text-sm md:text-base text-slate-800 dark:text-white transition-colors duration-300",
                    isOpen ? "text-amber-600 dark:text-amber-400" : "group-hover:text-amber-600 dark:group-hover:text-amber-400"
                  )}>
                    {item.question}
                  </span>
                  <div className={cn(
                    "w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 shrink-0",
                    isOpen 
                      ? "border-amber-500/30 bg-amber-500/15 text-amber-500" 
                      : "border-slate-200 dark:border-white/[0.05] text-slate-400 group-hover:border-slate-300 dark:group-hover:border-white/[0.1]"
                  )}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {/* Expanded Answer with dynamic height animation */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-6 pb-6 pt-1 text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium border-t border-slate-200/50 dark:border-white/[0.03]">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
