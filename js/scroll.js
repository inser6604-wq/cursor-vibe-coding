/**
 * Scroll animations — fade-up reveal & parallax
 */
(function () {
  'use strict';

  const revealElements = document.querySelectorAll('.reveal');
  const header = document.getElementById('header');
  const heroBg = document.querySelector('.hero__bg');

  /* Intersection Observer — fade-up */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* Header scroll state */
  let lastScroll = 0;

  function onScroll() {
    const scrollY = window.scrollY;

    if (header) {
      header.classList.toggle('header--scrolled', scrollY > 60);
    }

    /* Hero parallax */
    if (heroBg && scrollY < window.innerHeight) {
      const offset = scrollY * 0.35;
      heroBg.style.transform = `translateY(${offset}px)`;
    }

    lastScroll = scrollY;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
