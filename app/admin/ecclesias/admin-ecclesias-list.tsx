'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { deleteEcclesiaAction } from '@/app/actions/ecclesias';
import type { Ecclesia } from '@/lib/db/schema/ecclesias';
import { Church, Plus, Trash2, MapPin, Clock, UserCheck, Pencil, Search } from 'lucide-react';

interface AdminEcclesiasListProps {
  ecclesias: Ecclesia[];
}

const PAGE_SIZE = 8;

export function AdminEcclesiasList({ ecclesias }: AdminEcclesiasListProps) {
  const [filterRegion, setFilterRegion] = useState<'ALL' | 'Luzon' | 'Visayas' | 'Mindanao'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

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

  return (
    <div className="space-y-4">
      {/* Tabs & Search Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-[#e6dfcb] shadow-2xs">
        <div className="flex items-center gap-1.5 p-1 bg-[#f8f4e3] rounded-xl overflow-x-auto">
          <button
            type="button"
            onClick={() => handleRegionChange('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              filterRegion === 'ALL'
                ? 'bg-[#2c3324] text-white shadow-xs'
                : 'text-[#505748] hover:text-[#2c3324] hover:bg-[#e6dfcb]/50'
            }`}
          >
            All Regions ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => handleRegionChange('Luzon')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              filterRegion === 'Luzon'
                ? 'bg-[#2c3324] text-white shadow-xs'
                : 'text-[#505748] hover:text-[#2c3324] hover:bg-[#e6dfcb]/50'
            }`}
          >
            Luzon ({luzonCount})
          </button>
          <button
            type="button"
            onClick={() => handleRegionChange('Visayas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              filterRegion === 'Visayas'
                ? 'bg-[#2c3324] text-white shadow-xs'
                : 'text-[#505748] hover:text-[#2c3324] hover:bg-[#e6dfcb]/50'
            }`}
          >
            Visayas ({visayasCount})
          </button>
          <button
            type="button"
            onClick={() => handleRegionChange('Mindanao')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              filterRegion === 'Mindanao'
                ? 'bg-[#2c3324] text-white shadow-xs'
                : 'text-[#505748] hover:text-[#2c3324] hover:bg-[#e6dfcb]/50'
            }`}
          >
            Mindanao ({mindanaoCount})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#707666]" />
          <input
            type="text"
            placeholder="Search ecclesia or city..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#e6dfcb] bg-[#f8f4e3]/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2c3324]"
          />
        </div>
      </div>

      {/* Directory Table / Cards */}
      <Card className="border-[#e6dfcb]">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                Directory Fellowships ({filteredEcclesias.length})
              </CardTitle>
              <CardDescription>
                Live database records of Philippine Christadelphian ecclesias.
              </CardDescription>
            </div>
            <Badge variant="gold" size="sm">
              {filteredEcclesias.length} Visible
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {filteredEcclesias.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Church className="h-10 w-10 text-[#8a9180] mx-auto opacity-70" />
              <p className="text-sm font-semibold text-[#2c3324]">
                {searchQuery ? 'No ecclesias match your search criteria' : 'No ecclesias in this region'}
              </p>
              <p className="text-xs text-[#707666]">
                {searchQuery ? 'Try adjusting your search terms.' : 'Click "Add New Ecclesia" above to register a fellowship.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3">
                {paginatedEcclesias.map((ecc) => (
                  <div
                    key={ecc.id}
                    className="p-5 rounded-2xl bg-white border border-[#e6dfcb] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-[#e0a861]/60 transition-colors"
                  >
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="font-serif font-bold text-lg text-[#2c3324]">{ecc.name}</h3>
                        <Badge
                          variant={
                            ecc.region === 'Luzon'
                              ? 'gold'
                              : ecc.region === 'Visayas'
                              ? 'cream'
                              : 'forest'
                          }
                          size="sm"
                        >
                          {ecc.region}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#505748]">
                        <div className="flex items-start gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-[#e0a861] shrink-0 mt-0.5" />
                          <span>{ecc.address}</span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-[#e0a861] shrink-0 mt-0.5" />
                          <span>{ecc.meetingSchedule}</span>
                        </div>
                        {ecc.contactPerson && (
                          <div className="flex items-center gap-1.5">
                            <UserCheck className="h-3.5 w-3.5 text-[#8a9180] shrink-0" />
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
                          className="gap-1.5 border-[#e6dfcb] text-[#505748] hover:text-[#2c3324]"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </Button>
                      </Link>

                      <form action={deleteEcclesiaAction}>
                        <input type="hidden" name="id" value={ecc.id} />
                        <Button
                          type="submit"
                          variant="destructive"
                          size="sm"
                          className="gap-1.5"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </Button>
                      </form>
                    </div>
                  </div>
                ))}
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
    </div>
  );
}
