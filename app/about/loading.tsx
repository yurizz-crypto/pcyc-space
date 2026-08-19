import React from 'react';

export default function AboutLoading() {
  return (
    <div className="w-full flex flex-col min-h-screen bg-[#fefcf1] dark:bg-[#131710] animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-[#2c3324] py-24 sm:py-32 border-b border-[#3d4632]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="h-5 w-40 bg-[#3d4632] rounded-full" />
          <div className="h-16 w-3/4 max-w-lg bg-[#3d4632] rounded-2xl" />
          <div className="h-6 w-full max-w-md bg-[#3d4632]/60 rounded-lg" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-6">
            <div className="h-10 w-3/4 bg-[#e6dfcb]/60 dark:bg-[#252e1f] rounded-xl" />
            <div className="h-5 w-full bg-[#e6dfcb]/40 dark:bg-[#20271b] rounded-lg" />
            <div className="h-5 w-5/6 bg-[#e6dfcb]/40 dark:bg-[#20271b] rounded-lg" />
          </div>
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2 h-28 rounded-3xl bg-[#f8f4e3] dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b]" />
            <div className="h-44 rounded-3xl bg-white dark:bg-[#131710] border border-[#e6dfcb] dark:border-[#323d2b]" />
            <div className="h-44 rounded-3xl bg-white dark:bg-[#131710] border border-[#e6dfcb] dark:border-[#323d2b]" />
          </div>
        </div>
      </div>
    </div>
  );
}
