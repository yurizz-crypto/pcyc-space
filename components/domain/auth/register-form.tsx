'use client';

import React, { useState, useActionState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { registerAction, ActionState } from '@/app/actions/auth';
import { type Ecclesia } from '@/lib/db/schema/ecclesias';
import { User, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';

const initialState: ActionState = {
  success: false,
};

interface RegisterFormProps {
  ecclesias: Ecclesia[];
}

export function RegisterForm({ ecclesias }: RegisterFormProps) {
  const [state, formAction, isPending] = useActionState(registerAction, initialState);
  const [designation, setDesignation] = useState<'BROTHER' | 'SISTER' | 'FRIEND'>('BROTHER');

  const isBaptized = designation === 'BROTHER' || designation === 'SISTER';

  return (
    <Card className="border-[#e6dfcb] shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl">Personal & Ecclesial Details</CardTitle>
        <CardDescription>
          Please provide accurate information for verification with your local ecclesia.
        </CardDescription>
      </CardHeader>

      <form action={formAction}>
        <CardContent className="space-y-4">
          {/* Status Notifications */}
          {state?.error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{state.error}</span>
            </div>
          )}

          {state?.success && (
            <div className="p-3.5 rounded-xl bg-green-50 border border-green-200 text-xs text-green-700 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{state.message}</span>
            </div>
          )}

          {/* 1. Name Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              placeholder="e.g. Samuel"
              required
              error={state?.fieldErrors?.firstName?.[0]}
            />
            <Input
              label="Last Name"
              name="lastName"
              placeholder="e.g. Santos"
              required
              error={state?.fieldErrors?.lastName?.[0]}
            />
          </div>

          <Input
            label="Middle Name (Optional)"
            name="middleName"
            placeholder="e.g. Cruz"
            error={state?.fieldErrors?.middleName?.[0]}
          />

          {/* 2. Designation Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#2c3324]">
              Designation / Fellowship Status <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['BROTHER', 'SISTER', 'FRIEND'] as const).map((des) => (
                <label
                  key={des}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center cursor-pointer transition-all ${
                    designation === des
                      ? 'border-[#e0a861] bg-[#e0a861]/15 text-[#2c3324] font-bold shadow-xs'
                      : 'border-[#e6dfcb] bg-white text-[#505748] hover:bg-[#f8f4e3]'
                  }`}
                >
                  <input
                    type="radio"
                    name="designation"
                    value={des}
                    checked={designation === des}
                    onChange={() => setDesignation(des)}
                    className="sr-only"
                  />
                  <span className="text-xs capitalize">{des.toLowerCase()}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 3. Conditional Baptism Date */}
          {isBaptized && (
            <div className="p-4 rounded-xl bg-[#f8f4e3] border border-[#e6dfcb] space-y-2 animate-fadeIn">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2c3324]">
                <Calendar className="h-4 w-4 text-[#e0a861]" />
                <span>Baptism Date</span>
              </div>
              <Input
                name="baptismDate"
                type="date"
                required={isBaptized}
                error={state?.fieldErrors?.baptismDate?.[0]}
                helperText="Required for baptized brothers & sisters."
              />
            </div>
          )}

          {/* 4. Live Ecclesia Selection from Database */}
          <Select
            label="Home Ecclesia"
            name="ecclesia"
            required
            error={state?.fieldErrors?.ecclesia?.[0]}
            options={[
              ...ecclesias.map((e) => ({
                value: e.name,
                label: `${e.name} (${e.region})`,
              })),
              {
                value: 'Other Ecclesia / International',
                label: 'Other Ecclesia / International',
              },
              {
                value: 'Not Affiliated / Friend',
                label: 'Not Affiliated / Friend of PCYC',
              },
            ]}
          />

          {/* 5. Contact & Password */}
          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="john@example.com"
            required
            error={state?.fieldErrors?.email?.[0]}
          />

          <Input
            label="Contact Number (Optional)"
            name="phoneNumber"
            type="tel"
            placeholder="09123456789"
            error={state?.fieldErrors?.phoneNumber?.[0]}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PasswordInput
              label="Password"
              name="password"
              placeholder="••••••••"
              required
              error={state?.fieldErrors?.password?.[0]}
            />
            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              placeholder="••••••••"
              required
              error={state?.fieldErrors?.confirmPassword?.[0]}
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full shadow-md"
            disabled={isPending}
          >
            {isPending ? 'Registering Member Space...' : 'Complete Registration'}
          </Button>

          <p className="text-center text-xs text-[#707666]">
            Already registered?{' '}
            <Link
              href="/login"
              className="font-bold text-[#e0a861] hover:underline"
            >
              Sign in to Member Portal
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
