(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    if (!window.gsap || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var plugins = [];
    if (window.ScrollTrigger) plugins.push(window.ScrollTrigger);
    if (window.Draggable) plugins.push(window.Draggable);
    if (plugins.length) window.gsap.registerPlugin.apply(window.gsap, plugins);

    if (window.ScrollTrigger) {
      window.gsap.utils.toArray('.portfolio-sections > section').forEach(function (section) {
        window.gsap.fromTo(section, { opacity: .72, y: 28 }, {
          opacity: 1, y: 0, duration: .72, ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 88%', once: true }
        });
      });
      window.gsap.from('.footer-cta-copy > *', { opacity: 0, y: 18, duration: .62, stagger: .08, ease: 'power2.out', scrollTrigger: { trigger: '.site-footer', start: 'top 82%', once: true } });
    }

    if (window.Draggable) {
      document.querySelectorAll('.media-row-viewport').forEach(function (viewport) {
        window.Draggable.create(viewport, { type: 'scroll', edgeResistance: .82, allowNativeTouchScrolling: true, cursor: 'grab', activeCursor: 'grabbing' });
      });
    }
  });
}());
