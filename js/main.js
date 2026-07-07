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

// ── Facility card carousel ────────────────────────────────────
(function () {
  var wrapper = document.querySelector('.facility-carousel-wrapper');
  if (!wrapper) return;
  var track = wrapper.querySelector('.facility-carousel-track');
  var cards = track.querySelectorAll('.facility-card');
  var prevBtn = wrapper.querySelector('.facility-arrow--prev');
  var nextBtn = wrapper.querySelector('.facility-arrow--next');
  var total = cards.length;
  var current = 0;
  var timer;

  function getVisibleCount() { return window.innerWidth <= 768 ? 1 : 3; }
  function getCardWidth() { return cards[0].offsetWidth + 20; }

  function goTo(n) {
    var maxIndex = total - getVisibleCount();
    current = Math.max(0, Math.min(n, maxIndex));
    track.style.transform = 'translateX(-' + (current * getCardWidth()) + 'px)';
    prevBtn.style.opacity = current === 0 ? '0.4' : '1';
    nextBtn.style.opacity = current >= maxIndex ? '0.4' : '1';
    resetTimer();
  }

  function resetTimer() {
    clearInterval(timer);
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

// ── Team Member Modal ────────────────────────────────────────────────────
(function () {
  var teamBtns = document.querySelectorAll('.team-read-more');
  if (!teamBtns.length) return;

  // Create overlay + modal HTML
  var tmOverlay = document.createElement('div');
  tmOverlay.className = 'team-modal-overlay';
  tmOverlay.setAttribute('role', 'dialog');
  tmOverlay.setAttribute('aria-modal', 'true');
  tmOverlay.setAttribute('aria-labelledby', 'tm-name');
  tmOverlay.innerHTML = [
    '<div class="team-modal">',
    '  <button class="team-modal-close" aria-label="Close"><i data-lucide="x"></i></button>',
    '  <div class="team-modal-avatar"><img id="tm-img" src="" alt=""></div>',
    '  <h3 class="team-modal-name" id="tm-name"></h3>',
    '  <p class="team-modal-role" id="tm-role"></p>',
    '  <p class="team-modal-bio" id="tm-bio"></p>',
    '  <div class="team-modal-credentials" id="tm-creds"></div>',
    '</div>'
  ].join('');
  document.body.appendChild(tmOverlay);

  // Render any new lucide icons inside the modal
  if (typeof lucide !== 'undefined') lucide.createIcons();

  function openTM(btn) {
    var img  = tmOverlay.querySelector('#tm-img');
    img.src  = btn.dataset.img;
    img.alt  = btn.dataset.name;
    tmOverlay.querySelector('#tm-name').textContent = btn.dataset.name;
    tmOverlay.querySelector('#tm-role').textContent = btn.dataset.role;
    tmOverlay.querySelector('#tm-bio').textContent  = btn.dataset.bio;

    var credsEl = tmOverlay.querySelector('#tm-creds');
    credsEl.innerHTML = '';
    (btn.dataset.credentials || '').split('|').forEach(function (c) {
      c = c.trim();
      if (!c) return;
      var s = document.createElement('span');
      s.className = 'team-modal-credential';
      s.textContent = c;
      credsEl.appendChild(s);
    });

    tmOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeTM() {
    tmOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  teamBtns.forEach(function (b) {
    b.addEventListener('click', function () { openTM(b); });
  });

  tmOverlay.querySelector('.team-modal-close').addEventListener('click', closeTM);
  tmOverlay.addEventListener('click', function (e) {
    if (e.target === tmOverlay) closeTM();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeTM();
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


// ── Live activity ticker — TRUE, non-fabricated availability messages ──
(function () {
  var el = document.getElementById('liveTicker');
  if (!el) return;
  try { if (sessionStorage.getItem('tickerClosed')) return; } catch (e) {}
  var msgEl = document.getElementById('liveTickerMsg');
  var closeBtn = document.getElementById('liveTickerClose');
  if (!msgEl || !closeBtn) return;
  var MESSAGES = [
    'Admissions line is open right now',
    'Free insurance check, usually under a minute',
    'Most major PPO plans accepted here',
    'Confidential help, in English and Spanish',
    'Same-day assessments are often available',
    '100+ people have started treatment with us'
  ];
  var i = 0, timer;
  function cycle() {
    msgEl.style.opacity = '0';
    setTimeout(function () {
      i = (i + 1) % MESSAGES.length;
      msgEl.textContent = MESSAGES[i];
      msgEl.style.opacity = '1';
    }, 300);
  }
  function start() {
    el.hidden = false;
    msgEl.textContent = MESSAGES[0];
    requestAnimationFrame(function () { el.classList.add('is-visible'); });
    timer = setInterval(cycle, 5000);
  }
  closeBtn.addEventListener('click', function () {
    clearInterval(timer);
    el.classList.remove('is-visible');
    setTimeout(function () { el.hidden = true; }, 400);
    try { sessionStorage.setItem('tickerClosed', '1'); } catch (e) {}
  });
  setTimeout(start, 1500);
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


// ── Sticky mobile CTA bar: reveal after 300px of scroll ──────────────
(function () {
  var bar = document.querySelector('.mobile-cta-bar');
  if (!bar) return;
  function onScroll() { bar.classList.toggle('is-visible', window.scrollY > 300); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ── Treatment match quiz — non-diagnostic program finder ─────────────
(function () {
  var card = document.getElementById('quizCard');
  if (!card) return;
  var body = document.getElementById('quizBody');
  var progress = document.getElementById('quizProgress');

  var Q = [
    { id: 'who', q: 'Who are you looking for support for?', opts: [
      { l: 'Myself', v: 'self' },
      { l: 'Someone I love', v: 'loved' },
      { l: "A client I'm referring (I'm a professional)", v: 'pro' }
    ]},
    { id: 'focus', q: 'What feels like the main thing to work on right now?', opts: [
      { l: 'Drugs or alcohol', v: 'sud' },
      { l: 'Mental health, like anxiety, depression, or trauma', v: 'mh' },
      { l: "Both, or I'm not sure yet", v: 'both' }
    ]},
    { id: 'time', q: 'How much time can you give to treatment right now?', opts: [
      { l: 'Most of my day, several days a week', v: 'php' },
      { l: 'A few hours, a few days a week', v: 'iop' },
      { l: 'I need to do this from home', v: 'tele' },
      { l: "I honestly don't know yet", v: 'unsure' }
    ]}
  ];

  var R = {
    php: { icon: 'layers', tag: 'Most structured', title: 'A Partial Hospitalization Program (PHP) looks like a strong starting point',
      body: 'PHP is our most structured outpatient level: around six hours a day, five days a week, while you sleep at home. A free assessment confirms whether it is the right fit.',
      link: '/programs/php', linkLabel: 'See how PHP works' },
    iop: { icon: 'calendar', tag: 'Flexible', title: 'An Intensive Outpatient Program (IOP) may fit your schedule',
      body: 'IOP gives you real clinical support a few sessions a week, so you can keep up with work, school, or family while you do the work of recovery.',
      link: '/programs/iop', linkLabel: 'See how IOP works' },
    tele: { icon: 'video', tag: 'From home', title: 'Telehealth can bring treatment to you',
      body: 'Our telehealth program offers the same care by secure video, anywhere in California. It is a strong option when getting to a center every week is not realistic.',
      link: '/programs/telehealth', linkLabel: 'See telehealth options' },
    unsure: { icon: 'compass', tag: "Let's talk", title: 'Not knowing yet is completely normal',
      body: 'You do not need to have it figured out. A free, confidential assessment is the fastest way to find the right level of care together, with no pressure and no commitment.',
      link: '/contact', linkLabel: 'Talk with our team' },
    pro: { icon: 'heart-handshake', tag: 'For professionals', title: 'Thank you for trusting us with your client',
      body: 'We coordinate referrals quickly and confidentially, verify benefits the same day, and keep you in the loop as your client authorizes. Reach our team directly to get started.',
      link: '#referrals', linkLabel: 'See referral details' }
  };

  var answers = {}, order = [];

  function setProgress(done) {
    if (!progress) return;
    var pct = done ? 100 : Math.round(order.length / Q.length * 100);
    progress.innerHTML = '<span class="quiz-progress-bar" style="width:' + pct + '%"></span>';
  }

  function renderQuestion() {
    var i = order.length, step = Q[i];
    var h = '<div class="quiz-step"><p class="quiz-step-count">Question ' + (i + 1) + ' of ' + Q.length + '</p>';
    h += '<p class="quiz-q">' + step.q + '</p><div class="quiz-options">';
    step.opts.forEach(function (o) {
      h += '<button type="button" class="quiz-option" data-id="' + step.id + '" data-val="' + o.v + '">' + o.l + '</button>';
    });
    h += '</div></div>';
    body.innerHTML = h;
    body.querySelectorAll('.quiz-option').forEach(function (b) {
      b.addEventListener('click', function () { choose(step.id, b.getAttribute('data-val')); });
    });
    setProgress(false);
  }

  function choose(id, val) {
    answers[id] = val;
    order.push(id);
    if (id === 'who' && val === 'pro') return renderResult('pro');
    if (order.length < Q.length) renderQuestion();
    else renderResult(answers.time === 'php' ? 'php' : answers.time === 'iop' ? 'iop' : answers.time === 'tele' ? 'tele' : 'unsure');
  }

  function renderResult(key) {
    var r = R[key];
    setProgress(true);
    var note = '';
    if (answers.focus === 'mh' && key !== 'pro' && key !== 'unsure') {
      note = '<p class="quiz-result-note">Since mental health is front of mind, ask us about our <a href="/mental-health">Mental Health track</a> too.</p>';
    }
    body.innerHTML = '<div class="quiz-result">' +
      '<div class="quiz-result-icon"><i data-lucide="' + r.icon + '"></i></div>' +
      '<span class="card-tag">' + r.tag + '</span>' +
      '<h3>' + r.title + '</h3><p>' + r.body + '</p>' + note +
      '<div class="quiz-result-actions">' +
        '<a href="verify-insurance" class="btn btn-primary">Verify Insurance Free <i data-lucide="arrow-right"></i></a>' +
        '<a href="' + r.link + '" class="btn btn-secondary">' + r.linkLabel + '</a>' +
      '</div>' +
      '<button type="button" class="quiz-restart" id="quizRestart">Start over</button></div>';
    if (window.lucide) lucide.createIcons();
    var rb = document.getElementById('quizRestart');
    if (rb) rb.addEventListener('click', function () { answers = {}; order = []; renderQuestion(); });
  }

  renderQuestion();
})();


// ── Floating quiz prompt (FAB) + quiz modal ──────────────────────────
(function () {
  var fab = document.getElementById('quizFab');
  var modal = document.getElementById('quizModal');
  if (!fab || !modal) return;
  var card = document.getElementById('quizFabCard');
  var bubble = document.getElementById('quizFabBubble');
  var openBtn = document.getElementById('quizFabOpen');
  var closeBtn = document.getElementById('quizFabClose');
  var modalClose = document.getElementById('quizModalClose');
  var overlay = document.getElementById('quizModalOverlay');
  var minimized = false;
  try { if (sessionStorage.getItem('quizFabMinimized')) minimized = true; } catch (e) {}

  function showBubble() {
    minimized = true;
    fab.classList.remove('is-open');
    card.hidden = true;
    bubble.hidden = false;
  }
  function showFab() {
    fab.hidden = false;
    if (minimized) { showBubble(); return; }
    card.hidden = false;
    bubble.hidden = true;
    requestAnimationFrame(function () { fab.classList.add('is-open'); });
  }
  function openModal() {
    modal.hidden = false;
    requestAnimationFrame(function () { modal.classList.add('is-open'); });
    document.body.style.overflow = 'hidden';
    if (window.lucide) lucide.createIcons();
    var first = modal.querySelector('.quiz-option');
    if (first) { try { first.focus(); } catch (e) {} }
  }
  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(function () { modal.hidden = true; }, 300);
  }

  if (openBtn) openBtn.addEventListener('click', function () { openModal(); showBubble(); });
  if (bubble) bubble.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', function () {
    showBubble();
    try { sessionStorage.setItem('quizFabMinimized', '1'); } catch (e) {}
  });
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

  // Appear after a calm delay; auto-minimize to a bubble if left untouched.
  setTimeout(showFab, 2500);
  setTimeout(function () { if (!minimized && fab.classList.contains('is-open')) showBubble(); }, 17000);
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
