/* Branch-specific media/layout interoperability fixes after the composition mounts. */
(function(){
  'use strict';
  if(!document.body.classList.contains('composition-v2'))return;
  // The composition replaces nav links after nav.js bound its original anchors.
  // Delegate to new anchors so same-page links also close the accessible drawer.
  const nav=document.querySelector('#primary-nav');
  const toggle=document.querySelector('.nav-toggle');
  if(nav&&toggle)nav.addEventListener('click',event=>{
    if(event.target.closest('a[href]')&&nav.getAttribute('data-open')==='true')toggle.click();
  });
  if(!document.body.classList.contains('composition-home'))return;
  const oldArt=document.querySelector('.portfolio-hero .hero-background');
  if(oldArt){oldArt.hidden=true;oldArt.setAttribute('aria-hidden','true');oldArt.style.setProperty('display','none','important');}
  const hero=document.querySelector('.portfolio-hero');
  const fallback=document.querySelector('.hero-3d-fallback');
  // The character render is the placeholder until the 3D portrait is interactive.
  if(fallback){const avatar=new URL('images/site/avatar-character.webp',document.baseURI).href;if(fallback.src!==avatar)fallback.src=avatar;fallback.alt='';fallback.classList.add('hero-avatar-placeholder');}
}());
