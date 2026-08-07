'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useActionState } from 'react';
import { registerForEventAction, type EventRegistrationState } from '@/app/actions/events';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ImageUpload } from '@/components/ui/image-upload';
import { formatCurrency, formatPHP } from '@/lib/utils';
import type { Event, EventRegistration } from '@/lib/db/schema/events';
import type { Profile } from '@/lib/db/schema/users';
import {
  CheckCircle2,
  QrCode,
  Building2,
  Calendar,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface EventRegistrationBoxProps {
  event: Event;
  user: Profile | null;
  registration: EventRegistration | null;
}

const initialState: EventRegistrationState = {
  success: false,
};

export function EventRegistrationBox({ event, user, registration }: EventRegistrationBoxProps) {
  const [state, formAction, isPending] = useActionState(registerForEventAction, initialState);
  const [paymentOption, setPaymentOption] = useState<'GCASH' | 'VENUE_DESK'>('GCASH');

  const feeNum = Number(event.registrationFee || 0);
  const isFree = feeNum === 0;

  // 1. If Already Registered (Server state or successfully submitted client state)
  if (registration || state?.success) {
    const isGcashPending =
      (registration?.paymentOption === 'GCASH' && registration?.paymentStatus === 'VERIFICATION_QUEUED') ||
      (state?.success && paymentOption === 'GCASH');

    return (
      <Card className="border-[#2e7d32]/40 bg-[#f8faf6] shadow-md">
        <CardHeader className="bg-[#2c3324] text-[#fefcf1] p-6 rounded-t-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#e0a861] uppercase tracking-wider">
              Registration Status
            </span>
            <Badge variant="success" size="sm">
              Registered
            </Badge>
          </div>
          <CardTitle className="font-serif text-xl sm:text-2xl text-white flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-[#81c784]" />
            <span>You&apos;re Registered!</span>
          </CardTitle>
          <CardDescription className="text-xs text-[#f8f4e3]/80">
            {event.title}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-4 text-xs text-[#505748]">
          <div className="p-4 rounded-xl bg-white border border-[#d3dec2] space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-[#707666]">Attendee:</span>
              <strong className="text-[#2c3324]">{user?.firstName} {user?.lastName}</strong>
            </div>
            <div className="flex justify-between items-center border-t border-[#f0f4eb] pt-2">
              <span className="text-[#707666]">Registration Fee:</span>
              <span className="font-bold text-[#2c3324]">{isFree ? 'Free Admission' : formatPHP(feeNum)}</span>
            </div>
            <div className="flex justify-between items-center border-t border-[#f0f4eb] pt-2">
              <span className="text-[#707666]">Payment Method:</span>
              <Badge variant={isGcashPending ? 'gold' : 'success'} size="sm">
                {isFree
                  ? 'Free'
                  : isGcashPending
                  ? 'GCash (Verification Queued)'
                  : 'Pay at Venue Desk'}
              </Badge>
            </div>
          </div>

          {state?.message && (
            <p className="p-3 rounded-xl bg-[#f0f4eb] text-[#2c3324] font-medium text-center">
              {state.message}
            </p>
          )}
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <Link href="/portal" className="w-full">
            <Button variant="primary" size="lg" className="w-full gap-2 shadow-sm">
              <span>View in Member Portal</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  // 2. If Not Logged In
  if (!user) {
    return (
      <Card className="border-[#e0a861]/40 shadow-lg">
        <CardHeader className="bg-[#2c3324] text-[#fefcf1] p-6 space-y-2 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#e0a861] uppercase tracking-wider">
              Registration Fee
            </span>
            <Badge variant="gold" size="sm">
              {event.status}
            </Badge>
          </div>
          <div className="font-serif font-bold text-2xl sm:text-3xl text-white">
            {isFree ? 'Free Fellowship' : formatPHP(feeNum)}
          </div>
          <p className="text-[11px] text-[#f8f4e3]/75">
            {isFree ? 'Open admission for youth & brethren.' : 'Includes camp materials, accommodations & meals.'}
          </p>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          <div className="p-4 rounded-xl bg-[#f8f4e3] border border-[#e6dfcb] text-xs text-[#505748] space-y-2">
            <p className="font-medium text-[#2c3324]">Member Authentication Required</p>
            <p>Please log in or register with your PCYC member account to reserve your slot and register for this gathering.</p>
          </div>

          <Link href={`/login?redirectTo=/events/${event.slug}`} className="block w-full">
            <Button variant="primary" size="lg" className="w-full shadow-md">
              <span>Log In to Register</span>
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // 3. Admin view notice
  if (user.role === 'ADMIN' || user.role === 'SUPERADMIN') {
    return (
      <Card className="border-[#e0a861]/40 shadow-lg">
        <CardHeader className="bg-[#2c3324] text-[#fefcf1] p-6 space-y-2 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#e0a861] uppercase tracking-wider">
              Event Management
            </span>
            <Badge variant="gold" size="sm">
              Admin Access
            </Badge>
          </div>
          <div className="font-serif font-bold text-2xl text-white">
            {isFree ? 'Free Event' : formatPHP(feeNum)}
          </div>
          <p className="text-[11px] text-[#f8f4e3]/75">
            You are logged in as an Administrator.
          </p>
        </CardHeader>

        <CardContent className="p-6 space-y-3">
          <Link href="/admin/events" className="block w-full">
            <Button variant="primary" size="lg" className="w-full shadow-md">
              <span>Manage Events in Admin Console</span>
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // 4. Registration Form for Logged-In Members
  return (
    <Card className="border-[#e0a861]/40 shadow-lg bg-[#fefcf1]">
      <form action={formAction}>
        <input type="hidden" name="eventId" value={event.id} />
        <input type="hidden" name="paymentOption" value={isFree ? 'FREE' : paymentOption} />

        <CardHeader className="bg-[#2c3324] text-[#fefcf1] p-6 space-y-2 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#e0a861] uppercase tracking-wider">
              Registration Fee
            </span>
            <Badge variant="gold" size="sm">
              {event.status}
            </Badge>
          </div>
          <div className="font-serif font-bold text-2xl sm:text-3xl text-white">
            {isFree ? 'Free Fellowship' : formatPHP(feeNum)}
          </div>
          <p className="text-[11px] text-[#f8f4e3]/75">
            Registering as <strong className="text-white">{user.firstName} {user.lastName}</strong> ({user.ecclesia || 'PCYC Youth'})
          </p>
        </CardHeader>

        <CardContent className="p-6 space-y-5">
          {state?.error && (
            <div className="p-3.5 rounded-xl bg-[#fdf2f2] border border-[#f5c6cb] text-[#c0392b] text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          {!isFree && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-[#2c3324] uppercase tracking-wider block">
                Choose Payment Method <span className="text-[#c0392b]">*</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentOption('GCASH')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentOption === 'GCASH'
                      ? 'border-[#2c3324] bg-[#2c3324]/5 ring-1 ring-[#2c3324]'
                      : 'border-[#e6dfcb] bg-[#f8f4e3]/50 hover:bg-[#f8f4e3]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[#2c3324]">
                    <QrCode className="h-4 w-4 text-[#e0a861]" />
                    <span>Pay via GCash</span>
                  </div>
                  <p className="text-[11px] text-[#707666] mt-0.5">
                    Fast-track confirmation by uploading screenshot receipt.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentOption('VENUE_DESK')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentOption === 'VENUE_DESK'
                      ? 'border-[#2c3324] bg-[#2c3324]/5 ring-1 ring-[#2c3324]'
                      : 'border-[#e6dfcb] bg-[#f8f4e3]/50 hover:bg-[#f8f4e3]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[#2c3324]">
                    <Building2 className="h-4 w-4 text-[#e0a861]" />
                    <span>Pay at Venue Desk</span>
                  </div>
                  <p className="text-[11px] text-[#707666] mt-0.5">
                    Settle registration fee upon arrival on Day 1.
                  </p>
                </button>
              </div>

              {/* GCash Details & Upload Box */}
              {paymentOption === 'GCASH' && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#f8f4e3] to-[#fefcf1] border-2 border-[#e0a861] space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs font-bold text-[#2c3324]">
                    <div className="flex items-center gap-1.5">
                      <QrCode className="h-4 w-4 text-[#9a6423]" />
                      <span>PCYC Official GCash</span>
                    </div>
                    <span className="font-mono text-sm text-[#9a6423]">0912-734-1648 (Yuri S.)</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-[#e6dfcb] text-[11px] text-[#707666]">
                    Please send exact registration fee <strong>{formatPHP(feeNum)}</strong> and provide reference details below.
                  </div>

                  <Input
                    label="GCash Reference Number"
                    name="referenceNumber"
                    placeholder="e.g. 1004 8920 1827"
                    required
                  />

                  <ImageUpload
                    label="GCash Receipt Screenshot"
                    name="receiptImage"
                    helperText="Upload your GCash payment confirmation screenshot (PNG/JPG)."
                  />
                </div>
              )}
            </div>
          )}

          <Textarea
            label="Dietary / Health / Special Notes (Optional)"
            name="specialRequirements"
            placeholder="e.g. Vegetarian diet, arriving by bus around 3 PM..."
            rows={2}
          />
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full shadow-md gap-2"
            isLoading={isPending}
          >
            <span>{isFree ? 'Confirm Free Registration' : 'Complete Event Registration'}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
