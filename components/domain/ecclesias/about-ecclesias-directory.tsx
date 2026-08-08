'use client';

import React, { useState, useMemo } from 'react';
import type { Ecclesia } from '@/lib/db/schema/ecclesias';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, UserCheck, Search, Compass, Map, Building2 } from 'lucide-react';

interface AboutEcclesiasDirectoryProps {
  ecclesias: Ecclesia[];
}

type RegionKey = 'ALL' | 'Luzon' | 'Visayas' | 'Mindanao';

const REGIONS: { key: 'Luzon' | 'Visayas' | 'Mindanao'; title: string; subtitle: string; description: string; badgeVariant: 'forest' | 'gold' | 'outline' }[] = [
  {
    key: 'Luzon',
    title: 'Luzon Ecclesias',
    subtitle: 'Northern, Central, Southern Luzon & Metro Manila',
    description: 'Fellowship assemblies meeting across the National Capital Region and Luzon provinces.',
    badgeVariant: 'forest',
  },
  {
    key: 'Visayas',
    title: 'Visayas Ecclesias',
    subtitle: 'Central, Western & Eastern Visayas',
    description: 'Fellowship circles and ecclesial gatherings across the central Philippine islands.',
    badgeVariant: 'gold',
  },
  {
    key: 'Mindanao',
    title: 'Mindanao Ecclesias',
    subtitle: 'Southern Philippines & Mindanao Provinces',
    description: 'Active youth circles and meeting places across Davao, Cotabato, and Mindanao communities.',
    badgeVariant: 'forest',
  },
];

export function AboutEcclesiasDirectory({ ecclesias }: AboutEcclesiasDirectoryProps) {
  const [selectedRegion, setSelectedRegion] = useState<RegionKey>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate counts per region
  const counts = useMemo(() => {
    return {
      ALL: ecclesias.length,
      Luzon: ecclesias.filter((e) => e.region === 'Luzon').length,
      Visayas: ecclesias.filter((e) => e.region === 'Visayas').length,
      Mindanao: ecclesias.filter((e) => e.region === 'Mindanao').length,
    };
  }, [ecclesias]);

  // Sort and group ecclesias deterministically by City, then Name
  const groupedEcclesias = useMemo(() => {
    const filterQuery = searchQuery.trim().toLowerCase();

    const filterFn = (ecc: Ecclesia) => {
      if (!filterQuery) return true;
      const name = (ecc.name || '').toLowerCase();
      const city = (ecc.city || '').toLowerCase();
      const address = (ecc.address || '').toLowerCase();
      const contact = (ecc.contactPerson || '').toLowerCase();
      return name.includes(filterQuery) || city.includes(filterQuery) || address.includes(filterQuery) || contact.includes(filterQuery);
    };

    const sortFn = (a: Ecclesia, b: Ecclesia) => {
      const cityCompare = (a.city || '').localeCompare(b.city || '');
      if (cityCompare !== 0) return cityCompare;
      return (a.name || '').localeCompare(b.name || '');
    };

    return {
      Luzon: ecclesias.filter((e) => e.region === 'Luzon' && filterFn(e)).sort(sortFn),
      Visayas: ecclesias.filter((e) => e.region === 'Visayas' && filterFn(e)).sort(sortFn),
      Mindanao: ecclesias.filter((e) => e.region === 'Mindanao' && filterFn(e)).sort(sortFn),
    };
  }, [ecclesias, searchQuery]);

  const totalFilteredCount =
    groupedEcclesias.Luzon.length + groupedEcclesias.Visayas.length + groupedEcclesias.Mindanao.length;

  const activeRegions = useMemo(() => {
    if (selectedRegion === 'ALL') {
      return REGIONS;
    }
    return REGIONS.filter((r) => r.key === selectedRegion);
  }, [selectedRegion]);

  return (
    <div className="space-y-10">
      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b] shadow-xs">
        {/* Region Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setSelectedRegion('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 ${
              selectedRegion === 'ALL'
                ? 'bg-[#2c3324] dark:bg-[#e0a861] text-[#fefcf1] dark:text-[#131710] shadow-xs'
                : 'bg-[#f8f4e3] dark:bg-[#252e1f] text-[#505748] dark:text-[#a3ab98] hover:bg-[#ede7d1] dark:hover:bg-[#2a3324]'
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>All Regions</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
              {counts.ALL}
            </span>
          </button>

          {REGIONS.map((reg) => (
            <button
              key={reg.key}
              type="button"
              onClick={() => setSelectedRegion(reg.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 ${
                selectedRegion === reg.key
                  ? 'bg-[#2c3324] dark:bg-[#e0a861] text-[#fefcf1] dark:text-[#131710] shadow-xs'
                  : 'bg-[#f8f4e3] dark:bg-[#252e1f] text-[#505748] dark:text-[#a3ab98] hover:bg-[#ede7d1] dark:hover:bg-[#2a3324]'
              }`}
            >
              <span>{reg.key}</span>
              <span
                className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedRegion === reg.key ? 'bg-white/20' : 'bg-black/10'
                }`}
              >
                {counts[reg.key]}
              </span>
            </button>
          ))}
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#707666] dark:text-[#a3ab98]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by city, name, or area..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#fefcf1] dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b] rounded-xl text-[#2c3324] dark:text-[#fefcf1] placeholder-[#707666] dark:placeholder-[#8a9180] focus:outline-none focus:border-[#e0a861] focus:ring-1 focus:ring-[#e0a861]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#707666] dark:text-[#a3ab98] hover:text-[#2c3324] dark:hover:text-[#fefcf1]"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* No Results Fallback */}
      {totalFilteredCount === 0 && (
        <div className="p-12 rounded-3xl bg-white dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b] text-center space-y-3 shadow-xs">
          <Building2 className="h-10 w-10 text-[#e0a861] mx-auto" />
          <h3 className="font-serif font-bold text-xl text-[#2c3324] dark:text-[#fefcf1]">No Ecclesias Found</h3>
          <p className="text-xs sm:text-sm text-[#707666] dark:text-[#a3ab98] max-w-md mx-auto">
            {searchQuery
              ? `No ecclesias match "${searchQuery}". Please check the spelling or select a different region.`
              : 'There are currently no ecclesias listed in this category.'}
          </p>
        </div>
      )}

      {/* Structured Island Group Sections */}
      <div className="space-y-14">
        {activeRegions.map((region) => {
          const list = groupedEcclesias[region.key];
          if (list.length === 0 && searchQuery) return null;

          return (
            <section
              key={region.key}
              id={`region-${region.key.toLowerCase()}`}
              className="space-y-6 scroll-mt-24"
            >
              {/* Region Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-4 border-b border-[#e6dfcb] dark:border-[#323d2b]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Map className="h-4 w-4 text-[#e0a861]" />
                    <span className="text-xs font-bold text-[#9a6423] dark:text-[#f0be7c] uppercase tracking-wider">
                      {region.subtitle}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2c3324] dark:text-[#fefcf1]">
                    {region.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#707666] dark:text-[#a3ab98]">{region.description}</p>
                </div>
                <div className="shrink-0">
                  <Badge variant={region.badgeVariant} size="sm">
                    {list.length} {list.length === 1 ? 'Ecclesia' : 'Ecclesias'}
                  </Badge>
                </div>
              </div>

              {/* Ecclesias Grid */}
              {list.length === 0 ? (
                <div className="p-8 rounded-2xl bg-white/60 dark:bg-[#1b2117]/60 border border-dashed border-[#e6dfcb] dark:border-[#323d2b] text-center space-y-2">
                  <p className="text-xs text-[#707666] dark:text-[#a3ab98]">
                    No verified ecclesias are listed in {region.key} yet. New meeting circles will be published as verified.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {list.map((ecc) => (
                    <Card
                      key={ecc.id}
                      className="group flex flex-col justify-between hover:shadow-md hover:border-[#e0a861] transition-all duration-200 bg-white dark:bg-[#1b2117]"
                    >
                      <CardHeader className="space-y-2 pb-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#f8f4e3] dark:bg-[#252e1f] text-[#9a6423] dark:text-[#f0be7c] border border-[#e6dfcb] dark:border-[#323d2b]">
                            {ecc.city || ecc.region}
                          </span>
                          <span className="text-[10px] text-[#707666] dark:text-[#a3ab98] font-medium">
                            {ecc.region}
                          </span>
                        </div>
                        <CardTitle className="font-serif text-xl text-[#2c3324] dark:text-[#fefcf1] leading-snug group-hover:text-[#9a6423] dark:group-hover:text-[#f0be7c] transition-colors">
                          {ecc.name}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="space-y-3 text-xs text-[#505748] dark:text-[#a3ab98] pt-0">
                        {/* Address */}
                        <div className="flex items-start gap-2.5">
                          <MapPin className="h-4 w-4 text-[#e0a861] shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{ecc.address}</span>
                        </div>

                        {/* Meeting Schedule */}
                        <div className="flex items-start gap-2.5">
                          <Clock className="h-4 w-4 text-[#e0a861] shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <span className="font-medium text-[#2c3324] dark:text-[#fefcf1] block">
                              Meeting Schedule:
                            </span>
                            <span className="leading-relaxed">{ecc.meetingSchedule}</span>
                          </div>
                        </div>

                        {/* Contact Person */}
                        {ecc.contactPerson && (
                          <div className="flex items-start gap-2.5 pt-1 border-t border-[#f4efe0] dark:border-[#323d2b]">
                            <UserCheck className="h-4 w-4 text-[#707666] dark:text-[#a3ab98] shrink-0 mt-0.5" />
                            <span className="text-[#707666] dark:text-[#a3ab98]">
                              Contact / Coordinator: <strong className="text-[#2c3324] dark:text-[#fefcf1] font-medium">{ecc.contactPerson}</strong>
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
