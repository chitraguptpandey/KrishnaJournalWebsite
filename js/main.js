/**
 * Krishna Journal — main.js
 * Handles: navbar scroll, hamburger, active links, back-to-top,
 *          cookie notice, testimonial carousel, pricing toggle, FAQ accordion
 */

(function () {
  'use strict';

  /* ── Helpers ──────────────────────────────────────────────── */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

  /* ── 1. Navbar Scroll Effect ──────────────────────────────── */
  var navbar = $('.navbar');
  if (navbar) {
    function updateNavbar() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    updateNavbar();
    window.addEventListener('scroll', updateNavbar, { passive: true });
  }

  /* ── 2. Hamburger / Mobile Menu ───────────────────────────── */
  var hamburger = $('.hamburger');
  var mobileMenu = $('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      var open = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close menu on link click
    $$('a', mobileMenu).forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── 3. Active Nav Link ───────────────────────────────────── */
  (function () {
    var page = window.location.pathname.split('/').pop() || 'index.html';
    $$('.navbar-links a, .mobile-menu a').forEach(function (link) {
      var href = link.getAttribute('href') || '';
      var linkPage = href.split('/').pop();
      if (linkPage === page || (page === '' && linkPage === 'index.html')) {
        link.classList.add('active');
      }
    });
  })();

  /* ── 4. Back-to-Top Button ────────────────────────────────── */
  var backBtn = $('.back-to-top');
  if (backBtn) {
    function updateBackBtn() {
      if (window.scrollY > 300) {
        backBtn.classList.add('visible');
      } else {
        backBtn.classList.remove('visible');
      }
    }
    updateBackBtn();
    window.addEventListener('scroll', updateBackBtn, { passive: true });
    backBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── 5. Cookie Notice ─────────────────────────────────────── */
  var cookieBanner = $('.cookie-banner');
  var cookieBtn = $('.cookie-btn');
  if (cookieBanner) {
    if (!localStorage.getItem('kj_cookie_ok')) {
      setTimeout(function () {
        cookieBanner.classList.add('visible');
      }, 1200);
    }
    if (cookieBtn) {
      cookieBtn.addEventListener('click', function () {
        cookieBanner.classList.remove('visible');
        setTimeout(function () {
          cookieBanner.style.display = 'none';
        }, 400);
        localStorage.setItem('kj_cookie_ok', '1');
      });
    }
  }

  /* ── 6. Testimonial Carousel (mobile) ────────────────────── */
  (function () {
    var track = $('.testimonials-track');
    var dotsContainer = $('.carousel-dots');
    if (!track || !dotsContainer) return;

    var cards = $$('.testimonial-card', track);
    if (cards.length < 2) return;

    var current = 0;
    var startX = 0;
    var isDragging = false;

    // Build dots
    cards.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Slide ' + (i + 1));
      dot.addEventListener('click', function () { goTo(i); });
      dotsContainer.appendChild(dot);
    });

    function goTo(idx) {
      current = (idx + cards.length) % cards.length;
      // On mobile, show one card at a time
      if (window.innerWidth <= 768) {
        cards.forEach(function (c, i) {
          c.style.display = i === current ? 'block' : 'none';
        });
        $$('.carousel-dot', dotsContainer).forEach(function (d, i) {
          d.classList.toggle('active', i === current);
        });
      }
    }

    function applyMobile() {
      if (window.innerWidth <= 768) {
        goTo(current);
      } else {
        cards.forEach(function (c) { c.style.display = ''; });
      }
    }

    applyMobile();
    window.addEventListener('resize', applyMobile);

    // Touch/swipe support
    track.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });

    track.addEventListener('touchend', function (e) {
      if (!isDragging) return;
      var diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        goTo(diff > 0 ? current + 1 : current - 1);
      }
      isDragging = false;
    }, { passive: true });
  })();

  /* ── 7. Pricing Toggle ────────────────────────────────────── */
  (function () {
    var toggle = $('.toggle-switch');
    var monthlyLabel = $('.toggle-label[data-period="monthly"]');
    var annualLabel = $('.toggle-label[data-period="annual"]');
    var priceEl = $('.premium-price');
    var periodEl = $('.premium-period');
    if (!toggle) return;

    var isAnnual = false;

    function updatePricing() {
      if (isAnnual) {
        toggle.classList.add('annual');
        if (monthlyLabel) monthlyLabel.classList.remove('active');
        if (annualLabel) annualLabel.classList.add('active');
        if (priceEl) priceEl.innerHTML = '<sup>$</sup>35.99';
        if (periodEl) periodEl.textContent = '/ year  (save 40%)';
      } else {
        toggle.classList.remove('annual');
        if (monthlyLabel) monthlyLabel.classList.add('active');
        if (annualLabel) annualLabel.classList.remove('active');
        if (priceEl) priceEl.innerHTML = '<sup>$</sup>4.99';
        if (periodEl) periodEl.textContent = '/ month';
      }
    }

    toggle.addEventListener('click', function () {
      isAnnual = !isAnnual;
      updatePricing();
    });

    // Also clickable labels
    [monthlyLabel, annualLabel].forEach(function (lbl) {
      if (!lbl) return;
      lbl.addEventListener('click', function () {
        isAnnual = lbl.dataset.period === 'annual';
        updatePricing();
      });
    });

    updatePricing();
  })();

  /* ── 8. FAQ Accordion ─────────────────────────────────────── */
  (function () {
    var items = $$('.faq-item');
    items.forEach(function (item) {
      var btn = $('.faq-question', item);
      if (!btn) return;
      btn.addEventListener('click', function () {
        var alreadyOpen = item.classList.contains('open');
        // Close all
        items.forEach(function (i) { i.classList.remove('open'); });
        // Toggle current
        if (!alreadyOpen) {
          item.classList.add('open');
        }
      });
    });
  })();

  /* ── Contact Form — client-side feedback ─────────────────── */
  (function () {
    var form = $('.contact-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var success = $('.form-success');
      form.style.display = 'none';
      if (success) success.style.display = 'block';
    });
  })();

})();
