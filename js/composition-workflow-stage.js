/* Video-only concept-to-build section. No headings, cards, rails or overlays. */
(function () {
  'use strict';
  if (!document.body.classList.contains('composition-home')) return;
  const section = document.querySelector('.concept-timeline');
  if (!section || section.classList.contains('workflow-video-only')) return;
  const videoUrl = new URL('assets/video/concept-to-implementation.mp4', document.baseURI).href;
  section.classList.add('workflow-stage', 'workflow-video-only');
  section.setAttribute('aria-label', 'Website design process video. Scroll through this section to move forward or backward through the film.');
  section.innerHTML = `<div class="workflow-stage-sticky"><video class="comp-process-video workflow-stage-video" muted playsinline preload="none" aria-label="Website design progressing from concept to finished build. Scroll to move through the video."><source src="${videoUrl}" type="video/mp4"></video></div>`;
  const sticky = section.querySelector('.workflow-stage-sticky');
  const video = section.querySelector('video');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = value => Math.max(0, Math.min(1, value));
  let duration = 0;
  let target = 0;
  let frame = 0;
  let loaded = false;
  let seeking = false;
  let seekFallback = 0;
  function loadVideo() {
    if (loaded) return;
    loaded = true;
    video.preload = 'auto';
    video.load();
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      loadVideo();
    }, { rootMargin: '900px 0px' });
    observer.observe(section);
  } else loadVideo();
  function releaseSeek() {
    seeking = false;
    if (seekFallback) { clearTimeout(seekFallback); seekFallback = 0; }
    seek();
  }
  function seek() {
    if (reduceMotion.matches || !duration || video.readyState < 1 || seeking) return;
    const next = Math.max(0, Math.min(duration - .035, target));
    if (Math.abs(video.currentTime - next) < .025) return;
    seeking = true;
    try {
      video.currentTime = next;
      // Desktop Chromium reliably emits seeked. Some mobile/paused decoders can
      // delay it, so this fallback releases the lock and applies the newest target.
      seekFallback = window.setTimeout(releaseSeek, 180);
    } catch (_) {
      seeking = false;
    }
  }
  function update() {
    frame = 0;
    if (reduceMotion.matches) return;
    const available = Math.max(1, section.offsetHeight - sticky.getBoundingClientRect().height);
    const progress = clamp(-section.getBoundingClientRect().top / available);
    target = progress * (duration || 10);
    seek();
  }
  function queue() { if (!frame) frame = requestAnimationFrame(update); }
  function updateMotion() {
    video.controls = reduceMotion.matches;
    if (reduceMotion.matches) {
      if (!loaded) loadVideo();
      if (seekFallback) { clearTimeout(seekFallback); seekFallback = 0; }
      seeking = false;
    } else {
      video.pause();
      queue();
    }
  }
  video.addEventListener('loadedmetadata', () => {
    duration = Number.isFinite(video.duration) ? video.duration : 0;
    if (!reduceMotion.matches) { video.pause(); queue(); }
  });
  video.addEventListener('seeked', releaseSeek);
  video.addEventListener('loadeddata', queue);
  video.addEventListener('canplay', queue);
  video.addEventListener('play', () => { if (!reduceMotion.matches) video.pause(); });
  video.addEventListener('error', () => section.classList.add('workflow-stage-no-video'));
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue, { passive: true });
  if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', updateMotion);
  updateMotion();
  queue();
}());
