/* ============================================================
   GOLDEN GUIDE — on-site chat widget (zero-API, fully client-side)

   Loaded on every public page via:
     <script src="/js/chat.min.js?v=N" defer></script>

   Ship rule (this repo's asset convention): after editing this file run
     python3 scripts/minify_assets.py
   then bump the ?v= across all pages with
     python3 scripts/add_chat_snippet.py --bump N
   (/js/* is cached immutable for a year — a missed bump means users
   never receive the change).

   Retrieval runs over /data/chat-kb.{en,es}.json (built by
   scripts/build_chat_kb.py, lazy-fetched on first open). Pipeline:
   crisis regex -> medical-advice regex -> intent fast-paths ->
   IDF-weighted token overlap -> below-threshold scope fallback.

   PRIVACY: user message text never leaves the browser. GA4 receives
   event names and matched topic ids only. Transcript lives in
   sessionStorage and dies with the tab.
   ============================================================ */

/* Matcher is a separate object so scripts/test_chat_retrieval.js can
   require() this file in Node (the widget IIFE below bails without a DOM). */
var GGMatcher = (function () {
  'use strict';

  function norm(text) {
    var s = String(text).toLowerCase();
    if (s.normalize) {
      s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
    return s.replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function stem(tok) {
    return tok.length > 3 && tok.charAt(tok.length - 1) === 's'
      ? tok.slice(0, -1) : tok;
  }

  function tokenize(text, kb) {
    var stop = kb._stopSet;
    if (!stop) {
      stop = kb._stopSet = {};
      for (var i = 0; i < kb.stop.length; i++) stop[kb.stop[i]] = 1;
    }
    var raw = norm(text).split(' ');
    var seen = {};
    var out = [];
    for (var j = 0; j < raw.length; j++) {
      var tok = raw[j];
      if (tok.length < 2 || stop[tok]) continue;
      tok = stem(tok);
      if (!seen[tok]) { seen[tok] = 1; out.push(tok); }
    }
    return out;
  }

  function expandSynonyms(normText, tokens, kb) {
    var out = tokens.slice();
    for (var phrase in kb.synonyms) {
      if (normText.indexOf(phrase) !== -1) {
        var canon = stem(kb.synonyms[phrase]);
        if (out.indexOf(canon) === -1) out.push(canon);
      }
    }
    return out;
  }

  function rx(pattern) {
    return new RegExp(pattern, 'i');
  }

  function scoreDoc(doc, tokens, kb) {
    var score = 0;
    var hits = 0;
    for (var i = 0; i < tokens.length; i++) {
      var t = tokens[i];
      var idf = kb.idf[t] || 0;
      if (doc.kw.indexOf(t) !== -1) { score += 4 * idf; hits++; }
      else if (doc.qt.indexOf(t) !== -1) { score += 3 * idf; hits++; }
    }
    return {
      score: score / (1 + 0.3 * Math.log(1 + doc.qt.length)),
      hits: hits
    };
  }

  /* Returns {type, answer, url?, link_label?, cta?, id?}.
     type: crisis | medical | intent | doc | fallback */
  function match(kb, query) {
    var q = norm(query);
    if (!q) return { type: 'fallback', answer: kb.safety.fallback.answer };
    if (rx(kb.safety.crisis.re).test(q)) {
      return { type: 'crisis', answer: kb.safety.crisis.answer };
    }
    if (rx(kb.safety.medical.re).test(q)) {
      return { type: 'medical', answer: kb.safety.medical.answer };
    }
    for (var i = 0; i < kb.intents.length; i++) {
      var intent = kb.intents[i];
      if (rx(intent.re).test(q)) {
        return {
          type: 'intent', id: intent.id, answer: intent.answer,
          url: intent.url, link_label: intent.link_label, cta: intent.cta
        };
      }
    }
    var tokens = expandSynonyms(q, tokenize(query, kb), kb);
    // A single shared rare word isn't understanding: multi-word queries must
    // overlap a doc on at least two tokens before we trust the match.
    var minHits = Math.min(2, tokens.length);
    var best = null;
    var bestScore = 0;
    for (var d = 0; d < kb.docs.length; d++) {
      var s = scoreDoc(kb.docs[d], tokens, kb);
      if (s.hits >= minHits && s.score > bestScore) {
        bestScore = s.score;
        best = kb.docs[d];
      }
    }
    if (best && bestScore >= kb.threshold) {
      return {
        type: 'doc', id: best.id, answer: best.a,
        url: best.url, link_label: best.link_label, score: bestScore
      };
    }
    return { type: 'fallback', answer: kb.safety.fallback.answer };
  }

  return { norm: norm, tokenize: tokenize, match: match, scoreDoc: scoreDoc };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = GGMatcher;
}

(function () {
  'use strict';
  if (typeof document === 'undefined') return;

  var LANG = document.documentElement.lang === 'es' ? 'es' : 'en';
  var CSS_HREF = '/css/chat.min.css?v=1';
  var KB_URL = '/data/chat-kb.' + LANG + '.json';
  var NUDGE_DELAY_MS = 25000;
  var TYPING_MS = 550;

  var TEXT = {
    en: {
      open: 'Open chat — Golden Guide, automated assistant',
      close: 'Close chat',
      dismiss: 'Dismiss',
      title: 'Golden Guide',
      sub: 'Automated assistant · or call <a href="tel:+14242083120">(424) 208-3120</a>',
      placeholder: 'Type a question…',
      send: 'Send message',
      offline: 'I couldn’t load my knowledge base just now. Our team can answer any question directly — call or text (424) 208-3120, answered 24/7 by a real person.'
    },
    es: {
      open: 'Abrir chat — Golden Guide, asistente automatizado',
      close: 'Cerrar chat',
      dismiss: 'Cerrar',
      title: 'Golden Guide',
      sub: 'Asistente automatizado · o llame al <a href="tel:+14242083120">(424) 208-3120</a>',
      placeholder: 'Escriba una pregunta…',
      send: 'Enviar mensaje',
      offline: 'No pude cargar mi base de conocimientos. Nuestro equipo puede responder directamente: llame o envíe un texto al (424) 208-3120, atendido 24/7 por una persona real.'
    }
  }[LANG];

  var ICON_CHAT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
  var ICON_CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
  var ICON_SEND = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/></svg>';

  var kb = null;
  var kbPromise = null;
  var launcher = null;
  var teaser = null;
  var panel = null;
  var messagesEl = null;
  var chipsEl = null;
  var inputEl = null;
  var everOpened = false;

  function track(name, params) {
    if (typeof gtag === 'function') gtag('event', name, params || {});
  }

  function ss(key, val) {
    try {
      if (arguments.length === 2) sessionStorage.setItem(key, val);
      else return sessionStorage.getItem(key);
    } catch (e) { return null; }
  }

  function getLog() {
    try { return JSON.parse(ss('gsrChatLog') || '[]'); }
    catch (e) { return []; }
  }

  function pushLog(entry) {
    var log = getLog();
    log.push(entry);
    if (log.length > 60) log = log.slice(-60);
    try { sessionStorage.setItem('gsrChatLog', JSON.stringify(log)); }
    catch (e) { /* storage unavailable — transcript just won't persist */ }
  }

  function loadKb() {
    if (kbPromise) return kbPromise;
    kbPromise = fetch(KB_URL).then(function (res) {
      if (!res.ok) throw new Error('kb http ' + res.status);
      return res.json();
    }).then(function (data) {
      kb = data;
      return kb;
    });
    return kbPromise;
  }

  /* ---------- rendering (textContent only for dynamic strings) ---------- */

  function addMsg(role, text, opts) {
    opts = opts || {};
    var div = document.createElement('div');
    div.className = 'gg-msg ' + (role === 'u' ? 'gg-msg-user' : 'gg-msg-bot');
    div.appendChild(document.createTextNode(text));
    if (role === 'b' && opts.url) {
      var link = document.createElement('a');
      link.className = 'gg-msg-link';
      link.href = opts.url;
      link.appendChild(document.createTextNode(
        (opts.link_label || (LANG === 'es' ? 'Leer más' : 'Read more')) + ' →'));
      link.addEventListener('click', function () {
        track('chat_deep_link', { target: opts.url });
      });
      div.appendChild(document.createElement('br'));
      div.appendChild(link);
    }
    if (role === 'b' && opts.cta) {
      var cta = document.createElement('a');
      cta.className = 'gg-msg-cta';
      cta.href = opts.cta.href;
      cta.appendChild(document.createTextNode(opts.cta.label));
      cta.addEventListener('click', function () {
        track('chat_cta_click', { cta: opts.cta.id || 'cta' });
      });
      div.appendChild(document.createElement('br'));
      div.appendChild(cta);
    }
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    if (!opts.noLog) {
      pushLog({ r: role, t: text, u: opts.url || null,
                l: opts.link_label || null, c: opts.cta || null });
    }
    return div;
  }

  function showTyping() {
    var div = document.createElement('div');
    div.className = 'gg-msg gg-msg-bot gg-typing-msg';
    div.innerHTML = '<span class="gg-typing" aria-hidden="true"><span></span><span></span><span></span></span>';
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  function renderChips() {
    if (!kb || !chipsEl || chipsEl.childNodes.length) return;
    for (var i = 0; i < kb.quick_actions.length; i++) {
      (function (action) {
        var chip = document.createElement('a');
        chip.className = 'gg-chip';
        chip.href = action.href;
        chip.appendChild(document.createTextNode(action.label));
        chip.addEventListener('click', function () {
          track('chat_cta_click', { cta: action.id });
        });
        chipsEl.appendChild(chip);
      })(kb.quick_actions[i]);
    }
  }

  /* ---------- answer flow ---------- */

  function respond(query) {
    var typing = showTyping();
    var started = Date.now();
    loadKb().then(function () {
      var result = GGMatcher.match(kb, query);
      var wait = Math.max(0, TYPING_MS - (Date.now() - started));
      setTimeout(function () {
        typing.parentNode && typing.parentNode.removeChild(typing);
        addMsg('b', result.answer, {
          url: result.url, link_label: result.link_label, cta: result.cta
        });
        if (result.type === 'crisis') track('chat_crisis_shown');
        else if (result.type === 'medical') track('chat_medical_refusal');
        else if (result.type === 'fallback') { track('chat_fallback'); renderChips(); }
        else track('chat_question_matched', { topic_id: result.id });
      }, wait);
    })['catch'](function () {
      typing.parentNode && typing.parentNode.removeChild(typing);
      kbPromise = null; // allow retry on next question
      addMsg('b', TEXT.offline, {
        cta: { id: 'call', label: '(424) 208-3120', href: 'tel:+14242083120' }
      });
    });
  }

  /* ---------- panel ---------- */

  function buildPanel() {
    panel = document.createElement('div');
    panel.className = 'gg-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'false');
    panel.setAttribute('aria-label', TEXT.title);
    panel.innerHTML =
      '<div class="gg-header">' +
        '<div class="gg-header-avatar">' + ICON_CHAT + '</div>' +
        '<div class="gg-header-text">' +
          '<p class="gg-header-title">' + TEXT.title + '</p>' +
          '<p class="gg-header-sub">' + TEXT.sub + '</p>' +
        '</div>' +
        '<button type="button" class="gg-close" aria-label="' + TEXT.close + '">' + ICON_CLOSE + '</button>' +
      '</div>' +
      '<div class="gg-messages" aria-live="polite"></div>' +
      '<div class="gg-chips"></div>' +
      '<form class="gg-form">' +
        '<input class="gg-input" type="text" maxlength="500" autocomplete="off" placeholder="' + TEXT.placeholder + '" aria-label="' + TEXT.placeholder + '">' +
        '<button type="submit" class="gg-send" aria-label="' + TEXT.send + '">' + ICON_SEND + '</button>' +
      '</form>' +
      '<div class="gg-foot"></div>';
    document.body.appendChild(panel);

    messagesEl = panel.querySelector('.gg-messages');
    chipsEl = panel.querySelector('.gg-chips');
    inputEl = panel.querySelector('.gg-input');

    panel.querySelector('.gg-close').addEventListener('click', closePanel);
    panel.querySelector('.gg-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var q = inputEl.value.replace(/\s+/g, ' ').trim();
      if (!q) return;
      inputEl.value = '';
      addMsg('u', q);
      respond(q);
    });
    document.addEventListener('keydown', onKeydown);
  }

  function onKeydown(e) {
    if (!panel || panel.style.display === 'none') return;
    if (e.key === 'Escape') { closePanel(); return; }
    if (e.key !== 'Tab') return;
    // Soft focus trap while the panel is open on mobile (full-screen sheet).
    if (window.innerWidth > 640) return;
    var focusables = panel.querySelectorAll('button, a[href], input');
    if (!focusables.length) return;
    var first = focusables[0];
    var last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  function openPanel(focusInput) {
    hideTeaser();
    if (!panel) buildPanel();
    panel.style.display = 'flex';
    launcher.style.display = 'none';
    ss('gsrChatOpen', '1');
    // focusInput === false means we're silently restoring the panel after a
    // page navigation — that's not a new open, so don't count it.
    if (focusInput !== false) track('chat_open', { first_open: !everOpened });

    var log = getLog();
    if (!messagesEl.childNodes.length) {
      if (log.length) {
        for (var i = 0; i < log.length; i++) {
          addMsg(log[i].r, log[i].t, {
            url: log[i].u, link_label: log[i].l, cta: log[i].c, noLog: true
          });
        }
        loadKb().then(renderChips)['catch'](function () {});
      } else {
        var typing = showTyping();
        loadKb().then(function () {
          typing.parentNode && typing.parentNode.removeChild(typing);
          panel.querySelector('.gg-foot').textContent = kb.safety.privacy_note;
          addMsg('b', kb.safety.greeting);
          renderChips();
        })['catch'](function () {
          typing.parentNode && typing.parentNode.removeChild(typing);
          kbPromise = null;
          addMsg('b', TEXT.offline, {
            cta: { id: 'call', label: '(424) 208-3120', href: 'tel:+14242083120' }
          });
        });
      }
    }
    if (kb) panel.querySelector('.gg-foot').textContent = kb.safety.privacy_note;
    everOpened = true;
    if (focusInput !== false && inputEl) inputEl.focus();
  }

  function closePanel() {
    if (panel) panel.style.display = 'none';
    launcher.style.display = 'flex';
    ss('gsrChatOpen', '0');
    launcher.focus();
  }

  /* ---------- launcher, teaser, nudge ---------- */

  function hideTeaser() {
    if (teaser && teaser.parentNode) teaser.parentNode.removeChild(teaser);
    teaser = null;
  }

  function anyModalOpen() {
    return !!document.querySelector(
      '.exit-popup-overlay.visible, .team-modal-overlay.open, ' +
      '.proof-modal.is-open, .nav-mobile.open');
  }

  function nudge() {
    if (everOpened || ss('gsrChatNudged') === '1' || anyModalOpen()) return;
    ss('gsrChatNudged', '1');
    launcher.classList.add('gg-pulse');

    // Teaser text ships in the KB, but the KB isn't loaded until first open —
    // so the teaser copy is the one KB string duplicated here.
    var teaserText = LANG === 'es'
      ? '¿Preguntas sobre tratamiento o seguro?'
      : 'Questions about treatment or insurance?';
    teaser = document.createElement('div');
    teaser.className = 'gg-teaser';
    teaser.setAttribute('role', 'status');
    var span = document.createElement('span');
    span.appendChild(document.createTextNode(teaserText));
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', TEXT.dismiss);
    btn.innerHTML = ICON_CLOSE;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      hideTeaser();
    });
    span.style.cursor = 'pointer';
    span.addEventListener('click', function () { openPanel(); });
    teaser.appendChild(span);
    teaser.appendChild(btn);
    document.body.appendChild(teaser);
  }

  function watchLangBanner() {
    var sync = function () {
      var present = !!document.querySelector('.lang-banner');
      document.body.classList.toggle('gg-banner-present', present);
    };
    sync();
    if (typeof MutationObserver !== 'undefined') {
      new MutationObserver(sync).observe(document.body, { childList: true });
    } else {
      setTimeout(sync, 2000);
    }
  }

  function init() {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = CSS_HREF;
    var start = function () {
      if (launcher) return;
      launcher = document.createElement('button');
      launcher.type = 'button';
      launcher.className = 'gg-launcher';
      launcher.setAttribute('aria-label', TEXT.open);
      launcher.innerHTML = ICON_CHAT;
      launcher.addEventListener('click', function () { openPanel(); });
      document.body.appendChild(launcher);
      watchLangBanner();

      if (ss('gsrChatOpen') === '1' && getLog().length) {
        everOpened = true;
        openPanel(false);
      } else {
        setTimeout(nudge, NUDGE_DELAY_MS);
      }
    };
    link.onload = start;
    document.head.appendChild(link);
    setTimeout(start, 2000); // fallback if onload never fires
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
