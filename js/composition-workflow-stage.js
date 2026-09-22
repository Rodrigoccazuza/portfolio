/* Video-only concept-to-build section. No headings, cards, rails or overlays. */
(function () {
  'use strict';
  if (!document.body.classList.contains('composition-home')) return;
  const section = document.querySelector('.concept-timeline');
  if (!section || section.classList.contains('workflow-video-only')) return;

  const videoUrl = new URL('assets/video/concept-to-implementation.mp4', document.baseURI).href;
  section.classList.add('workflow-stage', 'workflow-video-only');
  section.setAttribute('aria-label', 'Website design process video. Scroll through this section to move forward or backward through the film.');
  section.innerHTML = `<div class="workflow-stage-sticky"><video class="comp-process-video workflow-stage-video" muted playsinline preload="auto" aria-label="Website design progressing from concept to finished build. Scroll to move through the video."><source src="${videoUrl}" type="video/mp4"></video></div>`;

  const sticky = section.querySelector('.workflow-stage-sticky');
  const video = section.querySelector('video');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = value => Math.max(0, Math.min(1, value));
  let targetProgress = 0;
  let frame = 0;
  let retryTimer = 0;

  const duration = () => Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 0;

  function clearRetry() {
    if (retryTimer) {
      clearTimeout(retryTimer);
      retryTimer = 0;
    }
  }

  function applyTarget() {
    clearRetry();
    if (reduceMotion.matches) return;
    const total = duration();
    if (!total || video.readyState < 1) {
      retryTimer = window.setTimeout(applyTarget, 80);
      return;
    }
    const next = Math.max(0, Math.min(total - .035, targetProgress * total));
    if (Math.abs(video.currentTime - next) < .025) return;
    if (video.seeking) {
      // Let the decoder finish its current seek, then apply the newest scroll target.
      retryTimer = window.setTimeout(applyTarget, 65);
      return;
    }
    try {
      video.currentTime = next;
    } catch (_) {
      retryTimer = window.setTimeout(applyTarget, 100);
    }
  }

  function update() {
    frame = 0;
    if (reduceMotion.matches) return;
    const stickyHeight = sticky.getBoundingClientRect().height || window.innerHeight;
    const available = Math.max(1, section.offsetHeight - stickyHeight);
    targetProgress = clamp(-section.getBoundingClientRect().top / available);
    applyTarget();
  }

  function queue() {
    if (!frame) frame = requestAnimationFrame(update);
  }

  function updateMotion() {
    clearRetry();
    video.controls = reduceMotion.matches;
    if (reduceMotion.matches) {
      video.style.pointerEvents = 'auto';
    } else {
      video.controls = false;
      video.style.pointerEvents = 'none';
      video.pause();
      queue();
    }
  }

  video.addEventListener('loadedmetadata', queue);
  video.addEventListener('durationchange', queue);
  video.addEventListener('loadeddata', queue);
  video.addEventListener('canplay', queue);
  video.addEventListener('canplaythrough', queue);
  video.addEventListener('seeked', applyTarget);
  video.addEventListener('play', () => { if (!reduceMotion.matches) video.pause(); });
  video.addEventListener('error', () => section.classList.add('workflow-stage-no-video'));

  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue, { passive: true });
  if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', updateMotion);

  updateMotion();
  // Preload immediately: scroll-scrubbing needs random access to the short film.
  video.load();
  queue();
}());
