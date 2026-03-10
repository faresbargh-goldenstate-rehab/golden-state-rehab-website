/* ============================================================
   GOLDEN STATE REHAB — Main JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── NAV SCROLL EFFECT ──────────────────────────────────────
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    });
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

  // ── TESTIMONIAL CAROUSEL ───────────────────────────────────
  const testimonials = document.querySelectorAll('.testimonial-item');
  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');
  let currentTestimonial = 0;

  function showTestimonial(index) {
    testimonials.forEach(t => t.classList.remove('active'));
    testimonials[index]?.classList.add('active');
  }

  if (testimonials.length) {
    showTestimonial(0);

    nextBtn?.addEventListener('click', () => {
      currentTestimonial = (currentTestimonial + 1) % testimonials.length;
      showTestimonial(currentTestimonial);
    });

    prevBtn?.addEventListener('click', () => {
      currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
      showTestimonial(currentTestimonial);
    });

    // Auto-advance every 6 seconds
    setInterval(() => {
      currentTestimonial = (currentTestimonial + 1) % testimonials.length;
      showTestimonial(currentTestimonial);
    }, 6000);
  }

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
