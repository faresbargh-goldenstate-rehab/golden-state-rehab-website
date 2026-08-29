# Resource-level performance audit — goldenstate-rehab.com (lab, 2026-08-29)

Scope: curl measurements from a US (ATL edge) vantage point, homepage HTML parse, local repo inspection, and two Playwright Chromium runs emulating Pixel 7 (no CPU/network throttling). PSI/CrUX field data is covered by a separate agent and not duplicated here. All numbers below are observed unless marked "estimate".

## Verdict

The site is already lean: CSS, JS and images are all Cloudflare edge HITs with 1-year immutable (CSS/JS) or 30-day (images) caching, HTML is brotli'd to 18 KB, and there is no hero image at all — the LCP element is the hero subheadline `<p>` (text), so LCP == FCP and is gated purely by the render-blocking chain in `<head>`. CLS measured 0.00 and no long tasks were recorded in either run. The remaining wins are small and all in `<head>`: a synchronous first-party script, a render-blocking cross-origin Google Fonts stylesheet, a 94 KB unpkg icon library with no SRI, and ~240 KB of gtag + swg publisher.js.

## 1. Pages, TTFB, caching

| Resource | HTTP | TTFB (curl) | Transfer (br) | Raw | cache-control | cf-cache-status |
|---|---|---|---|---|---|---|
| `/` | 200 | 185 ms | 17,978 B | 76,013 B | `public, max-age=0, must-revalidate` | DYNAMIC |
| `/programs/php` | 200 | 207 ms | 10,570 B | 40,987 B | same | DYNAMIC |
| `/blog` | **301 -> /blog/** | 145 ms | 21 B | — | same | DYNAMIC |
| `/blog/` | 200 | 167 ms | 10,543 B | 46,104 B | same | DYNAMIC |
| `/css/styles.min.css?v=36` | 200 | 127 ms | 16,441 B | 82,066 B | `public, max-age=31536000, immutable` | **HIT** (age 730,399 s) |
| `/js/i18n.min.js?v=4` | 200 | 121 ms | 1,268 B | 3,126 B | `public, max-age=31536000, immutable` | **HIT** (age 780,095 s) |
| `/js/main.min.js?v=13` | 200 | — | 4,388 B | 13,158 B | immutable | HIT |
| `/images/**` (14 sampled) | 200 | — | see §3 | — | `public, max-age=2592000` | **HIT** (all 14) |

Evaluation: HTML DYNAMIC with `max-age=0, must-revalidate` is the deliberate choice documented in `_headers` (browser revalidates each load; edge serves from Pages origin). With TTFB at 145–207 ms from ATL that is acceptable and well under the 800 ms "good" TTFB line; Playwright's cold run saw 659 ms TTFB and the warm run 194 ms, so first-visit TTFB from a cold edge can be ~3x higher. The `_headers` rules for `/css/*`, `/js/*`, `/images/*` are demonstrably authoritative in production (edge HITs with week-old `age`), so the "Respect Existing Headers" caveat in the file comment is already satisfied. Static-asset caching is correct; no action needed there.

Minor: internal links to `/blog` cost a 301 hop (~145 ms) before the page; link to `/blog/` directly (or add a Pages `_redirects`-free canonical) if any nav/footer uses the bare form. `/programs/php` emits a `Link: <https://fonts.googleapis.com>; rel=preconnect` HTTP header that the homepage does not — inconsistent but harmless.

## 2. Render-blocking `<head>` inventory (homepage)

Order as shipped in `index.html`:

| # | Resource | Blocking? | Transfer | Notes |
|---|---|---|---|---|
| 1 | `googletagmanager.com/gtag/js?id=G-3LLBGYXQ0Y` | no (`async`) | **169,748 B** br | Largest single download on the page. `cache-control: private, max-age=900`. |
| 2 | inline gtag bootstrap | 162 B inline | — | |
| 3 | `fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap` | **yes** (stylesheet, cross-origin) | 640–940 B CSS + 21–27 KB woff2 (latin subset) | Blocks first paint until a fonts.googleapis.com round-trip completes; preconnect present. |
| 4 | `unpkg.com/lucide@1.16.0/dist/umd/lucide.min.js` | no (`defer`) | **93,699 B** gzip | Pinned version (good). No `integrity`/SRI, no fallback: unpkg outage or tamper = broken/blank icons in CTAs (`<i data-lucide="arrow-right">`). |
| 5 | `css/styles.min.css?v=36` | **yes** | 16,741 B br | Fine size; ~55% of declaration bytes unused on the homepage (estimate, §4). |
| 6 | `/js/i18n.min.js?v=4` | **yes** (sync, no async/defer) | 1,568 B | Reads `localStorage`/cookie for `gsr_lang` and may `location.replace` to `/es/...`. Parser blocks until it downloads and executes; it sits *after* the CSS so it also waits on CSS (scripts cannot run until preceding stylesheets load). |
| 7 | `news.google.com/swg/js/v1/publisher.js` | no (`async`) | **73,397 B** gzip | Google "Preferred Sources"/swg. `max-age=3000`. |

Playwright confirms exactly three `renderBlockingStatus === "blocking"` resources: the Google Fonts CSS, `styles.min.css`, and `i18n.min.js`.

Third-party total: ~337 KB compressed (gtag 170 KB + lucide 94 KB + swg 73 KB) vs ~40 KB for all first-party CSS+JS combined. None of it blocks rendering, but all of it competes for bandwidth/CPU on a throttled mobile connection and lucide's `createIcons()` runs a DOM walk at DCL over an 860-element DOM.

## 3. Images

Homepage references 48 `<img>` + one inline `background-image` (`.cta-banner-bg` -> `images/facility/tv-lounge.webp`, 113 KB). Findings:

- **No hero/LCP image exists.** `.hero` uses a CSS `linear-gradient` (`css/styles.css:540`). LCP element in both runs = `p.hero-subheadline` (text, 13,940 px²). `fetchpriority="high"`/preload for a hero image is therefore N/A.
- **Every `<img>` has explicit `width` and `height`** (48/48). Measured CLS = 0 in both runs. No CLS risk from images.
- **Formats:** 40 webp, 6 jpg (team headshots, 400x400, 67–135 KB each — `eric-chaghouri.jpg` is 134,633 B for a 400 px avatar), 2 png (`logo-icon.png` 23,632 B as a 48x48 nav logo; `logo-white.png` 17,390 B at 120x120). No AVIF, no `srcset` anywhere.
- **Lazy loading:** reviews, facility, team images all carry `loading="lazy"`; nav logo, JCAHO seal and 14 insurance logos (~9–14 KB each webp, ~150 KB total) are eager. `logo-white.png` (footer) is eager and was fetched at 213 ms — it should be lazy.
- **Oversized review screenshots:** `google-review-1.webp` 154,898 B (1100x1229), `-2` 108,062 B, `-3` 95,234 B — the three largest transfers on the page, and each review image is referenced twice (duplicated carousel/slider markup). Chromium's lazy threshold still fetched -1, -2, -4 by ~660 ms on mobile.
- **Duplicated DOM:** all 6 review images and all 6 team headshots appear twice in the HTML (indices 2–11 and 34–45), which is why the DOM is 860 elements for a fairly simple page.
- Cold-load total transfer (Playwright, mobile, no throttling): 629,621 B over 34 requests.

Ten largest files in local `images/` (21 MB total, 60 jpg / 18 png / 80 webp / 1 svg): `joint-commission-gold-seal-1800.png` 893 KB, `heroes/1506126613408-eca07ce68773.jpg` 653 KB, `heroes/1444723121867-7a241cacace9.jpg` 518 KB, `facility/waiting-area.jpg` 482 KB, `facility/recreation-room.jpg` 476 KB, `facility/reception-lobby.jpg` 440 KB, `facility/individual-therapy-room.jpg` 399 KB, `heroes/1470252649378-9c29740c9fa8.jpg` 395 KB, `facility/group-therapy-room.jpg` 390 KB, `heroes/1559825481-12a05cc00344.jpg` 387 KB. None of these are referenced by the homepage (it uses the `.webp` siblings); confirm whether other pages still reference the `.jpg` originals before deleting — they are dead weight in the deploy otherwise.

## 4. CSS

`styles.min.css` = 82,066 B raw / 16,441 B brotli, 935 rules. Selector-matching against the homepage DOM (estimate; ignores `:hover`/JS-toggled states such as `.nav-mobile.open`, so real unused share is somewhat lower): **546/935 rules (58%) and ~55% of declaration bytes do not match anything on the homepage.** At 16 KB compressed this is not worth a build step; critical-CSS inlining would save at most one RTT on the CSS fetch (which is already an edge HIT at ~130 ms).

`@font-face` count in local CSS: 0 — the font is entirely delegated to Google Fonts.

## 5. Playwright mobile emulation (Pixel 7, headless Chromium, no throttling)

| Metric | Run 1 (cold) | Run 2 (warm edge) |
|---|---|---|
| TTFB | 659 ms | 194 ms |
| FP / FCP | 888 ms | 452 ms |
| **LCP** (element: `p.hero-subheadline`, text) | **888 ms** | **452 ms** |
| domInteractive / DCL / load | 882 / 1258 / 1817 ms | — |
| CLS | 0.000 | 0.000 |
| Long tasks (>50 ms) | none | none |
| Requests / bytes | 34 / 629,621 B | — |
| DOM elements | 860 | — |
| Fonts loaded | 5 weights (400–800), latin subset | — |

LCP fires at exactly FCP in both runs: the LCP is text, and it paints the moment the three blocking resources (Google Fonts CSS, styles.min.css, i18n.min.js) finish. Under Lighthouse's 4x CPU / slow-4G throttling those three serial-ish fetches (two of them cross-origin to fonts.googleapis.com) are what will show up as "render-blocking resources" and "eliminate render-blocking" — not images.

## Prioritized fixes

1. **Make `/js/i18n.min.js` non-blocking or inline it.** Where: `index.html` (and every page `<head>` — the script is on all templates) plus `js/i18n.js` source. The whole file is 3.1 KB raw / 1.3 KB br and only needs to run before first paint if you want to avoid a flash before a Spanish redirect. Options: (a) inline the minified body in a `<script>` in `<head>` *above* the stylesheet link so it executes immediately with zero network wait and does not wait on CSS; or (b) if a redirect flash is acceptable, add `defer`. Expected impact: removes one blocking request (≈120–200 ms on edge-warm, more on slow 4G) from the LCP critical path; on the cold run the script's `responseEnd` (747 ms) was the last gate before paint at 888 ms.
2. **Stop blocking paint on the Google Fonts CSS.** Where: `<head>` in all HTML templates; `css/styles.css` `body { font-family }`. Either self-host Plus Jakarta Sans (one variable woff2 ~27 KB, latin subset) with `@font-face { font-display: swap; }` served from `/fonts/*` with the same immutable header rule in `_headers`, or keep Google Fonts but load it non-blocking (`<link rel="preload" as="style" onload="this.rel='stylesheet'">` + `<noscript>` fallback). Expected impact: removes a cross-origin blocking fetch (~270–350 ms TTFB observed from fonts.googleapis.com) from the LCP path; self-hosting also eliminates a DNS+TLS handshake to a second origin (fonts.gstatic.com). This is the largest single LCP lever left on the page.
3. **Remove the unpkg single point of failure.** Where: `<head>` lucide `<script>` in all templates. Vendor `lucide.min.js` (or better, a tree-shaken subset — the homepage uses roughly a dozen icons) into `/js/` so it rides the same immutable edge cache, or at minimum add `integrity="sha384-…" crossorigin="anonymous"`. Expected impact: resilience (CTAs currently render empty `<i>` elements if unpkg fails) and −60–90 KB on the mobile byte budget if subsetted; no direct LCP change since it is already deferred.
4. **Shrink the review screenshots and team headshots.** Where: `images/reviews/google-review-{1,2,3}.webp` (155/108/95 KB — re-encode at display width, ~550 px, quality 70; target <40 KB each) and `images/team/*.jpg` (67–135 KB for 400x400 — convert to webp at ~25 KB). Expected impact: ~−350 KB of the 630 KB page weight; no LCP effect (below fold) but material on slow-4G total-bytes and the "properly size images" audit.
5. **De-duplicate the review/team markup.** Where: `index.html` around the review slider (img indices 2–11) and team grid (34–45); each image appears twice. Expected impact: ~−130 DOM nodes, fewer lazy-load candidates racing the initial fetch, smaller HTML (~76 KB raw is high for a landing page).
6. **Convert the two PNG logos to webp/svg and lazy-load the footer logo.** Where: `images/logo-icon.png` (24 KB for 48x48 — should be ~2 KB; ideally the existing SVG), `images/logo-white.png` (17 KB, footer, add `loading="lazy"`). Expected impact: ~−35 KB from the eager critical-path fetches.
7. **Link to `/blog/` (trailing slash) internally.** Where: any nav/footer/blog-card href using `/blog`. Expected impact: removes a 301 (~145 ms) before every blog-index visit.
8. **Optional / low priority:** delete unreferenced `.jpg`/`-1800.png` originals from `images/` (≈6 MB across the top 10 alone) after confirming no page references them; `gtag.js` (170 KB) and `publisher.js` (73 KB) are async and cannot be shrunk from this repo — consider loading `publisher.js` only on blog pages where the Preferred Sources prompt exists, if the homepage does not need it.

## What was not verified

- No CPU/network throttling was applied in Playwright; Lighthouse mobile numbers will be several times slower and will amplify the three blocking resources in §2 disproportionately.
- Unused-CSS figure is a static selector match and over-counts interactive/JS-toggled rules.
- Only the homepage `<head>` was inventoried; `/programs/php` and `/blog/` were measured for HTML size/TTFB only, though the same template head is assumed (unverified).
