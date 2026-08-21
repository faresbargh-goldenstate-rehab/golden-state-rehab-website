# SEO Action Plan — goldenstate-rehab.com (2026-08-19)

Priorities: **Critical** = fix immediately · **High** = within 1 week · **Medium** = within 1 month · **Low** = backlog
Effort: **S** (<1 h) · **M** (half day) · **L** (multi-day)

**Health score: 83/100** (76 on 2026-08-13). Evidence for every item is in [FULL-AUDIT-REPORT.md](FULL-AUDIT-REPORT.md) and `findings/`.

The site's fundamentals are clean — titles, metas, canonicals, hreflang, sitemap, redirects, headers and alt text all check out with zero defects. What is left is a short list of specific structural and factual problems, several of which have been open since the last audit.

---

## Start here: the one-hour block

These five are independent of each other, need no decisions from anyone, and close four separate categories.

| # | Action | Effort |
|---|---|---|
| **Q1** | Add `[data-lucide]{display:inline-block;width:24px;height:24px}` to `css/styles.css`. 49 empty `<i data-lucide>` elements on the homepage grow from 0 to 24 px after first paint with nothing reserving space. One line kills the shift while the real Lucide fix (C5) is scheduled. **Remember the CSS min-mirror + `?v=` bump.** | S |
| **Q2** | Add `<link rel="preload" as="image" fetchpriority="high">` to `team.html`, `our-facility.html`, `our-story.html` and their three `es/` twins — all six have zero preloads. Point them at the `-800` variants that already exist and are already deployed: `team.html` currently serves `waiting-area.webp` at 217,412 B when `waiting-area-800.webp` (52,634 B) sits next to it. | S |
| **Q3** | Change `index.html` line 42: `i18n.js?v=2` → `?v=3`. Every other page already uses `v=3`. | S |
| **Q4** | Add to `llms.txt`: `programs/outpatient-rehab` (40+ internal links) and `spanish-speaking-treatment` (14) — both indexable, both missing from the AI-facing index. | S |
| **Q5** | Add a `Content-Security-Policy` line to the `/*` block in `_headers`, deployed `Report-Only` first: `script-src 'self' https://www.googletagmanager.com https://unpkg.com; style-src 'self' https://fonts.googleapis.com`. Absent from the file and from the live response; flagged H5 on 2026-08-13. | S |

---

## Critical

| # | Action | Effort |
|---|---|---|
| **C1** | **Resolve the founding-date contradiction.** `"foundingDate": "2026"` appears in Organization JSON-LD in **98 files**, and a visible `2026` / "Founded in Los Angeles" stat card sits at `about.html:198` and `our-story.html:230`; `our-story.html`'s meta description repeats it. Against that, `index.html:175` claims "100+ Recoveries" in the H1 alongside Joint Commission accreditation and DHCS licence #191643AP. Today is 2026-08-19 — as written, the site says it was founded within the last eight months. Pick one: state the real opening date and reconcile it in copy ("Since opening in [month] 2026, we've supported 100+ clients through treatment"), **or** correct `foundingDate` sitewide if 2026 is a build placeholder. The "100+ Recoveries" H1 proof number stays — fix the founding side. Do not simply delete the field: that removes the evidence, not the contradiction. | M |
| **C2** | **Stop the Organization schema drift.** The full org node is copy-pasted on 100+ pages under one shared `@id` and the copies disagree: `image` is `logo-icon.png` sitewide but `og/default.jpg` on all 11 `locations/*` pages; `areaServed` is 7 cities on the homepage, 12 on location pages, 6 on `es/index.html`; `knowsAbout` is 9 items in EN, 4 in ES; `foundingDate` present on some, absent on location pages. Any consumer that consolidates by `@id` sees one entity with three service areas and two images. Generate the org and `WebSite` nodes once from a single source of truth and inject identically, or define once and reference `{"@id": ".../#organization"}` elsewhere. Canonical values and paste-ready JSON in `findings/schema.md`. *(Partially carried over from M2 on 2026-08-13, now worse — the ES divergence is new to this audit.)* | M |
| **C3** | **Add a review path — there is none at all.** Zero matches sitewide for `aggregateRating`, `Review` schema, "testimonial", or "leave a review", and zero Google Maps `<iframe>` embeds — while three real GBP review screenshots dated 2026-07-27 sit unused in `Google Review Screenshots/`. Do it in this order: (1) add a "Leave us a review" link to the GBP review form in the footer or on the alumni page — no compliance question, nothing to write; (2) add a real Maps `<iframe>` on `locations.html` and `contact.html`; (3) with compliance input, decide whether to surface consented testimonials with a live-synced `aggregateRating`. **Do not publish the screenshots as content or as schema** — reviews of an addiction treatment centre name a health condition, so display requires explicit written consent. *(H8 on 2026-08-13, unmoved.)* | M |
| **C4** | **Confirm the GBP primary category is "Addiction treatment center."** Not verifiable from the codebase — this is a dashboard setting, and category accuracy is the single largest local-pack ranking factor and the largest negative one when wrong. Also review count, recency, Q&A and photo freshness while you are in there. | S |
| **C5** | **Remove the Lucide dependency.** 93,639 B from `unpkg.com` on 115 of 116 pages — 94% of all JS on the site, against ~6 KB of first-party JS — with no `preconnect` to that origin, and it is the mechanism behind the icon layout shift (Q1 is the stopgap, this is the fix). Inline the ~15–20 unique SVGs at build time with a node/sed pass over the HTML. Removes ~93 KB, one third-party origin, the CLS source, and a single point of failure that currently breaks every icon on the site if unpkg is down. *(H2 on 2026-08-13, unmoved.)* | M |

---

## High (within 1 week)

| # | Action | Effort |
|---|---|---|
| **H1** | **Fix the language switcher so it links to `/es/`, not `/espanol`.** Every English page's nav has `<a href="/espanol" class="nav-lang">Español</a>` while that same page's `hreflang` declares `/es/<path>` as the Spanish alternate. Result: of the 71 pages outside `/es/`, **only `404.html` and `espanol.html` link into `/es/` at all** — no English content page does. `/es/` pages sit at click depth 3–5, median inbound links 20 vs. 67 for English, and `es/about`, `es/faq`, `es/our-story`, `es/our-facility` have exactly 1 inbound link each. Make the switcher resolve to `/es` + current path with a fallback to `/es/`; keep `/espanol` as a campaign landing page reachable from the `/es/` nav. No canonical or hreflang tag needs to change — those are already correct. *(M9 on 2026-08-13; the mechanism is identified here for the first time.)* | M |
| **H2** | **Generate responsive hero variants for `images/heroes/`.** Zero `-800`/`-1200` files exist there (`images/facility/` has 20). Heroes are CSS `background-image`, so `srcset` cannot apply — use `image-set()` or a `@media (max-width: 900px)` background override, plus `imagesrcset`/`imagesizes` on the existing preloads. Same bytes currently go to a 390 px phone and a 2560 px desktop: 99,380 B on `/treatments/fentanyl`, 128,944 B for `group-therapy-room.webp`. LCP resource on ~70 pages. *(H2b on 2026-08-13, half-done.)* | M |
| **H3** | **Inline `js/i18n.js` into `<head>`** rather than loading it as a blocking external request on all 115 pages. **Do not add `defer`** — the blocking is deliberate (the file's own comment: runs before paint to avoid a flash of the wrong language) and it performs a synchronous `location.replace()`. At 2,185 B, inlining costs nothing and removes one serialised request ahead of first paint. *(H6 on 2026-08-13 prescribed `defer`; that would break the feature.)* | S |
| **H4** | **Self-host the web fonts.** `css/styles.css` has **0 `@font-face` and 0 `font-display` declarations** — everything comes from a render-blocking cross-origin `fonts.googleapis.com` stylesheet (8,460 B), then a serial hop to `fonts.gstatic.com`. Define local `@font-face` with `font-display: swap` and a `size-adjust`-tuned fallback, and preload the one or two weights used above the fold. The homepage LCP element is a three-line text H1 — exactly where an untuned font swap reflows most. Audit whether all five Plus Jakarta Sans weights are really used, and whether the 16 blog pages need the full Fraunces variable axis. | M |
| **H5** | **Add visible "Updated [Month Year]" bylines to all 16 blog posts.** `grep -c review-date blog/*.html` returns 0 for every post, while every treatment, program and location page has one. Several posts show a June 2026 publish date in body text against a schema `lastReviewed` of 2026-08-19 — so readers and AI systems see content two months staler than it is. Match the existing pattern from `treatments/fentanyl.html:102`. | S |
| **H6** | **Add `availableService` to the Organization node.** PHP, IOP, telehealth, individual therapy, group therapy and medication management all exist as well-built `MedicalTherapy` pages, but the org node never lists them — nothing tells Google or an AI answer engine what the business does without inferring it from prose. Paste-ready block in `findings/schema.md`. Do this in the same pass as C2. | S |
| **H7** | **Get listed on the vertical directories.** No on-site evidence of Psychology Today, Healthgrades, BBB, or SAMHSA's FindTreatment.gov provider locator. The site links *out* to SAMHSA 12 times as a resource, which is not the same as being in it — and `.gov` sources are weighted heavily by AI answer engines for "rehab near me". Add each live profile URL to `sameAs` once claimed. LegitScript (the certification Google Ads requires for rehab advertisers) is already present, displayed and linked. | L |
| **H8** | **Rewrite the six topic-label H2s into questions and lead each section with the answer.** Only 11% of H2/H3 headings sitewide are question-shaped (199 of 1,812), and nearly all of those are FAQ accordions — the structural headings that carry the answer prose are slogans (`treatments/fentanyl.html` "Fentanyl Is Different — So Treatment Has to Be"). Specific rewrites and a model rewritten passage are in `findings/geo.md`. | M |
| **H9** | **Fix or remove `amenity-map.html`.** Live at 200 and linked from `our-facility.html`, `locations.html` and both Spanish twins. It ships unrendered `{{author_url}}`/`{{url}}`/`{{website}}` placeholders, has no `<h1>`, no canonical, no meta description, 4 words of text, all 17 images missing dimensions (the only page on the site with any), and loads Handlebars plus the full Google Maps JS API. **Separately: verify the Google Maps API key it embeds (`amenity-map.html:931`, `:1131`) has HTTP-referrer restrictions in the Cloud Console** — client Maps keys are public by design, but an unrestricted one can be billed against by anyone. | M |

---

## Medium (within 1 month)

| # | Action | Effort |
|---|---|---|
| **M1** | Fix the 48 pages that skip `h2 → h4` (was 47 on 2026-08-13). Every `programs/*` and `treatments/*` page plus `index.html` and their Spanish twins jump from a section `<h2>` straight to `<h4>` cards. It lives in a small number of shared card components. Accessibility and document outline, not ranking. | M |
| **M2** | Link the two weakest blog posts contextually. `blog/do-i-need-rehab.html` and `blog/find-rehab-near-me-los-angeles.html` have **2 inbound links each**, against ~68 for every treatment and program page — and "find a rehab near me in Los Angeles" is among the highest-commercial-intent queries the site could hold. Add a related-reading link from each of the 11 location pages to `find-rehab-near-me-los-angeles`, and from the treatment pages to `do-i-need-rehab`. | S |
| **M3** | Add a one-sentence credentials statement to the two highest-intent blog posts (`how-much-does-rehab-cost`, `does-insurance-cover-rehab-in-california`): "Golden State Rehab is a Joint Commission–accredited, DHCS-licensed (#191643AP) outpatient treatment center in Westwood, Los Angeles." Those are the pages most likely to source an AI answer to "is this place legitimate", and they currently carry the credentials only in sitewide JSON-LD. The "Claims You Can Check Yourself" pattern already exists on treatment and location pages — reuse it. | S |
| **M4** | Differentiate or consolidate the repeated "Levels of Care" and "Why Golden State Rehab" card grids across the 11 location pages. Measured pairwise similarity is low (mean 8-word-shingle Jaccard 0.167) and each page has genuinely unique directions, transit and framing — these pages are **not** doorway pages. But those two grids repeat with cosmetic rewording only, adding word count without topical coverage. Raise the unique-content share (currently ~30–35%) before adding a twelfth neighbourhood page, not after. | M |
| **M5** | Replace `logo-icon.png` and `logo-white.png` with SVG, and build 40×40 / 88×88 variants of `joint-commission-gold-seal.webp` — it is 18.7 KB rendered at 20×20 CSS pixels (~40× oversized) above the fold. Lazy-load or spritify the 14 eager insurance logos (~100 KB, 7.5–13.3 KB each). | S |
| **M6** | Upgrade the Medical Director's schema node from `Person` to `["Person","Physician"]` to carry `medicalSpecialty` and `hospitalAffiliation`; expand `sameAs` beyond Google Maps CID / LegitScript / Yelp once LinkedIn and Psychology Today profiles exist (H7); add `inLanguage` to the `es/*` `WebSite` nodes; bump `geo` from 4 to 5 decimal places sourced from the real GBP pin. | S |
| **M7** | Confirm `BlogPosting.dateModified` is only bumped on real edits. Five of 16 posts show `2026-08-19` — consistent with genuine same-day edits or an unconditional build stamp. Google discounts `dateModified` that does not track substantive change. | S |
| **M8** | Add "Quick answer" boxes to the four cornerstone blog posts (`do-i-need-rehab`, `how-much-does-rehab-cost`, `how-long-is-rehab`, `inpatient-vs-outpatient-rehab`). They currently open with ~95 words of empathetic scene-setting before the answer — good conversion writing for an audience in crisis, so add the box, do not replace the lead. | S |
| **M9** | Build `llms-full.txt` (concatenated body text of every indexable page, nav and footer stripped) as the companion to the existing spec-compliant `llms.txt`. One-time build. | M |
| **M10** | Add a real Google Maps `<iframe>` embed on `locations.html` and `contact.html`. Currently the only Maps embed anywhere is on the noindex `amenity-map.html`. Bundled with C3 if convenient. | S |
| **M11** | Consider Spanish twins for the 11 `locations/*` pages and `programs/outpatient-rehab` — the only indexable pages with no `/es/` equivalent, in a heavily Spanish-speaking market. This is a content investment decision, not a defect. | L |

---

## Low (backlog)

| # | Action | Effort |
|---|---|---|
| **L1** | Prune ~16 MB of unreferenced originals from `images/`: 36 of 60 `.jpg` files and `joint-commission-gold-seal-1800.png` (893 KB) are referenced nowhere in any HTML, CSS or JS. Deploy hygiene only, no runtime cost. | S |
| **L2** | Correct the 980 insurance-logo `width="120" height="40"` attributes to their true intrinsics (ratios range 1.70–5.24). **This is not a CLS defect** — `.ins-logo` sets `height:34px; width:auto; object-fit:contain` and the stylesheet is render-blocking, so the attributes never govern layout at paint. Accuracy only. *(The 2026-08-13 audit rated this H2d/CLS; that was wrong.)* | S |
| **L3** | Tidy the three meta descriptions outside the 120–165 band (`about.html` 105, `treatments/dual-diagnosis.html` 110, `intake-success.html` 90) and trim `treatments/index.html`'s 68-character title. Cosmetic. | S |
| **L4** | Normalise "Suite 425" vs. "Ste 425" in visible body copy; schema already uses "Ste 425" consistently. No real NAP conflict exists. | S |
| **L5** | Confirm the platform-level `access-control-allow-origin: *` on HTML and CSS responses is intentional (a Cloudflare Pages default, not set in `_headers`). | S |
| **L6** | Move the hero `<link rel="preload">` above the blocking `<script>` in `<head>` on the 70 pages that have one. The preload scanner already handles it, so the gain is near zero — but it is free. | S |
| **L7** | Add AVIF alongside WebP for photographic heroes (typically another 20–30%), folded into H2 rather than run as a separate pass. | M |
| **L8** | Re-measure readability. The 2026-08-13 audit found a median Flesch-Kincaid grade of 11.5 on clinical pages against a target of ~8; that was not re-measured this round and is carried forward unverified. | M |

---

## Not fixable from this repo

- **Google Business Profile:** primary and secondary category, review count/rating/velocity, Q&A completeness, photo recency, post cadence. C4 covers the highest-value check.
- **Core Web Vitals field data:** requires either a Google API key (the keyless PSI quota returned HTTP 429 and CrUX returned 403 this session) or enough traffic for the origin to appear in CrUX at all. A local `npx lighthouse https://www.goldenstate-rehab.com/ --preset=perf` needs no quota and Node is already installed — run that before acting on any CWV number in this report, because none of them were measured.
- **Search Console / GA4 / backlinks:** no credentials configured, so indexation status, real query performance and the referring-domain profile are unmeasured.
- **Third-party directory presence** (Psychology Today, Healthgrades, SAMHSA locator, BBB): inferred absent from the absence of on-site links, which is suggestive but not conclusive. Verify directly.
