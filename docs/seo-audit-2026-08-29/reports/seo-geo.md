# GEO / AI-Search Readiness Audit — goldenstate-rehab.com

Scope: Google AI Overviews, ChatGPT/OAI-SearchBot, Perplexity, Bing Copilot citability for a YMYL outpatient addiction/mental-health center in West LA.

## 1. AI Crawler Access — THE HEADLINE FINDING

**Observed** (curl, live, 2026-08-29): every AI crawler tested got **HTTP 200** on both `/robots.txt` and `/` (homepage), with no Cloudflare challenge:

| Crawler UA | robots.txt | homepage |
|---|---|---|
| GPTBot/1.0 | 200 | 200 |
| ClaudeBot/1.0 | 200 | 200 |
| PerplexityBot/1.0 | 200 | 200 |
| Google-Extended/1.0 | 200 | 200 |
| OAI-SearchBot/1.0 | 200 | 200 |
| meta-externalagent/1.1 | 200 | 200 |
| CCBot/1.0 | 200 | 200 |
| Bytespider | 200 | 200 |
| Amazonbot/1.0 | 200 | 200 |
| Applebot-Extended | 200 | 200 |

Fetching `/` with `-A "GPTBot/1.0"` returned the real page (`<title>Los Angeles Addiction Treatment Center | Golden State Rehab</title>`), not a JS-challenge or bot-wall shell. The site is behind Cloudflare (`server: cloudflare`, `cf-ray` present) but **Cloudflare's "Block AI Bots" toggle is off** — this is the single most important finding, because that toggle operates at the edge and would not show up in robots.txt at all. If it were on, every downstream recommendation in this report would be moot.

Current `robots.txt` (both the file and behavior agree — no crawler-specific rules exist):
```
User-agent: *
Allow: /

Sitemap: https://www.goldenstate-rehab.com/sitemap.xml
```
This is permissive-by-default, which happens to be correct for citation goals, but it's implicit. It doesn't distinguish AI-search crawlers (which you want) from AI-training-only crawlers (which some site owners choose to block without affecting citation eligibility, since e.g. OpenAI's GPTBot is used for training while OAI-SearchBot is the separate retrieval crawler used for ChatGPT search citations).

**Recommendation — explicit policy** (see block below). Trade-off to flag: blocking `CCBot` / `anthropic-ai` / `cohere-ai` reduces training-data ingestion but has **no effect on ChatGPT-search or Perplexity citation eligibility**, because those products use separate retrieval crawlers (`OAI-SearchBot`, `PerplexityBot`) that must stay allowed. Claude's web-search feature (as opposed to model training) also uses `ClaudeBot`, so blocking it would remove the site from Claude-cited answers — recommend allowing it given the stated citation goal. Net effect of the suggested policy vs. today's blanket allow: neutral for citations, marginally reduces training-corpus inclusion of the raw HTML (low value for a local business anyway).

## 2. llms.txt

`https://www.goldenstate-rehab.com/llms.txt` — **200, well-formed against the spec**: H1 (`# Golden State Rehab`), blockquote summary, H2-organized link sections (About / Locations / Treatments / Programs / Resources / En Español / Contact), each link with a short description. It already contains the load-bearing facts a model would need to answer YMYL queries without re-crawling:

- Phone: (424) 208-3120 — present, repeated
- Address: 1964 Westwood Blvd, Ste 425, Los Angeles, CA 90025 — present
- License: **DHCS #191643AP** — present
- Accreditation: The Joint Commission (Gold Seal) — present, linked
- Programs: PHP, IOP, telehealth, individual/group therapy, medication management — present
- Insurance: "Most major insurance accepted" — present (but no payer list/plan names)
- Medical Director named (Dr. Eric Chaghouri, MD) — present

Gaps:
- `/llms-full.txt` — **404, does not exist**. For a 114-page site with 22 blog posts carrying substantive YMYL content (parity law, Medi-Cal, cost breakdowns), an `llms-full.txt` concatenating the FAQ answers + program specifics would materially help retrieval-augmented tools that fetch it directly instead of crawling. Recommended, medium effort.
- No "last updated" line in `llms.txt` itself, so a consuming model can't tell if the summary is stale relative to the site.
- No RSL 1.0 licensing signal found (not present in either `robots.txt` or `llms.txt`) — expected for a local business site; low priority to add since RSL primarily benefits content producers wanting to license/meter reuse, not lead-gen sites wanting citation.

## 3. Passage-Level Citability (6 pages, quoted from actual crawled HTML)

Scored against: answer-first sentence under H2, 40-167 word self-contained block, definitional "X is..." framing, specific numbers, question-form H2s, entity clarity in first 100 words.

### Homepage (`/`)
- H1 present with a proof number ("100+ Recoveries") — good.
- **First two H2s have no extractable paragraph**: "What People Are Saying" and "See if your insurance is accepted in seconds" are component headers for a testimonial carousel and an insurance-checker widget respectively — zero body text follows them in the DOM (0-word passage both).
- Third H2, "Why Golden State Rehab," yields only 19 words: *"Evidence-based care and a plan built around your real life, at a private outpatient center in West Los Angeles."* — too short to stand alone as a citation (no entity name, no specifics) though it does anchor "West Los Angeles."
- **Verdict: the homepage is currently the weakest of the six pages for verbatim LLM extraction.** It's built for human scanning (nav, cards, widgets) rather than for standalone answer blocks. This matters because "outpatient rehab west los angeles" is a homepage-relevant query.

### `/programs/php`
- H2: *"What is a Partial Hospitalization Program?"* → **135 words**, textbook citable: *"A Partial Hospitalization Program (PHP) is the most intensive level of outpatient care available. Designed for individuals who need more support than traditional outpatient treatment but do not require 24-hour residential care, PHP provides a structured, full-day clinical environment 5 days per week..."* This is a clean definitional sentence, self-contained, in the 134-167-word sweet spot. **An LLM could lift this verbatim as the answer to "what is PHP."**
- H2: *"Who Benefits Most from PHP"* → 121 words, also strong and self-contained.
- Middle H2 ("A Typical Day...") is a 15-word teaser only — inconsistent depth page-to-page.

### `/programs/iop`
- H2: *"What is an Intensive Outpatient Program?"* → **145 words**, equally citable: *"An Intensive Outpatient Program (IOP) is structured addiction and mental health treatment that fits around your life — a few focused sessions each week instead of full days, and you sleep in your own bed. At Golden State Rehab in Westwood, Los Angeles, IOP meets 3 to 5 days per week..."* — includes brand name + city in the passage itself, which is exactly what you want for entity-anchored citation.
- Second H2 ("What Our IOP Covers") again returns 0 words — same pattern as the homepage: some H2s in this template introduce a bullet list marked up in a way the extractor (and likely an LLM parsing plain-rendered text) doesn't attach as a following paragraph. Worth a manual check of the actual markup (may be a `<ul>` immediately wrapped in a component `<div>` rather than a direct sibling of the H2 — verify in the CMS).

### `/verify-insurance`
- H2s are all form-field labels ("Let's start with you," "Your insurance") — 13-30 words, form UI text, not answer content. **This page is not meant to be citable prose** (it's a conversion tool), so low citability here is by design, not a defect — no action needed beyond what's already covered by its FAQPage schema (4 Q&As, all well-formed, e.g. "Is verifying my insurance really free? Yes. Checking your benefits costs nothing...").

### `/blog/how-much-does-rehab-cost`
- H2: *"What actually determines what rehab costs you"* → **181 words** (slightly over the 167-word optimum but still coherent): *"Two people can attend the identical program on the same schedule and pay amounts that differ by a factor of twenty. The list price is barely involved. Four things drive your real number. Level of care..."* — strong hook, concrete claim, good candidate for AI Overview citation on "how much does rehab cost."
- H2: *"How to read your own insurance plan in five minutes"* → 146 words, in-range, and followed by an actual **term-definition table** (Deductible / Coinsurance / Copay) — good multi-modal structure.
- This is the **strongest page of the six** for citability: dense, numbered claims, external citations to CMS/DOL parity pages, in-range passages, clear author + reviewer.

### `/locations/santa-monica`
- H2: *"Structured Care, About 15 Minutes from Santa Monica"* → **138 words**, in-range and entity-anchored in the first sentence: *"If you live in Santa Monica, getting serious help for addiction or a mental health condition doesn't have to mean leaving the Westside. Golden State Rehab sits at 1964 Westwood Blvd — a straight shot east on Olympic, roughly 15 minutes from downtown Santa Monica..."* — this is close to ideal for "rehab near santa monica": names the city in the query, names the brand, gives a concrete drive time.
- Second H2 ("Outpatient Programs for Santa Monica Residents") again returns 0 words — same recurring gap as home and IOP.

**Pattern across all 6 pages**: roughly 1 in 3 H2s on template-driven sections (widgets, program-list intros, form sections) has **no directly-following paragraph text**, which is invisible to a human scanning the rendered page (the content is there, just not as a plain sibling paragraph) but may reduce what a passage-extraction pipeline treats as "the answer to this H2." The long-form editorial pages (PHP, IOP, blog, locations) consistently hit the 121-181 word citable range on their substantive H2s — this is good and should be the template applied to the homepage's top two sections.

## 4. Authority & Brand Signals

- **Name consistency**: "Golden State Rehab" used consistently across all sampled pages/schema, no variant spellings observed.
- **Structured E-E-A-T signals are strong**: DHCS license #191643AP appears as both plain text (llms.txt, page copy) and structured `identifier`/`hasCredential` schema on every page checked; Joint Commission accreditation is likewise both linked and in `hasCredential`; medical director Dr. Eric Chaghouri, MD is named as `reviewedBy` on 70 pages with per-page `lastReviewed` dates, and blog posts have named, credentialed authors (LMFT, AMFT, RADT, Program Director) distinct from the reviewer — this is a genuinely above-average YMYL authorship setup.
- **sameAs gap**: `MedicalOrganization`/`LocalBusiness` schema's `sameAs` array only contains Google Maps and Yelp (`https://www.yelp.com/biz/golden-state-rehab-llc-los-angeles`). Instagram, LinkedIn, and X are linked in the page footer (confirmed in raw HTML: `instagram.com/goldenstaterehab`, `linkedin.com/company/goldenstaterehab`, `x.com/goldenstateWR1`) but **not included in the `sameAs` array**, so the entity graph connecting those profiles to the Organization is weaker than it needs to be — this is a low-effort, high-value fix.
- **No YouTube, no Reddit, no Wikipedia/Wikidata entity** — expected for a small local practice, but worth noting given YouTube mentions carry the strongest documented correlation (~0.737) with AI citation likelihood of any brand signal checked in this framework, and Reddit presence is also high-correlation. Neither is remotely achievable quickly, but a YouTube channel (facility tour, "what to expect on day one," staff intros — content this site already has as blog posts) is the highest-leverage brand-signal investment available.
- **Third-party brand mentions** (marked in report per your instruction, not verified this pass — would require web search/citation-index tooling outside this budget): **unknown**. Recommend a follow-up pass with a rank-tracking or brand-mention tool (e.g., DataForSEO's `ai_opt_llm_ment_search`, if available) specifically for "Golden State Rehab" across Reddit, Yelp, and local news.
- **Outbound citation quality is a real strength not called out in the brief**: pages link out to `.gov`/authoritative sources — samhsa.gov, cdc.gov, nida.nih.gov, cms.gov, dol.gov, ecfr.gov, ada.gov, apa.org, asam.org, dhcs.ca.gov, pubmed/pmc.ncbi.nlm.nih.gov, who.int (ICD). This is exactly the citation pattern that signals trustworthiness to both Google's YMYL raters and to LLMs assessing source quality for medical claims — keep doing this on every new blog post.
- **Google "Preferred Sources" button + `news.google.com/swg/js/v1/publisher.js`**: this script is Google's Subscribe-with-Google / News Showcase / Preferred Sources infrastructure, built for **news publishers** with metered/subscription content and Google News Showcase deals. For a local outpatient clinic with no news vertical, no subscription paywall, and no Google News Showcase agreement, this is very likely **inert noise**: it loads a third-party script with no functional counterpart on the backend (no Showcase contract = the button has nothing to register against), adds a small performance/CSP surface cost, and there is no public evidence Google's "Preferred Sources" feature (a user-side AI Overviews personalization control) is influenced by a business having this script installed — it's a signal *to Google News crawling*, not a mechanism for getting cited in AI Overviews for a medical-services query. Net assessment: **low-value addition to keep monitoring, not to expand**; don't invest further engineering here expecting an AI Overview citation benefit. If it's not free (dev time, page weight), consider removing.

## 5. Freshness Signals

- 70 pages carry `MedicalWebPage.lastReviewed` + `reviewedBy` (Dr. Chaghouri). Observed range: **2026-03-01 to 2026-08-19** — recent and plausible.
- 17 English blog posts, `datePublished`/`dateModified` observed range **2026-05-14 to 2026-08-19**. The 6 oldest posts (May–June) show `dateModified: 2026-08-19`, distinct from `datePublished` — i.e., a real update pass happened, which is a genuine freshness signal. The 11 newest posts (Aug 4–13) show `dateModified` identical to `datePublished`, which is expected for new content but means there's currently no evidence of an ongoing update cadence for the newest batch — worth revisiting a few of them (cost/insurance posts especially, since dollar figures and plan rules age fast) in a few months and bumping `dateModified` for real, not cosmetically.
- Spanish (`/es/`) blog mirrors mostly carry only `datePublished`/`dateModified` from original translation date (May–June) with no `lastReviewed`/`reviewedBy` on most — the Spanish mirror is behind the English content on freshness metadata. Low-medium priority given it's a secondary track, but the bilingual-care angle is a real differentiator worth keeping current.

## 6. Platform-Specific Assessment

| Platform | Assessment |
|---|---|
| **Google AI Overviews** | Best-positioned platform here: heavy structured data (MedicalWebPage, FAQPage, MedicalOrganization, BreadcrumbList), named licensed medical reviewer, DHCS license number, .gov outbound citations — this is close to the trust profile Google's YMYL systems reward. Main gap: homepage passage weakness (Section 3) for head terms like "outpatient rehab west los angeles" that likely resolve to the homepage. |
| **ChatGPT / OAI-SearchBot** | Access confirmed open. ChatGPT's search product leans partly on Bing's index for web results — recommend verifying/adding the site in **Bing Webmaster Tools** if not already done (not verified in this pass — no crawl data confirms IndexNow or Bing verification; flag as unknown, quick to check). |
| **Perplexity** | Rewards pages with clear, quotable claims and visible source lists — the blog posts' inline citations to CMS/DOL/NIH pages are exactly this pattern; Perplexity is likely to cite the cost/insurance blog posts specifically given their density of sourced, numbered claims. |
| **Bing Copilot** | Same Bing-index dependency as ChatGPT above; also benefits from the same structured-data strength. No Bing-specific gap identified beyond the general verification recommendation. |

## 7. AI Search Readiness Score

| Dimension | Weight | Score | Notes |
|---|---|---|---|
| AI Crawler Access | 20% | 20/20 | Confirmed via live curl — all 10 AI bots get real 200 responses, no edge block |
| llms.txt Quality | 10% | 8/10 | Spec-compliant, all key facts present; missing llms-full.txt and a freshness line |
| Structured Data / Schema | 15% | 14/15 | FAQPage(70)/MedicalWebPage(70)/BlogPosting(22), license+accreditation as structured credentials, reviewedBy dates; minor sameAs gap |
| Passage-Level Citability | 25% | 19/25 | Program & blog pages hit the 121-181 word citable range with clean definitions; homepage and ~1/3 of template H2s across pages have no extractable paragraph |
| Authority & Brand Signals | 15% | 10/15 | Strong first-party E-E-A-T (license, MD, JC, .gov citations); weak third-party signals (no YouTube/Reddit/Wikipedia, sameAs incomplete, third-party mentions unverified) |
| Freshness | 15% | 12/15 | Good lastReviewed coverage and dates; newest blog batch has no update history yet; Spanish mirror lags on review metadata |
| **Total** | **100%** | **83/100** | |

## Prioritized Fix List

1. **Add paragraph copy under the "zero-word" H2s on the homepage and other template sections** (effort: low-medium; where: homepage sections "What People Are Saying" / "See if your insurance is accepted in seconds," IOP's "What Our IOP Covers," Santa Monica's "Outpatient Programs for Santa Monica Residents" — likely a shared component template). Why: these are exactly the H2s an LLM would try to extract an answer from for head queries like "outpatient rehab west los angeles," and right now there's nothing to extract. Add a 100-150 word answer-first paragraph as a direct sibling of each H2, ahead of the widget/list markup.
2. **Add Instagram, LinkedIn, and X to the `sameAs` array** in the `MedicalOrganization`/`LocalBusiness` JSON-LD (currently only Google Maps + Yelp). Effort: trivial (single schema template, site-wide). Why: strengthens the entity graph linking the brand's social profiles to the structured business entity, at essentially zero cost.
3. **Publish `/llms-full.txt`** concatenating the FAQ Q&As and core program/insurance facts from across the 70 FAQPage-schema pages. Effort: medium (scripted export, not manual). Why: gives retrieval-augmented tools (and future crawlers) one canonical, complete document instead of requiring 70+ page fetches.
4. **Adopt an explicit robots.txt AI-crawler policy** (block below) instead of the current implicit `Allow: /` for everyone. Effort: trivial. Why: makes the citation-friendly posture explicit and auditable, and gives you a lever to opt out of training-only crawlers later without touching the crawlers that actually drive citations.
5. **Verify Bing Webmaster Tools / IndexNow setup**, and start a YouTube channel using existing blog content (facility tour, "first day of rehab," staff intros already exist as scripts). Effort: medium-high, longer-term. Why: ChatGPT/Copilot both lean on Bing's index; YouTube mentions carry the strongest documented brand-citation correlation (~0.737) of any signal in this framework and this site already has the source material.

## Ready-to-Paste robots.txt

```
User-agent: *
Allow: /

# AI search / citation crawlers — explicitly allowed
User-agent: OAI-SearchBot
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: meta-externalagent
Allow: /

# Optional: block training-only crawlers without affecting search-citation crawlers above.
# Leave commented out unless you have a specific reason to opt out of model training corpora —
# it does not increase or decrease citation eligibility in ChatGPT/Perplexity/Copilot.
# User-agent: CCBot
# Disallow: /
# User-agent: anthropic-ai
# Disallow: /
# User-agent: cohere-ai
# Disallow: /

Sitemap: https://www.goldenstate-rehab.com/sitemap.xml
```

## llms.txt

No structural corrections needed — the existing `llms.txt` is spec-compliant and already contains phone, address, license #, accreditation, programs, and insurance language. Only additive change recommended: append a one-line freshness marker under the summary blockquote, e.g. `_Last updated: 2026-08-19_`, and add a link to `/llms-full.txt` once published (see fix #3).

## Source Files Referenced
- `/private/tmp/claude-501/-Users-kkareem-1-Documents-Claude-COde-Web-Design-arm-website-golden-state-rehab-2/41f75a02-655f-419b-a70b-6d1b99e6ec18/scratchpad/audit/robots.txt`
- `/private/tmp/claude-501/-Users-kkareem-1-Documents-Claude-COde-Web-Design-arm-website-golden-state-rehab-2/41f75a02-655f-419b-a70b-6d1b99e6ec18/scratchpad/audit/llms.txt`
- `/private/tmp/claude-501/-Users-kkareem-1-Documents-Claude-COde-Web-Design-arm-website-golden-state-rehab-2/41f75a02-655f-419b-a70b-6d1b99e6ec18/scratchpad/audit/crawl/pages.jsonl`
- `/private/tmp/claude-501/-Users-kkareem-1-Documents-Claude-COde-Web-Design-arm-website-golden-state-rehab-2/41f75a02-655f-419b-a70b-6d1b99e6ec18/scratchpad/audit/crawl/html/index_b01063.html` (homepage)
- `/private/tmp/claude-501/-Users-kkareem-1-Documents-Claude-COde-Web-Design-arm-website-golden-state-rehab-2/41f75a02-655f-419b-a70b-6d1b99e6ec18/scratchpad/audit/crawl/html/programs_php_4938de.html`
- `/private/tmp/claude-501/-Users-kkareem-1-Documents-Claude-COde-Web-Design-arm-website-golden-state-rehab-2/41f75a02-655f-419b-a70b-6d1b99e6ec18/scratchpad/audit/crawl/html/programs_iop_e73de5.html`
- `/private/tmp/claude-501/-Users-kkareem-1-Documents-Claude-COde-Web-Design-arm-website-golden-state-rehab-2/41f75a02-655f-419b-a70b-6d1b99e6ec18/scratchpad/audit/crawl/html/verify-insurance_a82f84.html`
- `/private/tmp/claude-501/-Users-kkareem-1-Documents-Claude-COde-Web-Design-arm-website-golden-state-rehab-2/41f75a02-655f-419b-a70b-6d1b99e6ec18/scratchpad/audit/crawl/html/blog_how-much-does-rehab-cost_756bc8.html`
- `/private/tmp/claude-501/-Users-kkareem-1-Documents-Claude-COde-Web-Design-arm-website-golden-state-rehab-2/41f75a02-655f-419b-a70b-6d1b99e6ec18/scratchpad/audit/crawl/html/locations_santa-monica_9e2998.html`
