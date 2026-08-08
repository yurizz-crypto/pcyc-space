'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { KeyRound, CheckCircle2, AlertCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Validate that user has a valid recovery session
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/reset-password');
      }
    };
    checkSession();
  }, [supabase, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message);
      } else {
        setSuccess(true);
        // Redirect to portal after a short delay
        setTimeout(() => {
          router.push('/portal');
        }, 3000);
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
            Set New Password
          </h1>
          <p className="text-xs sm:text-sm text-[#707666] dark:text-[#a3ab98]">
            Choose a strong new password for your PCYC Space account.
          </p>
        </div>

        {success ? (
          <Card className="border-[#e6dfcb] dark:border-[#323d2b] shadow-lg p-8 text-center space-y-4">
            <div className="h-14 w-14 rounded-full bg-[#e8f5e9] dark:bg-[#152015] text-[#2e7d32] dark:text-[#66bb6a] mx-auto flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="font-serif text-xl font-bold text-[#2c3324] dark:text-[#fefcf1]">
              Password Updated Successfully!
            </h2>
            <p className="text-xs sm:text-sm text-[#505748] dark:text-[#a3ab98] leading-relaxed">
              Your password has been changed. You will be redirected to your portal shortly.
            </p>
            <div className="pt-2">
              <Link href="/portal">
                <Button variant="outline" size="md" className="w-full">
                  <span>Go to Portal Now</span>
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <Card className="border-[#e6dfcb] dark:border-[#323d2b] shadow-lg">
            <form onSubmit={handleSubmit}>
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#e0a861]" />
                  Create New Password
                </CardTitle>
                <CardDescription>
                  Your new password must be at least 8 characters long.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3.5 rounded-xl bg-[#fdf2f2] dark:bg-[#2d1815] border border-[#f5c6cb] dark:border-[#4d201b] text-[#c0392b] dark:text-[#ef5350] text-xs flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="relative">
                  <Input
                    label="New Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[34px] text-[#707666] hover:text-[#2c3324] dark:hover:text-[#fefcf1] transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                <Input
                  label="Confirm New Password"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </CardContent>

              <CardFooter className="flex flex-col gap-3 pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full gap-2 shadow-sm"
                  isLoading={isLoading}
                >
                  <KeyRound className="h-4 w-4" />
                  <span>Update Password</span>
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
