# SEO Action Plan — goldenstate-rehab.com (2026-08-13)

Priorities: **Critical** = fix immediately · **High** = within 1 week · **Medium** = within 1 month · **Low** = backlog
Effort: **S** (<1 h) · **M** (half day) · **L** (multi-day)

**Health score: 76/100.** The fundamentals are clean. Almost every point lost traces to one of five specific defects below.

---

## Do this first: deploy

Five commits (105 files, 2,832 insertions) are committed and undeployed. Shipping them resolves **C1, C2, H1, H4, and M6** at once, plus the missing map embed.

```
2d42a1a  GBP nav coverage, hreflang, ES title parity, sitemap lastmod
44f99fd  E-E-A-T schema — reviewedBy on programs/faq, author identity on blog posts
480ae88  service<->hub, service->blog, treatment<->location internal linking
24f9b17  GBP category hub linking + service-and-city H1s
e6a2dca  homepage contextual linking — GBP category cards, service pills, blog module
```

Review `git diff` before staging — the tree may contain unrelated work. **Verify after deploy** that the mobile CTA bar actually appears (see C1 test below); the `defer` fix is the mechanism, but confirm the outcome.

---

## Critical

| # | Action | Effort | Fixed by deploy? |
|---|---|---|---|
| **C1** | **Restore the dead mobile conversion UI.** `main.min.js` runs at line 691; `#quizFab` (826), `#liveTicker` (853), and `.mobile-cta-bar` (858) don't exist yet, so 15 `getElementById` lookups return null and the code early-returns silently — no console error. The sticky mobile call bar sits permanently at `translateY(82.5px)`, fully below the viewport, at every scroll position. Fix: `defer` on `main.min.js`. **Test after deploy:** load `/` at 390×844, confirm `.mobile-cta-bar` has `top < 844` and `#quizFab` loses its `hidden` attribute. | S | **Yes** |
| **C2** | **Remove the false 24/7 clinic hours.** 101/102 pages declare `opens: "00:00", closes: "23:59"` for all 7 days. Repo already moves the 24/7 claim to `ContactPoint.hoursAvailable` (correct — the admissions line *is* 24/7) and gives `openingHoursSpecification` real Mon–Sat clinical hours. Confirm the deployed hours match the Google Business Profile exactly. | S | **Yes** |
| **C3** | **Fix 25 broken section-nav links.** On 10 `/programs/*` and 15 `/treatments/*` pages, the active nav item and the "All Programs"/"All Treatments" dropdown point to `href="/"`. Change to `href="/programs/"` and `href="/treatments/"` in the shared nav partial. The `/es/` templates already do this correctly — copy that pattern. | S | **No — present in repo too** |
| **C4** | **Link the site to the Google Business Profile.** Currently zero linkage: no GBP URL in `sameAs`, no visible link, no map embed. Deploying adds the CID to `hasMap`/`sameAs` on 102 pages. Still needed after deploy: a real Google Maps Embed API iframe on `/contact`, `/our-facility`, and `/locations` keyed to the verified Place ID; a visible "Read our Google reviews" link; and `hasMap` switched from an address-search URL to the Place-ID format. GBP dashboard state (primary category, hours, posts, Q&A) is not auditable from the codebase — audit it separately. | M | Partly |

---

## High (within 1 week)

| # | Action | Effort |
|---|---|---|
| **H1** | **Fix the invalid schema enum.** `medicalSpecialty: ["Psychiatric","Addiction Medicine"]` on 101 pages — "Addiction Medicine" is not in schema.org's `MedicalSpecialty` enumeration (verified against the live vocabulary). Repo corrects to `["Psychiatric"]` with the term preserved in `knowsAbout`. *(Fixed by deploy.)* | S |
| **H2** | **Cut the Lucide bundle.** 93,699 B transfer / 401,894 B parse from unpkg on every page, shipping the entire icon library for a median 31 icon instances. Inline the ~97 used icons as SVG at build time (est. 8–12 KB gzipped). Also removes a third origin and the post-DOMContentLoaded mutation pass that resizes 3,124 zero-width placeholders. Largest single performance lever on the site. | M |
| **H2b** | **Responsive hero images.** 76 pages use a 1600 px CSS `background-image` for a 320–420 px band; `srcset` is impossible on a CSS background. Generate `-800`/`-1200` variants (the pattern already exists — `group-therapy-room-800.webp` is live) and switch via `image-set()` or a media-query pair, with viewport-aware preloads. **Measured saving: 52–76% of the LCP resource.** | M |
| **H2c** | **Add hero preloads to 6 pages.** `/team`, `/our-facility`, `/our-story` and their ES twins set the hero on a nested `.page-hero-bg` div, invisible to the preload scanner — so a 217,412 B image can't start loading until CSSOM is built. The other 70 hero pages already do this correctly. One line per page. | S |
| **H2d** | **Fix insurance-logo dimensions.** All 14 declare `120×40` but load at 1.70:1–5.24:1 — 991 mismatched tags on 70 pages, each shifting its siblings in a centred flex-wrap row. Set the true intrinsics (or normalise to a common canvas at build time). Do **not** re-compress them: a measured pass made 4 of 14 larger. | S |
| **H3** | **Lower reading level on clinical pages.** Median Flesch-Kincaid grade is **11.5**; 50 of 58 EN pages exceed grade 10. Worst: `/treatments/meth` (15.3), `/treatments/fentanyl` (14.3), `/treatments/complex-trauma` (14.2), `/treatments/dual-diagnosis` (14.0). Target ~grade 8 — the blog already achieves 5.1–7.8, so the house style can do it. Shorten sentences (currently ~20 words on treatment pages) and gloss clinical terms on first use. | L |
| **H4** | **De-orphan `/programs/outpatient-rehab`** — the weakest page site-wide: 1 inlink, zero hreflang tags (the only such page), no ES twin. Deploy fixes the hreflang and adds nav/footer links; still plan the ES twin. | S |
| **H5** | **Add a CSP header** via Cloudflare Transform Rule. Start Report-Only, then enforce. Notable gap for a YMYL healthcare site loading GTM and unpkg. | M |
| **H6** | **Defer `/js/i18n.js`** — currently synchronous in `<head>`, render-blocking on all 102 pages. | S |
| **H7** | **Add the 112 missing `alt` attributes**, starting with the 7 on the homepage. | S |
| **H8** | **Surface reviews on-site.** No reviews are displayed anywhere and Yelp appears only inside JSON-LD, never as a clickable link. Add a review wall with attribution and an outbound link to the real profiles. Only add `aggregateRating` schema once visible reviews back it. | M |
| **H9** | **Citation build-out.** The domain is absent from the Common Crawl web graph entirely. Targets: GBP (highest — currently absent), SAMHSA FindTreatment.gov, DHCS provider directory, Psychology Today, Healthgrades, BBB, Recovery.com. Add each live profile to `sameAs`. | L |

---

## Medium (within 1 month)

| # | Action | Effort |
|---|---|---|
| **M1** | Fix heading hierarchy — 47 pages skip h2 → h4. Also make FAQ questions real `<h3>` headings; they are currently `<button>` elements, which is invisible to heading-based parsing and screen-reader navigation. | M |
| **M2** | Reconcile conflicting `areaServed`: homepage declares 7 cities, location pages declare 12 — under the same `@id`. Converge on the 12-city list plus "Los Angeles". | S |
| **M3** | Schema consistency: use `MedicalClinic` instead of `["MedicalOrganization","LocalBusiness"]`; unify the `#clinic` `@id` on the two locations pages to `#organization`; add the missing `WebSite` node to 7 pages (fixes a dangling `isPartOf` on both families pages); restore the full org node on `families.html`/`es__families.html`. | M |
| **M4** | Fix `foundingDate: "2026"` — replace with the real year or remove the field. A wrong date is worse than none. | S |
| **M5** | Build a **PHP vs IOP comparison page**. Highest-intent unanswered question, and the CBT-vs-DBT post already provides the template. Cross-link from both program pages. | M |
| **M6** | Real per-URL sitemap `lastmod` — all 102 URLs currently share `2026-07-07`, including legal pages. *(Fixed by deploy; verify the dates vary afterward.)* | S |
| **M7** | Add **intervention content** to `/families` (or a dedicated `/families/intervention`). Currently zero mentions, while dedicated intervention guides dominate that persona's SERP. | M |
| **M8** | Rework `/verify-insurance`: move the "prefer not to type? just call — no name needed" line **above** the name/DOB/phone/email step instead of after it, and drop DOB from step 1. | M |
| **M9** | Strengthen the ES section's internal linking — 9 ES pages sit at click depth 4–5, and `/es/faq`, `/es/our-facility`, `/es/our-story` have 1 inlink each. | M |
| **M10** | Expand `/contact` (237 w) and `/es/contact` (269 w): what happens after you submit, HIPAA/42 CFR Part 2 assurance, hours, crisis line. `/programs/` hub (454 w) is also below a service-hub floor. | S |
| **M11** | Enable **IndexNow**. *(Note: do **not** enable HTML edge caching — see "Recommendations tested and rejected" below.)* | S |
| **M13** | **Sub-15-minute wins, ~530 KB total:** align homepage asset query strings to `?v=4`/`?v=3` (−16,789 B on first internal navigation — the homepage currently requests byte-identical files under different cache keys); `/team` portraits → 400×400 WebP, which already exist unreferenced on the server (−179,593 B); lazy-load the 14 homepage insurance logos to match the other 69 pages (−113,306 B); logos → 96 px/240 px WebP (−31,000 B **per page**); downscale the 3 review screenshots to 800w (−205,848 B); take `.article-cover` out of `.blog-reveal` and add `fetchpriority="high"` so blog covers become LCP-eligible. | S |
| **M14** | **`i18n.js` forces a second navigation** for Spanish-locale visitors via client-side `location.replace()` — a full extra page load before any paint. Move the routing to a Cloudflare edge rule on `Accept-Language`, or inline the ~15 lines of redirect logic. It is also the only unminified JS on the site. | M |
| **M15** | Set `.article-body` in Plus Jakarta Sans and keep Fraunces for headings only. Blog pages currently load 176,364 B of fonts, and setting whole-article body copy in a swapped webfont reflows the entire article. Likely lets the 81,704 B Fraunces italic go unrequested. | S |
| **M16** | Add a `prefers-reduced-motion` fallback to `.reveal` — 1,422 elements across all 102 pages are `opacity: 0` until JS runs, with no escape hatch. If `main.min.js` fails, most page content is permanently invisible. | S |
| **M12** | Convert declarative headings to question-phrased ones on key pages, mirroring the FAQ pattern — improves AI-answer mapping. | M |

---

## Low (backlog)

| # | Action | Effort |
|---|---|---|
| **L1** | Fix the 23 px horizontal overflow on `/treatments/alcohol` and `/es/treatments/alcohol`: `.intro-text`/`.intro-image` render 393 px inside a 20 px-padded parent. Add `min-width: 0` / `max-width: 100%` at the mobile breakpoint. Only these 2 pages are affected. | S |
| **L2** | Enlarge the hamburger menu button — 38×32 px, below the 44×44 minimum touch target. | S |
| **L3** | Add `/llms-full.txt` (`llms.txt` already exists and is well-formed; `llms-full.txt` currently 404s). | S |
| **L4** | Standardize "Ste 425" vs "Suite 425" — schema and footers use "Ste", location-page body copy uses "Suite". Pick one before building citations. | S |
| **L5** | Increase geo coordinate precision from 4 to 5 decimals (`34.0447, -118.4308` → ~11 m accuracy; 5 decimals gives ~1 m for a suite address). | S |
| **L6** | Add `<main>` landmark to inner-page templates. | S |
| **L7** | Add `Service` schema per program/treatment page, with `provider` pointing at `#organization`. | M |
| **L8** | Cache `apple-touch-icon.png` (currently uncached; all other images cache 30 days). | S |
| **L9** | Self-host the two variable woff2 files and preload them — collapses a 2-hop cross-origin font chain (googleapis CSS → gstatic woff2) into one same-origin request. There is currently no `<link rel=preload as=font>` anywhere on the site. | M |
| **L10** | Extend Cloudflare Early Hints. The 103 response is already being sent but carries only a Google Fonts preconnect — add `styles.min.css` and the per-route hero image. Free latency on already-provisioned capability. | S |
| **L11** | Add `preconnect` for `unpkg.com` and `googletagmanager.com` if those origins stay. | S |

---

## Recommendations tested and rejected

Two plausible-sounding fixes were measured and **should not be done**:

| Rejected | Why |
|---|---|
| "Drop unused Plus Jakarta Sans weights" | All 5 declared weights resolve to a **single 27,272 B variable woff2**. Requesting fewer weights saves zero bytes. Self-host instead (L9). |
| "Enable HTML edge caching" | Despite `cf-cache-status: DYNAMIC`, measured TTFB is **37–51 ms** across 9 cold requests (crawl median 35 ms, p90 45 ms) — Cloudflare Pages serves from its network regardless. Near-zero payoff against real cache-invalidation risk on a YMYL healthcare site. |

Similarly, do **not** re-compress the insurance logos — a measured pass made 4 of 14 larger. The defect is wrong dimension attributes and eager loading, not encoding.

---

## Unblock the data (do this regardless)

| Action | Why |
|---|---|
| Add `claude-seo-reader@claude-seo-496120.iam.gserviceaccount.com` as a user in **Search Console → Settings → Users and permissions** | Permission is currently denied on both property forms. **No indexation, click, impression, or query data exists in this audit** — none of it could be legitimately retrieved. |
| Set `ga4_property_id` in `/Users/kkareem_1/.config/claude-seo/google-api.json` | GA4 organic traffic was skipped entirely. |

CrUX field data is unavailable for a different reason — the origin doesn't meet Chrome's minimum traffic threshold — and cannot be fixed by configuration. All Core Web Vitals figures in this audit are lab data.

---

## Not assessed

Do not read these as "no issues found":

- GSC indexation status and search performance — access blocked.
- GA4 organic traffic — not configured.
- Backlink metrics beyond Common Crawl presence (DA/PA, referring domains, anchor text, toxicity) — no paid credentials; deliberately not estimated.
- Google Business Profile dashboard state — primary category, hours, posts, Q&A, photos. Not auditable from the codebase; needs a manual review.
- Per-required-property validation of FAQPage, BlogPosting, Person, and BreadcrumbList schema.
- Spanish-language SERP composition beyond one general query.
- Live AI-platform citation testing (ChatGPT, Perplexity, AI Overviews).
