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

/**
 * State object returned by authentication server actions.
 */
export interface ActionState {
  /** Indicates if the operation was successful. */
  success?: boolean;
  /** A general error message if the operation failed. */
  error?: string;
  /** Field-specific validation errors. */
  fieldErrors?: Record<string, string[]>;
  /** A success message or general information. */
  message?: string;
}

/**
 * Authenticates a user using Supabase email and password credentials.
 * Upon successful authentication, it verifies the user's role from the PostgreSQL
 * database and redirects them to the appropriate portal (Admin or Member).
 * 
 * @param {ActionState} prevState - The previous state of the action.
 * @param {FormData} formData - The submitted form data containing `email` and `password`.
 * @returns {Promise<ActionState>} A promise resolving to an `ActionState` object if validation or network errors occur. Otherwise, redirects the user.
 * 
 * @throws Will redirect to `/admin` or `/portal` on success.
 */
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

  let authData, error;
  try {
    const supabase = await createServerSupabaseClient();
    const result = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });
    authData = result.data;
    error = result.error;
  } catch (err: any) {
    logger.error({ email: parsed.data.email, error: err?.message || err }, 'Network error during login');
    return {
      success: false,
      error: 'Unable to connect to authentication service. Please try again.',
    };
  }

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

/**
 * Registers a new PCYC Member account.
 * 
 * This action performs a two-step registration:
 * 1. Creates an identity in Supabase Auth to handle secure credential management.
 * 2. Mirrors the identity into the internal `profiles` table to maintain rich domain data 
 *    (e.g., designation, baptism date, ecclesia).
 * 
 * After successful creation, it dispatches an asynchronous welcome email and an in-app notification.
 * 
 * @param {ActionState} prevState - The previous state of the action.
 * @param {FormData} formData - The submitted form data containing user profile details and credentials.
 * @returns {Promise<ActionState>} A promise resolving to an `ActionState` object indicating success or failure.
 */
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

  let authData, authError;
  try {
    const supabase = await createServerSupabaseClient();
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'https://pcyc-space.vercel.app'
        : 'http://localhost:3000');

    const result = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${appUrl}/api/auth/callback?type=signup`,
        data: {
          first_name: parsed.data.firstName,
          last_name: parsed.data.lastName,
          designation: parsed.data.designation,
          ecclesia: parsed.data.ecclesia,
        },
      },
    });
    authData = result.data;
    authError = result.error;
  } catch (err: any) {
    logger.error({ email: parsed.data.email, error: err?.message || err }, 'Network error during signup');
    return {
      success: false,
      error: 'Unable to connect to authentication service. Please try again.',
    };
  }

  if (authError) {
    logger.warn({ email: parsed.data.email, error: authError.message }, 'Supabase auth signup error');
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

/**
 * Initiates the password recovery flow via Supabase Auth.
 * Dispatches a secure recovery link to the provided email address, which redirects 
 * the user back to the application to enter a new password.
 * 
 * @param {ActionState} prevState - The previous state of the action.
 * @param {FormData} formData - The submitted form data containing the `email` address.
 * @returns {Promise<ActionState>} A promise resolving to an `ActionState` object indicating success or failure.
 */
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

  let error;
  try {
    const supabase = await createServerSupabaseClient();
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'https://pcyc-space.vercel.app'
        : 'http://localhost:3000');

    const result = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
      redirectTo: `${appUrl}/api/auth/callback?type=recovery`,
    });
    error = result.error;
  } catch (err: any) {
    logger.error({ email: parsed.data.email, error: err?.message || err }, 'Network error during password reset');
    return {
      success: false,
      error: 'Unable to connect to authentication service. Please try again.',
    };
  }

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

/**
 * Terminates the current user's active session.
 * Safely handles network failures by ensuring local session state is cleared regardless,
 * followed by a strict cache revalidation to prevent stale data exposure.
 * 
 * @returns {Promise<void>} A promise that resolves when the user has been signed out and redirected to `/login`.
 * 
 * @throws Will redirect to `/login` unconditionally.
 */
export async function signOutAction(): Promise<void> {
  try {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
  } catch (err: any) {
    logger.error({ error: err?.message || err }, 'Network error during sign out');
    // Continue with clearing local state even if server fails
  }
  revalidatePath('/', 'layout');
  redirect('/login');
}
