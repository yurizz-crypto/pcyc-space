'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PriceTag } from '@/components/molecules/price-tag';
import { Pagination } from '@/components/ui/pagination';
import { verifyReceiptAction } from '@/app/actions/orders';
import { formatDate } from '@/lib/utils';
import type { OrderWithDetails } from '@/lib/db/queries/orders';
import { Receipt, CheckCircle, XCircle, QrCode, Search } from 'lucide-react';

interface AdminOrdersListProps {
  orders: OrderWithDetails[];
}

const PAGE_SIZE = 8;

export function AdminOrdersList({ orders }: AdminOrdersListProps) {
  const [filterTab, setFilterTab] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Compute counts
  const totalCount = orders.length;
  const pendingCount = orders.filter(
    (o) => o.receipt?.verificationStatus === 'PENDING'
  ).length;
  const approvedCount = orders.filter(
    (o) => o.status === 'PAID' || o.receipt?.verificationStatus === 'APPROVED'
  ).length;
  const rejectedCount = orders.filter(
    (o) => o.receipt?.verificationStatus === 'REJECTED'
  ).length;

  // Filter list
  const filteredOrders = orders.filter((ord) => {
    const vStatus = ord.receipt?.verificationStatus;

    if (filterTab === 'PENDING' && vStatus !== 'PENDING') return false;
    if (filterTab === 'APPROVED' && ord.status !== 'PAID' && vStatus !== 'APPROVED') return false;
    if (filterTab === 'REJECTED' && vStatus !== 'REJECTED') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const orderNum = (ord.orderNumber || '').toLowerCase();
      const name = (ord.shippingInfo?.recipientName || `${ord.user?.firstName || ''} ${ord.user?.lastName || ''}`).toLowerCase();
      const contact = (ord.shippingInfo?.contactNumber || ord.user?.phoneNumber || '').toLowerCase();
      const ref = (ord.receipt?.referenceNumber || '').toLowerCase();
      const addr = (ord.shippingInfo?.deliveryAddress || '').toLowerCase();
      return orderNum.includes(q) || name.includes(q) || contact.includes(q) || ref.includes(q) || addr.includes(q);
    }

    return true;
  });

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * PAGE_SIZE;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + PAGE_SIZE);

  const handleTabChange = (tab: 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED') => {
    setFilterTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Tabs & Search Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#1b2117] p-2.5 rounded-2xl border border-[#e6dfcb] dark:border-[#323d2b] shadow-2xs">
        <div className="flex items-center gap-1.5 p-1 bg-[#f8f4e3] dark:bg-[#252e1f] rounded-xl overflow-x-auto">
          <button
            type="button"
            onClick={() => handleTabChange('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              filterTab === 'ALL'
                ? 'bg-[#2c3324] dark:bg-[#e0a861] text-white dark:text-[#1b2117] shadow-xs'
                : 'text-[#505748] dark:text-[#a3ab98] hover:text-[#2c3324] dark:hover:text-[#fefcf1] hover:bg-[#e6dfcb]/50 dark:hover:bg-[#323d2b]'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('PENDING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              filterTab === 'PENDING'
                ? 'bg-[#2c3324] dark:bg-[#e0a861] text-white dark:text-[#1b2117] shadow-xs'
                : 'text-[#505748] dark:text-[#a3ab98] hover:text-[#2c3324] dark:hover:text-[#fefcf1] hover:bg-[#e6dfcb]/50 dark:hover:bg-[#323d2b]'
            }`}
          >
            Pending Verification ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('APPROVED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              filterTab === 'APPROVED'
                ? 'bg-[#2c3324] dark:bg-[#e0a861] text-white dark:text-[#1b2117] shadow-xs'
                : 'text-[#505748] dark:text-[#a3ab98] hover:text-[#2c3324] dark:hover:text-[#fefcf1] hover:bg-[#e6dfcb]/50 dark:hover:bg-[#323d2b]'
            }`}
          >
            Approved ({approvedCount})
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('REJECTED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              filterTab === 'REJECTED'
                ? 'bg-[#2c3324] dark:bg-[#e0a861] text-white dark:text-[#1b2117] shadow-xs'
                : 'text-[#505748] dark:text-[#a3ab98] hover:text-[#2c3324] dark:hover:text-[#fefcf1] hover:bg-[#e6dfcb]/50 dark:hover:bg-[#323d2b]'
            }`}
          >
            Rejected ({rejectedCount})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#707666] dark:text-[#a3ab98]" />
          <input
            type="text"
            placeholder="Search orders, ref, name..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#e6dfcb] dark:border-[#323d2b] bg-[#f8f4e3]/50 dark:bg-[#131710] focus:bg-white dark:focus:bg-[#1b2117] dark:text-[#fefcf1] focus:outline-none focus:ring-1 focus:ring-[#2c3324] dark:focus:ring-[#e0a861]"
          />
        </div>
      </div>

      {/* Orders List Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">
            Merchandise Transactions ({filteredOrders.length})
          </CardTitle>
          <CardDescription>
            Live database records of merchandise transactions and payment receipts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Receipt className="h-10 w-10 text-[#8a9180] mx-auto opacity-70" />
              <p className="text-sm font-semibold text-[#2c3324] dark:text-[#fefcf1]">
                {searchQuery ? 'No orders match your search criteria' : 'No orders in this category'}
              </p>
              <p className="text-xs text-[#707666] dark:text-[#a3ab98]">
                {searchQuery ? 'Try modifying your search keywords.' : 'Orders submitted by members will appear here.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-4">
                {paginatedOrders.map((ord) => {
                  const shipping = ord.shippingInfo;
                  const receipt = ord.receipt;

                  return (
                    <div
                      key={ord.id}
                      className="p-5 rounded-2xl bg-white dark:bg-[#1b2117] border border-[#e6dfcb] dark:border-[#323d2b] shadow-xs space-y-4 hover:border-[#e0a861]/60 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f0ebd3] dark:border-[#323d2b] pb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-bold text-[#2c3324] dark:text-[#fefcf1]">
                            {ord.orderNumber}
                          </span>
                          <Badge
                            variant={
                              ord.status === 'PAID'
                                ? 'success'
                                : ord.status === 'COMPLETED'
                                ? 'forest'
                                : ord.status === 'CANCELLED'
                                ? 'destructive'
                                : 'gold'
                            }
                            size="sm"
                          >
                            {ord.status}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-[#707666] dark:text-[#a3ab98]">
                          <span>Placed on: {formatDate(ord.createdAt)}</span>
                          <span>•</span>
                          <PriceTag price={ord.totalAmount} />
                        </div>
                      </div>

                      {/* Customer Delivery Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#505748] dark:text-[#a3ab98]">
                        <div>
                          <strong className="block text-[#2c3324] dark:text-[#fefcf1]">Recipient:</strong>
                          <span>
                            {shipping?.recipientName || (ord.user ? `${ord.user.firstName} ${ord.user.lastName}` : 'Member')}{' '}
                            ({shipping?.contactNumber || ord.user?.phoneNumber || 'N/A'})
                          </span>
                        </div>
                        <div>
                          <strong className="block text-[#2c3324] dark:text-[#fefcf1]">Delivery Address:</strong>
                          <span>
                            {shipping?.deliveryAddress}, {shipping?.city}, {shipping?.province}
                          </span>
                        </div>
                      </div>

                      {/* Payment Receipt Info & Action */}
                      {receipt ? (
                        <div className="p-4 rounded-xl bg-[#f8f4e3] dark:bg-[#252e1f] border border-[#e6dfcb] dark:border-[#323d2b] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-2">
                              <QrCode className="h-4 w-4 text-[#e0a861]" />
                              <span className="font-semibold text-[#2c3324] dark:text-[#fefcf1]">
                                Payment: {receipt.paymentMethod}
                              </span>
                              <Badge
                                variant={
                                  receipt.verificationStatus === 'APPROVED'
                                    ? 'success'
                                    : receipt.verificationStatus === 'REJECTED'
                                    ? 'destructive'
                                    : 'gold'
                                }
                                size="sm"
                              >
                                {receipt.verificationStatus}
                              </Badge>
                            </div>
                            {receipt.referenceNumber && (
                              <div className="dark:text-[#a3ab98]">
                                Ref No:{' '}
                                <span className="font-mono font-bold text-[#2c3324] dark:text-[#fefcf1]">{receipt.referenceNumber}</span>
                              </div>
                            )}
                          </div>

                          {receipt.verificationStatus === 'PENDING' && (
                            <div className="flex items-center gap-2">
                              <form action={verifyReceiptAction}>
                                <input type="hidden" name="orderId" value={ord.id} />
                                <input type="hidden" name="receiptId" value={receipt.id} />
                                <input type="hidden" name="decision" value="APPROVED" />
                                <Button
                                  type="submit"
                                  variant="primary"
                                  size="sm"
                                  className="gap-1.5 shadow-xs"
                                >
                                  <CheckCircle className="h-3.5 w-3.5" />
                                  <span>Verify & Approve</span>
                                </Button>
                              </form>

                              <form action={verifyReceiptAction}>
                                <input type="hidden" name="orderId" value={ord.id} />
                                <input type="hidden" name="receiptId" value={receipt.id} />
                                <input type="hidden" name="decision" value="REJECTED" />
                                <input
                                  type="hidden"
                                  name="adminNotes"
                                  value="Payment screenshot reference did not match GCash account record."
                                />
                                <Button
                                  type="submit"
                                  variant="destructive"
                                  size="sm"
                                  className="gap-1.5"
                                >
                                  <XCircle className="h-3.5 w-3.5" />
                                  <span>Reject</span>
                                </Button>
                              </form>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs text-[#8a9180] italic">
                          No payment receipt uploaded yet by customer.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Universal Pagination */}
              <Pagination
                currentPage={activePage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
                totalItems={filteredOrders.length}
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
