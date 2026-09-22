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
  var isHome = !!document.querySelector('.portfolio-hero');
  var isExperience = /\/experience\/?$/.test(location.pathname);
  if (isHome || isExperience) {
    if (isExperience && !document.querySelector('link[href*="bootstrap-icons"]')) {
      var icons=document.createElement('link');icons.rel='stylesheet';icons.href='https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css';document.head.appendChild(icons);
    }
    var script = document.createElement('script');
    script.src = new URL('js/composition.js?v=20260922-4', document.baseURI).href;
    if (isHome) script.onload = function () {
      ['js/composition-icons.js','js/composition-workflow-sync.js'].forEach(function(path) {
        var extra=document.createElement('script');extra.src=new URL(path+'?v=20260922-4',document.baseURI).href;document.body.appendChild(extra);
      });
    };
    document.body.appendChild(script);
  } else if (/\/work\/?$/.test(location.pathname)) {
    document.body.classList.add('composition-work');
    var stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = new URL('css/composition-work.css?v=20260922-4',document.baseURI).href;
    document.head.appendChild(stylesheet);
  }
})();
