import React from 'react';

export default function MerchLoading() {
  return (
    <div className="w-full flex flex-col min-h-screen bg-[#fefcf1] dark:bg-[#131710] animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-[#f8f4e3] dark:bg-[#1b2117] py-24 sm:py-32 border-b border-[#e6dfcb] dark:border-[#323d2b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="h-5 w-32 bg-[#e6dfcb]/60 dark:bg-[#252e1f] rounded-full" />
              <div className="h-16 w-3/4 bg-[#e6dfcb]/80 dark:bg-[#252e1f] rounded-2xl" />
              <div className="h-5 w-full max-w-sm bg-[#e6dfcb]/50 dark:bg-[#20271b] rounded-lg" />
            </div>
            <div className="h-44 rounded-3xl bg-white dark:bg-[#131710] border border-[#e6dfcb] dark:border-[#323d2b]" />
          </div>
        </div>
      </div>

      {/* Products Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-3xl bg-white dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b] p-4 space-y-4">
              <div className="aspect-square w-full bg-[#f8f4e3] dark:bg-[#131710] rounded-2xl" />
              <div className="h-5 w-3/4 bg-[#e6dfcb]/60 dark:bg-[#252e1f] rounded-lg" />
              <div className="h-4 w-1/2 bg-[#e6dfcb]/40 dark:bg-[#20271b] rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
