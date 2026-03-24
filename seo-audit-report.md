# SEO Audit Report: Golden State Rehab

**Site:** https://www.goldenstate-rehab.com/
**Date:** March 23, 2026
**Pages Audited:** 31 HTML files
**Overall Score:** ~70/100

---

## Executive Summary

| Category | Score | Status |
|----------|-------|--------|
| On-Page SEO (titles, metas, canonicals, headings) | 95/100 | EXCELLENT |
| Technical SEO (speed, security, crawlability) | 72/100 | NEEDS WORK |
| Schema/Structured Data | 80/100 | GOOD |
| Content Quality & E-E-A-T | 52/100 | POOR (for YMYL) |
| **Overall** | **~70/100** | **Solid foundation, critical content gaps** |

**Bottom line:** The site's HTML metadata and structure are excellent. The critical weaknesses are: (1) contradictory licensing/accreditation claims, (2) placeholder images instead of real photos, (3) thin treatment page content, (4) missing clinical citations, and (5) performance issues from unoptimized images and render-blocking scripts.

---

## What's Working Well

- All 31 pages have unique, keyword-optimized title tags (50-72 chars) with location targeting
- All 31 pages have unique meta descriptions (150-165 chars) with CTAs
- Perfect canonical tag implementation on all pages with absolute HTTPS URLs
- Exactly 1 H1 per page with logical H1 > H2 > H3 hierarchy
- Comprehensive image alt text on all images (decorative images properly marked aria-hidden)
- MedicalOrganization + LocalBusiness + BreadcrumbList schema on all pages
- MedicalCondition schema on all 11 treatment pages
- Person schema for 8 team members on team.html
- FAQPage schema on faq.html with 20 questions
- Complete Open Graph + Twitter Card tags on all pages
- Well-structured sitemap.xml with 31 URLs and proper priorities
- Clean robots.txt with sitemap reference
- Strong internal linking via nav, footer, breadcrumbs, and related content sections
- Medical review bylines on treatment pages
- Semantic HTML5 with proper ARIA labels

---

## CRITICAL Issues (6)

### 1. Contradictory Licensing & Accreditation Claims

**Problem:** Footer badges on all pages display "DHCS Licensed" and "Joint Commission" as earned credentials. But `about.html` explicitly states the facility is "in the process of obtaining DHCS licensing" and "pursuing accreditations from leading national bodies, including the Joint Commission."

**Impact:** HIGH — Deceptive practice on a YMYL site. Google quality raters are specifically trained to flag this type of contradiction.

**Fix:** Either update about.html to remove "in the process" language (if licensing is now active and add the DHCS license number), or remove the badges from all 31 page footers until credentials are earned.

---

### 2. All Images Are Placeholders

**Problem:** 115 image references across all 31 pages use `picsum.photos` and `images.unsplash.com`. Zero real facility, team, or treatment photos.

**Impact:** HIGH — Google's Quality Rater Guidelines flag stock imagery on YMYL healthcare sites as a negative trust indicator. Additionally: no caching control, additional DNS lookups, and if services go down the entire site loses all imagery.

**Fix:** Replace with real, self-hosted photography. Organize in `/images/team/`, `/images/facility/`, `/images/treatment/`.

---

### 3. Logo & Insurance Images Massively Oversized

**Problem:**
- `logo-icon.png`: 410KB (nav, every page, above fold)
- `logo-white.png`: 364KB (footer, every page)
- Insurance logos: ~1MB total for 12 images
- Combined: ~900KB+ added to every page load

**Impact:** HIGH — Destroys LCP score. These alone likely push LCP above 2.5s.

**Fix:** Compress logos to <20KB each. Compress insurance logos to 5-15KB each (total <100KB). Convert to WebP where possible.

---

### 4. No `width`/`height` Attributes on Any Images

**Problem:** Not a single `<img>` tag has explicit dimensions. Browsers cannot reserve space, causing CLS estimated at 0.1-0.15.

**Impact:** HIGH — CLS above the 0.1 "Good" threshold affects Core Web Vitals ranking signal.

**Fix:** Add `width` and `height` attributes to every `<img>` tag across all 31 pages.

---

### 5. Render-Blocking Lucide Script in `<head>`

**Problem:** 394KB Lucide icons library loaded synchronously in `<head>`:
```html
<script src="https://unpkg.com/lucide@1.0.1/dist/umd/lucide.min.js"></script>
```
Blocks ALL rendering until fully downloaded and parsed.

**Impact:** HIGH — Adds 200ms+ to First Contentful Paint on every page.

**Fix:** Add `defer` attribute. Also add `defer` to BuildMyAgent chat widget (113KB).

---

### 6. Missing Medical Disclaimer & Crisis Resources

**Problem:** No medical disclaimer on any page. No crisis resources (988 Lifeline, SAMHSA 1-800-662-4357).

**Impact:** HIGH — Ethical obligation and critical trust signal for YMYL healthcare.

**Fix:** Add disclaimer and crisis hotline numbers to the footer of all clinical pages.

---

## HIGH Priority Issues (7)

### 7. Treatment Pages Are Severely Thin

**Problem:** Treatment pages average ~550-600 words. Top-ranking competitors have 2,000-3,000 words with diagnostic criteria, prevalence data, subtypes, FAQs, and cited sources.

**Fix:** Expand each to 1,800-2,500 words with DSM-5 criteria, epidemiology, risk factors, treatment duration, recovery outlook, and FAQ sections.

### 8. Zero Clinical Citations

**Problem:** Not a single page cites SAMHSA, NIDA, NIMH, APA, DSM-5, or any research. Unsourced claims like "reducing cortisol and boosting neuroplasticity."

**Fix:** Add 3-5 authoritative citations per treatment page with a "Sources" footer section.

### 9. Schema openingHours Contradicts Content

**Problem:** Schema says `"Mo-Fr 09:00-17:00"` but site claims "24/7 support available" in multiple places. Footer says "Mon-Fri, 9am-5pm."

**Fix:** Replace `openingHours` with `openingHoursSpecification` reflecting actual hours. Reconcile all on-page text.

### 10. Schema Missing Required Properties

**Problem:** MedicalOrganization block missing: `logo`, `image`, `description`, `priceRange`, `medicalSpecialty`, `@id`.

**Fix:** Add all missing properties to Organization schema on all pages.

### 11. WebSite Schema Incomplete

**Problem:** Homepage WebSite schema missing `SearchAction` (enables sitelinks searchbox) and `publisher`.

**Fix:** Add `potentialAction` with SearchAction and `publisher` reference.

### 12. Inline onmouseover/onmouseout Handlers

**Problem:** 9 inline JS event handlers on index.html for hover effects. Don't work on touch devices.

**Fix:** Replace with CSS `:hover` rules in styles.css.

### 13. HTTP Not Redirecting to HTTPS

**Problem:** `http://www.goldenstate-rehab.com/` serves HTTP 200 instead of 301 to HTTPS.

**Fix:** Enable "Enforce HTTPS" in GitHub Pages repository settings.

---

## MEDIUM Priority Issues (7)

### 14. OG Images All Same Logo
All 31 pages use `logo-icon.png` for `og:image`. Should be unique 1200x630px images per page type.

### 15. Google Font Loading
5 weights loaded (400-800). No preload. Generic `sans-serif` fallback causes FOUT shift.

### 16. Footer Placeholder Links
`href="#"` on address/map and hours links across all pages. Dead links that waste crawl budget.

### 17. Missing MedicalWebPage Schema
Treatment pages have MedicalCondition but no MedicalWebPage with `reviewedBy`/`lastReviewed`.

### 18. CSS/JS Not Minified
styles.css (64KB) and main.js (16KB) are unminified. ~30-40% savings available.

### 19. Missing Explicit Robots Meta
No `<meta name="robots">` on any page. Adding enables `max-image-preview:large` for SERP.

### 20. Chat Widget Loaded Synchronously
BuildMyAgent 113KB loaded without `defer`.

---

## LOW Priority Issues (5)

### 21. Self-Host Lucide Icons
Eliminate unpkg.com third-party dependency.

### 22. AI Crawler Rules in robots.txt
No rules for GPTBot, ClaudeBot, Google-Extended.

### 23. Footer Sitemap Link Points to #
Should point to `/sitemap.xml`.

### 24. .html URL Extensions
Modern practice favors extensionless URLs. Requires platform migration.

### 25. Missing Security Headers
No HSTS, CSP, X-Frame-Options. GitHub Pages limitation — needs Cloudflare or migration.

---

## Content Quality & E-E-A-T Deep Dive

### E-E-A-T Scores (YMYL Healthcare Standard)

| Signal | Score | Key Finding |
|--------|-------|-------------|
| Experience | 35/100 | No case studies, no staff-authored voice, stock photos for all team members |
| Expertise | 40/100 | Reasonable clinical knowledge but zero citations, no verifiable credentials |
| Authoritativeness | 30/100 | No external recognition, accreditation badges displayed but not earned |
| Trustworthiness | 45/100 | Contradictory claims, no HIPAA notice, no real photos, unverified reviews |
| **E-E-A-T Composite** | **38/100** | |

### AI Content Detection Signals
- Uniform sentence structure across all pages (batch-generated signature)
- Repeated generic phrasing ("compassion and clinical expertise," "lasting recovery," "the whole person")
- No original insight or facility-specific details
- Perfect structural consistency across all treatment pages
- Content is factually correct but experientially empty

### Missing Trust Signals
- No DHCS license number displayed
- No NPI number or DEA registration
- No LegitScript certification or NAATP membership
- No integrated Google Reviews (visual badge only)
- No HIPAA compliance notice
- No medical disclaimer
- No staff photos or facility photos
- "500+ clients served" with "Founded in 2026" is contradictory

---

## Technical SEO Scores

| Category | Score | Notes |
|----------|-------|-------|
| Crawlability | 9/10 | Excellent robots.txt + sitemap |
| Indexability | 10/10 | All canonicals, titles, metas perfect |
| Security | 4/10 | HTTPS but no redirect, no security headers |
| URL Structure | 7/10 | Clean but .html extensions, index.html duplicate |
| Mobile | 8/10 | Responsive with proper viewport, minor issues |
| Core Web Vitals | 6/10 | CLS and LCP need work |
| Structured Data | 9/10 | Comprehensive but needs enhancements |
| JS Rendering | 7/10 | Static HTML, no SSR issues, but blocking scripts |
| Font Loading | 5/10 | Too many weights, no preload |
| Image Optimization | 3/10 | Placeholder images, oversized logos, no dimensions |

---

## Implementation Priority

### Phase 1: Quick Technical Wins
1. Add `defer` to scripts
2. Add image dimensions
3. Add robots meta tags
4. Fix placeholder footer links
5. Replace inline hover JS with CSS
6. Add medical disclaimer + crisis resources

### Phase 2: Schema Enhancements
7. Fix openingHours
8. Enhance MedicalOrganization properties
9. Enhance WebSite schema
10. Add MedicalWebPage to treatment pages

### Phase 3: Performance
11. Compress logo images
12. Compress insurance logos
13. Optimize font loading
14. Minify CSS/JS
15. Resolve licensing text contradiction

### Phase 4: Content (Largest Effort)
16. Expand treatment pages (1,800-2,500 words each)
17. Add clinical citations
18. Add FAQ sections with schema
19. Expand team bios
20. Replace placeholder images with real photography
