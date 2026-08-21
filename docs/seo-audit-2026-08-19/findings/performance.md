# Performance Audit — https://www.goldenstate-rehab.com/

Date: 2026-08-19. Target: live production site (Cloudflare Pages, static HTML).

---

## 0. NO CWV MEASUREMENT WAS POSSIBLE THIS SESSION

**Everything in this report is static and asset analysis. There are no LCP, INP, CLS, FCP, TBT, or Lighthouse score values in it, and none should be inferred from it.**

Both measurement paths failed, confirmed independently twice (by me and by the orchestrator):

| Source | Result |
|---|---|
| PageSpeed Insights API, keyless | **HTTP 429** — "Quota exceeded for quota metric 'Queries' ... `quota_limit_value: 0`" for the shared anonymous project. Mobile attempted twice; desktop and the second deep page were abandoned. |
| CrUX API, keyless | **HTTP 403** — "Method doesn't allow unregistered callers." Requires an API key. |

No field data, no lab data. Claims below are labelled:

- **[MEASURED]** — pulled over the network from production with `curl`, or read off disk in the repo.
- **[INFERRED]** — derived from measured facts plus code reading, with the reasoning shown.

To get real numbers you need a Google Cloud API key, or a local browser run:
```bash
npx lighthouse https://www.goldenstate-rehab.com/ --preset=perf --output json   # no quota needed
curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://www.goldenstate-rehab.com/&strategy=mobile&category=performance&key=YOUR_KEY"
curl -X POST "https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=YOUR_KEY" \
  -H "Content-Type: application/json" -d '{"origin":"https://www.goldenstate-rehab.com","formFactor":"PHONE"}'
```
Before assuming a key solves it: this origin may have **too little traffic to appear in CrUX at all**. Check that first.

---

## 1. Server / delivery — MEASURED, and it is excellent

Three consecutive requests per URL, US client, `Accept-Encoding: br, gzip`:

| URL | TTFB (3 runs) | Total | Wire bytes |
|---|---|---|---|
| `/` | **60 / 63 / 66 ms** | 99–110 ms | 16,344 B |
| `/treatments/fentanyl` | **219 / 146 / 71 ms** | 129–221 ms | 10,749 B |
| `/blog/` | **64 / 68 / 115 ms** | 115–123 ms | 10,574 B |

Homepage HTML: 69,091 B raw → **16,344 B on the wire** (76% reduction). HTTP/2 with h3 advertised.

**Headers [MEASURED]:**
- `/` → `content-encoding: br`, `cache-control: public, max-age=0, must-revalidate`, `cf-cache-status: DYNAMIC`
- `/css/styles.min.css?v=17` → `content-encoding: br`, `cache-control: public, max-age=31536000, immutable`, `cf-cache-status: HIT`
- `/js/main.min.js` → `cache-control: public, max-age=31536000, immutable`, `cf-cache-status: HIT`

**TTFB is not a problem.** 60–70 ms warm, far under the 200 ms guidance. The single 219 ms reading was a cold edge miss that dropped to 71 ms by the third run. The `_headers` immutable policy is confirmed working on both `/css/*` and `/js/*`.

---

## 2. Real asset weight — MEASURED over the wire

Homepage cold-load critical resources, actual production transfer sizes:

| Resource | Wire bytes | Origin | Loading |
|---|---|---|---|
| `/` HTML | 16,344 B | own | — |
| `unpkg.com/lucide@1.16.0/.../lucide.min.js` | **93,639 B** | **third-party** | `defer` |
| `fonts.googleapis.com/css2?...` | 8,460 B | third-party | **render-blocking** |
| `/css/styles.min.css?v=17` | 12,832 B gzip / 14,238 B br | own | **render-blocking** |
| `/js/main.min.js?v=8` | 3,886 B | own | `defer` |
| `/js/i18n.js?v=2` | 2,185 B | own | **RENDER-BLOCKING — no defer/async** |
| `googletagmanager.com/gtag/js` | not measured | third-party | `async` |
| woff2, Plus Jakarta Sans, 5 weights | samples 1,716 B and 8,352 B | fonts.gstatic.com | discovered only after fonts CSS parses |
| 17 eager homepage images | ~169 KB on disk | own | eager |

**JS on the homepage totals ≈ 99,710 B, of which Lucide is 93,639 B — 94%.** First-party JS is only ~6 KB.

### 5 largest images actually referenced by a page [MEASURED, on-disk]

| # | File | Size | Used on | Role |
|---|---|---|---|---|
| 1 | `images/facility/waiting-area.webp` | **212.3 KB** | 3 pages incl. `team.html` | **LCP hero background, not preloaded** |
| 2 | `images/facility/recreation-room.webp` | **177.3 KB** | 3 pages | in-page |
| 3 | `images/reviews/google-review-1.webp` | **151.3 KB** | 1 page (homepage) | lazy, below fold |
| 4 | `images/facility/individual-therapy-room.webp` | **143.4 KB** | 13 page-refs | in-page |
| 5 | `images/facility/reception-lobby.webp` | **139.1 KB** (142,484 B measured over the wire) | 9 page-refs incl. `our-facility.html` | **LCP hero background, not preloaded** |

Runner-up worth naming: `images/team/eric-chaghouri.jpg` at **131.5 KB** — one of only 6 remaining JPGs in active use, with no WebP counterpart.

**Format coverage [MEASURED]:** of 92 distinct referenced image files, **78 are WebP**, 6 JPG, 6 PNG, 2 SVG. **No AVIF anywhere.** Total referenced image weight is 5.03 MB sitewide; `images/` on disk is **21 MB**, so roughly 16 MB is unreferenced (36 of 60 `.jpg` files are referenced by no HTML, CSS, or JS) and still deploys.

---

## 3. LCP element analysis

### 3a. Homepage — LCP is TEXT, and it is structurally clean [MEASURED + INFERRED]

There is **no hero image on the homepage** and **no `<picture>` element on the page at all**. The hero is:
```html
<section class="hero" aria-label="Hero">
  <h1 class="hero-h1-stack"><span class="hero-h1-line">Los Angeles Addiction</span>
  <span class="hero-h1-line">Treatment Center</span>
  <span class="hero-h1-line hero-h1-proof">100+ Recoveries</span></h1>
```
The LCP candidate is this three-line H1 text block. [INFERRED from DOM structure — not confirmed by a real LCP measurement.]

**This is good, for a specific reason worth stating:** I verified the hero H1 does **not** carry the `.reveal` class (`css/styles.css:1673` — `.reveal { opacity: 0 }`, made visible only by an IntersectionObserver in the `defer`red `main.min.js`). Above-fold content is therefore **not gated on JavaScript**. Only below-fold sections (`section-header reveal`, `review-shot reveal`) use it. That is the most common self-inflicted LCP disaster and this site avoids it.

The homepage has **no `<link rel="preload">` at all**. For a text LCP that is defensible — but the critical webfont weight should be preloaded (see §5).

### 3b. Deep treatment/program pages — background-image LCP, preloaded correctly [MEASURED]

`/treatments/fentanyl` sets the hero directly on the section:
```html
<section class="page-hero" style="background-image: url('https://www.goldenstate-rehab.com/images/heroes/1607619056574-7b8d3ee536b2.webp');">
```
and preloads it in `<head>`:
```html
<link rel="preload" as="image" href="https://www.goldenstate-rehab.com/images/heroes/1607619056574-7b8d3ee536b2.webp" fetchpriority="high">
```
**Measured transfer: 99,380 B.** This is done **right**. CSS background images are valid LCP candidates but are discovered late (only after CSSOM is built), so preloading with `fetchpriority="high"` is exactly the correct remedy. 70 of 116 pages carry such a preload.

**Not lazy-loaded [VERIFIED]:** these are CSS backgrounds, so `loading="lazy"` cannot apply. On every page inspected, no above-fold `<img>` carries `loading="lazy"`. Homepage: 41 images, 24 lazy, all below the fold. **There is no LCP-lazy-load bug on this site.**

### 3c. `our-facility` / `team` / `our-story` — the worst LCP case on the site [MEASURED] — **CRITICAL**

Six pages use a different hero pattern: a child `.page-hero-bg` div instead of the section itself. **All six lack any preload.** Verified by enumeration:

```
NOPRELOAD team.html
NOPRELOAD our-facility.html
NOPRELOAD our-story.html
NOPRELOAD es/team.html
NOPRELOAD es/our-facility.html
NOPRELOAD es/our-story.html
```
(`grep -c 'rel="preload"' team.html` → **0**.)

`our-facility.html`:
```html
<section class="page-hero">
  <div class="page-hero-bg" style="background-image: url('images/facility/reception-lobby.webp');"></div>
```
`team.html` → `images/facility/waiting-area.webp` (212.3 KB, the largest referenced image on the entire site).

So on these six pages the LCP resource is:
1. **Not preloaded** — discovery is blocked behind HTML parse → CSSOM → the render-blocking `i18n.js`, so the request starts late in the waterfall;
2. **Nested one level deeper** (`.page-hero-bg` inside `.page-hero`), which is why the preload pattern applied to the other 70 pages was never extended here — this looks like an oversight, not a decision;
3. **Served at full 1600px width to every device**, when an 800w variant already exists and is 71% smaller:

| File | Measured wire bytes |
|---|---|
| `/images/facility/reception-lobby.webp` (in use) | **142,484 B** |
| `/images/facility/reception-lobby-800.webp` (exists, unused for the hero) | **41,980 B** |

The fix is unusually cheap because the assets are already generated: add a `rel=preload as=image fetchpriority=high` to each of the six pages and serve the `-800` variant under a mobile media query. **~100 KB off the LCP resource on six pages, using files already in the repo.**

### 3d. Hero directory has no responsive variants at all [MEASURED] — **HIGH**

`.page-hero` CSS is only (`css/styles.css:1889`):
```css
.page-hero { background-size: cover; background-position: center; }
```
No `image-set()` anywhere in `styles.css` (0 occurrences; only 3 `background-image` declarations total). Crucially, **`images/heroes/` contains zero `-800` or `-1200` files**, while `images/facility/` has 20. Measured heroes served identically to a 390px phone and a 2560px desktop: 128,944 B (`group-therapy-room.webp`, preloaded on 7 pages), 99,380 B, 55,086 B, 27,022 B.

Because heroes are CSS backgrounds, **`srcset` cannot apply** — the fix must be `image-set()` or media-query overrides, plus generating the missing variants.

---

## 4. Render-blocking critical path

Live `<head>` of `/` [MEASURED]:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script src="https://unpkg.com/lucide@1.16.0/dist/umd/lucide.min.js" defer></script>
<link rel="stylesheet" href="css/styles.min.css?v=17">
<script src="/js/i18n.js?v=2"></script>     <!-- NO defer, NO async -->
```

First paint waits on **all three** of: the cross-origin Google Fonts CSS, the same-origin `styles.min.css`, and the blocking `i18n.js`. The woff2 files are only *discovered* after the fonts CSS parses — a third serial hop.

Chain depth to first styled text: **HTML → (fonts CSS ∥ styles.css ∥ i18n.js) → woff2.**

Preconnects to both font origins are present and correct, removing DNS+TLS from that third hop but not the round trip. **There is no preconnect to `unpkg.com`**, which serves the single largest file on the page.

`/js/i18n.js` is render-blocking on **all 116 pages** [MEASURED from `pages.json`].

Minor consistency bug: `index.html` requests `/js/i18n.js?v=2` while the other 114 pages request `?v=3`. Given the 1-year immutable cache header, homepage visitors get a **different, older cached copy** of the language-routing script than every other page serves. Worth reconciling. **[MEDIUM]**

---

## 5. Font loading strategy — Google Fonts, `swap`, no self-hosting, no metric matching [MEASURED]

Stated plainly:

- **Not self-hosted.** All fonts come from `fonts.googleapis.com` → `fonts.gstatic.com`.
- **`css/styles.css` contains 0 occurrences of `@font-face` and 0 occurrences of `font-display`.** The only `font-display` in play is **`swap`**, set via the `&display=swap` query parameter on the Google Fonts URL.
- **Plus Jakarta Sans at 5 weights** (400, 500, 600, 700, 800) on 88 pages.
- **16 blog pages additionally load Fraunces** with a full variable optical-size axis: `ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400;1,9..144,600`.
- The stylesheet itself is **render-blocking, 8,460 B, cross-origin.**
- **No `<link rel=preload as=font>` anywhere.**

Consequences: `swap` is the right choice over `font-display: block` (it avoids FOIT), but with **no `size-adjust` / `ascent-override` fallback metrics defined**, the swap from the system fallback to Plus Jakarta Sans reflows text. The homepage LCP element is a large three-line H1 — precisely the element where a font swap moves the most pixels.

*Fix:* self-host woff2 subsets, declare `@font-face` with `font-display: swap` **plus** a `size-adjust`-tuned local fallback, and preload the one or two weights used above the fold. Removes two origins from the critical path and eliminates the H1 swap shift. Also audit whether all 5 weights are genuinely used.

---

## 6. CLS risks

### Image dimensions — near-perfect, and one correction

Across all 116 pages, **exactly one page has images missing `width`/`height`**: `amenity-map.html`, at **17 of 17**. Every other page is at zero. Homepage: 41 images, 0 missing. Unusually disciplined; removes the #1 CLS cause sitewide.

**Correction on the insurance logos — this is NOT a CLS defect.** There are 980 `width="120" height="40"` attributes sitewide, and those attribute values do not match the rendered box. But `.ins-logo` in `css/styles.css:1004` overrides them:
```css
.ins-logo { height: 34px; width: auto; max-width: 114px; object-fit: contain; filter: grayscale(1); }
```
Because the stylesheet is render-blocking, the CSS is always applied before first paint, so **the mismatched attributes never produce a layout shift.** The insurance logos are a byte-weight issue only (§7 M2), not a stability issue.

### Lucide icon injection — the real CLS risk [INFERRED, high confidence] — **HIGH**

- Homepage contains **54** `data-lucide` placeholders; `/treatments/fentanyl` contains **32**.
- They are emitted as bare empty inline elements: `<i data-lucide="phone"></i>`, `<i data-lucide="chevron-down"></i>`.
- I grepped `css/styles.css` for `[data-lucide]`, `i[data-lucide]`, and `.icon` sizing rules — **zero matches**. Nothing reserves space.
- `lucide.createIcons()` runs only after the `defer`red 93.6 KB bundle downloads, parses and executes, then **replaces each empty `<i>` with an `<svg width="24" height="24">`**.

32–54 zero-width inline elements each become 24px wide **after first paint**. Several are above the fold — the nav "Call Now" button (`<i data-lucide="phone">`) and the medical-review byline (`<i data-lucide="shield-check">`). [INFERRED — no CLS value was measured, but the mechanism is confirmed in both the HTML and the CSS.]

### Not a CLS risk [VERIFIED]

`.reveal { opacity: 0; transform: translateY(24px) }` animates only `opacity` and `transform`. Neither affects layout, so scroll reveals contribute **nothing** to CLS. Correctly implemented.

---

## 7. INP surface — small and mostly well-built [MEASURED]

- **DOM size: 669 elements (homepage), 426 (`/treatments/fentanyl`)** — far under the 1,500 threshold. Not a problem.
- `js/main.js`: 33 `addEventListener` calls (16 click, 3 scroll, 3 resize, 3 keydown), 4 `IntersectionObserver`s. Modest.
- **Scroll handlers are correctly built** — `js/main.js:34`:
  ```js
  window.addEventListener('scroll', () => {
    if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  ```
  rAF-throttled and passive; `js/main.js:159` also passes `{ passive: true }`.
- 0 iframes on the homepage.

**The dominant main-thread risk is Lucide:** 93.6 KB of gzipped third-party JS that must parse, execute, then perform 32–54 DOM replacements in one uninterrupted task.

---

## 8. Findings, severity-tagged

### CRITICAL

**C1 — Lucide is 94% of all JavaScript, on 115 of 116 pages, from a third-party CDN.**
93,639 B gzipped from `unpkg.com` to render a small fixed set of icons. **No `preconnect` to `unpkg.com`** (only the two font origins are preconnected), so it pays full DNS+TLS+TCP setup. It is the largest transfer on every page, the largest main-thread task, and the primary CLS source (§6). It is also a availability dependency: an unpkg outage breaks every icon sitewide.
*Fix:* inline the ~15–20 unique SVGs at build time (a node/sed pass replacing `<i data-lucide="x">` with the literal SVG), or self-host a hand-built subset.

**C2 — Six pages have an unpreloaded, oversized, late-discovered LCP background image.** `team`, `our-facility`, `our-story` and their three ES mirrors. See §3c. Measured: `reception-lobby.webp` **142,484 B** in use vs **41,980 B** for the `-800` variant that already exists in the repo.

**C3 — `/js/i18n.js` is render-blocking in `<head>` on all 116 pages.**
No `defer`/`async`, and it sits *after* the stylesheet link, so it must wait for CSSOM before executing, then stalls the parser. The blocking behaviour is **intentional** — the file's own header comment says "Runs in `<head>` (before paint) to avoid a flash of the wrong language" — so adding `defer` is the wrong fix; it would reintroduce the flash.
*Fix:* inline the 2,185 B into `<head>` as a literal `<script>` block. Identical pre-paint semantics, one fewer serialized request on the critical path. This also resolves the `?v=2`/`?v=3` skew in §4.

### HIGH

**H1 — `images/heroes/` has no responsive variants and heroes are CSS backgrounds.** §3d. Up to 128,944 B served to a 390px phone across ~70 pages. Requires generating variants + `image-set()`/media queries, since `srcset` cannot apply to backgrounds.

**H2 — Lucide icon injection causes post-paint layout shift.** §6. Same root fix as C1; a one-line stopgap exists: `[data-lucide]{display:inline-block;width:24px;height:24px}`.

**H3 — Google Fonts is a render-blocking cross-origin stylesheet, 5 weights (6th family on 16 blog pages), no preload, no fallback metric matching.** §5.

**H4 — `amenity-map.html` is a heavy outlier and it is publicly linked.**
Live at `/amenity-map` (HTTP 200, 42,572 B). Loads **Handlebars 4.7.7 (24,348 B)** from `ajax.googleapis.com` **plus the full Google Maps JS API** with `libraries=places,geometry` — a multi-hundred-KB third-party bundle. It is the **only** page on the site with images missing dimensions (17/17), and it hotlinks Material icon SVGs from `fonts.gstatic.com`. Linked from `our-facility.html`, `locations.html`, and both ES mirrors.
*Out of perf scope but flagging it:* the Google Maps **API key is exposed in page source** (`key=AIzaSyBCIhLSe9iCspJKj1AYmCCPcZNNJ8o6sE8`). Client-side Maps keys are necessarily public, but this one must have HTTP-referrer restrictions set in Google Cloud Console or it can be billed against by anyone. Verify separately.

### MEDIUM

**M1 — Three tiny logos are ~58 KB of the 169 KB eager above-fold payload.** Worst bytes-per-displayed-pixel [MEASURED]:

| File | On-disk | Displayed at | Bytes/px |
|---|---|---|---|
| `/images/joint-commission-gold-seal.webp` | 18.7 KB | **20×20** | **47.8** |
| `images/logo-icon.png` | 23.1 KB | **48×48** | **10.3** |
| `/images/joint-commission-gold-seal.webp` (2nd use) | 18.7 KB | 44×44 | 9.9 |
| `images/logo-white.png` | 16.7 KB | 120×120 | — |

An 18.7 KB file rendered at 20×20 CSS px is ~40× oversized. The logos should be SVG; the seal needs 40×40 and 88×88 variants.

**M2 — 14 insurance logos load eagerly**, 7.5–13.3 KB each (`carefirst.webp` 13.3 KB, `bcbs.webp` 12.8 KB, `carelon.webp` 11.2 KB, `highmark.webp` 9.6 KB), ~100 KB total; `images/insurance/` is 408 KB. Byte-weight only — **not a CLS defect** (§6). Lazy-load if below the fold, or consolidate into one SVG sprite.

**M3 — `i18n.js` version skew**, `?v=2` on the homepage vs `?v=3` elsewhere, under a 1-year immutable cache. §4.

**M4 — No AVIF anywhere.** WebP coverage is strong (78 of 92). AVIF typically saves another 20–30% on photographic heroes. Fold into the C2/H1 responsive work rather than a separate pass.

### LOW

**L1 — ~16 MB of unreferenced originals deploy on every build.** `images/` is 21 MB on disk; only 5.03 MB is referenced. **36 of 60 `.jpg` files are referenced nowhere.** Largest: `joint-commission-gold-seal-1800.png` (914,352 B), `dhcs-license.jpg` (223,940 B), `heroes/1506126613408-eca07ce68773.jpg` (668,375 B), `heroes/1444723121867-7a241cacace9.jpg` (530,533 B). No runtime CWV impact — deploy hygiene only.

**L2 — Homepage HTML is the largest at 65,694 B raw**, with 5 inline `<script>` blocks and 3 inline `<style>` blocks (4,034 B inline CSS). Sitewide, 41 pages carry 8 inline script blocks, 35 carry 7. Compresses to 16.3 KB so transfer cost is fine, but inline scripts are unminified and block a strict CSP. Second-largest: `faq.html`, 62.8 KB.

**L3 — HTML is `max-age=0, must-revalidate` / `cf-cache-status: DYNAMIC`.** Static HTML could be edge-cached with a short TTL + `stale-while-revalidate`. TTFB is already 60 ms, so upside is small.

**L4 — Hero preload tag is emitted after the blocking script in `<head>`** on the 70 pages that have one. The preload scanner handles this, so impact is near zero; reordering is free.

**L5 — Compression oddities.** `styles.min.css` is **larger** under brotli (14,238 B) than gzip (12,832 B) — inverted from the norm, unexplained, ~1.4 KB. `main.min.js` returned `content-encoding: gzip` even when `br` was offered. Both negligible; noting so nobody assumes "br is on" means "smaller."

---

## 9. Prioritized action list

| # | Action | Severity | Saving | Effort |
|---|---|---|---|---|
| 1 | Preload the hero on the 6 `.page-hero-bg` pages + serve existing `-800` variants | CRITICAL | −100 KB LCP resource ×6 pages, assets already exist | **Small** |
| 2 | Add `[data-lucide]{display:inline-block;width:24px;height:24px}` | HIGH | Kills icon CLS today | **1 line** |
| 3 | Inline `i18n.js` into `<head>`; drop the external request | CRITICAL | −1 serialized critical-path request ×116 pages; fixes version skew | Small |
| 4 | Inline Lucide SVGs at build; drop `unpkg.com` | CRITICAL | −93.6 KB JS, −1 origin, removes largest main-thread task | Medium |
| 5 | Generate `images/heroes/` 800w+1200w variants; `image-set()`/media queries | HIGH | ~50–90 KB per mobile LCP across ~70 pages | Medium |
| 6 | Self-host fonts: `@font-face` + `size-adjust` fallback + preload critical weight | HIGH | −2 origins from critical path; kills H1 swap shift | Medium |
| 7 | Logos → SVG; resize gold seal to 40×40 / 88×88 | MEDIUM | ~55 KB above the fold | Small |
| 8 | Lazy-load or spritify the 14 insurance logos | MEDIUM | ~100 KB | Small |
| 9 | `amenity-map.html`: add 17 image dimensions, lazy-init Maps on interaction, verify API-key referrer restrictions | HIGH | Large on that page + security | Medium |
| 10 | Prune 36 unreferenced JPGs / ~16 MB from `images/` | LOW | Deploy size only | Small |

**Note the ordering:** items 1–3 are small, cheap, and hit CRITICAL findings. Item 1 in particular uses assets that already exist in the repo. Do those before the larger refactors in 4–6.

---

## 10. What I could not verify

- **No LCP, INP, CLS, FCP, TBT, or performance score.** PSI 429 (twice), CrUX 403. Every CWV claim above is a mechanism identified in code, not a measured metric.
- **No field data**, and possibly none exists — this origin may be below the CrUX reporting threshold.
- **I did not run a browser.** Chain depth, blocking behaviour, and the Lucide CLS mechanism are read off the live HTML/CSS/JS, not observed in a rendering engine. `npx lighthouse` would confirm all of it locally with no quota.
- **Desktop strategy and a second PSI deep page were never measured.**
- **GTM/`gtag` payload size was not measured.** It is `async` so it is off the render path, but it contends for main thread during the INP window.
- **Which specific `data-lucide` icons sit above the fold** was established by inspection of two pages (`/` and `/treatments/fentanyl`), not all 116.
