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
import { LogIn, AlertCircle } from 'lucide-react';

const initialState: ActionState = {
  success: false,
};

function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || searchParams.get('redirect') || '';

  return (
    <Card className="border-[#e6dfcb] shadow-lg">
      <form action={formAction}>
        {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}

        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-xl">Sign In</CardTitle>
          <CardDescription>Enter your credentials to access your account.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {state?.error && (
            <div className="p-3.5 rounded-xl bg-[#fdf2f2] border border-[#f5c6cb] text-[#c0392b] text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
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
                className="text-xs text-[#9a6423] hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full gap-2 shadow-sm"
            isLoading={isPending}
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In to PCYC Space</span>
          </Button>

          <div className="text-center text-xs text-[#707666] pt-2">
            Don&apos;t have an account yet?{' '}
            <Link
              href="/register"
              className="text-[#9a6423] font-semibold hover:underline"
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
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#fefcf1]">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center justify-center">
            <div className="h-14 w-14 rounded-2xl bg-[#2c3324] p-2 flex items-center justify-center shadow-md">
              <Image
                src="/images/logo/pcyc-transparent-logo.png"
                alt="PCYC Logo"
                width={44}
                height={44}
                className="object-contain"
              />
            </div>
          </Link>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2c3324]">
            Welcome to PCYC Space
          </h1>
          <p className="text-xs sm:text-sm text-[#707666]">
            Sign in to manage event registrations, orders, and ecclesia profile.
          </p>
        </div>

        <Suspense fallback={<div className="h-64 rounded-3xl bg-white animate-pulse" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
