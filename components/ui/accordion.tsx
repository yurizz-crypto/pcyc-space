'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CaretDown } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { springs } from '@/lib/motion';

export interface AccordionItemProps {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({
  title,
  subtitle,
  badge,
  children,
  defaultOpen = false,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-[#e6dfcb] dark:border-[#323d2b] rounded-2xl bg-white dark:bg-[#1b2117] overflow-hidden transition-all duration-300 hover:border-[#e0a861]/60">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer select-none"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="font-serif font-bold text-lg sm:text-xl text-[#2c3324] dark:text-[#fefcf1]">
              {title}
            </h3>
            {badge && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#fbf1e2] dark:bg-[#2b2315] text-[#9a6423] dark:text-[#f0be7c] border border-[#e0a861]/30">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-[#707666] dark:text-[#a3ab98] leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={springs.snappy}
          className="h-8 w-8 rounded-full bg-[#f8f4e3] dark:bg-[#252e1f] flex items-center justify-center text-[#2c3324] dark:text-[#fefcf1] shrink-0 border border-[#e6dfcb] dark:border-[#323d2b]"
        >
          <CaretDown weight="bold" className="h-4 w-4" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: 'auto',
              opacity: 1,
              transition: {
                height: springs.sheet,
                opacity: { duration: 0.25 },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.2, ease: [0.4, 0, 1, 1] },
                opacity: { duration: 0.15 },
              },
            }}
            className="overflow-hidden"
          >
            <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-[#505748] dark:text-[#a3ab98] leading-relaxed border-t border-[#f4efe0] dark:border-[#252e1f]">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Accordion({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('space-y-4', className)}>{children}</div>;
}
