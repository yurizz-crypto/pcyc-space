import React from 'react';
import { getAllOrdersWithReceipts } from '@/lib/db/queries/orders';
import { PrintRosterView } from './print-roster-view';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Print Event Pre-Orders Manifest — PCYC Space Admin',
};

export default async function AdminPrintOrdersPage() {
  const orders = await getAllOrdersWithReceipts();

  return <PrintRosterView orders={orders} />;
}
