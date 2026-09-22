/* Branch-specific media/layout interoperability fixes after the composition mounts. */
(function(){
  'use strict';
  if(!document.body.classList.contains('composition-v2')||!document.body.classList.contains('composition-home'))return;
  const oldArt=document.querySelector('.portfolio-hero .hero-background');
  if(oldArt){oldArt.hidden=true;oldArt.setAttribute('aria-hidden','true');oldArt.style.setProperty('display','none','important');}
  const hero=document.querySelector('.portfolio-hero');
  if(hero)hero.style.setProperty('background-image','radial-gradient(ellipse at 62% 100%, #16432a 0%, transparent 58%), radial-gradient(ellipse at 24% 4%, #281237 0%, transparent 58%)','important');
  const fallback=document.querySelector('.hero-3d-fallback');
  if(fallback){fallback.src=new URL('images/site/footer-portrait.png',document.baseURI).href;fallback.alt='';fallback.decoding='async';}
  const video=document.querySelector('.comp-process-video');
  const process=document.querySelector('.concept-timeline');
  if(!video||!process)return;
  video.hidden=false;video.style.opacity='0';video.style.pointerEvents='none';video.preload='metadata';
  video.addEventListener('loadedmetadata',()=>{video.style.opacity='1';video.style.pointerEvents='auto';});
  video.addEventListener('error',()=>{video.hidden=true;video.style.opacity='0';});
  let activated=false;
  const activate=()=>{
    if(activated)return;activated=true;
    // The inherited lazy-media script strips video[src] and stores it in
    // data-deferred-src, even if video.load() is called. A <source> child is
    // required for this custom scroll-scrub player to load independently.
    const src=video.dataset.deferredSrc||video.getAttribute('src')||new URL('assets/video/concept-to-implementation.mp4',document.baseURI).href;
    video.removeAttribute('src');
    delete video.dataset.deferredManaged;delete video.dataset.deferredSrc;
    const source=document.createElement('source');source.src=src;source.type='video/mp4';
    video.replaceChildren(source);video.preload='auto';video.load();
    if(video.readyState>=1&&Number.isFinite(video.duration)&&video.duration>0){video.style.opacity='1';video.style.pointerEvents='auto';}
  };
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){observer.disconnect();activate();}},{rootMargin:'700px 0px'});
    observer.observe(process);
  }else activate();
}());
