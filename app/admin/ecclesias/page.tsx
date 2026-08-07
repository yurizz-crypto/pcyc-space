import React from 'react';
import Link from 'next/link';
import { getAllEcclesias } from '@/lib/db/queries/ecclesias';
import { AdminEcclesiasList } from './admin-ecclesias-list';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Philippine Ecclesia Directory — PCYC Space Admin',
  description: 'Manage verified Christadelphian ecclesias across Luzon, Visayas, and Mindanao.',
};

export default async function AdminEcclesiasPage() {
  const ecclesiaList = await getAllEcclesias();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2c3324]">
            Philippine Ecclesia Directory
          </h1>
          <p className="text-xs sm:text-sm text-[#707666]">
            Manage verified Christadelphian ecclesias displayed on the Home page, About directory, Footer, and Member Registration.
          </p>
        </div>
        <Link href="/admin/ecclesias/new">
          <Button variant="primary" className="gap-2 shadow-xs">
            <Plus className="h-4 w-4" />
            <span>Add New Ecclesia</span>
          </Button>
        </Link>
      </div>

      {/* Ecclesia List with Region Filter, Search & Pagination */}
      <AdminEcclesiasList ecclesias={ecclesiaList} />
    </div>
  );
}
