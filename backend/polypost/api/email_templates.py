# api/email_templates.py

POSTLY_EMAIL_TEMPLATE = """<!DOCTYPE html>
<html lang="en" style="margin:0; padding:0;">
  <body style="margin:0; padding:0; background:#f5f3ff; font-family:Arial, Helvetica, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ff; padding:20px 0;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px; background:white; border-radius:18px; padding:32px; border:1px solid #e4ddff;">
            <tr>
              <td style="text-align:center; padding-bottom:18px;">
                <div style="font-size:24px; font-weight:800; color:#6c4bf4;">
                  Postly
                </div>
              </td>
            </tr>
            <tr>
              <td style="font-size:20px; font-weight:700; color:#2a2a2a; padding-bottom:12px; text-align:center;">
                {{TITLE}}
              </td>
            </tr>
            <tr>
              <td style="font-size:14px; color:#444; line-height:1.6; padding-bottom:22px;">
                {{MESSAGE}}
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-bottom:26px;">
                <a href="{{BUTTON_URL}}"
                   style="display:inline-block; background:linear-gradient(90deg,#6c4bf4,#ff79c7); color:white; padding:12px 22px; border-radius:12px; font-size:14px; font-weight:600; text-decoration:none; box-shadow:0 3px 8px rgba(108,75,244,0.25);">
                  {{BUTTON_TEXT}}
                </a>
              </td>
            </tr>
            <tr>
              <td style="font-size:12px; color:#888; text-align:center; line-height:1.5;">
                You're receiving this email because you have an account on Postly.<br/>
                © {{YEAR}} Postly — All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>"""
