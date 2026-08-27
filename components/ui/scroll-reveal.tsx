"use client";
import React from "react";
import { motion } from "motion/react";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  yOffset?: number;
}

/**
 * ScrollReveal Component
 * 
 * Provides an Apple-style fluid entrance animation triggered when the element scrolls into the viewport.
 * Uses a highly-optimized Framer Motion cubic-bezier curve `[0.16, 1, 0.3, 1]` for a 
 * pronounced "snappy but smooth" deceleration profile.
 * 
 * @param {ScrollRevealProps} props 
 * @param {React.ReactNode} props.children - Content to be animated.
 * @param {number} [props.delay=0] - Stagger delay in seconds before animation begins.
 * @param {string} [props.className] - Optional Tailwind classes to merge onto the wrapper.
 * @param {number} [props.yOffset=24] - Vertical translation offset in pixels.
 * @returns {JSX.Element}
 */
export function ScrollReveal({
  children,
  delay = 0,
  className = "",
  yOffset = 24,
}: ScrollRevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        visible: {
          transition: { staggerChildren: 0.1 },
        },
        hidden: {},
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
  yOffset = 24,
}: {
  children: React.ReactNode;
  className?: string;
  yOffset?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: yOffset },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
