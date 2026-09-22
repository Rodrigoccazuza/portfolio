/* final_version_oficial composition. Keeps existing work components and contact page intact. */
(function () {
  'use strict';
  const root = document.querySelector('main');
  if (!root) return;
  const isHome = !!document.querySelector('.portfolio-hero');
  const isExperience = /\/experience\/?$/.test(location.pathname);
  if (!isHome && !isExperience) return;
  const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = new URL('css/composition.css?v=20260922-2', document.baseURI).href; document.head.append(css);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const icon = name => `<i class="bi bi-${name}" aria-hidden="true"></i>`;

  function prepareHome() {
    document.body.classList.add('composition-home');
    const hero = document.querySelector('.portfolio-hero');
    const h1 = hero.querySelector('#hero-title');
    const kicker = hero.querySelector('.hero-kicker');
    kicker.textContent = 'Hi, I am';
    h1.querySelector('.accent-italic').textContent = 'Designer';
    // Preserve the live typewriter span and its existing controller in theme-motion.js.
    const text = hero.querySelector('.hero-statement');
    text.querySelector('.hero-statement-title').textContent = 'Designing, coding, and creating digital experiences that connect people with ideas.';
    const services = hero.querySelector('.hero-services'); if (services) services.setAttribute('aria-hidden', 'true');
    const stage = document.createElement('div'); stage.className = 'portrait-stage';
    stage.setAttribute('aria-label', 'Interactive 3D portrait. Move the pointer or scroll to change the gaze and expression.');
    stage.innerHTML = '<canvas id="composition-portrait" aria-hidden="true"></canvas><span class="model-loading" role="status">LOADING INTERACTIVE PORTRAIT</span>';
    const fallback = document.createElement('img'); fallback.className = 'hero-3d-fallback'; fallback.src = new URL('images/site/about-new.jpg',document.baseURI).href; fallback.alt = ''; fallback.setAttribute('aria-hidden','true');
    hero.append(stage,fallback);
    const portraitScript = document.createElement('script');portraitScript.type='module';portraitScript.src = new URL('js/composition-portrait.js?v=20260922-2',document.baseURI).href;document.body.append(portraitScript);
    const marquee = document.querySelector('.toolkit-marquee-viewport');
    if (marquee) marquee.setAttribute('aria-label','Continuously moving, full-color design and development tools');
    const about = document.createElement('section');about.className='comp-about';about.id='about';about.setAttribute('aria-labelledby','comp-about-title');
    about.innerHTML = `<img src="images/site/about-new.jpg" loading="lazy" alt="Rodrigo Cazuza portrait"><div><p class="eyebrow">A little introduction</p><h2 id="comp-about-title">A little<br><em>about me.</em></h2><p>I am Rodrigo Cazuza, a New York–based multimedia designer bringing visual design, digital marketing, and front-end development together.</p><p>From initial concepts and design systems to responsive websites, email campaigns, and motion, I connect the details across every stage.</p><div class="comp-links"><a href="experience/">Experience ${icon('arrow-up-right')}</a><a href="work/">Explore work ${icon('arrow-up-right')}</a><a href="contact/">Get in touch ${icon('arrow-up-right')}</a></div></div>`;
    const work = document.querySelector('#work');
    if (work) work.before(about);
    const nav = document.querySelector('.nav-links ul');
    if (nav) nav.innerHTML = '<li><a href="#about">About</a></li><li><a href="#websites">Work</a></li><li><a href="experience/">Experience</a></li><li><a href="contact/">Contact</a></li>';
    const heroAction = hero.querySelector('.hero-actions .btn-primary');if(heroAction)heroAction.href='#websites';
    prepareWorkflow();
  }

  function prepareWorkflow() {
    const section = document.querySelector('.concept-timeline'); if (!section) return;
    const list = section.querySelector('.concept-steps');if(!list)return;
    const steps = Array.from(list.children);if(!steps.length)return;
    const visual = document.createElement('div'); visual.className = 'comp-process-visual';
    visual.setAttribute('aria-label','Website build visual synchronized with the steps');
    visual.innerHTML = `<div class="comp-process-toolbar"><span>DESIGN PROCESS / 01—06</span><span class="comp-process-dots" aria-hidden="true">● ● ●</span></div><div class="comp-process-window" data-step="0"><div class="comp-process-art" aria-hidden="true"><span class="comp-nav"></span><span class="comp-header"></span><div class="comp-cards"><span></span><span></span><span></span></div></div><video class="comp-process-video" muted playsinline preload="auto" aria-label="Concept-to-implementation design video" hidden></video></div><div class="comp-process-status"><strong id="comp-process-label">01 / CONCEPT</strong><span>Scroll to explore each phase ${icon('arrow-down')}</span></div>`;
    list.after(visual);
    const windowEl = visual.querySelector('.comp-process-window');
    const video = visual.querySelector('video');
    const label = visual.querySelector('#comp-process-label');
    let duration = 0;let raf = 0;let targetTime = 0;
    // The actual supplied MP4 belongs at this relative path; the generated schematic
    // remains available as a visible fallback until that binary is uploaded.
    video.src = new URL('assets/video/concept-to-implementation.mp4', document.baseURI).href;
    video.addEventListener('loadedmetadata', () => { duration = Number.isFinite(video.duration) ? video.duration : 0; if(duration){video.hidden=false;sync();} });
    video.addEventListener('error', () => { video.hidden=true;duration=0; });
    video.addEventListener('seeked', () => { if(Math.abs(video.currentTime-targetTime)>.10)video.currentTime=targetTime; });
    function sync() {
      raf=0;
      const r=section.getBoundingClientRect(), top=innerHeight*.68, bottom=innerHeight*.30;
      const total=Math.max(1,r.height-top+bottom);
      const progress=Math.max(0,Math.min(1,(top-r.top)/total));
      const index=Math.min(steps.length-1,Math.floor(progress*steps.length));
      steps.forEach((step,i)=>{step.classList.toggle('is-current',i===index);if(i===index)step.setAttribute('aria-current','step');else step.removeAttribute('aria-current');});
      windowEl.dataset.step=String(index);
      label.textContent=String(index+1).padStart(2,'0')+' / '+steps[index].querySelector('h3').textContent.toUpperCase();
      if (duration && video.readyState>=1){targetTime=Math.min(duration-.04,Math.max(0,progress*duration));if(Math.abs(video.currentTime-targetTime)>.045)video.currentTime=targetTime;}
    }
    function queue(){if(!raf)raf=requestAnimationFrame(sync);}
    window.addEventListener('scroll',queue,{passive:true});window.addEventListener('resize',queue);sync();
  }

  function prepareExperience() {
    document.body.classList.add('composition-experience');
    const oldLibrary = root.querySelector('#asset-library');
    const preservedLibrary = oldLibrary ? oldLibrary.cloneNode(true) : null;
    root.replaceChildren();
    const hero = document.createElement('section');hero.className='experience-composition-hero';hero.setAttribute('aria-label','Rodrigo Cazuza creative experience');
    hero.innerHTML = `<div class="comp-float-icons" aria-hidden="true">${icon('wordpress')}${icon('code-slash')}${icon('robot')}${icon('palette')}</div><img src="images/site/hero.jpg" alt="Rodrigo Cazuza at his workstation"><span class="comp-hero-caption">DESIGN × DEVELOPMENT × MARKETING</span>`;
    const stats = document.createElement('section');stats.className='comp-stats';stats.setAttribute('aria-label','Professional areas');
    stats.innerHTML = `<div>${icon('code-square')}<strong>Web</strong><span>Design & front-end</span></div><div>${icon('brush')}<strong>Design</strong><span>Visual & multimedia</span></div><div>${icon('envelope-paper')}<strong>Marketing</strong><span>Email & campaigns</span></div><div>${icon('play-circle')}<strong>Motion</strong><span>Video & creative</span></div>`;
    const timeline = document.createElement('section');timeline.className='comp-exp-timeline';timeline.id='timeline';timeline.innerHTML=`<p class="comp-eyebrow">The creative path</p><h1>Experience timeline</h1><ol class="comp-exp-list"><li><time>2026 — Present</time><div><h3>E-mail & Web Designer</h3><p>48 Hours Digital · Contract — Designing lifecycle email series and landing pages for agency and brand partners.</p></div></li><li><time>2025 — Present</time><div><h3>Multimedia Designer & Marketing Manager</h3><p>BodyFactory Skin Care — Brand systems, email marketing, paid creative, social content, websites and video.</p></div></li><li><time>2024 — 2025</time><div><h3>Supplemental Instruction Leader</h3><p>Borough of Manhattan Community College — Helping students with design, programming, technical questions and creative feedback.</p></div></li><li><time>2022 — Present</time><div><h3>Patient Liaison & Front Desk Manager</h3><p>Curated Mental Health — Patient communications, scheduling and operational workflows.</p></div></li><li><time>Independent work</time><div><h3>Freelance & Academic Projects</h3><p>Selected multidisciplinary work across brand identity, front-end, creative campaigns and digital experiences.</p></div></li><li><time>2022 — 2024</time><div><h3>Multimedia Programming & Design</h3><p>BMCC — Associate degree, with study in graphic design, development and digital production.</p></div></li></ol>`;
    const green = document.createElement('section');green.className='comp-green-panel';green.innerHTML=`<div class="comp-green-top"><h2>I DO MORE<br>THAN MAKE THE<br><em>asset.</em></h2><p>I make the details across research, strategy, design, development, marketing, and experience connect. Each discipline supports the others, from the first idea to the final delivery.</p></div><div class="comp-skill-grid"><article>${icon('search')}<h3>Research & strategy</h3></article><article>${icon('bezier2')}<h3>Branding & visual systems</h3></article><article>${icon('window-desktop')}<h3>Web design & front-end</h3></article><article>${icon('envelope')}<h3>E-mail campaigns</h3></article><article>${icon('camera-reels')}<h3>Motion & video</h3></article><article>${icon('diagram-3')}<h3>Creative collaboration</h3></article></div>`;
    const services = document.createElement('section');services.className='comp-services';services.innerHTML='<p class="comp-eyebrow">What I create</p><h2>Explore the work</h2>';
    [['Brand Systems','Identity, guidelines and reusable components','work/brand-systems/'],['Email Design','Lifecycle flows and campaigns','work/email-design/'],['Meta Ad Creatives','Digital campaigns and creative variations','work/meta-ad-creatives/'],['Social Media','Branded content and short-form communication','work/'],['Video','Editing, motion and storytelling','work/video/'],['Web Design','Responsive experiences and front-end production','work/web-design/'],['YouTube','Creator video and long-form edits','work/']].forEach((entry,i)=>{const a=document.createElement('a');a.className='comp-service-row';a.href=entry[2];a.innerHTML=`<small>${String(i+1).padStart(2,'0')}</small><h3>${entry[0]}</h3><p>${entry[1]}</p>${icon('arrow-up-right')}`;services.append(a);});
    const tools = document.createElement('section');tools.className='comp-tools';tools.innerHTML='<p class="comp-eyebrow">My creative stack</p><h2>Tools I use</h2><div class="comp-tool-grid"></div>';
    const grid=tools.querySelector('.comp-tool-grid');
    [['Photoshop','photoshop.png'],['Illustrator','illustrator.png'],['InDesign','indesign.png'],['Figma','figma.png'],['Canva','canva.png'],['WordPress','wordpress.png'],['Elementor','elementor.png'],['Webflow','webflow.png'],['HTML5','html5.png'],['CSS3','css3.png'],['JavaScript','javascript.png'],['VS Code','vscode.png'],['Klaviyo','klaviyo.png'],['CapCut','capcut.png'],['Notion','notion.png'],['ChatGPT','chatgpt.jpg']].forEach(([name,file])=>{const div=document.createElement('div');const img=document.createElement('img');img.src=new URL('images/tools/'+file,document.baseURI).href;img.alt='';img.loading='lazy';const span=document.createElement('span');span.textContent=name;div.append(img,span);grid.append(div);});
    const approach = document.createElement('section');approach.className='comp-testimonials';approach.innerHTML=`<p class="comp-eyebrow">Collaboration & process</p><h2>How I approach<br><em>the work.</em></h2><div class="comp-quotes"><blockquote>Translate a loose idea into a cohesive system, with visual decisions connected to real content and clear goals.<cite>Concept → strategy → design</cite></blockquote><blockquote>Bring layout and interaction into production with responsive implementation and thoughtful details.<cite>Design → development</cite></blockquote><blockquote>Build digital communications across email, campaign assets, and social formats with brand consistency.<cite>Creative → marketing</cite></blockquote><blockquote>Keep iterating through testing, feedback, and collaboration until the experience is clear and usable.<cite>Review → refinement</cite></blockquote></div>`;
    root.append(hero,stats,timeline,green,services,tools,approach);
    if (preservedLibrary) root.append(preservedLibrary);
    const nav=document.querySelector('.nav-links ul');if(nav)nav.innerHTML='<li><a href="">Home</a></li><li><a href="work/">Work</a></li><li><a href="experience/" aria-current="page">Experience</a></li><li><a href="contact/">Contact</a></li>';
    document.title='Experience | Rodrigo Cazuza';
  }
  if (isHome) prepareHome();
  if (isExperience) prepareExperience();
}());
