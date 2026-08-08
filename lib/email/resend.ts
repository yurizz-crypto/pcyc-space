import { Resend } from 'resend';
import { createModuleLogger } from '@/lib/logger';

const log = createModuleLogger('email:resend');

const apiKey = process.env.RESEND_API_KEY;

export const resend = apiKey ? new Resend(apiKey) : null;

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export interface SendEmailResult {
  success: boolean;
  data?: { id: string } | null;
  error?: string;
  simulated?: boolean;
}

/**
 * Sends a transactional email via Resend with graceful logging and fail-safe error handling.
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
}: SendEmailOptions): Promise<SendEmailResult> {
  const recipients = Array.isArray(to) ? to : [to];
  const validRecipients = recipients.filter((r) => r && r.includes('@'));

  if (validRecipients.length === 0) {
    log.warn({ to, subject }, 'No valid email recipients provided. Skipping dispatch.');
    return { success: false, error: 'No valid recipient email address' };
  }

  if (!resend) {
    log.warn(
      { to: validRecipients, subject },
      'RESEND_API_KEY is not configured. Email simulated in development mode.'
    );
    return { success: true, simulated: true };
  }

  const from = process.env.EMAIL_FROM || 'PCYC Space <onboarding@resend.dev>';

  try {
    const response = await resend.emails.send({
      from,
      to: validRecipients,
      subject,
      html,
      text: text || subject,
      replyTo: replyTo || 'bumadillal@gmail.com',
    });

    if (response.error) {
      log.error({ to: validRecipients, subject, error: response.error }, 'Resend API returned an error');
      return { success: false, error: response.error.message };
    }

    log.info({ to: validRecipients, subject, id: response.data?.id }, 'Transactional email successfully dispatched');
    return { success: true, data: response.data };
  } catch (error: any) {
    log.error({ to: validRecipients, subject, error: error?.message || error }, 'Failed to dispatch email');
    return { success: false, error: error?.message || 'Failed to dispatch email' };
  }
}
