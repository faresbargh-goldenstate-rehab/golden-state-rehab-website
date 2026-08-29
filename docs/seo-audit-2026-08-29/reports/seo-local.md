# Local SEO Audit — Golden State Rehab (goldenstate-rehab.com)
Date: 2026-08-29 | Method: static analysis of 114-page crawl (JSON-LD + saved HTML), no live GBP/DataForSEO access.

## Business Type & Vertical
- **Business type: Brick-and-mortar** (single clinic, visible suite address, real Google Maps iframe embed on /contact, "hasMap" cid link). Not SAB — copy is service-area-flavored ("serving the Westside") but the address is never hidden, so this is brick-and-mortar with an 11-neighborhood local-content strategy layered on top, not a true multi-location or SAB business.
- **Industry vertical: Healthcare — outpatient addiction/behavioral health treatment center.** Signals: DHCS license #191643AP, Joint Commission accreditation, Medical Director Dr. Eric Chaghouri MD, insurance-verification language, PHP/IOP program pages, HIPAA-adjacent care model. This is a regulated healthcare sub-vertical with its own compliance layer (LegitScript, DHCS) on top of standard local SEO.

## Local SEO Score: 63 / 100

| Dimension | Weight | Score | Weighted |
|---|---|---|---|
| GBP Signals | 25% | 60/100 | 15.0 |
| Reviews & Reputation | 20% | 65/100 | 13.0 |
| Local On-Page SEO | 20% | 78/100 | 15.6 |
| NAP Consistency & Citations | 15% | 55/100 | 8.25 |
| Local Schema Markup | 10% | 72/100 | 7.2 |
| Local Link & Authority Signals | 10% | 40/100 | 4.0 |
| **Total** | | | **63.05 ≈ 63** |

Labels used below: **[observed]** = read directly from crawl/HTML/schema, **[inferred]** = derived from observed data, **[assumed/manual]** = cannot be confirmed without live GBP dashboard, paid citation tools, or a login — flagged for human verification, not fabricated.

---

## 1. NAP Consistency Audit — ON-SITE

**Phone: consistent** [observed]. Only one number appears anywhere: `(424) 208-3120`. Three surface formats found across the 114-page crawl, all resolving to the same digits — this is normal formatting variance, not an inconsistency:
| Format | Count | Context |
|---|---|---|
| `4242083120` | 766 | `tel:` links |
| `(424) 208-3120` | 563 | visible body copy |
| `424-208-3120` | 226 | schema/meta/JSON-LD `telephone` (`+1-424-208-3120`) |

**Address: one real discrepancy — "Ste" vs "Suite."** [observed]
- Schema `PostalAddress.streetAddress` (all 114 pages, 114/114 identical): `"1964 Westwood Blvd, Ste 425"` — consistent.
- Visible HTML: `"1964 Westwood Blvd, Ste 425"` appears 131+116 times, but **`"1964 Westwood Blvd, Suite 425"` appears ~20+ times** in body copy on location pages (west-los-angeles, santa-monica, beverly-hills, brentwood, culver-city, venice, etc. — the "Directions from [neighborhood]" sections consistently spell out "Suite" while every other block abbreviates "Ste").
- **Severity: Medium.** Not a Google-penalty-grade NAP break (same suite number, same building), but it's an unforced inconsistency between schema (source of truth) and visible copy — Google's NAP-matching and citation-scraping logic prefers exact-string consistency. **Fix:** find/replace "Suite 425" → "Ste 425" in the location-page templates (or vice versa — pick one and match schema) across all `/locations/*` pages, both `en` and `/es/` versions.
- No wrong city/zip variants found; "West Los Angeles," "Westwood," "Santa Monica" etc. appear only as neighborhood/service-area descriptors around the one true address, never as a substitute mailing city — good discipline.

**Cross-source check:** Visible HTML NAP = JSON-LD NAP = meta `geo.placename`/`ICBM` tags. No conflicts in name or phone across any source. Only the Ste/Suite string variance above.

**Gap:** LocalBusiness/MedicalOrganization schema block (with NAP) is **missing on 4 of 114 pages** [observed]: `/families`, `/es/locations`, `/es/families`, `/amenity-map`. These pages still show NAP correctly in visible HTML/footer presumably, but they don't reinforce it in structured data — low-severity but easy to fix by adding the shared organization schema partial to those templates.

---

## 2. GBP Signals

| Signal | Status |
|---|---|
| GBP Maps link (`cid=15086981718348312167`) present sitewide | 112/114 pages [observed] — missing on the same 4 pages above |
| Real Google Maps iframe embed | Only on `/contact` (`google.com/maps?q=...&output=embed`) [observed] |
| `/locations` hub map | Uses a **custom** `/amenity-map.html` iframe, not a live Google Maps embed [observed] — fine as a UX enhancement, but it's not reinforcing the GBP listing the way an actual Maps embed would |
| `sameAs` in schema | Only Google Maps + Yelp [observed]. Instagram, LinkedIn, and X (all confirmed to exist per brief) are **not** in `sameAs` anywhere in the crawl — a missed, free authority/entity signal |
| Primary GBP category | **Cannot verify from static crawl** [assumed/manual] — this is the single highest-weighted local ranking factor (Whitespark: score 193) and needs a manual login check. Given the clinical mix on-site (`medicalSpecialty: Psychiatric`, addiction-treatment copy throughout), recommend confirming GBP primary category is **"Addiction Treatment Center"** (most specific match) with "Mental Health Clinic" and "Psychiatrist" as secondary categories only if accurate — a mismatched primary category is Whitespark's #1 *negative* factor (score 176) |
| Hours: schema vs visible | **Two distinct, non-conflicting hour sets** [observed], both correct as designed: clinic `openingHoursSpecification` = Mon–Sat 09:00–18:00 (organization-level), and a separate `ContactPoint.hoursAvailable` = 24/7 (00:00–23:59, admissions line). This isn't a discrepancy — it correctly models "clinic hours ≠ phone-always-answered admissions line." Just confirm the visible/on-page hours text matches Mon–Sat 9–6 exactly (spot-check /contact page copy against this schema). |
| Posts / photo-evidence indicators | Cannot be assessed from static HTML — GBP Posts are a live-API signal [assumed/manual] |

---

## 3. Reviews & Reputation Snapshot

- **Rating shown:** "5.0 on Google" in hero and reviews-modal copy [observed]. **No total review count is displayed anywhere on-page** — the modal says "All 6 reviews" but 6 is the number of *screenshots embedded*, not necessarily the total GBP review count. This under-communicates review volume as a trust signal.
- **Format:** Six static **screenshot images** of real Google reviews (reviewer name, star rating, one visible "a week ago / NEW" timestamp) — not a live embed, not schema-marked. **This is correct practice**: no `aggregateRating` or `Review` schema was found anywhere in the crawl [observed], which is the right call — self-declared aggregateRating on a page you don't independently verify is a schema spam risk Google actively discounts, and healthcare review-star rich results are already restricted.
- **No "leave a review" / write-review CTA link found anywhere in the crawl** [observed — regex for `writereview`/`g.page`-style review-collection links returned zero matches]. This is a real gap: without a one-tap Google review link, review velocity depends entirely on staff manually asking, which is exactly what breaks the **18-day rule** (Sterling Sky: local-pack rankings fall off a cliff after ~3 weeks with no new reviews).
- **Response pattern:** cannot be assessed — screenshots don't show owner responses, and this isn't visible from static HTML.
- **HIPAA-safe review-request recommendation:** for behavioral health, never templatize a review-request email/text with any mention of "treatment," "recovery," or "your visit" in a way that could out a client's care status to a shared inbox or phone. Use a neutral SMS/email ("Thanks for choosing Golden State Rehab — mind leaving us a quick Google review?") sent only post-discharge with explicit consent captured at intake, and route through a generic short link (not one that echoes the client's program). Recommend a discharge-day automated (with consent) review-request trigger to keep velocity inside the 18-day window continuously, rather than sporadic staff asks.

---

## 4. Local Schema Validation

- **Current type:** `["MedicalOrganization", "LocalBusiness"]` on 112 pages; a plain `MedicalClinic` type appears on only 2 pages [observed] — inconsistent primary typing.
- **Recommended fix:** per `local-schema-types.md`, **`MedicalClinic`** is the correct, rich-result-eligible subtype for this business (it already inherits from both `MedicalOrganization` and `LocalBusiness`, so switching the 112-page array to a single `"MedicalClinic"` type loses nothing and gains rich-result eligibility). **Severity: Medium.**
- **Required properties:** `name` ✓, `address` ✓ — present and complete on all pages that carry the block.
- **Recommended properties:**
  - `geo`: present, `34.0447, -118.4308`, **only 4 decimal places, not the recommended 5** — trivial precision gap, easy fix (`34.04470, -118.43080` — doesn't add real precision, so ideally source the true 5-decimal coordinate from the GBP dashboard rather than pad zeros).
  - **Geo sanity check [inferred, estimate only]:** 1964 Westwood Blvd, LA 90025 sits at roughly 34.0459°N, ‑118.4368°W by rough geocoding recall. The schema's 34.0447, ‑118.4308 is offset by an estimated **~500–600 meters** east-southeast of that — not wildly wrong (still within West LA/Westwood), but enough to matter for hyperlocal "near me" and proximity-based ranking (proximity is 55.2% of ranking variance per Search Atlas). **Recommend pulling the exact lat/lng directly from the GBP dashboard's "share location" pin** rather than a geocoder estimate, and using that verbatim in schema — this is a manual, 2-minute fix with outsized proximity-signal upside.
  - `openingHoursSpecification` ✓, `telephone` ✓, `url` ✓ — all present.
  - `hasCredential` (DHCS license, Joint Commission) ✓ — excellent, uncommon addition that most competitors won't have.
  - `foundingDate: "2026"` [observed] — **this is today's year, almost certainly a placeholder/build-date artifact, not the actual founding year.** Flag as **High severity — factual/trust issue**: a rehab center schema-declaring a founding date in the current year (or worse, the future, depending on when this renders) undermines the "established, licensed provider" trust signal the rest of the schema works hard to build. Fix: replace with the real founding year, or remove the property entirely if unknown.
  - `areaServed`: matches the 11 location-page cities closely — homepage lists 7 (Los Angeles, West LA, Santa Monica, Beverly Hills, Brentwood, Culver City, Westwood), most inner pages list a fuller list of ~11+ [observed, two variant lists]. Not a conflict, but recommend standardizing one canonical `areaServed` array (matching all 11 `/locations/*` pages) across every page's schema rather than a shorter 7-city homepage version and a longer inner-page version.
  - Missing on 4 pages: see NAP section above.

---

## 5. Location Page Quality (3 of 11 sampled: West Los Angeles, Santa Monica, Beverly Hills)

| Signal | West LA | Santa Monica | Beverly Hills |
|---|---|---|---|
| Unique H1/H2 copy | Yes | Yes | Yes |
| Drive-time stated | Not in sampled block | Yes ("~15 min") | Yes ("~15 min") |
| Transit mention | Yes | Yes | Yes |
| Named local resource (hospital/landmark) | UCLA, Century City | generic | generic |
| Named AA/NA meeting or address | No — "twelve-step meetings run daily across Westwood/Santa Monica/Culver City," no specific meeting name/hall/address | No — same generic pattern | No — same generic pattern |
| FAQPage schema | Yes | Yes | Yes |
| Embedded map (Maps iframe on the page itself) | No | No | No |
| Unique/local photos | **No** — all 3 pages share the identical 18 image filenames (facility interior stock shots + insurance-logo icons), zero neighborhood-specific photo evidence | Same | Same |
| Internal link back to `/locations` hub | Yes | Yes | Yes |
| Outbound trust links | findtreatment.gov, DHCS directory, Joint Commission, Instagram | same | same |
| Word count | 1,591 | 1,628 | 1,606 |

**Scores (0–10):**
- West Los Angeles: **7/10** — strongest named-landmark specificity (UCLA, Century City), loses points for no embedded map and generic imagery.
- Santa Monica: **6.5/10** — good drive-time framing, resource section is more generic/no named landmarks.
- Beverly Hills: **6.5/10** — good "discreet, professional" positioning angle (smart for this audience), same generic-imagery and no-named-resource gaps.

**Common fix across all 11 pages:** add (a) one real, named local resource per page (a specific meeting hall, hospital, or transit line with schedule link — not "twelve-step meetings run daily"), and (b) at least one unique, location-tagged photo (even a simple "view from our Westwood office toward [X]" or drive-time map screenshot) so each page carries genuinely unique on-page evidence rather than only unique prose. This directly serves the "doorway page swap test" — a reviewer swapping only the H1/city name across pages should not find the rest of the page identical, and right now the imagery layer would fail that test even though the copy layer passes.

---

## 6. Citation Presence (Tier 1 + Vertical-Specific)

No live citation-source browsing was performed (would require paid tools or authenticated access); status reflects only what's **linked from or referenced by the site itself**.

| Source | Status |
|---|---|
| SAMHSA findtreatment.gov | **Linked from site** (location pages link out to it as a resource) [observed] — does not confirm the business *has* a findtreatment.gov listing, only that the site references the directory. Verify listing manually. |
| DHCS SUD provider directory | **Linked from site** [observed] — same caveat; verify actual listing manually. |
| Yelp | **Referenced in schema `sameAs`** (`yelp.com/biz/golden-state-rehab-llc-los-angeles`) [observed] — listing appears to exist. |
| BBB | Unknown — manual verify |
| Psychology Today | Unknown — manual verify |
| Rehabs.com / Recovery.com / Addiction Center | Unknown — manual verify |
| Healthgrades | Unknown — manual verify |
| Zocdoc | Unknown — manual verify (typically not applicable to facility-level addiction treatment listings) |
| Apple Maps / Bing Places | Unknown — manual verify |
| Facebook Business Page | **Not found** — the 22 "facebook.com" links in the crawl are all `sharer.php` share buttons, not a business page link; no Facebook profile in `sameAs` despite one existing per brief. **Fix: add Facebook, Instagram, LinkedIn, X to `sameAs`.** |
| LegitScript | **Not mentioned anywhere on-site** [observed — zero matches] |
| NAATP | Not found |
| Local Chamber of Commerce | Not found |

Citations are the weakest-evidenced dimension in this audit; 3 of Whitespark's top-5 AI-visibility factors are citation-related, so this deserves a manual audit pass with a tool like BrightLocal or Moz Local even though this report can't perform it.

---

## 7. Industry-Specific Factors (Addiction Treatment)

| Factor | Status |
|---|---|
| LegitScript certification | **Not found on-site.** [observed] This is **required for Google Ads in this vertical** and increasingly used by Google/GBP as a trust signal for addiction-treatment listings even organically. **Severity: High.** If certified, add badge + link to every location/program page footer; if not yet certified, prioritize — its absence can also suppress GBP visibility for this category. |
| Joint Commission | Present in schema (`hasCredential`) and linked from location pages [observed] — good. Confirm a visible seal/badge with link also renders in the visible page chrome (footer), not just in JSON-LD, since schema-only trust signals don't help human conversion. |
| DHCS license display | License number present in schema (`PropertyValue`, `EducationalOccupationalCredential`) [observed]. Recommend also linking directly to the DHCS provider lookup for #191643AP from the visible footer/contact page so users (and Google) can one-click verify — currently the DHCS link found on location pages goes to the general directory search page, not a deep link to this facility's record. |
| 24/7 phone | Present via `ContactPoint.hoursAvailable` 24/7 [observed] — good, matches admissions-line expectations for this vertical. |
| Insurance verification form/language | Present sitewide (insurance-logo grids, "verify benefits" language in FAQ) [observed]. |
| Spanish-language pages | `/es/` site section exists, including `/es/locations`, `/es/contact`, `/es/faq`, `/es/families` [observed] — good bilingual coverage; note `/es/locations` and `/es/families` are 2 of the 4 pages missing LocalBusiness schema (see NAP section) — fix these first since they're client-facing, high-intent pages. |
| Telehealth statewide + licensure-limit disclosure | Telehealth is mentioned across ~10 pages with "statewide"/"across California" framing [observed], but **no explicit licensure-limitation disclosure** (e.g., "client must be physically located in California at time of session") was found via targeted keyword search [observed absence — moderate confidence, not exhaustive]. **Severity: Medium-High (compliance, not just SEO)** — most state telehealth regs for behavioral health require this disclosure; recommend legal/compliance review of `/programs/telehealth` copy independent of this SEO audit. |

---

## 8. Local Content Gaps

Existing: a "rehab near me" post was found in the blog corpus [observed via brief]. Recommended additions (3–5):
1. **"Insurance-accepted-near-you" comparator page** — one page per major PPO carrier × Westside service area (e.g., "Anthem Blue Cross rehab coverage in Santa Monica") — captures high-intent, low-competition local+insurance queries.
2. **Named local-resource directory page** — a single canonical page listing real AA/NA meeting halls, sober-living homes, and hospitals across the Westside with addresses/times, then link every location page's generic "recovery community" paragraph into it. Solves the location-page specificity gap (Section 5) and becomes a genuine backlink magnet for the linked meeting halls/sober-livings.
3. **"What to expect at [Facility] — a virtual tour" page or video** with real interior photos distinct from the generic stock set reused across all 11 location pages — feeds both this gap and GBP photo strategy.
4. **Employer/EAP-facing local page** ("Addiction treatment for Westside employees — EAP & FMLA guidance") targeting Century City/West LA's dense white-collar employer base — an underused local-intent angle for this specific neighborhood mix.
5. **Family-support local page per major neighborhood cluster** (extending the existing `/families` page with West LA/Santa Monica-specific transportation/visiting guidance) — ties family-search intent to the location pages instead of a single generic page, and closes the schema gap on `/families` at the same time.

---

## Top 10 Prioritized Actions

1. **[Critical]** Add real Google Business Profile category verification/audit as the top action item — confirm primary category is the most specific accurate match (likely "Addiction Treatment Center"); this is the single highest-weighted ranking factor and cannot be checked from the crawl. *(Manual, GBP dashboard.)*
2. **[Critical]** Investigate and add **LegitScript certification** if not yet obtained; it's required for paid ads in this vertical and functions as a trust/visibility signal even organically. If already certified, add visible badge + schema credential to every page.
3. **[High]** Fix `foundingDate: "2026"` in the organization schema (`https://www.goldenstate-rehab.com/` and shared partial used sitewide) — replace with the real founding year or remove.
4. **[High]** Add a one-tap Google review-collection link (place-ID-based `search.google.com/local/writereview?placeid=...`) somewhere in the post-visit flow / footer / thank-you page, plus a HIPAA-safe, consent-gated discharge-day review-request automation — currently zero review-collection CTA exists anywhere in the crawl, putting review velocity at risk of the 18-day cliff.
5. **[High]** Add real Facebook Business Page, Instagram, LinkedIn, and X URLs to the `sameAs` array in the shared organization schema (currently only Google Maps + Yelp) — a free, zero-cost authority signal that's currently missing despite the profiles existing.
6. **[Medium]** Standardize "Ste 425" vs "Suite 425" — grep/replace "Suite 425" → "Ste 425" across all `/locations/*` and `/es/locations/*` page templates to match the schema/canonical address string exactly.
7. **[Medium]** Add the missing LocalBusiness/MedicalOrganization schema block to `/families`, `/es/locations`, `/es/families`, and `/amenity-map` (currently 4 of 114 pages have none).
8. **[Medium]** Switch the schema `@type` from `["MedicalOrganization","LocalBusiness"]` to the single, rich-result-eligible `"MedicalClinic"` type sitewide (2 pages already use it correctly — extend to the other 110).
9. **[Medium]** Verify the schema `geo` coordinates (34.0447, ‑118.4308) against the true GBP-dashboard pin for 1964 Westwood Blvd — estimated off by ~500m; pull the exact 5-decimal coordinate from GBP rather than an approximation, given proximity is 55.2% of ranking variance.
10. **[Low–Medium]** Add one named local resource (specific meeting hall/hospital) and at least one unique, non-reused photo per `/locations/*` page to strengthen the "doorway page swap test" — currently all 11 pages share the identical 18 stock image filenames.

---

## Limitations Disclaimer

This audit is based entirely on a static crawl (114 pages, saved HTML + extracted JSON-LD) and could **not** assess: live GBP dashboard data (category, Q&A, Posts, photo count/recency, verification status), actual third-party citation listings (Yelp/BBB/Psychology Today/Healthgrades/etc. — only site-side references were checked, not the directories themselves), real review counts/velocity/response rate (only 6 static screenshot reviews were visible, one dated "a week ago"), backlink profile or domain authority, local pack/rank-tracking positions, or GBP review-response patterns. No DataForSEO or paid rank-tracking tool was used; any ranking-position or geo-grid claims in this space should be obtained via a manual local-pack check (e.g., incognito search from a Westside IP, or a geo-grid tool) rather than inferred from on-page signals alone. The geo-coordinate offset (~500m estimate) is a rough manual-recall estimate, not a verified geocode, and should be confirmed against the actual GBP pin before acting on it.
