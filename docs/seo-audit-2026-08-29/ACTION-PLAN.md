# Golden State Rehab — SEO Action Plan

**Audit date:** 2026-08-29 · **Health score:** 77/100 · Companion to `FULL-AUDIT-REPORT.md`

**Status 2026-08-29 (same day):** applied in code — C1 (`_redirects` 301 + `_headers` noindex; files still in the tree, move them out to finish), C2, H1 (hero CTAs on 78 pages: 56 page-hero + 22 blog, EN + ES), H2 (`i18n.min.js` moved above the font/CSS links), H4 (CSP report-only), M1 (`sameAs` ×5). Still open and dashboard-only: C3 (GSC access), H5 (apex HSTS), H8 (review link needs the GBP place ID), H9 (GBP category/pin), H10.

Priorities: **Critical** = blocks indexing / exposure / trust-breaking (fix now) · **High** = materially affects rankings or conversion (≤ 1 week) · **Medium** = optimization (≤ 1 month) · **Low** = backlog. Effort: S ≤ 1 h · M ≤ 1 day · L > 1 day. Every item names the file or dashboard to touch.

## Critical

| # | Action | Where | Effort | Verify |
|---|---|---|---|---|
| C1 | Stop serving internal docs. Add to `_headers`: `/docs/*` and `/*.md` → `X-Robots-Tag: noindex, nofollow`. Then remove `docs/`, root `*.md`, `*.docx`, `*.pdf` planning files from the deployed output (build-step exclude, or move them to a private repo/Drive). `intake-deployment.md` must not stay public. | `_headers`, repo root, `docs/` | S–M | `curl -I https://www.goldenstate-rehab.com/docs/intake-deployment.md` → 404 |
| C2 | Fix `foundingDate: "2026"` in the shared Organization JSON-LD (99 pages) — real founding year or delete the property. | shared schema template / every page `<script type="application/ld+json">` | S | `grep -r '"foundingDate"' . --include='*.html'` |
| C3 | Grant Search Console access to `claude-seo-reader@claude-seo-496120.iam.gserviceaccount.com` (Full) so the next audit gets queries, impressions and index coverage. Also verify the domain in Bing Webmaster Tools. | GSC → Settings → Users; Bing WMT | S | `gsc_query.py sites` lists the property |

## High

| # | Action | Where | Effort | Verify |
|---|---|---|---|---|
| H1 | Add a hero CTA (Verify Insurance + phone) to the program, treatment, location and blog templates — 50 pages currently have none above the fold; on mobile only the thin phone bar is actionable. | `programs/*.html`, `treatments/*.html`, `locations/*.html`, `blog/*.html` hero block (+ `/es/` mirrors) | M | Mobile screenshot of `/programs/php` shows a button above the fold |
| H2 | Make `/js/i18n.min.js` non-blocking: inline it in `<head>` *above* the stylesheet (3 KB) or add `defer`. | all page `<head>`; `js/i18n.js` | S | PSI "eliminate render-blocking" no longer lists it |
| H3 | Un-block the font: self-host Plus Jakarta Sans (variable woff2, `font-display: swap`, `/fonts/*` immutable in `_headers`) or load Google Fonts CSS via `preload as=style` + `onload`. | `<head>` all templates, `css/styles.css` | M | Mobile lab LCP on `/` < 4 s (target < 2.5 s) |
| H4 | Ship a CSP in Report-Only mode; enforce after a clean week. | `_headers` | M | `curl -I` shows `Content-Security-Policy-Report-Only` |
| H5 | Enable HSTS on the apex in Cloudflare (Edge Certificates → HSTS, includeSubDomains, preload). Open since Aug 20. | Cloudflare dashboard | S | `curl -sI https://goldenstate-rehab.com/` shows `strict-transport-security` |
| H6 | Consolidate the cost/insurance cluster: create `/insurance-and-cost` hub (private / Medi-Cal / self-pay + verify CTA); keep the LA price-breakdown and Medi-Cal posts as spokes; 301 or fully re-angle `/blog/how-much-does-rehab-cost`. | new page + `_redirects` + 3 blog posts | L | One URL ranks for "rehab cost insurance california" cluster in GSC |
| H7 | Add visible "Updated {Month YYYY}" (`<time datetime>`) next to the reviewer byline on all 16 EN blog posts (+ ES). | `blog/*.html` byline strip | S | Visible date on every post; matches schema `dateModified` |
| H8 | Add a Google review link + HIPAA-safe request flow (verbal consent, no treatment reference in the ask). Place on `/programs/alumni`, `intake-success.html`, footer. | those files; GBP place ID | S | Link resolves to the write-review dialog |
| H9 | Verify GBP primary category (likely "Addiction treatment center"), copy the exact map pin into schema `geo` (current 34.0447,-118.4308 may be ~500 m off), check photo/Q&A/post cadence. | GBP dashboard; shared schema | S | Manual |
| H10 | Pursue LegitScript certification (required for Google/Meta ads in this vertical; trust signal organically) and confirm/obtain DHCS directory, SAMHSA findtreatment.gov, Psychology Today, BBB listings. | external | L | Listings live; badge on `/license` |

## Medium

| # | Action | Where | Effort |
|---|---|---|---|
| M1 | `sameAs`: add Instagram, LinkedIn, X (already in footer), Facebook, Psychology Today; add NPI as `identifier`. | shared JSON-LD | S |
| M2 | Add a `Physician` entity for Dr. Chaghouri on `/team` with an `@id`; reference it from every `reviewedBy`/`author`. Switch `@type` to `MedicalClinic` sitewide. Add `author.url` on the 7 BlogPosting nodes missing it; restore `image`/`priceRange` on `/families` + `/es/families`. | `team.html`, shared schema, `blog/*`, `es/blog/*`, `families.html` | M |
| M3 | Alt text: `logo-icon.png` (113 pages, one template) and 6 team headshots (`/`, `/team`). | nav partial, `index.html`, `team.html` | S |
| M4 | Replace the language-sniff `location.replace()` in `js/i18n.js` with a dismissible "¿Prefiere español?" banner; keep the stored-preference redirect. | `js/i18n.js` (+ min mirror, bump `?v=`) | M |
| M5 | Unify "Suite 425" → "Ste 425" (44 occurrences in location-page directions blocks). | `locations/*.html`, `es/locations/*.html` | S |
| M6 | Generate sitemap `lastmod` from `git log -1 --format=%cs -- <file>` at build/commit time; 44 `/es/` URLs are 6 weeks stale. | `sitemap.xml` + a script | S |
| M7 | Lower reading level on the first two screens of `/treatments/alcohol` (FK 12.7), `/programs/php` (11.7), `/programs/iop` (10.8); cut ≥8 of 12 em dashes on `/`. | those files | M |
| M8 | Vendor `lucide.min.js` (subset the ~12 icons used) with SRI; drop the unpkg dependency. Remove `swg/publisher.js` from non-blog pages. | `<head>` all templates, `js/` | M |
| M9 | Images: re-encode review screenshots (<40 KB each), team JPGs → webp; de-duplicate the review/team slider markup; PNG logos → SVG/webp; delete ~6 MB of unreferenced `.jpg`/`-1800.png` originals after grep. | `images/`, `index.html` | M |
| M10 | Internal links: add blog links into the 9 treatment and 10 location pages that have none; link `/faq` → blog; add program links to the Medi-Cal post; add call/verify links to `cbt-vs-dbt` and `terrified-to-ask-for-help`; mirror EN inlinks into the 7 low-inlink `/es/` pages. | those pages | M |
| M11 | `/verify-insurance` mobile: shrink H1/top spacing so the first form field lands above the 844 px fold. Add the Google 5.0★ badge to the `/es/` hero for parity. | `verify-insurance.html`, `es/index.html`, CSS (+ min mirror, `?v=`) | S |
| M12 | New pages, in order: `/admissions` (what to expect, first day, who answers the phone); HR/EAP referrer page; carrier pages ×5 (Anthem, Aetna, Cigna, Blue Shield, Kaiser) parented to the insurance post; "PHP vs IOP"; "Detox vs rehab" (educational + referral). Add a one-line telehealth licensure disclosure. | new HTML + sitemap | L |
| M13 | "100+ Recoveries": add a one-line method footnote near the stat (keep the claim). | `index.html`, `es/index.html` | S |
| M14 | Publish `/llms-full.txt` generated from the 70 FAQPage blocks; make the AI-crawler policy explicit in `robots.txt` (block in `reports/seo-geo.md`). | `robots.txt`, build script | S |

## Low

| # | Action | Where |
|---|---|---|
| L1 | Collapse http-apex → https-apex → www into one hop (Cloudflare Redirect Rule). | Cloudflare |
| L2 | Retitle `blog/can-i-work-while-in-rehab.html` so `<title>` ≠ `<h1>`. | that file |
| L3 | Decide and record `/amenity-map` noindex status (Semrush fix 9). | owner decision |
| L4 | IndexNow key file + deploy-time ping after Bing verification. | root + CI |
| L5 | Add `xhtml:link` hreflang to the sitemap (on-page hreflang already complete). | `sitemap.xml` |
| L6 | Translate next: `inpatient-vs-outpatient-rehab`, `do-i-need-rehab`, `questions-to-ask-a-rehab-center`, `can-family-come-to-rehab-visits`, `find-rehab-near-me-los-angeles`. | `es/blog/` |
| L7 | One named local resource + one unique photo per `/locations/*` page. | `locations/*.html`, `images/` |
| L8 | Trim `/license` meta description to ≤160 chars. | `license.html` |
| L9 | Add Moz API key; capture a drift baseline (`drift_baseline.py`); fix `default_property` in `~/.config/claude-seo/google-api.json`. | local config |

## Implementation roadmap

- **Week 1 (Critical + fast High):** C1, C2, C3, H2, H5, H7, H8, H9 — all ≤ 1 h each except C1 (≤ 1 day). Re-run PSI after H2.
- **Week 2–3:** H1 (template CTA), H3 (fonts), H4 (CSP report-only), M1–M6, M11, M13, M14.
- **Month 2:** H6 (insurance/cost hub), M7–M10, M12 (admissions + EAP + carrier pages), H10 (citations/LegitScript — start now, lands over months).
- **Ongoing:** review velocity, blog cadence with visible dates, Spanish translations (L6), quarterly re-audit with GSC + drift baseline.

**Reminder from project memory:** CSS changes only go live via the `styles.min.css` mirror + `?v=` bump on every page.
