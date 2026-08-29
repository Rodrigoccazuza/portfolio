(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function injectRailStyles() {
      if (document.getElementById('portfolio-rail-fixes')) return;
      var style = document.createElement('style');
      style.id = 'portfolio-rail-fixes';
      style.textContent = [
        '.media-row-control{display:grid;place-items:center;width:2.9rem;height:2.9rem;min-width:2.9rem;min-height:2.9rem;padding:0;border:1px solid rgba(102,212,135,.7);border-radius:999px;background:var(--color-green);color:#000;cursor:pointer;box-shadow:0 8px 24px rgba(102,212,135,.16);transition:transform 180ms ease,background 180ms ease,border-color 180ms ease,box-shadow 180ms ease,color 180ms ease;-webkit-tap-highlight-color:transparent;touch-action:manipulation}',
        '.media-row-control i{font-size:1.15rem;line-height:1;pointer-events:none}',
        '.media-row-control:hover,.media-row-control:focus-visible{transform:translateY(-2px) scale(1.07);background:#fff;border-color:#fff;color:#000;box-shadow:0 12px 30px rgba(102,212,135,.28)}',
        '.media-row-control:active,.media-row-control.is-active{transform:scale(.94);background:var(--color-green);border-color:var(--color-green);color:#000;box-shadow:0 0 0 5px var(--color-green-tint)}',
        '.media-row-viewport{overscroll-behavior-x:contain;-webkit-overflow-scrolling:touch;scroll-behavior:smooth}',
        '.media-row-track{align-items:flex-start}',
        '.media-rail-card.is-video-card .project-media{aspect-ratio:9 / 16;height:auto;background:#000;overflow:hidden}',
        '.media-rail-card.is-video-card video{display:block;width:100%;height:100%;object-fit:contain;background:#000}',
        '.media-rail-card.is-video-card .media-rail-open{background:#000;overflow:hidden}',
        '@media(max-width:768px){.media-row-control{width:2.75rem;height:2.75rem;min-width:2.75rem;min-height:2.75rem}.media-row{grid-template-columns:2.75rem minmax(0,1fr) 2.75rem!important;gap:.65rem}}',
        '@media(max-width:520px){.media-row-control{width:2.65rem;height:2.65rem;min-width:2.65rem;min-height:2.65rem}.media-row{grid-template-columns:2.65rem minmax(0,1fr) 2.65rem!important;gap:.45rem}.media-rail-card.is-video-card{flex-basis:min(82%,19rem)}}'
      ].join('');
      document.head.appendChild(style);
    }

    function ensureBootstrapArrow(button, direction) {
      if (!button) return;
      var expectedClass = direction < 0 ? 'bi-arrow-left' : 'bi-arrow-right';
      var icon = button.querySelector('i');
      if (!icon || !icon.classList.contains(expectedClass)) {
        button.textContent = '';
        icon = document.createElement('i');
        icon.className = 'bi ' + expectedClass;
        icon.setAttribute('aria-hidden', 'true');
        button.appendChild(icon);
      }
    }

    function pulseControl(button) {
      if (!button) return;
      button.classList.add('is-active');
      window.setTimeout(function () { button.classList.remove('is-active'); }, 180);
    }

    function initMediaRailControls() {
      injectRailStyles();

      document.querySelectorAll('.media-row').forEach(function (row) {
        if (row.dataset.railControls === 'ready') return;
        var viewport = row.querySelector('.media-row-viewport');
        var previous = row.querySelector('.media-row-previous');
        var next = row.querySelector('.media-row-next');
        if (!viewport || !previous || !next) return;

        row.dataset.railControls = 'ready';
        ensureBootstrapArrow(previous, -1);
        ensureBootstrapArrow(next, 1);

        Array.prototype.forEach.call(row.querySelectorAll('.media-rail-card'), function (card) {
          if (card.querySelector('video')) card.classList.add('is-video-card');
        });

        function cards() {
          return Array.prototype.slice.call(viewport.querySelectorAll('.media-rail-card'));
        }

        function currentCardIndex(items) {
          if (!items.length) return 0;
          var left = viewport.scrollLeft;
          var bestIndex = 0;
          var bestDistance = Infinity;
          items.forEach(function (card, index) {
            var distance = Math.abs(card.offsetLeft - left);
            if (distance < bestDistance) {
              bestDistance = distance;
              bestIndex = index;
            }
          });
          return bestIndex;
        }

        function move(direction) {
          var items = cards();
          if (!items.length) return;

          var current = currentCardIndex(items);
          var targetIndex = current + direction;
          if (targetIndex >= items.length) targetIndex = 0;
          if (targetIndex < 0) targetIndex = items.length - 1;

          var target = items[targetIndex];
          var maximum = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
          var targetLeft = Math.max(0, Math.min(target.offsetLeft, maximum));

          if (typeof viewport.scrollTo === 'function') {
            viewport.scrollTo({ left: targetLeft, behavior: reduceMotion ? 'auto' : 'smooth' });
          } else {
            viewport.scrollLeft = targetLeft;
          }
        }

        previous.addEventListener('click', function (event) {
          event.preventDefault();
          event.stopPropagation();
          pulseControl(previous);
          move(-1);
        });

        next.addEventListener('click', function (event) {
          event.preventDefault();
          event.stopPropagation();
          pulseControl(next);
          move(1);
        });

        viewport.addEventListener('keydown', function (event) {
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            pulseControl(previous);
            move(-1);
          }
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            pulseControl(next);
            move(1);
          }
        });
      });
    }

    initMediaRailControls();

    var dynamicRootForRails = document.querySelector('.portfolio-sections');
    if (dynamicRootForRails && window.MutationObserver) {
      var railTimer;
      var railObserver = new MutationObserver(function () {
        window.clearTimeout(railTimer);
        railTimer = window.setTimeout(initMediaRailControls, 40);
      });
      railObserver.observe(dynamicRootForRails, { childList: true, subtree: true });
    }

    if (!window.gsap || reduceMotion) return;

    var gsap = window.gsap;
    var ScrollTrigger = window.ScrollTrigger;
    var Draggable = window.Draggable;
    var plugins = [];

    if (ScrollTrigger) plugins.push(ScrollTrigger);
    if (Draggable) plugins.push(Draggable);
    if (plugins.length) gsap.registerPlugin.apply(gsap, plugins);

    function reveal(targets, options) {
      if (!ScrollTrigger) return;
      var elements = gsap.utils.toArray(targets);
      if (!elements.length) return;

      options = options || {};
      elements.forEach(function (element, index) {
        if (element.dataset.gsapReveal === 'ready') return;
        element.dataset.gsapReveal = 'ready';

        gsap.fromTo(element, {
          autoAlpha: options.fromAlpha == null ? 0 : options.fromAlpha,
          y: options.y == null ? 34 : options.y,
          x: options.x || 0,
          scale: options.scale == null ? 1 : options.scale
        }, {
          autoAlpha: 1,
          y: 0,
          x: 0,
          scale: 1,
          duration: options.duration || 0.8,
          delay: options.delay ? options.delay * index : 0,
          ease: options.ease || 'power3.out',
          clearProps: 'transform,opacity,visibility',
          scrollTrigger: {
            trigger: element,
            start: options.start || 'top 88%',
            once: true
          }
        });
      });
    }

    function staggerWithin(containerSelector, childSelector, options) {
      if (!ScrollTrigger) return;
      gsap.utils.toArray(containerSelector).forEach(function (container) {
        if (container.dataset.gsapStagger === 'ready') return;
        var children = container.querySelectorAll(childSelector);
        if (!children.length) return;
        container.dataset.gsapStagger = 'ready';

        gsap.fromTo(children, {
          autoAlpha: 0,
          y: (options && options.y) || 24,
          scale: (options && options.scale) || 1
        }, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: (options && options.duration) || 0.68,
          stagger: (options && options.stagger) || 0.09,
          ease: (options && options.ease) || 'power3.out',
          clearProps: 'transform,opacity,visibility',
          scrollTrigger: {
            trigger: container,
            start: (options && options.start) || 'top 86%',
            once: true
          }
        });
      });
    }

    function initHero() {
      var hero = document.querySelector('.portfolio-hero');
      if (!hero) return;

      var intro = hero.querySelectorAll('.hero-kicker, #hero-title > span');
      var statement = hero.querySelectorAll('.hero-statement > *');
      var services = hero.querySelectorAll('.hero-services > div');

      var timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      timeline
        .fromTo(intro, { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, duration: 0.82, stagger: 0.08 })
        .fromTo(statement, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.68, stagger: 0.08 }, '-=0.45')
        .fromTo(services, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.58, stagger: 0.07 }, '-=0.34');

      if (ScrollTrigger) {
        var heroBackground = hero.querySelector('.hero-background');
        if (heroBackground) {
          gsap.to(heroBackground, {
            yPercent: 8,
            scale: 1.035,
            ease: 'none',
            scrollTrigger: {
              trigger: hero,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.6
            }
          });
        }
      }
    }

    function initPageReveals() {
      reveal('.toolkit-marquee', { y: 18, duration: 0.7, start: 'top 92%' });
      reveal('.behind-designs-heading > *', { y: 28, duration: 0.72, delay: 0.045 });
      reveal('.behind-socials a', { y: 16, scale: 0.96, duration: 0.58, delay: 0.035, start: 'top 94%' });
      reveal('.footer-portrait', { x: 36, y: 0, scale: 0.98, duration: 0.9, start: 'top 88%' });
      reveal('.footer-panel-intro, .footer-columns > *, .footer-bottom > *', { y: 22, duration: 0.7, delay: 0.025, start: 'top 92%' });

      staggerWithin('.behind-designs-gallery', ':scope > *', {
        y: 30,
        scale: 0.985,
        duration: 0.74,
        stagger: 0.06,
        start: 'top 90%'
      });

      gsap.utils.toArray('.portfolio-sections > section').forEach(function (section) {
        if (section.dataset.gsapSection === 'ready') return;
        section.dataset.gsapSection = 'ready';

        var heading = section.querySelectorAll('.eyebrow, h2, h3, .section-title, .section-intro, .section-copy');
        if (heading.length) {
          gsap.fromTo(heading, { autoAlpha: 0, y: 28 }, {
            autoAlpha: 1,
            y: 0,
            duration: 0.74,
            stagger: 0.08,
            ease: 'power3.out',
            clearProps: 'transform,opacity,visibility',
            scrollTrigger: { trigger: section, start: 'top 84%', once: true }
          });
        } else {
          reveal(section, { y: 30, fromAlpha: 0, duration: 0.78, start: 'top 86%' });
        }

        var cards = section.querySelectorAll('.project-card, .media-card, .website-card, .campaign-card, .design-card, .portfolio-card, .media-row-item, article');
        if (cards.length) {
          gsap.fromTo(cards, { autoAlpha: 0, y: 34, scale: 0.985 }, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.72,
            stagger: 0.075,
            ease: 'power3.out',
            clearProps: 'transform,opacity,visibility',
            scrollTrigger: { trigger: section, start: 'top 78%', once: true }
          });
        }
      });

      var footerCopy = document.querySelectorAll('.footer-cta-copy > *');
      if (footerCopy.length && ScrollTrigger) {
        gsap.fromTo(footerCopy, { autoAlpha: 0, y: 24 }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.68,
          stagger: 0.09,
          ease: 'power3.out',
          clearProps: 'transform,opacity,visibility',
          scrollTrigger: { trigger: '.site-footer', start: 'top 82%', once: true }
        });
      }
    }

    function initMicroInteractions() {
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

      document.querySelectorAll('.btn, .behind-socials a').forEach(function (element) {
        element.addEventListener('mouseenter', function () {
          gsap.to(element, { y: -3, scale: 1.018, duration: 0.22, ease: 'power2.out', overwrite: true });
        });
        element.addEventListener('mouseleave', function () {
          gsap.to(element, { y: 0, scale: 1, duration: 0.28, ease: 'power2.out', overwrite: true });
        });
      });
    }

    function initDraggableRows() {
      if (!Draggable) return;
      document.querySelectorAll('.media-row-viewport').forEach(function (viewport) {
        if (viewport.dataset.gsapDrag === 'ready') return;
        viewport.dataset.gsapDrag = 'ready';
        Draggable.create(viewport, {
          type: 'scroll',
          edgeResistance: 0.82,
          allowNativeTouchScrolling: true,
          cursor: 'grab',
          activeCursor: 'grabbing'
        });
      });
    }

    function refreshDynamicMotion() {
      initPageReveals();
      initDraggableRows();
      initMediaRailControls();
      if (ScrollTrigger) ScrollTrigger.refresh();
    }

    initHero();
    refreshDynamicMotion();
    initMicroInteractions();

    var dynamicRoot = document.querySelector('.portfolio-sections');
    if (dynamicRoot && window.MutationObserver) {
      var refreshTimer;
      var observer = new MutationObserver(function () {
        window.clearTimeout(refreshTimer);
        refreshTimer = window.setTimeout(refreshDynamicMotion, 60);
      });
      observer.observe(dynamicRoot, { childList: true, subtree: true });
    }

    window.addEventListener('load', function () {
      initMediaRailControls();
      if (ScrollTrigger) ScrollTrigger.refresh();
    }, { once: true });
  });
}());
