// Design Systems: reference-matched scrollable card stack.
// Presents one focused landscape card at a time, with a compact metadata footer
// and pagination dots, while preserving the existing selection/details behavior.
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
        grid-template-columns: minmax(0, 1.1fr) minmax(22rem, .9fr);
        gap: clamp(2rem, 5vw, 5rem);
        align-items: center;
      }

      ${ROOT_SELECTOR} .system-canvas-stage {
        position: relative;
        display: grid;
        place-items: center;
        width: 100%;
        max-width: 48rem;
        min-height: 35rem;
        margin-inline: auto;
        overflow: visible;
        perspective: 1200px;
        perspective-origin: 50% 45%;
      }

      ${ROOT_SELECTOR} .system-card-stack-viewport {
        position: relative;
        width: min(100%, 40.5rem);
        aspect-ratio: 1.63 / 1;
        touch-action: pan-y;
        user-select: none;
        -webkit-user-select: none;
      }

      ${ROOT_SELECTOR} .system-canvas {
        position: absolute !important;
        inset: 0 !important;
        top: auto !important;
        left: auto !important;
        display: grid;
        grid-template-rows: minmax(0, 1fr) 5.25rem;
        width: 100% !important;
        height: 100% !important;
        margin: 0 !important;
        padding: 0;
        overflow: hidden;
        border: 4px solid #343434;
        border-radius: 2rem;
        background: #080808;
        color: #fff;
        box-shadow: 0 1.5rem 2.5rem rgba(0, 0, 0, .26);
        cursor: pointer;
        transform:
          translate3d(var(--stack-x, 0), var(--stack-y, 0), var(--stack-z, 0))
          rotateX(var(--stack-rx, 0deg))
          rotateY(var(--stack-ry, 0deg))
          scale(var(--stack-scale, 1)) !important;
        opacity: var(--stack-opacity, 1);
        filter: brightness(var(--stack-brightness, 1));
        transform-origin: 50% 55%;
        transition:
          transform 200ms cubic-bezier(.22, 1, .36, 1),
          opacity 200ms ease,
          filter 200ms ease,
          border-color 200ms ease,
          box-shadow 200ms ease;
        will-change: transform, opacity;
        backface-visibility: hidden;
      }

      ${ROOT_SELECTOR} .system-canvas::before,
      ${ROOT_SELECTOR} .system-canvas::after { display: none !important; }

      ${ROOT_SELECTOR} .system-canvas-visual {
        position: relative;
        display: block;
        width: 100%;
        height: 100%;
        min-height: 0 !important;
        overflow: hidden;
        background: #151515;
      }

      ${ROOT_SELECTOR} .system-canvas-visual::before { display: none !important; }

      ${ROOT_SELECTOR} .system-canvas-visual img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
      }

      ${ROOT_SELECTOR} .system-canvas-caption {
        position: relative;
        z-index: 3;
        display: grid;
        grid-template-columns: 3.25rem minmax(0, 1fr);
        grid-template-rows: auto auto;
        column-gap: .9rem;
        align-content: center;
        padding: .75rem 1.4rem;
        border: 0;
        background: #080808;
        text-align: left;
      }

      ${ROOT_SELECTOR} .system-canvas-caption::before {
        content: "";
        grid-column: 1;
        grid-row: 1 / 3;
        width: 3rem;
        height: 3rem;
        align-self: center;
        border: 3px solid #fff;
        border-radius: 50%;
        background-image: var(--system-thumb);
        background-size: cover;
        background-position: center;
        box-shadow: 0 0 0 1px rgba(255,255,255,.15);
      }

      ${ROOT_SELECTOR} .system-canvas-caption strong {
        grid-column: 2;
        grid-row: 1;
        align-self: end;
        margin: 0;
        color: #fff;
        font: 700 clamp(1rem, 2vw, 1.35rem)/1.08 var(--font-display);
        letter-spacing: -.02em;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      ${ROOT_SELECTOR} .system-canvas-caption > span {
        grid-column: 2;
        grid-row: 2;
        align-self: start;
        margin-top: .15rem;
        color: #9b9b9b;
        font: 600 clamp(.78rem, 1.5vw, .95rem)/1.2 var(--font-body);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      ${ROOT_SELECTOR} .system-canvas.is-selected {
        border-color: #3b3b3b;
        box-shadow: 0 1.7rem 3.25rem rgba(0, 0, 0, .36);
      }

      ${ROOT_SELECTOR} .system-canvas:focus-visible {
        outline: 2px solid var(--color-accent-light);
        outline-offset: .45rem;
      }

      ${ROOT_SELECTOR} .system-stack-pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: .9rem;
        margin-top: 2.15rem;
      }

      ${ROOT_SELECTOR} .system-stack-dot {
        width: 1rem;
        height: 1rem;
        padding: 0;
        border: 0;
        border-radius: 50%;
        background: #d7d9e0;
        opacity: 1;
        cursor: pointer;
        transition: transform 180ms ease, background 180ms ease;
      }

      ${ROOT_SELECTOR} .system-stack-dot:hover,
      ${ROOT_SELECTOR} .system-stack-dot:focus-visible {
        transform: scale(1.2);
      }

      ${ROOT_SELECTOR} .system-stack-dot.is-active {
        background: var(--color-accent-light, #d457ff);
        transform: scale(1.18);
      }

      ${ROOT_SELECTOR} .system-stack-dot:focus-visible {
        outline: 2px solid #fff;
        outline-offset: .2rem;
      }

      ${ROOT_SELECTOR} .system-stack-hint {
        margin: .9rem 0 0;
        color: var(--color-text-secondary);
        font-size: var(--text-xs);
        text-align: center;
      }

      ${ROOT_SELECTOR} .design-system-details {
        position: relative;
        top: auto;
        align-self: center;
      }

      @media (max-width: 1024px) {
        ${ROOT_SELECTOR} .design-systems-composition { grid-template-columns: 1fr; }
        ${ROOT_SELECTOR} .system-canvas-stage { max-width: 44rem; min-height: 33rem; }
        ${ROOT_SELECTOR} .design-system-details { max-width: 44rem; margin-inline: auto; padding-left: 0; }
      }

      @media (max-width: 620px) {
        ${ROOT_SELECTOR} .system-canvas-stage { min-height: 25rem; }
        ${ROOT_SELECTOR} .system-card-stack-viewport {
          width: min(100%, 30rem);
          aspect-ratio: 1.45 / 1;
        }
        ${ROOT_SELECTOR} .system-canvas {
          grid-template-rows: minmax(0, 1fr) 4.35rem;
          border-width: 3px;
          border-radius: 1.4rem;
        }
        ${ROOT_SELECTOR} .system-canvas-caption {
          grid-template-columns: 2.55rem minmax(0, 1fr);
          column-gap: .7rem;
          padding: .55rem .85rem;
        }
        ${ROOT_SELECTOR} .system-canvas-caption::before {
          width: 2.35rem;
          height: 2.35rem;
          border-width: 2px;
        }
        ${ROOT_SELECTOR} .system-stack-pagination { gap: .7rem; margin-top: 1.4rem; }
        ${ROOT_SELECTOR} .system-stack-dot { width: .78rem; height: .78rem; }
      }

      @media (prefers-reduced-motion: reduce) {
        ${ROOT_SELECTOR} .system-canvas,
        ${ROOT_SELECTOR} .system-stack-dot { transition-duration: .01ms !important; }
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

    var viewport = document.createElement('div');
    viewport.className = 'system-card-stack-viewport';
    viewport.setAttribute('aria-label', 'Design system carousel');
    viewport.tabIndex = 0;

    cards.forEach(function (card, index) {
      var image = card.querySelector('.system-canvas-visual img');
      if (image && image.src) card.style.setProperty('--system-thumb', 'url("' + image.src.replace(/"/g, '\\"') + '")');
      card.style.setProperty('--stack-index', index);
      viewport.appendChild(card);
    });

    stage.appendChild(viewport);

    var pagination = document.createElement('div');
    pagination.className = 'system-stack-pagination';
    pagination.setAttribute('role', 'tablist');
    pagination.setAttribute('aria-label', 'Choose design system');

    var dots = cards.map(function (card, index) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'system-stack-dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Show design system ' + (index + 1));
      dot.dataset.index = index;
      pagination.appendChild(dot);
      return dot;
    });

    stage.appendChild(pagination);

    var hint = document.createElement('p');
    hint.className = 'system-stack-hint';
    hint.textContent = 'Scroll, swipe, or use the dots to explore';
    stage.appendChild(hint);

    var currentIndex = cards.findIndex(function (card) { return card.classList.contains('is-selected'); });
    if (currentIndex < 0) currentIndex = 0;
    var switching = false;
    var wheelLock = false;
    var touchStartY = null;
    var touchStartX = null;

    function wrappedDistance(index, active) {
      var diff = index - active;
      var half = cards.length / 2;
      if (diff > half) diff -= cards.length;
      if (diff < -half) diff += cards.length;
      return diff;
    }

    function render() {
      cards.forEach(function (card, index) {
        var rel = wrappedDistance(index, currentIndex);
        var distance = Math.abs(rel);
        var selected = index === currentIndex;

        var x = rel * 7;
        var y = distance * 11;
        var z = -distance * 78;
        var scale = Math.max(.88, 1 - distance * .035);
        var rx = distance * 1.2;
        var ry = rel * -1.5;
        var opacity = selected ? 1 : (distance === 1 ? .16 : 0);
        var brightness = selected ? 1 : .64;

        if (selected) {
          x = 0;
          y = 0;
          z = 24;
          scale = 1;
          rx = 0;
          ry = 0;
        }

        card.style.setProperty('--stack-x', x.toFixed(2) + 'px');
        card.style.setProperty('--stack-y', y.toFixed(2) + 'px');
        card.style.setProperty('--stack-z', z.toFixed(2) + 'px');
        card.style.setProperty('--stack-scale', scale.toFixed(3));
        card.style.setProperty('--stack-rx', rx.toFixed(2) + 'deg');
        card.style.setProperty('--stack-ry', ry.toFixed(2) + 'deg');
        card.style.setProperty('--stack-opacity', opacity.toFixed(3));
        card.style.setProperty('--stack-brightness', brightness.toFixed(3));
        card.style.zIndex = selected ? '30' : String(20 - distance);
        card.style.pointerEvents = selected ? 'auto' : 'none';
        card.setAttribute('aria-hidden', selected ? 'false' : 'true');
        card.tabIndex = selected ? 0 : -1;

        dotState(dots[index], selected);
      });
    }

    function dotState(dot, active) {
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-selected', active ? 'true' : 'false');
      dot.tabIndex = active ? 0 : -1;
    }

    function activate(index, source) {
      var next = (index + cards.length) % cards.length;
      if (next === currentIndex && source !== 'init') return;

      currentIndex = next;
      render();

      if (!switching) {
        switching = true;
        cards[currentIndex].click();
        switching = false;
      }
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () { activate(index, 'dot'); });
    });

    cards.forEach(function (card, index) {
      card.addEventListener('click', function () {
        if (switching) return;
        if (index !== currentIndex) activate(index, 'card');
      });
    });

    viewport.addEventListener('wheel', function (event) {
      if (Math.abs(event.deltaY) < 8 || wheelLock) return;
      event.preventDefault();
      wheelLock = true;
      activate(currentIndex + (event.deltaY > 0 ? 1 : -1), 'wheel');
      window.setTimeout(function () { wheelLock = false; }, 260);
    }, { passive: false });

    viewport.addEventListener('touchstart', function (event) {
      if (!event.touches || !event.touches[0]) return;
      touchStartY = event.touches[0].clientY;
      touchStartX = event.touches[0].clientX;
    }, { passive: true });

    viewport.addEventListener('touchend', function (event) {
      if (touchStartY === null || touchStartX === null || !event.changedTouches || !event.changedTouches[0]) return;
      var dy = event.changedTouches[0].clientY - touchStartY;
      var dx = event.changedTouches[0].clientX - touchStartX;
      touchStartY = null;
      touchStartX = null;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 34) return;
      if (Math.abs(dx) > Math.abs(dy)) activate(currentIndex + (dx < 0 ? 1 : -1), 'swipe');
      else activate(currentIndex + (dy < 0 ? 1 : -1), 'swipe');
    }, { passive: true });

    viewport.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        activate(currentIndex + 1, 'keyboard');
      }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        activate(currentIndex - 1, 'keyboard');
      }
    });

    activate(currentIndex, 'init');
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
