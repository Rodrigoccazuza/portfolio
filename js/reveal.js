// Lightweight reveal behavior plus one page-composition entry point.
(function () {
  'use strict';
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    var selectors=['main > section','.card','.expertise-row','.process-grid li','.tool-grid-item','.review-card','.timeline-item','.home-timeline li','.brand-guideline-block','.experience-project-grid article','.portfolio-card','.campaign-card','.portfolio-section-header'];
    var items=Array.prototype.slice.call(document.querySelectorAll(selectors.join(',')));
    if(items.length){
      document.documentElement.classList.add('reveal-ready');
      items.forEach(function(item,index){item.classList.add('reveal-item');item.style.setProperty('--reveal-delay',Math.min(index%4,3)*55+'ms');});
      var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(!entry.isIntersecting)return;entry.target.classList.add('is-revealed');observer.unobserve(entry.target);});},{rootMargin:'0px 0px -7% 0px',threshold:.08});
      items.forEach(function(item){observer.observe(item);});
    }
  }
  var home=!!document.querySelector('.portfolio-hero');
  var experience=/\/experience\/?$/.test(location.pathname);
  var work=/\/work\/?$/.test(location.pathname);
  if(home||experience){
    var script=document.createElement('script');
    script.src=new URL('js/composition-v2.js?v=20260922-7',document.baseURI).href;
    script.onload=function(){
      var fixes=document.createElement('script');fixes.src=new URL('js/composition-runtime-fixes.js?v=20260922-7',document.baseURI).href;document.body.append(fixes);
    };
    document.body.append(script);
    // ONE workflow controller inside composition-v2; never load legacy handlers.
  }else if(work){
    document.body.classList.add('composition-work');
    var stylesheet=document.createElement('link');stylesheet.rel='stylesheet';stylesheet.href=new URL('css/composition-work.css?v=20260922-7',document.baseURI).href;document.head.append(stylesheet);
    var refinement=document.createElement('link');refinement.rel='stylesheet';refinement.href=new URL('css/composition-v2.css?v=20260922-7',document.baseURI).href;document.head.append(refinement);
  }
}());
