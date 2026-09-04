# Golden State Rehab SEO Architecture & Internal Linking Blueprint

## Purpose

This document is an implementation brief for improving the SEO site architecture and internal linking strategy of **Golden State Rehab**, a West Los Angeles outpatient addiction and mental health treatment facility.

The goal is to:

- Target **high-intent, buyer-intent search queries**
- Build or optimize pages around **distinct search intent**, not every keyword variation
- Concentrate internal authority toward the pages most likely to generate admissions
- Keep important commercial pages close to the homepage
- Use hub pages to distribute authority to more specific service pages
- Avoid keyword cannibalization and doorway-page patterns
- Strengthen contextual internal linking across service, treatment, location, insurance, and informational pages

---

# Core SEO Principle

Do **not** create one page for every keyword variation.

Create one page for every **distinct buyer intent**.

For example, all of these can target the same IOP page:

- IOP Los Angeles
- intensive outpatient program Los Angeles
- IOP program Los Angeles
- intensive outpatient treatment Los Angeles

They express essentially the same commercial intent.

Do not create four nearly identical pages for those four phrases.

---

# Golden State Rehab Service Fit

Golden State Rehab is positioned primarily around:

- Outpatient addiction treatment
- Intensive Outpatient Program (IOP)
- Partial Hospitalization Program (PHP)
- Standard outpatient care
- Dual diagnosis treatment
- Mental health treatment
- Telehealth / virtual care
- Substance-specific addiction treatment
- Individual and group therapy

Golden State Rehab does **not** operate as a traditional on-site residential/inpatient rehab or medical detox facility.

Therefore, avoid building core money pages that imply Golden State directly provides services it does not provide.

Examples of risky primary targets:

- inpatient rehab Los Angeles
- residential rehab Los Angeles
- medical detox Los Angeles
- detox center Los Angeles

These may have high search volume, but search intent must accurately match the facility's actual services.

---

# SEO Priority Pages

## Tier 1: Highest Priority Commercial Pages

These pages deserve the strongest internal linking support.

| Priority | Page | Main Search Intent | Homepage Link |
|---|---|---|---|
| 1 | Homepage | addiction treatment center Los Angeles, drug rehab Los Angeles | N/A |
| 2 | Outpatient Rehab | outpatient rehab Los Angeles, outpatient drug rehab Los Angeles | YES |
| 3 | IOP | IOP Los Angeles, intensive outpatient program Los Angeles | YES |
| 4 | PHP | PHP Los Angeles, partial hospitalization program Los Angeles | YES |
| 5 | Dual Diagnosis | dual diagnosis treatment center Los Angeles, dual diagnosis rehab Los Angeles | YES |
| 6 | Mental Health Treatment | mental health treatment center Los Angeles, outpatient mental health treatment Los Angeles | YES |
| 7 | Alcohol Treatment | alcohol rehab Los Angeles, alcohol addiction treatment Los Angeles | Preferably YES |

Suggested URL structure:

```text
/
/programs/
/programs/outpatient-rehab/
/programs/iop/
/programs/php/
/programs/telehealth/

/treatments/
/treatments/dual-diagnosis/
/treatments/alcohol/
/treatments/opioid/
/treatments/fentanyl/
/treatments/meth/
/treatments/cocaine/
/treatments/prescription-drugs/

/mental-health/
/mental-health/depression/
/mental-health/anxiety/
/mental-health/ptsd/

/insurance/
/locations/
```

If equivalent URLs already exist, **optimize the existing URLs instead of replacing them unless there is a strong technical reason to change them**.

---

# Tier 2: High-Intent Specific Treatment Pages

These should generally receive authority from the **Treatments hub**, related program pages, location pages, and supporting content rather than requiring prominent homepage links.

Recommended targets:

## Opioid Treatment

Primary intent:

- opioid addiction treatment Los Angeles
- opioid rehab Los Angeles
- opioid treatment center Los Angeles

Suggested URL:

```text
/treatments/opioid/
```

## Fentanyl Treatment

Primary intent:

- fentanyl rehab Los Angeles
- fentanyl addiction treatment Los Angeles
- fentanyl treatment center Los Angeles

Suggested URL:

```text
/treatments/fentanyl/
```

## Meth Treatment

Primary intent:

- meth rehab Los Angeles
- meth addiction treatment Los Angeles

Suggested URL:

```text
/treatments/meth/
```

## Cocaine Treatment

Primary intent:

- cocaine rehab Los Angeles
- cocaine addiction treatment Los Angeles

Suggested URL:

```text
/treatments/cocaine/
```

## Prescription Drug Treatment

Primary intent:

- prescription drug rehab Los Angeles
- prescription drug addiction treatment Los Angeles

Suggested URL:

```text
/treatments/prescription-drugs/
```

---

# Tier 3: Mental Health Pages

Golden State also offers mental health treatment.

Recommended cluster:

```text
/mental-health/
    /depression/
    /anxiety/
    /ptsd/
```

The primary mental health page should act as the authority hub.

Example flow:

```text
HOME
  ↓
MENTAL HEALTH TREATMENT
  ↓
├── Depression Treatment
├── Anxiety Treatment
├── PTSD Treatment
└── Dual Diagnosis Treatment
```

Dual diagnosis should be strongly connected to both:

- Addiction treatment
- Mental health treatment

because it belongs semantically to both categories.

---

# Recommended High-Level Site Architecture

```text
                               HOME
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
   PROGRAMS HUB             TREATMENTS HUB          MENTAL HEALTH
        │                        │                        │
   ┌────┼────┐             ┌─────┼──────┐          ┌─────┼─────┐
   ▼    ▼    ▼             ▼     ▼      ▼          ▼     ▼     ▼
Outpt  IOP  PHP         Alcohol Opioid Fentanyl Depression Anxiety PTSD
                              │                      │
                              └──────────┐           │
                                         ▼           │
                                  DUAL DIAGNOSIS ◄───┘


                 LOCATIONS HUB               INSURANCE HUB
                       │                           │
              ┌────────┼────────┐          ┌───────┼────────┐
              ▼        ▼        ▼          ▼       ▼        ▼
           West LA   Santa   Beverly     Aetna   Cigna    Anthem
                    Monica    Hills
```

---

# Homepage Internal Linking Strategy

The homepage should **not** attempt to give equal prominence to every service page.

Use the homepage to point directly toward the most important revenue-producing pages.

Recommended direct contextual links from the homepage:

```text
HOME
 │
 ├── Outpatient Rehab Los Angeles
 ├── Intensive Outpatient Program
 ├── Partial Hospitalization Program
 ├── Dual Diagnosis Treatment
 ├── Mental Health Treatment
 └── Alcohol Addiction Treatment
```

These are not necessarily the only links on the homepage.

The important distinction is that these pages should receive **prominent contextual links from relevant homepage content sections**, not merely exist in the footer or navigation.

Example homepage copy:

> Looking for treatment without leaving work or family responsibilities behind? Explore our **outpatient rehab in Los Angeles**, including our **intensive outpatient program** and **partial hospitalization program**.

Each bold phrase should internally link to the corresponding page.

---

# Programs Hub

Recommended structure:

```text
/programs/
    ├── outpatient-rehab/
    ├── iop/
    ├── php/
    └── telehealth/
```

The Programs hub should link to every major level of care.

Program pages should also cross-link when clinically and contextually relevant.

Example:

```text
OUTPATIENT PAGE
   ↓
IOP
PHP
Telehealth
Dual Diagnosis
Alcohol Treatment
```

Example:

```text
IOP PAGE
   ↓
Outpatient Treatment
PHP
Dual Diagnosis
Alcohol Treatment
Opioid Treatment
Mental Health Treatment
```

The links should appear inside useful explanatory copy rather than as a random SEO link list.

---

# Treatments Hub

The Treatments hub should serve as the main authority distributor for substance-specific pages.

Recommended structure:

```text
/treatments/
    ├── alcohol/
    ├── opioid/
    ├── fentanyl/
    ├── meth/
    ├── cocaine/
    ├── prescription-drugs/
    └── dual-diagnosis/
```

The homepage does not need to prominently link to every substance-specific page.

Instead:

```text
HOME
  ↓
TREATMENTS HUB
  ↓
Alcohol
Opioids
Fentanyl
Meth
Cocaine
Prescription Drugs
Dual Diagnosis
```

---

# Cross-Linking Between Money Pages

Do not think of pages as isolated silos.

Related money pages should link to one another when it makes sense for the user.

Example:

```text
                 ALCOHOL TREATMENT
                         │
           ┌─────────────┼─────────────┐
           ▼             ▼             ▼
          PHP           IOP        Outpatient
                         │
                         ▼
                  Dual Diagnosis
```

And the reverse:

```text
                      IOP
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
Alcohol Treatment  Opioid Treatment  Dual Diagnosis
```

This creates strong topical relationships.

---

# Insurance SEO Opportunity

Insurance searches are extremely high buyer intent because the searcher is already considering how treatment will be paid for.

Recommended architecture:

```text
/insurance/
    ├── aetna/
    ├── anthem-blue-cross/
    ├── cigna/
    ├── blue-cross-blue-shield/
    └── united-healthcare/
```

Example search intents:

- rehab that accepts Aetna Los Angeles
- Aetna rehab Los Angeles
- Cigna rehab Los Angeles
- rehab that accepts Anthem
- BCBS rehab Los Angeles
- UnitedHealthcare rehab Los Angeles

Important compliance rule:

Do not claim:

- "in network"
- "covered"
- "accepted"

unless the wording accurately reflects Golden State Rehab's real insurance relationship.

Use compliant wording such as:

- verify your benefits
- may work with PPO plans
- insurance verification available
- check your coverage

when appropriate.

---

# Insurance Internal Linking

Architecture:

```text
HOME
 ↓
VERIFY INSURANCE
 ↓
INSURANCE HUB
 ↓
Aetna / Cigna / Anthem / BCBS / UnitedHealthcare
```

Each insurance page should link to the most relevant treatment options.

Example:

```text
AETNA PAGE
   ↓
Outpatient Rehab
IOP
PHP
Dual Diagnosis
   ↓
Verify Benefits CTA
```

Program pages should also link back toward insurance verification where appropriate.

Example:

```text
IOP PAGE
   ↓
"Verify whether your insurance may help cover IOP treatment."
   ↓
INSURANCE / VERIFY BENEFITS
```

---

# Location Page Strategy

Golden State serves West Los Angeles and nearby areas.

Potential location pages may include:

```text
/locations/west-los-angeles/
/locations/santa-monica/
/locations/beverly-hills/
/locations/brentwood/
/locations/culver-city/
/locations/venice/
/locations/century-city/
```

Location pages can target local commercial intent such as:

- rehab West Los Angeles
- outpatient rehab Santa Monica
- IOP Santa Monica
- rehab near Beverly Hills
- addiction treatment Brentwood
- outpatient addiction treatment Culver City

---

# Do NOT Create City × Service Doorway Pages at Scale

Avoid creating a giant matrix such as:

```text
/santa-monica-iop/
/santa-monica-php/
/santa-monica-alcohol-rehab/
/santa-monica-opioid-rehab/
/santa-monica-fentanyl-rehab/

/beverly-hills-iop/
/beverly-hills-php/
/beverly-hills-alcohol-rehab/
...
```

unless each page has truly distinct intent, useful local content, and enough differentiation to justify its existence.

Otherwise this risks:

- thin content
- duplication
- cannibalization
- doorway-page patterns
- poor user experience

Instead, use one strong city/location page.

Example:

```text
/locations/santa-monica/
```

That page can contain sections such as:

```text
Outpatient Rehab Near Santa Monica
IOP Near Santa Monica
PHP Near Santa Monica
Addiction Treatment Near Santa Monica
Mental Health Treatment Near Santa Monica
```

Each section can internally link to the main service page.

Example:

```text
SANTA MONICA PAGE
       │
       ├──→ IOP
       ├──→ PHP
       ├──→ Outpatient
       ├──→ Dual Diagnosis
       └──→ Mental Health
```

This reinforces the central money pages instead of fragmenting authority across dozens of near-duplicate URLs.

---

# Blog / Informational Content Strategy

Informational content should support money pages.

Do not publish blog content just to increase page count.

Example:

```text
Blog:
"How Intensive Outpatient Treatment Works"
                       ↓
                Internal link
                       ↓
                  IOP MONEY PAGE
```

Example:

```text
Blog:
"Signs Someone May Need Alcohol Treatment"
                       ↓
                Internal link
                       ↓
              ALCOHOL TREATMENT PAGE
```

Example:

```text
Blog:
"Can Depression and Addiction Occur Together?"
                       ↓
                Internal link
                       ↓
              DUAL DIAGNOSIS PAGE
```

The general rule:

```text
INFORMATIONAL CONTENT
        ↓
RELEVANT COMMERCIAL PAGE
```

---

# Anchor Text Strategy

Internal anchor text should clearly describe the destination.

Avoid generic anchors when a descriptive phrase fits naturally.

Weak:

```text
Learn more
Click here
Read more
View service
```

Better:

```text
our intensive outpatient program
IOP treatment in Los Angeles
outpatient addiction treatment
dual diagnosis treatment
alcohol addiction treatment
mental health treatment program
```

Do not make every anchor identical.

For the IOP page, rotate natural contextual variations such as:

- intensive outpatient program
- our IOP program
- IOP treatment
- Los Angeles IOP
- structured outpatient treatment
- intensive outpatient care

The anchor should sound natural inside the sentence.

---

# Important Page Authority Signals

Do not think only in terms of whether a page appears in the menu.

An important page can receive authority from many sources.

Example:

```text
IOP PAGE
   ↑
Homepage contextual link
Programs hub
Alcohol treatment page
Opioid treatment page
Fentanyl treatment page
Dual diagnosis page
Santa Monica location page
Beverly Hills location page
Relevant blog posts
External backlinks
```

That combined internal-link pattern tells search engines that the IOP page is highly important to the site.

A lower-priority page might only receive:

```text
Treatments hub
Relevant related-treatment page
Footer/navigation
1–2 contextual links
```

That creates a natural hierarchy.

---

# Recommended Authority Flow

```text
                    EXTERNAL BACKLINKS
                           ↓↓↓
                          HOME
                           ↓
       ┌───────────────────┼───────────────────┐
       ↓                   ↓                   ↓
   PROGRAMS            TREATMENTS         MENTAL HEALTH
       ↓                   ↓                   ↓
   IOP / PHP           ALCOHOL             DEPRESSION
  OUTPATIENT           OPIOID               ANXIETY
       ↓               FENTANYL               PTSD
       └───────────────→ DUAL ←────────────────┘
                       DIAGNOSIS
```

Additional supporting flow:

```text
LOCATION PAGES ──────→ Relevant money pages

INSURANCE PAGES ─────→ Relevant money pages

BLOG ARTICLES ───────→ Relevant money pages

RELATED MONEY PAGES ─→ Related money pages

EXTERNAL BACKLINKS ──→ Homepage + hubs + individual money pages
```

---

# Crawl Depth Goal

Important commercial pages should generally be easy to reach.

Ideal structure:

```text
Homepage
  ↓
Primary money page
```

or:

```text
Homepage
  ↓
Hub
  ↓
Specific money page
```

Avoid unnecessarily burying revenue-generating pages several layers deep.

Example to avoid:

```text
Homepage
  ↓
Resources
  ↓
Services
  ↓
Addiction
  ↓
Programs
  ↓
IOP
```

Better:

```text
Homepage
  ↓
Programs
  ↓
IOP
```

or even:

```text
Homepage
  ↓
IOP
```

for extremely important pages.

---

# Recommended SEO Priority Order

Allocate the strongest internal linking and optimization attention approximately in this order:

1. Homepage
2. Outpatient Rehab
3. Intensive Outpatient Program
4. Partial Hospitalization Program
5. Dual Diagnosis Treatment
6. Alcohol Addiction Treatment
7. Mental Health Treatment
8. Opioid Treatment
9. Fentanyl Treatment
10. Insurance Hub and insurer pages
11. Highest-value location pages
12. Meth Treatment
13. Cocaine Treatment
14. Prescription Drug Treatment
15. Supporting condition/service pages
16. Relevant informational content

This is a strategic priority order, not a rigid PageRank formula.

---

# What NOT to Do

## Do not create one page per keyword variation

Bad:

```text
/iop-los-angeles/
/intensive-outpatient-los-angeles/
/iop-program-los-angeles/
/intensive-outpatient-treatment-los-angeles/
```

Better:

```text
/programs/iop/
```

Target the entire keyword cluster on one strong page.

---

## Do not blindly minimize homepage links

There is no magic number of homepage links.

The goal is not:

> fewer links = automatically better rankings

The goal is:

> make the site's most important pages clearly important through architecture, contextual linking, hierarchy, and relevance.

Navigation and user experience still matter.

---

## Do not rely only on footer links

Important pages should receive contextual internal links from relevant body content.

A link inside a paragraph explaining outpatient care can be more useful semantically than simply repeating the URL in a giant footer list.

---

## Do not create irrelevant pages for volume alone

Only target keywords that match Golden State Rehab's actual services.

Do not misrepresent services merely because a keyword has strong volume.

---

## Do not create dozens of thin location pages

Each location page must add genuine local value.

Avoid mechanically swapping the city name while keeping nearly identical content.

---

# Recommended Implementation Tasks

## 1. Crawl the Existing Site

Use a crawler such as Screaming Frog.

Export:

- all indexable URLs
- crawl depth
- inlinks
- outlinks
- anchor text
- status codes
- canonical URLs
- page titles
- H1s
- word count
- meta descriptions

---

## 2. Classify Every Existing Page

Assign each URL one type:

```text
Homepage
Program
Treatment
Mental Health
Insurance
Location
Informational / Blog
Administrative
Low-value / Duplicate
```

---

## 3. Assign SEO Priority

Use:

```text
Priority 1 = Core money page
Priority 2 = High-intent supporting money page
Priority 3 = Supporting commercial page
Priority 4 = Informational support
Priority 5 = Low SEO importance
```

---

## 4. Map Keyword Clusters to URLs

Every important keyword cluster should have one preferred canonical page.

Example:

```text
Keyword Cluster:
IOP Los Angeles
intensive outpatient program Los Angeles
IOP treatment Los Angeles
intensive outpatient rehab Los Angeles

Preferred URL:
/programs/iop/
```

Do this for every commercial cluster.

---

## 5. Identify Cannibalization

Find multiple URLs competing for the same intent.

If two pages target essentially the same buyer intent:

- choose the stronger canonical page
- consolidate content if appropriate
- redirect redundant URLs when appropriate
- update internal links to point toward the preferred page

---

## 6. Improve Hub Pages

Primary hubs:

```text
/programs/
/treatments/
/mental-health/
/insurance/
/locations/
```

Each hub should:

- explain the category
- link to every important child page
- use descriptive anchor text
- prioritize the strongest pages
- provide real user value

---

## 7. Add Contextual Internal Links

For each commercial page, add links to:

- its parent hub
- closely related programs
- closely related treatments
- dual diagnosis where appropriate
- relevant insurance verification page
- appropriate local page where natural

---

## 8. Add Supporting Links From Location Pages

Every location page should link back to the core programs and treatment pages it discusses.

---

## 9. Add Supporting Links From Blog Content

Every informational article should have a clear relevant path toward one or more commercial pages.

Do not force unrelated links.

---

## 10. Audit Crawl Depth

Core commercial pages should generally be reachable in:

```text
1–2 clicks from the homepage
```

where practical.

Do not bury key money pages unnecessarily.

---

# Example Page-Level Internal Linking Blueprint

## Homepage

Link contextually to:

```text
/programs/outpatient-rehab/
/programs/iop/
/programs/php/
/treatments/dual-diagnosis/
/mental-health/
/treatments/alcohol/
/insurance/
/locations/
```

---

## IOP Page

Should receive links from:

```text
Homepage
Programs hub
Outpatient page
PHP page
Alcohol page
Opioid page
Fentanyl page
Dual diagnosis page
Mental health page where appropriate
Major location pages
Relevant insurance pages
Relevant blog articles
```

Should link out to:

```text
Outpatient Rehab
PHP
Dual Diagnosis
Alcohol Treatment
Opioid Treatment
Mental Health Treatment
Insurance Verification
Relevant location page(s)
```

---

## PHP Page

Should receive links from:

```text
Homepage
Programs hub
IOP page
Outpatient page
Alcohol page
Dual diagnosis page
Major location pages
Relevant blogs
```

Should link out to:

```text
IOP
Outpatient Rehab
Dual Diagnosis
Alcohol Treatment
Insurance Verification
```

---

## Outpatient Rehab Page

Should receive links from:

```text
Homepage
Programs hub
IOP
PHP
Treatment pages
Location pages
Insurance pages
Blogs
```

Should link out to:

```text
IOP
PHP
Telehealth
Dual Diagnosis
Alcohol Treatment
Mental Health Treatment
Insurance Verification
```

---

## Dual Diagnosis Page

This should become one of the site's most interconnected pages.

Should receive links from:

```text
Homepage
Treatments hub
Mental health hub
IOP
PHP
Outpatient
Alcohol
Opioid
Fentanyl
Depression
Anxiety
PTSD
Location pages
Relevant blogs
```

Should link out to:

```text
Mental Health Treatment
Depression
Anxiety
PTSD
Alcohol Treatment
Opioid Treatment
IOP
PHP
Outpatient Rehab
Insurance Verification
```

---

## Alcohol Treatment Page

Should receive links from:

```text
Homepage
Treatments hub
IOP
PHP
Outpatient
Dual Diagnosis
Location pages
Insurance pages
Alcohol-related blogs
```

Should link out to:

```text
IOP
PHP
Outpatient
Dual Diagnosis
Insurance Verification
```

---

## Opioid Treatment Page

Should receive links from:

```text
Treatments hub
IOP
Outpatient
Dual Diagnosis
Fentanyl page
Location pages
Insurance pages
Related blogs
```

Should link out to:

```text
Fentanyl Treatment
IOP
Outpatient Rehab
Dual Diagnosis
Insurance Verification
```

---

## Fentanyl Treatment Page

Should receive links from:

```text
Treatments hub
Opioid page
IOP
Outpatient
Dual Diagnosis
Location pages
Relevant blogs
```

Should link out to:

```text
Opioid Treatment
IOP
Outpatient Rehab
Dual Diagnosis
Insurance Verification
```

---

# Final Mental Model

Do not think:

```text
"How many links can I remove?"
```

Think:

```text
"Which pages make us money, and how do I make those pages structurally important?"
```

The desired system is:

```text
BACKLINK AUTHORITY
        ↓
     HOMEPAGE
        ↓
  STRONG HUB PAGES
        ↓
HIGH-INTENT MONEY PAGES
        ↑
        │
Location Pages
Insurance Pages
Related Services
Related Treatments
Helpful Blog Content
```

The most valuable pages should repeatedly receive relevant contextual links from the rest of the site.

That is the core internal-linking strategy.

---

# Instructions for Claude Code

When implementing this strategy:

1. **Do not blindly change URLs.**
   - Preserve existing URLs when reasonable.
   - If a URL must change, use proper 301 redirects.

2. **Do not create new pages until the existing site has been audited.**
   - Reuse and improve existing pages where the search intent already matches.

3. **Do not mass-generate city × service pages.**
   - Only create a page where there is a genuinely distinct search intent and enough unique content.

4. **Do not remove navigation links merely to reduce link count.**
   - UX, crawlability, hierarchy, and relevance matter more than chasing a fixed number of links.

5. **Prioritize contextual internal links.**
   - Add them where the destination is genuinely useful to a user.

6. **Use descriptive anchor text.**
   - Avoid excessive exact-match repetition.

7. **Protect YMYL accuracy.**
   - Addiction and mental health content is health-related.
   - Do not make unsupported medical claims.
   - Do not claim services, insurance relationships, accreditation, outcomes, or availability without evidence.

8. **Keep all treatment claims aligned with Golden State Rehab's real services.**

9. **After implementation, crawl the site again** and compare:
   - crawl depth
   - internal inlinks
   - orphan pages
   - broken links
   - redirects
   - canonicalization
   - indexability
   - title/H1 duplication

10. **The goal is not maximum internal links.**
    - The goal is a clear hierarchy that makes Golden State Rehab's highest-intent commercial pages the strongest and easiest-to-understand pages on the site.
