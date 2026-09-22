/* Final reference hero copy and navigation. Preserve existing typography, 3D portrait and actions. */
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

  // Pin the copy/CTA column to the actual D's left edge, not the viewport gutter.
  const designer = hero.querySelector('#hero-title .accent-italic');
  if (designer) {
    let scheduled = false;
    const positionCopy = () => {
      scheduled = false;
      if (window.innerWidth <= 860) return; // Preserve mobile's centered stack.
      const word = designer.getBoundingClientRect();
      const section = hero.getBoundingClientRect();
      const left = Math.max(24, Math.min(section.width - 24, word.left - section.left));
      hero.style.setProperty('--designer-copy-left', `${left.toFixed(2)}px`);
    };
    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(positionCopy);
    };
    positionCopy();
    window.addEventListener('resize', schedule, { passive: true });
    if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(designer);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
  }
}());
