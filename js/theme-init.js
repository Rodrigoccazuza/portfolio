/* Neumorphic light theme (html.neu) and consistent pre-composition first paint. */
(function(){
 'use strict';
 const root=document.documentElement;
 root.classList.add('neu');
 // Saved light/dark choice is applied before first paint (light is the default).
 try{if(localStorage.getItem('rc-theme')==='dark')root.classList.add('neu-dark');}catch(e){}
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
   // Home shows the preloader during boot, so only the page beneath it is hidden.
   critical.textContent=relative===''
     ?'html.composition-boot:not(.composition-ready) body>:not(.site-preloader){opacity:0!important}'
     :'html.composition-boot:not(.composition-ready) body{opacity:0!important}html.composition-ready body{opacity:1!important;transition:opacity .35s ease!important}@media(prefers-reduced-motion:reduce){html.composition-ready body{transition:none!important}}';
   document.head.append(critical);
   window.__compositionRelease=function(){root.classList.add('composition-ready');root.classList.remove('composition-boot');};
   // Network/extension failures must never leave an invisible document indefinitely.
   setTimeout(()=>{if(!root.classList.contains('composition-ready'))window.__compositionRelease();},6500);
 }
 const sheet=document.createElement('link');sheet.rel='stylesheet';sheet.href=new URL('css/site-final-polish.css?v=20260922-13',document.baseURI).href;document.head.append(sheet);
 // Sitewide design system and dynamic navigation load on every page.
 ['css/neu-system.css?v=20261011-3','css/nav-dynamic.css?v=20261011-3','css/site-refinements.css?v=20261011-5'].forEach(path=>{const link=document.createElement('link');link.rel='stylesheet';link.href=new URL(path,document.baseURI).href;document.head.append(link);});
 const nav=document.createElement('script');nav.src=new URL('js/nav-dynamic.js?v=20261011-3',document.baseURI).href;nav.defer=true;document.head.append(nav);
 const script=document.createElement('script');script.src=new URL('js/site-final-polish.js?v=20260922-13',document.baseURI).href;script.defer=true;document.head.append(script);
})();
