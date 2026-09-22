/* Fixed dark mode and consistent pre-composition first paint. */
(function(){
 'use strict';
 const root=document.documentElement;
 root.classList.add('dark');
 const rootPath=new URL(document.baseURI).pathname.replace(/\/$/,'');
 const current=location.pathname.replace(/\/$/,'');
 const relative=current.slice(rootPath.length).replace(/^\//,'');
 const needsComposition=relative===''||relative==='work'||relative==='experience';
 // This inline rule is installed synchronously from <head>, before the old hero can paint.
 // Reveal only after the new styles are applied; an error fallback prevents a blank page.
 if(needsComposition){
   root.classList.add('composition-boot');
   const critical=document.createElement('style');
   critical.id='composition-first-paint';
   critical.textContent='html.composition-boot:not(.composition-ready) body{opacity:0!important}html.composition-ready body{opacity:1!important;transition:opacity .35s ease!important}@media(prefers-reduced-motion:reduce){html.composition-ready body{transition:none!important}}';
   document.head.append(critical);
   window.__compositionRelease=function(){root.classList.add('composition-ready');root.classList.remove('composition-boot');};
   // Network/extension failures must never leave an invisible document indefinitely.
   setTimeout(()=>{if(!root.classList.contains('composition-ready'))window.__compositionRelease();},6500);
 }
 const sheet=document.createElement('link');sheet.rel='stylesheet';sheet.href=new URL('css/site-final-polish.css?v=20260922-13',document.baseURI).href;document.head.append(sheet);
 const script=document.createElement('script');script.src=new URL('js/site-final-polish.js?v=20260922-13',document.baseURI).href;script.defer=true;document.head.append(script);
})();
