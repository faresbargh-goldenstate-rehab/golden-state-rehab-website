# Technical SEO Audit — goldenstate-rehab.com
Scope: items not already verified by orchestrator. Methodology: cross-checked all 116 pages.json records against sitemap.xml (112 `<loc>` entries) and the 116 on-disk HTML files programmatically (Python/jq); live-verified headers/redirects with curl against production.

## 1. Sitemap Integrity — PASS (verified clean)
Programmatic cross-check of all 112 sitemap `<loc>` URLs against the derived canonical URL of every one of the 116 HTML files (index.html → `dir/`, others → extensionless):
- **0 sitemap URLs with no matching file** (no dead/orphaned sitemap entries).
- **0 indexable files missing from the sitemap** — every non-noindex page is present.
- The 4 files correctly *excluded* from the sitemap are exactly the 4 pages carrying `noindex` in `pages.json` (`404.html`, `amenity-map.html`, `intake-success.html`, `es/intake-success.html`) — correct behavior, no action needed.
- `/es/` pages are fully included: 44 of the 112 sitemap entries are `/es/...` URLs, matching the 44 Spanish HTML files on disk 1:1.

No issues to report in this category.

## 2. Canonical Correctness — PASS (verified clean)
Checked all 116 canonicals programmatically: every indexable page's canonical (a) is present, (b) is self-referencing, (c) uses the extensionless live URL form, (d) matches scheme/host `https://www.goldenstate-rehab.com`. Zero mismatches, zero `.html`-suffixed canonicals, zero cross-page canonicals found.

No issues to report in this category.

## 3. Hreflang Reciprocity — PASS with one gap worth naming (MEDIUM)
Built a full hreflang graph from `pages.json` and verified every `en ⇄ es` pair references both itself and its counterpart, plus `x-default`, in both directions. **0 broken/one-way pairs found** across all 102 pages that carry hreflang (including the `/espanol` ⇄ `/spanish-speaking-treatment` pair, which lives outside the `/es/` folder structure but is fully reciprocal: `espanol.html` → en:`/spanish-speaking-treatment`, es:`/espanol`(self), x-default:`/spanish-speaking-treatment`; and the reverse on `spanish-speaking-treatment.html`).

**14 pages with zero hreflang, triaged:**
- `404.html`, `amenity-map.html`, `intake-success.html`, `es/intake-success.html` — all `noindex`. Correct to omit hreflang.
- 10 English blog posts with no Spanish translation yet (`blog/can-family-come-to-rehab-visits.html`, `can-i-work-while-in-rehab.html`, `do-i-need-rehab.html`, `find-rehab-near-me-los-angeles.html`, `first-day-of-rehab.html`, `how-long-is-rehab.html`, `how-much-does-rehab-cost.html`, `inpatient-vs-outpatient-rehab.html`, `questions-to-ask-a-rehab-center.html`, `what-happens-after-rehab.html`) — omitting hreflang when no translation exists is valid per Google's guidelines, not a bug.

**MEDIUM — content-parity gap (not a markup bug):** 11 `locations/*.html` pages (beverly-hills, brentwood, century-city, culver-city, mar-vista, marina-del-rey, pacific-palisades, santa-monica, venice, west-hollywood, west-los-angeles) and `programs/outpatient-rehab.html` carry only `en` + `x-default` self-references — there is no `/es/locations/*` or `/es/programs/outpatient-rehab.html` at all. Given this is a bilingual, Spanish-serving YMYL clinic in LA (a heavily Spanish-speaking market), the location pages in particular are a plausible organic-traffic gap. Not a technical defect — flagging as a content/IA recommendation, not a fix.

## 4. Live Header Verification (curl against production) — PASS, one gap (MEDIUM)
- `Cache-Control` rules in `_headers` are live and correct: `/` → `public, max-age=0, must-revalidate`; `/css/styles.min.css` → `public, max-age=31536000, immutable` (confirmed byte-for-byte match to `_headers`, so the Cloudflare zone's Browser Cache TTL is respecting origin headers as the in-repo comment hoped).
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`, `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` all confirmed present live on both HTML and CSS responses.
- Compression: `content-encoding: br` (Brotli) confirmed live on both `/` and `/css/styles.min.css`.
- Protocol: `HTTP/2` served, `alt-svc: h3=":443"` advertised (HTTP/3 available to capable clients).
- **MEDIUM — No Content-Security-Policy header anywhere** (checked homepage response; `_headers` file contains no `Content-Security-Policy` directive at all). For a YMYL clinic site that runs third-party scripts (GTM/gtag, unpkg-hosted Lucide icons) and collects contact/insurance-verification form data, shipping without any CSP is a real, evidenced gap — not generic advice. Fix: add a `Content-Security-Policy` line to the `/*` block in `_headers`, minimally scoping `script-src` to `'self' https://www.googletagmanager.com https://unpkg.com` and `style-src` to `'self' https://fonts.googleapis.com`.
- LOW/informational: every live response (HTML and CSS) carries `access-control-allow-origin: *`. This is not set in `_headers` — it's a Cloudflare Pages platform default — and is harmless for public marketing content, but worth confirming it's intentional since a CORS wildcard serves no purpose on non-API HTML/CSS responses.

## 5. Crawl-Budget / Indexability Traps — PASS (verified clean)
- `/blog` → `/blog/`: confirmed live 301 via the explicit rule in `_redirects` (`/blog  /blog/  301`).
- `/programs`, `/treatments`, `/es` (no trailing slash): confirmed live **308** redirects to their trailing-slash form (Cloudflare Pages' automatic pretty-URL handling) — no duplicate-content risk, no dead ends.
- A non-existent URL (`/this-page-does-not-exist-xyz`) correctly returns a live **HTTP 404** status (not a soft-404 200) — the custom `404.html` is wired to the real status code.
- `amenity-map.html` is live at `/amenity-map` (HTTP 200) and correctly excluded from indexing via `<meta name="robots" content="noindex">` (confirmed in `pages.json`) rather than via `robots.txt` — correct approach, since blocking it in `robots.txt` would have prevented Google from ever seeing the noindex tag.
- Other `_redirects` entries (`/programs/holistic-therapies-page`, `/programs/iop-program-page`, `/treatments-2`) are cleanup 301s for old/malformed Search-Console-reported URLs — not tested live but structurally correct (single-hop, permanent).

No issues to report in this category.

## 6. Render-Blocking Resources / Script Loading — 2 findings (HIGH, MEDIUM)

**HIGH — `/js/i18n.js` is render-blocking in `<head>` on all 115 non-noindex pages, and is the *only* render-blocking script left in the head.** Confirmed in `index.html` line 42: `<script src="/js/i18n.js?v=2"></script>` — no `async`, no `defer` (contrast with the same page's Lucide script, which correctly has `defer`, and `gtag.js`, which correctly has `async`). The file's own header comment states this is intentional ("Runs in `<head>` (before paint) to avoid a flash of the wrong language"), and the script does perform a synchronous `location.replace()` redirect path for saved-language/auto-detected-Spanish visitors — so *some* blocking is a deliberate FOUC/redirect-flash tradeoff. But at 5.6 KB it's an extra full render-blocking network round-trip stacked in front of the render-blocking Google Fonts stylesheet and `css/styles.min.css` (see next finding), on a homepage whose LCP element is the H1 text (`hero-h1-stack`, confirmed — the homepage hero has no hero image, only a small 20×20 badge icon). That chain (blocking script → blocking Google Fonts CSS → blocking site CSS → font file) sits directly ahead of LCP text paint. Fix: inline the i18n redirect-decision logic (the ~15 lines before `onReady()`) directly into a `<script>` block in `<head>` to eliminate the extra network request while preserving the blocking-before-paint behavior that's actually needed only for the redirect check; move the DOM-dependent toggle-wiring code (`onReady(...)` block) into the already-deferred `main.min.js`.

**MEDIUM — Cache-buster version drift: `index.html` references `i18n.js?v=2` while all other 114 pages reference `i18n.js?v=3`.** Confirmed via `grep -o 'i18n.js?v=[0-9]*'` across every HTML file: 1 hit for `v=2` (in `index.html` only) vs. 114 hits for `v=3`. This means the homepage is not actually running a *stale cached* copy (different URL = fresh fetch), but it is running a **different reference than the rest of the site** to the same underlying file, which contradicts the site's own stated cache-busting convention (see prior memory note on CSS `?v=` bumps) and risks the homepage silently missing whatever behavior change justified the `v=2→v=3` bump on every other page. Fix: bump `index.html`'s `i18n.js?v=2` to `?v=3` to match.

Google Fonts (`Plus Jakarta Sans`) is loaded via a render-blocking `<link rel="stylesheet" href="https://fonts.googleapis.com/...">` with `preconnect` hints already in place for both `fonts.googleapis.com` and `fonts.gstatic.com` (good — this is already mitigated as much as a non-self-hosted font can be). Not re-flagging as a separate issue since preconnect is already present; noting it only because it compounds with the i18n.js finding above.

`main.min.js` (line 805, homepage) correctly uses `defer` and is placed before `</body>` — no issue.

## 7. Structured Data / Content Depth — PASS (verified clean)
- 0 indexable pages with zero `schema_types` (all 112 indexable pages carry structured data; homepage carries `FAQPage`, `LocalBusiness`, `MedicalOrganization`, `WebSite`).
- 0 indexable pages under 200 words (no thin-content pages).

## 8. Image Dimensions / CLS — 1 LOW finding
Site-wide, only **1 page** has any images missing explicit `width`/`height`: **`amenity-map.html`**, where all 17 of its images lack dimensions (`img_no_dims: 17` of `img_total: 17` — every image on that page, not a partial miss). Every other page on the site (115/116) has zero images missing dimensions. Since `amenity-map.html` is `noindex`, this is a UX/CLS issue for direct visitors rather than an SEO ranking issue, but it's worth fixing given it's 100% of that page's images: add explicit `width`/`height` (or `aspect-ratio` in CSS) to the `<img>` tags in `amenity-map.html`.

## Summary Table

| Category | Status | Critical | High | Medium | Low |
|---|---|---|---|---|---|
| Sitemap integrity | PASS | 0 | 0 | 0 | 0 |
| Canonical correctness | PASS | 0 | 0 | 0 | 0 |
| Hreflang reciprocity | PASS | 0 | 0 | 1 | 0 |
| Live headers | PASS | 0 | 0 | 1 | 1 |
| Crawl-budget traps | PASS | 0 | 0 | 0 | 0 |
| Render-blocking / CWV | 2 findings | 0 | 1 | 1 | 0 |
| Structured data / thin content | PASS | 0 | 0 | 0 | 0 |
| Image dims / CLS | 1 finding | 0 | 0 | 0 | 1 |
| **Total** | | **0** | **1** | **3** | **2** |

## Prioritized Fix List
1. **HIGH** — Inline the redirect-decision portion of `/js/i18n.js` into `<head>` (or otherwise shrink/eliminate the extra render-blocking request) on all 115 pages; move DOM-dependent toggle-wiring into the already-deferred `main.min.js`. File: `js/i18n.js`, referenced from every page's `<head>`.
2. **MEDIUM** — Add a `Content-Security-Policy` directive to the `/*` block in `_headers` (currently absent live and in-repo).
3. **MEDIUM** — Fix `index.html`'s `i18n.js?v=2` → `?v=3` to match the other 114 pages.
4. **MEDIUM** (content, not markup) — Consider `/es/locations/*` and `/es/programs/outpatient-rehab` pages given the Spanish-speaking LA market this clinic serves; currently no ES equivalents exist for 11 location pages + 1 program page.
5. **LOW** — Add `width`/`height` to all 17 `<img>` tags in `amenity-map.html`.
6. **LOW** — Confirm the platform-level `access-control-allow-origin: *` on HTML/CSS responses is intentional (Cloudflare Pages default, not set in `_headers`).
