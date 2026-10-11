// Reveal behavior and composition initialization.
// Home declares its stylesheets and scripts directly in index.html (parallel downloads, no
// script-driven waterfall); Experience and Work still compose from here.
(function(){
 'use strict';
 const root=document.documentElement;
 // Pages animated by GSAP (portfolio-motion.js) must not also run this observer reveal:
 // two systems animating the same element is what made sections stutter.
 if(!window.gsap&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver'in window){
  // Content (sections, cards, grids) is visible from first paint; only small accents ease in.
  const selectors=['.portfolio-section-header','.timeline-item','.home-timeline li','.expertise-row'];
  const items=[...document.querySelectorAll(selectors.join(','))];
  if(items.length){root.classList.add('reveal-ready');items.forEach((item,index)=>{item.classList.add('reveal-item');item.style.setProperty('--reveal-delay',Math.min(index%4,3)*55+'ms');});const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;entry.target.classList.add('is-revealed');observer.unobserve(entry.target);}),{rootMargin:'0px 0px -7% 0px',threshold:.08});items.forEach(item=>observer.observe(item));}
 }
 // Late layout changes (lazy media, fonts) move ScrollTrigger start points; ScrollTrigger ignores
 // resize events without a viewport change, so refresh when the document height really changes.
 if('ResizeObserver'in window){let timer,lastHeight=0;new ResizeObserver(()=>{const height=root.scrollHeight;if(Math.abs(height-lastHeight)<2)return;lastHeight=height;clearTimeout(timer);timer=setTimeout(()=>{if(window.ScrollTrigger)window.ScrollTrigger.refresh();},250);}).observe(document.body);}
 const url=path=>new URL(path,document.baseURI).href;
 const release=()=>{if(typeof window.__compositionRelease==='function')requestAnimationFrame(()=>requestAnimationFrame(window.__compositionRelease));};
 function style(path,cb){const link=document.createElement('link');link.rel='stylesheet';link.href=url(path);if(cb){link.onload=cb;link.onerror=cb;}document.head.append(link);}
 function script(path,cb){const el=document.createElement('script');el.src=url(path);if(cb){el.onload=cb;el.onerror=cb;}document.body.append(el);}
 const home=!!document.querySelector('.portfolio-hero');
 const experience=/\/experience\/?$/.test(location.pathname);
 const work=/\/work\/?$/.test(location.pathname);
 if(home){
  // Stylesheets are in the document (deferred scripts wait for them) and DOMContentLoaded
  // fires after the remaining deferred composition scripts have run.
  if(document.readyState==='complete')release();else document.addEventListener('DOMContentLoaded',release,{once:true});
 }else if(experience){
  script('js/composition-v2.js?v=20261011-3',()=>{
   style('css/composition-finishing.css?v=20260922-8');
   script('js/composition-runtime-fixes.js?v=20261011-1',()=>{
    style('css/content-accessibility-20260922.css?v=20260922-1');
    script('js/experience-motion.js?v=20261011-2');
    style('css/site-final-polish.css?v=20260922-14',release);
   });
  });
 }else if(work){
  document.body.classList.add('composition-work');
  style('css/composition-work.css?v=20260922-8');
  style('css/composition-v2.css?v=20260922-8');
  style('css/site-final-polish.css?v=20260922-14',release);
 }
})();
