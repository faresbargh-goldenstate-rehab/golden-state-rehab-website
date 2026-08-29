# Visual / Above-the-Fold Audit — goldenstate-rehab.com
Captured with Playwright Chromium (WebKit was installed but the capture script used Chromium; mobile "sideways motion" type issues would need a WebKit re-check per prior findings, not reproduced here). Viewports: desktop 1440x900, mobile 390x844 (iPhone 14-ish). No horizontal-overflow was measured via `scrollWidth > clientWidth` on every page — all returned `false` (no horizontal scroll on any of the 5 pages, either viewport).

No cookie/consent banners or popups appeared on any page/viewport at first paint.

Global persistent elements on every page: a thin black "sticky-style" top bar with phone number (`(424) 208-3120`), then a white nav bar with logo, nav links, Español toggle, "Verify Insurance" outline button, and gold "Call Now" button (desktop) — on mobile the nav collapses to a hamburger icon and the CTA buttons are hidden inside the menu, so on mobile pages **only the phone-number bar** is a visible, always-present CTA above the fold; the Verify Insurance button is not visible until the user opens the hamburger menu or the hero provides its own button.

---

## Homepage `/`
- Desktop (1440x900): screenshots/home-desktop.png
- Mobile (390x844): screenshots/home-mobile.png

**Above the fold:** Excellent on both viewports. H1 "Los Angeles Addiction Treatment Center / 100+ Recoveries" is fully visible, with the "100+ Recoveries" proof line in the H1 as required. Both CTAs ("Verify My Insurance" solid button and phone-number outline button) are visible without scrolling on mobile. Trust signals visible above the fold: Google 5.0-star review badge, DHCS licensed accreditation seal/badge, "A real counselor answers 24/7 / Always confidential / DHCS Licensed #191643AP" bullets. On mobile, the fold even has room to start the "What People Are Saying" section heading.
- Sticky banner + nav consume roughly 120px of the 844px mobile viewport (~14%) — reasonable overhead, does not crowd out the hero.
- Hero has no image (solid cream background), so there's nothing to fail to load — first paint is instant and matches final render.
- No overlapping elements, no cut-off text, icons (phone, star, Google "G", arrow) all rendered — no broken/empty Lucide icon glyphs observed.
- This is the strongest page in the audit; no changes recommended.

## Verify Insurance `/verify-insurance`
- Desktop: screenshots/verify-insurance-desktop.png
- Mobile: screenshots/verify-insurance-mobile.png

**Above the fold:** H1 "Verify Your Insurance for Rehab in Los Angeles" is very large — on mobile it alone consumes roughly 300px of the 844px viewport (~35%), pushing the actual form ("Let's start with you", First/Last Name fields) to the very bottom edge of the fold, with only the form's outer border and the "First Name" label peeking in. The user must scroll to interact with the form on mobile; only the top phone-number bar is an actionable CTA within the true fold.
- Trust signal above fold: "100% Confidential · HIPAA-Secured" pill badge (lock icon) on both viewports — good, but no review stars/insurance logos this high on the page.
- No overflow, no overlapping elements, inputs have visible labels and adequate padding; form field borders are a light tan and pass contrast reasonably against the white card.
- Recommendation: shrink the H1 or the vertical spacing above it on mobile so the form's first inputs (or at least the section title) land inside the 844px fold — currently the actual conversion action (starting the form) requires a scroll on mobile.

## PHP Program page `/programs/php`
- Desktop: screenshots/php-desktop.png
- Mobile: screenshots/php-mobile.png

**Above the fold:** Hero photo (treatment room) loads correctly at first paint on both viewports — no blank block. H1 "Partial Hospitalization Program (PHP) in Los Angeles" plus dek is fully visible. However, **no explicit CTA (button or "Verify Insurance"/"Call Now" element) appears anywhere above the fold on either viewport** — the hero has no button, and on mobile the nav's CTA buttons are hidden behind the hamburger. The only above-fold conversion path on mobile is the persistent phone-number bar at the very top; there is no "verify insurance" affordance visible until scrolling past the "Medically reviewed by / Updated July 2026" byline strip.
- Trust element visible: "Medically reviewed by Dr. Eric Chaghouri, MD — Medical Director" byline bar with shield icon, plus "Updated July 2026" — good E-E-A-T signal, but this is not the same as a purchase-intent trust signal (reviews, insurance logos).
- No overlapping/cut-off text; icons render correctly (shield check icon visible).
- Recommendation: add a persistent or hero-embedded CTA button ("Verify Insurance" / "Call Now") on program pages so mobile visitors don't have to scroll or open the hamburger menu to convert.

## Blog index `/blog`
- Desktop: screenshots/blog-desktop.png
- Mobile: screenshots/blog-mobile.png

**Above the fold:** Title "The Recovery Journal", subhead, and category filter pills ("All", "Recovery", "Therapy", "Mental Health", "Family Support", "Treatment 101") are visible, with the top of the first featured post card (sunrise photo, "Treatment 101" tag) beginning to show at the bottom edge on mobile. No CTA button above the fold on mobile beyond the phone bar — acceptable for a content/index page, but note it for consistency with the rest of the audit.
- Hero/featured image loads correctly, no blank block.
- No layout issues, no overflow, filter pill tap targets look >=44px tall on mobile.

## Spanish homepage `/es/`
- Desktop: screenshots/es-desktop.png
- Mobile: screenshots/es-mobile.png

**Above the fold:** Fully localized nav (Inicio, Programas, Tratamientos, Salud Mental, Atención en Español, Contacto, "English" toggle, "Verificar Seguro", "Llamar") and hero ("Centro de Tratamiento de Adicciones en Los Ángeles", "100+ RECUPERACIONES" stat, both CTA buttons "Verificar Seguro" and phone number, DHCS licensing line) all visible without scrolling, matching the strong English homepage layout.
- **Inconsistency vs. English homepage:** the Spanish hero does not show the "5.0 on Google" review-star badge that sits above the H1 on the English homepage — that specific social-proof element is missing on `/es/`, even though the rest of the trust content (DHCS badge/text) carries over. Worth adding for parity, since reviews are a strong above-fold trust signal on the English version.
- No overflow, overlapping, or icon-loading issues observed on either viewport.

---

## Cross-page tap-target / contrast notes
- All CTA buttons observed (solid gold, outline gold-on-cream) appear well above the 44px minimum touch target height on mobile.
- Body copy is dark near-black on cream/white backgrounds — contrast looks comfortably above 4.5:1 by eye on every page; no low-contrast text spotted.
- No unpkg/Lucide icon-loading failures observed (no empty/missing icon glyphs) on any of the 10 captures.

## Summary of issues found (ranked)
1. **PHP program page has no above-the-fold CTA on mobile or desktop** — hero has no button; mobile nav CTAs are hidden in hamburger. Likely true for other `/programs/*` and `/treatments/*` pages using the same template — worth checking sitewide.
2. **Verify-insurance page mobile H1 is oversized**, pushing the form itself below the 844px fold; only the phone bar is actionable without scrolling.
3. **Spanish homepage is missing the Google review-star trust badge** present on the English homepage hero — minor parity gap.
4. Blog index has no above-fold CTA beyond the phone bar (lower priority — index page, not a conversion page).
