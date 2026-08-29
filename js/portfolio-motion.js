(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function injectRailStyles() {
      if (document.getElementById('portfolio-rail-fixes')) return;
      var style = document.createElement('style');
      style.id = 'portfolio-rail-fixes';
      style.textContent = [
        '.media-row{position:relative;grid-template-columns:minmax(0,1fr)!important;gap:0!important}',
        '.media-row-control{display:none!important}',
        '.media-row-viewport{position:relative;z-index:1;overflow-x:auto;overscroll-behavior-x:contain;-webkit-overflow-scrolling:touch;scroll-snap-type:x mandatory;scrollbar-width:none}',
        '.media-row-viewport::-webkit-scrollbar{display:none}',
        '.media-row-track{align-items:flex-start}',
        '.media-rail-card{scroll-snap-align:start}',
        '.media-rail-card.is-current{opacity:1}',
        '.media-rail-card.is-video-card .project-media{aspect-ratio:9 / 16;height:auto;background:#000;overflow:hidden}',
        '.media-rail-card.is-video-card video{display:block;width:100%;height:100%;object-fit:contain;background:#000}',
        '.media-rail-card.is-video-card .media-rail-open{background:#000;overflow:hidden}',
        '@media(max-width:520px){.media-rail-card.is-video-card{flex-basis:min(82%,19rem)}}'
      ].join('');
      document.head.appendChild(style);
    }

    function ensureBootstrapArrow(button, direction) {
      if (!button) return;
      var iconClass = direction < 0 ? 'bi-arrow-left' : 'bi-arrow-right';
      button.textContent = '';
      var icon = document.createElement('i');
      icon.className = 'bi ' + iconClass;
      icon.setAttribute('aria-hidden', 'true');
      button.appendChild(icon);
    }

    function pulse(button) {
      if (!button) return;
      button.classList.add('is-active');
      window.setTimeout(function () { button.classList.remove('is-active'); }, 180);
    }

    function initMediaRailControls() {
      injectRailStyles();

      document.querySelectorAll('.media-row').forEach(function (row) {
        if (row.dataset.reliableCarousel === 'ready') return;

        var viewport = row.querySelector('.media-row-viewport');
        var track = row.querySelector('.media-row-track');
        var previous = row.querySelector('.media-row-previous');
        var next = row.querySelector('.media-row-next');
        if (!viewport || !track || !previous || !next) return;

        var items = Array.prototype.slice.call(track.querySelectorAll('.media-rail-card'));
        if (!items.length) return;

        row.dataset.reliableCarousel = 'ready';
        ensureBootstrapArrow(previous, -1);
        ensureBootstrapArrow(next, 1);

        items.forEach(function (card) {
          if (card.querySelector('video')) card.classList.add('is-video-card');
        });

        var activeIndex = 0;
        var animationFrame = 0;
        var scrollSyncTimer = 0;

        function normalizeIndex(index) {
          if (!items.length) return 0;
          return ((index % items.length) + items.length) % items.length;
        }

        function targetLeftFor(index) {
          var target = items[index];
          var maximum = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
          var left = target.offsetLeft - track.offsetLeft;
          return Math.max(0, Math.min(left, maximum));
        }

        function setCurrent(index) {
          activeIndex = normalizeIndex(index);
          items.forEach(function (card, cardIndex) {
            card.classList.toggle('is-current', cardIndex === activeIndex);
          });
        }

        function nearestIndex() {
          var left = viewport.scrollLeft;
          var bestIndex = 0;
          var bestDistance = Infinity;
          items.forEach(function (card, index) {
            var distance = Math.abs(targetLeftFor(index) - left);
            if (distance < bestDistance) {
              bestDistance = distance;
              bestIndex = index;
            }
          });
          return bestIndex;
        }

        function scrollDirectly(left) {
          viewport.scrollLeft = left;
        }

        function animateScroll(left) {
          if (animationFrame) window.cancelAnimationFrame(animationFrame);
          if (reduceMotion) {
            scrollDirectly(left);
            return;
          }

          var start = viewport.scrollLeft;
          var distance = left - start;
          if (Math.abs(distance) < 1) {
            scrollDirectly(left);
            return;
          }

          var startTime = performance.now();
          var duration = 340;
          var previousSnap = viewport.style.scrollSnapType;
          viewport.style.scrollSnapType = 'none';

          function tick(now) {
            var progress = Math.min(1, (now - startTime) / duration);
            var eased = 1 - Math.pow(1 - progress, 3);
            viewport.scrollLeft = start + (distance * eased);
            if (progress < 1) {
              animationFrame = window.requestAnimationFrame(tick);
            } else {
              animationFrame = 0;
              viewport.scrollLeft = left;
              viewport.style.scrollSnapType = previousSnap;
            }
          }

          animationFrame = window.requestAnimationFrame(tick);
        }

        function goTo(index, control) {
          var nextIndex = normalizeIndex(index);
          setCurrent(nextIndex);
          pulse(control);
          animateScroll(targetLeftFor(nextIndex));
        }

        function goPrevious(event) {
          if (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
          }
          goTo(activeIndex - 1, previous);
        }

        function goNext(event) {
          if (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
          }
          goTo(activeIndex + 1, next);
        }

        previous.addEventListener('click', goPrevious, true);
        next.addEventListener('click', goNext, true);

        viewport.addEventListener('keydown', function (event) {
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            event.stopImmediatePropagation();
            goTo(activeIndex - 1, previous);
          } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            event.stopImmediatePropagation();
            goTo(activeIndex + 1, next);
          }
        }, true);

        viewport.addEventListener('scroll', function () {
          window.clearTimeout(scrollSyncTimer);
          scrollSyncTimer = window.setTimeout(function () {
            if (!animationFrame) setCurrent(nearestIndex());
          }, 90);
        }, { passive: true });

        window.addEventListener('resize', function () {
          window.clearTimeout(scrollSyncTimer);
          scrollSyncTimer = window.setTimeout(function () {
            scrollDirectly(targetLeftFor(activeIndex));
          }, 80);
        });

        setCurrent(0);
        window.requestAnimationFrame(function () {
          scrollDirectly(targetLeftFor(0));
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
    if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

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
            scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 }
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
        }

        var cards = section.querySelectorAll('.project-card, .media-card, .website-card, .campaign-card, .design-card, .portfolio-card, article');
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

    function refreshDynamicMotion() {
      initPageReveals();
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
