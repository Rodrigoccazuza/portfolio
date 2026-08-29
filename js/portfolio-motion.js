(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    if (!window.gsap || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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
      if (ScrollTrigger) ScrollTrigger.refresh();
    }, { once: true });
  });
}());
