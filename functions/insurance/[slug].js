// ─────────────────────────────────────────────────────────────
// /functions/insurance/[slug].js
// Cloudflare Pages Function — retired carrier pages → 410 Gone
// ─────────────────────────────────────────────────────────────
// The five per-carrier pages were taken down on 2026-09-27 and folded
// into /insurance/. Compliance wording rules out the one fact that
// would set them apart (network status), so they were near-duplicates.
// _redirects cannot emit a 410, so this function answers for those
// exact slugs and hands every other path (including the /insurance/
// hub) back to Pages. The body is the site's normal 404 page.
// ─────────────────────────────────────────────────────────────

const RETIRED_SLUGS = new Set([
  'aetna',
  'anthem-blue-cross',
  'blue-shield-of-california',
  'cigna',
  'united-healthcare',
]);

const FALLBACK_BODY =
  '<!doctype html><title>Page removed | Golden State Rehab</title>' +
  '<p>This page has been removed. <a href="/insurance/">See insurance coverage for rehab</a>.</p>';

export async function onRequest(context) {
  const slug = String(context.params.slug || '').toLowerCase().replace(/\.html$/, '');
  if (!RETIRED_SLUGS.has(slug)) return context.next();
  return gone(context);
}

async function gone(context) {
  const headers = {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'public, max-age=3600',
    'X-Robots-Tag': 'noindex',
  };
  try {
    const page = await context.env.ASSETS.fetch(new URL('/404', context.request.url));
    const type = page.headers.get('Content-Type') || '';
    if (type.includes('text/html')) return new Response(page.body, { status: 410, headers });
  } catch (err) {
    console.error('410 page: could not load /404 asset', err && err.message);
  }
  return new Response(FALLBACK_BODY, { status: 410, headers });
}
