# Golden State Rehab — Website

Marketing website for Golden State Rehab (West Los Angeles). Static HTML/CSS/JS, deployed to Vercel at [www.goldenstate-rehab.com](https://www.goldenstate-rehab.com).

## Stack

- **Static HTML/CSS/JS** — no framework, no build step.
- **Hosting:** Vercel (clean URLs enabled — `/about` serves `about.html`).
- **Domain:** `www.goldenstate-rehab.com` (see [CNAME](CNAME)).
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
├── sitemap.xml              SEO sitemap
├── robots.txt               Crawler directives
├── vercel.json              Vercel deploy config (cleanUrls, no trailing slash)
├── CNAME                    Custom domain
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

Pushing to `main` triggers a Vercel deployment automatically. The `vercel.json` config is the source of truth for routing rules.
