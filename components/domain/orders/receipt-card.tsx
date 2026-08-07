'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { formatPHP, formatDate } from '@/lib/utils';
import { QrCode, Eye } from 'lucide-react';

export interface ReceiptCardProps {
  orderNumber: string;
  amount: string | number;
  status: string;
  paymentMethod?: string;
  referenceNumber?: string;
  receiptUrl?: string;
  createdAt: string | Date;
}

export function ReceiptCard({
  orderNumber,
  amount,
  status,
  paymentMethod = 'GCASH',
  referenceNumber,
  receiptUrl,
  createdAt,
}: ReceiptCardProps) {
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  return (
    <div className="p-4 rounded-2xl bg-white border border-[#e6dfcb] space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-mono font-bold text-sm text-[#2c3324]">
          {orderNumber}
        </span>
        <Badge variant={status === 'PROCESSING' || status === 'COMPLETED' ? 'success' : 'warning'} size="sm">
          {status}
        </Badge>
      </div>

      <div className="flex items-center justify-between text-xs text-[#707666]">
        <span>Amount: {formatPHP(Number(amount))}</span>
        <span>Placed: {formatDate(createdAt)}</span>
      </div>

      {receiptUrl ? (
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#f8f4e3] border border-[#e6dfcb]">
          <div className="flex items-center gap-2 text-xs">
            <QrCode className="h-4 w-4 text-[#e0a861]" />
            <span>{paymentMethod}</span>
            {referenceNumber && <span className="font-mono text-[#707666]">({referenceNumber})</span>}
          </div>
          <button
            type="button"
            onClick={() => setIsZoomOpen(true)}
            className="text-xs text-[#9a6423] font-semibold hover:underline flex items-center gap-1"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>View Receipt</span>
          </button>
        </div>
      ) : (
        <p className="text-[11px] text-[#8a9180]">
          Receipt pending submission.
        </p>
      )}

      {/* Modal Zoom Preview */}
      {receiptUrl && (
        <Modal
          isOpen={isZoomOpen}
          onClose={() => setIsZoomOpen(false)}
          title={`Proof of Payment — Order ${orderNumber}`}
        >
          <div className="space-y-4">
            <div className="relative aspect-[3/4] max-h-[70vh] w-full rounded-xl overflow-hidden bg-black/5">
              <Image
                src={receiptUrl}
                alt={`Receipt screenshot for order ${orderNumber}`}
                fill
                className="object-contain"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-[#707666] pt-2 border-t border-[#e6dfcb]">
              <span>Method: {paymentMethod}</span>
              <span>Ref: {referenceNumber || 'N/A'}</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
