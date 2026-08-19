import React from 'react';

export default function AdminOrdersLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white dark:bg-[#1b2117] p-6 rounded-2xl border border-[#e6dfcb] dark:border-[#323d2b] space-y-3">
        <div className="h-7 w-56 bg-[#e6dfcb]/70 dark:bg-[#252e1f] rounded-xl" />
        <div className="h-4 w-96 max-w-full bg-[#e6dfcb]/40 dark:bg-[#20271b] rounded-lg" />
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-[#1b2117] p-5 rounded-2xl border border-[#e6dfcb] dark:border-[#323d2b] space-y-3">
            <div className="h-4 w-24 bg-[#e6dfcb]/50 dark:bg-[#252e1f] rounded-md" />
            <div className="h-8 w-16 bg-[#e6dfcb]/80 dark:bg-[#252e1f] rounded-lg" />
          </div>
        ))}
      </div>

      {/* Orders Table Skeleton */}
      <div className="bg-white dark:bg-[#1b2117] p-6 rounded-2xl border border-[#e6dfcb] dark:border-[#323d2b] space-y-4">
        <div className="h-10 w-full bg-[#e6dfcb]/30 dark:bg-[#20271b] rounded-xl" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-14 w-full bg-[#e6dfcb]/20 dark:bg-[#20271b] rounded-xl" />
        ))}
      </div>
    </div>
  );
}
