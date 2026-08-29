# Backlink Profile Audit — goldenstate-rehab.com
Site: https://www.goldenstate-rehab.com/
Date: 2026-08-29

## Credential Tier
**Tier 0** (per task-provided `backlinks_auth.py --check` result):
- Moz API key: MISSING (not configured)
- Bing Webmaster Tools API: configured, but only verified for `gasuitwarehouse.com`, not this domain
- Common Crawl Web Graph: available
- DataForSEO: not configured

At Tier 0, fewer than 4 of the 7 scoring factors in the standard weighted model have any data source. Per protocol, **no numeric Backlink Health Score is produced** — this would be misleading. Reporting is limited to raw metrics with explicit confidence labels.

## 1. Common Crawl Domain Graph — Observed (confidence: 0.50)
Command: `commoncrawl_graph.py goldenstate-rehab.com --json`
Crawl snapshot used: **cc-main-2026-jan-feb-mar**

Result (verbatim from tool):
- `in_crawl`: **false**
- `in_rankings`: **false**
- PageRank / PageRank rank: **null / null**
- Harmonic centrality / rank: **null / null**
- Referring domains (n_hosts): **null**
- Top referring domains sample: **0** (empty list)
- Tool note: *"Domain not found in Common Crawl data. It may be too new, too small, or not yet crawled."*

**Interpretation (labeled as inference, not fact):** This means Common Crawl's most recent crawl snapshot (Jan–Mar 2026) did not capture `goldenstate-rehab.com` at all — not that the domain has zero backlinks. Common Crawl is a sampled, non-exhaustive web graph; small or newly-launched sites are frequently absent even when real backlinks exist elsewhere. **This result should not be read as "no backlinks exist."** It should be read as "Common Crawl provides no signal either way."

Data freshness note: Common Crawl web graph snapshots are quarterly; a "not found" result reflects a point-in-time gap, not a current-day fact.

## 2. Bing Webmaster Tools Inbound Links — Attempted, Failed (as expected)
Command: `bing_webmaster.py links https://www.goldenstate-rehab.com/ --json`

Result: **error** — `404 Client Error: Not Found` on `GetLinkDetails` for this URL. Tool also emitted a pre-flight warning: *"www.goldenstate-rehab.com not in bing_verified_sites config. API may return limited data."*

**Root cause (observed):** the Bing Webmaster API key on file is verified only for `gasuitwarehouse.com`. It has no verification/ownership relationship with `goldenstate-rehab.com`, so Bing correctly refuses to return link data for a site this key doesn't control.

**This is not a data quality issue — it's a missing prerequisite.** No inbound-link data was retrieved from Bing for this domain. No numbers should be attributed to Bing for this site.

### Recommendation (not data — an action item)
1. Add and verify `https://www.goldenstate-rehab.com/` as a site in Bing Webmaster Tools (via meta tag, DNS TXT, or XML file upload) under the account that owns this API key.
2. Submit the XML sitemap for the domain once verified.
3. Enable IndexNow push-based indexing so both Bing and downstream crawl-derived tools (and this audit script) can retrieve `GetLinkDetails` data on the next run.
4. Re-run `bing_webmaster.py links https://www.goldenstate-rehab.com/ --json` after verification to get near-real-time inbound link data (confidence: 0.70 once available).

## 3. Backlink Verification (verify_backlinks.py)
**Not run.** Common Crawl returned zero referring hosts (`top_referring_domains: []`, `n_hosts: null`), so there were no candidate URLs to feed into `verify_backlinks.py`. No known/manual backlink list was supplied for this task either. If a manual list of known backlinks (e.g., directory listings, press mentions) becomes available, run:
`verify_backlinks.py --target https://www.goldenstate-rehab.com/ --links <file> --json`
to confirm live status, anchor text, and nofollow/dofollow attribute — this would raise confidence to 0.95 for each confirmed link.

## 4. Competitor / Citation Gap Analysis — LA Addiction Treatment Vertical
None of the sources below were queried programmatically in this audit (no API access for directory-presence checks). Every row is **unknown — verify manually** unless otherwise noted. This list is provided as a prioritized manual-verification checklist, not as observed data.

| Citation / Directory Source | Relevance to LA addiction treatment SEO | Presence status |
|---|---|---|
| SAMHSA Behavioral Health Treatment Locator | Federal, high-trust, directly targets treatment-seekers | unknown — verify manually |
| Psychology Today (Rehab/Therapist directory) | High-DA, commonly cited by treatment centers, strong local filter | unknown — verify manually |
| Rehabs.com | Vertical-specific directory, common backlink source in this niche | unknown — verify manually |
| Recovery.com | Vertical-specific directory, aggregates reviews + accreditation badges | unknown — verify manually |
| Addiction Center | Vertical-specific directory, high traffic for "rehab near me" queries | unknown — verify manually |
| Yelp | Local pack + review signal, indirectly affects local SEO more than raw backlink value | unknown — verify manually |
| BBB (Better Business Bureau) | Trust/credibility signal, common baseline citation | unknown — verify manually |
| LegitScript | Certification specific to addiction treatment marketing (required for Google/Facebook ads in this vertical) | unknown — verify manually |
| Joint Commission | Accreditation body; link only applicable if the facility holds this accreditation | unknown — verify manually |
| CARF (Commission on Accreditation of Rehabilitation Facilities) | Accreditation body; link only applicable if accredited | unknown — verify manually |
| DHCS (CA Dept. of Health Care Services) licensing directory | State-mandated licensing directory for CA addiction treatment providers; high trust, hyper-relevant geographically | unknown — verify manually |
| Local Chamber of Commerce (LA-area) | Local relevance signal, easy citation to acquire | unknown — verify manually |

**Recommendation:** Because Common Crawl shows no data and Bing is not yet authorized for this domain, the fastest, cheapest way to build a *verifiable* baseline backlink profile is to manually confirm and, where missing, actively pursue listings in the rows above — starting with SAMHSA, DHCS licensing directory, and LegitScript, since these are near-mandatory for this vertical and are typically easy, high-trust links for a legitimately licensed CA facility.

## Skipped / Not Applicable
- Moz metrics, referring domains, anchors, top pages: **skipped — no Moz API key configured (Tier 1 unavailable).**
- DataForSEO: **skipped — not configured (Tier 3 unavailable).**
- Bing compare/gap tool: **skipped — requires verified site, same blocker as inbound links above.**

## Top Recommendations (Priority order)
1. **Critical:** Verify `www.goldenstate-rehab.com` in Bing Webmaster Tools, submit sitemap, enable IndexNow — this unblocks the only currently-configured paid-tier-adjacent data source (Bing) and is a zero-cost action.
2. **High:** Pursue/confirm the near-mandatory vertical citations for CA addiction treatment: DHCS licensing directory listing, SAMHSA treatment locator listing, and LegitScript certification. These are both compliance-relevant and link-equity-relevant for this niche.
3. **High:** Because Common Crawl shows the domain entirely absent from its graph, prioritize getting indexed and linked from a small number of high-authority, low-effort sources (BBB, chamber of commerce, Psychology Today profile) to establish an initial referring-domain footprint that a future crawl can pick up.
4. **Medium:** Once any of the above links go live, supply the resulting URLs as a manual list to `verify_backlinks.py` to get confirmed (confidence 0.95) anchor-text and dofollow/nofollow data for this audit's next iteration.
5. **Medium:** Add Moz API credentials (Tier 1) to unlock DA/PA, spam score, and referring-domain counts — currently the single highest-value upgrade available for backlink measurement on this site.

## Data Source Confidence Key
- Common Crawl (domain-level): confidence 0.50, refreshed quarterly
- Bing Webmaster: confidence 0.70, near-real-time — **not available for this domain in this audit**
- Moz: confidence 0.85, refreshed ~3 days — **not available (no API key)**
- DataForSEO: confidence 1.00 — **not available (not configured)**
- Manual verification items above: confidence 0 (unverified) until checked
