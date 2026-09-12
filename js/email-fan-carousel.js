// Email Campaigns: draggable stacked-card carousel.
// The active email sits at the front while upcoming campaigns peek from behind.
// Dragging the front card cycles it to the back of the stack.
(function () {
  'use strict';

  var STYLE_ID = 'email-stack-carousel-styles';
  var ROOT_SELECTOR = '#email.email-showcase';
  var DRAG_THRESHOLD = 82;

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
        grid-template-rows: minmax(0, 1fr) 3rem;
        align-items: center;
        gap: .65rem;
        margin-top: clamp(2rem, 4vw, 3.5rem);
      }

      ${ROOT_SELECTOR} .email-deck {
        grid-column: 1 / -1;
        grid-row: 1;
        position: relative;
        min-height: clamp(38rem, 58vw, 47rem);
        overflow: visible;
        isolation: isolate;
        perspective: 1200px;
        touch-action: pan-y;
        cursor: grab;
      }

      ${ROOT_SELECTOR} .email-deck:active { cursor: grabbing; }

      ${ROOT_SELECTOR} .email-deck::before {
        content: "";
        position: absolute;
        left: 50%;
        bottom: 7%;
        width: min(36rem, 78%);
        height: 5.5rem;
        border-radius: 50%;
        background: radial-gradient(ellipse at center, rgba(0,0,0,.34), rgba(0,0,0,.08) 55%, transparent 76%);
        filter: blur(18px);
        transform: translateX(-50%);
        pointer-events: none;
      }

      ${ROOT_SELECTOR} .email-deck-card {
        position: absolute;
        top: 49%;
        left: 50%;
        width: clamp(18rem, 31vw, 26rem);
        padding: 0;
        border: 0;
        background: transparent;
        transform-origin: 50% 56%;
        transform:
          translate(-50%, -50%)
          translate3d(var(--stack-x, 0px), var(--stack-y, 0px), var(--stack-z, 0px))
          rotate(var(--stack-r, 0deg))
          scale(var(--stack-scale, 1));
        opacity: var(--stack-opacity, 1);
        filter: brightness(var(--stack-brightness, 1)) saturate(var(--stack-saturation, 1));
        transition:
          transform 360ms cubic-bezier(.23,1,.32,1),
          opacity 260ms ease,
          filter 260ms ease;
        will-change: transform;
        backface-visibility: hidden;
      }

      ${ROOT_SELECTOR} .email-deck-card.is-dragging {
        transition: none !important;
        transform:
          translate(-50%, -50%)
          translate3d(var(--drag-x, 0px), var(--drag-y, 0px), 80px)
          rotate(var(--drag-r, 0deg))
          scale(1.015) !important;
        opacity: var(--drag-opacity, 1) !important;
        filter: brightness(1) saturate(1) !important;
        cursor: grabbing;
      }

      ${ROOT_SELECTOR} .email-deck-card.is-throwing {
        transition: transform 280ms cubic-bezier(.55,.05,.35,1), opacity 240ms ease !important;
        transform:
          translate(-50%, -50%)
          translate3d(var(--throw-x, 0px), var(--throw-y, 20px), 100px)
          rotate(var(--throw-r, 12deg))
          scale(.98) !important;
        opacity: 0 !important;
      }

      ${ROOT_SELECTOR} .email-deck.is-ready .email-deck-card { animation: none; }

      ${ROOT_SELECTOR} .email-card-frame {
        position: relative;
        display: block;
        width: 100%;
        height: clamp(29rem, 43vw, 37rem);
        min-height: 0;
        padding: 0;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,.18);
        border-radius: clamp(1rem, 2vw, 1.55rem);
        background: #111;
        box-shadow: 0 18px 44px rgba(0,0,0,.3);
        transition:
          border-color 220ms ease,
          box-shadow 220ms ease,
          background-color 220ms ease;
      }

      ${ROOT_SELECTOR} .email-card-frame img {
        position: absolute;
        inset: 0;
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: top center;
        pointer-events: none;
        user-select: none;
        -webkit-user-drag: none;
      }

      ${ROOT_SELECTOR} .email-deck-card.is-selected .email-card-frame {
        border-color: rgba(255,255,255,.38);
        background: #f5f5f2;
        box-shadow: 0 28px 72px rgba(0,0,0,.46), 0 0 0 1px rgba(255,255,255,.06);
      }

      /* Keep the entire long-form email visible on the front card. */
      ${ROOT_SELECTOR} .email-deck-card.is-selected .email-card-frame img {
        object-fit: contain;
        object-position: top center;
      }

      ${ROOT_SELECTOR} .email-deck-card:not(.is-selected) { pointer-events: auto; }

      @media (hover: hover) and (pointer: fine) {
        ${ROOT_SELECTOR} .email-deck-card:not(.is-selected):hover {
          filter: brightness(1.04) saturate(1.02);
        }
      }

      ${ROOT_SELECTOR} .email-deck-card:focus-visible {
        outline: 2px solid var(--color-accent-light);
        outline-offset: .35rem;
      }

      ${ROOT_SELECTOR} .email-deck-control {
        position: static;
        z-index: 50;
        display: grid;
        place-items: center;
        width: 2.65rem;
        height: 2.65rem;
        padding: 0;
        border: 1px solid rgba(255,255,255,.14);
        border-radius: 50%;
        background: rgba(16,16,16,.88);
        color: var(--color-text-primary);
        backdrop-filter: blur(10px);
        transition: transform 150ms cubic-bezier(.23,1,.32,1), border-color 150ms ease;
      }
      ${ROOT_SELECTOR} .email-deck-previous { grid-column: 2; grid-row: 2; }
      ${ROOT_SELECTOR} .email-deck-next { grid-column: 4; grid-row: 2; }
      ${ROOT_SELECTOR} .email-deck-control:hover { transform: scale(1.07); border-color: var(--color-accent-light); }
      ${ROOT_SELECTOR} .email-deck-control:active { transform: scale(.96); }

      ${ROOT_SELECTOR} .email-stack-pagination {
        grid-column: 3;
        grid-row: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: .48rem;
      }

      ${ROOT_SELECTOR} .email-stack-dot {
        width: .42rem;
        height: .42rem;
        padding: 0;
        border: 0;
        border-radius: 50%;
        background: rgba(255,255,255,.26);
        cursor: pointer;
        transition: transform 150ms cubic-bezier(.23,1,.32,1), background 150ms ease;
      }
      ${ROOT_SELECTOR} .email-stack-dot.is-active {
        background: var(--color-text-primary);
        transform: scale(1.35);
      }
      ${ROOT_SELECTOR} .email-stack-dot:hover { background: var(--color-accent-light); }
      ${ROOT_SELECTOR} .email-stack-dot:focus-visible { outline: 2px solid var(--color-accent-light); outline-offset: .2rem; }

      ${ROOT_SELECTOR} .email-stack-hint {
        grid-column: 1 / -1;
        grid-row: 3;
        margin: .15rem 0 0;
        color: var(--color-text-secondary);
        font-size: var(--text-xs);
        text-align: center;
        letter-spacing: .03em;
      }

      ${ROOT_SELECTOR} .email-selected-details {
        position: relative;
        z-index: 60;
        margin-top: clamp(1rem, 2vw, 1.5rem);
      }

      @media (max-width: 900px) {
        ${ROOT_SELECTOR} .email-deck { min-height: 41rem; }
        ${ROOT_SELECTOR} .email-deck-card { width: clamp(17rem, 44vw, 22rem); }
        ${ROOT_SELECTOR} .email-card-frame { height: clamp(28rem, 58vw, 34rem); }
      }

      @media (max-width: 620px) {
        ${ROOT_SELECTOR} .email-deck-shell {
          grid-template-columns: 1fr 2.5rem auto 2.5rem 1fr;
          gap: .4rem;
        }
        ${ROOT_SELECTOR} .email-deck {
          min-height: 34rem;
          margin-inline: calc(var(--space-sm) * -1);
          overflow: hidden;
          perspective: none;
        }
        ${ROOT_SELECTOR} .email-deck-card { width: min(72vw, 18rem); }
        ${ROOT_SELECTOR} .email-card-frame { height: min(112vw, 28rem); border-radius: 1.05rem; }
        ${ROOT_SELECTOR} .email-deck-control { width: 2.35rem; height: 2.35rem; }
        ${ROOT_SELECTOR} .email-stack-hint { font-size: .68rem; }
      }

      @media (prefers-reduced-motion: reduce) {
        ${ROOT_SELECTOR} .email-deck-card,
        ${ROOT_SELECTOR} .email-card-frame,
        ${ROOT_SELECTOR} .email-deck-control,
        ${ROOT_SELECTOR} .email-stack-dot { transition-duration: .01ms !important; }
      }
    `;

    document.head.appendChild(style);
  }

  function enhance(root) {
    if (!root || root.dataset.stackCarouselEnhanced === 'true') return;

    var deck = root.querySelector('.email-deck');
    var shell = root.querySelector('.email-deck-shell');
    if (!deck || !shell) return;

    var cards = Array.prototype.slice.call(deck.querySelectorAll('.email-deck-card'));
    if (!cards.length) return;

    root.dataset.stackCarouselEnhanced = 'true';
    root.classList.add('email-stack-carousel');

    var suppressPreview = false;
    var suppressNextClick = false;
    var drag = null;

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
      suppressPreview = true;
      card.click();
      suppressPreview = false;
      if (viewer && originalOpen) viewer.open = originalOpen;
    }

    function stackPosition(cardIndex, activeIndex) {
      var count = cards.length;
      return (cardIndex - activeIndex + count) % count;
    }

    function renderStack() {
      var active = selectedIndex();
      var viewport = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      var mobile = viewport <= 620;
      var tablet = viewport <= 900;

      cards.forEach(function (card, index) {
        var position = stackPosition(index, active);
        var visibleDepth = Math.min(position, 4);
        var hidden = position > 4;

        var xOffsets = mobile ? [0, 11, 20, 27, 33] : tablet ? [0, 16, 30, 42, 50] : [0, 20, 38, 54, 66];
        var yOffsets = mobile ? [0, -8, -15, -20, -24] : [0, -11, -20, -27, -32];
        var rotations = [0, 2.1, -2.8, 3.5, -4.2];
        var scales = [1, .965, .93, .895, .86];

        card.style.setProperty('--stack-x', xOffsets[visibleDepth] + 'px');
        card.style.setProperty('--stack-y', yOffsets[visibleDepth] + 'px');
        card.style.setProperty('--stack-z', String(-visibleDepth * 44) + 'px');
        card.style.setProperty('--stack-r', rotations[visibleDepth] + 'deg');
        card.style.setProperty('--stack-scale', String(scales[visibleDepth]));
        card.style.setProperty('--stack-opacity', hidden ? '0' : String(Math.max(.42, 1 - visibleDepth * .12)));
        card.style.setProperty('--stack-brightness', String(Math.max(.7, 1 - visibleDepth * .07)));
        card.style.setProperty('--stack-saturation', String(Math.max(.72, 1 - visibleDepth * .05)));
        card.style.zIndex = String(60 - visibleDepth);
        card.style.pointerEvents = hidden ? 'none' : 'auto';
        card.dataset.stackPosition = String(position);
      });

      dots.forEach(function (dot, index) {
        var isActive = index === active;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-current', isActive ? 'true' : 'false');
      });
    }

    var pagination = document.createElement('div');
    pagination.className = 'email-stack-pagination';
    pagination.setAttribute('aria-label', 'Email campaign pagination');

    var dots = cards.map(function (card, index) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'email-stack-dot';
      dot.setAttribute('aria-label', 'Show email campaign ' + (index + 1));
      dot.addEventListener('click', function () { selectWithoutPreview(index); });
      pagination.appendChild(dot);
      return dot;
    });
    shell.appendChild(pagination);

    var hint = document.createElement('p');
    hint.className = 'email-stack-hint';
    hint.textContent = 'Drag the front card to cycle through campaigns';
    shell.appendChild(hint);

    deck.addEventListener('click', function (event) {
      if (suppressPreview) return;
      var card = event.target.closest('.email-deck-card');
      if (!card) return;

      if (suppressNextClick) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        suppressNextClick = false;
        return;
      }

      if (!card.classList.contains('is-selected')) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        selectWithoutPreview(cards.indexOf(card));
      }
    }, true);

    deck.addEventListener('pointerdown', function (event) {
      var front = event.target.closest('.email-deck-card.is-selected');
      if (!front || event.button > 0) return;
      drag = {
        card: front,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        dx: 0,
        dy: 0
      };
      front.classList.add('is-dragging');
      if (front.setPointerCapture) front.setPointerCapture(event.pointerId);
    });

    deck.addEventListener('pointermove', function (event) {
      if (!drag || event.pointerId !== drag.pointerId) return;
      drag.dx = event.clientX - drag.startX;
      drag.dy = event.clientY - drag.startY;
      var resistanceY = drag.dy * .24;
      var rotation = drag.dx * .035;
      var opacity = Math.max(.74, 1 - Math.abs(drag.dx) / 620);
      drag.card.style.setProperty('--drag-x', drag.dx.toFixed(2) + 'px');
      drag.card.style.setProperty('--drag-y', resistanceY.toFixed(2) + 'px');
      drag.card.style.setProperty('--drag-r', rotation.toFixed(2) + 'deg');
      drag.card.style.setProperty('--drag-opacity', opacity.toFixed(3));
    });

    function finishDrag(event, cancelled) {
      if (!drag || (event && event.pointerId !== drag.pointerId)) return;
      var state = drag;
      drag = null;

      var card = state.card;
      var moved = Math.abs(state.dx) > 8 || Math.abs(state.dy) > 8;
      if (moved) suppressNextClick = true;

      if (!cancelled && Math.abs(state.dx) >= DRAG_THRESHOLD) {
        var direction = state.dx < 0 ? -1 : 1;
        card.classList.remove('is-dragging');
        card.classList.add('is-throwing');
        card.style.setProperty('--throw-x', String(direction * Math.max(window.innerWidth * .72, 620)) + 'px');
        card.style.setProperty('--throw-y', String(Math.min(60, Math.abs(state.dy) * .18 + 18)) + 'px');
        card.style.setProperty('--throw-r', String(direction * 16) + 'deg');

        window.setTimeout(function () {
          card.classList.remove('is-throwing');
          card.style.removeProperty('--drag-x');
          card.style.removeProperty('--drag-y');
          card.style.removeProperty('--drag-r');
          card.style.removeProperty('--drag-opacity');
          selectWithoutPreview(selectedIndex() + 1);
          window.requestAnimationFrame(renderStack);
        }, 255);
      } else {
        card.classList.remove('is-dragging');
        card.style.removeProperty('--drag-x');
        card.style.removeProperty('--drag-y');
        card.style.removeProperty('--drag-r');
        card.style.removeProperty('--drag-opacity');
        window.requestAnimationFrame(renderStack);
      }
    }

    deck.addEventListener('pointerup', function (event) { finishDrag(event, false); });
    deck.addEventListener('pointercancel', function (event) { finishDrag(event, true); });

    var wheelLocked = false;
    deck.addEventListener('wheel', function (event) {
      if (Math.abs(event.deltaY) < 22 && Math.abs(event.deltaX) < 22) return;
      if (wheelLocked) return;
      wheelLocked = true;
      selectWithoutPreview(selectedIndex() + ((event.deltaY > 0 || event.deltaX > 0) ? 1 : -1));
      window.setTimeout(function () { wheelLocked = false; }, 420);
    }, { passive: true });

    var observer = new MutationObserver(function () {
      window.requestAnimationFrame(renderStack);
    });
    cards.forEach(function (card) {
      observer.observe(card, { attributes: true, attributeFilter: ['class'] });
    });

    window.addEventListener('resize', function () {
      window.requestAnimationFrame(renderStack);
    }, { passive: true });

    renderStack();
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
