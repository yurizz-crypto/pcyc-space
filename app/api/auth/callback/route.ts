import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { type EmailOtpType } from '@supabase/supabase-js';

/**
 * Supabase Auth Callback Handler
 *
 * Handles email confirmation, password reset, and magic link flows.
 * Supports both PKCE code exchange (standard) and token_hash verifyOtp (email templates).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') || (type === 'recovery' ? '/reset-password/update' : '/portal');

  // 1. Handle PKCE code exchange (OAuth, signup, recovery with code)
  if (code) {
    try {
      const supabase = await createServerSupabaseClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        const destination = type === 'recovery' ? '/reset-password/update' : next;
        return NextResponse.redirect(new URL(destination, origin));
      }
      logger.warn({ error: error.message }, 'Code exchange failed');
    } catch (err: any) {
      logger.error({ error: err?.message || err }, 'Network error during code exchange');
      const redirectUrl = new URL('/login', origin);
      redirectUrl.searchParams.set('error', 'auth_network_failure');
      return NextResponse.redirect(redirectUrl);
    }
  }

  // 2. Handle direct token_hash verification (via verifyOtp)
  if (token_hash && type) {
    try {
      const supabase = await createServerSupabaseClient();
      const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      });

      if (!error) {
        const destination = type === 'recovery' ? '/reset-password/update' : next;
        return NextResponse.redirect(new URL(destination, origin));
      }
      logger.warn({ error: error.message, type }, 'verifyOtp failed');
    } catch (err: any) {
      logger.error({ error: err?.message || err }, 'Network error during verifyOtp');
      const redirectUrl = new URL('/login', origin);
      redirectUrl.searchParams.set('error', 'auth_network_failure');
      return NextResponse.redirect(redirectUrl);
    }
  }

  // If code exchange fails or no code/token_hash provided, redirect to error-aware login
  const redirectUrl = new URL('/login', origin);
  redirectUrl.searchParams.set('error', 'auth_callback_failed');
  if (type) {
    redirectUrl.searchParams.set('type', type);
  }
  return NextResponse.redirect(redirectUrl);
}
