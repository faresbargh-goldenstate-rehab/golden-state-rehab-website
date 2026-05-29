// ─────────────────────────────────────────────────────────────
// /functions/api/send-vob.js
// Cloudflare Pages Function — Golden State Rehab intake/VOB
// ─────────────────────────────────────────────────────────────
// Receives multipart form data from the intake form at
// /verify-insurance, validates, base64-encodes attachments,
// and forwards to Paubox Email API for HIPAA-compliant delivery.
//
// Runtime: Cloudflare Workers (V8 isolates, Web Standards).
//   • Body parsing: built-in request.formData() — no formidable.
//   • Env vars: via `context.env` (set in Cloudflare Pages dashboard).
//   • Response: Web Standards Response object.
//   • Memory-only file handling — no temp files, no persistence.
//
// HIPAA NOTES:
//   • PHI is never logged. Only non-PHI status/error metadata.
//   • Files exist as ArrayBuffer in function memory for the
//     duration of one request; nothing is written to disk.
//   • Requires a signed BAA with Paubox AND with Cloudflare
//     (Workers Paid plan) before processing real patient data.
//   • All env vars (PAUBOX_API_KEY etc.) are set per environment
//     in the Cloudflare Pages dashboard, never in code.
// ─────────────────────────────────────────────────────────────

// ─── Constants ────────────────────────────────────────────────
const MAX_FILE_BYTES = 10 * 1024 * 1024;   // 10 MB per file
const MAX_TOTAL_BYTES = 25 * 1024 * 1024;  // 25 MB total (Cloudflare allows up to 100MB)

const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/heic',
  'image/heif',
  'application/pdf',
]);

// File field names we accept and how they're labeled in the email
const FILE_FIELDS = {
  insurance_card_front: { label: 'Insurance card (front)', required: false },
};

const REQUIRED_TEXT = [
  'first_name', 'last_name', 'date_of_birth',
  'insurance_company', 'residence_state', 'member_id', 'phone', 'email',
];

// ─── Handler ──────────────────────────────────────────────────
// `onRequestPost` runs only on POST. Other methods get a default 405.
export async function onRequestPost(context) {
  const { request, env } = context;

  // Env var presence check — fail fast without revealing which one is missing
  const { PAUBOX_API_KEY, PAUBOX_ENDPOINT_USERNAME, PAUBOX_FROM_EMAIL, VOB_RECIPIENT_EMAIL } = env;
  if (!PAUBOX_API_KEY || !PAUBOX_ENDPOINT_USERNAME || !PAUBOX_FROM_EMAIL || !VOB_RECIPIENT_EMAIL) {
    console.error('[send-vob] missing required env vars');
    return jsonResponse({ error: 'server_misconfigured' }, 500);
  }

  let formData;
  try {
    formData = await request.formData();
  } catch (err) {
    // Malformed multipart, payload too large at the platform level, etc.
    console.error('[send-vob] formData parse failed');
    return jsonResponse({ error: 'submission_failed' }, 400);
  }

  // ─── 1. Validate text fields ──────────────────────────────
  const text = {};
  for (const key of REQUIRED_TEXT) {
    const value = sanitize(formData.get(key));
    if (!value) return jsonResponse({ error: 'missing_field', field: key }, 400);
    text[key] = value;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text.email)) {
    return jsonResponse({ error: 'invalid_email' }, 400);
  }
  if (text.first_name.length > 80 || text.last_name.length > 80) {
    return jsonResponse({ error: 'name_too_long' }, 400);
  }

  // ─── 2. Validate + encode files ───────────────────────────
  const collected = [];
  let totalBytes = 0;

  for (const [field, cfg] of Object.entries(FILE_FIELDS)) {
    const raw = formData.getAll(field).filter((v) => v && typeof v === 'object' && 'arrayBuffer' in v);

    if (cfg.required && raw.length === 0) {
      return jsonResponse({ error: 'missing_file', field }, 400);
    }
    if (raw.length > 1 && !cfg.multiple) {
      return jsonResponse({ error: 'too_many_files', field }, 400);
    }

    for (const file of raw) {
      const mime = (file.type || '').toLowerCase();
      if (!ALLOWED_MIME.has(mime)) {
        return jsonResponse({ error: 'unsupported_file_type', field, mimetype: mime }, 400);
      }
      if (file.size > MAX_FILE_BYTES) {
        return jsonResponse({ error: 'file_too_large', field }, 413);
      }
      totalBytes += file.size;
      if (totalBytes > MAX_TOTAL_BYTES) {
        return jsonResponse({ error: 'total_too_large' }, 413);
      }

      const ab = await file.arrayBuffer();
      collected.push({
        field,
        label: cfg.label,
        originalName: sanitizeFilename(file.name || `${field}.bin`),
        contentType: mime,
        bytes: file.size,
        base64: arrayBufferToBase64(ab),
      });
    }
  }

  // ─── 3. Build Paubox payload ──────────────────────────────
  const firstName = text.first_name.trim();
  const lastInitial = (text.last_name.trim()[0] || '').toUpperCase();
  const subject = `New VOB Request - ${firstName} ${lastInitial}`;

  const bodyText = renderTextBody(text, collected);
  const bodyHtml = renderHtmlBody(text, collected);

  let paubox;
  try {
    paubox = await fetch(
      `https://api.paubox.net/v1/${encodeURIComponent(PAUBOX_ENDPOINT_USERNAME)}/messages`,
      {
        method: 'POST',
        headers: {
          // Paubox's documented auth scheme — Token, not Bearer.
          // https://docs.paubox.com/docs/paubox_email_api/authentication
          'Authorization': `Token token="${PAUBOX_API_KEY}"`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            message: {
              recipients: [VOB_RECIPIENT_EMAIL],
              ...(env.VOB_BCC_EMAIL ? { bcc: [env.VOB_BCC_EMAIL] } : {}),
              headers: {
                subject,
                from: `Golden State Rehab <${PAUBOX_FROM_EMAIL}>`,
                'reply-to': PAUBOX_FROM_EMAIL,
              },
              allowNonTLS: false,
              forceSecureNotification: 'false',
              content: {
                'text/plain': bodyText,
                'text/html': bodyHtml,
              },
              attachments: collected.map((a) => ({
                fileName: a.originalName,
                contentType: a.contentType,
                content: a.base64,
              })),
            },
          },
        }),
      },
    );
  } catch (_e) {
    console.error('[send-vob] network error reaching paubox');
    return jsonResponse({ error: 'delivery_failed' }, 502);
  }

  // ─── 4. Inspect Paubox response ───────────────────────────
  if (!paubox.ok) {
    // Diagnostic: log Paubox's response body so we can see exactly why it
    // rejected (e.g. "sender address not authorized", "domain not verified").
    // Paubox error responses don't include PHI — just configuration messages.
    let bodyExcerpt = '';
    try { bodyExcerpt = (await paubox.text()).slice(0, 800); } catch (_e) {}
    console.error(`[send-vob] paubox responded ${paubox.status}: ${bodyExcerpt}`);
    return jsonResponse({ error: 'delivery_failed' }, 502);
  }

  let result;
  try {
    result = await paubox.json();
  } catch {
    console.error('[send-vob] paubox returned non-JSON');
    return jsonResponse({ error: 'delivery_failed' }, 502);
  }
  if (result?.errors?.length) {
    console.error('[send-vob] paubox logical error', { count: result.errors.length });
    return jsonResponse({ error: 'delivery_failed' }, 502);
  }

  return jsonResponse({ ok: true }, 200);
}

// Reject anything other than POST with a clear method-not-allowed.
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
      // No caching for any of these responses.
      'Cache-Control': 'no-store',
    },
  });
}

// Strip control chars + collapse whitespace + cap length. Defends against
// CRLF injection into the email subject/body and runaway-input DoS.
function sanitize(v, maxLen = 500) {
  if (typeof v !== 'string') return '';
  return v
    .replace(/[\x00-\x1F\x7F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen);
}

function sanitizeFilename(name) {
  const base = String(name).split(/[\\/]/).pop() || 'file';
  return base.replace(/[^A-Za-z0-9._-]/g, '_').slice(0, 120) || 'file';
}

// Chunked base64 encoder — avoids the spread-argument limit that would
// blow up `btoa(String.fromCharCode(...new Uint8Array(buf)))` on large files.
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000; // 32KB
  let binary = '';
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderTextBody(t, files) {
  const lines = [
    'New VOB request from goldenstate-rehab.com',
    '',
    `Full legal name:    ${t.first_name} ${t.last_name}`,
    `Date of birth:      ${t.date_of_birth}`,
    `Phone:              ${t.phone}`,
    `Email:              ${t.email}`,
    `State of residence: ${t.residence_state}`,
    `Insurance company:  ${t.insurance_company}`,
    `Member ID:          ${t.member_id}`,
    '',
    'Attachments:',
    ...(files.length ? files.map((f) => `  • ${f.label} — ${f.originalName} (${formatBytes(f.bytes)})`) : ['  (none)']),
    '',
    '— Sent securely via Paubox',
  ];
  return lines.join('\n');
}

function renderHtmlBody(t, files) {
  const row = (k, v) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#7A6A52;font-weight:600;">${escHtml(k)}</td><td style="padding:4px 0;">${escHtml(v)}</td></tr>`;
  const fileLi = (f) =>
    `<li style="margin-bottom:4px;">${escHtml(f.label)} — <code style="background:#FBF6E8;padding:2px 6px;border-radius:4px;">${escHtml(f.originalName)}</code> <span style="color:#7A6A52;">(${formatBytes(f.bytes)})</span></li>`;

  return `<!DOCTYPE html>
<html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#140E04;line-height:1.6;max-width:640px;margin:0 auto;padding:24px;">
  <h2 style="margin:0 0 16px;color:#140E04;">New VOB Request</h2>
  <p style="margin:0 0 16px;color:#7A6A52;">From the Golden State Rehab intake form.</p>
  <table style="border-collapse:collapse;margin-bottom:24px;">
    ${row('Full legal name', `${t.first_name} ${t.last_name}`)}
    ${row('Date of birth', t.date_of_birth)}
    ${row('Phone', t.phone)}
    ${row('Email', t.email)}
    ${row('State of residence', t.residence_state)}
    ${row('Insurance company', t.insurance_company)}
    ${row('Member ID', t.member_id)}
  </table>
  <h3 style="font-size:14px;margin:24px 0 8px;color:#140E04;">Attachments (${files.length})</h3>
  <ul style="padding-left:20px;margin:0;">
    ${files.length ? files.map(fileLi).join('') : '<li style="color:#7A6A52;">None uploaded</li>'}
  </ul>
  <hr style="border:none;border-top:1px solid #E8D5A3;margin:24px 0;">
  <p style="font-size:12px;color:#7A6A52;margin:0;">Sent securely via Paubox · goldenstate-rehab.com</p>
</body></html>`;
}

function formatBytes(b) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}
