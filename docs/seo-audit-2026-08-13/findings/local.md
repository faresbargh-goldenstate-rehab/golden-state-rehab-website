# Local SEO Audit — goldenstate-rehab.com
Scope: NAP consistency, `/locations/*` city-page quality, map embeds, geo schema, areaServed. Built on priors already established by other agents (sameAs gaps, no visible Yelp link, no testimonials, uniform 00:00–23:59 hours on 101/102 pages, DHCS license shown 3x) — not re-litigated here.

All paths below are relative to the crawl mirror: `.../scratchpad/crawl/`.

---

## 1. NAP consistency — observed: consistent, one cosmetic variant

**Business:** Golden State Rehab, single physical location, no multi-office footprint.

Checked sources: `index.html`, `contact.html`, `es__contact.html`, `es.html`, `locations.html`, `our-facility.html`, `locations__venice.html` (representative city page), plus footer partials that repeat on every page.

| Field | Visible HTML (EN) | Visible HTML (ES) | JSON-LD (EN & ES) |
|---|---|---|---|
| Name | "Golden State Rehab" | "Golden State Rehab" | `"name": "Golden State Rehab"` |
| Phone (footer/CTA) | `(424) 208-3120`, `tel:+14242083120` | `(424) 208-3120`, `tel:+14242083120` | `"telephone": "+1-424-208-3120"` |
| Address (footer link, all pages) | `1964 Westwood Blvd, Ste 425, Los Angeles, CA 90025` | same string, untranslated | `streetAddress: "1964 Westwood Blvd, Ste 425"`, `addressLocality: "Los Angeles"`, `postalCode: "90025"` |

**Finding (Low, cosmetic only):** body copy on location pages uses the unabbreviated "**Suite** 425" (e.g. `locations__brentwood.html` line ~68: *"Golden State Rehab is a DHCS-licensed outpatient center at 1964 Westwood Blvd"*, and line ~86: *"Our facility is at 1964 Westwood Blvd, Suite 425"*), while every footer instance and 100% of JSON-LD instances use "**Ste** 425" (`contact.html:214`, `contact.html:266`, `contact.html:361`). This is not a true address discrepancy (same suite, same building) but it means the string that should be pasted verbatim into Yelp/BBB/GBP for exact-match citation building has two candidate forms on-site. **Fix:** standardize on one abbreviation (recommend "Ste 425" to match schema/GBP convention) across all body copy, or explicitly note both forms are acceptable when building the citation NAP master sheet.
**No other discrepancy found** — same phone number and same address string appear identically on every EN/ES page sampled, including all 11 `/locations/*` pages and their `/es/` equivalents were not separately re-checked line-by-line, but `es.html` and `es__contact.html` were checked directly and match exactly (observed).

---

## 2. `/locations/*` city pages — NOT doorway/spun pages; this is the strongest part of the site's local strategy (observed)

There are 11 city pages, each targeting a nearby West LA neighborhood, all describing the **same single office** at 1964 Westwood Blvd (this is a "near me" service-radius page set for one location, not fake multi-location listings — confirmed by identical `@id: "https://www.goldenstate-rehab.com/#organization"` reused on every city page, e.g. `locations__venice.html`).

**Word counts (observed, visible text extracted from HTML):**

| Page | Words |
|---|---|
| west-los-angeles | 1500 |
| west-hollywood | 1505 |
| brentwood | 1540 |
| century-city | 1559 |
| mar-vista | 1572 |
| santa-monica | 1582 |
| venice | 1603 |
| culver-city | 1643 |
| pacific-palisades | 1648 |
| beverly-hills | 1570 |
| marina-del-rey | 1690 |

All comfortably above thin-content thresholds; range is narrow (1500–1690) because the template structure (hero, programs grid, directions, FAQ, credentials) is fixed — content length is not the risk here, content substance is.

**Uniqueness test (observed via full diff, `beverly-hills.html` vs `brentwood.html`, and confirmed via line-overlap sampling on two more pairs):**
- Automated line-level dedup (`comm -12` on rendered text lines) shows 73.0–76.0% identical lines between page pairs (beverly-hills/brentwood 170/233; santa-monica/venice 169/231; century-city/west-hollywood 177/233). **This number is misleading on its own** — it is inflated by UI chrome that legitimately repeats site-wide (nav items, footer links, badge labels, button text like "Verify Insurance", credential-card headings), each of which counts as a short "line."
- The actual diff of body content shows real, page-specific facts, not synonym-swapped spintax:
  - Beverly Hills: *"about fifteen minutes west of Beverly Hills, just past Century City"*, *"roughly four miles west of Rodeo Drive and Beverly Gardens Park"*, FAQ built around discretion for "attorneys, executives, physicians."
  - Brentwood: *"Ten minutes down Wilshire or San Vicente"*, *"about three miles southeast of the Brentwood Country Mart and San Vicente's coral trees, south of UCLA"*, FAQ built around family involvement / Al-Anon.
  - Venice (`locations__venice.html` line 126): *"about 20 minutes inland from the boardwalk"*; line 152: *"roughly six miles northeast of the Venice Boardwalk, inland past Mar Vista"*; line 218: *"via Venice Blvd and Sepulveda Blvd, or Lincoln Blvd to the I-10"*; FAQ specifically covers fentanyl ("common with fentanyl").
  - Each page has distinct driving directions (different named streets/freeways), distinct real landmarks, and a distinct FAQ question set (not just city-name find/replace on identical questions) — verified directly in the Beverly Hills vs. Brentwood diff and spot-checked on Venice.
- **This passes the doorway-page swap test.** If a competitor's spam checker swapped the city name only, the surrounding sentence would still make sense generically — here it would not (e.g., "just past Century City" or "past UCLA on Westwood Blvd" are geographically specific to one city and would read as wrong if pasted into another city's page).

**Residual risk (Medium, not Critical):** because it's one office serving 11 "near me" pages, Google's local algorithm may still discount ranking ability for the more distant cities (Marina del Rey, Pacific Palisades) under standard "service-area near-me page" scrutiny — this is a structural ranking-difficulty risk, not a content-quality violation. No fix needed on content; the fix (if desired) is off-page: a Google Business Profile service-area configuration and/or additional physical/virtual presence signals for the farther cities, which is outside what on-page content can solve.

**Fix priority:** None required for content quality itself (High-quality, keep as-is). Recommend only: (a) resolve the "Ste/Suite" string inconsistency noted in §1, and (b) periodically refresh `lastReviewed`/landmark specifics so they don't go stale (e.g., "Brentwood Country Mart" — verify this business still exists at renewal time) — Low severity, hygiene item.

---

## 3. Map embed — Critical gap: no true Google Maps embed anywhere on the site (observed)

- Sitewide search for `<iframe>` across all 102 crawled pages returns matches on only **2 pages**: `locations.html` (line 146) and `our-facility.html` (line 354).
- Both iframes have `src="/amenity-map.html"` — a **first-party, same-origin path**, not `google.com/maps/embed` or any Google Maps Embed API / My Maps URL. This is not a Google Maps embed; it renders whatever custom "amenities near us" widget lives at that internal URL. (`/amenity-map.html` was not part of the 102-page crawl set — its actual contents are **not verified** here; labeled assumed-not-Google based on the same-origin `src` alone, which is sufficient to say it is not a native Google Maps embed regardless of what it renders internally.)
- Every other "map" reference sitewide — footer on all 102 pages, all 11 `/locations/*` pages, `contact.html`, `our-facility.html` — is a plain outbound anchor: `<a href="https://maps.google.com/?q=1964+Westwood+Blvd+Ste+425+Los+Angeles+CA+90025" target="_blank">` (confirmed identical URL string on `index.html:614`, `contact.html:266`, `locations__venice.html:158/164`, and `our-facility.html`). This is a "Get Directions" link, not an embed.
- **Net finding: zero genuine Google Maps iframe/API embeds on the entire crawled site.** The `hasMap` schema property also just points to the same `maps.google.com/?q=` search URL rather than a Place ID-based Google Maps link (`https://www.google.com/maps/place/?q=place_id:...`), which is the format Google documents as most reliable for tying the page to the actual GBP listing.

**Severity: High.** A real Google Maps embed (using the verified GBP Place ID) is a standard trust/GBP-linkage signal on the contact and location pages of local/healthcare sites and its total absence, combined with the already-flagged missing GBP link in `sameAs`, means there is **no on-page technical linkage at all between this website and a Google Business Profile** — not in schema, not as a visible link, not as a map embed.

**Fix:** Embed a real Google Maps iframe (Maps Embed API, keyed to the GBP Place ID once claimed/verified) on `contact.html` and at minimum the `/our-facility` and `/locations` pages; update `hasMap` in schema to the Place ID URL format instead of a plain address-search query.

---

## 4. Geo coordinates in schema (observed)

- `"geo": { "@type": "GeoCoordinates", "latitude": 34.0447, "longitude": -118.4308 }` — present on every page carrying the organization block (`index.html:717-720`, `contact.html:369-370`, `locations__venice.html:301`, `es.html`, etc.) — identical values everywhere, no drift between pages.
- **Precision: 4 decimal places, not the recommended 5.** 4 decimals resolves to ~11m accuracy, 5 decimals to ~1.1m. For a specific 4th-floor suite in an office building, 5 decimals is the standard recommendation to pinpoint the exact entrance/unit rather than the block.
- **Plausibility (inferred, not independently geocoded):** the coordinate is internally consistent with the copy's own cross-street claims — location pages repeatedly place the office "between Santa Monica Blvd and Olympic" on Westwood Blvd, "south of Westwood Village," near Century City — all of which correspond to the West LA 90025 corridor where lat ~34.04–34.05 / lon ~‑118.43 is expected. No independent geocoding tool was used to confirm the coordinate to the meter; this is inferred plausibility from the address's known neighborhood, not a verified lookup.

**Severity: Low.** Fix: extend to 5 decimal precision (e.g., re-derive from an actual Google-verified Place ID/geocode rather than rounding the current value) to match the "recommended properties" bar and to correctly anchor a future Maps embed (§3).

---

## 5. `areaServed` coverage — Medium inconsistency between homepage and location-page schema (observed)

- **Homepage/global organization block** (`index.html`, also reused via shared `@id` on generic pages) lists 7 areas: `Los Angeles, West Los Angeles, Santa Monica, Beverly Hills, Brentwood, Culver City, Westwood`.
- **Location-page organization block** (e.g. `locations__venice.html` line 303) instead lists **12** areas: `West Los Angeles, Westwood, Santa Monica, Beverly Hills, Brentwood, Culver City, Venice, Mar Vista, Century City, Pacific Palisades, West Hollywood, Marina del Rey`.
- Both blocks share the same `@id` (`.../#organization`), meaning the *same entity* is declared with two different `areaServed` lists depending on which page Google happens to crawl/re-parse — a real consistency defect, and it also means the homepage's `areaServed` is missing 6 of the 11 cities the site has dedicated landing pages for (Venice, Mar Vista, Century City, Pacific Palisades, West Hollywood, Marina del Rey) plus "Los Angeles" itself is dropped from the location-page version.
- **Severity: Medium.** Fix: converge on one canonical `areaServed` list (the fuller 12-city + "Los Angeles" umbrella list) and apply it identically wherever the `#organization` node is emitted, so crawlers never see two conflicting service-area declarations for the same `@id`.

---

## 6. Schema subtype (supplementary to already-known sameAs gap)

- Every page uses `"@type": ["MedicalOrganization", "LocalBusiness"]` for the organization node (`index.html:704-706`, `locations__venice.html`, etc.). Per the industry-specific schema reference (`~/.claude/skills/seo/references/local-schema-types.md`), the correct, rich-result-eligible subtype for a clinic is **`MedicalClinic`** (which itself already inherits both the medical and local-business branches), with `MedicalBusiness` as fallback only "if no specific subtype exists." `MedicalOrganization` is not documented as a `LocalBusiness`/`Place` subtype at all in that reference, so pairing it with `LocalBusiness` in an array is a workaround rather than the documented correct pattern.
- **Severity: Medium.** Fix: replace `["MedicalOrganization","LocalBusiness"]` with `"MedicalClinic"` sitewide (all ~102 pages carry this block via shared partial, so this is a single template change).

---

## Summary table

| # | Finding | Severity | Evidence | Fix |
|---|---|---|---|---|
| 1 | "Ste 425" (schema/footer) vs "Suite 425" (body copy) string inconsistency | Low | `contact.html:214` vs `locations__brentwood.html` body text | Standardize one abbreviation sitewide |
| 2 | Location pages are genuinely unique, not doorway/spun content | Informational (strength) | Full diff `beverly-hills.html` vs `brentwood.html`; word counts 1500–1690 | No content fix needed; keep authoring approach |
| 3 | No true Google Maps iframe/API embed anywhere on site; only same-origin `/amenity-map.html` and outbound "Get Directions" links | High | `locations.html:146`, `our-facility.html:354`, `src="/amenity-map.html"` (same-origin, not `google.com/maps`) | Embed real Maps Embed API iframe keyed to verified GBP Place ID on contact/facility/locations pages |
| 4 | Geo coordinates present and consistent but only 4-decimal precision | Low | `index.html:717-720`, `latitude: 34.0447, longitude: -118.4308` on every page | Re-geocode to 5-decimal precision from verified Place ID |
| 5 | `areaServed` differs between homepage (7 cities) and location-page schema (12 cities) for the same `@id` | Medium | `index.html` areaServed array vs `locations__venice.html:303` areaServed array | Converge on one canonical areaServed list site-wide |
| 6 | Organization schema typed `["MedicalOrganization","LocalBusiness"]` instead of documented `MedicalClinic` | Medium | `index.html:704-706`; `~/.claude/skills/seo/references/local-schema-types.md` lines 22-32 | Change `@type` to `"MedicalClinic"` |

## Limitations / not verified
- `/amenity-map.html` contents were not in the 102-page crawl set, so what it actually renders is unconfirmed — only that its iframe `src` is same-origin, not a Google Maps URL.
- Geo-coordinate accuracy was assessed by internal consistency with the site's own cross-street claims, not by an independent geocoding API call — labeled inferred, not observed.
- Only `es.html` and `es__contact.html` were directly diffed against their EN counterparts for NAP; the remaining 9 `/es/locations/` equivalents were not individually re-checked (note: `es__locations.html` exists as a hub but there was no time/budget to confirm 11 individual `/es/locations/<city>` pages exist — only the English `/locations/<city>` set of 11 was confirmed in the crawl listing).
- No live GBP data (DataForSEO or Google Maps API) was queried; all findings are from the static crawled HTML/JSON-LD only, consistent with the brief's instruction not to re-crawl.
