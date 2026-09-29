# Local SEO Analysis: goldenstate-rehab.com

**Date:** 2026-09-28
**Scope:** 66 live sitemap URLs crawled, the working tree at `1f27fe9`, 14 directory and registry sources, and the public DHCS, NPI and SAMHSA datasets.
**Lens:** the owner's goal is the Google map pack for "rehab near me" and related terms. The owner already handles reviews, GBP tuning and citation building, so this report treats **website authority** as the project. It flags directory problems only where a listing is **wrong**, not merely missing.

---

## 1. Local SEO Score: 64 / 100

| Dimension | Weight | Score | Verdict |
|---|---:|---:|---|
| GBP signals (on-site) | 25% | 20 / 25 | Strong. Every page links to the GBP by CID and embeds the GBP-keyed map. Hours match the GBP. |
| Reviews & reputation | 20% | 12 / 20 | 5.0 on Google and recent, but the total count is unverified and possibly under 10. Yelp has 0. |
| Local on-page SEO | 20% | 16 / 20 | City in the title and H1 of every money page, and NAP on 66/66 pages. Eight service pages are only 52–54% unique. |
| NAP consistency & citations | 15% | 7 / 15 | **The state DHCS record lists a wrong phone.** Missing from FindTreatment.gov. Yelp slug and suite mismatch. |
| Local schema | 10% | 6 / 10 | Rich org node, but `geo` is 447 m off, the type is generic, the description uses banned wording, and staff have no NPI links. |
| Local links & authority | 10% | 3 / 10 | Joint Commission and DHCS only. No chamber, press, "best of" lists or .gov directory links found. |

The score is held down mostly by a small number of wrong facts that are cheap to fix. The on-site groundwork is well above average for a four-month-old single-location practice.

---

## 2. Business type: Brick-and-mortar (single location)

- The street address is visible on 66/66 pages: footer, `.footer-visit` band, contact and locations.
- The GBP-keyed map embed is on 66/66 pages, and the directions link carries `destination_place_id`.
- Schema has a full `PostalAddress` including the suite.
- There are no service-area pages. The 11 neighborhood pages were retired with 410 on 2026-09-27, which removed the doorway risk.

The full NAP and map checks apply.

## 3. Industry vertical: Healthcare (behavioral health, outpatient SUD and mental health)

Detection signals: DHCS program #191643AP, Joint Commission accreditation, a psychiatrist medical director, PHP and IOP, insurance verification, and a HIPAA-style privacy policy.

Industry-specific findings:
- **HIPAA and review replies.** GBP and Yelp owner replies must never confirm that a reviewer was a client. Thank them for the words about the team, and never mention their treatment. Replies were not visible for this audit, so check the existing ones.
- **The state record is the root citation.** For licensed and certified treatment programs, the DHCS directory and the NPI record are what insurers, SAMHSA and the big rehab directories cross-check. An error there spreads further than a Yelp typo. See §6.
- **Detox claims.** DHCS certifies this program as `NON-DETOX`, and the site correctly offers no detox. A directory listing "Detox" is a service-accuracy problem, not a style issue. See §7.
- **Clinician identity.** Healthcare E-E-A-T leans on verifiable clinicians. The medical director and clinical director both have public NPI records the schema doesn't link to yet. See §8.

---

## 4. GBP optimization checklist

| Signal | Status | Evidence |
|---|---|---|
| GBP linked from site | ✅ | `https://www.google.com/maps?cid=15086981718348312167` in the footer, `hasMap` and `sameAs` on 65 pages |
| Map embed opens the Business Profile | ✅ mostly | The footer iframe is keyed on ftid `0x80c2bbc5e47e9077:0xd15fb9f046f6ae67` on 66 pages. **Exception:** `/contact` still has a second, address-query iframe (`maps?q=1964 Westwood…`) that opens a bare address pin. |
| Directions link uses place ID | ✅ | `destination_place_id=ChIJd5B-5MW7woARZ672RvC5X9E` |
| Hours on site match GBP | ✅ | Footer lists all 7 days as "Open 24 hours". Schema has a 7-day `00:00–23:59` spec. `llms.txt` says 24/7. |
| Name on site matches GBP | ✅ | "Golden State Rehab" everywhere, and the GBP embed label reads the same. The name isn't keyword-stuffed (correctly; see the Muse contrast in the owner notes). |
| One page per GBP category and service | ✅ | `/alcoholism-treatment-program` mirrors the secondary category. The homepage's 15 condition rows use the GBP service names verbatim and link to their pages. |
| Primary and secondary categories | ⚪ Not verified | The Places API isn't enabled on the project key (§11). Per the owner notes, the primary category is addiction treatment. |
| Posts, photos, Q&A, attributes | ⚪ Not verified | The owner reports the GBP is optimized. Nothing on the site contradicts that. |
| GBP website link target | ⚪ Not verified | For a single-location practice, the homepage is the right target. Don't change it. |
| Review gating | ✅ None found | No "rate your experience" pre-screen anywhere. Review links go straight to the GBP. |

---

## 5. Review health snapshot

| Platform | Rating | Count | Recency | Source |
|---|---|---|---|---|
| Google | 5.0 | **6 on the homepage, 9 on `/about`. The true GBP total is unverified.** | Posted June to September 2026 (3 in September), worked out from the capture dates | Homepage and `/about` review block |
| Recovery.com | 5.0 | 13 | Unknown | Listing (verified by Recovery.com) |
| Yelp | none | 0 | none | Yelp data feed via DuckDuckGo (Yelp returns 403 to crawlers) |
| Facebook, BBB, Psychology Today | none | none | none | No listing found |

**Correction (same day):** an earlier version said all six reviews were from the last five weeks. That was wrong, because the relative ages ("3 days ago") were relative to screenshots captured on 2026-07-27, 2026-08-20 and 2026-09-26, not to today. Worked from those dates, the nine reviews on `/about` were posted June to September 2026, at least one every month. If the GBP total is still under 10, the Sterling Sky "magic 10" step is the nearest review milestone.

**On-site problem: the review dates are hard-coded and will go stale.** The homepage and `/about` blocks have literal text like `3 days ago`, `a week ago` and `NEW`, added in `438f925`/`5f612fa` with no script updating them. By November, "3 days ago" is false on a healthcare site that leans on trust. Replace them with absolute dates ("September 2026") or a `<time datetime>` element that JS formats. Do this on every page that carries the block.

**`aggregateRating`: don't add it.** Google's review-snippet rules exclude self-serving `LocalBusiness` ratings, and they forbid marking up ratings copied from Google or other sites. The current schema correctly has none.

---

## 6. NAP consistency audit

**Canonical NAP:** Golden State Rehab · 1964 Westwood Blvd, Ste 425, Los Angeles, CA 90025 · (424) 208-3120

| Source | Name | Address | Phone | Verdict |
|---|---|---|---|---|
| Site HTML (66 pages) | ✅ | ✅ incl. suite | ✅ `tel:` on every page | Consistent |
| Org JSON-LD (65 pages) | ✅ | ✅ | ✅ | Consistent, **but `geo` is wrong (below)** |
| GBP embed pin | ✅ | n/a | n/a | 34.0474328, −118.4343784 |
| **CA DHCS directory (#191643AP)** | GOLDEN STATE REHAB LLC | 1964 WESTWOOD BLVD #425 | **(404) 207-7485 ❌** | **Wrong phone.** Verified directly against the DHCS ArcGIS layer (OBJECTID 1042). |
| NPI Registry (NPI 1891639308) | GOLDEN STATE REHAB LLC | ✅ | ✅ | Legal name with LLC is normal |
| Apple Maps (place ID 14083456637786301844) | ✅ | ✅ | ✅ | Clean |
| Yelp | ✅ | **no suite ❌** | ✅ | See §7 |
| Recovery.com | ✅ | ✅ | ✅ | NAP clean, but services are wrong (§7) |

### Finding N1 (Critical): the DHCS record carries a wrong phone number
The state directory lists **(404) 207-7485**. 404 is an Atlanta area code, and the digits look like a typo of (424) 208-3120. This is the record insurers and SAMHSA intake check, and scraped rehab directories copy from it. The fix goes through **DHCS Licensing and Certification**, not a directory dashboard. The owner or administrator should ask their DHCS analyst for the change process.

### Finding N2 (Critical): schema `geo` is 447 m from the building, on 66 pages
Every org node says `34.0447, −118.4308`, which reverse-geocodes to **2194 Glendon Ave, Rancho Park**, 447 m south-east of the building. It also has only 4 decimals, below the 5+ Google recommends. Three independent sources agree on the true location:

| Source | Latitude | Longitude |
|---|---|---|
| GBP embed pin (footer iframe) | 34.0474328 | −118.4343784 |
| US Census geocoder | 34.0472486 | −118.4345536 |
| DHCS record | 34.0471779 | −118.4345722 |

**Fix:** use the GBP pin, `34.0474328, -118.4343784`. It's a mechanical find-and-replace across 66 files:
```
"latitude": 34.0447  →  "latitude": 34.0474328
"longitude": -118.4308  →  "longitude": -118.4343784
```

### Finding N3 (Medium): the "licensed" wording doesn't match the state record
The DHCS record type is **"Certified"** with program code `NON-DETOX`. In California, DHCS generally *licenses* residential facilities and *certifies* outpatient programs. The site says "DHCS-licensed" or "DHCS Licensed" about 149 times, and the footer badge reads "DHCS Lic. #191643AP". **Don't change anything yet.** First confirm with the owner what the actual certificate says. If it reads "certification", update the wording sitewide in one scripted pass.

---

## 7. Citation presence check

| Tier | Source | Status | Action |
|---|---|---|---|
| Registry | CA DHCS directory | Listed, **wrong phone** | Fix via DHCS (N1) |
| Registry | NPI Registry | Listed (1891639308) | Optional: add a mental-health taxonomy if the program qualifies. It lists only 261QR0405X (SUD clinic). |
| Registry | **SAMHSA FindTreatment.gov** | **Not listed** | **High.** 15 facilities within 3 km are listed and GSR isn't. See action #4. |
| Registry | Joint Commission Quality Check | Could not verify (bot wall) | Check by hand that the name and address match |
| Tier 1 | Google Business Profile | Listed | none |
| Tier 1 | Apple Maps | Listed, NAP clean | none |
| Tier 1 | Yelp | Listed, **no suite, 0 reviews** | Add "Ste 425". Fix the site's `sameAs` slug (below). |
| Tier 1 | Bing Places | Could not verify | Check in Bing Places. `BingSiteAuth.xml` shows Bing Webmaster is set up, which isn't the same as a claimed Places listing. |
| Tier 1 | Facebook | Not found | Worth a page if none exists |
| Vertical | Recovery.com | Listed, 5.0 / 13 | **Lists "Detox" as a level of care, which is wrong.** It also shows PHP hours instead of 24/7. |
| Vertical | Psychology Today (treatment centers) | Not found | Owner's target list |
| Vertical | Rehabs.com / AAC, AddictionCenter | Not found | Low |
| Tier 2 | BBB, YellowPages, Foursquare, Manta, Nextdoor | Not found (web search only) | Low. The owner is handling citations. |
| Local | Chambers (West LA, Century City, Westwood Village), press, "best of" lists | Not found | See action #10 |

### Wrong facts on existing listings (fix these; they aren't new citation work)
1. **DHCS phone** (N1).
2. **Recovery.com lists "Detox".** DHCS certifies the program as non-detox and the site offers none. Remove it, and set hours to "Admissions 24/7" to match the GBP. A search summary also credited the facility with "accepts … Aetna, Anthem, Cigna…" wording. If that's on the Recovery.com listing, it breaks the insurance-wording rule.
3. **Yelp slug in the site schema is stale.** The live listing is `yelp.com/biz/golden-state-rehab-los-angeles` (business ID `FtyD43oUS8btt5Opu0AqEw`), but `sameAs` on 65 pages points to `…/golden-state-rehab-llc-los-angeles`. Confirm the live slug in Yelp for Business, then update `sameAs`.
4. **Yelp address has no suite.**

---

## 8. Local schema status

**Present on 65/66 pages:** `["MedicalOrganization","LocalBusiness"]` with `@id` `/#organization`, name, full address, phone, email, `hasMap`, 7-day 24h hours, `contactPoint` (English and Spanish), `areaServed` (7 places), DHCS identifier, Joint Commission credential, and 8 `employee` references. It's valid JSON-LD with no parse errors on any page.

| Issue | Pages | Severity |
|---|---:|---|
| `geo` 447 m off, 4 decimals | 66 | Critical (N2) |
| `description` ends "Most major insurance accepted." (banned wording) | 63 live / 65 working tree | Critical (compliance) |
| Yelp `sameAs` slug stale | 65 | High |
| Generic type. `MedicalClinic` is the specific subtype, and it already inherits both `MedicalOrganization` and `LocalBusiness`. | 65 | Medium |
| `sameAs` omits the NPI record, Recovery.com and the Joint Commission listing | 65 | Medium |
| Clinicians have no `sameAs` or license `identifier` | `/team` | Medium |
| `employee` lists 8. `/team` shows 9 (Sophia Scharpf, Case Manager, is missing). The `/team` title says "8 Staff" while the H1 says "nine of us". | 65 + `/team` | Low |

### Ready-to-use changes to the org node
Keep the `@id`. Change only these properties:

```json
{
  "@type": "MedicalClinic",
  "description": "Golden State Rehab is a Joint Commission accredited outpatient addiction and mental health treatment center in Westwood, Los Angeles, offering PHP, IOP, telehealth, and individual therapy. We work with most major PPO plans.",
  "geo": { "@type": "GeoCoordinates", "latitude": 34.0474328, "longitude": -118.4343784 },
  "sameAs": [
    "https://www.google.com/maps?cid=15086981718348312167",
    "https://www.yelp.com/biz/golden-state-rehab-los-angeles",
    "https://npiregistry.cms.hhs.gov/provider-view/1891639308",
    "https://recovery.com/outpatient/golden-state-rehab-los-angeles/",
    "https://www.instagram.com/goldenstaterehab",
    "https://www.linkedin.com/company/goldenstaterehab/",
    "https://x.com/goldenstateWR1"
  ]
}
```
The description drops "DHCS-licensed" until N3 is settled, and it uses the approved PPO phrasing. Add `{"@type":"Person","@id":"https://www.goldenstate-rehab.com/team#sophia-scharpf","name":"Sophia Scharpf","jobTitle":"Case Manager"}` to `employee`.

### Clinician `Person` nodes on `/team`
Both records are public in the NPI Registry. Their NPI location addresses are the clinicians' own practices, which is normal.

```json
"sameAs": ["https://npiregistry.cms.hhs.gov/provider-view/1932472883"],
"identifier": [
  {"@type": "PropertyValue", "propertyID": "NPI", "value": "1932472883"},
  {"@type": "PropertyValue", "propertyID": "Medical Board of California license", "value": "A123663"}
]
```
Use that for Dr. Eric Chaghouri, MD (psychiatry). For Ari Labowitz, LMFT, use NPI `1881021491` and BBS license `LMFT90865` in the same shape. Confirm with the owner before publishing license numbers, even though both are public records.

---

## 9. Location page quality

Single location, so the multi-location checks mostly don't apply. `/locations` is a hub with one location that covers every nearby neighborhood (121 local mentions, directions, FAQ). The retired neighborhood pages return 410. There's no store locator to audit.

The related risk is **templated service pages**. The owner's model counts sitewide quality toward map-pack prominence, so it matters. The method: 6-word shingles across the 32 service and treatment pages, with a shingle counted as unique if it appears on no other page in the set.

| Page | Unique | Closest twin |
|---|---:|---|
| `/treatments/anxiety` | 52% | depression (0.28) |
| `/treatments/opioid` | 52% | cocaine (0.28) |
| `/treatments/cocaine` | 52% | opioid (0.28) |
| `/programs/group-therapy` | 53% | individual-therapy (0.30) |
| `/treatments/depression` | 54% | anxiety (0.28) |
| `/treatments/ptsd` | 54% | anxiety (0.27) |
| `/programs/individual-therapy` | 54% | group-therapy (0.30) |
| `/programs/iop` | 54% | php (0.24) |
| *Best: `/treatments/dbt`, `/treatments/cbt`* | *79%, 78%* | |

About 415 six-word passages repeat on 20 or more of these pages. The biggest block is the **"Paying for Treatment / We Accept Most Major Insurance Providers"** section on 29 pages. Removing it fixes a compliance problem and raises every one of those pages' unique share at once. Re-measure after it's gone, then add facts that can only live on each page.

---

## 10. Top 10 prioritized actions

Ranked by effect on map-pack prominence, then by effort.

### Critical
1. **Fix the DHCS directory phone**, (404) 207-7485 → (424) 208-3120. *Owner action, through DHCS Licensing & Certification.* It's the root record that other registries and directories inherit.
2. **Correct schema `geo` on 66 pages** to the GBP pin `34.0474328, -118.4343784`. In the same scripted pass, change `@type` to `MedicalClinic`, replace the Yelp `sameAs` slug and add the NPI and Recovery.com `sameAs`. *About 15 minutes: one idempotent script, then verify one page.*
3. **Remove the banned insurance wording sitewide.** That's the 29 "We Accept Most Major Insurance Providers" headings, about 25 FAQ and body lines, and the org `description` on 65 pages. Replace them with approved phrasing or a link to `/insurance/`. It's compliance debt that's still live, and the shared block it sits in is the main cause of the low unique scores in §9.

### High
4. **Get listed on SAMHSA FindTreatment.gov** through the N-SUMHSS new-facility registration. It's the federal locator for SUD care, and many rehab directories and AI assistants draw on it. It also gives a .gov link to the site. Competitors within 3 km are in it and GSR isn't.
5. **Lift the 8 service pages under 55% unique.** Do this after #3, then re-measure. Add content only that page can have: who leads that track, what a week looks like for that condition here, and local detail per the content brief. It's the core "site authority" work in the owner's model.
6. **Link clinician identity in schema.** Add NPI `sameAs` and license `identifier` for Dr. Chaghouri and Ari Labowitz (§8), add Sophia Scharpf to `employee`, and align `/team` and `llms.txt` to nine staff.

### Medium
7. **Correct Recovery.com and Yelp.** On Recovery.com, remove "Detox" and set hours to 24/7 admissions. On Yelp, add "Ste 425". Owner or dashboard action.
8. **Replace the hard-coded relative review dates** ("3 days ago", "NEW") on the homepage and `/about` with absolute dates.
9. **Settle "licensed" vs "certified"** with the owner against the actual DHCS certificate, then update the about 149 mentions in one pass if needed (N3).

### Low
10. **Local authority links and housekeeping:**
    - Swap the `/contact` address-query map iframe for the GBP ftid embed.
    - Clean `llms.txt`: remove the dangling "Rehab-near-me guides for every West LA neighborhood" section (those pages are 410), change "eight" to "nine", drop "verbatim", and add the missing money pages: rehabilitation-center, alcoholism-treatment-program, evening-iop, virtual-iop, psychiatric-care, spanish-speaking-treatment, espanol.
    - Pursue a West LA or Century City chamber membership, local press, and community ties (UCLA-area, alumni events). None were found, and they're the site-authority links a four-month-old domain lacks.

**Before any of this ships:** take a geo-grid baseline for "rehab near me", "addiction treatment" and "outpatient rehab" so the effect can be measured.

---

## 11. Limitations

| Not assessed | Why | Tool that fills the gap |
|---|---|---|
| Live GBP data: categories, total review count, photos, posts, Q&A | Places API (New) and the legacy Places API are both disabled on Maps project 363887785166 | Enable Places API (New) on that key, or use the GBP dashboard, Local Falcon, BrightLocal |
| Geo-grid map-pack positions | Needs a paid grid tool | Local Falcon, BrightLocal, Places Scout, DataForSEO |
| Real-time local pack for target queries | Personalized SERPs, no DataForSEO connection | DataForSEO `serp_organic_live_advanced`, manual incognito checks from the office |
| Backlinks and Domain Authority | No backlink API connected | Ahrefs, Semrush, Moz; Bing Webmaster Tools (already verified) for free inbound links |
| GBP Insights (calls, directions, clicks) | Owner-only data | GBP Performance tab |
| Yelp page, Joint Commission record, Facebook | 403 bot walls or login | Manual check in a browser |
| Bing Places, Psychology Today, BBB and Tier 2 directories | Checked by web search only; "not found" means no search hit | BrightLocal Citation Tracker, Whitespark |
| GBP review reply wording (HIPAA) | Replies not visible without the API | Manual review in the GBP dashboard |

Findings reflect the **live site** as crawled on 2026-09-28 and the working tree at `1f27fe9`, and they agreed at time of writing. A parallel session commits to this repo often, so re-check the counts before acting.
