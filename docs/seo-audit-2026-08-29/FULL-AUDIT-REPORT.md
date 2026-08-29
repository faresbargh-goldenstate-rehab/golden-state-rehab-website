# Golden State Rehab — Full SEO Audit

**Site:** https://www.goldenstate-rehab.com/
**Audit date:** 2026-08-29
**Crawl:** 114 pages (113 sitemap URLs + `/amenity-map`), all HTTP 200, robots.txt honored, 5 workers / 1 s delay
**Business type detected:** Local Service → Healthcare (outpatient addiction & mental-health clinic, single brick-and-mortar location in Westwood, West LA; EN + `/es/` Spanish mirror; 17-post blog; 11 neighborhood pages)
**Specialists run:** technical, content, schema, sitemap, performance, visual, GEO, local, SXO, cluster, Google APIs (PSI/CrUX/GSC), backlinks. Not run: drift (no baseline), maps/DataForSEO (not configured), e-commerce (n/a).

Every finding below is labeled **observed** (I or a specialist ran it and can point at the artifact), **inferred**, or **manual check** (could not be verified from here). Where a specialist's claim failed my re-verification, I say so rather than carry it forward.

---

## Executive summary

### SEO Health Score: **77 / 100**

| Category | Weight | Score | Weighted | One-line basis |
|---|---|---|---|---|
| Technical SEO | 22% | 84 | 18.5 | Clean crawl, canonicals, hreflang; missing CSP, apex HSTS, internal docs publicly served |
| Content Quality | 23% | 73 | 16.8 | Strong, differentiated YMYL content; no visible dates on blog posts, reading level too high, cost/insurance cannibalization |
| On-Page SEO | 20% | 80 | 16.0 | Zero duplicate titles/descriptions, all lengths in range; weak ES inlinks, no hero CTA on 50 pages |
| Schema / Structured Data | 10% | 81 | 8.1 | Valid sitewide graph; `foundingDate:"2026"` placeholder, thin `sameAs`, no Physician entity |
| Performance (CWV) | 10% | 62 | 6.2 | Lab mobile Performance 59–66, LCP 7–11 s (lab); desktop 90; CLS 0; **no CrUX field data exists** |
| AI Search Readiness | 10% | 83 | 8.3 | All AI crawlers get 200 at the edge; llms.txt spec-compliant; strong citable passages |
| Images | 5% | 65 | 3.3 | 123 `<img>` without alt (mostly one logo ×113 + team photos), no `srcset`, 3 oversized review screenshots |
| **Total** | | | **77.1** | |

**The site is technically healthy — the remaining upside is conversion path, trust substantiation, and off-site authority, not crawl hygiene.** Nine of the eleven Aug-20 Semrush fixes are verified done on the live site (observed). Search Console data could not be pulled (service account lacks access) and no CrUX field data exists yet, so real-user CWV and query performance are blind spots this audit could not close.

### Top 5 critical / high issues

1. **Internal planning docs are publicly served from the site root** (observed): `/docs/intake-deployment.md`, `/docs/seo-audit-report.md`, `/golden-state-rehab-seo-buildout-plan.md`, `/goldenstate-rehab-audit-fixes.md`, `/README.md`, `/Claude.md`, a `.docx`, a 415 KB PDF and `/docs/seo-audit-2026-08-19/findings/report-source` (HTML, no noindex) all return 200. No secrets leak (only env-var *names*), but the intake/Paubox/CRM architecture, SEO strategy and audit history are readable by anyone and indexable by Google. Cloudflare Pages deploys the whole repo.
2. **`foundingDate: "2026"` in the Organization schema on 99 pages** (observed) — almost certainly a placeholder; a factual trust signal that contradicts "100+ Recoveries" and dated reviews.
3. **Mobile lab performance is Poor across every template** (observed, PSI): homepage 59/100, `/programs/php` 62, `/treatments/` 63, `/blog/` 59, `/es/` 66; lab LCP 7.2–10.8 s. Root cause is three render-blocking `<head>` resources (Google Fonts CSS, `styles.min.css`, synchronous `/js/i18n.min.js`), not images — the LCP element is hero *text*. Desktop is 90.
4. **No Content-Security-Policy header** (observed) on a site that runs inline scripts, gtag, an unpkg-hosted icon library with no SRI, and a HIPAA-adjacent intake form. Apex `https://goldenstate-rehab.com` 301 still carries no HSTS (observed today; Cloudflare dashboard task open since Aug 20).
5. **Zero above-the-fold CTA on 50 pages** (observed, verified in crawl HTML): all 9 `/programs/*`, 14 `/treatments/*`, 11 `/locations/*` and 16 blog posts have no call/verify-insurance link in the hero; on mobile the nav CTAs are behind the hamburger, so only the thin phone bar is actionable. Homepage, `/mental-health` and `/families` do have hero CTAs.

### Top 5 quick wins (≤ 1 hour each)

1. Add `X-Robots-Tag: noindex` for `/docs/*` and `/*.md` in `_headers` **and** move `docs/`, root `.md`/`.docx` out of the deploy (or add a Pages build-exclusion) — closes issue 1.
2. Replace `foundingDate: "2026"` with the real year (or delete the property) in the shared Organization JSON-LD — one template edit, 99 pages.
3. Add Instagram, LinkedIn, X (already linked in the footer) to `sameAs` in the same JSON-LD block (currently only Google Maps CID + Yelp).
4. Inline `/js/i18n.min.js` (3.1 KB raw) in `<head>` *above* the stylesheet, or add `defer` — removes one of three render-blocking requests on every page.
5. Add a Google "write a review" link (`https://search.google.com/local/writereview?placeid=…`) to the alumni page, intake-success page and footer — the site shows 6 static 5.0★ screenshots and no way to leave one.

---

## 1. Technical SEO — 84/100

Specialist report: `reports/seo-technical.md`. Score kept at 84 after my corrections below.

**Passing (observed):** 114/114 pages return 200; 0 redirect chains inside the site; 113/113 canonicals self-referencing and byte-equal to sitemap `<loc>`; 0 duplicate titles or meta descriptions; every page has exactly one H1 except the intentionally noindexed `/amenity-map`; viewport on all pages; `html lang` correct (69 en / 45 es); hreflang bidirectional and complete on all 43 EN↔ES pairs with `x-default`; robots.txt is `Allow: /` + sitemap; 404 returns a real 404; HTML is brotli'd (76 KB → 18 KB) with TTFB avg 266 ms (max 1,198 ms on one blog post, likely cold edge); static assets are Cloudflare edge HITs with 1-year immutable caching.

**Redirects (observed):** `http://goldenstate-rehab.com` → 301 → `https://goldenstate-rehab.com/` → 301 → `https://www…` is a 2-hop chain; `/index.html`, `/about.html` etc. 308 to clean URLs; `/blog` 301 → `/blog/`, `/programs|/treatments|/es` 308 to slash form. Trailing-slash policy is consistent (directory indexes slashed, leaf pages not).

**Correction to the specialist report:** it lists "~251 internal links pointing at `/blog`, `/programs`, `/treatments`, `/es` without trailing slash". I re-checked every `href` in the raw HTML of all 114 pages: **zero** internal links hit a redirecting URL. The 251 figure came from my crawler's normalized `internal_links` field, which strips trailing slashes. Drop that finding.

**Issues**

| Sev | Finding | Evidence | Fix |
|---|---|---|---|
| High | Internal docs publicly served (see exec summary #1) | `curl -I` on 9 paths → 200 | `_headers`: `/docs/*` + `/*.md` → `X-Robots-Tag: noindex, nofollow`; move planning docs out of the Pages deploy root (e.g. a `.pages-ignore`/build step or a separate private repo). Do not rely on noindex alone — the intake deployment doc should not be public at all. |
| High | No Content-Security-Policy | `headers.txt` | Ship `Content-Security-Policy-Report-Only` first. Allow-list: `'self'`, `https://www.googletagmanager.com`, `https://www.google-analytics.com`, `https://unpkg.com` (or vendor lucide and drop it), `https://fonts.googleapis.com`, `https://fonts.gstatic.com`, `https://news.google.com`, `https://www.google.com` (map embed), and a nonce or hash for the inline gtag bootstrap. Flip to enforcing after a week of clean reports. |
| Medium | HSTS missing on apex 301 | `curl -sI https://goldenstate-rehab.com/` → no STS header | Cloudflare dashboard → SSL/TLS → Edge Certificates → enable HSTS (includeSubDomains, preload) at zone level. |
| Medium | `js/i18n.js` auto-redirects first-time visitors to `/es/` based on `navigator.language` via `location.replace()` (observed, lines 69–81) | Google explicitly recommends *offering* a translation via banner rather than auto-redirecting. Googlebot (US/en) never sees the redirect, so it isn't cloaking, but bilingual users who wanted EN get bounced. | Keep the stored-preference redirect (`gsr_lang` set) but replace the language-sniff redirect with a dismissible "¿Prefiere español?" banner. |
| Medium | 8 pages with ≤1 contextual inlink | `/es/about`, `/es/faq`, `/es/our-story`, `/es/treatments/{cocaine,prescription-drugs,sex-addiction}`, `/es/blog/does-medi-cal-cover-rehab-in-california` (1 each); `/blog/do-i-need-rehab`, `/blog/find-rehab-near-me-los-angeles` (2) | Mirror the EN linking pattern into the ES templates (the same fix already applied to `/es/our-facility`, now at 45 inlinks). |
| Low | http→https→www is two hops | observed | Cloudflare Redirect Rule: `http://goldenstate-rehab.com/*` → `https://www.goldenstate-rehab.com/$1` directly. |
| Low | `blog/can-i-work-while-in-rehab.html` `<title>` == `<h1>` (last of the 5 Semrush dup-title items) | observed | Retitle, e.g. "Working While in Rehab: Your Options | Golden State Rehab". |
| Low | IndexNow not implemented (no key file found at common paths — inconclusive) | manual check | Add key file + deploy-time ping once Bing Webmaster is verified. |
| Low | TTFB outlier 1,198 ms on `/blog/questions-to-ask-a-rehab-center` | crawl | Likely cold edge; re-measure before acting. |

**Semrush Aug-20 remediation plan — live status (observed):** Fix 1 reviewedBy ✅ · 2 inLanguage ✅ · 3 dup titles ✅ 4/5 (see above) · 4 minified JS ✅ · 5 license .jpg anchor ✅ · 6 Joint Commission rel/target ✅ · 7 SAPC link ✅ (removed) · 8 long paragraphs ✅ · 9 `/amenity-map` noindex — **open, needs owner decision** · 10 apex HSTS — **open** · 11 `/es/our-facility` inlinks ✅.

## 2. Content Quality — 73/100 · On-Page — 80/100

Specialist report: `reports/seo-content.md` (Content 73, On-Page 75 → I raised On-Page to 80 because two of its deductions don't hold: the 11 blog posts "missing hreflang" have no Spanish twin, which is correct behavior; and alt text is scored under Images).

**Strengths (observed):** avg 1,429 words/page (min 1,075 on indexable pages); location pages are *not* templated — highest pairwise similarity 13% shingle-Jaccard (West LA ↔ West Hollywood); treatment pages max 12%; every EN blog post and program page carries a visible "Medically reviewed by Dr. Eric Chaghouri, MD" byline; 2–5 authoritative citations per post (NIDA, SAMHSA, ASAM, DHCS, healthcare.gov); program pages show "Updated July 2026"; the site *warns readers against* unsubstantiated success-rate claims — a real trust pattern for this vertical; 5 sampled blog posts read as human-written (0 em dashes, low cliché density).

**Corrections to the specialist report:** it says two posts "lack the Dr. Chaghouri bio block" — I verified all 16 EN posts contain the reviewer byline. Its narrower claim does hold: **no blog post shows a visible date** (program pages do), even though schema `dateModified` is set on all 16.

**Issues**

| Sev | Finding | Affected | Fix |
|---|---|---|---|
| High | Cost/insurance cannibalization: 4 posts target one query cluster — `/blog/how-much-does-rehab-cost` (2,652 w, title "Rehab Cost & What Insurance Covers") overlaps both `/blog/cost-of-rehab-in-los-angeles` (1,526 w) and `/blog/does-insurance-cover-rehab-in-california` (2,300 w); `/blog/does-medi-cal-cover-rehab-in-california` is the only clearly distinct one | 4 URLs (observed titles) | Build one evergreen `/insurance-and-cost` page (private insurance / Medi-Cal / self-pay sections + verify CTA); keep the LA price-breakdown and Medi-Cal posts as spokes; 301 `how-much-does-rehab-cost` into the hub or rewrite it to a genuinely different angle (e.g. "what your EOB will look like"). |
| High | No visible publish/updated date on any blog post | 16 EN posts (+ ES mirrors) | Add `<time datetime>` "Updated {Month YYYY}" next to the reviewer byline; keep schema `dateModified` in sync. YMYL raters look for this. |
| Medium | Reading level too high for a crisis-facing audience: FK grade `/treatments/alcohol` 12.7, `/programs/php` 11.7, `/programs/iop` 10.8, location pages ~10.5 (target 7–9) | program/treatment pages | Shorten sentences in the first two screens; move clinical detail below the CTA. |
| Medium | Homepage em-dash density 12 / 1,610 words (7.5 per 1,000) — an AI-writing tell per the QRG reference; blog posts are clean | `/` | Convert ≥8 to commas/periods. |
| Medium | "100+ Recoveries" H1 claim has no on-page substantiation (owner-mandated claim — keep it, but footnote it) | `/`, `/es/` | Add a one-line method note near the stat ("clients completing a full PHP/IOP episode since {year}"). |
| Medium | Content gaps with clear demand and low aggregator competition: detox (33 mentions, 0 pages — do you offer or refer?), MAT/Suboxone, carrier pages (Anthem/Aetna/Cigna/Blue Shield/Kaiser each mentioned on 17–18 pages via the logo strip, no landing pages), `/admissions` hub, HR/EAP referrer page, veterans, LGBTQ+, professionals | — | See Action Plan §Content. |
| Low | `/license` meta description 162 chars (only length outlier sitewide) | 1 URL | Trim. |

## 3. Search Experience (SXO) — 58/100

Specialist report: `reports/seo-sxo.md` (6 live SERP checks, 5 personas).

- **Page-type alignment is a strength:** 5 of 6 target queries have a GSR page of the type Google rewards. "PHP program los angeles" and "IOP los angeles" SERPs are provider service pages, not directories — winnable.
- **Directories own the broad local head terms** ("rehab near santa monica", "alcohol rehab west los angeles": 70–80% Psychology Today / Rehabs.com / AddictionCenter). Organic wins there are unrealistic; the local pack is the lever (see §7).
- **Weakest persona: HR/EAP referrer (20/50)** — no page addresses them. Spouse/parent persona is served by `/families`.
- **Correction:** the SXO report says `/families` has "zero schema". It has a full `@graph` (MedicalOrganization/LocalBusiness, WebPage, BreadcrumbList, FAQPage) — my crawler recorded `None` because `@graph` has no top-level `@type`. Not a finding.
- `/verify-insurance` form: 9 fields, 6 required, optional card photo, HIPAA copy — friction is low-medium. On mobile the H1 alone consumes ~35% of the viewport and pushes the first input below the fold (observed in screenshot).
- No hero CTA on 50 pages (verified — see exec summary #5).

## 4. Schema / Structured Data — 81/100

Specialist report: `reports/seo-schema.md` (includes ready-to-paste JSON-LD for BlogPosting w/ Person author+reviewer, a Physician entity, and the reference LocalBusiness block).

**Observed:** JSON-LD parses on 114/114 pages; `["MedicalOrganization","LocalBusiness"]` block identical (name/phone/address/@id) on 112 pages; BreadcrumbList 0 errors on 111 pages; FAQPage 72 pages with visible-text match on 3 spot-checks; MedicalWebPage with `lastReviewed` + `reviewedBy` (Person, MD, jobTitle, url) on 70 pages; BlogPosting 22; both Semrush schema errors (`reviewedBy` on Article, `inLanguage` on Organization) are gone.

| Sev | Finding | Fix |
|---|---|---|
| High | `foundingDate: "2026"` on 99 pages | Real year or remove. |
| Medium | `sameAs` = Google Maps CID + Yelp only; Instagram/LinkedIn/X are in the footer but not in schema | Add them (+ Facebook, Psychology Today, NPI as `identifier` if applicable). |
| Medium | No `Physician` entity for the medical director despite 80+ Person references | Add once on `/team` with `@id`, reference it from every `reviewedBy`. |
| Medium | Type is generic `MedicalOrganization`+`LocalBusiness`; `MedicalClinic` (already used on 2 pages) is the specific rich-result-eligible subtype | Switch sitewide. |
| Low | 7 BlogPosting `author` nodes (5 ES + 2 alumni stories) lack `author.url` | Add. |
| Low | `/families`, `/es/families` Organization node lacks `image`/`priceRange` (the `@graph` wrapper itself is fine — standard JSON-LD) | Restore the two properties. |
| Info | FAQ rich results are restricted to gov/health-authority sites since 2023 — FAQPage still helps AI citation, just don't expect rich snippets | — |
| Info | Do **not** add self-serving `aggregateRating`/`Review` markup — Google ignores it on LocalBusiness | — |

## 5. Performance — 62/100

Specialist reports: `reports/seo-google.md` (PSI/CrUX) and `reports/seo-performance.md` (resource-level).

| Page (mobile, lab) | Perf | LCP | FCP | TBT | CLS |
|---|---|---|---|---|---|
| `/` | 59 | 8.5 s | 4.7 s | 165 ms | 0 |
| `/programs/php` | 62 | 8.0 s | 4.5 s | 60 ms | 0 |
| `/treatments/` | 63 | 7.2 s | 4.6 s | 80 ms | 0 |
| `/blog/` | 59 | 10.8 s | 5.0 s | 80 ms | 0 |
| `/es/` | 66 | 8.3 s | 4.1 s | 60 ms | 0.005 |
| `/` desktop | 90 | 1.2 s | 0.9 s | 190 ms | 0.01 |

**No CrUX field data exists** for the origin or any URL (observed: "insufficient traffic") — Google has no real-user CWV for this site yet, so CWV is neither helping nor hurting rankings today; lab numbers are the only signal. SEO/Accessibility Lighthouse scores are 100 / 90–95 on every page.

**Root cause (observed via Playwright):** exactly three render-blocking resources — Google Fonts CSS (cross-origin, 270–350 ms), `styles.min.css` (16 KB br, edge HIT), and the synchronous `/js/i18n.min.js` placed *after* the stylesheet (so it also waits on CSS). There is no hero image; the LCP element is `p.hero-subheadline`, so LCP == FCP. Third-party weight ~337 KB compressed (gtag 170 KB, unpkg lucide 94 KB with no SRI, Google `swg/publisher.js` 73 KB) vs ~40 KB first-party. All 48 homepage `<img>` have width/height (CLS 0). Page weight 630 KB / 34 requests, of which the three Google-review screenshots are 155/108/95 KB and every review + team image is duplicated in the DOM (860 elements).

**Fixes, in impact order:** (1) inline or defer `i18n.min.js`; (2) self-host Plus Jakarta Sans with `font-display: swap` or load the Google Fonts CSS non-blocking (`preload as=style` + onload); (3) vendor lucide (subset the ~12 icons used) with SRI, or at least add `integrity`; (4) re-encode review screenshots (<40 KB each) and team JPGs (→ webp ~25 KB); (5) de-duplicate the review/team slider markup; (6) convert the two PNG logos (24 KB + 17 KB) to SVG/webp; (7) load `publisher.js` only on blog pages, if at all — it is Google News "Subscribe with Google" infrastructure and inert for a local clinic; (8) delete ~6 MB of unreferenced `.jpg`/`-1800.png` originals from `images/` after confirming no references.

## 6. Images — 65/100

- **123 `<img>` without alt** (observed): `logo-icon.png` in the nav on 113 pages (one template fix; use `alt="Golden State Rehab"` or `alt=""` if decorative next to the text logo) + 6 team headshots on `/` and `/team` (use the person's name and title).
- No `srcset`/`sizes` anywhere; 40 webp / 6 jpg / 2 png on the homepage; no AVIF.
- Oversized: 3 review screenshots (see §5); team JPGs 67–135 KB at 400×400.
- All 11 location pages reuse the same 18 stock image filenames — no unique local photo evidence (observed by the local specialist).
- Good: width/height on every image, lazy-loading on below-fold images, OG image (1200×630) on 114/114 pages.

## 7. Local SEO — 63/100

Specialist report: `reports/seo-local.md`.

- **NAP (observed):** one phone number sitewide (3 harmless formats); address is "Ste 425" in schema and 255 visible occurrences but "Suite 425" in 44 (the "Directions from …" blocks on location pages). Unify to "Ste 425".
- **GBP:** Maps CID link on 112/114 pages; real map embed on `/contact`; `OpeningHoursSpecification` correctly models 24/7 admissions vs 9–6 clinic. Primary category, photo count, Q&A, posts — **manual check** in the GBP dashboard.
- **Reviews:** 6 static 5.0★ Google review screenshots with names/dates (good; no self-serving rating schema). **No "leave a review" link anywhere on-site** and no total-count display. Add a place-ID review link to alumni/intake-success/footer and a HIPAA-safe request flow (ask permission verbally, never reference treatment in the request).
- **Geo:** schema `34.0447, -118.4308` — the local specialist estimates a ~500 m offset from 1964 Westwood Blvd. **Manual check:** copy the exact pin from GBP.
- **Citations:** only Yelp confirmed (via `sameAs`); findtreatment.gov and the DHCS directory are *linked to*, not confirmed as listings. LegitScript certification is **absent on-site** — required for Google/Meta ads in this vertical and a trust signal organically. Psychology Today, Rehabs.com, Recovery.com, AddictionCenter, BBB, Healthgrades, Apple Maps, Bing Places, Facebook — **manual check**.
- **Location pages:** genuinely unique prose (6.5–7/10) but generic "meetings/hospitals nearby" copy and shared stock photos. Add one named resource and one unique photo per page.
- **Telehealth pages** claim statewide service without a licensure-limit disclosure — add one line.

## 8. AI Search Readiness (GEO) — 83/100

Specialist report: `reports/seo-geo.md` (includes a ready-to-paste robots.txt with an explicit AI-crawler policy).

- **Crawler access (observed, live curl):** GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended, CCBot, Bytespider, Amazonbot, Applebot-Extended, meta-externalagent all receive HTTP 200 with the real page on `/` and `/robots.txt`. Cloudflare's "Block AI bots" toggle is off. Good for citation; make the policy explicit in robots.txt so a future toggle doesn't silently undo it.
- **llms.txt** is spec-compliant and already includes phone, address, DHCS license #191643AP, Joint Commission, programs and insurance language. `/llms-full.txt` → 404; generate it from the 70 FAQPage blocks.
- **Citability:** PHP/IOP definitions (121–145-word self-contained passages) and the cost post (138–181 words) are directly quotable. Homepage is weaker — mostly widget sections. (The specialist's "a third of template H2s have zero body text" overstates it: on the homepage only "What People Are Saying" has no paragraph; the other nine H2s have 19–63 words.)
- **Brand/entity:** thin `sameAs` (see §4); no third-party mentions found (manual check).
- **Preferred Sources / `swg/publisher.js`:** Google News infrastructure for publishers — inert for a local clinic; safe to remove from non-blog pages (saves 73 KB).
- **Bing/Copilot/ChatGPT depend on the Bing index:** verify the site in Bing Webmaster Tools + IndexNow (also unblocks backlink data — §9).

## 9. Backlinks & Authority — insufficient data

Specialist report: `reports/seo-backlinks.md`. Common Crawl (Jan–Mar 2026 graph) has **no record of the domain** — "no signal", not "zero links". Bing Webmaster API is verified only for another domain; Moz not configured. No DA/PA or referring-domain number can be stated honestly. Actions: verify in Bing WMT; confirm/obtain DHCS directory, SAMHSA locator, LegitScript, Psychology Today, BBB, chamber listings; add Moz key for next run.

## 10. Sitemap — 84/100

Specialist report: `reports/seo-sitemap.md`. Valid XML, 113 URLs, 13.9 KB, no `priority`/`changefreq` noise, every `<loc>` = canonical, 0 noindex/redirect entries, complete coverage. **Defect:** `lastmod` is stale — 44 `/es/` URLs say 2026-07-07 despite edits on 08-13 and 08-20; the other 59 say 08-13 but changed 08-20; the host sends no `Last-Modified` header so this is Google's only freshness signal. Generate `lastmod` from `git log -1 --format=%cs -- <file>` at build time. Optional: add `xhtml:link` hreflang (on-page hreflang already suffices).

## 11. Visual / UX (screenshots)

Specialist report: `reports/seo-visual.md`; 10 captures in `screenshots/` (desktop 1440×900, mobile 390×844, Chromium — WebKit not used; per project memory, mobile "sliding" reports need a WebKit check).

- Homepage mobile: H1 with "100+ Recoveries", both CTAs, 5.0★ badge and DHCS line all above the fold; sticky bar + nav ≈ 14% of viewport. Strongest page.
- `/verify-insurance` mobile: H1 ≈ 35% of viewport; form starts below the fold.
- `/programs/php` (verified from screenshot): no CTA above the fold; only the phone bar.
- `/es/` hero lacks the Google 5.0★ badge shown on the EN hero — parity gap.
- No horizontal overflow, no broken Lucide icons, no low-contrast text, no popups on any capture.

## 12. Internal linking & topic clusters — 68/100

Specialist report: `reports/seo-cluster.md` (link graph in `crawl/linkgraph.json`).

**Strength (observed):** all four hubs (`/programs/`, `/treatments/`, `/locations`, `/blog/`) have 100% bidirectional hub↔spoke contextual links. Anchor text is descriptive (no "click here" in the 5-post sample).

**Correction to the specialist report:** its headline "CTA leak" — that the three cost/insurance posts never link to `/verify-insurance` or a program page — is wrong. I re-parsed `<main>` on each: `cost-of-rehab-in-los-angeles` has 3 verify-insurance + 6 program/treatment links, `does-insurance-cover-rehab-in-california` 3 + 10, `does-medi-cal-cover-rehab-in-california` 2 + 0, `how-much-does-rehab-cost` 2 + 1. Items 1–10 of its "add these 20 links" list already exist. What *does* hold (observed):

- `/blog/does-medi-cal-cover-rehab-in-california` links to no program/treatment page.
- `/blog/cbt-vs-dbt-which-is-right` and `/blog/terrified-to-ask-for-help` have no in-body call/verify-insurance link.
- **9 of 14 treatment pages and 10 of 11 location pages have zero in-body links to any blog post** — the blog supports the hubs but the hubs don't send readers back to supporting content.
- `/faq` doesn't link into the blog.

**Content gaps (15, prioritized by the specialist; SERP-checked for 3):** PHP vs IOP; detox vs rehab (educational + referral — the site has no detox program); What is PHP; carrier pages ×5 (Anthem, Aetna, Cigna, Blue Shield, Kaiser) each parented to the insurance post and linking to `/verify-insurance`; MAT/Suboxone in outpatient; telehealth rules in CA; sober living near UCLA/Westwood; rehab for UCLA students; rehab for healthcare professionals; What is IOP; group vs individual therapy.

**Spanish cluster:** 6 of 16 posts translated, all awareness/cost stage. Translate next: `inpatient-vs-outpatient-rehab`, `do-i-need-rehab`, `questions-to-ask-a-rehab-center`, `can-family-come-to-rehab-visits`, `find-rehab-near-me-los-angeles`. Do **not** translate `how-much-does-rehab-cost` (would duplicate the already-translated cost post).

---

## Data gaps to close before the next audit

1. **Google Search Console:** add `claude-seo-reader@claude-seo-496120.iam.gserviceaccount.com` as a Full user on the property — every GSC call returned "permission denied", so clicks/impressions/index coverage are unknown. Also fix `~/.config/claude-seo/google-api.json` `default_property` (points at an unrelated domain).
2. **Bing Webmaster Tools:** verify this domain (unblocks inbound-link data and IndexNow).
3. **Moz API key** for DA/PA.
4. **GBP dashboard:** category, pin coordinates, photo/Q&A/post cadence.
5. **Drift baseline:** run `drift_baseline.py https://www.goldenstate-rehab.com/` so the next audit can diff.

## Artifacts

- `crawl/pages.jsonl` (114 records), `crawl/html/` (saved HTML), `crawl/summary.txt`
- `reports/*.md` (12 specialist reports), `reports/psi-*.json`, `reports/crux-*.json`, `reports/gsc-*.json`
- `screenshots/*.png` (10)
