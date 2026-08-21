# Schema.org Audit — Golden State Rehab

Scope: 116 pages (pages.json), raw JSON-LD read directly from: `index.html`, `treatments/alcohol.html`, `treatments/fentanyl.html`, `locations/beverly-hills.html`, `locations/santa-monica.html`, `blog/cost-of-rehab-in-los-angeles.html`, `blog/how-much-does-rehab-cost.html`, `team.html`, `es/index.html`, `espanol.html`. Zero JSON-LD parse errors sitewide (pre-verified). 404.html, amenity-map.html, intake-success.html, es/intake-success.html carry no JSON-LD (pre-verified, not re-reported).

## 1. Detection summary (by archetype)

| Archetype | Types present |
|---|---|
| Home (en/es) | `MedicalOrganization`+`LocalBusiness` (org node), `WebSite`, `FAQPage` |
| Treatment (e.g. alcohol, fentanyl) | org node, `WebSite`, `BreadcrumbList`, `MedicalCondition`, `MedicalWebPage`, `FAQPage` |
| Program (IOP, PHP, etc.) | org node, `WebSite`, `BreadcrumbList`, `MedicalTherapy`, `MedicalWebPage`, `FAQPage` (most) |
| Location (11 neighborhood pages) | org node, `WebSite`, `BreadcrumbList`, `MedicalWebPage`, `FAQPage` |
| Blog post | `BlogPosting`, `MedicalWebPage`, `BreadcrumbList`, `FAQPage` (most), org node, `WebSite` |
| Team | org node, `WebSite`, `BreadcrumbList`, array of `Person` |
| FAQ/Families/Verify-insurance | org node, `WebSite`, `FAQPage`, `WebPage`/`ContactPage` |
| Locations index | org node, `WebSite`, `BreadcrumbList`, `ItemList` |

The org node (`@type: ["MedicalOrganization","LocalBusiness"]`, `@id: https://www.goldenstate-rehab.com/#organization`) is re-emitted in full on essentially every page rather than referenced. This is the intended jsonld pattern for this site and works, **provided the copies stay identical** — see §2 for where they don't.

## 2. Entity graph hygiene — CRITICAL

**One stable `@id` is used correctly for both the Organization and the WebSite node across the entire site**, including the two Spanish pages the coordinator flagged (`/es/index.html` and `/espanol.html` both use `https://www.goldenstate-rehab.com/#organization` and `https://www.goldenstate-rehab.com/#website` — confirmed by direct read). There are **not** two competing organization entities. `/espanol.html` and `/es/index.html` are also not duplicate content: they canonicalize separately and hreflang-pair with different English counterparts (`/espanol` ↔ `/spanish-speaking-treatment`, `/es/` ↔ `/`). No action needed there.

However, because the full org node is copy-pasted on 100+ pages instead of referenced, the copies have **drifted**, and multiple pages now assert **different property values for the identical `@id`**. Structured-data consumers that consolidate by `@id` (Google's Knowledge Graph, GBP matching, any RDF store) will see contradictions for the same real-world entity:

- **`image` conflict (CRITICAL):** homepage, team.html, about.html, treatments/*, blog/* all set `"image": ".../images/logo-icon.png"`, but all 11 `locations/*.html` pages set `"image": ".../images/og/default.jpg"` for the exact same `@id`. One node, two different image claims.
- **`areaServed` conflict (HIGH):** the homepage lists 7 cities; `locations/beverly-hills.html` lists 12 cities (adds Venice, Mar Vista, Century City, Pacific Palisades, West Hollywood, Marina del Rey); `es/index.html` lists only 6 (drops Brentwood entirely, among others). Same `@id`, three different service-area claims.
- **`knowsAbout` conflict (MEDIUM):** English pages list 9 topics; `es/index.html` lists only 4 (subset).
- **`foundingDate: "2026"` (MEDIUM — verify, don't assume):** present on index/treatments/team/blog, absent on locations pages. I have not verified whether 2026 is the real founding year or a placeholder that happens to match the current build year — flag for the client to confirm. If it is a placeholder, remove it; a wrong `foundingDate` is a factual claim Google may surface directly.
- **`WebSite` node property set (LOW):** homepage and locations pages include `"inLanguage": "en-US"` and `"publisher"` reference on the `WebSite` node; `treatments/alcohol.html`, `team.html`, and `blog/*` omit `inLanguage` on that same node (publisher reference is present everywhere, so this is cosmetic but still a drift pattern).

**Fix:** stop re-authoring the org/website nodes per template. Generate them once from a single source-of-truth (JSON/YAML partial) and inject identically everywhere, or truly reference by `@id` only (`{"@id":"https://www.goldenstate-rehab.com/#organization"}`) on every page except one canonical page (e.g. the homepage) that carries the full definition. Either approach eliminates drift by construction.

## 3. Location pages — NOT a spam risk (confirmed correct)

Checked `locations/beverly-hills.html` and `locations/santa-monica.html` directly (per coordinator request) plus all 11 files' `@id`/address via script. **Every neighborhood page reuses the same `@id` and the same real street address (`1964 Westwood Blvd, Ste 425, Los Angeles, CA 90025`)** — there is no fabricated per-neighborhood `LocalBusiness` or fake office address. Geo-targeting is done correctly through a distinct `MedicalWebPage` per page with `"about": {"@type":"City","name":"Beverly Hills"}` (etc.), not through duplicate business listings. This is the right pattern for a single-location outpatient clinic marketing to a service area and should **not** be changed to per-neighborhood LocalBusiness nodes — doing so would create exactly the doorway-page/fake-location spam risk Google's guidelines warn about. Aside from the `image`/`areaServed` drift noted in §2, this pattern is sound. **Severity: LOW (informational — confirms correct implementation).**

## 4. Required/recommended property completeness

The org node is unusually complete for this vertical: `name`, `@id`, `url`, `logo`, `image`, `description`, `telephone`, `email`, `priceRange`, `address` (full `PostalAddress`), `geo`, `hasMap`, `areaServed`, `openingHoursSpecification`, `contactPoint`, `medicalSpecialty` (valid enum value `Psychiatric`), `knowsAbout`, `identifier` (DHCS license), `hasCredential` (DHCS license, LegitScript, Joint Commission), `sameAs`. This is well above the norm for a rehab marketing site. Gaps that remain:

- **No `availableService` on the Organization (HIGH):** PHP, IOP, telehealth, individual therapy exist as separate `MedicalTherapy`-typed pages but the org node never lists them as `availableService`/`makesOffer`. This is the single highest-value structural addition — it's what lets Google (and AI answer engines) understand *what the business actually does* without having to infer it from prose. See ready-to-paste fix below.
- **No insurance-network schema (MEDIUM):** no `PropertyValue`/`healthPlanNetworkId` or equivalent naming the PPO networks (Aetna, Anthem, Cigna, BCBS, United — all named in FAQ answer text but not marked up). Low direct Google rich-result value today, but real value for AI/LLM citation (GEO) when users ask "does X accept my insurance."
- **`sameAs` is thin (MEDIUM):** only Google Maps CID, LegitScript, Yelp. No LinkedIn company page, no Psychology Today listing (very commonly checked by prospective clients/referring clinicians in this vertical), no Facebook/Instagram if they exist. Grep confirms zero `linkedin.com`/`psychologytoday` references anywhere in the org node's `sameAs` (the strings that do appear on team.html/index.html/about.html/privacy-policy.html/espanol.html are just nav/footer text links, not schema).
- **Medical Director modeled as generic `Person`, not `Physician` (MEDIUM):** `team.html` gives Dr. Eric Chaghouri, MD a `Person` node with `hasCredential`. Schema.org's `Physician` type (subtype of `Person`/`MedicalOrganization`) supports `medicalSpecialty`, `availableService`, and `hospitalAffiliation` — stronger E-E-A-T signal for YMYL health content reviewed by him (`reviewedBy` on every `MedicalWebPage`/`BlogPosting` already points at this same Person node's data). Recommend upgrading his node to `@type: ["Person","Physician"]`.
- **`BlogPosting.dateModified` freshness signal (MEDIUM):** checked `dateModified` across all 16 English blog posts — 5 of 16 show `2026-08-19` (today's system date), while the other 11 show varied realistic dates in the preceding weeks. That the 5 all match "today" exactly is consistent with either genuine same-day edits or an auto-stamp-on-build bug; I can't distinguish from the file alone (labeled as unverified, not a confirmed bug). Worth confirming the CMS only bumps `dateModified` on real content edits — Google has explicitly said it discounts dateModified that doesn't reflect substantive changes, and a value that always reads "today" on every rebuild would eventually be ignored or distrusted.

## 5. Type-appropriateness — correct, no deprecated types found

- Treatment pages correctly use `MedicalCondition` (with `signOrSymptom`, `possibleTreatment`) + `MedicalWebPage`, not the retired `HowTo`. Confirmed on both `treatments/alcohol.html` and `treatments/fentanyl.html`.
- Program pages correctly use `MedicalTherapy` + `MedicalWebPage`.
- Blog posts are correctly `BlogPosting` with `author` (Person w/ `jobTitle`, `worksFor`), `datePublished`, `dateModified`, `reviewedBy`, `articleSection`, `mainEntityOfPage`, `isPartOf`, `inLanguage` — this is a genuinely well-built implementation, better than most sites in this vertical.
- No `HowTo`, `SpecialAnnouncement`, `CourseInfo`, `EstimatedSalary`, or `LearningVideo` found anywhere. Clean.
- No `AggregateRating` or `Review` schema found anywhere on the site (grep confirmed zero matches for `AggregateRating` or a `"Review"` type across all HTML). **Do not add either unless real, verifiable third-party reviews exist on-page with a visible source (Google/Yelp widget) — fabricating rating schema is a Google spam violation and a legal risk for a healthcare business.** This is correctly avoided today; flagging only so it stays avoided.

## 6. FAQPage — Info priority, not Critical

`FAQPage` is present on ~50+ pages sitewide (home, treatment, program, location, blog, FAQ, families, verify-insurance). Google restricted FAQ rich results (Aug 2023) to "well-known, authoritative government and health websites" — in practice this has been interpreted as .gov domains and large recognized health portals (Mayo Clinic, NHS, CDC), not independent local outpatient clinic marketing sites. Golden State Rehab, despite being a licensed healthcare provider, should **not** assume it qualifies for the exception.

- **Severity: INFO, not Critical.** Existing FAQPage markup is not broken and costs nothing to keep — it still feeds AI/LLM answer engines (ChatGPT, Perplexity, Google AI Overviews) that consume structured FAQ data for citation even without classic blue-link rich results. If the client is optimizing for GEO (generative engine optimization) alongside classic SEO, keep it.
- Do not add FAQPage to any *new* page in pursuit of a Google rich-result snippet — that benefit will not materialize for this site type. Frame any future FAQ additions purely as a GEO/AI-citation play, not a SERP-feature play.

## 7. Spanish mirror (`/es/`)

- `inLanguage`/entity linkage: `es/index.html`'s Organization and WebSite nodes correctly reuse the sitewide `@id`s (`#organization`, `#website`) — same entity, not a duplicate. Good.
- But (repeating §2) the ES org node's `description`, `areaServed` (6 vs 7-12 cities depending on page), and `knowsAbout` (4 vs 9 items) diverge from the English copies under the *same* `@id`. This is the most visible instance of the drift problem: a crawler resolving `#organization` from an ES page vs an EN page gets contradictory facts about the same business.
- The ES `WebSite` node is missing `inLanguage: "es-ES"`/`"es-US"` entirely (it has neither `inLanguage` nor `publisher` on `es/index.html`, both present on the EN homepage's WebSite node). Add `"inLanguage": "es-US"` (or `"es"`) to every `/es/` WebSite node so Google can correctly associate the node with Spanish-language content when merging by `@id`.

## Ready-to-paste fixes

### Fix 1 (HIGH) — `availableService` on the Organization node

Add to the shared org node (paste identically wherever the org node is emitted, once drift is fixed per §2):

```json
"availableService": [
  {
    "@type": "MedicalTherapy",
    "name": "Partial Hospitalization Program (PHP)",
    "url": "https://www.goldenstate-rehab.com/programs/php"
  },
  {
    "@type": "MedicalTherapy",
    "name": "Intensive Outpatient Program (IOP)",
    "url": "https://www.goldenstate-rehab.com/programs/iop"
  },
  {
    "@type": "MedicalTherapy",
    "name": "Telehealth Treatment",
    "url": "https://www.goldenstate-rehab.com/programs/telehealth"
  },
  {
    "@type": "MedicalTherapy",
    "name": "Individual Therapy",
    "url": "https://www.goldenstate-rehab.com/programs/individual-therapy"
  },
  {
    "@type": "MedicalTherapy",
    "name": "Group Therapy",
    "url": "https://www.goldenstate-rehab.com/programs/group-therapy"
  },
  {
    "@type": "MedicalTherapy",
    "name": "Medication Management",
    "url": "https://www.goldenstate-rehab.com/programs/medication-management"
  }
]
```

### Fix 2 (CRITICAL) — stop the `image`/`areaServed`/`knowsAbout` drift + upgrade the Medical Director to `Physician`

Canonical org-node values to use identically on every page (replace the diverging `image` on all 11 `locations/*.html` files with the sitewide value, and replace the shrunken `areaServed`/`knowsAbout` on `es/index.html` and other ES pages with the full list translated, not truncated):

```json
{
  "@context": "https://schema.org",
  "@type": ["MedicalOrganization", "LocalBusiness"],
  "@id": "https://www.goldenstate-rehab.com/#organization",
  "name": "Golden State Rehab",
  "image": "https://www.goldenstate-rehab.com/images/logo-icon.png",
  "areaServed": [
    { "@type": "City", "name": "Los Angeles" },
    { "@type": "City", "name": "West Los Angeles" },
    { "@type": "City", "name": "Westwood" },
    { "@type": "City", "name": "Santa Monica" },
    { "@type": "City", "name": "Beverly Hills" },
    { "@type": "City", "name": "Brentwood" },
    { "@type": "City", "name": "Culver City" },
    { "@type": "City", "name": "Venice" },
    { "@type": "City", "name": "Mar Vista" },
    { "@type": "City", "name": "Century City" },
    { "@type": "City", "name": "Pacific Palisades" },
    { "@type": "City", "name": "West Hollywood" },
    { "@type": "City", "name": "Marina del Rey" }
  ]
}
```

Medical Director node upgrade (`team.html`, replace the existing Eric Chaghouri `Person` object):

```json
{
  "@context": "https://schema.org",
  "@type": ["Person", "Physician"],
  "@id": "https://www.goldenstate-rehab.com/team#eric-chaghouri",
  "name": "Dr. Eric Chaghouri, MD",
  "jobTitle": "Medical Director",
  "description": "Board-Certified Psychiatrist, M.D., Keck School of Medicine at USC",
  "medicalSpecialty": ["Psychiatric"],
  "worksFor": { "@id": "https://www.goldenstate-rehab.com/#organization" },
  "hasCredential": [
    { "@type": "EducationalOccupationalCredential", "credentialCategory": "degree", "name": "Doctor of Medicine (MD)" },
    { "@type": "EducationalOccupationalCredential", "credentialCategory": "certification", "name": "Board-Certified Psychiatrist" }
  ]
}
```

## Severity summary

- **CRITICAL:** Org-node property drift across page copies under one shared `@id` (`image` on locations pages; `areaServed`/`knowsAbout`/`description` on `es/index.html`) — §2, §7, Fix 2.
- **HIGH:** No `availableService` linking the Organization to its actual programs — §4, Fix 1.
- **MEDIUM:** Thin `sameAs` (no LinkedIn, no Psychology Today) — §4. Medical Director should be `Physician`, not bare `Person` — §4, Fix 2. `foundingDate: "2026"` unverified, may be a placeholder — §2. No insurance-network markup (GEO value only) — §4. `dateModified` matching today's date on 5/16 blog posts — verify it isn't an unconditional build-time stamp — §4.
- **LOW:** Inconsistent presence of `inLanguage` on the `WebSite` node across templates — §2.
- **INFO:** FAQPage sitewide — keep for AI/LLM citation value, don't expect Google rich results, don't add to chase a SERP feature — §6. Location pages confirmed correctly avoiding fake per-neighborhood LocalBusiness spam — §3. `espanol.html` vs `es/index.html` confirmed to share one Organization/WebSite `@id` and are legitimately distinct, correctly hreflang-paired pages, not duplicates — §2.
- **Confirmed clean (no action):** zero deprecated types (`HowTo`, `SpecialAnnouncement`, `CourseInfo`, `EstimatedSalary`, `LearningVideo`); zero fabricated `AggregateRating`/`Review`; zero JSON-LD parse errors; correct `MedicalCondition`/`MedicalTherapy`/`MedicalWebPage` usage on treatment and program pages.
