// Shared fullscreen viewer for brand-deck galleries and image lightboxes.
// Usage: wrap a set of trigger buttons in [data-viewer-group="name"], each
// with data-viewer-src, data-viewer-alt, data-viewer-caption, data-viewer-number.
(function () {
  var groups = {};
  document.querySelectorAll('[data-viewer-group]').forEach(function (trigger) {
    var group = trigger.getAttribute('data-viewer-group');
    (groups[group] = groups[group] || []).push(trigger);
  });
  if (!Object.keys(groups).length) return;

  var overlay = document.createElement('div');
  overlay.className = 'viewer-overlay';
  overlay.hidden = true;
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.innerHTML =
    '<button class="viewer-close" aria-label="Close viewer">&#10005;</button>' +
    '<button class="viewer-prev" aria-label="Previous page">&#10094;</button>' +
    '<figure class="viewer-figure">' +
      '<img alt="" />' +
      '<figcaption class="viewer-caption"></figcaption>' +
    '</figure>' +
    '<button class="viewer-next" aria-label="Next page">&#10095;</button>';
  document.body.appendChild(overlay);

  var imgEl = overlay.querySelector('img');
  var captionEl = overlay.querySelector('.viewer-caption');
  var closeBtn = overlay.querySelector('.viewer-close');
  var prevBtn = overlay.querySelector('.viewer-prev');
  var nextBtn = overlay.querySelector('.viewer-next');

  var activeGroup = [];
  var activeIndex = 0;
  var lastFocused = null;
  var touchStartX = null;

  function render() {
    var trigger = activeGroup[activeIndex];
    imgEl.src = trigger.getAttribute('data-viewer-src');
    imgEl.alt = trigger.getAttribute('data-viewer-alt') || '';
    var number = trigger.getAttribute('data-viewer-number');
    var caption = trigger.getAttribute('data-viewer-caption') || '';
    captionEl.textContent = (number ? number + ' — ' : '') + caption;
    prevBtn.hidden = activeGroup.length < 2;
    nextBtn.hidden = activeGroup.length < 2;
  }

  function open(group, index) {
    activeGroup = groups[group];
    activeIndex = index;
    lastFocused = document.activeElement;
    render();
    overlay.hidden = false;
    closeBtn.focus();
    document.addEventListener('keydown', onKeydown);
  }

  function close() {
    overlay.hidden = true;
    document.removeEventListener('keydown', onKeydown);
    if (lastFocused) lastFocused.focus();
  }

  function step(delta) {
    activeIndex = (activeIndex + delta + activeGroup.length) % activeGroup.length;
    render();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'Tab') {
      var focusables = [closeBtn, prevBtn, nextBtn].filter(function (el) { return !el.hidden; });
      var idx = focusables.indexOf(document.activeElement);
      e.preventDefault();
      var next = e.shiftKey ? (idx <= 0 ? focusables.length - 1 : idx - 1) : (idx === focusables.length - 1 ? 0 : idx + 1);
      focusables[next].focus();
    }
  }

  overlay.addEventListener('touchstart', function (e) { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  overlay.addEventListener('touchend', function (e) {
    if (touchStartX === null) return;
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) step(dx > 0 ? -1 : 1);
    touchStartX = null;
  }, { passive: true });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', function () { step(-1); });
  nextBtn.addEventListener('click', function () { step(1); });
  overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });

  Object.keys(groups).forEach(function (group) {
    groups[group].forEach(function (trigger, index) {
      trigger.addEventListener('click', function () { open(group, index); });
      trigger.setAttribute('type', 'button');
    });
  });
})();
