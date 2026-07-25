'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'center' | 'start' | 'end';
  className?: string;
  delay?: number;
  disabled?: boolean;
}

export function Tooltip({
  content,
  children,
  side = 'top',
  align = 'center',
  className,
  delay = 150,
  disabled = false,
}: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (disabled || !content) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (disabled || !content) {
    return <>{children}</>;
  }

  // Positioning styles based on side and align
  const getPositionClasses = () => {
    switch (side) {
      case 'top':
        return 'bottom-full mb-2';
      case 'bottom':
        return 'top-full mt-2';
      case 'left':
        return 'right-full mr-2';
      case 'right':
        return 'left-full ml-2';
      default:
        return 'bottom-full mb-2';
    }
  };

  const getAlignClasses = () => {
    if (side === 'top' || side === 'bottom') {
      switch (align) {
        case 'start':
          return 'left-0';
        case 'end':
          return 'right-0';
        case 'center':
        default:
          return 'left-1/2 -translate-x-1/2';
      }
    } else {
      switch (align) {
        case 'start':
          return 'top-0';
        case 'end':
          return 'bottom-0';
        case 'center':
        default:
          return 'top-1/2 -translate-y-1/2';
      }
    }
  };

  // Framer motion variants
  const getInitialAnimation = () => {
    switch (side) {
      case 'top':
        return { opacity: 0, y: 4, scale: 0.95 };
      case 'bottom':
        return { opacity: 0, y: -4, scale: 0.95 };
      case 'left':
        return { opacity: 0, x: 4, scale: 0.95 };
      case 'right':
        return { opacity: 0, x: -4, scale: 0.95 };
      default:
        return { opacity: 0, scale: 0.95 };
    }
  };

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={getInitialAnimation()}
            animate={{ opacity: 1, x: side === 'left' || side === 'right' ? 0 : undefined, y: side === 'top' || side === 'bottom' ? 0 : undefined, scale: 1 }}
            exit={getInitialAnimation()}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={cn(
              'absolute z-50 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold tracking-wide whitespace-nowrap pointer-events-none shadow-lg',
              'bg-slate-900/95 dark:bg-zinc-900/95 text-slate-100 dark:text-zinc-100 border border-slate-800 dark:border-zinc-800/80 backdrop-blur-md',
              getPositionClasses(),
              getAlignClasses(),
              className
            )}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
