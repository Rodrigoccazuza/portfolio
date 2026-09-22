/* Keep the source portrait and live Multimedia animation; align their layout to
   the visible Designer heading at desktop and mobile sizes. */
(function () {
  'use strict';
  if (!document.body.matches('.composition-home.composition-v2')) return;
  const hero = document.querySelector('.portfolio-hero');
  if (!hero) return;
  const kicker = hero.querySelector('.hero-kicker');
  if (kicker) kicker.textContent = "Hey, I'm a";
  const heading = hero.querySelector('.hero-statement-title');
  if (heading) heading.textContent = 'Design, marketing, and front-end development in one creative practice.';
  const copy = hero.querySelector('.hero-statement > p:last-of-type');
  if (copy) copy.textContent = 'I create brand systems, email campaigns, paid social assets, websites, and video content that help businesses communicate clearly and grow.';
  const links = [...document.querySelectorAll('#primary-nav ul > li > a')];
  const routes = [['Home', ''], ['Work', 'work/'], ['Experience', 'experience/']];
  routes.forEach(([label, href], i) => {
    if (!links[i]) return;
    links[i].textContent = label;
    links[i].setAttribute('href', href);
    if (i === 0) links[i].setAttribute('aria-current', 'page');
    else links[i].removeAttribute('aria-current');
  });
  links.slice(routes.length).forEach(link => link.closest('li')?.remove());
  const primary = hero.querySelector('.hero-actions .btn-primary');
  if (primary) primary.textContent = 'View my work';
  const secondary = hero.querySelector('.hero-actions .btn-secondary');
  if (secondary) secondary.textContent = 'Get in touch';

  const designer = hero.querySelector('#hero-title .accent-italic');
  const portrait = hero.querySelector('.portrait-stage');
  const statement = hero.querySelector('.hero-statement');
  if (!designer || !portrait || !statement) return;
  let scheduled = false;
  const position = () => {
    scheduled = false;
    const word = designer.getBoundingClientRect();
    const section = hero.getBoundingClientRect();
    if (!word.width || !section.width) return;
    const wordBottom = word.bottom - section.top;
    if (window.innerWidth > 860) {
      // Desktop: the left edge and fixed 50px offset follow the real D.
      const left = Math.max(24, Math.min(section.width - 24, word.left - section.left));
      const portraitLead = Math.max(140, Math.min(215, section.width * .15));
      hero.style.setProperty('--designer-copy-left', `${left.toFixed(2)}px`);
      hero.style.setProperty('--designer-copy-top', `${(wordBottom + 50).toFixed(2)}px`);
      hero.style.setProperty('--portrait-stage-top', `${Math.max(0, wordBottom - portraitLead).toFixed(2)}px`);
      hero.style.removeProperty('--mobile-portrait-top');
      hero.style.removeProperty('--mobile-copy-top');
      hero.style.removeProperty('--mobile-hero-height');
      return;
    }
    // Mobile: grow the visual stage around the center, overlapping only the
    // lettering; start the copy just below the portrait's visible chin.
    const stageTop = Math.max(0, wordBottom - 20);
    const stageHeight = portrait.getBoundingClientRect().height || 385;
    const statementTop = stageTop + stageHeight - 42;
    hero.style.setProperty('--mobile-portrait-top', `${stageTop.toFixed(2)}px`);
    hero.style.setProperty('--mobile-copy-top', `${statementTop.toFixed(2)}px`);
    const neededHeight = Math.max(760, statementTop + statement.getBoundingClientRect().height + 30);
    hero.style.setProperty('--mobile-hero-height', `${Math.ceil(neededHeight)}px`);
  };
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(position);
  };
  position();
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('load', schedule, { once: true });
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(schedule);
    observer.observe(designer);
    observer.observe(portrait);
    observer.observe(statement);
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
  requestAnimationFrame(() => requestAnimationFrame(schedule));
}());
