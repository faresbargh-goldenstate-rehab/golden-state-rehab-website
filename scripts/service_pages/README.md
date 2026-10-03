# Service and category pages

Every service and category page is built from one JSON file in `content/` by
`build.py`. The builder writes only `<main>` and the FAQPage schema; the head,
nav and footer stay as they are. PHP (`content/programs__php.json`) was the
pilot the owner approved on 2026-10-02. Use it as the reference for format and
tone, never as text to copy.

```
python3 scripts/service_pages/build.py --check programs/iop   # lint only
python3 scripts/service_pages/build.py programs/iop           # lint + write the page
```

File name = page path with `/` written as `__` (`treatments__opioid.json`).

## Page anatomy

1. **Hero** (automatic layout): `h1` is the page's existing keyword H1, unchanged.
   `sub` is one or two short sentences (35 words max) that say what the service
   is in plain words and carry the page's up-link (see Links). One real photo
   with a caption, and an optional sticky note (two short lines of fact).
2. **Jump bar**: built from each section's `nav` label (1 to 3 words).
3. **Sections**, 6 to 8 of them. Each one is a question the visitor actually
   has, in their words, as the heading (`q`, must end with `?`), then one
   plain answer (`a`, 25 to 60 words), then an optional block. The first
   section is always "What is X?". The `q`/`a` pairs become the FAQPage
   schema, so every answer must stand on its own (never "see below").
4. **Closing banner** (automatic): "Let's get you scheduled."

Order the sections the way the visitor's questions come up: what it is, is it
for me, what it's like, who treats me, what it costs, what happens to my life
(job, privacy, family), what comes after. Then cut anything this page's
visitor wouldn't ask. Questions must be specific to the page: a fentanyl
visitor asks whether withdrawal is dangerous; a DBT visitor asks what the
skills are. Don't clone PHP's question list.

## Section fields

```json
{"id": "what", "nav": "What is IOP", "q": "What is IOP?", "a": "Answer...",
 "note": "optional small print under the answer",
 "cta": true,
 "block": { ... optional, one of the types below ... }}
```

`cta: true` adds a Verify My Insurance button with the trust badges after the
section. Hero and banner already have one; the `fit` card (with a card) and the
`insurance` block include their own. Aim for 5 to 7 Verify buttons per page.

### Block types

- `fit`: `{"type":"fit","signs":["You're ...", "..."], "card":{"title":"...","text":"..."}}`
  Signs are short sentences that start with "You". The card (optional) is the
  dark side panel with Verify + phone; use it for a reassurance such as "If X
  is more than you need, we'll say so".
- `sheet`: `{"type":"sheet","rows":[["9:00","Title","One line"], ...],
  "photos":[["image-key","alt","caption"],["image-key","alt","caption"]]}`
  A schedule or timeline on paper. First column is short (a time, a week,
  a day). Photos are optional (0 or exactly 2).
- `team`: `{"type":"team","people":["eric-chaghouri", ...],"review":"review-key","creds":true}`
  Faces with roles, one review, the JC and DHCS lines and a "Meet the whole
  team" link. Use only on pages where who treats you is a real question.
- `insurance`: `{"type":"insurance","items":["Your deductible","Your network status","What your plan pays for IOP"]}`
  The dark band. Put it on the cost question.
- `cards`: `{"type":"cards","items":[{"icon":"briefcase","t":"Title","d":"Text"}, ...]}`
  2 to 4 icon cards.
- `path`: `{"type":"path","steps":[{"t":"PHP","d":"...","href":"/programs/php"},{"t":"IOP","d":"...","here":true}]}`
  Levels of care in order; mark this page's stop with `"here": true`.
- `steps`: `{"type":"steps","items":[{"t":"Title","d":"Text"}, ...]}` numbered steps (2 to 4).
- `compare`: `{"type":"compare","cols":[{"t":"Morning track","rows":["...","..."]},{"t":"Evening track","rows":["..."],"dark":true}]}`
- `links`: `{"type":"links","items":[{"t":"Depression","d":"Short line","href":"/treatments/depression"}]}`
  Category pages only: the services under this category.
- `quote`: `{"type":"quote","review":"review-key"}` one review on its own.
- `list`: `{"type":"list","items":["...","..."]}` a checklist with no side card.

Text fields are plain text. A link is written `[label](/path)`. No HTML.

## Writing rules (owner's standing brief)

- 5th-grade reading level, short sentences, conversational, like a trusted
  local expert. Put any technical term (PHP, MAT, CBT) next to a plain
  explanation.
- Never: em dashes, question marks outside the `q` headings, groups of
  three in prose (use two or four), "it's not X, it's Y", "here's the truth",
  summaries or wrap-ups, transition phrases, symmetrical sentences,
  over-explaining, forced negative hooks.
- Banned words: ensure, crucial, vital, comprehensive, navigating, delve,
  deep dive, realm, embark, unlock, unleash, unveil, top-notch, transition,
  optimal, assessing, moreover, furthermore, therefore, thus, essentially,
  notably, significantly, "we know", "we understand", "look no further",
  "in conclusion", "in terms of", "bear in mind", "it's important to note",
  testament, eager, journey, tailored, seamless, empower.
- One intentional typo per page, in a card, sign or sheet line (never in a
  heading, a name, an answer or the hero).
- Confident, not defensive: state the fact and let the link or photo prove it.
  Never write "real", "actual", "verbatim", "check us yourself", "take our word".
- Local signals where they're true and natural: Westwood, the 405, the 10,
  Olympic, UCLA, Sawtelle, Santa Monica, Culver City, Beverly Hills,
  Brentwood, deductibles resetting January 1.

## Facts

Use only facts that are on the page's current version or in this list. The
lint checks every number against both. If the old page says something that
conflicts with the rules here (for example "we accept", Mon-Sat hours, "500+"),
leave it out.

- 1964 Westwood Blvd, Suite 425, Los Angeles 90025. South of Santa Monica Blvd,
  north of Olympic. Minutes from the 405 and the 10. Parking, plus street parking.
- Phone (424) 208-3120, answered 24/7, in English or Spanish. Never write
  "business hours" or any office hours.
- Insurance: "We work with most major PPO plans", plans "may cover" care, we
  check benefits for free, usually within the hour. Never "accept",
  "accepted", "in-network", "covered by", and never promise what someone
  will owe or pay (no "out-of-pocket max", no "what you'd pay"): people
  without coverage aren't admitted. Don't mention Medi-Cal. The insurance
  checklist sticks to: deductible, network status, what the plan pays for it.
- Detox is by referral: we set it up with a trusted detox provider and hold
  your spot. There is no inpatient, residential or on-site detox.
- PHP: about 6 hours a day, Monday to Friday, about 9am to 3pm, usually two
  to four weeks. IOP: 3-hour sessions, 3 to 5 days a week, morning or evening
  track, in person in Westwood or by telehealth anywhere in California.
- Alumni: weekly alumni groups and monthly check-ins for one full year.
- Most people start within days of their first call. No waiting list. The
  assessment is free and confidential, by phone or in person.
- HIPAA and 42 CFR Part 2 protect records; we never contact your employer.
  FMLA and California's CFRA usually protect your job; a leave request
  doesn't have to say why. SB 855 and federal parity law require plans to
  cover medically necessary mental health and addiction care.
- Team: Dr. Eric Chaghouri, MD, medical director, board-certified
  psychiatrist, trained at USC. Ari Labowitz, LMFT, clinical director.
  Viola Sulahian, AMFT, primary therapist. Nechama Berkowitz, APCC,
  trauma-informed therapist. Juanita Casillas, RADT, AOD counselor, speaks
  Spanish. Eduardo Garcia, program director. Sophia Scharpf, case manager.
  The physicians are bilingual, and family sessions are offered in Spanish.
- DHCS certified (#191643AP); say "certified", never "licensed" for the
  center. Joint Commission accredited August 12, 2026. 5-star rated on Google.
- GSR treats kratom (no page yet). GSR does not treat sex addiction.

## Links (silo rule)

Each page may link only to pages it links to today
(`allowed_links.json`), plus `/verify-insurance`, `/team` (team block) and
external sources. The `sub` must carry the page's up-link:

- Addiction treatment center services, and the three category pages:
  `[addiction treatment center in Los Angeles](/)`
- Mental health clinic services (depression, anxiety, PTSD, complex trauma,
  psychiatric care, group therapy, DBT): a link to `/mental-health`
  (group therapy uses the anchor "mental health clinic in Los Angeles")
- Outpatient rehab and telehealth: `[rehabilitation center in Los Angeles](/rehabilitation-center)`
- Alcohol: a link to `/alcoholism-treatment-program`

Keep the page's other current internal links where they fit (the lint lists
the ones you dropped). Blog links are optional.

## Catalogs

Images (real facility photos):
`group-therapy-room` (circle of chairs, landscape), `reception-lobby` (front
desk with backlit logo, landscape), `recreation-room` (landscape),
`waiting-area` (landscape), `individual-therapy-room` (sofa and armchair,
portrait), `meditation-room` (floor cushions, portrait),
`computer-workstations` (portrait), `game-room` (portrait), `reading-lounge`
(portrait), `tv-lounge` (portrait), `alumni-gathering` (alumni event, landscape).

People: `eric-chaghouri`, `ari-labowitz`, `viola-sulahian`,
`nechama-berkowitz`, `juanita-casillas`, `eduardo-garcia`, `sophia-scharpf`,
`scott-hedlund`, `dean-mcdermott`.

Reviews (verbatim Google excerpts; see REVIEWS in build.py for the text):
`joey-viola`, `joey-juanita`, `joey-toolbox`, `gregory`, `gregory-place`,
`yvette`, `dennis-groups`, `dennis-judged`, `mikey`, `ryan`, `kali-detox`,
`kali-life`, `desteny`.

Icons: briefcase lock users map-pin home heart heart-pulse clock calendar
calendar-heart phone video laptop moon sun sunrise shield-check pill
stethoscope brain message-circle hand-heart leaf sparkles user user-check
globe languages wifi car coffee book-open activity repeat refresh-cw target
compass life-buoy anchor sprout flame zap wind smile file-text clipboard-check
badge-check scale timer hourglass alarm-clock graduation-cap building-2 baby
monitor smartphone house-heart handshake hand-helping footprints mountain
trees waves syringe tablets ban siren thermometer bed school
