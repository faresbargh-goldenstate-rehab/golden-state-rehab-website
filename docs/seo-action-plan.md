# Golden State Rehab — SEO + Conversion Action Plan

Prioritized from the **2026-07-07 audit** (Health **71/100**, Conversion **61/100** — see [seo-audit-report.md](seo-audit-report.md) and [conversion-scorecard.md](conversion-scorecard.md)).
Owners: **Code** = repo change · **Dashboard** = Cloudflare/Google console · **Ops** = business/owner action.

## Critical — fix now (this week)

- [ ] **Wire the contact form** — it has no submit handler; 100% of contact-form leads are lost and PII leaks into the URL on a GA4 page. Clone the `functions/api/send-vob.js` Paubox pattern into `functions/api/send-contact.js` + a fetch handler on `contact.html`/`es/contact.html`. Interim (5 min): replace the submit button with a `tel:+14242083120` CTA. *(Code · half-day)*
- [ ] **Unblock AI crawlers** — Cloudflare Security → Bots: disable "Block AI Scrapers and Crawlers" (or WAF skip-rules for GPTBot, ClaudeBot, OAI-SearchBot, PerplexityBot, CCBot). Re-verify with `curl -A "GPTBot/1.0" https://www.goldenstate-rehab.com/llms.txt` → expect 200. Everything GEO is moot until this ships. *(Dashboard · 15 min)*
- [ ] **Replace all 80 picsum.photos placeholders** (36 pages, EN+ES: fentanyl, opioid, alcohol, meth, team, programs…) with real `images/facility/`//`images/team/` photos; fix the 3 dead Unsplash hero URLs (contact hero, 23-page CTA banner, 12 treatment heroes) at the same time. *(Code · half-day)*
- [ ] **De-risk analytics on PHI pages** — remove gtag from `verify-insurance.html` + `contact.html` (or consent-gate it); fix `privacy-policy.html` lines ~175/236 (false "anonymized" and "no PHI collected" claims); drop the Places-Autocomplete home-address field from the contact form. *(Code · 2–3 h · legal exposure)*

## High — within 1–2 weeks

- [ ] **Point every "Call Now" button at `tel:+14242083120`** (currently → broken /contact) across nav, mobile menu, footer, mid-page CTAs; normalize the 95 bare `tel:4242083120` links to E.164 while at it. *(Code · 1 h)*
- [ ] **Add `404.html`** (branded, phone CTA + ES block) — kills sitewide soft-404s. *(Code · 1 h)*
- [ ] **Create the apex→www 301 Redirect Rule** the `_redirects` comment claims exists. Verify: `curl -sI https://goldenstate-rehab.com/families` → 301 to www. *(Dashboard · 10 min)*
- [ ] **Un-orphan the Families pages** — footer "Families"/"Para Familias" link sitewide + contextual links from faq/about. *(Code · 30 min)*
- [ ] **Fix the Spanish funnel:** repoint the 15 EN-targeted CTAs on `es/index.html` (+ nav Contacto on `es/verify-insurance.html`) to `/es/` equivalents; rewire ALL internal links on `espanol.html` into the `/es/` mirror; localize the 8 hardcoded English error strings in `js/intake.js`. *(Code · 2–3 h)*
- [ ] **Link the trust badges to proof:** LegitScript badge → official seal linking to the live verification record (confirm cert current first); DHCS footer badge → also link the state lookup, not just the self-hosted JPG. *(Code+Ops · 1 h)*
- [ ] **Reconcile contradictory stats** — "founded 2026" vs "500+ clients served" vs "100+ recoveries"; fix templated `foundingDate: "2026"` in 66 schema blocks. Pick defensible numbers or lead with team credentials. *(Code+Ops · 1 h)*
- [ ] **Branded 1200×630 og:image** at `/images/og/default.jpg` replacing the 256 px logo on 78 pages; add to the 3 missing pages; add `og:image:width/height`. *(Code · 2 h)*
- [ ] **Medical-review byline on all 8 program pages + faq** (copy the block from `treatments/alcohol.html:100`). *(Code · 30 min)*
- [ ] **Real `sameAs` + citation links:** claim/verify GBP canonical URL, Psychology Today, findtreatment.gov, Yelp, LegitScript page; put them in the org schema on 66 pages + visible footer links. This is also the #1 local + AI-entity fix. *(Ops then Code · listing work + 1 h)*
- [ ] **Add "what happens when you call" strip** (homepage + alcohol page): real person 24/7 · no name required · no pressure. Change mobile CTA label "Free Assessment" → "Talk to someone now". Single highest-leverage conversion copy change (see scorecard). *(Code · 1 h)*
- [ ] **De-gate the alcohol page:** move detox-referral ("we arrange detox and hold your spot") above the fold; add "keep working — evening IOP/telehealth" line; swap the kitchen-stock hero. *(Code · 1–2 h)*

## Medium — within 1 month

- [ ] **Image pipeline:** convert the 10 facility JPEGs (5.9 MB) to WebP/AVIF at 800w/1600w + srcset (~3.4 MB savings, Lighthouse-measured); self-host the ~12 unique Unsplash heroes in `/images/heroes/` (removes the third-party LCP + availability risk); `loading="lazy"` on the 804 insurance-logo imgs; add `favicon.ico` + `apple-touch-icon.png`. *(Code · 1 day)*
- [ ] **Expand thin money pages to 800–1,200 words** (7 program pages at 352–472 words; verify-insurance at 115): cost/insurance section, schedule detail, what-to-expect, 4–6-question FAQ with schema (10 treatment pages + iop.html lack FAQPage). Write toward grade 8–9 (current: grade 13–16). Use cbt/dbt pages as the internal gold standard. *(Code/content · ongoing)*
- [ ] **Create the "Outpatient Drug Rehab in Los Angeles" page** (new `/programs/outpatient-rehab` or retargeted programs index) — the SERP rewards a dedicated outpatient page and GSR has none. *(Content · half-day)*
- [ ] **Surface team credentials:** render `data-bio` content as visible HTML (`<details>`), add CA license numbers (LMFT ad-rule requirement) to cards + Person schema, swap ui-avatars for the real Chaghouri headshot on 12 blog bylines, fix the Clinical Director bio to lead with addiction experience. *(Code · 2–3 h)*
- [ ] **Schema hygiene pass:** real FAQ verbatim parity (24 pages, scriptable); fix families.html conflicting `MedicalBusiness` node; standardize the full org block onto the 23 ES pages missing it + the 11 degraded ones; `publisher` on 12 BlogPostings; align 24/7 `openingHours` with visible "Mon–Sat" clinical hours; unify the clinic @id. *(Code · half-day)*
- [ ] **Family/fentanyl content:** add MOUD/Suboxone + naloxone answers to `families.html`; add Fentanyl to the nav Addiction column (best fentanyl content is unreachable from navigation); "your first call, minute by minute" block featuring Scott Hedlund. *(Content · 2–3 h)*
- [ ] **Conversion surfaces:** `sms:+14242083120` link (or delete "or Text" claim); response-time promise above the VOB submit button; referral_source dropdown (backend already supports it — attribution currently lost); fix the 4 MB stale-Vercel upload cap in `js/intake.js:23` (server allows 25 MB, UI promises 10). *(Code · 2 h)*
- [ ] **Meta/title trims:** 30 over-160-char descriptions (mostly ES), 7 titles at 61–62 chars, 22 breadcrumb section-links pointing at "/", locations H1 + geo term. *(Code · 2 h)*
- [ ] **Security headers:** HSTS, X-Frame-Options SAMEORIGIN, Permissions-Policy in `_headers`; CSP report-only to start. *(Code · 1 h)*
- [ ] **Google API wiring:** Search Console + CrUX + GA4 credentials so the next audit gets field CWV, indexation, and query data. *(Ops+Code)*

## Low — backlog

- [ ] Minify for real (`styles.min.css`/`main.min.js` are byte-identical copies); inline `i18n.js`; merge `cta.css`; immutable caching for `/css/*` `/js/*` + Cloudflare "Respect Existing Headers"; inline a Lucide SVG sprite (drops 94 KB gzip/page + icon pop-in).
- [ ] Regenerate sitemap `lastmod` from git (58 of 90 stale); drop `changefreq`/`priority`.
- [ ] Expand `llms.txt` (25→90 URLs: homepage, about/contact, all blog posts, `## En Español` section).
- [ ] Phone-banner tap target 25px→full 53px banner (`padding:14px 16px; margin:-14px -16px`).
- [ ] "Outpatient — PHP, IOP & telehealth" in the homepage hero subhead (pre-qualifies detox-seekers).
- [ ] Compliant social proof once reviews exist: "Read our Google reviews" link (no self-hosted aggregateRating), consented alumni quotes with disclaimers.
- [ ] Cleanup: delete duplicate DHCS scan + unused images (~466 KB), `.DS_Store` out of repo, `es/intake-success` robots/hreflang alignment, `inLanguage` fix on espanol.html, twitter:card on 3 ES pages.
- [ ] Ops confirmations: Paubox + Cloudflare BAAs executed (send-vob.js:19 says required), Maps API key referrer-restricted, "24/7 answered by our team" operationally true (then say WHO answers, sitewide).

## ✅ Verified strengths to protect (don't regress these)

- 0 broken internal links (6,542), unique titles/metas on all 93 pages, exact canonicals, full hreflang triplets.
- 350 JSON-LD blocks / 0 errors; NAP 100% consistent everywhere; visible FAQ content.
- ~34 ms TTFB; text-LCP homepage; CLS 0.004; fonts done right; lucide version-pinned.
- Honest copy: zero cure/guarantee/success-rate claims; correctly NO fake review schema; intake-success correctly noindexed; VOB backend is HIPAA-aware (Paubox, no-log, memory-only files).
- The VOB form's progressive disclosure + insurance-logo checker under the hero are genuinely good conversion patterns.
