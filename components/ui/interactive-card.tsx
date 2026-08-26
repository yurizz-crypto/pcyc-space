'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/utils';
import { springs } from '@/lib/motion';

interface InteractiveCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  enableSpotlight?: boolean;
  enableTilt?: boolean;
  spotlightColor?: string;
}

/**
 * Interactive card with physical 3D perspective tilt, specular glare, and cursor spotlight.
 */
export function InteractiveCard({
  children,
  className,
  enableSpotlight = true,
  enableTilt = true,
  spotlightColor = 'rgba(224, 168, 97, 0.12)',
  ...props
}: InteractiveCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position normalized between -0.5 and 0.5 for tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for smooth tilt reaction and recovery
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), {
    stiffness: 300,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), {
    stiffness: 300,
    damping: 25,
  });

  // Declare spotlight transform at top level to obey Rules of Hooks
  const spotlightBackground = useTransform(
    [mouseX, mouseY],
    ([cx, cy]) =>
      `radial-gradient(450px circle at ${cx}px ${cy}px, ${spotlightColor}, transparent 75%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    mouseX.set(clientX);
    mouseY.set(clientY);

    if (enableTilt) {
      x.set(clientX / width - 0.5);
      y.set(clientY / height - 0.5);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        rotateX: enableTilt ? rotateX : 0,
        rotateY: enableTilt ? rotateY : 0,
      }}
      whileHover={{ y: -4, transition: springs.default }}
      whileTap={{ scale: 0.98, transition: springs.tap.transition }}
      className={cn(
        'relative overflow-hidden rounded-3xl transition-shadow duration-300 will-change-transform',
        className
      )}
      {...props}
    >
      {/* Dynamic Cursor Spotlight */}
      {enableSpotlight && (
        <motion.div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-0"
          style={{
            background: spotlightBackground,
            opacity: isHovered ? 1 : 0,
          }}
        />
      )}

      {/* Subtle Specular Glare Reflection on Hover */}
      {enableTilt && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-tr from-white/0 via-white/5 to-white/15 dark:from-white/0 dark:via-white/2 dark:to-white/8 transition-opacity duration-300"
          style={{
            transform: 'translateZ(1px)',
            opacity: isHovered ? 0.7 : 0,
          }}
        />
      )}

      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}
