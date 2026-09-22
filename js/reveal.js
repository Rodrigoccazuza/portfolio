// Lightweight reveal behavior and composition initialization.
(function(){
 'use strict';
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver'in window){
  const selectors=['main > section','.card','.expertise-row','.process-grid li','.tool-grid-item','.review-card','.timeline-item','.home-timeline li','.brand-guideline-block','.experience-project-grid article','.portfolio-card','.campaign-card','.portfolio-section-header'];
  const items=[...document.querySelectorAll(selectors.join(','))];
  if(items.length){document.documentElement.classList.add('reveal-ready');items.forEach((item,index)=>{item.classList.add('reveal-item');item.style.setProperty('--reveal-delay',Math.min(index%4,3)*55+'ms');});const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;entry.target.classList.add('is-revealed');observer.unobserve(entry.target);}),{rootMargin:'0px 0px -7% 0px',threshold:.08});items.forEach(item=>observer.observe(item));}
 }
 const url=path=>new URL(path,document.baseURI).href;
 const release=()=>{if(typeof window.__compositionRelease==='function')requestAnimationFrame(()=>requestAnimationFrame(window.__compositionRelease));};
 function style(path,cb){const link=document.createElement('link');link.rel='stylesheet';link.href=url(path);if(cb){link.onload=cb;link.onerror=cb;}document.head.append(link);}
 function script(path,cb){const el=document.createElement('script');el.src=url(path);if(cb){el.onload=cb;el.onerror=cb;}document.body.append(el);}
 const home=!!document.querySelector('.portfolio-hero');
 const experience=/\/experience\/?$/.test(location.pathname);
 const work=/\/work\/?$/.test(location.pathname);
 if(home||experience){
  script('js/composition-v2.js?v=20260922-8',()=>{
   style('css/composition-finishing.css?v=20260922-8');
   script('js/composition-runtime-fixes.js?v=20260922-8',()=>{
    if(!home){style('css/site-final-polish.css?v=20260922-14',release);return;}
    style('css/composition-workflow-stage.css?v=20260922-9');
    style('css/composition-visibility-polish.css?v=20260922-10');
    style('css/hero-alignment-20260922.css?v=20260922-11');
    style('css/hero-reference-fidelity.css?v=20260922-12');
    style('css/composition-hero-alignment.css?v=20260922-13');
    script('js/composition-hero-alignment.js?v=20260922-18');
    script('js/composition-workflow-stage.js?v=20260922-9');
    style('css/site-final-polish.css?v=20260922-14');
    style('css/hero-final-specificity.css?v=20260922-18');
    style('css/website-card-color-lock.css?v=20260922-16');
    style('css/hero-mobile-spacing.css?v=20260922-19',release);
   });
  });
 }else if(work){
  document.body.classList.add('composition-work');
  style('css/composition-work.css?v=20260922-8');
  style('css/composition-v2.css?v=20260922-8');
  style('css/site-final-polish.css?v=20260922-14',release);
 }
})();
