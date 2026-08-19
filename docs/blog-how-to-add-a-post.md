# How to Add a Blog Post, Golden State Rehab

The blog lives at **`/blog/`**. Each article is a standalone HTML file in the `blog/` folder
(e.g. `blog/inpatient-vs-outpatient-rehab.html`). The post URL is the filename without `.html`
(Cloudflare serves clean URLs automatically).

## Quick method (copy an existing post)

1. **Duplicate** a recent article, e.g. copy
   `blog/inpatient-vs-outpatient-rehab.html` to `blog/your-new-slug.html`.
   Use a short, keyword-rich, hyphenated slug (this becomes the URL).

2. In the new file, update:
   - `<title>` (keep it under 60 characters) and `<meta name="description">` (140 to 160 characters, ending in a call to action)
   - `<link rel="canonical">` and `og:url`, both `https://www.goldenstate-rehab.com/blog/your-new-slug`
   - `og:title`, `og:description`, `og:image` (use the `.jpg` twin of the hero, not the `.webp`)
   - The article tag/category, `<h1 class="article-title">`, and `<p class="article-deck">`
   - Author byline (name, role, avatar, and the link to `/team`) and the date
   - The `.article-reviewed` badge naming the medical reviewer
   - The `.article-toc` list, one entry per `<h2 id="...">` in the body
   - The cover `<img>` and the body inside `<div class="article-body">`
   - All **four post-level JSON-LD blocks** (see below). Leave the Organization and WebSite blocks unchanged.

3. **Add a card** for the post on `blog/index.html` (copy an existing `<a class="blog-card">` inside
   `.blog-grid`, set `data-category`, and add the post to the `blogPost` array in the page's `Blog` JSON-LD).

4. **Add the URL** to `sitemap.xml`:
   ```xml
   <url>
     <loc>https://www.goldenstate-rehab.com/blog/your-new-slug</loc>
     <lastmod>2026-08-19</lastmod>
   </url>
   ```

5. **Add the post to `llms.txt`** under the Resources section. AI crawlers use this file.

6. **Link back to the post from at least one service page.** Blog posts that nothing links to do not
   rank. Add a contextual sentence in the body copy of the most relevant program, treatment, or
   location page.

7. Commit and push. Cloudflare auto-deploys in about 60 seconds.

## Required JSON-LD on every post

Six blocks total, in this order at the end of `<body>`:

1. `BlogPosting` (headline, description, image, datePublished, dateModified, author with a `/team` URL, `reviewedBy`, articleSection)
2. `MedicalWebPage` (`lastReviewed`, `reviewedBy`, `about`, `audience`)
3. `BreadcrumbList` (Home, Blog, post title)
4. `FAQPage` (3 to 5 questions). **The answer text must match the on-page FAQ wording exactly.**
5. `MedicalOrganization` / `LocalBusiness`, copied verbatim, never edited per post
6. `WebSite`, copied verbatim

## House rules for blog content

- **No em dashes or en dashes.** Use commas, periods, or the word "to" for ranges.
- **No invented statistics, success rates, or outcome claims.** Golden State Rehab was founded in 2026,
  so no longevity claims either.
- Case examples must be labeled as composites drawn from common client situations, never presented as
  a specific named client.
- Be honest about what we do not offer: no detox on site and no residential beds. Say so and refer out.
- 1,500 to 2,500 words, roughly an 8th to 10th grade reading level.
- 5 to 10 internal links, and 2 to 3 external citations to `.gov` or NIH/NIDA/SAMHSA sources, each with
  `target="_blank" rel="noopener"`.
- Mention Los Angeles, Westwood, or a specific neighborhood 3 to 5 times, naturally.
- One `<h1>` only, no heading level skips, and question-format `<h2>`s where they fit.

## Author bylines and medical review

Every post credits a real staff member, linked to `/team`, and carries a medical review badge naming
**Dr. Eric Chaghouri, MD**, our Medical Director and a board certified psychiatrist. When Dr. Chaghouri
is also the author, the badge reads "Written and medically reviewed by." Author credentials plus medical
review are a major Google trust signal (E-E-A-T) for health content.

Current bylined authors: Dr. Eric Chaghouri, MD (Medical Director), Ari Labowitz, LMFT (Clinical
Director), Vindell Brunson (Program Director), Viola Sulahian, AMFT (Primary Therapist), and
Juanita Casillas, RADT (AOD Counselor).

## Categories
`Recovery`, `Therapy`, `Mental Health`, `Family Support`, `Treatment 101`
(These power the filter pills on the blog index. The card's `data-category` must be one of
`recovery`, `therapy`, `mental-health`, `family`, `treatment`.)

## Spanish mirrors

`/es/blog/` currently mirrors only the six original posts. The ten posts added in August 2026 are
English only and therefore carry **no `hreflang` tags**, which is correct when no alternate exists.
When a post is translated, add the `hreflang` pair to both versions, a card on `es/blog/index.html`,
and a `sitemap.xml` entry.

## CSS

Blog styles live in `css/blog.css` with a minified twin at `css/blog.min.css`. **Edit both**, then bump
the `?v=` query string on every page that needs the change. The in-article table of contents uses
`.article-toc` and requires `blog.min.css?v=4` or later.

## Want non-developers to publish without touching code?
See the note in the project README about adding a git-based CMS (Decap/Sveltia CMS). It gives approved
staff a visual `/admin` login to write and publish posts. This requires a one-time OAuth setup.
