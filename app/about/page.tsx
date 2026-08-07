import React from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCachedDisplayedEcclesias } from '@/lib/db/queries/cached';
import { BookOpen, MapPin, Clock, Heart, Users, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'About PCYC & History',
  description:
    'Learn about the Philippine Christadelphian Youth Circle, our faith rooted in the Scriptures, history, and nationwide ecclesias.',
};

export default async function AboutPage() {
  const displayedEcclesias = await getCachedDisplayedEcclesias();
  return (
    <div className="flex flex-col w-full">
      <PageHeader
        badge="Our Identity & Heritage"
        title="About Philippine Christadelphian Youth Circle"
        description="A united fellowship of believers across the Philippine archipelago, dedicated to studying God’s Word, living the teachings of Christ, and waiting for the Kingdom."
      />

      {/* 1. WHO ARE THE CHRISTADELPHIANS */}
      <section className="py-16 sm:py-20 bg-[#fefcf1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <Badge variant="gold" size="md">
                Our Faith
              </Badge>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2c3324]">
                Who are the Christadelphians?
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-[#505748] leading-relaxed">
                <p>
                  The name <strong className="text-[#2c3324]">Christadelphian</strong> means
                  &ldquo;Brothers and Sisters in Christ.&rdquo; We are a worldwide, Bible-based
                  community with no paid clergy or centralized hierarchy, patterned after the
                  first-century ecclesias.
                </p>
                <p>
                  We believe the Bible is the inspired, infallible Word of God. Our faith centers
                  on the promises made to Abraham and David, the true humanity and sinless sacrifice
                  of Jesus Christ, his resurrection, and his literal return to the Earth to establish
                  the Kingdom of God in peace and righteousness.
                </p>
                <p>
                  Every Sunday, baptized brothers and sisters assemble for the Breaking of Bread
                  service to remember our Lord’s sacrifice, followed by Bible classes and fellowship.
                </p>
              </div>

              <div className="pt-2">
                <Link href="/register">
                  <Button variant="primary" size="md" className="gap-2">
                    <Users className="h-4 w-4" />
                    <span>Join Our Community</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Doctrinal Foundation Highlights */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-6 rounded-2xl border border-[#e6dfcb] bg-white shadow-xs space-y-2">
                <div className="flex items-center gap-2 font-serif font-bold text-lg text-[#2c3324]">
                  <BookOpen className="h-5 w-5 text-[#e0a861]" />
                  <span>The Authority of Scripture</span>
                </div>
                <p className="text-xs sm:text-sm text-[#707666]">
                  The 66 books of the Holy Bible are the solely inspired revelation from God,
                  able to make us wise unto salvation through faith in Christ Jesus (2 Timothy 3:15-17).
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-[#e6dfcb] bg-white shadow-xs space-y-2">
                <div className="flex items-center gap-2 font-serif font-bold text-lg text-[#2c3324]">
                  <ShieldCheck className="h-5 w-5 text-[#e0a861]" />
                  <span>The Hope of Israel & The Kingdom</span>
                </div>
                <p className="text-xs sm:text-sm text-[#707666]">
                  God will fulfill His promises by sending Jesus Christ back to Earth to raise the
                  dead, grant immortality to faithful believers, and rule from Jerusalem (Acts 1:11, Daniel 2:44).
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-[#e6dfcb] bg-white shadow-xs space-y-2">
                <div className="flex items-center gap-2 font-serif font-bold text-lg text-[#2c3324]">
                  <Heart className="h-5 w-5 text-[#e0a861]" />
                  <span>Baptism & New Life</span>
                </div>
                <p className="text-xs sm:text-sm text-[#707666]">
                  Full immersion baptism upon sincere confession of the Gospel of the Kingdom and the
                  name of Jesus Christ, uniting the believer with the seed of Abraham (Galatians 3:27-29).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HISTORY & PURPOSE OF PCYC */}
      <section className="py-16 sm:py-20 bg-[#f8f4e3] border-y border-[#e6dfcb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <Badge variant="forest" size="md">
              Our Journey
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2c3324]">
              The Story of Philippine Christadelphian Youth Circle
            </h2>
            <p className="text-sm sm:text-base text-[#505748] leading-relaxed">
              PCYC was born out of a desire for Christadelphian young people throughout Luzon,
              Visayas, and Mindanao to meet regularly, encourage each other, and cultivate strong
              spiritual roots during their youth and student years.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#e6dfcb] space-y-3">
              <span className="font-serif font-bold text-2xl text-[#e0a861]">01</span>
              <h3 className="font-serif text-lg font-bold text-[#2c3324]">Annual Youth Camps</h3>
              <p className="text-xs text-[#707666] leading-relaxed">
                National gatherings that rotate through inspiring retreat venues in the Philippines,
                giving youth days of uninterrupted study, prayer, and fellowship.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#e6dfcb] space-y-3">
              <span className="font-serif font-bold text-2xl text-[#e0a861]">02</span>
              <h3 className="font-serif text-lg font-bold text-[#2c3324]">Monthly Study Circles</h3>
              <p className="text-xs text-[#707666] leading-relaxed">
                Ecclesia-based and online youth classes that tackle pressing questions on morality,
                career, university life, and Christian conduct.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#e6dfcb] space-y-3">
              <span className="font-serif font-bold text-2xl text-[#e0a861]">03</span>
              <h3 className="font-serif text-lg font-bold text-[#2c3324]">Brotherhood Support</h3>
              <p className="text-xs text-[#707666] leading-relaxed">
                Fundraising merchandise, travel sponsorships for distant island attendees, and
                providing camp materials free to those in need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PHILIPPINE ECCLESIAS DIRECTORY */}
      <section className="py-16 sm:py-20 bg-[#fefcf1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="gold" size="md">
              Find a Fellowship
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2c3324]">
              Philippine Ecclesia Directory
            </h2>
            <p className="text-sm sm:text-base text-[#707666]">
              Visitors and friends are always welcome to join our Sunday memorial services and youth classes.
            </p>
          </div>

          {displayedEcclesias.length === 0 ? (
            <div className="mt-12 max-w-md mx-auto p-8 rounded-2xl bg-white border border-[#e6dfcb] text-center space-y-3 shadow-xs">
              <MapPin className="h-8 w-8 text-[#e0a861] mx-auto" />
              <h3 className="font-serif font-bold text-lg text-[#2c3324]">Directory Updating</h3>
              <p className="text-xs sm:text-sm text-[#707666]">
                No ecclesias listed in the public directory yet. Verified ecclesias will appear here once added by administrators.
              </p>
            </div>
          ) : (
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedEcclesias.map((ecc) => (
                <Card key={ecc.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="space-y-1.5">
                    <div className="text-[11px] font-semibold tracking-wider text-[#9a6423] uppercase">
                      {ecc.region}
                    </div>
                    <CardTitle className="text-xl">{ecc.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2.5 text-xs text-[#505748]">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-[#e0a861] shrink-0 mt-0.5" />
                      <span>{ecc.address}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-[#e0a861] shrink-0 mt-0.5" />
                      <span>{ecc.meetingSchedule}</span>
                    </div>
                    {ecc.contactPerson && (
                      <div className="text-[11px] text-[#707666]">
                        Contact: {ecc.contactPerson}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. INVITATION CTA */}
      <section className="py-16 bg-[#2c3324] text-[#fefcf1] border-t border-[#3d4632]">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#fefcf1]">
            Would you like to connect with a PCYC youth leader?
          </h2>
          <p className="text-sm sm:text-base text-[#f8f4e3]/85 max-w-xl mx-auto">
            Whether you want to visit an ecclesia, attend a youth camp, or request Bible study
            materials, we are happy to assist you.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="mailto:bumadillal@gmail.com">
              <Button variant="primary" size="lg">
                <span>Email Youth Committee</span>
              </Button>
            </a>
            <Link href="/events">
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-[#fefcf1] hover:bg-white/10"
              >
                <span>View Next Event</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
