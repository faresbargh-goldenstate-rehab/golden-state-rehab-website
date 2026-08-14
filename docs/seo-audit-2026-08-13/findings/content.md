# Content Quality + E-E-A-T Audit — Golden State Rehab (live site, 2026-08-13)

Scope note: This pass was cut short by a tooling bug in my automated word-counter (a
custom HTML-boilerplate stripper written because `bs4`/`textstat` were unavailable in
this environment — void elements like `<img>`/`<link>`/`<meta>` never fire
`handle_endtag`, which desynced my boilerplate-tracking stack and produced garbage
word counts, e.g. "8 words" for the homepage). Do not trust any word-count numbers
from my own script; I did not ship them. The word-count section below uses the
verified counts supplied directly by the coordinator, cross-checked against the one
page I hand-read in full (`treatments/alcohol`).

Several planned checks were not completed before this file was due — see "Not
assessed" at the end. Everything else below I verified directly against the crawled
HTML (file + line/string cited).

---

## 1. Word count / thin content

**Severity: High** (two pages), **Low** (site-wide otherwise)

- **Observed (coordinator-verified ground truth, cross-checked structurally against
  my own read of comparable templates):** Body word count (nav/header/footer
  excluded), median across 102 pages ≈ 905 words. Only two pages fall under the
  300-word thin-content floor:
  - `/contact` — **237 words**
  - `/es/contact` — **269 words**
- Next-lowest pages, all still above 300 but thin relative to page type: `/blog/`
  (337 — acceptable, it's an index/listing page, not an article), `/es/blog/` (367),
  `/es/locations` (396), `/programs/` (454 — below the 800-word service-hub floor in
  the QRG table), `/our-story` (465 — below the 500-word homepage-tier floor for an
  About-type page), `/about` (474).
- **Fix:** `/contact` and `/es/contact` are the two must-fix pages — a contact page
  on a YMYL healthcare site with only ~240 words is a weak trust page if it's mostly
  a form with no supporting copy (hours, what happens after you submit, privacy
  assurance, crisis-resource callout, staff who'll respond). Add 150–250 words:
  what happens next, confidentiality/HIPAA assurance, and a repeat of the 988/SAMHSA
  crisis line for anyone who lands here in acute distress. `/programs/` (hub page)
  and `/our-story` are secondary priorities — both are below their category floor
  and are exactly the kind of page an E-E-A-T/YMYL rater would check for depth.

## 2. E-E-A-T — clinician attribution, credentials, review dates

**Severity: Low (this is a strength, not a gap)**

- **Observed:** Every one of the 14 `/treatments/*` pages and 9 `/programs/*` pages
  carries a `<div class="medical-review-byline">` immediately below the page hero.
  Verified in full on `treatments/alcohol.html:104-108`:
  ```html
  <div class="medical-review-byline">
    <i data-lucide="shield-check"></i>
    Medically reviewed by <a href="../team">Dr. Eric Chaghouri, MD</a> — Medical Director, Golden State Rehab
    <span class="review-date">Updated March 2026</span>
  </div>
  ```
  Confirmed present (via `grep -l "medical-review-byline"`) on all 23 clinical
  template pages: `treatments__alcohol/anxiety/cbt/cocaine/complex-trauma/dbt/
  depression/dual-diagnosis/fentanyl/meth/opioid/prescription-drugs/ptsd/
  sex-addiction.html` and `programs__alumni/group-therapy/holistic-therapies/
  individual-therapy/iop/medication-management/outpatient-rehab/php/
  telehealth.html`. Zero clinical-template pages are missing it.
- **Observed:** Machine-readable reviewer attribution backs the visible byline —
  `treatments__alcohol.html:435-454` carries a `MedicalWebPage` JSON-LD block with
  `"lastReviewed": "2026-03-01"` and a `reviewedBy` Person object naming Dr. Eric
  Chaghouri, MD, jobTitle "Medical Director", tied via `worksFor` to the
  `#organization` node. This is correct Sept-2025-QRG-aligned structure (visible
  byline + matching schema, not schema-only).
- **Observed:** Source citations are present at the foot of every treatment page's
  FAQ block, not just claimed generically. `treatments__alcohol.html:227`:
  > Sources: NIDA — Drugs, Brains, and Behavior: The Science of Addiction, SAMHSA —
  > National Survey on Drug Use and Health, SAMHSA — Medications for Substance Use
  > Disorders. (all three are outbound links to nida.nih.gov / samhsa.gov)
  Confirmed by `grep -c "Sources:"` returning 1 hit on all 14 treatment pages
  (program pages not grep-checked for this specific string — see Not Assessed).
- **Observed:** Clinician credentials are named with real specificity, not vague
  "our expert team" language. Homepage team-preview module
  (`index.html:400-474`) names six staff with title + credential: Dr. Eric
  Chaghouri, MD — "Board-Certified Psychiatrist · Keck School of Medicine, USC";
  Ari Labowitz, LMFT — "Licensed Marriage & Family Therapist"; Vindell Brunson —
  "Master Addiction Specialist · 24+ Years Experience"; Juanita Casillas, RADT;
  Viola Sulahian, AMFT — "Dual Diagnosis." One entry, Scott Hedlund (Director of
  Business Development), is tagged "Person in Long-Term Recovery" — a genuine
  first-hand-experience (lived-experience) signal, which the Sept-2025 QRG rewards
  explicitly as an "Experience" E-E-A-T marker.
- **Observed:** Organization-level trust schema is thorough.
  `index.html:693-810` — `MedicalOrganization`+`LocalBusiness` type, DHCS license
  number 191643AP surfaced both as a JSON-LD `identifier`/`hasCredential` block and
  as a clickable badge in the hero (`index.html:178`) and footer
  (`index.html:618`) linking to `/images/dhcs-license.jpg`. `sameAs` links out to
  LegitScript and Yelp profiles for external verification.
- **Observed (possible trust flag, not fully verified):** `index.html:784`
  `"foundingDate": "2026"` — the same year as the copyright year and today's date.
  A treatment center with "100+ Recoveries" claimed in the H1 and multiple dated
  Google reviews on the page would not plausibly have opened this calendar year.
  **Inferred:** this is very likely a stale/placeholder value (e.g., a template
  default that was never updated) rather than a true founding date, which is a
  credibility risk if scrutinized — an inaccurate `foundingDate` is exactly the kind
  of factual-inaccuracy marker the Sept-2025 QRG flags as a low-quality signal.
  I did not verify the actual founding year, so I can't confirm this is wrong, only
  that it's suspicious and worth a human check.

## 3. FAQ formatting — not real headings

**Severity: Medium**

- **Observed:** On `treatments/alcohol.html:196-225` (and by template, all 14
  treatment pages sharing this FAQ block markup), each FAQ question is a
  `<button class="faq-question" aria-expanded="false">` inside a `.faq-item` div —
  **not** an `<h2>`/`<h3>`/`<h4>` heading. Example:
  `<button class="faq-question" aria-expanded="false">Do I need to finish detox before I can call you?...`
- **Why it matters:** The brief specifically calls out "FAQ questions as real
  headings" as an AI-citation-readiness signal. A `<button>` with no heading
  wrapper means an LLM or crawler parsing document structure (not JSON-LD) sees a
  flat list of interactive controls, not a semantic Q&A outline. The site does
  compensate with `FAQPage` JSON-LD (`treatments__alcohol.html:455-502`, mainEntity
  with Question/acceptedAnswer pairs matching the visible copy) — so machine
  extraction of the FAQ content itself is not broken, but the in-document heading
  hierarchy is not carrying the FAQ semantics, which weakens plain-text/heading-only
  parsing and screen-reader heading-navigation.
- **Fix:** Wrap the question text in an `<h3>` (or `<h4>`, matching the surrounding
  section's H2) inside the existing `<button>`, or make the button itself an
  `aria-level`-appropriate heading role. Low engineering cost since the FAQPage
  schema already has the canonical Q&A text to copy from.

## 4. Missing `<main>` landmark on inner pages

**Severity: Low**

- **Observed:** The homepage wraps all body content in `<main>...</main>`
  (`index.html:149` open, `index.html:596` close). `treatments/alcohol.html`, read
  in full (508 lines), has **no `<main>` element at all** — content sections start
  directly after the mobile nav closes (`treatments__alcohol.html:92-94`) and the
  footer follows directly (`treatments__alcohol.html:233`). Since this page's
  structure is templated across the treatment/program set (confirmed byline+FAQ
  markup identical across all 14+9 pages), this is very likely site-wide on
  non-homepage templates, though I only fully read one file — flagging as
  **inferred** for the other 22 clinical pages, **observed** for
  `treatments/alcohol`.
- **Fix:** Wrap the primary content sections (hero through insurance strip) in a
  `<main>` landmark on the shared page template. Minor accessibility/semantic-HTML
  fix, not itself a ranking factor, but landmark-based navigation is a real
  assistive-tech usability signal that a strict E-E-A-T rater on a healthcare site
  would notice.

## 5. Content freshness signal (from brief's verified facts, not independently re-crawled)

**Severity: Medium**

- **Given (brief §"Verified facts," not re-verified by me):** `sitemap.xml` lists
  all 102 URLs with an identical `lastmod` of `2026-07-07` — including evergreen
  legal pages like `/privacy-policy` and `/terms-and-conditions` that would not
  legitimately share an update date with clinical treatment pages and blog posts.
- **Inferred:** A single uniform `lastmod` across the entire site strongly suggests
  a build-time/deploy-time stamp rather than genuine per-page content-update
  tracking. This undercuts freshness as an E-E-A-T signal — Google's guidance
  treats implausible/uniform date stamps as a potential quality red flag rather
  than a positive signal. The visible "Updated March 2026" byline on treatment
  pages (§2 above) is a stronger, more credible freshness signal than the sitemap
  dates, since it varies believably (single date, but plausible as a real review
  cycle) and is tied to a named reviewer.

## 6. Trust signals — crisis resources, disclaimers, licensing

**Severity: Low (strength)**

- **Observed:** Every page footer (confirmed on `index.html:689` and
  `treatments__alcohol.html:235`, both share identical markup) carries:
  ```html
  <div class="medical-disclaimer"><p>This content is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider.</p><p>If you or someone you know is in crisis, call <strong>988</strong> (Suicide &amp; Crisis Lifeline) or <strong>1-800-662-4357</strong> (SAMHSA National Helpline).</p></div>
  ```
  This is exactly the medical-disclaimer + crisis-hotline pairing YMYL health
  content is expected to carry, and it's on every crawled page via the shared
  footer, not just a standalone policy page.
- **Observed:** DHCS license number (#191643AP) is displayed in three independent
  places on at least the pages I read — hero trust badge, footer badge, and (on
  `treatments/alcohol.html:234`) an outbound "Verify with DHCS ↗" link to
  `https://sapccms.dhcs.ca.gov/DirectoryofProviders/`, the actual state licensing
  lookup tool. This is a strong, checkable trust signal — most competitor sites
  just claim a license number without a route to verify it.

---

## Not assessed (ran out of budget before tooling failure was caught — do not treat as "no issues found")

- **Duplicate/near-duplicate content quantification across the 14 treatment + 9
  program pages.** I confirmed the *markup skeleton* is templated (byline → intro
  → 6-card "How We Treat X" grid → secondary info block → related-conditions grid
  → FAQ → insurance strip, identical structure/classes across pages), which is
  normal and expected for this page type — but I did not run a similarity/overlap
  metric on the prose itself to quantify how much body copy is boilerplate vs.
  condition-specific. This should be re-run with a working extractor.
- **Readability scores.** My Flesch-Kincaid calculation was invalidated by the same
  extraction bug (see top of file). Qualitatively, from the one page I hand-read,
  the copy uses clinical vocabulary ("delirium tremens," "naltrexone," "42 CFR Part
  2," "motivational interviewing") that likely pushes grade level above the ~8th
  grade target in spots, but this is an impression, not a measurement — needs a
  real run.
- **Spanish translation quality/completeness.** I did not read the content of any
  `/es/` page. I only observed that `es__treatments__alcohol.html` (581 lines) is a
  comparable file size to the English `treatments__alcohol.html` (508 lines),
  which is a weak proxy for "not a stub" but says nothing about translation
  accuracy or whether strings like button labels/CTAs were left in English.
- **Blog depth, freshness, and statistic sourcing** beyond the single word-count
  figure supplied by the coordinator. I did not check for byline/author/date
  metadata on blog posts, nor whether cited statistics link to sources.
- **Heading hierarchy skip-level checks** across the site (H1 uniqueness beyond the
  two pages I hand-read, skipped heading levels). My script's output for this was
  corrupted by the same bug and is not usable.
- **Location pages** (`/locations/*`) — not opened; word counts only came from the
  coordinator's list, no content-quality read.
- Program pages' FAQ "Sources:" citation presence was grep-confirmed for
  treatment pages only, not separately re-confirmed for program pages (the byline
  presence was confirmed for both).

## Files referenced

- `/private/tmp/claude-501/.../scratchpad/crawl/index.html`
- `/private/tmp/claude-501/.../scratchpad/crawl/treatments__alcohol.html`
- `/private/tmp/claude-501/.../scratchpad/crawl/_index.json`
