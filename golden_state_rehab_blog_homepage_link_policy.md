# When a Blog Post Earns a Homepage Link — Golden State Rehab

**Date:** 2026-08-31
**Scope:** goldenstate-rehab.com /blog/ (16 English posts; the 6 /es/blog/ posts are twins and inherit their English post's verdict — never link a Spanish post from the homepage independently).
**Governing doctrine:** homepage links are scarce PageRank; a blog post gets one only when it targets an underserved, low-competition niche the site can actually rank for, and converts that ranking into admissions. Default answer for any post: **no**.

**Caution:** this repo is publicly served by Cloudflare Pages once committed. Keep this file untracked, or move it out of the repo before the next commit.

---

## (a) The Checklist — 5 points, ALL must pass

A post that fails any single point inherits authority through the /blog/ hub link only.

| # | Test | Pass means | Fail looks like |
|---|------|-----------|-----------------|
| 1 | **Niche, underserved audience** | The post serves a specific searcher segment (working professionals, union members, freelancers, students, returning patients) whose exact situation generic national content doesn't address. | A head informational query anyone might type ("how long is rehab", "do I need rehab", "CBT vs DBT"). |
| 2 | **Winnable SERP — verified, not assumed** | Top 10 for the target query is small single-location facility blogs, or the topic's own institutional pages. Checked by actually searching, and re-checked before the link ships. | AmericanAddictionCenters, rehabs.com, recovery.com, Addiction Resource, Psychology Today, Healthline/WebMD, or SAMHSA holding multiple top-10 slots. National aggregators = not winnable. |
| 3 | **Buyer-adjacent intent with service fit** | The searcher is realistically on a path to admitting at an outpatient PHP/IOP facility in West LA that works with major PPO plans. Ranking produces qualified calls. | Intent skews inpatient/detox (services we don't offer), Medi-Cal-only searchers, pure curiosity, or family-of-inpatient-patient queries. Traffic without admissions is noise. |
| 4 | **Feeds money pages contextually** | Body copy links with descriptive anchors to ≥2 Tier-1/2 money pages (/programs/iop, /programs/outpatient-rehab, /insurance/ carriers, /verify-insurance), so homepage equity flows through the post into the pages that convert. | Only /verify-insurance + /mental-health boilerplate links, or no in-body money links at all. |
| 5 | **No cannibalization; the link is the deciding boost** | The post's query overlaps no money page or homepage target, and the post is close enough to page 1 on a winnable SERP that one extra hop of authority plausibly moves it. | The post targets a query the homepage or a money page already owns ("find rehab near me los angeles"), or it could rank identically with just the hub link. |

**Hard cap:** at most **2** individual blog posts linked from the homepage at any time, contextually in body copy, never in a link list. If a third post qualifies, the weakest current holder loses its slot.

---

## (b) The 16 Existing Posts, Scored

Verdicts on points 1, 4, and 5 are observed from the files and doctrine docs. Point 2 is **observed (searched 2026-08-31)** only where noted; elsewhere it is inferred from known SERP patterns for rehab head terms and marked accordingly.

| Post | 1 Niche | 2 Winnable | 3 Fit/Intent | 4 Feeds $ | 5 No cannib. | Verdict |
|---|---|---|---|---|---|---|
| **can-i-work-while-in-rehab** | ✅ employed professionals | ✅ **verified**: SERP is 100% small regional facilities (Northern Illinois Recovery, Freedom Center, Rock View, etc.), zero national aggregators | ✅ evening IOP is our exact differentiator | ✅ IOP, outpatient, PHP, telehealth | ✅ | **PASS — earns the homepage link** |
| can-family-come-to-rehab-visits | ✅ family members | ➖ unverified | ❌ "rehab visits" intent skews inpatient visitation — we have no visits to attend | ✅ | ✅ | FAIL (3) |
| cbt-vs-dbt-which-is-right | ❌ head therapy query | ❌ medical publishers (Healthline-class) own this nationally — inferred | ➖ | ❌ only mental-health + verify | ✅ | FAIL (1,2,4) |
| cost-of-rehab-in-los-angeles | ❌ broad audience | ❌ aggregators hold LA cost SERPs — inferred | ✅ strong | ✅ all 5 carrier pages | ✅ | FAIL (1,2) — closest miss; already feeds the insurance cluster well from where it sits. Re-check its SERP quarterly. |
| do-i-need-rehab | ❌ head query | ❌ AAC-class quiz content — inferred | ➖ | ✅ | ✅ | FAIL (1,2) |
| does-insurance-cover-rehab-in-california | ❌ broad state query | ❌ aggregators + large CA operators — inferred | ✅ | ✅ | ⚠️ overlaps /insurance/ hub's intent | FAIL (1,2,5) |
| does-medi-cal-cover-rehab-in-california | ✅ Medi-Cal population | ➖ plausibly winnable | ❌ Medi-Cal searchers generally can't admit at a PPO-oriented facility — ranking ≠ qualified calls | ➖ hub + verify only | ✅ | FAIL (3) |
| find-rehab-near-me-los-angeles | ❌ | ❌ map pack + aggregators | ✅ | ✅ | ❌ **cannibalizes the homepage's own head term** | FAIL (1,2,5) — never link this from the homepage |
| first-day-of-rehab | ❌ broad | ❌ inpatient-skewed national SERP — inferred | ⚠️ | ✅ | ✅ | FAIL (1,2) |
| first-week-of-outpatient-rehab | ⚠️ semi-niche (already-deciding patients) | ➖ long-tail, plausibly winnable | ✅ | ❌ only mental-health + verify | ✅ | FAIL (4) — fixable: add IOP/outpatient body links, then re-evaluate |
| how-long-is-rehab | ❌ head query | ❌ AAC owns it — inferred | ➖ | ✅ | ✅ | FAIL (1,2) |
| how-much-does-rehab-cost | ❌ national head query | ❌ aggregators — inferred | ✅ | ✅ | ⚠️ overlaps LA-cost post | FAIL (1,2) |
| inpatient-vs-outpatient-rehab | ❌ head query | ❌ aggregators — inferred | ⚠️ half the intent wants inpatient | ✅ | ✅ | FAIL (1,2) |
| questions-to-ask-a-rehab-center | ❌ broad | ❌ national listicles — inferred | ➖ | ✅ | ✅ | FAIL (1,2) |
| terrified-to-ask-for-help | ❌ no target query at all (alum story) | ❌ n/a | ➖ | ❌ | ✅ | FAIL (1,2,4) — valuable for E-E-A-T and conversion, not for a homepage link |
| what-happens-after-rehab | ❌ head query | ❌ aggregators — inferred | ⚠️ | ✅ | ✅ | FAIL (1,2) |

**Net result: 1 of 16 posts earns a homepage link** — [/blog/can-i-work-while-in-rehab](blog/can-i-work-while-in-rehab.html). Natural placement: the homepage section that mentions keeping work and family commitments, anchor like "keep working during treatment" or "work while in rehab." One homepage slot remains open under the cap.

---

## (c) New Niche Post Concepts (SERPs checked 2026-08-31)

Each is written to pass all 5 checklist points on day one, links to ≥2 money pages, and uses the locked compliance wording ("may cover," "verify your benefits," "we work with most major PPO plans" — never "in-network"/"accepted"/"covered" for a named plan).

### 1. "Will Insurance Pay for Rehab a Second Time?" ⭐ build first
- **Audience:** people (and families) coming back after a relapse or an incomplete first treatment — emotionally primed, payment-focused, ignored by first-timer content.
- **Target query:** "will insurance pay for rehab a second time" / "how many times will insurance pay for rehab."
- **SERP proof:** entire top 10 is small single-location facilities — Catalina Behavioral Health, Olympic Behavioral Health, Friendly Recovery, Better Days Treatment, Changes Healing Center, Purpose Healing Center, New Start Recovery — with only one aggregator (addictionresource.com). Exactly the SERP shape we win.
- **Money links:** /verify-insurance, /insurance/ hub, carrier pages, /programs/iop (stepping down to outpatient after a residential relapse is a natural fit for what we actually sell).

### 2. "Does the SAG-AFTRA Health Plan Cover Outpatient Rehab?" ⭐ highest upside
- **Audience:** LA entertainment-industry union members — a large, hyper-local segment no treatment center is targeting.
- **Target query:** "SAG-AFTRA health plan rehab coverage" / "does SAG-AFTRA cover rehab."
- **SERP proof:** top 10 is the plan's own sagaftraplans.org pages plus a single treatment center — Beachway Therapy in **Florida**, ranking with a stale legacy-AFTRA page. Zero LA facilities present.
- **Timeliness hook:** the plan's behavioral-health network moved from Carelon to **Anthem on Jan 1, 2026** — fresh, factual, and it routes readers straight to our existing /insurance/anthem-blue-cross page. Compliance wording is mandatory here: describe how the plan works and offer verification; claim nothing about network status.
- **Money links:** /insurance/anthem-blue-cross, /verify-insurance, /programs/iop, /programs/evening-iop.

### 3. "Rehab When You're Self-Employed: No FMLA, No Problem"
- **Audience:** freelancers, 1099 contractors, gig and entertainment workers — disproportionately LA, and structurally excluded from every "use FMLA" article.
- **Target query:** "rehab for self employed" / "can I go to rehab without FMLA."
- **SERP proof:** top 10 is all small regional facilities (Bradford Health, Lakeview Health, Cornerstone of Recovery, First Step BH, Seven Arrows, New Day Recovery) answering the *generic* FMLA question; none addresses the no-FMLA/1099 case directly — a genuine information-gain gap on an already-winnable SERP.
- **Money links:** /programs/evening-iop, /programs/telehealth, /programs/outpatient-rehab, /verify-insurance.

### 4. "Can I Stay in College During Outpatient Rehab?"
- **Audience:** students and parents on the Westside — the facility is in Westwood, walking distance from UCLA, with SMC and LMU nearby.
- **Target query:** "outpatient rehab for college students Los Angeles" / "can I stay in school during IOP."
- **SERP proof:** rankers include The Haven at College (student-specialist) and No Matter What Recovery — a small LA facility — proving local sites place. **Constraint:** do not chase UCLA-branded queries; uclahealth.org owns those outright. Target the stay-enrolled framing, where proximity is the differentiator, not the university name.
- **Money links:** /programs/iop, /programs/evening-iop, /programs/telehealth, /verify-insurance.

### 5. "Will My Boss Find Out I Went to Rehab?" (optional 5th)
- **Audience:** employed people stalled at the privacy fear — same segment as the passing work-while-in-rehab post, different intent (confidentiality/HIPAA/42 CFR Part 2 vs. scheduling logistics), so no cannibalization; the two should cross-link.
- **Target query:** "will my boss find out I went to rehab" / "will my employer know I'm in rehab."
- **SERP proof:** all small facilities — including **westlarecovery.com**, a direct West LA competitor, ranking today. A local single-location site holding this SERP is the strongest possible winnability evidence.
- **Money links:** /programs/evening-iop, /programs/telehealth, /verify-insurance.

### Homepage-link plan for new posts
Publish first, hub-link from /blog/ and relevant money pages, and give a homepage link only **after** a post shows page-1–adjacent movement on its verified-winnable query — that is when point 5 (the link is the deciding boost) is actually true. Under the 2-slot cap, the expected end state is: slot 1 = can-i-work-while-in-rehab now; slot 2 = whichever of concepts 1–2 ranks first.
