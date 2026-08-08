import { renderBaseEmailLayout } from './base';

export interface WelcomeEmailData {
  name: string;
  designation: string;
  ecclesia?: string | null;
  email: string;
}

export function renderWelcomeEmail(data: WelcomeEmailData): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pcyc-space.vercel.app';
  const prefix =
    data.designation === 'BROTHER'
      ? 'Brother'
      : data.designation === 'SISTER'
      ? 'Sister'
      : 'Friend';

  const contentHtml = `
    <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #2c3324;">
      Dear ${prefix} ${data.name},
    </p>
    <p style="margin: 0 0 16px 0;">
      Grace and peace to you in our Lord Jesus Christ! Welcome to <strong>PCYC Space</strong>, the official digital hub for the Philippine Christadelphian Youth Conference.
    </p>
    <div style="background-color: #fbf1e2; border-left: 4px solid #e0a861; padding: 16px 20px; border-radius: 8px; margin: 24px 0;">
      <p style="margin: 0 0 8px 0; font-weight: 700; color: #2c3324; font-size: 14px;">
        ✨ What you can do in PCYC Space:
      </p>
      <ul style="margin: 0; padding-left: 20px; color: #505748; font-size: 14px; line-height: 1.7;">
        <li><strong>Register for Upcoming Camps & Conferences</strong> across Luzon, Visayas, and Mindanao.</li>
        <li><strong>Order Official PCYC Merchandise</strong> (apparel, stickers, and youth items).</li>
        <li><strong>View Payment Receipts</strong> and track your registration and order statuses.</li>
        <li><strong>Connect with Philippine Ecclesias</strong> in our national ecclesial directory.</li>
      </ul>
    </div>
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8f4e3; border: 1px solid #e6dfcb; border-radius: 12px; margin: 20px 0;">
      <tr>
        <td style="padding: 16px 20px;">
          <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; color: #707666; text-transform: uppercase; letter-spacing: 0.5px;">Account Summary</p>
          <p style="margin: 0; font-size: 14px; color: #2c3324;"><strong>Email:</strong> ${data.email}</p>
          <p style="margin: 4px 0 0 0; font-size: 14px; color: #2c3324;"><strong>Designation:</strong> ${data.designation}</p>
          ${data.ecclesia ? `<p style="margin: 4px 0 0 0; font-size: 14px; color: #2c3324;"><strong>Ecclesia:</strong> ${data.ecclesia}</p>` : ''}
        </td>
      </tr>
    </table>
    <p style="margin: 20px 0 0 0; font-size: 14px; color: #505748;">
      We pray that this platform blesses our fellowship and youth activities as we await the return of our Lord.
    </p>
  `;

  return renderBaseEmailLayout({
    previewText: `Welcome to PCYC Space, ${prefix} ${data.name}! Your account is ready.`,
    badge: 'Welcome to Fellowship',
    title: 'Welcome to PCYC Space',
    subtitle: 'Philippine Christadelphian Youth Conference',
    contentHtml,
    ctaButton: {
      text: 'Visit Your Member Space',
      url: `${appUrl}/portal`,
    },
  });
}
