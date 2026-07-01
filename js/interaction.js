/**
 * UI interactions — mobile menu, gallery, card hovers
 */
(function () {
  'use strict';

  /* Mobile menu */
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');

  if (menuToggle && mobileNav) {
    function setMenuOpen(open) {
      menuToggle.setAttribute('aria-expanded', String(open));
      mobileNav.hidden = !open;
      document.body.style.overflow = open ? 'hidden' : '';
    }

    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      setMenuOpen(!expanded);
    });

    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenuOpen(false));
    });
  }

  /* Gallery carousel */
  const galleryTrack = document.getElementById('galleryTrack');
  const galleryPrev = document.getElementById('galleryPrev');
  const galleryNext = document.getElementById('galleryNext');

  if (galleryTrack && galleryPrev && galleryNext) {
    const scrollAmount = () => {
      const item = galleryTrack.querySelector('.gallery__item');
      return item ? item.offsetWidth + 20 : 400;
    };

    galleryPrev.addEventListener('click', () => {
      galleryTrack.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
    });

    galleryNext.addEventListener('click', () => {
      galleryTrack.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
    });
  }

  /* Smooth anchor scroll offset for fixed header */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      const headerH = document.getElementById('header')?.offsetHeight || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* Set minimum departure date to today */
  const departureInput = document.getElementById('departureDate');
  if (departureInput) {
    const today = new Date().toISOString().split('T')[0];
    departureInput.setAttribute('min', today);
  }
})();
