# SXO Analysis — Golden State Rehab (goldenstate-rehab.com)

Scope note: this pass combined SERP backwards-analysis (via WebSearch, real queries run — see evidence per finding) with direct inspection of the crawled HTML in `scratchpad/crawl/`. Where a claim is based on DOM order rather than a rendered viewport screenshot, it is labeled **inferred**, not observed. I did not complete the full query set in the brief before being asked to write up — see "Not assessed" at the end for what's missing.

---

## 1. CRITICAL — Broken "Programs" navigation on every /programs/* subpage (site-wide template bug)

**Observed.** On every program detail page (`/programs/php`, `/programs/iop`, `/programs/outpatient-rehab`, `/programs/telehealth`, and by extension the rest of the `/programs/*` set built from the same template), the nav dropdown's parent link and the "All Programs" link both point to `href="/"` instead of `href="/programs/"` (or `../` relative to the hub).

Evidence (exact strings, confirmed on 4 files):
```
programs__php.html:            <a href="/" class="dropdown-all" role="menuitem">All Programs</a>
programs__php.html:            <a href="/" class="active">Programs <i data-lucide="chevron-down"></i></a>
programs__iop.html:             (same two strings)
programs__outpatient-rehab.html: (same two strings)
programs__telehealth.html:      (same two strings)
```
Compare to the homepage and `/verify-insurance`, where the equivalent links correctly point to `programs/` (relative) — e.g. `index.html` line 76: `<a href="programs/">Programs`. So the bug is specific to pages nested one level deep under `/programs/`, almost certainly a template path-resolution error (an absolute `/` was used instead of `../` or `/programs/`).

**Impact.** A user on `/programs/php` who clicks "Programs" in the nav, or "All Programs" in the dropdown, to compare PHP against IOP or see the full program list, is silently sent to the homepage instead. This directly breaks the comparison-shopping path for the "person seeking treatment" persona (see persona section) at the exact moment they're evaluating levels of care — and it defeats internal linking equity to the `/programs/` hub from its own child pages.

**Fix.** Change both links from `href="/"` to `href="/programs/"` (or `../` since these are one directory below `/programs/`) in the shared nav partial/template used by all `/programs/*` pages. Verify against `/programs/individual-therapy`, `/programs/group-therapy`, `/programs/medication-management`, `/programs/holistic-therapies`, `/programs/alumni` as well — not independently checked here, but they almost certainly share the same template and bug (**inferred**, not directly grepped for all 8 — see limitations).

---

## 2. Conversion-path friction on `/verify-insurance` (money page)

**Observed** (from `verify-insurance.html`):

- The form uses progressive disclosure: Step 1 ("Let's start with you") requires **First Name, Last Name, Date of Birth, Phone Number, Email** — all four contact fields plus DOB — before Step 2 (insurance carrier) even becomes visible (`id="step-insurance" hidden`, unlocked by JS only once all of Step 1 validates).
- This means a visitor cannot even see what the insurance-verification form will ask of them (carrier, state, member ID) until they've already handed over full name, DOB, phone, and email. That's a meaningful trust ask for a YMYL/addiction-treatment context, before the visitor has any evidence the specific ask ("verify insurance") is low-risk.
- There **is** a genuine low-commitment path: line 280, "Prefer not to type your details? Call (424) 208-3120 — you can ask anything without giving your name," and a second callout at line 297 in the "How Verification Works" section: "Send the secure form above, or call... you can ask questions without giving your name." Both are real and correctly worded.
- Friction: the first of these two callouts (line 280) only becomes visible after Step 1 AND Step 2 are both completed (it's inside `#step-submit`, which is `hidden` until `step2Done()`). A user who wants the low-commitment phone option *instead of* filling the form has to either scroll past the entire form to the second "How Verification Works" section (line ~297, which is unconditionally visible) or abandon the form partway through. The phone-first alternative is not presented anywhere above or alongside Step 1 itself — the earliest fields a hesitant visitor sees are the four-field name/DOB/phone/email block with no "or just call" text next to it.
- Positive: the sticky phone banner (`tel:+14242083120`) is present on every page including this one, and the mobile CTA bar at the bottom of every page also offers "Free Assessment" (tel:) alongside "Verify Insurance" — so a tap-to-call path always exists in the chrome, independent of the form. Phone number is a real `tel:` link, tappable, confirmed in the HTML.

**Fix.**
- Add a one-line "or just call — no form needed" affordance directly above or beside the Step 1 fields (not just after the gated steps), so the low-commitment option is visible before the visitor starts typing personal data, not after.
- Consider moving Date of Birth out of Step 1's required fields (it's not needed to identify an insurance carrier) and gating it later, right before the insurance/member-ID step where it's actually load-bearing for verification.

---

## 3. Homepage conversion structure — largely sound, one nav-label nit

**Observed** (`index.html`): H1 is a 3-line stack ending in "100+ Recoveries" (matches the memory note re: required trust proof number — confirmed present live). Primary CTA "Verify My Insurance" and secondary "(424) 208-3120" tel-link both sit inside the hero, above an insurance-provider tile grid ("See if your insurance is accepted in seconds") that lets a visitor tap their own provider logo before any form — a genuinely low-commitment, zero-typing first interaction. DHCS license and LegitScript badges are in the hero trust row. This is a well-built above-the-fold sequence for the "insurance-anxious searcher" persona specifically.

No issues found on the homepage CTA structure itself.

---

## 4. Families page has zero "intervention" content despite that being the dominant family-persona search topic

**Observed.** `grep -i "intervention"` against `families.html` returns 0 hits. Site-wide, "intervention" appears only in `faq.html`, `treatments/cbt.html`, `treatments/anxiety.html`, `treatments/opioid.html`, `treatments/meth.html`, and `treatments/sex-addiction.html` — none of which are family-persona-facing pages, and none is a dedicated intervention resource.

**SERP check (WebSearch, query: "how to help a family member with addiction los angeles intervention"):** results are dominated by dedicated intervention-resource pages from competitors — Muse Treatment ("Los Angeles Drug Intervention Resources for Families in Crisis"), New Found Life ("Drug Interventionists"), Outpatient Los Angeles ("How to Conduct an Intervention"), Concierge Home Detox, Clear Path Intervention, Canyon Santa Monica ("Family Support Group"), Veritas Detox. This is a distinct sub-topic family members actively search, and it is a page type (a "how to stage an intervention" guide/resource) that does not exist anywhere on goldenstate-rehab.com.

**Fix.** Add an intervention-focused section to `/families` (or a standalone `/families/intervention` page) covering: what an intervention is, how to prepare one, when to involve a professional interventionist, and how Golden State Rehab supports the family through that process — mirroring the structural depth already used on `/verify-insurance` and the `cost-of-rehab` blog post.

---

## 5. Content gap — no PHP vs. IOP comparison page

**SERP check (WebSearch, query: "PHP vs IOP which is right for me"):** results are dominated by dedicated comparison articles (Houston Behavioral Health "Is IOP or PHP Right for Me?", Tennessee Behavioral Health "PHP vs IOP: Which Treatment Option is Right For You?", Amae Health, Delamo Behavioral Health, Pax Memphis) — a distinct content format (side-by-side decision guide) separate from either program's own service page.

**Observed on site:** Golden State Rehab has individual `/programs/php` (1,898 words) and `/programs/iop` (2,205 words) service pages, and a `/blog/cbt-vs-dbt-which-is-right` comparison post for therapy modalities — but no equivalent "PHP vs IOP" or "which level of care is right for me" comparison page. The template pattern for this content type clearly already exists on the site (the CBT vs DBT post); it just hasn't been applied to the higher-intent PHP/IOP decision, which is arguably the single most common "which program do I need" question a first-time visitor has.

**Fix.** Build a `/blog/php-vs-iop-which-is-right` (or `/programs/php-vs-iop`) page using the same comparison template as the existing CBT-vs-DBT post, cross-linked from both `/programs/php` and `/programs/iop`.

---

## 6. Page-type alignment confirmed (no mismatch) for the core money-page queries

SERP checks run via WebSearch (real queries, results below) show the following, all pointing to genuine alignment rather than a mismatch:

- **"outpatient rehab los angeles"** — dominated by individual treatment centers' own outpatient-program service pages (Renewal Health Group, Westwind Recovery, Sanctuary Treatment Center, Stairway Recovery, Multi Concept Recovery). Site has `/programs/outpatient-rehab` (2,277 words, FAQPage schema, BreadcrumbList) — **matching page type**.
- **"PHP program los angeles partial hospitalization"** — dominated by individual centers' PHP service pages (Westwind, AM Healthcare, Renaissance Recovery, Solace, Amae Health, LAOP Center). Site has `/programs/php` (1,898 words, FAQPage schema) — **matching page type**.
- **"IOP los angeles intensive outpatient program"** — mix of individual centers' IOP pages (Amae Health, LAOP Center, Felicity Mental Health, Skyline Recovery) and two directory/aggregator results (Psychology Today, recovery.com). Site has `/programs/iop` (2,205 words) — **matching page type**, though note aggregator presence means directory-style content (facility comparison tables, pricing ranges) may be partially competing for the same real estate; not fully assessed here.
- **"cost of rehab in los angeles"** — dominated by dedicated cost/pricing guide pages with explicit dollar figures by level of care (Westwind's "Rehab Price," Muse's cost blog, Harmony Place's two cost pages, Luxe Recovery, Canon Human Services, Ritz Recovery). Site's `/blog/cost-of-rehab-in-los-angeles` (2,052 words) has matching structure — H2s include "The short answer: typical rehab costs by level of care," "Does insurance cover rehab? Almost always," "Ways to pay if you're uninsured," with real dollar figures ($1,000–$1,500, $20,000–$60,000, $7,000–$12,000, etc.) and Article schema. **This page is well-matched to what ranks** — not a gap, contrary to what might be assumed without checking.
- **"rehab near Santa Monica"** — mostly directory/aggregator pages (rehabs.com, drugabuse.com, addictions.com, startyourrecovery.org, addictioncenter.com) plus one competitor's dedicated location page (Thrive Treatment, Santa Monica). Site's `/locations/santa-monica` is a genuine local-service location page: real drive-time directions from three routes, transit info, "nearby communities we serve" internal links, medically-reviewed byline, DHCS-verification link — **deeper than the one directly-comparable competitor page found (Thrive)**, though it cannot out-rank pure directory aggregators on domain authority alone (not something SXO/on-page work fixes).
- **"does insurance cover rehab california"** — dominated by long-form educational/guide content (americanaddictioncenters.org x2, rehabs.com Medi-Cal guide, Hollywood Hills Recovery, Buckeye Recovery Network, thekeyiop.com, Trust SoCal's "Does Medi-Cal Cover Rehab? 2026 Coverage Guide"). Site has `/blog/does-insurance-cover-rehab-in-california` and a separate `/blog/does-medi-cal-cover-rehab-in-california` — **matching page type and even matching the Medi-Cal-specific sub-topic split** seen in the SERP (Trust SoCal splits Medi-Cal into its own guide, and so does this site). Not independently read for depth in this pass — see limitations.

**No page-type mismatch was found for any of the core program/cost/insurance queries checked.** This is a genuinely different conclusion than "the page doesn't rank because it's the wrong type" — the page types are right; any ranking gap for these queries is more likely a domain-authority/backlink/local-pack issue than an on-page-type issue, which is outside SXO's remit (flag for `/seo content` or link-building analysis).

- **Spanish query ("centro de rehabilitación en español Los Angeles tratamiento adicción")** — dominated by competitors' dedicated `/es/` service pages (Muse Treatment `california/los-angeles-es/`, Resurgence Behavioral Health `/es/california/los-angeles/`). Site's `/es/` structure (full parallel program/treatment/location tree under `/es/`) matches this page type. Depth/quality of the Spanish pages themselves was not compared word-for-word against Muse/Resurgence in this pass — see limitations.

---

## 7. Above-the-fold mobile structure (inferred, not viewport-verified)

**Inferred from DOM order** (no rendered screenshot was taken; CSS was not fetched, so exact pixel cutoffs are not confirmed — see limitations): on the homepage and all interior pages, the vertical stack before any body content is: (1) sticky phone banner (`tel:` link, full-width), (2) main nav bar with logo + hamburger toggle, (3) hero section. On the homepage this hero includes a 5-star Google rating line, the 3-line H1 ending in "100+ Recoveries," a subheadline, two CTA buttons (Verify Insurance / phone), and a trust-badge row — a lot of vertical content stacked before the fold on a small phone screen, which risks pushing the CTA buttons below the initial viewport on shorter devices. This is a plausible risk, not a confirmed one; I did not render the page to check where the actual fold line falls at common breakpoints (375×667, 390×844).

A bottom-fixed `mobile-cta-bar` (tel: "Free Assessment" + `/verify-insurance` "Verify Insurance") is present in the DOM on every page (confirmed in `index.html` and `verify-insurance.html`), which mitigates fold risk somewhat — even if the hero CTA is pushed down, a persistent bottom bar keeps both conversion actions reachable without scrolling. This is a genuine strength.

---

## Persona scoring (partial — based on page content, not full framework scoring)

**Person seeking treatment (self):** Programs pages (`/programs/php`, `/programs/iop`, `/programs/outpatient-rehab`) are long, FAQ-schema'd, and directly answer "what is this program / who is it for / what does a day look like." Primary friction: the broken Programs nav (Finding #1) breaks the natural "compare PHP vs IOP" journey exactly when this persona needs it, and there's no dedicated comparison page to fall back on (Finding #5).

**Family member searching on behalf of someone else:** `/families` has a clear, empathetic hero ("you don't have to figure this out alone"), step-by-step guidance, and an FAQ block — but is missing intervention content entirely (Finding #4), which is a top query this persona runs.

**Insurance-anxious searcher:** Best-served persona on the site. Homepage lets them tap their own insurance logo with zero typing before any form (Finding #3). `/verify-insurance` explicitly pre-empts the top three anxieties (employer notification, obligation-free, HIPAA/42 CFR Part 2 privacy) in FAQ schema and body copy. Only gap: the low-commitment "just call" option is buried below the form instead of offered alongside it (Finding #2).

---

## Not assessed (do not treat as verified)

- Full SERP check for IOP/PHP/insurance queries **in Spanish** (only ran one general Spanish query; did not check "programa PHP los angeles," "IOP los angeles español," etc.)
- "Does Medi-Cal cover rehab in California" was referenced via the general insurance SERP but not searched as its own query, and `/blog/does-medi-cal-cover-rehab-in-california` was not opened/read for depth comparison.
- SERP features (featured snippets, People Also Ask boxes, AI Overview, local pack) were **not directly observable** — the WebSearch tool used here returns organic link + synthesized-summary results, not a structured SERP-feature breakdown, and it is not location-aware, so "near me" local-pack composition (which is what actually determines "alcohol rehab near me" outcomes for a real Culver City/LA searcher) could not be verified. Any local-pack claim would be assumed, not observed, so none is made here.
- Mobile above-the-fold was assessed from HTML DOM order only, not a rendered viewport screenshot or CSS box-model calculation (CSS files were not part of the crawl). Treat Finding #7 as a risk flag, not a confirmed fold-line measurement.
- Did not check whether the same broken-Programs-nav bug (Finding #1) exists on the remaining `/programs/individual-therapy`, `/programs/group-therapy`, `/programs/medication-management`, `/programs/holistic-therapies`, `/programs/alumni` pages, or on the `/es/programs/*` equivalents — checked 4 of 13 program-adjacent pages directly; the other 9 are inferred to share the bug because they share the same template, but this was not individually grepped.
- Did not run "opioid treatment los angeles," "meth addiction treatment," "PTSD treatment los angeles," or other individual `/treatments/*` queries — the treatments section (14 English pages) was not SERP-checked at all in this pass.
- Did not compare `/es/` page depth/word-count against the Spanish-language competitor pages found (Muse, Resurgence) — flagged as a content-type match only, not a content-quality comparison.
- Did not evaluate `/contact` page conversion friction directly (read `/verify-insurance` and homepage only among money pages).

## Cross-skill recommendations

- Domain-authority/backlink gaps behind any non-mismatch ranking shortfall (Finding #6) are outside SXO scope — recommend a backlink/authority audit.
- The template bug in Finding #1 is a straightforward site-wide HTML fix, not a content issue — flag for immediate dev fix regardless of any other audit workstream.
