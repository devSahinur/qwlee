const nodemailer = require("nodemailer");
const config = require("../config/config");
const logger = require("../config/logger");

// Lazy transport: read SMTP from the AppConfig singleton (admin-managed)
// on the first send, falling back to `.env` when the admin hasn't filled
// it in yet. Cached and rebuilt only when the cached signature changes,
// so a one-line PATCH from /dashboard/setting takes effect on the next
// outbound email — no server restart needed.
let cachedTransport = null;
let cachedSignature = "";
let cachedFrom = config.email?.from || "";

async function readSmtp() {
  try {
    const { appConfigService } = require("./");
    const cfg = await appConfigService.getConfig();
    const s = cfg?.smtp || {};
    if (s.host) {
      return {
        smtp: {
          host: s.host,
          port: s.port || 587,
          secure: !!s.secure,
          auth: s.user || s.pass ? { user: s.user, pass: s.pass } : undefined,
        },
        from:
          s.fromEmail && s.fromName
            ? `${s.fromName} <${s.fromEmail}>`
            : s.fromEmail || config.email?.from || "noreply@qwlee.com",
      };
    }
  } catch (e) {
    /* fall through to .env */
  }
  return { smtp: config.email.smtp, from: config.email.from };
}

async function getTransport() {
  const { smtp, from } = await readSmtp();
  const sig = JSON.stringify(smtp);
  if (cachedTransport && sig === cachedSignature) {
    return { transport: cachedTransport, from: cachedFrom };
  }
  cachedTransport = nodemailer.createTransport(smtp);
  cachedSignature = sig;
  cachedFrom = from;
  cachedTransport
    .verify()
    .then(() => logger.info(`SMTP ready (${smtp.host}:${smtp.port})`))
    .catch((err) => logger.warn(`SMTP verify failed: ${err.message}`));
  return { transport: cachedTransport, from };
}

const sendEmail = async (to, subject, html) => {
  try {
    const { transport, from } = await getTransport();
    await transport.sendMail({ from, to, subject, html });
  } catch (err) {
    // Email delivery failure must NEVER crash the process — registration,
    // password reset, etc. all still work (OTP is stored in the DB). Log
    // and move on; callers can ignore the rejection.
    logger.warn(`Email to ${to} failed: ${err.message}`);
  }
};

// --- Email template -------------------------------------------------------
// Shared HTML shell used by every transactional email so the visual
// identity is consistent. Inline CSS only — most email clients (Gmail,
// Outlook) strip <style> blocks and ignore CSS variables. Single
// 600px-wide container, hero band, content body, divider, footer.
//
// `accent` lets each email pick a Stripe-style accent colour for the
// hero band and CTA. Default = Qwlee emerald.

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:8000";
const LOGO_URL = "https://i.ibb.co/99DDJ34/Property-1-Logo-Mark-1.png";

function emailShell({
  preheader = "",
  heading,
  intro,
  bodyHtml = "",
  ctaLabel,
  ctaUrl,
  footerNote,
  accent = "#059669",
}) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${heading}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,sans-serif;color:#111827;">
  <!-- preheader (hidden, but shows in inbox preview) -->
  <span style="display:none;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">${preheader}</span>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f3f4f6;padding:32px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.06);">
          <!-- hero -->
          <tr>
            <td style="background:linear-gradient(135deg,${accent} 0%,#0d9488 100%);padding:28px 32px;text-align:left;">
              <img src="${LOGO_URL}" alt="Qwlee" width="120" style="display:block;max-width:120px;" />
            </td>
          </tr>
          <!-- body -->
          <tr>
            <td style="padding:32px 36px 12px;">
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#0f172a;letter-spacing:-0.01em;">${heading}</h1>
              ${intro ? `<p style="margin:14px 0 0;font-size:15px;line-height:1.65;color:#475569;">${intro}</p>` : ""}
            </td>
          </tr>
          <tr>
            <td style="padding:18px 36px 8px;">
              ${bodyHtml}
            </td>
          </tr>
          ${
            ctaLabel && ctaUrl
              ? `<tr><td style="padding:6px 36px 28px;">
                  <a href="${ctaUrl}" style="display:inline-block;background:${accent};color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 22px;border-radius:10px;">${ctaLabel}</a>
                </td></tr>`
              : ""
          }
          <!-- divider + footer -->
          <tr>
            <td style="padding:24px 36px 0;border-top:1px solid #f1f5f9;">
              ${footerNote ? `<p style="margin:0;font-size:13px;color:#64748b;line-height:1.6;">${footerNote}</p>` : ""}
            </td>
          </tr>
          <tr>
            <td style="padding:18px 36px 28px;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                You received this email because an action was started with this address on Qwlee.<br />
                If it wasn&rsquo;t you, you can safely ignore this message.
              </p>
              <p style="margin:14px 0 0;font-size:12px;color:#94a3b8;">
                <strong style="color:#475569;">Qwlee</strong> · The freelance marketplace · <a href="${FRONTEND_URL}" style="color:${accent};text-decoration:none;">qwlee.com</a>
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

// Big stylised OTP block. Letter-spacing keeps the digits legible and
// hints that the user should copy the whole thing.
function otpBlock(otp) {
  return `<div style="margin:10px 0 6px;padding:18px 22px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;text-align:center;">
    <div style="font-size:12px;font-weight:600;letter-spacing:0.08em;color:#047857;text-transform:uppercase;">Your verification code</div>
    <div style="margin-top:8px;font-size:32px;font-weight:800;letter-spacing:0.35em;color:#0f172a;">${otp}</div>
    <div style="margin-top:8px;font-size:12px;color:#64748b;">This code expires in 3 minutes.</div>
  </div>`;
}

const sendEmailVerification = async (to, otp) => {
  const subject = "Welcome to Qwlee — verify your email";
  const html = emailShell({
    preheader: `Your Qwlee verification code is ${otp}.`,
    heading: "Welcome to Qwlee 👋",
    intro:
      "Thanks for creating an account. Enter the code below in the verification screen to finish setting things up.",
    bodyHtml: otpBlock(otp),
    footerNote:
      "If you didn&rsquo;t create a Qwlee account, you can safely ignore this email — no further action is needed.",
  });
  await sendEmail(to, subject, html);
};

const sendResetPasswordEmail = async (to, otp) => {
  const subject = "Reset your Qwlee password";
  const html = emailShell({
    preheader: `Your password-reset code is ${otp}.`,
    heading: "Reset your password",
    intro:
      "We received a request to reset the password on your Qwlee account. Use the code below on the password-reset screen.",
    bodyHtml: otpBlock(otp),
    footerNote:
      "If you didn&rsquo;t ask to reset your password, ignore this email — your password won&rsquo;t change.",
    accent: "#0ea5e9",
  });
  await sendEmail(to, subject, html);
};

const sendVerificationEmail = async (to, token) => {
  const subject = "Confirm your email on Qwlee";
  const url = `${FRONTEND_URL}/verify-email?token=${encodeURIComponent(token)}`;
  const html = emailShell({
    preheader: "Confirm your email address to activate your Qwlee account.",
    heading: "Confirm your email",
    intro: "Click the button below to confirm this email address on Qwlee.",
    bodyHtml: `<p style="margin:0;font-size:14px;color:#475569;">If the button doesn&rsquo;t work, paste this link in your browser:</p>
      <p style="margin:8px 0 0;font-size:13px;color:#64748b;word-break:break-all;">${url}</p>`,
    ctaLabel: "Confirm email",
    ctaUrl: url,
  });
  await sendEmail(to, subject, html);
};

module.exports = {
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendEmailVerification,
};
