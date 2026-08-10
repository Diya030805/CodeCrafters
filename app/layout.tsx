export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { AccentProvider } from '@/components/accent-provider';
import { ScrollToTop } from '@/components/ScrollToTop';
import { cn } from '@/lib/utils';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
});

export const metadata: Metadata = {
  title: 'BrainBoost AI | Elite AI Learning SaaS',
  description: 'Next-generation AI-powered study planner and educational dashboard.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = stored === 'light' || stored === 'dark' ? stored : (prefersDark ? 'dark' : 'light');
                  document.documentElement.classList.remove('light', 'dark');
                  document.documentElement.classList.add(theme);
                  document.documentElement.style.colorScheme = theme;
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body
        className={cn(
          'min-h-screen font-sans antialiased transition-colors duration-300',
          inter.variable,
          spaceGrotesk.variable
        )}
      >
        <ThemeProvider>
          {/* Noise & Grid Overlay */}
          <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-noise opacity-[0.02]" />
            <div className="absolute inset-0 bg-grid-dots text-[color:var(--text-secondary)] opacity-[0.05]" />
            {/* Ambient Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[color:var(--accent)]/10 blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[color:var(--accent)]/10 blur-[120px] animate-pulse" />
          </div>
          <AccentProvider>
            <ScrollToTop />
            {children}
          </AccentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
