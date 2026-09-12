// Email Campaigns: native card-fan carousel adaptation.
// Keeps the existing portfolio data, selection logic, viewer, keyboard controls,
// and campaign detail panel while translating the supplied React component's
// fan-card presentation into the portfolio's existing HTML/CSS/JS architecture.
(function () {
  'use strict';

  var STYLE_ID = 'email-fan-carousel-styles';
  var ROOT_SELECTOR = '#email.email-showcase';

  function installStyles() {
    if (document.getElementById(STYLE_ID)) return;

    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      ${ROOT_SELECTOR} .email-deck-shell {
        margin-top: clamp(2rem, 5vw, 4.5rem);
        grid-template-columns: 3.25rem minmax(0, 1fr) 3.25rem;
        gap: clamp(.5rem, 1.5vw, 1rem);
      }

      ${ROOT_SELECTOR} .email-deck {
        min-height: clamp(34rem, 57vw, 43rem);
        overflow: visible;
        perspective: 90rem;
        perspective-origin: 50% 42%;
        isolation: isolate;
      }

      ${ROOT_SELECTOR} .email-deck::before {
        content: "";
        position: absolute;
        left: 50%;
        bottom: 4.5%;
        width: min(46rem, 88%);
        height: 8rem;
        border-radius: 50%;
        background: radial-gradient(ellipse at center, rgba(96, 38, 236, .22), rgba(96, 38, 236, .06) 45%, transparent 72%);
        filter: blur(18px);
        transform: translateX(-50%);
        pointer-events: none;
        opacity: .8;
      }

      ${ROOT_SELECTOR} .email-deck-card {
        top: 46%;
        left: 50%;
        width: clamp(13rem, 20vw, 19rem);
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
          transform 720ms cubic-bezier(.22, 1, .36, 1),
          opacity 520ms ease,
          filter 520ms ease;
        will-change: transform;
      }

      ${ROOT_SELECTOR} .email-deck.is-ready .email-deck-card {
        animation: none;
      }

      ${ROOT_SELECTOR} .email-deck-card .email-card-frame {
        min-height: clamp(22rem, 31vw, 29rem);
        padding: 0;
        border-color: rgba(255, 255, 255, .13);
        background: #111;
        box-shadow: 0 14px 34px rgba(0, 0, 0, .24);
        transition:
          border-color 520ms ease,
          box-shadow 520ms ease,
          transform 520ms cubic-bezier(.22, 1, .36, 1);
      }

      ${ROOT_SELECTOR} .email-card-frame img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      ${ROOT_SELECTOR} .email-deck-card::after {
        content: attr(data-fan-label);
        position: absolute;
        left: 50%;
        bottom: -2.35rem;
        width: max-content;
        max-width: 12rem;
        padding: .38rem .65rem;
        border: 1px solid rgba(255, 255, 255, .12);
        border-radius: 999px;
        background: rgba(13, 13, 13, .72);
        color: rgba(255, 255, 255, .74);
        font: 600 .68rem/1.2 var(--font-body);
        letter-spacing: .035em;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        opacity: 0;
        transform: translate(-50%, .35rem);
        transition: opacity 220ms ease, transform 220ms ease;
        pointer-events: none;
        backdrop-filter: blur(12px);
      }

      ${ROOT_SELECTOR} .email-deck-card:hover::after,
      ${ROOT_SELECTOR} .email-deck-card:focus-visible::after,
      ${ROOT_SELECTOR} .email-deck-card.is-selected::after {
        opacity: 1;
        transform: translate(-50%, 0);
      }

      ${ROOT_SELECTOR} .email-deck-card.is-selected {
        filter: saturate(1) brightness(1.02);
      }

      ${ROOT_SELECTOR} .email-deck-card.is-selected .email-card-frame {
        border-color: var(--color-accent-light);
        box-shadow:
          0 26px 65px rgba(0, 0, 0, .44),
          0 0 0 1px rgba(155, 92, 255, .15),
          0 0 42px rgba(96, 38, 236, .22);
      }

      ${ROOT_SELECTOR} .email-deck-card:hover:not(.is-selected),
      ${ROOT_SELECTOR} .email-deck-card:focus-visible:not(.is-selected) {
        --fan-hover-lift: -1.05rem;
        filter: saturate(1) brightness(1.05);
      }

      ${ROOT_SELECTOR} .email-deck-card:focus-visible {
        outline: 2px solid var(--color-accent-light);
        outline-offset: .3rem;
      }

      ${ROOT_SELECTOR} .email-deck-control {
        z-index: 80;
        width: 3rem;
        height: 3rem;
        background: rgba(18, 18, 18, .84);
        backdrop-filter: blur(14px);
      }

      ${ROOT_SELECTOR} .email-selected-details {
        position: relative;
        z-index: 90;
        margin-top: clamp(.5rem, 2vw, 1.5rem);
      }

      @media (max-width: 900px) {
        ${ROOT_SELECTOR} .email-deck {
          min-height: 34rem;
          overflow: hidden;
          margin-inline: -.5rem;
        }
        ${ROOT_SELECTOR} .email-deck-card {
          width: clamp(12.5rem, 33vw, 16rem);
        }
      }

      @media (max-width: 620px) {
        ${ROOT_SELECTOR} .email-deck-shell {
          grid-template-columns: 2.5rem minmax(0, 1fr) 2.5rem;
          gap: .2rem;
        }
        ${ROOT_SELECTOR} .email-deck {
          min-height: 29rem;
          perspective: none;
        }
        ${ROOT_SELECTOR} .email-deck-card {
          top: 45%;
          width: 12.75rem;
        }
        ${ROOT_SELECTOR} .email-deck-card .email-card-frame {
          min-height: 21rem;
        }
        ${ROOT_SELECTOR} .email-deck-control {
          width: 2.45rem;
          height: 2.45rem;
          font-size: 1rem;
        }
        ${ROOT_SELECTOR} .email-deck-card::after {
          display: none;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        ${ROOT_SELECTOR} .email-deck-card,
        ${ROOT_SELECTOR} .email-deck-card .email-card-frame,
        ${ROOT_SELECTOR} .email-deck-card::after {
          transition-duration: .01ms !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function projectTitleForCard(index) {
    var data = window.portfolioPlaceholderData;
    var emailSection = data && data.sections && data.sections.filter(function (section) { return section.id === 'email'; })[0];
    return emailSection && emailSection.projects && emailSection.projects[index]
      ? emailSection.projects[index].title
      : 'Email campaign';
  }

  function updateFanCard(card, index) {
    var rawOffset = parseFloat(card.style.getPropertyValue('--email-offset'));
    if (!Number.isFinite(rawOffset)) rawOffset = index;

    var distance = Math.abs(rawOffset);
    var viewport = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    var spacing = viewport <= 620 ? 42 : viewport <= 900 ? 56 : 72;
    var x = rawOffset * spacing;
    var y = Math.pow(distance, 1.42) * (viewport <= 620 ? 10 : 14);
    var rotate = rawOffset * (viewport <= 620 ? 5.4 : 7.2);
    var yRotate = rawOffset * -2.25;
    var scale = Math.max(viewport <= 620 ? .72 : .68, 1 - distance * (viewport <= 620 ? .085 : .07));
    var opacity = Math.max(.28, 1 - distance * .115);
    var saturation = Math.max(.55, 1 - distance * .095);
    var brightness = Math.max(.64, 1 - distance * .065);
    var z = Math.max(-180, -distance * 26);

    if (card.classList.contains('is-selected')) {
      y = -18;
      scale = viewport <= 620 ? 1 : 1.045;
      opacity = 1;
      saturation = 1;
      brightness = 1.02;
      z = 42;
      rotate = 0;
      yRotate = 0;
    }

    card.style.setProperty('--fan-x', x.toFixed(2) + 'px');
    card.style.setProperty('--fan-y', 'calc(' + y.toFixed(2) + 'px + var(--fan-hover-lift, 0px))');
    card.style.setProperty('--fan-z', z.toFixed(2) + 'px');
    card.style.setProperty('--fan-rotate', rotate.toFixed(2) + 'deg');
    card.style.setProperty('--fan-y-rotate', yRotate.toFixed(2) + 'deg');
    card.style.setProperty('--fan-scale', scale.toFixed(3));
    card.style.setProperty('--fan-opacity', opacity.toFixed(3));
    card.style.setProperty('--fan-saturation', saturation.toFixed(3));
    card.style.setProperty('--fan-brightness', brightness.toFixed(3));
  }

  function enhance(root) {
    if (!root || root.dataset.fanCarouselEnhanced === 'true') return;
    var deck = root.querySelector('.email-deck');
    if (!deck) return;

    root.dataset.fanCarouselEnhanced = 'true';
    root.classList.add('email-fan-carousel');

    var cards = Array.prototype.slice.call(deck.querySelectorAll('.email-deck-card'));
    cards.forEach(function (card, index) {
      card.dataset.fanLabel = projectTitleForCard(index);
      updateFanCard(card, index);
    });

    // Existing portfolio.js updates every card's --email-offset and then toggles
    // the selected class. Watching only class changes lets us resample the new
    // offsets after each selection without observing our own style writes.
    var scheduled = false;
    var observer = new MutationObserver(function () {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(function () {
        cards.forEach(updateFanCard);
        scheduled = false;
      });
    });
    cards.forEach(function (card) {
      observer.observe(card, { attributes: true, attributeFilter: ['class'] });
    });

    var resizeTimer;
    window.addEventListener('resize', function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        cards.forEach(updateFanCard);
      }, 100);
    }, { passive: true });
  }

  function init() {
    installStyles();
    var root = document.querySelector(ROOT_SELECTOR);
    if (root) {
      enhance(root);
      return;
    }

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
