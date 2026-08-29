# Google API SEO Audit — goldenstate-rehab.com

Date run: 2026-08-29
Tier detected: **Tier 1** (API key + service account: PSI, CrUX, CrUX History, GSC, Indexing API available). GA4 not configured (`ga4_property_id` missing) — skipped.
Data sources: Google API (field data where noted) + PSI Lighthouse (lab data).

---

## 1. PageSpeed Insights — Homepage (mobile + desktop)

| Metric | Mobile | Desktop |
|---|---|---|
| Performance | **59/100** | **90/100** |
| Accessibility | 94/100 | 95/100 |
| Best Practices | 77/100 | 77/100 |
| SEO | 100/100 | 100/100 |

Lab Core Web Vitals (Lighthouse simulated, not field data — see §2 for why):

| Metric | Mobile | Desktop | Good threshold |
|---|---|---|---|
| LCP | 8.5 s — **Poor** | 1.2 s — Good | ≤2.5s |
| FCP | 4.7 s | 0.9 s | — |
| TBT (proxy for INP) | 165 ms | 190 ms | ≤200ms good |
| CLS | 0 — Good | 0.01 — Good | ≤0.1 |
| Speed Index | 6.0 s | 1.1 s | — |
| Time to Interactive | 8.6 s | 1.8 s | — |

Mobile homepage is the weak point: LCP of 8.5s (lab) is more than 3x the "Poor" threshold (4.0s), driven largely by render-blocking/unused JS (PSI flagged "Reduce unused JavaScript," ~1.3s potential savings). Desktop is strong across the board.

Raw JSON: `psi-home-both.json`

## 2. CrUX Field Data (origin + homepage URL, mobile)

**No CrUX data exists for this site at all** — neither origin-level nor URL-level, and neither in the point-in-time CrUX API nor the 28-day-bucket CrUX History API. Both API calls returned:
> "No CrUX data for this origin/URL. The site likely has insufficient Chrome traffic volume for eligibility."

This is itself a finding: the site does not yet have enough real-world Chrome (Android/desktop Chrome) traffic to be included in the CrUX dataset (dataset requires a minimum sample size, roughly low tens of thousands of pageviews/28 days at origin level). All CWV numbers in this report are **lab data only** (Lighthouse simulated throttling), not what real users experience. Cannot report pass/fail against the Good/Needs Improvement/Poor thresholds using field data — only lab estimates are available, and lab LCP is typically pessimistic relative to field LCP but the 7–11s lab LCP figures below are large enough to be a genuine concern regardless.

Raw JSON: `crux-history-origin.json` (origin history — empty), CrUX section embedded in each `psi-*.json` file (URL-level — empty for every page checked).

## 3. PageSpeed Insights — Mobile, 4 additional pages

| Page | Perf | A11y | Best Practices | SEO | LCP (lab) | FCP (lab) | TBT | CLS |
|---|---|---|---|---|---|---|---|---|
| /programs/php | 62/100 | 93 | 77 | 100 | 8.0 s | 4.5 s | 60 ms | 0 |
| /treatments/ * | 63/100 | 95 | 96 | 100 | 7.2 s | 4.6 s | 80 ms | 0 |
| /blog | 59/100 | 90 | 73 | 100 | 10.8 s | 5.0 s | 80 ms | 0 |
| /es/ | 66/100 | 94 | 77 | 100 | 8.3 s | 4.1 s | 60 ms | 0.005 |

\* `/treatments/alcohol-rehab-los-angeles` returned **HTTP 404** (confirmed via curl). Fell back to `/treatments/` index per instructions. This 404 is worth flagging as a potential broken/renamed URL if it's linked anywhere internally or in sitemaps — worth checking the sitemap/internal links for this exact slug.

All 4 pages show the same pattern as the homepage: mobile LCP in the 7–11 second range (lab), which would be "Poor" if it reflected real-user experience. CLS is excellent (~0) everywhere. TBT is low (60–80ms) — main-thread blocking is not the bottleneck; render-blocking resources / large LCP element load time is. `/blog` is the worst offender at 10.8s lab LCP and Performance 59/100.

Raw JSON: `psi-php-mobile.json`, `psi-treatments-mobile.json`, `psi-blog-mobile.json`, `psi-es-mobile.json`

## 4. Search Console — BLOCKED (permission denied on all attempted properties)

Attempted properties, in order:
1. `https://www.goldenstate-rehab.com/` (URL-prefix property) — **Permission denied**: `Ensure the service account email is added as a user in Google Search Console > Settings > Users and permissions.`
2. `sc-domain:goldenstate-rehab.com` (domain property) — same **Permission denied** error.
3. `gsc_query.py sites` (list all properties visible to this service account) — returned an **empty list** (`{"sites": [], "error": null}`), confirming the service account has zero GSC properties added to it right now.

Service account needing access: **`claude-seo-reader@claude-seo-496120.iam.gserviceaccount.com`**
Action needed: in Search Console → the goldenstate-rehab.com property → Settings → Users and permissions → Add user → paste that email → grant at least "Full" (Owner not required for read-only queries, but URL Inspection requires Owner-level per the API's own error message below).

**Configuration bug found**: the local config file (`~/.config/claude-seo/google-api.json`) has `"default_property": "sc-domain:gasuitwarehouse.com"` — an unrelated domain, apparently left over from a different client's audit. When `gsc_inspect.py` was run without an explicit `--site-url`, it silently queried against `gasuitwarehouse.com` instead of erroring about a missing config. I re-ran with `--site-url sc-domain:goldenstate-rehab.com` explicitly and got the same permission-denied result as above, so the underlying finding (no GSC access at all for this domain) holds either way — but this default should be fixed or cleared before any other audit reuses this config, since it will misreport results for pages that don't obviously belong to the wrong domain.

None of the following could be retrieved: 28-day or 90-day totals (clicks/impressions/CTR/avg position), top 20 queries, top 20 pages, sitemap status, or URL Inspection index status for homepage / `/verify-insurance` / `/programs/php` / `/es/` / a blog post. All GSC calls errored identically to the two above.

Raw JSON (all show the permission error): `gsc-totals-28d.json`, `gsc-totals-90d.json`, `gsc-queries-28d.json`, `gsc-queries-90d.json`, `gsc-pages-28d.json`, `gsc-pages-90d.json`, `gsc-sitemaps.json`, `gsc-inspect-home.json`, `gsc-sites.json`

## 5. GA4

Skipped — no `ga4_property_id` configured (`google_auth.py --check` reported: "Add 'ga4_property_id' to unlock GA4 organic traffic reports"). No organic-traffic or top-landing-page data available this run.

---

## Priority Findings

- **Critical**: Search Console is completely inaccessible to the configured service account (0 properties, explicit permission-denied on both property formats). This blocks all query/impression/index-status visibility — the single highest-value fix is adding `claude-seo-reader@claude-seo-496120.iam.gserviceaccount.com` as a user in GSC for goldenstate-rehab.com.
- **High**: Mobile homepage lab LCP is 8.5s (Poor territory), and all 4 secondary pages tested show 7.2–10.8s mobile lab LCP. `/blog` is worst at 10.8s / Performance 59. No field (CrUX) data exists yet to confirm real-user impact, but lab figures this large across every template (home, program page, treatments, blog, ES mirror) point to a systemic render-blocking / large-LCP-element issue rather than a one-page problem.
- **Medium**: `/treatments/alcohol-rehab-los-angeles` returns HTTP 404 — check whether this URL is referenced in the sitemap, internal nav, or external backlinks; if so it needs a 301 to the correct treatments URL or the page needs to be restored.
- **Low**: `~/.config/claude-seo/google-api.json` has a stale `default_property` pointing to an unrelated domain (`gasuitwarehouse.com`); clean up to avoid silent misattribution in future runs of tools that fall back to config defaults (e.g. bare `gsc_inspect.py <url>` without `--site-url`).

## Data Freshness Notes

- CrUX / CrUX History: would be 28-day rolling if data existed; currently N/A (no data).
- GSC: would have a 2–3 day lag; currently N/A (access blocked).
- GA4: not configured.
- PSI Lighthouse lab runs: reflect a single simulated run at time of this audit; can vary run-to-run by a few points/hundred ms.
