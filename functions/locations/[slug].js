// ─────────────────────────────────────────────────────────────
// /functions/locations/[slug].js
// Cloudflare Pages Function — retired neighborhood pages → 410 Gone
// ─────────────────────────────────────────────────────────────
// The 11 "Rehab Near <neighborhood>" pages were taken down on
// 2026-09-27 as thin, near-duplicate content for a single-location
// facility. _redirects cannot emit a 410, so this function answers
// for those exact slugs and hands every other path back to Pages.
// The body is the site's normal 404 page so visitors still get nav.
// ─────────────────────────────────────────────────────────────

const RETIRED_SLUGS = new Set([
  'beverly-hills',
  'brentwood',
  'century-city',
  'culver-city',
  'mar-vista',
  'marina-del-rey',
  'pacific-palisades',
  'santa-monica',
  'venice',
  'west-hollywood',
  'west-los-angeles',
]);

const FALLBACK_BODY =
  '<!doctype html><title>Page removed | Golden State Rehab</title>' +
  '<p>This page has been removed. <a href="/locations">See our Westwood location</a>.</p>';

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
