'use server';

import { db } from '@/lib/db';
import { events } from '@/lib/db/schema/events';
import { getCurrentUserProfile } from '@/lib/db/queries/users';
import { eventSchema } from '@/lib/validators';
import { logger } from '@/lib/logger';
import { saveUploadedImage } from '@/lib/storage';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';

export interface AdminEventActionState {
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

/**
 * Server Action for Admins to create a new live Event in PostgreSQL.
 */
export async function createEventAction(
  prevState: AdminEventActionState,
  formData: FormData
): Promise<AdminEventActionState> {
  const profile = await getCurrentUserProfile();
  if (!profile || (profile.role !== 'ADMIN' && profile.role !== 'SUPERADMIN')) {
    return {
      success: false,
      error: 'Unauthorized: You must have an Admin account to publish events.',
    };
  }

  // Handle Image File from Device Upload
  let bannerUrl = '/images/logo/pcyc-transparent-logo.png';
  const imageFile = formData.get('imageFile') as File | null;

  if (imageFile && imageFile.size > 0) {
    const slugPrefix = (formData.get('slug') as string) || 'event';
    const uploadResult = await saveUploadedImage(imageFile, 'events', slugPrefix);

    if (!uploadResult.success) {
      return {
        success: false,
        error: uploadResult.error || 'Failed to upload event banner image.',
      };
    }

    bannerUrl = uploadResult.url!;
  }

  const rawData = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    theme: formData.get('theme') || undefined,
    description: formData.get('description'),
    bannerUrl: bannerUrl,
    registrationFee: formData.get('registrationFee') ? Number(formData.get('registrationFee')) : 0,
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate'),
    location: formData.get('location'),
    maxAttendees: formData.get('maxAttendees') ? Number(formData.get('maxAttendees')) : undefined,
    registrationDeadline: formData.get('registrationDeadline') || undefined,
    isPublished: formData.get('isPublished') === 'on' || formData.get('isPublished') === 'true',
    status: (formData.get('status') as string) || 'UPCOMING',
  };

  const parsed = eventSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Please correct the highlighted errors in the form.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await db.insert(events).values({
      title: parsed.data.title,
      slug: parsed.data.slug,
      theme: parsed.data.theme || null,
      description: parsed.data.description,
      bannerUrl: parsed.data.bannerUrl || bannerUrl,
      startDate: new Date(parsed.data.startDate),
      endDate: new Date(parsed.data.endDate),
      location: parsed.data.location,
      registrationFee: parsed.data.registrationFee.toFixed(2),
      maxAttendees: parsed.data.maxAttendees || null,
      registrationDeadline: parsed.data.registrationDeadline ? new Date(parsed.data.registrationDeadline) : null,
      isPublished: parsed.data.isPublished ?? true,
      status: (parsed.data.status as 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED') || 'UPCOMING',
    });

    logger.info({ slug: parsed.data.slug, adminId: profile.id }, 'New event created by admin');
  } catch (error: any) {
    logger.error({ error: error?.message }, 'Failed to insert event into database');
    return {
      success: false,
      error: error?.message?.includes('duplicate key')
        ? 'An event with this URL slug already exists. Please choose a unique slug.'
        : 'Failed to create event. Please try again.',
    };
  }

  revalidatePath('/events');
  revalidatePath('/admin/events');
  revalidatePath('/');
  redirect('/admin/events');
}

/**
 * Server Action for Admins to update an existing Event in PostgreSQL.
 */
export async function updateEventAction(
  prevState: AdminEventActionState,
  formData: FormData
): Promise<AdminEventActionState> {
  const eventId = formData.get('eventId') as string;
  if (!eventId) {
    logger.warn('Update event attempt rejected: missing eventId');
    return {
      success: false,
      error: 'Invalid request: Event ID is required.',
    };
  }

  // 1. RBAC Guard (Zero-Trust)
  const profile = await getCurrentUserProfile();
  if (!profile || (profile.role !== 'ADMIN' && profile.role !== 'SUPERADMIN')) {
    logger.warn({ eventId, userId: profile?.id }, 'Unauthorized attempt to edit event');
    return {
      success: false,
      error: 'Unauthorized: You must have an Admin account to edit events.',
    };
  }

  // 2. Banner Image Resolution
  let bannerUrl = (formData.get('existingBannerUrl') as string) || '/images/logo/pcyc-transparent-logo.png';
  const imageFile = formData.get('imageFile') as File | null;

  if (imageFile && imageFile.size > 0) {
    const slugPrefix = (formData.get('slug') as string) || 'event';
    const uploadResult = await saveUploadedImage(imageFile, 'events', slugPrefix);

    if (!uploadResult.success) {
      logger.warn({ error: uploadResult.error, eventId }, 'Event image upload rejected during edit');
      return {
        success: false,
        error: uploadResult.error || 'Failed to upload new event banner image.',
      };
    }

    bannerUrl = uploadResult.url!;
  }

  // 3. Extract and Sanitize Form Inputs
  const rawData = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    theme: formData.get('theme') || undefined,
    description: formData.get('description'),
    bannerUrl: bannerUrl,
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate'),
    location: formData.get('location'),
    registrationFee: formData.get('registrationFee') ? Number(formData.get('registrationFee')) : 0,
    maxAttendees: formData.get('maxAttendees') ? Number(formData.get('maxAttendees')) : undefined,
    registrationDeadline: formData.get('registrationDeadline') || undefined,
    isPublished: formData.get('isPublished') === 'on' || formData.get('isPublished') === 'true',
    status: (formData.get('status') as string) || 'UPCOMING',
  };

  const parsed = eventSchema.safeParse(rawData);
  if (!parsed.success) {
    logger.warn({ eventId, fieldErrors: parsed.error.flatten().fieldErrors }, 'Event update failed schema validation');
    return {
      success: false,
      error: 'Please correct the highlighted errors in the form.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  // 4. Parameterized Database Update
  try {
    await db
      .update(events)
      .set({
        title: parsed.data.title,
        slug: parsed.data.slug,
        theme: parsed.data.theme || null,
        description: parsed.data.description,
        bannerUrl: bannerUrl,
        startDate: new Date(parsed.data.startDate),
        endDate: new Date(parsed.data.endDate),
        location: parsed.data.location,
        registrationFee: parsed.data.registrationFee.toFixed(2),
        maxAttendees: parsed.data.maxAttendees || null,
        registrationDeadline: parsed.data.registrationDeadline ? new Date(parsed.data.registrationDeadline) : null,
        isPublished: parsed.data.isPublished ?? true,
        status: (parsed.data.status as 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED') || 'UPCOMING',
        updatedAt: new Date(),
      })
      .where(eq(events.id, eventId));

    logger.info(
      {
        eventId,
        slug: parsed.data.slug,
        adminId: profile.id,
        adminEmail: profile.email,
      },
      'Event successfully updated by administrator'
    );
  } catch (error: any) {
    logger.error({ error: error?.message, eventId }, 'Failed to update event in database');
    return {
      success: false,
      error: error?.message?.includes('duplicate key')
        ? 'An event with this URL slug already exists. Please choose a unique slug.'
        : 'Failed to update event. Please try again.',
    };
  }

  revalidatePath('/events');
  revalidatePath(`/events/${parsed.data.slug}`);
  revalidatePath('/admin/events');
  revalidatePath('/');
  redirect('/admin/events');
}

/**
 * Server Action for Admins to delete an Event via form submission.
 */
export async function deleteEventAction(formData: FormData): Promise<void> {
  const eventId = formData.get('eventId') as string;
  if (!eventId) return;

  const profile = await getCurrentUserProfile();
  if (!profile || (profile.role !== 'ADMIN' && profile.role !== 'SUPERADMIN')) {
    logger.warn({ eventId }, 'Unauthorized attempt to delete event');
    return;
  }

  try {
    await db.delete(events).where(eq(events.id, eventId));
    logger.info({ eventId, adminId: profile.id }, 'Event deleted by administrator');
    revalidatePath('/events');
    revalidatePath('/admin/events');
    revalidatePath('/');
  } catch (error: any) {
    logger.error({ error: error?.message, eventId }, 'Failed to delete event');
  }
}

export interface EventRegistrationState {
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

/**
 * Server Action for Members to register for an Event with GCash or Venue payment.
 */
export async function registerForEventAction(
  prevState: EventRegistrationState,
  formData: FormData
): Promise<EventRegistrationState> {
  const profile = await getCurrentUserProfile();
  if (!profile) {
    return {
      success: false,
      error: 'Please log in to your PCYC Member account to register for this event.',
    };
  }

  const eventId = (formData.get('eventId') as string) || '';
  const paymentOption = (formData.get('paymentOption') as 'GCASH' | 'VENUE_DESK' | 'FREE') || 'VENUE_DESK';
  const referenceNumber = ((formData.get('referenceNumber') as string) || '').trim();
  const specialRequirements = ((formData.get('specialRequirements') as string) || '').trim();
  const receiptFile = formData.get('receiptImage') as File | null;

  // 1. Fetch Event
  const [event] = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
  if (!event) {
    return {
      success: false,
      error: 'The requested gathering could not be found.',
    };
  }

  if (event.status === 'COMPLETED' || event.status === 'CANCELLED') {
    return {
      success: false,
      error: 'Registration is closed for this event.',
    };
  }

  // 2. Check if already registered
  const { getUserEventRegistration } = await import('@/lib/db/queries/events');
  const existing = await getUserEventRegistration(profile.id, eventId);
  if (existing) {
    return {
      success: false,
      error: 'You are already registered for this event! Check your Member Portal for details.',
    };
  }

  const feeNum = Number(event.registrationFee || 0);

  // 3. Payment Processing
  let finalPaymentOption = feeNum === 0 ? 'FREE' : paymentOption;
  let finalPaymentStatus = feeNum === 0 ? 'FREE' : (paymentOption === 'GCASH' ? 'VERIFICATION_QUEUED' : 'UNPAID');
  let finalRegStatus = feeNum === 0 ? 'CONFIRMED' : (paymentOption === 'GCASH' ? 'VERIFICATION_QUEUED' : 'CONFIRMED');
  let receiptImageUrl: string | null = null;

  if (feeNum > 0 && paymentOption === 'GCASH') {
    if (!referenceNumber || referenceNumber.length < 3) {
      return {
        success: false,
        error: 'Please provide your GCash Reference Number.',
      };
    }

    if (!receiptFile || receiptFile.size === 0) {
      return {
        success: false,
        error: 'Please upload a screenshot of your GCash payment confirmation receipt.',
      };
    }

    const uploadResult = await saveUploadedImage(
      receiptFile,
      'receipts',
      `event-reg-${event.slug}-${profile.id}`
    );

    if (!uploadResult.success || !uploadResult.url) {
      return {
        success: false,
        error: uploadResult.error || 'Failed to upload GCash receipt proof.',
      };
    }

    receiptImageUrl = uploadResult.url;
  }

  // 4. Insert into eventRegistrations
  try {
    const { eventRegistrations } = await import('@/lib/db/schema/events');
    await db.insert(eventRegistrations).values({
      eventId: event.id,
      userId: profile.id,
      status: finalRegStatus,
      paymentOption: finalPaymentOption,
      paymentStatus: finalPaymentStatus,
      referenceNumber: referenceNumber || null,
      receiptImageUrl: receiptImageUrl,
      amountPaid: feeNum > 0 ? feeNum.toFixed(2) : '0.00',
      specialRequirements: specialRequirements || null,
    });

    logger.info(
      { eventId: event.id, userId: profile.id, paymentOption: finalPaymentOption },
      'User registered for event successfully'
    );

    revalidatePath('/events');
    revalidatePath(`/events/${event.slug}`);
    revalidatePath('/portal');
    revalidatePath('/admin/events');

    return {
      success: true,
      message:
        finalPaymentOption === 'GCASH'
          ? 'Registration submitted with GCash payment! Our committee will verify your payment shortly.'
          : finalPaymentOption === 'VENUE_DESK'
          ? 'Registration confirmed! You can settle your registration fee at the venue desk upon arrival.'
          : 'Registration confirmed! We look forward to seeing you at the gathering.',
    };
  } catch (error: any) {
    logger.error({ error: error?.message, eventId: event.id, userId: profile.id }, 'Failed to save event registration');
    return {
      success: false,
      error: error?.message?.includes('unique')
        ? 'You are already registered for this event.'
        : 'Failed to complete registration. Please try again.',
    };
  }
}


