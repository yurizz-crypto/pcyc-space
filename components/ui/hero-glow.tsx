'use client';

import React from 'react';
import { motion } from 'motion/react';

export function HeroGlow() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Primary Warm Floating Orb */}
      <motion.div
        animate={{
          scale: [1, 1.15, 0.95, 1],
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
          opacity: [0.35, 0.5, 0.3, 0.35],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-24 -left-24 w-96 h-96 sm:w-[500px] sm:h-[500px] rounded-full bg-radial from-[#e0a861]/40 via-[#e0a861]/15 to-transparent blur-3xl"
      />

      {/* Secondary Forest Accent Orb */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -50, 30, 0],
          y: [0, 40, -20, 0],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        className="absolute top-1/3 -right-20 w-80 h-80 sm:w-[450px] sm:h-[450px] rounded-full bg-radial from-[#4a573e]/30 via-[#2c3324]/10 to-transparent blur-3xl"
      />

      {/* Bottom Center Subtle Glow */}
      <motion.div
        animate={{
          opacity: [0.15, 0.3, 0.15],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-28 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-radial from-[#e0a861]/25 via-transparent to-transparent blur-3xl"
      />
    </div>
  );
}
