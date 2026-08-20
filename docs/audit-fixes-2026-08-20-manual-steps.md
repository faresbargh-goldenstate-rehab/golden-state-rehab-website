# Semrush audit remediation — items that need Kareem, not code

Companion to `goldenstate-rehab-audit-fixes.md`. Fixes 1–8 and 11 are implemented and
verified in the repo. The three items below cannot be closed from the codebase.

---

## FIX 10 — HSTS missing on the apex domain (Cloudflare dashboard)

**Status:** not fixed — the header is added by Cloudflare, not by this repo.

Re-confirmed live on 2026-08-20:

```
$ curl -sI https://goldenstate-rehab.com/
HTTP/2 301
location: https://www.goldenstate-rehab.com/
        (no strict-transport-security header)

$ curl -sI https://www.goldenstate-rehab.com/
HTTP/2 200
strict-transport-security: max-age=31536000; includeSubDomains; preload
```

`_headers` already sets HSTS for everything Cloudflare Pages serves, which is why
`www` is correct. The apex 301 never reaches Pages, so the file cannot fix it.

**Do this:** Cloudflare dashboard → SSL/TLS → Edge Certificates → **HTTP Strict
Transport Security (HSTS)** → Enable, with settings matching what `www` already sends:

| Setting | Value |
|---|---|
| Max Age | 12 months (31536000) |
| Apply HSTS policy to subdomains | On (`includeSubDomains`) |
| Preload | On |
| No-Sniff header | On (already sent by `_headers`) |

If the apex redirect comes from a Redirect Rule or Worker rather than the zone
setting, add the header in that rule instead.

**Verify:** `curl -sI https://goldenstate-rehab.com/ | grep -i strict-transport`
should return the header on the 301 response.

---

## FIX 9 — /amenity-map is blocked from crawling (decision needed)

**Status:** left as-is, deliberately. The audit doc says to ask before changing it.

Evidence gathered:

| Check | Finding |
|---|---|
| Block mechanism | `<meta name="robots" content="noindex">` at `amenity-map.html:7` |
| robots.txt | No `Disallow` at all — robots.txt is not the blocker |
| In sitemap.xml | No |
| Inbound internal links | 1 (`our-facility.html:346`) |
| Canonical tag | None |
| Meta description | None |
| Static text content | **11 words** — the page is a JS-rendered Google Maps embed |

**Recommendation: keep the noindex and hide the notice in Semrush.** Eleven words of
crawlable text is thin content by any measure; indexing it invites a low-quality page
into the index for no ranking upside. The missing canonical and missing description
are consistent with a page that was intentionally kept out of the index.

**If you want it indexed instead**, it needs all of: real written content about the
neighborhood (not just the embed), a unique title and meta description, a canonical
tag, removal of the noindex, a sitemap entry, and a link from `/locations`. That is a
content project, not a toggle — say the word and it can be scoped separately.

---

## FIX 6 / FIX 7 — mark the external-link flags as resolved in Semrush

Both links were handled in code, but Semrush will keep counting them until the
findings are hidden, because the blocking behaviour is on the other end.

**Joint Commission (95 pages, 403).** Confirmed still 403 to crawlers on 2026-08-20;
loads fine for humans. The link is genuine accreditation proof and was kept. It now
carries `rel="noopener noreferrer nofollow"`, so the blocked crawl no longer reads as
a site-quality signal. → **Hide this issue in the Semrush UI.**

**LA County SAPC (94 pages, status n/a).** This one was *not* a false positive. The
host `sapccms.dhcs.ca.gov` is **NXDOMAIN on every public resolver** (checked against
the local resolver, 8.8.8.8 and 1.1.1.1; `www.dhcs.ca.gov` resolves fine as a
control). The link was genuinely dead, not bot-blocked.

It has been repointed sitewide to the live DHCS directory page:

```
https://www.dhcs.ca.gov/providers-partners/directories-for-substance-use-disorder-services/
```

Verified: resolves, returns HTTP 200, and is indexed in search under the title
"Directories for Substance Use Disorder Services | DHCS". Visible link text
("Verify with DHCS ↗") was not changed. Note that `dhcs.ca.gov` sits behind Imperva
and serves a challenge page to non-browser clients, so the page body could not be
fetched programmatically — **worth one click in a real browser before the next crawl.**

---

## One thing worth a look, outside the audit's scope

`js/main.min.js` is **not** a byte-clean minification of `js/main.js` — regenerating it
with esbuild produces a different file (11,735 B vs the committed 11,673 B). That is
either a different minifier or the two have drifted apart. It was deliberately left
untouched, since regenerating it would ship an unreviewed JS change to all 114 pages.
`scripts/minify_assets.py` documents this and excludes the pair.

If `main.js` has edits that never made it into `main.min.js`, those edits are not live.
Worth reconciling separately.
