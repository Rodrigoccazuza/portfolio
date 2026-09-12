// Aurora treatment for the stacked website cards on the portfolio homepage.
// Native HTML/CSS/JS adaptation of the supplied React + Framer Motion reference.
(function () {
  'use strict';

  var STYLE_ID = 'website-aurora-card-styles';
  var CARD_SELECTOR = '.websites-showcase .website-layer';
  var STAR_COUNT = 18;

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      '.websites-showcase{--aurora-color-1:rgba(168,85,247,.22);--aurora-color-2:rgba(79,70,229,.22);--aurora-color-3:rgba(217,70,239,.16);}',
      '.website-layer.aurora-card{isolation:isolate;overflow:hidden;background:rgba(18,18,22,.78);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);}',
      '.website-layer.aurora-card>.aurora-card-bg{position:absolute;inset:0;z-index:-1;overflow:hidden;pointer-events:none;border-radius:inherit;}',
      '.website-layer.aurora-card>.aurora-card-bg::before{content:"";position:absolute;inset:-18%;background-image:radial-gradient(circle at 24% 28%,var(--aurora-color-1) 0%,transparent 52%),radial-gradient(circle at 76% 72%,var(--aurora-color-2) 0%,transparent 54%);opacity:.62;animation:aurora-card-pulse 9s ease-in-out infinite;transform-origin:center;}',
      '.aurora-card-blob{position:absolute;border-radius:999px;filter:blur(46px);mix-blend-mode:screen;opacity:.42;will-change:transform;}',
      '.aurora-card-blob--one{top:-42%;left:-18%;width:52%;aspect-ratio:1;background:rgba(147,51,234,.78);animation:aurora-card-drift-one 28s ease-in-out infinite alternate;}',
      '.aurora-card-blob--two{right:-18%;bottom:-48%;width:56%;aspect-ratio:1;background:rgba(217,70,239,.68);animation:aurora-card-drift-two 36s ease-in-out infinite alternate;}',
      '.aurora-card-blob--three{top:20%;left:38%;width:34%;aspect-ratio:1;background:rgba(67,56,202,.6);opacity:.32;animation:aurora-card-drift-three 44s ease-in-out infinite alternate;}',
      '.aurora-card-star{position:absolute;width:2px;height:2px;border-radius:50%;background:#fff;opacity:0;box-shadow:0 0 7px rgba(255,255,255,.55);animation:aurora-card-twinkle var(--star-duration,4s) ease-in-out infinite;animation-delay:var(--star-delay,0s);}',
      '.website-layer.aurora-card::after{content:"";position:absolute;inset:0;z-index:-1;border-radius:inherit;background:linear-gradient(120deg,rgba(255,255,255,.035),transparent 42%,rgba(155,92,255,.035));pointer-events:none;}',
      '.website-layer.aurora-card:hover,.website-layer.aurora-card.is-selected{border-color:rgba(155,92,255,.62);box-shadow:0 18px 54px rgba(73,35,140,.22),inset 0 1px 0 rgba(255,255,255,.045);}',
      '.website-layer.aurora-card.is-selected>.aurora-card-bg::before{opacity:.82;}',
      '@keyframes aurora-card-pulse{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:.74;transform:scale(1.06)}}',
      '@keyframes aurora-card-drift-one{0%{transform:translate3d(-8%,-4%,0) scale(1)}100%{transform:translate3d(26%,18%,0) scale(1.18)}}',
      '@keyframes aurora-card-drift-two{0%{transform:translate3d(10%,12%,0) scale(1)}100%{transform:translate3d(-24%,-18%,0) scale(1.24)}}',
      '@keyframes aurora-card-drift-three{0%{transform:translate3d(8%,-10%,0) rotate(0deg)}100%{transform:translate3d(-18%,20%,0) rotate(150deg)}}',
      '@keyframes aurora-card-twinkle{0%,100%{opacity:0;transform:scale(.8)}45%{opacity:var(--star-opacity,.55);transform:scale(1.15)}60%{opacity:.08}}',
      '@media(max-width:860px){.aurora-card-blob{filter:blur(34px)}.aurora-card-star:nth-of-type(n+12){display:none}}',
      '@media(prefers-reduced-motion:reduce){.website-layer.aurora-card>.aurora-card-bg::before,.aurora-card-blob,.aurora-card-star{animation:none!important}.website-layer.aurora-card>.aurora-card-bg::before{opacity:.55}.aurora-card-star{opacity:.18}}'
    ].join('');
    document.head.appendChild(style);
  }

  function pseudoRandom(seed) {
    var x = Math.sin(seed * 999.91) * 43758.5453;
    return x - Math.floor(x);
  }

  function makeStar(cardIndex, starIndex) {
    var star = document.createElement('i');
    star.className = 'aurora-card-star';
    star.setAttribute('aria-hidden', 'true');
    var seed = (cardIndex + 1) * 97 + starIndex * 31;
    star.style.left = (6 + pseudoRandom(seed) * 88).toFixed(2) + '%';
    star.style.top = (8 + pseudoRandom(seed + 5) * 84).toFixed(2) + '%';
    star.style.setProperty('--star-opacity', (.18 + pseudoRandom(seed + 11) * .52).toFixed(2));
    star.style.setProperty('--star-duration', (2.8 + pseudoRandom(seed + 17) * 3.2).toFixed(2) + 's');
    star.style.setProperty('--star-delay', (-pseudoRandom(seed + 23) * 5).toFixed(2) + 's');
    return star;
  }

  function enhanceCard(card, cardIndex) {
    if (card.classList.contains('aurora-card')) return;
    card.classList.add('aurora-card');

    var background = document.createElement('span');
    background.className = 'aurora-card-bg';
    background.setAttribute('aria-hidden', 'true');

    ['one', 'two', 'three'].forEach(function (name) {
      var blob = document.createElement('i');
      blob.className = 'aurora-card-blob aurora-card-blob--' + name;
      background.appendChild(blob);
    });

    for (var i = 0; i < STAR_COUNT; i += 1) {
      background.appendChild(makeStar(cardIndex, i));
    }

    card.insertBefore(background, card.firstChild);
  }

  function enhanceAll() {
    var cards = document.querySelectorAll(CARD_SELECTOR);
    if (!cards.length) return false;
    injectStyles();
    Array.prototype.forEach.call(cards, enhanceCard);
    return true;
  }

  if (enhanceAll()) return;

  var observer = new MutationObserver(function () {
    if (enhanceAll()) observer.disconnect();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  window.setTimeout(function () { observer.disconnect(); }, 12000);
}());
