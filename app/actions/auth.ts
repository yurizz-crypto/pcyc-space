'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { profiles } from '@/lib/db/schema/users';
import { eq } from 'drizzle-orm';
import { loginSchema, registerSchema, resetPasswordSchema } from '@/lib/validators';
import { logger } from '@/lib/logger';
import { dispatchNotification } from '@/lib/notifications/dispatcher';
import { renderWelcomeEmail } from '@/lib/email/templates/welcome';

export interface ActionState {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  message?: string;
}

export async function loginAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = formData.get('email');
  const password = formData.get('password');

  const parsed = loginSchema.safeParse({ email, password });
  if (!parsed.success) {
    return {
      success: false,
      error: 'Invalid email or password format.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createServerSupabaseClient();
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    logger.warn({ email: parsed.data.email, error: error.message }, 'Failed login attempt');
    return {
      success: false,
      error: error.message,
    };
  }

  // Resolve role from DB for clean routing
  let destination = '/portal';
  if (authData?.user) {
    try {
      const userProfile = await db
        .select({ role: profiles.role })
        .from(profiles)
        .where(eq(profiles.id, authData.user.id))
        .limit(1);

      if (userProfile[0]?.role === 'ADMIN' || userProfile[0]?.role === 'SUPERADMIN') {
        destination = '/admin';
      }
    } catch (e) {
      logger.error({ error: e }, 'Error checking role during login routing');
    }
  }

  revalidatePath('/', 'layout');
  redirect(destination);
}

export async function registerAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
    firstName: formData.get('firstName'),
    middleName: formData.get('middleName') || undefined,
    lastName: formData.get('lastName'),
    designation: formData.get('designation'),
    baptismDate: formData.get('baptismDate') || undefined,
    ecclesia: formData.get('ecclesia'),
    phoneNumber: formData.get('phoneNumber') || undefined,
  };

  const parsed = registerSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Please check the form for errors.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createServerSupabaseClient();
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        first_name: parsed.data.firstName,
        last_name: parsed.data.lastName,
        designation: parsed.data.designation,
        ecclesia: parsed.data.ecclesia,
      },
    },
  });

  if (authError) {
    logger.error({ error: authError.message }, 'Supabase auth signup error');
    return {
      success: false,
      error: authError.message,
    };
  }

  if (authData.user) {
    try {
      await db.insert(profiles).values({
        id: authData.user.id,
        email: parsed.data.email,
        firstName: parsed.data.firstName,
        middleName: parsed.data.middleName || null,
        lastName: parsed.data.lastName,
        designation: parsed.data.designation,
        baptismDate: parsed.data.baptismDate || null,
        ecclesia: parsed.data.ecclesia || null,
        phoneNumber: parsed.data.phoneNumber || null,
        role: 'MEMBER',
      });
      logger.info({ userId: authData.user.id }, 'Profile record created successfully');

      // Dispatch Welcome In-App Notification & Welcome Email
      const fullName = `${parsed.data.firstName} ${parsed.data.lastName}`;
      await dispatchNotification({
        userId: authData.user.id,
        type: 'ACCOUNT',
        title: 'Welcome to PCYC Space! 🎉',
        message: 'Your account is ready. Explore upcoming gatherings, camps, and merchandise.',
        linkUrl: '/portal',
        email: {
          to: parsed.data.email,
          subject: 'Welcome to PCYC Space!',
          html: renderWelcomeEmail({
            name: fullName,
            designation: parsed.data.designation,
            ecclesia: parsed.data.ecclesia,
            email: parsed.data.email,
          }),
        },
      });
    } catch (dbErr) {
      logger.error({ error: dbErr }, 'Failed to insert profile record after auth signup');
    }
  }

  return {
    success: true,
    message: 'Registration successful! Please check your email to confirm your account.',
  };
}

export async function resetPasswordAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = formData.get('email');
  const parsed = resetPasswordSchema.safeParse({ email });

  if (!parsed.success) {
    return {
      success: false,
      error: 'Please provide a valid email address.',
    };
  }

  const supabase = await createServerSupabaseClient();
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.NODE_ENV === 'production'
      ? 'https://pcyc-space.vercel.app'
      : 'http://localhost:3000');

  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${appUrl}/reset-password`,
  });

  if (error) {
    logger.warn({ error: error.message }, 'Password reset request failed');
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
    message: 'Password reset link has been dispatched to your email address.',
  };
}

export async function signOutAction(): Promise<void> {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}
