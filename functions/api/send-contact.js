// ─────────────────────────────────────────────────────────────
// /functions/api/send-contact.js
// Cloudflare Pages Function — Golden State Rehab contact form
// ─────────────────────────────────────────────────────────────
// Receives urlencoded/multipart form data from /contact and
// /es/contact, validates, and forwards to Paubox Email API for
// HIPAA-compliant delivery. No file uploads on this form.
//
// HIPAA NOTES (same posture as send-vob.js):
//   • PHI is never logged. Only non-PHI status/error metadata.
//   • Requires a signed BAA with Paubox AND with Cloudflare
//     (Workers Paid plan) before processing real patient data.
//   • Recipient falls back to VOB_RECIPIENT_EMAIL so no new env
//     vars are required; set CONTACT_RECIPIENT_EMAIL to split.
// ─────────────────────────────────────────────────────────────

const REQUIRED_TEXT = ['first_name', 'last_name', 'phone', 'inquiry_type'];
const OPTIONAL_TEXT = ['email', 'insurance', 'message', 'lang'];

const INQUIRY_LABELS = {
  self: 'Someone seeking treatment for themselves',
  family: 'A family member or loved one',
  professional: 'A healthcare professional / referral',
  other: 'Other',
};

export async function onRequestPost(context) {
  const { request, env } = context;

  const { PAUBOX_API_KEY, PAUBOX_ENDPOINT_USERNAME, PAUBOX_FROM_EMAIL } = env;
  const recipient = env.CONTACT_RECIPIENT_EMAIL || env.VOB_RECIPIENT_EMAIL;
  if (!PAUBOX_API_KEY || !PAUBOX_ENDPOINT_USERNAME || !PAUBOX_FROM_EMAIL || !recipient) {
    console.error('[send-contact] missing required env vars');
    return jsonResponse({ error: 'server_misconfigured' }, 500);
  }

  let formData;
  try {
    formData = await request.formData();
  } catch (_err) {
    console.error('[send-contact] formData parse failed');
    return jsonResponse({ error: 'submission_failed' }, 400);
  }

  const text = {};
  for (const key of REQUIRED_TEXT) {
    const value = sanitize(formData.get(key));
    if (!value) return jsonResponse({ error: 'missing_field', field: key }, 400);
    text[key] = value;
  }
  for (const key of OPTIONAL_TEXT) {
    text[key] = sanitize(formData.get(key) || '', key === 'message' ? 3000 : 200);
  }
  if (text.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text.email)) {
    return jsonResponse({ error: 'invalid_email' }, 400);
  }
  if (text.first_name.length > 80 || text.last_name.length > 80) {
    return jsonResponse({ error: 'name_too_long' }, 400);
  }

  const firstName = text.first_name.trim();
  const lastInitial = (text.last_name.trim()[0] || '').toUpperCase();
  const subject = `New Contact Inquiry - ${firstName} ${lastInitial}${text.lang === 'es' ? ' (Español)' : ''}`;

  let paubox;
  try {
    paubox = await fetch(
      `https://api.paubox.net/v1/${encodeURIComponent(PAUBOX_ENDPOINT_USERNAME)}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Token token="${PAUBOX_API_KEY}"`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            message: {
              recipients: [recipient],
              ...(env.VOB_BCC_EMAIL ? { bcc: [env.VOB_BCC_EMAIL] } : {}),
              headers: {
                subject,
                from: `Golden State Rehab <${PAUBOX_FROM_EMAIL}>`,
                'reply-to': text.email || PAUBOX_FROM_EMAIL,
              },
              allowNonTLS: false,
              forceSecureNotification: 'false',
              content: {
                'text/plain': renderTextBody(text),
                'text/html': renderHtmlBody(text),
              },
            },
          },
        }),
      },
    );
  } catch (_e) {
    console.error('[send-contact] network error reaching paubox');
    return jsonResponse({ error: 'delivery_failed' }, 502);
  }

  if (!paubox.ok) {
    let bodyExcerpt = '';
    try { bodyExcerpt = (await paubox.text()).slice(0, 800); } catch (_e) {}
    console.error(`[send-contact] paubox responded ${paubox.status}: ${bodyExcerpt}`);
    return jsonResponse({ error: 'delivery_failed' }, 502);
  }

  let result;
  try {
    result = await paubox.json();
  } catch {
    console.error('[send-contact] paubox returned non-JSON');
    return jsonResponse({ error: 'delivery_failed' }, 502);
  }
  if (result?.errors?.length) {
    console.error('[send-contact] paubox logical error', { count: result.errors.length });
    return jsonResponse({ error: 'delivery_failed' }, 502);
  }

  return jsonResponse({ ok: true }, 200);
}

export async function onRequest(context) {
  if (context.request.method === 'POST') {
    return onRequestPost(context);
  }
  return new Response('Method Not Allowed', {
    status: 405,
    headers: { Allow: 'POST' },
  });
}

// ─── Helpers ──────────────────────────────────────────────────

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

function sanitize(v, maxLen = 500) {
  if (typeof v !== 'string') return '';
  return v
    .replace(/[\x00-\x1F\x7F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen);
}

function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderTextBody(t) {
  return [
    'New contact inquiry from goldenstate-rehab.com',
    '',
    `Name:            ${t.first_name} ${t.last_name}`,
    `Phone:           ${t.phone}`,
    `Email:           ${t.email || '(not provided)'}`,
    `Reaching out as: ${INQUIRY_LABELS[t.inquiry_type] || t.inquiry_type}`,
    `Insurance:       ${t.insurance || '(not provided)'}`,
    `Language:        ${t.lang === 'es' ? 'Spanish' : 'English'}`,
    '',
    'Message:',
    t.message || '(none)',
    '',
    '— Sent securely via Paubox',
  ].join('\n');
}

function renderHtmlBody(t) {
  const row = (k, v) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#7A6A52;font-weight:600;">${escHtml(k)}</td><td style="padding:4px 0;">${escHtml(v)}</td></tr>`;

  return `<!DOCTYPE html>
<html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#140E04;line-height:1.6;max-width:640px;margin:0 auto;padding:24px;">
  <h2 style="margin:0 0 16px;color:#140E04;">New Contact Inquiry</h2>
  <p style="margin:0 0 16px;color:#7A6A52;">From the Golden State Rehab contact form${t.lang === 'es' ? ' (Spanish page)' : ''}.</p>
  <table style="border-collapse:collapse;margin-bottom:24px;">
    ${row('Name', `${t.first_name} ${t.last_name}`)}
    ${row('Phone', t.phone)}
    ${row('Email', t.email || '—')}
    ${row('Reaching out as', INQUIRY_LABELS[t.inquiry_type] || t.inquiry_type)}
    ${row('Insurance', t.insurance || '—')}
  </table>
  <h3 style="font-size:14px;margin:24px 0 8px;color:#140E04;">Message</h3>
  <p style="white-space:pre-wrap;margin:0;">${escHtml(t.message || '(none)')}</p>
  <hr style="border:none;border-top:1px solid #E8D5A3;margin:24px 0;">
  <p style="font-size:12px;color:#7A6A52;margin:0;">Sent securely via Paubox · goldenstate-rehab.com</p>
</body></html>`;
}
