'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck } from '@phosphor-icons/react/dist/ssr';
import { springs } from '@/lib/motion';

export default function AdminLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={springs.default}
        className="flex flex-col items-center gap-6"
      >
        <div className="relative flex items-center justify-center h-20 w-20">
          {/* Rotating loading ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#e0a861] border-r-[#e0a861]/30"
          />
          {/* Inner Shield Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ ...springs.bouncy, delay: 0.1 }}
            className="h-14 w-14 rounded-2xl bg-[#e0a861]/10 flex items-center justify-center text-[#e0a861] shadow-inner backdrop-blur-sm"
          >
            <ShieldCheck weight="duotone" className="h-7 w-7" />
          </motion.div>
        </div>

        <div className="space-y-1.5 text-center">
          <motion.h3
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springs.snappy, delay: 0.15 }}
            className="font-serif font-bold text-[#2c3324] dark:text-[#fefcf1] text-lg tracking-tight"
          >
            Loading Module...
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-[13px] text-[#707666] dark:text-[#a3ab98]"
          >
            Synchronizing data with the PCYC command center
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
