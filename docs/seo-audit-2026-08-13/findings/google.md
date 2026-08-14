# Google API Field/Lab Data — goldenstate-rehab.com
Data source: Google APIs (PageSpeed Insights v5, CrUX API, CrUX History API, Search Console API), Tier 1 credentials (API key + service account `claude-seo-reader@claude-seo-496120.iam.gserviceaccount.com`). GA4 not configured — **skipped, not assessed** (no `ga4_property_id` in config).

Raw JSON responses saved to: `/private/tmp/claude-501/-Users-kkareem-1-Documents-Claude-COde-Web-Design-arm-website-golden-state-rehab-2/22e2d8f6-2351-418c-87a6-3361b9304ec5/scratchpad/google_raw/`

All figures below are **observed** (pulled directly from the cited JSON file), unless labeled otherwise.

---

## 1. CrUX Field Data (Real Chrome User Experience Report)

**Result: NO field data available for this origin — origin has insufficient Chrome traffic volume for CrUX eligibility.** This is not a permissions issue; it is the standard CrUX response when a site doesn't meet Google's minimum-traffic threshold for a public UX report.

Checked and all returned the same "insufficient traffic" error:

| Query | Form factor | File | Result |
|---|---|---|---|
| Origin (`https://www.goldenstate-rehab.com`) | ALL | `google_raw/crux_history_origin.json` | `"No CrUX history data for this origin. Insufficient Chrome traffic volume for eligibility."` |
| Homepage URL (`https://www.goldenstate-rehab.com/`) | ALL | `google_raw/crux_history_homepage.json` | same error |
| Origin | PHONE | `google_raw/crux_history_origin_phone.json` | same error |
| Origin | DESKTOP | `google_raw/crux_history_origin_desktop.json` | same error |
| Homepage (current snapshot, not history) | PHONE | `google_raw/crux_homepage_phone.json` | `"No CrUX data for this origin. The site likely has insufficient Chrome traffic volume for eligibility."` |
| Homepage (current snapshot, not history) | DESKTOP | `google_raw/crux_homepage_desktop.json` | same error |

**Conclusion: no real-user LCP, INP, CLS, or TTFB data exists in CrUX for this site — origin-level or page-level, mobile or desktop, current or historical.** I did not attempt CrUX pulls on `/programs/php`, `/treatments/alcohol`, or `/contact` individually since the origin itself already fails eligibility (a page can only appear in CrUX if the origin/site has enough traffic; origin failure means per-URL lookups would fail identically).

**Per instructions, I am not substituting PSI lab data and calling it field data.** Section 2 below is explicitly lab data (synthetic Lighthouse runs), not real-user data.

## 2. CrUX History — Trend

Not available — see Section 1. `crux_history.py --origin` returned an empty `trends: {}` and empty `collection_periods: []` for all form factors. There is no multi-week trend to report because there was never a qualifying data collection period.

---

## 3. PageSpeed Insights (Lab Data) — 4 pages × mobile/desktop (8 runs, all succeeded, no errors)

All raw responses: `google_raw/psi_{home,php,alcohol,contact}_{mobile,desktop}.json`

### Performance scores (Lighthouse, /100)

| Page | Mobile | Desktop |
|---|---|---|
| Homepage `/` | **79** | 97 |
| `/programs/php` | **72** | 96 |
| `/treatments/alcohol` | **79** | 96 |
| `/contact` | 86 | 99 |

Traffic-light read: mobile performance is Needs Improvement across the board (72–86), desktop is Good (96–99) on all four pages. Mobile is the priority.

### Core Web Vitals-adjacent lab metrics (Lighthouse synthetic run, single sample — not field data)

| Page | Strategy | LCP | TBT | CLS | FCP | Speed Index | TTI |
|---|---|---|---|---|---|---|---|
| Homepage `/` | Mobile | **4.7 s** (Poor vs. field thresholds) | 90 ms | 0.002 (Good) | 2.4 s | 2.9 s | 4.7 s |
| Homepage `/` | Desktop | 1.2 s (Good) | 60 ms | 0.008 (Good) | 0.9 s | 0.9 s | 1.2 s |
| `/programs/php` | Mobile | **5.0 s** (Poor) | 90 ms | 0 (Good) | 3.2 s | 5.0 s | 5.0 s |
| `/programs/php` | Desktop | 1.2 s (Good) | 40 ms | 0.002 (Good) | 0.9 s | 0.9 s | 1.2 s |
| `/treatments/alcohol` | Mobile | **4.9 s** (Poor) | 30 ms | 0.027 (Good) | 2.4 s | 2.4 s | 4.9 s |
| `/treatments/alcohol` | Desktop | 1.3 s (Good) | 10 ms | 0.002 (Good) | 0.8 s | 0.8 s | 1.3 s |
| `/contact` | Mobile | 3.7 s (Needs Improvement) | 30 ms | 0.001 (Good) | 2.4 s | 3.1 s | 3.7 s |
| `/contact` | Desktop | 0.8 s (Good) | 0 ms | 0.005 (Good) | 0.7 s | 0.7 s | 0.8 s |

Note: TBT (Total Blocking Time) is Lighthouse's lab proxy for INP; it is not INP itself and the two do not map on a fixed scale. CLS is directly comparable between lab and field. LCP thresholds shown above are the field thresholds (2500/4000ms) applied loosely to lab numbers for context only — since there is no field LCP for this site (Section 1), these lab LCP values are the *only* LCP signal available, and mobile LCP is consistently 3.7–5.0s across all four pages, i.e., in Poor territory by the same thresholds if it held in the field.

### Top opportunities (Lighthouse "Opportunities" + byte-weight diagnostics, mobile runs — desktop had negligible savings)

| Page | Opportunity | Est. time savings | Est. byte savings | Total page weight |
|---|---|---|---|---|
| Homepage `/` | Reduce unused JavaScript | 390 ms | 68 KiB | 1,241 KiB total |
| Homepage `/` | Reduce unused CSS | — (not separately flagged as opportunity, but diagnostic present) | 10 KiB | |
| `/programs/php` | Reduce unused JavaScript | 750 ms | 66 KiB | 501 KiB total |
| `/programs/php` | Reduce unused CSS | — | 11 KiB | |
| `/treatments/alcohol` | Reduce unused JavaScript | 720 ms | 68 KiB | 544 KiB total |
| `/treatments/alcohol` | Reduce unused CSS | — | 11 KiB | |
| `/contact` | Reduce unused CSS | 150 ms | 12 KiB | 351 KiB total |
| `/contact` | Reduce unused JavaScript | — (no unused-JS opportunity flagged on this page) | — | |

Observed pattern (inferred from the above, consistent across all three heavier pages): the same JS bundle (~66-68 KiB unused, 390-750ms savings) is loaded on the homepage, `/programs/php`, and `/treatments/alcohol` — consistent with a site-wide script that isn't page-specific and isn't being code-split/deferred effectively on mobile. `/contact` is the lightest page (351 KiB) and doesn't carry the same JS penalty, which is why its mobile score (86) is meaningfully better than the other three (72-79).

Lighthouse category scores were also captured for all 8 runs: Accessibility 91-95/100, Best Practices 100/100, SEO 100/100 across the board (no regressions there).

---

## 4. Google Search Console — Access Status

**BLOCKER: Service account has zero accessible GSC properties for this domain.** This is not a data-freshness issue — the account cannot see the property at all.

- `gsc_query.py sites --json` → `{"sites": [], "error": null}` (service account is authenticated but has no properties listed).
- Explicit query attempt 1 — domain property `sc-domain:goldenstate-rehab.com`:
  `"Error: Permission denied for property 'sc-domain:goldenstate-rehab.com'. Ensure the service account email is added as a user in Google Search Console > Settings > Users and permissions."`
- Explicit query attempt 2 — URL-prefix property `https://www.goldenstate-rehab.com/`:
  Same permission-denied error.

**What the user must do:** Add `claude-seo-reader@claude-seo-496120.iam.gserviceaccount.com` as a user (Full or Restricted is fine for read-only reporting) under Search Console → Settings → Users and permissions, on whichever property type is verified (domain property `goldenstate-rehab.com` or URL-prefix `https://www.goldenstate-rehab.com/`).

**Consequence — none of the following could be pulled, and no numbers are fabricated in their place:**
- URL indexation status (URL Inspection API) for homepage, `/programs/php`, `/treatments/alcohol`, `/contact`, or any other sample URL.
- Search performance (clicks, impressions, CTR, position) — top queries, top pages — for either the last 28 days or last 3 months.
- Sitemap submission/processing status from GSC's perspective (separate from the on-site `sitemap.xml` file structure, which was already verified by the crawl per the brief and is out of scope here).

---

## 5. Not Assessed

- **GA4 organic traffic / top landing pages** — GA4 not configured (`ga4_property_id` missing from `/Users/kkareem_1/.config/claude-seo/google-api.json`; `google_auth.py --check` explicitly flags this as the only gap keeping the account below Tier 2). Per task instructions this was skipped rather than attempted.
- **GSC URL Inspection** (indexation status per URL) — blocked by the access issue in Section 4.
- **GSC Search Analytics** (queries/pages, 28-day and 3-month) — blocked by the access issue in Section 4.
- **GSC sitemap status** — blocked by the access issue in Section 4.
- **CrUX field data for individual URLs beyond the homepage** (`/programs/php`, `/treatments/alcohol`, `/contact`) — not queried individually because the origin-level CrUX check already failed eligibility (Section 1); a per-URL CrUX query would fail for the same reason and would not add information.
- **PDF report generation** — not yet run; offering below.

---

## Summary for the coordinator

1. **CrUX (real-user field data): unavailable, origin-wide.** Confirmed via 6 separate query variants (origin/homepage, history/snapshot, phone/desktop) — the origin does not meet Chrome's minimum traffic threshold for public CrUX reporting. There is no LCP/INP/CLS/TTFB field data to report, and no historical trend. Any Core Web Vitals discussion for this site must be caveated as lab-only.
2. **PSI lab data (8/8 runs succeeded):** Mobile performance is the weak spot — scores 72-86/100 with lab LCP consistently 3.7-5.0s (vs. desktop 96-99/100, LCP 0.8-1.3s). The recurring cause across homepage, `/programs/php`, and `/treatments/alcohol` is ~66-68 KiB / 390-750ms of unused JavaScript from what appears to be a shared, non-deferred script bundle. `/contact` is lighter (351 KiB) and scores better (86 mobile) accordingly.
3. **GSC: hard blocker, confirmed by direct API error, not assumed.** The service account `claude-seo-reader@claude-seo-496120.iam.gserviceaccount.com` has 0 accessible properties and gets an explicit permission-denied error on both the domain and URL-prefix property forms for goldenstate-rehab.com. No indexation or search-performance numbers exist in this report because none could be legitimately retrieved. The user must add that service account as a GSC user before this data can be pulled.
4. **GA4: skipped per instructions** (not configured — separate remediation, not attempted here).

I have not yet generated the PDF report (`google_report.py`). Given GSC and CrUX are both unavailable, a `full` report would be heavily gapped — happy to generate a `cwv-audit` type report scoped to the PSI lab data if useful, once you confirm.
