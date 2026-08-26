'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { Ecclesia } from '@/lib/db/schema/ecclesias';
import { Compass } from '@phosphor-icons/react';

// Dynamic import with SSR disabled to prevent Leaflet window/document SSR issues
const EcclesiasMapView = dynamic(
  () => import('./ecclesias-map-view').then((mod) => mod.EcclesiasMapView),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[540px] rounded-3xl bg-[#f8f4e3] dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b] flex flex-col items-center justify-center space-y-4 shadow-sm animate-pulse">
        <div className="h-14 w-14 rounded-2xl bg-[#e0a861]/20 text-[#e0a861] flex items-center justify-center">
          <Compass weight="duotone" className="h-8 w-8 animate-spin" />
        </div>
        <div className="space-y-2 text-center">
          <h4 className="font-serif font-bold text-lg text-[#2c3324] dark:text-[#fefcf1]">
            Loading Philippine Ecclesias Map...
          </h4>
          <p className="text-xs text-[#707666] dark:text-[#a3ab98]">
            Plotting gathering coordinates across Luzon, Visayas, and Mindanao
          </p>
        </div>
      </div>
    ),
  }
);

interface EcclesiasInteractiveMapProps {
  ecclesias: Ecclesia[];
}

export function EcclesiasInteractiveMap({ ecclesias }: EcclesiasInteractiveMapProps) {
  return <EcclesiasMapView ecclesias={ecclesias} />;
}
