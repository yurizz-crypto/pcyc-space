import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/db/queries/products';
import { EditMerchForm } from './edit-form';
import { ArrowLeft } from 'lucide-react';

interface EditMerchPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditMerchPage({ params }: EditMerchPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/admin/merch"
        className="inline-flex items-center gap-1.5 text-xs text-[#505748] hover:text-[#2c3324] font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Merch Inventory</span>
      </Link>

      <EditMerchForm product={product} />
    </div>
  );
}
