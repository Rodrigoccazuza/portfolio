// Lightweight, one-time reveal animation powered by IntersectionObserver.
(function () {
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && ('IntersectionObserver' in window)) {
    var selectors = [
      'main > section', '.card', '.expertise-row', '.process-grid li',
      '.tool-grid-item', '.review-card', '.timeline-item', '.home-timeline li',
      '.brand-guideline-block', '.experience-project-grid article',
      '.portfolio-card', '.campaign-card', '.portfolio-section-header'
    ];
    var items = Array.prototype.slice.call(document.querySelectorAll(selectors.join(',')));
    if (items.length) {
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
    }
  }
  // This existing shared entrypoint is already referenced by home and experience.
  // Opt in only these two pages; Contact, main and new_portfolio are unchanged.
  if (document.querySelector('.portfolio-hero') || /\/experience\/?$/.test(location.pathname)) {
    var script = document.createElement('script');
    script.src = new URL('js/composition.js?v=20260922-2', document.baseURI).href;
    script.defer = true;
    document.body.appendChild(script);
  }
})();
