'use client';

import React, { useActionState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { loginAction, ActionState } from '@/app/actions/auth';
import { SignIn, WarningCircle, CircleNotch } from '@phosphor-icons/react/dist/ssr';
import { motion } from 'motion/react';

const initialState: ActionState = {
  success: false,
};

function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || searchParams.get('redirect') || '';

  return (
    <Card className="border-[#e6dfcb] dark:border-[#323d2b] shadow-xl rounded-3xl bg-white dark:bg-[#1b2117]">
      <form action={formAction}>
        {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}

        <CardHeader className="space-y-1.5 pb-4">
          <CardTitle className="font-serif text-2xl text-[#2c3324] dark:text-[#fefcf1]">
            Sign In
          </CardTitle>
          <CardDescription className="text-xs text-[#707666] dark:text-[#a3ab98]">
            Enter your credentials to access your PCYC account.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {state?.error && (
            <div className="p-3.5 rounded-2xl bg-[#fdf2f2] dark:bg-[#2d1815] border border-[#f5c6cb] dark:border-[#4d201b] text-[#c0392b] dark:text-[#ef5350] text-xs flex items-center gap-2.5 shadow-xs">
              <WarningCircle weight="fill" className="h-4 w-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="you@ecclesia.ph"
            required
            autoComplete="email"
            error={state?.fieldErrors?.email?.[0]}
          />

          <div className="space-y-1">
            <PasswordInput
              label="Password"
              name="password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
              error={state?.fieldErrors?.password?.[0]}
            />
            <div className="flex justify-end pt-1">
              <Link
                href="/reset-password"
                className="text-xs text-[#9a6423] dark:text-[#f0be7c] hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full gap-2 rounded-2xl shadow-md bg-[#2c3324] text-[#fefcf1] hover:bg-[#3d4632] dark:bg-[#e0a861] dark:text-[#131710] dark:hover:bg-[#ca914a]"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <CircleNotch weight="bold" className="h-4 w-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <SignIn weight="bold" className="h-4 w-4" />
                <span>Sign In to PCYC Space</span>
              </>
            )}
          </Button>

          <div className="text-center text-xs text-[#707666] dark:text-[#a3ab98] pt-1">
            Don&apos;t have an account yet?{' '}
            <Link
              href="/register"
              className="text-[#9a6423] dark:text-[#f0be7c] font-bold hover:underline"
            >
              Join PCYC here
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-[#fefcf1] dark:bg-[#131710]">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md space-y-6"
      >
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center justify-center">
            <div className="h-16 w-16 rounded-2xl bg-[#2c3324] p-2 flex items-center justify-center shadow-lg border border-[#3d4632]">
              <Image
                src="/images/logo/pcyc-transparent-logo.png"
                alt="PCYC Logo"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
          </Link>
          <div className="space-y-1">
            <h1 className="font-serif text-3xl font-bold text-[#2c3324] dark:text-[#fefcf1]">
              Welcome to PCYC Space
            </h1>
            <p className="text-xs sm:text-sm text-[#707666] dark:text-[#a3ab98]">
              Sign in to manage event registrations, orders, and ecclesia profile.
            </p>
          </div>
        </div>

        <Suspense fallback={<div className="h-64 rounded-3xl bg-white dark:bg-[#1b2117] animate-pulse" />}>
          <LoginForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
