# Technical SEO Audit — www.goldenstate-rehab.com
Date: 2026-08-29 | Source: full crawl of 114 pages (all 200 OK) + live repo inspection + targeted live curls.

## Technical SEO Score: 84/100

**Rationale:** The site is a well-built static/SSR property — every crawled page returns real 200s, canonicals are 100% clean, hreflang pairs are complete and bidirectional everywhere a translation exists, schema is valid on spot-checked templates, images all carry explicit width/height (no CLS risk from that vector), and 9 of 11 Semrush remediation items are fully shipped. Points lost to: no CSP anywhere (High), one still-open infra task (apex HSTS, Medium — flagged as a Cloudflare dashboard task in the prior plan, confirmed still missing today), one incompletely-shipped content fix (1 of 5 duplicate titles), ~250 internal-link instances pointing at URLs that 301/308-redirect instead of the canonical form, a client-side auto-redirect language-detection pattern that runs against Google's own guidance, and the standard image-alt/thin-link-equity housekeeping. Nothing found is a crawlability or indexability blocker.

---

## 1. Crawlability / Indexability

**Status: PASS**, one item to confirm.

- robots.txt: `Allow: /` + sitemap reference. Valid, no accidental blocks. (`/Users/kkareem_1/Documents/Claude COde/Web Design/arm-website-golden-state-rehab-2/robots.txt`)
- 114/114 crawled pages return 200; 0 in sitemap failing to resolve; 0 broken internal links.
- Only `noindex` in the entire site: `/amenity-map` (meta robots noindex, no canonical, no H1, no meta description, 11 words, 1 inlink from `/our-facility`). This is self-consistent (an intentionally thin utility page correctly kept out of the index) — **Low, confirm-not-fix**: get Kareem's explicit sign-off per the standing Fix 9 decision point; no code change needed unless the decision is to publish it.
- **Hreflang completeness (verified programmatically):** 44 `/es/` pages exist; every EN page with a live `/es/` twin has a correct reciprocal hreflang pair + x-default (0 mismatches, 0 missing reciprocals). The 12 pages with **zero** hreflang tags are `/license`, `/amenity-map`, and 10 English blog posts — **all 12 have no Spanish translation to link to**, confirmed against `js/i18n.js`'s `MIRROR` array (only 6 of 16 EN blog posts have an `/es/blog/...` counterpart). This is not a hreflang defect; it's simply untranslated content. No action required unless/until those posts get translated.
- **Sitemap:** 113 URLs, `<lastmod>` present on all 113 (dates plausible, Jul–Aug 2026), 0 `xhtml:link` hreflang annotations. Not a defect — Google accepts hreflang via HTML `<link>` tags alone (which are complete) — but adding `xhtml:link` alternates to the sitemap is a **Low** enhancement that gives crawlers hreflang signal without an extra page fetch.
- No conflicting robots signals found (no page has both `noindex` and a sitemap entry, no canonical pointing to a noindexed URL).

## 2. Redirects

**Status: needs cleanup — Medium.**

- Confirmed 2-hop chain: `http://goldenstate-rehab.com` → 301 → `https://goldenstate-rehab.com/` → 301 → `https://www.goldenstate-rehab.com/`. Cheap to collapse to one hop (apex should redirect straight to `https://www.` with `permanent`), but low real-world impact since it only fires for the rare bare-http-apex entry point.
- **Internal links that resolve via a redirect instead of the canonical URL (counted directly against `internal_links` in the crawl data):**

| Link href used sitewide | Redirect | Occurrences | Example source pages |
|---|---|---|---|
| `/blog` | 301 → `/blog/` | 69 | `/faq`, `/about`, `/contact` |
| `/programs` | 308 → `/programs/` | 69 | `/faq`, `/about`, `/contact` |
| `/treatments` | 308 → `/treatments/` | 69 | `/faq`, `/about`, `/contact` |
| `/es` | 308 → `/es/` | 44 | `/es/verify-insurance`, `/es/contact` |

These four are almost certainly one shared nav/footer component reused across every template (same 3 source examples repeat for the first three rows). **Fix:** in the shared nav/footer partial, change `href="/blog"` → `href="/blog/"`, `href="/programs"` → `href="/programs/"`, `href="/treatments"` → `href="/treatments/"`, `href="/es"` → `href="/es/"`. This is a single find-and-replace per template, ~251 link instances cleaned in one pass. No `.html` links and no non-www/http-scheme internal links were found anywhere (both clean).

## 3. URL Structure

**Status: PASS** (the "mixed" trailing-slash pattern is actually a consistent, deliberate convention, not a defect).

- All 113 non-homepage crawled URLs are slash-free leaf pages (e.g. `/about`, `/blog/do-i-need-rehab`); only the four **section index roots** (`/blog/`, `/programs/`, `/treatments/`, `/es/`) canonicalize to a trailing slash, which is standard for a static-site directory-index pattern. The only real issue is §2 above — internal links pointing at the non-slash form of those four roots.
- No casing inconsistencies observed. Depth is shallow (max 2 segments below root, e.g. `/es/treatments/cocaine`).

## 4. Security Headers

**Status: strong baseline, one High gap.**

Present on every response (`_headers`, confirmed live): HSTS (`max-age=31536000; includeSubDomains; preload`) on `www`, `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`.

**Missing: Content-Security-Policy — High.** No CSP directive anywhere in `_headers` or per-page meta. Recommend shipping **Report-Only first** to avoid breaking the third-party scripts already in use (gtag, unpkg-hosted Lucide icons, Google Fonts, and Google's `swg` / `publisher.js` for subscription/News content if in use). Suggested starting policy, added to `/Users/kkareem_1/Documents/Claude COde/Web Design/arm-website-golden-state-rehab-2/_headers` under the `/*` block:

```
Content-Security-Policy-Report-Only:
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://unpkg.com https://news.google.com https://pubads.g.doubleclick.net;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://www.google-analytics.com;
  frame-src https://news.google.com;
  report-uri https://www.goldenstate-rehab.com/csp-report;
```
`'unsafe-inline'` on `script-src` is required only if inline `<script>` blocks (JSON-LD blocks are `application/ld+json`, not `text/javascript`, so those don't need it — check for inline event handlers / analytics snippets first; nonces are a cleaner long-term fix than `'unsafe-inline'`). Run in Report-Only for 1–2 weeks against real traffic, then convert to enforcing `Content-Security-Policy` once the report endpoint shows zero unexpected violations.

**Also missing (Low):** `Cross-Origin-Opener-Policy` / `Cross-Origin-Resource-Policy` — optional hardening, not urgent for a marketing/content site.

**HSTS apex gap (Fix 10, still OPEN):** live-curled today — `curl -sI https://goldenstate-rehab.com/` returns the 301 with **no `strict-transport-security` header**, while `https://www.goldenstate-rehab.com/` correctly returns it. This is unchanged since the Aug 20 audit. It's a Cloudflare dashboard task (SSL/TLS → Edge Certificates → HSTS, or an Origin Rule if the redirect is a Worker), not a repo change — flag for Kareem again, **Medium** severity in practice (the apex is a redirect-only hop, and the destination `www` host is already preload-listed, so real-world exposure is small, but it should still be closed).

## 5. Mobile-Friendliness

**Status: PASS.**

- `viewport` meta present on all 114 crawled pages (0 missing).
- All 48 `<img>` tags sampled on the homepage carry explicit `width`/`height` — good CLS discipline. 17 of 48 lack `loading="lazy"` — **Low**, verify those 17 are genuinely above-the-fold/LCP-candidate images (correct to leave eager); if any are below-fold, add `loading="lazy"` to defer bandwidth from images that don't affect LCP.
- Sticky phone banner / nav: present per prior notes — a persistent (not full-screen, not dismiss-blocking) sticky call bar is not classified as an "intrusive interstitial" by Google's mobile-usability guidance as long as it doesn't cover the primary content or require a close action to proceed; recommend visually confirming the sticky element's height stays a small fraction of the mobile viewport and doesn't obscure the H1 on load.

## 6. Core Web Vitals — Source-Inspection Signals Only

**Labeling note: this is inferred from HTML/response-header inspection, not a Lighthouse/CrUX measurement — no field or lab tool was run in this task.**

- **TTFB** (LCP precursor): avg 266ms across 114 pages — good. Max 1,198ms on `/blog/questions-to-ask-a-rehab-center` — worth a look (Medium/Low) since it's the single outlier against an otherwise fast baseline; likely a cold Cloudflare Pages edge cache hit rather than a systemic problem given `cf-cache-status: DYNAMIC` on HTML.
- **Page weight**: avg 38,982 bytes HTML, max 76,013 bytes (homepage) — small, no bloat risk for LCP from HTML payload itself.
- **Fonts**: `Plus Jakarta Sans` loaded via Google Fonts with `&display=swap` and both `preconnect` hints present (`fonts.googleapis.com`, `fonts.gstatic.com` with `crossorigin`) — correct pattern, minimizes invisible-text/LCP-delay risk from web fonts.
- **CLS**: all sampled `<img>` tags have explicit dimensions — the most common CLS cause (image reflow) is already mitigated at the template level.
- **No CSS/JS render-blocking analysis was done** (would need a real waterfall) — if a follow-up performance pass is wanted, that's the next concrete step, not covered by static-HTML inspection.

## 7. Structured Data

**Status: PASS on the two Semrush-flagged errors; broadly and correctly applied site-wide.**

- Schema types present: `MedicalOrganization`/`LocalBusiness` (110 pages), `BreadcrumbList` (109), `WebSite` (106), `FAQPage` (70), `MedicalWebPage` (70), `MedicalCondition` (24), `BlogPosting` (22), `MedicalTherapy` (21), plus `AboutPage`, `Blog`, `MedicalClinic`, `ItemList`, `ContactPage`. 0 schema parse errors across all 114 pages.
- **Verified live** (`blog/can-i-work-while-in-rehab.html`): `reviewedBy` now sits on the `MedicalWebPage` node inside an `@graph`, referenced by the `BlogPosting`/`Article` node — not on the Article itself. This pattern is applied not just to the 12 originally-flagged blog posts but broadly across treatments, programs, and location pages (70 files contain `reviewedBy`, all under `MedicalWebPage`). **Fix 1: DONE.**
- **Verified live** (`es/locations.html`): `grep -n "inLanguage"` returns **zero matches** — the invalid property has been removed from the LocalBusiness/Organization nodes. **Fix 2: DONE.**

## 8. JavaScript Rendering

**Status: SSR/static, low cloaking risk, one pattern worth revisiting.**

- Content is fully server-rendered static HTML — the crawl saw identical, complete content with no JS execution (69 EN pages, 45 ES pages all present as real HTML in the crawl), confirming `/es/` is a true static mirror, not a client-side translation swap.
- `js/i18n.min.js?v=4` is loaded synchronously in `<head>` (`<script src="/js/i18n.min.js?v=4">`, no `defer`/`async`) — reading the unminified source (`js/i18n.js`), its actual job is **language detection + persistent redirect**, not content swapping: it reads `navigator.language`/a `localStorage` preference and calls `location.replace()` to send first-time Spanish-language visitors from an EN URL straight to its `/es/` mirror (per a hardcoded `MIRROR` array of 22 paths), remembering the choice thereafter.
- **Medium SEO risk, not cloaking but adjacent to it:** Google explicitly recommends *offering* a translated version via a dismissible banner/link rather than *auto-redirecting* based on detected language, precisely because an automatic client-side redirect can make Googlebot's rendered DOM diverge from the raw HTML it indexed, and can trap users who wanted the English page. The code comment even acknowledges the more conservative path ("...or offers it via a banner when no direct Spanish mirror exists yet") but only applies the banner fallback when no mirror exists — when a mirror *does* exist, it force-redirects. **Recommendation:** change the `MIRROR`-list branch in `/Users/kkareem_1/Documents/Claude COde/Web Design/arm-website-golden-state-rehab-2/js/i18n.js` to show the same non-blocking banner/toggle in both cases, and drop the `location.replace()` call, so English-language crawlers/users are never involuntarily redirected. Since the script sits in `<head>` and runs before paint specifically to avoid a flash, this change is low-risk to implement (banner logic already exists in the file for the no-mirror case — reuse it).
- Being synchronous and render-blocking is intentional per the code's own comment (avoid FOUC on the language decision) and the file is small (3.1KB minified) — not a meaningful performance concern.

## 9. Internal Linking

- **Low-inlink pages (≤3 inlinks), from crawl data:** `/amenity-map` (1), `/es/about` (1), `/es/blog/does-medi-cal-cover-rehab-in-california` (1), `/es/faq` (1), `/es/our-story` (1), `/es/treatments/cocaine` (1), `/es/treatments/prescription-drugs` (1), `/es/treatments/sex-addiction` (1), `/blog/do-i-need-rehab` (2), `/blog/find-rehab-near-me-los-angeles` (2), `/es/treatments/meth` (2), `/es/blog/cbt-vs-dbt-which-is-right` (3), `/es/blog/cost-of-rehab-in-los-angeles` (3). **Medium** — same class of issue as the already-fixed `/es/our-facility` (Fix 11); apply the same "mirror EN linking pattern into ES nav/footer/homepage gallery" treatment to the 7 other `/es/` pages above, and add 1–2 more contextual in-body links to the 2 EN blog posts.
- **Nav/footer link volume:** avg 41.6 internal links/page, max 64 (`/blog` index) — well under the 150-link "excessive" threshold; no bloat concern.
- `/es/our-facility` (Fix 11 target) is **no longer** in the low-inlink list and repo grep confirms 45 files link to it — **Fix 11: DONE**, consistent with live crawl data.

## Semrush Remediation Plan — Verified Status (live site, Aug 29 2026)

| # | Fix | Status | Evidence |
|---|---|---|---|
| 1 | `reviewedBy` moved off Article onto MedicalWebPage | **DONE** | `blog/can-i-work-while-in-rehab.html` schema walk confirms `reviewedBy` only on `@type: MedicalWebPage`; pattern applied across 70 files site-wide |
| 2 | `inLanguage` removed from LocalBusiness/Organization on `/es/locations` | **DONE** | `grep inLanguage es/locations.html` → 0 matches |
| 3 | 5 duplicate title/H1 pairs | **PARTIAL (4/5 DONE)** | `cost-of-rehab-in-los-angeles`, `do-i-need-rehab`, `how-much-does-rehab-cost`, `questions-to-ask-a-rehab-center` all now have distinct `<title>`; **`blog/can-i-work-while-in-rehab.html` still has `<title>` identical to `<h1>`** ("Can I Work While in Rehab? Yes, and Here Is How") — apply the plan's suggested title: `Working While in Rehab: Know Your Options | Golden State Rehab` |
| 4 | Minify `i18n.js`/`contact.js`/`intake.js`, unify `?v=` | **DONE** | `.min.js` variants exist for all three (plus `main.js`/`main.min.js` as a bonus); all HTML references use `?v=4` consistently (0 stragglers on `?v=2`/`?v=3`) |
| 5 | License anchor off raw `.jpg` | **DONE** | 0 matches for `href="/images/dhcs-license.jpg"`; `/license` page exists (`license.html`) with 114 internal references to `/license` |
| 6 | Joint Commission badge — add `rel`/`target` | **DONE** | Both hero and footer instances carry `rel="noopener noreferrer nofollow" target="_blank"`; live curl confirms `jointcommission.org` still 403s to bots (expected false positive — mark hidden in Semrush, no code action) |
| 7 | SAPC directory link — fix or nofollow | **DONE (via removal)** | Repo-wide grep for `sapc`/`lacounty` returns 0 matches — the link has been removed entirely rather than nofollowed |
| 8 | Long paragraphs on `/programs/iop`, `/programs/telehealth` | **DONE** | Word-count scan: max paragraph is 81 words (iop) / 77 words (telehealth) — both under the ~100-word threshold |
| 9 | `/amenity-map` blocked from crawling | **OPEN — decision pending** | Still `noindex`, not in sitemap, thin (11 words), 1 inlink from `/our-facility` — self-consistent as an intentional exclusion; needs Kareem's explicit sign-off per the original decision point, no evidence a decision was recorded either way |
| 10 | HSTS on apex domain | **OPEN** | Live curl today: `https://goldenstate-rehab.com/` 301 response has no `strict-transport-security` header; `www` still correctly sends it. Cloudflare dashboard task, unchanged since Aug 20 |
| 11 | `/es/our-facility` internal links | **DONE** | No longer appears in the crawl's low-inlink list; repo grep finds 45 files linking to `/es/our-facility` |

**Regression check on "passing checks" list:** canonicals still 0 issues, meta descriptions still 0 missing (only `/amenity-map`, which is intentionally excluded), hreflang still 0 mismatches, alt attributes **NOT** clean — current crawl shows 123 missing-alt instances across 15 pages (this may be new content added since the Aug 20 baseline, which claimed 0 missing; worth reconciling with whoever ran that number, e.g. `/` alone has 7 missing alts, `/license` and `/programs/outpatient-rehab` each have 1).

## 9. IndexNow

**Status: Unknown / no evidence of implementation.** Probed common key-file paths at the live root (`indexnow.txt`, `IndexNow.txt`, a random UUID `.txt`) — all 404. IndexNow key files are named after the actual key value (a generated UUID/hex string), so a 404 on guessed names is inconclusive rather than a confirmed absence; robots.txt and `_headers` show no IndexNow reference either. **Recommendation (Low/Medium — cheap win):** for a static Cloudflare Pages site with a predictable deploy step, add a `{key}.txt` file at the root containing the key, and a one-line curl `POST` to `https://api.indexnow.org/indexnow` (covers Bing + Yandex + Naver via the shared protocol) in the deploy pipeline to ping changed URLs — meaningful for the 17 blog posts and any future content, since Bing/Yandex have no equivalent to Google's fast discovery-via-Search-Console path.

---

## Priority-Ordered Fix List

**High**
1. Add CSP (Report-Only → enforcing) to `_headers` — see §4 for exact directive and third-party allow-list. File: `_headers`.

**Medium**
2. Fix the ~251 internal-link instances pointing at `/blog`, `/programs`, `/treatments`, `/es` (no trailing slash) instead of their canonical slash forms — single edit in the shared nav/footer partial. (§2)
3. Finish Fix 3: retitle `blog/can-i-work-while-in-rehab.html` so `<title> != <h1>` (suggested: "Working While in Rehab: Know Your Options | Golden State Rehab").
4. Close HSTS-on-apex gap in Cloudflare dashboard (Edge Certificates → HSTS, includeSubDomains, preload) — still open as of today's live curl.
5. Change `js/i18n.js`'s auto-redirect behavior to a banner-only suggestion (drop `location.replace()` for mirrored paths) to align with Google's language-redirect guidance.
6. Mirror EN internal-linking pattern into the 7 remaining low-inlink `/es/` pages (`/es/about`, `/es/faq`, `/es/our-story`, `/es/treatments/cocaine`, `/es/treatments/prescription-drugs`, `/es/treatments/sex-addiction`, `/es/treatments/meth`) and the 2 low-inlink EN blog posts.
7. Reconcile the 123 missing-alt-text images (15 pages, homepage worst at 7) against accessibility/image-SEO baseline.

**Low**
8. Collapse the http-apex → https-apex → https-www 2-hop redirect into a single hop.
9. Get an explicit yes/no from Kareem on `/amenity-map`'s noindex status (Fix 9) and record the decision.
10. Add `xhtml:link` hreflang alternates to `sitemap.xml` (optional; HTML hreflang is already complete).
11. Implement IndexNow (key file + deploy-time ping) for faster Bing/Yandex/Naver discovery.
12. Add `loading="lazy"` to the 17 homepage `<img>` tags currently missing it, after confirming they're below the fold.
13. Investigate the 1,198ms TTFB outlier on `/blog/questions-to-ask-a-rehab-center` (likely a cache-cold edge, not systemic).

---

**Files referenced in this audit:**
- `/Users/kkareem_1/Documents/Claude COde/Web Design/arm-website-golden-state-rehab-2/_headers`
- `/Users/kkareem_1/Documents/Claude COde/Web Design/arm-website-golden-state-rehab-2/_redirects`
- `/Users/kkareem_1/Documents/Claude COde/Web Design/arm-website-golden-state-rehab-2/robots.txt`
- `/Users/kkareem_1/Documents/Claude COde/Web Design/arm-website-golden-state-rehab-2/sitemap.xml`
- `/Users/kkareem_1/Documents/Claude COde/Web Design/arm-website-golden-state-rehab-2/js/i18n.js` (+ `js/i18n.min.js`)
- `/Users/kkareem_1/Documents/Claude COde/Web Design/arm-website-golden-state-rehab-2/blog/can-i-work-while-in-rehab.html`
- `/Users/kkareem_1/Documents/Claude COde/Web Design/arm-website-golden-state-rehab-2/es/locations.html`
- `/Users/kkareem_1/Documents/Claude COde/Web Design/arm-website-golden-state-rehab-2/license.html`
- `/Users/kkareem_1/Documents/Claude COde/Web Design/arm-website-golden-state-rehab-2/goldenstate-rehab-audit-fixes.md`
- `/private/tmp/claude-501/-Users-kkareem-1-Documents-Claude-COde-Web-Design-arm-website-golden-state-rehab-2/41f75a02-655f-419b-a70b-6d1b99e6ec18/scratchpad/audit/crawl/pages.jsonl`
