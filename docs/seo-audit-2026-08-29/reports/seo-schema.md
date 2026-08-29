# Schema.org / Rich Results Audit — Golden State Rehab
Site: https://www.goldenstate-rehab.com/ · 114 pages crawled, all JSON-LD parsed without errors.
Validator: `/private/tmp/claude-501/-Users-kkareem_1-Documents-Claude-COde-Web-Design-arm-website-golden-state-rehab-2/41f75a02-655f-419b-a70b-6d1b99e6ec18/scratchpad/audit/validate_schema.py` (single-pass check of every schema block against Google Rich Results + schema.org requirements).

## Schema Score: 81 / 100

The core entity graph (MedicalOrganization/LocalBusiness, BreadcrumbList, MedicalWebPage, BlogPosting) is unusually clean and consistent for a 114-page site — no deprecated types, no relative URLs, no non-ISO dates, breadcrumbs 100% sequential and self-referential, and both prior Semrush findings are confirmed **fixed** (see below). Points were deducted for two pages with broken markup, an absent Physician entity for the heavily-cited medical director, thin `sameAs` coverage, and a suspicious `foundingDate`.

---

## 1. Prior Semrush findings — status

| Finding (Aug 20 2026 Semrush audit) | Status |
|---|---|
| Invalid `reviewedBy` on Article/BlogPosting | **Fixed.** `reviewedBy` no longer appears on any `BlogPosting` node. It correctly lives only on `MedicalWebPage` (a valid health-extension property), present on all 70 `MedicalWebPage` instances, always a `Person` with `jobTitle` and `affiliation`. |
| Invalid `inLanguage` on LocalBusiness/Organization | **Fixed.** Scanned all 112 `MedicalOrganization`/`LocalBusiness` blocks — zero have `inLanguage`. It is correctly scoped to `WebPage` only (e.g. `es/verify-insurance` → `WebPage.inLanguage: "es"`), which is valid placement per schema.org. |

Both regressions should be considered closed. Recommend re-running Semrush next crawl to confirm the flags clear.

---

## 2. Validation Table

| Type | Pages | Errors | Warnings |
|---|---|---|---|
| MedicalOrganization + LocalBusiness | 112 | 4 (2 pages missing `image`, `priceRange`) | logo type ok; `sameAs` thin (2 URLs) sitewide; `geo`/`openingHoursSpecification` missing on the same 2 broken pages |
| BreadcrumbList | 111 | 0 | — |
| WebSite | 106 | 0 | No `SearchAction` anywhere — correct, since there is no sitewide search box; nothing to fix |
| FAQPage | 72 | 0 (all Q/A text non-empty; 3-page spot-check vs. rendered HTML = 100% match) | Google restricts FAQ rich results to gov/health-authority domains since Aug 2023 — this is a commercial rehab clinic, not a .gov or public-health-authority domain, so **no FAQ rich snippet eligibility on any of these 72 pages**. Existing markup is Info-priority, not Critical — it still feeds AI/LLM answer-engine citations (ChatGPT, Perplexity, Google AI Overviews), so keep it for GEO value but don't expect SERP snippets. |
| MedicalWebPage | 70 | 0 | All have `lastReviewed` + `reviewedBy` (Person, Dr. Eric Chaghouri MD, jobTitle present) |
| MedicalCondition / MedicalTherapy | 24 / 21 | 0 | None are thin stubs — all carry `name` + `description`. Appropriate use per Google's health-content guidance (informational, not diagnostic/treatment-claim language in the JSON itself) |
| BlogPosting | 22 | 0 (headline, image, dates, author, publisher, mainEntityOfPage all present; all dates ISO 8601; all headlines ≤110 chars) | 7 pages: `author` Person missing `url` (5 ES posts by Dr. Chaghouri + 2 alum-story posts) — breaks the author→/team link Google/LLMs use for E-E-A-T |
| MedicalClinic | 2 | 0 | `/locations` + `/es/locations` carry a second, legitimate branch entity (`#clinic`, name "Golden State Rehab — Westwood") distinct from the sitewide `#organization` `@id` — this is a valid Organization/Place branch pattern, not a duplicate/divergence |
| ItemList | 1 | 0 | `/locations` only — appropriate |
| Deprecated types (HowTo, SpecialAnnouncement, CourseInfo, EstimatedSalary, LearningVideo) | 0 pages | — | None found sitewide — clean |

---

## 3. Consistency check — Organization/LocalBusiness block

- **112 of 114 pages** carry byte-identical core fields: name "Golden State Rehab", phone `+1-424-208-3120`, address "1964 Westwood Blvd, Ste 425, Los Angeles, CA 90025", `@id` = `https://www.goldenstate-rehab.com/#organization`. No ES-page divergence found.
- **2 pages diverge structurally**: `/families` and `/es/families` wrap their schema in a bare `@context`+`@graph` array instead of the flat sibling-`<script>` pattern used on the other 112 pages, **and** the embedded Organization node inside that graph is missing `image` and `priceRange` — the only real schema errors found sitewide.
  - Fix: replace the `/families` and `/es/families` JSON-LD with the same flat structure + full Organization/LocalBusiness block used elsewhere (copy from `index.html`).
- `@id` references (`#organization`, `#website`, `#clinic`) resolve correctly within each page's graph — no dangling references found.
- Homepage "Organization x2" (per the task brief) is **not a duplicate**: the single `@type: ["MedicalOrganization","LocalBusiness"]` block is counted twice because it carries two types in one array; `WebSite.publisher` is a `@id` reference to that same node, not a second literal entity. No fix needed.
- `foundingDate: "2026"` on the homepage Organization matches this crawl's current year exactly — worth a manual check that this isn't a placeholder/template value left over from a copy-paste (a rehab clinic with DHCS license + Joint Commission accreditation is very unlikely to have founded the same year as the audit).

---

## 4. Author / reviewedBy entity coverage

- `reviewedBy` sitewide (70 `MedicalWebPage` instances) is **always** `Dr. Eric Chaghouri, MD`, `Person`, `jobTitle: "Medical Director"`, `url: https://www.goldenstate-rehab.com/team`, `affiliation` → `#organization`. Well-formed.
- `author` on BlogPosting: Dr. Chaghouri (10 EN posts, all with `url`), Vindell Brunson (5), Ari Labowitz LMFT (3), Viola Sulahian AMFT (1), Juanita Casillas RADT (1), plus 2 alum-story bylines ("A Golden State Rehab Alum" / "Un exalumno de Golden State Rehab").
- **Gap**: the 5 ES-locale BlogPosting authors credited to Dr. Chaghouri, plus both alum bylines, are missing `author.url`. Fix by adding `"url": "https://www.goldenstate-rehab.com/es/team"` (ES pages) or a stable alumni-story anchor.
- **No `Physician` entity exists anywhere in the crawl.** Dr. Eric Chaghouri, MD is referenced as a plain `Person` on 80+ pages (70 `reviewedBy` + 10 `author`) despite being the medical director of a licensed clinic — `Physician` (a `MedicalOrganization`/`LocalBusiness` subtype of `Person`... actually `Physician` extends `MedicalBusiness`) is the correct, more specific type for E-E-A-T and could be linked as `medicalSpecialty`-bearing entity from the Organization via `employee`/`founder`. This is the single highest-value missing entity given how often he's cited.

---

## 5. sameAs / social coverage — correction to assumption

Contrary to the brief's assumption that Instagram/LinkedIn/X profiles are present, the crawl shows **`sameAs` contains only 2 URLs sitewide**: the Google Maps CID link and the Yelp business page. No Facebook, Instagram, LinkedIn, X, Psychology Today, NPI registry, or SAMHSA treatment-locator links were found in any schema block. This is a genuine, unclaimed opportunity — add every verified profile.

---

## 6. Missing opportunities (ranked)

1. **Physician entity** for Dr. Eric Chaghouri, MD — biggest gap (see §4).
2. **sameAs expansion** — Facebook, Instagram, LinkedIn, Psychology Today profile, NPI number (as `identifier`), SAMHSA locator listing if claimed.
3. **Fix `/families` + `/es/families`** — restore `image`/`priceRange`, normalize to the flat JSON-LD pattern used elsewhere.
4. **Author `url` on 7 BlogPosting nodes** (5 ES + 2 alum).
5. **Service/MedicalProcedure schema for PHP/IOP** — not currently present as discrete `MedicalProcedure`/`Service` entities; `MedicalTherapy` (21 pages) covers therapy modalities but the program-level offerings (PHP, IOP, detox referral) aren't independently marked up. Consider `Service` nodes with `provider` → `#organization` and `areaServed`.
5. **VideoObject** — none found; only add if video content exists on-page (don't fabricate).
6. **Confirm `foundingDate`** is not a placeholder.

## 7. What NOT to add

- **No `AggregateRating`/`Review` on the LocalBusiness** — correctly absent already. Do not add one sourced from the homepage's reviews overlay unless it's a genuine feed from a verifiable third-party aggregator (Google/Yelp API); Google disregards/penalizes self-published ratings on your own `LocalBusiness` markup.
- **No `FAQPage` additions on new commercial pages** — Google will not grant rich results (gov/health-authority restriction, Aug 2023); the 72 existing instances are fine to keep for AI-citation value but this is an Info-priority item, not a fix.
- **No `HowTo`** — deprecated Sept 2023, none found, keep it that way.

---

## 8. Ready-to-paste JSON-LD

### (a) BlogPosting with proper Person author + reviewer (fixes the 7-page `author.url` gap and gives every post a full E-E-A-T chain)

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "@id": "https://www.goldenstate-rehab.com/es/blog/cbt-vs-dbt-which-is-right#article",
  "headline": "CBT vs. DBT: ¿Cuál Terapia Es Adecuada Para Mí?",
  "image": "https://www.goldenstate-rehab.com/images/heroes/REPLACE-WITH-ACTUAL-IMAGE.jpg",
  "datePublished": "2026-05-30",
  "dateModified": "2026-08-19",
  "inLanguage": "es",
  "author": {
    "@type": "Person",
    "@id": "https://www.goldenstate-rehab.com/team#dr-chaghouri",
    "name": "Dr. Eric Chaghouri, MD",
    "jobTitle": "Medical Director",
    "url": "https://www.goldenstate-rehab.com/es/team",
    "worksFor": { "@id": "https://www.goldenstate-rehab.com/#organization" }
  },
  "publisher": { "@id": "https://www.goldenstate-rehab.com/#organization" },
  "mainEntityOfPage": { "@id": "https://www.goldenstate-rehab.com/es/blog/cbt-vs-dbt-which-is-right#medicalwebpage" },
  "isPartOf": { "@id": "https://www.goldenstate-rehab.com/#website" },
  "articleSection": "Treatment 101"
}
```
Note: reuse the same `@id` (`https://www.goldenstate-rehab.com/team#dr-chaghouri`) for the author node on every EN and ES page so all 80+ references resolve to one canonical Person entity instead of 80 duplicate literals.

### (b) Physician entity (new — highest-value missing entity)

```json
{
  "@context": "https://schema.org",
  "@type": "Physician",
  "@id": "https://www.goldenstate-rehab.com/team#dr-chaghouri",
  "name": "Dr. Eric Chaghouri, MD",
  "url": "https://www.goldenstate-rehab.com/team",
  "jobTitle": "Medical Director",
  "honorificSuffix": "MD",
  "medicalSpecialty": ["Psychiatry", "Addiction Medicine"],
  "worksFor": { "@id": "https://www.goldenstate-rehab.com/#organization" },
  "affiliation": { "@id": "https://www.goldenstate-rehab.com/#organization" },
  "image": "https://www.goldenstate-rehab.com/images/team/REPLACE-WITH-ACTUAL-HEADSHOT.jpg",
  "sameAs": [
    "https://www.goldenstate-rehab.com/team",
    "REPLACE-WITH-NPI-REGISTRY-URL-IF-AVAILABLE",
    "REPLACE-WITH-PSYCHOLOGY-TODAY-PROFILE-IF-CLAIMED"
  ]
}
```
Place this once on `/team` (as the primary definition) and reference it by `@id` everywhere else `author`/`reviewedBy` currently repeats the literal `Person` object — do not duplicate the full object on all 80+ pages.

### (c) LocalBusiness block — the current markup is correct; the only fix needed is restoring it verbatim on the 2 broken pages

```json
{
  "@context": "https://schema.org",
  "@type": ["MedicalOrganization", "LocalBusiness"],
  "@id": "https://www.goldenstate-rehab.com/#organization",
  "name": "Golden State Rehab",
  "url": "https://www.goldenstate-rehab.com/",
  "logo": "https://www.goldenstate-rehab.com/images/logo-icon.png",
  "image": "https://www.goldenstate-rehab.com/images/logo-icon.png",
  "description": "Golden State Rehab is a DHCS-licensed addiction and mental health treatment center in Los Angeles offering PHP, IOP, telehealth, and individual therapy. Most major insurance accepted.",
  "telephone": "+1-424-208-3120",
  "email": "admissions@goldenstate-rehab.com",
  "priceRange": "$$",
  "currenciesAccepted": "USD",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "1964 Westwood Blvd, Ste 425",
    "addressLocality": "Los Angeles",
    "addressRegion": "CA",
    "postalCode": "90025",
    "addressCountry": "US"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": 34.0447, "longitude": -118.4308 },
  "hasMap": "https://www.google.com/maps?cid=15086981718348312167",
  "areaServed": [
    { "@type": "City", "name": "Los Angeles" },
    { "@type": "City", "name": "West Los Angeles" },
    { "@type": "City", "name": "Santa Monica" },
    { "@type": "City", "name": "Beverly Hills" },
    { "@type": "City", "name": "Brentwood" },
    { "@type": "City", "name": "Culver City" },
    { "@type": "City", "name": "Westwood" }
  ],
  "openingHoursSpecification": [
    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"], "opens": "09:00", "closes": "18:00" }
  ],
  "contactPoint": [
    { "@type": "ContactPoint", "contactType": "admissions", "telephone": "+1-424-208-3120", "availableLanguage": ["English","Spanish"], "hoursAvailable": { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"], "opens": "00:00", "closes": "23:59" } }
  ],
  "medicalSpecialty": ["Psychiatric"],
  "knowsAbout": ["Addiction Medicine","Cognitive Behavioral Therapy","Dialectical Behavior Therapy","Addiction Treatment","Dual Diagnosis","Anxiety","Depression","PTSD","Substance Use Disorder"],
  "identifier": [{ "@type": "PropertyValue", "name": "DHCS License Number", "value": "191643AP" }],
  "hasCredential": [
    { "@type": "EducationalOccupationalCredential", "name": "DHCS Licensed", "credentialCategory": "license", "identifier": "191643AP", "recognizedBy": { "@type": "Organization", "name": "California Department of Health Care Services" } },
    { "@type": "EducationalOccupationalCredential", "name": "Joint Commission Accredited", "credentialCategory": "accreditation", "url": "https://www.jointcommission.org/", "recognizedBy": { "@type": "Organization", "name": "The Joint Commission", "url": "https://www.jointcommission.org/" } }
  ],
  "sameAs": [
    "https://www.google.com/maps?cid=15086981718348312167",
    "https://www.yelp.com/biz/golden-state-rehab-llc-los-angeles",
    "ADD-FACEBOOK-URL",
    "ADD-INSTAGRAM-URL",
    "ADD-LINKEDIN-COMPANY-URL"
  ]
}
```
(Add `image`/`priceRange` — currently missing — to the `/families` and `/es/families` copies; verify `foundingDate` before republishing.)
