/**
 * Base Email Layout - PCYC Space Impeccable Design System
 * Styled with PCYC Forest Green (#2c3324), Warm Gold (#e0a861), and Cream (#fefcf1).
 */

export interface BaseEmailLayoutOptions {
  previewText?: string;
  badge?: string;
  title: string;
  subtitle?: string;
  contentHtml: string;
  ctaButton?: {
    text: string;
    url: string;
  };
}

export function renderBaseEmailLayout({
  previewText,
  badge,
  title,
  subtitle,
  contentHtml,
  ctaButton,
}: BaseEmailLayoutOptions): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pcyc-space.vercel.app';
  const logoUrl = `${appUrl}/images/logo/pcyc-transparent-logo.png`;

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${title}</title>
  ${previewText ? `<div style="display:none;font-size:1px;color:#333333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${previewText}</div>` : ''}
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #fefcf1; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    @media screen and (max-width: 600px) {
      .email-container { width: 100% !important; margin: auto !important; }
      .fluid { max-width: 100% !important; height: auto !important; margin-left: auto !important; margin-right: auto !important; }
      .stack-column { display: block !important; width: 100% !important; max-width: 100% !important; direction: ltr !important; }
      .px-mobile { padding-left: 20px !important; padding-right: 20px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #fefcf1; -webkit-font-smoothing: antialiased;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #fefcf1;">
    <tr>
      <td align="center" style="padding: 24px 12px;">
        <!-- Email Card Container -->
        <table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="background-color: #ffffff; border: 1px solid #e6dfcb; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(44, 51, 36, 0.06);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #2c3324; padding: 32px 32px 28px 32px; text-align: center; border-bottom: 3px solid #e0a861;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="background-color: #1f271a; border-radius: 14px; padding: 8px 12px; border: 1px solid #38452f;">
                          <table border="0" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="vertical-align: middle;">
                                <img src="${logoUrl}" alt="PCYC Logo" width="32" height="32" style="display: block; width: 32px; height: 32px; object-fit: contain;" />
                              </td>
                              <td style="padding-left: 10px; vertical-align: middle;">
                                <span style="font-family: Georgia, 'Playfair Display', serif; font-size: 18px; font-weight: bold; color: #fefcf1; letter-spacing: 0.5px;">PCYC Space</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ${
                  badge
                    ? `<tr>
                  <td align="center" style="padding-top: 18px;">
                    <span style="display: inline-block; padding: 4px 12px; background-color: rgba(224, 168, 97, 0.15); border: 1px solid #e0a861; color: #e0a861; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                      ${badge}
                    </span>
                  </td>
                </tr>`
                    : ''
                }
                <tr>
                  <td align="center" style="padding-top: 14px;">
                    <h1 style="margin: 0; font-family: Georgia, 'Playfair Display', serif; font-size: 24px; line-height: 1.3; font-weight: 700; color: #fefcf1;">
                      ${title}
                    </h1>
                    ${
                      subtitle
                        ? `<p style="margin: 8px 0 0 0; font-size: 14px; line-height: 1.5; color: #a3ab98;">${subtitle}</p>`
                        : ''
                    }
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td class="px-mobile" style="padding: 32px 32px 24px 32px; font-size: 15px; line-height: 1.6; color: #2c3324;">
              ${contentHtml}
            </td>
          </tr>

          <!-- Call to Action Button (Optional) -->
          ${
            ctaButton
              ? `<tr>
            <td align="center" style="padding: 0 32px 32px 32px;">
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background-color: #e0a861; border-radius: 12px; box-shadow: 0 4px 12px rgba(224, 168, 97, 0.35);">
                    <a href="${ctaButton.url}" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 14px; font-weight: 700; color: #2c3324; text-decoration: none; border-radius: 12px; letter-spacing: 0.3px;">
                      ${ctaButton.text} &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`
              : ''
          }

          <!-- Footer Divider -->
          <tr>
            <td style="padding: 0 32px;">
              <hr style="border: 0; border-top: 1px solid #e6dfcb; margin: 0;" />
            </td>
          </tr>

          <!-- Footer Information -->
          <tr>
            <td style="background-color: #f8f4e3; padding: 24px 32px; text-align: center; font-size: 12px; line-height: 1.6; color: #707666;">
              <p style="margin: 0 0 8px 0; font-weight: 600; color: #2c3324;">
                Philippine Christadelphian Youth Conference
              </p>
              <p style="margin: 0 0 12px 0;">
                For questions or assistance, contact <a href="mailto:bumadillal@gmail.com" style="color: #ca914a; text-decoration: underline; font-weight: 600;">bumadillal@gmail.com</a>
              </p>
              <p style="margin: 0; font-size: 11px; color: #8a9180;">
                &copy; ${new Date().getFullYear()} PCYC Space. Dedicated to youth fellowship, study, and unity in faith across Luzon, Visayas, and Mindanao.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
