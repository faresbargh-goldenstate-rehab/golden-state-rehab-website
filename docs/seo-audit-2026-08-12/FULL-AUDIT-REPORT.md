# Full SEO Audit — goldenstate-rehab.com

**Date:** 2026-08-12 · **Pages crawled:** 102 (all sitemap URLs, EN + ES; 100% HTTP 200)
**Business type:** Local healthcare service — outpatient addiction & mental-health treatment center (single brick-and-mortar facility at 1964 Westwood Blvd, Ste 425, Los Angeles + statewide telehealth). YMYL vertical with heightened Google scrutiny (DHCS/LegitScript).
**Method:** Full crawl + 9 specialist analyses (technical, content/E-E-A-T, schema, sitemap, performance/Lighthouse, GEO/AI, local, SXO/SERP, visual/Playwright). Live header/redirect checks, JSON-LD extraction of 480+ nodes, real mobile/desktop screenshots, live SERP sampling. No Google Search Console/CrUX/DataForSEO access this run — performance is lab data, rankings are directional.

---

## Executive Summary

# SEO Health Score: 83 / 100

| Category | Weight | Score |
|---|---|---|
| Technical SEO | 22% | 88 |
| Content Quality (E-E-A-T) | 23% | 80 |
| On-Page SEO | 20% | 88 |
| Schema / Structured Data | 10% | 74 |
| Performance (CWV, lab) | 10% | 93 |
| AI Search Readiness (GEO) | 10% | 73 |
| Images | 5% | 78 |
| **Weighted total** | | **83** |

Supplementary scores (outside the core formula): **Local SEO 59** · **SXO 71** · **Visual/Mobile 78**.

This is a well-built site — top-decile execution for the addiction-treatment vertical. The crawl found zero broken pages, zero duplicate titles, perfect canonicals, verified hreflang reciprocity, medical-review bylines on 38 pages, real .gov citations, and honestly differentiated location pages. **The biggest gap is not the website — it's the connection between the website and its off-site entity: no link to the Google Business Profile anywhere, a near-empty `sameAs` graph, only 2 citations, and no video/social presence.** That's why Local (59) and GEO (73) trail the on-site scores, and it matches the current branch name (`feat/gbp-linking-eeat`).

### Top 5 Critical/High Issues

1. **Schema hours contradict visible copy (verified directly).** JSON-LD claims the clinic is open Mon–Sun 00:00–23:59 sitewide; visible copy says "Admissions available 24/7 · **Clinical hours Mon–Sat**". Structured-data misrepresentation risk in Google's most-scrutinized vertical.
2. **No Google Business Profile link anywhere.** No Maps/g.page link on the site, no GBP URL in `sameAs` (only Yelp + LegitScript). The review wall shows "5.0 on Google" with no live link to the listing and no review count. GBP is the #1 local ranking surface and it's disconnected from the site.
3. **Contact page contradiction.** The address is printed in the info panel, but the map section below it is a placeholder reading "Call us for our exact address and driving directions." No real map on the highest-intent page.
4. **The site contradicts itself on PHP hours.** /programs/php says "about six hours a day, five days a week"; /programs/iop describes PHP as "3-hour sessions 3 to 5 days a week". A factual inconsistency on a core service — and a direct AI-answer poisoning risk.
5. **Broken mobile sticky CTA bar (verified via live Playwright).** `.mobile-cta-bar` ("Call Now / Verify Insurance") exists on every page but its transform keeps it permanently off-screen — it never appears at any scroll position. Dead conversion code.

### Top 5 Quick Wins

1. Fix the `openingHoursSpecification` (real clinical hours) + represent 24/7 admissions as a `ContactPoint` with `hoursAvailable` — one shared JSON-LD block, sitewide fix.
2. Add the GBP/Maps URL (+ any real social profiles) to `sameAs` and link the review wall to "Read all reviews on Google."
3. Fix two invalid schema values: `medicalSpecialty: "Addiction Medicine"` (not a valid enum — move to `knowsAbout`) and `Person.qualifications` (not a valid property — move to `description`) on 5 of 7 team members.
4. Reconcile the PHP-hours copy and add internal links to /programs/outpatient-rehab (currently 1 inlink sitewide — a 1,500-word money page missing from nav, footer, and the program card grid).
5. Generate real per-URL sitemap `lastmod` from git (all 102 currently say 2026-07-07, provably stale — team pages changed 07-20/07-22, homepage 07-27).

---

## 1. Technical SEO — 88/100

**No critical issues.** Redirect chains correct (http→https→www both hosts), HSTS/X-Content-Type-Options/X-Frame-Options/Referrer-Policy/Permissions-Policy all present, custom 404 with true 404 status + noindex, Brotli, HTTP/2, fully static HTML (no JS-rendering dependency), 102/102 self-referential canonicals, hreflang reciprocity verified programmatically with 0 mismatches.

- **High:** No Content-Security-Policy header (third parties: googletagmanager, cloudflareinsights, unpkg, Google Fonts). Add via Cloudflare Transform Rule, Report-Only first.
- **Medium:** HTML not edge-cached (`cf-cache-status: DYNAMIC` on every page; static assets cached correctly). Add a Cache Rule for text/html with 5–10 min TTL.
- **Medium:** No IndexNow key despite Cloudflare's one-click support.
- **Medium:** Stale uniform sitemap lastmod (see §4).
- **Low:** Render-blocking Google Fonts (see §5); mixed trailing-slash convention (8 hub URLs with slash, 94 without — both 308 correctly today; document the rule).

## 2. Content Quality / E-E-A-T — 80/100

E-E-A-T: Experience 78 · Expertise 82 · Authoritativeness 74 · Trust 84. **No critical issues** — no fabricated statistics, disclaimers and 988/SAMHSA lines in every footer, real NIDA/NIMH/APA/SAMHSA citations on every treatment page, named credentialed medical reviewer (Dr. Eric Chaghouri, MD) on 38 pages, genuine unedited review screenshots.

- **High:** Doorway structural exposure — all 11 location pages resolve to one address, the literal pattern in Google's doorway policy. Mitigation is genuinely good (avg 26% main-content similarity, unique directions/FAQs per city) but the exposure remains; monitor.
- **High:** 4 of 6 EN blog posts under 1,500 words (cbt-vs-dbt 926w, first-week 997w, terrified-to-ask 1,006w, cost-of-rehab 1,475w).
- **High:** Clinician license numbers "available on request" instead of published — contradicts the site's own "claims you can verify yourself" positioning.
- **Medium:** ES gets one 596-word locations page vs 11 EN pages at ~1,500–1,690w; college-level readability (Flesch 40–50) for a crisis-facing audience; all posts bylined by the MD including two insurance/billing topics; Sophia Scharpf has no bio; "5.0 on Google" shown with only 3 screenshots and no count; founded 2026 = inherent authority ceiling; no CARF/Joint Commission accreditation found.

## 3. On-Page SEO — 88/100

Exceptionally clean: 0 duplicate titles, 0 missing metas, 0 missing/multiple H1s, 0 missing canonicals, 0 images without alt, location titles/H1s exact-matched to "Rehab Near [Neighborhood], CA".

- **High:** /programs/outpatient-rehab near-orphan — exactly 1 internal link sitewide, absent from nav/footer/program cards, only page with zero hreflang, no ES twin.
- **Medium:** 10 weakly linked pages (≤2 inlinks), mostly ES side; strengthen ES footer cross-linking.
- **Low:** 2 blog titles slightly over 60 chars; 8 meta descriptions outside 70–160 (the /locations hub description is 18 chars); high keyword density on some treatment pages (fentanyl ×39 ≈ 3.1%).

## 4. Schema / Structured Data — 74/100

100% JSON-LD, **0 parse errors across 480+ nodes, 102/102 pages covered** — but with validity and entity-graph gaps:

- **High (verified):** Hours mismatch (see Critical #1).
- **High:** `medicalSpecialty: "Addiction Medicine"` invalid enum on ~99 pages (only "Psychiatric" is valid; move the rest to `knowsAbout`).
- **High:** `sameAs` byte-identical and nearly empty sitewide (LegitScript + Yelp only) — no GBP, no socials. Highest-value single fix.
- **Medium:** `Person.qualifications` invalid on 5/7 team members (→ `description`); `worksFor` duplicated inline (→ `@id` ref); no `Person.image`/`sameAs` despite headshots; `Organization.logo` bare string (→ `ImageObject`); blog `author` not entity-linked; `WebSite` schema missing on 7 pages; geo at 4 decimals.
- **Correct by design — do not change:** zero `AggregateRating`/`Review` markup (adding it from self-collected Google reviews would risk a manual action — one specialist suggested adding it; the schema and local specialists are right that it must stay off), and all 11 location pages share one `#organization` @id (one real clinic + `areaServed`, not fake listings).
- **Info:** `FAQPage` on 59 pages is valid but rich-result-ineligible on a commercial site (Google's Aug 2023 restriction) — keep for AI-citation value, don't expect FAQ rich results.

## 5. Performance — 93/100 (lab only; PSI API quota exhausted, no CrUX field data)

All tested pages pass all CWV "good" thresholds in Lighthouse mobile: LCP 2.1–3.8s, CLS ≤0.092, TBT ≤70ms; desktop homepage scores 100. TTFB 34–45ms.

- Render-blocking chain ~950ms on interior pages (Google Fonts 5 weights, sync i18n.js in head, cta.css) — and since LCP is text everywhere, this chain *is* the LCP. Fix: self-host + subset the font (5→3 weights, preload), inline i18n.js (5.7KB), merge cta.css.
- Font-swap CLS 0.077–0.091 sits just under the 0.1 threshold on /programs/php and /es/ — a metric-matched fallback `@font-face` (size-adjust/ascent-override) eliminates it.
- ~600 KiB image savings on the homepage (carousel served 1600px for 536px slots; one 135KB team headshot vs ~30KB peers; ~155KB review screenshots). Lazy-loaded, so weight not LCP.
- Lucide icons: 92 KiB from unpkg for 44 icons — inline as SVGs; unify mismatched `?v=` cache params across pages.

## 6. Images — 78/100

100% alt-text coverage, WebP widely used, correct lazy-loading and dimensions (one exception: the exit-intent popup image lacks width/height). Held back by the oversizing above and no image sitemap for team/facility photos.

## 7. AI Search Readiness (GEO) — 73/100

- **Verified strong:** every AI crawler tested (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, CCBot, Bytespider) gets HTTP 200 with full content — no Cloudflare blocks; well-formed llms.txt; Person + credential schema sitewide; the cost blog's price table with .gov citations is exactly what AI engines cite.
- **Gaps:** PHP-hours contradiction (Critical #4 — LLMs synthesize across pages); FAQ questions are `<button>`s, not headings; no dedicated PHP-vs-IOP comparison page for a named high-intent query; near-zero off-site entity graph (no YouTube/LinkedIn/Reddit; video presence is the strongest measured AI-citation correlate); no /llms-full.txt.

## 8. Local SEO — 59/100 (biggest opportunity)

The weakest area, dominated by off-site disconnection: no GBP link (Critical #2), contact-page map placeholder (Critical #3), hours mismatch (Critical #1), citations on only Yelp + LegitScript (missing Psychology Today, SAMHSA Treatment Locator, Healthgrades, Rehab.com/Recovery.org, BBB — the directories that dominate this vertical's SERPs).
**Strengths:** phone 100% consistent everywhere; location pages are legitimately differentiated (unique drive times, transit lines, landmarks, per-city FAQs — the best-executed version of this pattern the analysis has seen in the vertical); review display is guideline-safe.
Not assessable from the crawl: GBP category/posts/Q&A/review velocity — needs a dashboard check.

## 9. Search Experience (SXO) — 71/100

- /verify-insurance is a form in a 100%-educational SERP; its "how it works" explainer sits *below* the form and the "call us — no name needed" line is buried. Weakest persona score on the site: person-in-crisis, 63/100.
- Systemic gap: **zero dollar figures on any program/treatment page** while the cost blog post (which has real numbers) scores 89–90 with the very personas those pages lose. Surface cost-range callouts on /programs/php, /programs/outpatient-rehab, /treatments/alcohol.
- "rehab santa monica" is a split-vertical SERP where competitors have real Santa Monica addresses; retarget long-tail ("outpatient rehab near Santa Monica") and lead with the existing trust block + drive time.
- Aligned and strong: /programs/php, /programs/outpatient-rehab, and especially the cost blog post (8/8 SERP-type match).
- Site-wide strength: tap-to-call (sticky banner + tel: links) present everywhere — but see the broken bottom CTA bar (Critical #5).

## 10. Visual / Mobile — 78/100 (live Playwright, 10 screenshots)

Broken sticky CTA bar (Critical #5); no above-the-fold CTA button on inner-page mobile heroes (/programs/php, /locations/santa-monica); 34–56 sub-44px tap targets per page (nav/footer links). Confirmed clean: no horizontal overflow, no console errors, exit-intent popup can't block clicks, /verify-insurance and blog mobile folds are strong.

---

## Verification notes & limitations

- Cross-checked between specialists: the hours mismatch was confirmed by direct HTML extraction after two agents disagreed; a "blogs lack BlogPosting schema" claim was rejected (programmatic extraction found it on all 12 posts); an "add aggregateRating" recommendation was overruled as a guideline violation.
- Lab-only performance (no CrUX/GSC access); SERP findings from search snippets, not rank trackers; GBP internals not auditable from a crawl; Yelp/LegitScript listing status unverified (403 to bots).
- Findings artifacts: `scratchpad/findings/*.md`, Lighthouse JSONs, screenshots, and the full JSON-LD dataset are in the session scratchpad.
