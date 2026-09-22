// Keep the primary navigation consistent across the homepage, archives and nested pages.
// URLs resolve against <base>, so both /portfolio/ on GitHub Pages and a root deployment work.
(function () {
  'use strict';
  var nav = document.querySelector('#primary-nav');
  if (!nav) return;
  // One stylesheet owns the entire header, including the light-theme override.
  // Load it after the page's existing CSS; the file is versioned for cache refresh.
  if (!document.querySelector('link[data-site-navigation]')) {
    var stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = new URL('css/site-navigation.css?v=20260922-1', document.baseURI).href;
    stylesheet.setAttribute('data-site-navigation', 'true');
    document.head.appendChild(stylesheet);
  }
  var list = nav.querySelector('ul');
  var button = nav.querySelector('.nav-resume-btn');
  var logo = document.querySelector('.site-header .nav-logo');
  var root = document.baseURI;
  var destination = function (path) { return new URL(path, root).href; };
  var relative = window.location.pathname.slice(new URL(root).pathname.length).replace(/^\/+/, '');
  var active = relative === '' || relative === 'index.html' ? 'Home' : relative.indexOf('work/') === 0 || relative === 'work' ? 'Work' : relative.indexOf('experience/') === 0 || relative === 'experience' ? 'Experience' : '';
  var items = [ ['Home', ''], ['Work', 'work/'], ['Experience', 'experience/'] ];

  function syncNavigation() {
    if (logo && logo.href !== destination('')) logo.href = destination('');
    if (list) {
      var links = Array.prototype.slice.call(list.querySelectorAll('a'));
      var correct = links.length === items.length && links.every(function (link, index) {
        var item = items[index];
        return link.textContent.trim() === item[0] && link.href === destination(item[1]) &&
          (link.getAttribute('aria-current') === 'page') === (item[0] === active);
      });
      if (!correct) {
        var fragment = document.createDocumentFragment();
        items.forEach(function (item) {
          var li = document.createElement('li');
          var anchor = document.createElement('a');
          anchor.href = destination(item[1]);
          anchor.textContent = item[0];
          if (item[0] === active) anchor.setAttribute('aria-current', 'page');
          li.appendChild(anchor);
          fragment.appendChild(li);
        });
        list.replaceChildren(fragment);
      }
    }
    if (button) {
      if (button.href !== destination('contact/')) button.href = destination('contact/');
      if (button.textContent.trim() !== 'Get in contact →') {
        button.replaceChildren(document.createTextNode('Get in contact '));
        var arrow = document.createElement('span');
        arrow.setAttribute('aria-hidden', 'true');
        arrow.textContent = '→';
        button.appendChild(arrow);
      }
      if (relative === 'contact/' || relative === 'contact' || relative === 'contact/index.html') {
        button.setAttribute('aria-current', 'page');
      } else {
        button.removeAttribute('aria-current');
      }
    }
  }

  syncNavigation();
  // Other homepage scripts render a new menu after nav.js; restore the shared menu.
  if (list) {
    var observer = new MutationObserver(syncNavigation);
    observer.observe(list, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['href', 'aria-current'] });
  }
})();

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

  // Delegate clicks: composition scripts can replace the anchor elements later.
  links.addEventListener('click', function (event) {
    if (event.target.closest('a[href]') && window.matchMedia('(max-width: 860px)').matches && links.getAttribute('data-open') === 'true') closeMenu();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 860 && links.getAttribute('data-open') === 'true') closeMenu();
  }, { passive: true });
})();

// Homepage-only alignment patch. The site has returned to its original plain
// background; this stylesheet only stabilizes the hero and mobile navigation.
(function () {
  if (!document.body.classList.contains('portfolio-redesign')) return;
  if (document.querySelector('link[data-homepage-layout-fix]')) return;
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'css/homepage-layout-fix.css?v=20260914-4';
  link.setAttribute('data-homepage-layout-fix', 'true');
  document.head.appendChild(link);
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
    { selector: '#email', src: 'js/email-fan-carousel.js?v=20260912-stack2' }
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