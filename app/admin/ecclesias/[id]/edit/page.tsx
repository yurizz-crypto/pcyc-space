import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEcclesiaById } from '@/lib/db/queries/ecclesias';
import { EditEcclesiaForm } from './edit-form';
import { ArrowLeft } from 'lucide-react';

interface EditEcclesiaPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEcclesiaPage({ params }: EditEcclesiaPageProps) {
  const { id } = await params;
  const ecclesia = await getEcclesiaById(id);

  if (!ecclesia) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href="/admin/ecclesias"
        className="inline-flex items-center gap-1.5 text-xs text-[#505748] hover:text-[#2c3324] font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Ecclesia Directory</span>
      </Link>

      <EditEcclesiaForm ecclesia={ecclesia} />
    </div>
  );
}
