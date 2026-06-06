# How to Add a Blog Post — Golden State Rehab

The blog lives at **`/blog/`**. Each article is a standalone HTML file in the `blog/` folder
(e.g. `blog/cbt-vs-dbt-which-is-right.html`). The post URL is the filename without `.html`
(Cloudflare serves clean URLs automatically).

## Quick method (copy an existing post)

1. **Duplicate** any existing article file in `blog/`, e.g. copy
   `blog/first-week-of-outpatient-rehab.html` → `blog/your-new-slug.html`.
   Use a short, keyword-rich, hyphenated slug (this becomes the URL).

2. In the new file, update:
   - `<title>` and `<meta name="description">` (description ≤ 160 characters)
   - `<link rel="canonical">` and `og:url` → both `https://www.goldenstate-rehab.com/blog/your-new-slug`
   - `og:title`, `og:description`, `og:image`
   - The article tag/category, `<h1 class="article-title">`, and `<p class="article-deck">`
   - Author byline (name, role, avatar) and the date
   - The cover `<img>` and the body inside `<div class="article-body">`
   - The **two JSON-LD blocks** at the bottom: the `BlogPosting` (headline, description,
     image, datePublished, author, articleSection) and the `BreadcrumbList` (last item name).
     Leave the Organization + WebSite blocks unchanged.

3. **Add a card** for the post on `blog/index.html` (copy an existing `<a class="blog-card">…</a>`
   inside `.blog-grid`, and add it to the `blogPost` array in the page's `Blog` JSON-LD).

4. **Add the URL** to `sitemap.xml`:
   ```xml
   <url>
     <loc>https://www.goldenstate-rehab.com/blog/your-new-slug</loc>
     <lastmod>2026-06-05</lastmod>
     <changefreq>monthly</changefreq>
     <priority>0.7</priority>
   </url>
   ```

5. Commit + push. Cloudflare auto-deploys in ~60 seconds.

## Author bylines ("certified users")

Each post credits a real author and, for non-clinician authors, a **"Medically reviewed by
Dr. Lawrence Tucker, MD"** badge. Keep this — author credentials and medical review are a major
Google trust signal (E-E-A-T) for health content. To add a new clinical author, give them a
name, credential (e.g., "LMFT", "Psy.D."), short bio, and a headshot in `images/`.

## Categories
`Recovery` · `Therapy` · `Mental Health` · `Family Support` · `Treatment 101`
(These power the filter pills on the blog index — match the `data-category` on each card.)

## Want non-developers to publish without touching code?
See the note in the project README about adding a **git-based CMS** (Decap/Sveltia CMS). It gives
approved staff a visual `/admin` login to write and publish posts — the CMS commits the HTML for
them and Cloudflare rebuilds. This requires a one-time OAuth setup; ask your developer to wire it up.
