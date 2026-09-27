// ─────────────────────────────────────────────────────────────
// /functions/es/[[path]].js
// Cloudflare Pages Function — retired Spanish mirror pages → 410 Gone
// ─────────────────────────────────────────────────────────────
// On 2026-09-27 the 45 machine-translated /es/ mirrors were cut to one
// Spanish page, /espanol. The four /es/ pages that remain (verify-
// insurance, contact, intake-success, privacy-policy) are forms and legal
// text, so every path not listed below is handed back to Pages. The 410
// body is the site's normal 404 page so visitors still get navigation.
// ─────────────────────────────────────────────────────────────

const RETIRED_PATHS = new Set([
  '', 'about', 'families', 'faq', 'locations', 'mental-health', 'our-facility',
  'our-story', 'team', 'terms-and-conditions',
  'blog', 'blog/cbt-vs-dbt-which-is-right', 'blog/cost-of-rehab-in-los-angeles',
  'blog/does-insurance-cover-rehab-in-california', 'blog/does-medi-cal-cover-rehab-in-california',
  'blog/first-week-of-outpatient-rehab', 'blog/terrified-to-ask-for-help',
  'programs', 'programs/alumni', 'programs/group-therapy', 'programs/holistic-therapies',
  'programs/individual-therapy', 'programs/iop', 'programs/medication-management',
  'programs/php', 'programs/telehealth',
  'treatments', 'treatments/alcohol', 'treatments/anxiety', 'treatments/cbt',
  'treatments/cocaine', 'treatments/complex-trauma', 'treatments/dbt',
  'treatments/depression', 'treatments/dual-diagnosis', 'treatments/fentanyl',
  'treatments/meth', 'treatments/opioid', 'treatments/prescription-drugs',
  'treatments/ptsd', 'treatments/sex-addiction',
]);

const FALLBACK_BODY =
  '<!doctype html><html lang="es"><title>Página eliminada | Golden State Rehab</title>' +
  '<p>Esta página ya no existe. <a href="/espanol">Vea nuestra atención en español</a>.</p></html>';

function normalize(params) {
  const parts = Array.isArray(params.path) ? params.path : params.path ? [params.path] : [];
  return parts.join('/').toLowerCase().replace(/\.html$/, '').replace(/(^|\/)index$/, '').replace(/\/+$/, '');
}

export async function onRequest(context) {
  if (!RETIRED_PATHS.has(normalize(context.params || {}))) return context.next();
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
