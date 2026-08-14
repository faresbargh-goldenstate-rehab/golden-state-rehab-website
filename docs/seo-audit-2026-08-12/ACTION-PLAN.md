# SEO Action Plan — goldenstate-rehab.com (2026-08-12)

Priorities: **Critical** = fix immediately · **High** = within 1 week · **Medium** = within 1 month · **Low** = backlog.
Effort: S (<1h) · M (half day) · L (multi-day).

## Critical — all resolved or retracted as of 2026-08-13

| # | Action | Status |
|---|---|---|
| C1 | Fix `openingHoursSpecification` sitewide: real clinical hours; 24/7 admissions as `ContactPoint` | ✅ **Fixed** before this plan was written (the audit reflected the deployed site, not the repo). Verified: 0 of 101 business-hour blocks still declare 24/7. |
| C2 | Link the site to the Google Business Profile | ✅ **Fixed in code** — GBP CID URL now in `hasMap` + `sameAs` on 99/100 pages. **Still open:** visible "Read all reviews on Google" link + review count on the review wall; GBP dashboard audit (primary category, posts, Q&A) — not auditable from the codebase. |
| C3 | Replace the contact-page map placeholder with a real embedded map | ✅ **Fixed.** Lazy-loaded embed + address caption + driving-directions link on `/contact` and `/es/contact`; verified desktop + mobile, both languages, no overflow. |
| C4 | Reconcile PHP hours copy | ❌ **Retracted — false positive.** Both pages already agree (PHP ≈ 6 hrs/day × 5 days; IOP = 3-hr sessions × 3–5 days). The subagent misattributed the IOP clause to PHP. No change needed. |
| C5 | Fix the broken `.mobile-cta-bar` | ✅ **Fixed — and it was 5 features, not 1.** `main.min.js` ran before the markup it queries, nulling 15 element lookups: sticky CTA bar, quiz FAB, quiz modal, treatment quiz, live ticker. One `defer` attribute on 104 pages fixed all of them; verified live-before/local-after with Playwright, including a nav regression check. |

**Status:** all C1–C5 code changes are committed and pushed on `feat/gbp-linking-eeat`. They are **not yet merged to `main`**, so they are not live on goldenstate-rehab.com — merge the branch, then deploy.

## High (1 week)

| # | Action | Effort |
|---|---|---|
| H1 | ✅ **Done** — `medicalSpecialty` → `["Psychiatric"]` with the term preserved in `knowsAbout` (100 pages, `knowsAbout` newly added to 12); `Person.qualifications` → `description` and `worksFor` → `@id` in `team.html` + `es/team.html`. All 475 JSON-LD blocks still parse. **Remaining:** add `Person.image` (headshots exist on-page) and `Person.sameAs`. | S |
| H2 | De-orphan /programs/outpatient-rehab: add to the /programs/ card grid + footer nav; add hreflang pair (only page without it); plan ES twin | S |
| H3 | Real per-URL sitemap `lastmod` from git (`git log -1 --format=%as -- <file>`); wire into build | S |
| H4 | Publish clinician license numbers (Dr. Chaghouri MD, Ari Labowitz LMFT) with search.dca.ca.gov verify links, instead of "available on request" | S |
| H5 | Add cost-range callout boxes to /programs/php, /programs/outpatient-rehab, /treatments/alcohol reusing the cost-blog numbers ($ ranges + insurance framing) | M |
| H6 | /verify-insurance: move a 3-bullet "How verification works" + "prefer not to type? Call — no name needed" above the form; add "Step 1 of 3" indicator + "~2 minutes" | M |
| H7 | Add CSP header via Cloudflare Transform Rule (Report-Only → enforce) | M |
| H8 | Citations build-out: Psychology Today, SAMHSA Treatment Locator, Healthgrades, Rehab.com/Recovery.org, BBB; add each live profile to `sameAs` | M–L |
| H9 | Expand the 3 sub-1,000-word blog posts toward 1,500+ (cbt-vs-dbt, first-week, terrified-to-ask) | L |

## Medium (1 month)

| # | Action | Effort |
|---|---|---|
| M1 | Performance: self-host Plus Jakarta Sans (subset, 5→3 weights, preload) + metric-matched fallback font (kills the 0.08–0.09 font-swap CLS); inline i18n.js; merge cta.css | M |
| M2 | Compress/resize images: carousel to ~800px + srcset, eric-chaghouri.jpg (135KB→~30KB), review screenshots (~155KB each); add width/height to the popup image | S–M |
| M3 | Publish a dedicated "PHP vs IOP" comparison page (high-intent named query; internal-link from both program pages) | M |
| M4 | Make FAQ questions real `<h3>` headings (match the existing FAQPage JSON-LD) | S |
| M5 | Cloudflare: edge-cache HTML (5–10 min TTL) + enable IndexNow | S |
| M6 | Sitemap: add `xhtml:link` hreflang alternates; consider image extensions for team/facility photos | M |
| M7 | ES parity: strengthen ES footer cross-links (10 pages have ≤2 inlinks); expand es/locations (596w vs 11 EN pages) | M–L |
| M8 | Add an above-the-fold CTA button to inner-page mobile heroes (programs/locations) | S |
| M9 | Byline hygiene: co-byline admissions/billing staff on the two insurance posts (keep MD as clinical reviewer); add Sophia Scharpf bio; add medical-review byline to /verify-insurance + /families | S–M |
| M10 | Off-site entity: create LinkedIn company page; plan one YouTube asset (facility tour or PHP-vs-IOP explainer); add real profiles to `sameAs` | L |
| M11 | Retarget /locations/santa-monica toward "outpatient rehab near Santa Monica"; move trust block + drive-time into hero | M |

## Low (backlog)

- Pursue CARF or Joint Commission accreditation (biggest long-term authority unlock in this vertical).
- Inline the 44 used Lucide icons as SVGs (drop unpkg, 92 KiB).
- Unify `?v=` asset params across pages; document trailing-slash convention.
- /llms-full.txt; plain-language readability pass on treatment/FAQ pages (Flesch 40→55+).
- Video/audio testimonial for program pages + homepage.
- Tap-target sizing pass (nav/footer links to ≥44px).
- Fix 8 meta descriptions outside 70–160 chars (esp. /locations at 18 chars); trim 2 long blog titles.
- Monitor GSC for /espanol vs /es/ cannibalization on "rehab en español" queries.

## Do NOT do

- **Do not add `AggregateRating`/`Review` schema** from the self-collected Google review screenshots — manual-action risk under Google's self-serving reviews policy. Link to the GBP listing instead (C2).
- Do not expand FAQPage schema chasing rich results — commercial sites are ineligible (Aug 2023); existing markup stays for AI-citation value.
- Do not split the 11 location pages into separate LocalBusiness entities — the current single-clinic + `areaServed` model is correct and is what keeps the doorway risk manageable.
