/* Final reference hero copy and navigation. Keep original nodes, animated
   typography controller, 3D canvas and existing click behavior in place. */
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
  // Hero CTAs retain their existing actions; only fix the visual reference labels.
  const primary = hero.querySelector('.hero-actions .btn-primary');
  if (primary) primary.textContent = 'View my work';
  const secondary = hero.querySelector('.hero-actions .btn-secondary');
  if (secondary) secondary.textContent = 'Get in touch';
}());
