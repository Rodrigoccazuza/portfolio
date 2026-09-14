/* Static-site adaptations: TextType behavior and an original video parallax rail.
   The latter is not the licensed React Bits Pro component. */
(function () {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const output = document.querySelector('.text-type__content');
  const pauseButton = document.querySelector('.typing-toggle');
  const words = ['Multimedia', 'Graphic', 'E-mail', 'Web', 'VibeCode', 'AI', 'Motion', 'Video', 'Creative'];
  let index = 0, length = words[0].length, deleting = true, timer, paused = false, visible = true;
  function schedule(delay) { clearTimeout(timer); if (!paused && visible && !document.hidden && !reduced.matches) timer = setTimeout(tick, delay); }
  function tick() {
    if (!output) return;
    if (deleting) {
      length--;
      if (length <= 0) { length = 0; deleting = false; index = (index + 1) % words.length; }
    } else {
      length++;
      if (length >= words[index].length) { length = words[index].length; deleting = true; output.textContent = words[index]; schedule(1400); return; }
    }
    output.textContent = words[index].slice(0, length); schedule(deleting ? 30 : 75);
  }
  if (output) {
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; schedule(1400); });
    observer.observe(output.closest('.hero-intro'));
    pauseButton.addEventListener('click', () => { paused = !paused; pauseButton.textContent = paused ? 'Resume text' : 'Pause text'; pauseButton.setAttribute('aria-pressed', String(paused)); schedule(400); });
    document.addEventListener('visibilitychange', () => schedule(1400));
    reduced.addEventListener('change', () => { if (reduced.matches) { output.textContent = words[0]; index=0;length=words[0].length;deleting=true; } schedule(1400); });
  }

  document.querySelectorAll('.media-row-viewport').forEach(viewport => {
    const videos = [...viewport.querySelectorAll('video')];
    if (!videos.length) return;
    viewport.classList.add('parallax-viewport');
    const hint = document.createElement('p'); hint.className='parallax-hint'; hint.textContent='Drag or swipe to explore · Use arrow keys to navigate'; viewport.parentNode.insertBefore(hint, viewport.nextSibling);
    let startX=0, startScroll=0, dragging=false, moved=false, frame=0, inView=false;
    function paint() {
      frame=0;
      const bounds=viewport.getBoundingClientRect();
      videos.forEach(video => {
        const card=video.closest('.media-rail-card').getBoundingClientRect();
        const offset=reduced.matches ? 0 : Math.max(-10,Math.min(10,((card.left+card.width/2)-(bounds.left+bounds.width/2))/bounds.width*20));
        video.style.setProperty('--parallax-x',offset.toFixed(2)+'px');
      });
    }
    function queue() { if(inView && !frame) frame=requestAnimationFrame(paint); }
    new IntersectionObserver(entries => {inView=entries[0].isIntersecting;queue();}).observe(viewport);
    viewport.addEventListener('scroll',queue,{passive:true}); window.addEventListener('resize',queue); reduced.addEventListener('change',paint);
    viewport.addEventListener('pointerdown',event => {
      if(event.pointerType !== 'mouse' || event.button !== 0 || event.target.closest('.media-rail-mute')) return;
      startX=event.clientX;startScroll=viewport.scrollLeft;dragging=true;moved=false;
    });
    viewport.addEventListener('pointermove',event => {
      if(!dragging) return;
      const delta=event.clientX-startX;
      if(Math.abs(delta)>6 && !moved) { moved=true;viewport.setPointerCapture(event.pointerId);viewport.classList.add('is-dragging'); }
      if(moved) {event.preventDefault();viewport.scrollLeft=startScroll-delta;}
    });
    function end(event) {dragging=false;viewport.classList.remove('is-dragging');if(viewport.hasPointerCapture(event.pointerId))viewport.releasePointerCapture(event.pointerId);}
    viewport.addEventListener('pointerup',end); viewport.addEventListener('pointercancel',end);
    viewport.addEventListener('pointerleave',event => {if(!moved)end(event);});
    viewport.addEventListener('click',event => {if(moved){event.preventDefault();event.stopImmediatePropagation();moved=false;}},true);
  });
}());
