/**
 * Ready-to-copy HTML Templates for Supabase Auth Custom SMTP
 *
 * Instructions for Supabase Dashboard:
 * 1. Navigate to: Authentication -> Email Templates
 * 2. In "Confirm signup", paste `SUPABASE_CONFIRM_SIGNUP_HTML`
 * 3. In "Reset Password", paste `SUPABASE_RESET_PASSWORD_HTML`
 * 4. In "Magic Link", paste `SUPABASE_MAGIC_LINK_HTML`
 */

export const SUPABASE_CONFIRM_SIGNUP_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirm Your PCYC Space Account</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fefcf1; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fefcf1;">
    <tr>
      <td align="center" style="padding: 28px 12px;">
        <table border="0" cellpadding="0" cellspacing="0" width="580" style="background-color: #ffffff; border: 1px solid #e6dfcb; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(44,51,36,0.06);">
          <tr>
            <td style="background-color: #2c3324; padding: 32px 24px; text-align: center; border-bottom: 3px solid #e0a861;">
              <span style="font-family: Georgia, serif; font-size: 20px; font-weight: bold; color: #fefcf1; letter-spacing: 0.5px;">PCYC Space</span>
              <p style="margin: 8px 0 0 0; font-size: 13px; color: #a3ab98; text-transform: uppercase; letter-spacing: 1px;">Philippine Christadelphians</p>
              <h1 style="margin: 16px 0 0 0; font-family: Georgia, serif; font-size: 22px; font-weight: bold; color: #fefcf1;">Confirm Your Email</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px; font-size: 15px; line-height: 1.6; color: #2c3324;">
              <p style="margin: 0 0 16px 0;">Grace and peace to you!</p>
              <p style="margin: 0 0 20px 0;">Thank you for registering with <strong>PCYC Space</strong>. Please confirm your email address by clicking the button below:</p>
              
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 24px 0;">
                <tr>
                  <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="background-color: #e0a861; border-radius: 12px; box-shadow: 0 4px 12px rgba(224, 168, 97, 0.35);">
                          <a href="{{ .ConfirmationURL }}" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 14px; font-weight: bold; color: #2c3324; text-decoration: none; border-radius: 12px;">
                            Confirm My Account &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 13px; color: #707666;">
                Or copy and paste this confirmation link into your browser:<br />
                <a href="{{ .ConfirmationURL }}" style="color: #ca914a; word-break: break-all;">{{ .ConfirmationURL }}</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8f4e3; padding: 20px 32px; text-align: center; font-size: 11px; color: #707666; border-top: 1px solid #e6dfcb;">
              <p style="margin: 0;">Philippine Christadelphian Youth Conference &copy; PCYC Space</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

export const SUPABASE_RESET_PASSWORD_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Your PCYC Space Password</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fefcf1; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fefcf1;">
    <tr>
      <td align="center" style="padding: 28px 12px;">
        <table border="0" cellpadding="0" cellspacing="0" width="580" style="background-color: #ffffff; border: 1px solid #e6dfcb; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(44,51,36,0.06);">
          <tr>
            <td style="background-color: #2c3324; padding: 32px 24px; text-align: center; border-bottom: 3px solid #e0a861;">
              <span style="font-family: Georgia, serif; font-size: 20px; font-weight: bold; color: #fefcf1; letter-spacing: 0.5px;">PCYC Space</span>
              <h1 style="margin: 16px 0 0 0; font-family: Georgia, serif; font-size: 22px; font-weight: bold; color: #fefcf1;">Reset Your Password</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px; font-size: 15px; line-height: 1.6; color: #2c3324;">
              <p style="margin: 0 0 16px 0;">Hello,</p>
              <p style="margin: 0 0 20px 0;">We received a request to reset your password for your <strong>PCYC Space</strong> account. Click the button below to choose a new password:</p>
              
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 24px 0;">
                <tr>
                  <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="background-color: #e0a861; border-radius: 12px; box-shadow: 0 4px 12px rgba(224, 168, 97, 0.35);">
                          <a href="{{ .ConfirmationURL }}" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 14px; font-weight: bold; color: #2c3324; text-decoration: none; border-radius: 12px;">
                            Reset Password &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 13px; color: #707666;">
                If you did not request a password reset, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8f4e3; padding: 20px 32px; text-align: center; font-size: 11px; color: #707666; border-top: 1px solid #e6dfcb;">
              <p style="margin: 0;">Philippine Christadelphian Youth Conference &copy; PCYC Space</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
