import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getCachedDisplayedEcclesias } from '@/lib/db/queries/cached';
import { EcclesiasInteractiveMap } from '@/components/domain/ecclesias/ecclesias-interactive-map';
import { AboutHeritageTimeline } from '@/components/about/about-heritage-timeline';
import { BookOpen, Heart, Users, ShieldCheck, Crown, Sparkle, EnvelopeSimple, ArrowRight } from '@phosphor-icons/react/dist/ssr';
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
    <div className="flex flex-col w-full overflow-hidden">
      {/* 1. CUSTOM EDITORIAL HERO */}
      <section className="relative overflow-hidden bg-[#2c3324] text-[#fefcf1] py-28 sm:py-36 lg:py-44">
        <HeroGlow />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal className="max-w-4xl space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e0a861]/20 border border-[#e0a861]/40 text-xs font-bold text-[#e0a861]">
              <Sparkle weight="fill" className="h-3.5 w-3.5" />
              <span>Our Identity, Heritage & Mission</span>
            </div>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.08] tracking-tight">
              A Brotherhood <br className="hidden sm:block" />
              <span className="text-[#e0a861] italic shimmer-text">Built on the Word.</span>
            </h1>
            <p className="text-lg sm:text-xl text-[#f8f4e3]/85 max-w-2xl leading-relaxed font-light">
              We are a united fellowship of believers across the Philippine archipelago, dedicated to studying God&rsquo;s Word, living the teachings of Christ, and waiting for the promised Kingdom of God.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. WHO ARE THE CHRISTADELPHIANS & CORE DOCTRINES (Asymmetric 3D Grid) */}
      <section className="py-28 bg-[#fefcf1] dark:bg-[#131710]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-start">
            
            {/* Left Narrative */}
            <ScrollReveal className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#9a6423] dark:text-[#f0be7c] px-3 py-1 rounded-full bg-[#e0a861]/15 border border-[#e0a861]/30">
                  First-Century Faith
                </span>
                <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#2c3324] dark:text-[#fefcf1] leading-tight">
                  Who are the Christadelphians?
                </h2>
              </div>
              <div className="space-y-6 text-base sm:text-lg text-[#5a634e] dark:text-[#a3ab98] leading-relaxed">
                <p>
                  The name <strong className="text-[#2c3324] dark:text-[#fefcf1] font-semibold">Christadelphian</strong> means
                  &ldquo;Brothers and Sisters in Christ.&rdquo; We are a worldwide, Bible-based
                  community with no paid clergy, centralized human hierarchy, or complex creeds, patterned after the
                  first-century ecclesias described in the New Testament.
                </p>
                <p className="text-sm text-[#707666] dark:text-[#a3ab98]">
                  Every Sunday, baptized brethren assemble for the Breaking of Bread memorial service to remember our Lord&rsquo;s sacrifice, followed by youth Sunday school, classes, and uplifting fellowship.
                </p>
                <div className="pt-4 flex items-center gap-4">
                  <Link href="/register">
                    <Button variant="primary" size="lg" className="gap-2 bg-[#2c3324] text-white hover:bg-[#3d4632] dark:bg-[#e0a861] dark:text-[#131710] dark:hover:bg-[#ca914a] rounded-full px-8 shadow-md hover:scale-105 transition-all">
                      <Users weight="bold" className="h-5 w-5" />
                      <span>Join Our Community</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* Right Doctrinal Cards */}
            <div className="lg:col-span-7">
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Doctrine 1 */}
                <StaggerItem>
                  <InteractiveCard className="h-full p-8 rounded-3xl bg-white dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b] space-y-4 hover:border-[#e0a861]/60 transition-all shadow-sm">
                    <div className="h-12 w-12 rounded-xl bg-[#fbf1e2] dark:bg-[#252e1f] flex items-center justify-center text-[#e0a861] shadow-xs">
                      <BookOpen weight="duotone" className="h-6 w-6 text-[#9a6423] dark:text-[#e0a861]" />
                    </div>
                    <h3 className="font-serif font-bold text-xl text-[#2c3324] dark:text-[#fefcf1]">
                      Authority of Scripture
                    </h3>
                    <p className="text-xs sm:text-sm text-[#707666] dark:text-[#a3ab98] leading-relaxed">
                      The 66 books of the Holy Bible are the inspired, inerrant Word of God, able to make us wise unto salvation through faith in Christ Jesus (2 Timothy 3:16).
                    </p>
                  </InteractiveCard>
                </StaggerItem>

                {/* Doctrine 2 */}
                <StaggerItem>
                  <InteractiveCard className="h-full p-8 rounded-3xl bg-white dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b] space-y-4 hover:border-[#e0a861]/60 transition-all shadow-sm">
                    <div className="h-12 w-12 rounded-xl bg-[#fbf1e2] dark:bg-[#252e1f] flex items-center justify-center text-[#e0a861] shadow-xs">
                      <Crown weight="duotone" className="h-6 w-6 text-[#9a6423] dark:text-[#e0a861]" />
                    </div>
                    <h3 className="font-serif font-bold text-xl text-[#2c3324] dark:text-[#fefcf1]">
                      The Hope of Israel
                    </h3>
                    <p className="text-xs sm:text-sm text-[#707666] dark:text-[#a3ab98] leading-relaxed">
                      God will fulfill His promises made to Abraham and David by sending Jesus Christ back to Earth to establish the literal Kingdom of God from Jerusalem (Acts 1:11).
                    </p>
                  </InteractiveCard>
                </StaggerItem>

                {/* Doctrine 3 */}
                <StaggerItem>
                  <InteractiveCard className="h-full p-8 rounded-3xl bg-white dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b] space-y-4 hover:border-[#e0a861]/60 transition-all shadow-sm">
                    <div className="h-12 w-12 rounded-xl bg-[#fbf1e2] dark:bg-[#252e1f] flex items-center justify-center text-[#e0a861] shrink-0 shadow-xs">
                      <Heart weight="duotone" className="h-6 w-6 text-[#9a6423] dark:text-[#e0a861]" />
                    </div>
                    <h3 className="font-serif font-bold text-xl text-[#2c3324] dark:text-[#fefcf1]">
                      Immersion Baptism
                    </h3>
                    <p className="text-xs sm:text-sm text-[#707666] dark:text-[#a3ab98] leading-relaxed">
                      Full immersion in water upon sincere confession of the Gospel of the Kingdom and the name of Jesus Christ, uniting the believer with the seed of Abraham (Galatians 3:27-29).
                    </p>
                  </InteractiveCard>
                </StaggerItem>

                {/* Doctrine 4 */}
                <StaggerItem>
                  <InteractiveCard className="h-full p-8 rounded-3xl bg-white dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b] space-y-4 hover:border-[#e0a861]/60 transition-all shadow-sm">
                    <div className="h-12 w-12 rounded-xl bg-[#fbf1e2] dark:bg-[#252e1f] flex items-center justify-center text-[#e0a861] shadow-xs">
                      <ShieldCheck weight="duotone" className="h-6 w-6 text-[#9a6423] dark:text-[#e0a861]" />
                    </div>
                    <h3 className="font-serif font-bold text-xl text-[#2c3324] dark:text-[#fefcf1]">
                      Resurrection & Immortality
                    </h3>
                    <p className="text-xs sm:text-sm text-[#707666] dark:text-[#a3ab98] leading-relaxed">
                      Death is a deep unconscious sleep until the resurrection at Christ&rsquo;s return, when the faithful are granted eternal life and immortality in God&rsquo;s Kingdom (1 Cor. 15).
                    </p>
                  </InteractiveCard>
                </StaggerItem>

              </StaggerContainer>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE HERITAGE TIMELINE */}
      <section className="py-28 bg-[#f8f4e3] dark:bg-[#1b2117] border-y border-[#e6dfcb] dark:border-[#323d2b] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="max-w-3xl space-y-4 mb-16 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-[#9a6423] dark:text-[#f0be7c] px-3 py-1 rounded-full bg-[#e0a861]/15 border border-[#e0a861]/30">
              Our Journey & Purpose
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#2c3324] dark:text-[#fefcf1]">
              The Story of Philippine Christadelphian Youth Circle
            </h2>
            <p className="text-lg text-[#505748] dark:text-[#a3ab98] leading-relaxed">
              PCYC was born out of a desire for Christadelphian young people throughout Luzon,
              Visayas, and Mindanao to meet regularly, encourage each other, and cultivate strong
              spiritual roots during their youth and student years.
            </p>
          </ScrollReveal>

          <AboutHeritageTimeline />
        </div>
      </section>

      {/* 4. PHILIPPINE ECCLESIAS INTERACTIVE MAP & DIRECTORY */}
      <section className="py-28 bg-[#fefcf1] dark:bg-[#131710] border-t border-[#e6dfcb] dark:border-[#323d2b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <ScrollReveal className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#9a6423] dark:text-[#f0be7c] px-3.5 py-1.5 rounded-full bg-[#e0a861]/15 border border-[#e0a861]/30">
              Archipelago Directory & Interactive Map
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#2c3324] dark:text-[#fefcf1]">
              Philippine Ecclesia Directory
            </h2>
            <p className="text-base sm:text-lg text-[#707666] dark:text-[#a3ab98]">
              Explore active Christadelphian gathering places pinned across Luzon, Visayas, and Mindanao. Zoom into your province, search by city, or select any gathering to view meeting times and addresses.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <EcclesiasInteractiveMap ecclesias={displayedEcclesias} />
          </ScrollReveal>
        </div>
      </section>

      {/* 5. INVITATION CTA */}
      <section className="py-28 bg-[#2c3324] text-[#fefcf1] border-t border-[#3d4632] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#e0a861]/20 via-transparent to-transparent pointer-events-none" />
        <ScrollReveal className="max-w-4xl mx-auto px-4 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e0a861]/15 border border-[#e0a861]/30 text-xs font-bold text-[#e0a861]">
            <EnvelopeSimple weight="fill" className="h-4 w-4" />
            <span>We&rsquo;d Love to Hear From You</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#fefcf1] leading-tight">
            Connect with a PCYC Youth Leader
          </h2>
          <p className="text-lg sm:text-xl text-[#f8f4e3]/85 max-w-2xl mx-auto font-light leading-relaxed">
            Whether you want to visit an ecclesia, attend an upcoming youth camp, or request free Bible study materials, our committee is delighted to assist you.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="mailto:bumadillal@gmail.com">
              <Button variant="primary" size="lg" className="rounded-full px-8 bg-[#e0a861] text-[#2c3324] hover:bg-[#f0be7c] hover:scale-105 transition-all shadow-lg shadow-[#e0a861]/20">
                <EnvelopeSimple weight="bold" className="h-5 w-5" />
                <span>Email Youth Committee</span>
              </Button>
            </a>
            <Link href="/events">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 border-white/30 text-[#fefcf1] hover:bg-white/10 hover:text-white"
              >
                <span>View Next Gathering</span>
                <ArrowRight weight="bold" className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}

