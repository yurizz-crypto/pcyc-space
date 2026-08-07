'use client';

import React, { useActionState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/image-upload';
import { uploadReceiptAction, ReceiptActionResult } from '@/app/actions/orders';
import { formatCurrency } from '@/lib/utils';
import { QrCode, UploadCloud, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ReceiptUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderNumber: string;
  amount: number | string;
}

const initialState: ReceiptActionResult = {
  success: false,
};

export function ReceiptUploadModal({
  isOpen,
  onClose,
  orderId,
  orderNumber,
  amount,
}: ReceiptUploadModalProps) {
  const [state, formAction, isPending] = useActionState(uploadReceiptAction, initialState);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Upload Proof of Payment — ${orderNumber}`}
      description="Attach your payment transaction receipt for verification."
    >
      {state?.success ? (
        <div className="p-6 text-center space-y-4 animate-fadeIn">
          <div className="h-12 w-12 rounded-full bg-[#e8f5e9] text-[#2e7d32] mx-auto flex items-center justify-center">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#2c3324]">
            Payment Receipt Submitted!
          </h3>
          <p className="text-xs text-[#505748] leading-relaxed">
            {state.message || 'Your proof of payment has been queued for verification.'}
          </p>
          <div className="pt-2">
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={onClose}
              className="w-full"
            >
              <span>Close Window</span>
            </Button>
          </div>
        </div>
      ) : (
        <form action={formAction} className="space-y-4 pt-2">
          <input type="hidden" name="orderId" value={orderId} />

          {state?.error && (
            <div className="p-3 rounded-xl bg-[#fdf2f2] border border-[#f5c6cb] text-[#c0392b] text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          {/* Account Instruction */}
          <div className="p-3.5 rounded-xl bg-[#f8f4e3] border border-[#e6dfcb] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#2c3324]">Total Payable:</span>
              <span className="font-serif font-bold text-sm text-[#9a6423]">
                {formatCurrency(Number(amount))}
              </span>
            </div>
            <div className="border-t border-[#e6dfcb]/80 pt-2 flex items-center justify-between">
              <span className="text-[#707666]">GCash Number:</span>
              <span className="font-mono font-bold text-[#2c3324]">0912-734-1648 (Yuri S.)</span>
            </div>
          </div>

          <Select
            label="Payment Method"
            name="paymentMethod"
            defaultValue="GCASH"
            options={[
              { value: 'GCASH', label: 'GCash' },
              { value: 'PALAWAN_PAY', label: 'PalawanPay' },
              { value: 'BANK_TRANSFER', label: 'Bank Transfer (BDO / BPI)' },
              { value: 'MAYA', label: 'Maya' },
            ]}
          />

          <Input
            label="Reference / Transaction Number"
            name="referenceNumber"
            placeholder="e.g. 1004 9820 1823"
            required
          />

          <Input
            label="Actual Amount Paid (PHP)"
            name="amountPaid"
            type="number"
            step="0.01"
            defaultValue={Number(amount)}
            required
          />

          <ImageUpload
            label="Payment Screenshot"
            name="receiptImage"
            helperText="Upload the confirmation screenshot saved from your payment app."
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-[#e6dfcb]">
            <Button type="button" variant="outline" size="md" onClick={onClose}>
              <span>Cancel</span>
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isPending}
              className="gap-2"
            >
              <UploadCloud className="h-4 w-4" />
              <span>Submit for Verification</span>
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
