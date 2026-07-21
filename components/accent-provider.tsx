'use client';

import * as React from 'react';

export type AccentColor = 'amber' | 'blue' | 'green' | 'crimson';

export const accentMeta = {
  amber: {
    label: 'Amber',
    color: 'bg-amber-600',
    ring: 'ring-amber-600',
    hex: '#d97706',
    dark: {
      highlight: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      button: 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20',
      text: 'text-amber-400',
      shadow: 'rgba(217,119,6,0.3)',
    },
    light: {
      highlight: 'bg-amber-100 text-amber-700 border-amber-200',
      button: 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20',
      text: 'text-amber-700',
      shadow: 'rgba(215,115,5,0.2)',
    }
  },
  blue: {
    label: 'Blue',
    color: 'bg-blue-600',
    ring: 'ring-blue-600',
    hex: '#2563eb',
    dark: {
      highlight: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      button: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20',
      text: 'text-blue-400',
      shadow: 'rgba(37,99,235,0.3)',
    },
    light: {
      highlight: 'bg-blue-100 text-blue-700 border-blue-200',
      button: 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/20',
      text: 'text-blue-700',
      shadow: 'rgba(37,99,235,0.2)',
    }
  },
  green: {
    label: 'Green',
    color: 'bg-emerald-600',
    ring: 'ring-emerald-600',
    hex: '#059669',
    dark: {
      highlight: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      button: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20',
      text: 'text-emerald-400',
      shadow: 'rgba(5,150,105,0.3)',
    },
    light: {
      highlight: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      button: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20',
      text: 'text-emerald-700',
      shadow: 'rgba(5,150,105,0.2)',
    }
  },
  crimson: {
    label: 'Crimson',
    color: 'bg-rose-600',
    ring: 'ring-rose-600',
    hex: '#e11d48',
    dark: {
      highlight: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      button: 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20',
      text: 'text-rose-400',
      shadow: 'rgba(225,29,72,0.3)',
    },
    light: {
      highlight: 'bg-rose-100 text-rose-700 border-rose-200',
      button: 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20',
      text: 'text-rose-700',
      shadow: 'rgba(225,29,72,0.2)',
    }
  }
};

interface AccentContextType {
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
}

const AccentContext = React.createContext<AccentContextType>({
  accentColor: 'amber',
  setAccentColor: () => {},
});

export function AccentProvider({ children }: { children: React.ReactNode }) {
  const [accentColor, setAccentColor] = React.useState<AccentColor>('amber');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme-accent');
      if (stored === 'amber' || stored === 'blue' || stored === 'green' || stored === 'crimson') {
        const color = stored as AccentColor;
        setTimeout(() => {
          setAccentColor(color);
        }, 0);
      }
    }
  }, []);

  const handleAccentChange = (color: AccentColor) => {
    setAccentColor(color);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme-accent', color);
    }
  };

  return (
    <AccentContext.Provider value={{ accentColor, setAccentColor: handleAccentChange }}>
      {children}
    </AccentContext.Provider>
  );
}

export function useAccent() {
  const context = React.useContext(AccentContext);
  return {
    ...context,
    meta: accentMeta[context.accentColor],
  };
}
