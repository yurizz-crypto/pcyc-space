'use client';

import React from 'react';
import { motion } from 'motion/react';

interface HeroGlowProps {
  className?: string;
}

export function HeroGlow({ className = '' }: HeroGlowProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}>
      {/* Primary Warm Floating Orb */}
      <motion.div
        animate={{
          scale: [1, 1.18, 0.96, 1],
          x: [0, 45, -25, 0],
          y: [0, -35, 25, 0],
          opacity: [0.35, 0.55, 0.3, 0.35],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-28 -left-28 w-[420px] h-[420px] sm:w-[580px] sm:h-[580px] rounded-full bg-radial from-[#e0a861]/40 via-[#e0a861]/15 to-transparent blur-3xl will-change-transform"
      />

      {/* Secondary Deep Forest Accent Orb */}
      <motion.div
        animate={{
          scale: [1, 1.22, 1],
          x: [0, -55, 35, 0],
          y: [0, 45, -25, 0],
          opacity: [0.22, 0.4, 0.22],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1.5,
        }}
        className="absolute top-1/4 -right-28 w-[380px] h-[380px] sm:w-[520px] sm:h-[520px] rounded-full bg-radial from-[#4a573e]/35 via-[#2c3324]/15 to-transparent blur-3xl will-change-transform"
      />

      {/* Center Radiant Halo */}
      <motion.div
        animate={{
          opacity: [0.18, 0.32, 0.18],
          scale: [0.92, 1.08, 0.92],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] sm:w-[750px] sm:h-[450px] rounded-full bg-radial from-[#e0a861]/20 via-transparent to-transparent blur-3xl will-change-transform"
      />

      {/* Bottom Center Depth Orb */}
      <motion.div
        animate={{
          opacity: [0.15, 0.28, 0.15],
          scale: [0.95, 1.1, 0.95],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-36 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full bg-radial from-[#e0a861]/25 via-transparent to-transparent blur-3xl will-change-transform"
      />

      {/* Delicate Twinkling Golden Dust Particles */}
      <div className="absolute inset-0 opacity-40 dark:opacity-60">
        {[
          { top: '15%', left: '18%', delay: 0, duration: 4 },
          { top: '28%', left: '78%', delay: 1.2, duration: 5.5 },
          { top: '65%', left: '12%', delay: 2.4, duration: 4.8 },
          { top: '72%', left: '82%', delay: 0.8, duration: 6 },
          { top: '42%', left: '52%', delay: 3, duration: 5 },
          { top: '85%', left: '40%', delay: 1.8, duration: 4.2 },
        ].map((particle, i) => (
          <motion.div
            key={i}
            animate={{
              opacity: [0.2, 0.9, 0.2],
              scale: [0.8, 1.3, 0.8],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: particle.delay,
            }}
            style={{
              top: particle.top,
              left: particle.left,
            }}
            className="absolute h-1.5 w-1.5 rounded-full bg-[#e0a861] shadow-[0_0_8px_#e0a861]"
          />
        ))}
      </div>
    </div>
  );
}
