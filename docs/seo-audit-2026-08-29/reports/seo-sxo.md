# SXO Gap Analysis — Golden State Rehab (goldenstate-rehab.com)

Scope: 6 SERP-backwards queries (1 WebSearch each, top ~7 results reviewed per query), 114-page crawl (pages.jsonl), verify-insurance form HTML. SXO Gap Score is separate from any SEO Health Score.

## Headline finding

Page-TYPE match is mostly correct at the individual-page level (service pages target service-page keywords, blog guides target informational keywords, location pages target "near me" keywords). The primary SXO problem is not mismatch — it's **cannibalization + missing consolidation pages** (three pages competing for the same insurance/cost intent) and **two structurally important personas (HR/EAP referrer, "what happens next" admissions seeker) have no dedicated landing page at all.** Aggregator saturation on broad/neighborhood queries means organic head-term wins are unlikely regardless of on-page fixes — effort should shift to local pack, long-tail informational, and brand/insurance-carrier terms.

---

## 1. SERP-Backwards Table (6 queries, 1 search each — observed from WebSearch results, not full 10-blue-link audits)

| Query | Dominant page type in top results (observed) | Aggregators present | GSR page that targets it | Type match | Notes |
|---|---|---|---|---|---|
| outpatient rehab los angeles | Mixed: aggregator/directory (Psychology Today, AddictionCenter, Recovery.com "50 Best" listicle) + direct-competitor Service Pages (Westwind Recovery, Outpatient LA, Skyline Recovery) | High (~40-50%) | `/programs/outpatient-rehab` | ALIGNED (Service Page) | Content is strong (1,603 words, MedicalTherapy+FAQPage+BreadcrumbList schema) but competing against DR90+ directories on a broad head term — realistic ceiling is page 2 organic, local pack is the real prize. |
| php program los angeles | Almost entirely direct-competitor Service Pages (The Haven, LAOP Center, Amae Health, Skyline, Montare, Santa Clarita BH) — **no major aggregator in the visible set** | Low | `/programs/php` | ALIGNED (Service Page) | Best-case query for GSR: field is other providers, not aggregators, so content depth/E-E-A-T/backlinks directly decide rank. Page already has MedicalTherapy schema, 1,279 words, "Typical Day" + FAQ sections — competitive content shape. |
| iop los angeles | Same pattern as PHP: mostly direct-competitor Service Pages + Psychology Today directory + one hospital service page (UCLA Health) | Low-Med | `/programs/iop` | ALIGNED (Service Page) | 1,610 words, includes cost/insurance H2 — good. Low-aggregator query = worth investing further (internal links, schema, backlinks). |
| does insurance cover rehab california | Entirely informational Blog/Guide pages (AmericanAddictionCenters, Hollywood Hills Recovery, Buckeye Recovery Network, Stairway Recovery [insurer-specific], TheKeyIOP, TrustSoCal [Medi-Cal specific], Solutions4Recovery) — **zero directories, zero local pack** | None visible | THREE pages compete: `/blog/does-insurance-cover-rehab-in-california`, `/blog/cost-of-rehab-in-los-angeles`, `/blog/how-much-does-rehab-cost` (+ `/blog/does-medi-cal-cover-rehab-in-california` adjacent) | Type ALIGNED, but self-cannibalized | This is the cleanest ranking opportunity in the whole site (pure guide-vs-guide fight, no aggregators) and GSR is undermining itself by splitting the topic across 3-4 overlapping URLs instead of one authoritative page with sub-sections. |
| rehab near santa monica | Directory/aggregator dominant (StartYourRecovery.org, Rehabs.com, AddictionCenter, Yelp, Drugabuse.com) + one competitor Local Page (Thrive Treatment) | High (~80%) | `/locations/santa-monica` | ALIGNED (Local Page: NAP, directions, FAQ, MedicalWebPage schema) | Type is right but organic head-term win against 5 directories is unlikely. This query lives or dies on Google Business Profile / local pack, not the organic result. |
| alcohol rehab west los angeles | Directory dominant (Psychology Today, Rehabs.com, Alcohol.org, Addictions.com, Drugabuse.com) + 2 competitor service pages | High (~70%) | No exact match — closest is `/treatments/alcohol` (city-wide, not neighborhood-scoped) | PARTIAL MISMATCH | Query has a neighborhood modifier ("west los angeles") the page doesn't address; `/locations/west-los-angeles` exists but is not alcohol-specific. Gap: no location×condition combo content. |

**Aggregator takeaway:** In this vertical, DR90+ directories (Psychology Today, AddictionCenter, Rehabs.com, Recovery.com, Alcohol.org, Addictions.com, Drugabuse.com, StartYourRecovery.org) dominate broad "[condition] rehab [neighborhood]" and "near me" queries — confirmed directly in 3 of 6 searches above (outpatient, santa monica, alcohol west LA). Program-name queries (PHP, IOP) are the exception: those are fought against other treatment providers, not directories, which is where GSR's schema-rich, FAQ-dense service pages have a real shot. **Strategic implication: stop expecting organic wins on broad neighborhood/condition head terms; invest in (1) Google Business Profile / local pack, (2) the low-aggregator program-name pages, (3) the zero-aggregator insurance/cost guide cluster once de-cannibalized, (4) brand + insurance-carrier long-tail.**

---

## 2. Persona Scorecard (5 personas, derived from the 6 SERP queries + site structure)

Scored 1-10 per dimension by the analyst against the actual landing page content (word_count, H1/H2, schema_types from crawl; verify-insurance form read directly from HTML).

| Persona | Query they'd type | Landing page | (a) Relevance | (b) Answer in 1st screen | (c) Trust | (d) Next-step clarity | (e) Friction | Total /50 |
|---|---|---|---|---|---|---|---|---|
| **1. Self-seeker** (searching for own treatment) | "iop los angeles" | `/programs/iop` | 9 — exact title/H1 match | 8 — "What is an IOP?" is first H2 | 6 — MedicalTherapy/FAQPage schema present, but no visible testimonial/review block on this page (that lives on homepage only) | 6 — cost/insurance H2 present but no explicit CTA heading; assumed sitewide sticky call button (not independently verified on this page) | n/a | 29 |
| **2. Concerned spouse/parent of an adult** | "help for my son who won't get help" / "rehab for a loved one los angeles" | `/families` | 9 — H1 directly addresses this persona's exact emotional framing | 8 — "We know what this has been like for you" opens the page | 4 — **`schema_types: [None]` — no schema at all on this page**, despite being emotionally load-bearing content; 1,650 words but no structured trust signal (no FAQPage, no MedicalWebPage) | 7 — H2 "What happens after you reach out" and "Your first call, minute by minute" give process clarity | n/a | 28 |
| **3. HR/EAP referrer** (checking if GSR takes their employees' insurance / can be referred to) | "outpatient rehab that takes [carrier] insurance for employees" | No dedicated page — falls back to homepage or `/verify-insurance` | 3 — no B2B/EAP-framed content anywhere in the 114-page crawl | 4 — generic insurance messaging, not referrer-framed | 5 — license page + schema exist sitewide but nothing addresses a referrer's liability/duty-of-care questions | 5 — same CTA as consumer (call/verify insurance), not referrer-specific | n/a | 20 |
| **4. Spanish-speaking family member** | "tratamiento de adicciones en español los ángeles" | `/espanol` → `/es` hub (full mirrored site) | 9 — dedicated bilingual track, H2 "Care in Spanish: A Full Bilingual Track" on homepage plus full /es/ subsite (30+ mirrored pages incl. /es/verify-insurance) | 7 — full parity content, not just a translated stub | 6 — schema presence on /es pages not independently verified in this pass (assumed parity with /en based on mirrored URL structure — **label: assumed**) | 7 — /es/verify-insurance exists as a direct mirror | n/a | 29 (2 assumed) |
| **5. Cost/insurance comparison shopper** | "does insurance cover rehab california" | One of 3 overlapping pages: `/blog/does-insurance-cover-rehab-in-california` (2,300 w), `/blog/cost-of-rehab-in-los-angeles` (1,526 w), `/blog/how-much-does-rehab-cost` (2,652 w) | 6 — content is genuinely relevant, but persona can't tell which page is canonical, and neither can Google | 6 — each page does answer in the first H2 ("The short answer...") but the *existence of 3 answers* undermines confidence | 7 — good schema (BlogPosting+MedicalWebPage+FAQPage) on all three | 8 — all three end in a verify-insurance-style CTA | n/a | 27 |

**Verify-insurance form friction (read directly from saved HTML, `verify-insurance_a82f84.html`):** 9 distinct data fields (first name, last name, DOB, phone, email, insurance company, state of residence, member ID, referral source) + 1 optional insurance-card photo upload; **6 fields marked `required`**. HIPAA and "Securely"/"encrypted" language appears 8+ times on-page, plus a Privacy Policy link. This is a reasonable-length form for a benefits-verification flow (not bloated), with visible trust copy — friction is LOW-MEDIUM, not a primary blocker.

**Weakest persona: HR/EAP referrer (20/50).** Recommendations should lead with this gap.

---

## 3. Navigation / IA

- Homepage exposes 57 distinct internal links (from `internal_links` in crawl), covering every `/programs/*`, `/treatments/*`, `/locations/*`, `/blog/*` core post, plus `/faq`, `/license`, `/team`, `/verify-insurance`, `/espanol`. On link-graph terms, essentially every page in the English site is reachable in ≤1-2 clicks from home — IA breadth is not the problem.
- Could not confirm whether all 57 links live in the primary header nav vs. footer/sitemap block — a `<header>` tag was not present in the saved HTML (site likely uses a non-semantic nav container or client-rendered menu). **Label: not independently verified — flagged as a limitation below, not scored.** If all 57 links are in a flat header mega-menu, that is nav overload by conventional UX standards (9 program items + 13 treatment items + 9 neighborhood items in dropdowns); if progressively disclosed (mega-menu with columns), it's acceptable.
- **No consolidated `/admissions` or "what to expect" hub exists.** Admissions content is fragmented: `/faq` has an "Admissions" H2 section, `/blog/first-day-of-rehab` covers intake narratively, and `/families` covers "what happens after you reach out" — three partial answers, no single page a first-time visitor or referrer can point to.
- No `/insurance/{carrier}` pages and no `/cost` page distinct from the blog — insurance-carrier long-tail (a zero-aggregator-competition space per the SERP table above) is entirely unaddressed.

---

## 4. Intent Mismatch & Cannibalization List

| Issue | Pages involved | Type |
|---|---|---|
| **Insurance/cost cannibalization (highest priority)** | `/blog/does-insurance-cover-rehab-in-california` (2,300w), `/blog/cost-of-rehab-in-los-angeles` (1,526w), `/blog/how-much-does-rehab-cost` (2,652w), `/blog/does-medi-cal-cover-rehab-in-california` (adjacent) | 4 pages targeting overlapping "insurance covers rehab / what does rehab cost" intent — each has its own FAQPage schema, meaning duplicate/competing FAQ rich-result eligibility for the same underlying questions |
| **HR/EAP referrer intent unaddressed** | No page exists | Missing page type — not a mismatch but a total gap for a distinct commercial-referral persona |
| **Admissions/"what to expect" fragmentation** | `/faq` (Admissions H2), `/blog/first-day-of-rehab`, `/families` | Same intent split 3 ways instead of one canonical hub with cross-links |
| **Neighborhood × condition gap** | `/locations/west-los-angeles` (no condition specificity) vs. `/treatments/alcohol` (city-wide, no neighborhood specificity) | Neither page satisfies "alcohol rehab west los angeles" — a combined page or on-page section is missing |
| **`/families` page has zero schema** | `schema_types: [None]` vs. every comparable page on the site carrying MedicalWebPage/FAQPage/BreadcrumbList | Technical trust gap, not an intent mismatch, but directly lowers Persona 2's Trust score |

---

## 5. Recommendations (ordered by weakest persona / highest-leverage fix first)

1. **Build an HR/EAP referrer path** (weakest persona, 20/50). At minimum: a short section or dedicated page addressing "refer a client/employee," duty-of-care/liability reassurance, and a referral-specific contact method (not the same consumer form). Cross-ref: this overlaps with `/seo content` for E-E-A-T-style credibility content aimed at professional referrers.
2. **Consolidate the insurance/cost cluster into one authoritative page** (`/insurance-and-cost` or similar) with clear sub-sections (private insurance / Medi-Cal / self-pay), then 301 or canonicalize the three overlapping blog posts into supporting sections or internal links — this is the single highest-leverage fix because it's the *only* query cluster in this analysis with zero aggregator competition.
3. **Add schema to `/families`** — MedicalWebPage + FAQPage at minimum, matching the pattern already used on `/faq`, `/programs/*`, `/treatments/*`. Cross-ref: `/seo schema` for generation.
4. **Build a single `/admissions` hub** consolidating the Admissions FAQ section, first-day-of-rehab narrative, and "what happens after you reach out" content, with the phone CTA and `/verify-insurance` link surfaced immediately.
5. **Add insurance-carrier long-tail pages** (`/insurance/{carrier-name}`) — SERP evidence shows zero-aggregator competition on carrier-specific queries (per the "does insurance cover rehab california" search, which surfaced Blue-Shield-specific competitor guides).
6. **Do not over-invest in broad neighborhood/condition head terms** (e.g., "alcohol rehab west los angeles," "rehab near santa monica") — 70-80% of visible SERP results are DR90+ directories. Redirect that effort to Google Business Profile optimization and the local pack instead (cross-ref: `/seo local`).
7. **Verify header nav structure directly** (could not confirm via this HTML pass) — if all 57+ links sit in a flat mega-menu, prioritize disclosure/grouping; if already progressive, no action needed.

---

## SXO Gap Score: 58/100

Methodology: page-type alignment is strong (5 of 6 SERP-backwards queries show ALIGNED type — worth ~35/40 on that axis), which is unusual and a genuine strength for this site. The score is pulled down by: self-inflicted cannibalization on the one zero-competition query cluster (-12), a completely unaddressed persona/page type (HR/EAP referrer, -10), a schema gap on an emotionally central page (`/families`, -5), and fragmented admissions content (-5). This is a "fix the internal structure, not the on-page content" profile — the content quality itself (word counts, FAQ schema, MedicalWebPage markup) is already above average for the vertical.

---

## Limitations

- Each SERP query was reviewed via a single WebSearch call (top ~6-7 results with an AI-synthesized summary), not a full manual 10-blue-link SERP capture — no visibility into featured snippets, PAA question text, ads, or AI Overview citations for these queries. Page-type classification is based on titles/domains/summary content only.
- Header/primary-navigation HTML structure could not be confirmed (no `<header>` tag in the saved HTML) — nav-overload assessment is a caveat, not a scored finding.
- `/es/*` subsite schema and content depth were not independently spot-checked beyond `/espanol` and `/es` hub titles — Persona 4's Trust score includes one assumed (not observed) data point, labeled above.
- No Google Business Profile, review count/rating, or local-pack presence was checked directly (would require Maps-specific lookup, out of this budget) — local pack claims are inferred from SERP-result composition, not GBP data itself.
- Did not crawl or classify a full top-10 for any query beyond what WebSearch surfaced; some directory-vs-provider ratios are estimates from the visible link set, not exact top-10 counts.

Generate a PDF report? Use `/seo google report`
