/* ============================================================
   GOLDEN STATE REHAB — Language detection + persistent switch
   ------------------------------------------------------------
   • Remembers the visitor's choice (localStorage) — manual choice
     always wins over auto-detection.
   • On first visit, if the device language is Spanish, routes the
     visitor to the Spanish version (or offers it via a banner when
     no direct Spanish mirror exists yet).
   • Rewrites the EN/ES toggle so it points to the correct
     counterpart of the current page.
   Runs in <head> (before paint) to avoid a flash of the wrong
   language; DOM-dependent parts wait for DOMContentLoaded.
   ============================================================ */
(function () {
  var KEY = 'gsr_lang';

  /* EN path -> ES path: explicit pairs + the growing /es/ mirror list.
     Add an EN path to MIRROR once its /es/<path> page exists. */
  var PAIRS = { '/spanish-speaking-treatment': '/espanol' };
  var MIRROR = ['/', '/verify-insurance', '/contact',
    '/programs/php', '/programs/iop', '/programs/telehealth', '/programs/individual-therapy',
    '/programs/group-therapy', '/programs/medication-management', '/programs/holistic-therapies',
    '/programs/alumni']; // EN paths that have a real /es/ mirror page

  function norm(p) {
    p = p.replace(/index\.html$/, '').replace(/\.html$/, '');
    if (p.length > 1) p = p.replace(/\/+$/, '');
    return p === '' ? '/' : p;
  }
  function isES(p) { return p === '/espanol' || p === '/es' || p.indexOf('/es/') === 0; }

  /* Direct Spanish mirror for an English path, or null if none exists yet. */
  function esMirror(p) {
    if (PAIRS[p]) return PAIRS[p];
    if (p === '/programs') return '/es/programs/';
    if (p === '/' && MIRROR.indexOf('/') >= 0) return '/es/';
    if (MIRROR.indexOf(p) >= 0) return '/es' + p;
    return null;
  }
  /* English counterpart for a Spanish path. */
  function enFor(p) {
    for (var k in PAIRS) { if (PAIRS[k] === p) return k; }
    if (p === '/es/programs') return '/programs/';
    if (p === '/es' || p === '/es/') return '/';
    if (p.indexOf('/es/') === 0) return p.slice(3) || '/';
    return '/';
  }

  var path = norm(location.pathname);
  var onES = isES(path);
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}

  /* 1) Honor a saved preference (manual choice wins). */
  if (saved === 'es' && !onES) { var m = esMirror(path); if (m) { location.replace(m); return; } }
  if (saved === 'en' && onES) { location.replace(enFor(path)); return; }

  /* 2) First-visit auto-detection by device language. */
  var spanishDevice = false;
  try {
    var langs = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || navigator.userLanguage || '']).join(',').toLowerCase();
    spanishDevice = /(^|,)\s*es\b/.test(langs);
  } catch (e) {}

  if (!saved && !onES && spanishDevice) {
    var es = esMirror(path);
    if (es) { try { localStorage.setItem(KEY, 'es'); } catch (e) {} location.replace(es); return; }
    // No direct mirror yet → offer Spanish via a dismissible banner.
    onReady(function () { showBanner(); });
  }

  /* 3) Wire the EN/ES toggle to the correct counterpart + remember clicks. */
  onReady(function () {
    var toES = !onES;
    var target = toES ? (esMirror(path) || '/espanol') : enFor(path);
    var links = document.querySelectorAll('.nav-lang, .nav-lang-mobile');
    for (var i = 0; i < links.length; i++) {
      links[i].setAttribute('href', target);
      links[i].addEventListener('click', function () {
        try { localStorage.setItem(KEY, toES ? 'es' : 'en'); } catch (e) {}
      });
    }
  });

  function showBanner() {
    try { if (sessionStorage.getItem('gsr_banner')) return; } catch (e) {}
    var b = document.createElement('div');
    b.className = 'lang-banner';
    b.setAttribute('role', 'region');
    b.setAttribute('aria-label', 'Cambiar idioma');
    b.innerHTML = '<span>¿Prefieres ver el sitio en español?</span>' +
      '<a href="/espanol">Ver en Español</a>' +
      '<button type="button" aria-label="Cerrar">✕</button>';
    b.querySelector('a').addEventListener('click', function () { try { localStorage.setItem(KEY, 'es'); } catch (e) {} });
    b.querySelector('button').addEventListener('click', function () {
      b.parentNode && b.parentNode.removeChild(b);
      try { sessionStorage.setItem('gsr_banner', '1'); } catch (e) {}
    });
    document.body.appendChild(b);
  }
  function onReady(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
})();
