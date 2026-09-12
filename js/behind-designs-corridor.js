// Behind the Designs: perspective image-stream corridor adapted from the supplied reference.
// Keeps the existing portfolio data and media-viewer behavior while matching the site's native HTML/CSS/JS stack.
(function () {
  'use strict';

  var gallery = document.getElementById('behind-designs-gallery');
  if (!gallery) return;

  var PATH = {
    perspective: 30,
    cardWidth: 18,
    cardHeight: 25,
    cardRadius: 0.85,
    birthHeight: 2.7,
    exitHeight: 48,
    railBirth: -11,
    railExit: 45,
    fan: 3.3,
    turnBirth: 6,
    turnExit: 28,
    stops: 24
  };

  var cards = 9;
  var speed = 18;
  var axis = 52;
  var initialized = false;

  function keyframes(dir, name, p) {
    var steps = [];
    for (var s = 0; s <= p.stops; s += 1) {
      var u = s / p.stops;
      var scale = (p.birthHeight / p.cardHeight) * Math.pow(p.exitHeight / p.birthHeight, u);
      var z = p.perspective * (1 - 1 / scale);
      var rail = p.railExit - (p.railExit - p.railBirth) * Math.pow(1 - u, p.fan);
      var turn = p.turnBirth + (p.turnExit - p.turnBirth) * u;
      steps.push(
        (u * 100).toFixed(2) + '%{transform:translate3d(' +
        (dir * rail).toFixed(2) + 'cqw,0,' + z.toFixed(2) + 'cqw) rotateY(' +
        (-dir * turn).toFixed(2) + 'deg)}'
      );
    }
    return '@keyframes ' + name + '{' + steps.join('') + '}';
  }

  function installStyles() {
    if (document.getElementById('behind-designs-corridor-styles')) return;
    var style = document.createElement('style');
    style.id = 'behind-designs-corridor-styles';
    style.textContent = [
      '.behind-designs{position:relative;isolation:isolate;}',
      '.behind-designs-heading{position:relative;z-index:5;}',
      '.behind-designs-gallery.behind-designs-corridor{position:relative;width:100%;height:clamp(27rem,52vw,43rem);margin-top:clamp(1.5rem,3vw,3rem);padding:0;overflow:hidden;container-type:inline-size;perspective:none;mask-image:linear-gradient(180deg,transparent 0,#000 8%,#000 92%,transparent 100%);}',
      '.behind-designs-corridor .behind-designs-track{display:none!important;animation:none!important;}',
      '.behind-designs-corridor-stage{pointer-events:none;position:absolute;inset:0;overflow:hidden;}',
      '.behind-designs-corridor-space{position:absolute;inset:0;transform-style:preserve-3d;}',
      '.behind-designs-corridor-card{pointer-events:auto;position:absolute;left:50%;top:' + axis + '%;width:' + PATH.cardWidth + 'cqw;height:' + PATH.cardHeight + 'cqw;margin-left:' + (-PATH.cardWidth / 2) + 'cqw;margin-top:' + (-PATH.cardHeight / 2) + 'cqw;padding:0;border:0;border-radius:' + PATH.cardRadius + 'cqw;overflow:hidden;background:var(--color-surface-raised);box-shadow:0 20px 60px rgba(0,0,0,.24);backface-visibility:hidden;will-change:transform;cursor:zoom-in;}',
      '.behind-designs-corridor-card .showcase-tile-media{display:block;width:100%;height:100%;aspect-ratio:auto;border:1px solid rgba(255,255,255,.14);border-radius:inherit;overflow:hidden;background:var(--color-surface-raised);transition:border-color 220ms ease,box-shadow 220ms ease,filter 220ms ease;}',
      '.behind-designs-corridor-card .showcase-tile-media::before,.behind-designs-corridor-card .showcase-tile-media::after{display:none!important;}',
      '.behind-designs-corridor-card img{width:100%;height:100%;object-fit:cover;display:block;}',
      '.behind-designs-corridor-card:hover .showcase-tile-media,.behind-designs-corridor-card:focus-visible .showcase-tile-media{border-color:var(--color-accent-light);box-shadow:0 0 0 1px var(--color-accent-light),var(--shadow-glow);filter:saturate(1.06) brightness(1.04);}',
      '.behind-designs-corridor-card:focus-visible{outline:2px solid var(--color-accent-light);outline-offset:3px;}',
      '.behind-designs-corridor::before{content:"";position:absolute;z-index:2;left:50%;top:' + axis + '%;width:min(34rem,58vw);height:min(14rem,30vw);transform:translate(-50%,-50%);border-radius:999px;background:radial-gradient(ellipse,rgba(0,0,0,.5) 0,rgba(0,0,0,.22) 38%,transparent 72%);filter:blur(18px);pointer-events:none;}',
      '.behind-designs-corridor::after{content:"";position:absolute;z-index:3;inset:0;pointer-events:none;background:linear-gradient(90deg,var(--color-background) 0,transparent 10%,transparent 90%,var(--color-background) 100%);}',
      '@media(max-width:760px){.behind-designs-gallery.behind-designs-corridor{height:clamp(24rem,92vw,34rem)}.behind-designs-corridor-card{width:24cqw;height:33cqw;margin-left:-12cqw;margin-top:-16.5cqw}.behind-designs-corridor::before{width:70vw;height:30vw}}',
      '@media(prefers-reduced-motion:reduce){.behind-designs-corridor-card{animation-play-state:paused!important}}',
      keyframes(1, 'behind-corridor-right', PATH),
      keyframes(-1, 'behind-corridor-left', PATH)
    ].join('');
    document.head.appendChild(style);
  }

  function cloneCard(template, railName, railIndex, sourceIndex, interactive) {
    var clone = template.cloneNode(true);
    clone.className = 'behind-designs-corridor-card';
    clone.removeAttribute('style');
    clone.setAttribute('aria-label', template.getAttribute('aria-label') || 'Open portfolio preview');
    clone.tabIndex = interactive ? 0 : -1;
    if (!interactive) clone.setAttribute('aria-hidden', 'true');
    clone.style.animation = railName + ' ' + speed + 's linear infinite';
    clone.style.animationDelay = (-(railIndex * speed) / cards) + 's';
    clone.addEventListener('click', function () { template.click(); });
    clone.dataset.sourceIndex = String(sourceIndex);
    return clone;
  }

  function init() {
    if (initialized) return;
    var track = gallery.querySelector('.behind-designs-track');
    var firstGroup = track && track.querySelector('.behind-designs-group');
    if (!firstGroup) return;

    var templates = Array.prototype.slice.call(firstGroup.querySelectorAll('.showcase-tile'));
    if (!templates.length) return;
    initialized = true;

    installStyles();
    gallery.classList.add('behind-designs-corridor');

    var stage = document.createElement('div');
    stage.className = 'behind-designs-corridor-stage';
    stage.setAttribute('aria-label', 'Selected portfolio work moving through a perspective image corridor');
    stage.style.perspective = PATH.perspective + 'cqw';
    stage.style.perspectiveOrigin = '50% ' + axis + '%';

    var space = document.createElement('div');
    space.className = 'behind-designs-corridor-space';

    ['behind-corridor-right', 'behind-corridor-left'].forEach(function (railName, rail) {
      for (var i = 0; i < cards; i += 1) {
        var sourceIndex = i % templates.length;
        var isPrimaryAccessibleCopy = rail === 0 && i < templates.length;
        space.appendChild(cloneCard(templates[sourceIndex], railName, i, sourceIndex, isPrimaryAccessibleCopy));
      }
    });

    stage.appendChild(space);
    gallery.appendChild(stage);

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches) {
      Array.prototype.forEach.call(space.children, function (card) {
        card.style.animationPlayState = 'paused';
      });
    }
  }

  init();
  if (initialized) return;

  var observer = new MutationObserver(function () {
    init();
    if (initialized) observer.disconnect();
  });
  observer.observe(gallery, { childList: true, subtree: true });
}());
