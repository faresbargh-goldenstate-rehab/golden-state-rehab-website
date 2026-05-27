# Intake / VOB Form — Deployment & Operations

> ⚠️ **Before going live, the items in [§1 Pre-launch gates](#1-pre-launch-gates) MUST all be done.** This page handles PHI; cutting corners can violate HIPAA and California licensing rules.

## What this is

A custom intake/VOB submission flow on `/verify-insurance` that:

- Collects patient name, DOB, insurance info, contact details, and uploaded documents.
- Compresses image uploads client-side to stay under Vercel's request body limit.
- POSTs to `/api/send-vob` (Vercel serverless function).
- Forwards as a HIPAA-compliant email through Paubox to `VOB@noblebill.com`.
- Redirects on success to `/intake-success`.

## Files

| Path | Role |
|---|---|
| [`verify-insurance.html`](../verify-insurance.html) | The intake form page |
| [`intake-success.html`](../intake-success.html) | Animated success page |
| [`js/intake.js`](../js/intake.js) | Client-side form logic + image compression |
| [`css/intake.css`](../css/intake.css) | Intake-specific styles |
| [`api/send-vob.js`](../api/send-vob.js) | Vercel serverless function — talks to Paubox |
| [`package.json`](../package.json) | Declares `formidable` for the function |
| [`.env.example`](../.env.example) | Env var template |

---

## 1. Pre-launch gates

### 1.1 Paubox account & BAA

- [ ] BAA signed with Paubox (you confirmed this is done).
- [ ] Sending domain (`goldenstate-rehab.com`) verified in Paubox dashboard — SPF, DKIM, return-path CNAME all green.
- [ ] `intake@goldenstate-rehab.com` mailbox exists (or another verified sender that you prefer).
- [ ] Note your `PAUBOX_ENDPOINT_USERNAME` from the Paubox dashboard (usually matches the domain).

### 1.2 Rotate the exposed API key

- [ ] **Revoke** the key `5d35e7b2af1a3b7e00670452ea6a40bb56c118aa` in the Paubox dashboard. It was pasted in chat and must be assumed compromised.
- [ ] Generate a **new** API key in Paubox.
- [ ] Never paste API keys into chat, commits, or any client-side code again.

### 1.3 Vercel environment variables

Set these in the Vercel dashboard → Project → Settings → Environment Variables. Apply to **Production** and **Preview** environments at minimum:

| Variable | Value |
|---|---|
| `PAUBOX_API_KEY` | (the new key from §1.2) |
| `PAUBOX_ENDPOINT_USERNAME` | (from Paubox dashboard) |
| `PAUBOX_FROM_EMAIL` | `intake@goldenstate-rehab.com` |
| `VOB_RECIPIENT_EMAIL` | `VOB@noblebill.com` |
| `VOB_BCC_EMAIL` *(optional)* | a HIPAA-safe Golden State address for audit trail; omit if not wanted |

After saving, **redeploy** so the function picks up the new env vars.

### 1.4 Confirm Paubox auth header format

The Paubox docs use `Authorization: Token token="API_KEY"`. The original spec mentioned `Bearer` — the code uses the official Paubox format. If the first test call returns `401`, log into Paubox docs and confirm; flip the format in `api/send-vob.js` if needed.

---

## 2. Local testing (with fake patient data only)

> 🚫 **Never use real patient data in local development.** Use synthetic data only.

### 2.1 Install dependencies

```bash
cd golden-state-rehab-website
npm install
```

### 2.2 Set local env vars

```bash
cp .env.example .env.local
# Edit .env.local with your real Paubox values for testing.
# .env.local is gitignored.
```

### 2.3 Run with Vercel CLI

```bash
npm install -g vercel
vercel dev
```

This serves the static site and runs the `/api/send-vob` function locally with your `.env.local` values. Visit `http://localhost:3000/verify-insurance`.

### 2.4 Test data

Use this fake patient for end-to-end testing — entirely made up, no real PII:

| Field | Value |
|---|---|
| First name | `Testy` |
| Last name | `McTesterson` |
| DOB | `1990-01-15` |
| Phone | `(555) 010-2030` |
| Email | a real address you control, so you can verify the response email |
| Insurance company | `Test Insurance Co.` |
| Member ID | `TEST-12345678` |
| Notes | `This is a test submission — please ignore.` |
| Insurance front | any JPG/PNG/HEIC photo (e.g., a screenshot) |

Expected outcome:

- Form submits without error
- Redirect to `/intake-success` with animated check
- Noble Bill's inbox receives an email with subject `New VOB Request - Testy M`
- Attachment(s) viewable inside the email

### 2.5 Error paths to test

- Submit with a missing required field → friendly inline error
- Upload a `.txt` or `.docx` file → "isn't a supported file type"
- Upload an image > 10 MB before compression → "is larger than 10 MB"
- Submit with no internet (toggle airplane mode just before submit) → "couldn't reach our submission service"
- Temporarily blank out `PAUBOX_API_KEY` in `.env.local` and restart `vercel dev` → server returns `500 server_misconfigured`, user sees generic friendly error

---

## 3. Deploy to production

1. Commit and push to `main`. Vercel auto-deploys.
2. After deploy, open the Vercel **Functions** tab and confirm `/api/send-vob` is listed.
3. Submit one real test from production to a Noble Bill test address (or your own address), then update the recipient to `VOB@noblebill.com` once confirmed.
4. Verify the success page renders and the email lands.

---

## 4. Where the API key lives (single source of truth)

| Location | Safe to put the key? |
|---|---|
| Vercel Environment Variables (Production scope) | ✅ Yes |
| `.env.local` on a developer machine | ✅ Yes — gitignored |
| `api/send-vob.js` source code | ❌ Never |
| Any `.html`, `.js` file in the browser | ❌ Never |
| Git commits | ❌ Never |
| Chat / email / Slack | ❌ Never |
| `.env.example` | ❌ Only the variable *name*, no value |

If a key is ever exposed: rotate immediately in the Paubox dashboard, then update the Vercel env var and redeploy.

---

## 5. HIPAA posture — what the code already does

- **No PHI in logs.** The function logs only status codes and error categories, never patient data or file contents.
- **No persistent storage.** Uploaded files live in `/tmp` on the Vercel function only for the duration of the request; the function deletes them in a `finally` block.
- **HTTPS only.** Vercel terminates TLS at the edge. There's no plaintext path.
- **Sanitized inputs.** Text fields are stripped of control characters before being placed into the email subject / body.
- **Restricted MIME types.** Only JPG/JPEG/PNG/HEIC/PDF are accepted on both client and server.
- **Encrypted in transit.** Paubox encrypts the message body and attachments end-to-end via TLS; no in-transit plaintext.

## 6. HIPAA posture — what you still own

- **BAA with Paubox.** ✅ You confirmed signed.
- **BAA with Vercel.** Vercel offers BAAs on Enterprise plans. On Hobby/Pro, file contents only touch RAM in the function (no logs, no persistent storage) — but you should sign a Vercel BAA or migrate the function to Cloudflare Pages (also BAA-eligible) before scale.
- **BAA with Noble Bill's email provider.** Noble Bill needs HIPAA-safe email reception — if `VOB@noblebill.com` is on Gmail/Outlook without a BAA, that's a downstream gap you'd want to verify with them.
- **Access controls on `VOB@noblebill.com`.** That mailbox now receives PHI — strong auth + restricted access.
- **Train staff** on what's in the form and how it's handled.

---

## 7. Known limitations

| Limitation | Mitigation |
|---|---|
| Vercel serverless functions cap request bodies at ~4.5 MB | Client-side image compression keeps real uploads well under this. Total client-side cap is 4 MB. |
| HEIC decoding varies by browser (Safari yes, Chrome/Firefox no) | If decode fails, the original HEIC is uploaded as-is — Paubox accepts it. |
| No spam protection in v1 | Form is functional but exposed to bot submissions. Add Cloudflare Turnstile when ready (free, free to enable). |
| Function logs go to Vercel | Only non-PHI metadata is logged, but if you want centralized HIPAA-safe logging, route to a BAA-covered log aggregator. |

---

## 8. Future enhancements (not blocking launch)

- **Cloudflare Turnstile** for spam protection (~30 min of work; free).
- **Rate limiting** on `/api/send-vob` (e.g., 5 submissions / hour per IP).
- **Optional BCC** to a Golden State internal mailbox for audit — already supported via `VOB_BCC_EMAIL` env var, just uncomment in `.env`.
- **Per-page OG image** for `/verify-insurance` (currently uses the generic logo).
- **Confirmation email** to the submitter (in addition to the email to Noble Bill).
