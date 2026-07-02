# Golden State Rehab — Website

Marketing website for Golden State Rehab (West Los Angeles) with a HIPAA-conscious intake/VOB submission flow at [www.goldenstate-rehab.com](https://www.goldenstate-rehab.com).

## Stack

- **Static HTML/CSS/JS** — no framework, no build step.
- **Hosting:** Cloudflare Pages (static site + Pages Functions for the `/api/send-vob` backend). Migrated from GitHub Pages to enable the HIPAA-compliant intake form — see [docs/intake-deployment.md](docs/intake-deployment.md).
- **Domain:** `www.goldenstate-rehab.com` (registered at Squarespace, DNS on Cloudflare).
- **HIPAA email:** Paubox Email API — see [functions/api/send-vob.js](functions/api/send-vob.js).
- **Icons:** Lucide via CDN.
- **Fonts:** Google Fonts (loaded per-page in `<head>`).

## Project layout

```
.
├── index.html               Landing page
├── about.html               About / clinical leadership
├── our-story.html           Founder story
├── our-facility.html        Facility tour
├── team.html                Team bios
├── contact.html             Contact + intake form
├── verify-insurance.html    Insurance verification
├── faq.html                 FAQ
├── privacy-policy.html      Privacy policy (canonical)
├── terms-and-conditions.html
├── programs/                Program pages (PHP, IOP, telehealth, etc.)
├── treatments/              Condition pages (alcohol, opioid, anxiety, etc.)
├── css/                     Stylesheets (source + minified)
├── js/                      Client scripts (source + minified)
├── images/                  Logos and photography
│   ├── facility/            On-site facility photos
│   └── insurance/           Insurance carrier logos
├── docs/                    Internal documentation (not deployed)
│   ├── design-guidelines.md Premium design system reference
│   ├── seo-audit-report.md  SEO audit notes
│   └── legacy/              Outdated drafts kept for history
├── functions/               Cloudflare Pages Functions (backend)
│   └── api/send-vob.js      Receives intake form, sends via Paubox
├── sitemap.xml              SEO sitemap
├── robots.txt               Crawler directives
├── .env.example             Env var template for the backend (no secrets)
├── CNAME                    Custom domain (vestigial from GitHub Pages — kept harmless under Cloudflare)
└── Claude.md                Frontend Architect prompt for AI-assisted edits
```

## Local development

No build tools required — open any HTML file in a browser, or serve the directory:

```bash
# Python
python3 -m http.server 8000

# Node
npx serve .
```

Navigate to `http://localhost:8000`.

## Editing conventions

- **Internal links use clean URLs** (no `.html` extension): `<a href="/about">`, not `<a href="/about.html">`. Vercel resolves the file via `cleanUrls: true`.
- **Images** referenced from HTML at the repo root use relative paths like `images/facility/reception-lobby.jpg`.
- **Icons** are Lucide — `<i data-lucide="arrow-right"></i>` plus `lucide.createIcons()` after DOM ready.
- **Don't reintroduce** `Inter`, `Roboto`, or pure `#FFFFFF` + generic blue — see [docs/design-guidelines.md](docs/design-guidelines.md).
- The repo is committed with no `.DS_Store`, `node_modules/`, `.vercel/`, or local env files — see [.gitignore](.gitignore).

## Deploy

Pushing to `main` triggers a Cloudflare Pages deployment automatically (static files + the `functions/api/send-vob.js` Pages Function). Environment variables for the backend (`PAUBOX_API_KEY`, etc.) are managed in the Cloudflare Pages dashboard, never in code or git.

## CRM lead forwarding

After the Paubox VOB email sends, `send-vob.js` also forwards the intake to the CRM (`CRM_INTAKE_URL`) so it creates a structured lead + VOB request. This requires two extra Pages env vars: `CRM_INTAKE_URL` and `CRM_INTAKE_SECRET` (the latter must equal the CRM's `INTAKE_SUBMIT_SECRET`). The forward runs in the background via `context.waitUntil` — if the CRM is unreachable it is logged (status code only, no PHI) and **never** blocks or fails the visitor's submission. Leave both env vars blank to skip the forward entirely.

For the full intake-form deployment + HIPAA checklist, see [docs/intake-deployment.md](docs/intake-deployment.md).
