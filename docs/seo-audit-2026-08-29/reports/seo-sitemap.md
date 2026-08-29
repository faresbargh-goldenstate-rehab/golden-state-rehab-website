# Sitemap Architecture Audit — goldenstate-rehab.com

**Date:** 2026-08-29 | **Sitemap:** https://www.goldenstate-rehab.com/sitemap.xml | **Score: 84 / 100**

Sources: live sitemap (13,853 bytes, identical byte-for-byte to repo `sitemap.xml`), crawl `pages.jsonl` (114 pages, all HTTP 200), repo `find *.html`, `git log` per file. No re-crawl performed. Every claim below labelled *observed* comes from those artifacts; anything else is marked as inferred or estimated.

## Verdict

The sitemap is structurally clean: valid XML, 113 URLs, every `<loc>` returns 200 and matches its page canonical exactly, no noindexed or redirected URLs, no `priority`/`changefreq` noise, all `lastmod` values are valid W3C dates with no future dates. The two real weaknesses are (1) `lastmod` is stale across the board — 44 Spanish URLs still say 2026-07-07 although those files changed on 08-13 and 08-20, and no page reflects the 08-20 hero/reviews change — and (2) hreflang is on-page only (which Google accepts) rather than also in the sitemap. Location pages pass the quality gate. Nothing here is a blocker; the fix is a build-time `lastmod` generator.

## 1. Format validity

| Check | Result | Detail |
|---|---|---|
| Well-formed XML | PASS | Parses with ElementTree; root `urlset`, namespace `http://www.sitemaps.org/schemas/sitemap/0.9` |
| URL count / limits | PASS | 113 URLs, 13,853 bytes raw, 1,126 bytes gzipped (limits: 50,000 URLs / 50 MB) |
| Duplicate `<loc>` | PASS | 0 |
| `<lastmod>` present | PASS | 113/113, all `YYYY-MM-DD` (W3C valid), 0 future dates |
| `<lastmod>` plausibility | WARN | Only 11 distinct values; 59 = 2026-08-13, 44 = 2026-07-07, 10 singletons (blog posts, /license). Not "all today", but see section 6 — the dates lag real file changes |
| `changefreq` / `priority` | PASS | Absent on all 113 entries (correct — Google ignores both) |
| Gzip served | n/a | Sitemap is served uncompressed (`.xml`); at 14 KB this is irrelevant. Cloudflare front (observed in `headers.txt`) compresses on the wire anyway |
| Single file vs index | PASS | Single file is right at 113 URLs. Only split if the site exceeds ~10k URLs or you want per-section indexing stats in GSC |

## 2. URL hygiene

- **Scheme/host:** 113/113 are `https://www.goldenstate-rehab.com/…` (observed).
- **Trailing slashes:** 7 URLs carry a trailing slash: `/programs/`, `/treatments/`, `/blog/`, `/es/`, `/es/programs/`, `/es/treatments/`, `/es/blog/`. These are the directory-index pages. The crawl shows the slash-less form 308-redirects *to* the slashed form and the on-page canonical is the slashed form (`/programs` -> 308 -> `/programs/`, canonical `https://www.goldenstate-rehab.com/programs/`), so the sitemap uses the correct final URL. All other 106 URLs are slash-less and their canonicals are slash-less. Consistent.
- **Sitemap `<loc>` == canonical:** 113/113 exact match (observed).
- **Noindex in sitemap:** 0. The only noindex page (`/amenity-map`, `robots: noindex`, 11 words) is correctly excluded.
- **Redirected sitemap URLs:** 0 (every sitemap URL's `final_url` equals its `loc`).
- **`.html`, query strings, fragments in `<loc>`:** 0.

## 3. Hreflang

- Sitemap contains **no `xhtml:link rel="alternate"` entries** and does not declare the `xmlns:xhtml` namespace (observed).
- On-page hreflang is present and reciprocal: 43 EN pages declare an `es` alternate, all 43 targets are in the sitemap; all 44 ES pages declare `en` + `x-default` pointing to EN URLs that are all in the sitemap; ES pages self-reference correctly and have `html lang="es"` (observed).
- 14 EN pages have no hreflang because they have no ES twin: `/license`, the 3 hub pages counted above once, and the 10 newer blog posts (`/blog/how-long-is-rehab`, `/blog/do-i-need-rehab`, `/blog/inpatient-vs-outpatient-rehab`, etc.). That is correct behaviour, not a defect.
- Hub pages (`/programs/`, `/es/programs/` etc.) do carry hreflang (observed on the crawled slash-less alias).

**Verdict:** on-page hreflang suffices; Google only needs one of the three methods. Adding `xhtml:link` to the sitemap is optional redundancy. It becomes worth doing if you ever move hreflang generation to a build step anyway (section 6), since the same script can emit both. Snippet in section 9.

## 4. Coverage

| Section | URLs |
|---|---|
| Home | 1 |
| Core (about, contact, faq, team, families, license, verify-insurance, mental-health, locations hub, legal, etc.) | 15 |
| /programs/ (hub + 9 program pages) | 10 |
| /treatments/ (hub + 14 treatment pages) | 15 |
| /locations/ | 11 |
| /blog/ (hub + 16 posts) | 17 |
| /es/ (hub + 43 mirror pages) | 44 |
| **Total** | **113** |

- **Crawl vs sitemap:** 113/113 sitemap URLs crawled at 200. Crawl found 1 non-sitemap page, `/amenity-map` (noindex, intentional). No orphan indexable pages.
- **Disk vs sitemap:** 118 `.html` files on disk. 5 not in sitemap, all correctly excluded: `404.html`, `amenity-map.html`, `intake-success.html`, `es/intake-success.html`, and `docs/seo-audit-2026-08-19/findings/report-source.html`. Check that last one: it is an internal audit artifact living in the deploy root. It is not linked (crawler never found it) and not in the sitemap, but if the host serves `/docs/...` it is publicly fetchable. Consider moving it out of the web root or adding it to `_headers` with `X-Robots-Tag: noindex`. (Inferred exposure — I did not fetch it.)
- **Sitemap URLs with no disk file:** 0.

## 5. Location page quality gate

11 pages — below the 30-page WARNING and 50-page HARD STOP thresholds, so no gate is tripped. Checked anyway:

| Page | Words | Title unique | H1 unique | Unique 8-gram share* |
|---|---|---|---|---|
| west-los-angeles | 1,591 | yes | yes | 0.64 |
| santa-monica | 1,628 | yes | yes | 0.64 |
| beverly-hills | 1,606 | yes | yes | 0.64 |
| brentwood | 1,583 | yes | yes | 0.64 |
| culver-city | 1,696 | yes | yes | 0.61 |
| venice | 1,586 | yes | yes | 0.62 |
| mar-vista | 1,621 | yes | yes | 0.66 |
| century-city | 1,604 | yes | yes | 0.64 |
| pacific-palisades | 1,698 | yes | yes | 0.64 |
| west-hollywood | 1,513 | yes | yes | 0.60 |
| marina-del-rey | 1,741 | yes | yes | 0.66 |

*Share of the page's 8-word shingles that appear in none of the other 10 location pages, computed on full-page text including nav/footer/CTA boilerplate — so body-only uniqueness is higher than shown (estimate). Mean pairwise shingle similarity 0.16; mean H2-set similarity 0.07 (H2s are page-specific, not templated).

**All 11 pass:** word_count >= 600 (min 1,513), 0 duplicate titles, 0 duplicate H1s, unique share at or above 60% on the conservative full-page measure. West Hollywood (0.60, lowest word count) is the one to enrich first if more location pages are added. Do not scale past ~30 without adding neighbourhood-specific content (transit, referral partners, local stats) per page.

## 6. lastmod accuracy

The host sends **no `Last-Modified` header** (observed: only `cache-control` and `content-encoding` captured across all 114 pages; `headers.txt` confirms Cloudflare with `cf-cache-status: DYNAMIC`). So the sitemap `lastmod` is the only freshness signal Google gets — which makes its accuracy matter more than usual.

Comparison against `git log` (last commits touching each file):

| URL | sitemap lastmod | git: last change | git: last non-cosmetic change |
|---|---|---|---|
| /es/faq | 2026-07-07 | 2026-08-27 (footer button) | 2026-08-20 (hero/reviews band), 2026-08-13 (ES title parity) |
| /es/ | 2026-07-07 | 2026-08-27 | 2026-08-20 |
| /locations/santa-monica | 2026-08-13 | 2026-08-27 | 2026-08-20 |
| /treatments/cbt | 2026-08-13 | 2026-08-27 | 2026-08-20 |
| /programs/php | 2026-08-13 | 2026-08-27 | 2026-08-20 |
| /blog/how-long-is-rehab | 2026-08-08 | 2026-08-27 (end-of-article prompt) | 2026-08-08 (matches) |
| /license | 2026-08-20 | 2026-08-27 | 2026-08-20 (matches) |

Findings:
- **44 ES URLs say 2026-07-07** but those files received title rewrites on 08-13 and the hero/reviews change on 08-20 (observed in git). Their lastmod is 6 weeks stale. This is the single biggest sitemap defect.
- **59 URLs say 2026-08-13**, but every page changed on 08-20 (visible hero trust band + reviews overlay). Stale by one week.
- The 08-27 "Preferred Sources" footer/article-prompt change touched all 118 files; whether to bump lastmod for a sitewide footer element is a judgement call — Google's guidance is "significant" changes only. Reasonable to skip for the footer, but the blog end-of-article prompt is in-content.
- Stale-old is less damaging than always-today (Google discounts the latter as unreliable), but stale lastmod means Google is not nudged to recrawl the ES pages after the title rewrites, which delays SERP title updates.

**Fix:** generate `lastmod` at build/commit time from git instead of hand-editing. One-liner per file:

```sh
git log -1 --format=%cs -- es/faq.html   # -> 2026-08-27
```

If you want to ignore cosmetic commits, filter with `--invert-grep --grep='^style'` (or tag content commits). The sitemap has been hand-edited in 5 commits since 07-07 (observed), so a generator is overdue.

## 7. Image / video sitemaps

Not required. `images/` is ~21 MB across `facility/`, `heroes/`, `team/`, `reviews/`, `insurance/`, `og/` (1 file). Facility and hero photos are the only candidates worth surfacing in Google Images for "rehab in Los Angeles"-type queries; team headshots, review screenshots and logos should not be. Low priority; revisit only if you add named, alt-texted facility galleries. No video content found.

## 8. Google Search Console

Cannot verify from here. The API call in `reports/gsc-sitemaps.json` returned **403 "User does not have sufficient permission for site sc-domain:goldenstate-rehab.com"** — the service account used by the audit is not a user on the property. `robots.txt` correctly references `Sitemap: https://www.goldenstate-rehab.com/sitemap.xml` (observed), so discovery works even without submission.

**Manual checks for the owner:** (a) GSC > Sitemaps: confirm `sitemap.xml` shows "Success" with 113 discovered URLs; (b) Pages report: confirm 0 "Excluded by noindex" and 0 "Page with redirect" among sitemap URLs; (c) optionally grant the audit service account Full-user access so future runs can read this.

## 9. Corrected sitemap snippet

Only two changes: real git-derived `lastmod`, and (optional) sitemap-level hreflang with the `xhtml` namespace declared. Five example URLs; the last one shows a page with no ES twin.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://www.goldenstate-rehab.com/</loc>
    <lastmod>2026-08-27</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="https://www.goldenstate-rehab.com/"/>
    <xhtml:link rel="alternate" hreflang="es" href="https://www.goldenstate-rehab.com/es/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://www.goldenstate-rehab.com/"/>
  </url>
  <url>
    <loc>https://www.goldenstate-rehab.com/es/</loc>
    <lastmod>2026-08-27</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="https://www.goldenstate-rehab.com/"/>
    <xhtml:link rel="alternate" hreflang="es" href="https://www.goldenstate-rehab.com/es/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://www.goldenstate-rehab.com/"/>
  </url>
  <url>
    <loc>https://www.goldenstate-rehab.com/faq</loc>
    <lastmod>2026-08-27</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="https://www.goldenstate-rehab.com/faq"/>
    <xhtml:link rel="alternate" hreflang="es" href="https://www.goldenstate-rehab.com/es/faq"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://www.goldenstate-rehab.com/faq"/>
  </url>
  <url>
    <loc>https://www.goldenstate-rehab.com/es/faq</loc>
    <lastmod>2026-08-27</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="https://www.goldenstate-rehab.com/faq"/>
    <xhtml:link rel="alternate" hreflang="es" href="https://www.goldenstate-rehab.com/es/faq"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://www.goldenstate-rehab.com/faq"/>
  </url>
  <url>
    <loc>https://www.goldenstate-rehab.com/locations/santa-monica</loc>
    <lastmod>2026-08-27</lastmod>
  </url>
</urlset>
```

(`2026-08-27` above is `git log -1 --format=%cs`; substitute the filtered date if you exclude the footer commit.)

## Score breakdown (84/100)

| Area | Weight | Score | Note |
|---|---|---|---|
| Format validity | 20 | 20 | Clean |
| URL hygiene / canonical parity | 25 | 25 | 113/113 exact canonical match, 0 noindex, 0 redirects |
| Coverage | 15 | 14 | Complete; -1 for the audit artifact sitting in the web root |
| lastmod accuracy | 20 | 8 | 44 ES URLs six weeks stale, remainder one week stale, hand-maintained |
| Hreflang | 10 | 8 | On-page complete and reciprocal; not mirrored in sitemap |
| Location quality gate | 10 | 9 | All pass; West Hollywood is the thinnest |

## Action list

1. **Do now:** regenerate all 113 `lastmod` values from git (`git log -1 --format=%cs -- <file>`), commit, and re-submit in GSC. Priority: the 44 `/es/` entries.
2. **Do now:** add a `lastmod` generator to the deploy step so this stops drifting.
3. **Should:** move `docs/seo-audit-2026-08-19/` out of the deploy root or add `X-Robots-Tag: noindex` for `/docs/*` in `_headers`.
4. **Optional:** emit `xhtml:link` hreflang in the sitemap from the same generator.
5. **Manual:** confirm GSC sitemap status = Success / 113 URLs; grant the audit account access.
6. **Watch:** keep location pages under ~30 unless each new one gets genuinely local content; enrich West Hollywood first.
