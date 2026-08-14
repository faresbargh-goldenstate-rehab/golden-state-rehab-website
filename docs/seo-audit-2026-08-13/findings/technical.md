# Technical SEO Audit — goldenstate-rehab.com (live)

Source: pre-crawled mirror at `scratchpad/crawl/` (`_index.json`, 136 fetched URLs, 102 HTML pages, all HTTP 200, zero redirects/404s). All findings below are **observed** directly from `_index.json` headers or from the saved HTML files unless labeled otherwise. Full-dataset checks were run across all 102 HTML pages via a parsing script unless noted as "sampled."

Technical Score: **78/100** (solid foundation — canonicals, hreflang reciprocity, mobile viewport, and most security headers are clean; deductions for missing CSP, one page with zero hreflang tags, and render-blocking head JS present on every template).

---

## 1. Crawlability — PASS

- robots.txt: `User-agent: * / Allow: /`, sitemap referenced, nothing blocked. **Labeled per brief as a pre-verified fact; not independently re-fetched by me** (no `robots.txt` entry present in `_index.json` to check headers/content directly).
- sitemap.xml: fetched live, `content_type: application/xml`, status 200, `Cache-Control: public, max-age=0, must-revalidate`. Contains 102 URLs matching the 102 crawled HTML pages exactly (per brief). Observed.
- Meta robots: checked all 102 pages — **zero** pages contain `noindex` or `nofollow`. All 102 carry `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">` (e.g., `crawl/index.html`). Observed, full dataset.
- No page is missing a robots meta tag. Observed, full dataset.

**Issue (Low):** robots.txt itself was not part of the crawl artifact (`_index.json` has no entry for `/robots.txt`), so its live headers (Cache-Control, content-type) were not verified by me. Treat robots.txt content as a prior claim from the brief, not independently confirmed here.

---

## 2. Indexability

### Canonicals — PASS (full dataset, 102/102 pages)
- Every page has a canonical tag.
- Every canonical is **self-referencing** (canonical URL == fetched URL) on all 102 pages. No cross-page canonicalization found.
- Every canonical is **absolute** (`https://www.goldenstate-rehab.com/...`), none relative.
- **Trailing-slash consistency**: 0 mismatches between page URL and its own canonical's trailing slash. Non-trailing-slash pages (e.g., `/about`, `/contact`, `/programs/outpatient-rehab`) canonicalize to themselves without a slash; index-style hubs (`/`, `/programs/`, `/blog/`, `/es/`) canonicalize with a slash. Internally consistent.

### Duplicate titles / meta descriptions — PASS (full dataset)
- Checked all 102 `<title>` values and all 102 meta-description values for exact-string duplicates across the site. **Zero duplicates found** — every page has a unique title and unique description. Observed.

### Structured data (JSON-LD) — PASS
- **Correction applied per coordinator verification**: all 102 pages contain `application/ld+json` blocks (grep-confirmed `ld+json` in 102/102 files). My own parse of a subset also found non-zero `ld+json` script counts per page (e.g., homepage = 2 blocks, `/about` = 4, `/contact` = 3, `/faq` = 4). I did not deep-validate schema.org property correctness/types on each block — see "Not Assessed."

---

## 3. hreflang

Full-dataset check across all 102 pages (parsed every `<link rel="alternate" hreflang="...">` tag, cross-referenced every target URL against the 102-URL crawl set, and checked reciprocity in both directions).

- **90 pages** carry the expected 3-entry set (`en`, `es`, `x-default`), and **all 90 are reciprocal** — zero non-reciprocal pairs found anywhere on the site (i.e., no case where page A points to B via hreflang but B doesn't point back to A). Zero hreflang targets point to a URL outside the crawled 102-page set (no broken hreflang targets). Observed, full dataset.
- Every page that has hreflang tags also includes `x-default`. Observed, full dataset.

**Finding — Critical: `/programs/outpatient-rehab` has ZERO hreflang tags.**
- File: `crawl/programs__outpatient-rehab.html`. Confirmed via direct grep: the only `rel="canonical"`/`hreflang`-related line in the file is `<link rel="canonical" href="https://www.goldenstate-rehab.com/programs/outpatient-rehab">` (line 17). No `hreflang` attribute appears anywhere in the file.
- This is the **only page site-wide with zero hreflang link tags** — confirmed by full-dataset scan (all other 101 pages have either 3 tags or the 2-tag pattern described below; this is the sole 0-tag outlier).
- No `/es/programs/outpatient-rehab` exists in the crawl set either, so there's no ES twin — but even a language-orphan page should still self-reference with `hreflang="en"` + `hreflang="x-default"` (as the 11 location pages below correctly do). This page has neither.
- **Fix**: add `<link rel="alternate" hreflang="en" href="https://www.goldenstate-rehab.com/programs/outpatient-rehab">` and `<link rel="alternate" hreflang="x-default" href="https://www.goldenstate-rehab.com/programs/outpatient-rehab">` to this page's `<head>`, matching the template used on every other page. Root cause is likely a template/CMS field left empty for this one page — check whatever generates hreflang blocks for `/programs/*` pages.

**Finding — Medium: 11 EN location pages have no ES counterpart (content-parity gap, not a broken hreflang tag).**
- Pages: `/locations/west-los-angeles`, `/santa-monica`, `/beverly-hills`, `/brentwood`, `/culver-city`, `/venice`, `/mar-vista`, `/century-city`, `/pacific-palisades`, `/west-hollywood`, `/marina-del-rey`.
- Each correctly self-declares `hreflang="en"` + `hreflang="x-default"` only (2 tags, no dangling `es` link) — this is technically valid hreflang (no broken/dangling reference), so it is not an hreflang *error*.
- However, confirmed via URL-set lookup: none of `https://www.goldenstate-rehab.com/es/locations/{city}` exist anywhere in the 102-page crawl. `/es/locations` (the ES hub) exists but has no individual ES city subpages, while the EN side has 11. This is a bilingual content-parity gap worth flagging even though it's not a technical hreflang defect.
- **Fix**: either build ES equivalents for the 11 city pages (preferred, matches the site's bilingual pattern used everywhere else) or, if not planned, this is acceptable as-is from a pure hreflang-correctness standpoint.

---

## 4. Security Headers — full dataset, 102/102 pages via `_index.json` response headers

| Header | Present | Value (site-wide, 100% consistent) |
|---|---|---|
| Strict-Transport-Security | 102/102 | `max-age=31536000; includeSubDomains; preload` |
| X-Content-Type-Options | 102/102 | `nosniff` |
| Referrer-Policy | 102/102 | `strict-origin-when-cross-origin` |
| X-Frame-Options | 102/102 | `SAMEORIGIN` |
| Permissions-Policy | 102/102 | `camera=(), microphone=(), geolocation=()` |
| Content-Security-Policy | **0/102** | absent on every page |

**Finding — High: no Content-Security-Policy header on any page.**
- Evidence: scanned the `headers` object for all 102 HTML entries in `_index.json` (case-insensitive key match) — `content-security-policy` key is absent on all 102, including the homepage (`crawl/index.html` header block, observed directly).
- Elevated severity because this is a YMYL healthcare site with contact/intake forms handling PII; CSP is a standard defense-in-depth control against injected/third-party script tampering (the site already loads third-party JS from `googletagmanager.com` and `unpkg.com` — see Section 6 — which is exactly the kind of surface CSP is meant to constrain).
- **Fix**: add a CSP header (can start in `Content-Security-Policy-Report-Only` mode to avoid breaking the GTM/Lucide/Google Fonts includes) covering `script-src`, `style-src`, `font-src`, `img-src`, `connect-src` scoped to the known third-party origins (`googletagmanager.com`, `unpkg.com`, `fonts.googleapis.com`, `fonts.gstatic.com`, `cloudflare.com` for CF beacons/NEL).

Other headers are uniformly strong: HSTS with `preload` is a genuine positive (Low-severity note: confirm the domain is actually submitted to the HSTS preload list, since the header alone doesn't guarantee preload-list inclusion — not verifiable from this crawl).

---

## 5. URL Structure — PASS

- Clean, lowercase, hyphenated paths throughout (`/programs/individual-therapy`, `/locations/west-los-angeles`), no query-string cruft, no session IDs, no uppercase.
- Zero redirect chains among the 102 crawled/sitemap URLs (per brief and confirmed in `_index.json`: `redirected: false` on all 102 HTML entries).
- Bare-path → trailing-slash 308 behavior for section hubs (e.g. `/treatments` → `/treatments/`) is correct/expected per brief and not re-litigated here.
- ES paths mirror EN paths under `/es/` 1:1 in structure (e.g. `/about` ↔ `/es/about`), which is good practice and simplifies hreflang mapping.

---

## 6. Mobile Configuration — PASS (full dataset)

- All 102 pages carry an identical, correct viewport tag: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`. Observed, full dataset, zero variance.
- No `user-scalable=no` or `maximum-scale` restrictions found (would block pinch-zoom accessibility) — confirmed absent since the viewport string is the same minimal value everywhere.
- Did not independently audit touch-target sizing or tap-target spacing from CSS (would require rendering, not just source inspection) — see "Not Assessed."

---

## 7. Core Web Vitals — potential issues from source/header inspection

**Finding — High: render-blocking `/js/i18n.js` loaded synchronously in `<head>` with no `defer`/`async`, on every sampled template.**
- Sampled 6 page templates directly: `crawl/index.html` (line 43: `<script src="/js/i18n.js?v=2"></script>`, immediately before `</head>` at line 44), `crawl/about.html` (line 39), `crawl/es.html` (line 39), `crawl/blog.html` (line 40), `crawl/programs__iop.html` (line 39), `crawl/locations__west-los-angeles.html` (line 50) — all 6 show the identical pattern: `<script src="/js/i18n.js?v=N"></script>` with no `defer` or `async` attribute, placed after the CSS `<link>` tags and immediately before `</head>`.
- Observed for these 6 templates; **inferred** (not exhaustively verified across all 102 files) that the same pattern applies site-wide given it appears identically across every distinct template type sampled (homepage, static page, ES homepage, blog index, program page, location page).
- Impact: a synchronous, non-deferred script in `<head>` blocks HTML parsing until it downloads and executes, delaying First Contentful Paint and LCP — directly relevant to the LCP Core Web Vital.
- **Fix**: add `defer` to the `i18n.js` script tag (it appears to be a client-side language-toggle utility, not something needed before first paint).

**Finding — Medium: `js/main.min.js` also lacks `defer`/`async`, confirming the brief's known-undeployed issue is live.**
- Evidence: `crawl/index.html` line 691: `<script src="js/main.min.js?v=4"></script>`, no `defer`/`async`. Same pattern confirmed in `about.html` (line 399), `es.html` (line 368), `blog.html` (line 271), `programs__iop.html` (line 340), `locations__west-los-angeles.html` (line 284, immediately followed by an inline `DOMContentLoaded` script that depends on `lucide`).
- Lower severity than the head-blocking `i18n.js` because this script sits near the end of `<body>` (line 691 of 863 total lines on the homepage), so it blocks less rendered content — but it's still parser-blocking for whatever DOM follows it (including the inline Lucide-icon-init script on every page), and confirms the repo's local `defer` fix (mentioned in the brief) has not been deployed to production.
- **Fix**: deploy the already-committed local fix that adds `defer` to `main.min.js`.

**Finding — Medium (inferred): homepage served as `cf-cache-status: DYNAMIC`, meaning Cloudflare is not edge-caching the HTML.**
- Observed directly on the homepage response headers in `_index.json`: `"cf-cache-status": "DYNAMIC"`, `"Cache-Control": "public, max-age=0, must-revalidate"`.
- Since all 102 HTML pages share the identical `Cache-Control: public, max-age=0, must-revalidate` value (confirmed full-dataset), it is a reasonable inference — not independently re-checked per-page for `cf-cache-status` — that every HTML page is served dynamically from origin on every request rather than from Cloudflare's edge cache. This increases TTFB variability and is a contributing risk factor for LCP, though the observed `elapsed_ms` for the homepage fetch was low (31ms in this crawl, which is not a reliable proxy for real-world TTFB from a browser).
- **Fix**: consider a short positive `max-age` (e.g., 5-10 minutes) with a Cloudflare Cache Rule / Page Rule for HTML, or move to `stale-while-revalidate`, to let Cloudflare serve cached HTML at the edge for anonymous visitors while still revalidating quickly after content changes.

**Finding — Low: inconsistent image caching — `apple-touch-icon.png` is not cached while all other images are.**
- Evidence from `_index.json`: `apple-touch-icon.png` → `Cache-Control: public, max-age=0, must-revalidate`. Every other image asset in the crawl (all files under `/images/...`, e.g. `dhcs-license.jpg`, `logo-icon.png`, all `heroes/*.webp`, `facility/*.webp`, `reviews/*.webp`) → `Cache-Control: public, max-age=2592000` (30 days). Full list checked (34 non-HTML assets).
- **Fix**: apply the same 30-day+ cache policy to `apple-touch-icon.png` (or move it under `/images/` if caching rules are path-based); consider extending image cache lifetime beyond 30 days (e.g., 1 year with cache-busting query params, which the site already uses elsewhere for CSS/JS via `?v=N`) since these are largely static marketing/facility photos.

**Not assessed for CWV**: actual LCP/INP/CLS field or lab data, image `width`/`height` attribute presence (needed to rule out CLS from layout shift), font-loading strategy beyond `display=swap` being present in the Google Fonts URL, and total blocking time from third-party scripts (GTM, unpkg Lucide). See "Not Assessed" section.

---

## 8. JavaScript Rendering Dependence

- The site is **server-rendered / static HTML**, not a JS-dependent CSR app: full page content (headings, body copy, nav, footer) is present in the raw HTML source of every sampled file (`index.html`, `about.html`, `programs__iop.html`, etc.) — verified by reading the saved HTML directly rather than relying on a rendered DOM. This is a strong positive for crawlability, since Googlebot and other crawlers do not need to execute JS to see primary content.
- Third-party/enhancement JS present on pages: Google Tag Manager (`googletagmanager.com/gtag/js`, `async`), Lucide icon library (`unpkg.com/lucide@1.16.0`, `defer`), and the two first-party scripts flagged in Section 7 (`i18n.js` — no defer, `main.min.js` — no defer). None of these appear to be required to render primary text content, only for icon rendering and (presumably) the EN/ES language-toggle UI.
- Did not render pages in a headless browser to produce an actual DOM diff against raw HTML — this claim is based on source inspection only (no JS execution performed). See "Not Assessed."

---

## 9. IndexNow Protocol — Not Assessed

No IndexNow key file, `indexnow` reference, or ping endpoint appears anywhere in the crawled artifact set (`_index.json` has no entry for a `/{key}.txt` IndexNow key file, and none of the 102 HTML `<head>` blocks reference IndexNow). This crawl cannot confirm whether IndexNow is configured (a key file could exist at a path that simply wasn't in the 136-URL fetch list) — flagging as unassessed rather than as a confirmed gap.
- **Recommendation regardless**: if not already implemented, add IndexNow support (a static key-file at site root + a ping call to `api.indexnow.org` on publish/update) so Bing/Yandex/Naver are notified of changes without waiting for their own crawl cycle — low-effort, complements the existing sitemap.

---

## Not Assessed (explicitly out of scope for this pass — flagging rather than guessing)

- **robots.txt live headers/content** — not present as its own entry in `_index.json`; content taken from brief as an unverified-by-me prior.
- **HTTP protocol version (HTTP/2 vs HTTP/3)** — `_index.json` headers show `alt-svc: h3=":443"; ma=86400` (HTTP/3 advertised as available) and `Server: cloudflare`, but the actual protocol used for the captured response is not recorded in the artifact, so I cannot state definitively which protocol was used for these specific fetches.
- **JSON-LD schema.org type/property validation** — presence confirmed (102/102, per coordinator + my own spot checks), but I did not validate each block against Google's Rich Results requirements or schema.org spec.
- **IndexNow** — see Section 9.
- **Actual CWV lab/field metrics** (LCP/INP/CLS numbers) — no PageSpeed Insights / CrUX / Lighthouse run performed; only static-source risk factors identified.
- **Image `width`/`height` attributes and CLS risk** — not audited in this pass.
- **Touch-target sizing/spacing** — requires rendered/CSS layout analysis, not done from source alone.
- **`i18n.js`/`main.min.js` defer-attribute check across all 102 pages** — sampled 6 templates (all showing the same missing-defer pattern); not exhaustively verified file-by-file for the remaining 96.
- **Exhaustive per-page `cf-cache-status` check** — only confirmed directly for the homepage; inferred site-wide from identical `Cache-Control` values, not independently re-checked per URL.
- **Full internal-link graph / orphan-page analysis** beyond what the brief already stated (zero broken internal links, zero 404s).

---

## Evidence Index (key files referenced)

- `scratchpad/crawl/_index.json` — full response metadata/headers for all 136 fetched URLs
- `scratchpad/crawl/index.html` — homepage source (script placement, hreflang, canonical, JSON-LD)
- `scratchpad/crawl/programs__outpatient-rehab.html` — page with zero hreflang tags
- `scratchpad/crawl/locations__west-los-angeles.html` and 10 sibling `/locations/*` files — EN-only hreflang pattern
- `scratchpad/crawl/about.html`, `es.html`, `blog.html`, `programs__iop.html` — sampled for render-blocking script confirmation
- `scratchpad/parsed.json` — my structured extraction (title/desc/canonical/hreflang/robots/viewport per page) used to generate the full-dataset checks above
