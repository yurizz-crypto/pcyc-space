'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Supabase Auth Callback Handler
 *
 * Handles email confirmation, password reset, and magic link flows.
 * Supabase sends users here with a `code` query parameter after they
 * click an auth link in their email. This route exchanges the code
 * for a session and redirects the user to the appropriate page.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/portal';
  const type = searchParams.get('type'); // 'recovery', 'signup', 'magiclink', 'email_change'

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // For password recovery, redirect to the update-password page
      if (type === 'recovery') {
        const redirectUrl = new URL('/reset-password/update', origin);
        return NextResponse.redirect(redirectUrl);
      }

      // For all other flows (signup confirmation, magic link, email change)
      const redirectUrl = new URL(next, origin);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // If code exchange fails or no code provided, redirect to error-aware login
  const redirectUrl = new URL('/login', origin);
  redirectUrl.searchParams.set('error', 'auth_callback_failed');
  return NextResponse.redirect(redirectUrl);
}
