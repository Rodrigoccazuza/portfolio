/* Native adapters for the supplied stacking, orbit, timeline and folder references. */
(function () {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  function el(tag, cls, text) { const n = document.createElement(tag); n.className = cls || ''; if (text) n.textContent = text; return n; }
  function img(src, alt) { const n = el('img'); n.src = src; n.alt = alt || ''; n.draggable = false; n.loading = 'lazy'; n.decoding = 'async'; return n; }
  function heading(parent, eyebrow, title) { const h = el('header', 'interaction-heading'); h.append(el('p', 'eyebrow', eyebrow), el('h2', '', title)); parent.append(h); }
  function observe(nodes, callback) { const o = new IntersectionObserver(entries => entries.forEach(e => callback(e.target, e.isIntersecting)), {threshold: .25}); nodes.forEach(n => o.observe(n)); }
  function websites(section, data, openViewer) {
    const root = el('section', 'section centered-websites'); root.id = section.id;
    const container = el('div', 'container'); heading(container, 'Websites', section.title);
    const stack = el('div', 'centered-stack');
    section.projects.forEach((p, i) => {
      const slot = el('div', 'stack-slot'); slot.style.setProperty('--index', i);
      const card = el('div', 'stack-project');
      const bar = el('div', 'stack-browser'); bar.append(el('span', 'stack-dots', '● ● ●'), el('span', '', p.category), el('span', '', String(i + 1).padStart(2, '0')));
      const preview = el('button', 'stack-preview'); preview.type = 'button'; preview.setAttribute('aria-label', 'Open full preview: ' + p.title);
      const shot = img(p.media.src, p.media.alt);
      // The first two previews are fetched up front so the stack never shows an empty frame.
      if (i < 2) { shot.loading = 'eager'; shot.fetchPriority = 'low'; }
      preview.append(shot); preview.addEventListener('click', () => openViewer([{src:p.media.src, alt:p.media.alt, title:p.title, type:'image'}], 0, preview));
      const copy = el('div', 'stack-copy'); const info = el('div'); info.append(el('h3', '', p.title), el('p', '', p.description));
      const link = el('a', 'btn btn-primary', 'Visit website ↗'); link.href = p.url; link.target = '_blank'; link.rel = 'noopener noreferrer'; copy.append(info, link);
      card.append(bar, preview, copy); slot.append(card); stack.append(slot);
    });
    container.append(stack);
    root.append(container);
    requestAnimationFrame(() => {
      const slots = [...stack.children]; let queued = false;
      function update() { queued = false; slots.forEach((slot, i) => { const top = 88 + i * 10; const next = slots[i + 1]; const progress = next ? Math.max(0, Math.min(1, (innerHeight - next.getBoundingClientRect().top) / Math.max(1, innerHeight - top))) : 0; slot.firstChild.style.transform = reduced.matches ? '' : 'scale(' + (1 - progress * .06) + ')'; }); }
      const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(update); } }; addEventListener('scroll', schedule, {passive:true}); addEventListener('resize', schedule); reduced.addEventListener('change', schedule); update();
    }); return root;
  }
  function folders(section, openViewer) {
    const root = el('section', 'section folder-section'); root.id = section.id;
    const container = el('div', 'container'); heading(container, section.id === 'social' ? 'Social Media & Ads' : section.id === 'ads' ? 'Ads' : 'Other', section.title);
    const groups = section.id === 'ads' || section.id === 'social' ? section.projects.map(p => ({title:p.title, items:p.media.items})) : [{title:'Other creative work', items:section.projects.map(p => ({...p.media, title:p.title}))}];
    const collection = el('div', 'folder-collection'); container.append(collection);
    groups.forEach((group, groupIndex) => {
      const folder = el('div', 'interactive-folder'); const cover = el('button', 'folder-cover'); cover.type = 'button'; cover.setAttribute('aria-expanded', 'false');
      const previews = el('span', 'folder-previews'); previews.setAttribute('aria-hidden', 'true'); group.items.filter(m => !/\.(m4v|mp4|webm)$/i.test(m.src)).slice(0,5).forEach((m,i) => { const photo = img(m.thumbnail || m.src, m.alt || m.title || group.title); photo.style.setProperty('--offset', i - 2); previews.append(photo); });
      if (!previews.children.length) previews.append(el('span', 'folder-video', '▶'));
      cover.append(previews, el('span', 'folder-front', group.title), el('span', 'folder-count', group.items.length + ' pieces · Open folder'));
      const panel = el('div', 'folder-panel'); panel.id = section.id + '-folder-' + groupIndex; panel.hidden = true; cover.setAttribute('aria-controls', panel.id);
      const close = el('button', 'folder-close', 'Close folder ↑'); close.type = 'button';
      const hint = el('p', 'folder-hint', 'Open a piece for the full preview. Drag an image down to close.');
      const grid = el('div', 'folder-photos');
      const items = group.items.map(m => ({src:m.src, thumbnail:m.thumbnail, alt:m.alt || m.title || group.title, title:m.title || m.alt || group.title, type:m.type === 'video' || /\.(m4v|mp4|webm)$/i.test(m.src) ? 'video' : 'image'}));
      function toggle(open) { folder.classList.toggle('is-open', open); collection.classList.toggle('has-open-folder', !!collection.querySelector('.is-open')); panel.hidden = !open; cover.hidden = open; cover.setAttribute('aria-expanded', String(open)); if (open) close.focus({preventScroll:true}); else cover.focus({preventScroll:true}); }
      items.forEach((m,i) => { const button = el('button', 'folder-photo'); button.type = 'button'; button.setAttribute('aria-label', 'Open ' + m.title); if (m.type === 'video') { const v = el('video'); v.src=m.src; v.preload='none'; v.muted=true; v.playsInline=true; button.append(v, el('span', 'folder-play', '▶ Play video')); } else button.append(img(m.thumbnail || m.src, m.alt)); button.append(el('span', 'folder-caption', m.title)); let start = null; let dragged = false;
        button.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse') { start = e.clientY; dragged = false; button.setPointerCapture(e.pointerId); } });
        button.addEventListener('pointerup', e => { if (start !== null && e.clientY - start > 100) { dragged = true; toggle(false); } start = null; }); button.addEventListener('pointercancel', () => {start=null;});
        button.addEventListener('click', () => { if (dragged) {dragged=false;return;} openViewer(items,i,button); }); grid.append(button); });
      cover.addEventListener('click', () => toggle(true)); close.addEventListener('click', () => toggle(false)); panel.addEventListener('keydown', e => {if(e.key === 'Escape') {e.stopPropagation();toggle(false);}});
      panel.append(close, hint, grid); folder.append(cover,panel); collection.append(folder);
    }); root.append(container); return root;
  }
  window.PortfolioUI = {websites, folders};
}());
