'use client';

import React from 'react';
import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { Question } from '@phosphor-icons/react';

export function EventsFaq() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <ScrollReveal className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e0a861]/15 border border-[#e0a861]/30 text-xs font-bold text-[#9a6423] dark:text-[#f0be7c]">
          <Question weight="bold" className="h-3.5 w-3.5" />
          <span>Youth Camp Guidelines & Questions</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2c3324] dark:text-[#fefcf1]">
          Frequently Asked Questions
        </h2>
        <p className="text-sm sm:text-base text-[#707666] dark:text-[#a3ab98] max-w-xl mx-auto">
          Everything you need to know about attending our annual youth camps, regional study weekends, and ecclesia circles.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <Accordion>
          <AccordionItem
            id="faq-1"
            title="Who can attend PCYC Youth Camps and Gatherings?"
            subtitle="Eligibility, age groups, and welcoming visitors"
            badge="Open to All"
            defaultOpen={true}
          >
            <p className="mb-2">
              PCYC welcomes all Christadelphian baptized brothers and sisters, unbaptized young people from ecclesial families, and friends or seekers of Bible truth who desire to study God&rsquo;s Word in a respectful, spiritual environment.
            </p>
            <p>
              Typically, attendees range from high school, university students, and young working adults. Families and local ecclesia members are also warmly invited to Sunday memorial services.
            </p>
          </AccordionItem>

          <AccordionItem
            id="faq-2"
            title="Are travel subsidies or financial sponsorships available?"
            subtitle="Supporting delegates from distant island provinces"
            badge="Island Aid"
          >
            <p className="mb-2">
              Yes! 100% of proceeds from the PCYC Merchandise Store, combined with voluntary contributions from ecclesias, are dedicated to funding travel subsidies and subsidizing accommodation costs.
            </p>
            <p>
              If you or a young person from your local ecclesia requires financial assistance for bus, ferry, or flight costs, please reach out to the PCYC Youth Committee coordinator when event registration opens.
            </p>
          </AccordionItem>

          <AccordionItem
            id="faq-3"
            title="What should I bring and expect at a PCYC Youth Camp?"
            subtitle="Camp preparation, accommodations, and itinerary"
          >
            <ul className="list-disc list-inside space-y-1.5 pt-1">
              <li><strong>Study Essentials:</strong> Your Bible, notebook/journal, pens, and highlighters.</li>
              <li><strong>Attire:</strong> Modest, comfortable casual wear for daily lectures and sports, plus smart attire for Sunday memorial breaking of bread service.</li>
              <li><strong>Bedding & Personal Items:</strong> Toiletries, personal medications, and light jacket/sweater for air-conditioned lecture halls.</li>
            </ul>
          </AccordionItem>

          <AccordionItem
            id="faq-4"
            title="How do I get connected if there is no ecclesia in my city?"
            subtitle="Online youth circles and study materials"
          >
            <p>
              If you live in a province without a physical Christadelphian ecclesia, we can connect you with the nearest regional coordinator, provide study materials by mail, and invite you to our regular online study circles and Zoom fellowship sessions.
            </p>
          </AccordionItem>
        </Accordion>
      </ScrollReveal>
    </div>
  );
}
