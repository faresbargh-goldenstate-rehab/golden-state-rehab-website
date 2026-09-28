// ─────────────────────────────────────────────────────────────
// /functions/license.js
// Cloudflare Pages Function — retired /license page → 410 Gone
// ─────────────────────────────────────────────────────────────
// The standalone license page was taken down on 2026-09-28. It only
// repeated the DHCS certificate and verify link already shown on
// Why Choose Us (/about). _redirects cannot emit a 410, so this
// function answers for /license. The body is the site's normal 404
// page so visitors still get nav.
// ─────────────────────────────────────────────────────────────

const FALLBACK_BODY =
  '<!doctype html><title>Page removed | Golden State Rehab</title>' +
  '<p>This page has been removed. <a href="/about">See our credentials</a>.</p>';

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
