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

// Sitewide footer: use the Contact-page CTA + green footer as the single footer system.
(function () {
  'use strict';

  var root = document.baseURI;
  var url = function (path) { return new URL(path, root).href; };

  function footerMarkup() {
    return '' +
      '<footer class="site-footer" id="sitewide-footer">' +
        '<div class="container footer-cta-wrap">' +
          '<div class="footer-cta">' +
            '<div class="footer-cta-copy">' +
              '<p class="eyebrow">Have a project in mind?</p>' +
              '<h2>Ready to bring<br>your vision to <span class="accent-italic">life?</span></h2>' +
              '<p>Let\'s turn your next campaign, brand system, video, or website into something clear, useful, and memorable.</p>' +
              '<a class="btn btn-primary" href="' + url('contact/') + '">Start a project <span aria-hidden="true">→</span></a>' +
            '</div>' +
            '<img class="footer-portrait" src="' + url('images/site/footer-portrait.png') + '" alt="Rodrigo Cazuza wearing sunglasses and a purple shirt" width="1536" height="1024" loading="lazy" decoding="async">' +
          '</div>' +
        '</div>' +
        '<div class="container footer-panel">' +
          '<div class="footer-panel-intro">' +
            '<p class="footer-identity">Rodrigo<br>Cazuza.</p>' +
            '<p>Multimedia design and front-end development shaped around strategy, story, and real-world production.</p>' +
          '</div>' +
          '<div class="footer-columns">' +
            '<div><h3>Services</h3><ul class="footer-links">' +
              '<li><a href="' + url('work/brand-systems/') + '">Brand systems</a></li>' +
              '<li><a href="' + url('work/email-design/') + '">Email design</a></li>' +
              '<li><a href="' + url('work/meta-ad-creatives/') + '">Meta ad creative</a></li>' +
              '<li><a href="' + url('work/video/') + '">Video production</a></li>' +
              '<li><a href="' + url('work/web-design/') + '">Web design</a></li>' +
            '</ul></div>' +
            '<nav aria-label="Footer"><h3>Explore</h3><ul class="footer-links">' +
              '<li><a href="' + url('work/') + '">Work</a></li>' +
              '<li><a href="' + url('experience/') + '">Experience</a></li>' +
              '<li><a href="' + url('resume/') + '">Résumé</a></li>' +
              '<li><a href="' + url('contact/') + '">Contact</a></li>' +
            '</ul></nav>' +
            '<div><h3>Let\'s connect</h3>' +
              '<a class="footer-email" href="mailto:visualdesigner@rodrigocazuza.com">visualdesigner@rodrigocazuza.com</a>' +
              '<ul class="social-row">' +
                '<li><a href="https://github.com/Rodrigoccazuza" target="_blank" rel="noopener noreferrer">GitHub</a></li>' +
                '<li><a href="https://www.linkedin.com/in/rodrigocazuza/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>' +
                '<li><a href="https://www.youtube.com/@Drigoverse" target="_blank" rel="noopener noreferrer">YouTube</a></li>' +
              '</ul>' +
            '</div>' +
            '<div><h3>Location</h3><p>New York City</p><p>Available for freelance and collaborative projects.</p></div>' +
          '</div>' +
        '</div>' +
        '<div class="container footer-bottom">' +
          '<p>&copy; 2026 Rodrigo Cazuza. All rights reserved.</p>' +
          '<a href="#main-content">Back to top <span aria-hidden="true">↑</span></a>' +
        '</div>' +
      '</footer>';
  }

  function installFooter() {
    if (document.getElementById('sitewide-footer')) return;

    var existing = document.querySelector('.site-footer');
    var campaignMount = document.getElementById('campaign-footer');
    var wrapper = document.createElement('div');
    wrapper.innerHTML = footerMarkup();
    var footer = wrapper.firstElementChild;

    if (existing) {
      existing.replaceWith(footer);
    } else if (campaignMount) {
      campaignMount.replaceChildren(footer);
    } else {
      document.body.appendChild(footer);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installFooter, { once: true });
  } else {
    installFooter();
  }
}());
