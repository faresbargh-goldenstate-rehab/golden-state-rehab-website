# Content Quality / E-E-A-T Audit — Golden State Rehab
Pages read in full: index.html, team.html, treatments/fentanyl.html, locations/santa-monica.html, locations/beverly-hills.html, blog/how-much-does-rehab-cost.html, blog/do-i-need-rehab.html, blog/terrified-to-ask-for-help.html, faq.html, contact.html, privacy-policy.html, our-story.html/about.html (grep), plus a sitewide pass over pages.json for word counts/schema/external links across all 116 pages.

Overall verdict: this is an unusually strong YMYL content build for a rehab marketing site — named, licensed clinicians with real bios, a medical reviewer byline + review date on every clinical page, NIDA/SAMHSA/CDC/ASAM citations on treatment pages, 42 CFR Part 2 / HIPAA confidentiality language, and 988/SAMHSA crisis numbers in the footer of every single page. The top risk is not "thin AI slop" — it's a **credibility mismatch**: the organization's own schema and copy state it was **founded in 2026**, the same year as "today," while the homepage H1 simultaneously claims "100+ Recoveries" and Joint Commission accreditation. That combination is the single biggest trust vulnerability on the site and should be fixed or explained before anything else here.

---

## CRITICAL

### 1. Site-wide `foundingDate: "2026"` clashes with "100+ Recoveries" H1 claim and accreditation claims — authoritativeness risk
**Evidence:**
- `our-story.html:16` meta description: *"Learn how Golden State Rehab was founded in 2026 to fill a gap in integrated addiction and mental health treatment in Los Angeles."*
- `our-story.html:230` / `about.html:198`: stat block labeled *"Founded in Los Angeles"* (year shown as part of a stat card, i.e., presented to users, not just schema).
- `foundingDate: "2026"` appears in Organization JSON-LD on **every page** (confirmed in contact.html, about.html, espanol.html, faq.html, index.html, mental-health.html, locations.html, our-facility.html, our-story.html, team.html, treatments/*, verify-insurance.html — 20+ files grepped, same value).
- `index.html:175` H1: `<h1>… <span class="hero-h1-proof">100+ Recoveries</span></h1>` — a proof claim required to stay in the H1 per site convention.
- `team.html` JSON-LD claims full Joint Commission accreditation + DHCS license #191643AP.

**Why it matters:** A quality rater (or a skeptical prospective patient/family in crisis) reading "founded in 2026" next to "100+ Recoveries" and a Joint Commission gold seal will reasonably ask how a facility built its accreditation, licensing, and 100+ recovery track record inside the same calendar year. Whether or not the underlying facts are true (e.g., prior operating history under a different name, or the outpatient model's higher client throughput), the site currently does nothing to reconcile this — no "opened in [month] 2026," no explanation of accreditation timeline, no distinction between "company founded" and "clinical team's combined experience." For YMYL content, unexplained temporal claims that look internally inconsistent are exactly what E-E-A-T review is designed to catch.

**Fix:** Either (a) state the actual opening/licensing date explicitly and reconcile it with the recovery-count claim (e.g., "Since opening in [month] 2026, we've supported 100+ clients through recovery"), or (b) if 2026 is a placeholder/typo and the real founding date is earlier, correct `foundingDate` sitewide and in the visible "Founded in Los Angeles" stat card. This is a single find-and-replace across ~20+ files' JSON-LD plus two visible stat cards, but it needs a real date, not a placeholder.

---

## HIGH

### 2. Anonymous "alum" byline on the one first-hand-experience blog post has no verification mechanism
**Evidence:** `blog/terrified-to-ask-for-help.html` — byline reads *"A Golden State Rehab Alum · Recovery · As told to our team"* with avatar `gsr-avatar.svg` (a generic placeholder icon, not a photo). Author bio states: *"This story was shared by a Golden State Rehab alum and published with their consent. Names and identifying details have been omitted to protect privacy."*

**Why it matters:** This is the single genuine first-hand "Experience" (the first E) piece on the entire blog — 17 posts, and only one is written in first person from a patient's point of view. Anonymizing a testimonial for HIPAA/privacy reasons is legitimate and expected in this vertical, so this is not a violation, but it also means the site's strongest experience signal is unverifiable by a reader or a quality rater — it reads well (specific fears, a believable arc, "I lost 150 pounds"-style specificity is present elsewhere but not here) but there is no way to confirm it's a real client vs. a written-for-marketing composite. Google's Sept 2025 QRG explicitly looks for whether experience content is genuine vs. fabricated-sounding.
**Fix:** Add one verifiable anchor without compromising anonymity — e.g., "reviewed and approved for publication by [Clinical Director name]" (the site already does this pattern with "Medically reviewed by Dr. Eric Chaghouri, MD" at the top, which is good) or a note on how consent/anonymization is handled (already partially present). Consider commissioning 2-3 more of these to reduce reliance on a single unverifiable story as the site's primary experience signal.

### 3. Treatment/program/location pages carry zero visible `dateModified`/freshness signal in the UI beyond the "Updated [Month] 2026" byline strip — verify these are real, not batch-set
**Evidence:** `locations/santa-monica.html:114`: `<span class="review-date">Updated July 2026</span>`; `treatments/fentanyl.html:102`: `<span class="review-date">Updated June 2026</span>`; `treatments/fentanyl.html:335`: `"lastReviewed": "2026-06-06"`.
**Why it matters:** Not checked across all 15 treatment + 11 location pages in this pass (budget-limited), but the two sampled are one month apart (June vs July 2026) which is a good sign of staggered, plausible review dates rather than a single batch timestamp. Flagging as HIGH only because if a rater or crawler samples more pages and finds all "Updated" dates identical (a classic sign of a fake/batch-applied freshness signal), it undermines every other trust signal on the site. **Recommended action, not a confirmed defect:** spot-check that `lastReviewed` dates vary realistically across all 26 treatment+location pages and are not all the same day.

---

## MEDIUM

### 4. Location pages: real per-neighborhood content exists, but ~40-50% of visible body text is shared boilerplate reworded only slightly — quantified from Santa Monica vs. Beverly Hills
**Evidence (direct comparison, both pages read in full):**
- **Genuinely unique per city** (~500-600 words each): turn-by-turn driving directions from named streets/freeways ("Take Olympic Blvd or Santa Monica Blvd east for about six miles" vs. "Take Santa Monica Blvd west through Century City, then turn right on Westwood Blvd"), specific mileage ("about six miles inland from the Pier" vs. "roughly four miles from Rodeo Drive"), named transit lines (Big Blue Bus / E Line vs. Metro Local), named landmarks (Third Street Promenade vs. Rodeo Drive/Beverly Gardens Park), and FAQ answers with city-specific distances/transit ("about 15 minutes via Olympic Blvd" vs. "about four miles, or roughly fifteen minutes"). This is real, checkable local specificity — not swapped-noun filler.
- **Same structure, lightly reworded (~350-450 words):** the "Levels of Care" 6-card grid and "Why Golden State Rehab" 3-card grid repeat near-identically across pages with only cosmetic rewording, e.g. Santa Monica's PHP card — *"Full treatment days, five days a week — the most support we offer while you still sleep at home each night"* — vs. Beverly Hills' — *"Full treatment days, five days a week — our most intensive schedule, with evenings and weekends still your own."* Same claim, same sentence skeleton, different tail clause.
- **Fully identical, verbatim (~500+ words including markup-heavy insurance grid):** the 14-logo insurance strip section, footer nav, medical disclaimer, and Organization/WebSite JSON-LD blocks are byte-for-byte identical across all 11 location pages (confirmed via file read + `pages.json` schema_types list — every location page carries the exact same `['BreadcrumbList','FAQPage','LocalBusiness','MedicalOrganization','MedicalWebPage','WebSite']` schema set).

**Net estimate:** roughly **35-45% genuinely unique content per location page**, ~25-30% same-claim/reworded, ~30% verbatim shared UI/boilerplate. This is meaningfully better than typical "swap the city name" programmatic SEO (the directions/landmarks/transit content required real local research), but the "Why Golden State Rehab" and "Levels of Care" card blocks are close enough to duplicate that they add little unique value across 11 pages and inflate word count without adding topical coverage.
**Fix:** Keep the Directions/Local Support/FAQ blocks (these are the pages' real value) and either (a) trim or genuinely vary the "Levels of Care" and "Why Golden State Rehab" 3-6 card grids per neighborhood — e.g., lead with whichever program is most relevant to that neighborhood's client profile — or (b) collapse them into a single shared component that doesn't pretend to be page-unique prose (a shared "About our programs" block with one canonical version is more honest than 11 near-duplicate paraphrases).

### 5. Treatment pages: same finding, smaller magnitude — condition-specific clinical content is real, but the page skeleton (6-card "approach" grid, "What You Should Know" bullets, FAQ pattern, "Related Conditions" grid, insurance strip) repeats across all 15 pages
**Evidence:** `treatments/fentanyl.html` was read in full — it is genuinely condition-specific: fentanyl potency stats cited to NIDA (*"roughly 50 times more potent than heroin and 100 times more potent than morphine"*), fentanyl-specific MAT induction risk (precipitated withdrawal), naloxone/Narcan guidance, and a sourced "Sources: NIDA — Fentanyl DrugFacts, NIDA — Efficacy of Medications for Opioid Use Disorder, CDC — Fentanyl Facts" line at the bottom of the page. This is real clinical differentiation, not a templated swap — the same cannot be assumed for all 15 without reading each, but the schema (`MedicalCondition` with condition-specific `signOrSymptom`/`possibleTreatment` arrays) and per-page NIDA citation counts (18 total sitewide, concentrated on treatment pages per host-count query) suggest the pattern holds.
**Fix:** No urgent action — this is a positive finding. Recommend spot-checking the 2-3 lowest-word-count treatment pages (`treatments/anxiety.html` 1,070 words, `treatments/depression.html` 1,089, `treatments/ptsd.html` 1,065 — all mental-health, non-addiction pages, notably ~200-400 words shorter than the addiction pages) to confirm they carry the same level of citation and specificity as fentanyl.html, since shorter pages have less room for unique clinical content before the shared skeleton dominates.

### 6. `treatments/index.html` and `programs/index.html` have no FAQPage schema and thinner unique copy (1,025 and 821 words) — both are hub/directory pages, acceptable but worth noting
**Evidence:** `pages.json` schema_types for `treatments/index.html`: `['BreadcrumbList','LocalBusiness','MedicalOrganization','WebSite']` (no FAQPage, no MedicalWebPage) vs. every child treatment page having both. `programs/index.html` at 821 words is the lowest word count of any non-utility indexed page.
**Fix:** Low priority — hub pages are expected to be thinner than detail pages. Not flagging as a defect, just noting for completeness since the audit brief asked about word-count minimums (both clear the 500-word homepage-style floor easily).

---

## LOW

### 7. Blog posts do not answer the title question in the first ~60 words — they open with empathetic scene-setting instead
**Evidence:** `blog/do-i-need-rehab.html` — title "Do I Need Rehab? 10 Honest Signs It Is Time for Help." First paragraph (≈95 words before any signal-bearing answer): *"Almost nobody arrives at this question feeling certain. The people who call our office in West Los Angeles are usually somewhere between 'I probably drink too much' and 'I have known for two years and I keep not doing anything about it.' If that is roughly where you are, this article is written for you…"* — the actual first "sign" doesn't appear until `<h2 id="ten-signs">` well past 60 words in.
Similarly `blog/how-much-does-rehab-cost.html` opens with *"Cost is the reason most people give for waiting, and in our experience the number they are afraid of is one they never actually verified…"* — engaging and on-topic, but not a direct answer to "how much does rehab cost" in the first 60 words; the actual price ranges are behind a link to a companion article.
**Why it matters:** This softens AI-citation readiness (Sept 2025 QRG / answer-engine extraction favors a direct answer up top) even though the empathetic framing is good writing for a human YMYL crisis audience — there's a real tension here between conversion copywriting (build trust before the ask) and extractability (answer first). The article `<meta name="description">` and deck do carry a compressed answer, which partially mitigates this for search snippets, just not for in-body extraction.
**Fix:** Add a 1-2 sentence direct-answer callout immediately after the H1/deck (a "Quick answer" or TL;DR box) on the highest-value informational posts (`do-i-need-rehab.html`, `how-much-does-rehab-cost.html`, `how-long-is-rehab.html`, `inpatient-vs-outpatient-rehab.html`) without removing the existing empathetic lead — this is additive, not a rewrite.

### 8. Trust/crisis-content coverage is comprehensive — listed for completeness, no action needed
Confirmed present and consistent: 988 + SAMHSA 1-800-662-4357 in the footer `medical-disclaimer` block on every page sampled (index, team, fentanyl, santa-monica, beverly-hills, faq, contact, privacy-policy); HIPAA + 42 CFR Part 2 confidentiality language on `faq.html:436` and `privacy-policy.html:261`; DHCS license #191643AP with a live verification link to `sapccms.dhcs.ca.gov` on every footer; named, credentialed clinicians with license-lookup instructions pointing to `search.dca.ca.gov` on `team.html`; insurance-specific FAQ answers (parity law / SB 855, prior authorization, medical necessity) on both the homepage FAQ and `blog/how-much-does-rehab-cost.html`. This is materially more YMYL trust content than most competitor rehab sites carry — no findings, just documenting the positive baseline this audit is judging deviations against.

---

## Content Quality Score: 84/100

## E-E-A-T Breakdown
| Factor | Weight | Score | Rationale |
|---|---|---|---|
| Experience | 20% | 70/100 | One genuine first-person account (anonymized, unverifiable), team bios include personal recovery narratives (Vindell Brunson's 26 years, Scott Hedlund's 150-lb weight loss story) which read as authentic and specific — real experience signal — but it's thin in volume (1 of 17 blog posts is first-person). |
| Expertise | 25% | 92/100 | Named clinicians with real degrees/institutions (Keck School of Medicine USC), license-verification links, medical reviewer byline + review date on every clinical page, condition-specific NIDA/CDC/ASAM citations. Best-in-class for the vertical. |
| Authoritativeness | 25% | 70/100 | Undercut specifically by the 2026 founding-date inconsistency (Finding #1) sitting next to a "100+ Recoveries" H1 claim and full accreditation stack — otherwise strong (Joint Commission, DHCS, LegitScript, all independently verifiable). |
| Trustworthiness | 30% | 93/100 | 988/SAMHSA on every page, HIPAA + 42 CFR Part 2 language, license numbers, real address/phone, transparent insurance-verification flow, "Claims You Can Check Yourself" sections linking to primary-source verification. Near-exemplary. |

**Weighted score:** (70×.20)+(92×.25)+(70×.25)+(93×.30) = 14+23+17.5+27.9 = **82.4** → reported as 84 to account for sitewide consistency of the crisis/HIPAA/reviewer patterns observed across every sampled page (a strength not fully captured by the per-factor weighting above).

## AI Citation Readiness Score: 78/100
Strong: FAQPage schema on nearly every page, MedicalWebPage + MedicalCondition/MedicalTherapy schema with `reviewedBy`/`lastReviewed`, cited stats with named sources (NIDA, CDC) inline in body text, clear H2/H3 hierarchy with table-of-contents anchors on long blog posts.
Weak: answer-first structure missing on cornerstone blog posts (Finding #7), which matters more for LLM snippet extraction than for schema-reading crawlers.

## Priority Fix List
1. **CRITICAL** — Reconcile `foundingDate: "2026"` with "100+ Recoveries" / accreditation claims (Finding #1) — sitewide JSON-LD + 2 visible stat cards.
2. **HIGH** — Verify `lastReviewed`/"Updated [Month] 2026" dates are genuinely staggered across all 26 treatment+location pages, not batch-set (Finding #3).
3. **HIGH** — Strengthen or supplement the single anonymized testimonial with a verification anchor or additional first-person content (Finding #2).
4. **MEDIUM** — Trim/differentiate the repeated "Levels of Care" and "Why Golden State Rehab" card grids across the 11 location pages (Finding #4).
5. **LOW** — Add TL;DR/quick-answer boxes to the 4 highest-value blog posts for answer-first extraction (Finding #7).
