# JSON-LD Structured Data Audit — Golden State Rehab (live mirror, 102 pages)

Source: pre-crawled mirror at `scratchpad/crawl/*.html` (102 files, all HTTP 200 per `_index.json`).
Method: regex-extracted every `<script type="application/ld+json">` block from all 102 files, parsed each with a strict JSON parser, then walked the resulting trees to collect `@type` occurrences and specific property values. All figures below are **observed** directly from the crawled HTML unless labeled otherwise.

---

## 1. Parse validation — PASS

- **465** JSON-LD `<script>` blocks found across the 102 pages.
- **0 blocks failed to parse.** Every block is syntactically valid JSON.
- Every one of the 102 crawled pages has at least one JSON-LD block (no page is missing structured data entirely).

*(observed: ran `json.loads()` against all 465 extracted blocks; zero `JSONDecodeError` exceptions raised.)*

---

## 2. Type breakdown (occurrences = node instances, may include nested repeats; "pages" = distinct HTML files containing that type)

| @type | Occurrences | Pages |
|---|---|---|
| City (inside `areaServed`) | 803 | 100 |
| Question | 355 | 59 |
| Answer | 355 | 59 |
| ListItem | 279 | 100 |
| EducationalOccupationalCredential | 208 | 99 |
| MedicalSignOrSymptom | 142 | 24 |
| MedicalTherapy | 121 | 45 |
| Organization | 110 | 99 |
| PostalAddress | 103 | 102 |
| MedicalOrganization | 101 | 101 |
| LocalBusiness | 101 | 101 |
| GeoCoordinates | 101 | 100 |
| OpeningHoursSpecification | 101 | 100 |
| BreadcrumbList | 100 | 100 |
| PropertyValue | 99 | 99 |
| WebSite | 95 | 95 |
| Person | 80 | 59 |
| MedicalCondition | 80 | 28 |
| FAQPage | 59 | 59 |
| MedicalSpecialty (as string value, see §4) | 46 | 25 |
| MedicalWebPage | 43 | 43 |
| BlogPosting | 24 | 14 |
| WebPage | 17 | 17 |
| AboutPage | 3 | 3 |
| Blog | 2 | 2 |
| MedicalClinic | 2 | 2 |
| ContactPage | 1 | 1 |
| ItemList | 1 | 1 |

Notable absence: **`Service` never appears as an `@type` anywhere across all 102 pages** — see §7.

---

## 3. openingHoursSpecification — CRITICAL: site-wide false 24/7 claim

Every page that carries an `openingHoursSpecification` block (101 of 102 pages) uses the **identical, single variant**, quoted verbatim as parsed:

```json
{
  "@type": "OpeningHoursSpecification",
  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  "opens": "00:00",
  "closes": "23:59"
}
```

Source example (`index.html`, homepage Organization/LocalBusiness block):
```json
"openingHoursSpecification": [
  {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    "opens": "00:00",
    "closes": "23:59"
  }
]
```

**Finding:** the site declares itself open **00:00–23:59, all seven days of the week** — i.e. a literal 24/7/365 claim — on 101 of 102 pages. This is an outpatient PHP/IOP mental-health and addiction treatment clinic (per the site's own `description` field: "Golden State Rehab is a DHCS-licensed addiction and mental health treatment center in Los Angeles offering PHP, IOP, telehealth, and individual therapy"). Outpatient PHP/IOP programs do not run 24 hours a day; this reads as either a copy-paste placeholder that was never replaced with real hours, or a knowingly false claim.

- **Severity: Critical**
- **Evidence:** identical block present verbatim (checked via byte-for-byte JSON key sort) on 101/102 crawled pages, e.g. `index.html`, `about.html`, `blog.html`, `contact.html`, and all treatment/program pages examined.
- **Label:** observed.
- **Impact:** (a) misleads users/AI assistants and any rich-result surface that reads `openingHoursSpecification`; (b) if this schema value is inconsistent with the business's actual Google Business Profile hours, it creates a schema-vs-GBP mismatch that can suppress local pack visibility or trigger a GBP quality review; (c) for a YMYL healthcare business, a false "always open" signal is a trust/E-E-A-T liability if a prospective patient calls at 3 a.m. expecting live staff.
- **Fix:** replace with the clinic's actual real operating hours (e.g. per-day `opens`/`closes` values matching the front desk/PHP-IOP schedule as shown on Google Business Profile), or drop `openingHoursSpecification` entirely if hours vary by program and can't be represented as a single set. Do not represent a healthcare provider as open around the clock unless it genuinely runs a 24-hour staffed facility (this appears to be an outpatient center, not residential/detox).

---

## 4. medicalSpecialty — CRITICAL: invalid enumeration value

All 101 pages carrying the Organization/LocalBusiness block use the identical `medicalSpecialty` value:

```json
"medicalSpecialty": ["Psychiatric", "Addiction Medicine"]
```
(source: `index.html`, and confirmed identical string list across all 101 occurrences.)

**Validation against schema.org's live `MedicalSpecialty` enumeration** (fetched directly from `https://schema.org/MedicalSpecialty`, HTTP 200, enumeration-members list parsed from the page's own markup):

```
Anesthesia, Cardiovascular, CommunityHealth, Dentistry, Dermatology, DietNutrition,
Emergency, Endocrine, Gastroenterologic, Genetic, Geriatric, Gynecologic, Hematologic,
Infectious, LaboratoryScience, Midwifery, Musculoskeletal, Neurologic, Nursing,
Obstetric, Oncologic, Optometric, Otolaryngologic, Pathology, Pediatric,
PharmacySpecialty, Physiotherapy, PlasticSurgery, Podiatric, PrimaryCare, Psychiatric,
PublicHealth, Pulmonary, Radiography, Renal, RespiratoryTherapy, Rheumatologic,
SpeechPathology, Surgical, Toxicologic, Urologic, VascularMedicine
```

- `"Psychiatric"` — **valid**, matches an enumeration member exactly.
- `"Addiction Medicine"` — **invalid**. There is no `AddictionMedicine` (or any addiction-related) member in schema.org's `MedicalSpecialty` enumeration at all (a case-insensitive search of the live page for "addiction" returns zero matches). The value also doesn't follow the enumeration's PascalCase-no-space naming convention used by every real member (e.g. `PrimaryCare`, not `"Primary Care"`).

- **Severity: High**
- **Evidence:** live fetch of `https://schema.org/MedicalSpecialty` on 2026-08-13; site value quoted above from `index.html` and repeated identically on all 101 pages carrying this property.
- **Label:** observed (both the site's declared value and schema.org's canonical enumeration were directly retrieved and compared).
- **Impact:** an unrecognized enum value in a Google-validated property risks the whole `medicalSpecialty` property being ignored or the containing entity being flagged as using invalid values in Rich Results Test / Search Console structured data reports.
- **Fix:** remove `"Addiction Medicine"` from the array (it has no valid schema.org equivalent — the closest real enum members are `Psychiatric` and, loosely, `PrimaryCare`). Move the "addiction medicine" concept into `knowsAbout` (free-text, already used elsewhere on the same block for terms like "Addiction Treatment", "Dual Diagnosis") rather than `medicalSpecialty`, which is a strict enumeration.

---

## 5. aggregateRating / Review markup — none found (informational, no penalty risk)

A full recursive key search for `aggregateRating` and `review` across all 465 parsed JSON-LD blocks on all 102 pages returned **zero matches**.

- **Severity: Info**
- **Evidence:** observed — programmatic search of every parsed block's keys, all 102 files, no hits.
- **Conclusion:** the site does not currently publish `aggregateRating`/`Review` schema anywhere, so there is no live risk of the "ratings not backed by visible on-page reviews" penalty Google applies to unsubstantiated review markup. This is not a defect to fix, but it is a **missed opportunity**: if the site later adds visible on-page reviews (e.g. real Google/Yelp reviews rendered in the page), `aggregateRating`/`Review` schema could be added at that time — only once matching visible review content exists on the page.

---

## 6. Organization/LocalBusiness @id graph consistency — inconsistencies found

**Primary organization node** `@id: "https://www.goldenstate-rehab.com/#organization"` appears on 99 pages, e.g.:
```json
"@id": "https://www.goldenstate-rehab.com/#organization"
```

**Two pages diverge** — `locations.html` and `es__locations.html` — where the Organization-type node instead carries:
```json
"@id": "https://www.goldenstate-rehab.com/locations#clinic"
```
This is a **different `@id`** for what should be the same real-world business entity. Google's entity-consolidation model relies on identical `@id` values to recognize the same node referenced from multiple pages; a second, differently-keyed Organization node for the same business fragments the entity graph rather than reinforcing it.

- **Severity: Medium**
- **Evidence:** observed — `@id` value extracted directly from `locations.html` and `es__locations.html` JSON-LD, differs from the `#organization` id used on the other 99 pages.
- **Label:** observed for the @id mismatch itself; not yet assessed whether the two location-page nodes otherwise duplicate the same property set as the primary node (listed under "Not assessed" below).
- **Fix:** use the same canonical `@id` (`https://www.goldenstate-rehab.com/#organization`) on `locations.html`/`es__locations.html` as everywhere else, rather than minting a second `#clinic` id, unless this is intentionally modeling a distinct sub-entity (e.g. a `Place`/`MedicalClinic` location node that references the parent Organization via `parentOrganization`/`department` — in which case that relationship should be made explicit in the markup, which it currently is not, based on what was inspected).

**WebSite node** `@id: "https://www.goldenstate-rehab.com/#website"` is present on 95 of 102 pages. It is **missing entirely** on 7 pages:
```
es__families.html
es__treatments__cocaine.html
es__treatments__fentanyl.html
es__treatments__meth.html
es__treatments__prescription-drugs.html
es__treatments__sex-addiction.html
families.html
```

On at least `families.html` and `es__families.html`, the page's own `WebPage` node still references this id by pointer even though the WebSite node is not defined anywhere in that page's own `@graph`:
```json
{
  "@type": "WebPage",
  "@id": "https://www.goldenstate-rehab.com/families#webpage",
  "isPartOf": { "@id": "https://www.goldenstate-rehab.com/#website" },
  ...
}
```
- **Severity: Medium**
- **Evidence:** observed — full-text search for `@type: "WebSite"` across all parsed blocks; confirmed absent from the 7 files listed; confirmed the dangling `isPartOf` reference by reading `families.html`'s and `es__families.html`'s full JSON-LD.
- **Label:** observed.
- **Impact:** `isPartOf` points at a node id that does not exist within that page's own document. Google's structured-data parsers process each page independently for most validation purposes; a reference to an `@id` not defined on the same page is not guaranteed to resolve, which can leave the `WebPage`'s `isPartOf` relationship unfulfilled on these 7 pages even though it works correctly (self-contained) on the other 95.
- **Fix:** add the standard `WebSite` node (matching the one already used on the other 95 pages, with `@id: ".../#website"`, `publisher` pointing at `#organization`) to these 7 pages' `@graph`, for consistency and self-containment.

---

## 7. Organization node property completeness varies by page — `families.html` / `es__families.html` use a stripped-down version

The homepage (`index.html`) Organization/LocalBusiness node is fully populated:
```json
{
  "@type": ["MedicalOrganization", "LocalBusiness"],
  "@id": "https://www.goldenstate-rehab.com/#organization",
  "name": "Golden State Rehab",
  "url": "https://www.goldenstate-rehab.com/",
  "logo": "...", "image": "...", "description": "...",
  "telephone": "+1-424-208-3120",
  "email": "admissions@goldenstate-rehab.com",
  "priceRange": "$$",
  "currenciesAccepted": "USD",
  "address": { "@type": "PostalAddress", "streetAddress": "1964 Westwood Blvd, Ste 425", "addressLocality": "Los Angeles", "addressRegion": "CA", "postalCode": "90025", "addressCountry": "US" },
  "geo": { "@type": "GeoCoordinates", "latitude": 34.0447, "longitude": -118.4308 },
  "hasMap": "https://maps.google.com/?q=1964+Westwood+Blvd+Ste+425+Los+Angeles+CA+90025",
  "areaServed": [ ...7 City entries... ],
  "openingHoursSpecification": [ ...see §3... ],
  "medicalSpecialty": ["Psychiatric", "Addiction Medicine"],
  "knowsAbout": [ "Cognitive Behavioral Therapy", "Dialectical Behavior Therapy", "Addiction Treatment", "Dual Diagnosis", "Anxiety", "Depression", "PTSD", "Substance Use Disorder" ],
  "foundingDate": "2026",
  "identifier": [ { "@type": "PropertyValue", "name": "DHCS License Number", "value": "191643AP" } ],
  "hasCredential": [ { "@type": "EducationalOccupationalCredential", "name": "DHCS Licensed", ... }, { "@type": "EducationalOccupationalCredential", "name": "LegitScript Certified", ... } ],
  "sameAs": [ "https://www.legitscript.com/websites/goldenstate-rehab.com/", "https://www.yelp.com/biz/golden-state-rehab-llc-los-angeles" ]
}
```

But `families.html` and `es__families.html` embed the **same `@id`** with only 4 properties:
```json
{
  "@type": ["MedicalOrganization", "LocalBusiness"],
  "@id": "https://www.goldenstate-rehab.com/#organization",
  "name": "Golden State Rehab",
  "url": "https://www.goldenstate-rehab.com/",
  "telephone": "+1-424-208-3120",
  "address": { "@type": "PostalAddress", "streetAddress": "1964 Westwood Blvd, Ste 425", "addressLocality": "Los Angeles", "addressRegion": "CA", "postalCode": "90025", "addressCountry": "US" }
}
```
No `geo`, `openingHoursSpecification`, `priceRange`, `hasMap`, `sameAs`, `medicalSpecialty`, `hasCredential`, `identifier`, `logo`, `image`, or `description` on these two pages' copy of the same `#organization` node.

- **Severity: Medium**
- **Evidence:** observed — full JSON-LD read from both `families.html` and `es__families.html`, compared directly against the homepage's node with the identical `@id`.
- **Label:** observed.
- **Impact:** the same `@id` is used to describe the same real-world entity with two very different property sets depending on which page Google happens to parse. This isn't fatal (Google generally favors the most complete representation it finds), but it's inconsistent authoring practice and means these 2 pages contribute none of the LocalBusiness completeness signals (geo, hours, credentials, sameAs, priceRange) that the other ~99 pages provide.
- **Fix:** either use the full Organization block consistently on every page (as done elsewhere), or — better practice — only emit the full Organization definition once (e.g. homepage) and reference it by bare `@id` pointer (`{"@id": "https://www.goldenstate-rehab.com/#organization"}`) on all other pages, rather than re-declaring a partial, inconsistent copy of the same entity.

---

## 8. LocalBusiness completeness checklist (homepage / primary node, `index.html`)

| Property | Present? | Value (as declared) |
|---|---|---|
| address | Yes | `1964 Westwood Blvd, Ste 425, Los Angeles, CA 90025, US` |
| geo | Yes | `lat 34.0447, lon -118.4308` |
| telephone | Yes | `+1-424-208-3120` |
| priceRange | Yes | `"$$"` |
| hasMap | Yes | `https://maps.google.com/?q=1964+Westwood+Blvd+Ste+425+Los+Angeles+CA+90025` |
| sameAs | Yes, but thin | Only 2 links: LegitScript profile, Yelp profile — no GBP URL, no Facebook/Instagram/LinkedIn/other socials observed in this block |
| aggregateRating | Not present | see §5 — correct, since no visible reviews to back it |
| openingHoursSpecification | Present but **false 24/7 claim** | see §3 — Critical |

- **Severity for thin `sameAs`: Low** — 2 profile links is valid but minimal for an E-E-A-T-sensitive healthcare business; not independently confirmed against what social/directory profiles the business actually maintains (not assessed — see below), so no fix is prescribed beyond "verify whether additional legitimate profiles (Google Business Profile URL, Psychology Today, SAMHSA locator, etc.) exist and should be added."
- **Label:** observed (values as declared in the JSON-LD); the completeness/correctness of `sameAs` against the business's real external profiles is **assumed insufficient rather than verified missing** — flagging as worth checking, not asserting the profiles don't exist.

---

## 9. Missing schema opportunity: no `Service` type anywhere

Across all 465 JSON-LD blocks on all 102 pages, `@type: "Service"` (or `"Service"` inside a `@type` array) **never occurs** — confirmed via recursive `@type` search. This is despite the site clearly being organized around discrete offerings (PHP, IOP, telehealth, individual therapy, and per-substance treatment pages such as `treatments/cocaine`, `treatments/fentanyl`, `treatments/meth`, etc., each of which was crawled as its own page).

- **Severity: Medium (missed opportunity, not an error)**
- **Evidence:** observed — zero matches for `Service` type across all parsed JSON-LD.
- **Fix:** add a `Service` (or `MedicalTherapy`/`MedicalProcedure` where more specific) node per program/treatment page, with `provider` pointing at the `#organization` @id, `areaServed`, and `name`/`description` matching the page's actual offering. This is additive — it does not require removing the existing `MedicalTherapy`/`MedicalWebPage` markup already present on many of these pages.

---

## Not assessed (ran out of budget before verifying — do not treat as "no issues found")

The following were identified as present (counted in §2) but their **required-property-level validation** was not completed and should not be assumed to pass:

- **FAQPage / Question / Answer** (59 pages, 355 Question/Answer pairs): did not verify every `Question` has `acceptedAnswer.text` populated (non-empty, non-placeholder) or that `mainEntity` structure is well-formed on all 59 pages. Also note per the standing rule: FAQPage rich results are Google-restricted to government/healthcare sites since Aug 2023 — this site is a healthcare business, so FAQPage may still be Google-eligible, but this eligibility was not independently re-confirmed against current Google documentation during this pass.
- **BlogPosting** (24 occurrences / 14 pages — more occurrences than pages, cause not diagnosed, e.g. possible duplicate/nested BlogPosting blocks per post): did not verify `headline`, `image`, `datePublished`/`dateModified` (ISO 8601), `author` (Person, with E-E-A-T identity detail), or `publisher.logo` presence/validity on each of the 14 blog pages.
- **Person** (80 occurrences / 59 pages, likely `reviewedBy`/`author` identities referenced in the prior session's E-E-A-T commit): did not verify required/recommended properties (`name`, `jobTitle`, `url`, `sameAs`, credentials) are populated and non-placeholder.
- **BreadcrumbList** (100 pages): did not verify `position`/`name`/`item` completeness and absolute-URL correctness across all 100 pages (only spot-checked `families.html`).
- **MedicalWebPage** (43 pages): did not verify `about`, `reviewedBy`, `lastReviewed`, `medicalAudience` or other recommended properties.
- **MedicalSignOrSymptom / MedicalTherapy / MedicalCondition** free-text and enum values (142 / 121 / 80 occurrences respectively): did not cross-check these against schema.org's controlled vocabularies for invalid values beyond the `medicalSpecialty` check in §4.
- **MedicalClinic** (2 occurrences, presumably `locations.html`/`es__locations.html`): did not pull the full block content — only the `@id` was inspected (§6). Its property completeness relative to the LocalBusiness checklist in §8 is unverified.
- **`foundingDate: "2026"`** on the homepage Organization node: observed as-is, but not verified against the business's actual founding date — flagging as suspicious (a 2026 founding date on a site with historical blog content and reviews sounds implausible) without asserting it's wrong.
- **`Blog`** type (2 occurrences/2 pages) and **`ItemList`** (1 occurrence/1 page): not inspected in detail.
- Per-page-type schema-opportunity mapping (e.g. does every treatment page have the "right" bundle of types for its page intent) beyond the `Service` gap noted in §9.
- ES-locale (`/es/`) pages: only spot-checked `es__families.html`/`es__locations.html`; did not diff full ES vs EN schema parity across the other ES pages.
- Deprecated-type sweep for `HowTo`, `SpecialAnnouncement`, `CourseInfo`, `EstimatedSalary`, `LearningVideo`: not found in the §2 type-occurrence table (none of these strings appeared as an `@type` in any parsed block), but a targeted second-pass grep for these exact deprecated type strings was not separately run to double-confirm zero usage.

---

## Summary of severities

| # | Finding | Severity |
|---|---|---|
| 3 | 24/7 (00:00–23:59, all days) `openingHoursSpecification` on 101/102 pages | **Critical** |
| 4 | `medicalSpecialty` includes invalid enum value `"Addiction Medicine"` on 101 pages | **High** |
| 6 | Organization `@id` fragmented on `locations.html`/`es__locations.html` (`#clinic` vs `#organization`) | Medium |
| 6 | `WebSite` node missing on 7 pages, with dangling `isPartOf` reference on at least 2 of them | Medium |
| 7 | Inconsistent/stripped-down Organization node on `families.html`/`es__families.html` | Medium |
| 9 | No `Service` schema anywhere despite services-based business | Medium (opportunity) |
| 8 | Thin `sameAs` (2 links) on primary Organization node | Low |
| 5 | No `aggregateRating`/`Review` markup | Info (no penalty risk, correct as-is) |
