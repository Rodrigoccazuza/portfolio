// Final responsive hero layer. Keeps the original hero photograph visible while
// allowing Mesh Drift to remain the background for the rest of the portfolio.
(function () {
  'use strict';
  if (!document.body.classList.contains('portfolio-redesign')) return;
  if (document.getElementById('hero-responsive-fix-styles')) return;

  var style = document.createElement('style');
  style.id = 'hero-responsive-fix-styles';
  style.textContent = `
    /* HERO: restore the original photograph. This intentionally wins over the
       shader integration's earlier opacity rule. */
    body.portfolio-redesign .portfolio-hero {
      position: relative;
      min-height: min(900px, 100svh);
      margin: clamp(1rem, 2.5vw, 2rem) !important;
      border-radius: clamp(1.5rem, 3vw, 3.5rem) !important;
      overflow: hidden !important;
      isolation: isolate;
      background: #06060a !important;
    }

    body.portfolio-redesign .portfolio-hero .hero-background {
      display: block !important;
      position: absolute;
      inset: 0;
      z-index: -2;
      width: 100%;
      height: 100%;
      opacity: 1 !important;
      visibility: visible !important;
      object-fit: cover;
      object-position: center;
      pointer-events: none;
    }

    body.portfolio-redesign .portfolio-hero::after {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -1;
      pointer-events: none;
      background:
        linear-gradient(90deg, rgba(0,0,0,.90) 0%, rgba(0,0,0,.68) 44%, rgba(0,0,0,.24) 74%, rgba(0,0,0,.14) 100%),
        linear-gradient(0deg, rgba(0,0,0,.86) 0%, rgba(0,0,0,.14) 48%, rgba(0,0,0,.12) 100%) !important;
    }

    body.portfolio-redesign .portfolio-hero .hero-inner {
      min-height: inherit;
      display: grid;
      grid-template-columns: minmax(0, 1.25fr) minmax(18rem, .75fr);
      grid-template-rows: 1fr auto;
      align-items: center;
      gap: clamp(2rem, 5vw, 5rem);
      padding-top: clamp(8.5rem, 15vh, 11rem);
      padding-bottom: clamp(2rem, 4vw, 3rem);
    }

    body.portfolio-redesign .portfolio-hero .hero-intro { align-self: center; }
    body.portfolio-redesign .portfolio-hero .hero-kicker {
      margin-bottom: .9rem;
      font-size: clamp(1.1rem, 1.6vw, 1.55rem);
    }
    body.portfolio-redesign .portfolio-hero h1 {
      max-width: 9ch;
      margin: 0;
      color: #fff;
      font-size: clamp(4.5rem, 8vw, 8.3rem);
      line-height: .82;
      letter-spacing: -.06em;
      text-wrap: normal;
    }
    body.portfolio-redesign .portfolio-hero h1 > span:first-child { font-size: .72em; }
    body.portfolio-redesign .portfolio-hero h1 .accent-italic {
      margin-top: .1em;
      font-size: .88em;
      color: var(--color-green);
    }

    body.portfolio-redesign .portfolio-hero .hero-statement {
      width: 100%;
      max-width: 29rem;
      padding-top: 0;
      align-self: center;
    }
    body.portfolio-redesign .portfolio-hero .hero-statement-title {
      max-width: 23ch;
      color: #fff;
      font-size: clamp(1.3rem, 1.8vw, 1.8rem);
      line-height: 1.2;
    }
    body.portfolio-redesign .portfolio-hero .hero-statement > p:last-of-type {
      max-width: 39ch;
      color: rgba(255,255,255,.74);
      font-size: clamp(1rem, 1.1vw, 1.13rem);
      line-height: 1.55;
    }
    body.portfolio-redesign .portfolio-hero .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: .75rem;
      margin-top: 1.75rem;
    }
    body.portfolio-redesign .portfolio-hero .hero-actions .btn {
      min-height: 3.2rem;
      justify-content: center;
    }

    body.portfolio-redesign .portfolio-hero .hero-services {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: repeat(4, minmax(0,1fr));
      gap: clamp(1rem, 3vw, 3rem);
      padding-top: 1.25rem;
      border-top: 1px solid rgba(255,255,255,.16);
    }
    body.portfolio-redesign .portfolio-hero .hero-services strong {
      max-width: 18ch;
      color: rgba(255,255,255,.84);
      line-height: 1.35;
    }

    /* Header: keep controls fully inside the viewport/safe area. */
    body.home-page.portfolio-redesign .site-header {
      box-sizing: border-box;
      left: max(clamp(1rem, 2.5vw, 2rem), env(safe-area-inset-left));
      right: max(clamp(1rem, 2.5vw, 2rem), env(safe-area-inset-right));
      top: max(clamp(1rem, 2.5vw, 2rem), env(safe-area-inset-top));
      width: auto;
    }
    body.home-page.portfolio-redesign .site-header .container {
      width: 100%;
      max-width: none;
      padding-inline: 0;
    }
    body.home-page.portfolio-redesign .nav-toggle {
      box-sizing: border-box;
      flex: 0 0 auto;
      width: 3.25rem;
      height: 3.25rem;
      padding: .65rem;
      border: 1px solid rgba(255,255,255,.34);
      border-radius: 1rem;
      background: rgba(4,3,12,.42);
      backdrop-filter: blur(12px);
      overflow: visible;
    }
    body.home-page.portfolio-redesign .nav-toggle .bar {
      width: 100%;
      margin: 3px 0;
      background: #fff;
    }

    @media (max-width: 900px) {
      body.portfolio-redesign .portfolio-hero {
        min-height: auto;
        margin: .75rem !important;
        border-radius: 1.75rem !important;
      }
      body.portfolio-redesign .portfolio-hero .hero-background {
        object-position: 58% center;
      }
      body.portfolio-redesign .portfolio-hero::after {
        background:
          linear-gradient(90deg, rgba(0,0,0,.88), rgba(0,0,0,.48)),
          linear-gradient(0deg, rgba(0,0,0,.92), rgba(0,0,0,.08) 62%) !important;
      }
      body.portfolio-redesign .portfolio-hero .hero-inner {
        grid-template-columns: 1fr;
        grid-template-rows: auto;
        gap: 1.75rem;
        min-height: 100svh;
        padding-top: 7.5rem;
        padding-bottom: 2rem;
      }
      body.portfolio-redesign .portfolio-hero h1 {
        max-width: 100%;
        font-size: clamp(3.35rem, 14vw, 5.6rem);
      }
      body.portfolio-redesign .portfolio-hero .hero-statement {
        max-width: 35rem;
        margin-top: .35rem;
      }
      body.portfolio-redesign .portfolio-hero .hero-actions {
        display: grid;
        grid-template-columns: repeat(2, minmax(0,1fr));
      }
      body.portfolio-redesign .portfolio-hero .hero-services {
        grid-column: 1;
        grid-template-columns: repeat(2, minmax(0,1fr));
        gap: 1rem;
        margin-top: .5rem;
      }
      body.home-page.portfolio-redesign .site-header {
        left: max(1.25rem, env(safe-area-inset-left));
        right: max(1.25rem, env(safe-area-inset-right));
        top: max(1.25rem, env(safe-area-inset-top));
      }
    }

    @media (max-width: 540px) {
      body.portfolio-redesign .portfolio-hero {
        margin: .5rem !important;
        border-radius: 1.5rem !important;
      }
      body.portfolio-redesign .portfolio-hero .hero-inner {
        min-height: auto;
        padding-top: 7rem;
        padding-bottom: 1.5rem;
        gap: 1.45rem;
      }
      body.portfolio-redesign .portfolio-hero .hero-kicker {
        margin-bottom: .65rem;
        font-size: 1.05rem;
      }
      body.portfolio-redesign .portfolio-hero h1 {
        font-size: clamp(3rem, 14vw, 4.5rem);
        line-height: .84;
      }
      body.portfolio-redesign .portfolio-hero .hero-statement-title {
        font-size: clamp(1.2rem, 5.4vw, 1.5rem);
      }
      body.portfolio-redesign .portfolio-hero .hero-statement > p:last-of-type {
        font-size: clamp(.95rem, 4vw, 1.05rem);
      }
      body.portfolio-redesign .portfolio-hero .hero-actions {
        grid-template-columns: 1fr;
        gap: .65rem;
        margin-top: 1.35rem;
      }
      body.portfolio-redesign .portfolio-hero .hero-actions .btn {
        width: 100%;
        min-height: 3.1rem;
      }
      body.portfolio-redesign .portfolio-hero .hero-services {
        margin-top: .25rem;
        padding-top: 1rem;
      }
      body.home-page.portfolio-redesign .nav-logo img {
        width: 8.8rem;
        height: auto;
      }
      body.home-page.portfolio-redesign .nav-toggle {
        width: 3rem;
        height: 3rem;
        border-radius: .9rem;
      }
    }
  `;

  document.head.appendChild(style);
})();
