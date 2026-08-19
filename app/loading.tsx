import React from 'react';

export default function RootLoading() {
  return (
    <div className="w-full flex flex-col min-h-screen bg-[#fefcf1] dark:bg-[#131710] animate-pulse">
      {/* Hero Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="h-6 w-36 bg-[#e6dfcb]/50 dark:bg-[#252e1f] rounded-full" />
            <div className="h-16 sm:h-20 w-4/5 bg-[#e6dfcb]/60 dark:bg-[#252e1f] rounded-2xl" />
            <div className="h-6 w-full max-w-md bg-[#e6dfcb]/40 dark:bg-[#20271b] rounded-lg" />
            <div className="h-6 w-3/4 max-w-sm bg-[#e6dfcb]/40 dark:bg-[#20271b] rounded-lg" />
            <div className="flex gap-4 pt-4">
              <div className="h-12 w-44 bg-[#e6dfcb]/60 dark:bg-[#252e1f] rounded-full" />
              <div className="h-12 w-40 bg-[#e6dfcb]/40 dark:bg-[#20271b] rounded-full" />
            </div>
          </div>
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="w-full max-w-lg aspect-[4/5] rounded-3xl bg-[#e6dfcb]/30 dark:bg-[#1b2117] border border-[#e6dfcb]/40 dark:border-[#323d2b]" />
          </div>
        </div>
      </div>

      {/* Stats Bar Skeleton */}
      <div className="bg-[#2c3324]/10 dark:bg-[#1b2117] py-10 border-y border-[#e6dfcb]/40 dark:border-[#323d2b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="h-16 bg-[#e6dfcb]/40 dark:bg-[#252e1f] rounded-2xl mx-auto w-40" />
          <div className="h-16 bg-[#e6dfcb]/40 dark:bg-[#252e1f] rounded-2xl mx-auto w-40" />
          <div className="h-16 bg-[#e6dfcb]/40 dark:bg-[#252e1f] rounded-2xl mx-auto w-40" />
        </div>
      </div>
    </div>
  );
}
