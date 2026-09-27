/* ============================================================
   GOLDEN STATE REHAB — Language toggle + Spanish offer banner
   ------------------------------------------------------------
   • The site has one Spanish page, /espanol, plus four Spanish
     form/legal pages under /es/. Every English page toggles to its
     Spanish counterpart when one exists, and to /espanol otherwise.
   • Never redirects. Google advises against switching language
     automatically, so a Spanish-language device (or a visitor who
     chose Spanish before) sees a dismissible banner instead.
   • Remembers the visitor's choice (localStorage) so an English
     choice stops the banner.
   ============================================================ */
(function () {
  var KEY = 'gsr_lang';
  var ES_HOME = '/espanol';

  /* EN path -> ES path for the pages that have a Spanish counterpart. */
  var PAIRS = {
    '/spanish-speaking-treatment': '/espanol',
    '/verify-insurance': '/es/verify-insurance',
    '/contact': '/es/contact',
    '/intake-success': '/es/intake-success',
    '/privacy-policy': '/es/privacy-policy'
  };

  function norm(p) {
    p = p.replace(/index\.html$/, '').replace(/\.html$/, '');
    if (p.length > 1) p = p.replace(/\/+$/, '');
    return p === '' ? '/' : p;
  }
  function isES(p) { return p === ES_HOME || p === '/es' || p.indexOf('/es/') === 0; }
  function esFor(p) { return PAIRS[p] || ES_HOME; }
  function enFor(p) {
    for (var k in PAIRS) { if (PAIRS[k] === p) return k; }
    return '/spanish-speaking-treatment';
  }

  var path = norm(location.pathname);
  var onES = isES(path);
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}

  var spanishDevice = false;
  try {
    var langs = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || navigator.userLanguage || '']).join(',').toLowerCase();
    spanishDevice = /(^|,)\s*es\b/.test(langs);
  } catch (e) {}

  if (!onES && saved !== 'en' && (saved === 'es' || spanishDevice)) {
    onReady(function () { showBanner(esFor(path)); });
  }

  /* Point the EN/ES toggle at the right counterpart and remember clicks. */
  onReady(function () {
    var toES = !onES;
    var target = toES ? esFor(path) : enFor(path);
    var links = document.querySelectorAll('.nav-lang, .nav-lang-mobile');
    for (var i = 0; i < links.length; i++) {
      links[i].setAttribute('href', target);
      links[i].addEventListener('click', function () {
        try { localStorage.setItem(KEY, toES ? 'es' : 'en'); } catch (e) {}
      });
    }
  });

  function showBanner(href) {
    try { if (sessionStorage.getItem('gsr_banner')) return; } catch (e) {}
    var b = document.createElement('div');
    b.className = 'lang-banner';
    b.setAttribute('role', 'region');
    b.setAttribute('aria-label', 'Cambiar idioma');
    b.setAttribute('lang', 'es');
    b.innerHTML = '<span>¿Prefiere leer en español?</span>' +
      '<a href="' + href + '">Ver en español</a>' +
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
