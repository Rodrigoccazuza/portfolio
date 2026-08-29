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

  // Keep the Resource Center card current by previewing the live website
  // instead of relying on an outdated static screenshot asset.
  function updateResourceCenterPreview() {
    var project = document.querySelector('.website-layer[data-project-id="resource-center"]');
    if (!project || project.dataset.livePreview === 'ready') return false;

    var media = project.querySelector('.project-media');
    if (!media) return false;

    project.dataset.livePreview = 'ready';
    media.classList.add('resource-center-live-preview');
    media.textContent = '';

    var iframe = document.createElement('iframe');
    iframe.className = 'resource-center-preview-frame';
    iframe.src = 'https://rodrigoccazuza.github.io/VibeCoder_resourceCenter/';
    iframe.title = 'Live preview of VibeCoder Resource Center';
    iframe.loading = 'lazy';
    iframe.tabIndex = -1;
    iframe.setAttribute('aria-hidden', 'true');
    media.appendChild(iframe);

    if (!document.getElementById('resource-center-preview-styles')) {
      var style = document.createElement('style');
      style.id = 'resource-center-preview-styles';
      style.textContent = [
        '.resource-center-live-preview{position:relative;aspect-ratio:16/10;overflow:hidden;background:#0d0d0d}',
        '.resource-center-live-preview::before{display:none!important}',
        '.resource-center-preview-frame{position:absolute;inset:0;width:100%;height:100%;border:0;background:#0d0d0d;pointer-events:none}',
        '@media(max-width:520px){.resource-center-live-preview{aspect-ratio:4/3}}'
      ].join('');
      document.head.appendChild(style);
    }

    return true;
  }

  if (!updateResourceCenterPreview() && window.MutationObserver) {
    var work = document.getElementById('work');
    if (work) {
      var previewObserver = new MutationObserver(function () {
        if (updateResourceCenterPreview()) previewObserver.disconnect();
      });
      previewObserver.observe(work, { childList: true, subtree: true });
    }
  }
})();
