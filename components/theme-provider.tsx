'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ThemeContextType {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (soundEnabled: boolean) => void;
}

const ThemeContext = React.createContext<ThemeContextType>({
  darkMode: true,
  setDarkMode: () => {},
  soundEnabled: true,
  setSoundEnabled: () => {},
});

export function ThemeProvider({
  children,
  ...props
}: {
  children: React.ReactNode;
  [key: string]: any;
}) {
  const [darkMode, setDarkMode] = React.useState(true);
  const [soundEnabled, setSoundEnabled] = React.useState(true);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize theme preference from localStorage on mount
      const stored = localStorage.getItem('theme-dark');
      if (stored !== null) {
        const isDark = stored === 'true';
        requestAnimationFrame(() => {
          setDarkMode(isDark);
        });
      } else {
        // Default to dark mode if no setting is saved yet
        requestAnimationFrame(() => {
          setDarkMode(true);
        });
      }
      
      // Initialize sound preference from localStorage on mount
      const storedSound = localStorage.getItem('theme-sound');
      if (storedSound !== null) {
        const isSound = storedSound === 'true';
        requestAnimationFrame(() => {
          setSoundEnabled(isSound);
        });
      }
    }
  }, []);

  const handleDarkModeChange = React.useCallback((isDark: boolean) => {
    setDarkMode(isDark);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme-dark', String(isDark));
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const handleSoundChange = React.useCallback((enabled: boolean) => {
    setSoundEnabled(enabled);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme-sound', String(enabled));
    }
  }, []);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ 
      darkMode, 
      setDarkMode: handleDarkModeChange,
      soundEnabled,
      setSoundEnabled: handleSoundChange
    }}>
      <div className={cn("min-h-screen transition-colors duration-300", darkMode ? "dark" : "")}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  return {
    theme: context.darkMode ? 'dark' : 'light',
    setTheme: (theme: string) => context.setDarkMode(theme === 'dark'),
    darkMode: context.darkMode,
    setDarkMode: context.setDarkMode,
    soundEnabled: context.soundEnabled,
    setSoundEnabled: context.setSoundEnabled,
  };
}
