# Backlink Profile Analysis — goldenstate-rehab.com

**Credential tier confirmed: 0** (Common Crawl + verification crawler only).
- Moz: not available (`No Moz API key found` — checked via `backlinks_auth.py --check --json`).
- Bing Webmaster: API key present but **verified sites list = `["gasuitwarehouse.com"]` only**. goldenstate-rehab.com is not a verified property, so Bing inbound-link data cannot legitimately be pulled for this domain and was not queried.
- DataForSEO: not configured, not used.

Per tier-0 rules: **fewer than 4 scoring factors have data. No numeric Backlink Health Score is reported.** Do not treat anything below as DA/PA or a referring-domain count — those require Moz/DataForSEO and were not measured.

---

## 1. Measured — Common Crawl domain graph

Source: `commoncrawl_graph.py` (confidence: 0.50, quarterly-refresh dataset, release `cc-main-2026-jan-feb-mar`, served from local cache).

Queried both `goldenstate-rehab.com` and `www.goldenstate-rehab.com` (script normalizes to registered domain; both calls returned identical output):

```
"in_crawl": false,
"in_rankings": false,
"pagerank": null,
"harmonic_centrality": null,
"n_hosts": null,
"top_referring_domains": [],
"note": "Domain not found in Common Crawl data. It may be too new, too small, or not yet crawled."
```

**Finding:** goldenstate-rehab.com is **not present in the Common Crawl web graph at all**. This is not "zero backlinks" — it means CC's crawl (which samples a large but partial slice of the web) never captured this host, so no in-degree, PageRank, harmonic centrality, or referring-domain list is available from this source. Cannot distinguish "genuinely no external links" from "site too new/low-traffic for CC's sample" from this data alone.

## 2. Measured — Site's own claimed off-site profile (sameAs / citations)

Extracted from JSON-LD on the live crawl (`index.html`, `locations.html` — both carry the identical block; `about.html` and `contact.html` do not carry a sameAs block at all):

```json
"sameAs": [
  "https://www.legitscript.com/websites/goldenstate-rehab.com/",
  "https://www.yelp.com/biz/golden-state-rehab-llc-los-angeles"
]
```

That is the **entire claimed external profile** — observed by full-text grep across all 136 crawled files (`grep -o "sameAs"` present on the two pages above; regex-extracted the array contents directly from `index.html`). No other external URLs are asserted anywhere on the site as sameAs.

Also checked (grep across every crawled HTML file) and confirmed **absent**:
- No Facebook, Instagram, LinkedIn, TikTok, X/Twitter, or YouTube links anywhere on the site (0 matches for any of those domains).
- No Google Business Profile / Maps place link (checked for `g.page`, `goo.gl`, `google.com/maps/place`, `business.google.com` — 0 matches). Only a generic `maps.google.com/?q=...` address-search link exists (found on the homepage), which is not a GBP citation link.

This matters for backlink strategy: the site's own homepage schema only *claims* two off-site profiles exist. There is no social presence to build citation velocity from, and no GBP link to reinforce NAP consistency signals externally.

## 3. Measured — Verification crawler results on the two claimed sameAs URLs

Source: `verify_backlinks.py --target https://www.goldenstate-rehab.com/` (confidence: 0.50–0.95 depending on fetch success, per finding below).

| Source URL | HTTP status | Link back to goldenstate-rehab.com found? | Verdict |
|---|---|---|---|
| `https://www.legitscript.com/websites/goldenstate-rehab.com/` | 200 | No (`target_found: false`, `status: link_removed`) | **Inconclusive, not confirmed dead** — see note below |
| `https://www.yelp.com/biz/golden-state-rehab-llc-los-angeles` | 403 | Unknown (`status: error`) | **Unverifiable** — Yelp blocks the crawler's user agent; this is a known Yelp anti-bot behavior, not evidence the page or link is missing |

**LegitScript follow-up (manual raw fetch, not part of automated tool):** Re-fetched the LegitScript URL directly with a browser-style user agent to sanity-check the automated "link_removed" verdict. The static HTML returned (82KB) does **not** contain the string "Golden State Rehab" (business name) anywhere, and the only occurrence of the string "goldenstate-rehab.com" in the entire document is inside an embedded JS config object (`current_page: 'https://www.legitscript.com/websites/goldenstate-rehab.com/'`) — i.e. it's the page referring to its own URL, not a rendered link to the target site. This strongly suggests LegitScript's certification content on this template is populated client-side via JavaScript after page load, which a static fetch cannot see. **I cannot confirm or deny an actual outbound link exists on that page** — this needs a JS-rendering check (headless browser) that is out of scope for tier-0 tooling. Do not report this as "backlink lost"; report it as **unverified due to JS-rendered content**.

Sanity check performed (not requested by scope, kept minimal): fetched a nonsense LegitScript URL path to see if the template returns HTTP 200 regardless of whether a domain was ever actually certified — the command was cut off before completing, so **this check is incomplete and not reported as a finding**. Flagging only so it isn't silently dropped: before treating the LegitScript listing as confirmed certification, someone should verify with a headless browser (or LegitScript's own directory search) that the certification is real and current, not just that the URL pattern resolves.

## 4. What could NOT be determined at this credential tier (explicit)

Do not infer numbers for any of these — no source is available to produce them:
- **Referring domain count** — no source (CC has zero hosts on record; Moz/DataForSEO unavailable).
- **Domain Authority / Page Authority** — Moz-only metric, not available.
- **Spam Score / toxic link ratio** — Moz/DataForSEO-only, not available.
- **Anchor text distribution** — requires a referring-domains dataset we don't have.
- **Link velocity / trend over time** — DataForSEO-only per the skill's own scoring table, not available.
- **Follow/nofollow ratio** — requires DataForSEO or Bing link-level detail; Bing is not authorized for this domain.
- **Geographic relevance of links** — DataForSEO/Bing-only, not available.
- **Any numeric Backlink Health Score (0-100)** — explicitly withheld per tier-0 policy; fewer than 4 of 7 scoring factors have any data source.

## 5. Competitor link-gap — citation/directory acquisition list

**Important caveat (label: assumed, not researched live):** This session has no live web-search tool available, only Bash/curl and the SEO skill scripts. I did not run a live SERP query to identify this business's actual named ranking competitors, so I am not fabricating specific competitor domain names or any comparative metrics for them (doing so would violate the "no fabricated metric comparison" instruction). If named competitor identification is required, that needs a live SERP/Maps pack pull (e.g., via GSC query for "outpatient rehab Los Angeles" + Maps pack scrape, or a paid tool) — flagging as a follow-up task rather than guessing.

What I can give, based on general and verifiable industry-standard practice for U.S. addiction/mental-health outpatient treatment centers (this is domain-knowledge guidance, not a measured backlink count), is the concrete citation/directory acquisition list a center in this niche and market needs to pursue. Each is a real, named, addressable source — not an estimate:

**Healthcare/treatment-specific directories (highest relevance for YMYL rehab niche):**
- LegitScript certification/directory — already claimed (see Section 2/3); verify the listing is live and complete, not just that a URL resolves.
- SAMHSA FindTreatment.gov / National Directory of Drug and Alcohol Abuse Treatment Programs — the site already outbound-links to `findtreatment.gov` in content; getting *listed* there (not just linking out to it) is the actionable gap.
- Psychology Today "Find a Therapist/Treatment Center" directory
- SAMHSA Behavioral Health Treatment Services Locator
- Recovery.org, RehabAfterWork, RehabsPathfinder, DrugAbuse.com/American Addiction Centers directory (industry aggregators — vet for editorial quality before pursuing, some carry pay-to-play/affiliate models that can look spammy)
- NAATP (National Association of Addiction Treatment Providers) member directory, if membership is held
- Joint Commission or CARF accreditation directory listing, if accredited (confirm accreditation status before pursuing — do not list unverified)

**California-specific / regulatory citations (NAP consistency + trust signals, not just links):**
- DHCS (Department of Health Care Services) licensed-provider directory — the site already links out to `sapccms.dhcs.ca.gov/DirectoryofProviders/`; the actionable gap is confirming/claiming the center's own listing there.
- CA Department of Consumer Affairs license search (`search.dca.ca.gov`) — same pattern, confirm the center's own license record is indexed and NAP-consistent.
- 211 LA County / 211 California directory

**Local/general business citations (standard local SEO foundation, not niche-specific but table-stakes for a brick-and-mortar location):**
- Google Business Profile — **currently no GBP link found anywhere on the site (Section 2)**. This is the single highest-priority gap: claim/verify GBP and add the profile link to the site's sameAs and footer before pursuing any other directory.
- Apple Maps Connect / Apple Business Connect
- Bing Places for Business
- Yelp — already claimed in sameAs (Section 2), but the crawler could not verify the link back (403 block); confirm manually that the Yelp business page is claimed, complete, and reciprocally links to the correct canonical URL.
- Better Business Bureau (BBB) profile
- NPI Registry (individual clinician NPI listings, if applicable to licensed staff)
- Healthgrades / Vitals / WebMD Care provider directory (relevant if licensed clinicians are individually listed)

**Local press / community (earned links, not directories):**
- LA-focused local news and health-reporter outlets for expert-commentary placements (e.g., pitching clinical staff as sources on addiction/mental-health stories) — earned link, not a submission-based citation.
- Partnerships with referring professionals (therapists, EAPs, sober living homes) for reciprocal or resource-page links — the site already outbound-links to `rehab.com/comeback-sober-living`, suggesting an existing sober-living referral relationship; confirm whether that partner links back.

Recommend running `/seo backlinks setup` guidance from the skill (add a free Moz API key at minimum) before the next audit cycle — at tier 1, Moz's referring-domains and anchor-text endpoints would let this list be prioritized by actual authority rather than general niche relevance.

## Data freshness notes
- Common Crawl: quarterly release (`cc-main-2026-jan-feb-mar`), served from local cache dated 2026-08-12 — up to several months stale relative to today.
- Verification crawler: live fetch performed today (2026-08-13).

## Summary of claim labels
- Common Crawl "not in crawl" result: **observed** (direct tool output, confidence 0.50).
- sameAs = LegitScript + Yelp only, no social/GBP links: **observed** (direct grep/regex extraction across all 136 crawled files).
- LegitScript link-back status: **unverifiable** (JS-rendered content, static fetch inconclusive) — explicitly not reported as confirmed lost.
- Yelp link-back status: **unverifiable** (403 bot block).
- Competitor names: **not researched** — no live search tool available this session; explicitly not fabricated.
- Directory/citation acquisition list: **assumed/industry-standard guidance**, not a measured backlink metric.
