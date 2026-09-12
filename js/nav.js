// Mobile navigation: accessible open/close, focus trap, Escape to close.
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  var scrim = document.querySelector('.nav-scrim');
  if (!toggle || !links) return;

  var focusablesSelector = 'a[href], button:not([disabled])';
  var lastFocused = null;

  function openMenu() {
    lastFocused = document.activeElement;
    links.setAttribute('data-open', 'true');
    if (scrim) scrim.setAttribute('data-open', 'true');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
    var first = links.querySelector(focusablesSelector);
    if (first) first.focus();
    document.addEventListener('keydown', onKeydown);
  }

  function closeMenu() {
    links.removeAttribute('data-open');
    if (scrim) scrim.removeAttribute('data-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
    document.removeEventListener('keydown', onKeydown);
    if (lastFocused) lastFocused.focus();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      closeMenu();
      return;
    }
    if (e.key === 'Tab') {
      var focusables = Array.prototype.slice.call(links.querySelectorAll(focusablesSelector));
      if (!focusables.length) return;
      var firstEl = focusables[0];
      var lastEl = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }
  }

  toggle.addEventListener('click', function () {
    var isOpen = links.getAttribute('data-open') === 'true';
    if (isOpen) { closeMenu(); } else { openMenu(); }
  });

  if (scrim) scrim.addEventListener('click', closeMenu);

  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      if (window.matchMedia('(max-width: 860px)').matches) closeMenu();
    });
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 860 && links.getAttribute('data-open') === 'true') closeMenu();
  }, { passive: true });
})();

// Keep homepage enhancements modular and only parse below-fold effects shortly
// before their section reaches the viewport.
(function () {
  if (!document.getElementById('behind-designs-gallery')) return;

  var loaded = {};
  function loadScript(src) {
    if (loaded[src]) return;
    loaded[src] = true;
    var script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.head.appendChild(script);
  }

  // This section is directly below the hero/toolkit, so keep its effect ready.
  loadScript('js/behind-designs-corridor.js?v=20260912');

  var enhancements = [
    { selector: '#websites', src: 'js/website-aurora-cards.js?v=20260912' },
    { selector: '#design-systems', src: 'js/design-system-scroll-stack.js?v=20260912' },
    { selector: '#email', src: 'js/email-fan-carousel.js?v=20260912' }
  ];

  function watchEnhancement(item) {
    var target = document.querySelector(item.selector);
    if (!target) return false;
    if (!('IntersectionObserver' in window)) {
      loadScript(item.src);
      return true;
    }
    var observer = new IntersectionObserver(function (entries) {
      if (!entries.some(function (entry) { return entry.isIntersecting; })) return;
      observer.disconnect();
      loadScript(item.src);
    }, { rootMargin: '1200px 0px', threshold: 0.01 });
    observer.observe(target);
    return true;
  }

  var pending = enhancements.filter(function (item) { return !watchEnhancement(item); });
  if (!pending.length) return;

  // Portfolio sections are data-rendered. Observe only until those targets exist.
  var mountObserver = new MutationObserver(function () {
    pending = pending.filter(function (item) { return !watchEnhancement(item); });
    if (!pending.length) mountObserver.disconnect();
  });
  mountObserver.observe(document.getElementById('work') || document.body, { childList: true, subtree: true });
}());
