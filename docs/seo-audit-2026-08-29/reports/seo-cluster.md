# Internal Linking / Cluster Architecture Audit — Golden State Rehab

**Method:** Parsed the saved HTML for all 71 EN pages, stripped `<nav>`, `<footer>`, `div.phone-banner`, and any breadcrumb/sticky elements, then extracted every remaining `<a>` (article body, related-post widgets, in-page CTA sections) that resolves to another crawled EN URL. Tel/mailto/anchor/social-share links excluded. This is the **contextual link graph** — everything below is built from it, not from nav.

## Score: 68 / 100

**Why:** The primary hub→spoke skeleton is unusually solid (100% bidirectional coverage on all four hubs), which is the hardest part to get right and most sites fail it. The score is held back by three concrete leaks: commercial-intent blog posts that skip the conversion CTA, treatment pages that get zero blog support, and a Spanish cluster that's translated the wrong half of the funnel. These are all fixable with links, not new content.

---

## 1. Contextual Link Graph — Headline Findings

| Finding | Detail |
|---|---|
| Pages with 0 contextual inlinks | `/` (homepage), `/about`, `/privacy-policy`, `/terms-and-conditions` — expected for legal pages; homepage getting 0 in-body inlinks is normal but means zero internal "vote" flows to it beyond nav. |
| Blog posts with 0 links to any `/programs/*` or `/treatments/*` page | 6 of 16 (37%): `cbt-vs-dbt-which-is-right`, `cost-of-rehab-in-los-angeles`, `does-insurance-cover-rehab-in-california`, `does-medi-cal-cover-rehab-in-california`, `first-week-of-outpatient-rehab`, `terrified-to-ask-for-help`. |
| Treatment pages with 0 inlinks from any blog post | 11 of 14: anxiety, cocaine, complex-trauma, depression, fentanyl, meth, opioid, prescription-drugs, ptsd, ptsd, sex-addiction (alcohol and dual-diagnosis are the only ones blog links reach). |
| Program pages with 0 inlinks from any blog post | `holistic-therapies` only (its 17 inlinks are all from `/`, `/programs`). |
| Location page outbound pattern | Every location page links to: 2-3 treatment pages, all 4 core programs (php/iop/telehealth/individual-therapy), `/mental-health`, `/spanish-speaking-treatment`, `/verify-insurance` (x3), 3 neighboring locations, `/team`. **10 of 11 location pages link to zero blog posts** (west-los-angeles is the sole exception, linking to `find-rehab-near-me-los-angeles`). |
| Biggest inlink magnets | `/verify-insurance` (86), `/team` (70, mostly author-byline links — real for E-E-A-T, not topical), `/programs/iop` (41), `/programs/php` (36), `/programs/telehealth` (25), `/treatments/dual-diagnosis` (19), `/programs/individual-therapy` (19). |
| Anchor text quality (sampled 5 posts: how-long-is-rehab, inpatient-vs-outpatient-rehab, first-day-of-rehab, questions-to-ask-a-rehab-center, what-happens-after-rehab) | Overwhelmingly descriptive: "partial hospitalization," "intensive outpatient," "check your benefits here," "our guide to family involvement," "dual diagnosis care." Only mild genericness on `/team`, `/faq`, `/our-facility` links ("team page," "FAQ," "facility page"). No "click here" instances found. Related-post cards use full title+dek as the anchor (functionally fine, not a generic-anchor problem). |

---

## 2. Hub → Spoke Link Matrix

All four primary hubs achieve **100% bidirectional coverage** — every spoke links to its hub, and the hub links to every spoke. This is the strongest part of the site's architecture.

| Cluster | Hub | Spokes | Hub→Spoke | Spoke→Hub | Missing |
|---|---|---|---|---|---|
| Programs/levels of care | `/programs` | 9 (php, iop, outpatient-rehab, telehealth, individual-therapy, group-therapy, medication-management, holistic-therapies, alumni) | 9/9 | 9/9 | none |
| Conditions (substance) | `/treatments` | 14 (alcohol, anxiety, cbt, cocaine, complex-trauma, dbt, depression, dual-diagnosis, fentanyl, meth, opioid, prescription-drugs, ptsd, sex-addiction) | 14/14 | 14/14 | none |
| Local | `/locations` | 11 city pages | 11/11 | 11/11 | none |
| Blog | `/blog` | 16 posts | 16/16 | 16/16 | none |
| Mental health (secondary hub) | `/mental-health` | depression, anxiety, ptsd, complex-trauma, dual-diagnosis | 5/5 | 5/5 | none |
| Family | `/families` | 2 blog posts (`can-family-come-to-rehab-visits`, `terrified-to-ask-for-help`) | 2/2 | 2/2 | none — but only 1 additional blog post (`what-happens-after-rehab`) links in beyond the mandatory pair |
| Cost & insurance | `/verify-insurance` | 4 cost/insurance-intent blog posts | n/a (verify-insurance is a conversion page, not a content hub) | **3 of 4 missing** — see §3 | `cost-of-rehab-in-los-angeles`, `does-insurance-cover-rehab-in-california`, `does-medi-cal-cover-rehab-in-california` do NOT link to `/verify-insurance` |
| Choosing a rehab | `/faq` (weak hub) | `questions-to-ask-a-rehab-center`, `do-i-need-rehab` | 1/2 (`/faq` only links to `questions-to-ask-a-rehab-center`) | 1/2 | `/faq` → `do-i-need-rehab` missing; no true pillar exists for this cluster (see gap list) |

**Second-tier gap (real, not shown in the matrix above):** cross-hub linking. The hubs are internally perfect, but blog↔treatment/program and location↔blog bridges are inconsistent — see §1.

---

## 3. Intent Classification & CTA Gap (16 EN blog posts)

| Post | Intent | Links to a program/treatment page? | Links to `/verify-insurance`? | Needs stronger commercial CTA? |
|---|---|---|---|---|
| do-i-need-rehab | Informational | Yes | No | **Yes** — add verify-insurance |
| terrified-to-ask-for-help | Informational | **No** | No | Yes — add individual-therapy + verify-insurance |
| cbt-vs-dbt-which-is-right | Informational | **No** | No | Add /treatments/cbt, /treatments/dbt |
| first-day-of-rehab | Informational | Yes | Yes | No — already strong |
| first-week-of-outpatient-rehab | Informational | **No** | No | Yes — add /programs/iop |
| how-long-is-rehab | Informational | Yes | Yes | No |
| what-happens-after-rehab | Informational | Yes | No | Add verify-insurance (aftercare cost question) |
| can-i-work-while-in-rehab | Informational | Yes | Yes | No |
| can-family-come-to-rehab-visits | Informational | Yes | No | Minor |
| inpatient-vs-outpatient-rehab | Commercial | Yes | Yes | No — model post |
| questions-to-ask-a-rehab-center | Commercial | Yes | Yes | No |
| find-rehab-near-me-los-angeles | Commercial/Transactional | Yes | **No** | **Yes** — highest-intent post missing conversion link |
| cost-of-rehab-in-los-angeles | Commercial | **No** | **No** | **Yes — top priority** |
| how-much-does-rehab-cost | Commercial | Yes | Yes | No |
| does-insurance-cover-rehab-in-california | Commercial | **No** | **No** | **Yes — top priority** |
| does-medi-cal-cover-rehab-in-california | Commercial | **No** | **No** | **Yes — top priority** |

No navigational-intent posts found (none needed removal from clustering).

**Cannibalization flag:** `cost-of-rehab-in-los-angeles` and `how-much-does-rehab-cost` target near-identical queries and near-identical H2 sets ("short answer: typical cost by level of care" / "how to read your insurance plan" vs "how much does rehab cost in LA specifically"). They already interlink each other, which mitigates SERP competition somewhat, but both independently ranking for the same head term is a real risk — recommend consolidating the differentiator explicitly in each title/intro (one as "LA-specific pricing," the other as "insurance math explainer") or merging into one pillar with the other as a redirect/canonical spoke.

---

## 4. Content Gap List (15 topics, prioritized)

WebSearch-validated (3 checks): PHP-vs-IOP, detox-vs-rehab, and sober-living-near-UCLA/Westwood all returned dedicated competitor content with distinct SERPs from anything currently on-site — confirming these are genuine gaps, not overlap with existing posts.

| # | Suggested title | Target hub | Intent |
|---|---|---|---|
| 1 | PHP vs IOP: Which Level of Care Do You Need? | Programs | Commercial |
| 2 | Detox vs. Rehab: Do You Need Detox First? *(note: site has no detox program — frame as educational + warm referral-out, not a service page)* | Programs | Informational |
| 3 | What Is a Partial Hospitalization Program (PHP)? | Programs | Informational |
| 4 | Does Anthem Blue Cross Cover Rehab in California? | Cost & insurance | Commercial |
| 5 | Does Aetna Cover Rehab in California? | Cost & insurance | Commercial |
| 6 | Does Cigna Cover Rehab in California? | Cost & insurance | Commercial |
| 7 | Does Blue Shield of California Cover Rehab? | Cost & insurance | Commercial |
| 8 | Does Kaiser Permanente Cover Rehab in California? | Cost & insurance | Commercial |
| 9 | MAT and Suboxone in Outpatient Rehab: What to Expect | Programs / Conditions (opioid) | Informational |
| 10 | Telehealth Rehab in California: Rules, Licensing, and What It Covers | Programs (telehealth) | Informational |
| 11 | Sober Living Near UCLA and Westwood: A Student's Guide | Local | Commercial |
| 12 | Rehab for UCLA Students: Balancing Treatment and School | Local / Programs | Informational |
| 13 | Rehab for Healthcare Professionals: Confidential Treatment Options | Conditions / Programs | Commercial |
| 14 | What Is IOP? A Complete Guide to Intensive Outpatient | Programs | Informational |
| 15 | Group Therapy vs. Individual Therapy in Outpatient Rehab | Programs | Informational |

Items 4-8 (insurance carriers) should each link to `/verify-insurance` and to the existing `does-insurance-cover-rehab-in-california` post as the parent — they're the single highest-leverage gap given `/verify-insurance` already pulls 86 contextual inlinks and clearly converts.

---

## 5. Spanish Cluster

Currently translated (6 of 16): `cbt-vs-dbt-which-is-right`, `cost-of-rehab-in-los-angeles`, `does-insurance-cover-rehab-in-california`, `does-medi-cal-cover-rehab-in-california`, `first-week-of-outpatient-rehab`, `terrified-to-ask-for-help`.

**Observation:** the translated set is entirely awareness/cost content — nothing from the decision/comparison stage exists in Spanish, and nothing family-oriented exists despite `/families` and family visitation being a strong cultural fit for the Spanish-speaking audience.

**Recommend translating next (5):**
1. `inpatient-vs-outpatient-rehab` — core decision-stage pillar, highest word count, feeds PHP/IOP/telehealth spokes.
2. `do-i-need-rehab` — top-of-funnel self-assessment, no Spanish equivalent exists at all.
3. `questions-to-ask-a-rehab-center` — commercial/comparison-shopping stage, currently has zero ES coverage.
4. `can-family-come-to-rehab-visits` — direct cultural fit with `/families`, currently unaddressed in ES.
5. `find-rehab-near-me-los-angeles` — commercial/local intent, currently zero ES local-conversion content.

Do **not** translate `how-much-does-rehab-cost` next — it would duplicate the already-translated `cost-of-rehab-in-los-angeles` topic and compound the cannibalization risk noted in §3, in a second language.

---

## 6. Prioritized: Add These 20 Internal Links

| # | Source | Target | Suggested anchor |
|---|---|---|---|
| 1 | `/blog/cost-of-rehab-in-los-angeles` | `/verify-insurance` | "check your exact coverage in under two minutes" |
| 2 | `/blog/cost-of-rehab-in-los-angeles` | `/programs/php` | "our PHP program" |
| 3 | `/blog/does-insurance-cover-rehab-in-california` | `/verify-insurance` | "verify your benefits here" |
| 4 | `/blog/does-insurance-cover-rehab-in-california` | `/programs/iop` | "our IOP program" |
| 5 | `/blog/does-medi-cal-cover-rehab-in-california` | `/verify-insurance` | "confirm your Medi-Cal coverage" |
| 6 | `/blog/does-medi-cal-cover-rehab-in-california` | `/programs/outpatient-rehab` | "our outpatient program" |
| 7 | `/blog/find-rehab-near-me-los-angeles` | `/verify-insurance` | "verify your insurance benefits" |
| 8 | `/blog/find-rehab-near-me-los-angeles` | `/programs/php` | "our PHP and IOP programs" |
| 9 | `/blog/first-week-of-outpatient-rehab` | `/programs/iop` | "intensive outpatient program (IOP)" |
| 10 | `/blog/first-week-of-outpatient-rehab` | `/verify-insurance` | "verify your insurance" |
| 11 | `/blog/cbt-vs-dbt-which-is-right` | `/treatments/cbt` | "our CBT-based treatment" |
| 12 | `/blog/cbt-vs-dbt-which-is-right` | `/treatments/dbt` | "our DBT program" |
| 13 | `/blog/terrified-to-ask-for-help` | `/programs/individual-therapy` | "individual therapy" |
| 14 | `/blog/terrified-to-ask-for-help` | `/verify-insurance` | "confidentially verify your insurance" |
| 15 | `/blog/do-i-need-rehab` | `/verify-insurance` | "verify your insurance" |
| 16 | `/blog/what-happens-after-rehab` | `/verify-insurance` | "what your plan covers for aftercare" |
| 17 | `/faq` | `/blog/do-i-need-rehab` | "10 honest signs it's time for help" |
| 18 | `/faq` | `/blog/does-insurance-cover-rehab-in-california` | "does insurance cover rehab in California" |
| 19 | `/locations/santa-monica` | `/blog/find-rehab-near-me-los-angeles` | "how to find the right rehab near you" |
| 20 | `/locations/culver-city` | `/blog/inpatient-vs-outpatient-rehab` | "inpatient vs. outpatient rehab" |

(Items 1-16 close the CTA/cross-hub leak on the six under-linked blog posts; 17-20 start bridging FAQ and location pages into the blog cluster, currently near-zero.)

---

## Validation Checklist

- [x] Hub↔spoke bidirectional coverage checked programmatically (100% on all 4 primary hubs).
- [x] Contextual-only graph (nav/footer/phone-banner/breadcrumb excluded).
- [x] Cannibalization pair flagged (cost-of-rehab-in-los-angeles vs how-much-does-rehab-cost).
- [x] Anchor text sampled and classified (5 posts, mostly descriptive).
- [x] Gap list SERP-validated on 3 highest-uncertainty items (PHP vs IOP, detox vs rehab, sober living UCLA/Westwood) via WebSearch.
- [x] Spanish cluster reviewed against EN inventory; 5 next-translation picks avoid duplicating already-translated topics.
