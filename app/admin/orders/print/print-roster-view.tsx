'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { OrderWithDetails } from '@/lib/db/queries/orders';
import { Printer, ArrowLeft, Filter, CheckCircle2, Shield } from 'lucide-react';

interface PrintRosterViewProps {
  orders: OrderWithDetails[];
}

export function PrintRosterView({ orders }: PrintRosterViewProps) {
  const [filterMode, setFilterMode] = useState<'ALL_PAID' | 'EVENT_PREORDERS' | 'DELIVERY'>('EVENT_PREORDERS');

  const filteredOrders = orders.filter((ord) => {
    const isPaid = ord.status === 'PAID' || ord.status === 'COMPLETED' || ord.receipt?.verificationStatus === 'APPROVED';
    const notesStr = (ord.shippingInfo?.notes || ord.notes || '').toLowerCase();
    const isEventPickup = notesStr.includes('event pickup') || (ord.shippingInfo?.deliveryAddress || '').toLowerCase().includes('event pickup');

    if (filterMode === 'EVENT_PREORDERS') {
      return isPaid && isEventPickup;
    }
    if (filterMode === 'DELIVERY') {
      return isPaid && !isEventPickup;
    }
    return isPaid;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Screen-Only Controls */}
      <div className="print:hidden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1b2117] p-5 rounded-2xl border border-[#e6dfcb] dark:border-[#323d2b] shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href="/admin/orders"
                className="text-xs text-[#707666] dark:text-[#a3ab98] hover:text-[#2c3324] dark:hover:text-[#fefcf1] inline-flex items-center gap-1"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Orders</span>
              </Link>
            </div>
            <h1 className="font-serif text-xl font-bold text-[#2c3324] dark:text-[#fefcf1]">
              Printable Event Claiming & Distribution Roster
            </h1>
            <p className="text-xs text-[#707666] dark:text-[#a3ab98]">
              Generate a clean, printable manifest of verified pre-orders for the event registration desk.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handlePrint}
              className="gap-2 shadow-sm font-bold"
            >
              <Printer className="h-4 w-4" />
              <span>Print Roster (A4 / Letter)</span>
            </Button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilterMode('EVENT_PREORDERS')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterMode === 'EVENT_PREORDERS'
                ? 'bg-[#2c3324] dark:bg-[#e0a861] text-[#fefcf1] dark:text-[#1b2117]'
                : 'bg-white dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b] text-[#505748] dark:text-[#a3ab98] hover:bg-[#f8f4e3] dark:hover:bg-[#252e1f]'
            }`}
          >
            🎪 Verified Event Pre-Orders ({orders.filter((o) => (o.status === 'PAID' || o.receipt?.verificationStatus === 'APPROVED') && ((o.shippingInfo?.notes || '').toLowerCase().includes('event pickup') || (o.shippingInfo?.deliveryAddress || '').toLowerCase().includes('event pickup'))).length})
          </button>

          <button
            type="button"
            onClick={() => setFilterMode('DELIVERY')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterMode === 'DELIVERY'
                ? 'bg-[#2c3324] dark:bg-[#e0a861] text-[#fefcf1] dark:text-[#1b2117]'
                : 'bg-white dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b] text-[#505748] dark:text-[#a3ab98] hover:bg-[#f8f4e3] dark:hover:bg-[#252e1f]'
            }`}
          >
            🚚 Courier Delivery Manifest
          </button>

          <button
            type="button"
            onClick={() => setFilterMode('ALL_PAID')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterMode === 'ALL_PAID'
                ? 'bg-[#2c3324] dark:bg-[#e0a861] text-[#fefcf1] dark:text-[#1b2117]'
                : 'bg-white dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b] text-[#505748] dark:text-[#a3ab98] hover:bg-[#f8f4e3] dark:hover:bg-[#252e1f]'
            }`}
          >
            All Verified Transactions ({orders.filter((o) => o.status === 'PAID' || o.receipt?.verificationStatus === 'APPROVED').length})
          </button>
        </div>
      </div>

      {/* Printable Sheet */}
      <div className="bg-white dark:bg-[#1b2117] p-8 rounded-2xl border border-[#e6dfcb] dark:border-[#323d2b] shadow-sm print:shadow-none print:border-none print:p-0 print:bg-white space-y-6">
        {/* Printable Header */}
        <div className="border-b-2 border-[#2c3324] dark:border-[#e0a861] print:border-[#2c3324] pb-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-xl text-[#2c3324] dark:text-[#fefcf1] print:text-[#2c3324]">
                PCYC PHILIPPINES &bull; MERCHANDISE ROSTER
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#f8f4e3] dark:bg-[#252e1f] border border-[#e6dfcb] dark:border-[#323d2b] text-[#2c3324] dark:text-[#fefcf1] print:bg-[#f8f4e3] print:text-[#2c3324]">
                {filterMode === 'EVENT_PREORDERS'
                  ? 'Event Pickup Manifest'
                  : filterMode === 'DELIVERY'
                  ? 'Courier Shipping List'
                  : 'Complete Verified Orders'}
              </span>
            </div>
            <p className="text-xs text-[#505748] dark:text-[#a3ab98] print:text-[#505748] pt-1">
              Generated: {new Date().toLocaleDateString('en-PH', { dateStyle: 'medium' })} &bull; Total Orders: {filteredOrders.length}
            </p>
          </div>
          <div className="text-right text-xs text-[#707666] dark:text-[#a3ab98] print:text-[#707666] font-mono">
            CONFIDENTIAL &bull; DESK USE ONLY
          </div>
        </div>

        {/* Table of Orders */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-xs text-[#707666] dark:text-[#a3ab98]">
            No orders match the selected filter criteria.
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-[#2c3324] dark:border-[#e0a861] print:border-[#2c3324] text-[#2c3324] dark:text-[#fefcf1] print:text-[#2c3324] uppercase tracking-wider font-bold">
                <th className="py-2.5 px-2 w-10 text-center">Claim</th>
                <th className="py-2.5 px-2">Order Ref</th>
                <th className="py-2.5 px-2">Member / Recipient</th>
                <th className="py-2.5 px-2">Ecclesia / Contact</th>
                <th className="py-2.5 px-2">Items & Sizes</th>
                <th className="py-2.5 px-2 text-right">Amount</th>
                <th className="py-2.5 px-2">Payment Ref</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6dfcb] dark:divide-[#323d2b] print:divide-[#e6dfcb]">
              {filteredOrders.map((ord, idx) => {
                const shipping = ord.shippingInfo;
                const userProfile = ord.user;
                const itemsText = ord.items
                  .map(
                    (i) =>
                      `${i.product?.name || 'Item'} (${i.quantity}x${i.selectedSize ? ` - ${i.selectedSize}` : ''})`
                  )
                  .join(' + ');

                return (
                  <tr key={ord.id} className={idx % 2 === 0 ? 'bg-white dark:bg-[#1b2117] print:bg-white' : 'bg-[#fefcf1] dark:bg-[#20271b] print:bg-[#fefcf1]'}>
                    {/* Desk Claim Checkbox */}
                    <td className="py-3 px-2 text-center align-top">
                      <div className="h-5 w-5 border-2 border-[#2c3324] dark:border-[#e0a861] rounded mx-auto inline-block print:border-black" />
                    </td>

                    {/* Order Reference */}
                    <td className="py-3 px-2 font-mono font-bold text-[#2c3324] dark:text-[#fefcf1] print:text-[#2c3324] align-top whitespace-nowrap">
                      {ord.orderNumber}
                    </td>

                    {/* Member Name */}
                    <td className="py-3 px-2 align-top">
                      <strong className="text-[#2c3324] dark:text-[#fefcf1] print:text-[#2c3324] block">
                        {shipping?.recipientName ||
                          (userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : 'PCYC Member')}
                      </strong>
                      <span className="text-[10px] text-[#707666] dark:text-[#a3ab98] print:text-[#707666]">
                        {shipping?.contactNumber || userProfile?.phoneNumber || 'N/A'}
                      </span>
                    </td>

                    {/* Ecclesia / Location */}
                    <td className="py-3 px-2 align-top text-[#505748] dark:text-[#a3ab98] print:text-[#505748]">
                      <span>{userProfile?.ecclesia || shipping?.city || 'Ecclesia'}</span>
                    </td>

                    {/* Merch Items & Selected Sizes */}
                    <td className="py-3 px-2 align-top">
                      <div className="font-semibold text-[#2c3324] dark:text-[#fefcf1] print:text-[#2c3324]">{itemsText || '1x Merch Item'}</div>
                      {shipping?.notes && (
                        <div className="text-[10px] text-[#707666] dark:text-[#a3ab98] print:text-[#707666] italic mt-0.5 line-clamp-1">
                          {shipping.notes}
                        </div>
                      )}
                    </td>

                    {/* Total Amount */}
                    <td className="py-3 px-2 text-right align-top font-mono font-bold text-[#2c3324] dark:text-[#fefcf1] print:text-[#2c3324] whitespace-nowrap">
                      {formatCurrency(Number(ord.totalAmount))}
                    </td>

                    {/* GCash Verification */}
                    <td className="py-3 px-2 align-top font-mono text-[11px] text-[#505748] dark:text-[#a3ab98] print:text-[#505748] whitespace-nowrap">
                      <div>{ord.receipt?.paymentMethod || 'GCASH'}</div>
                      <div className="text-[#2e7d32] dark:text-[#81c784] print:text-[#2e7d32] font-bold">
                        {ord.receipt?.referenceNumber || 'VERIFIED'}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Footer for Event Staff */}
        <div className="pt-6 border-t border-[#e6dfcb] dark:border-[#323d2b] print:border-[#e6dfcb] flex justify-between text-[11px] text-[#707666] dark:text-[#a3ab98] print:text-[#707666]">
          <span>PCYC Registration & Merchandise Distribution Team</span>
          <span>Verified Pre-Orders Official Record</span>
        </div>
      </div>
    </div>
  );
}
