/* Home preloader: downloads the 3D portrait as early as possible, reports real byte
   progress while the character is revealed from the bottom up, then wipes away to the hero.
   The downloaded buffer is handed to composition-portrait-v2.js so the GLB is fetched once. */
(function () {
  'use strict';
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MIN_MS = (function () { try { return sessionStorage.getItem('rc-preloaded') ? 650 : 1500; } catch (e) { return 1500; } }());
  const MAX_MS = 7000;
  const start = performance.now();
  let glbProgress = 0;
  let glbDone = false;

  root.classList.add('preloader-active');

  // Start the model download immediately; GLTFLoader.parse() consumes the same buffer later.
  const url = new URL('assets/3d/portrait-interactive.glb?v=20261010-1', document.baseURI).href;
  const promise = fetch(url, { credentials: 'same-origin' }).then(async function (response) {
    if (!response.ok) throw new Error('GLB ' + response.status);
    const total = Number(response.headers.get('content-length')) || 0;
    if (!response.body || !total) { const buffer = await response.arrayBuffer(); glbProgress = 1; return buffer; }
    const reader = response.body.getReader();
    const bytes = new Uint8Array(total);
    let received = 0;
    for (;;) {
      const chunk = await reader.read();
      if (chunk.done) break;
      // Content-Encoding can make the stream longer than content-length; grow if needed.
      if (received + chunk.value.length > bytes.length) { const grown = new Uint8Array((received + chunk.value.length) * 1.5); grown.set(bytes.subarray(0, received)); return finishGrown(grown, received, chunk.value, reader); }
      bytes.set(chunk.value, received);
      received += chunk.value.length;
      glbProgress = Math.min(received / total, 1);
    }
    glbProgress = 1;
    return bytes.buffer.slice(0, received);
  }).catch(function (error) { console.warn('3D portrait preload failed, falling back to loader', error); return null; })
    .finally(function () { glbDone = true; glbProgress = 1; });

  async function finishGrown(buffer, received, first, reader) {
    let bytes = buffer;
    bytes.set(first, received); received += first.length;
    for (;;) {
      const chunk = await reader.read();
      if (chunk.done) break;
      if (received + chunk.value.length > bytes.length) { const grown = new Uint8Array((received + chunk.value.length) * 1.5); grown.set(bytes.subarray(0, received)); bytes = grown; }
      bytes.set(chunk.value, received); received += chunk.value.length;
    }
    return bytes.buffer.slice(0, received);
  }

  window.__portraitAsset = { url: url, promise: promise };

  function onReady() {
    const overlay = document.getElementById('site-preloader');
    if (!overlay) { root.classList.remove('preloader-active'); return; }
    const count = overlay.querySelector('[data-preloader-count]');
    let shown = 0;
    let finished = false;

    function compositionReady() { return root.classList.contains('composition-ready') || !root.classList.contains('composition-boot'); }

    function target() {
      // Model bytes drive most of the reveal; the composed layout finishes it.
      const elapsed = performance.now() - start;
      const time = Math.min(elapsed / MIN_MS, 1);
      const work = glbProgress * 0.85 + (compositionReady() ? 0.15 : 0);
      return Math.min(work, time);
    }

    function frame(now) {
      if (finished) return;
      const goal = target();
      shown += (goal - shown) * (reduced ? 1 : 0.12);
      if (goal - shown < 0.002) shown = goal;
      overlay.style.setProperty('--progress', shown.toFixed(4));
      if (count) count.textContent = String(Math.round(shown * 100));
      const elapsed = now - start;
      const complete = glbDone && compositionReady() && shown >= 0.999 && elapsed >= MIN_MS;
      if (complete || elapsed >= MAX_MS) return finish();
      requestAnimationFrame(frame);
    }

    function finish() {
      finished = true;
      overlay.style.setProperty('--progress', '1');
      if (count) count.textContent = '100';
      if (typeof window.__compositionRelease === 'function') window.__compositionRelease();
      try { sessionStorage.setItem('rc-preloaded', '1'); } catch (e) { /* storage may be blocked */ }
      overlay.setAttribute('aria-label', 'Portfolio loaded');
      // Hold the fully revealed character for a beat, then wipe up into the hero.
      setTimeout(function () {
        overlay.classList.add('is-leaving');
        root.classList.remove('preloader-active');
        const done = function () { if (!overlay.isConnected) return; overlay.remove(); window.dispatchEvent(new Event('resize')); if (window.ScrollTrigger) window.ScrollTrigger.refresh(); };
        if (reduced) setTimeout(done, 250);
        else { overlay.addEventListener('animationend', done, { once: true }); setTimeout(done, 1400); }
      }, reduced ? 0 : 280);
    }

    requestAnimationFrame(frame);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onReady, { once: true });
  else onReady();
}());
