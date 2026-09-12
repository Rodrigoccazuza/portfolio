// Design Systems: native scrollable card stack adaptation.
// Reuses the existing project cards, selection logic, details panel, and links.
(function () {
  'use strict';

  var STYLE_ID = 'design-system-scroll-stack-styles';
  var ROOT_SELECTOR = '#design-systems.design-systems-showcase';

  function installStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      ${ROOT_SELECTOR} .design-systems-composition {
        grid-template-columns: minmax(0, 1.08fr) minmax(22rem, .92fr);
        gap: clamp(2rem, 5vw, 5rem);
        align-items: start;
      }

      ${ROOT_SELECTOR} .system-canvas-stage {
        position: relative;
        height: min(72vh, 42rem);
        min-height: 34rem;
        overflow-y: auto;
        overflow-x: visible;
        overscroll-behavior: contain;
        scroll-snap-type: y mandatory;
        scrollbar-width: none;
        perspective: 1200px;
        perspective-origin: 50% 30%;
        mask-image: linear-gradient(to bottom, transparent 0, #000 5%, #000 92%, transparent 100%);
      }

      ${ROOT_SELECTOR} .system-canvas-stage::-webkit-scrollbar { display: none; }

      ${ROOT_SELECTOR} .system-scroll-stack-track {
        position: relative;
        min-height: calc(var(--stack-count, 5) * 15rem + 30rem);
        padding: 3rem 0 18rem;
      }

      ${ROOT_SELECTOR} .system-canvas {
        position: sticky !important;
        top: calc(2.75rem + (var(--stack-index, 0) * .7rem));
        left: auto !important;
        z-index: calc(30 + var(--stack-index, 0));
        width: min(92%, 34rem) !important;
        height: 22rem;
        margin: 0 auto 8rem;
        transform:
          translate3d(0, var(--stack-y, 0px), var(--stack-z, 0px))
          rotateX(var(--stack-rx, 0deg))
          rotateZ(var(--stack-rz, 0deg))
          scale(var(--stack-scale, 1)) !important;
        opacity: var(--stack-opacity, 1);
        filter: saturate(var(--stack-saturation, 1)) brightness(var(--stack-brightness, 1));
        transform-origin: 50% 0%;
        transition:
          transform 200ms cubic-bezier(.22, 1, .36, 1),
          opacity 200ms ease,
          filter 200ms ease,
          border-color 200ms ease,
          box-shadow 200ms ease;
        scroll-snap-align: start;
        will-change: transform;
        backface-visibility: hidden;
      }

      ${ROOT_SELECTOR} .system-canvas::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: inherit;
        pointer-events: none;
        background: linear-gradient(180deg, rgba(255,255,255,.06), transparent 22%, transparent 76%, rgba(0,0,0,.12));
      }

      ${ROOT_SELECTOR} .system-canvas.is-selected {
        z-index: 80;
        border-color: var(--color-accent-light);
        box-shadow:
          0 24px 64px rgba(0,0,0,.34),
          0 0 0 1px rgba(155,92,255,.14),
          0 0 36px rgba(96,38,236,.16);
      }

      ${ROOT_SELECTOR} .system-canvas:hover,
      ${ROOT_SELECTOR} .system-canvas:focus-visible {
        filter: saturate(1.05) brightness(1.04);
      }

      ${ROOT_SELECTOR} .system-canvas:focus-visible {
        outline: 2px solid var(--color-accent-light);
        outline-offset: .3rem;
      }

      ${ROOT_SELECTOR} .system-canvas-visual {
        min-height: 0;
      }

      ${ROOT_SELECTOR} .system-canvas-caption {
        position: relative;
        z-index: 2;
        background: rgba(15,15,15,.88);
        backdrop-filter: blur(14px);
      }

      ${ROOT_SELECTOR} .design-system-details {
        position: sticky;
        top: 7rem;
        align-self: start;
      }

      ${ROOT_SELECTOR} .system-stack-hint {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: .5rem;
        margin-top: .75rem;
        color: var(--color-text-secondary);
        font-size: var(--text-xs);
        letter-spacing: .08em;
        text-transform: uppercase;
      }

      ${ROOT_SELECTOR} .system-stack-hint i { color: var(--color-accent-light); }

      @media (max-width: 1024px) {
        ${ROOT_SELECTOR} .design-systems-composition { grid-template-columns: 1fr; }
        ${ROOT_SELECTOR} .system-canvas-stage { height: 38rem; max-width: 48rem; width: 100%; margin-inline: auto; }
        ${ROOT_SELECTOR} .design-system-details { position: relative; top: auto; }
      }

      @media (max-width: 620px) {
        ${ROOT_SELECTOR} .system-canvas-stage {
          height: 31rem;
          min-height: 31rem;
          perspective: 900px;
          mask-image: linear-gradient(to bottom, transparent 0, #000 4%, #000 94%, transparent 100%);
        }
        ${ROOT_SELECTOR} .system-scroll-stack-track {
          min-height: calc(var(--stack-count, 5) * 12rem + 24rem);
          padding-top: 2rem;
        }
        ${ROOT_SELECTOR} .system-canvas {
          top: calc(1.75rem + (var(--stack-index, 0) * .45rem));
          width: 92% !important;
          height: 18rem !important;
          margin-bottom: 6rem;
        }
        ${ROOT_SELECTOR} .system-canvas-caption { padding: var(--space-sm); }
      }

      @media (prefers-reduced-motion: reduce) {
        ${ROOT_SELECTOR} .system-canvas { transition-duration: .01ms !important; }
      }
    `;
    document.head.appendChild(style);
  }

  function enhance(root) {
    if (!root || root.dataset.scrollStackEnhanced === 'true') return;
    var stage = root.querySelector('.system-canvas-stage');
    if (!stage) return;

    var cards = Array.prototype.slice.call(stage.querySelectorAll('.system-canvas'));
    if (!cards.length) return;

    root.dataset.scrollStackEnhanced = 'true';
    root.classList.add('design-system-scroll-stack');

    var track = document.createElement('div');
    track.className = 'system-scroll-stack-track';
    track.style.setProperty('--stack-count', cards.length);

    cards.forEach(function (card, index) {
      card.style.setProperty('--stack-index', index);
      track.appendChild(card);
    });
    stage.appendChild(track);

    var hint = document.createElement('p');
    hint.className = 'system-stack-hint';
    hint.innerHTML = '<i class="bi bi-mouse" aria-hidden="true"></i><span>Scroll to explore systems</span>';
    stage.insertAdjacentElement('afterend', hint);

    var currentIndex = cards.findIndex(function (card) { return card.classList.contains('is-selected'); });
    if (currentIndex < 0) currentIndex = 0;
    var raf = 0;
    var syncingSelection = false;

    function metrics() {
      return window.innerWidth <= 620 ? { step: 190, spread: 15 } : { step: 238, spread: 22 };
    }

    function render() {
      raf = 0;
      var m = metrics();
      var progress = stage.scrollTop / m.step;
      var nearest = Math.max(0, Math.min(cards.length - 1, Math.round(progress)));

      cards.forEach(function (card, index) {
        var relative = index - progress;
        var distance = Math.abs(relative);
        var before = relative < 0;
        var y = before ? Math.max(-34, relative * 18) : Math.min(42, relative * m.spread);
        var z = -Math.min(180, distance * 46);
        var scale = Math.max(.82, 1 - distance * .055);
        var rx = before ? Math.min(7, distance * 2.4) : Math.min(3.5, distance * 1.25);
        var rz = Math.max(-2.4, Math.min(2.4, relative * .7));
        var opacity = Math.max(.42, 1 - distance * .12);
        var saturation = Math.max(.62, 1 - distance * .1);
        var brightness = Math.max(.7, 1 - distance * .07);

        if (index === nearest) {
          y -= 6;
          z = 22;
          scale = 1;
          rx = 0;
          rz = 0;
          opacity = 1;
          saturation = 1;
          brightness = 1;
        }

        card.style.setProperty('--stack-y', y.toFixed(2) + 'px');
        card.style.setProperty('--stack-z', z.toFixed(2) + 'px');
        card.style.setProperty('--stack-scale', scale.toFixed(3));
        card.style.setProperty('--stack-rx', rx.toFixed(2) + 'deg');
        card.style.setProperty('--stack-rz', rz.toFixed(2) + 'deg');
        card.style.setProperty('--stack-opacity', opacity.toFixed(3));
        card.style.setProperty('--stack-saturation', saturation.toFixed(3));
        card.style.setProperty('--stack-brightness', brightness.toFixed(3));
      });

      if (nearest !== currentIndex && !syncingSelection) {
        currentIndex = nearest;
        syncingSelection = true;
        cards[nearest].click();
        syncingSelection = false;
      }
    }

    function requestRender() {
      if (!raf) raf = window.requestAnimationFrame(render);
    }

    stage.addEventListener('scroll', requestRender, { passive: true });
    window.addEventListener('resize', requestRender, { passive: true });

    cards.forEach(function (card, index) {
      card.addEventListener('click', function () {
        if (syncingSelection) return;
        currentIndex = index;
        var m = metrics();
        var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        stage.scrollTo({ top: index * m.step, behavior: reduced ? 'auto' : 'smooth' });
      });
    });

    // Align the stack with whichever project the existing section selected initially.
    var m = metrics();
    stage.scrollTop = currentIndex * m.step;
    render();
  }

  function init() {
    installStyles();
    var root = document.querySelector(ROOT_SELECTOR);
    if (root) return enhance(root);

    var observer = new MutationObserver(function () {
      var found = document.querySelector(ROOT_SELECTOR);
      if (!found) return;
      observer.disconnect();
      enhance(found);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
