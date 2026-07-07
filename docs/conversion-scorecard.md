# Golden State Rehab — Conversion Enticement Scorecard

> **RE-MEASURED 2026-07-07 (post-fix, live site): Conversion Enticement 61 → 78.**
> Component re-scores: paths 64→82 · persona-self 58→78 · persona-family 56→76 · persona-Spanish 60→78 · trust 61→74 · above-fold 68→75. Of the 30 tracked metrics, 28 hit target; the two open items are ops-dependent (real testimonials/review links; staff license numbers). Known regressions from the owner's homepage revert: the three homepage "Call Now" buttons link to /contact (form now works, so leads are captured, not lost), the homepage LegitScript badge is unlinked, and the homepage banner lacks the "a real person answers" line present sitewide — all owner-decision items. SEO Health re-scored **71 → 87** the same day (technical 94, sitemap 93, onpage 93, schema 92, performance 90 w/ Lighthouse 90 live-mobile, content 85, local 82, GEO 71, images 68).

**Baseline:** 2026-07-07 · Question answered: *how enticing is this site to a person deciding to enter treatment — and where does the funnel leak?*
Method: full CTA/friction sweep of all 93 pages + form/handler code review, three persona walkthroughs (self-seeker, family decision-maker, Spanish-dominant seeker), trust/compliance sweep, and above-the-fold reconstruction. Critical/high findings adversarially re-verified against repo + live site. Machine-readable baseline: [conversion-baseline.json](conversion-baseline.json). Re-run the same sweeps against these numbers to track movement.

## Conversion Enticement Score: **61 / 100**

Composite = 30% conversion paths & friction + 40% persona enticement (avg of 3) + 20% trust & compliance + 10% above-the-fold effectiveness.

| Component | Weight | Score | Verdict |
|---|---|---|---|
| Conversion paths & friction | 30% | 64 | Phone path excellent; every other path broken or missing |
| Persona: "Alex" — self-seeker, 1 a.m., ashamed | 40% (avg) | 58 | Good bones; first touch speaks to a search engine, not to him |
| Persona: "Maria" — mother comparing 4–5 facilities | ↑ | 56 | Real license + real team, but zero independently verifiable proof |
| Persona: "Carlos" — Spanish-dominant seeker | ↑ | 60 | Excellent translations; funnel exits Spanish at the worst moments |
| Trust & compliance | 20% | 61 | Honest copy, real DHCS license; unlinked badges + analytics risk |
| Above-the-fold (mobile) | 10% | 68 | CTAs clear the fold even at 375×667; imagery undermines the layout |

## The funnel today

**What works:** the phone. A sticky top banner with a real `tel:` link on 92/93 pages, a bottom mobile CTA bar on 88, one click to call from the deepest page. The insurance-logo checker under the homepage hero and the progressive-disclosure VOB form (HIPAA-aware Paubox backend, real error handling, expectation-setting success page) are genuinely good.

**What leaks:**

1. **Contact form: 0% delivery.** No `action`, no handler (both languages). Every "Send Message" silently reloads and leaks the message into the URL. The nav/footer/menu "Call Now" buttons all point at this broken page instead of dialing. → *The phone is the only working conversion path, and several phone-labeled buttons don't reach it.*
2. **"Call or Text" promised, zero `sms:` links sitewide.** For the highest-anxiety visitors (the exact readers of blog/terrified-to-ask-for-help.html), texting is the preferred first contact. Cheapest missing surface on the site.
3. **Nobody is told what happens when they call.** No page says: a real person answers 24/7, you don't have to give your name, no pressure. The Process section starts *after* the call. The mobile CTA label "Free Assessment" is itself a small deterrent — ambivalent people don't want to be assessed, they want to talk.
4. **The VOB form demands full identity** (name, DOB, phone, email, member ID — 8 required fields) with no "or call and ask anonymously" escape hatch, no response-time promise at the button, and a stale 4 MB upload cap (UI says 10 MB, server allows 25 MB) that errors at the last step of the funnel.
5. **No live chat, no callback widget, no attribution** (referral_source field exists in backend + JS, absent from the form — marketing attribution is lost).

## What the personas found

**Alex (58/100) — drinks daily, told no one, phone, 1 a.m.** The H1 is a facility label ("Los Angeles Addiction Treatment Center"), the primary CTA is a billing question ("Verify My Insurance"), and his most likely landing page (alcohol) tells him in paragraph one that treatment is "for individuals who have completed medical detox" — a gate, not a welcome. Outpatient's #1 selling point (*keep your job*) never appears on the alcohol page and hides in the sixth homepage card. Unexplained PHP/IOP/MAT acronyms ("Partial Hospitalization" actively scares a job-protective reader — say "you sleep at home"). The two best shame-reducing lines on the site (motivational-interviewing and group-therapy cards) are buried mid-page. **The one change most likely to produce a 1 a.m. call: a 3-bullet "what happens when you call" strip.**

**Maria (56/100) — son using fentanyl, comparing facilities on trust.** She finds real assets: linked DHCS certificate, named board-certified Medical Director with verifiable USC background, authentic facility photos, and unusually good fentanyl clinical content (fentanyl-aware Suboxone induction, naloxone education). Then she hits: random placeholder images on the fentanyl/opioid pages themselves, zero reviews/testimonials anywhere, an unlinked "LegitScript Certified" text claim (unverifiable badges are a known scam-rehab pattern), "founded 2026" next to "500+ clients served" and "100+ recoveries" (invented-numbers pattern), and a families page that never mentions fentanyl, MAT, Suboxone, or naloxone — her #1 question. The fentanyl page isn't even in the nav. **Against a competitor with a Joint Commission seal and 200 Google reviews, she calls the competitor.**

**Carlos (60/100) — Spanish-dominant, searching "rehabilitación drogas los angeles".** The 43-page `/es/` mirror is professionally translated with correct clinical terminology, hreflang works, and Spanish URLs are all indexed. But: the Spanish homepage's 15 primary CTAs point at the *English* contact and insurance pages; the dedicated `/espanol` landing page links exclusively into the English site; every form validation/error message is hardcoded English; any broken URL dumps him on the English homepage (no 404 page); and no call button says "se habla español" at the point of click. The pages most likely to rank for his query ("rehabilitación") are blog posts, not conversion pages.

## Trackable metric baseline (2026-07-07)

Re-measure these after fixes; targets in the right column.

| # | Metric | Baseline | Target |
|---|---|---|---|
| **Conversion paths** ||||
| 1 | Contact-form submissions actually delivered | **0%** (no handler) | 100% |
| 2 | Working first-contact channels (call / form / text / chat) | **1 of 4** | ≥3 |
| 3 | "Call Now"-labeled buttons that actually dial | ~0% (point at /contact) | 100% |
| 4 | `sms:` links sitewide (vs "Call or Text" promise) | **0** | ≥3 placements |
| 5 | `tel:` links sitewide (to GSR number / E.164-correct) | 408 / 313 (+95 malformed) | 408 / 408 |
| 6 | Pages with sticky phone banner / mobile bottom CTA bar | 92 / 88 (of 93) | 93 / 91 |
| 7 | Pages with zero above-fold CTA | 1 (amenity-map) | 0 |
| 8 | Clicks-to-call from deepest page | 1 | keep 1 |
| **Form friction** ||||
| 9 | VOB required fields before any answer | 8 | ≤6 + anonymous phone path |
| 10 | Response-time promise visible at VOB submit button | No (only post-submit) | Yes |
| 11 | Upload-cap consistency (UI vs JS vs server) | 10 MB / 4 MB / 25 MB | one number |
| 12 | Attribution (referral_source) captured | 0% (field absent) | present, optional |
| **Reassurance copy** ||||
| 13 | "What happens when you call" blocks near CTAs | 0 | homepage + top-5 landing pages |
| 14 | Employment-fear reassurance near CTAs (FMLA/evening IOP) | 0 instances | program pages + VOB |
| 15 | Landing pages that gate instead of welcome (detox-gate above fold) | 1 (alcohol) | 0 |
| 16 | Acronyms glossed at first mention (PHP/IOP "you sleep at home") | No | Yes |
| **Trust signals** ||||
| 17 | Placeholder (picsum) images on clinical pages | **80 tags / 36 pages** | 0 |
| 18 | Dead hero image URLs | 3 (~35 pages affected) | 0 |
| 19 | Testimonials / linked review profiles / review counts | 0 / 0 / 0 | compliant Google-reviews link + 2–3 consented quotes |
| 20 | Accreditation badges linked to verification | 0 of 2 (DHCS→self-hosted JPG; LegitScript→nothing) | 2 of 2 |
| 21 | Staff license numbers displayed | 0 | all licensed clinicians |
| 22 | Contradictory stats pairs live | 1 ("2026" vs 500+/100+) | 0 |
| 23 | og:image shareable preview (1200×630) | No (256 px logo on 78 pages) | Yes |
| **Spanish funnel** ||||
| 24 | ES-page CTAs pointing at EN pages (es/index + espanol) | 15 + all of espanol.html | 0 |
| 25 | Hardcoded English strings in ES form runtime | 8 | 0 |
| 26 | "Se habla español" on the call CTA itself | No | Yes |
| **Discoverability of conversion content** ||||
| 27 | Families page inbound internal links (EN/ES) | 1 / 0 (orphaned) | in footer sitewide |
| 28 | Fentanyl page in nav/footer | No | Yes |
| 29 | MOUD/Suboxone/naloxone mentions on families page | 0 | ≥1 section + FAQ |
| 30 | AI answer engines able to crawl the site (of 7 tested) | **1 of 7** (rest 403) | 7 of 7 |

## How to re-measure

Each metric is a grep/curl away (no paid tools): #1–5, 9–17, 19–29 are repo greps (`grep -rc 'tel:+14242083120' --include='*.html' .` etc.); #6–8 from the shared templates; #18 `curl -o /dev/null -w '%{http_code}'` on the hero URLs; #30 `curl -A "GPTBot/1.0" -o /dev/null -w '%{http_code}' https://www.goldenstate-rehab.com/llms.txt`. Or simply re-run the audit and diff against [conversion-baseline.json](conversion-baseline.json).

Once the phone/form/text paths all work, add *outcome* metrics this scorecard can't see from the code: calls per week (with a tracked number), VOB submissions, contact submissions, text threads, and answer rate at 1 a.m. — those are the numbers the fixes above exist to move.
