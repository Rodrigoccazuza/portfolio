// Restore the original portfolio hero presentation while keeping Mesh Drift elsewhere.
(function () {
  'use strict';
  if (!document.body.classList.contains('portfolio-redesign')) return;
  if (document.getElementById('hero-legacy-restore-styles')) return;

  var style = document.createElement('style');
  style.id = 'hero-legacy-restore-styles';
  style.textContent = `
    /* The shader background is site-wide, but the hero keeps its original photo. */
    body.portfolio-redesign .portfolio-hero .hero-background {
      opacity: 1 !important;
      visibility: visible !important;
      pointer-events: none;
    }

    /* Restore the original homepage hero overlay from portfolio.css. */
    body.portfolio-redesign .portfolio-hero::after {
      background:
        linear-gradient(90deg, rgba(0,0,0,.96), rgba(0,0,0,.62) 55%, rgba(0,0,0,.22)),
        linear-gradient(0deg, rgba(0,0,0,.9), transparent 52%) !important;
    }
  `;

  document.head.appendChild(style);
})();
