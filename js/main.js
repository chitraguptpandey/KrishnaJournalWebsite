/* ============================================================
   Krishna Journal — main.js
   Handles: sticky navbar, hamburger menu, back-to-top,
   cookie notice, testimonials carousel, pricing toggle,
   FAQ accordion, active nav link highlighting
   ============================================================ */

(function () {
  'use strict';

  /* ── Sticky Navbar ─────────────────────────────────────── */
  const navbar = document.querySelector('.navbar');

  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // run once on load

  /* ── Mobile Hamburger Menu ─────────────────────────────── */
  const hamburger = document.querySelector('.navbar__hamburger');
  const navLinks = document.querySelector('.navbar__links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when any nav link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── Back to Top Button ────────────────────────────────── */
  const backToTopBtn = document.querySelector('.back-to-top');

  function handleBackToTopVisibility() {
    if (!backToTopBtn) return;
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  window.addEventListener('scroll', handleBackToTopVisibility, { passive: true });
  handleBackToTopVisibility();

  /* ── Cookie / Analytics Notice Banner ─────────────────── */
  const cookieNotice = document.querySelector('.cookie-notice');
  const cookieBtn = document.querySelector('.cookie-notice__btn');

  if (cookieNotice) {
    if (localStorage.getItem('cookieAccepted') === 'true') {
      cookieNotice.classList.add('hidden');
    }

    if (cookieBtn) {
      cookieBtn.addEventListener('click', function () {
        localStorage.setItem('cookieAccepted', 'true');
        cookieNotice.classList.add('hidden');
      });
    }
  }

  /* ── Testimonials Carousel ─────────────────────────────── */
  const carousel = document.querySelector('.carousel');

  if (carousel) {
    const slides = carousel.querySelectorAll('.carousel__slide');
    const dots = carousel.querySelectorAll('.carousel__dot');
    let currentSlide = 0;
    let autoRotateTimer = null;

    function showSlide(index) {
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
      currentSlide = index;
    }

    function nextSlide() {
      showSlide((currentSlide + 1) % slides.length);
    }

    function startAutoRotate() {
      autoRotateTimer = setInterval(nextSlide, 5000);
    }

    function stopAutoRotate() {
      clearInterval(autoRotateTimer);
    }

    // Dot click handlers
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        stopAutoRotate();
        showSlide(i);
        startAutoRotate();
      });
    });

    // Pause on hover
    carousel.addEventListener('mouseenter', stopAutoRotate);
    carousel.addEventListener('mouseleave', startAutoRotate);

    // Init
    showSlide(0);
    startAutoRotate();
  }

  /* ── Pricing Toggle ────────────────────────────────────── */
  const pricingToggle = document.querySelector('.pricing__toggle');

  if (pricingToggle) {
    const toggleBtns = pricingToggle.querySelectorAll('.pricing__toggle-btn');
    const monthlyEls = document.querySelectorAll('.price-monthly');
    const yearlyEls = document.querySelectorAll('.price-yearly');

    function setPricing(mode) {
      toggleBtns.forEach(function (btn) {
        btn.classList.toggle('active', btn.dataset.pricing === mode);
      });

      if (mode === 'monthly') {
        monthlyEls.forEach(function (el) { el.classList.remove('hidden'); });
        yearlyEls.forEach(function (el) { el.classList.add('hidden'); });
      } else {
        yearlyEls.forEach(function (el) { el.classList.remove('hidden'); });
        monthlyEls.forEach(function (el) { el.classList.add('hidden'); });
      }
    }

    toggleBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        setPricing(btn.dataset.pricing);
      });
    });

    setPricing('monthly'); // default
  }

  /* ── FAQ Accordion ─────────────────────────────────────── */
  const faqItems = document.querySelectorAll('.faq-item');

  if (faqItems.length > 0) {
    faqItems.forEach(function (item) {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');

      if (!question || !answer) return;

      question.addEventListener('click', function () {
        const isOpen = question.classList.contains('open');

        // Close all other items
        faqItems.forEach(function (otherItem) {
          const otherQ = otherItem.querySelector('.faq-question');
          const otherA = otherItem.querySelector('.faq-answer');
          if (otherItem !== item && otherQ && otherA) {
            otherQ.classList.remove('open');
            otherA.style.maxHeight = null;
            otherQ.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current item
        if (isOpen) {
          question.classList.remove('open');
          answer.style.maxHeight = null;
          question.setAttribute('aria-expanded', 'false');
        } else {
          question.classList.add('open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          question.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ── Active Nav Link ───────────────────────────────────── */
  function setActiveNavLink() {
    const pathname = window.location.pathname;
    const filename = pathname.split('/').pop() || 'index.html';

    const navAnchors = document.querySelectorAll('.navbar__links a');
    navAnchors.forEach(function (anchor) {
      const href = anchor.getAttribute('href') || '';
      const hrefFile = href.split('/').pop();

      // Normalise: empty or index.html both match root
      const isIndex = (filename === '' || filename === 'index.html') &&
                      (hrefFile === '' || hrefFile === 'index.html');
      const isMatch = !isIndex && hrefFile !== '' && hrefFile === filename;

      anchor.classList.toggle('active', isIndex || isMatch);
    });
  }

  setActiveNavLink();

  /* ── Smooth scroll for "See How It Works" button ──────── */
  document.querySelectorAll('[data-scroll-to]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = btn.dataset.scrollTo;
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

})();
