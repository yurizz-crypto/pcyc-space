import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getCachedDisplayedEcclesias } from '@/lib/db/queries/cached';
import { AboutEcclesiasDirectory } from '@/components/domain/ecclesias/about-ecclesias-directory';
import { BookOpen, Heart, Users, ShieldCheck } from '@phosphor-icons/react/dist/ssr';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ui/scroll-reveal';
import { InteractiveCard } from '@/components/ui/interactive-card';

import { HeroGlow } from '@/components/ui/hero-glow';

export const metadata = {
  title: 'About PCYC & History',
  description:
    'Learn about the Philippine Christadelphian Youth Circle, our faith rooted in the Scriptures, history, and nationwide ecclesias across Luzon, Visayas, and Mindanao.',
};

export default async function AboutPage() {
  const displayedEcclesias = await getCachedDisplayedEcclesias();

  return (
    <div className="flex flex-col w-full">
      {/* 1. CUSTOM EDITORIAL HERO */}
      <section className="relative overflow-hidden bg-[#2c3324] text-[#fefcf1] py-24 sm:py-32 lg:py-40">
        <HeroGlow />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal className="max-w-4xl space-y-8">
            <span className="font-bold text-[#e0a861] uppercase tracking-widest text-sm sm:text-base border-b border-[#e0a861]/30 pb-2">
              Our Identity & Heritage
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.1]">
              A Brotherhood <br className="hidden sm:block" /> Built on the Word.
            </h1>
            <p className="text-lg sm:text-xl text-[#f8f4e3]/80 max-w-2xl leading-relaxed">
              We are a united fellowship of believers across the Philippine archipelago, dedicated to studying God&rsquo;s Word, living the teachings of Christ, and waiting for the Kingdom.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. WHO ARE THE CHRISTADELPHIANS (Asymmetric Grid) */}
      <section className="py-24 bg-[#fefcf1] dark:bg-[#131710]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
            
            <ScrollReveal className="lg:col-span-5 space-y-8 lg:sticky lg:top-24">
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#2c3324] dark:text-[#fefcf1] leading-tight">
                Who are the Christadelphians?
              </h2>
              <div className="space-y-6 text-lg text-[#5a634e] dark:text-[#a3ab98] leading-relaxed">
                <p>
                  The name <strong className="text-[#2c3324] dark:text-[#fefcf1] font-semibold">Christadelphian</strong> means
                  &ldquo;Brothers and Sisters in Christ.&rdquo; We are a worldwide, Bible-based
                  community with no paid clergy or centralized hierarchy, patterned after the
                  first-century ecclesias.
                </p>
                <div className="pt-6">
                  <Link href="/register">
                    <Button variant="primary" size="lg" className="gap-2 bg-[#2c3324] text-white hover:bg-[#3d4632] dark:bg-[#e0a861] dark:text-[#131710] dark:hover:bg-[#ca914a] rounded-full px-8">
                      <Users weight="bold" className="h-5 w-5" />
                      <span>Join Our Community</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            <div className="lg:col-span-7">
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Intro Card */}
                <StaggerItem className="sm:col-span-2 p-8 rounded-3xl bg-[#f8f4e3] dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b]">
                  <p className="text-[#5a634e] dark:text-[#a3ab98] leading-relaxed text-lg italic font-serif">
                    "Every Sunday, baptized brothers and sisters assemble for the Breaking of Bread
                    service to remember our Lord’s sacrifice, followed by Bible classes and fellowship."
                  </p>
                </StaggerItem>

                {/* Doctrine 1 */}
                <StaggerItem>
                  <InteractiveCard className="h-full p-8 rounded-3xl bg-white dark:bg-[#131710] border border-[#e6dfcb] dark:border-[#323d2b] space-y-4 hover:border-[#e0a861]/50 transition-colors shadow-sm">
                    <div className="h-12 w-12 rounded-xl bg-[#fbf1e2] dark:bg-[#252e1f] flex items-center justify-center">
                      <BookOpen weight="duotone" className="h-6 w-6 text-[#9a6423] dark:text-[#e0a861]" />
                    </div>
                    <h3 className="font-serif font-bold text-xl text-[#2c3324] dark:text-[#fefcf1]">
                      The Authority of Scripture
                    </h3>
                    <p className="text-sm text-[#707666] dark:text-[#a3ab98] leading-relaxed">
                      The 66 books of the Holy Bible are the solely inspired revelation from God,
                      able to make us wise unto salvation through faith in Christ Jesus.
                    </p>
                  </InteractiveCard>
                </StaggerItem>

                {/* Doctrine 2 */}
                <StaggerItem>
                  <InteractiveCard className="h-full p-8 rounded-3xl bg-white dark:bg-[#131710] border border-[#e6dfcb] dark:border-[#323d2b] space-y-4 hover:border-[#e0a861]/50 transition-colors shadow-sm">
                    <div className="h-12 w-12 rounded-xl bg-[#fbf1e2] dark:bg-[#252e1f] flex items-center justify-center">
                      <ShieldCheck weight="duotone" className="h-6 w-6 text-[#9a6423] dark:text-[#e0a861]" />
                    </div>
                    <h3 className="font-serif font-bold text-xl text-[#2c3324] dark:text-[#fefcf1]">
                      The Hope of Israel
                    </h3>
                    <p className="text-sm text-[#707666] dark:text-[#a3ab98] leading-relaxed">
                      God will fulfill His promises by sending Jesus Christ back to Earth to raise the
                      dead, grant immortality, and rule from Jerusalem.
                    </p>
                  </InteractiveCard>
                </StaggerItem>

                {/* Doctrine 3 */}
                <StaggerItem className="sm:col-span-2">
                  <InteractiveCard className="h-full p-8 rounded-3xl bg-white dark:bg-[#131710] border border-[#e6dfcb] dark:border-[#323d2b] space-y-4 flex flex-col sm:flex-row gap-6 items-start hover:border-[#e0a861]/50 transition-colors shadow-sm">
                    <div className="h-12 w-12 rounded-xl bg-[#fbf1e2] dark:bg-[#252e1f] flex items-center justify-center shrink-0">
                      <Heart weight="duotone" className="h-6 w-6 text-[#9a6423] dark:text-[#e0a861]" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-serif font-bold text-xl text-[#2c3324] dark:text-[#fefcf1]">
                        Baptism & New Life
                      </h3>
                      <p className="text-sm text-[#707666] dark:text-[#a3ab98] leading-relaxed max-w-xl">
                        Full immersion baptism upon sincere confession of the Gospel of the Kingdom and the
                        name of Jesus Christ, uniting the believer with the seed of Abraham.
                      </p>
                    </div>
                  </InteractiveCard>
                </StaggerItem>

              </StaggerContainer>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HISTORY & PURPOSE OF PCYC */}
      <section className="py-24 bg-[#f8f4e3] dark:bg-[#1b2117] border-y border-[#e6dfcb] dark:border-[#323d2b] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="max-w-3xl space-y-6 mb-16">
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#2c3324] dark:text-[#fefcf1]">
              The Story of Philippine Christadelphian Youth Circle
            </h2>
            <p className="text-lg sm:text-xl text-[#505748] dark:text-[#a3ab98] leading-relaxed">
              PCYC was born out of a desire for Christadelphian young people throughout Luzon,
              Visayas, and Mindanao to meet regularly, encourage each other, and cultivate strong
              spiritual roots during their youth and student years.
            </p>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StaggerItem className="relative p-10 rounded-3xl bg-white dark:bg-[#131710] border border-[#e6dfcb] dark:border-[#323d2b] overflow-hidden group">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 text-[120px] font-serif font-bold text-[#fbf1e2] dark:text-[#1b2117] select-none pointer-events-none z-0 group-hover:scale-110 transition-transform duration-500">01</div>
              <div className="relative z-10 space-y-4">
                <h3 className="font-serif text-2xl font-bold text-[#2c3324] dark:text-[#fefcf1]">Annual Youth Camps</h3>
                <p className="text-[#707666] dark:text-[#a3ab98] leading-relaxed">
                  National gatherings that rotate through inspiring retreat venues in the Philippines,
                  giving youth days of uninterrupted study, prayer, and fellowship.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem className="relative p-10 rounded-3xl bg-white dark:bg-[#131710] border border-[#e6dfcb] dark:border-[#323d2b] overflow-hidden group">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 text-[120px] font-serif font-bold text-[#fbf1e2] dark:text-[#1b2117] select-none pointer-events-none z-0 group-hover:scale-110 transition-transform duration-500">02</div>
              <div className="relative z-10 space-y-4">
                <h3 className="font-serif text-2xl font-bold text-[#2c3324] dark:text-[#fefcf1]">Monthly Study Circles</h3>
                <p className="text-[#707666] dark:text-[#a3ab98] leading-relaxed">
                  Ecclesia-based and online youth classes that tackle pressing questions on morality,
                  career, university life, and Christian conduct.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem className="relative p-10 rounded-3xl bg-white dark:bg-[#131710] border border-[#e6dfcb] dark:border-[#323d2b] overflow-hidden group">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 text-[120px] font-serif font-bold text-[#fbf1e2] dark:text-[#1b2117] select-none pointer-events-none z-0 group-hover:scale-110 transition-transform duration-500">03</div>
              <div className="relative z-10 space-y-4">
                <h3 className="font-serif text-2xl font-bold text-[#2c3324] dark:text-[#fefcf1]">Brotherhood Support</h3>
                <p className="text-[#707666] dark:text-[#a3ab98] leading-relaxed">
                  Fundraising merchandise, travel sponsorships for distant island attendees, and
                  providing camp materials free to those in need.
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* 4. PHILIPPINE ECCLESIAS DIRECTORY */}
      <section className="py-24 bg-[#fefcf1] dark:bg-[#131710]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <ScrollReveal className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#2c3324] dark:text-[#fefcf1]">
              Philippine Ecclesia Directory
            </h2>
            <p className="text-lg text-[#707666] dark:text-[#a3ab98]">
              Categorized by major island regions across Luzon, Visayas, and Mindanao. Visitors and friends are always welcome to join our Sunday memorial services and youth classes.
            </p>
          </ScrollReveal>

          <AboutEcclesiasDirectory ecclesias={displayedEcclesias} />
        </div>
      </section>

      {/* 5. INVITATION CTA */}
      <section className="py-24 bg-[#2c3324] text-[#fefcf1] border-t border-[#3d4632]">
        <ScrollReveal className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#fefcf1] leading-tight">
            Connect with a PCYC Youth Leader
          </h2>
          <p className="text-lg sm:text-xl text-[#f8f4e3]/85 max-w-2xl mx-auto font-light leading-relaxed">
            Whether you want to visit an ecclesia, attend a youth camp, or request Bible study
            materials, we are happy to assist you.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="mailto:bumadillal@gmail.com">
              <Button variant="primary" size="lg" className="rounded-full px-8 bg-[#e0a861] text-[#2c3324] hover:bg-[#f0be7c]">
                <span>Email Youth Committee</span>
              </Button>
            </a>
            <Link href="/events">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 border-white/30 text-[#fefcf1] hover:bg-white/10 hover:text-white"
              >
                <span>View Next Event</span>
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
