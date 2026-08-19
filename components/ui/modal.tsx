'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { modalVariants } from '@/lib/motion';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: ModalProps) {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Frosted Glass Backdrop */}
          <motion.div
            variants={modalVariants.backdrop}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 bg-[#2c3324]/60 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Dialog with Apple Spring Animation */}
          <motion.div
            variants={modalVariants.dialog}
            initial="initial"
            animate="animate"
            exit="exit"
            className={cn(
              'relative w-full max-w-lg rounded-2xl bg-[#fefcf1] dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b] p-6 shadow-2xl z-10 text-[#2c3324] dark:text-[#fefcf1]',
              className
            )}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-xl p-1.5 text-[#707666] dark:text-[#a3ab98] hover:bg-[#2c3324]/10 dark:hover:bg-[#fefcf1]/10 hover:text-[#2c3324] dark:hover:text-[#fefcf1] transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {title && (
              <div className="mb-4 pr-8">
                <h3 className="font-serif text-2xl font-bold text-[#2c3324] dark:text-[#fefcf1] tracking-tight">{title}</h3>
                {description && (
                  <p className="mt-1 text-sm text-[#707666] dark:text-[#a3ab98]">{description}</p>
                )}
              </div>
            )}

            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
