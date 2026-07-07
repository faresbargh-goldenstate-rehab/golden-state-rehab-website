# Golden State Rehab — Full SEO Audit Report

**Audited:** 2026-07-07 · 93 pages (46 EN + 47 ES), local repo + live edge (`https://www.goldenstate-rehab.com`) · Business type: **Local Service — Healthcare (behavioral health / addiction treatment, outpatient PHP/IOP)**, Westwood, West LA
**Method:** 16 parallel specialist analyses (technical, content/E-E-A-T, on-page sweep, schema, sitemap, performance/Lighthouse, AI-search/GEO, local, SERP/SXO, images, above-the-fold, CTA/friction, 3 conversion personas, trust/compliance). Every critical/high finding was independently re-verified by an adversarial checker against the repo and live site; refuted findings were dropped and overstated ones downgraded.
**Supersedes:** the 2026-06-07 audit (91/100, 40 pages). See "Why the score dropped" below.
**Companion docs:** [seo-action-plan.md](seo-action-plan.md) · [conversion-scorecard.md](conversion-scorecard.md) · [conversion-baseline.json](conversion-baseline.json)

## Overall SEO Health Score: **71 / 100** 🟡

| Category | Weight | Score | One-line verdict |
|---|---|---|---|
| Technical SEO | 22% | 75 | On-page hygiene excellent; apex-host duplicate + no 404 page + thin security headers |
| Content Quality | 23% | 70 | Treatment pages well-bylined; program (money) pages thin & byline-less; college-level prose |
| On-Page SEO | 20% | 86 | 0 broken links of 6,542; unique titles/metas everywhere; Families page orphaned |
| Schema | 10% | 80 | 350 blocks, 0 parse errors, NAP 100% consistent; sameAs worthless, ES coverage patchy |
| Performance (CWV) | 10% | 84 | TTFB ~34 ms, CLS 0.004; 7.2 MB unoptimized images, fake ".min" files, 70 hotlinked heroes |
| AI Search Readiness | 10% | **34** | **Cloudflare WAF 403-blocks every major AI crawler — llms.txt included** |
| Images | 5% | **37** | **80 random placeholder images live on treatment pages; 3 dead hero URLs; og:image is a 256 px logo** |

**Companion scores (not in the weighted total):**
**Conversion Enticement: 61/100** (full breakdown in [conversion-scorecard.md](conversion-scorecard.md)) · Local SEO: 64 · Search-experience fit (SXO): 58

### Why the score dropped from 91 (June 7) to 71

1. **The site more than doubled** (40 → 93 pages) with the Spanish mirror; some new surface shipped with gaps (ES schema variants, ES CTAs pointing at EN pages, over-length ES metas).
2. **This audit tested the live edge, not just the repo.** The repo is clean; Cloudflare's dashboard config is not: AI crawlers are 403-blocked, the apex→www redirect documented in `_redirects` was never created, and there is no 404 page so every bad URL soft-404s.
3. **Regressions shipped to production:** 80 `picsum.photos` placeholder images on 36 treatment/program/team pages, 3 Unsplash hero URLs that now 404 (~35 pages with broken heroes, including the contact page), and a contact form with no submit handler.

---

## Executive Summary

The foundation is genuinely strong — this is a hand-built static site with better on-page hygiene than most agency builds: **all 6,542 internal links resolve, zero duplicate titles/metas across 93 pages, full hreflang triplets on all 90 indexable pages, 350 JSON-LD blocks with zero parse errors, 100% NAP consistency, ~34 ms TTFB, and honest, compliant copy (zero cure/guarantee claims).**

But the audit found **four production emergencies** that undermine everything else, plus a structural AI-visibility block:

### Top 5 critical issues

1. **The contact form is dead — 100% of contact-form leads are silently lost.** [contact.html:153](../contact.html) and [es/contact.html](../es/contact.html) declare `<form class="contact-form" novalidate>` with no `action` and no JS handler anywhere (`js/main.min.js` contains zero `submit` bindings; `functions/` has only `send-vob.js`). "Send Message" reloads the page and appends the visitor's name, phone, insurance, and message to the URL query string — on a page running GA4 — while the copy promises a 1-hour follow-up. This is simultaneously a lead-loss, privacy (HHS OCR tracking bulletin pattern), and false-promise problem. **Fix first.**
2. **Cloudflare's edge blocks every AI answer engine (HTTP 403): GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, CCBot — including on `llms.txt` itself.** The repo's permissive robots.txt is being overridden by a Cloudflare-managed robots.txt + WAF "Block AI Bots" setting. The site's entire GEO strategy (llms.txt, citability work) is moot until this dashboard toggle is flipped. Verified live via curl with real crawler user-agents.
3. **80 `picsum.photos` random-placeholder images render on 36 core pages** (fentanyl, opioid, alcohol, meth, team, programs — EN and ES) with clinical alt text like "Compassionate fentanyl addiction treatment." Picsum serves arbitrary photos (verified: a beach boardwalk, a pine forest). On the exact pages families scrutinize hardest, this reads as a fake or scam site. The seed values encode the originally intended Unsplash photo IDs, so intent is recoverable — but replace with the real `images/facility/` photos instead.
4. **GA4 fires on both PHI-collection pages with no consent mechanism**, and [privacy-policy.html](../privacy-policy.html) misdescribes it ("aggregated and anonymized" — false for default GA4) while also claiming "we do not collect PHI through standard forms" (the VOB form collects DOB, member ID, and card images). This is the GoodRx/BetterHelp enforcement fact pattern for a 42 CFR Part 2-adjacent site.
5. **3 dead Unsplash URLs break hero/CTA-banner backgrounds on ~35 live pages** — including the contact page hero and the CTA banner on 23 pages. CSS backgrounds fail silently; the highest-intent pages just lose their visuals.

### Top 5 quick wins (an afternoon, total)

1. Point every "Call Now"-labeled button at `tel:+14242083120` instead of the (broken) `/contact` page — nav, mobile menu, footer, and mid-page CTAs on ~47 EN pages.
2. Add a branded `404.html` — one file stops Cloudflare Pages serving the homepage with HTTP 200 for every nonexistent URL.
3. Create the apex→www 301 Redirect Rule in the Cloudflare dashboard (already documented as "existing" in `_redirects`, never actually created).
4. Add a "Families / Para Familias" link to the shared footer — the families page (a prime admissions page) is orphaned in both languages (1 inbound link total).
5. Replace the 3 dead Unsplash URLs with photos from `images/facility/`.

---

## Technical SEO — 75

**Strong:** 92/93 pages have a single, absolute, extensionless self-canonical matching the sitemap; hreflang reciprocity passes on 91/93 (only noindexed pages fail); viewport meta 93/93; zero mixed content; `.html` → extensionless 308s work; `_redirects` rules verified live; intake-success pages correctly noindexed.

**Issues (all verified live):**
- **[HIGH] No `404.html`** → Cloudflare Pages SPA-fallback serves the homepage with HTTP 200 for any unknown path (4/4 test URLs, both hosts, both languages). Infinite duplicate-URL space, Search Console soft-404 pollution. *(Verifier downgraded from critical: homepage canonical on those responses prevents indexing damage.)*
- **[HIGH] Apex `goldenstate-rehab.com` serves the full site at 200** — no redirect to www; `http://` apex 301s to `https://` apex and stops. The June audit flagged "apex 404"; the domain got attached but the redirect rule never got created. Canonicals mitigate, crawl/link signals still split.
- **[MEDIUM] Security headers thin for YMYL healthcare:** no HSTS, CSP, X-Frame-Options, or Permissions-Policy (the intake form is frameable). `_headers` only sets Cache-Control.
- **[LOW]** `es/intake-success.html` has a broken hreflang cluster and `noindex, follow` vs EN's `noindex, nofollow` — align both.

## Content Quality — 70

**Strong:** all 14 treatment pages + mental-health carry "Medically reviewed by Dr. Eric Chaghouri, MD" with visible review dates; all 6 blog posts are physician-bylined, fresh (May–June 2026), answer-first, and link money pages well; cross-page similarity 7–26% (no template stamping); zero prohibited claims.

**Issues:**
- **[HIGH] All 8 program pages — the money pages — lack the medical-review byline** treatment pages have, including medication-management (squarely YMYL).
- **[HIGH] Thin money pages:** 7 of 8 program pages are 352–472 words (only php.html at 822 clears the ~800-word service-page bar); 11 of 14 treatment pages sit at 460–615 words vs 1,500+-word competitors.
- **[HIGH] team.html renders only 183 visible words** — the credentials live in `data-bio` attributes surfaced by a JS modal, invisible to text extraction. The E-E-A-T anchor that every byline links to is nearly empty to crawlers.
- **[MEDIUM] Only 4 of 48 EN pages cite authoritative sources**, while specific clinical stats run uncited ("MAT reduces overdose deaths by 50%+", "60–80% response rate", "50% reduction in self-harm").
- **[MEDIUM] Treatment/program prose reads at college level** (alcohol page: Flesch-Kincaid grade ~16) vs the grade 7–9 target for stressed lay readers. The homepage (8.9) and blog (8.0) prove the site can hit the right register.
- **[MEDIUM]** Indexable thin pages: verify-insurance (115 words — the #1 conversion target), locations (279), contact (219).

## On-Page SEO — 86

**Strong:** 0 duplicate/missing titles or metas; 0 broken internal links (6,542 checked); 0 multiple-H1 pages; hreflang triplets on all 90 indexable pages; 100% img alt-attribute coverage (all 100 empty alts verified decorative).

**Issues:**
- **[HIGH] Families page orphaned in both languages** — `families.html` has exactly one inbound link sitewide (the language toggle on `es/families.html`, itself orphaned with zero). Not in any nav or footer.
- **[MEDIUM] Breadcrumb section link points to the homepage on 22 EN treatment/program pages** (`<a href="/">Treatments</a>`), contradicting the pages' own correct BreadcrumbList schema. The ES mirror does it right.
- **[MEDIUM] 30 pages exceed 160-char meta descriptions** (worst: families.html at 210; ~25 of 30 are ES pages where translation expanded past the limit).
- **[LOW]** 7 titles at 61–62 chars; footer `<h5>` labels cause heading-order skips on 91 pages; 3 indexable ES pages missing twitter:card.

## Schema — 80

**Strong:** 90/93 pages carry JSON-LD (the 3 without are noindexed); 350 blocks, 0 parse errors; NAP 100% consistent across 70 schema instances and matches visible NAP exactly; DHCS license as `identifier`+`hasCredential`; 31/32 MedicalWebPages have `reviewedBy`/`lastReviewed`; FAQ content is visible in the DOM (rich-result eligible).

**Issues:**
- **[MEDIUM] `sameAs` is a single Google search "stick" URL on 66 pages** — zero real profiles (GBP, Yelp, Psychology Today, findtreatment.gov, LegitScript, socials). No entity corroboration for AI/knowledge-graph resolution.
- **[MEDIUM] `foundingDate: "2026"` templated into every org block** (66 occurrences) — a placeholder that reads as machine-verifiably synthetic.
- **[MEDIUM] families.html declares a conflicting thin `MedicalBusiness` node on the same `#organization` @id** that 66 other pages type as `[MedicalOrganization, LocalBusiness]`.
- **[MEDIUM] ES coverage patchy:** 23 ES pages have no org entity at all; 11 carry a degraded variant missing `openingHoursSpecification` and the DHCS `hasCredential`.
- **[MEDIUM] FAQPage answers are paraphrases, not the visible text** (all 24 instances) — verbatim parity is required for the rich result, which health sites can still get.
- **[MEDIUM]** Schema `openingHoursSpecification` claims 24/7 while visible text says "Clinical hours Mon–Sat" (admissions ≠ clinical hours). **[LOW]** BlogPosting missing `publisher` (12 posts); two @ids for the same clinic (EN/ES locations); breadcrumbs missing on 15 pages incl. both verify-insurance pages; team Person nodes lack `hasCredential`.

## Sitemap — 86 (folded into Technical weight)

Well-formed, byte-identical live vs repo, 0 orphans/duplicates, the 3 excluded files are exactly right and all noindexed, 12/12 sampled URLs return 200 with zero redirect hops, URL forms fully consistent. **[MEDIUM]** 58 of 90 `lastmod` values are stale (31 frozen at 2026-03-23 despite site-wide June edits) — regenerate from git or drop the field; Google ignores `lastmod` once proven unreliable. `changefreq`/`priority` are dead weight.

## Performance — 84

**Strong:** median TTFB ~34 ms (brotli, Cloudflare edge); homepage LCP is the H1 *text* (no hero image) — Lighthouse mobile scored 100 with LCP 1.5 s / CLS 0.004 / TBT 64 ms in this run (an earlier throttled run showed 91 / LCP 3.0 s — lab variance; no CrUX field data available); fonts have preconnect + `display=swap` + variable woff2; lucide is version-pinned.

**Issues:**
- **[HIGH] 7.2 MB of images, 0% WebP/AVIF.** Facility JPEGs are 409–811 KB each served ~2× display size; Lighthouse measures 3,448 KB savings on the homepage alone. `our-facility.html` carries ~5.9 MB.
- **[HIGH] ~70 pages' LCP hero is a hotlinked Unsplash CSS background** — late discovery (post-CSSOM), fresh third-party DNS+TLS, no preconnect, no fetchpriority, and an availability risk already realized (3 URLs dead).
- **[MEDIUM]** `styles.min.css` and `main.min.js` are byte-identical copies of the unminified sources (cmp-verified) — the `.min` is cosmetic. **[MEDIUM]** Lucide ships 402 KB raw / 94 KB gzip on 92 pages to render ~40 icons client-side — inline an SVG sprite instead. **[MEDIUM]** 3 render-blocking stylesheets + sync `i18n.js` in head (~590 ms est. savings); merge `cta.css`, inline `i18n.js`. **[MEDIUM]** Edge overrides `_headers`: CSS/JS ship `max-age=14400` despite `?v=` busting that would allow `immutable` year-long caching — set Browser Cache TTL to "Respect Existing Headers" and add `/css/*`,`/js/*` immutable rules.

## Images — 37

- **[CRITICAL] 80 picsum.photos placeholders on 36 pages** (see Executive Summary #3).
- **[HIGH] 3 dead Unsplash URLs** break heroes/CTA banners on ~35 pages including contact (both languages).
- **[HIGH] og:image is the 256×256 logo on 78 of 90 pages** (below WhatsApp's 300 px minimum; square not 1.91:1) — every link a family member shares gets a broken/tiny preview. 3 pages have none; 0 `twitter:image`; 0 `og:image:width/height`. For a rehab, shared-link previews are a primary referral surface.
- **[HIGH] 196 img tags hotlinked to third parties** (80 picsum, 64 Unsplash, 36 ui-avatars, 16 gstatic) + all 56 page heroes external. Blog bylines use generated ui-avatars initials for Dr. Chaghouri when a real headshot exists in `images/team/`.
- **[MEDIUM]** 804 below-fold insurance-logo imgs lack `loading=lazy` (~250 KB eager per page); 0 srcset/`<picture>`/fetchpriority sitewide; no `favicon.ico`/`apple-touch-icon` (both soft-404 as text/html). **[LOW]** 5 unused files (~466 KB) incl. a byte-duplicate of the DHCS license scan; committed `.DS_Store`.
- **Strong:** 100% alt-attribute coverage (1,292 tags); 96% have width/height; empty alts all verified decorative.

## AI Search Readiness (GEO) — 34

- **[CRITICAL — verified live] Cloudflare WAF returns 403 to GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Bytespider, CCBot** (6 of 7 tested; browser UA gets 200). The served robots.txt is Cloudflare-managed and prepends `Disallow: /` groups for 9 AI crawlers plus `Content-Signal: ai-train=no` — none of it in the repo. **`llms.txt` itself 403s to AI user-agents.** Google-Extended returns 200 despite being robots-disallowed — the block list and robots file don't even agree. Platform readiness estimates: ChatGPT 5/100, Perplexity 5/100, Google AIO 15/100, Bing Copilot 40/100. **One dashboard toggle (Security → Bots) unlocks the whole category.**
- **[HIGH]** No real `sameAs` profiles anywhere (entity corroboration = 0 sources).
- **[MEDIUM]** llms.txt lists only 25 of 90 URLs — missing the homepage, /about, /contact, all 5 of 6 blog posts, and the entire Spanish track (a genuine differentiator for "Spanish-speaking rehab LA" AI queries).
- **[MEDIUM]** Answer passages run 37–53 words (optimal citation length ~134–167); the IOP cadence numbers are stranded in paragraph 2 where extractors miss them. FAQ page is the citability high point (47–74-word self-contained answers).

## Local SEO — 64 *(on-site signals only — GBP/citations not API-checkable from here)*

**Strong:** NAP identical across 332 visible renderings + 70 schema blocks; DHCS license footer on 91 pages; "Los Angeles" in 31 titles; MedicalClinic with `parentOrganization` on locations.
**Issues:** **[HIGH]** zero on-site links to any review/citation profile (Yelp, BBB, Psychology Today, findtreatment.gov, GBP); **[HIGH]** zero testimonials/reviews anywhere (correctly no self-serving aggregateRating — but no linked social proof either); **[HIGH→adj]** locations.html H1 lacks any geo term ("Locations & Areas We Serve"); **[MEDIUM]** the "map" is a neighborhood-amenities widget showing *other* businesses' pins — no embed of the clinic's own GBP pin anywhere; **[MEDIUM]** 95 `tel:` links missing `+1`; one "Suite 425" vs "Ste 425" prose variant; 4-decimal geo coords that don't match the amenity-map's own center; Maps API key needs referrer-restriction confirmation.

## Search Experience (SXO) — 58

Live-SERP analysis of 5 money queries:
- **"iop program los angeles" / "php mental health program los angeles":** SERPs reward exactly the dedicated program pages GSR has — right page type, but `programs/iop.html` (354 words, no FAQ schema) is thinner and less neighborhood-anchored than winners (Clearview anchors to its W Olympic Blvd address).
- **"alcohol rehab los angeles":** ~70% of winners are residential/detox providers + 3 aggregators. GSR's outpatient-only page *disqualifies itself above the fold* ("for individuals who have completed medical detox"). Don't chase the head term — move detox-referral messaging above the fold, target "outpatient alcohol rehab / alcohol IOP los angeles," and get listed on the aggregators that own 30% of page 1 (Psychology Today, Recovery.com, AddictionCenter).
- **"outpatient drug rehab los angeles":** competitors win with a dedicated outpatient-branded page; GSR has no page targeting this phrase — relevance is split across index/treatments/programs. Create or retarget one consolidated outpatient page.
- **"does insurance cover rehab in california":** right page type (blog post); add a literal first-line answer under the H1 to compete for the featured snippet.

## Conversion Enticement — 61 *(the "how enticing is this for someone seeking treatment" score)*

Full analysis, persona walkthroughs, and the trackable metric baseline live in **[conversion-scorecard.md](conversion-scorecard.md)**. Headlines: the phone path is genuinely strong (sticky banner on 92 pages, bottom CTA bar on 88, 1 click to call from anywhere) and the VOB form is well-built with a HIPAA-aware backend — but the contact form is dead, "Call Now" buttons don't dial, "Call or Text" has zero `sms:` links, no page tells an ashamed 1 a.m. visitor what happens when they call, the alcohol page gates still-drinking readers, zero third-party social proof exists site-wide, and the Spanish funnel routes its highest-intent clicks into English pages.

---

## Data gaps (worth closing before the next audit)

- **No Google field data** (Search Console, CrUX, GA4 API) — CWV is lab-only; indexation/CTR unverified. Wire credentials and re-run.
- **No GBP/citation/backlink data** (no Moz/DataForSEO/Ahrefs keys) — off-site authority, review counts, and map-pack position could not be measured. The June audit noted DR 0 and 64% missing citations; still unverifiable from here.
- **BAA status** (Paubox, Cloudflare Workers Paid) and **LegitScript certification currency** are operational facts the repo can't prove — confirm and document in HANDOFF.md.
