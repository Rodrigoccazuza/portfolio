/* Small deterministic fixes applied after the composition mounts. */
(function(){
  'use strict';
  if (!document.body.classList.contains('composition-v2')) return;
  if (document.body.classList.contains('composition-home')) {
    // Earlier branch themes can re-assert the former hero artwork. Remove that image
    // from the new design at the element level, instead of relying on selector order.
    const oldArt=document.querySelector('.portfolio-hero .hero-background');
    if(oldArt){oldArt.hidden=true;oldArt.setAttribute('aria-hidden','true');oldArt.style.setProperty('display','none','important');}
    const hero=document.querySelector('.portfolio-hero');
    if(hero){hero.style.setProperty('background-image','radial-gradient(ellipse at 62% 100%, #16432a 0%, transparent 58%), radial-gradient(ellipse at 24% 4%, #281237 0%, transparent 58%)','important');}
    const fallback=document.querySelector('.hero-3d-fallback');
    if(fallback){fallback.src=new URL('images/site/footer-portrait.png',document.baseURI).href;fallback.alt='';fallback.decoding='async';}
    const video=document.querySelector('.comp-process-video');
    if(video){
      // Chromium can postpone metadata for display:none videos even with preload.
      // Make it renderable but transparent until metadata arrives.
      video.hidden=false;video.style.opacity='0';video.style.pointerEvents='none';video.preload='auto';
      video.addEventListener('loadedmetadata',()=>{video.style.opacity='1';video.style.pointerEvents='auto';},{once:true});
      video.addEventListener('error',()=>{video.hidden=true;video.style.opacity='0';},{once:true});
      if(video.readyState>=1 && Number.isFinite(video.duration) && video.duration>0){video.style.opacity='1';video.style.pointerEvents='auto';}
      else video.load();
    }
  }
}());
