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
import {
  CheckCircle,
  WarningCircle,
  Calendar,
  CircleNotch,
  UserPlus,
} from '@phosphor-icons/react/dist/ssr';
import { motion, AnimatePresence } from 'motion/react';

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
    <Card className="border-[#e6dfcb] dark:border-[#323d2b] shadow-xl rounded-3xl bg-white dark:bg-[#1b2117]">
      <CardHeader className="space-y-1.5 pb-4">
        <CardTitle className="font-serif text-2xl text-[#2c3324] dark:text-[#fefcf1]">
          Personal & Ecclesial Details
        </CardTitle>
        <CardDescription className="text-xs text-[#707666] dark:text-[#a3ab98]">
          Please provide accurate information for verification with your local ecclesia.
        </CardDescription>
      </CardHeader>

      <form action={formAction}>
        <CardContent className="space-y-5">
          {/* Status Notifications */}
          {state?.error && (
            <div className="p-3.5 rounded-2xl bg-[#fdf2f2] dark:bg-[#2d1815] border border-[#f5c6cb] dark:border-[#4d201b] text-[#c0392b] dark:text-[#ef5350] text-xs flex items-center gap-2.5 shadow-xs">
              <WarningCircle weight="fill" className="h-4 w-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          {state?.success && (
            <div className="p-3.5 rounded-2xl bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 text-xs flex items-center gap-2.5 shadow-xs">
              <CheckCircle weight="fill" className="h-4 w-4 shrink-0" />
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

          {/* 2. Designation Selection with animated sliding tab */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#2c3324] dark:text-[#fefcf1] uppercase tracking-wider block">
              Designation / Fellowship Status <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#f8f4e3] dark:bg-[#131710] rounded-2xl border border-[#e6dfcb] dark:border-[#323d2b]">
              {(['BROTHER', 'SISTER', 'FRIEND'] as const).map((des) => (
                <label
                  key={des}
                  className={`relative flex items-center justify-center py-2.5 px-3 rounded-xl text-center cursor-pointer transition-colors text-xs font-semibold z-10 ${
                    designation === des
                      ? 'text-[#fefcf1] dark:text-[#131710]'
                      : 'text-[#505748] dark:text-[#a3ab98] hover:text-[#2c3324] dark:hover:text-[#fefcf1]'
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
                  {designation === des && (
                    <motion.div
                      layoutId="registerDesignationTab"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      className="absolute inset-0 bg-[#2c3324] dark:bg-[#e0a861] rounded-xl z-[-1] shadow-xs"
                    />
                  )}
                  <span className="capitalize">{des.toLowerCase()}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 3. Conditional Baptism Date with smooth entrance */}
          <AnimatePresence>
            {isBaptized && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 rounded-2xl bg-[#f8f4e3] dark:bg-[#131710] border border-[#e6dfcb] dark:border-[#323d2b] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#2c3324] dark:text-[#fefcf1]">
                    <Calendar weight="duotone" className="h-4 w-4 text-[#e0a861]" />
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
              </motion.div>
            )}
          </AnimatePresence>

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
            className="w-full rounded-2xl shadow-md bg-[#2c3324] text-[#fefcf1] hover:bg-[#3d4632] dark:bg-[#e0a861] dark:text-[#131710] dark:hover:bg-[#ca914a]"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <CircleNotch weight="bold" className="h-4 w-4 animate-spin mr-2" />
                <span>Registering Member Space...</span>
              </>
            ) : (
              <>
                <UserPlus weight="bold" className="h-4 w-4 mr-2" />
                <span>Complete Registration</span>
              </>
            )}
          </Button>

          <p className="text-center text-xs text-[#707666] dark:text-[#a3ab98]">
            Already registered?{' '}
            <Link
              href="/login"
              className="font-bold text-[#e0a861] hover:underline"
            >
              Sign in to your account
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
