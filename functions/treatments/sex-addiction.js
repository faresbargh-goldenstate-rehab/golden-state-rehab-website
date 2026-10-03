// ─────────────────────────────────────────────────────────────
// /functions/treatments/sex-addiction.js
// Cloudflare Pages Function — retired /treatments/sex-addiction → 410 Gone
// ─────────────────────────────────────────────────────────────
// Golden State Rehab does not treat sex addiction (owner, 2026-10-02),
// so the page was taken down and every link to it removed. _redirects
// cannot emit a 410, so this function answers for the URL. The body is
// the site's normal 404 page so visitors still get nav.
// ─────────────────────────────────────────────────────────────

const FALLBACK_BODY =
  '<!doctype html><title>Page removed | Golden State Rehab</title>' +
  '<p>This page has been removed. <a href="/treatments/">See what we treat</a>.</p>';

export async function onRequest(context) {
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
