// Click-to-load embed for live prototypes: the poster image shows until the visitor launches it,
// so the third-party page never loads (or steals scroll) unless someone asks for it.
(function () {
  'use strict';
  document.querySelectorAll('[data-prototype-embed]').forEach(function (frame) {
    var launch = frame.querySelector('[data-prototype-launch]');
    if (!launch) return;
    launch.addEventListener('click', function () {
      var iframe = document.createElement('iframe');
      iframe.src = frame.dataset.src;
      iframe.title = frame.dataset.title || 'Interactive prototype';
      iframe.loading = 'lazy';
      iframe.allow = 'fullscreen';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.classList.add('is-live');
      frame.replaceChildren(iframe);
      iframe.focus();
    });
  });
}());
