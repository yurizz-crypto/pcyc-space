import React from 'react';

export default function EventsLoading() {
  return (
    <div className="w-full flex flex-col min-h-screen bg-[#fefcf1] dark:bg-[#131710] animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-[#2c3324] py-24 sm:py-32 border-b border-[#3d4632]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="h-16 w-3/5 max-w-lg bg-[#3d4632] rounded-2xl" />
          <div className="h-6 w-full max-w-md bg-[#3d4632]/60 rounded-lg" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-3xl bg-white dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b] p-4 space-y-4">
              <div className="aspect-[16/9] w-full bg-[#e6dfcb]/40 dark:bg-[#252e1f] rounded-2xl" />
              <div className="h-6 w-3/4 bg-[#e6dfcb]/60 dark:bg-[#252e1f] rounded-lg" />
              <div className="h-4 w-full bg-[#e6dfcb]/30 dark:bg-[#20271b] rounded-lg" />
              <div className="h-4 w-2/3 bg-[#e6dfcb]/30 dark:bg-[#20271b] rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
