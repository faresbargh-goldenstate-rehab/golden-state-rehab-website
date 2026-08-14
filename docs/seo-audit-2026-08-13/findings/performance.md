# Page-load performance audit — www.goldenstate-rehab.com

Agent: performance (render-blocking + asset-level). Date: 2026-08-13.
Method: crawled HTML mirror in `scratchpad/crawl/` (102 pages) + direct live asset fetches with `curl` and local re-encodes with `cwebp`/`sips`. Every byte count below is **measured**, not estimated; anything estimated is labelled.

Field data (CrUX/PSI) was handled by another agent — no field metrics are claimed here.

---

## Cross-check against coordinator's numbers

| Item | Coordinator | Mine | Agreement |
|---|---|---|---|
| styles.min.css?v=6 transfer | 14,752 B | **14,679 B** (br), 13,152 B (gzip) | Minor disagreement — see note |
| styles.min.css raw | 73,291 B | 73,291 B | ✅ exact |
| cta.css?v=2 | 929 / 2,056 | 929 / 2,056 | ✅ exact |
| i18n.js?v=2, render-blocking in head, no defer | 2,110 / 5,656 | 2,110 / 5,656 | ✅ exact — confirmed sync in `<head>` on all 102 pages |
| main.min.js?v=4, no defer | 5,841 / 17,216 | 5,841 / 17,216 | ✅ exact — confirmed no `defer` live; it sits at end of `<body>`, not in `<head>` |
| lucide@1.16.0 UMD | 93,699 / 401,894, deferred | 93,699 / 401,894, deferred | ✅ exact |
| Distinct icons | 17 homepage / 97 sitewide | 97 sitewide (median 31 icon *instances* per page) | ✅ agree on 97 |
| HTML caching | `max-age=0, must-revalidate`, `cf-cache-status: DYNAMIC` | identical on all 102 pages | ✅ exact |
| Google Fonts PJS 5 weights, render-blocking | yes | yes — 20 `@font-face` blocks, 5 latin weights, all resolve to **one** variable woff2 | ✅ agree, with a nuance (below) |

**Disagreement 1 — 14,752 vs 14,679 B.** 73-byte delta on the same file. Almost certainly Brotli quality-level variance between Cloudflare edge nodes / colos, not a real difference. Both of us measured 73,291 B raw and an identical ETag, so it is byte-identical content. Not worth chasing. *(observed / inferred cause)*

**Nuance on "5 weights".** The Google Fonts CSS declares 5 weights × 4 unicode subsets = 20 `@font-face` rules, but **all five latin weights point at the same URL** (`LDIoaomQNQcsA88c7O9yZ4KMCoOg4Ko20yygg_vb.woff2`, **27,272 B**). Plus Jakarta Sans is served as a single variable font, so the "5 weights" cost one file, not five. Requesting fewer weights would **not** reduce bytes. *(observed — parsed the live CSS)* This matters because "drop unused font weights" is a natural-looking recommendation that would buy zero here.

---

## Verdict

| Metric | Assessment | Confidence |
|---|---|---|
| **LCP** | At risk on the 76 interior pages with a hero background image; the LCP resource is a 1600px-wide WebP (19,978 – 279,416 B) rendered into a 320–420 px-tall band. 6 of those pages don't even preload it. | inferred from asset sizes + markup; no lab/field timing run |
| **INP** | At risk. 923,268 B of raw JS parsed on every page, 97.5% of it third-party (gtag + full Lucide library), plus a DOM mutation pass injecting a median of 31 SVGs after DOMContentLoaded. | inferred |
| **CLS** | Two concrete, verified shift sources: insurance-logo aspect-ratio mismatch on 70 pages, and Fraunces FOUT across entire blog article bodies. Otherwise unusually well-protected (all 1,502 `<img>` tags carry width+height). | observed markup/CSS; shift magnitude not measured |

TTFB is **not** a problem: measured 37–51 ms over 9 cold-connection requests from a US-East vantage (HTTP/2, brotli).

---

## Findings

### H-1 (High) — Hero LCP images are 1600 px wide for a 420 px-tall band, with no responsive variant

**Evidence.** 76 pages render `<section class="page-hero">` with an inline `background-image`. CSS (`styles.min.css`): `.page-hero{min-height:420px}` desktop, `.page-hero{min-height:320px}` mobile, `background-size:cover`. Every hero asset is 1600 px (or 1200×1600) on the long edge. Measured, live:

| Hero asset | Bytes | Intrinsic | Pages |
|---|---|---|---|
| `/images/heroes/1444723121867-7a241cacace9.webp` | **279,416** | 1600×1067 | 2 (`/locations`, `/es/locations`) |
| `/images/facility/waiting-area.webp` | **217,412** | 1600×1200 | 3 (`/team`, `/es/team`, `/locations/santa-monica`) |
| `/images/heroes/1470252649378-9c29740c9fa8.webp` | 194,386 | 1600×1067 | 2 |
| `/images/facility/recreation-room.webp` | 181,514 | 1600×1200 | 5 |
| `/images/facility/reception-lobby.webp` | 142,484 | 1600×1200 | 10 |
| `/images/facility/group-therapy-room.webp` | 128,944 | 1600×1200 | 11 |
| `/images/facility/meditation-room.webp` | 94,656 | 1200×1600 | **30** |

28 distinct hero backgrounds, **3,021,678 B** total. A CSS `background-image` cannot use `srcset`, so a 390 px-wide phone downloads the full 1600 px file.

**Measured savings** (local `dwebp` → `cwebp -q 72` re-encode of the actual live files):

| File | Live | @1200w | @800w |
|---|---|---|---|
| `1444723121867…webp` | 279,416 | 129,420 (−54%) | 67,404 (−76%) |
| `waiting-area.webp` | 217,412 | 89,774 (−59%) | 46,110 (−79%) |
| `reception-lobby.webp` | 142,484 | 61,488 (−57%) | 36,246 (−75%) |
| `group-therapy-room.webp` | 128,944 | 62,176 (−52%) | 37,082 (−71%) |
| `meditation-room.webp` | 94,656 | 73,092 (−23%) | 37,388 (−61%) |

**Fix.** Generate `-800`/`-1200` variants (the pattern already exists for facility images — `group-therapy-room-800.webp` is live at 43,254 B) and serve via `image-set()` or a media-query rule pair:
```css
.page-hero{background-image:url('…-800.webp')}
@media (min-width:900px){.page-hero{background-image:url('…-1200.webp')}}
```
Then make the `<link rel=preload>` viewport-aware with `media="(min-width:900px)"` / `media="(max-width:899px)"` on two preloads. Expected LCP resource-load-time reduction on mobile: 60–75% of hero bytes. *(observed sizes; % savings measured on real files; LCP impact inferred)*

---

### H-2 (High) — 6 pages set the hero via a nested `.page-hero-bg` div and have **no** preload at all

**Evidence.** Two hero markup patterns exist. 70 pages use `<section class="page-hero" style="background-image:…">` and **all 70 correctly preload it with `fetchpriority="high"`** (verified: zero misses). Six pages instead use a child div and preload nothing:

| Page | LCP hero asset | Bytes | Preloads on page |
|---|---|---|---|
| `team.html`, `es__team.html` | `/images/facility/waiting-area.webp` | **217,412** | none |
| `our-facility.html`, `es__our-facility.html` | `/images/facility/reception-lobby.webp` | 142,484 | none |
| `our-story.html`, `es__our-story.html` | `/images/facility/reception-lobby.webp` | 142,484 | none |

Markup, `crawl/team.html`:
```html
<section class="page-hero">
  <div class="page-hero-bg" style="background-image: url('https://www.goldenstate-rehab.com/images/facility/waiting-area.webp');"></div>
```
A background image in an inline style on a nested element is invisible to the HTML preload scanner. The request cannot start until CSSOM is built and the element is styled — i.e. after `styles.min.css` (14,679 B), `cta.min.css`, and the sync `i18n.js` have all resolved. This is the worst-case LCP resource-load-delay on the site, on the heaviest hero asset.

**Fix.** Either convert these six to the inline-style-on-section pattern used by the other 70, or add `<link rel="preload" as="image" href="…" fetchpriority="high">` to their heads. One-line change per page. *(observed)*

---

### H-3 (High) — 923 KB of raw JS per page; 97.5% of it is third-party

**Measured, live, every page:**

| Script | Loading | Transfer | Raw (parse cost) |
|---|---|---|---|
| `googletagmanager.com/gtag/js?id=G-3LLBGYXQ0Y` | `async`, in `<head>` | **165,713** (br) | **498,502** |
| `unpkg.com/lucide@1.16.0/dist/umd/lucide.min.js` | `defer`, in `<head>` | **93,699** (gzip) | **401,894** |
| `/js/main.min.js?v=4` | **no defer/async**, end of `<body>` | 5,841 | 17,216 |
| `/js/i18n.js?v=3` | **sync, render-blocking, in `<head>`** | 2,110 | 5,656 |
| **Total** | | **267,363** | **923,268** |
| First-party share | | 7,951 (3.0%) | 22,872 (**2.5%**) |

Page-specific additions: `/js/intake.js?v=3` 7,596 / 23,547 (2 pages, deferred), `/js/contact.js?v=3` 1,955 / 4,844 (2 pages, deferred).

Lucide ships the **entire** icon library (401,894 B raw) to render a median of 31 icon instances per page; 97 distinct icon names are used across the whole site, so no single page needs more than a few dozen. Neither `unpkg.com` nor `googletagmanager.com` has a `preconnect` (only `fonts.googleapis.com` and `fonts.gstatic.com` do), so both pay full DNS + TLS.

**Fix, in impact order.**
1. Replace the Lucide CDN library with inlined SVG at build time, or an SVG sprite of the ~97 used icons. Removes 93,699 B transfer + 401,894 B parse + a third origin + the post-DCL DOM mutation pass (see C-1). Estimated sprite size for 97 icons: **~8–12 KB gzipped (estimate)**.
2. Load gtag through a delayed/consent-gated init, or move to a lighter measurement path. It is `async`, so it is not render-blocking, but 498,502 B of raw JS still competes for the main thread during the LCP window.
3. Add `<link rel="preconnect" href="https://unpkg.com">` if Lucide is kept.
*(byte counts observed; INP/TBT impact inferred)*

---

### H-4 (High) — `/js/i18n.js` is a synchronous, unminified, render-blocking script in `<head>` on all 102 pages, and can force a second navigation

**Evidence.** `crawl/index.html:43` — `<script src="/js/i18n.js?v=2"></script>`; 101 other pages carry `?v=3`. No `defer`, no `async`, no `type=module`. 5,656 B raw (unminified, 13 lines of comment header). It is the **last** thing in `<head>`, so it blocks the parser from reaching `<body>` at all.

Worse, it can redirect:
```js
if (saved === 'es' && !onES) { var m = esMirror(path); if (m) { location.replace(m); return; } }
…
if (!saved && !onES && spanishDevice) { … location.replace(es); return; }
```
A first-time visitor with a Spanish device locale landing on any English URL gets a client-side `location.replace()` — a full second navigation (new HTML, new CSS/JS evaluation) before any paint. Their LCP is effectively doubled. Same for any returning visitor with `gsr_lang=es` in localStorage.

**Fix.** (a) Minify it — it is the only unminified JS on the site. (b) Split it: keep only the ~15 lines of redirect logic as a tiny inline `<script>` in `<head>` (avoids the network round-trip entirely), and move the toggle-rewiring + banner code into `main.min.js`. (c) Better: do the Spanish routing server-side at the Cloudflare edge (a Pages `_redirects`/Worker rule on `Accept-Language`) so no client-side navigation happens at all. *(observed — read the live file in full)*

---

### H-5 (High) — Homepage uses different cache-busting query strings than every other page, for byte-identical files

**Evidence.** Verified live on 2026-08-13 by fetching the homepage HTML fresh:

| Homepage (`/`) | All 101 other pages |
|---|---|
| `css/styles.min.css?v=6` | `css/styles.min.css?v=4` |
| `/css/cta.css?v=2` (**unminified**, 2,056 B) | `/css/cta.min.css?v=3` (1,171 B) |
| `/js/i18n.js?v=2` | `/js/i18n.js?v=3` |

`?v=4` and `?v=6` return **identical ETags** (`W/"d98b9b3045997456579686495cedea41"`); `i18n.js?v=2` and `?v=3` likewise (`W/"fbd941054e1b63ec8cdbc4e344c49ddd"`). All are served `cache-control: public, max-age=31536000, immutable`, so the browser stores them as **separate, non-shareable cache entries**.

Consequence: a visitor who lands on the homepage (the highest-traffic entry point) and clicks any internal link re-downloads `styles.min.css` (14,679 B) + `i18n.js` (2,110 B) = **16,789 B compressed / 78,947 B raw** it already has, on the first internal navigation. And in reverse. `cta.css` vs `cta.min.css` are genuinely different files (929 vs 554 B transfer) so the homepage also ships the unminified variant.

**Fix.** Align the homepage to `?v=4` / `cta.min.css?v=3` / `i18n.js?v=3`. Longer term, replace hand-maintained `?v=N` with content-hashed filenames so this cannot drift again. *(observed — ETag comparison is direct evidence)*

---

### H-6 (High, CLS) — Insurance logos declare a 3:1 box but load at ratios from 1.7:1 to 5.2:1

**Evidence.** `crawl/index.html`: `<img src="images/insurance/aetna.webp" alt="Aetna" class="ins-logo" width="120" height="40">` — all 14 logos declare `120×40` (3:1). Their real intrinsics, measured:

| Logo | Declared | Actual | Actual ratio | Bytes |
|---|---|---|---|---|
| carefirst | 120×40 | 419×80 | 5.24:1 | 13,608 |
| emblemhealth | 120×40 | 419×80 | 5.24:1 | 8,580 |
| aetna | 120×40 | 417×80 | 5.21:1 | 9,032 |
| bcbs | 120×40 | 327×80 | 4.09:1 | 13,104 |
| **cigna** | 120×40 | **136×80** | **1.70:1** | 5,310 |
| trustmark | 120×40 | 192×80 | 2.40:1 | 6,592 |
| …14 total | | | | 113,306 |

CSS: `.ins-logo{height:34px;width:auto;max-width:114px;object-fit:contain}`.

With `height` fixed and `width:auto`, the browser sizes the box from the *attribute* ratio until the bitmap arrives, then re-sizes from the *intrinsic* ratio. Pre-load width = 34 × 3 = 102 px for every logo. Post-load: carefirst → `min(34×5.24, 114)` = 114 px (**+12 px**); cigna → 34×1.70 = 58 px (**−44 px**). The container is `.insurance-logos-grid{display:flex;flex-wrap:wrap;justify-content:center;gap:14px}` — centred and wrapping, so every width change re-positions **all** siblings and can re-flow rows.

This runs on **70 pages** (991 mismatched `<img>` tags total). On 69 of them the logos are `loading="lazy"`, meaning the shift fires exactly when the user scrolls the strip into view — i.e. it counts toward CLS.

**Fix.** Set each `width`/`height` attribute to the file's true intrinsic dimensions (or normalise every logo to a common canvas at build time). One-line-per-logo change; eliminates the shift entirely. *(observed — attributes, intrinsics, and CSS all verified; shift magnitude computed from those, not measured in a browser)*

---

### H-7 (High) — `/team` ships 240,519 B of eager JPEG for two 400×400 portraits that already exist as WebP

**Evidence.** `crawl/team.html`:
```html
<img src="images/team/eric-chaghouri.jpg" alt="Dr. Eric Chaghouri, MD" width="400" height="400">
<img src="images/team/ari-labowitz.jpg"   alt="Ari Labowitz"           width="400" height="400">
```
No `loading="lazy"` (the other 5 team photos have it), no `<picture>` — **zero `<picture>` elements exist anywhere on the site**.

| File | Live bytes | Intrinsic | Displayed | WebP already on server |
|---|---|---|---|---|
| `eric-chaghouri.jpg` | **134,633** | 800×800 | 400×400 | `eric-chaghouri.webp` — 75,672 B (unreferenced by this page) |
| `ari-labowitz.jpg` | **105,886** | 800×800 | 400×400 | `ari-labowitz.webp` — 58,286 B (unreferenced) |

**Measured re-encode** at the displayed size (`sips -Z 400` + `cwebp -q 82`): 30,832 B and 30,094 B → **179,593 B saved (−75%)**, on a page whose LCP hero (`waiting-area.webp`, 217,412 B) is *also* un-preloaded (H-2). `/team` is the worst-performing page on the site by initial-payload measure.

**Fix.** Point at 400×400 WebP; add `loading="lazy"` to any portrait below the fold. *(observed + measured re-encode)*

---

### M-1 (Medium) — Homepage eagerly loads 113,306 B of below-the-fold insurance logos

**Evidence.** `.hero{min-height:92vh}` (mobile `85vh`), and the insurance strip is the first section *after* the hero — so on any viewport it is below the fold. Yet on `index.html` all 14 logos are **eager**; on the other 69 pages that carry the same strip they are `loading="lazy"`. Homepage-only regression.

Homepage eager image total: **154,028 B** (14 logos 113,306 + `logo-icon.png` 23,632 + `logo-white.png` 17,090). None of it is the LCP element — the homepage LCP is text (see LCP table).

Note: re-compressing these logos is *not* the fix. I measured a resize-to-240w pass across all 14: 113,306 → 95,288 B, and 4 of the 14 got *larger* (cigna 5,310 → 13,172). They are already reasonably encoded; the problem is purely priority.

**Fix.** Add `loading="lazy"` to the 14 homepage logos, matching the other 69 pages. Removes 113,306 B from LCP-window bandwidth contention. *(observed; the "don't bother re-compressing" conclusion is measured)*

---

### M-2 (Medium) — Site logos: 40,722 B of PNG on every one of 102 pages, 21× larger than needed

**Evidence.**

| File | Live bytes | Intrinsic | Displayed | Loading | Pages |
|---|---|---|---|---|---|
| `/images/logo-icon.png` | **23,632** | 256×256 PNG | 48×48 (nav) | eager | 102 |
| `/images/logo-white.png` | **17,090** | 256×256 PNG | 120×120 (footer) | **eager** | 102 |

`logo-icon.png` is in the nav — critical path on every page. `logo-white.png` is in the footer and is eager on all 102 pages.

**Measured re-encode** (`sips -Z` + `cwebp -q 85`): 96×96 WebP = **1,748 B** (−92.6%); 240×240 WebP = **6,974 B** (−59.2%). Combined **31,000 B saved per page**, ~3.16 MB across the site's page set.

**Fix.** Serve `logo-icon` at 96×96 WebP and `logo-white` at 240×240 WebP; add `loading="lazy"` to the footer logo. *(observed + measured)*

---

### M-3 (Medium, CLS + LCP) — Blog articles set their **entire body copy** in Fraunces with a Georgia fallback

**Evidence.** `blog.min.css`: `.article-body{…font-family:Fraunces,Georgia,serif;font-size:19px;line-height:1.78}` — not just headings, the whole article. Also `.article-title{font-family:Fraunces,…;font-size:clamp(32px,5vw,52px)}`.

Font payload on the 12 blog pages, measured live:

| Font file | Bytes | Needed because |
|---|---|---|
| Plus Jakarta Sans variable (latin) | 27,272 | site chrome |
| Fraunces roman variable (latin) | **67,388** | `.article-title`, `.article-body` |
| Fraunces **italic** variable (latin) | **81,704** | `<em>` inside `.article-body` — present on 10 of 12 blog pages (verified by grep) |
| **Total** | **176,364** | |

All faces carry `font-display: swap` (verified — the only value present in both Google CSS responses). Swap means the article renders in Georgia first, then reflows the *entire* article body when Fraunces arrives. Georgia and Fraunces have materially different metrics, so this is a full-page reflow, not a subtle one.

Neither Fraunces nor Plus Jakarta Sans has `size-adjust` / `ascent-override` / a metric-matched fallback `@font-face` — `styles.min.css` contains **zero** `@font-face` rules (verified).

**Fix.** (a) Restrict Fraunces to headings; set `.article-body` in Plus Jakarta Sans (already loaded, zero marginal cost) — removes the whole-body reflow and likely lets the italic file go unrequested. (b) If Fraunces body copy is a hard design requirement, add a metric-matched fallback:
```css
@font-face{font-family:"Fraunces-fallback";src:local("Georgia");size-adjust:97%;ascent-override:90%;descent-override:22%;line-gap-override:0%}
```
(exact percentages need to be derived per-font — treat those numbers as **placeholders, not measured**). (c) Serve static single-weight subsets instead of the variable font: Fraunces roman is 67,388 B largely because it carries the `opsz` + `wght` axes across their full range. *(font bytes and usage observed; CLS magnitude inferred)*

---

### M-4 (Medium) — Blog cover image is `opacity:0` until JavaScript runs, so it can't be the LCP

**Evidence.** `blog.min.css`: `.blog-reveal{opacity:0;transform:translateY(16px);transition:opacity .6s ease…}` / `.blog-reveal.is-visible{opacity:1}`. Markup in every article:
```html
<div class="article-cover blog-reveal"><img src="…/1554224155-6726b3ff858f.webp" alt="…" width="1000" height="560" loading="eager"></div>
```
An `opacity:0` element is not LCP-eligible. The class is toggled by an inline IntersectionObserver (`is-visible` … `{threshold:0.1}`), so the cover image only becomes paintable after HTML parse + observer callback + a 600 ms opacity transition.

Two more issues in the same block:
- The cover `<img>` is `loading="eager"` but has **no** `fetchpriority="high"` and **no** `<link rel=preload>` — unlike the 70 `page-hero` pages, which do both.
- The byline avatar `/images/team/eric-chaghouri-320.webp` (15,532 B, 320×320 intrinsic, displayed 38×38 by `.blog-byline-avatar{width:38px;height:38px}`) sits **above** the cover image — i.e. above the fold — and is `loading="lazy"`. Lazy-loading an above-the-fold image delays it for no benefit.

**Related, site-wide:** `styles.min.css` has `.reveal{opacity:0;transform:translateY(24px)}` used on **1,422 elements across all 102 pages**, and — unlike `.blog-reveal` — it has **no `@media (prefers-reduced-motion:reduce)` escape hatch**. If `main.min.js` fails to load, that content is permanently invisible. Mitigating factor I verified: `.reveal` never appears before the hero (earliest occurrence is char ~5,548, always in the section *after* `page-hero`), so it does not gate the LCP on the 76 hero pages.

**Fix.** Exclude `.article-cover` from the reveal treatment (or start it at `opacity:1` and only animate `transform`); add `fetchpriority="high"` + a preload for the cover; drop `loading="lazy"` from the byline avatar and downscale it to 76×76; add a `prefers-reduced-motion` fallback to `.reveal`. *(observed)*

---

### M-5 (Medium) — Web-font delivery is a 2-hop cross-origin chain with no font preload

**Evidence.** `<head>` order on every page: `preconnect fonts.googleapis.com` → `preconnect fonts.gstatic.com crossorigin` → `<link rel=stylesheet href="…css2?family=Plus+Jakarta+Sans…">`. The preconnects are correct and present. But there is **no `<link rel=preload as=font>`** anywhere on the site (verified across all 102 pages — the only preloads are `as="image"`).

So: HTML → googleapis CSS (640 B gzip / 8,460 B raw, `cache-control: private, max-age=86400`) → gstatic woff2 (27,272 B). The woff2 URL is only discoverable after the CSS parses. The CSS link is **render-blocking**, so first paint waits on hop 1; `swap` means text then paints in the fallback and reflows after hop 2.

**Fix.** Self-host the two variable woff2 files (they're static and the license permits it). That collapses two cross-origin hops into one same-origin request that can be `preload`ed and served with `immutable` from the same connection already open for the HTML. Removes 2 DNS+TLS handshakes and the `max-age=86400` re-validation on the CSS. *(observed)*

---

### L-1 (Low) — HTML is not edge-cached and carries no validator, but TTFB is fine anyway

**Evidence.** All 102 HTML responses (from `_index.json`, confirmed by fresh live requests):
```
cache-control: public, max-age=0, must-revalidate
cf-cache-status: DYNAMIC
content-encoding: br
```
And critically — **no `etag`, no `last-modified` on HTML** (verified on `/programs/php` and `/`). `max-age=0, must-revalidate` with no validator means a repeat visitor cannot get a 304; every navigation re-downloads the full HTML body (11,952 B br for `/`).

Measured HTML transfer sizes, live:

| Page | identity | br | gzip |
|---|---|---|---|
| `/` | 52,065 | 11,952 | 12,136 |
| `/blog/cost-of-rehab-in-los-angeles` | 32,931 | 10,001 | 9,966 |
| `/team` | 36,871 | 9,621 | 9,729 |
| `/treatments/alcohol` | 35,644 | 9,118 | 9,175 |
| `/programs/php` | 36,054 | 8,654 | 8,655 |
| `/contact` | 23,332 | 5,884 | 5,988 |

**Counter-evidence against treating this as urgent:** measured TTFB across 9 cold-connection requests was **37–51 ms** (dns ~3 ms, tls ~25 ms, ttfb ~38–51 ms), and the crawler's 102-page median was 35 ms with p90 at 45 ms. Cloudflare Pages serves the asset from its own network regardless of `cf-cache-status: DYNAMIC`. So this is a correctness/efficiency nit, not a current LCP bottleneck. I am flagging it rather than recommending action, because "enable HTML edge caching" is a change with real cache-invalidation risk for a YMYL site and the measured payoff here is near zero. *(observed; the "not urgent" judgement is mine)*

---

### L-2 (Low) — Early Hints (103) are already being sent, and are being wasted

**Evidence.** `curl -D -` on `/programs/php` returns, before the 200:
```
HTTP/2 103
link: <https://fonts.googleapis.com>; rel=preconnect
```
Cloudflare Early Hints is **on**, but the only hint is a preconnect to Google Fonts. The single highest-value hint — the LCP hero image, or `styles.min.css` — is not there.

**Fix.** Extend the `Link` response headers (Pages `_headers`) to early-hint `</css/styles.min.css?v=4>; rel=preload; as=style`, and per-route the hero image. This is free latency: the browser starts those fetches before the HTML body is generated. *(observed — this is a real, already-provisioned capability being under-used)*

---

### L-3 (Low) — Homepage review screenshots: 358,194 B for three images displayed at ~380 CSS px

**Evidence.** `index.html`: three `<img … width="1100" height="1229" loading="lazy" decoding="async">` in `.review-shots{display:grid;grid-template-columns:repeat(3,1fr);gap:28px}` inside the standard container — roughly 380 CSS px per column on desktop.

| File | Bytes | Intrinsic | @800w q78 (measured) |
|---|---|---|---|
| `google-review-1.webp` | 154,898 | 1100×1229 | 65,904 |
| `google-review-2.webp` | 108,062 | 1100×904 | 42,946 |
| `google-review-3.webp` | 95,234 | 1100×680 | 43,496 |
| **Total** | **358,194** | | **152,346 (−57%)** |

They're `lazy` + `decoding="async"` and well below the fold, so this is page weight rather than an LCP problem. `<a target="_blank">` links to the full-size version, so a smaller inline copy loses nothing. *(observed + measured re-encode)*

---

### L-4 (Low) — `apple-touch-icon.png` misses the image cache rule

**Evidence.** `/images/*` gets `cache-control: public, max-age=2592000` with `cf-cache-status: HIT`. But `/apple-touch-icon.png` (15,791 B, at the root) gets `cache-control: public, max-age=0, must-revalidate`, `cf-cache-status: REVALIDATED`. **Fix.** Add a root-level icon rule to `_headers`. *(observed)*

---

### C-1 (Medium, CLS + INP) — 3,124 Lucide icon placeholders have no reserved size and are replaced after DOMContentLoaded

**Evidence.** Icons are authored as `<i data-lucide="phone"></i>` — an empty inline element, zero intrinsic width. Lucide replaces each with an `<svg>` on DOMContentLoaded:
```html
<script>document.addEventListener('DOMContentLoaded', () => { if (window.lucide) lucide.createIcons(); });</script>
```
I grepped all four stylesheets for a `[data-lucide]` selector: **zero matches**. Sizing comes only from descendant rules on the *resulting* SVG (`svg{width:14px;height:14px}`, `svg{width:16px;height:16px;flex-shrink:0}`, `svg{width:24px;height:24px}`). So each placeholder goes 0 px → 14/16/24 px wide at replacement time, pushing adjacent text in every button, nav item, breadcrumb and trust badge.

Volume: **3,124 icons site-wide**, median **31 per page**, max 66 (`treatments.html`). This is both a CLS source (post-DCL geometry change) and an INP/TBT source (one synchronous pass building and inserting up to 66 SVG subtrees).

I have not measured the resulting CLS in a browser, so I won't put a number on it — but the mechanism is verified and the element count is large.

**Fix.** Same fix as H-3: inline the SVGs at build time so they're in the initial HTML with correct geometry. If Lucide must stay, add `i[data-lucide]{display:inline-block;width:1em;height:1em}` as a floor so the box is reserved before replacement. *(mechanism observed; magnitude inferred)*

---

## LCP element per key page

Derived from markup + CSS geometry. LCP *identity* is inferred (no browser trace); the underlying markup, byte counts and CSS are observed.

| Page(s) | Likely LCP element | LCP resource bytes | Preloaded? | Notes |
|---|---|---|---|---|
| `/` (homepage) | **Text** — `h1.hero-h1-stack` ("Los Angeles Addiction / Treatment Center / 100+ Recoveries"), `font-size:clamp(22px,calc(8.9vw - 4.3px),36px)` | 0 (text) | n/a | `.hero` background is a `linear-gradient`, which is **not** LCP-eligible. Gated only on `styles.min.css` + font swap. Structurally the fastest page on the site — the 154,028 B of eager images (M-1, M-2) contend for bandwidth but are not the LCP itself. |
| 70 `page-hero` pages (`/programs/*`, `/treatments/*`, `/locations/*`, `/contact`, `/faq`, `/es/*`…) | Hero `background-image` on `<section class="page-hero">`, 100vw × 420 px (320 px mobile) | 19,978 – **279,416** | ✅ yes, `fetchpriority="high"` | Correctly preloaded. Problem is size only (H-1). Heaviest: `/locations` + `/es/locations` at 279,416 B. |
| `/team`, `/es/team` | `.page-hero-bg` background `waiting-area.webp` | **217,412** | ❌ **no** | Worst LCP setup on the site: heaviest hero + no preload + 240,519 B of eager JPEG portraits competing (H-2, H-7). |
| `/our-facility`, `/our-story` (+ `/es/` pairs) | `.page-hero-bg` background `reception-lobby.webp` | 142,484 | ❌ **no** | H-2. `/our-facility` additionally loads 2 eager 1200×1600 facility images (113,472 + 125,802 B) displayed at 800×560. |
| 12 blog pages (`/blog/*`, `/es/blog/*`) | `h1.article-title` in **Fraunces** (webfont, 2-hop) — the `.article-cover` image is `opacity:0` and therefore ineligible until JS | 0 (text) + 176,364 B of fonts | n/a | M-3, M-4. LCP is gated on the Fraunces round-trip; the cover image can't take over until the IntersectionObserver fires. |
| `/blog/` hub, `/programs/`, `/treatments/`, `/families`, `/verify-insurance`, `/es/` | Text heading (no hero image on these 26 pages) | 0 (text) | n/a | Gated on render-blocking CSS + font swap only. |

---

## Render-blocking `<head>` inventory (measured, live)

**Homepage** — 4 render-blocking resources across 2 origins:

| # | Resource | Transfer | Raw | Origin |
|---|---|---|---|---|
| 1 | `fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap` | 640 (gzip) | 8,460 | cross |
| 2 | `css/styles.min.css?v=6` | 14,679 (br) | 73,291 | same |
| 3 | `/css/cta.css?v=2` *(unminified)* | 929 (br) | 2,056 | same |
| 4 | `/js/i18n.js?v=2` *(sync script)* | 2,110 (br) | 5,656 | same |
| | **Total** | **18,358** | **89,463** | |

**Typical interior page** (`/programs/php`): same list with `styles.min.css?v=4` + `cta.min.css?v=3` (554/1,171) + `i18n.js?v=3` → **17,983 / 88,578**.
**Blog pages** add `blog.min.css?v=3` (2,759 / 11,234) → **20,742 / 99,812**.
**`/verify-insurance`** adds `intake.min.css?v=3` (3,133 / 12,942).

Non-blocking but fetched from `<head>`: `gtag.js` (async, 165,713 / 498,502) and `lucide.min.js` (defer, 93,699 / 401,894).
End-of-`<body>`, **not deferred**: `main.min.js?v=4` (5,841 / 17,216) — it is positioned after the footer, so it does not block first paint, but it does block DOMContentLoaded and therefore delays `lucide.createIcons()`, the `.reveal` observer and the `.blog-reveal` observer. Adding `defer` is still correct (it's already in the repo, undeployed) but the gain is small; the real cost is in H-3/C-1.

Static asset caching is correct throughout: `cache-control: public, max-age=31536000, immutable` on all CSS/JS, `cf-cache-status: HIT`, brotli negotiated. `/images/*` gets `max-age=2592000` + HIT.

---

## What is already right (do not "fix" these)

Verified positives, so the next pass doesn't burn effort here:

- **All 1,502 `<img>` tags across all 102 pages carry both `width` and `height`.** Zero omissions. This is the single biggest CLS protection and it is fully in place. (The insurance-logo issue in H-6 is a *wrong value*, not a missing one.)
- **1,256 of 1,502 `<img>` tags are `loading="lazy"`**; only 14 are explicitly eager, and the eager set is small and identifiable.
- **All 70 inline-style `page-hero` pages preload their hero image with `fetchpriority="high"`** — correct modern practice, verified with zero misses. Only the 6 `.page-hero-bg` variants (H-2) miss it.
- **DOM sizes are small**: max 594 elements (`treatments/dbt`), median 381. Well under the 1,500-element threshold. Excessive DOM is not an INP factor here.
- **`preconnect` to both `fonts.googleapis.com` and `fonts.gstatic.com`** is present and correctly `crossorigin`-flagged on the gstatic one.
- **`font-display: swap`** on all 32 `@font-face` declarations (verified in both live Google CSS responses).
- **TTFB 37–51 ms**, HTTP/2, `alt-svc: h3` advertised, brotli on HTML and all static assets.
- **Early Hints (103) already enabled** — under-used (L-2), but provisioned.
- Images are already WebP almost everywhere (the team JPEGs in H-7 are the notable exception), and `-800` responsive variants already exist for most facility images — the infrastructure for H-1's fix is half-built.

---

## Prioritised fix list

| # | Fix | Measured saving | Pages | Effort |
|---|---|---|---|---|
| 1 | Replace Lucide CDN with inlined/sprited SVG | −93,699 B transfer, −401,894 B parse, −1 origin, −DOM mutation pass | 102 | M |
| 2 | Responsive hero variants (`-800`/`-1200`) + viewport-aware preload | −52% to −76% of the LCP resource | 76 | M |
| 3 | Add preload to the 6 `.page-hero-bg` pages | removes worst-case LCP load-delay on a 217 KB asset | 6 | **XS** |
| 4 | Align homepage asset query strings to `?v=4`/`?v=3` | −16,789 B on first internal navigation | 1 | **XS** |
| 5 | Fix insurance-logo `width`/`height` to true intrinsics | removes a verified CLS source | 70 | S |
| 6 | `/team`: 400×400 WebP portraits | −179,593 B | 1 | XS |
| 7 | Logos → 96px / 240px WebP; lazy the footer logo | −31,000 B **per page** | 102 | S |
| 8 | `.article-body` → Plus Jakarta Sans (keep Fraunces for headings) | −67,388 to −149,092 B of fonts + removes whole-body FOUT reflow | 12 | S |
| 9 | Homepage insurance logos → `loading="lazy"` | −113,306 B from the LCP window | 1 | XS |
| 10 | Inline + minify `i18n.js`, or move routing to the edge | −1 render-blocking request; removes double-navigation for es-locale users | 102 | M |
| 11 | `.article-cover` out of `.blog-reveal`; add `fetchpriority=high`; un-lazy the byline avatar | makes the cover LCP-eligible | 12 | XS |
| 12 | Self-host the two woff2 files + preload | −2 cross-origin hops | 102 | M |
| 13 | Downscale the 3 review screenshots to 800w | −205,848 B | 1 | XS |
| 14 | Extend Early Hints `Link` headers to preload CSS + hero | free latency | 102 | S |

Items 3, 4, 6, 9, 11, 13 are all sub-15-minute changes and together remove ~530 KB plus the worst LCP-delay case.

---

## Limits of this audit

- **No browser was run.** Every LCP element identification is inferred from markup + CSS geometry, and every CLS magnitude is inferred from attribute/intrinsic mismatches. A Lighthouse or WebPageTest run would confirm or overturn the LCP-element calls, particularly on the blog pages where the h1-vs-cover-image question depends on viewport height.
- **No CSS coverage measurement.** `styles.min.css` is 73,291 B / 882 rules shipped to all 102 pages; some fraction is unused per page. I did not measure it and am not claiming a number.
- **TTFB was measured from a single US-East vantage** (`cf-ray … -ATL`). Numbers for visitors far from that colo will differ; given `cf-cache-status: DYNAMIC` this is the measurement most likely to be optimistic. The other agent's CrUX data should be trusted over my 37–51 ms if they conflict.
- **Re-encode savings** (H-1, H-7, M-2, L-3) were produced with `cwebp` at q72–q85 on the actual live files. They are real byte counts, but the quality settings are my choice — a visual QA pass could push them either way.
