import { type Profile, type UserRole } from '@/lib/db/schema/users';

/**
 * Mask an email address according to privacy best practices.
 * Example: `john.doe@example.com` -> `j***e@example.com`
 * Example: `a@b.com` -> `a***@b.com`
 */
export function maskEmail(email: string | null | undefined): string {
  if (!email) return 'N/A';
  const trimmed = email.trim();
  const atIndex = trimmed.indexOf('@');
  if (atIndex <= 1) {
    const domain = atIndex >= 0 ? trimmed.slice(atIndex) : '';
    return `${trimmed.slice(0, 1)}***${domain}`;
  }

  const user = trimmed.slice(0, atIndex);
  const domain = trimmed.slice(atIndex);

  if (user.length <= 2) {
    return `${user[0]}***${domain}`;
  }

  return `${user[0]}***${user[user.length - 1]}${domain}`;
}

/**
 * Mask a phone number to shield PII while keeping country code and last 2 digits for reference.
 * Example: `+639171234567` -> `+63 917 *** **67`
 * Example: `09171234567` -> `0917 *** **67`
 */
export function maskPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return 'Not Provided';
  const clean = phone.trim();
  if (clean.length <= 4) return '***';

  const prefix = clean.slice(0, 4);
  const suffix = clean.slice(-2);
  return `${prefix} *** **${suffix}`;
}

export type SanitizedProfile = Omit<Profile, 'phoneNumber' | 'email'> & {
  email: string;
  phoneNumber: string | null;
  isPiiMasked: boolean;
};

/**
 * Sanitizes a user profile object for client UI display based on role and explicit reveal permission.
 */
export function sanitizeUserForDisplay(
  profile: Profile,
  viewerRole: UserRole = 'MEMBER',
  revealPii: boolean = false
): SanitizedProfile {
  // SUPERADMIN and ADMIN can view unmasked if revealPii is requested
  const canViewUnmasked = (viewerRole === 'SUPERADMIN' || viewerRole === 'ADMIN') && revealPii;

  if (canViewUnmasked) {
    return {
      ...profile,
      isPiiMasked: false,
    };
  }

  return {
    ...profile,
    email: maskEmail(profile.email),
    phoneNumber: profile.phoneNumber ? maskPhoneNumber(profile.phoneNumber) : null,
    isPiiMasked: true,
  };
}
