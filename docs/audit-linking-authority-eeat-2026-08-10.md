# Golden State Rehab — Internal Linking, Topical Authority & E-E-A-T Audit

**Date:** August 10, 2026
**Scope:** 48 indexable English pages (106 HTML files total incl. Spanish mirror and helpers)
**Method:** Full-site crawl of the static HTML source. In-body links analyzed separately from sitewide nav/footer boilerplate (~140 boilerplate links per page excluded). Word counts are body-only (hero through end of content). Duplication measured by 6-gram shingle overlap.

---

## Executive Summary

| Dimension | Grade | One-line verdict |
|---|---|---|
| **Internal Linking** | **B–** | Real hubs, descriptive anchors, zero broken links — but the homepage passes no contextual equity to any money page, and the blog is a one-way spoke. |
| **Topical Authority** | **C+** | The condition and level-of-care axes are genuinely well built (~55% of the vertical), but the three axes competitors monetize — insurance-by-carrier, cost, and audience — have zero pages. |
| **E-E-A-T** | **C+** | Strong medical-review infrastructure and real staff with lived experience, undermined by an unsourced outcome claim in the H1, no license numbers, unverifiable reviews, and no accreditation beyond the DHCS license. |

**The five findings that matter most:**

1. **"100+ Recoveries" in the homepage H1** is an unsourced, undefined outcome claim that contradicts `our-story.html` (which frames the same number as "Clients served"). For a YMYL addiction-treatment site this is the single highest regulatory and trust risk on the site.
2. **The homepage links to nothing.** Its 31 in-body anchors go to the team page (13×), verify-insurance (7×), and three utility pages. Zero contextual links to any treatment, program, location, or blog page — the site's strongest page passes no equity into any page that ranks.
3. **The insurance/cost/audience content axes don't exist.** Carrier logos appear on 46 pages with zero carrier content behind them. No `/insurance` hub, no cost page, no detox page, no heroin/benzo pages, no who-we-treat silo. The buildout plan calls these Phase 1–3; almost none of it is built.
4. **Social proof is unverifiable.** The Google review wall links to image files, not the Google Business Profile; "5.0 on Google" carries no review count; there is zero Review/AggregateRating schema sitewide; staff license numbers are withheld ("available on request") despite being public record.
5. **The blog can't support the site topically.** Service pages link to blog posts exactly 5 times sitewide — 4 of them the same recycled sentence pointing at the same post. Four of six posts have 1–4 contextual inbound links; five of six have no medical reviewer.

---

## 1. Internal Linking — B–

### 1.1 What's working

- **918 in-body internal anchors** across 60 English pages; median ≈ 12 contextual links per page, mean ≈ 15.
- **Anchor text is strong:** only 19 of 918 anchors (2.1%) are generic ("Get Started," "Learn More," "View all"). The rest are descriptive and keyword-rich ("guide to outpatient drug rehab in Los Angeles," "whether insurance covers rehab in California").
- **Hubs are real hubs.** `treatments/index.html` (32 out-links, chip nav + unique 15–25-word card descriptions for all 15 children), `programs/index.html` (21), `locations.html` (23, unique city descriptions), `mental-health.html` (27, functions as a secondary hub). `faq.html` is the densest contextual linker on the site (50 contextual out-links).
- **Zero broken internal links** across all 60 pages (nav, footer, and body verified; extensionless URLs resolve via `_redirects`).
- **Treatment → treatment cross-linking is good** (98 links): every treatment page carries a 3-card related module plus prose links (opioid → fentanyl, cocaine → meth, etc.).
- **Blog → service linking is dense:** 29 in-body links from posts into programs/treatments with descriptive anchors.
- **hreflang** present on 57 of 61 English pages with a working EN↔ES cross-link structure.

### 1.2 Orphans and near-orphans

| Page | In-body inbound | Notes |
|---|---|---|
| `amenity-map.html` | 0 | Only reachable via iframe embeds — invisible to the link graph |
| `intake-success.html` | 0 | Form thank-you (acceptable) |
| `terms-and-conditions.html` | 0 | Footer-only (acceptable) |
| `programs/outpatient-rehab.html` | 1 | **Worst-supported valuable page on the site** — absent from nav, footer, hreflang, and the ES mirror, despite 1,138 body words targeting the head term |
| `blog/does-medi-cal-cover-rehab-in-california.html` | 1 | Blog index only |
| `faq.html`, `our-story.html`, `our-facility.html` | 1 each | Sole source: `about.html` |
| `treatments/sex-addiction.html`, `treatments/prescription-drugs.html` | 1 source each | Treatments index only |

### 1.3 The homepage problem

`index.html` has **zero in-body links to any treatment, program, location, or blog page.** Its 31 body anchors resolve to: `team` ×13 (staff carousel), `verify-insurance` ×7, `about`, `spanish-speaking-treatment`, `espanol`, and `tel:` links. The "why us" and facility card grids (`index.html:234–252, 283–290`) are plain `<div>`s with no anchors. The site's highest-authority page passes no contextual equity into any page meant to rank.

### 1.4 The blog is a one-way spoke

- Blog → service: 29 links, well-anchored.
- **Service → blog: 5 links sitewide, 4 of which are the same recycled insurance-parity sentence pointing at the same post** (`does-insurance-cover-rehab-in-california`).
- Zero inbound from services to: `cost-of-rehab-in-los-angeles`, `first-week-of-outpatient-rehab`, `cbt-vs-dbt-which-is-right`, `terrified-to-ask-for-help`, `does-medi-cal-cover-rehab`.
- Obvious misses: `programs/iop.html` never links to the "first week of outpatient" post; `treatments/cbt.html`/`dbt.html` never link to the CBT-vs-DBT post; `verify-insurance.html` (149 inbound links — the site's biggest link sink) has **zero in-body out-links**, including to the three insurance/cost posts.

### 1.5 Cross-silo link matrix (in-body only)

| From ↓ To → | blog | locations | programs | treatments | root pages |
|---|---|---|---|---|---|
| **blog** | 34 | 0 | 18 | 11 | 24 |
| **locations** | 0 | 33 | 83 | **6** | 104 |
| **programs** | 2 | 0 | 98 | **5** | 80 |
| **treatments** | 2 | **0** | 53 | 98 | 79 |
| **root pages** | 1 | 11 | 30 | 32 | 108 |

Structural holes: treatments → locations is zero; locations → treatments is 6 links total across 11 city pages (8 city pages link to no treatment at all); programs are a closed silo (98 internal, 5 out to treatments).

### 1.6 Smaller issues

- Link equity is lopsided: `dual-diagnosis` receives 29 in-body links from 23 sources; `sex-addiction` and `prescription-drugs` get 2 each from 1 source.
- `treatments/cbt.html:180,186` — "OCD & Intrusive Thoughts" and "Insomnia & Sleep" cards both link to `dual-diagnosis`, which is neither an OCD nor a sleep page (anchor/target mismatch).
- Card-style links swallow entire cards (H3 + paragraph) into one 15–30-word anchor, diluting keyword signal.
- hreflang missing on `programs/outpatient-rehab.html` (a real indexable page), plus `amenity-map`, `intake-success`, `404`.
- `contact.html:201` — malformed `sms:` query string (`?&body=`).

---

## 2. Topical Authority — C+

### 2.1 Content depth: adequate, not authoritative

Body-only word counts (nav/footer/logo-strip excluded):

| Page type | Range | Verdict |
|---|---|---|
| Treatments (14) | 678–2,036; **12 of 14 sit at 670–930** | Mid-depth. Only `cbt` (1,834) and `dbt` (2,036) reach authority depth vs. the 1,500-word competitive bar |
| Programs (9 + hub) | 827–1,157; **hub = 351** | Solid; the hub is the thinnest page in its own silo |
| Locations (11) | 1,095–1,287 | Consistent and adequate |
| Blog (6) | 922–2,304 | Three commercial-intent posts substantive; three support posts ~1,000 |
| Key standalone | faq 2,371 · families 1,578 · team 1,587 · index 1,290 · mental-health 1,073 | Fine |
| Thin | about 768 · our-story 765 · locations.html 771 · contact 523 | Thin |

The July audit's "460–615-word treatment pages" finding has been fixed — but fixed to ~800, not to 1,500.

### 2.2 Duplication: not a problem

6-gram shingle overlap, body-only: treatments median **1.8%** (worst pair 15.1%), programs **2.3%**, locations **12.4%** (shared program-card block + directions template — acceptable for geo pages, but the highest-risk set). These are hand-written pages, not stamped templates. The residual overlap on addiction pages is a verbatim SB 855 insurance-parity paragraph repeated on 5 pages, plus shared CTA/detox-referral boilerplate.

### 2.3 Topic gaps

**Absent entirely (zero pages, zero meaningful mentions):**

- Insurance carrier pages — Aetna/Cigna/Anthem/BCBS/UHC appear on 46 pages **as logo images only**, never as content. No `/insurance` hub. (Buildout plan Phase 2, "single highest-ROI category" — 0 of 13 pages built.)
- Cost/pricing page (only the blog post exists)
- `/who-we-treat` audience silo — professionals, executives, LGBTQ+, students, veterans, first responders (0 of 9 planned pages built)
- `/levels-of-care` hub — the phrase appears on 21 pages; no page owns it
- Marijuana/cannabis, gambling, adolescent/teen, DUI/court-mandated content

**Mentioned but lacking a dedicated page (content already exists in fragments):**

| Topic | Evidence | Gap |
|---|---|---|
| Detox | ~85 mentions across 25 files; referral messaging on every location page | No `/programs/detox` page — the buildout plan's "single highest-priority new page" |
| Heroin | 8 mentions in opioid/fentanyl/med-mgmt | No page for a top-volume term |
| Benzodiazepines/Xanax | 12 mentions in prescription-drugs | No page despite high detox-risk search demand |
| MAT / Suboxone / Vivitrol | 46 mentions, clinically well covered | No standalone page |
| EMDR | 9 files reference it | No page — structural asymmetry: CBT and DBT each have 1,800–2,000-word pages in the same nav group |
| PHP vs IOP | Covered inside faq/php/outpatient-rehab | No standalone comparison page |
| Family therapy | `families.html` is an audience page | No family-therapy *program* page |
| Aftercare / relapse prevention | Inside alumni page | No dedicated page |

### 2.4 Cluster structure

The nav defines a real hub-and-spoke skeleton (About / Programs / Treatments with sub-groups / Locations / Blog), but **the hubs are the weakest pages in their own clusters** (programs hub: 351 words; treatments hub: 672; locations: 771), and there is no hub at all for insurance, cost, levels-of-care, or who-we-treat.

Contextual inbound leaders: verify-insurance 57 · iop 55 · team 54 · php 49 · telehealth 46. Blog posts: 7 / 5 / 4 / 3 / 3 / 1. The blog feeds the money pages but receives no topical reinforcement back — it's a terminal leaf, not a supporting cluster.

### 2.5 FAQ & AI-search readiness

- **43 FAQPage schema blocks; 239 Question/Answer pairs** — near-complete on money pages (29 Q&As on faq.html across 7 categories; 4–8 per treatment/program/location page).
- Missing FAQ schema: `programs/index`, homepage, about, team, contact, and 3 of 6 blog posts.
- Outside FAQ accordions, treatment/location body headings are all declarative — zero question-format H2s — which confines extractable Q&A passages to the accordion.
- FAQ page doesn't cover the questions users actually ask: "do you take [carrier]," "what is Suboxone," "do you treat teens," "do you do EMDR," "how long does X stay in your system."
- `llms.txt` is well-formed, current, and E-E-A-T-dense (license number, medical director, full URL inventory).

### 2.6 Differentiators vs. liabilities

**Genuinely differentiated:** real local specificity on location pages (transit directions, neighborhood framing — not city-name swaps); honest "we do not provide detox on site" disqualification copy; full 47-page Spanish mirror; 40 real facility photos; the alum-authored first-person blog post; the amenity-map widget (unique, but 10 crawlable words — zero SEO value as built).

**Liabilities:** uncited stat tiles — `cbt.html` "60–80% Response Rate" and `dbt.html` "50% Reduction in Self-Harm" with no source on the page; zero original/proprietary data (no outcomes, no GSR-specific cost data); insurance logo strip creating the appearance of carrier coverage with nothing behind it.

### 2.7 Buildout plan vs. built

| Plan item | Status |
|---|---|
| 1.1 `/programs/detox` ("single highest-priority new page") | **Not built** |
| 1.2 `/programs/outpatient` | Built — but missing from nav, ES mirror, hreflang |
| 1.3 `/levels-of-care` hub | **Not built** |
| 1.4 Expand thin pages to 1,200+ | Partial (lifted to ~800–1,150) |
| Phase 2: `/insurance` + 12 carrier pages | **0 of 13 built** |
| Phase 3: `/who-we-treat` + 8 audience pages | **0 of 9 built** |
| Phase 4: geo pages | Built (11) |
| Phase 6: 150-post blog roadmap | 6 posts; clusters A/B/D/E at zero |

---

## 3. E-E-A-T — C+

### 3.1 Authorship & medical review

**Strong:** all 14 treatment pages carry a visible "Medically reviewed by Dr. Eric Chaghouri, MD" line linked to the team page, backed by `MedicalWebPage` schema with `reviewedBy` + `lastReviewed`. All 11 location pages have both (reviewed 2026-07-07). All 6 blog posts have bylines, avatars, dates, and read times.

**Broken:**

- **5 of 6 blog posts have no medical reviewer** — visible or structured. The only reviewed post is the *patient-authored* one; the five clinician-authored posts (including all three insurance/cost posts giving financial-medical guidance) have none. The inverse of the correct pattern.
- **11 of 14 treatment pages show `lastReviewed: 2026-03-01`** — ~17 months stale. All 6 blog posts have `dateModified == datePublished` (no freshness signal).
- **9 program pages show the visible review line with no `reviewedBy`/`lastReviewed` schema** — a visible/structured mismatch. Same for `faq.html` (40 FAQs of clinical content).
- Blog bylines are plain text — no link to `/team`, no `Person @id` in `BlogPosting.author`.
- **One reviewer carries the entire YMYL surface.** No LMFT/LCSW co-reviewers; no reviewer for financial content.
- `docs/clinical-review-notes-2026-07-07.md` is a genuinely good internal QA log — but unpublished (zero external signal), and ~30 claims it flags "confirm with Dr. Chaghouri/compliance" remain unresolved (EMDR delivery, acamprosate, alumni "priority admission," "we never contact your employer," the fentanyl "reduces overdose deaths by roughly half" claim).

### 3.2 Team credentials

7 staff with real names, real headshots (6 of 7), substantive bios, and Person schema. Lived-experience bios (26 years of recovery, named prior employers, specific clinical tooling) are the best Experience signal on the site.

- **No license numbers anywhere** — `team.html` says "available on request and verifiable at search.dca.ca.gov" (a generic portal, not a record link). CA license numbers are public record; withholding them blocks independent verification of every clinician. This is the single largest missing trust artifact.
- No `Physician` schema type for an MD Medical Director; no `medicalSpecialty`, NPI, `sameAs` (Doximity/Healthgrades/LinkedIn), or `image` on any Person node.
- Person nodes aren't graph-linked to the Organization node (inline `worksFor`, no `employee` property on the org) — two floating graphs.
- Sophia Scharpf: no credential, no bio, generic avatar.
- Roster depth: 1 licensed therapist (LMFT) + 1 pre-licensure AMFT + 1 RADT + 1 MD for a facility advertising PHP + IOP + telehealth + individual + group + med management — thin relative to advertised breadth.

### 3.3 Structured data

**Exists:** `["MedicalOrganization","LocalBusiness"]` org node on ~54 pages with complete NAP, geo, hours, **DHCS license #191643AP as an `identifier`**, DHCS + LegitScript `hasCredential`; 26 MedicalWebPage; 40 FAQPage; 52 BreadcrumbList; 46 Person; MedicalCondition/Therapy/Symptom on condition pages.

**Missing (high impact):** `AggregateRating`/`Review` — **zero occurrences sitewide** despite "5.0 on Google" displayed on the homepage; `Physician` type; org→Person `employee` linkage; Person `sameAs`; `reviewedBy` on programs/faq/blog; `sameAs` limited to LegitScript + Yelp — no Google Business Profile, Psychology Today, SAMHSA locator, or any social profile.

### 3.4 Trust signals

**Present and strong:** DHCS license displayed as a clickable hero badge linking to the certificate scan, with a footer-level link to the DHCS provider directory for independent verification (70× sitewide); 988 + SAMHSA crisis lines in every footer; sitewide medical disclaimer; consistent NAP (phone perfectly consistent across 1,400+ instances); substantial privacy policy, terms, and a well-built HIPAA-aware verify-insurance flow (42 CFR Part 2 FAQ).

**Missing / weak:**

- **No Joint Commission, CARF, or NAATP** — zero mentions. For an addiction facility this is the most conspicuous absence; DHCS licensure is a legal minimum, not an accreditation.
- **Review wall links open the screenshot image files, not the Google Business Profile.** No path to verify a single review; no "see all reviews" CTA; no GBP URL anywhere on the site; no review count behind "5.0 on Google." (Alt text is excellent — full transcriptions — so the content is crawlable, just unverifiable.)
- **"100+ Recoveries" in the H1** — unsourced, undefined, and inconsistent with `our-story.html` ("Clients served"). Highest-risk string on the site under FTC/SB 1228 treatment-advertising scrutiny.
- `foundingDate: 2026` + "100+ clients" + 5.0 rating with nothing anchoring it externally reads as a thin authority profile.
- No editorial/review-policy page, no corrections policy, no outcomes methodology, no exterior/signage photos.
- LegitScript badge is an unlinked `<span>` on the homepage (linked correctly on about/families).

### 3.5 Citations

- **Treatment pages cite well:** 1–5 authoritative sources each (NIDA, NIMH, SAMHSA, PMC), attributed in-copy.
- **Zero citations on:** faq.html (40 clinical FAQs), mental-health, php, iop, telehealth, both silo indexes, all 11 location pages, about, our-story.
- **Blog: 3 posts have zero external citations.** The insurance post cites MHPAEA, ACA, SB 855, and the ASAM Criteria **without linking any of them**.
- `programs/telehealth.html` is missing the PMC citation the clinical-review notes say was added — likely reverted; verify.
- No semantic references section anywhere — citations are unstyled inline text.

### 3.6 Experience signals

**Strong:** lived-experience staff bios; consented, de-identified first-person alum post (HIPAA-handled correctly); 40 real facility photos across dedicated experiential pages; first-hand local detail on location pages; honest detox disclosure.

**Weak:** only 2 blockquotes sitewide and no testimonial component of any kind; no video; no named founder; the only patient voice is 3 screenshots + 1 post.

---

## 4. Prioritized Action Plan

Ranked by (risk reduction + ranking impact) ÷ effort:

| # | Action | Fixes | Effort |
|---|---|---|---|
| 1 | **Rewrite the H1 claim** — either define and source "100+ Recoveries" or align with "100+ clients served"; reconcile with our-story.html | Critical regulatory/trust risk | XS |
| 2 | **Link the review wall to the Google Business Profile** + add review count + "see all reviews" CTA; add GBP (and Psychology Today/SAMHSA locator) to `sameAs` sitewide | Unverifiable social proof | XS |
| 3 | **Publish staff license numbers** on team.html (deep-link DCA verification where possible); add `Physician` type + org↔Person schema linkage | Largest missing trust artifact | S |
| 4 | **Add contextual homepage links** — turn the "why us" and facility card grids into links to treatments/programs/locations hubs; add a featured-post module | Homepage passes zero equity | S |
| 5 | **Add medical reviewer + fresh `lastReviewed` to the 5 unreviewed blog posts**; refresh the 11 treatment pages stuck at 2026-03-01; add `reviewedBy` schema to the 9 program pages + faq | Reviewer gaps, stale dates, visible/structured mismatch | S |
| 6 | **Build `/programs/detox`** (referral messaging already exists on 25 pages) and **`/treatments/heroin` + `/treatments/benzodiazepines`** (content exists inside opioid + prescription-drugs) | Highest-volume topic gaps, near-zero clinical risk | M |
| 7 | **Build the `/insurance` hub + top 5–6 carrier pages** — the logos are already on 46 pages; the buildout plan already specifies outlines | Highest-ROI missing axis | M–L |
| 8 | **Wire service → blog links** (iop → first-week post, cbt/dbt → comparison post, verify-insurance → all three money posts) and **add outpatient-rehab to the nav + ES mirror + hreflang** | One-way blog, orphaned head-term page | S |
| 9 | **Add citations** to faq, mental-health, php/iop/telehealth, and the 3 uncited blog posts; link MHPAEA/SB 855/ASAM in the insurance post; source or remove the CBT/DBT stat tiles | Uncited clinical/financial claims | S–M |
| 10 | **Fix cross-silo holes** — treatment pages link to `/locations`; each city page links 2–3 locally relevant treatments; fix the cbt.html OCD/insomnia anchor mismatches; balance the neighbor-city link rotation | Silo isolation | M |
| 11 | **Pursue accreditation** (Joint Commission or CARF; join NAATP meanwhile) and publish an editorial/review-policy page based on the existing internal clinical-review process | Missing authority anchors | L (business) |
| 12 | Longer-term: `/levels-of-care` hub + PHP-vs-IOP comparison page, EMDR page, expand the 12 mid-depth treatment pages toward 1,200–1,500 words, resume the blog roadmap (clusters A/B: "how long does X stay in your system," signs/withdrawal) | Depth + coverage | L |

---

*Sources: three parallel full-site analyses (link graph, content inventory, E-E-A-T signals) of the repository HTML as of commit 58805b3, cross-referenced against `golden-state-rehab-seo-buildout-plan.md`, `docs/seo-audit-report.md`, `docs/seo-action-plan.md`, and `docs/clinical-review-notes-2026-07-07.md`.*
