# Content Quality & E-E-A-T Audit — Golden State Rehab (goldenstate-rehab.com)
Scope: 114 crawled pages (69 EN, 45 ES). YMYL healthcare content — Google Sept 2025 QRG applied.

## Scores

**Content Quality Score: 73/100**
**On-Page SEO Score: 75/100**

### Rationale
- Content Quality is dragged down by inconsistent/absent explicit "medically reviewed by [date]" labeling on blog posts (present as boilerplate bio, not a QRG-style reviewer credit line), no visible last-updated dates on any of the 16 blog posts, and a cluster of unsubstantiated superlative claims ("best," success-rate framing) scattered across service pages. It is held up by genuinely differentiated, non-templated location/treatment/program content (see Finding 2), strong authoritative outbound citations (NIDA/ASAM/DHCS/Joint Commission on every sampled blog post), verified real Spanish translations, and zero thin-content risk outside two minor utility pages.
- On-Page is held up by clean schema coverage (MedicalOrganization/LocalBusiness + FAQPage + MedicalWebPage on nearly every page), no duplicate titles/meta descriptions, no title/meta length violations, and strong keyword differentiation across the 14 treatment and 9 program pages (no cannibalization detected within those sets). It is dragged down by missing hreflang on 11 English blog posts + /license, 123 images sitewide missing alt text, and a small set of near-orphan ES pages (1-3 inlinks).

---

## 1. E-E-A-T Findings

### 1a. Blog post bylines / reviewer / dates (16 EN blog posts assessed)

| Post | Word count | Author/bio block | Explicit "medically reviewed" label | Date signal in visible text | Authoritative citations |
|---|---|---|---|---|---|
| first-week-of-outpatient-rehab | 1,269 | Dr. Eric Chaghouri, MD bio at foot | No | No | 4 |
| cbt-vs-dbt-which-is-right | 1,189 | Dr. Chaghouri bio | No | No | 4 |
| terrified-to-ask-for-help | 1,002 | **None** | No | No | 2 |
| cost-of-rehab-in-los-angeles | 1,526 | Dr. Chaghouri bio | No | No | 4 |
| does-insurance-cover-rehab-in-california | 2,300 | Dr. Chaghouri bio | No | No | 4 |
| does-medi-cal-cover-rehab-in-california | 1,596 | Dr. Chaghouri bio | No | No | 4 |
| what-happens-after-rehab | 2,488 | **None** | No | No | 4 |
| can-family-come-to-rehab-visits | 2,556 | Dr. Chaghouri bio | No | No | 3 |
| find-rehab-near-me-los-angeles | 2,200 | Dr. Chaghouri bio | No | No | 4 |
| how-much-does-rehab-cost | 2,652 | Dr. Chaghouri bio | No | No | 4 |
| first-day-of-rehab | 2,527 | Dr. Chaghouri bio | No | No | 4 |
| do-i-need-rehab | 2,794 | Dr. Chaghouri bio | No | No | 4 |
| questions-to-ask-a-rehab-center | 2,621 | Dr. Chaghouri bio | No | No | 5 |
| can-i-work-while-in-rehab | 2,500 | Dr. Chaghouri bio | No | No | 2 |
| how-long-is-rehab | 2,390 | Dr. Chaghouri bio | No | No | 5 |
| inpatient-vs-outpatient-rehab | 2,867 | Dr. Chaghouri bio | No | No | 5 |

- **Severity: HIGH.** Zero of 16 blog posts show a visible "Last updated/reviewed on [date]" line — the single clearest, cheapest E-E-A-T/QRG signal for YMYL content is absent sitewide. This matters more than the byline itself: Google's raters are explicitly instructed to check for freshness signals on medical content.
  - **Affected URLs:** all 16 `/blog/*` posts listed above.
  - **Fix:** Add a visible `Medically reviewed by Dr. Eric Chaghouri, MD — Last updated [Month Year]` line at the top of every post (not just a bio card at the bottom), and mirror the date in `BlogPosting.dateModified` schema (not assessed directly in this pass — verify this field is populated and kept current, since script only checked visible text).

- **Severity: MEDIUM.** Two posts (`terrified-to-ask-for-help`, `what-happens-after-rehab`) have no author/reviewer bio block at all — the weakest E-E-A-T signal in the blog, on a first-person narrative post where authorship attribution matters most for "Experience" scoring.
  - **Affected URLs:** `/blog/terrified-to-ask-for-help`, `/blog/what-happens-after-rehab`
  - **Fix:** Add the standard Dr. Chaghouri (or a named clinical writer, if this is a client testimonial) bio block; if it's a first-person client story, add an editorial note ("as told to," reviewed by [clinician]) to preserve both experience and expertise signals.

- **Severity: MEDIUM (inconsistency, not absence).** `/programs/telehealth` (a service page, not a blog post) carries the text "Medically reviewed by Dr. Eri[c Chaghouri]..." — proving the site has the correct pattern in its component library — but this exact label was not found on any sampled blog post. This is a templating gap, not a content-writing gap.
  - **Fix:** Roll the `/programs/telehealth` reviewer-label component out to all 16 blog posts and all treatment/program pages that don't yet have it.

### 1b. Author/expert credentials, licensing, citations (positive findings)
- **Team page** (`/team`) confirmed to name **Dr. Eric Chaghouri, MD** as Medical Director, plus credential mentions for **LMFT** (×3 distinct clinicians). No LCSW/PhD credential strings were found in the team page text in this pass — verify the full team roster reflects the actual clinical staff mix (not assessed beyond string search).
- **26 of 114 pages** mention DHCS licensing and/or Joint Commission accreditation — a solid, distributed trust signal rather than one buried "About" mention.
- **Authoritative outbound citations** (NIDA, ASAM, DHCS, Joint Commission, SAMHSA, healthcare.gov) appear on every sampled blog post, ranging 2–5 per post — this is a genuine strength; most competitor addiction-treatment content cites nothing.
- **Spanish content verified as real translations**, not machine-placeholder or English leftover: EN-stopword hits in first 1,500 characters of 6 sampled `/es/` pages ranged 2–9 vs. 52–73 ES-stopword hits — confirms substantive Spanish-language content (e.g., `/es/verify-insurance`: 3 EN-stopwords vs. 60 ES-stopwords).

---

## 2. Thin Content & Near-Duplicate Template Risk

### 2a. Thin content (<500 words, excluding noindexed /amenity-map)
Only two pages fall under 500 words, both minor utility pages, not core content:
- `/license` — 464 words (**LOW severity**; a licensing/credentials page can reasonably be short, but consider adding the DHCS certificate number, Joint Commission certificate details, and renewal date as visible text for E-E-A-T credit rather than relying on a scanned image.)
- `/es/contact` — 472 words (**LOW severity**)

No location, treatment, program, or blog page is thin. This site does **not** have the common thin-content problem typical of local-SEO location-page rollouts.

### 2b. Location page similarity (11 pages) — NOT template-duplicate
Highest pairwise similarity found (5-word shingle Jaccard / difflib ratio):
1. West Los Angeles ↔ West Hollywood — 13.1% / 32.9%
2. Beverly Hills ↔ Culver City — 12.2% / 31.9%
3. Century City ↔ West Hollywood — 12.2% / 31.4%
4. Beverly Hills ↔ West Hollywood — 11.8% / 28.8%
5. Santa Monica ↔ Beverly Hills — 11.4% / 32.5%

**Severity: INFORMATIONAL (positive finding).** These are low-similarity scores — location pages are genuinely differentiated with unique local detail (distinct drive-time/landmark copy per city, confirmed in raw HTML spot-checks, e.g. "roughly four miles north of downtown," "on Westwood Blvd between Santa Monica," "about six miles east of downtown Santa Monica" — each city gets distinct wording, not a swapped-name template). No action required; this is the opposite of the typical local-SEO risk and should be preserved as new location pages are added.

### 2c. Treatment page similarity (14 pages) — NOT template-duplicate
Highest pairs: Opioid ↔ Cocaine (12.1%/22.8%), Alcohol ↔ Opioid (11.0%/13.9%), Depression ↔ Anxiety (10.9%/21.7%). All well below duplicate-content thresholds — each substance/condition page reads as distinct content, not a substance-name-swapped template.

### 2d. Program page similarity (9 pages) — one pair worth a look
Highest pairs: Group Therapy ↔ Individual Therapy (16.1%/29.6%), IOP ↔ Telehealth (16.0%/13.7%), PHP ↔ IOP (7.6%/3.1%).
- **Severity: LOW.** Group Therapy vs. Individual Therapy is the single highest overlap found sitewide (still moderate, not duplicate), and IOP vs. Telehealth also cluster — expected, since Telehealth is presented as a delivery-format variant of IOP. **Affected URLs:** `/programs/group-therapy`, `/programs/individual-therapy`, `/programs/iop`, `/programs/telehealth`. **Fix:** Not urgent, but ensure each page's H1/intro states its unique differentiator in the first 100 words (delivery format vs. treatment modality) to reinforce distinct search intent to both users and Google.

---

## 3. Readability (Flesch-Kincaid Grade Level; target 7–9 for this audience)

| Page | FK Grade | Long paragraphs (>120 words) |
|---|---|---|
| Homepage | 9.4 | 0 |
| /programs/php | 11.7 | 0 |
| /programs/iop | 10.8 | 0 |
| /treatments/alcohol | 12.7 | 0 |
| /verify-insurance | 8.3 | 0 |
| /locations/west-los-angeles | 10.5 | 0 |
| /locations/santa-monica | 10.6 | 0 |
| /blog/first-week-of-outpatient-rehab | 7.6 | 0 |
| /blog/cbt-vs-dbt-which-is-right | 9.4 | 0 |
| /blog/terrified-to-ask-for-help | 4.3 | 0 |

- **Severity: MEDIUM.** `/treatments/alcohol` (12.7), `/programs/php` (11.7), `/programs/iop` (10.8), and both sampled location pages (10.5–10.6) read at a college level — above the 7–9 target for an audience that includes people in crisis, under stress, or reading in a second language. **Affected URLs:** `/treatments/alcohol` (and likely the other 13 treatment pages given similar register), `/programs/php`, `/programs/iop`, `/locations/west-los-angeles`, `/locations/santa-monica`.
  - **Fix:** Shorten sentences and reduce clinical/insurance jargon density (e.g., "levels of care," "single-case agreement") on first read, or add a plain-language summary box near the top.
- **Positive finding:** `/blog/terrified-to-ask-for-help` scores 4.3 — a first-person, short-sentence narrative that reads naturally and is the most accessible page sampled. This is a good model for the rest of the blog.
- No wall-of-text paragraphs found anywhere sampled (0 paragraphs over 120 words on every page checked) — good structural hygiene for scannability and AI-citation extractability.

---

## 4. Keyword Targeting / Cannibalization

- Within-category comparison (14 treatment pages, 9 program pages) shows **no duplicate primary-keyword targeting** — each treatment page targets a distinct substance/condition (alcohol, opioid, fentanyl, meth, cocaine, prescription drugs, sex addiction, depression, anxiety, PTSD, complex trauma, dual diagnosis, CBT, DBT) and each program page targets a distinct service (PHP, IOP, outpatient rehab, telehealth, individual therapy, group therapy, medication management, holistic therapies, alumni). This is a real strength; most sites in this vertical duplicate "outpatient rehab Los Angeles" across five pages.
- **Severity: LOW — monitor, not urgent.** `/treatments/cbt`, `/treatments/dbt`, and the blog post `/blog/cbt-vs-dbt-which-is-right` all target CBT/DBT terminology. Intents differ (transactional treatment pages vs. informational comparison post), so this is not true cannibalization, but internal links between the three should use descriptive anchor text so Google doesn't conflate them.
- **Not assessed:** a full pairwise title/H1 matrix across all 114 pages (including core pages like /about, /mental-health, /families vs. treatment/program pages). The category-level checks above cover the highest-risk cannibalization surface (treatment vs. treatment, program vs. program); a full-site check is recommended as a follow-up if budget allows.

---

## 5. AI-Writing Signals (per Sept 2025 QRG + AI-writing-detection reference)

### Homepage — flagged, moderate risk
- **Em dash density: 12 em dashes / 1,610 words = 7.45 per 1,000 words** — well above the "more than one per page" caution threshold in the reference guide. Quoted examples pulled directly from the page:
  - *"Read more — open all six reviews"*
  - *"A counselor picks up — not a call center."*
  - *"If we're a fit, an assessment — often the same day."*
  - *"Coverage varies by plan — verification is free and confidential."*
  - *"your own home and community while you heal — see how outpatient drug rehab..."*
  - *"And recovery doesn't end at discharge — you stay part of our alumni community..."*
  - *"distrust any success rate you're quoted — and we answer all fifteen about ourselves"*
- **7 triplet-list constructions** detected (e.g., "PHP, IOP, outpatient, and telehealth") — a known AI structural tell when overused, though in this case the triplets are genuinely enumerating four distinct programs, so this is a lower-confidence flag than the em-dash finding.
- **Severity: MEDIUM.** **Affected URL:** `/` (homepage). **Fix:** Convert at least 8 of the 12 em dashes to commas, periods, or parentheses per the reference guide's substitution table; this is the single most "AI-detectable" surface-level pattern on the site.

### Blog posts (5 sampled) — clean, reads human
- `/blog/first-week-of-outpatient-rehab`, `/blog/cbt-vs-dbt-which-is-right`, `/blog/terrified-to-ask-for-help`, `/blog/cost-of-rehab-in-los-angeles`, `/blog/does-insurance-cover-rehab-in-california`: **0 em dashes each.** Only mild phrase hits: "at the end of the day," "not just," "comprehensive" (1 each on `first-week-of-outpatient-rehab`); "not just" (1, on the insurance post). No "in today's fast-paced world," "delve," "navigate," "unlock," or "tapestry" found on any sampled post.
- **Severity: LOW.** This is a genuine strength — the blog content does not read as templated AI output, and burstiness (sentence-length variation implied by the very different FK grades across posts, 4.3 to 9.4) is present. **Fix (minor):** swap "at the end of the day" and "not just" for more direct phrasing per the reference guide, but this is cosmetic, not a quality risk.

---

## 6. Compliance: Claims, Superlatives, Substantiation (YMYL + LegitScript relevance)

- **"100+ Recoveries"** (homepage H1 trust signal, confirmed intentional per site owner) — appears alongside a 5-star Google rating callout and a "distrust any success rate you're quoted" line elsewhere on the same page. **Severity: MEDIUM (substantiation gap, not a removal recommendation).** The number itself is not defined (recoveries over what time period? by what definition — program completion, sobriety at discharge, self-report?) and is not linked to a methodology note or outcomes page. **Fix:** Add a one-line footnote or tooltip ("aggregate program completions since [year]; see our outcomes methodology") — this both protects against a false-advertising read under FTC/LegitScript standards and turns the number into a citable, structured fact for AI answer engines (see Section 7 recommendation below).
- **Superlative "best" usage** appears on 12+ pages, mostly in low-risk contexts ("best practices," "works best when," "best flexibility [insurance]," "best for [use case]") — these are comparative/descriptive, not absolute marketing superlatives, and are **LOW severity**. Two instances are closer to marketing claims and worth softening:
  - `/programs`: *"Why Golden State is the best place for programs."*
  - `/treatments`: *"Why Golden State is the best for treatments."*
  - **Fix:** Reframe as specific, substantiated differentiators (e.g., "same-day assessment, DHCS-licensed, Joint Commission accredited") rather than an unqualified "best" claim, which is exactly the pattern Google's YMYL guidance and LegitScript flag as unsubstantiated.
- **"Success rate" / "guarantee" language**: the site actively **discourages** false claims rather than making them — `/blog/questions-to-ask-a-rehab-center` explicitly lists *"Guaranteed cures or specific success rate promises"* as a red flag consumers should watch for at other facilities, and the homepage tells users to *"distrust any success rate you're quoted."* **Positive finding:** this is a trust-building, compliance-forward pattern, not a violation — the site is not making the claims it's warning users about.
- No outcome guarantees, "#1," or "cure" claims made about Golden State Rehab's own services were found in this pass (the "cure" regex hits were near-uniformly the unrelated word "secure"/"securely," a false-positive pattern from the search term, not actual cure claims).

---

## 7. CTA / Conversion Prominence (phone + insurance verification in first 300 words)

| Page | Phone in first 300w | Insurance mention in first 300w |
|---|---|---|
| Homepage | Yes | Yes |
| /programs/php | Yes | No |
| /programs/iop | Yes | Yes |
| /treatments/alcohol | Yes | No |
| /verify-insurance | Yes | Yes |

- **Severity: LOW.** Phone number is prominent above the fold on every sampled page (likely sitewide, via header). **Fix:** `/programs/php` and `/treatments/alcohol` lack an insurance-verification mention in the first 300 words — add a short "most major insurance accepted — verify in 2 minutes" line near the top of these and likely the remaining treatment pages, since insurance anxiety is a primary conversion blocker in this vertical.

---

## 8. Content Gaps (vs. what an LA outpatient center should cover)

Body-mention counts (site-search, EN pages only) vs. presence in title/URL/H1:

| Topic | Mentioned in body (page count) | In any title/URL/H1 |
|---|---|---|
| Detox | 33 | No |
| Medication-assisted treatment | 13 | No |
| Suboxone | 7 | No |
| Anthem / Aetna / Cigna / Blue Shield | 18 / 18 / 18 / 17 | No |
| Kaiser | 1 | No |
| Medi-Cal | 6 | Yes (blog post) |
| Veterans | 0 | No |
| LGBTQ+ | 1 | No |
| Professionals/executives | 20 / 3 | No |
| Sober living / aftercare | 16 / 14 | Yes (aftercare, in a blog title) |
| Cost / pricing | 36 / 0 | Yes ("cost," in blog titles) |

- **Severity: MEDIUM.** **Detox** is discussed in body copy on 33 pages (likely as a referral/hand-off explanation, since this is an outpatient-only center) but has **no dedicated page** — a high-search-volume, high-intent term ("detox near me," "medical detox LA") is being served only incidentally. **Fix:** Add a `/treatments/detox` or `/programs/detox-referrals` page that explicitly states the referral pathway (if GSR doesn't offer on-site detox) — this closes both a content gap and an E-E-A-T transparency gap (users need to know before they call).
- **Severity: MEDIUM.** **MAT/Suboxone** mentioned on 13/7 pages respectively but no dedicated landing page — same fix pattern as detox.
- **Severity: MEDIUM.** **Insurance carrier pages** (Anthem, Aetna, Cigna, Blue Shield each mentioned on 17-18 pages — almost certainly a shared insurance-logos list, not carrier-specific content) have zero dedicated landing pages despite being mentioned constantly. High-intent queries like "does Aetna cover rehab in Los Angeles" are being left to the general `/verify-insurance` page. **Fix:** Build 4-5 carrier-specific pages (Anthem, Aetna, Cigna, Blue Shield, Kaiser) each with carrier-specific coverage detail — the `/blog/does-medi-cal-cover-rehab-in-california` post proves the team already has the pattern for this.
- **Severity: LOW-MEDIUM.** **Veterans** (0 mentions) and **LGBTQ+** (1 mention) are essentially uncovered despite being common differentiators/affinity searches in this vertical.
- **Severity: LOW.** No dedicated pricing/cost page exists as a page (only blog posts about cost) — acceptable for a transparency-sensitive vertical where itemized pricing is rarely public, but a "typical cost after insurance" page could capture "how much does rehab cost in LA" commercial-investigation traffic more directly than a blog post.
- **Not assessed:** whether Spanish-language blog coverage exists beyond the two ES blog posts referenced in the crawl summary (`/es/blog/does-medi-cal-cover-rehab-in-california`, `/es/blog/cbt-vs-dbt-which-is-right`, `/es/blog/cost-of-rehab-in-los-angeles`) — full ES blog parity vs. the 16 EN posts was not counted in this pass; recommend a direct count as a follow-up.

---

## 9. On-Page Technical Notes (from crawl summary, cross-referenced)
- **Severity: MEDIUM.** Hreflang missing on 11 EN blog posts + `/license` — these pages have an ES counterpart elsewhere in the site graph but don't declare the relationship, risking duplicate-content/wrong-language serving in search. **Affected URLs:** `/blog/what-happens-after-rehab`, `/blog/can-family-come-to-rehab-visits`, `/blog/find-rehab-near-me-los-angeles`, `/blog/how-much-does-rehab-cost`, `/blog/first-day-of-rehab`, `/blog/do-i-need-rehab`, `/blog/questions-to-ask-a-rehab-center`, `/blog/can-i-work-while-in-rehab`, `/blog/how-long-is-rehab`, `/blog/inpatient-vs-outpatient-rehab`, `/license`. **Fix:** add `hreflang` alternates matching the pattern already used correctly elsewhere (e.g., `/faq`).
- **Severity: LOW-MEDIUM.** 123 images sitewide missing alt text, concentrated on utility/legal pages and the homepage (7 missing). **Fix:** prioritize homepage images first (highest-traffic page), then legal/logo icons sitewide.
- **Severity: LOW.** Several ES pages have only 1-3 internal inlinks (`/es/about`, `/es/faq`, `/es/our-story`, `/es/treatments/cocaine`, `/es/treatments/prescription-drugs`, `/es/treatments/sex-addiction`, `/es/treatments/meth`) — near-orphan status within the Spanish sub-site. **Fix:** add these to the ES nav/footer or a Spanish sitemap page linked from `/es/`.

---

## Summary of Not-Assessed Items (budget-limited, flag for follow-up)
- Full pairwise title/H1 cannibalization matrix across all 114 pages (only within-category checked).
- Direct inspection of `BlogPosting.dateModified`/`datePublished` schema fields (only visible on-page text was checked for date signals).
- Full team-page credential roster beyond string matches for MD/LMFT/LCSW/PhD.
- ES blog post count/parity vs. 16 EN posts.
- AI-writing scan was limited to 5 of 16 blog posts + homepage (representative sample, not full set).
