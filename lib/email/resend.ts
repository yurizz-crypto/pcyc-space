import { Resend } from 'resend';
import { createModuleLogger } from '@/lib/logger';

const log = createModuleLogger('email:resend');

const apiKey = process.env.RESEND_API_KEY;

export const resend = apiKey ? new Resend(apiKey) : null;

/**
 * Sends a transactional email via Resend with graceful logging.
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}) {
  if (!resend) {
    log.warn(
      { to, subject },
      'RESEND_API_KEY is not configured. Email skipped (simulated delivery in dev mode).'
    );
    return { success: false, simulated: true };
  }

  const from = process.env.EMAIL_FROM || 'PCYC Space <notifications@pcyc.ph>';

  try {
    const response = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text,
    });

    log.info({ to, subject, id: response.data?.id }, 'Transactional email dispatched');
    return { success: true, data: response.data };
  } catch (error) {
    log.error({ to, subject, error }, 'Failed to dispatch email');
    throw error;
  }
}
