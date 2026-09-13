// Responsive hero corrections for the Mesh Drift background integration.
// Restores a full-bleed hero and prevents the legacy image-card geometry from
// constraining the homepage on desktop, tablet, and mobile.
(function () {
  'use strict';

  if (!document.body.classList.contains('portfolio-redesign')) return;
  if (document.getElementById('hero-responsive-fix-styles')) return;

  var style = document.createElement('style');
  style.id = 'hero-responsive-fix-styles';
  style.textContent = `
    body.portfolio-redesign .portfolio-hero {
      min-height: 100svh;
      margin: 0 !important;
      border-radius: 0 !important;
      background: transparent !important;
      overflow: clip;
      isolation: isolate;
    }

    body.portfolio-redesign .portfolio-hero::after {
      background:
        linear-gradient(90deg, rgba(2,1,10,.78) 0%, rgba(2,1,10,.5) 43%, rgba(2,1,10,.16) 75%, rgba(2,1,10,.06) 100%),
        linear-gradient(0deg, rgba(2,1,10,.68) 0%, rgba(2,1,10,.08) 50%, rgba(2,1,10,.2) 100%) !important;
    }

    body.portfolio-redesign .portfolio-hero .hero-inner {
      width: min(100%, var(--container-width));
      min-height: 100svh;
      margin-inline: auto;
      display: grid;
      grid-template-columns: minmax(0, 1.25fr) minmax(20rem, .75fr);
      grid-template-rows: 1fr auto;
      align-items: center;
      column-gap: clamp(3rem, 7vw, 8rem);
      row-gap: clamp(2rem, 4vw, 4rem);
      padding-top: clamp(9rem, 15vh, 11rem);
      padding-bottom: clamp(2rem, 5vh, 4rem);
    }

    body.portfolio-redesign .portfolio-hero .hero-intro,
    body.portfolio-redesign .portfolio-hero .hero-statement {
      align-self: center;
    }

    body.portfolio-redesign .portfolio-hero .hero-intro {
      max-width: min(100%, 57rem);
    }

    body.portfolio-redesign .portfolio-hero .hero-kicker {
      margin-bottom: clamp(.75rem, 1.5vw, 1.25rem);
      font-size: clamp(1.1rem, 1.55vw, 1.55rem);
    }

    body.portfolio-redesign .portfolio-hero h1 {
      max-width: 8.8ch;
      font-size: clamp(4.8rem, 8.1vw, 8.9rem);
      line-height: .8;
      letter-spacing: -.065em;
      text-wrap: normal;
    }

    body.portfolio-redesign .portfolio-hero h1 > span:first-child {
      font-size: .7em;
    }

    body.portfolio-redesign .portfolio-hero h1 .accent-italic {
      margin-top: .1em;
      font-size: .88em;
    }

    body.portfolio-redesign .portfolio-hero .hero-statement {
      width: 100%;
      max-width: 29rem;
      padding-top: 0;
    }

    body.portfolio-redesign .portfolio-hero .hero-statement-title {
      max-width: 22ch;
      font-size: clamp(1.35rem, 1.75vw, 1.85rem);
      line-height: 1.18;
    }

    body.portfolio-redesign .portfolio-hero .hero-statement > p:last-of-type {
      max-width: 38ch;
      font-size: clamp(1rem, 1.15vw, 1.16rem);
      line-height: 1.6;
    }

    body.portfolio-redesign .portfolio-hero .hero-actions {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: .75rem;
      margin-top: clamp(1.5rem, 2.8vw, 2.4rem);
    }

    body.portfolio-redesign .portfolio-hero .hero-actions .btn {
      width: 100%;
      justify-content: center;
      min-height: 3.25rem;
    }

    body.portfolio-redesign .portfolio-hero .hero-services {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: clamp(1.25rem, 4vw, 4rem);
      padding-top: clamp(1.25rem, 2.5vw, 2.25rem);
      border-top: 1px solid rgba(255,255,255,.12);
    }

    body.portfolio-redesign .portfolio-hero .hero-services div {
      min-width: 0;
    }

    body.portfolio-redesign .portfolio-hero .hero-services span {
      font-size: .8rem;
    }

    body.portfolio-redesign .portfolio-hero .hero-services strong {
      max-width: 18ch;
      font-size: clamp(.78rem, .9vw, .92rem);
      line-height: 1.35;
    }

    @media (max-width: 980px) {
      body.portfolio-redesign .portfolio-hero .hero-inner {
        grid-template-columns: minmax(0, 1fr) minmax(17rem, .72fr);
        column-gap: clamp(2rem, 5vw, 4rem);
      }

      body.portfolio-redesign .portfolio-hero h1 {
        font-size: clamp(4.3rem, 10vw, 7.2rem);
      }
    }

    @media (max-width: 760px) {
      body.portfolio-redesign .portfolio-hero {
        min-height: auto;
      }

      body.portfolio-redesign .portfolio-hero::after {
        background:
          linear-gradient(180deg, rgba(2,1,10,.18) 0%, rgba(2,1,10,.42) 24%, rgba(2,1,10,.8) 68%, rgba(2,1,10,.92) 100%) !important;
      }

      body.portfolio-redesign .portfolio-hero .hero-inner {
        min-height: 100svh;
        grid-template-columns: 1fr;
        grid-template-rows: auto auto auto;
        gap: 0;
        align-content: start;
        padding-top: clamp(8rem, 18vh, 10rem);
        padding-bottom: 2rem;
      }

      body.portfolio-redesign .portfolio-hero .hero-intro,
      body.portfolio-redesign .portfolio-hero .hero-statement {
        max-width: none;
      }

      body.portfolio-redesign .portfolio-hero .hero-kicker {
        margin-bottom: .85rem;
        font-size: clamp(1.05rem, 4.8vw, 1.3rem);
      }

      body.portfolio-redesign .portfolio-hero h1 {
        max-width: 100%;
        font-size: clamp(3.35rem, 15.5vw, 5.8rem);
        line-height: .82;
      }

      body.portfolio-redesign .portfolio-hero h1 > span:first-child {
        font-size: .72em;
      }

      body.portfolio-redesign .portfolio-hero .hero-statement {
        margin-top: clamp(2.4rem, 8vw, 3.6rem);
      }

      body.portfolio-redesign .portfolio-hero .hero-statement-title {
        max-width: 21ch;
        font-size: clamp(1.28rem, 5.8vw, 1.65rem);
        line-height: 1.2;
      }

      body.portfolio-redesign .portfolio-hero .hero-statement > p:last-of-type {
        max-width: 35ch;
        font-size: clamp(.98rem, 4.2vw, 1.1rem);
        line-height: 1.58;
      }

      body.portfolio-redesign .portfolio-hero .hero-actions {
        grid-template-columns: 1fr;
        gap: .7rem;
        margin-top: 1.7rem;
      }

      body.portfolio-redesign .portfolio-hero .hero-actions .btn {
        min-height: 3.4rem;
        padding-block: .85rem;
      }

      body.portfolio-redesign .portfolio-hero .hero-services {
        grid-column: 1;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1.25rem 1rem;
        margin-top: 2.4rem;
        padding-top: 1.35rem;
      }

      body.portfolio-redesign .portfolio-hero .hero-services strong {
        max-width: 16ch;
      }
    }

    @media (max-width: 420px) {
      body.portfolio-redesign .portfolio-hero .hero-inner {
        padding-top: 7.25rem;
        padding-bottom: 1.5rem;
      }

      body.portfolio-redesign .portfolio-hero h1 {
        font-size: clamp(3rem, 15vw, 4.65rem);
      }

      body.portfolio-redesign .portfolio-hero .hero-statement {
        margin-top: 2rem;
      }

      body.portfolio-redesign .portfolio-hero .hero-services {
        margin-top: 2rem;
      }
    }
  `;

  document.head.appendChild(style);
})();
