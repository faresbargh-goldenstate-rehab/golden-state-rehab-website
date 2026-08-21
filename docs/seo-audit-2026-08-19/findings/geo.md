# GEO / AI-Search Readiness Audit — Golden State Rehab
Site: https://www.goldenstate-rehab.com/ | Repo: arm-website-golden-state-rehab-2
Confirmed baseline (not re-audited): robots.txt allows all crawlers (`User-agent: * / Allow: /` + sitemap); llms.txt exists and is populated; site is static SSR HTML; JSON-LD present on 112/116 pages (verified below: the 4 without are 404.html, amenity-map.html, intake-success.html, es/intake-success.html — all correctly low-value/noindex-adjacent pages, LOW severity if anything).

---

## 1. llms.txt Quality — `/llms.txt`

**Format compliance: GOOD.** It correctly follows the llms.txt spec: `# Golden State Rehab` H1, a single `>` blockquote summary, H2 section groups, and markdown links with descriptions. This is well above what most local-service sites ship.

**Findings:**

- **MEDIUM — No `llms-full.txt`.** Only `llms.txt` exists (7,958 bytes, link index only). The spec's companion file, `llms-full.txt` (full page content concatenated, not just links), is what lets an LLM ingest the entire site in one fetch without a crawl budget. For a 116-page site this is a high-value, low-effort add — concatenate the treatments/programs/locations/blog body copy (strip nav/footer) into one markdown file.
- **MEDIUM — Three real pages are missing from llms.txt, and none are orphaned pages that should be excluded:**
  - `programs/outpatient-rehab.html` — internally linked from 40+ pages (confirmed via `grep -rl "programs/outpatient-rehab"`) but absent from the Programs section of llms.txt. Add: `- [Outpatient Rehab](https://www.goldenstate-rehab.com/programs/outpatient-rehab): what outpatient treatment looks like day to day`
  - `spanish-speaking-treatment.html` — linked from `espanol.html`, `index.html`, `mental-health.html`, and all 11 location pages, but not listed (only the `/espanol` and `/es/` entries are). Add: `- [Spanish-Speaking Treatment Track](https://www.goldenstate-rehab.com/spanish-speaking-treatment): bilingual clinicians, se habla español`
  - `verify-insurance.html` is listed but under "Resources" only in English; the Spanish equivalent `/es/verify-insurance` is listed but `families.html`/`/es/families` and `team.html` aren't cross-referenced from the Español section even though team bios exist in both languages.
- **LOW — `amenity-map.html` correctly omitted** (it's a low-value interactive map fragment, no schema, thin content — right call to leave it out).
- **LOW — Contact section breaks the link-per-line convention.** Lines like `- Phone: (424) 208-3120 (24/7 admissions, se habla español)` and `- Address: 1964 Westwood Blvd...` are plain text, not `[label](url): description` — harmless for LLM parsing but technically off-spec. Acceptable as-is; not worth fixing.
- **Positive:** The blockquote summary is exemplary GEO copy — it front-loads the DHCS license number, Joint Commission accreditation, service list, and phone number in one dense, quotable sentence. This is exactly the kind of self-contained entity statement AI answer engines lift verbatim.

**Recommended concrete edits to `llms.txt`:**
```
## Programs
- [All Programs](https://www.goldenstate-rehab.com/programs/)
- [Outpatient Rehab](https://www.goldenstate-rehab.com/programs/outpatient-rehab): what outpatient treatment looks like day to day
- [PHP](https://www.goldenstate-rehab.com/programs/php), ...

## En Español
- [Spanish-Speaking Treatment Track](https://www.goldenstate-rehab.com/spanish-speaking-treatment): bilingual clinicians, se habla español
```
Also add a top-level `- [llms-full.txt](https://www.goldenstate-rehab.com/llms-full.txt): full-text version of every page on this site` line once that file exists.

---

## 2. Passage-Level Citability (5 pages read directly)

Scoring each against: direct 40–60 word answer under the heading, concrete numbers, named entities, self-containment.

### `blog/how-much-does-rehab-cost.html` — Score: 7/10
**Strong:** The composite-example section (`#composite`) is genuinely excellent GEO content — concrete, sourced numbers an LLM can quote verbatim:
> "If your deductible is $3,000 and your out of pocket maximum is $6,500, then the absolute worst case for a full course of in network outpatient treatment this year is $6,500, no matter how long you stay."
This is a self-contained, numerically anchored claim exactly in the citable range (39 words).

**Weak:** The `#what-drives-cost` H2 answer opens with a rhetorical hook rather than the answer: *"Two people can attend the identical program on the same schedule and pay amounts that differ by a factor of twenty. The list price is barely involved. Four things drive your real number."* — then makes the reader open a `<ul>` to get the actual four factors. An AI engine extracting the first passage under this H2 gets a teaser, not an answer.

**Rewrite (model passage, ~55 words, direct-answer-first):**
> "What determines what rehab costs you: (1) level of care — outpatient costs a fraction of residential because there's no housing or 24-hour staffing bill; (2) in-network vs. out-of-network status, the single biggest swing factor; (3) how much of your deductible you've already met this plan year; (4) length of treatment. In-network outpatient care rarely exceeds your plan's out-of-pocket maximum."

### `blog/does-insurance-cover-rehab-in-california.html` — Score: 8/10
**Strong:** FAQ h3 answers are near-perfect citable units — direct "Yes"/"No" lead, then compact reasoning, named laws:
> "Yes. Medi-Cal covers substance-use treatment through the Drug Medi-Cal program (DMC-ODS), including outpatient services, withdrawal management, and medication-assisted treatment, plus mental-health services. You don't need private insurance to get help." (34 words — could be extended slightly to reach 40-60, but structurally ideal.)

**Weak:** The lead H2 ("The short answer: yes, and the law is on your side") answers via a 3-bullet list of statute names before ever stating the plain-English takeaway. The actual plain-English answer is buried in a `.article-callout` div *after* the list:
> "In California, a health plan generally cannot refuse to cover medically necessary addiction or mental-health treatment, and cannot cover it less generously than it covers physical health care."
This is the sentence that should lead the section, not follow it.

### `treatments/fentanyl.html` — Score: 6/10
**Strong:** Opens with a citable, sourced stat: *"Fentanyl is a synthetic opioid roughly 50 times more potent than heroin and 100 times more potent than morphine"* (linked to NIDA), and the "Truth About Fentanyl" section closes with a visible source list (NIDA, CDC) — rare and valuable for AI trust signals.

**Weak:** The lead H2 paragraph runs 87 words across two sentences of dense background before getting to anything an AI could safely lift as a self-contained claim — it mixes epidemiology, treatment philosophy, and a CTA link in one block. Also the H2 itself ("Fentanyl Is Different — So Treatment Has to Be") is a slogan, not a query match.

### `locations/santa-monica.html` — Score: 9/10 (best of the five)
This page is the model for the rest of the site. The "Rehab Near Santa Monica: FAQ" section is exactly the target shape — direct answer first, specific numbers, named entities, self-contained:
> "We're at 1964 Westwood Blvd, Suite 425, Los Angeles, CA 90025 — about six miles east of downtown Santa Monica. Most drives take around 15 minutes via Olympic Blvd or the I-10, and Big Blue Bus lines along Santa Monica Blvd can get you here without a car." (48 words — inside the 40–60 target band, concrete distance/time, named roads and transit line.)

The "Claims You Can Check Yourself" section is also a strong authority pattern (see Section 4 below).

### `faq.html` — Score: 7/10
Individual Q&A pairs are well-formed (40–90 words, direct-answer-first, e.g. the insurance and admissions items quoted in Section 4). **Weak:** the page-level H2s are category labels, not questions (`Admissions`, `Insurance & Cost`, `Programs & Treatment`) — see Section 3, these should stay as visual group headers but the individual `<button class="faq-question">` text is already correctly question-shaped, so this is a LOW-severity, cosmetic-only gap.

---

## 3. Query-Shaped Headings

**Site-wide measurement (from headings extracted across all 116 pages): only 230 of 1,812 H2/H3 headings (13%) are phrased as questions.** The FAQ-block h3s (inside `.faq-item` buttons) account for nearly all of that 13% — the *structural* H2s that organize long-form content are almost entirely topic labels.

**Specific headings to rewrite (HIGH — these are the headings that carry the actual answer content, not just FAQ accordions):**

| File | Current H2 | Rewrite |
|---|---|---|
| `blog/does-insurance-cover-rehab-in-california.html` | "The short answer: yes, and the law is on your side" | "Does insurance cover rehab in California?" (put the yes/no answer in the first sentence beneath it) |
| `blog/does-insurance-cover-rehab-in-california.html` | "Insurance providers we work with" | "Which insurance providers does Golden State Rehab accept?" |
| `blog/does-insurance-cover-rehab-in-california.html` | "What if my claim is denied or I'm underinsured?" | Already question-shaped — keep as-is, model example. |
| `blog/how-much-does-rehab-cost.html` | "What actually determines what rehab costs you" | "What determines how much rehab costs in Los Angeles?" |
| `blog/how-much-does-rehab-cost.html` | "A composite example of how the math really lands" | "How much does IOP actually cost with insurance? (example)" |
| `treatments/fentanyl.html` | "Fentanyl Is Different — So Treatment Has to Be" | "How is fentanyl addiction treatment different from other opioid treatment?" |
| `treatments/fentanyl.html` | "The Truth About Fentanyl in Los Angeles" | "How common is fentanyl in Los Angeles's drug supply?" |
| `locations/santa-monica.html` | "Structured Care, About 15 Minutes from Santa Monica" | Fine as a hero headline, but pair with an explicit FAQ item "How far is treatment from Santa Monica?" (already exists lower on the page — good, just missing at the top). |
| `faq.html` | "Insurance & Cost" (H2 group label) | Keep as category label but wrap each h3 answer's opening sentence in a `<strong>` direct-answer lead (currently plain text) so extraction tools can find the lead sentence faster. LOW priority. |

---

## 4. Entity Clarity for LLMs (body text, not just JSON-LD)

**Verdict: strong.** This is one of the site's genuine GEO strengths — the DHCS license and accreditation are stated in extractable prose, repeatedly, not locked inside `<script type="application/ld+json">`.

Evidence (`locations/santa-monica.html`, "Claims You Can Check Yourself" section):
> "We hold California DHCS license #191643AP for outpatient treatment. Look us up in the state's provider directory — it takes about a minute." / "Your care is directed by Dr. Eric Chaghouri, MD, a board-certified psychiatrist who trained at the Keck School of Medicine at USC." / "LegitScript has certified us as a legitimate treatment provider..."

This "verifiable claims" card pattern (DHCS license + physician credential + third-party certification, each with a link out to the primary source) appears to be a **treatments/locations-page pattern** — confirm it is present on all 11 location pages and the treatments hub, not just Santa Monica (spot-checked via schema/grep: `review-date` and the licensing block both appear across all `locations/*.html` and `treatments/*.html`, so coverage looks consistent).

**MEDIUM gap:** the blog posts (the highest-intent, highest-traffic pages for cost/insurance queries) do **not** repeat this "Claims You Can Check Yourself" block. `blog/how-much-does-rehab-cost.html` and `blog/does-insurance-cover-rehab-in-california.html` never state the DHCS license number or Joint Commission accreditation in body copy — only in the sitewide JSON-LD. Since these are the pages most likely to be the actual AI answer source for "is Golden State Rehab legitimate / licensed" style follow-up queries, add one sentence near the byline or CTA, e.g.:
> "Golden State Rehab is a Joint Commission–accredited, DHCS-licensed (#191643AP) outpatient treatment center in Westwood, Los Angeles."

**Name consistency:** "Golden State Rehab" is used consistently (no alternate legal names, DBAs, or abbreviations spotted that would fragment entity recognition) — good.

---

## 5. Off-Site Citation Surfaces (prioritized, for a Westwood/West LA outpatient rehab)

Not independently re-verified live in this pass (no browsing/search tool used for this section) — treat as a prioritized action list based on what drives AI citations for local healthcare providers, cross-referenced against what the site itself already links to (confirmed via `external_hosts` extraction: the site cites NIDA, SAMHSA, CDC, ASAM, CMS, DOL, HHS as sources — zero outbound links to Reddit, YouTube, or Wikipedia, and zero evidence of inbound presence signals in the crawled data).

1. **HIGH — SAMHSA FindTreatment.gov listing.** Already cited as a source 13 times in body copy but the clinic's own presence in the directory isn't confirmed/promoted anywhere on-site. This is the single most AI-trusted directory for "rehab near me" style queries (ChatGPT/Perplexity lean on .gov sources heavily) — verify/claim the listing and link to it from `locations.html` and `contact.html` the same way `sapccms.dhcs.ca.gov` is already linked.
2. **HIGH — Google Business Profile depth.** A GBP link exists in llms.txt (`https://www.google.com/maps?cid=15086981718348312167`) and is cited 112 times site-wide — good. Priority is off-site: review volume/recency and Q&A completeness on the profile itself, since Google AI Overviews and Bing Copilot weight GBP review text heavily for local intent queries.
3. **HIGH — Psychology Today provider profile.** Standard, high-authority directory for behavioral health specifically; not referenced anywhere in the crawled site. Psychology Today profiles are frequently surfaced/cited by ChatGPT and Perplexity for "therapist/rehab near me" queries because of the directory's domain authority in mental health.
4. **MEDIUM — YouTube presence (strongest correlation in the brand-mention data, ~0.737).** No YouTube mentions or embeds found anywhere in the 116-page crawl. Even a small library of facility-tour / "what to expect at intake" / staff-credential videos, embedded on `our-facility.html` and `first-day-of-rehab.html`, would be the highest-leverage single addition per the correlation data.
5. **MEDIUM — Reddit presence.** No outbound or evidence of inbound Reddit signal. Organic, disclosed participation (not astroturfing) in threads like r/addiction, r/StopDrinking, r/Sober, or LA-specific subs, answering "is X rehab legit" style questions, is a recognized driver of ChatGPT/Perplexity citations for this vertical.
6. **MEDIUM — Wikipedia entity anchor.** Not applicable as a direct listing (rehab clinics are rarely independently notable), but ensure the clinic's DHCS license, Joint Commission accreditation, and medical director are consistent with any West LA / Westwood neighborhood or healthcare-directory Wikipedia references that could anchor the entity indirectly (e.g., Wikidata entries for the medical director if he has other public credentials).
7. **LOW-MEDIUM — Local news / earned media.** No evidence of press mentions. A local (LAist, Los Angeles Times health section, Patch) piece on the fentanyl crisis or outpatient care access, quoting Dr. Chaghouri, would give AI engines a third-party corroboration source distinct from the clinic's own domain (Domain Rating correlation with citations is weak at ~0.266, so third-party corroboration matters more than backlink volume alone).
8. **LOW — Yelp.** Lower AI-citation value than GBP/Psychology Today for this vertical but still worth claiming/maintaining for completeness and consistency (NAP — name/address/phone — matching across directories reduces entity ambiguity for crawlers).

---

## 6. Freshness Signals

**Verdict: present and above-average, with one inconsistency.**

- `faq.html`, `treatments/fentanyl.html`, `locations/santa-monica.html`, and (confirmed via grep) all 11 location pages, all treatment pages, and all program pages carry a visible byline pattern:
  > "Medically reviewed by Dr. Eric Chaghouri, MD — Medical Director, Golden State Rehab" + `<span class="review-date">Updated July 2026</span>`
  This is exactly the E-E-A-T/freshness pattern AI engines favor, and it's genuinely visible in rendered body text, not just JSON-LD `lastReviewed`.
- **MEDIUM — Blog posts show a publish date but no visible "Updated" date.** `blog/cost-of-rehab-in-los-angeles.html` and its siblings show `<span class="article-meta-item">📅 June 5, 2026</span>` (publish date) and "Written and medically reviewed by Dr. Eric Chaghouri, MD" but **no visible `review-date` span** — that pattern exists only in the JSON-LD (`"lastReviewed": "2026-08-19"`). Since the JSON-LD date is materially newer than the visible publish date on several posts (e.g., `cost-of-rehab-in-los-angeles.html` shows "June 5, 2026" in body but `lastReviewed: 2026-08-19` in schema), a human or an AI system that only reads visible text would perceive this content as older than it actually is. Fix: add the same `<span class="review-date">Updated [Month Year]</span>` used on treatment/location pages to all 12 blog posts, matching the JSON-LD date.

---

## Top 5 Highest-Impact Changes (prioritized)

1. **[HIGH, ~30 min]** Add visible "Updated [Month Year]" date spans to all 12 blog posts (currently only in JSON-LD, inconsistent with the visible publish date) — `blog/*.html`, follow the exact pattern already used in `treatments/fentanyl.html:102` and `faq.html:150`.
2. **[HIGH, ~1–2 hrs]** Rewrite the 6 structural H2s listed in Section 3 from topic labels to question form, and move the direct-answer sentence to the first sentence under each (see the `#composite`/`#what-drives-cost` example in Section 2). Highest leverage on `blog/how-much-does-rehab-cost.html`, `blog/does-insurance-cover-rehab-in-california.html`, `treatments/fentanyl.html`.
3. **[MEDIUM, ~30 min]** Add `programs/outpatient-rehab.html` and `spanish-speaking-treatment.html` to llms.txt; both are heavily internally linked (40+ and 14 internal links respectively) but absent from the AI-facing index.
4. **[MEDIUM, ~2–3 hrs]** Add a one-sentence "Joint Commission–accredited, DHCS-licensed (#191643AP)" entity statement to the two highest-intent blog posts (`how-much-does-rehab-cost.html`, `does-insurance-cover-rehab-in-california.html`), matching the "Claims You Can Check Yourself" pattern already used on location pages.
5. **[MEDIUM, ~half day]** Produce `llms-full.txt` (concatenated full-text of all indexable pages) — spec-compliant companion to the existing `llms.txt` link index, one-time build, meaningfully increases how much of the site a token-budget-constrained crawler can ingest in one fetch.

---

## Platform-Specific Notes

- **Google AI Overviews:** Best-positioned dimension given the JSON-LD depth (`FAQPage`, `MedicalOrganization`, `LocalBusiness`, `MedicalWebPage` on nearly every page) and the GBP link density. Biggest lever: GBP review recency/volume (off-site, not fixable in this repo).
- **ChatGPT / OAI-SearchBot:** Benefits most from the llms.txt + llms-full.txt work (Section 1) and from directory presence (SAMHSA, Psychology Today) — ChatGPT search leans heavily on high-authority third-party directories for local-service verticals.
- **Perplexity:** Rewards the numerically concrete, sourced passages already present (the `$3,000/$6,500` example, the NIDA/CDC-sourced fentanyl stats) — these are the strongest existing citability assets on the site; do more of exactly this pattern.
- **Bing Copilot:** Tracks robots.txt/Bing-specific signals closely; already fully allowed. No further action identified beyond the sitewide freshness/heading fixes above.

---

## Files Referenced in This Audit
- `/Users/kkareem_1/Documents/Claude COde/Web Design/arm-website-golden-state-rehab-2/llms.txt`
- `/Users/kkareem_1/Documents/Claude COde/Web Design/arm-website-golden-state-rehab-2/robots.txt`
- `/Users/kkareem_1/Documents/Claude COde/Web Design/arm-website-golden-state-rehab-2/blog/how-much-does-rehab-cost.html`
- `/Users/kkareem_1/Documents/Claude COde/Web Design/arm-website-golden-state-rehab-2/blog/does-insurance-cover-rehab-in-california.html`
- `/Users/kkareem_1/Documents/Claude COde/Web Design/arm-website-golden-state-rehab-2/blog/cost-of-rehab-in-los-angeles.html`
- `/Users/kkareem_1/Documents/Claude COde/Web Design/arm-website-golden-state-rehab-2/treatments/fentanyl.html`
- `/Users/kkareem_1/Documents/Claude COde/Web Design/arm-website-golden-state-rehab-2/locations/santa-monica.html`
- `/Users/kkareem_1/Documents/Claude COde/Web Design/arm-website-golden-state-rehab-2/faq.html`
- `/Users/kkareem_1/Documents/Claude COde/Web Design/arm-website-golden-state-rehab-2/programs/outpatient-rehab.html`
- `/Users/kkareem_1/Documents/Claude COde/Web Design/arm-website-golden-state-rehab-2/spanish-speaking-treatment.html`
