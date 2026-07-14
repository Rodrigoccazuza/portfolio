// Work-page category filtering. Progressive enhancement: without JS every
// project is still visible and every category still has its own real URL
// (see /work/<category>/), this only powers the optional in-page filter UI.
(function () {
  var bar = document.querySelector('[data-filter-bar]');
  if (!bar) return;
  var chips = Array.prototype.slice.call(bar.querySelectorAll('.filter-chip'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-project-card]'));
  var liveRegion = document.querySelector('[data-filter-status]');

  function applyFilter(category) {
    var shown = 0;
    cards.forEach(function (card) {
      var cats = (card.getAttribute('data-categories') || '').split(',');
      var match = category === 'all' || cats.indexOf(category) !== -1;
      card.hidden = !match;
      if (match) shown++;
    });
    if (liveRegion) {
      liveRegion.textContent = shown + (shown === 1 ? ' project shown' : ' projects shown');
    }
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
      chip.setAttribute('aria-pressed', 'true');
      applyFilter(chip.getAttribute('data-filter'));
    });
  });

  var requested = new URLSearchParams(window.location.search).get('filter');
  var requestedChip = chips.find(function (chip) {
    return chip.getAttribute('data-filter') === requested;
  });
  if (requestedChip) {
    chips.forEach(function (chip) { chip.setAttribute('aria-pressed', 'false'); });
    requestedChip.setAttribute('aria-pressed', 'true');
    applyFilter(requested);
    requestedChip.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  } else {
    applyFilter('all');
  }
})();
