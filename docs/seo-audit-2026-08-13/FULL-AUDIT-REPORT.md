# Full SEO Audit — goldenstate-rehab.com

**Date:** 2026-08-13
**Target:** `https://www.goldenstate-rehab.com` (apex 301s to www — correct)
**Business type detected:** Local Service — healthcare, brick-and-mortar outpatient clinic (YMYL)
**Scope:** 136 URLs fetched, 102 HTML pages analysed (EN + ES), live production site

---

## Executive Summary

### SEO Health Score: **76 / 100**

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Technical SEO | 22% | 84 | 18.5 |
| Content Quality | 23% | 78 | 17.9 |
| On-Page SEO | 20% | 76 | 15.2 |
| Schema / Structured Data | 10% | 68 | 6.8 |
| Performance (CWV) | 10% | 62 | 6.2 |
| AI Search Readiness | 10% | 74 | 7.4 |
| Images | 5% | 80 | 4.0 |
| **Total** | **100%** | | **76.0** |

This is a genuinely well-built site. The crawl is clean in ways most sites are not: **zero 404s, zero redirect chains, zero broken internal links, zero orphan pages, zero duplicate titles, zero duplicate meta descriptions, zero duplicate H1s, zero missing canonicals, and all 102 pages carry valid JSON-LD** (465 blocks, 0 parse failures). The E-E-A-T work is better than most competitors in this vertical.

The score is held down by a small number of specific, individually fixable defects — not by systemic weakness.

### The single most important finding

**Five commits of SEO fixes are sitting in the repo, committed but never deployed.** 105 files, 2,832 insertions. The live site is running the pre-fix code. Several issues in this report — including two of the five Criticals — already have working fixes written and waiting.

Verified live-vs-repo deltas:

| Fix | Live | Repo |
|---|---|---|
| `defer` on `main.min.js` | absent | present |
| GBP CID in `hasMap`/`sameAs` | 0 pages | 102 pages |
| Real clinical hours in `openingHoursSpecification` | 24/7 on 101 pages | Mon–Sat business hours; 24/7 moved to `ContactPoint` |
| `medicalSpecialty` valid enum | `["Psychiatric","Addiction Medicine"]` | `["Psychiatric"]` |
| Map embed on `/contact` | 0 iframes | 1 iframe |
| hreflang on `/programs/outpatient-rehab` | 0 tags | 2 tags |

**Deploying is the highest-leverage action available and costs nothing but a release.**

### Top 5 Critical Issues

1. **The mobile sticky CTA bar, quiz FAB, and live ticker are all dead on the live site.** `main.min.js` executes at line 691 but queries markup that doesn't appear until lines 826–858. Every lookup returns null and the code early-returns silently — which is why there are *zero* console errors masking it. Verified across scroll positions: the CTA bar sits permanently at `translateY(82.5px)`, entirely below the viewport. On a site whose primary conversion is a phone call, the persistent mobile call bar never appears. **Fix exists in the repo (`defer`); ship it.**
2. **101 of 102 pages declare the clinic open 00:00–23:59, seven days a week.** A literal 24/7 claim for an outpatient PHP/IOP program. For a YMYL healthcare business this is a factual-accuracy and trust liability, and it conflicts with whatever hours the Google Business Profile shows. **Fix exists in the repo; ship it.**
3. **Broken section navigation on 25 pages.** On all 10 `/programs/*` and 15 `/treatments/*` pages, the active nav item and the "All Programs"/"All Treatments" dropdown links point to `href="/"` instead of the section hub. A visitor on `/programs/php` who clicks "Programs" to compare against IOP lands on the homepage. **This bug is present in the repo too — deploying does *not* fix it.**
4. **No technical linkage of any kind between the website and a Google Business Profile.** Not in schema `sameAs`, not as a visible link, not as a map embed. There is no true Google Maps embed anywhere on the site — the only two iframes point at a same-origin `/amenity-map.html`. For a local healthcare business this is the largest single ranking lever left untouched.
5. **Mobile performance is Poor on every tested page.** Lab LCP 3.7–5.0 s (mobile) vs 0.8–1.3 s (desktop). Two measured causes: **923 KB of raw JavaScript parsed per page, 97.5% of it third-party** (gtag 498 KB + the entire Lucide icon library 392 KB, for a median 31 icons), and **hero images served at 1600 px into a 320–420 px band** on 76 pages, where a CSS background makes `srcset` impossible. Note that TTFB is not the problem — measured at 37–51 ms.

### Top 5 Quick Wins

1. **Deploy the pending commits.** Resolves Criticals #1 and #2 plus the invalid schema enum, the missing map embed, and the missing hreflang. Effort: one release.
2. **Fix the 25 nav links** from `href="/"` to `href="/programs/"` / `href="/treatments/"` in the shared nav partial. Effort: <1 h.
3. **Replace the Lucide CDN bundle with inlined SVG** for the 97 icons actually used. Removes 93,699 B of transfer, 401,894 B of parse, a third-party origin, and a post-load DOM mutation pass. Effort: half day.
4. **Six sub-15-minute fixes worth ~530 KB:** preload the hero on the 6 pages that don't (`/team` is a 217 KB miss); align the homepage's asset query strings so it stops re-downloading byte-identical CSS on the first internal click; swap `/team`'s JPEG portraits for the WebP versions already sitting unused on the server; lazy-load the homepage insurance logos; downscale the three review screenshots; make blog cover images LCP-eligible.
5. **Add 112 missing `alt` attributes** (7 on the homepage alone). Effort: 1–2 h.

---

## Technical SEO — 84/100

### Clean (verified across all 102 pages)

- **robots.txt**: `User-agent: * / Allow: /` plus sitemap reference. Nothing blocked.
- **Canonicals**: 102/102 present, self-referencing, absolute, trailing-slash consistent. Zero mismatches.
- **Indexability**: zero `noindex`/`nofollow`. All pages `index, follow, max-image-preview:large, max-snippet:-1`.
- **Crawl health**: 136 URLs fetched, **all HTTP 200**. Zero 404s, zero redirect chains, zero broken internal links.
- **URL canonicalization**: bare paths (`/treatments`) 308-redirect to the trailing-slash canonical. Correct.
- **Security headers**: HSTS, X-Content-Type-Options, Referrer-Policy, X-Frame-Options, Permissions-Policy — present and consistent on 102/102.
- **Mobile**: correct viewport meta on 102/102.
- **Rendering**: fully server-rendered. No CSR framework markers; full content visible with JS disabled. This is a significant asset for both crawlers and AI agents.
- **hreflang**: 90 pages carry correct reciprocal `en`/`es`/`x-default` triples. Zero non-reciprocal pairs, zero broken targets.

### Issues

| Severity | Issue | Evidence |
|---|---|---|
| **High** | No Content-Security-Policy on any page — notable for a YMYL healthcare site loading third-party JS (GTM, unpkg) | 0/102 pages carry CSP |
| **High** | `/js/i18n.js?v=2` loads synchronously in `<head>` — render-blocking on every page | 5,656 B raw, no `defer`/`async` |
| **Medium** | `main.min.js` not deferred → see Critical #1 | fix in repo, undeployed |
| **Medium** | HTML not edge-cached — every request hits origin | `cache-control: max-age=0, must-revalidate`, `cf-cache-status: DYNAMIC` |
| **Medium** | `/programs/outpatient-rehab` is the only page site-wide with **zero** hreflang tags | fix in repo, undeployed |
| **Low** | `apple-touch-icon.png` served uncached | all other images cache 30 days |

Static assets are well configured — CSS/JS all `max-age=31536000, immutable`. HTTP/2 with 103 Early Hints is in use.

---

## Content Quality — 78/100

### E-E-A-T: the strongest part of this site

- **All 23 clinical pages** (14 `/treatments/*` + 9 `/programs/*`) carry a visible "Medically reviewed by Dr. Eric Chaghouri, MD — Medical Director" byline with a review date, backed by matching `MedicalWebPage` JSON-LD with `lastReviewed` and a `reviewedBy` Person tied to `#organization`. Visible byline *and* schema — not schema-only.
- **Named credentials with specificity**: six staff with title and credential (MD, Keck School of Medicine USC; LMFT; RADT; AMFT). One entry is tagged "Person in Long-Term Recovery" — a genuine lived-experience signal that the Sept-2025 QRG rewards explicitly.
- **Real source citations** on all 14 treatment pages: NIDA and SAMHSA, as outbound links, not name-drops.
- **DHCS license #191643AP** displayed in three places with an outbound link to the actual state licensing lookup. Most competitors claim a number without a verification route.
- **Crisis resources sitewide**: medical disclaimer plus 988 and SAMHSA helpline in every page footer.

### Measured content health

- Body word count (nav/header/footer excluded): **median 905 words**. Only 2 pages under 300: `/contact` (237) and `/es/contact` (269).
- **Template duplication is healthy, not spammy.** 8-gram shingle overlap against sibling pages:
  - `/locations/*` (11 pages): 21.8–29.5% duplicated → **70–78% unique per city**
  - `/treatments/*` (14 pages): 5.1–21.5% duplicated
  - `/programs/*` (9 pages): 7.0–26.8% duplicated
  Location pages carry genuinely distinct driving directions, named landmarks, and per-city FAQ sets. They pass the doorway-page swap test.
- **Spanish translation is complete.** 0 of 44 ES pages contain leftover English UI strings.

### Issues

| Severity | Issue | Evidence |
|---|---|---|
| **High** | **Readability is too advanced for the audience.** Median Flesch-Kincaid grade **11.5**; 50 of 58 EN pages above grade 10. Treatment pages are worst: `/treatments/meth` 15.3, `/treatments/fentanyl` 14.3, `/treatments/complex-trauma` 14.2 | target for someone in crisis is ~grade 8; blog posts already hit 5.1–7.8, so the house style can do it |
| **Medium** | FAQ questions are `<button>` elements, not real headings — weakens heading-based parsing and screen-reader navigation | `FAQPage` schema compensates for machines, not for document structure |
| **Medium** | Uniform `lastmod` of `2026-07-07` on all 102 sitemap URLs, including legal pages — a build stamp, not a freshness signal | fix in repo, undeployed |
| **Medium** | `"foundingDate": "2026"` — same year as the audit, on a site claiming "100+ Recoveries" | reads as a template placeholder |
| **Medium** | 2 thin pages: `/contact` 237 w, `/es/contact` 269 w. `/programs/` hub at 454 w is below a service-hub floor | |
| **Low** | No `<main>` landmark on inner-page templates | homepage has one |

---

## On-Page SEO — 76/100

### Perfect metadata hygiene

| Check | Result |
|---|---|
| Missing titles | **0** |
| Duplicate titles | **0** |
| Titles > 60 chars | 2 |
| Missing meta descriptions | **0** |
| Duplicate meta descriptions | **0** |
| Descriptions outside 70–160 chars | **0** |
| Missing H1 | **0** |
| Multiple H1 | **0** |
| Duplicate H1 | **0** |
| Missing canonical | **0** |
| Missing `og:image` | **0** |

### Internal link architecture — strong

- **Zero orphans.** Minimum inlink count is 1; median 44; max 101.
- **Zero unreachable pages.** Click depth from homepage: 1 click → 39 pages, 2 → 39, 3 → 14, 4 → 6, 5 → 3.

### Issues

| Severity | Issue | Evidence |
|---|---|---|
| **Critical** | 25 pages send their active-section nav link and dropdown "All X" link to `href="/"` | 10 Programs + 15 Treatments pages; ES equivalents are correct (`/es/programs/`) |
| **Medium** | 47 pages skip a heading level (h2 → h4) | includes homepage and all program/treatment pages |
| **Medium** | ES section is under-linked: 9 pages sit at depth 4–5; `/es/faq`, `/es/our-facility`, `/es/our-story` have 1 inlink each | |
| **Medium** | `/programs/outpatient-rehab` is the weakest page site-wide: 1 inlink, no hreflang, no ES twin | |
| **Low** | 14 EN pages have no ES twin (11 location pages + `/espanol`, `/spanish-speaking-treatment`, `/programs/outpatient-rehab`) | ES→EN direction is complete: 0 gaps |

---

## Schema & Structured Data — 68/100

**465 JSON-LD blocks across 102 pages. Zero parse failures. Every page has structured data.** Type coverage is genuinely rich: `MedicalOrganization`, `LocalBusiness`, `MedicalWebPage` (43), `FAQPage` (59, with 355 Question/Answer pairs), `BreadcrumbList` (100), `BlogPosting` (24), `Person` (80), `EducationalOccupationalCredential` (208).

Notably, there is **no `aggregateRating`/`Review` markup anywhere** — which is correct, since there are no visible on-page reviews to substantiate it. No penalty risk.

### Issues

| Severity | Issue | Detail |
|---|---|---|
| **Critical** | 24/7 opening hours on 101/102 pages | `dayOfWeek: [Mon…Sun], opens: "00:00", closes: "23:59"` — fix in repo, undeployed |
| **High** | Invalid `medicalSpecialty` enum on 101 pages | `"Addiction Medicine"` is not a member of schema.org's `MedicalSpecialty` enumeration (verified against the live schema.org vocabulary). Repo already corrects this to `["Psychiatric"]` with the term preserved in `knowsAbout` |
| **Medium** | `areaServed` conflicts for the same `@id` | homepage declares 7 cities; location pages declare 12 — same `#organization` node, two different service areas |
| **Medium** | Organization `@id` fragmented | `locations.html` / `es__locations.html` use `#clinic` instead of `#organization` |
| **Medium** | `WebSite` node missing on 7 pages, with a dangling `isPartOf` reference on `families.html` / `es__families.html` | |
| **Medium** | `families.html` / `es__families.html` re-declare `#organization` with 4 properties instead of ~18 | |
| **Medium** | Wrong LocalBusiness subtype | uses `["MedicalOrganization","LocalBusiness"]`; `MedicalClinic` is the documented rich-result-eligible subtype |
| **Medium** | No `Service` type anywhere despite a services-based business | |
| **Low** | `hasMap` uses an address-search URL, not a Place-ID URL | |
| **Low** | Geo coordinates at 4-decimal precision (~11 m); 5 recommended for a suite address | `34.0447, -118.4308` |

---

## Performance — 62/100

### Field data: none available

CrUX has **no real-user data for this origin** — confirmed across 6 query variants (origin/homepage × history/snapshot × phone/desktop). The site does not meet Chrome's minimum traffic threshold. All numbers below are **lab data** and are labelled as such.

### Lab (PageSpeed Insights, 8 runs, all succeeded)

| Page | Mobile score | Mobile LCP | Desktop score | Desktop LCP |
|---|---|---|---|---|
| `/` | 79 | **4.7 s** | 97 | 1.2 s |
| `/programs/php` | 72 | **5.0 s** | 96 | 1.2 s |
| `/treatments/alcohol` | 79 | **4.9 s** | 96 | 1.3 s |
| `/contact` | 86 | 3.7 s | 99 | 0.8 s |

**CLS is excellent** — 0.000–0.005 measured live via PerformanceObserver, 0.000–0.027 in lab. Every image on the site carries `width`/`height` (0 of 1,502 missing), which is why. **TBT is low** (0–90 ms). Lighthouse Best Practices and SEO both score 100/100.

### JavaScript: 923 KB of raw parse per page, 97.5% third-party

| Script | Loading | Transfer | Raw (parse cost) |
|---|---|---|---|
| `googletagmanager.com/gtag/js` | async, `<head>` | 165,713 B | **498,502 B** |
| `unpkg.com/lucide@1.16.0` UMD | defer, `<head>` | 93,699 B | **401,894 B** |
| `/js/main.min.js?v=4` | **no defer**, end of body | 5,841 B | 17,216 B |
| `/js/i18n.js` | **sync, render-blocking, `<head>`** | 2,110 B | 5,656 B |
| **Total** | | **267,363 B** | **923,268 B** |
| First-party share | | 3.0% | **2.5%** |

Lucide ships the **entire** icon library to render a median of 31 icon instances per page. Neither `unpkg.com` nor `googletagmanager.com` has a `preconnect`, so both pay full DNS + TLS.

### Render-blocking `<head>`: 4 resources, 2 origins

Homepage totals 18,358 B transfer / 89,463 B raw across the Google Fonts CSS, `styles.min.css`, `cta.css`, and the synchronous `i18n.js`.

**`i18n.js` can force a second navigation.** It calls `location.replace()` for any first-time visitor with a Spanish device locale landing on an English URL, and for any returning visitor with `gsr_lang=es` in localStorage — a full second page load, new HTML and CSS evaluation, before any paint. It is also the only unminified JS on the site.

### Hero images are the LCP resource on 76 pages

Heroes are CSS `background-image` at 1600 px wide, rendered into a 320–420 px-tall band. A CSS background cannot use `srcset`, so a 390 px phone downloads the full file. 28 distinct heroes, 3,021,678 B total. Measured re-encodes give **52–76% savings**; `-800` variants already exist for most facility images, so the infrastructure is half-built.

**6 pages preload nothing at all.** `/team`, `/our-facility`, `/our-story` and their ES twins set the hero via a nested `.page-hero-bg` div, which is invisible to the preload scanner. The other 70 hero pages preload correctly with `fetchpriority="high"` — zero misses. `/team` is the worst page on the site: a 217,412 B un-preloaded hero plus 240,519 B of eager JPEG portraits.

### Two verified CLS sources

1. **Insurance logos on 70 pages.** All 14 declare `width="120" height="40"` (3:1), but real intrinsics range from 1.70:1 (cigna, 136×80) to 5.24:1 (carefirst, 419×80). With CSS `height:34px; width:auto` in a centred `flex-wrap` row, every logo's width changes on load and re-positions all siblings.
2. **Blog body copy in Fraunces.** `.article-body` — the whole article, not just headings — is set in Fraunces with a Georgia fallback and `font-display: swap`. Different metrics mean a full-article reflow. Blog pages load 176,364 B of fonts (Plus Jakarta Sans 27,272 + Fraunces roman 67,388 + Fraunces italic 81,704).

Separately, 3,124 Lucide icon placeholders are authored as empty `<i data-lucide="…">` with **no CSS sizing rule** — each goes 0 px → 14/16/24 px at replacement time, after DOMContentLoaded.

### Corrections worth recording

Two natural-looking recommendations were tested and **do not apply here**:

- **"Drop unused font weights" saves nothing.** The 5 declared Plus Jakarta Sans weights all resolve to a single 27,272 B variable woff2. The fix is self-hosting, not subsetting.
- **"Enable HTML edge caching" is not worth the risk.** Despite `cf-cache-status: DYNAMIC`, measured TTFB is **37–51 ms** across 9 cold requests (102-page crawl median 35 ms, p90 45 ms). Cloudflare Pages serves from its network regardless. The payoff is near zero against real cache-invalidation risk on a YMYL site.

Also measured: **cache-key fragmentation.** The homepage requests `styles.min.css?v=6` and `i18n.js?v=2` while all 101 other pages request `?v=4` and `?v=3` — identical ETags, but `immutable` means they cache as separate entries. A visitor entering on the homepage re-downloads 16,789 B on their first internal click.

---

## Images — 80/100

### Strengths

- **1,502 images; 0 missing `width`/`height`.** Zero omissions across all 102 pages. This is the single biggest CLS protection and it is fully in place.
- **1,256 of 1,502 are `loading="lazy"`**; only 14 are explicitly eager.
- WebP almost everywhere, and `-800` responsive variants already exist for most facility images.

### Issues

| Severity | Issue | Measured saving |
|---|---|---|
| **High** | Hero backgrounds are 1600 px for a 320–420 px band on 76 pages | 52–76% of the LCP resource |
| **High** | Insurance logo `width`/`height` attributes are wrong, not missing — 991 mismatched tags on 70 pages | removes a verified CLS source |
| **High** | `/team` serves 240,519 B of eager JPEG portraits at 400×400 — **WebP versions already sit on the server, unreferenced** | −179,593 B |
| **Medium** | 112 images missing `alt` (7.5%), including 7 on the homepage | — |
| **Medium** | `logo-icon.png` (23,632 B, 256×256 PNG shown at 48×48) and `logo-white.png` (17,090 B, eager in the footer) load on all 102 pages | −31,000 B **per page** |
| **Medium** | Homepage loads 113,306 B of below-the-fold insurance logos eagerly — the other 69 pages lazy-load the same strip | −113,306 B from the LCP window |
| **Low** | Three homepage review screenshots total 358,194 B for images displayed at ~380 px | −205,848 B |
| **Low** | Blog cover images sit inside `.blog-reveal { opacity: 0 }`, making them LCP-ineligible until JavaScript runs | — |

Note: re-compressing the insurance logos is **not** the fix — a measured resize pass made 4 of the 14 *larger*. They are already well encoded; the problem is loading priority and wrong dimension attributes.

**Robustness flag:** `.reveal { opacity: 0 }` is applied to 1,422 elements across all 102 pages with no `prefers-reduced-motion` escape hatch. If `main.min.js` fails to load, that content is permanently invisible. It never appears before the hero, so it does not gate LCP — but it is a single point of failure for most of the page body.

---

## AI Search Readiness — 74/100

### Strengths

- **`/llms.txt` exists and is well-formed** — HTTP 200, 6,455 B, with org summary, license number, location, service list, and full Español mirror. Most local-service sites have nothing here.
- **All AI crawlers allowed.** GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, Claude-User, PerplexityBot, Google-Extended, CCBot, Bingbot, Applebot-Extended — all verified with UA-spoofed live requests returning 200, identical byte size. No Cloudflare challenge or `cf-mitigated` header.
- **Server-rendered** — an AI crawler that doesn't execute JS still sees the full content.
- **FAQ content is real, visible HTML**, not schema-only: 29 Q&A pairs on `/faq`, 4 on the cost blog post, answers averaging ~55 words. This is the most citable asset on the site.
- **Outbound authority citations** to SAMHSA, NIDA, and findtreatment.gov.

### Issues

| Severity | Issue |
|---|---|
| **High** | Zero owned off-site profiles linked anywhere. `sameAs` has only LegitScript and Yelp — no GBP, no social, no provider directories. The only social URLs on the site are share widgets on blog posts |
| **Medium** | `foundingDate: "2026"` placeholder undercuts an "established" trust signal |
| **Medium** | Headings are declarative ("Why Golden State Rehab"), not question-phrased — harder to map onto natural-language queries |
| **Low** | `/llms-full.txt` returns 404 |

---

## Local SEO

**NAP is consistent.** Name, `(424) 208-3120` / `tel:+14242083120`, and `1964 Westwood Blvd, Ste 425, Los Angeles, CA 90025` match across visible text and JSON-LD on every EN and ES page checked. One cosmetic variant: body copy on location pages writes "Suite 425" while footers and all schema use "Ste 425" — standardize before building citations.

**The 11 location pages are a real asset**, not doorway pages — 1,500–1,690 words each, 70–78% unique content, with distinct driving directions, named landmarks, and per-city FAQ sets.

**The gap is off-page and structural:**

| Severity | Issue |
|---|---|
| **Critical** | No GBP linkage on the site at all — not in schema, not as a link, not as a map embed |
| **High** | No genuine Google Maps embed anywhere. The only 2 iframes point at same-origin `/amenity-map.html` |
| **High** | No reviews displayed on-site, and no visible link out to Yelp or Google reviews |
| **Medium** | Conflicting `areaServed` between homepage and location pages |

---

## Backlinks

Credential tier is 0 — Common Crawl and a verification crawler only. **Referring-domain counts, DA/PA, anchor-text distribution, and spam scores cannot be measured** and are not estimated here.

What was measured: the domain is **not present in the Common Crawl web graph at all** (checked apex and www). The site claims exactly two off-site profiles (LegitScript, Yelp); LegitScript returned 200 but is JS-rendered so a link-back could not be confirmed, and Yelp returned 403 to automated requests. Both are **unverifiable**, not confirmed missing.

Priority citation targets for an LA treatment center: Google Business Profile (highest, currently absent entirely), SAMHSA FindTreatment.gov, DHCS provider directory, Psychology Today, Healthgrades, BBB, Recovery.com.

---

## Search Experience (SXO)

**No page-type mismatch was found** for the core commercial queries. Real SERP checks were run for "outpatient rehab los angeles", "PHP program los angeles", "IOP los angeles", "cost of rehab in los angeles", "does insurance cover rehab california", "rehab near Santa Monica", and a Spanish equivalent — in every case the site has a page of the type that actually ranks. Any ranking shortfall is an authority problem, not a page-type problem.

Gaps found:

- **`/families` has zero intervention content** — `grep -i intervention` returns 0 hits — despite dedicated intervention guides dominating the family-persona SERP.
- **No PHP vs IOP comparison page**, despite the site already having a working comparison template (the CBT vs DBT post) and this being the most common "which program do I need" question.
- **`/verify-insurance` gates the low-commitment option.** The "prefer not to type? just call — no name needed" line only becomes visible after the visitor completes a 4-field name/DOB/phone/email step. The reassurance arrives after the ask it was meant to soften.

---

## Mobile / Visual

Verified with Playwright at 390×844 and 1440×900 across 6 pages; 12 screenshots captured.

- **Above the fold passes on every page tested** — H1, value proposition, and primary CTA visible without scrolling, on both EN and ES.
- **Live CLS 0.000–0.005.** No layout jank.
- **Horizontal overflow on `/treatments/alcohol` and `/es/treatments/alcohol` only.** Page scrollWidth 413 px vs 390 px viewport. Root cause isolated: `.intro-text` and `.intro-image` render 393 px wide inside a parent with 20 px left padding. The other 12 pages tested are clean — this is page-specific, not template-wide.
- **Hamburger menu button is 38×32 px** on every mobile page — below the 44×44 minimum touch target.

---

## Data Access Gaps

Two integrations are blocked and are worth fixing before the next audit, because they would materially improve the accuracy of the Performance and indexation sections:

1. **Google Search Console** — the service account `claude-seo-reader@claude-seo-496120.iam.gserviceaccount.com` gets an explicit permission-denied on both `sc-domain:goldenstate-rehab.com` and the URL-prefix property. **No indexation status, click, impression, or query data exists in this report** because none could be legitimately retrieved. Add that email under Search Console → Settings → Users and permissions.
2. **GA4** — no `ga4_property_id` configured, so organic traffic trends were skipped entirely.

CrUX is unavailable for a different reason — insufficient traffic — and cannot be fixed by configuration.

---

## Methodology & Confidence

- Crawl: 136 URLs, 5 concurrent, 1 s delay, robots.txt respected, redirects followed.
- An initial crawl produced 27 false 404s from over-aggressive trailing-slash normalization. This was caught, the crawler corrected, and the site re-crawled — the results above come from the corrected run. Similarly, a first pass at on-page extraction under-counted JSON-LD because the parser stripped `<script>` tags before counting them; corrected to 465 blocks.
- 11 specialist agents contributed; each was instructed to label findings observed / inferred / assumed and to declare what it did not assess. Several load-bearing claims — the nav bug, the dead mobile CTA bar, the 24/7 hours, the JSON-LD count, the overflow root cause — were independently re-verified by a second method before inclusion.
- **Not assessed:** GSC indexation and query data (access blocked), GA4 traffic (not configured), backlink metrics beyond Common Crawl (no paid credentials), live GBP dashboard state (not auditable from the codebase), and per-URL CrUX (origin ineligible).
