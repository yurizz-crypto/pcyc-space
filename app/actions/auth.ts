'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { profiles } from '@/lib/db/schema/users';
import { registerSchema, loginSchema, resetPasswordSchema } from '@/lib/validators';
import { logger } from '@/lib/logger';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export interface ActionState {
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function loginAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const parsed = loginSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Invalid email or password format.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    logger.warn({ error: error.message, email: parsed.data.email }, 'User login failed');
    return {
      success: false,
      error: error.message,
    };
  }

  logger.info({ userId: data.user.id }, 'User logged in successfully');
  revalidatePath('/', 'layout');
  redirect('/portal');
}

export async function registerAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
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
    } catch (dbErr) {
      logger.error({ error: dbErr }, 'Failed to insert profile record after auth signup');
      // If DB insert fails (e.g. dev offline database), user auth still exists
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
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email);

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

