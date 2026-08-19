import { type Transition, type Variants } from 'motion/react';

/**
 * Apple Design System - Spring Physics Constants
 * Based on Apple WWDC "Designing Fluid Interfaces" & Human Interface Guidelines
 */
export const springs = {
  /** Critically damped default UI spring (damping ~1.0, no bounce, natural settle) */
  default: {
    type: 'spring',
    damping: 30,
    stiffness: 350,
    mass: 0.8,
  } as const satisfies Transition,

  /** Snappy spring for quick state toggles, segmented controls, and button taps */
  snappy: {
    type: 'spring',
    damping: 26,
    stiffness: 420,
    mass: 0.6,
  } as const satisfies Transition,

  /** Momentum spring with subtle overshoot for physical gestures, flicks, and drops */
  bouncy: {
    type: 'spring',
    damping: 20,
    stiffness: 280,
    mass: 0.8,
  } as const satisfies Transition,

  /** Soft, deep spring for sheets, drawers, and modal overlays */
  sheet: {
    type: 'spring',
    damping: 34,
    stiffness: 300,
    mass: 0.9,
  } as const satisfies Transition,

  /** Tactile button press configuration */
  tap: {
    scale: 0.97,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 30,
    },
  },
} as const;

/**
 * Reusable modal animation variants
 */
export const modalVariants: {
  backdrop: Variants;
  dialog: Variants;
} = {
  backdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.2, ease: 'easeOut' } },
    exit: { opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } },
  },
  dialog: {
    initial: { opacity: 0, scale: 0.94, y: 12 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: springs.default,
    },
    exit: {
      opacity: 0,
      scale: 0.96,
      y: 8,
      transition: { duration: 0.15, ease: [0.4, 0, 1, 1] },
    },
  },
};

/**
 * Slide-over sheet animation variants
 */
export const sheetVariants: {
  backdrop: Variants;
  right: Variants;
  bottom: Variants;
} = {
  backdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } },
    exit: { opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } },
  },
  right: {
    initial: { x: '100%' },
    animate: { x: 0, transition: springs.sheet },
    exit: { x: '100%', transition: { duration: 0.22, ease: [0.4, 0, 1, 1] } },
  },
  bottom: {
    initial: { y: '100%' },
    animate: { y: 0, transition: springs.sheet },
    exit: { y: '100%', transition: { duration: 0.22, ease: [0.4, 0, 1, 1] } },
  },
};

/**
 * Toast animation variants with swipe dismiss support
 */
export const toastVariants: Variants = {
  initial: { opacity: 0, y: 16, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springs.snappy,
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 10,
    transition: { duration: 0.15, ease: 'easeIn' },
  },
};
