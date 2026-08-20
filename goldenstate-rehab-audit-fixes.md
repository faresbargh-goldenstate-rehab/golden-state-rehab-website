# Golden State Rehab — Semrush Audit Remediation Plan

**Site:** www.goldenstate-rehab.com
**Audit date:** Aug 20, 2026 (Semrush Site Audit, 100 pages crawled)
**Current score:** Site Health 95% · 14 Errors · 198 Warnings · ~190 Notices
**Target:** 99–100% Site Health on next crawl

## Read this first (context for the agent)

The ~340 flagged items collapse into **10 root causes**. Most flags are the same sitewide element counted once per page (footer/trust-bar links, 3 static JS files) or the same template bug repeated across blog posts. Fix the templates and shared components — do not patch pages one by one.

The site is served as prerendered/static HTML behind Cloudflare, with manually version-busted static assets (`/i18n.js?v=3` style). Adapt file paths to however this repo is actually structured — use the grep map below to locate everything.

**Grep map (run these first to locate the code):**

| Pattern | What it finds | Fix # |
|---|---|---|
| `reviewedBy` | Blog post JSON-LD template (invalid schema) | 1 |
| `inLanguage` | Spanish locations page JSON-LD (invalid schema) | 2 |
| `dhcs-license.jpg` | License anchor wrapping a raw .jpg (hero + footer) | 5 |
| `jointcommission.org` | Joint Commission badge link (403 to crawlers) | 6 |
| `sapcc` | LA County SAPC directory link (unreachable to crawlers) | 7 |
| `i18n.js` / `contact.js` / `intake.js` | Unminified static JS + version mismatch | 4 |
| `amenity-map` | Page blocked from crawling (robots/noindex) | 9 |

**Rules for all fixes:**
- Don't change any visible copy, phone numbers, or CTAs unless a fix explicitly says so.
- This is addiction-treatment content: never introduce outcome guarantees, success rates, or superlative medical claims while editing.
- After each fix, run the verification step listed. Don't mark a fix done without it.

---

## FIX 1 — Invalid structured data: `reviewedBy` on Article schema (P0 — the only Errors in the audit)

**Semrush flag:** "14 structured data items are invalid" — 12 of the 14 are `ARTICLE` items with `1 field: reviewedBy`.

**Affected pages (all from the same blog post template):**
- /blog/can-family-come-to-rehab-visits
- /blog/can-i-work-while-in-rehab
- /blog/cbt-vs-dbt-which-is-right
- /blog/cost-of-rehab-in-los-angeles
- /blog/do-i-need-rehab
- /blog/does-insurance-cover-rehab-in-california
- /blog/does-medi-cal-cover-rehab-in-california
- /blog/first-week-of-outpatient-rehab
- /blog/how-long-is-rehab
- /blog/how-much-does-rehab-cost
- /blog/questions-to-ask-a-rehab-center
- /blog/terrified-to-ask-for-help

**Root cause:** `reviewedBy` is a schema.org property of `WebPage` (and its subtypes like `MedicalWebPage`) — it is **not valid on `Article`/`BlogPosting`**. Validators flag it as an unrecognized field on that type. Also check whether the value is a bare string (e.g., `"reviewedBy": "Ari Labowitz, LMFT"`) — that's invalid on any type; it must be a `Person` or `Organization` object.

**Fix (edit the blog post schema template once, not 12 pages):**

Keep the medical-reviewer signal — it's valuable E-E-A-T for this niche — but move it to a `MedicalWebPage` node in an `@graph`, and reference it from the Article:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MedicalWebPage",
      "@id": "https://www.goldenstate-rehab.com/blog/{slug}#webpage",
      "url": "https://www.goldenstate-rehab.com/blog/{slug}",
      "name": "{page title}",
      "inLanguage": "en",
      "lastReviewed": "{YYYY-MM-DD}",
      "reviewedBy": {
        "@type": "Person",
        "name": "{reviewer name + credential}",
        "jobTitle": "{e.g., Clinical Director}",
        "url": "https://www.goldenstate-rehab.com/team"
      }
    },
    {
      "@type": "BlogPosting",
      "@id": "https://www.goldenstate-rehab.com/blog/{slug}#article",
      "isPartOf": { "@id": "https://www.goldenstate-rehab.com/blog/{slug}#webpage" },
      "mainEntityOfPage": { "@id": "https://www.goldenstate-rehab.com/blog/{slug}#webpage" },
      "headline": "{...}",
      "author": { "...unchanged..." },
      "publisher": { "...unchanged..." },
      "datePublished": "{...}",
      "dateModified": "{...}"
    }
  ]
}
```

Key point: **delete `reviewedBy` from the Article/BlogPosting node entirely.** Preserve all other existing fields (headline, image, author, publisher, dates) exactly as they are. If Spanish blog posts (`/es/blog/*`) share this template, they're fixed by the same change.

**Verify:** Paste 2–3 fixed pages into https://validator.schema.org and Google's Rich Results Test. Zero errors on the Article node; `reviewedBy` present only on the MedicalWebPage node.

---

## FIX 2 — Invalid structured data: `inLanguage` on LocalBusiness / Organization (P0)

**Semrush flag:** The other 2 of the 14 invalid items — `LOCAL_BUSINESS` and `ORGANIZATION` schemas on **/es/locations**, each flagged for `1 field: inLanguage`.

**Root cause:** `inLanguage` is a `CreativeWork` property. It is not valid on `Organization` or `LocalBusiness`. (Also confirm the value is BCP-47 format — `"es"`, not `"Español"` — wherever it legitimately appears.)

**Fix:**
1. Grep the /es/locations page (or the Spanish layout that injects its schema) for `inLanguage`.
2. **Remove `inLanguage` from the LocalBusiness and Organization nodes.** Keep it on `WebPage`/`Article` nodes with value `"es"`.
3. If you want to keep signaling bilingual service in schema, the valid ways are:
   - `"knowsLanguage": ["en", "es"]` on the Organization node, and/or
   - `"availableLanguage": ["English", "Spanish"]` on its `contactPoint`.
4. Check whether the English /locations page (and other pages reusing these nodes) has the same bug — only /es/locations was flagged, but fix it at the source component.

**Verify:** validator.schema.org on /es/locations — 0 errors on both nodes.

---

## FIX 3 — Duplicate `<title>` and `<h1>` on 5 blog posts (P1)

**Semrush flag:** "5 pages have duplicate H1 and title tags."

**Root cause:** These 5 posts are missing the `| Golden State Rehab` brand suffix that every other page's title has, so `<title>` exactly equals `<h1>`.

**Fix:** Keep every `<h1>` exactly as-is. Rewrite only the `<title>` (and matching `og:title` / `twitter:title` if they mirror it). Suggested titles — adjust if you can do better, but each must (a) differ from the H1, (b) stay unique across the site, (c) stay ≤ ~65 characters:

| Page | H1 (do not change) | New `<title>` |
|---|---|---|
| /blog/can-i-work-while-in-rehab | Can I Work While in Rehab? Yes, and Here Is How | Working While in Rehab: Know Your Options \| Golden State Rehab |
| /blog/cost-of-rehab-in-los-angeles | Rehab Costs in Los Angeles: 2026 Price Breakdown | Cost of Rehab in Los Angeles: 2026 Guide \| Golden State Rehab |
| /blog/do-i-need-rehab | Do I Need Rehab? 10 Honest Signs It Is Time for Help | 10 Signs It's Time for Rehab \| Golden State Rehab |
| /blog/how-much-does-rehab-cost | How Much Does Rehab Cost and What Does Insurance Cover? | Rehab Cost & What Insurance Covers \| Golden State Rehab |
| /blog/questions-to-ask-a-rehab-center | 15 Questions to Ask a Rehab Center Before You Choose | Choosing a Rehab: 15 Questions to Ask \| Golden State Rehab |

Note the two cost articles must keep clearly distinct titles from each other (the table above does this — one is LA-specific pricing, one is cost + insurance).

**Verify:** For each page, `<title> !== <h1>`, no two titles on the site identical, `headline` in the Article schema still matches the H1 (update if the schema headline was pulling the title).

---

## FIX 4 — Unminified JavaScript/CSS + stale version param (P1)

**Semrush flag:** "99 issues with unminified JavaScript and CSS files" — every flag traces to **3 files** loaded sitewide: `/i18n.js`, `/contact.js` (contact + es/contact), `/intake.js` (verify-insurance pages).

**Also found:** the homepage loads `i18n.js?v=2` while every other page loads `?v=3` — a stale cache-busting param, meaning homepage visitors can get an outdated cached script.

**Fix:**
1. Locate the source files (likely in the static/public directory).
2. Keep readable sources in the repo (e.g., `assets/src/*.js`) and add a minify step that outputs the served files, e.g.:
   ```bash
   npx esbuild assets/src/i18n.js assets/src/contact.js assets/src/intake.js \
     --minify --outdir=public --allow-overwrite
   ```
   Wire this into the existing build/deploy script so it can't be skipped. If there's no build pipeline at all, a one-time terser/esbuild pass on the served files is acceptable — but commit the unminified sources somewhere.
3. Check the site's CSS file(s) the same way; minify if they're shipped raw.
4. Bump **all** references to one consistent new version (e.g., `?v=4`) — including the homepage's stale `?v=2`. Grep for `i18n.js?` to catch every reference.

**Verify:** `curl -s https://www.goldenstate-rehab.com/i18n.js | head -c 500` shows minified output (no comments/indentation); grep the built HTML to confirm every page references the same `?v=` value.

---

## FIX 5 — License anchor points at a raw .jpg (P2, 95 pages)

**Semrush flag:** "95 resources are formatted as page link" — the trust-bar and footer element `DHCS Lic. #191643AP` is an `<a href="/images/dhcs-license.jpg">`. An `<a>` should target a page, not an image file; crawlers follow it into a dead-end resource.

**Fix (pick one — Option A preferred):**
- **Option A (best):** Create a tiny `/license` page that displays the certificate image (`<img src="/images/dhcs-license.jpg" alt="California DHCS license certificate #191643AP for Golden State Rehab">`) plus one line of text and an outbound link to the state's license-verification search. Point the trust-bar/footer anchors at `/license`. This clears the flag and adds a crawlable trust page.
- **Option B (fastest):** Open the certificate in a lightbox/modal (JS) instead of an `<a href>` navigation, or drop the link and show the badge as a plain `<img>` with the license number as text.

This element renders on all ~95 pages from one shared component — fix it once there.

**Verify:** `grep -r 'href="/images/dhcs-license.jpg"'` in the built output returns nothing; the certificate is still viewable by users.

---

## FIX 6 — jointcommission.org returns 403 to crawlers (P2, 95 pages — mostly a false positive)

**Semrush flag:** "95 links to external pages or resources returned a 403 HTTP status code" — the Joint Commission Gold Seal badge (hero trust bar + footer) links to `https://www.jointcommission.org/`, which blocks bots (403) but loads fine for humans.

**Fix:** This is largely a crawler false positive and the link is legitimate accreditation proof — do **not** remove it. Do these two things:
1. Add `rel="noopener nofollow"` and `target="_blank"` to the badge link (external trust badge; nofollow is appropriate and stops crawl attempts from being treated as site-quality signals).
2. Optional upgrade: if the facility has a Joint Commission Quality Check profile URL, link the badge there instead of the homepage — it's more specific proof. Verify any replacement URL returns 200 for a normal browser UA before shipping.

Then mark this issue as "hidden/resolved" in Semrush so it stops counting against Site Health (Kareem does this in the Semrush UI — note it in your summary).

**Verify:** Badge still visible and clickable on desktop + mobile; link has the rel attributes.

---

## FIX 7 — Broken external link: LA County SAPC provider directory (P1, 94 pages)

**Semrush flag:** "94 external links are broken" — every instance is the same URL, truncated in the report as `https://sapcc…yofProviders/` (the LA County SAPC "Directory of Providers", likely on `sapccis.ph.lacounty.gov`), returning status `n/a` (no response to the crawler). It appears on every page **except** the homepage, so it lives in a shared component (footer or a compliance line).

**Fix:**
1. `grep -r "sapcc"` to find it, then test the exact URL in a real browser / `curl -A "Mozilla/5.0..." -I`.
2. **If it loads for humans:** it's a bot-blocked government site. Keep it if it's doing compliance/trust work, add `rel="noopener nofollow"`, and hide the issue in Semrush — same treatment as Fix 6. Alternatively, swap it for a crawlable equivalent such as the California DHCS licensed/certified SUD facility search page (verify whatever URL you choose returns 200 via curl before shipping).
3. **If it's genuinely dead** (county sites reorganize often): replace it with the current SAPC/DHCS directory URL, or remove the link and keep plain text.

**Verify:** The chosen URL returns 200 in a browser; grep confirms one consistent target sitewide.

---

## FIX 8 — Paragraphs too long on 2 program pages (P2)

**Semrush flag:** "2 pages require content optimization — Paragraphs are too long":
- /programs/iop
- /programs/telehealth

**Fix (content edit, not code):**
- Split any paragraph over ~4 sentences / ~90 words into 2–3 shorter paragraphs.
- Where a long paragraph is secretly a list (benefits, schedule items, who-it's-for), convert it to a `<ul>` or add an `<h3>` subhead and break the section up.
- Do not change clinical meaning, remove internal links, or add new claims. No outcome guarantees or statistics that aren't already there.
- Keep the existing keyword targeting (these pages rank for IOP/telehealth LA terms — restructure, don't rewrite).

**Verify:** No `<p>` on either page exceeds ~100 words; all pre-existing internal links still present.

---

## FIX 9 — /amenity-map blocked from crawling (P2 — needs a human decision)

**Semrush flag:** "1 page is blocked from crawling" — `/amenity-map` ("Neighborhood & Amenities Near Golden State Rehab"), blocked via robots.txt or a noindex meta tag.

**Fix:**
1. Determine the mechanism: check `robots.txt` for a `Disallow` covering it, and the page `<head>` for `<meta name="robots" content="noindex">`.
2. **Decision point — ask Kareem before changing:**
   - If the block was intentional (thin interactive map embed not meant to rank): leave it, and hide the notice in Semrush.
   - If unintentional: remove the block, make sure the page has a unique title/meta description, add it to the sitemap, and link to it from the /locations page. A neighborhood/amenities page is a genuinely useful local-SEO asset if it has real content.

**Verify:** Whichever path is chosen, robots.txt and the meta tag agree with it, and the sitemap matches.

---

## FIX 10 — HSTS missing on the apex domain (P2 — Cloudflare dashboard task, not code)

**Semrush flag:** "1 subdomain doesn't support HSTS" — `https://goldenstate-rehab.com/`.

**Confirmed live behavior (Aug 20, 2026):**
- `https://www.goldenstate-rehab.com` → sends `strict-transport-security: max-age=31536000; includeSubDomains; preload` ✅
- `https://goldenstate-rehab.com` → 301 to www via Cloudflare **without** any HSTS header ❌

**Fix:** The apex 301 is served by Cloudflare, so the header must be added there: Cloudflare dashboard → SSL/TLS → Edge Certificates → **HTTP Strict Transport Security (HSTS)** → enable with max-age 12 months, includeSubDomains, preload (matching what www already sends). If the redirect is instead produced by an origin rule/worker, add the header in that rule. This is likely outside the repo — if you (the agent) can't reach it, output it as a manual step for Kareem with the exact settings above.

**Verify:** `curl -sI https://goldenstate-rehab.com/ | grep -i strict-transport` returns the header on the 301 response.

---

## FIX 11 — /es/our-facility has only one incoming internal link (P2)

**Semrush flag:** "1 page has only one incoming internal link" — `/es/our-facility` (Nuestras Instalaciones).

**Root cause:** The English facility page gets links from the nav, footer, and the homepage facility gallery; the Spanish equivalent isn't mirrored.

**Fix:** Mirror the English linking pattern on the Spanish side — add "Nuestras Instalaciones" links in:
1. The Spanish nav (under the About/Nosotros group),
2. The Spanish footer,
3. The /es/ homepage facility section (gallery captions/links, like the English homepage does),
4. Optionally one contextual link from /es/programs/ pages.

Target: at least 3–5 incoming internal links.

**Verify:** Grep built /es/ pages for `href="/es/our-facility"` — count ≥ 3 distinct source pages.

---

## Passing checks — do not regress these

The audit shows these all clean; make sure no fix breaks them: canonicals (0 issues), meta descriptions (0 missing/duplicate), alt attributes (0 missing), hreflang (0 issues), sitemap.xml valid and referenced in robots.txt, robots.txt valid, llms.txt present, 0 broken internal links/images, 0 4xx/5xx. In particular: don't touch canonical logic while editing titles (Fix 3), and don't break hreflang pairs while editing Spanish pages (Fixes 2, 11).

---

## Suggested execution order

1. **Fix 1 + 2** (schema templates) — clears all 14 Errors.
2. **Fix 3** (5 title tags) — quick, isolated.
3. **Fixes 5 + 6 + 7 together** — they all live in the same trust-bar/footer components; one PR.
4. **Fix 4** (minify + version bump) — clears 99 warnings.
5. **Fix 11** (Spanish internal links).
6. **Fix 8** (IOP + telehealth paragraph restructure).
7. **Fix 10** (Cloudflare HSTS) and **Fix 9** (/amenity-map) — flag both for Kareem: one is a dashboard toggle, one is a decision.
8. Deploy, then re-run the Semrush audit and hide the confirmed false positives (403 Joint Commission; SAPC link if verified live).

## Final verification checklist

- [ ] validator.schema.org clean on 3 blog posts + /es/locations
- [ ] 5 blog titles differ from H1s, all titles unique sitewide
- [ ] i18n.js / contact.js / intake.js served minified, single `?v=` everywhere
- [ ] No anchor targets `/images/dhcs-license.jpg`; certificate still viewable
- [ ] Joint Commission + SAPC links: rel attrs added, working for humans
- [ ] No paragraph > ~100 words on /programs/iop and /programs/telehealth
- [ ] ≥3 internal links to /es/our-facility
- [ ] HSTS header present on apex 301 (after Cloudflare change)
- [ ] Semrush re-crawl: 0 Errors, Site Health ≥ 99%
