# Intake / VOB Form — Deployment & Operations (Cloudflare Pages)

> ⚠️ **Before going live, the items in [§1 Pre-launch gates](#1-pre-launch-gates) MUST all be done.** This page handles PHI; cutting corners can violate HIPAA and California licensing rules.

## What this is

A custom intake/VOB submission flow on `/verify-insurance` that:

- Collects patient name, DOB, insurance info, contact details, and uploaded documents.
- Compresses image uploads client-side before sending.
- POSTs to `/api/send-vob`, which Cloudflare Pages routes to the function at `functions/api/send-vob.js`.
- The function forwards a HIPAA-compliant email through Paubox to the configured recipient.
- Redirects on success to `/intake-success`.

## Files

| Path | Role |
|---|---|
| [`verify-insurance.html`](../verify-insurance.html) | The intake form page |
| [`intake-success.html`](../intake-success.html) | Animated success page |
| [`js/intake.js`](../js/intake.js) | Client-side form logic + image compression |
| [`css/intake.css`](../css/intake.css) | Intake-specific styles |
| [`functions/api/send-vob.js`](../functions/api/send-vob.js) | Cloudflare Pages Function — talks to Paubox |
| [`.env.example`](../.env.example) | Env var template (no secrets) |

> The repo previously contained `api/send-vob.js`, `package.json`, and `vercel.json` from an earlier Vercel-targeted attempt. Those have been removed — Cloudflare Pages Functions use the Web Standards `request.formData()` API, no npm package needed, no `vercel.json` either.

---

## 1. Pre-launch gates

### 1.1 Paubox account & BAA

- [ ] BAA signed with Paubox (you confirmed this is done).
- [ ] Sending domain (`goldenstate-rehab.com`) verified in Paubox dashboard — SPF, DKIM, return-path CNAME all green.
- [ ] `vob@goldenstate-rehab.com` group set up in Google Workspace and able to receive external email.
- [ ] Note your `PAUBOX_ENDPOINT_USERNAME` from the Paubox dashboard.

### 1.2 Cloudflare account + BAA

Cloudflare offers a BAA on the **Workers Paid plan** ($5/mo). Without a BAA, you should not transmit real PHI through their infrastructure.

- [ ] Cloudflare account created (free).
- [ ] Workers Paid plan enabled ($5/mo). Settings → Workers & Pages → Plans.
- [ ] BAA requested via the Cloudflare dashboard: **Privacy & Security → Business Associate Agreement** (or contact sales@cloudflare.com if not visible — Cloudflare provides BAAs for HIPAA-covered Workers Paid customers).

### 1.3 Migrate DNS to Cloudflare

This is a one-time setup. You'll keep Squarespace as the **domain registrar** (where you bought the name) but switch DNS resolution to Cloudflare.

1. In Cloudflare → **Websites → Add a site** → enter `goldenstate-rehab.com`.
2. Cloudflare scans your existing DNS records (GitHub Pages, MX records for Google Workspace, etc.) and imports them. **Carefully review the imported records before continuing** — especially the MX records for email, otherwise email delivery will break.
3. Cloudflare gives you **2 nameservers** (e.g., `aria.ns.cloudflare.com` + `dan.ns.cloudflare.com`).
4. In Squarespace → **Settings → Domains → goldenstate-rehab.com → DNS Settings** → switch to **Custom Nameservers** → paste Cloudflare's 2 nameservers.
5. Save. Propagation usually takes 5–15 minutes (Cloudflare emails you when complete; max 24h).
6. Back in Cloudflare, confirm the domain shows **Active** under Websites.

> 💡 During propagation, the site stays live on GitHub Pages. Once Cloudflare goes Active, DNS resolves through Cloudflare instead. You can verify with `dig goldenstate-rehab.com NS`.

### 1.4 Connect Cloudflare Pages to the GitHub repo

1. Cloudflare → **Workers & Pages → Create → Pages → Connect to Git**.
2. Authorize Cloudflare to access your `faresbargh-goldenstate-rehab/golden-state-rehab-website` repo.
3. **Production branch:** `main`. **Build settings:** *None* (this is a static site, no build step). Output directory: `/` (repo root).
4. Click **Save and Deploy**. Cloudflare builds and assigns a `*.pages.dev` URL.
5. After the first deploy, go to **Pages project → Custom domains → Set up a custom domain**.
6. Add `www.goldenstate-rehab.com`. Cloudflare auto-creates the CNAME record (because DNS is on Cloudflare now). Wait ~30 seconds for SSL issuance.
7. Optionally also add the apex `goldenstate-rehab.com` and set up a redirect rule from apex → www (Rules → Redirect Rules → New rule).

### 1.5 Disable GitHub Pages

After step 1.4 is live and you've verified `https://www.goldenstate-rehab.com` is being served by Cloudflare:

- [ ] GitHub repo → **Settings → Pages → Source → Deploy from a branch → None** (or just delete the CNAME file from the repo on a follow-up commit).

### 1.6 Set Pages environment variables

In Cloudflare Pages → **your project → Settings → Environment variables**. Add to **Production**:

| Variable | Value |
|---|---|
| `PAUBOX_API_KEY` | (the API key from your Paubox dashboard) |
| `PAUBOX_ENDPOINT_USERNAME` | (from Paubox dashboard) |
| `PAUBOX_FROM_EMAIL` | `vob@goldenstate-rehab.com` |
| `VOB_RECIPIENT_EMAIL` | `fares.bargh@goldenstate-rehab.com` (testing); flip to `VOB@noblebill.com` after E2E confirmation |
| `VOB_BCC_EMAIL` *(optional)* | a HIPAA-safe Golden State internal address for audit trail |

Click **Save**, then trigger a **redeploy** so the function picks them up: Deployments → "..." menu → Retry deployment.

### 1.7 Confirm Paubox auth header format

The function uses `Authorization: Token token="API_KEY"` per [Paubox's official docs](https://docs.paubox.com/docs/paubox_email_api/authentication). If the first test call returns 401, this is the first thing to flip — but it shouldn't.

---

## 2. Local testing (optional)

> 🚫 **Never use real patient data in local development.** Synthetic data only.

Cloudflare Pages Functions can be run locally using **Wrangler**:

```bash
cd golden-state-rehab-website
npm install -g wrangler
cp .env.example .env                       # gitignored
# Edit .env with your real Paubox values + VOB_RECIPIENT_EMAIL = your own email
wrangler pages dev . --compatibility-date=2024-09-01
```

This serves the static site + runs `functions/api/send-vob.js` locally. Open `http://localhost:8788/verify-insurance`.

Wrangler reads env vars from `.env` automatically (no `--env-file` flag needed in recent versions; check `wrangler --version`).

### Test data

Use this fake patient — entirely synthetic, no real PII:

| Field | Value |
|---|---|
| First name | `Testy` |
| Last name | `McTesterson` |
| DOB | `1990-01-15` |
| Phone | `(555) 010-2030` |
| Email | a real address you control |
| Insurance company | `Test Insurance Co.` |
| Member ID | `TEST-12345678` |
| Insurance front | any JPG/PNG/HEIC photo |
| Notes | `This is a test submission — please ignore.` |

### Error paths to test

- Submit with a missing required field → friendly inline error
- Upload a `.txt` or `.docx` file → "isn't a supported file type"
- Upload a > 10 MB file before compression → "is larger than 10 MB"
- Submit with airplane mode just before submit → "couldn't reach our submission service"
- Temporarily blank out `PAUBOX_API_KEY` and restart `wrangler pages dev` → server returns `500 server_misconfigured`, user sees generic friendly error

---

## 3. Promote to production

1. Commit and push to `main`. Cloudflare Pages auto-deploys.
2. Check Pages dashboard → **Deployments** → most recent shows **✓ Success**.
3. Submit one real test from `https://www.goldenstate-rehab.com/verify-insurance` to your own email (still set as `VOB_RECIPIENT_EMAIL`).
4. Verify the success page renders and the email lands at `fares.bargh@goldenstate-rehab.com`.
5. Once everything looks right end-to-end, change `VOB_RECIPIENT_EMAIL` in Pages → Environment variables to `VOB@noblebill.com`. Trigger a redeploy.

---

## 4. Where the API key lives (single source of truth)

| Location | Safe? |
|---|---|
| Cloudflare Pages → Environment Variables (Production) | ✅ |
| `.env` on a developer machine (for `wrangler pages dev`) | ✅ — must be gitignored |
| `functions/api/send-vob.js` source code | ❌ |
| Any `.html`, `.js` file in the browser | ❌ |
| Git commits | ❌ |
| Chat / email / Slack | ❌ |
| `.env.example` | ❌ — variable *name* only, no value |

If a key is ever exposed: rotate in Paubox dashboard, update the Cloudflare env var, redeploy.

---

## 5. HIPAA posture — what the code already does

- **No PHI in logs.** The function logs only status codes and error categories, never patient data or file contents.
- **No persistent storage.** Uploaded files exist as `ArrayBuffer` in function memory for the duration of one request; nothing is written to disk. Memory is freed when the function returns.
- **HTTPS only.** Cloudflare terminates TLS at the edge.
- **Sanitized inputs.** Text fields are stripped of control characters before being placed into the email subject / body — defends against CRLF injection.
- **Restricted MIME types.** Only JPG/JPEG/PNG/HEIC/PDF accepted on both client and server.
- **TLS to Paubox.** Outbound fetch is HTTPS-only; `allowNonTLS: false` set in the message body.

## 6. HIPAA posture — what you still own

- **BAA with Paubox.** ✅ Confirmed signed.
- **BAA with Cloudflare.** Required — on the Workers Paid plan ($5/mo). See §1.2.
- **BAA with Noble Bill's email provider.** When `VOB@noblebill.com` starts receiving real PHI, you need to verify that mailbox is on a HIPAA-covered service (HIPAA-compliant Google Workspace, Microsoft 365 with BAA, or similar).
- **Access controls on `vob@goldenstate-rehab.com`.** The Google group receives reply emails containing PHI — restrict membership and require strong auth.
- **Staff training** on what's in the form and how it's handled.

---

## 7. Known limitations

| Limitation | Mitigation |
|---|---|
| Cloudflare Workers CPU time limit (50ms on Paid plan) | Base64-encoding ~5MB of file data uses ~100ms of CPU. The chunked encoder in the function keeps this within bounds for typical insurance card photos (already compressed client-side to ~500KB each). Stress-test before launch with realistic file sizes. |
| HEIC decoding varies by browser (Safari yes, Chrome/Firefox no) | If client-side compression fails, the original HEIC uploads as-is — Paubox accepts it. |
| No spam protection in v1 | Form is functional but exposed to bot submissions. Add Cloudflare Turnstile when ready (free, native Cloudflare feature — easy add later). |

---

## 8. Future enhancements (not blocking launch)

- **Cloudflare Turnstile** for spam protection. Cloudflare's own product, ~10 min to add.
- **Rate limiting** on `/api/send-vob` via Cloudflare Rate Limiting Rules (free up to 10k requests/month).
- **WAF rules** to block known bot user-agents at the edge before they hit the function.
- **Confirmation email** to the submitter (in addition to the email to Noble Bill).
- **Per-page OG image** for `/verify-insurance` (currently uses the generic logo).
