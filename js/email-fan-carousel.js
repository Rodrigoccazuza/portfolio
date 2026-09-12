// Email Campaigns: reference-matched card fan carousel.
// Keeps the existing portfolio data and details panel while presenting a clean,
// centered fan. Side cards select first; clicking the centered card opens preview.
(function () {
  'use strict';

  var STYLE_ID = 'email-fan-carousel-styles';
  var ROOT_SELECTOR = '#email.email-showcase';

  function installStyles() {
    if (document.getElementById(STYLE_ID)) return;

    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      ${ROOT_SELECTOR} .email-showcase-intro { margin-bottom: 0; }

      ${ROOT_SELECTOR} .email-deck-shell {
        position: relative;
        display: grid;
        grid-template-columns: 1fr 3rem auto 3rem 1fr;
        grid-template-rows: minmax(0, 1fr) 3.5rem;
        align-items: center;
        gap: .7rem;
        margin-top: clamp(1.75rem, 4vw, 3.5rem);
      }

      ${ROOT_SELECTOR} .email-deck {
        grid-column: 1 / -1;
        grid-row: 1;
        position: relative;
        min-height: clamp(36rem, 58vw, 45rem);
        overflow: hidden;
        perspective: 95rem;
        perspective-origin: 50% 48%;
        isolation: isolate;
        border-radius: 1.5rem;
      }

      ${ROOT_SELECTOR} .email-deck::before {
        content: "";
        position: absolute;
        left: 50%;
        bottom: 5%;
        width: min(56rem, 92%);
        height: 7rem;
        border-radius: 50%;
        background: radial-gradient(ellipse at center, rgba(96,38,236,.16), rgba(96,38,236,.04) 52%, transparent 74%);
        filter: blur(20px);
        transform: translateX(-50%);
        pointer-events: none;
      }

      ${ROOT_SELECTOR} .email-deck-card {
        top: 44%;
        left: 50%;
        width: clamp(12.75rem, 18vw, 17rem);
        padding: 0;
        border: 0;
        background: transparent;
        transform-origin: 50% 118%;
        transform:
          translate(-50%, -50%)
          translate3d(var(--fan-x, 0px), var(--fan-y, 0px), var(--fan-z, 0px))
          rotateZ(var(--fan-rotate, 0deg))
          rotateY(var(--fan-y-rotate, 0deg))
          scale(var(--fan-scale, .82)) !important;
        opacity: var(--fan-opacity, .72) !important;
        filter: saturate(var(--fan-saturation, .82)) brightness(var(--fan-brightness, .9));
        transition:
          transform 520ms cubic-bezier(.23,1,.32,1),
          opacity 360ms ease,
          filter 360ms ease;
        will-change: transform;
      }

      ${ROOT_SELECTOR} .email-deck.is-ready .email-deck-card { animation: none; }

      ${ROOT_SELECTOR} .email-card-frame {
        position: relative;
        display: block;
        width: 100%;
        height: clamp(25rem, 36vw, 31rem);
        min-height: 0;
        padding: 0;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,.14);
        border-radius: clamp(1rem, 1.8vw, 1.5rem);
        background: #111;
        box-shadow: 0 16px 36px rgba(0,0,0,.32);
        transition:
          height 420ms cubic-bezier(.23,1,.32,1),
          border-color 260ms ease,
          box-shadow 260ms ease,
          background-color 260ms ease;
      }

      ${ROOT_SELECTOR} .email-card-frame img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: top center;
        display: block;
      }

      /* The focused campaign reveals the complete long-form email rather than cropping it. */
      ${ROOT_SELECTOR} .email-deck-card.is-selected .email-card-frame {
        height: clamp(31rem, 45vw, 38rem);
        border-color: rgba(255,255,255,.34);
        background: #f4f4f2;
        box-shadow: 0 28px 70px rgba(0,0,0,.48), 0 0 0 1px rgba(155,92,255,.16);
      }

      ${ROOT_SELECTOR} .email-deck-card.is-selected .email-card-frame img {
        object-fit: contain;
        object-position: top center;
      }

      ${ROOT_SELECTOR} .email-deck-card.is-selected { filter: saturate(1) brightness(1); }

      @media (hover: hover) and (pointer: fine) {
        ${ROOT_SELECTOR} .email-deck-card:hover:not(.is-selected) {
          --fan-hover-lift: -.65rem;
          filter: saturate(.98) brightness(1.03);
        }
      }

      ${ROOT_SELECTOR} .email-deck-card:active { --fan-press-scale: .985; }
      ${ROOT_SELECTOR} .email-deck-card:focus-visible {
        outline: 2px solid var(--color-accent-light);
        outline-offset: .35rem;
      }

      ${ROOT_SELECTOR} .email-deck-control {
        position: static;
        z-index: 30;
        display: grid;
        place-items: center;
        width: 3rem;
        height: 3rem;
        padding: 0;
        border: 1px solid rgba(255,255,255,.16);
        border-radius: 50%;
        background: rgba(18,18,18,.9);
        color: var(--color-text-primary);
        backdrop-filter: blur(12px);
        transition: transform 160ms cubic-bezier(.23,1,.32,1), border-color 160ms ease, background 160ms ease;
      }
      ${ROOT_SELECTOR} .email-deck-previous { grid-column: 2; grid-row: 2; }
      ${ROOT_SELECTOR} .email-deck-next { grid-column: 4; grid-row: 2; }
      ${ROOT_SELECTOR} .email-deck-control:hover { transform: scale(1.07); border-color: var(--color-accent-light); }
      ${ROOT_SELECTOR} .email-deck-control:active { transform: scale(.96); }

      ${ROOT_SELECTOR} .email-fan-pagination {
        grid-column: 3;
        grid-row: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: .55rem;
      }

      ${ROOT_SELECTOR} .email-fan-dot {
        width: .48rem;
        height: .48rem;
        padding: 0;
        border: 0;
        border-radius: 50%;
        background: rgba(255,255,255,.28);
        cursor: pointer;
        transition: transform 160ms cubic-bezier(.23,1,.32,1), background 160ms ease;
      }
      ${ROOT_SELECTOR} .email-fan-dot.is-active { background: var(--color-text-primary); transform: scale(1.28); }
      ${ROOT_SELECTOR} .email-fan-dot:hover { background: var(--color-accent-light); transform: scale(1.22); }
      ${ROOT_SELECTOR} .email-fan-dot:focus-visible { outline: 2px solid var(--color-accent-light); outline-offset: .2rem; }

      ${ROOT_SELECTOR} .email-selected-details {
        position: relative;
        z-index: 40;
        margin-top: clamp(1rem, 2vw, 1.5rem);
      }

      @media (max-width: 900px) {
        ${ROOT_SELECTOR} .email-deck { min-height: 37rem; }
        ${ROOT_SELECTOR} .email-deck-card { width: clamp(12rem, 29vw, 15rem); }
        ${ROOT_SELECTOR} .email-card-frame { height: 25rem; }
        ${ROOT_SELECTOR} .email-deck-card.is-selected .email-card-frame { height: 31rem; }
      }

      @media (max-width: 620px) {
        ${ROOT_SELECTOR} .email-deck-shell {
          grid-template-columns: 1fr 2.65rem auto 2.65rem 1fr;
          gap: .45rem;
        }
        ${ROOT_SELECTOR} .email-deck {
          min-height: 31rem;
          margin-inline: calc(var(--space-sm) * -1);
          border-radius: 0;
          perspective: none;
        }
        ${ROOT_SELECTOR} .email-deck-card { top: 43%; width: 11.75rem; }
        ${ROOT_SELECTOR} .email-card-frame { height: 21rem; border-radius: 1rem; }
        ${ROOT_SELECTOR} .email-deck-card.is-selected .email-card-frame { height: 26rem; }
        ${ROOT_SELECTOR} .email-deck-control { width: 2.55rem; height: 2.55rem; }
        ${ROOT_SELECTOR} .email-fan-pagination { gap: .4rem; }
        ${ROOT_SELECTOR} .email-fan-dot { width: .4rem; height: .4rem; }
      }

      @media (prefers-reduced-motion: reduce) {
        ${ROOT_SELECTOR} .email-deck-card,
        ${ROOT_SELECTOR} .email-card-frame,
        ${ROOT_SELECTOR} .email-deck-control,
        ${ROOT_SELECTOR} .email-fan-dot { transition-duration: .01ms !important; }
      }
    `;
    document.head.appendChild(style);
  }

  function updateFanCard(card, index) {
    var rawOffset = parseFloat(card.style.getPropertyValue('--email-offset'));
    if (!Number.isFinite(rawOffset)) rawOffset = index;

    var distance = Math.abs(rawOffset);
    var viewport = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    var spacing = viewport <= 620 ? 48 : viewport <= 900 ? 72 : 106;
    var x = rawOffset * spacing;
    var y = Math.pow(distance, 1.34) * (viewport <= 620 ? 8 : 11.5);
    var rotate = rawOffset * (viewport <= 620 ? 6 : 9.2);
    var yRotate = rawOffset * -1.2;
    var scale = Math.max(viewport <= 620 ? .72 : .62, 1 - distance * (viewport <= 620 ? .08 : .075));
    var opacity = Math.max(.32, 1 - distance * .09);
    var saturation = Math.max(.68, 1 - distance * .07);
    var brightness = Math.max(.72, 1 - distance * .055);
    var z = Math.max(-220, -distance * 34);

    if (card.classList.contains('is-selected')) {
      y = -10;
      scale = viewport <= 620 ? 1.03 : 1.1;
      opacity = 1;
      saturation = 1;
      brightness = 1;
      z = 60;
      rotate = 0;
      yRotate = 0;
    }

    card.style.setProperty('--fan-x', x.toFixed(2) + 'px');
    card.style.setProperty('--fan-y', 'calc(' + y.toFixed(2) + 'px + var(--fan-hover-lift, 0px))');
    card.style.setProperty('--fan-z', z.toFixed(2) + 'px');
    card.style.setProperty('--fan-rotate', rotate.toFixed(2) + 'deg');
    card.style.setProperty('--fan-y-rotate', yRotate.toFixed(2) + 'deg');
    card.style.setProperty('--fan-scale', 'calc(' + scale.toFixed(3) + ' * var(--fan-press-scale, 1))');
    card.style.setProperty('--fan-opacity', opacity.toFixed(3));
    card.style.setProperty('--fan-saturation', saturation.toFixed(3));
    card.style.setProperty('--fan-brightness', brightness.toFixed(3));
  }

  function enhance(root) {
    if (!root || root.dataset.fanCarouselEnhanced === 'true') return;
    var deck = root.querySelector('.email-deck');
    var shell = root.querySelector('.email-deck-shell');
    if (!deck || !shell) return;

    root.dataset.fanCarouselEnhanced = 'true';
    root.classList.add('email-fan-carousel');

    var cards = Array.prototype.slice.call(deck.querySelectorAll('.email-deck-card'));
    var previous = root.querySelector('.email-deck-previous');
    var next = root.querySelector('.email-deck-next');
    var selectingWithoutPreview = false;

    function selectedIndex() {
      var index = cards.findIndex(function (card) { return card.classList.contains('is-selected'); });
      return index < 0 ? 0 : index;
    }

    function selectWithoutPreview(index) {
      var card = cards[(index + cards.length) % cards.length];
      if (!card) return;
      var viewer = window.PortfolioMediaViewer;
      var originalOpen = viewer && viewer.open;
      if (viewer && originalOpen) viewer.open = function () {};
      selectingWithoutPreview = true;
      card.click();
      selectingWithoutPreview = false;
      if (viewer && originalOpen) viewer.open = originalOpen;
    }

    var pagination = document.createElement('div');
    pagination.className = 'email-fan-pagination';
    pagination.setAttribute('aria-label', 'Email campaign pagination');
    var dots = cards.map(function (card, index) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'email-fan-dot';
      dot.setAttribute('aria-label', 'Show email campaign ' + (index + 1));
      dot.addEventListener('click', function () { selectWithoutPreview(index); });
      pagination.appendChild(dot);
      return dot;
    });
    shell.appendChild(pagination);

    function sync() {
      cards.forEach(updateFanCard);
      var active = selectedIndex();
      dots.forEach(function (dot, index) {
        var isActive = index === active;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-current', isActive ? 'true' : 'false');
      });
    }

    // Side cards behave like the reference carousel: first click centers them.
    // Clicking the already-centered card retains the existing full-preview action.
    deck.addEventListener('click', function (event) {
      if (selectingWithoutPreview) return;
      var card = event.target.closest('.email-deck-card');
      if (!card || card.classList.contains('is-selected')) return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      selectWithoutPreview(cards.indexOf(card));
    }, true);

    // Touch swipe navigation keeps the fan usable without visible side controls.
    var pointerStart = null;
    deck.addEventListener('pointerdown', function (event) { pointerStart = event.clientX; }, { passive: true });
    deck.addEventListener('pointerup', function (event) {
      if (pointerStart === null) return;
      var delta = event.clientX - pointerStart;
      pointerStart = null;
      if (Math.abs(delta) < 45) return;
      selectWithoutPreview(selectedIndex() + (delta < 0 ? 1 : -1));
    }, { passive: true });

    var scheduled = false;
    var observer = new MutationObserver(function () {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(function () {
        sync();
        scheduled = false;
      });
    });
    cards.forEach(function (card) {
      observer.observe(card, { attributes: true, attributeFilter: ['class'] });
    });

    // Keep the existing arrow controls but let the dots mirror their result.
    if (previous) previous.addEventListener('click', function () { window.requestAnimationFrame(sync); });
    if (next) next.addEventListener('click', function () { window.requestAnimationFrame(sync); });

    var resizeTimer;
    window.addEventListener('resize', function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(sync, 100);
    }, { passive: true });

    sync();
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
