/* GSAP motion layer for Experience. Respects reduced-motion preferences. */
(function(){
  'use strict';
  if(!document.body.classList.contains('composition-experience')) return;

  // Timeline: the accent rail fills as the list scrolls past, and the entry at mid-screen is marked
  // current. Measured live (not with ScrollTrigger) so late layout shifts never desync it.
  var list=document.querySelector('.comp-exp-list');
  if(list){
    var queued=false;
    var update=function(){queued=false;var r=list.getBoundingClientRect();var mid=innerHeight*.55;list.style.setProperty('--timeline-progress',Math.max(0,Math.min(1,(mid-r.top)/Math.max(1,r.height))).toFixed(3));};
    addEventListener('scroll',function(){if(!queued){queued=true;requestAnimationFrame(update);}},{passive:true});
    addEventListener('resize',update);update();
    if('IntersectionObserver' in window){
      var io=new IntersectionObserver(function(entries){entries.forEach(function(e){e.target.classList.toggle('is-current',e.isIntersecting);});},{rootMargin:'-45% 0px -45% 0px'});
      [].forEach.call(list.children,function(li){io.observe(li);});
    }
  }
  if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function load(src){
    return new Promise(function(resolve,reject){
      var existing=[...document.scripts].find(function(s){return s.src===src});
      if(existing){ if(existing.dataset.ready==='true'||/complete|loaded/.test(existing.readyState||'')) return resolve(); existing.addEventListener('load',resolve,{once:true}); existing.addEventListener('error',reject,{once:true}); return; }
      var s=document.createElement('script');s.src=src;s.defer=true;
      s.addEventListener('load',function(){s.dataset.ready='true';resolve();},{once:true});
      s.addEventListener('error',reject,{once:true});document.head.appendChild(s);
    });
  }
  function start(){
    if(!window.gsap||!window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    var ease='power3.out';
    gsap.from('.experience-composition-hero > img',{y:42,opacity:0,scale:.96,duration:1,ease:ease});
    gsap.from('.experience-composition-hero .comp-float-icons i',{y:24,opacity:0,scale:.75,stagger:.09,duration:.7,ease:ease,delay:.15});
    gsap.from('.comp-stats > div',{scrollTrigger:{trigger:'.comp-stats',start:'top 86%',once:true},y:28,opacity:0,stagger:.08,duration:.65,ease:ease});
    gsap.utils.toArray('.comp-exp-list > li').forEach(function(el){
      gsap.from(el,{scrollTrigger:{trigger:el,start:'top 90%',once:true},y:26,opacity:0,duration:.62,ease:ease});
    });
    gsap.from('.comp-green-top > *',{scrollTrigger:{trigger:'.comp-green-panel',start:'top 80%',once:true},y:34,opacity:0,stagger:.1,duration:.75,ease:ease});
    gsap.from('.comp-skill-grid article',{scrollTrigger:{trigger:'.comp-skill-grid',start:'top 84%',once:true},y:30,opacity:0,stagger:.07,duration:.65,ease:ease});
    gsap.utils.toArray('.comp-service-row').forEach(function(el,i){
      gsap.from(el,{scrollTrigger:{trigger:el,start:'top 92%',once:true},x:i%2?-24:24,opacity:0,duration:.55,ease:ease});
    });
    gsap.from('.comp-tool-grid > div',{scrollTrigger:{trigger:'.comp-tool-grid',start:'top 88%',once:true},y:22,opacity:0,scale:.96,stagger:.035,duration:.5,ease:ease});
    gsap.from('.comp-collab-grid article',{scrollTrigger:{trigger:'.comp-collab-grid',start:'top 86%',once:true},y:34,opacity:0,stagger:.12,duration:.72,ease:ease});
    gsap.utils.toArray('.composition-preserved-projects,.composition-preserved-education,#asset-library').forEach(function(el){
      gsap.from(el,{scrollTrigger:{trigger:el,start:'top 94%',once:true},y:28,opacity:0,duration:.65,ease:ease});
    });
  }
  load('https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js')
    .then(function(){return load('https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js')})
    .then(start)
    .catch(function(){/* Progressive enhancement: content remains fully usable without GSAP. */});
}());