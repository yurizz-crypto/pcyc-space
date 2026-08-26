'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookBookmark, Compass, Sparkle, Heart, Flame, ArrowRight } from '@phosphor-icons/react';
import { InteractiveCard } from '@/components/ui/interactive-card';
import { springs } from '@/lib/motion';

const MILESTONES = [
  {
    step: '01',
    icon: BookBookmark,
    title: 'Apostolic Pattern & Roots',
    period: 'Foundational Truth',
    highlight: 'Rooted in the Inspired Word',
    summary:
      'Patterned after the first-century ecclesias with no paid clergy or human creed. Christadelphians in the Philippines assemble around the Bible as the sole authority of faith and life.',
    details: [
      'Weekly Sunday breaking of bread memorial services',
      'Whole-Bible contextual study without dogmatic traditions',
      'Autonomous ecclesias bound by one hope and one faith',
    ],
  },
  {
    step: '02',
    icon: Compass,
    title: 'Birth of PCYC Fellowship',
    period: 'Connecting the Islands',
    highlight: 'Luzon, Visayas, & Mindanao',
    summary:
      'Recognizing the unique spiritual and moral challenges facing young believers in universities and modern workplaces, youth leaders founded PCYC to bridge island distances.',
    details: [
      'Inter-island youth connectivity and mutual encouragement',
      'Travel subsidies for provincial delegates from distant islands',
      'Youth-led study circles addressing modern youth questions',
    ],
  },
  {
    step: '03',
    icon: Flame,
    title: 'Annual Youth Camps',
    period: 'National Gatherings',
    highlight: 'Days in the Word & Prayer',
    summary:
      'Immersive annual camps held in scenic Philippine retreat venues, giving young brothers, sisters, and searching friends days of uninterrupted Bible study, heartfelt worship, and lifelong friendship.',
    details: [
      'Morning and evening Bible lectures by seasoned brethren',
      'Small-group discussion circles and collaborative projects',
      'Warm fellowship, campfire praise, and outdoor activities',
    ],
  },
  {
    step: '04',
    icon: Heart,
    title: 'Empowering Next-Gen Faith',
    period: 'Present & Kingdom Hope',
    highlight: 'Living for Christ Today',
    summary:
      'PCYC continues to equip young disciples to lead in their local ecclesias, preach the Gospel of the Kingdom, and live with conviction while awaiting the return of the Lord Jesus Christ.',
    details: [
      'Active preaching and Bible distribution across cities',
      'Zero-fee fundraising store supporting camp scholarships',
      'Mentorship for unbaptized youth seeking baptism in Christ',
    ],
  },
];

export function AboutHeritageTimeline() {
  const [activeStep, setActiveStep] = useState(0);
  const activeMilestone = MILESTONES[activeStep];
  const IconComponent = activeMilestone.icon;

  return (
    <div className="space-y-10">
      {/* Stepper Navigation Pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {MILESTONES.map((item, idx) => {
          const isSelected = activeStep === idx;
          const StepIcon = item.icon;

          return (
            <button
              key={item.step}
              type="button"
              onClick={() => setActiveStep(idx)}
              className={`relative p-4 rounded-2xl text-left transition-all duration-300 cursor-pointer border ${
                isSelected
                  ? 'bg-white dark:bg-[#131710] border-[#e0a861] shadow-lg ring-2 ring-[#e0a861]/20'
                  : 'bg-[#f8f4e3] dark:bg-[#1b2117] border-[#e6dfcb] dark:border-[#323d2b] hover:border-[#e0a861]/40'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="activeTimelinePill"
                  transition={springs.default}
                  className="absolute inset-0 border-2 border-[#e0a861] rounded-2xl pointer-events-none"
                />
              )}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`text-xs font-bold font-mono px-2 py-0.5 rounded-md ${
                    isSelected
                      ? 'bg-[#e0a861] text-[#2c3324]'
                      : 'bg-black/5 dark:bg-white/10 text-[#707666] dark:text-[#a3ab98]'
                  }`}
                >
                  {item.step}
                </span>
                <StepIcon
                  weight="duotone"
                  className={`h-5 w-5 ${
                    isSelected ? 'text-[#9a6423] dark:text-[#f0be7c]' : 'text-[#707666] dark:text-[#a3ab98]'
                  }`}
                />
              </div>
              <div className="space-y-0.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#9a6423] dark:text-[#f0be7c]">
                  {item.period}
                </div>
                <div className="font-serif font-bold text-sm text-[#2c3324] dark:text-[#fefcf1] line-clamp-1">
                  {item.title}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Milestone Card Showcase */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={springs.default}
        >
          <InteractiveCard className="rounded-[2.5rem] bg-white dark:bg-[#131710] border border-[#e6dfcb] dark:border-[#323d2b] p-8 sm:p-12 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Details */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-2xl bg-[#fbf1e2] dark:bg-[#252e1f] text-[#e0a861] flex items-center justify-center shadow-xs">
                    <IconComponent weight="duotone" className="h-7 w-7 text-[#9a6423] dark:text-[#f0be7c]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#9a6423] dark:text-[#f0be7c] block">
                      Phase {activeMilestone.step} • {activeMilestone.period}
                    </span>
                    <h3 className="font-serif text-3xl font-bold text-[#2c3324] dark:text-[#fefcf1]">
                      {activeMilestone.title}
                    </h3>
                  </div>
                </div>

                <p className="text-base sm:text-lg text-[#5a634e] dark:text-[#a3ab98] leading-relaxed">
                  {activeMilestone.summary}
                </p>

                <div className="space-y-2.5 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2c3324] dark:text-[#fefcf1] block">
                    Core Pillars & Hallmarks:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-1 gap-2">
                    {activeMilestone.details.map((detail, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#505748] dark:text-[#a3ab98]">
                        <Sparkle weight="fill" className="h-4 w-4 text-[#e0a861] shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Visual Badge Feature */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-sm rounded-3xl bg-gradient-to-br from-[#2c3324] to-[#1a2015] text-[#fefcf1] p-8 border border-[#445037] shadow-xl relative overflow-hidden text-center space-y-4">
                  <div className="absolute top-0 right-0 -mr-8 -mt-8 text-[110px] font-serif font-bold text-white/5 select-none pointer-events-none">
                    {activeMilestone.step}
                  </div>
                  <div className="relative z-10 space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#e0a861]">
                      {activeMilestone.highlight}
                    </span>
                    <p className="font-serif text-xl sm:text-2xl font-bold leading-snug text-[#fefcf1]">
                      &ldquo;Serving the Lord with one mind, striving together for the faith of the gospel.&rdquo;
                    </p>
                    <span className="text-xs text-[#f8f4e3]/70 font-serif italic block">Philippians 1:27</span>
                  </div>
                </div>
              </div>

            </div>
          </InteractiveCard>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
