// ─────────────────────────────────────────────────────────────
// /api/send-vob — Golden State Rehab intake/VOB submission
// ─────────────────────────────────────────────────────────────
// Receives multipart form data from the intake form, validates,
// base64-encodes attachments, and forwards to Paubox Email API
// for HIPAA-compliant delivery to Noble Bill.
//
// HIPAA NOTES:
//   • PHI is never logged. Only non-PHI technical metadata.
//   • Temp files are deleted in all code paths (try/finally).
//   • Requires a signed BAA with Paubox before production use.
//   • Requires PAUBOX_API_KEY etc. set as Vercel env vars.
// ─────────────────────────────────────────────────────────────

import { IncomingForm } from 'formidable';
import fs from 'node:fs/promises';

// Tell Vercel not to parse the body — formidable handles multipart itself.
export const config = {
  api: { bodyParser: false },
};

// ─── Constants ────────────────────────────────────────────────
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB per file
const MAX_TOTAL_BYTES = 25 * 1024 * 1024; // 25 MB nominal (Vercel platform may enforce stricter)
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
  insurance_card_front: { label: 'Insurance card (front)', required: true },
  insurance_card_back: { label: 'Insurance card (back)', required: false },
  drivers_license: { label: "Driver's license", required: false },
  additional_documents: { label: 'Additional document', required: false, multiple: true },
};

// Required text fields
const REQUIRED_TEXT = ['first_name', 'last_name', 'date_of_birth', 'insurance_company', 'member_id', 'phone', 'email'];

// ─── Handler ──────────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  // Validate required env vars early. Don't reveal which one is missing in the response.
  const { PAUBOX_API_KEY, PAUBOX_ENDPOINT_USERNAME, PAUBOX_FROM_EMAIL, VOB_RECIPIENT_EMAIL } = process.env;
  if (!PAUBOX_API_KEY || !PAUBOX_ENDPOINT_USERNAME || !PAUBOX_FROM_EMAIL || !VOB_RECIPIENT_EMAIL) {
    console.error('[send-vob] missing required env vars');
    return res.status(500).json({ error: 'server_misconfigured' });
  }

  let tempPaths = [];

  try {
    // ─── 1. Parse multipart ─────────────────────────────────
    const form = new IncomingForm({
      multiples: true,
      maxFileSize: MAX_FILE_BYTES,
      maxTotalFileSize: MAX_TOTAL_BYTES,
      keepExtensions: true,
    });

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    // Collect every parsed file's temp path so we can clean them up in `finally`.
    for (const arr of Object.values(files)) {
      const list = Array.isArray(arr) ? arr : [arr];
      for (const f of list) if (f?.filepath) tempPaths.push(f.filepath);
    }

    // ─── 2. Normalize and validate text fields ──────────────
    const text = {};
    for (const key of REQUIRED_TEXT) {
      const raw = pickFirst(fields[key]);
      const value = sanitize(raw);
      if (!value) {
        return res.status(400).json({ error: 'missing_field', field: key });
      }
      text[key] = value;
    }
    const notes = sanitize(pickFirst(fields.notes) || '', 5000);

    // Basic format checks (light — heavier rules belong in the client too)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text.email)) {
      return res.status(400).json({ error: 'invalid_email' });
    }
    if (text.first_name.length > 80 || text.last_name.length > 80) {
      return res.status(400).json({ error: 'name_too_long' });
    }

    // ─── 3. Validate files ──────────────────────────────────
    const collected = []; // [{ field, label, originalName, contentType, bytes, base64 }]
    let totalBytes = 0;

    for (const [field, cfg] of Object.entries(FILE_FIELDS)) {
      const raw = files[field];
      const list = !raw ? [] : Array.isArray(raw) ? raw : [raw];

      if (cfg.required && list.length === 0) {
        return res.status(400).json({ error: 'missing_file', field });
      }
      if (list.length > 1 && !cfg.multiple) {
        return res.status(400).json({ error: 'too_many_files', field });
      }

      for (const f of list) {
        if (!f) continue;
        const mime = (f.mimetype || '').toLowerCase();
        if (!ALLOWED_MIME.has(mime)) {
          return res.status(400).json({ error: 'unsupported_file_type', field, mimetype: mime });
        }
        if (f.size > MAX_FILE_BYTES) {
          return res.status(413).json({ error: 'file_too_large', field });
        }
        totalBytes += f.size;
        if (totalBytes > MAX_TOTAL_BYTES) {
          return res.status(413).json({ error: 'total_too_large' });
        }

        const buf = await fs.readFile(f.filepath);
        collected.push({
          field,
          label: cfg.label,
          originalName: sanitizeFilename(f.originalFilename || `${field}.bin`),
          contentType: mime,
          bytes: f.size,
          base64: buf.toString('base64'),
        });
      }
    }

    // ─── 4. Build Paubox payload ────────────────────────────
    const firstName = text.first_name.trim();
    const lastInitial = (text.last_name.trim()[0] || '').toUpperCase();
    const subject = `New VOB Request - ${firstName} ${lastInitial}`;

    const bodyText = renderTextBody(text, notes, collected);
    const bodyHtml = renderHtmlBody(text, notes, collected);

    const paubox = await fetch(
      `https://api.paubox.net/v1/${encodeURIComponent(PAUBOX_ENDPOINT_USERNAME)}/messages`,
      {
        method: 'POST',
        headers: {
          // Paubox's official auth scheme is `Token token="API_KEY"`.
          // The original spec said `Bearer` — corrected per Paubox docs
          // (https://docs.paubox.com/docs/paubox_email_api/authentication).
          'Authorization': `Token token="${PAUBOX_API_KEY}"`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            message: {
              recipients: [VOB_RECIPIENT_EMAIL],
              ...(process.env.VOB_BCC_EMAIL ? { bcc: [process.env.VOB_BCC_EMAIL] } : {}),
              headers: {
                subject,
                // Display name shows in most mail clients; the address is the
                // verified Paubox sender (vob@goldenstate-rehab.com by default).
                // reply-to points back to the same address so Noble Bill's
                // replies reach the whole VOB group.
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

    // ─── 5. Handle Paubox response ──────────────────────────
    if (!paubox.ok) {
      // Log only metadata. Body may contain message ID / error reason — log status only.
      console.error(`[send-vob] paubox responded ${paubox.status}`);
      return res.status(502).json({ error: 'delivery_failed' });
    }

    // Paubox returns 200 even on logical errors — inspect data.errors
    let result;
    try {
      result = await paubox.json();
    } catch {
      console.error('[send-vob] paubox returned non-JSON');
      return res.status(502).json({ error: 'delivery_failed' });
    }
    if (result?.errors?.length) {
      console.error('[send-vob] paubox logical error', { count: result.errors.length });
      return res.status(502).json({ error: 'delivery_failed' });
    }

    // Success — return only that, no PHI echo.
    return res.status(200).json({ ok: true });
  } catch (err) {
    // Common formidable errors: maxFileSize, maxTotalFileSize, malformed multipart.
    const code = err?.code || err?.message || 'unknown';
    if (String(code).includes('maxFileSize')) {
      return res.status(413).json({ error: 'file_too_large' });
    }
    if (String(code).includes('maxTotalFileSize')) {
      return res.status(413).json({ error: 'total_too_large' });
    }
    console.error('[send-vob] unexpected error', { code });
    return res.status(500).json({ error: 'submission_failed' });
  } finally {
    // Always remove temp files, even on success.
    await Promise.all(
      tempPaths.map((p) =>
        fs.unlink(p).catch(() => {
          /* swallow — file may already be gone */
        }),
      ),
    );
  }
}

// ─── Helpers ──────────────────────────────────────────────────

function pickFirst(v) {
  if (Array.isArray(v)) return v[0];
  return v;
}

// Strip control chars + collapse whitespace. We're putting these into
// an email subject / body, so we don't want CRLF injection or any
// invisible control characters smuggled through.
function sanitize(v, maxLen = 500) {
  if (typeof v !== 'string') return '';
  return v
    .replace(/[\x00-\x1F\x7F]/g, ' ') // control chars → space
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen);
}

function sanitizeFilename(name) {
  // Keep alphanumerics, dot, dash, underscore. Replace anything else with _.
  // Cap at 120 chars. Strip path traversal.
  const base = String(name).split(/[\\/]/).pop() || 'file';
  return base.replace(/[^A-Za-z0-9._-]/g, '_').slice(0, 120) || 'file';
}

// Escape HTML special chars when injecting user content into HTML body.
function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderTextBody(t, notes, files) {
  const lines = [
    'New VOB request from goldenstate-rehab.com',
    '',
    `Full legal name:    ${t.first_name} ${t.last_name}`,
    `Date of birth:      ${t.date_of_birth}`,
    `Phone:              ${t.phone}`,
    `Email:              ${t.email}`,
    `Insurance company:  ${t.insurance_company}`,
    `Member ID:          ${t.member_id}`,
    '',
    'Notes:',
    notes || '(none)',
    '',
    'Attachments:',
    ...files.map((f) => `  • ${f.label} — ${f.originalName} (${formatBytes(f.bytes)})`),
    '',
    '— Sent securely via Paubox',
  ];
  return lines.join('\n');
}

function renderHtmlBody(t, notes, files) {
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
    ${row('Insurance company', t.insurance_company)}
    ${row('Member ID', t.member_id)}
  </table>
  ${notes ? `<h3 style="font-size:14px;margin:0 0 8px;color:#140E04;">Notes</h3><p style="white-space:pre-wrap;background:#FDFAF5;padding:12px;border-radius:8px;border-left:3px solid #C8A44A;">${escHtml(notes)}</p>` : ''}
  <h3 style="font-size:14px;margin:24px 0 8px;color:#140E04;">Attachments (${files.length})</h3>
  <ul style="padding-left:20px;margin:0;">
    ${files.map(fileLi).join('')}
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
