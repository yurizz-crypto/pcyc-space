'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { profiles } from '@/lib/db/schema/users';
import { eq } from 'drizzle-orm';
import { updateProfileSchema, changePasswordSchema } from '@/lib/validators';
import { logger } from '@/lib/logger';
import { revalidatePath } from 'next/cache';

export interface ProfileActionState {
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function updateProfileAction(
  prevState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: 'You must be signed in to update your profile.',
    };
  }

  const rawData = {
    firstName: formData.get('firstName') as string,
    middleName: (formData.get('middleName') as string) || undefined,
    lastName: formData.get('lastName') as string,
    designation: formData.get('designation') as 'BROTHER' | 'SISTER' | 'FRIEND',
    ecclesia: (formData.get('ecclesia') as string) || undefined,
    baptismDate: (formData.get('baptismDate') as string) || undefined,
    phoneNumber: (formData.get('phoneNumber') as string) || undefined,
  };

  const parsed = updateProfileSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Please check your input details.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await db
      .update(profiles)
      .set({
        firstName: parsed.data.firstName,
        middleName: parsed.data.middleName || null,
        lastName: parsed.data.lastName,
        designation: parsed.data.designation,
        ecclesia: parsed.data.ecclesia || null,
        baptismDate: parsed.data.baptismDate || null,
        phoneNumber: parsed.data.phoneNumber || null,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, user.id));

    // Also update Supabase auth user_metadata
    await supabase.auth.updateUser({
      data: {
        first_name: parsed.data.firstName,
        last_name: parsed.data.lastName,
        designation: parsed.data.designation,
        ecclesia: parsed.data.ecclesia,
      },
    });

    logger.info({ userId: user.id }, 'User profile updated successfully');

    revalidatePath('/settings');
    revalidatePath('/portal');
    revalidatePath('/admin');
    revalidatePath('/', 'layout');

    return {
      success: true,
      message: 'Your profile has been updated successfully.',
    };
  } catch (error: any) {
    logger.error({ error: error?.message, userId: user.id }, 'Failed to update profile');
    return {
      success: false,
      error: 'Failed to save changes to the database. Please try again.',
    };
  }
}

export async function changePasswordAction(
  prevState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user || !user.email) {
    return {
      success: false,
      error: 'You must be signed in to change your password.',
    };
  }

  const rawData = {
    currentPassword: formData.get('currentPassword') as string,
    newPassword: formData.get('newPassword') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  };

  const parsed = changePasswordSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Please ensure all password requirements are met.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  // 1. Verify current password by attempting a signIn
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: parsed.data.currentPassword,
  });

  if (verifyError) {
    logger.warn({ userId: user.id }, 'Change password failed: current password incorrect');
    return {
      success: false,
      error: 'Current password is incorrect. Please verify and try again.',
      fieldErrors: {
        currentPassword: ['Current password is incorrect.'],
      },
    };
  }

  // 2. Update to new password
  const { error: updateError } = await supabase.auth.updateUser({
    password: parsed.data.newPassword,
  });

  if (updateError) {
    logger.error({ error: updateError.message, userId: user.id }, 'Failed to update password');
    return {
      success: false,
      error: updateError.message || 'Failed to update password. Please try again.',
    };
  }

  logger.info({ userId: user.id }, 'User password changed successfully');

  return {
    success: true,
    message: 'Your password has been changed successfully.',
  };
}
