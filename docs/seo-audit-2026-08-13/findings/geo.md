# GEO / AI-Search-Readiness Audit — goldenstate-rehab.com
Date: 2026-08-13. Scope: live site (`https://www.goldenstate-rehab.com`) via direct curl requests + the pre-crawled mirror at `<scratchpad>/crawl/`.

---

## 1. AI Crawler Access — OBSERVED

**robots.txt** (live, `curl -s https://www.goldenstate-rehab.com/robots.txt`):
```
User-agent: *
Allow: /

Sitemap: https://www.goldenstate-rehab.com/sitemap.xml
```
There are **no bot-specific rules** — only a single wildcard `Allow: /`. Every crawler, including all AI crawlers, inherits this blanket allow.

| Crawler | robots.txt | Live UA-spoofed request | Status |
|---|---|---|---|
| GPTBot | Allowed (wildcard) | `curl -A "GPTBot/1.0"` → `200`, 52065 bytes | Allowed |
| ChatGPT-User | Allowed (wildcard) | `200`, 52065 bytes | Allowed |
| OAI-SearchBot | Allowed (wildcard) | `200`, 52065 bytes | Allowed |
| ClaudeBot | Allowed (wildcard) | `200`, 52065 bytes | Allowed |
| Claude-User | Allowed (wildcard) | `200`, 52065 bytes | Allowed |
| PerplexityBot | Allowed (wildcard) | `200`, 52065 bytes | Allowed |
| Google-Extended | Allowed (wildcard) | `200`, 52065 bytes | Allowed |
| CCBot | Allowed (wildcard) | `200`, 52065 bytes | Allowed |
| Bingbot | Allowed (wildcard) | `200`, 52065 bytes | Allowed |
| Applebot-Extended | Allowed (wildcard) | `200`, 52065 bytes | Allowed |

**Cloudflare bot-management interference:** Not detected. Site is served via Cloudflare (`server: cloudflare`, `cf-ray` present). Compared full response headers for `GPTBot/1.0` vs. a real Chrome desktop UA on `/` — both returned `cf-cache-status: DYNAMIC`, no `cf-mitigated`, no challenge page, identical byte size to the baseline homepage fetch. No sign of a JS challenge, managed-challenge, or bot-fight-mode block for the tested UAs. (Observed via simple UA-string swap only — did not test from a non-residential/datacenter IP range, which is the axis Cloudflare bot scoring actually weighs most heavily, so silent scoring-based throttling from real crawler IPs cannot be fully ruled out with this method — **inferred limitation, not a finding**.)

**Severity: none — this dimension is healthy.** No fix needed. Optional/low-priority: the brief's "optional block" list (CCBot, anthropic-ai, cohere-ai — training-only crawlers) is currently also allowed via the wildcard. This is a deliberate-or-not tradeoff, not a defect; leaving them open does not hurt citation eligibility and CCBot/anthropic-ai are training crawlers, not the ones that drive live citations. No action required unless the business wants to opt out of training use specifically.

---

## 2. llms.txt — OBSERVED, PRESENT AND WELL-FORMED

`curl -s -o /dev/null -w "%{http_code}" https://www.goldenstate-rehab.com/llms.txt` → **HTTP 200**. `content-type: text/plain; charset=utf-8`, 6,455 bytes.

Contents (verified via live fetch): starts with an H1 (`# Golden State Rehab`) and a blockquote summary that packs entity, license number, location, service list, and phone into one paragraph — this is exactly the llms.txt spec pattern. Sections present: About, Locations (11 neighborhood pages), Treatments, Programs, Resources (incl. the cost-of-rehab blog post), full Español mirror, Contact block with phone/address/medical director/license.

`llms-full.txt` → **HTTP 404 — does not exist.** Not required by spec but commonly paired with llms.txt for pages that want to expose full page text (not just links) to LLMs that don't crawl.

**RSL 1.0 licensing:** Not found. No `License:` line, no separate `/license.xml` or RSL block referenced in llms.txt or in page `<head>` (checked homepage, llms.txt, about, and blog post `<head>` sections — no `rel="license"` link tag, no RSL namespace). This is an emerging/optional standard, not yet a graded requirement in most GEO frameworks — flagging as **Low** priority.

**Severity: Low.** llms.txt is a genuine asset here (most SMB local-service sites don't have one). Fix (effort: low, ~1 hr): add `llms-full.txt` with flattened plain-text versions of the highest-value pages (FAQ answers, PHP/IOP program pages, cost blog post) so LLMs without live-crawl access get full context, not just a link list.

---

## 3. Technical Accessibility — OBSERVED

Homepage (`index.html`, 863 lines) is fully server-rendered static HTML. No CSR framework markers found (`grep -o -E 'id="root"|id="app"|__NEXT_DATA__|ng-version|data-reactroot' index.html` → no matches). Stripped of `<script>`/`<style>`, the homepage has ~1,307 words of visible text with zero JS execution required — an AI crawler that does not execute JavaScript (most don't) sees the full content. This is the single biggest structural advantage this site has for GEO.

**Severity: none — healthy.**

---

## 4. Entity Clarity & Structured Data — OBSERVED

Homepage carries two JSON-LD blocks:
1. `MedicalOrganization` + `LocalBusiness` (`@id: .../#organization`) — name, telephone (`+1-424-208-3120`), full `PostalAddress` (1964 Westwood Blvd, Ste 425, Los Angeles, CA 90025), `GeoCoordinates`, `areaServed` (7 named cities/neighborhoods), `medicalSpecialty`, `knowsAbout` (8 clinical topics), `identifier`/`hasCredential` for DHCS License #191643AP and LegitScript certification, `sameAs`.
2. `WebSite` referencing the organization.

This is strong, unambiguous entity data — brand, service, and location are machine-readable, not just in prose.

**Data-quality issue found (Medium severity):** `"foundingDate": "2026"` — the same year as the crawl date. This reads as a placeholder/default value rather than a real founding year and could undercut an "established/experienced" signal that LLMs use for E-E-A-T-style trust scoring. **Observed** in the raw JSON-LD, not verified against the actual business incorporation date (no independent source checked). Fix: replace with the real founding year, or remove the field entirely if the true year is unknown/sensitive — a wrong-but-present date is worse than an absent one.

**sameAs is thin (Medium severity):** Only two entries — LegitScript and Yelp. No Google Business Profile URL, no Wikipedia, no Facebook/Instagram/LinkedIn, no YouTube, no Psychology Today or Healthgrades provider profile. This directly weakens the "Brand Mention Correlation" dimension (see §5).

Blog posts carry richer schema than the homepage: `cost-of-rehab-in-los-angeles.html` has **5 JSON-LD blocks** — `BlogPosting` (headline, `datePublished`/`dateModified` both `2026-06-05`, `author: {"@type":"Person","name":"Dr. Eric Chaghouri, MD"}`), `BreadcrumbList`, the organization block, `WebSite`, and a **`FAQPage`** block with 4 self-contained Q&As (48–67 words each, direct-answer style, e.g. "How much does outpatient rehab cost in Los Angeles? Before insurance, IOP typically ranges about $3,000-$7,000 per month and PHP about $7,000-$12,000 per month..."). This is exactly the citable-answer-block pattern AI answer engines favor.

The dedicated `/faq` page has an even larger `FAQPage` schema block: **29 question/answer pairs**, answers averaging ~55 words, grouped under topical headers (Admissions, Insurance & Cost, Programs & Treatment, Aftercare & Alumni). Spot-checked that the first question's text (`"How do I get started at Golden State Rehab"`) appears twice in the raw HTML (`grep -c` → 2), confirming the FAQ content is rendered in visible HTML, not schema-only/cloaked — important because AI crawlers and answer engines are known to discount or distrust schema-only FAQ content that isn't visible to users.

**Severity: none for FAQ implementation (strength); Medium for foundingDate and thin sameAs.**

---

## 5. Brand Mention / Off-Site Citation Signals — OBSERVED (on-site evidence only)

Searched all 102 crawled HTML pages for links to Facebook, Instagram, LinkedIn, YouTube, Twitter/X, TikTok, Reddit, and Wikipedia domains (`grep -l -E 'facebook\.com|instagram\.com|linkedin\.com|youtube\.com|twitter\.com|x\.com/|tiktok\.com|reddit\.com|wikipedia\.org' *.html`).

**Finding: the site has zero owned social-media profile links anywhere.** The only matches were on the 6 English blog posts (and their 6 Spanish mirrors), and all of them resolved to **social share widgets**, not brand profiles:
```
blog__cbt-vs-dbt-which-is-right.html:
  href="https://www.facebook.com/sharer/sharer.php?u=https://www.goldenstate-rehab.com/blog/cbt-vs-dbt-which-is-right"
  href="https://twitter.com/intent/tweet?url=...&text=CBT vs. DBT..."
  href="https://www.linkedin.com/sharing/share-offsite/?url=..."
```
These are "share this post" buttons that construct a URL pointing back at the article — they are not links to a Golden State Rehab Facebook/LinkedIn/Twitter page. **There is no discoverable YouTube, Instagram, TikTok, Reddit, or Wikipedia presence linked from the site**, and no Google Business Profile URL in the schema `sameAs`.

Given the brief's stated correlation data — YouTube mentions (~0.737, strongest), Reddit presence (high), Wikipedia entity (high) — this is the largest gap on the "Authority & Brand Signals" dimension. It is also the gap least fixable from the codebase alone (it requires the business to actually create/claim these off-site profiles, not just link to them), but linking to the ones that *do* exist (Google Business Profile, LegitScript, Yelp are the only currently-claimed ones per `sameAs`) is a pure code fix.

Outbound citations to third-party authorities **are** present and are a genuine strength: `SAMHSA.gov` (national helpline, medications page, NSDUH data, trauma resource — 6+ links across treatment/program pages), `findtreatment.gov` (linked from all 11 location pages), and `LegitScript` (linked from about/families/es pages). These lend the content real citation backing, which matters for the "specific statistics with source attribution" citability signal.

**Severity: High** (largest single gap for the Authority & Brand Signals dimension, 20% weight). Fix (effort: medium — mostly business-side, not dev-side): (1) claim/link Google Business Profile in `sameAs` and footer — low dev effort, high signal value, should already exist for a physical healthcare location; (2) if any YouTube, Instagram, or provider-directory (Psychology Today, Healthgrades, RehabPath) profiles already exist off-site, add them to `sameAs` and footer immediately — this is a same-day dev fix once URLs are confirmed; (3) longer-term, a YouTube presence (facility tour, clinician intro videos) is the single highest-correlation lever per the brief's data, but is a content-production effort, not a code fix.

---

## 6. Passage-Level Citability — PARTIALLY ASSESSED

**Homepage headings** (`grep -o -E "<h[1-3][^>]*>.*?</h[1-3]>" index.html`): H1 is "Los Angeles Addiction Treatment Center — 100+ Recoveries" (strong entity+proof-point H1). Subsequent H2/H3s are declarative labels — "Why Golden State Rehab," "Meet the Team Behind Your Care," "Care in Spanish: A Full Bilingual Track" — **none are question-phrased**. This is a missed structural signal per the brief's "question-based H2/H3 headings" criterion; declarative section labels are harder for an LLM to map directly onto a user's natural-language query than a heading like "What treatment programs does Golden State Rehab offer?" would be.

**FAQ content** (both `/faq` and the cost blog post): confirmed strong — see §4. 48–67 word self-contained answers, visible in HTML, backed by `FAQPage` schema. This is the site's best citability asset and is **directly reusable** as the template for improving other pages' headings.

**Not assessed (ran out of budget before completing — do not treat as findings, only as open items):**
- Full passage-length scoring (134–167 word optimal range) of body paragraphs on `/programs/php`, `/programs/iop`, `/treatments/alcohol` specifically — files exist in the crawl (`programs__php.html`, `programs__iop.html`, `treatments__alcohol.html`) but were not opened/scored in this session.
- Heading structure (H2/H3 question-phrasing, definition-sentence presence) on those three pages and on `/faq`'s section-level headers beyond the H1.
- Stat/number density with source attribution on the cost blog post body text (schema-level FAQ stats were checked; in-body prose stats were not).
- List/table structure inventory across the key pages.

---

## 7. Which Queries This Site Could Plausibly Be Cited For — NOT ASSESSED

This requires synthesizing the citability/entity findings into query-level predictions and was not reached in this session. Flagging as an open item rather than guessing without the underlying page-by-page evidence from §6.

---

## 8. DataForSEO / Live Platform Checks — NOT ASSESSED

No DataForSEO MCP tools were invoked in this session (availability not checked). Platform-specific scores (Google AIO, ChatGPT, Perplexity, Bing Copilot) were not produced — would require either those tools or live prompted queries against each platform, neither of which was done here.

---

## Summary Table (evidence-backed items only)

| Item | Status | Evidence |
|---|---|---|
| robots.txt blocks any AI crawler | **No — all allowed** | `curl https://www.goldenstate-rehab.com/robots.txt` → wildcard `Allow: /` |
| Live request as GPTBot/ClaudeBot/PerplexityBot/etc. | **200 OK, unblocked** | UA-spoofed curl, 10 crawlers tested, all `200`, 52065 bytes |
| Cloudflare bot-management blocking AI crawlers | **Not detected** | Header comparison, GPTBot UA vs. Chrome UA — identical `cf-cache-status`, no challenge |
| `/llms.txt` | **Present, HTTP 200** | Live fetch, 6455 bytes, well-structured |
| `/llms-full.txt` | **Missing, HTTP 404** | Live fetch |
| RSL 1.0 licensing | **Not found** | No license tag in `<head>` or llms.txt |
| Homepage is SSR (not CSR) | **Confirmed SSR** | No React/Next/Angular markers in raw HTML; 1307 words visible with JS stripped |
| `MedicalOrganization`/`LocalBusiness` schema | **Present, rich** | Full NAP, geo, license, credentials in JSON-LD |
| `foundingDate` in schema | **"2026" — likely placeholder** | Raw JSON-LD on homepage and blog post |
| `sameAs` entries | **Only 2: LegitScript, Yelp** | Raw JSON-LD |
| Owned social profile links (FB/IG/LinkedIn/YouTube/Reddit/Wikipedia) | **None found anywhere on site** | `grep -l` across all 102 pages; only matches were share-widget URLs |
| FAQ content visible in HTML (not schema-only) | **Confirmed visible** | Question text found twice (schema + rendered HTML) |
| FAQPage schema | **29 Q&As on /faq; 4 on cost blog post** | JSON-LD extraction |
| BlogPosting author/date | **Present** | `author: Dr. Eric Chaghouri, MD`, `datePublished`/`dateModified: 2026-06-05` |
| Outbound authority citations | **Present** (SAMHSA, findtreatment.gov, LegitScript) | `grep` across crawl |

---

## Prioritized Fix List

1. **[High]** Add real off-site profile links to `sameAs` and site footer — Google Business Profile at minimum, plus any existing YouTube/Instagram/directory profiles. Effort: low (dev) once URLs are confirmed by the business; the YouTube-presence build-out itself is medium/high effort (content production).
2. **[Medium]** Fix `foundingDate: "2026"` in the `MedicalOrganization` JSON-LD (homepage + all pages reusing the org block) — replace with true founding year or remove the field. Effort: low, single find/replace across the schema template.
3. **[Medium]** Convert declarative H2/H3 headings on the homepage (and likely other non-FAQ pages, per §6 "not assessed") to question-phrased headings where natural, mirroring the FAQ page's Q&A pattern. Effort: low/medium, copy-editing pass.
4. **[Low]** Add `llms-full.txt` with flattened full-text versions of the FAQ, cost blog post, and PHP/IOP program pages. Effort: low.
5. **[Low]** Complete the passage-length/heading/stat-density audit of `/programs/php`, `/programs/iop`, `/treatments/alcohol` (listed as not-assessed in §6) to confirm whether the FAQ page's strong citability pattern is or isn't replicated on the core service pages — this determines whether fix #3 needs to extend site-wide.

---

## Not Assessed (explicitly, for follow-up)

- §6: body-paragraph word-length scoring, heading/definition-sentence audit, and stat-density check on `/programs/php`, `/programs/iop`, `/treatments/alcohol`, and full `/faq` section headers beyond the top-level H1.
- §7: query-level prediction of which AI-search queries the site could realistically be cited for.
- §8: DataForSEO MCP tools (availability unchecked) and any live-platform (ChatGPT, Perplexity, Google AIO, Bing Copilot) citation testing.
- Cloudflare bot scoring from actual crawler-owned IP ranges (only UA-string swap was tested, from this session's own IP).
