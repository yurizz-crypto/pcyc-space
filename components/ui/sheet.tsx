'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { sheetVariants } from '@/lib/motion';

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  side?: 'right' | 'bottom';
  className?: string;
}

export function Sheet({
  isOpen,
  onClose,
  title,
  description,
  children,
  side = 'right',
  className,
}: SheetProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (side === 'right') {
      if (info.offset.x > 100 || info.velocity.x > 400) {
        onClose();
      }
    } else {
      if (info.offset.y > 100 || info.velocity.y > 400) {
        onClose();
      }
    }
  };

  const isBottom = side === 'bottom';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Frosted Backdrop */}
          <motion.div
            variants={sheetVariants.backdrop}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 bg-[#2c3324]/50 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Sheet Surface */}
          <div
            className={cn(
              'fixed z-50 flex',
              isBottom
                ? 'inset-x-0 bottom-0 max-h-[90vh]'
                : 'inset-y-0 right-0 max-w-full'
            )}
          >
            <motion.div
              variants={isBottom ? sheetVariants.bottom : sheetVariants.right}
              initial="initial"
              animate="animate"
              exit="exit"
              drag={isBottom ? 'y' : 'x'}
              dragConstraints={
                isBottom ? { top: 0, bottom: 300 } : { left: 0, right: 300 }
              }
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              className={cn(
                'relative flex flex-col bg-[#fefcf1] dark:bg-[#1b2117] border-[#e6dfcb] dark:border-[#323d2b] shadow-2xl text-[#2c3324] dark:text-[#fefcf1]',
                isBottom
                  ? 'w-full rounded-t-3xl border-t p-6'
                  : 'w-screen max-w-md border-l p-6 h-full',
                className
              )}
            >
              {/* Bottom Sheet Drag Handle */}
              {isBottom && (
                <div className="mx-auto -mt-2 mb-4 h-1.5 w-12 rounded-full bg-[#2c3324]/20 dark:bg-[#fefcf1]/20 cursor-grab active:cursor-grabbing" />
              )}

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close sheet"
                className="absolute right-4 top-4 rounded-xl p-1.5 text-[#707666] dark:text-[#a3ab98] hover:bg-[#2c3324]/10 dark:hover:bg-[#fefcf1]/10 hover:text-[#2c3324] dark:hover:text-[#fefcf1] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Header */}
              {title && (
                <div className="mb-5 pr-8">
                  <h3 className="font-serif text-2xl font-bold tracking-tight text-[#2c3324] dark:text-[#fefcf1]">
                    {title}
                  </h3>
                  {description && (
                    <p className="mt-1 text-sm text-[#707666] dark:text-[#a3ab98]">
                      {description}
                    </p>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="flex-1 overflow-y-auto">{children}</div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
