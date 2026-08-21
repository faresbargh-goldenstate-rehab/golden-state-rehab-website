/* ============================================================
   GOLDEN STATE REHAB — Main JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── NAV SCROLL EFFECT ──────────────────────────────────────
  // Phone banner stays sticky; nav itself slides up out of view
  // when scrolling down and reappears when scrolling up.
  const nav = document.querySelector('.nav');
  if (nav) {
    let lastY = window.scrollY;
    let ticking = false;
    const SHOW_THRESHOLD = 80;  // px past top before we start hiding
    const DELTA = 6;            // ignore tiny scroll jitter

    const update = () => {
      const y = window.scrollY;
      const diff = y - lastY;

      nav.classList.toggle('scrolled', y > 20);

      if (Math.abs(diff) > DELTA) {
        if (diff > 0 && y > SHOW_THRESHOLD) {
          nav.classList.add('nav-hidden');
        } else if (diff < 0) {
          nav.classList.remove('nav-hidden');
        }
        lastY = y;
      }
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  }

  // ── MOBILE NAV TOGGLE ──────────────────────────────────────
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.nav-mobile');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const open = toggle.classList.toggle('open');
      mobileNav.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      toggle.setAttribute('aria-expanded', open);
    });
  }

  // Close mobile nav on link click
  document.querySelectorAll('.nav-mobile a').forEach(link => {
    link.addEventListener('click', () => {
      toggle?.classList.remove('open');
      mobileNav?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ── FAQ ACCORDION ──────────────────────────────────────────
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        const a = openItem.querySelector('.faq-answer');
        if (a) a.style.maxHeight = '0';
        openItem.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
      });

      // Open clicked if it was closed
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ── HELP ACCORDION (contact / insurance pages) ─────────────
  document.querySelectorAll('.help-accordion-item').forEach(item => {
    const btn = item.querySelector('.help-accordion-btn');
    const content = item.querySelector('.help-accordion-content');
    if (!btn || !content) return;

    // Open first item by default
    const isFirst = item === item.parentElement.firstElementChild;
    if (isFirst) {
      item.classList.add('open');
      content.style.maxHeight = content.scrollHeight + 'px';
    }

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      item.closest('.help-accordion').querySelectorAll('.help-accordion-item').forEach(i => {
        i.classList.remove('open');
        const c = i.querySelector('.help-accordion-content');
        if (c) c.style.maxHeight = '0';
      });
      // Toggle
      if (!isOpen) {
        item.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // ── SCROLL REVEAL ──────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // ── ACTIVE NAV LINK ────────────────────────────────────────
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.includes(href.replace('../', '').replace('.html', ''))) {
      link.classList.add('active');
    }
  });

  // ── APPLE HERO GRID — SCROLL ARROWS ────────────────────────
  document.querySelectorAll('.apple-page-hero-grid').forEach(function(grid) {
    var wrapper = grid.parentElement;
    if (!wrapper || !wrapper.classList.contains('apple-page-hero-grid-wrapper')) return;
    var leftBtn  = wrapper.querySelector('.hero-grid-arrow--left');
    var rightBtn = wrapper.querySelector('.hero-grid-arrow--right');
    if (!leftBtn || !rightBtn) return;

    function updateArrows() {
      var atStart = grid.scrollLeft <= 1;
      var atEnd   = grid.scrollLeft >= grid.scrollWidth - grid.clientWidth - 1;
      leftBtn.classList.toggle('arrow-hidden', atStart);
      rightBtn.classList.toggle('arrow-hidden', atEnd);
    }

    grid.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('load', updateArrows);
    updateArrows();

    leftBtn.addEventListener('click', function() {
      grid.scrollBy({ left: -300, behavior: 'smooth' });
    });
    rightBtn.addEventListener('click', function() {
      grid.scrollBy({ left: 300, behavior: 'smooth' });
    });
  });

});

// ── Reviews overlay ───────────────────────────────────────────
// Four reviews sit on the page; this opens all six. The blurred frame is
// fixed and a child scrolls inside it, so the close button stays put.
(function () {
  var wall = document.querySelector('.proof-wall');
  var modal = document.getElementById('reviewsModal');
  if (!wall || !modal) return;
  var scroller = modal.querySelector('.proof-modal-scroll');
  var closeBtn = modal.querySelector('.proof-modal-close');
  var lastFocused = null;
  if (!scroller) return;

  function goTo(id) {
    var target = id && scroller.querySelector('.proof-full[data-review="' + id + '"]');
    scroller.style.scrollBehavior = 'auto';
    scroller.scrollTop = target ? target.offsetTop - 24 : 0;
    scroller.style.scrollBehavior = '';
  }

  function open(id) {
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    goTo(id);
    // The captures are lazy-loaded, so on first open the scroller may still be
    // shorter than its content and clamp the jump above back to zero. Re-apply
    // once each image reports a height.
    var pending = [].slice.call(scroller.querySelectorAll('img')).filter(function (img) { return !img.complete; });
    pending.forEach(function (img) {
      img.addEventListener('load', function () { if (!modal.hidden) goTo(id); }, { once: true });
    });
    requestAnimationFrame(function () { modal.classList.add('is-open'); });
    closeBtn.focus();
    document.addEventListener('keydown', onKeydown);
  }

  function close() {
    modal.classList.remove('is-open');
    document.removeEventListener('keydown', onKeydown);
    document.body.style.overflow = '';
    window.setTimeout(function () { modal.hidden = true; }, 220);
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') { close(); return; }
    // Close is the only control in here, so Tab simply stays on it.
    if (e.key === 'Tab') { e.preventDefault(); closeBtn.focus(); }
  }

  wall.addEventListener('click', function (e) {
    var btn = e.target.closest('.proof-shot-more');
    if (!btn) return;
    open(btn.getAttribute('data-review'));
  });
  closeBtn.addEventListener('click', close);
  // Clicking the dimmed area around the captures closes; clicking a capture does not.
  modal.addEventListener('click', function (e) {
    if (e.target === modal || e.target === scroller ||
        e.target.classList.contains('proof-modal-inner')) close();
  });
}());

// ── Facility card carousel ────────────────────────────────────
(function () {
  var wrapper = document.querySelector('.facility-carousel-wrapper');
  if (!wrapper) return;
  var track = wrapper.querySelector('.facility-carousel-track');
  var cards = track.querySelectorAll('.facility-card');
  var prevBtn = wrapper.querySelector('.facility-arrow--prev');
  var nextBtn = wrapper.querySelector('.facility-arrow--next');
  var counter = wrapper.querySelector('.facility-counter');
  var total = cards.length;
  var current = 0;
  var timer;

  function getVisibleCount() { return window.innerWidth <= 768 ? 1 : 3; }
  function getCardWidth() { return cards[0].offsetWidth + 20; }

  // Below the tablet breakpoint one step is a whole card — about 80% of the
  // screen — so an unattended advance drags most of the viewport sideways
  // while someone is reading their way down the page. On a phone the carousel
  // therefore only moves when an arrow is tapped. Anyone who asked for reduced
  // motion gets the same treatment at every width.
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function autoplayAllowed() { return window.innerWidth > 768 && !reducedMotion.matches; }

  function goTo(n) {
    var visible = getVisibleCount();
    var maxIndex = total - visible;
    current = Math.max(0, Math.min(n, maxIndex));
    // Cards are narrower than a third of the track (a peek of the next card
    // shows), so the last whole-card step would overshoot — clamp to the
    // track's real end instead of leaving a blank gap.
    var offset = Math.min(current * getCardWidth(), track.scrollWidth - track.clientWidth);
    track.style.transform = 'translateX(-' + offset + 'px)';
    prevBtn.style.opacity = current === 0 ? '0.4' : '1';
    nextBtn.style.opacity = current >= maxIndex ? '0.4' : '1';
    if (counter) {
      counter.textContent = visible > 1
        ? (current + 1) + '–' + (current + visible) + ' / ' + total
        : (current + 1) + ' / ' + total;
    }
    resetTimer();
  }

  function resetTimer() {
    clearInterval(timer);
    timer = null;
    if (!autoplayAllowed()) return;
    timer = setInterval(function () {
      var maxIndex = total - getVisibleCount();
      goTo(current < maxIndex ? current + 1 : 0);
    }, 4000);
  }

  prevBtn.addEventListener('click', function () { goTo(current - 1); });
  nextBtn.addEventListener('click', function () { goTo(current + 1); });
  window.addEventListener('resize', function () { goTo(0); });
  goTo(0);
}());

// ── Exit-intent popup ─────────────────────────────────────────
(function () {
  if (sessionStorage.getItem('exitShown')) return;
  if ('ontouchstart' in window) return;

  var overlay = document.createElement('div');
  overlay.className = 'exit-popup-overlay';
  // Language-aware copy (mirrors the lang handling in intake.js).
  var isES = document.documentElement.lang === 'es';
  var t = isES ? {
    aria: 'Antes de irte',
    imgAlt: 'Una sala de terapia privada en Golden State Rehab',
    eyebrow: 'Un Momento de Claridad',
    heading: 'Espera. No Te Vayas<br>Sin Ayuda.',
    text: 'Cada momento cuenta cuando se trata de la recuperación. Una decisión puede cambiar tu vida. Haz que esta valga.',
    cta: 'Habla con Nuestro Equipo',
    close: 'Cerrar'
  } : {
    aria: 'Before you go',
    imgAlt: 'A private therapy room at Golden State Rehab',
    eyebrow: 'A Moment of Clarity',
    heading: 'Wait. Don\'t Leave<br>Without Help.',
    text: 'Every moment matters when it comes to recovery. One decision can change your life. Make this one count.',
    cta: 'Speak With Our Team',
    close: 'Close'
  };

  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', t.aria);

  // Contact link uses clean URLs, matching the rest of the site (avoids a
  // .html -> clean-URL redirect); Spanish pages point to the Spanish contact.
  var contactHref = isES ? '/es/contact' : '/contact';

  overlay.innerHTML =
    '<div class="exit-popup">' +
      '<img class="exit-popup-image" src="/images/facility/individual-therapy-room.jpg" alt="' + t.imgAlt + '" loading="lazy">' +
      '<div class="exit-popup-body">' +
        '<p class="exit-popup-eyebrow">' + t.eyebrow + '</p>' +
        '<h2 class="exit-popup-heading">' + t.heading + '</h2>' +
        '<p class="exit-popup-text">' + t.text + '</p>' +
        '<div class="exit-popup-actions">' +
          '<a href="' + contactHref + '" class="btn btn-primary">' + t.cta + ' <i data-lucide="arrow-right"></i></a>' +
        '</div>' +
      '</div>' +
      '<button class="exit-popup-close" aria-label="' + t.close + '"><i data-lucide="x"></i></button>' +
    '</div>';

  document.body.appendChild(overlay);

  function closePopup() {
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  overlay.querySelector('.exit-popup-close').addEventListener('click', closePopup);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) closePopup(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePopup(); });

  // Arm exit-intent only after the visitor has spent time on the page, so it
  // never fires on arrival or by accident — only when they genuinely move to leave.
  var exitArmed = false;
  setTimeout(function () { exitArmed = true; }, 8000);

  document.addEventListener('mouseleave', function handler(e) {
    if (exitArmed && e.clientY <= 0 && window.innerWidth >= 768) {
      sessionStorage.setItem('exitShown', '1');
      overlay.classList.add('visible');
      document.body.style.overflow = 'hidden';
      if (typeof lucide !== 'undefined') lucide.createIcons();
      document.removeEventListener('mouseleave', handler);
    }
  });
}());

// ── Team Member Bio Modal ────────────────────────────────────────────────
// Each team card keeps its bio in a hidden .team-bio-source block (so the
// copy stays in the HTML for crawlers) and exposes a card-wide trigger
// button. Clicking anywhere on the card opens that bio in a modal.
(function () {
  var triggers = document.querySelectorAll('.team-card-trigger');
  if (!triggers.length) return;

  var CLOSE_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"' +
    ' stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"' +
    ' aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';

  var overlay = document.createElement('div');
  overlay.className = 'team-modal-overlay';
  overlay.innerHTML = [
    '<div class="team-modal" role="dialog" aria-modal="true" aria-labelledby="tm-name">',
    '  <button type="button" class="team-modal-close" aria-label="Close bio">' + CLOSE_ICON + '</button>',
    '  <div class="team-modal-scroll">',
    '    <div class="team-modal-head">',
    '      <div class="team-modal-avatar"><img id="tm-img" src="" alt=""></div>',
    '      <h2 class="team-modal-name" id="tm-name"></h2>',
    '      <p class="team-modal-role" id="tm-role"></p>',
    '    </div>',
    '    <div class="team-modal-bio" id="tm-bio"></div>',
    '  </div>',
    '</div>'
  ].join('');
  document.body.appendChild(overlay);

  var modal     = overlay.querySelector('.team-modal');
  var scroller  = overlay.querySelector('.team-modal-scroll');
  var closeBtn  = overlay.querySelector('.team-modal-close');
  var bioEl     = overlay.querySelector('#tm-bio');
  var lastFocus = null;
  var isOpen    = false;

  function textOf(card, selector) {
    var el = card.querySelector(selector);
    return el ? el.textContent.trim() : '';
  }

  // Show the bottom fade only while there is more bio below the fold.
  function syncScrollCue() {
    var more = scroller.scrollTop + scroller.clientHeight < scroller.scrollHeight - 4;
    modal.classList.toggle('has-more', more);
  }

  function open(trigger) {
    var card = trigger.closest('.team-circle-card');
    if (!card) return;
    var source = card.querySelector('.team-bio-source');
    if (!source) return;

    var cardImg  = card.querySelector('.team-circle-avatar img');
    var modalImg = overlay.querySelector('#tm-img');
    modalImg.src = cardImg ? cardImg.currentSrc || cardImg.src : '';
    modalImg.alt = '';

    overlay.querySelector('#tm-name').textContent = textOf(card, '.team-circle-name');
    overlay.querySelector('#tm-role').textContent = textOf(card, '.team-circle-role');

    // Clone the authored bio nodes rather than re-parsing markup.
    while (bioEl.firstChild) bioEl.removeChild(bioEl.firstChild);
    var clone = source.cloneNode(true);
    while (clone.firstChild) bioEl.appendChild(clone.firstChild);

    lastFocus = trigger;
    isOpen = true;
    scroller.scrollTop = 0;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    // visibility is part of the open transition, so it is still `hidden`
    // on this frame and the button cannot take focus yet. Wait a frame.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { closeBtn.focus(); });
    });
    syncScrollCue();
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
    lastFocus = null;
  }

  // Keep Tab inside the dialog. Focus is moved explicitly rather than
  // letting the browser do it, because WebKit skips buttons in its default
  // tab order and would drop focus out of the dialog entirely.
  function trapFocus(e) {
    var items = Array.prototype.slice.call(
      modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    );
    if (!items.length) return;
    e.preventDefault();
    var step = e.shiftKey ? -1 : 1;
    var i = items.indexOf(document.activeElement);
    // Focus outside the dialog (or lost to <body>) re-enters at the edge.
    var next = i === -1
      ? (e.shiftKey ? items[items.length - 1] : items[0])
      : items[(i + step + items.length) % items.length];
    next.focus();
  }

  Array.prototype.forEach.call(triggers, function (trigger) {
    trigger.addEventListener('click', function () { open(trigger); });
  });

  closeBtn.addEventListener('click', close);
  scroller.addEventListener('scroll', syncScrollCue);
  window.addEventListener('resize', function () { if (isOpen) syncScrollCue(); });
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', function (e) {
    if (!isOpen) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'Tab') trapFocus(e);
  });
}());


// ── Hero audience tabs -> page-wide persona targeting ────────────────
(function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.hero-tab'));
  if (!tabs.length) return;
  function setPersona(p) {
    document.body.setAttribute('data-persona', p);
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-persona') === p;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem('gsr_persona', p); } catch (e) {}
  }
  var saved = null;
  try { saved = localStorage.getItem('gsr_persona'); } catch (e) {}
  if (saved === 'loved') setPersona('loved');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () { setPersona(tab.getAttribute('data-persona')); });
    tab.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      var other = tabs.filter(function (t) { return t !== tab; })[0];
      if (other) { other.focus(); setPersona(other.getAttribute('data-persona')); }
    });
  });
})();


// ── Insurance coverage checker (confirms acceptance, routes to free VOB) ──
(function () {
  var tiles = Array.prototype.slice.call(document.querySelectorAll('.ins-tile'));
  if (!tiles.length) return;
  var result = document.getElementById('coverageResult');
  var providerEl = document.getElementById('coverageProvider');
  var ctaText = document.getElementById('coverageCtaText');
  var defaultCta = document.getElementById('coverageDefaultCta');
  if (!result || !providerEl || !ctaText) return;
  tiles.forEach(function (tile) {
    tile.addEventListener('click', function () {
      var name = tile.getAttribute('data-provider');
      tiles.forEach(function (t) { t.classList.toggle('is-selected', t === tile); });
      providerEl.textContent = name;
      ctaText.textContent = 'Verify My ' + name + ' Benefits';
      if (defaultCta) defaultCta.hidden = true;
      result.hidden = false;
    });
  });
})();


// ── Insurance logo wave: lights each logo up in sequence, like a wave ──
(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var grids = Array.prototype.slice.call(document.querySelectorAll('.insurance-logos-grid'));
  if (!grids.length) return;
  grids.forEach(function (grid) {
    var tiles = Array.prototype.slice.call(grid.querySelectorAll('.ins-tile'));
    if (tiles.length < 3) return;
    var i = -1, timer = null, hovered = false, stopped = false;

    function step() {
      if (hovered || stopped) return;
      i = (i + 1) % tiles.length;
      var prev = (i - 1 + tiles.length) % tiles.length;
      var next = (i + 1) % tiles.length;
      tiles.forEach(function (t, idx) {
        t.classList.toggle('is-lit', idx === i);
        t.classList.toggle('is-near', idx === prev || idx === next);
      });
    }
    function clearWave() {
      tiles.forEach(function (t) { t.classList.remove('is-lit', 'is-near'); });
    }
    function start() { if (!timer && !stopped) timer = setInterval(step, 380); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } clearWave(); }

    // Only animate while the grid is on screen
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { start(); } else { stop(); } });
      }, { threshold: 0.25 }).observe(grid);
    } else {
      start();
    }
    // Hand control to the visitor's cursor while they explore
    grid.addEventListener('mouseenter', function () { hovered = true; clearWave(); });
    grid.addEventListener('mouseleave', function () { hovered = false; });
    grid.addEventListener('touchstart', function () { hovered = true; clearWave(); }, { passive: true });
    // Once a provider is picked (homepage checker), retire the wave
    tiles.forEach(function (t) {
      t.addEventListener('click', function () { stopped = true; stop(); });
    });
  });
})();


/* ============================================================
   Sticky-header height sync
   ------------------------------------------------------------
   The nav docks beneath the phone banner using --phone-banner-h.
   That value used to be hard-coded (52/56px), so when the banner
   text was taller than expected — e.g. the longer Spanish copy
   "(424) 208-3120 · Disponible 24/7" wrapping to two lines — the
   nav overlapped and clipped the banner, or left a visible gap.
   Measure the banner's real height and sync the variable so the
   header always stacks flush, in any language or viewport.
   ============================================================ */
(function () {
  var banner = document.querySelector('.phone-banner');
  if (!banner) return;
  var root = document.documentElement;
  function sync() {
    root.style.setProperty('--phone-banner-h', banner.offsetHeight + 'px');
  }
  sync();
  window.addEventListener('load', sync);
  window.addEventListener('resize', sync);
  window.addEventListener('orientationchange', sync);
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(sync); }
})();
