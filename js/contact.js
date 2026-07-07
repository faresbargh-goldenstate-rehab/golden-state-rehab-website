// ─────────────────────────────────────────────────────────────
// /js/contact.js — Golden State Rehab contact form
// Fetch-based submit to /api/send-contact (Cloudflare Pages
// Function → Paubox). Bilingual messages keyed off <html lang>.
// ─────────────────────────────────────────────────────────────
(function () {
  'use strict';

  const form = document.getElementById('contact-form');
  if (!form) return;

  const lang = (document.documentElement.lang || 'en').toLowerCase().startsWith('es') ? 'es' : 'en';

  const MSG = {
    en: {
      required: 'Please fill in all required fields.',
      email: 'That email address doesn’t look right. Please double-check.',
      network: 'We couldn’t reach our submission service. Please check your connection and try again, or call (424) 208-3120.',
      server: 'Something went wrong sending your message. Please try again in a moment, or call us directly at (424) 208-3120 — we answer 24/7.',
      sending: 'Sending…',
      successTitle: 'Message received.',
      successBody: 'A member of our admissions team will follow up with you shortly — usually within the hour during business hours. If this is urgent, call us anytime at',
    },
    es: {
      required: 'Por favor completa todos los campos obligatorios.',
      email: 'Ese correo electrónico no parece válido. Por favor revísalo.',
      network: 'No pudimos conectar con nuestro servicio de envío. Verifica tu conexión e inténtalo de nuevo, o llama al (424) 208-3120.',
      server: 'Algo salió mal al enviar tu mensaje. Inténtalo de nuevo en un momento, o llámanos directamente al (424) 208-3120 — contestamos 24/7.',
      sending: 'Enviando…',
      successTitle: 'Mensaje recibido.',
      successBody: 'Un miembro de nuestro equipo de admisiones te contactará pronto — normalmente dentro de una hora en horario de atención. Si es urgente, llámanos a cualquier hora al',
    },
  }[lang];

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';

  let banner = document.getElementById('contact-error');
  if (!banner) {
    banner = document.createElement('p');
    banner.id = 'contact-error';
    banner.setAttribute('role', 'alert');
    banner.style.cssText = 'display:none;background:#FDECEA;color:#8C2318;border:1px solid #F0B9B1;border-radius:8px;padding:12px 16px;margin:0 0 16px;font-size:15px;';
    form.insertBefore(banner, form.firstChild);
  }

  function showError(msg) {
    banner.textContent = msg;
    banner.style.display = 'block';
    banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function hideError() {
    banner.style.display = 'none';
  }

  function setLoading(loading) {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    submitBtn.innerHTML = loading ? MSG.sending : originalBtnHtml;
    if (!loading && window.lucide) lucide.createIcons();
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    hideError();

    const data = new FormData(form);
    for (const field of ['first_name', 'last_name', 'phone', 'inquiry_type']) {
      if (!String(data.get(field) || '').trim()) {
        showError(MSG.required);
        return;
      }
    }
    const email = String(data.get('email') || '').trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError(MSG.email);
      return;
    }
    data.set('lang', lang);

    setLoading(true);
    let resp;
    try {
      resp = await fetch('/api/send-contact', { method: 'POST', body: data });
    } catch (_err) {
      setLoading(false);
      showError(MSG.network);
      return;
    }

    let ok = false;
    try {
      const json = await resp.json();
      ok = resp.ok && json && json.ok === true;
    } catch (_err) { /* non-JSON → treat as failure */ }

    setLoading(false);
    if (!ok) {
      showError(MSG.server);
      return;
    }

    const wrapper = form.closest('.contact-form-wrapper') || form.parentNode;
    const success = document.createElement('div');
    success.setAttribute('role', 'status');
    success.style.cssText = 'background:#F0F7EF;border:1px solid #BFDDBA;border-radius:12px;padding:28px 24px;';
    success.innerHTML =
      '<h3 style="margin:0 0 8px;">' + MSG.successTitle + '</h3>' +
      '<p style="margin:0;">' + MSG.successBody + ' <a href="tel:+14242083120" style="white-space:nowrap;font-weight:600;">(424) 208-3120</a>.</p>';
    form.replaceWith(success);
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
})();
