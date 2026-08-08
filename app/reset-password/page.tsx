'use client';

import React, { useActionState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { resetPasswordAction, ActionState } from '@/app/actions/auth';
import { KeyRound, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

const initialState: ActionState = {
  success: false,
};

export default function ResetPasswordPage() {
  const [state, formAction, isPending] = useActionState(resetPasswordAction, initialState);

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#fefcf1] dark:bg-[#131710]">
      <div className="w-full max-w-md space-y-6">
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
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2c3324] dark:text-[#fefcf1]">
            Reset Password
          </h1>
          <p className="text-xs sm:text-sm text-[#707666] dark:text-[#a3ab98]">
            Enter your registered email address to receive a password recovery link.
          </p>
        </div>

        {state?.success ? (
          <Card className="border-[#e6dfcb] dark:border-[#323d2b] shadow-lg p-8 text-center space-y-4">
            <div className="h-14 w-14 rounded-full bg-[#e8f5e9] dark:bg-[#152015] text-[#2e7d32] dark:text-[#66bb6a] mx-auto flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="font-serif text-xl font-bold text-[#2c3324] dark:text-[#fefcf1]">
              Recovery Email Dispatched
            </h2>
            <p className="text-xs sm:text-sm text-[#505748] dark:text-[#a3ab98] leading-relaxed">
              {state.message}
            </p>
            <div className="pt-2">
              <Link href="/login">
                <Button variant="outline" size="md" className="w-full">
                  <span>Return to Login</span>
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <Card className="border-[#e6dfcb] dark:border-[#323d2b] shadow-lg">
            <form action={formAction}>
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-xl">Request Reset Link</CardTitle>
                <CardDescription>
                  We will send password reset instructions to your inbox.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {state?.error && (
                  <div className="p-3.5 rounded-xl bg-[#fdf2f2] dark:bg-[#2d1815] border border-[#f5c6cb] dark:border-[#4d201b] text-[#c0392b] dark:text-[#ef5350] text-xs flex items-center gap-2">
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
                />
              </CardContent>

              <CardFooter className="flex flex-col gap-3 pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full gap-2 shadow-sm"
                  isLoading={isPending}
                >
                  <KeyRound className="h-4 w-4" />
                  <span>Send Recovery Email</span>
                </Button>

                <div className="text-center pt-2">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-xs text-[#505748] dark:text-[#a3ab98] hover:text-[#2c3324] dark:hover:text-[#fefcf1] font-medium"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Login</span>
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
