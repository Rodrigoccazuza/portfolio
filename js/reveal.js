// Lightweight, one-time reveal animation powered by IntersectionObserver.
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;

  var selectors = [
    'main > section', '.card', '.expertise-row', '.process-grid li',
    '.tool-grid-item', '.review-card', '.timeline-item', '.home-timeline li',
    '.brand-guideline-block', '.experience-project-grid article'
  ];
  var items = Array.prototype.slice.call(document.querySelectorAll(selectors.join(',')));
  if (!items.length) return;

  document.documentElement.classList.add('reveal-ready');
  items.forEach(function (item, index) {
    item.classList.add('reveal-item');
    item.style.setProperty('--reveal-delay', Math.min(index % 4, 3) * 55 + 'ms');
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -7% 0px', threshold: 0.08 });

  items.forEach(function (item) { observer.observe(item); });
})();
