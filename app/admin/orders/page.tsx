import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PriceTag } from '@/components/molecules/price-tag';
import { getAllOrdersWithReceipts } from '@/lib/db/queries/orders';
import { verifyReceiptAction } from '@/app/actions/orders';
import { formatDate } from '@/lib/utils';
import { Receipt, CheckCircle, XCircle, QrCode, Printer } from 'lucide-react';

export default async function AdminOrdersPage() {
  const ordersList = await getAllOrdersWithReceipts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2c3324]">
            Orders & Payment Receipts Queue
          </h1>
          <p className="text-xs sm:text-sm text-[#707666]">
            Verify GCash / Maya screenshot references submitted by brethren for event registrations and merch orders.
          </p>
        </div>

        <Link href="/admin/orders/print">
          <Button variant="outline" size="md" className="gap-2 shrink-0">
            <Printer className="h-4 w-4 text-[#e0a861]" />
            <span>Print Event Pre-Orders Manifest</span>
          </Button>
        </Link>
      </div>

      {/* Orders List */}
      <Card className="border-[#e6dfcb]">
        <CardHeader>
          <CardTitle className="text-lg">All Orders ({ordersList.length})</CardTitle>
          <CardDescription>Live database records of merchandise transactions.</CardDescription>
        </CardHeader>
        <CardContent>
          {ordersList.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Receipt className="h-10 w-10 text-[#8a9180] mx-auto" />
              <p className="text-sm font-semibold text-[#2c3324]">No orders submitted yet</p>
              <p className="text-xs text-[#707666]">
                Incoming member merchandise orders and uploaded receipts will appear here for verification.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {ordersList.map((ord) => {
                const shipping = ord.shippingInfo;
                const receipt = ord.receipt;

                return (
                  <div
                    key={ord.id}
                    className="p-5 rounded-2xl bg-white border border-[#e6dfcb] shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f0ebd3] pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-[#2c3324]">
                          {ord.orderNumber}
                        </span>
                        <Badge variant="gold" size="sm">
                          {ord.status}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-[#707666]">
                        <span>Placed on: {formatDate(ord.createdAt)}</span>
                        <span>•</span>
                        <PriceTag price={ord.totalAmount} />
                      </div>
                    </div>

                    {/* Customer Delivery Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#505748]">
                      <div>
                        <strong className="block text-[#2c3324]">Recipient:</strong>
                        <span>
                          {shipping?.recipientName || 'Member'} ({shipping?.contactNumber || 'N/A'})
                        </span>
                      </div>
                      <div>
                        <strong className="block text-[#2c3324]">Delivery Address:</strong>
                        <span>
                          {shipping?.deliveryAddress}, {shipping?.city}, {shipping?.province}
                        </span>
                      </div>
                    </div>

                    {/* Payment Receipt Info & Action */}
                    {receipt ? (
                      <div className="p-4 rounded-xl bg-[#f8f4e3] border border-[#e6dfcb] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2">
                            <QrCode className="h-4 w-4 text-[#e0a861]" />
                            <span className="font-semibold text-[#2c3324]">
                              Payment: {receipt.paymentMethod}
                            </span>
                            <Badge
                              variant={
                                receipt.verificationStatus === 'APPROVED'
                                  ? 'success'
                                  : receipt.verificationStatus === 'REJECTED'
                                  ? 'error'
                                  : 'warning'
                              }
                              size="sm"
                            >
                              {receipt.verificationStatus}
                            </Badge>
                          </div>
                          {receipt.referenceNumber && (
                            <div>
                              Ref No:{' '}
                              <span className="font-mono font-bold">{receipt.referenceNumber}</span>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
