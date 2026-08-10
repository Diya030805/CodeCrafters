'use client';

import * as React from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (soundEnabled: boolean) => void;
}

const ThemeContext = React.createContext<ThemeContextType>({
  theme: 'dark',
  setTheme: () => {},
  toggleTheme: () => {},
  soundEnabled: true,
  setSoundEnabled: () => {},
});

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = React.useState<'light' | 'dark'>('dark');
  const [soundEnabled, setSoundEnabled] = React.useState(true);

  const applyTheme = React.useCallback((nextTheme: 'light' | 'dark') => {
    setThemeState(nextTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', nextTheme);
      document.documentElement.classList.remove(nextTheme === 'dark' ? 'light' : 'dark');
      document.documentElement.classList.add(nextTheme);
      document.documentElement.style.colorScheme = nextTheme;
    }
  }, []);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const nextTheme = stored === 'light' || stored === 'dark' ? stored : (prefersDark ? 'dark' : 'light');

      requestAnimationFrame(() => {
        applyTheme(nextTheme);
      });

      const storedSound = localStorage.getItem('theme-sound');
      if (storedSound !== null) {
        const isSound = storedSound === 'true';
        requestAnimationFrame(() => {
          setSoundEnabled(isSound);
        });
      }
    }
  }, [applyTheme]);

  const toggleTheme = React.useCallback(() => {
    applyTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, applyTheme]);

  const handleSoundChange = React.useCallback((enabled: boolean) => {
    setSoundEnabled(enabled);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme-sound', String(enabled));
    }
  }, []);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.remove(theme === 'dark' ? 'light' : 'dark');
      document.documentElement.classList.add(theme);
      document.documentElement.style.colorScheme = theme;
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme: applyTheme,
      toggleTheme,
      soundEnabled,
      setSoundEnabled: handleSoundChange,
    }}>
      <div className="min-h-screen transition-colors duration-300">
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  return {
    theme: context.theme,
    setTheme: context.setTheme,
    toggleTheme: context.toggleTheme,
    darkMode: context.theme === 'dark',
    setDarkMode: (isDark: boolean) => context.setTheme(isDark ? 'dark' : 'light'),
    setSoundEnabled: context.setSoundEnabled,
  };
}
