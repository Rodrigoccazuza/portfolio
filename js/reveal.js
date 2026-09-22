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
    script.src=new URL('js/composition-v2.js?v=20260922-8',document.baseURI).href;
    script.onload=function(){
      var finishing=document.createElement('link');finishing.rel='stylesheet';finishing.href=new URL('css/composition-finishing.css?v=20260922-8',document.baseURI).href;document.head.append(finishing);
      var fixes=document.createElement('script');fixes.src=new URL('js/composition-runtime-fixes.js?v=20260922-8',document.baseURI).href;
      fixes.onload=function(){
        if(!home)return;
        var stageStyles=document.createElement('link');stageStyles.rel='stylesheet';stageStyles.href=new URL('css/composition-workflow-stage.css?v=20260922-9',document.baseURI).href;document.head.append(stageStyles);
        // The workflow dock takes precedence over the legacy process styles.
        var visibility=document.createElement('link');visibility.rel='stylesheet';visibility.href=new URL('css/composition-visibility-polish.css?v=20260922-10',document.baseURI).href;document.head.append(visibility);
        // Reference hero geometry must be last so legacy !important positioning cannot override it.
        var heroAlignment=document.createElement('link');heroAlignment.rel='stylesheet';heroAlignment.href=new URL('css/hero-alignment-20260922.css?v=20260922-11',document.baseURI).href;document.head.append(heroAlignment);
        // Preserve the animated word and 3D model; adjust only existing copy and nav labels.
        var kicker=document.querySelector('.portfolio-hero .hero-kicker');if(kicker)kicker.textContent="Hey, I'm a";
        var statement=document.querySelector('.portfolio-hero .hero-statement-title');if(statement)statement.textContent='Design, marketing, and front-end development in one creative practice.';
        var links=document.querySelector('.nav-links ul');if(links)links.innerHTML='<li><a href="">Home</a></li><li><a href="#websites">Work</a></li><li><a href="experience/">Experience</a></li>';
        var stage=document.createElement('script');stage.src=new URL('js/composition-workflow-stage.js?v=20260922-9',document.baseURI).href;document.body.append(stage);
      };
      document.body.append(fixes);
    };
    document.body.append(script);
  }else if(work){
    document.body.classList.add('composition-work');
    var stylesheet=document.createElement('link');stylesheet.rel='stylesheet';stylesheet.href=new URL('css/composition-work.css?v=20260922-8',document.baseURI).href;document.head.append(stylesheet);
    var refinement=document.createElement('link');refinement.rel='stylesheet';refinement.href=new URL('css/composition-v2.css?v=20260922-8',document.baseURI).href;document.head.append(refinement);
  }
}());
