/* Timing verified against the supplied ten-second dark-mode process film.
   0–1 concept/intro; 1–2 sketch; 2–4 moodboard; 4–6 style guide;
   6–8 low fidelity wireframes; 8–10 high fidelity → prototype/build. */
(function(){
  const process=document.querySelector('.composition-home .concept-timeline');
  if(!process)return;
  const steps=[...process.querySelectorAll('.concept-step')];
  if(steps.length!==6)return;
  const headings=['Concept','Sketch','Moodboard','Style Guide','Wireframes','Prototype & Build'];
  const descriptions=[
    'Set the creative direction and establish the objective.',
    'Translate the idea into a rough, annotated dark-mode sketch.',
    'Collect editorial references, imagery and visual inspiration.',
    'Define typography, color, components and interaction rules.',
    'Develop the low-fidelity layout and responsive page structure.',
    'Refine high-fidelity screens and deliver the interactive build.'
  ];
  steps.forEach((step,i)=>{const h=step.querySelector('h3'),p=step.querySelector('p');if(h)h.textContent=headings[i];if(p)p.textContent=descriptions[i];});
  const boundaries=[0,1,2,4,6,8,10];
  const status=process.querySelector('#comp-process-label');
  const video=process.querySelector('.comp-process-video');
  const windowEl=process.querySelector('.comp-process-window');
  let frame=0;
  function update(){
    frame=0;
    const rect=process.getBoundingClientRect();
    const top=innerHeight*.68,bottom=innerHeight*.30;
    const progress=Math.max(0,Math.min(1,(top-rect.top)/Math.max(1,rect.height-top+bottom)));
    const timestamp=progress*(video&&Number.isFinite(video.duration)?video.duration:10);
    let selected=5;
    for(let i=0;i<6;i++){if(timestamp<boundaries[i+1]){selected=i;break;}}
    steps.forEach((step,i)=>{step.classList.toggle('is-current',i===selected);if(i===selected)step.setAttribute('aria-current','step');else step.removeAttribute('aria-current');});
    if(windowEl)windowEl.dataset.step=String(selected);
    if(status)status.textContent=String(selected+1).padStart(2,'0')+' / '+headings[selected].toUpperCase();
  }
  function queue(){if(!frame)frame=requestAnimationFrame(update);}
  addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue);
  if(video)video.addEventListener('loadedmetadata',queue);
  queue();
}());
