'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Sparkle, BookOpen, MusicNotes, UsersThree, Coffee, Heart } from '@phosphor-icons/react';
import { InteractiveCard } from '@/components/ui/interactive-card';

const SAMPLE_SCHEDULE = [
  {
    day: 'Day 01',
    title: 'Arrival & Welcome Praise',
    subtitle: 'Registration, lodging assignment, and opening evening praise',
    events: [
      { time: '1:00 PM – 4:00 PM', title: 'Delegate Arrival & Room Check-in', desc: 'Welcome desk open for registration badges, study binders, and lodging keys.', icon: Coffee },
      { time: '5:30 PM – 6:30 PM', title: 'Welcome Fellowship Dinner', desc: 'Communal dinner and meet-and-greet with brothers, sisters, and visiting friends.', icon: UsersThree },
      { time: '7:00 PM – 9:00 PM', title: 'Opening Camp Lecture & Theme Introduction', desc: 'First keynote address exploring our theme in Scripture, followed by evening hymns.', icon: BookOpen },
      { time: '9:30 PM', title: 'Evening Fellowship Circle & Curfew', desc: 'Informal discussions, hot chocolate, and lights-out preparation.', icon: Moon },
    ],
  },
  {
    day: 'Day 02',
    title: 'Study, Youth Choir & Recreation',
    subtitle: 'Intensive scriptural workshops, team sports, and choral praise',
    events: [
      { time: '7:30 AM – 8:30 AM', title: 'Morning Praise & Breakfast', desc: 'Devotional reading and breakfast.', icon: Sun },
      { time: '9:00 AM – 11:30 AM', title: 'Interactive Bible Lecture & Exhortation', desc: 'Deep-dive textual study with Q&A session for young people and seekers.', icon: BookOpen },
      { time: '2:00 PM – 4:30 PM', title: 'Afternoon Sports & Team Fellowship', desc: 'Volleyball, basketball, team quizzes, and recreation on camp grounds.', icon: UsersThree },
      { time: '7:00 PM – 9:00 PM', title: 'Youth Choral Singing & Campfire Devotion', desc: 'Learning multi-part Christadelphian anthems and outdoor praise circle.', icon: MusicNotes },
    ],
  },
  {
    day: 'Day 03',
    title: 'Memorial Service & Safe Dismissal',
    subtitle: 'Sunday Breaking of Bread memorial, final study, and departure',
    events: [
      { time: '8:00 AM – 9:00 AM', title: 'Breakfast & Packing', desc: 'Room clearance and baggage storage before Sunday memorial service.', icon: Sun },
      { time: '9:30 AM – 11:30 AM', title: 'Breaking of Bread Memorial Service', desc: 'Solemn memorial meeting, communion, and Sunday address.', icon: Heart },
      { time: '12:00 PM – 1:30 PM', title: 'Farewell Fellowship Lunch', desc: 'Final group photographs, contact exchanges, and travel prayer.', icon: UsersThree },
      { time: '2:00 PM', title: 'Safe Travels & Dismissal', desc: 'Coordinated buses and ferry drop-offs for island delegates.', icon: Sparkle },
    ],
  },
];

export interface ScheduleItem {
  time: string;
  title: string;
  description: string;
}

export function EventScheduleTimeline({ schedule }: { schedule?: ScheduleItem[] }) {
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  // If dynamic schedule is provided, map it into a single "Day 01" format to preserve layout
  // Alternatively, we could group it if we had date fields, but a single list is fine.
  const displaySchedule = schedule && schedule.length > 0 
    ? [{
        day: 'Schedule',
        title: 'Event Itinerary',
        subtitle: 'Main gathering schedule and activities',
        events: schedule.map(s => ({ time: s.time, title: s.title, desc: s.description, icon: Sparkle }))
      }]
    : SAMPLE_SCHEDULE;

  const activeDay = displaySchedule[activeDayIndex] || displaySchedule[0];

  return (
    <InteractiveCard className="p-7 sm:p-10 rounded-[2.5rem] bg-white dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b] shadow-xl space-y-8">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-[#e6dfcb]/60 dark:border-[#323d2b]/60">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#9a6423] dark:text-[#f0be7c] px-3 py-1 rounded-full bg-[#e0a861]/15 border border-[#e0a861]/30">
            Camp Itinerary
          </span>
          <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#2c3324] dark:text-[#fefcf1] mt-2">
            Gathering Schedule & Highlights
          </h3>
        </div>

        {/* Day Tab Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-[#f8f4e3] dark:bg-[#131710] rounded-2xl">
          {displaySchedule.map((day, idx) => {
            const isSelected = activeDayIndex === idx;
            return (
              <button
                key={day.day}
                type="button"
                onClick={() => setActiveDayIndex(idx)}
                className={`relative px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 z-10 select-none ${
                  isSelected
                    ? 'text-[#fefcf1] dark:text-[#131710] font-bold'
                    : 'text-[#505748] dark:text-[#a3ab98] hover:text-[#2c3324] dark:hover:text-[#fefcf1]'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeScheduleDayTab"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    className="absolute inset-0 bg-[#2c3324] dark:bg-[#e0a861] rounded-xl z-[-1] shadow-xs"
                  />
                )}
                <span>{day.day}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subtitle */}
      <div className="space-y-1">
        <h4 className="font-serif font-bold text-xl text-[#2c3324] dark:text-[#fefcf1]">
          {activeDay.title}
        </h4>
        <p className="text-xs sm:text-sm text-[#707666] dark:text-[#a3ab98]">
          {activeDay.subtitle}
        </p>
      </div>

      {/* Events Timeline */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeDay.day}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {activeDay.events.map((event, idx) => {
            const EventIcon = event.icon;
            return (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-[#f8f4e3]/60 dark:bg-[#131710]/60 border border-[#e6dfcb] dark:border-[#323d2b] flex items-start gap-4 hover:border-[#e0a861]/60 transition-colors"
              >
                <div className="h-10 w-10 rounded-xl bg-[#fbf1e2] dark:bg-[#252e1f] text-[#e0a861] flex items-center justify-center shrink-0 shadow-xs">
                  <EventIcon weight="duotone" className="h-5 w-5 text-[#9a6423] dark:text-[#f0be7c]" />
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <strong className="font-serif text-base text-[#2c3324] dark:text-[#fefcf1]">
                      {event.title}
                    </strong>
                    <span className="text-xs font-mono font-bold text-[#9a6423] dark:text-[#f0be7c] px-2.5 py-0.5 rounded-lg bg-[#e0a861]/15 shrink-0 w-fit">
                      {event.time}
                    </span>
                  </div>
                  <p className="text-xs text-[#707666] dark:text-[#a3ab98] leading-relaxed">
                    {event.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </InteractiveCard>
  );
}
