'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/landing/navbar';
import { Hero } from '@/components/landing/hero';
import { Footer } from '@/components/landing/footer';
import { motion, AnimatePresence } from 'motion/react';
import { CommandCenter } from '@/components/landing/command-center';
import { Features } from '@/components/landing/features';
import { HowItWorks } from '@/components/landing/how-it-works';
import { DashboardShowcase } from '@/components/landing/dashboard-showcase';
import { Testimonials } from '@/components/landing/testimonials';
import { FAQ } from '@/components/landing/faq';
import { Pricing } from '@/components/landing/pricing';
import { Preloader } from '@/components/landing/preloader';

export default function Home() {
  const router = useRouter();
  const [activeSection, setActiveSection] = React.useState<string>('');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    const sections = ['features', 'how-it-works', 'pricing', 'faq'];
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [loading]);

  const handleNavigate = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGetStarted = () => {
    router.push('/dashboard');
  };

  const handleBrandClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Preloader onComplete={() => setLoading(false)} />
      
      <main className="min-h-screen bg-slate-50 text-slate-800 dark:bg-[#0B0C0E] dark:text-white relative overflow-x-hidden transition-colors duration-300">
        {/* Soft Ambient Radial Background Glows */}
        <div className="absolute top-[15%] left-[20%] -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/5 dark:bg-blue-600/10 blur-[130px] rounded-full pointer-events-none z-0" />
        <div className="absolute top-[50%] right-[15%] w-[700px] h-[700px] bg-amber-600/5 dark:bg-amber-600/10 blur-[150px] rounded-full pointer-events-none z-0" />
        
        <AnimatePresence>
          {!loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10"
            >
              <Navbar 
                view="landing"
                onGetStarted={handleGetStarted}
                onBrandClick={handleBrandClick}
                activeSection={activeSection}
                onNavigate={handleNavigate}
              />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key="landing"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <Hero onStartFreeTrial={handleGetStarted} />

                  <div className="border-b border-black/[0.05] dark:border-white/[0.05]">
                    <Features />
                  </div>
                  <div className="border-b border-black/[0.05] dark:border-white/[0.05]">
                    <HowItWorks />
                  </div>
                  <div className="border-b border-black/[0.05] dark:border-white/[0.05]">
                    <DashboardShowcase />
                  </div>
                  <div className="border-b border-black/[0.05] dark:border-white/[0.05]">
                    <Testimonials />
                  </div>
                  <div className="border-b border-black/[0.05] dark:border-white/[0.05]">
                    <FAQ />
                  </div>
                  <div className="border-b border-black/[0.05] dark:border-white/[0.05]">
                    <Pricing onSelectPlan={handleGetStarted} />
                  </div>

                  <CommandCenter onInitialize={handleGetStarted} />

                  <Footer />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}

