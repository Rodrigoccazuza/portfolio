/* Reference composition v2: one workflow controller, preserve verified experience content. */
(function () {
  'use strict';
  const main = document.querySelector('main');
  if (!main) return;
  const home = !!document.querySelector('.portfolio-hero');
  const experience = /\/experience\/?$/.test(location.pathname);
  if (!home && !experience) return;
  const base = path => new URL(path, document.baseURI).href;
  const sheet = document.createElement('link'); sheet.rel = 'stylesheet'; sheet.href = base('css/composition.css?v=20260922-2'); document.head.append(sheet);
  const refinement = document.createElement('link'); refinement.rel = 'stylesheet'; refinement.href = base('css/composition-v2.css?v=20260922-6'); document.head.append(refinement);
  const icon = name => `<i class="bi bi-${name}" aria-hidden="true"></i>`;
  if (!document.querySelector('link[href*="bootstrap-icons"]')) {
    const icons = document.createElement('link'); icons.rel = 'stylesheet'; icons.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css'; document.head.append(icons);
  }
  function section(className, markup) { const element = document.createElement('section'); element.className = className; element.innerHTML = markup; return element; }

  function composeHome() {
    document.body.classList.add('composition-home', 'composition-v2');
    const hero = document.querySelector('.portfolio-hero');
    if (!hero) return;
    const kicker = hero.querySelector('.hero-kicker'); if (kicker) kicker.textContent = 'Hi, I am';
    const designer = hero.querySelector('#hero-title .accent-italic'); if (designer) designer.textContent = 'Designer';
    const statement = hero.querySelector('.hero-statement-title');
    if (statement) statement.textContent = 'Design, code, and creative direction — connected from concept to launch.';
    const services = hero.querySelector('.hero-services'); if (services) services.hidden = true;
    const portrait = document.createElement('div'); portrait.className = 'portrait-stage';
    portrait.setAttribute('aria-label', 'Interactive portrait responds to pointer movement and page scrolling');
    portrait.innerHTML = '<canvas id="composition-portrait" aria-hidden="true"></canvas><span class="model-loading" role="status">LOADING INTERACTIVE PORTRAIT</span>';
    const fallback = document.createElement('img');fallback.className = 'hero-3d-fallback';fallback.src = base('images/site/about-new.jpg');fallback.alt = '';fallback.setAttribute('aria-hidden','true');
    hero.append(portrait, fallback);
    const model = document.createElement('script');model.type = 'module';model.src = base('js/composition-portrait-v2.js?v=20260922-6');document.body.append(model);
    const marquee = document.querySelector('.toolkit-marquee-viewport');
    if (marquee) {marquee.setAttribute('aria-label', 'Continuous carousel of design and development tools');marquee.removeAttribute('tabindex');}
    const about = section('comp-about', `<img src="${base('images/site/about-new.jpg')}" loading="lazy" alt="Portrait of Rodrigo Cazuza"><div><p class="eyebrow">01 / About me</p><h2 id="composition-about-title">A little<br><em>about me.</em></h2><p>I’m Rodrigo Cazuza, a New York–based multimedia designer connecting creative direction, marketing and front-end development.</p><p>I work from early concepts and design systems through responsive websites, email campaigns, paid creative and motion.</p><div class="comp-links"><a href="${base('experience/')}">Experience ${icon('arrow-up-right')}</a><a href="${base('work/')}">Work ${icon('arrow-up-right')}</a><a href="${base('contact/')}">Get in touch ${icon('arrow-up-right')}</a></div></div>`);
    about.id = 'about';about.setAttribute('aria-labelledby','composition-about-title');
    const work = document.getElementById('work');if (work) work.before(about);
    const nav = document.querySelector('.nav-links ul');if(nav)nav.innerHTML = '<li><a href="#about">About</a></li><li><a href="#websites">Work</a></li><li><a href="experience/">Experience</a></li><li><a href="contact/">Contact</a></li>';
    const primary = hero.querySelector('.hero-actions .btn-primary');if(primary)primary.href = '#websites';
    // The website stack is generated synchronously by portfolio.js before reveal.js runs.
    const process = document.querySelector('.concept-timeline');if(process) installWorkflow(process);
    // Replace the remaining simple pictograms without clearing full button labels.
    document.querySelectorAll('.folder-video,.folder-play,.campaign-marker').forEach(node=>{
      const name=node.matches('.campaign-marker')?'circle-fill':node.matches('.folder-play')?'play-fill':'play-circle-fill';
      const text=node.matches('.folder-play')?' Play video':'';
      node.replaceChildren();const glyph=document.createElement('i');glyph.className='bi bi-'+name;glyph.setAttribute('aria-hidden','true');node.append(glyph,document.createTextNode(text));
    });
  }

  function installWorkflow(process) {
    const list = process.querySelector('.concept-steps');if(!list)return;
    const steps = [...list.querySelectorAll('.concept-step')];if(steps.length!==6)return;
    const titles=['Concept','Sketch','Moodboard','Style Guide','Wireframes','Prototype & Build'];
    const descriptions=[
      'Set the objective and define the creative direction.',
      'Explore page structure with a rough annotated sketch.',
      'Curate references, imagery and visual inspiration.',
      'Define type, color, spacing and interface components.',
      'Map the page hierarchy in low-fidelity wireframes.',
      'Refine the high-fidelity design, interaction and final build.'
    ];
    steps.forEach((step,index)=>{const heading=step.querySelector('h3');const text=step.querySelector('p');if(heading)heading.textContent=titles[index];if(text)text.textContent=descriptions[index];});
    process.querySelector('.interaction-heading h2')?.replaceChildren(document.createTextNode('A clear path from idea to launch'));
    const visual = document.createElement('div');visual.className='comp-process-visual';
    visual.innerHTML=`<div class="comp-process-toolbar"><span>FROM CONCEPT TO BUILD</span><span class="comp-process-dots" aria-hidden="true">${icon('circle-fill')} ${icon('circle-fill')} ${icon('circle-fill')}</span></div><div class="comp-process-window" data-step="0"><div class="comp-process-art" aria-hidden="true"><span class="comp-nav"></span><span class="comp-header"></span><div class="comp-cards"><span></span><span></span><span></span></div></div><video class="comp-process-video" muted playsinline preload="metadata" aria-label="Website sketch to completed design: scroll to explore" hidden></video></div><div class="comp-process-status"><strong id="comp-process-label">01 / CONCEPT</strong><span>Scroll to explore each phase ${icon('arrow-down')}</span></div>`;
    list.after(visual);
    const windowElement=visual.querySelector('.comp-process-window');const video=visual.querySelector('video');const status=visual.querySelector('#comp-process-label');
    video.src=base('assets/video/concept-to-implementation.mp4');video.muted=true;video.pause();
    const boundaries=[0,1,2,4,6,8,10];let duration=0,frame=0,target=0,seeking=false;
    function render(){
      frame=0;const rect=process.getBoundingClientRect();const start=innerHeight*.75;const end=innerHeight*.24;
      const progress=Math.max(0,Math.min(1,(start-rect.top)/Math.max(1,rect.height-start+end)));
      const time=progress*(duration||10);let active=5;
      for(let i=0;i<6;i++){if(time<boundaries[i+1]){active=i;break;}}
      steps.forEach((step,i)=>{step.classList.toggle('is-current',i===active);if(i===active)step.setAttribute('aria-current','step');else step.removeAttribute('aria-current');});
      windowElement.dataset.step=String(active);status.textContent=String(active+1).padStart(2,'0')+' / '+titles[active].toUpperCase();
      if(duration&&video.readyState>=1){target=Math.max(0,Math.min(duration-.04,time));if(!seeking&&Math.abs(video.currentTime-target)>.055){seeking=true;try{video.currentTime=target;}catch(error){seeking=false;console.warn('Workflow seeking unavailable',error);}}}
    }
    const queue=()=>{if(!frame)frame=requestAnimationFrame(render);};
    video.addEventListener('loadedmetadata',()=>{duration=Number.isFinite(video.duration)?video.duration:0;if(duration){video.hidden=false;video.pause();}queue();});
    video.addEventListener('error',()=>{video.hidden=true;duration=0;queue();});
    video.addEventListener('seeked',()=>{seeking=false;queue();});
    video.addEventListener('play',()=>video.pause());
    addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue);queue();
  }

  function composeExperience(){
    document.body.classList.add('composition-experience','composition-v2');
    const oldTimeline=main.querySelector('.timeline');
    const originalRoles=oldTimeline?[...oldTimeline.querySelectorAll('.timeline-item')]:[];
    const originalProjects=main.querySelector('.experience-project-grid')?.closest('section');
    const originalEducation=[...main.querySelectorAll('section.section')].find(el=>el.querySelector('.section-heading h2')?.textContent.trim()==='BMCC');
    const originalLibrary=main.querySelector('#asset-library');
    main.replaceChildren();
    const hero=section('experience-composition-hero',`<div class="experience-hero-art" aria-hidden="true"><span class="experience-wireframe experience-wireframe--one"></span><span class="experience-wireframe experience-wireframe--two"></span></div><div class="comp-float-icons" aria-hidden="true">${icon('wordpress')}${icon('code-slash')}${icon('palette')}${icon('camera-reels')}</div><img src="${base('images/site/hero.jpg')}" alt="Rodrigo Cazuza at his workstation"><span class="comp-hero-caption">DESIGN × DEVELOPMENT × MARKETING</span>`);
    const stats=section('comp-stats',`<div>${icon('code-square')}<strong>Web</strong><span>Front-end & design</span></div><div>${icon('brush')}<strong>Design</strong><span>Multimedia & branding</span></div><div>${icon('envelope-paper')}<strong>Marketing</strong><span>Email & campaigns</span></div><div>${icon('play-circle')}<strong>Motion</strong><span>Video & creative</span></div>`);stats.setAttribute('aria-label','Professional disciplines');
    const timeline=section('comp-exp-timeline','<p class="comp-eyebrow">Selected career history</p><h1>Experience timeline</h1><ol class="comp-exp-list"></ol>');timeline.id='timeline';
    const entries=timeline.querySelector('ol');
    const contract=document.createElement('li');contract.innerHTML='<time>Contract</time><div><h3>E-mail & Web Designer</h3><p>48 Hours Digital — Contract work on email series and landing pages for the agency and its brand partners.</p></div>';entries.append(contract);
    originalRoles.forEach(role=>{
      const title=role.querySelector('.timeline-role')?.textContent.trim()||'Professional role';
      const organization=role.querySelector('.timeline-org')?.textContent.trim()||'';
      let date=role.querySelector('.timeline-dates')?.textContent.trim()||'';
      if(/Supplemental Instruction Leader/i.test(title))date='2024 — 2025';
      const details=role.querySelector('.timeline-dates')?.nextElementSibling?.textContent.trim()||'';
      const item=document.createElement('li');const time=document.createElement('time');time.textContent=date;
      const copy=document.createElement('div');const h3=document.createElement('h3');h3.textContent=title;const p=document.createElement('p');p.textContent=[organization,details].filter(Boolean).join(' — ');copy.append(h3,p);item.append(time,copy);entries.append(item);
    });
    const green=section('comp-green-panel',`<div class="comp-green-top"><h2>I DO MORE<br>THAN MAKE THE<br><em>asset.</em></h2><p>Research, strategy, design, development and marketing connect across the full creative process. Each decision should support the next, from first concept to delivery.</p></div><div class="comp-skill-grid"><article>${icon('search')}<h3>Research & strategy</h3></article><article>${icon('bezier2')}<h3>Branding & visual systems</h3></article><article>${icon('window-desktop')}<h3>Web design & front-end</h3></article><article>${icon('envelope')}<h3>Email campaigns</h3></article><article>${icon('camera-reels')}<h3>Motion & video</h3></article><article>${icon('diagram-3')}<h3>Creative collaboration</h3></article></div>`);
    const services=section('comp-services','<p class="comp-eyebrow">Selected disciplines</p><h2>What I create</h2>');
    [['Brand Systems','Identity, guidelines and reusable design components','work/brand-systems/'],['Email Design','Campaigns, flows and responsive email systems','work/email-design/'],['Meta Ad Creatives','Paid social assets and campaign variations','work/meta-ad-creatives/'],['Social Media','Branded digital content','work/'],['Video','Video production, editing and motion','work/video/'],['Web Design','Responsive websites and front-end production','work/web-design/'],['YouTube','Video production and channel content','work/']].forEach((item,i)=>{
      const a=document.createElement('a');a.className='comp-service-row';a.href=base(item[2]);a.innerHTML=`<small>${String(i+1).padStart(2,'0')}</small><h3>${item[0]}</h3><p>${item[1]}</p>${icon('arrow-up-right')}`;services.append(a);
    });
    const tools=section('comp-tools','<p class="comp-eyebrow">My creative stack</p><h2>Tools I use</h2><div class="comp-tool-grid"></div>');
    const toolGrid=tools.querySelector('.comp-tool-grid');
    [['Photoshop','photoshop.png'],['Illustrator','illustrator.png'],['InDesign','indesign.png'],['Figma','figma.png'],['Canva','canva.png'],['WordPress','wordpress.png'],['Elementor','elementor.png'],['Webflow','webflow.png'],['HTML5','html5.png'],['CSS3','css3.png'],['JavaScript','javascript.png'],['VS Code','vscode.png'],['Klaviyo','klaviyo.png'],['CapCut','capcut.png'],['Notion','notion.png'],['ChatGPT','chatgpt.jpg']].forEach(([name,file])=>{const div=document.createElement('div');const image=document.createElement('img');image.src=base('images/tools/'+file);image.alt='';image.loading='lazy';const label=document.createElement('span');label.textContent=name;div.append(image,label);toolGrid.append(div);});
    // Do not invent or attribute testimonials. Keep the reference's two-column card treatment
    // with genuine portfolio projects, and reserve actual quotations for verified copy.
    const collaborations=section('comp-testimonials',`<p class="comp-eyebrow">Selected collaborations</p><h2>Work made<br><em>with others.</em></h2><p class="comp-collab-intro">A selection of collaborations and projects across client work, brand systems and digital experiences.</p><div class="comp-quotes comp-collab-grid"><article><span class="comp-eyebrow">01 / Brand & campaigns</span><h3>BodyFactory Skin Care</h3><p>Multimedia design, campaign production and marketing systems.</p><a href="${base('projects/brand-systems-bodyfactory/')}">Explore the project ${icon('arrow-up-right')}</a></article><article><span class="comp-eyebrow">02 / Photography & web</span><h3>Tainá Borges Photography</h3><p>Photography portfolio, visual identity and a responsive digital experience built around the work.</p><a href="https://tainaborgesphoto.com/" target="_blank" rel="noopener noreferrer">Explore the project ${icon('arrow-up-right')}</a></article></div>`);
    main.append(hero,stats,timeline,green,services,tools,collaborations);
    if(originalProjects){originalProjects.classList.add('composition-preserved-projects');main.append(originalProjects);}
    if(originalEducation){originalEducation.classList.add('composition-preserved-education');main.append(originalEducation);}
    if(originalLibrary)main.append(originalLibrary);
    const nav=document.querySelector('.nav-links ul');if(nav)nav.innerHTML='<li><a href="">Home</a></li><li><a href="work/">Work</a></li><li><a href="experience/" aria-current="page">Experience</a></li><li><a href="contact/">Contact</a></li>';
    const footer=document.querySelector('.site-footer');if(footer)footer.querySelectorAll('span[aria-hidden="true"]').forEach(span=>{if(span.textContent.trim()==='→'){span.textContent='';span.innerHTML=icon('arrow-up-right');}});
  }
  if(home)composeHome();else composeExperience();
}());
