'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { deleteEcclesiaAction } from '@/app/actions/ecclesias';
import type { Ecclesia } from '@/lib/db/schema/ecclesias';
import {
  Buildings,
  Trash,
  PencilSimple,
  MapPin,
  Clock,
  UserCheck,
  MagnifyingGlass,
  Warning,
  X,
  CircleNotch,
} from '@phosphor-icons/react/dist/ssr';
import { motion, AnimatePresence } from 'motion/react';

interface AdminEcclesiasListProps {
  ecclesias: Ecclesia[];
}

const PAGE_SIZE = 8;

export function AdminEcclesiasList({ ecclesias }: AdminEcclesiasListProps) {
  const [filterRegion, setFilterRegion] = useState<'ALL' | 'Luzon' | 'Visayas' | 'Mindanao'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteEcclesiaTarget, setDeleteEcclesiaTarget] = useState<Ecclesia | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  // Compute counts
  const totalCount = ecclesias.length;
  const luzonCount = ecclesias.filter((e) => e.region === 'Luzon').length;
  const visayasCount = ecclesias.filter((e) => e.region === 'Visayas').length;
  const mindanaoCount = ecclesias.filter((e) => e.region === 'Mindanao').length;

  // Filter list
  const filteredEcclesias = ecclesias.filter((ecc) => {
    if (filterRegion !== 'ALL' && ecc.region !== filterRegion) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = ecc.name.toLowerCase();
      const addr = (ecc.address || '').toLowerCase();
      const contact = (ecc.contactPerson || '').toLowerCase();
      const city = (ecc.city || '').toLowerCase();
      return name.includes(q) || addr.includes(q) || contact.includes(q) || city.includes(q);
    }

    return true;
  });

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredEcclesias.length / PAGE_SIZE));
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * PAGE_SIZE;
  const paginatedEcclesias = filteredEcclesias.slice(startIndex, startIndex + PAGE_SIZE);

  const handleRegionChange = (reg: 'ALL' | 'Luzon' | 'Visayas' | 'Mindanao') => {
    setFilterRegion(reg);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleDeleteSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!deleteEcclesiaTarget) return;

    const formData = new FormData(e.currentTarget);
    startDeleteTransition(async () => {
      await deleteEcclesiaAction(formData);
      setDeleteEcclesiaTarget(null);
    });
  };

  return (
    <div className="space-y-4">
      {/* Tabs & Search Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#1b2117] p-2.5 rounded-2xl border border-[#e6dfcb] dark:border-[#323d2b] shadow-2xs">
        <div className="flex items-center gap-1.5 p-1 bg-[#f8f4e3] dark:bg-[#252e1f] rounded-xl overflow-x-auto">
          {(
            [
              { key: 'ALL', label: `All Regions (${totalCount})` },
              { key: 'Luzon', label: `Luzon (${luzonCount})` },
              { key: 'Visayas', label: `Visayas (${visayasCount})` },
              { key: 'Mindanao', label: `Mindanao (${mindanaoCount})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleRegionChange(tab.key)}
              className={`relative px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap z-10 ${
                filterRegion === tab.key
                  ? 'text-white dark:text-[#1b2117]'
                  : 'text-[#505748] dark:text-[#a3ab98] hover:text-[#2c3324] dark:hover:text-[#fefcf1]'
              }`}
            >
              {filterRegion === tab.key && (
                <motion.div
                  layoutId="adminEcclesiasTab"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  className="absolute inset-0 bg-[#2c3324] dark:bg-[#e0a861] rounded-lg z-[-1] shadow-xs"
                />
              )}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <MagnifyingGlass
            weight="bold"
            className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#707666] dark:text-[#a3ab98]"
          />
          <input
            type="text"
            placeholder="Search ecclesias..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#e6dfcb] dark:border-[#323d2b] bg-[#f8f4e3]/50 dark:bg-[#131710] focus:bg-white dark:focus:bg-[#1b2117] dark:text-[#fefcf1] focus:outline-none focus:ring-1 focus:ring-[#2c3324] dark:focus:ring-[#e0a861]"
          />
        </div>
      </div>

      {/* Ecclesias Table / Card List */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-serif">
                Philippine Ecclesias Directory ({filteredEcclesias.length})
              </CardTitle>
              <CardDescription>
                Manage ecclesia meeting places, regional categories, schedules, and coordinators.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredEcclesias.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Buildings weight="duotone" className="h-10 w-10 text-[#8a9180] mx-auto opacity-70" />
              <p className="text-sm font-semibold text-[#2c3324] dark:text-[#fefcf1]">
                {searchQuery ? 'No matching ecclesias found' : 'No ecclesias in this category'}
              </p>
              <p className="text-xs text-[#707666] dark:text-[#a3ab98]">
                {searchQuery ? 'Try adjusting your search terms.' : 'Add a new ecclesia to the directory.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="divide-y divide-[#e6dfcb] dark:divide-[#323d2b]">
                <AnimatePresence mode="popLayout">
                  {paginatedEcclesias.map((ecc) => (
                    <motion.div
                      key={ecc.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[#f8f4e3]/50 dark:hover:bg-[#252e1f]/50 transition-colors px-3 rounded-xl"
                    >
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-serif font-bold text-base text-[#2c3324] dark:text-[#fefcf1]">
                            {ecc.name}
                          </span>
                          <Badge
                            variant={
                              ecc.region === 'Luzon'
                                ? 'forest'
                                : ecc.region === 'Visayas'
                                ? 'gold'
                                : 'forest'
                            }
                            size="sm"
                          >
                            {ecc.region}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#505748] dark:text-[#a3ab98]">
                          <div className="flex items-start gap-1.5">
                            <MapPin weight="duotone" className="h-3.5 w-3.5 text-[#e0a861] shrink-0 mt-0.5" />
                            <span>{ecc.address}</span>
                          </div>
                          <div className="flex items-start gap-1.5">
                            <Clock weight="duotone" className="h-3.5 w-3.5 text-[#e0a861] shrink-0 mt-0.5" />
                            <span>{ecc.meetingSchedule}</span>
                          </div>
                          {ecc.contactPerson && (
                            <div className="flex items-center gap-1.5">
                              <UserCheck weight="duotone" className="h-3.5 w-3.5 text-[#8a9180] shrink-0" />
                              <span>Contact: {ecc.contactPerson}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-center">
                        <Link href={`/admin/ecclesias/${ecc.id}/edit`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 border-[#e6dfcb] dark:border-[#323d2b] text-[#505748] dark:text-[#a3ab98] hover:text-[#2c3324] dark:hover:text-[#fefcf1] dark:hover:bg-[#252e1f] rounded-xl"
                          >
                            <PencilSimple weight="duotone" className="h-3.5 w-3.5" />
                            <span>Edit</span>
                          </Button>
                        </Link>

                        <button
                          type="button"
                          onClick={() => setDeleteEcclesiaTarget(ecc)}
                          className="p-2 rounded-xl text-[#c0392b] dark:text-[#ef5350] hover:bg-red-50 dark:hover:bg-red-950/30 border border-transparent hover:border-red-200 dark:hover:border-red-800 transition-all cursor-pointer"
                          title="Delete Ecclesia"
                        >
                          <Trash weight="duotone" className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Universal Pagination */}
              <Pagination
                currentPage={activePage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
                totalItems={filteredEcclesias.length}
                pageSize={PAGE_SIZE}
                showCount={true}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Modal with Framer Motion and Active Deletion Spinner */}
      <AnimatePresence>
        {deleteEcclesiaTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setDeleteEcclesiaTarget(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative z-10 bg-[#fefcf1] dark:bg-[#1b2117] border-2 border-[#c0392b]/30 dark:border-[#c0392b]/50 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-[#fdf2f2] dark:bg-[#2d1815] text-[#c0392b] dark:text-[#ef5350] border border-[#f5c6cb] dark:border-[#4d201b] shadow-xs">
                    <Warning weight="fill" className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-[#2c3324] dark:text-[#fefcf1]">
                      Delete Ecclesia Listing?
                    </h3>
                    <p className="text-xs text-[#707666] dark:text-[#a3ab98]">
                      Permanent directory action
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setDeleteEcclesiaTarget(null)}
                  className="text-[#707666] dark:text-[#a3ab98] hover:text-[#2c3324] dark:hover:text-[#fefcf1] p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
                >
                  <X weight="bold" className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#252e1f] border border-[#e6dfcb] dark:border-[#323d2b] text-xs text-[#505748] dark:text-[#a3ab98] space-y-3">
                <p>
                  You are about to permanently delete{' '}
                  <strong className="text-[#2c3324] dark:text-[#fefcf1] font-bold">
                    {deleteEcclesiaTarget.name}
                  </strong>
                  .
                </p>
                <p className="text-[#c0392b] dark:text-[#ef5350] font-semibold bg-[#fdf2f2] dark:bg-[#2d1815] p-3 rounded-xl border border-[#f5c6cb] dark:border-[#4d201b] leading-relaxed">
                  ⚠️ This ecclesia will be removed from the public directory and cannot be recovered.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isDeleting}
                  onClick={() => setDeleteEcclesiaTarget(null)}
                  className="rounded-xl px-4"
                >
                  Cancel
                </Button>

                <form onSubmit={handleDeleteSubmit}>
                  <input type="hidden" name="id" value={deleteEcclesiaTarget.id} />
                  <Button
                    type="submit"
                    variant="destructive"
                    size="sm"
                    disabled={isDeleting}
                    className="gap-2 rounded-xl px-5 shadow-sm"
                  >
                    {isDeleting ? (
                      <>
                        <CircleNotch weight="bold" className="h-4 w-4 animate-spin" />
                        <span>Deleting Ecclesia...</span>
                      </>
                    ) : (
                      <>
                        <Trash weight="bold" className="h-4 w-4" />
                        <span>Confirm Delete</span>
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
