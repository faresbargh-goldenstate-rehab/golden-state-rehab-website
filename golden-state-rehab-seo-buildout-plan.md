# Golden State Rehab — SEO Build-Out Master Plan

**Target site:** `goldenstate-rehab.com`
**Location:** 1964 Westwood Blvd, Ste 425, Los Angeles, CA 90025 (West LA / Westwood)
**Facility type:** Outpatient mental health + addiction treatment (PHP, IOP, Telehealth, Individual, Group)
**Status:** New facility, 0 reviews, single location, no detox in-house
**Goal:** Build the strongest possible SEO foundation for a single-location outpatient rehab in Los Angeles, then dominate informational and bottom-of-funnel rankings via deep topical authority and a substantial blog.

---

## How to use this document

Claude Code, you're building this out end-to-end. This is the spec. Treat it as authoritative. Where you see a gap or a better approach, raise it before deviating — but default to executing exactly what's described here.

**Stack assumptions (existing):**
- Next.js (App Router preferred — confirm against current repo)
- Tailwind CSS
- Framer Motion for tasteful interaction
- Vercel deployment
- GitHub for version control
- GoDaddy for domain (DNS already pointed)

**Operating principles for every page you build:**
1. **Real content, not templated mad-libs.** Every page must be genuinely distinct. If you find yourself copy-pasting paragraphs across pages with only the city or service name swapped, stop — that's a doorway page and Google penalizes it.
2. **GBP service-name alignment is sacred.** When a page maps to a Google Business Profile service, the H1 and `<title>` must use that exact service name. Don't get creative.
3. **Mention "Los Angeles" or the relevant neighborhood naturally 3–5 times per page.** Not stuffed. Not awkward. Real.
4. **Word count target: 1,200–2,000 words for service/treatment pages, 1,500–2,500 for blog posts, 1,000–1,500 for insurance/audience/geo pages.** Below 800 words = thin.
5. **Every page gets full schema markup.** See Schema section.
6. **Every page gets internal links to 3–5 related pages.** Use the linking matrix in this doc.
7. **Every page has a clear CTA above the fold and another at the bottom.** Either "Verify Insurance" or "Speak With Our Team" — both link to existing pages.
8. **No fake claims.** No "we treat veterans with specialized care" if the program doesn't exist. No "20 years of experience" if the facility opened in 2026. Stick to what's true.
9. **Medical accuracy.** All clinical content must be defensible. When in doubt, hedge with "many people experience" rather than declaratives. Cite SAMHSA, NIDA, NIH where relevant.
10. **No emoji. No filler. No "in today's fast-paced world" garbage.** Tone matches the existing site: warm, clinical, direct.

---

## Phase 0 — Pre-build audit (do this first, before any new pages)

### 0.1 Existing page depth audit
Crawl every existing page on `goldenstate-rehab.com`. For each one, extract:
- URL, H1, meta title, meta description, word count, internal links out, internal links in
- Any thin pages (<800 words on service/treatment pages) get flagged for expansion in Phase 1

Output: `audits/existing-pages-audit.md` with a table listing all 31 existing pages and their stats. Flag thin ones.

### 0.2 Technical SEO baseline
Check and fix:
- `robots.txt` exists and is sane (allow everything except admin/api routes)
- `sitemap.xml` exists, is dynamic (regenerates on build), includes every indexable page
- Canonical tags on every page
- `og:image`, `og:title`, `og:description`, `twitter:card` on every page
- Mobile viewport meta tag (already present, verify)
- HTTPS enforced, www vs non-www redirect chosen and consistent (currently `www.goldenstate-rehab.com` is canonical — keep it)
- Page speed: Lighthouse score 90+ on mobile for every existing page. Fix any that fail.
- Image optimization: every image is WebP, lazy-loaded, has alt text describing the actual image (not stuffed with keywords)
- Core Web Vitals: LCP <2.5s, CLS <0.1, INP <200ms
- 404 page is friendly and has navigation back to main sections
- No broken internal links (run a crawler, fix all)

Output: `audits/technical-seo-audit.md` with checklist and fixes applied.

### 0.3 Schema markup audit
Confirm or add JSON-LD schema to every page. Page-type-specific schema is in the Schema section below. Every page minimum:
- `MedicalBusiness` or `MedicalOrganization` (sitewide, in root layout)
- `BreadcrumbList`
- `WebPage`

### 0.4 Trust signal audit
The existing footer claims "DHCS Licensed" and "Joint Commission" — verify these are real before going live with prominent display. If real:
- Display DHCS license number prominently in footer (required by California law for all licensed facilities)
- Add Joint Commission gold seal to footer
- Add LegitScript seal IF certified (not required to launch, but flag for client to start application — see Out-of-Scope section)
- Add "Medically reviewed by [Clinical Director Name, credentials]" footer line on every clinical page
- Add EEAT-supporting clinical reviewer info to author bios (build out `/team` if it's not already deep)

---

## Phase 1 — Critical service gaps (Week 1)

### 1.1 New page: `/programs/detox`

**This is the single highest-priority new page.** "Detox" is one of the highest-volume rehab keywords in Los Angeles. Even though Golden State doesn't offer detox in-house (PHP/IOP only), this page captures that demand and converts it.

**H1:** `Drug & Alcohol Detox in Los Angeles`
**Title tag:** `Drug & Alcohol Detox in Los Angeles | Golden State Rehab`
**Meta description:** `Looking for detox in Los Angeles? Golden State Rehab partners with trusted detox facilities and provides PHP and IOP step-down care. Verify insurance today.`

**Page outline (1,500–2,000 words):**
1. **Hero**: Headline + subhead + dual CTA (Verify Insurance / Speak With Our Team)
2. **What is medical detox?** — Plain-English explanation. What happens, why it's medically supervised, how long it takes (typically 3–10 days depending on substance).
3. **Why detox matters before outpatient treatment** — Position Golden State's PHP/IOP as the next step after detox. Explain the continuum of care honestly.
4. **Substances that typically require medical detox** — Alcohol, opioids, benzodiazepines, stimulants. Brief description of withdrawal risks for each. Internal-link to the relevant `/treatments/` page for each.
5. **Our partner detox network** — Honest framing: "Golden State Rehab does not provide detox in-house. We partner with vetted, licensed detox facilities across Los Angeles County to ensure clients receive safe medical stabilization before stepping down into our PHP or IOP programs." List general partner-vetting criteria (DHCS-licensed, Joint Commission accredited, evidence-based protocols). Don't name specific partners unless client confirms.
6. **What happens after detox at Golden State** — How clients transition into PHP, then IOP, then outpatient/alumni. Internal-link to `/programs/php`, `/programs/iop`.
7. **Insurance and detox costs** — Most major insurance covers medical detox. Internal-link to `/verify-insurance`.
8. **FAQ section** — At minimum:
   - How long does detox take?
   - Can I detox at home?
   - Is detox dangerous?
   - Will my insurance cover detox?
   - What happens after detox?
9. **CTA bottom** — "Start your recovery the right way."

**Schema:** `MedicalProcedure` + `MedicalBusiness` + `FAQPage` + `BreadcrumbList`

**Internal links in:** Home, every `/treatments/` page, `/programs` index, blog detox posts
**Internal links out:** `/programs/php`, `/programs/iop`, `/treatments/alcohol`, `/treatments/opioid`, `/verify-insurance`

---

### 1.2 New page: `/programs/outpatient` (standard OP)

Below IOP in intensity. Many clients step down from IOP to standard outpatient before alumni. Captures "outpatient rehab Los Angeles" search volume.

**H1:** `Outpatient Rehab in Los Angeles`
**Title:** `Outpatient Rehab in Los Angeles | Golden State Rehab`
**Meta:** `Outpatient addiction and mental health treatment in West LA. Flexible scheduling for working professionals. Verify your insurance today.`

**Outline (1,200–1,500 words):**
1. Hero + dual CTA
2. What is standard outpatient treatment?
3. Who outpatient is right for (and who needs higher levels of care)
4. The Golden State outpatient experience — typical schedule (1–2 sessions/week), what sessions look like
5. How outpatient fits the continuum (detox → residential → PHP → IOP → OP → alumni)
6. Outpatient + work: balancing recovery with a career
7. Insurance + cost
8. FAQ
9. CTA

**Schema:** `MedicalProcedure` + `MedicalBusiness` + `FAQPage`

---

### 1.3 New page: `/levels-of-care`

Hub page that explains the continuum and links to every program. Refine has this and it's a strong topical authority page.

**H1:** `Levels of Care at Golden State Rehab`
**Outline (1,000–1,200 words):**
1. Hero
2. The continuum of care explained — visual or table showing intensity (hours/week) descending from Detox → Residential → PHP → IOP → OP → Aftercare
3. One short paragraph on each level, internal-linking to its dedicated page
4. How we determine the right level for you (clinical assessment, ASAM criteria mention)
5. Stepping up and stepping down — how clients move through care
6. CTA

**Schema:** `MedicalBusiness` + `BreadcrumbList`

---

### 1.4 Existing page expansion — flagged thin pages

For any existing page flagged in Phase 0.1 as <800 words, expand to 1,200+ words by adding:
- Detailed "What to expect" section
- Clinical approach / methodologies used
- Sample weekly schedule (where applicable)
- Outcomes / what success looks like
- FAQ (3–5 questions)
- Related programs/treatments cross-link block

Most likely candidates for expansion based on typical site builds: `/programs/alumni`, `/programs/medication-management`, `/treatments/sex-addiction`, `/treatments/complex-trauma`. Verify against actual audit.

---

## Phase 2 — Insurance silo (Week 2)

**This is the single highest-ROI category to build.** People searching "does Aetna cover rehab" or "Cigna PHP coverage" are very close to making a call. Refine has this for a reason.

### 2.1 Build `/insurance` index page

**H1:** `Insurance Coverage for Rehab in Los Angeles`
**Outline (1,000 words):**
1. Hero + "Verify Your Insurance" CTA (form embed if possible)
2. How insurance covers rehab — explain in-network vs out-of-network, parity laws, what's typically covered (PHP, IOP, OP, therapy, medication management)
3. What "verify insurance" means at Golden State — confidential, no obligation, fast turnaround
4. Grid of all 12 carrier logos linking to their individual pages
5. FAQ
6. CTA

### 2.2 Build 12 individual carrier pages

URL pattern: `/insurance/[carrier-slug]/`

**Carriers to build (from existing homepage):**
1. Aetna → `/insurance/aetna`
2. Anthem → `/insurance/anthem`
3. Blue Cross Blue Shield → `/insurance/blue-cross-blue-shield`
4. Cigna → `/insurance/cigna`
5. United Healthcare → `/insurance/united-healthcare`
6. Highmark → `/insurance/highmark`
7. CareFirst → `/insurance/carefirst`
8. EmblemHealth → `/insurance/emblemhealth`
9. GEHA → `/insurance/geha`
10. Excellus BCBS → `/insurance/excellus`
11. AmeriHealth → `/insurance/amerihealth`
12. MultiPlan → `/insurance/multiplan`

**Each carrier page (1,000–1,300 words):**

**H1 pattern:** `Does [Carrier] Cover Rehab in California? | [Carrier] Treatment Coverage`
**Title:** `[Carrier] Rehab Coverage in Los Angeles | Golden State Rehab`
**Meta:** `Golden State Rehab works with [Carrier] for addiction and mental health treatment in Los Angeles. Verify your [Carrier] benefits in minutes.`

**Outline:**
1. Hero with carrier logo + "Verify [Carrier] Benefits" CTA
2. Brief intro: who the carrier is, that GSR works with them
3. **What [Carrier] typically covers** — PHP, IOP, OP, therapy, medication management, dual diagnosis. Use language like "many [Carrier] plans cover..." not "all plans cover..." (legally accurate)
4. **In-network vs out-of-network with [Carrier]** — Explain difference. State GSR's status with that carrier (in-network / out-of-network / verify) — confirm with client before publishing
5. **Typical out-of-pocket costs** — Hedge: "Out-of-pocket costs depend on your specific plan, deductible, and copay. Most [Carrier] members pay between $X and $Y for PHP after deductible." Verify ranges with client.
6. **How to verify your [Carrier] benefits** — 3-step explanation, link to verify form
7. **Mental health parity laws** — Brief mention that federal law requires [Carrier] to cover mental health and substance use treatment at parity with medical coverage
8. **FAQ** (5 questions specific to that carrier where possible)
9. **CTA**

**Schema:** `FAQPage` + `MedicalBusiness` + `BreadcrumbList`

**Internal linking:** Every carrier page links to `/verify-insurance`, `/programs/php`, `/programs/iop`, and 2 sibling carrier pages.

---

## Phase 3 — "Who We Treat" silo (Week 3)

Refine's strongest non-obvious move. These pages target lower-competition keywords and capture qualified intent. Build only audiences GSR can credibly serve.

### 3.1 Build `/who-we-treat` index

**H1:** `Specialized Care for Every Population`
Hub page linking to every audience page with brief descriptions.

### 3.2 Audience pages to build

**Confirmed-build (broad relevance, GSR likely credibly serves):**
1. `/who-we-treat/professionals` — Working professionals balancing career + recovery (huge in West LA — entertainment, finance, tech, legal)
2. `/who-we-treat/young-adults` — 18–28, often parental involvement
3. `/who-we-treat/lgbtqia` — Affirming care, dual diagnosis common
4. `/who-we-treat/executives` — Higher-end variant of professionals; private therapy, scheduling flexibility — leverages telehealth program

**Verify with client before building:**
5. `/who-we-treat/first-responders` — Only if GSR has trauma-informed protocols
6. `/who-we-treat/veterans` — Only if GSR works with VA Community Care or Tricare
7. `/who-we-treat/students` — UCLA is 1.5 miles away; college student demographic is strong locally
8. `/who-we-treat/women` / `/who-we-treat/men` — Only if there's gender-specific programming

**Each audience page (1,000–1,400 words):**

**H1 pattern:** `[Audience] Addiction & Mental Health Treatment in Los Angeles`

**Outline:**
1. Hero with audience-specific imagery + dual CTA
2. **The unique challenges this population faces** — research-backed, empathetic, not stereotyped
3. **Why traditional rehab often fails this population** — gentle differentiator
4. **How Golden State adapts treatment for [audience]** — schedule flexibility, confidentiality, peer matching, specific clinical approaches
5. **Programs best suited for [audience]** — internal-link to PHP/IOP/Telehealth as appropriate
6. **What recovery looks like for [audience]** — outcomes, real expectations
7. **Confidentiality and privacy** (huge for executives, professionals, LGBTQIA+)
8. **FAQ** (3–5 audience-specific questions)
9. **CTA**

**Schema:** `MedicalBusiness` + `FAQPage`

---

## Phase 4 — Geo pages (Week 4)

GSR is in Westwood / West LA. Realistic catchment based on facility location and a 30-minute drive radius (LA traffic-adjusted):

**Tier 1 (build first — primary catchment):**
1. `/locations/west-los-angeles` — Home turf
2. `/locations/santa-monica` — High-income, high-need
3. `/locations/beverly-hills` — Affluent, status-conscious
4. `/locations/brentwood` — Adjacent affluent
5. `/locations/century-city` — Corporate professionals
6. `/locations/culver-city` — Tech / entertainment

**Tier 2 (build after Tier 1):**
7. `/locations/sherman-oaks` — Valley spillover
8. `/locations/encino` — Valley affluent
9. `/locations/marina-del-rey`
10. `/locations/pacific-palisades`

**Each geo page (1,200–1,500 words). DO NOT TEMPLATE THIS. Each one must be genuinely about that neighborhood.**

**H1 pattern:** `Rehab Near [Neighborhood], Los Angeles`
**Title:** `Drug & Alcohol Rehab Near [Neighborhood] | Golden State Rehab`
**Meta:** `Outpatient rehab serving [Neighborhood] residents. PHP, IOP, and telehealth options. [Drive time] from Golden State Rehab in Westwood.`

**Outline:**
1. Hero with neighborhood-specific imagery (use real, licensed photography or AI-generated at high quality — never stock cliches)
2. **About [Neighborhood] and recovery** — Genuine local context. What the community is like. Demographics. Common challenges (e.g., Beverly Hills: high-pressure entertainment industry, professional reputation concerns; Santa Monica: tech industry, beach culture and substance accessibility; Sherman Oaks: family demographics, valley professionals)
3. **Drive time and access** — Specific minutes from a known landmark in that neighborhood to GSR's Westwood address. Public transit options if relevant. Parking info.
4. **Why [Neighborhood] residents choose Golden State** — Honest reasons: proximity, confidentiality, telehealth option for those who can't commute, scheduling flexibility
5. **Programs available for [Neighborhood] residents** — Same programs as everyone else, but contextualized
6. **Local recovery resources** — Optional: AA/NA meeting locations in that neighborhood, sober living homes, alumni in the area
7. **What recovery looks like when you live in [Neighborhood]** — Specific lifestyle considerations
8. **FAQ** — 3 neighborhood-specific questions
9. **CTA**

**Schema:** `MedicalBusiness` with `areaServed` set to that neighborhood + `BreadcrumbList`

**CRITICAL — for each location, embed a Google Map showing GSR's location with a route line to that neighborhood. Use the Google Maps embed API.**

---

## Phase 5 — Service × city pages (Week 5–6, ONLY high-volume combos)

Only build these for combinations with proven search volume. Use Ahrefs / Semrush / Google Keyword Planner before building.

**Likely-volume combinations to build (verify before):**
1. `/locations/west-los-angeles/iop` → "West LA IOP" / "Westwood intensive outpatient"
2. `/locations/santa-monica/iop`
3. `/locations/beverly-hills/php`
4. `/locations/los-angeles/alcohol-rehab` → "Los Angeles alcohol rehab" (huge volume)
5. `/locations/los-angeles/drug-rehab` → "Los Angeles drug rehab" (huge volume)
6. `/locations/los-angeles/dual-diagnosis-treatment`

**Skip:** Anything with a 5-search-per-month estimated volume. Don't build "Calabasas polysubstance treatment" pages.

**Page structure:** Hybrid of geo page + service page, ~1,500 words. Genuinely combine neighborhood context with service detail. Heavy internal linking up to parent geo and parent service.

---

## Phase 6 — Blog (Week 6 onward, scaling to 150 posts over 6 months)

This is where the Claude Max plan does heavy lifting. Three content clusters, all internally linked back to the relevant service/treatment/insurance pages.

### 6.1 Cluster A: "How long does X stay in your system" (20 posts, weeks 6–8)

These rank fast and drive massive top-of-funnel informational traffic. Each post 1,500–2,000 words.

**Topics:**
1. How Long Does Alcohol Stay in Your System?
2. How Long Does Cocaine Stay in Your System?
3. How Long Does Meth Stay in Your System?
4. How Long Does Fentanyl Stay in Your System?
5. How Long Does Heroin Stay in Your System?
6. How Long Does Marijuana / THC Stay in Your System?
7. How Long Does Adderall Stay in Your System?
8. How Long Does Xanax Stay in Your System?
9. How Long Does Valium Stay in Your System?
10. How Long Does Ativan Stay in Your System?
11. How Long Does Klonopin Stay in Your System?
12. How Long Does Suboxone Stay in Your System?
13. How Long Does Methadone Stay in Your System?
14. How Long Does Vyvanse Stay in Your System?
15. How Long Does Ritalin Stay in Your System?
16. How Long Does MDMA / Ecstasy Stay in Your System?
17. How Long Does Ketamine Stay in Your System?
18. How Long Does LSD Stay in Your System?
19. How Long Does Kratom Stay in Your System?
20. How Long Does GHB Stay in Your System?

**Standard outline for each:**
1. Quick-answer paragraph (Google loves this for featured snippets — answer the question in the first 100 words)
2. Detection windows table: blood, urine, saliva, hair (with citations)
3. Factors affecting how long it stays (metabolism, dose, frequency, age, weight, hydration, liver/kidney function)
4. Signs and symptoms of use
5. Withdrawal timeline (briefly, link to dedicated withdrawal post)
6. Health risks of [substance] use
7. Treatment options at Golden State (internal link to relevant treatment page + relevant programs)
8. FAQ (3–5)

**Schema:** `Article` + `FAQPage` + `MedicalWebPage`

### 6.2 Cluster B: "Signs / Symptoms / Withdrawal" (20 posts, weeks 9–11)

1. Signs of Alcohol Addiction
2. Signs of Cocaine Addiction
3. Signs of Meth Addiction
4. Signs of Opioid Addiction
5. Signs of Fentanyl Addiction
6. Signs of Heroin Addiction
7. Signs of Prescription Drug Addiction
8. Signs of Sex Addiction
9. Alcohol Withdrawal Timeline
10. Opioid Withdrawal Timeline
11. Benzo Withdrawal Timeline
12. Cocaine Withdrawal Timeline
13. Meth Withdrawal Timeline
14. How to Tell if Someone Is on [Cocaine / Meth / Heroin / Fentanyl] (4 posts)
15. Signs of Depression (clinical)
16. Signs of Anxiety Disorder
17. PTSD Symptoms in Adults
18. Complex Trauma Signs in Adults

### 6.3 Cluster C: Insurance + cost + commercial intent (15 posts, weeks 12–14)

1. Does [Carrier] Cover Rehab? (1 post per carrier — variations of the silo pages, written for blog with broader framing)
2. How Much Does PHP Cost in Los Angeles?
3. How Much Does IOP Cost in Los Angeles?
4. How Much Does Outpatient Rehab Cost?
5. Free Rehab in Los Angeles: What Are Your Options?
6. Does Medicaid Cover Rehab in California?
7. Does Medicare Cover Mental Health Treatment?

### 6.4 Cluster D: Topical authority + family-of-addict content (45+ posts, weeks 15–24)

Lower competition, high empathy:
- "How to Get Someone Into Rehab"
- "What to Do If Your Spouse Is an Addict"
- "How to Stage an Intervention"
- "Helping a Loved One With Depression"
- "When to Get Professional Help for Anxiety"
- "Is Telehealth Therapy Effective?"
- "What is PHP and Is It Right for Me?"
- "PHP vs IOP: What's the Difference?"
- "What Happens in Group Therapy?"
- "What is CBT and How Does It Work?"
- "What is DBT?"
- "Trauma-Informed Care Explained"
- "Mental Health Parity Laws Explained"
- "How Long is Rehab? (PHP vs IOP vs OP)"
- ... (Claude Code: build out the full list to reach 50+ via topical research using Ahrefs / Answer The Public / People Also Ask)

### 6.5 Cluster E: Local SEO blog content (20 posts, ongoing)

- "Best Sober Living in West Los Angeles"
- "AA Meetings in Santa Monica"
- "Mental Health Resources in Beverly Hills"
- "Recovery Community in Los Angeles: A Guide"
- "Best Outpatient Rehab Programs in LA"
- ... etc.

### Blog requirements (universal)

- Every post has author bio with credentials (clinical reviewer for medical posts)
- Every post has "Medically reviewed by [Name, credentials] on [date]"
- Every post has 5–10 internal links to relevant service/treatment/insurance pages
- Every post has 2–3 outbound citations to authoritative sources (NIH, NIDA, SAMHSA, peer-reviewed journals)
- Every post has structured data: `Article` + `FAQPage` (where applicable) + `MedicalWebPage`
- Featured image, OG image, alt text on every image
- "Last updated" date displayed and updated when content is refreshed
- Reading time estimate
- Table of contents for posts >1,500 words (auto-generated from H2s)

---

## Schema markup specifications

### Sitewide (root layout)
```json
{
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "name": "Golden State Rehab",
  "url": "https://www.goldenstate-rehab.com",
  "logo": "https://www.goldenstate-rehab.com/images/logo-icon.png",
  "image": "https://www.goldenstate-rehab.com/images/facility/reception-lobby.jpg",
  "telephone": "+14242083120",
  "email": "admissions@goldenstate-rehab.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "1964 Westwood Blvd, Ste 425",
    "addressLocality": "Los Angeles",
    "addressRegion": "CA",
    "postalCode": "90025",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "34.0463",
    "longitude": "-118.4427"
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    "opens": "00:00",
    "closes": "23:59"
  },
  "priceRange": "$$$",
  "medicalSpecialty": ["Addiction Medicine", "Psychiatry", "Mental Health"],
  "availableService": [
    {"@type": "MedicalProcedure", "name": "Partial Hospitalization Program (PHP)"},
    {"@type": "MedicalProcedure", "name": "Intensive Outpatient Program (IOP)"},
    {"@type": "MedicalProcedure", "name": "Telehealth Therapy"},
    {"@type": "MedicalProcedure", "name": "Individual Therapy"},
    {"@type": "MedicalProcedure", "name": "Group Therapy"},
    {"@type": "MedicalProcedure", "name": "Medication Management"},
    {"@type": "MedicalProcedure", "name": "Holistic Therapies"},
    {"@type": "MedicalProcedure", "name": "Alumni Program"}
  ],
  "areaServed": [
    {"@type": "City", "name": "Los Angeles"},
    {"@type": "Place", "name": "West Los Angeles"},
    {"@type": "Place", "name": "Santa Monica"},
    {"@type": "Place", "name": "Beverly Hills"},
    {"@type": "Place", "name": "Brentwood"},
    {"@type": "Place", "name": "Century City"},
    {"@type": "Place", "name": "Culver City"}
  ],
  "sameAs": [
    "https://www.facebook.com/goldenstaterehab",
    "https://www.instagram.com/goldenstaterehab",
    "https://twitter.com/GoldenStateRehab",
    "https://www.linkedin.com/company/golden-state-rehab"
  ]
}
```

### Per-page schema additions
- **Service/program/treatment pages:** Add `MedicalProcedure` schema with detailed description, code (ICD-10 where applicable), how performed, expected prognosis
- **Blog posts:** `Article` + `MedicalWebPage` with `lastReviewed`, `reviewedBy` (medical reviewer with credentials)
- **FAQ blocks:** `FAQPage` schema for every FAQ section on every page
- **Geo pages:** `MedicalBusiness` with `areaServed` overridden to that specific neighborhood
- **Insurance pages:** `WebPage` + `Organization` (the carrier) — do not falsely claim partnership/affiliation
- **Every page:** `BreadcrumbList`

---

## Internal linking strategy

### Linking matrix (high-priority)

Every service/program page links to:
- Home
- `/programs` index
- 2 sibling programs (e.g., `/programs/php` links to `/programs/iop` and `/programs/outpatient`)
- 3 most-relevant `/treatments/` pages
- `/verify-insurance`
- Relevant `/insurance/[carrier]` pages (top 3)

Every treatment page links to:
- Home
- `/treatments` index
- 2 sibling treatments (e.g., `/treatments/alcohol` links to `/treatments/opioid` and `/treatments/dual-diagnosis`)
- 3 most-relevant `/programs/` pages (typically PHP, IOP, OP)
- `/verify-insurance`
- 2–3 relevant blog posts

Every insurance page links to:
- Home
- `/insurance` index
- 2 sibling carrier pages
- `/programs/php`, `/programs/iop`
- `/verify-insurance`

Every audience page links to:
- Home
- `/who-we-treat` index
- 2 sibling audience pages
- 2–3 most-relevant programs/treatments

Every geo page links to:
- Home
- `/locations` index
- 2 sibling geo pages
- All 8 program pages (because PHP/IOP/etc. are the actual services they'd want)

Every blog post links to:
- 5–10 contextually relevant pages (services, treatments, insurance, other blog posts)

### Footer link map (update existing footer)

Current footer is fine but expand to include:
- New "Locations" column linking to top 6 geo pages
- New "Insurance" column linking to top 6 carrier pages + index
- "Resources" column with Blog, FAQ, HTML Sitemap, Insurance Coverage, Levels of Care
- DHCS license number displayed
- Joint Commission seal
- "Medically reviewed by [Clinical Director]" attribution

### HTML sitemap page

Build `/sitemap` (HTML, separate from `/sitemap.xml`). Lists every page on the site organized by category. Refine has this; it helps crawlers and also serves as a fallback navigation.

---

## Sitewide additions

### New global components to build

1. **"Verify Insurance" inline form widget** — Drop-in component for use on any page. Fields: name, phone, email, insurance carrier (dropdown of all 12), policy number (optional), best time to call. Submits to existing CRM/intake (confirm endpoint with client).

2. **Sticky CTA bar (mobile)** — Persistent bottom bar with "Call Now" + "Verify Insurance" buttons. Already may exist — verify and standardize.

3. **Exit-intent modal (desktop)** — Non-obnoxious. Shows once per session. "Wait — speak with someone before you go" + phone link.

4. **Click-to-call tracking** — Implement call tracking (CallRail or similar) so client can attribute calls to specific pages. Confirm tracking number with client.

5. **Conversion event tracking** — GA4 + Google Tag Manager:
   - Phone clicks
   - Form submissions
   - "Verify Insurance" clicks
   - Scroll depth (50%, 75%, 100%)
   - Time on page (>2 min)

6. **FAQ accordion component** — Reusable, with proper FAQ schema injection.

7. **Trust signal bar** — Above fold or in header on every page: DHCS Licensed | Joint Commission | LegitScript (when certified) | Most Insurance Accepted

8. **Author/medical reviewer component** — For blog posts and clinical pages. Photo, name, credentials, "Medically reviewed on [date]"

9. **Related content block** — Bottom of every blog post and clinical page. Auto-generates 3 related links based on category/tags.

10. **Breadcrumbs** — Every page except home. Visual + schema.

---

## Phase 7 — Off-page foundation (parallel to Phase 1–6)

These aren't pages but are essential. Claude Code should generate the deliverables (lists, drafts, templates) for the human team to execute.

### 7.1 Citation building (week 1+)

Build a list of citation sites where GSR needs a profile. Generate: NAP (Name, Address, Phone) consistency check, profile copy templates, image package (logo, facility photos, team photos).

**Tier 1 (must have):**
- Google Business Profile (audit existing or create)
- Bing Places
- Apple Maps Connect
- Yelp
- Psychology Today (treatment center listing — paid, ~$30/mo, but huge for rehab)
- SAMHSA Treatment Locator (free, government, takes time)
- RehabCenter.net
- AddictionCenter.com
- DrugRehab.com
- BBB (Better Business Bureau)
- Healthgrades
- Vitals
- WebMD

**Tier 2:**
- Yellow Pages, Manta, Foursquare, MapQuest, Local.com, ChamberOfCommerce.com, BrownBook, Cylex, Hotfrog, Citysearch, MerchantCircle

**Tier 3 (industry-specific):**
- Sober.com, Soberlink directory, SheRecovers, In The Rooms, RecoverHQ, RehabReviews

Output: `off-page/citations-list.csv` with URL, profile status, NAP, notes.

### 7.2 Google Business Profile optimization plan (week 1)

Generate a GBP audit + optimization checklist:
- Verify primary category: "Addiction Treatment Center"
- Add secondary categories: "Mental Health Service", "Counselor", "Psychotherapist"
- Confirm hours: 24/7 admissions
- Add all services from website (must match website exactly)
- Upload 30+ high-quality photos (facility — use existing site photos), 5+ team photos, 5+ exterior/sign photos
- Write a 750-character business description
- Create 4 GBP Posts per month (Claude Code: generate 12 starter posts the team can schedule)
- Q&A: seed 10 common questions with owner answers
- Set up review request automation (see 7.3)

### 7.3 Review generation system (week 1)

This is the single highest-leverage thing for local pack ranking. Build:
- Review request email template (sent post-discharge)
- Review request SMS template (sent post-discharge, day 7 and day 30)
- Internal protocol doc for clinicians to verbally request reviews at discharge
- Review response templates: positive (1 template), neutral (1 template), negative (1 template)
- QR code linking directly to GBP review URL — print on discharge folders, business cards

**Goal: 25 GBP reviews in first 90 days. 100 within first year.**

### 7.4 Content reviewer / clinical credibility setup

Identify GSR's Clinical Director or Medical Director. Build:
- Author/reviewer bio page
- "Medically reviewed by" footer attribution on all clinical content
- LinkedIn profile optimization brief for the reviewer (so external links to their profile show credibility)

### 7.5 Backlink strategy starter (month 2+)

Generate a list of realistic backlink targets and outreach templates:
- Local LA business directories
- Recovery podcasts (guest appearances)
- Local news (KTLA, LAist, LA Times — pitch angles)
- Mental health awareness collaborations
- Guest posts on rehab/recovery blogs
- HARO / Qwoted responses (set up clinical director with profiles, generate weekly response cadence)
- Scholarship/community grant programs (rehab industry standard for backlinks — generate proposal)

---

## Out-of-scope (flag to client, don't execute)

These are higher-leverage than building 50 more pages but require client action, not Claude Code work:

1. **LegitScript certification** — Required for Google Ads in rehab vertical. ~$2,500/year, 3–6 months to certify. Start application immediately.
2. **Joint Commission accreditation** — If footer claim isn't real, start the process. ~$10K, 6–12 months.
3. **HIPAA compliance audit** — Especially for the Verify Insurance form and any client portals. Hire specialist.
4. **Telehealth licensure** — If serving clients across CA, confirm therapist licensure and platform compliance. May affect what telehealth page can claim.
5. **Insurance contracting** — Push to get in-network with as many of the 12 carriers as possible. In-network status changes the conversion rate dramatically.
6. **Google Ads strategy** — Requires LegitScript first. Once certified, build separate landing pages for ad campaigns (do NOT use SEO pages for paid traffic — different intent, different conversion design).

---

## Execution timeline summary

| Week | Phase | Deliverable |
|------|-------|-------------|
| 1 | Phase 0 | Audits + technical SEO baseline + 3 critical service pages (detox, outpatient, levels of care) + thin page expansion |
| 2 | Phase 2 | Insurance silo: index + 12 carrier pages |
| 3 | Phase 3 | Who We Treat: index + 4–6 audience pages |
| 4 | Phase 4 | Geo pages: 6 Tier 1 location pages |
| 5 | Phase 4 + 5 | 4 Tier 2 geo pages + 6 service-city hybrid pages |
| 6 | Phase 6 (Cluster A start) | Sitewide components + first 7 blog posts |
| 7–8 | Cluster A | Finish 20 "How long does X stay" posts |
| 9–11 | Cluster B | 20 signs/withdrawal posts |
| 12–14 | Cluster C | 15 insurance/cost posts |
| 15–24 | Cluster D + E | 65+ topical authority + local content posts |

**End state at week 24:** ~150–180 indexed pages, fully linked, schema-marked, mobile-fast, with a real off-page foundation underway.

---

## Final page count target

| Category | Pages | Status |
|---|---|---|
| Foundation (home, about, team, facility, story, contact, FAQ, verify, privacy, terms) | 10 | Existing |
| HTML sitemap | 1 | New |
| Programs (incl. detox, outpatient, levels of care) | 12 | 9 existing + 3 new |
| Treatments | 12 | Existing |
| Insurance (index + 12 carriers) | 13 | New |
| Who We Treat (index + 4–6 audiences) | 5–7 | New |
| Geo (index + 10 locations) | 11 | New |
| Service × city hybrids | 6 | New |
| Blog | 100–150 | New |
| **Total** | **170–220** | |

---

## Standards Claude Code must enforce on every page

1. ✅ H1 is unique sitewide and matches GBP service name where applicable
2. ✅ Title tag <60 characters, includes primary keyword + brand
3. ✅ Meta description 140–160 characters, includes CTA
4. ✅ One H1 per page, logical H2/H3 hierarchy
5. ✅ Word count meets target for page type
6. ✅ Primary keyword in H1, first paragraph, at least one H2, and 3–5 times in body (natural)
7. ✅ "Los Angeles" or relevant neighborhood mentioned 3–5 times
8. ✅ Internal links: 5–10 per page, contextually relevant
9. ✅ External citations: 2–3 per clinical/blog page, authoritative sources
10. ✅ Schema markup matches page type (validate with Google Rich Results Test)
11. ✅ Images: WebP, lazy-loaded, descriptive alt text, dimensions specified
12. ✅ CTAs: above fold + bottom of page, both functional
13. ✅ Mobile Lighthouse score 90+
14. ✅ Core Web Vitals: LCP <2.5s, CLS <0.1, INP <200ms
15. ✅ Breadcrumbs present and schema-marked
16. ✅ "Last updated" date for blog/clinical content
17. ✅ Medical reviewer attribution for clinical content
18. ✅ FAQ schema if FAQ section exists
19. ✅ No broken internal or external links
20. ✅ Canonical tag set
21. ✅ Open Graph + Twitter Card meta tags
22. ✅ No duplicate content with any other page on the site
23. ✅ Reading-level appropriate for general audience (Grade 8–10)
24. ✅ No factual claims that aren't defensible
25. ✅ No fake testimonials, fake stats, fake credentials

---

## Reporting

At the end of every phase, Claude Code generates:
- `reports/phase-[N]-completion.md` listing every page built, every link added, every schema validated, every issue encountered
- Lighthouse scores for every new page
- Internal link graph diff
- Updated sitemap.xml verification

---

**End of plan. Build it.**
