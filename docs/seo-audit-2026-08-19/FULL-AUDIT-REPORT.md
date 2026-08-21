# Full SEO Audit — goldenstate-rehab.com

**Date:** 2026-08-19 · **Pages analysed:** 116 HTML files (112 indexable) · **Live host:** Cloudflare Pages
**Prior audit:** [2026-08-13](../seo-audit-2026-08-13/FULL-AUDIT-REPORT.md) (health score 76)

**SEO Health Score: 83 / 100** (+7 vs. 2026-08-13)

Method: full static extraction of every HTML file in the repo (titles, metas, canonicals, hreflang, heading trees, image attributes, JSON-LD, internal link graph — see `findings/pages.json`), plus live `curl` verification of redirects, headers, compression and asset transfer sizes against production, plus five specialist reviews in `findings/`. The repo working tree was clean at audit time, so the files audited are the files deployed.

| Category | Weight | Score |
|---|---|---|
| Technical SEO | 22% | 87 |
| Content Quality | 23% | 84 |
| On-Page SEO | 20% | 88 |
| Schema / Structured Data | 10% | 78 |
| Performance (CWV) | 10% | 76 |
| AI Search Readiness | 10% | 80 |
| Images | 5% | 74 |

---

## Executive Summary

Business type detected: **single-location brick-and-mortar healthcare provider with a service radius** — outpatient addiction and mental-health treatment, 1964 Westwood Blvd Ste 425, Los Angeles. YMYL vertical. Bilingual (English + full Spanish mirror).

This is a well-built site, and the fundamentals are genuinely clean, not merely "no errors found": zero missing or duplicate titles, zero duplicate meta descriptions, zero duplicate canonicals, zero images missing `alt`, zero JSON-LD parse errors, one `<h1>` per page on 115 of 116 pages, and a sitemap that matches the file inventory exactly. Several items from the 2026-08-13 audit have genuinely closed (see below). What remains is a smaller set of specific, mostly structural problems.

The two most consequential findings are not error-class defects. They are (1) a factual claim the site makes about itself that contradicts its other claims, and (2) an information-architecture split that strands the entire Spanish site.

### Top 5 critical / high issues

1. **`foundingDate: "2026"` on 98 pages, shown to users as a "2026 — Founded in Los Angeles" stat card, alongside a "100+ Recoveries" H1 and a Joint Commission gold seal.** A YMYL reader (or quality rater) asks how a clinic founded this calendar year already has full accreditation, a DHCS license and 100+ recoveries. Either date or framing is wrong; both are visible.
2. **The Spanish mirror is link-orphaned from the English site.** Every English page's language switcher points to `/espanol` (113 inbound links) instead of that page's own `/es/` counterpart — while `hreflang` on those same pages declares `/es/…` as the Spanish alternate. Result: **only 2 of the 71 pages outside `/es/` contain any link into `/es/`** — `404.html` and `espanol.html` (itself a Spanish page); no English *content* page links there at all. `/es/` pages sit at click depth 3–5, median inbound links 20 vs. 67 for English, and `es/faq`, `es/about`, `es/our-story`, `es/our-facility` have exactly **1 inbound link each**. The markup and the navigation disagree about which page is the Spanish version.
3. **Organization schema drift under a single shared `@id`.** The full org node is copy-pasted rather than referenced, and the copies have diverged: `image` is `logo-icon.png` sitewide but `og/default.jpg` on all 11 location pages; `areaServed` is 7 cities on the homepage, 12 on location pages, 6 on `es/index.html`; `knowsAbout` is 9 items in English, 4 in Spanish; `foundingDate` present on some pages, absent on location pages. Same `@id`, contradictory facts.
4. **No review path of any kind.** Zero occurrences of `aggregateRating`, `Review` schema, a testimonial block, or a "leave a review" link anywhere in 116 pages — despite real Google reviews evidently existing (three dated captures sit in `Google Review Screenshots/`, unused).
5. **The Lucide icon bundle is 94% of all JavaScript on the site and is the likely main source of layout shift.** 93,639 B pulled from `unpkg.com` on 115 of 116 pages, with no `preconnect` to that origin, replacing 49 empty `<i data-lucide>` placeholders with 24×24 SVGs *after* first paint — and `css/styles.css` has zero `[data-lucide]` sizing rules to reserve the space. Flagged as H2 on 2026-08-13 and unchanged.

Also flagged, outside SEO scope: `amenity-map.html` embeds a Google Maps browser API key in page source. Client-side Maps keys are public by design, but confirm HTTP-referrer restrictions are set on it in the Cloud Console — that is not checkable from the codebase.

### Top 5 quick wins (under an hour each)

1. Add one `[data-lucide]{display:inline-block;width:24px;height:24px}` rule to `styles.css` — removes the icon-swap layout shift today, before the larger Lucide work.
2. Add a `<link rel="preload" as="image" fetchpriority="high">` to the six `.page-hero-bg` pages (`team`, `our-facility`, `our-story` + Spanish twins), pointing at the `-800` variants that already exist unused in the repo. `team.html` currently serves a 217 KB hero when a 53 KB version is deployed alongside it.
3. Point the language switcher at the current page's `/es/` twin instead of `/espanol` (issue 2 above) — one shared nav partial.
4. Add the visible `<span class="review-date">Updated [Month Year]</span>` byline to the 16 blog posts. It exists on every treatment/location/program page but on **0 of 16** posts, so posts read as older than their schema says they are.
5. Fix `index.html`'s `i18n.js?v=2` → `?v=3`, add `programs/outpatient-rehab` and `spanish-speaking-treatment` to `llms.txt`, and add a `Content-Security-Policy` line to the `/*` block in `_headers` (absent from both the file and the live response — flagged H5 on 2026-08-13, still open).

### Since the 2026-08-13 audit

**Closed:** missing `alt` attributes (was 112 missing → now 0); the invalid `medicalSpecialty` enum (now `["Psychiatric"]`); per-URL sitemap `lastmod` (was all `2026-07-07` → now 10 distinct dates); `/programs/outpatient-rehab` orphan status (was 1 inbound → now 40+); broken section-nav `href="/"` links; hreflang coverage.

**Still open:** `foundingDate: "2026"` (M4); no CSP (H5); `i18n.js` render-blocking in `<head>` (H6); conflicting `areaServed` under one `@id` (M2); heading `h2 → h4` skips, 47 pages then, **48 now** (M1); Spanish internal linking depth (M9); the 93.7 KB Lucide bundle from unpkg on 115 pages (H2); responsive hero images — `images/facility/` gained 20 `-800` variants but `images/heroes/` still has **zero** (H2b); no reviews surfaced (H8); no Google Maps `<iframe>` embed (C4 remainder).

---

## Technical SEO — 87

Verified clean and needing no action:

- **Redirects.** Apex `301 → www`; `.html` URLs `308 →` extensionless; `/blog`, `/programs`, `/treatments`, `/es` all `308 →` trailing-slash form; a nonexistent URL returns a true `404` status, not a soft-404.
- **Sitemap.** 112 `<loc>` entries; every one resolves to a real file, and every indexable file appears exactly once. The four excluded files are precisely the four carrying `<meta name="robots" content="noindex">` (`404.html`, `amenity-map.html`, `intake-success.html`, `es/intake-success.html`). All 44 Spanish pages are included.
- **Canonicals.** All 112 indexable pages carry a self-referencing canonical in the extensionless `https://www.` form. Zero cross-page canonicals, zero `.html` canonicals, zero duplicates.
- **hreflang.** Every `en ⇄ es` pair is reciprocal and self-referencing with `x-default`. The 14 pages without hreflang are the 4 noindex pages plus 10 English blog posts that have no Spanish translation — correct to omit.
- **Live headers.** HSTS with `preload`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` all confirmed live. Brotli confirmed. HTTP/2 served, HTTP/3 advertised. The `_headers` cache rules are being honoured (CSS returns `max-age=31536000, immutable`), so the Cloudflare zone is respecting origin headers.

Open findings:

**HIGH — The Spanish mirror is structurally isolated from the English site.**
Measured on the full internal link graph: `/es/` pages have a median of 20 inbound links against 67 for English pages, and `es/about.html`, `es/faq.html`, `es/our-story.html`, `es/our-facility.html`, `es/treatments/cocaine.html`, `es/treatments/prescription-drugs.html`, `es/treatments/sex-addiction.html` and `es/blog/does-medi-cal-cover-rehab-in-california.html` each have exactly one. **Of the 71 pages outside `/es/`, only `404.html` and `espanol.html` contain a link into `/es/`** — no English content page does. The cause is a single line in the shared nav: `<a href="/espanol" class="nav-lang">Español</a>` on every English page, pointing at a standalone Spanish landing page rather than at the current page's `/es/` twin — while the `hreflang` on that same page says `/es/treatments/fentanyl` is the Spanish alternate. Ten `/es/` pages sit at click depth 3, four at depth 4, and six at depth 5 from the homepage.
*Fix:* make the switcher resolve to `/es` + current path (falling back to `/es/` when no twin exists), and keep `/espanol` as a campaign landing page reachable from the `/es/` nav. This does not require changing any canonical or hreflang tag — those are already correct.

**MEDIUM — No `Content-Security-Policy`.** Absent from `_headers` (`grep -ci` returns 0) and absent on the live response. Minimum useful start: scope `script-src` to `'self' https://www.googletagmanager.com https://unpkg.com` and `style-src` to `'self' https://fonts.googleapis.com`, deployed `Report-Only` first.

**MEDIUM — `/js/i18n.js` is render-blocking in `<head>` on all 115 non-noindex pages** (`index.html:42`, no `async`/`defer`), sitting ahead of the render-blocking Google Fonts stylesheet and `css/styles.min.css` in the critical path. The blocking is partly deliberate — the script performs a synchronous `location.replace()` language redirect and blocking avoids a flash of the wrong language. But it costs a full extra round-trip before CSS can even start. At **2,110 bytes over the wire** the payload is trivial; the request itself is the cost. *Fix:* inline the ~15-line redirect decision into `<head>` and move the DOM-wiring half into the already-deferred `main.min.js`. (The 2026-08-13 audit rated this H6/HIGH; downgraded here to MEDIUM on the measured 2.1 KB transfer — it is one RTT, not a payload problem.)

**MEDIUM — Cache-buster version drift.** `index.html` requests `i18n.js?v=2`; the other 114 pages request `?v=3`. The homepage is not serving stale bytes (a different URL is a different cache entry) but it is the one page not pinned to the same version as the rest of the site.

**LOW — `access-control-allow-origin: *`** is present on every live HTML and CSS response. It is a Cloudflare Pages platform default, not set in `_headers`, and harmless for public marketing content — worth confirming it is intentional.

**LOW — `amenity-map.html`** is live at `/amenity-map` (HTTP 200), correctly `noindex`, but ships unrendered Handlebars placeholders (`{{author_url}}`, `{{url}}`, `{{website}}`), has no `<h1>`, no canonical, no meta description, 4 words of text, and all 17 of its images lack `width`/`height`. It is the only page on the site with any images missing dimensions. Either finish it or remove it.

---

## Content Quality — 84

Full assessment in [`findings/content.md`](findings/content.md). The short version: this is materially stronger YMYL content than the vertical norm, and the risk here is a credibility contradiction rather than thin content.

Confirmed strengths (documented so future changes don't erode them): named, credentialed clinicians with license-lookup links on `team.html`; a "Medically reviewed by Dr. Eric Chaghouri, MD" byline plus review date on every clinical page; condition-specific NIDA/CDC/ASAM citations with a visible source list (18 outbound NIDA links, 12 SAMHSA, 9 NIMH, 6 PMC, 5 ASAM); HIPAA and 42 CFR Part 2 confidentiality language; 988 and the SAMHSA helpline in the footer of every page.

**CRITICAL — The founding-date contradiction.**
Verified independently: `"foundingDate": "2026"` appears in Organization JSON-LD in **98 files**, and a visible stat card reading `2026` / "Founded in Los Angeles" appears at [`about.html:198`](../../about.html#L198) and [`our-story.html:230`](../../our-story.html#L230). `our-story.html`'s meta description states the clinic "was founded in 2026." Against that, `index.html:175` carries "100+ Recoveries" in the H1 and the site claims Joint Commission accreditation plus DHCS licence #191643AP.
Today is 2026-08-19. As written, the site says it was founded within the last eight months and has 100+ recoveries and full accreditation. That may be defensible — outpatient programs cycle clients quickly, and an operator can carry accreditation from prior entities — but the site never reconciles it, and a skeptical reader in crisis will notice.
*Fix:* one of two things, not both. Either state the real opening date and reconcile it explicitly ("Since opening in [month] 2026, we've supported 100+ clients through treatment"), or, if 2026 is a build-time placeholder, correct `foundingDate` across the 98 files and the two stat cards to the real year. Do not silently delete the field and leave "100+ Recoveries" unexplained — that removes the evidence, not the question. Note: the "100+ Recoveries" proof number is required to stay in the homepage H1, so the reconciliation must happen on the founding-date side.

**HIGH — One anonymous first-person post is the site's entire "Experience" signal.** `blog/terrified-to-ask-for-help.html` is the only first-person patient account across the 16 posts, bylined "A Golden State Rehab Alum" with a placeholder avatar. Anonymising for HIPAA reasons is correct and expected in this vertical; the problem is volume, not the anonymisation. *Fix:* add a clinical-approval anchor ("reviewed and approved for publication by …") and commission two or three more consented accounts so the first E doesn't rest on a single unverifiable page.

**MEDIUM — Templated blocks dilute the location and treatment pages.**
Measured with 8-word shingle Jaccard similarity over `<main>` only:

| Group | Pages | Mean pairwise similarity | Max pair |
|---|---|---|---|
| `locations/*` | 11 | 0.167 | 0.194 (west-hollywood ↔ west-los-angeles) |
| `treatments/*` | 14 | 0.166 | 0.241 (anxiety ↔ depression) |
| `programs/*` | 9 | 0.149 | 0.252 (group-therapy ↔ individual-therapy) |

These numbers are **low** — this is not swapped-noun programmatic content, and both the content and local reviewers reached the same conclusion after reading pages in full (Santa Monica vs. Venice vs. Beverly Hills have genuinely different driving routes, transit lines, landmarks and framing angles). The residual issue is that the "Levels of Care" 6-card grid and the "Why Golden State Rehab" 3-card grid repeat across all 11 location pages with only cosmetic rewording, adding word count without adding topical coverage. *Fix:* either vary them meaningfully per neighbourhood or collapse them into one honest shared block.

**LOW — Cornerstone blog posts don't answer their title question in the first 60 words.** `blog/do-i-need-rehab.html` spends ~95 words on empathetic scene-setting before the first signal; `blog/how-much-does-rehab-cost.html` puts the actual price ranges behind a link to a companion article. The empathetic lead is good conversion writing for an audience in crisis — the fix is additive, not a rewrite: a "Quick answer" box immediately under the H1 on the four highest-value posts.

**Resolved during this audit:** the content review flagged as unverified whether the "Updated [Month] 2026" bylines were batch-set. They are not uniform — `lastReviewed` takes 14 distinct values across the site (22 pages at `2026-03-01`, 22 at `2026-07-07`, and the rest spread across May–August). Two large same-day clusters are consistent with real batch review passes. No action.

---

## On-Page SEO — 88

Sitewide element health, measured across all 116 files:

| Check | Result |
|---|---|
| Missing `<title>` | 0 |
| Duplicate titles | 0 |
| Titles outside 30–65 chars | 1 (`treatments/index.html`, 68 rendered chars) |
| Missing meta description | 2 (`404.html`, `amenity-map.html` — both noindex) |
| Duplicate meta descriptions | 0 |
| Meta descriptions outside 120–165 chars | 3 (`about.html` 105, `intake-success.html` 90, `treatments/dual-diagnosis.html` 110) |
| Missing canonical | 2 (both noindex) |
| `<h1>` count ≠ 1 | 1 (`amenity-map.html`, zero) |
| Missing viewport | 0 |
| Missing `og:image` | 1 (`404.html`) |
| Missing Twitter card | 4 (all noindex) |
| Orphan pages (0 inbound links) | 2 (`404.html`, `es/intake-success.html`) |

**MEDIUM — 48 pages skip a heading level (`h2 → h4`).** Every `programs/*` and `treatments/*` page plus `index.html` and their Spanish twins jump from an `<h2>` section header straight to `<h4>` cards (e.g. `programs/php.html` "Morning Check-In Group", `treatments/fentanyl.html` "Opioid Addiction"). This was 47 pages on 2026-08-13; it is 48 now. It is primarily an accessibility and document-outline defect rather than a ranking one, but it is systematic and lives in a small number of shared card components.

**MEDIUM — Blog posts are starved of internal links relative to money pages.** Treatment and program pages receive ~68 inbound links each (they are in the nav and mega-menu). Blog posts receive 2–11. The two weakest are `blog/do-i-need-rehab.html` and `blog/find-rehab-near-me-los-angeles.html` at **2 inbound links each** — and "find a rehab near me in Los Angeles" is one of the highest-commercial-intent queries the site could rank for. Treatment, program and location pages do all link to *some* blog post (15/15, 10/10, 11/11), but those links concentrate on a handful of posts. *Fix:* add a contextual "related reading" link from each of the 11 location pages to `find-rehab-near-me-los-angeles`, and from the treatment pages to `do-i-need-rehab`.

**LOW — `espanol.html` absorbs more internal links than the homepage** (113 vs. 70) because it is the target of the sitewide language switcher. Fixing the switcher (Technical, HIGH) redistributes this automatically.

---

## Schema & Structured Data — 78

Full detail in [`findings/schema.md`](findings/schema.md), including ready-to-paste corrected JSON-LD.

The implementation is unusually complete for this vertical: the org node carries `@id`, `logo`, `image`, `telephone`, `email`, `priceRange`, full `PostalAddress`, `geo`, `hasMap`, `areaServed`, `openingHoursSpecification`, `contactPoint`, `medicalSpecialty`, `knowsAbout`, `identifier` (DHCS licence), `hasCredential` (DHCS, LegitScript, Joint Commission) and `sameAs`. Treatment pages correctly use `MedicalCondition` + `MedicalWebPage`; program pages use `MedicalTherapy`; blog posts are `BlogPosting` with `author`, `datePublished`, `dateModified`, `reviewedBy` and `articleSection`. No deprecated types anywhere. No fabricated `AggregateRating` or `Review` — correctly avoided, and it should stay that way.

**CRITICAL — Property drift across copies of one `@id`.** The org node is re-authored in full on 100+ pages instead of referenced, and the copies no longer agree. Verified directly:

| Page | `image` | `areaServed` | `knowsAbout` | `foundingDate` |
|---|---|---|---|---|
| `index.html` | logo-icon.png | 7 cities | 9 | 2026 |
| `treatments/fentanyl.html` | logo-icon.png | 7 | 9 | 2026 |
| `team.html` | logo-icon.png | 7 | 9 | 2026 |
| `locations/santa-monica.html` | **default.jpg** | **12** | 9 | **absent** |
| `locations/venice.html` | **default.jpg** | **12** | 9 | **absent** |
| `es/index.html` | logo-icon.png | **6** | **4** | 2026 |

Any consumer that consolidates by `@id` — Google's Knowledge Graph, GBP entity matching, any RDF store — sees one entity asserting three different service areas and two different images. *Fix:* generate the org and `WebSite` nodes once from a single source of truth and inject them identically, or emit the full definition on one canonical page and reference `{"@id": ".../#organization"}` everywhere else.

**HIGH — No `availableService` on the Organization.** PHP, IOP, telehealth, individual therapy, group therapy and medication management all exist as well-built `MedicalTherapy` pages, but the org node never lists them. This is what tells Google and AI answer engines what the business actually does without inferring it from prose. Paste-ready block in `findings/schema.md`.

**Confirmed correct, do not change:** all 11 neighbourhood pages reuse the same `@id` and the same real street address. There is no fabricated per-neighbourhood `LocalBusiness`. Geo-targeting is done through a distinct `MedicalWebPage.about` (`{"@type":"City","name":"Beverly Hills"}`) per page. That is the right pattern for a single-location clinic with a service radius; converting it to per-neighbourhood business entities would create exactly the doorway/fake-location risk it currently avoids.

**Also confirmed:** `/espanol.html` and `/es/index.html` both reference the same `#organization` and `#website` `@id`s. They are not competing entities at the schema layer. (The problem with those two pages is navigational, not structural — see Technical.)

**MEDIUM:** `sameAs` lists only Google Maps CID, LegitScript and Yelp — no LinkedIn, no Psychology Today. The Medical Director is typed as bare `Person` rather than `["Person","Physician"]`, which loses `medicalSpecialty` and `hospitalAffiliation`. No insurance-network markup despite the PPO names being in FAQ copy. `es/*` `WebSite` nodes omit `inLanguage`. Five of 16 blog posts show `dateModified: 2026-08-19` (today) — worth confirming that is a real edit and not an unconditional build stamp, since Google discounts `dateModified` that doesn't track substantive change.

**INFO — `FAQPage` is on ~50 pages.** Google restricted FAQ rich results to authoritative government and health sites in August 2023, and an independent clinic marketing site should not assume it qualifies. Keep the markup for AI/LLM citation value; do not add it to new pages expecting a SERP feature.

---

## Performance (Core Web Vitals) — 76

**No lab or field CWV measurement was possible in this session.** The keyless PageSpeed Insights API returned HTTP 429 (`quota_limit_value: 0`) and the CrUX API returned 403 without an API key. **This report therefore contains no LCP, INP, CLS, FCP or TBT values, and none were estimated.** Everything below is measured asset/markup analysis or a mechanism identified in code. This category score is the least evidenced number in the report. To get real numbers, supply a Google API key, or run `npx lighthouse https://www.goldenstate-rehab.com/ --preset=perf` locally — Node is available on this machine and needs no quota.

**Delivery is excellent and is not the problem.** Measured over three runs each: TTFB 60–66 ms on `/`, 71–219 ms on `/treatments/fentanyl` (the high reading was a cold edge miss). Brotli on HTML and CSS, HTTP/2 with HTTP/3 advertised, `cf-cache-status: HIT` on both CSS and JS confirming the `_headers` immutable policy is live.

| Homepage critical resource | Wire bytes | Loading |
|---|---|---|
| HTML | 16,344 B | — |
| **`unpkg.com/lucide@1.16.0/…/lucide.min.js`** | **93,639 B** | `defer` |
| `fonts.googleapis.com/css2?…` | 8,460 B | **render-blocking** |
| `css/styles.min.css?v=17` | 12,832 B | **render-blocking** |
| `js/main.min.js?v=8` | 3,886 B | `defer` |
| `js/i18n.js` | 2,185 B | **render-blocking** |

**CRITICAL — Lucide is 94% of all JavaScript on the site and is the likely primary CLS source.** 93,639 B from `unpkg.com` on 115 of 116 pages, with **no `preconnect` to unpkg** (only the two font origins are preconnected), so it pays full DNS + TLS + TCP setup. The site's own first-party JS is ~6 KB. Worse than the bytes: the homepage emits **49 bare `<i data-lucide="…"></i>` placeholders** (32 on `/treatments/fentanyl`), and `css/styles.css` contains **zero `[data-lucide]` sizing rules** — nothing reserves space. After the deferred bundle downloads, parses and runs, `lucide.createIcons()` replaces each empty inline element with a 24×24 `<svg>`, *after first paint*, and several sit above the fold (the nav "Call Now" button, the medical-review byline). This is a mechanism confirmed in both the HTML and the CSS, not a measured CLS value. Flagged as H2 on 2026-08-13 and unchanged.
*Fix (two parts, do the second today):* inline the ~15–20 unique SVGs at build time and drop the unpkg dependency; and as an immediate one-line stopgap, add `[data-lucide]{display:inline-block;width:24px;height:24px}` to reserve the space. An unpkg outage currently breaks every icon on the site.

**CRITICAL — `js/i18n.js` render-blocking, and `defer` is *not* the fix.** It has no `async`/`defer` and sits after the stylesheet link in `<head>` on all 115 non-noindex pages. The blocking is deliberate — the file's own comment says it runs before paint to avoid a flash of the wrong language, and it performs a synchronous `location.replace()`. Deferring it would reintroduce the flash. *Fix:* inline the 2,185 B into `<head>` as a literal `<script>` block. Same semantics, one fewer serialised request ahead of first paint. (The 2026-08-13 audit prescribed `defer` here; that would break the feature.)

**HIGH — Hero background images have no responsive variants.** `.page-hero` sets an inline `background-image` and `css/styles.css:1889` is only `background-size: cover; background-position: center` — no `image-set()`, no media-query override. `images/facility/` gained 20 `-800` variants since the last audit; **`images/heroes/` still has zero.** The same bytes are served to a 390 px phone and a 2560 px desktop: 99,380 B on `/treatments/fentanyl`, 128,944 B for `group-therapy-room.webp` (preloaded on 7 pages). This is the LCP resource on ~70 pages. *Fix:* generate 800w/1200w variants, switch via media-query background overrides, and add `imagesrcset`/`imagesizes` to the existing preload.

**HIGH — Six pages have an unpreloaded hero and are serving a file 3–4× larger than a variant that already exists in the repo.** `team.html`, `our-facility.html`, `our-story.html` and their three Spanish twins set the hero on a nested `.page-hero-bg` child div instead of on `.page-hero` itself, and all six carry **zero** `rel="preload"` tags (verified by enumeration). Their LCP resource is therefore a CSS background image discovered only after CSSOM, behind the render-blocking `i18n.js`. Meanwhile the smaller variants are already built and deployed but unused:

| In use | Measured | Unused variant that exists | Measured |
|---|---|---|---|
| `images/facility/waiting-area.webp` (`team.html`) | 217,412 B | `waiting-area-800.webp` | 52,634 B |
| `images/facility/reception-lobby.webp` | 142,484 B | `reception-lobby-800.webp` | 41,980 B |

The other 70 hero pages already preload correctly. This is the single cheapest high-value performance fix on the site: add one `<link rel="preload" as="image" fetchpriority="high">` per page and point it at the `-800` file for small viewports. Flagged as H2c on 2026-08-13 and still open.

**HIGH — Fonts are cross-origin, render-blocking, and have no fallback metrics.** 8,460 B of blocking CSS from `fonts.googleapis.com`, then a serial hop to `fonts.gstatic.com` for woff2. `css/styles.css` contains **0 `@font-face` and 0 `font-display` declarations** — `display=swap` is set only via the Google Fonts URL, with no `size-adjust`/`ascent-override` fallback tuning. The homepage LCP element is a three-line H1 of text, which is exactly where a font swap reflows the most. Blog pages request a second family (Fraunces, full variable optical-size axis) on top of five Plus Jakarta Sans weights.

**HIGH — `amenity-map.html` is a heavy, half-finished page linked from four real pages** (`our-facility.html`, `locations.html`, and both Spanish twins). Live at 200, 42,572 B, loading Handlebars 4.7.7 from `ajax.googleapis.com` plus the full Google Maps JS API with `libraries=places,geometry`. It is the only page on the site with images missing dimensions (17 of 17), has no `<h1>`, no canonical, no meta description, and ships unrendered `{{author_url}}` / `{{url}}` / `{{website}}` template placeholders.
**Security item flagged here rather than dropped:** the page embeds a Google Maps browser API key in source (`amenity-map.html:931` and `:1131`). Client-side Maps keys are necessarily public, so this is not a leak per se — but it must have HTTP-referrer restrictions applied in the Google Cloud Console or anyone can bill usage against it. Verify that in the console; it is not checkable from the codebase.

**MEDIUM — Oversized above-the-fold logos.** `joint-commission-gold-seal.webp` is 18.7 KB rendered at 20×20 CSS px (~48 bytes per displayed pixel, roughly 40× oversized); `logo-icon.png` is 23.1 KB at 48×48. Both should be SVG, with a 40×40/88×88 raster variant for the seal. The 14 insurance logos load eagerly at 7.5–13.3 KB each (~100 KB total).

**MEDIUM — `images/` is 21 MB on disk but only ~5 MB is referenced.** 36 of 60 `.jpg` files and `joint-commission-gold-seal-1800.png` (893 KB) are referenced nowhere in any HTML, CSS or JS — superseded `.webp` originals still shipping on every deploy. Deploy-size hygiene only; no runtime cost.

**Correcting the prior audit — the insurance-logo dimensions are not a CLS defect.** 980 `<img>` tags declare `width="120" height="40"` against intrinsic aspect ratios of 1.70–5.24, which the 2026-08-13 audit rated H2d/CLS. But `.ins-logo` in `css/styles.css` sets `height: 34px; width: auto; max-width: 114px; object-fit: contain`, and the stylesheet is render-blocking — the declared attributes never govern layout at paint time, so they produce no shift. Still factually wrong and worth correcting, but LOW, not a Core Web Vitals issue.

**Verified clean:** image dimensions are present on 115 of 116 pages (0 missing on the homepage's 41 images); the hero `<h1>` does **not** carry the `.reveal` class, so above-fold content is not gated on JS executing — the most common self-inflicted LCP failure, avoided; deep-page hero backgrounds are correctly preloaded with `fetchpriority="high"` on 70 pages; scroll handlers are rAF-throttled and `{passive: true}`; `.reveal` animates only `opacity`/`transform`, so scroll reveals contribute no CLS; DOM size is 669 elements on the homepage, well under threshold.

Full detail, including per-file byte measurements, in [`findings/performance.md`](findings/performance.md).

---

## AI Search Readiness (GEO) — 80

Full detail in [`findings/geo.md`](findings/geo.md).

Strong baseline: `robots.txt` blocks no AI crawler; the site is fully server-rendered static HTML; `llms.txt` exists and is spec-compliant (H1, blockquote summary, H2 sections, link + description per line) with an unusually good summary line that front-loads the licence number, accreditation, service list and phone; JSON-LD on 112 of 116 pages; DHCS licence and Joint Commission accreditation stated in *visible prose* via the "Claims You Can Check Yourself" pattern on treatment and location pages, not only inside JSON-LD.

**HIGH — Blog posts carry no visible "Updated" date.** Verified: `grep -c review-date blog/*.html` returns **0 for all 17 files in `blog/` (16 posts plus the index)**, while every treatment, program and location page has one. Several posts show a body publish date of June 2026 against a schema `lastReviewed` of 2026-08-19. A human or an AI system reading rendered text perceives this content as two months staler than it is.

**HIGH — Only 11% of H2/H3 headings are question-shaped** (199 of 1,812 sitewide; 59 of 531 English H2s excluding `faq.html`), and nearly all of those come from FAQ accordions. The structural headings that carry the actual answer prose are topic labels or slogans — `treatments/fentanyl.html`'s "Fentanyl Is Different — So Treatment Has to Be", `blog/how-much-does-rehab-cost.html`'s "What actually determines what rehab costs you". Six specific rewrites with the direct-answer sentence to lead each section are in `findings/geo.md`.

**MEDIUM — `llms.txt` gaps.** `programs/outpatient-rehab` (40+ internal links) and `spanish-speaking-treatment` (14) are missing from the index. No `llms-full.txt` companion exists.

**MEDIUM — The two highest-intent blog posts never state the licence or accreditation in body copy.** `how-much-does-rehab-cost.html` and `does-insurance-cover-rehab-in-california.html` are the pages most likely to be an AI answer's source for "is Golden State Rehab legitimate" follow-ups, and they carry the credentials only in sitewide JSON-LD.

Citability spot-scores from pages read in full: `locations/santa-monica.html` 9/10 (the model page — direct answers, real distances, named transit), `does-insurance-cover-rehab-in-california.html` 8/10, `faq.html` and `how-much-does-rehab-cost.html` 7/10, `treatments/fentanyl.html` 6/10 (87-word lead paragraph before any liftable claim).

---

## Local SEO

Full detail in [`findings/local.md`](findings/local.md). Local score 78/100.

**NAP is clean.** No second phone number, no alternate suite, no locality conflict: `+14242083120` in 773 `tel:` links, `(424) 208-3120` in 569 visible strings, `1964 Westwood Blvd, Ste 425, Los Angeles, CA 90025` identical in schema on every page including the Spanish mirror. The only inconsistency is cosmetic — "Suite 425" vs. "Ste 425" in body copy. (The `1-877-696-6775` number on the privacy pages is the HHS Office for Civil Rights line, correctly attributed — not a stray business number.)

**Neighbourhood pages pass the doorway test.** Each has a distinct angle, real routes, and neighbourhood-specific FAQ answers; swapping the city name would produce factually wrong sentences. Unique-text share is roughly 30–35% per page, which is acceptable but leaves no headroom — increase it before adding more neighbourhood pages, not after.

**CRITICAL — There is no review path at all.** Zero matches for `aggregateRating`, `Review`, "testimonial", or "leave a review" across the entire codebase, and zero Google Maps `<iframe>` embeds. Three real GBP review screenshots dated 2026-07-27 sit unused in `Google Review Screenshots/`. *Fix, in order:* (1) add a "Leave us a review" link to the GBP review form — no compliance question, no content to write; (2) add a real Maps `<iframe>` on `locations.html` and `contact.html`; (3) with compliance input, decide whether to surface consented testimonials with a live-synced `aggregateRating`. Do **not** publish the screenshots as content or as schema — reviews of an addiction treatment centre name a health condition, so display requires explicit consent.

**HIGH — Vertical citations are missing.** No on-site evidence of listings on Psychology Today, Healthgrades, BBB, or SAMHSA's FindTreatment.gov provider locator. The site links *out* to SAMHSA 12 times as a resource, which is not the same as being listed in it. LegitScript certification — the one Google Ads requires for rehab advertisers — is present, displayed, and linked for verification.

**Not verifiable from the codebase:** GBP primary category, review count/velocity, Q&A completeness, photo recency, local-pack position, and NAP accuracy on third-party directories. Audit those in the GBP dashboard separately.

---

## Images — 74

| Check | Result |
|---|---|
| Images missing `alt` | **0** (was 112 on 2026-08-13) |
| Images missing `width`/`height` | 17, all on `amenity-map.html` (noindex) |
| Format mix on disk | 77 WebP, 60 JPEG, 18 PNG, 1 SVG |
| References in HTML | 1,838 WebP, 552 PNG, 285 JPEG, 7 SVG |
| `<picture>` elements | 0 |
| `srcset` usage | 48 pages |
| Total `images/` size | 21 MB |
| Unreferenced `.jpg` files | 36 of 60 |

WebP is the dominant served format and alt-text coverage is now complete. The remaining work is the hero-image responsiveness gap and the dead-weight cleanup, both covered under Performance.

---

## Limitations

- No lab or field Core Web Vitals data (PSI quota exhausted, CrUX needs a key). The Performance score is the weakest-evidenced number in this report.
- No Search Console, GA4, or backlink data — no credentials configured. Indexation status, actual query performance and referring-domain profile are unmeasured.
- No live checks against third-party directories (Psychology Today, Healthgrades, SAMHSA locator, BBB) — their absence is inferred from the absence of on-site links, which is suggestive, not conclusive.
- Google Business Profile dashboard state is outside this codebase.
- Readability was not re-measured this round; the 2026-08-13 finding (median Flesch-Kincaid grade 11.5 on clinical pages, target ~8) is carried forward unverified.
