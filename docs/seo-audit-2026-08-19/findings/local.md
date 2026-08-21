# Local SEO Audit — Golden State Rehab (goldenstate-rehab.com)

Business type: **Brick-and-mortar, single location** (1964 Westwood Blvd, Ste 425, Los Angeles, CA 90025 / Westwood). Site correctly presents one real office plus a documented service area (11 named Westside neighborhoods) — this is the hybrid brick-and-mortar-with-service-radius pattern, not a multi-location chain and not a pure SAB.

Industry vertical: **Healthcare — addiction/behavioral health treatment (outpatient rehab)**. Signals: DHCS license #191643AP, PHP/IOP program pages, "Dr. Eric Chaghouri, MD" medical director, insurance verification, Joint Commission accreditation, LegitScript certification, treatment-specific pages (fentanyl, opioid, alcohol, CBT/DBT).

---

## Local SEO Score: 78 / 100

| Dimension | Weight | Score | Notes |
|---|---|---|---|
| GBP Signals (on-page) | 25% | 15/25 | Consistent `cid=` Google Maps link, hasMap, GBP embed on hub; but real GBP reviews not surfaced on-site, no photo-post evidence, category not verifiable from code |
| Reviews & Reputation | 20% | 6/20 | Real Google reviews evidently exist (screenshots in repo) but **zero review content, rating, or aggregateRating is used anywhere on the site** |
| Local On-Page SEO | 20% | 18/20 | Strong: 11 genuinely differentiated neighborhood pages, real facility photos, directions/transit detail, FAQ schema, medical-review byline |
| NAP Consistency & Citations | 15% | 13/15 | NAP is consistent everywhere checked; only Yelp confirmed as a live citation on-site; no BBB/Psychology Today/Healthgrades links found |
| Local Schema Markup | 10% | 9/10 | Correctly modeled single organization/clinic (no fabricated per-neighborhood entities); minor subtype inconsistency (see below) |
| Local Link & Authority Signals | 10% | 6/10 | LegitScript cert (required for Google Ads on rehab) is present in schema + on-page; SAMHSA/FindTreatment.gov linked as a resource but the site isn't confirmed *listed on* SAMHSA's locator (can't verify without external lookup) |

Proximity (55.2% of ranking variance per Search Atlas) and off-platform GBP category/review-velocity data are outside what this code/content audit can verify — flagged in Limitations.

---

## 1. NAP Consistency Audit

| Element | Source | Value | Consistent? |
|---|---|---|---|
| Name | Visible HTML, schema, footer | "Golden State Rehab" | Yes — 1,014+ occurrences, no variant spelling found |
| Phone | tel: links | `+14242083120` (773 occurrences) | Yes |
| Phone | Visible text | `(424) 208-3120` (569) | Yes, matches |
| Phone | Body copy | `424-208-3120` (224, mostly Spanish locale strings) | Same number, different punctuation — cosmetic only, not a discrepancy |
| Address (schema) | LocalBusiness/MedicalClinic JSON-LD, all pages incl. `es/` | `1964 Westwood Blvd, Ste 425, Los Angeles, CA 90025` | Identical `@id`-linked address on every page checked |
| Address (visible) | Footer, location pages | `1964 Westwood Blvd, Suite 425` / `Ste 425` — both forms used | **LOW** — "Suite" vs "Ste" abbreviation inconsistency across body copy (schema always uses "Ste 425"). Not a discrepancy Google will flag, but worth normalizing to one style sitewide for brand consistency. |
| Address (Spanish) | `es/` mirror | `1964 Westwood Blvd, Ste 425, Los Ángeles, CA 90025` | Consistent (only "Los Ángeles" gets the accent, expected for es locale) |

**No genuine NAP conflicts found** — no second phone number, no alternate suite number, no "Westwood" vs "Los Angeles" locality mismatch in schema (schema always uses `addressLocality: Los Angeles`, which matches the mailing address; "Westwood" is used only as neighborhood/marketing language, not as a conflicting locality claim).

One secondary number appears: `800-662-4357` (SAMHSA's national helpline, correctly attributed, not the business's own number) and `877-696-6775` (2 occurrences) — worth a quick manual check to confirm this is also a third-party number and not a stray/legacy business line left in copy.

**Action:** LOW — grep `877-696-6775` occurrences and confirm source/context; standardize "Suite 425" vs "Ste 425" to one form across body copy (schema can keep the abbreviated form).

---

## 2. Neighborhood Page Quality Gate (PRIORITY FINDING)

Read in full: `locations/santa-monica.html`, `locations/venice.html`; spot-checked H2/intro across all 11 via grep.

**Verdict: These are NOT doorway pages in the policy-violating sense — they pass, but with real risk if content decays.**

Evidence for genuine differentiation:
- Each page has a distinct emotional/demographic angle in its H2 and intro, not just a swapped city name:
  - Santa Monica → tech/hospitality workers, DBT for anxiety+drinking
  - Venice → "creative community," fentanyl/opioid crisis specific framing, naloxone education block
  - Beverly Hills → discretion/privacy angle
  - Century City → "high-functioning doesn't mean unaffected" (professionals)
  - West Hollywood → "recovery is already part of WeHo life"
  - Pacific Palisades → "quiet neighborhoods can carry quiet struggles"
- Directions blocks contain real, distinct routes (specific streets, freeway exits, bus lines, Metro E Line stop names) per neighborhood — these are not interchangeable.
- FAQ schema answers are neighborhood-specific (drive time, transit line, local employer references) not generic boilerplate restated with a find/replace city token.
- "Local Support" sections vary meaningfully: Venice gets a naloxone/overdose-prevention paragraph (topically appropriate for that neighborhood's opioid framing); Santa Monica gets a meeting-density paragraph instead.

**Doorway-page swap test result:** Swapping "Santa Monica" for "Venice" in the intro paragraph would produce a mismatched, incorrect sentence (references to "tech offices, hotels, restaurants" and "Big Blue Bus" vs. "creative community" and "fentanyl crisis") — confirms content is not a template with only the city token changed. This is a genuine pass.

**Where doorway risk remains (be plain about this):**
- Estimated **unique content share is roughly 30–35% of each page's total text** — the majority of each page (nav, program cards x6, "Why Golden State Rehab" 3-card block, full insurance-logo strip, footer, all JSON-LD except the FAQ block) is byte-identical boilerplate repeated 11 times. That ratio is normal and acceptable for local pages of a single-location business, but it is the fuel a manual reviewer or algorithm would use if the *unique* portion ever got thin.
- The specific duplicated blocks, verbatim across all 11 pages: `<div class="phone-banner">`, full nav + mobile nav, "Levels of Care" 6-card grid, entire insurance-logos-grid section (14 logos), "Why Golden State Rehab" 3-card block, CTA banner, full footer, WebSite JSON-LD, and ~70% of the `MedicalOrganization` JSON-LD block (only `MedicalWebPage.about` and the FAQ block change).
- All 11 pages share one photo library across sections (waiting-area, recreation-room, meditation-room) reused by hero background — fine, since it is the same one real office, but confirms there's no location-specific visual evidence (nor should there be, since there's only one office).

**This currently sits on the right side of Google's doorway-page policy** because each page (a) serves a distinct, legitimate search intent ("rehab near Santa Monica" is a real query with real different answer needs: drive time, transit, which detox partner is closest), (b) discloses the single real office honestly rather than implying a branch exists, and (c) does not funnel to a fake separate business entity in schema.

**Action (HIGH):** Before scaling this pattern further (e.g., adding more neighborhood pages), increase the unique-content ratio by adding one more genuinely local element per page — e.g., a real embedded Street View or photo of the actual building entrance/parking used consistently but captioned per neighborhood-relevant route, or a short client-quote /case vignette anchored to that neighborhood (with consent, not fabricated). Do not add fake "our Santa Monica office" language.

---

## 3. Local Schema Markup Validation

Read raw JSON-LD from `locations.html`, `locations/santa-monica.html`, `locations/venice.html`, and all 9 other location pages programmatically.

**Good — no fabricated locations:** Every page's `LocalBusiness`/`MedicalOrganization` block resolves to the identical `@id: https://www.goldenstate-rehab.com/#organization` with the same real address, same `geo` (34.0447, -118.4308 — 4 decimal precision, one digit short of the 5-decimal best practice), and the same `hasMap` Google CID link. `locations.html` additionally emits a `MedicalClinic` entity (`@id: .../locations#clinic`) with `parentOrganization` correctly pointing back to the org — this is the right pattern (one clinic, `areaServed` cities, no per-neighborhood LocalBusiness clones).

Issues:
- **MEDIUM** — The 11 individual neighborhood pages use `"@type": ["MedicalOrganization", "LocalBusiness"]`, not the more specific `MedicalClinic` subtype that the hub page uses and that the reference guide (`skills/seo/references/local-schema-types.md`) recommends for rich-result eligibility. Recommend adding `MedicalClinic` to the `@type` array (or referencing the hub's `#clinic` entity via `@id`) on all 11 pages for consistency and richer eligibility.
- **LOW** — `geo` coordinates are only 4 decimal places (`34.0447`); best practice is 5 for rooftop-level precision.
- **Good** — `openingHoursSpecification`, `telephone`, `url`, `address`, `hasCredential` (DHCS license, LegitScript, Joint Commission), and `sameAs` (Google Maps, LegitScript, Yelp) are all present — this is an unusually complete schema implementation for the vertical.
- **Note** — No `aggregateRating` or `Review` schema anywhere in the codebase. Correct not to fabricate it, but see Reviews section below for the missed opportunity to add it legitimately.

---

## 4. On-Page Local Proof

| Signal | Status | Evidence |
|---|---|---|
| Embedded map / Maps link | Partial | `locations.html` links to a Google Maps `cid=` URL (place ID) sitewide; no actual `<iframe>` Maps embed found on the homepage or hub — only on `amenity-map.html` (a noindex Google Places "neighborhood discovery" widget) and `blog/index.html` |
| Real photos of actual building/interior | **Confirmed real** | Visually inspected `images/facility/waiting-area-800.jpg` — genuine candid photography of the actual waiting room (not stock), 9 distinct rooms photographed (waiting area, meditation room, group therapy room, reception, game room, etc.) |
| Parking / transit detail | Yes, strong | Each location page has a "Getting Here" block with specific freeway exits, bus lines, and one real Metro E Line stop reference (Westwood/Rancho Park) |
| Hours | Yes | "Admissions available 24/7 · Clinical hours Mon–Sat" — consistent phone-banner text and matching `openingHoursSpecification` (09:00–18:00 clinical hours) across all pages checked |
| Service-area statement | Yes | `areaServed` schema array (12 cities) matches the 11 visible neighborhood pages + West LA |
| Hub → spoke → hub internal linking | Yes, complete | `locations.html` links to all 11 neighborhood pages; each spoke links back to 3 "nearby communities" spokes plus the main nav "Locations" link — confirmed via grep across `locations.html` and the two pages read in full |

**Action (MEDIUM):** Add a real `<iframe>` Google Maps embed (not just a text link) to `locations.html` and/or the homepage — an actual embed is a stronger, more standard GBP-linkage signal than a bare CID hyperlink.

---

## 5. Reviews & Reputation

**Finding: real reviews almost certainly exist off-site (Google Business Profile), but nothing is surfaced on the site.**

- `grep` for `aggregateRating`, `Review` schema, "testimonial," "star rating," "leave a review," "Google reviews" returned **zero matches anywhere in the codebase**.
- A folder named `Google Review Screenshots/` exists in the repo root containing 3 screenshots (captured 2026-07-27) — these are evidently real GBP review captures **but are not used anywhere on the live site** (no testimonial section, no image embed of them found in any HTML file).
- **Per the task instructions, do not fabricate reviews or embed the screenshots as review schema.** The correct fix is process, not content: (1) get explicit written consent from the reviewing patients (HIPAA-sensitive — addiction/mental-health treatment reviews name a health condition, so display requires care), (2) either transcribe consented reviews as text with a genuine `Review`/`aggregateRating` schema block sourced from the live GBP rating (kept in sync), or embed a compliant third-party review widget that pulls live from Google rather than hosting static screenshots, and (3) add an explicit "Leave us a review" link using the GBP short review-link format (`g.page/r/.../review`) in the footer or a post-care follow-up email — this does not currently exist anywhere on-site.
- **HIPAA note carried over from the reference guide:** responding to reviews for a treatment center legally cannot confirm or deny that a reviewer was a patient — worth flagging to whoever manages the GBP listing's review responses, since that's outside this codebase's visibility.

**Action (CRITICAL):** No live review-generation CTA exists on-site. Add a direct GBP review link. **Action (HIGH):** Decide, with counsel/compliance input given HIPAA exposure, whether to surface a small number of consented testimonials + a live aggregateRating; if not, at minimum link out to the GBP listing so visitors can read reviews there.

---

## 6. Citation & Listing Priorities (Addiction Treatment Vertical)

Checked on-site links/mentions only (no external site: search performed — see Limitations).

| Directory | On-site evidence | Status |
|---|---|---|
| Yelp | `sameAs` schema link + footer-adjacent reference: `yelp.com/biz/golden-state-rehab-llc-los-angeles` | **Present**, linked from schema |
| LegitScript | Certification claimed on every location page ("LegitScript Certified" card) + `sameAs` link to `legitscript.com/websites/goldenstate-rehab.com/` + `hasCredential` schema entry | **Present** — this is the certification Google Ads requires to run any rehab/addiction-treatment ad; good that it's both displayed and linked for verification |
| SAMHSA FindTreatment.gov | Linked repeatedly as a *resource for visitors* (13 files) | Site links **out** to SAMHSA's locator, but this does not confirm Golden State Rehab is itself **listed in** SAMHSA's treatment locator — that's a separate, live-data registration and can't be verified from the codebase |
| Psychology Today | No mention/link found anywhere | **Not found on-site** — cannot confirm off-site listing without external check |
| Healthgrades | No mention/link found anywhere | **Not found on-site** — same caveat |
| BBB | No mention/link found anywhere | **Not found on-site** |
| Rehab.com | Only appears as the outbound link target for a sober-living partner (`rehab.com/comeback-sober-living`), not as a citation of Golden State Rehab itself | Not a citation |
| GBP category (Addiction treatment center vs. Mental health clinic) | Cannot be determined from source code — this is a live GBP dashboard setting, not a page attribute | **Unverifiable from repo**; given the site's dual addiction+mental-health positioning, recommend primary category "Addiction Treatment Center" with "Mental Health Clinic" as a secondary category, since Whitespark ranks primary-category accuracy as the #1 ranking factor and the #1 negative factor if wrong |

**Action (HIGH):** Get/confirm listings on Psychology Today, Healthgrades, and SAMHSA's FindTreatment.gov locator — these are the top vertical-specific citation sources per the reference guide, and none show on-site evidence of being live. **Action (MEDIUM):** Confirm GBP primary category live in the GBP dashboard (outside this codebase's visibility).

---

## Top 10 Prioritized Actions

1. **CRITICAL** — Add a direct "Leave us a review" link to the GBP review form somewhere on-site (footer and/or a post-treatment/alumni page); currently no review-generation path exists at all despite real reviews existing off-site.
2. **CRITICAL** — Confirm (outside this codebase, in GBP dashboard) that primary category is "Addiction Treatment Center," not a generic/wrong category — Whitespark's #1 ranking factor and #1 negative factor if mismatched.
3. **HIGH** — Get the business live on Psychology Today, Healthgrades, and SAMHSA's FindTreatment.gov provider locator; none show on-site or schema evidence of being listed, and these are the top vertical-specific citation/AI-visibility sources.
4. **HIGH** — Decide a compliant path to surface real review proof on-site (consented testimonials + live `aggregateRating` synced to GBP, or at minimum a prominent link to read reviews on Google) — do not use the static screenshots in `Google Review Screenshots/` as displayed content or fake schema.
5. **HIGH** — Increase unique-content ratio on the 11 neighborhood pages before adding more of them; current estimate ~30–35% unique per page is passing but thin — add one more genuinely local element (consented local client vignette, or richer neighborhood-specific resource content) per page.
6. **MEDIUM** — Align neighborhood-page schema to `MedicalClinic` (matching the hub's `#clinic` entity) instead of the generic `MedicalOrganization`/`LocalBusiness` pair currently used on all 11 spoke pages.
7. **MEDIUM** — Add a true `<iframe>` Google Maps embed (not just a `cid=` hyperlink) to the homepage and/or `locations.html` hub for a stronger GBP-linkage signal.
8. **MEDIUM** — Bump `geo` coordinates from 4 to 5 decimal precision in JSON-LD (`34.0447` → e.g. `34.04470` sourced from the actual GBP pin, not padded with a zero).
9. **LOW** — Normalize "Suite 425" vs "Ste 425" to one form in visible body copy (schema already consistently uses "Ste 425"); cosmetic only, does not currently create a real NAP conflict.
10. **LOW** — Verify the source/context of the two `877-696-6775` occurrences in the codebase to confirm it's a legitimate third-party number and not a stray/legacy line that could confuse a visitor or crawler.

---

## Limitations Disclaimer

This audit was performed entirely from the static codebase (116 pages) plus one live visual check of a facility photo. It could **not** assess: live Google Business Profile data (primary/secondary category, Q&A, Posts activity, photo count/recency, review count/rating/velocity — including the "18-day rule" cliff risk), actual off-site citation presence on Psychology Today/Healthgrades/BBB/SAMHSA (site: search or direct fetch to those properties was not performed), local pack ranking position, NAP accuracy on third-party directories, or proximity/competitive density (55.2% of ranking variance per Search Atlas, outside any on-page control). DataForSEO MCP tools were not available in this session; if added later, re-run GBP category verification and citation presence checks live rather than by inference from on-site links.
