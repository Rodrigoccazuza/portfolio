/* Dynamic navigation: compacts after the first scroll, tucks away while reading down,
   returns on scroll up, shows reading progress, and slides a pressed indicator between links.
   nav.js keeps ownership of the mobile drawer (open/close, focus trap). */
(function () {
  'use strict';
  // Injected by theme-init.js: dynamically inserted scripts ignore `defer`, so wait for the DOM.
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init, { once: true }); return; }
  init();
  function init() {
  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  if (!header) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let lastY = scrollY;
  let downTravel = 0;
  let queued = false;

  function update() {
    queued = false;
    const y = Math.max(scrollY, 0);
    const max = Math.max(root.scrollHeight - innerHeight, 1);
    const menuOpen = document.body.classList.contains('nav-open');
    const focusInside = header.contains(document.activeElement) && document.activeElement !== document.body;
    root.classList.toggle('nav-scrolled', y > 24);
    // Hide only after sustained downward travel, so small layout shifts never flicker the bar.
    downTravel = y > lastY ? downTravel + (y - lastY) : 0;
    if (!reduced.matches && !menuOpen && !focusInside && y > 260 && downTravel > 40) root.classList.add('nav-hidden');
    else if (lastY - y > 6 || y <= 260 || menuOpen || focusInside) root.classList.remove('nav-hidden');
    header.style.setProperty('--nav-progress', Math.min(y / max, 1).toFixed(4));
    lastY = y;
  }
  const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  header.addEventListener('focusin', () => root.classList.remove('nav-hidden'));
  update();

  // Sliding indicator (desktop). Links can be replaced by composition scripts, so re-bind lazily.
  function bindIndicator() {
    const list = header.querySelector('#primary-nav > ul');
    if (!list || list.querySelector('.nav-indicator')) return;
    const indicator = document.createElement('li');
    indicator.className = 'nav-indicator';
    indicator.setAttribute('role', 'presentation');
    indicator.setAttribute('aria-hidden', 'true');
    list.prepend(indicator);
    const current = () => list.querySelector('a[aria-current="page"]');
    function moveTo(link) {
      list.querySelectorAll('a.is-indicated').forEach(a => a.classList.remove('is-indicated'));
      if (!link) { indicator.style.setProperty('--o', '0'); return; }
      const box = list.getBoundingClientRect();
      const r = link.getBoundingClientRect();
      indicator.style.setProperty('--x', (r.left - box.left) + 'px');
      indicator.style.setProperty('--w', r.width + 'px');
      indicator.style.setProperty('--o', '1');
      link.classList.add('is-indicated');
    }
    list.addEventListener('pointerover', e => { const a = e.target.closest('a'); if (a) moveTo(a); });
    list.addEventListener('focusin', e => { const a = e.target.closest('a'); if (a) moveTo(a); });
    list.addEventListener('pointerleave', () => moveTo(current()));
    list.addEventListener('focusout', () => setTimeout(() => { if (!list.contains(document.activeElement)) moveTo(current()); }, 0));
    const rest = () => moveTo(current());
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(rest);
    addEventListener('resize', rest, { passive: true });
    requestAnimationFrame(rest);
    new MutationObserver(rest).observe(list, { subtree: true, attributes: true, attributeFilter: ['aria-current'] });
  }
  bindIndicator();
  new MutationObserver(() => bindIndicator()).observe(header, { childList: true, subtree: true });
  installThemeToggle();
  }

  // Light/dark toggle: a raised round control in the nav bar; the choice persists per browser.
  function installThemeToggle() {
    const bar = document.querySelector('.site-header .nav-bar');
    if (!bar || bar.querySelector('.theme-toggle')) return;
    const root = document.documentElement;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-toggle';
    // Inline SVG: some pages do not load the Bootstrap Icons font.
    button.innerHTML = '<svg class="icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.4 14.6A8.5 8.5 0 0 1 9.4 3.6a.6.6 0 0 0-.8-.7A9.5 9.5 0 1 0 21.1 15.4a.6.6 0 0 0-.7-.8z"/><path d="M17 3.2l.5 1.4 1.4.5-1.4.5-.5 1.4-.5-1.4-1.4-.5 1.4-.5zM20.6 7.6l.3.8.8.3-.8.3-.3.8-.3-.8-.8-.3.8-.3z"/></svg>'
      + '<svg class="icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.6"/><g stroke-width="2" stroke-linecap="round"><path d="M12 1.8v2.4M12 19.8v2.4M1.8 12h2.4M19.8 12h2.4M4.8 4.8l1.7 1.7M17.5 17.5l1.7 1.7M4.8 19.2l1.7-1.7M17.5 6.5l1.7-1.7"/></g></svg>';
    const meta = document.querySelector('meta[name="theme-color"]');
    function sync() {
      const dark = root.classList.contains('neu-dark');
      button.setAttribute('aria-pressed', String(dark));
      button.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      button.title = dark ? 'Light mode' : 'Dark mode';
      if (meta) meta.setAttribute('content', dark ? '#23252a' : '#e6e7eb');
    }
    button.addEventListener('click', () => {
      root.classList.add('theme-switching');
      root.classList.toggle('neu-dark');
      try { localStorage.setItem('rc-theme', root.classList.contains('neu-dark') ? 'dark' : 'light'); } catch (e) { /* storage may be blocked */ }
      sync();
      setTimeout(() => root.classList.remove('theme-switching'), 500);
    });
    const toggle = bar.querySelector('.nav-toggle');
    bar.insertBefore(button, toggle || null);
    sync();
  }
}());
