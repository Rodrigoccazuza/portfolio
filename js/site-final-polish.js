/* Shared branch polish, no changes to original main-branch files. The contact footer is the canonical footer. */
(function(){
  'use strict';
  function run(){
    const footer=document.querySelector('footer.site-footer');
    if(footer){
      footer.innerHTML=`<div class="container footer-cta-wrap"><div class="footer-cta"><div class="footer-cta-copy"><p class="eyebrow">Have a project in mind?</p><h2>Ready to bring<br>your vision to <span class="accent-italic">life?</span></h2><p>Let’s turn your next campaign, brand system, video, or website into something clear, useful, and memorable.</p><a class="btn btn-primary" href="contact/">Start a project <i class="bi bi-arrow-right" aria-hidden="true"></i></a></div><img class="footer-portrait" src="images/site/footer-portrait.png" alt="Rodrigo Cazuza wearing sunglasses and a purple shirt" width="1536" height="1024" loading="lazy" decoding="async"></div></div><div class="container footer-panel"><div class="footer-panel-intro"><p class="footer-identity">Rodrigo<br>Cazuza.</p><p>Multimedia design and front-end development shaped around strategy, story, and real-world production.</p></div><div class="footer-columns"><div><h3>Services</h3><ul class="footer-links"><li><a href="work/brand-systems/">Brand systems</a></li><li><a href="work/email-design/">Email design</a></li><li><a href="work/meta-ad-creatives/">Meta ad creative</a></li><li><a href="work/video/">Video production</a></li><li><a href="work/web-design/">Web design</a></li></ul></div><nav aria-label="Footer"><h3>Explore</h3><ul class="footer-links"><li><a href="work/">Work</a></li><li><a href="experience/">Experience</a></li><li><a href="resume/">Résumé</a></li><li><a href="contact/">Contact</a></li></ul></nav><div><h3>Let’s connect</h3><a class="footer-email" href="mailto:visualdesigner@rodrigocazuza.com">visualdesigner@rodrigocazuza.com</a><ul class="social-row"><li><a href="https://github.com/Rodrigoccazuza" target="_blank" rel="noopener noreferrer">GitHub</a></li><li><a href="https://www.linkedin.com/in/rodrigocazuza/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li><li><a href="https://www.youtube.com/@Drigoverse" target="_blank" rel="noopener noreferrer">YouTube</a></li></ul></div><div><h3>Location</h3><p>New York City</p><p>Available for freelance and collaborative projects.</p></div></div></div><div class="container footer-bottom"><p>© 2026 Rodrigo Cazuza. All rights reserved.</p><a href="#main-content">Back to top <i class="bi bi-arrow-up" aria-hidden="true"></i></a></div>`;
    }
    // Button and link labels must never use emoji or Unicode arrows as their UI glyph.
    document.querySelectorAll('a.btn,button.btn,.stack-copy a').forEach(button=>{
      button.querySelectorAll('span[aria-hidden="true"]').forEach(span=>{
        if(/^[\s↗↖↘↙→←↑↓➜➝▶►✦✨]+$/u.test(span.textContent)){const ico=document.createElement('i');ico.className='bi bi-arrow-up-right';ico.setAttribute('aria-hidden','true');span.replaceWith(ico);}
      });
      const walker=document.createTreeWalker(button,NodeFilter.SHOW_TEXT);const changes=[];
      while(walker.nextNode())if(/[↗↖↘↙→←↑↓➜➝▶►✨🚀🔥💡🎨]/u.test(walker.currentNode.nodeValue))changes.push(walker.currentNode);
      changes.forEach(text=>{
        const cleaned=text.nodeValue.replace(/[↗↖↘↙→←↑↓➜➝▶►✨🚀🔥💡🎨]/gu,'').replace(/\s+/g,' ');
        const hadIcon=button.querySelector('i.bi');text.nodeValue=cleaned;
        if(!hadIcon){const i=document.createElement('i');i.className='bi bi-arrow-up-right';i.setAttribute('aria-hidden','true');button.append(i);}
      });
    });
    // Never remove meaningful hostname/domain copy from actual project descriptions.
    document.querySelectorAll('.centered-websites .stack-dots').forEach(node=>{node.style.color='#66d487';});
    document.documentElement.classList.add('site-polish-ready');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
