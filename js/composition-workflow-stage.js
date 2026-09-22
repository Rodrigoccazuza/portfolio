/* Six scroll-passing cards over a full-bleed, scroll-scrubbed background film. */
(function () {
  'use strict';
  if (!document.body.classList.contains('composition-home')) return;
  const section = document.querySelector('.concept-timeline');
  if (!section || section.classList.contains('workflow-stage')) return;
  const labels = ['Concept', 'Sketch', 'Moodboard', 'Style Guide', 'Wireframes', 'Prototype & Build'];
  const descriptions = [
    'Define the objective, audience and creative direction.',
    'Explore page structure through an annotated sketch.',
    'Collect references, imagery and visual inspiration.',
    'Establish typography, color, spacing and interface components.',
    'Map the layout and hierarchy from low to high fidelity.',
    'Bring the prototype to life with interaction, motion and code.'
  ];
  const videoUrl = new URL('assets/video/concept-to-implementation.mp4', document.baseURI).href;
  section.classList.add('workflow-stage');
  section.setAttribute('aria-label', 'From concept to build: six website creation stages');
  section.innerHTML = `
    <div class="workflow-stage-sticky">
      <div class="workflow-stage-media" aria-hidden="true">
        <video class="comp-process-video workflow-stage-video" muted playsinline preload="none" tabindex="-1"><source src="${videoUrl}" type="video/mp4"></video>
        <div class="workflow-stage-light"></div><div class="workflow-stage-shade"></div>
      </div>
      <div class="workflow-stage-content">
        <header class="workflow-stage-heading"><span class="workflow-stage-eyebrow">FROM CONCEPT TO BUILD</span><h2>A clear path from <em>idea to launch.</em></h2></header>
        <ol class="concept-steps workflow-stage-rail" aria-label="Website creation stages">${labels.map((label, i) => `<li class="concept-step workflow-stage-step${i === 0 ? ' is-current' : ''}" data-workflow-index="${i}"${i === 0 ? ' aria-current="step"' : ''}><article class="workflow-stage-card"><span class="workflow-stage-marker" aria-hidden="true">${String(i + 1).padStart(2, '0')} <span class="workflow-stage-total">/ 06</span></span><div class="workflow-stage-step-text"><h3>${label}</h3><p>${descriptions[i]}</p></div></article></li>`).join('')}</ol>
        <div class="workflow-stage-active visually-hidden" role="status" aria-live="polite" aria-atomic="true"><span class="workflow-stage-count">01 / 06</span> <span class="workflow-stage-current-title">Concept</span><p class="workflow-stage-current-description">${descriptions[0]}</p></div>
        <div class="workflow-stage-footer"><span>SCROLL TO EXPLORE THE PROCESS</span><span class="workflow-stage-progress" aria-hidden="true"><span></span></span><span class="workflow-stage-progress-label">01 / 06</span></div>
      </div>
    </div>`;
  const sticky = section.querySelector('.workflow-stage-sticky');
  const video = section.querySelector('video');
  const steps = [...section.querySelectorAll('.workflow-stage-step')];
  const count = section.querySelector('.workflow-stage-count');
  const title = section.querySelector('.workflow-stage-current-title');
  const description = section.querySelector('.workflow-stage-current-description');
  const progressBar = section.querySelector('.workflow-stage-progress > span');
  const progressLabel = section.querySelector('.workflow-stage-progress-label');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let duration = 0, requestedTime = 0, seeking = false, raf = 0, active = -1, loaded = false;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  function loadVideo() {
    if (loaded) return;
    loaded = true;
    video.preload = 'auto';
    video.load();
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect(); loadVideo();
    }, { rootMargin: '900px 0px' });
    observer.observe(section);
  } else loadVideo();
  function seek() {
    if (!duration || video.readyState < 1 || seeking || reducedMotion.matches) return;
    const next = clamp(requestedTime, 0, Math.max(0, duration - .035));
    if (Math.abs(video.currentTime - next) < .045) return;
    seeking = true;
    try { video.currentTime = next; } catch (_) { seeking = false; }
  }
  function update() {
    raf = 0;
    const total = Math.max(1, section.offsetHeight - window.innerHeight);
    const top = section.getBoundingClientRect().top;
    const progress = clamp(-top / total, 0, 1);
    const position = Math.min(5, progress * 6);
    const index = Math.min(5, Math.floor(progress * 6));
    const number = String(index + 1).padStart(2, '0');
    // Unlike a static rail, cards pass through the middle of their viewing area.
    // CSS confines their backgrounds to the card, leaving the film untouched.
    const spacing = Math.min(window.innerHeight * .41, window.innerWidth <= 600 ? 260 : 310);
    if (!reducedMotion.matches) steps.forEach((step, i) => {
      step.style.setProperty('--card-offset', `${((i - position) * spacing).toFixed(1)}px`);
      step.style.opacity = String(clamp(1 - Math.abs(i - position) * .42, .08, 1));
    });
    else steps.forEach(step => { step.style.removeProperty('--card-offset'); step.style.removeProperty('opacity'); });
    if (index !== active) {
      active = index;
      steps.forEach((step, i) => {
        step.classList.toggle('is-current', i === index);
        if (i === index) step.setAttribute('aria-current', 'step');
        else step.removeAttribute('aria-current');
      });
      count.textContent = number + ' / 06';
      title.textContent = labels[index];
      description.textContent = descriptions[index];
      progressLabel.textContent = number + ' / 06';
      sticky.dataset.step = String(index);
    }
    progressBar.style.transform = `scaleX(${progress})`;
    requestedTime = progress * (duration || 10);
    seek();
  }
  function queue() { if (!raf) raf = requestAnimationFrame(update); }
  video.addEventListener('loadedmetadata', () => { duration = Number.isFinite(video.duration) ? video.duration : 0; video.pause(); queue(); });
  video.addEventListener('seeked', () => { seeking = false; seek(); });
  video.addEventListener('play', () => video.pause());
  video.addEventListener('error', () => section.classList.add('workflow-stage-no-video'));
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue, { passive: true });
  if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', queue);
  queue();
}());
