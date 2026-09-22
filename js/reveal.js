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
  // Opt in only composition home, experience and standalone work archive.
  // All project detail pages and Contact retain their existing presentation.
  if (document.querySelector('.portfolio-hero') || /\/experience\/?$/.test(location.pathname)) {
    var script = document.createElement('script');
    script.src = new URL('js/composition.js?v=20260922-2', document.baseURI).href;
    document.body.appendChild(script);
    if (document.querySelector('.portfolio-hero')) {
      var symbols = document.createElement('script');
      symbols.src = new URL('js/composition-icons.js?v=20260922-2', document.baseURI).href;
      document.body.appendChild(symbols);
    }
  } else if (/\/work\/?$/.test(location.pathname)) {
    document.body.classList.add('composition-work');
    var stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = new URL('css/composition-work.css?v=20260922-2',document.baseURI).href;
    document.head.appendChild(stylesheet);
  }
})();
