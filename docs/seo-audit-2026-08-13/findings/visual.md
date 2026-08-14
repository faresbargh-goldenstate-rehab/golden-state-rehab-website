# Visual Audit — goldenstate-rehab.com (live) — Playwright

Method (observed): Chromium via Playwright, 6 pages × 2 viewports (desktop 1440×900, mobile 390×844 iPhone UA) = 12 page loads against `https://www.goldenstate-rehab.com`. Each load: `waitUntil: networkidle` + additional 2.5s settle, with `console`, `pageerror`, and `requestfailed` listeners attached from page creation (before navigation), a `PerformanceObserver('layout-shift')` injected via `addInitScript` (runs before any page script), and a scripted click attempt on the quiz FAB. Screenshots and raw data (`_results.json`) are in `/private/tmp/claude-501/.../scratchpad/screenshots/`.

## Headline answer: is `main.min.js` (non-deferred) breaking the sticky CTA bar / quiz FAB / ticker?

**Observed: no JS crash.** Across all 12 page loads, `console` events = `[]` and `pageerror` events = `[]` on every single page/viewport. There is no verbatim console error to quote — I looked for one and found none. So the missing `defer` is not throwing a script error that I could capture.

**But two of the three features are non-functional/invisible as tested, for reasons consistent with a script-timing bug (not a crash):**

- **Quiz FAB — effectively dead at rest.** `#quizFab.quiz-fab` exists in the DOM (homepage only — desktop and mobile) but has the `hidden` HTML attribute and stayed `hidden` through networkidle + 2.5s extra wait. Playwright's click failed after 3s: `element is not visible` (retried ~12×, waiting up to 500ms between attempts) — full log captured in `_results.json` under `home-desktop.quizInteraction` / `home-mobile.quizInteraction`. On the other 5 pages the FAB selector matched nothing at all (`found: false`), so it isn't even present sitewide. **Caveat (labeled): I did not test scroll-triggered reveal** — if the FAB is meant to un-hide after a scroll or time delay, my test (no scroll, 2.5s idle wait) would not have caught that trigger firing later. As tested at initial paint/settle, it is dead.

- **Sticky mobile CTA bar — positioned off-screen, not visible at rest.** `div.mobile-cta-bar` is `position: fixed` on every mobile page (home, php, alcohol, contact, es-home; absent only on verify-insurance). But its measured `getBoundingClientRect()` puts its **top edge below the bottom of the viewport** on every page it appears on: e.g. home-mobile viewport height 844, bar `top: 852, bottom: 927` — 8px entirely below the fold, 0px actually visible. Same pattern on php-mobile (852/927 vs 844 viewport) and contact/es-home-mobile. This matches the screenshots: `home-mobile.png`, `php-mobile.png`, `contact-mobile.png`, `es-home-mobile.png` show no visible bottom CTA bar. **Inferred:** this is consistent with a bar meant to be revealed via a JS-added class or inline style (e.g., toggling `bottom: 0` from an off-screen default) that never fires because the controlling script queries/binds before the DOM node exists — the exact failure mode the brief flags for a non-deferred `main.min.js`. **Caveat (labeled): I did not test whether scrolling reveals it** — only initial-load state was captured. As tested, it is not visible and cannot be interacted with.

- **Live ticker — present but appears broken/empty, homepage only.** On desktop the ticker element (`[class*="ticker"]`) is `visible: true` but its captured `textContent` is just `"✕"` (a single dismiss glyph) — no rotating proof-copy text was present at capture time. See `home-desktop.png` (bottom-left corner — no ticker chip is actually visible in the frame despite `visible:true`/nonzero rect, meaning it renders with effectively no visible content, just the close control). On mobile the same element exists but `visible: false` (likely CSS-hidden at that breakpoint, which may be intentional design rather than a bug). It was not found at all on php/alcohol/contact/verify-insurance/es-home. **Labeled inferred, not confirmed:** the empty text content is consistent with a script that dynamically injects ticker messages failing to run/populate before or independent of my capture window; I did not diff the DOM over multiple time slices to confirm it never populates, so I cannot rule out delayed population.

Net: the missing `defer` is not causing visible console errors, but two of the three "sticky/interactive" features (mobile CTA bar, quiz FAB) are confirmed non-functional at initial page-load state on live, and the ticker looks broken/empty on the one page it appears on. Recommend re-testing with a forced scroll + longer wait to fully rule out delayed/scroll-triggered activation before concluding it's unconditionally dead site-wide.

---

## Above-the-fold (mobile, 390×844)

All tested pages pass the basic bar: H1, value prop, and primary CTA are visible without scrolling, and CLS was 0 on every mobile capture (no layout jank observed).

- **Homepage** (`home-mobile.png`): phone banner, star rating badge, H1 "Los Angeles Addiction Treatment Center / 100+ Recoveries", subhead, "Verify My Insurance" button, phone CTA button, and DHCS/LegitScript trust badges all fit inside the 844px viewport. Strong above-the-fold — matches the trust-signal requirement (100+ Recoveries in H1, per project memory).
- **PHP program** (`php-mobile.png`): H1 "Partial Hospitalization Program (PHP) in Los Angeles" visible at top:196–355, within fold.
- **Alcohol treatment** (`alcohol-mobile.png`): H1 "Alcohol Addiction Treatment in Los Angeles" visible top:196–315, plus "Medically reviewed by Dr. Eric Chaghouri, MD" E-E-A-T byline directly under the hero, also within the fold.
- **Contact** (`contact-mobile.png`): H1 "We're Here to Help" visible top:276–316.
- **Verify Insurance** (`verify-insurance-mobile.png`): H1 "Verify Your Insurance" visible top:235–331.
- **Spanish homepage** (`es-home-mobile.png`): H1 "Centro de Tratamiento de Adicciones en Los Ángeles / 100+ Recuperaciones" visible, parity with English H1 confirmed visually.

No page's primary CTA required scrolling. The automated "first CTA" locator returned a 0×0 rect on some pages (a false negative from my heuristic, not a real defect — the CTA is visibly present in every screenshot); disregard `firstCtaRect` in `_results.json`, trust the screenshots/H1 rects instead.

## Layout issues

- **Horizontal-overflow anomaly on `/treatments/alcohol` (mobile only) — Medium, needs follow-up, not fully confirmed.** Observed: on every other mobile capture, `window.innerWidth` matched the requested 390px viewport exactly. On alcohol-mobile specifically, Chromium reported `innerWidth: 413`, `innerHeight: 894`, `scrollWidth: 413` (a uniform ~5.9% expansion of both dimensions, e.g. 390×1.059≈413). This is the signature of a mobile browser auto-expanding its layout viewport to accommodate an overflowing element (real iOS Safari would instead show a horizontal scrollbar at the requested 390px width, which would be a worse UX than what my measurement shows). I started a targeted diagnostic script (`diag_alcohol.js`, in scratchpad root) to identify the specific offending element by width but did not get to run it before being asked to stop — **label: observed anomaly, root cause not identified.** Recommend a follow-up pass: load `/treatments/alcohol` at a strict 390px viewport and inspect `document.querySelectorAll('*')` for any element with `getBoundingClientRect().right > 390`.
- **No other horizontal overflow.** All other 11 captures had `scrollWidth === innerWidth` (no overflow).
- **Tap targets under 44×44px (Low-Medium, sitewide).** The hamburger/mobile-menu button is **38×32px** on every mobile page tested (home, php, alcohol, contact, es-home; not present on verify-insurance's captured state) — under the 44×44 minimum recommended touch target size. Also flagged: `DHCS Licensed · #191643AP` trust-badge link is 188×20 / 210×20 (es) — height well under 44px, though it's a low-priority secondary link, not a primary CTA.
- **No overlapping elements or text truncation observed** in any of the 12 screenshots.
- **Exit-intent popup overlay present in DOM on every desktop page** (`div.exit-popup-overlay`, `position: fixed`, full-viewport rect, `z-index: 9999`) but not visually rendered in any screenshot (confirmed by looking at `home-desktop.png`, `php-desktop.png`, etc. — no overlay visible). Likely just an always-mounted, JS-toggled-hidden component; not a defect as observed, flagging only because a full-viewport z-9999 fixed element merits a quick manual exit-intent test to confirm it dismisses properly (not tested here).

## Cumulative Layout Shift (PerformanceObserver, buffered + live)

- **Desktop: ~0.002–0.005 CLS on every page** (home 0.0050, php 0.0043, alcohol 0.0043, contact 0.0038, verify-insurance 0.0040, es-home 0.0023) — all well under the 0.1 "good" threshold. Shift sources consistently trace to `.hero-actions`, `.nav-links`, `.phone-banner-link` shifting between ~200–470ms after load, consistent with a web-font swap reflowing the nav/hero text — minor, not a real UX problem.
- **Mobile: 0.000 CLS on every page** — no measurable shift captured on any mobile load.

## Contrast / readability

No contrast problems were visually apparent in any of the 12 screenshots — body copy is dark charcoal on cream/white, headings use dark text or the gold accent only for short emphasized spans (e.g., "100+ Recoveries") against light backgrounds, which read clearly at both viewport sizes. I did not run a numeric contrast-ratio check (e.g., axe-core) — this is a visual read only, not a WCAG-verified measurement.

## Console/network errors (all pages, all viewports)

Zero `console` messages and zero `pageerror` events on all 12 loads. One benign network failure repeated across mobile captures: `POST .../g/collect?...` (Google Analytics) returns `net::ERR_ABORTED` — this is Playwright/Chromium tearing down the browser context before the beacon completes, a test-harness artifact, not a live-site defect.

## Screenshots (all in `<scratchpad>/screenshots/`)

`home-desktop.png`, `home-mobile.png`, `php-desktop.png`, `php-mobile.png`, `alcohol-desktop.png`, `alcohol-mobile.png`, `contact-desktop.png`, `contact-mobile.png`, `verify-insurance-desktop.png`, `verify-insurance-mobile.png`, `es-home-desktop.png`, `es-home-mobile.png`, plus raw per-page data in `_results.json`.

## What I did not finish (say so explicitly)

- Did not identify the specific DOM element causing the alcohol-mobile viewport-expansion anomaly (`diag_alcohol.js` written but not run).
- Did not test scroll-triggered reveal of the quiz FAB or mobile CTA bar — only initial-load state.
- Did not numerically verify contrast ratios (visual read only).
- Did not test the exit-intent popup's actual trigger/dismiss behavior.
