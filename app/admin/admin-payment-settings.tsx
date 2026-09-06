'use client';

import React, { useActionState, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageUpload } from '@/components/ui/image-upload';
import { updatePaymentSettingsAction } from '@/app/actions/settings';
import { CreditCard, Save, AlertCircle, CheckCircle } from 'lucide-react';
import Image from 'next/image';

interface Props {
  initialPlatform: string;
  initialAccountName: string;
  initialAccountNumber: string;
  initialQrUrl: string;
}

const initialState: { success: boolean; error?: string; message?: string } = { success: false };

export function AdminPaymentSettings({ initialPlatform, initialAccountName, initialAccountNumber, initialQrUrl }: Props) {
  const [state, formAction, isPending] = useActionState(updatePaymentSettingsAction, initialState);
  const [qrPreview, setQrPreview] = useState(initialQrUrl);

  return (
    <Card className="border-[#e6dfcb] dark:border-[#323d2b]">
      <CardHeader>
        <div className="flex items-center gap-2 text-[#2c3324] dark:text-[#fefcf1]">
          <CreditCard className="h-5 w-5 text-[#e0a861]" />
          <CardTitle className="text-lg font-serif">Platform Payment Settings</CardTitle>
        </div>
        <CardDescription>
          Configure the manual payment receiver details shown to users during checkout and on the merch store.
        </CardDescription>
      </CardHeader>
      
      <form action={formAction}>
        <CardContent className="space-y-4">
          {state?.error && (
            <div className="p-3 rounded-lg bg-[#fdf2f2] dark:bg-[#2d1815] border border-[#f5c6cb] dark:border-[#4d201b] text-[#c0392b] dark:text-[#ef5350] text-sm flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{state.error}</span>
            </div>
          )}
          {state?.success && (
            <div className="p-3 rounded-lg bg-[#e8f5e9] dark:bg-[#1b2a1e] border border-[#a5d6a7] dark:border-[#2e4c34] text-[#2e7d32] dark:text-[#4caf50] text-sm flex items-start gap-2">
              <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{state.message}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <Input
                label="Payment Platform Name"
                name="platform"
                defaultValue={initialPlatform}
                placeholder="e.g. Maya, BDO, MariBank"
                required
              />
              <Input
                label="Account Name"
                name="accountName"
                defaultValue={initialAccountName}
                placeholder="e.g. PCYC Official"
                required
              />
              <Input
                label="Account Number"
                name="accountNumber"
                defaultValue={initialAccountNumber}
                placeholder="e.g. 0917 123 4567"
                required
              />
            </div>
            
            <div className="space-y-2 border border-[#e6dfcb] dark:border-[#323d2b] p-4 rounded-xl bg-[#f8f4e3]/30 dark:bg-[#252e1f]/30">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#2c3324] dark:text-[#fefcf1]">
                Payment QR Code (Optional)
              </label>
              
              {qrPreview && (
                <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-[#e6dfcb] dark:border-[#323d2b] mb-3">
                  <Image src={qrPreview} alt="QR Code" fill className="object-cover" />
                  <input type="hidden" name="existingQr" value={qrPreview} />
                </div>
              )}
              
              <ImageUpload
                name="qrCodeFile"
                label={qrPreview ? "Replace QR Code" : "Upload QR Code"}
                helperText="Upload the provider's QR code. Square 1:1 recommended."
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-[#f8f4e3]/40 dark:bg-[#252e1f]/40 border-t border-[#e6dfcb] dark:border-[#323d2b] py-4">
          <Button type="submit" variant="primary" size="md" isLoading={isPending} className="gap-2 ml-auto shadow-xs">
            <Save className="h-4 w-4" />
            <span>Save Settings</span>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
