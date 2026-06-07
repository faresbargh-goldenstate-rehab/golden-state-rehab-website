# Golden State Rehab — SEO Audit Report

**Audited:** 2026-06-07 · 40 pages (local build, latest changes) · Business type: **Local Service — Healthcare (behavioral health / addiction treatment)**, West Los Angeles

## Overall SEO Health Score: **91 / 100** 🟢

| Category | Weight | Score | Notes |
|---|---|---|---|
| Technical SEO | 22% | 92 | robots ✓, clean sitemap ✓, canonicals on all pages ✓, `_redirects` ✓, `llms.txt` ✓. Pending: apex (non-www) 404. |
| Content Quality | 23% | 90 | Strong E-E-A-T; no thin pages; cited sources; cornerstone content. |
| On-Page SEO | 20% | 90 | One H1/page ✓, OG ✓, internal linking ✓; a few long titles. |
| Schema | 10% | 98 | Comprehensive, 100% valid, all @id refs resolve. |
| Performance (CWV) | 10% | 85 | Mobile 92/100 (lab); images optimized. No field data yet. |
| AI Search Readiness | 10% | 88 | FAQ schema + rich schema + llms.txt. |
| Images | 5% | 96 | 100% alt coverage (539 images), all team photos <200 KB. |

---

## Executive Summary

The site is in **strong technical and on-page health** — well above typical for a new behavioral-health site. Structured data, internal linking, image hygiene, and E-E-A-T signals are excellent. The gating factor on growth is **off-site authority (Domain Rating 0)** and **local presence (GBP + citations)** — neither is an on-page problem.

### Top 5 strengths
1. **Schema** — Organization/LocalBusiness + MedicalClinic + WebSite + Breadcrumb + FAQ + MedicalTherapy/Condition + Person across the site; 0 validation errors; all references resolve.
2. **E-E-A-T** — Real, credentialed Medical Director (Dr. Eric Chaghouri, MD) bylined as reviewer; real clinical team with credentials; authoritative external citations (NIMH, APA, SAMHSA, CMS).
3. **Image hygiene** — 100% alt-text coverage across 539 images; team photos optimized <200 KB.
4. **Internal linking** — Global nav + footer link every page; cornerstone pages cross-link to treatments/programs/verify-insurance.
5. **Clean URLs + sitemap** — Extensionless canonicals, sitemap matches, og:url = canonical.

### Top 5 priorities
1. **Apex domain returns 404** (goldenstate-rehab.com) — *Critical, owner action* (Cloudflare Custom Domains).
2. **Domain Rating 0 / backlinks** — *High, off-site* (promote linkable assets; digital PR).
3. **Google Business Profile + citations** — *High, off-site* (the 64%-missing slide).
4. **No real reviews** — *High, off-site* (collect Google reviews to legitimately restore a rating badge).
5. **A few long title tags** — *Low, on-page* (blog posts + locations, 70–83 chars).

---

## Technical SEO — 92
- ✅ `robots.txt` allows all + references sitemap.
- ✅ `sitemap.xml` — clean extensionless URLs, all pages covered, no `.html` redirects.
- ✅ Canonical on 40/40 pages; `og:url` = canonical on all.
- ✅ `_redirects` handles `/blog → /blog/`; www-force staged for when apex is attached.
- ✅ `llms.txt` added (AI-crawler guidance).
- ⚠️ **Apex (non-www) 404** — add `goldenstate-rehab.com` to Cloudflare Pages → Custom Domains.
- ℹ️ CWV: mobile 92/100 (agency lab). No field (CrUX) data — connect Google API for real numbers.

## Content Quality — 90
- ✅ No thin pages (min ~329 / median ~750 / cornerstone 2,000–3,900 words).
- ✅ E-E-A-T: medical-reviewer byline, real credentialed team, cited authorities.
- ✅ Cornerstone assets: CBT, DBT, "Cost of Rehab in LA" guide, 3 blog posts.
- ◻️ Opportunity: deepen thinner program pages; build a content cluster.

## On-Page SEO — 90
- ✅ Exactly one H1 per page; clear H2 structure.
- ✅ Meta descriptions on all; 3 over-length trimmed this audit.
- ⚠️ 7 titles 70–83 chars (4 blog posts, locations, cbt, dbt) — SERP truncation only. Low priority.
- ✅ Internal linking via global nav, footer, contextual links.

## Schema — 98
- ✅ Full entity coverage; 0 JSON-LD parse errors; 0 unresolved @id references.
- ◻️ Optional: `Service` schema on program pages; `Review`/`aggregateRating` once **real** reviews exist (never fabricate).

## Performance — 85
- ✅ Static, CDN-served; optimized images; no heavy frameworks.
- ℹ️ Connect Google PageSpeed/CrUX for field INP/LCP/CLS.

## Images — 96
- ✅ 100% alt coverage (539 `<img>`); team photos 73–135 KB.
- ◻️ Optional: WebP/AVIF for hero images; explicit width/height everywhere (CLS).

## AI Search Readiness (GEO) — 88
- ✅ FAQPage schema, rich entity schema, `llms.txt`.
- ◻️ Opportunity: more Q&A-structured passages; definition blocks.

## Local SEO (off-page heavy)
- ✅ On-site NAP consistent: (424) 208-3120 · 1964 Westwood Blvd, Ste 425, LA, CA 90025.
- ✅ MedicalClinic + LocalBusiness schema (geo, hasMap, areaServed); Locations page live.
- ⚠️ **Off-site (agency/owner):** GBP optimization, unique tracking number, citation building (64% missing), reviews. These drive the map pack — not code changes.

---
*Fixes applied during this audit: trimmed 3 long meta descriptions; added `llms.txt`.*
