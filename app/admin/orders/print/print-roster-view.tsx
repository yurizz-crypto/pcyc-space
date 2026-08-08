'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { OrderWithDetails } from '@/lib/db/queries/orders';
import { Printer, ArrowLeft, Filter, CheckCircle2, Shield, Package, Truck } from 'lucide-react';

interface PrintRosterViewProps {
  orders: OrderWithDetails[];
}

export function PrintRosterView({ orders }: PrintRosterViewProps) {
  const [filterMode, setFilterMode] = useState<'EVENT_PREORDERS' | 'DELIVERY' | 'ALL_PAID'>('EVENT_PREORDERS');

  const isOrderEventPickup = (ord: OrderWithDetails) => {
    const shipping = ord.shippingInfo;
    const addr = (shipping?.deliveryAddress || '').toLowerCase();
    const city = (shipping?.city || '').toLowerCase();
    const notesStr = (shipping?.notes || ord.notes || '').toLowerCase();

    return (
      addr.includes('event') ||
      addr.includes('pickup') ||
      addr.includes('desk') ||
      city === 'n/a' ||
      city.includes('event') ||
      notesStr.includes('event pickup') ||
      !shipping?.deliveryAddress
    );
  };

  const filteredOrders = orders.filter((ord) => {
    const isPaid =
      ord.status === 'PAID' ||
      ord.status === 'COMPLETED' ||
      ord.receipt?.verificationStatus === 'APPROVED';
    const isPickup = isOrderEventPickup(ord);

    if (filterMode === 'EVENT_PREORDERS') {
      return isPaid && isPickup;
    }
    if (filterMode === 'DELIVERY') {
      return isPaid && !isPickup;
    }
    return isPaid;
  });

  const totalCollected = filteredOrders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
  const totalItemCount = filteredOrders.reduce(
    (sum, o) => sum + o.items.reduce((iSum, i) => iSum + i.quantity, 0),
    0
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Embedded High-Fidelity Multi-Page Print Rules */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          @page {
            size: A4 landscape;
            margin: 10mm 10mm 10mm 10mm;
          }
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            font-size: 9.5pt !important;
          }
          nav, header, footer, aside, .no-print, [data-sidebar], .print\\:hidden {
            display: none !important;
          }
          .print-container {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
            background: transparent !important;
          }
          table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          thead {
            display: table-header-group !important;
          }
          tfoot {
            display: table-footer-group !important;
          }
          tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .avoid-break {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .print-border {
            border-color: #333333 !important;
          }
        }
      `}} />

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
              Official Merchandise Claiming & Distribution Roster
            </h1>
            <p className="text-xs text-[#707666] dark:text-[#a3ab98]">
              Multi-page print layout for on-site registration desk claim verification and physical signature signing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handlePrint}
              className="gap-2 shadow-sm font-bold bg-[#2c3324] dark:bg-[#e0a861] text-[#fefcf1] dark:text-[#1b2117]"
            >
              <Printer className="h-4 w-4" />
              <span>Print Roster (A4 Landscape)</span>
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
            🎪 Verified Event Pre-Orders ({orders.filter((o) => (o.status === 'PAID' || o.receipt?.verificationStatus === 'APPROVED') && isOrderEventPickup(o)).length})
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
            🚚 Courier Delivery Manifest ({orders.filter((o) => (o.status === 'PAID' || o.receipt?.verificationStatus === 'APPROVED') && !isOrderEventPickup(o)).length})
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
      <div className="print-container bg-white dark:bg-[#1b2117] p-8 rounded-2xl border border-[#e6dfcb] dark:border-[#323d2b] shadow-sm print:shadow-none print:border-none print:p-0 print:bg-white space-y-6">
        {/* Printable Header */}
        <div className="border-b-2 border-[#2c3324] dark:border-[#e0a861] print:border-black pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-xl text-[#2c3324] dark:text-[#fefcf1] print:text-black">
                PHILIPPINE CHRISTADELPHIAN YOUTH CIRCLE (PCYC)
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#f8f4e3] dark:bg-[#252e1f] border border-[#e6dfcb] dark:border-[#323d2b] text-[#2c3324] dark:text-[#fefcf1] print:bg-gray-100 print:text-black print:border-black">
                {filterMode === 'EVENT_PREORDERS'
                  ? 'Event Pre-Order Claiming Manifest'
                  : filterMode === 'DELIVERY'
                  ? 'Courier Shipping List'
                  : 'Complete Verified Orders'}
              </span>
            </div>
            <p className="text-xs text-[#505748] dark:text-[#a3ab98] print:text-gray-700 pt-1">
              Generated: <strong>{new Date().toLocaleDateString('en-PH', { dateStyle: 'medium' })}</strong> &bull; Total Orders: <strong>{filteredOrders.length}</strong> &bull; Total Units: <strong>{totalItemCount}</strong> &bull; Total Value: <strong>{formatCurrency(totalCollected)}</strong>
            </p>
          </div>
          <div className="text-right text-xs text-[#707666] dark:text-[#a3ab98] print:text-black font-mono">
            <span className="block font-bold">OFFICIAL DESK ROSTER</span>
            <span>GCASH VERIFIED</span>
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
              <tr className="border-b-2 border-[#2c3324] dark:border-[#e0a861] print:border-black text-[#2c3324] dark:text-[#fefcf1] print:text-black uppercase tracking-wider font-bold text-[10px] bg-[#faf7ec] dark:bg-[#252e1f] print:bg-gray-100">
                <th className="py-2 px-1.5 w-8 text-center border-r border-gray-200 print:border-black">#</th>
                <th className="py-2 px-2 w-10 text-center border-r border-gray-200 print:border-black">Claim</th>
                <th className="py-2 px-2 w-28 border-r border-gray-200 print:border-black">Order Ref</th>
                <th className="py-2 px-2 border-r border-gray-200 print:border-black">Member / Recipient</th>
                <th className="py-2 px-2 border-r border-gray-200 print:border-black">Ecclesia / Contact</th>
                <th className="py-2 px-2 border-r border-gray-200 print:border-black">Items & Sizes Ordered</th>
                <th className="py-2 px-2 text-right border-r border-gray-200 print:border-black">Amount</th>
                <th className="py-2 px-2 border-r border-gray-200 print:border-black">GCash Ref</th>
                <th className="py-2 px-2 w-28 text-center">Claim Signature</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6dfcb] dark:divide-[#323d2b] print:divide-gray-400">
              {filteredOrders.map((ord, idx) => {
                const shipping = ord.shippingInfo;
                const userProfile = ord.user;
                const itemsText = ord.items
                  .map(
                    (i) =>
                      `${i.quantity}x ${i.product?.name || 'Merch Item'}${i.selectedSize ? ` (${i.selectedSize})` : ''}`
                  )
                  .join(' + ');

                return (
                  <tr
                    key={ord.id}
                    className={
                      idx % 2 === 0
                        ? 'bg-white dark:bg-[#1b2117] print:bg-white'
                        : 'bg-[#faf7ec]/60 dark:bg-[#20271b] print:bg-gray-50'
                    }
                  >
                    {/* Index Number */}
                    <td className="py-2.5 px-1.5 text-center font-mono text-[#707666] dark:text-[#a3ab98] print:text-black align-middle border-r border-gray-100 print:border-gray-300">
                      {idx + 1}
                    </td>

                    {/* Desk Claim Checkbox */}
                    <td className="py-2.5 px-2 text-center align-middle border-r border-gray-100 print:border-gray-300">
                      <div className="h-4 w-4 border-2 border-[#2c3324] dark:border-[#e0a861] rounded mx-auto inline-block print:border-black" />
                    </td>

                    {/* Order Reference */}
                    <td className="py-2.5 px-2 font-mono font-bold text-[#2c3324] dark:text-[#fefcf1] print:text-black align-middle whitespace-nowrap border-r border-gray-100 print:border-gray-300">
                      {ord.orderNumber}
                    </td>

                    {/* Member Name */}
                    <td className="py-2.5 px-2 align-middle border-r border-gray-100 print:border-gray-300">
                      <strong className="text-[#2c3324] dark:text-[#fefcf1] print:text-black block text-[11px]">
                        {shipping?.recipientName ||
                          (userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : 'PCYC Member')}
                      </strong>
                    </td>

                    {/* Ecclesia / Contact */}
                    <td className="py-2.5 px-2 align-middle text-[#505748] dark:text-[#a3ab98] print:text-gray-800 border-r border-gray-100 print:border-gray-300">
                      <div className="font-medium text-[11px] text-[#2c3324] dark:text-[#fefcf1] print:text-black">
                        {userProfile?.ecclesia || 'Philippine Ecclesia'}
                      </div>
                      <div className="text-[10px] text-[#707666] dark:text-[#a3ab98] print:text-gray-600 font-mono">
                        {shipping?.contactNumber || userProfile?.phoneNumber || 'N/A'}
                      </div>
                    </td>

                    {/* Merch Items & Selected Sizes */}
                    <td className="py-2.5 px-2 align-middle border-r border-gray-100 print:border-gray-300">
                      <div className="font-semibold text-[#2c3324] dark:text-[#fefcf1] print:text-black text-[11px]">
                        {itemsText || '1x Merch Item'}
                      </div>
                      {shipping?.notes && (
                        <div className="text-[9px] text-[#707666] dark:text-[#a3ab98] print:text-gray-600 italic">
                          Note: {shipping.notes}
                        </div>
                      )}
                    </td>

                    {/* Total Amount */}
                    <td className="py-2.5 px-2 text-right align-middle font-mono font-bold text-[#2c3324] dark:text-[#fefcf1] print:text-black whitespace-nowrap border-r border-gray-100 print:border-gray-300">
                      {formatCurrency(Number(ord.totalAmount))}
                    </td>

                    {/* GCash Verification */}
                    <td className="py-2.5 px-2 align-middle font-mono text-[10px] text-[#505748] dark:text-[#a3ab98] print:text-black whitespace-nowrap border-r border-gray-100 print:border-gray-300">
                      <div className="text-[#2e7d32] dark:text-[#81c784] print:text-black font-bold">
                        {ord.receipt?.referenceNumber || 'VERIFIED'}
                      </div>
                    </td>

                    {/* Claim Signature Box */}
                    <td className="py-1 px-2 align-middle text-center">
                      <div className="h-7 w-24 border border-dashed border-gray-400 print:border-black print:border-solid rounded mx-auto" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Sign-off Block for Event Registration Staff */}
        <div className="avoid-break pt-6 border-t-2 border-[#2c3324] dark:border-[#e0a861] print:border-black flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs text-[#707666] dark:text-[#a3ab98] print:text-black">
          <div className="space-y-1">
            <span className="font-bold text-[#2c3324] dark:text-[#fefcf1] print:text-black">
              PCYC Merchandise & Registration Desk Team
            </span>
            <p className="text-[10px] print:text-gray-700">
              Verified on-site claiming manifest. Brethren must present identification or GCash receipt reference upon claim.
            </p>
          </div>

          <div className="flex items-center gap-8 text-right">
            <div className="border-t border-[#707666] dark:border-[#5a6350] print:border-black pt-1 w-44 text-center">
              <span className="text-[10px] block">Merchandise Officer</span>
              <span className="text-[9px] text-[#8a9180] dark:text-[#a3ab98] print:text-gray-600">Signature over Printed Name</span>
            </div>
            <div className="border-t border-[#707666] dark:border-[#5a6350] print:border-black pt-1 w-44 text-center">
              <span className="text-[10px] block">Event Desk Auditor</span>
              <span className="text-[9px] text-[#8a9180] dark:text-[#a3ab98] print:text-gray-600">Signature over Printed Name</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

