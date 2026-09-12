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
  });
})();

// Keep the homepage enhancement modular instead of coupling it to navigation logic.
// The corridor script watches for the dynamically rendered Behind the Designs gallery.
(function () {
  if (!document.getElementById('behind-designs-gallery')) return;
  var script = document.createElement('script');
  script.src = 'js/behind-designs-corridor.js?v=20260912';
  script.defer = true;
  document.head.appendChild(script);
})();
