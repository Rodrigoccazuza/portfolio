/* The original rig, controller names and lighting are taken from 3DModel_portfolio/hero-v2. */
import * as THREE from 'https://esm.sh/three@0.179.1';
import { GLTFLoader } from 'https://esm.sh/three@0.179.1/examples/jsm/loaders/GLTFLoader.js';
const stage=document.querySelector('.composition-home .portrait-stage');
const canvas=stage?.querySelector('canvas');
const hero=document.querySelector('.composition-home .portfolio-hero');
if(stage&&canvas&&hero){
  const loading=stage.querySelector('.model-loading');const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let renderer;
  try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});}catch(error){loading.textContent='3D is unavailable in this browser';console.error(error);}
  if(renderer){
    const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.1,100);
    camera.position.set(0,.51,2.4);camera.lookAt(0,.49,0);
    renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;renderer.setClearColor(0,0);renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
    scene.add(new THREE.HemisphereLight(0xf8f0db,0x4f5e50,2.2));
    const key=new THREE.DirectionalLight(0xfff5e8,3.1);key.position.set(-2,3,4);scene.add(key);
    const rim=new THREE.DirectionalLight(0xffba8a,2.6);rim.position.set(2,1,-2);scene.add(rim);
    let model,head,eyeL,eyeR,face,smileIndex,visible=true,hover=false,mx=0,my=0,scroll=0,last=performance.now(),verified=false;
    const clamp=THREE.MathUtils.clamp,damp=THREE.MathUtils.damp;
    function resize(){const width=Math.max(stage.clientWidth,1),height=Math.max(stage.clientHeight,1);camera.aspect=width/height;camera.position.z=width<550?2.15:2.4;camera.updateProjectionMatrix();renderer.setSize(width,height,false);}
    if('ResizeObserver' in window)new ResizeObserver(resize).observe(stage);else addEventListener('resize',resize);resize();
    new GLTFLoader().load('https://raw.githubusercontent.com/Rodrigoccazuza/3DModel_portfolio/hero-v2/public/portrait-interactive.glb',gltf=>{
      model=gltf.scene;head=model.getObjectByName('CTRL_Head');eyeL=model.getObjectByName('CTRL_Eye_L');eyeR=model.getObjectByName('CTRL_Eye_R');face=model.getObjectByName('HeroHead_webMesh');
      if(!head||!eyeL||!eyeR){loading.textContent='The portrait rig could not be initialized';model=null;return;}
      smileIndex=face?.morphTargetDictionary?.smile;scene.add(model);stage.dataset.modelState='rendering';
      // Check for geometry and a real render before hiding the photographic fallback.
      const bounds=new THREE.Box3().setFromObject(model);
      if(bounds.isEmpty()||!Number.isFinite(bounds.min.x)){loading.textContent='The portrait geometry is unavailable';stage.dataset.modelState='invalid-geometry';return;}
      renderer.render(scene,camera);verified=true;stage.classList.add('model-ready');stage.dataset.modelState='interactive';
    },undefined,error=>{stage.dataset.modelState='load-error';loading.textContent='The 3D portrait could not load';console.error(error);});
    function pointer(x,y){const r=hero.getBoundingClientRect();mx=clamp(((x-r.left)/r.width-.5)*2.4,-1,1);my=clamp(((y-r.top)/r.height-.5)*2.2,-1,1);}
    addEventListener('pointermove',event=>{if(event.pointerType!=='touch')pointer(event.clientX,event.clientY);},{passive:true});
    stage.addEventListener('pointerenter',event=>{hover=true;pointer(event.clientX,event.clientY);});stage.addEventListener('pointerleave',()=>{hover=false;});
    hero.addEventListener('touchstart',event=>{if(event.touches[0]){hover=true;pointer(event.touches[0].clientX,event.touches[0].clientY);}},{passive:true});
    hero.addEventListener('touchmove',event=>{if(event.touches[0])pointer(event.touches[0].clientX,event.touches[0].clientY);},{passive:true});
    hero.addEventListener('touchend',()=>{mx=0;my=0;hover=false;},{passive:true});
    addEventListener('scroll',()=>{const r=hero.getBoundingClientRect();scroll=clamp(-r.top/Math.max(r.height*.7,1),0,1);},{passive:true});
    if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;},{rootMargin:'150px'}).observe(stage);
    canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();verified=false;stage.classList.remove('model-ready');stage.dataset.modelState='context-lost';loading.textContent='3D rendering stopped — reload to restore';});
    function tick(now){requestAnimationFrame(tick);const dt=Math.min((now-last)/1000,.05);last=now;if(!visible||document.hidden||stage.dataset.modelState==='context-lost')return;
      if(model&&head&&eyeL&&eyeR){const motion=reduced.matches?.5:1;
        model.scale.setScalar(damp(model.scale.x,hover?(reduced.matches?1.025:1.085):1,6,dt));
        for(const eye of [eyeL,eyeR]){eye.rotation.x=damp(eye.rotation.x,clamp(my*motion*.29,-.44,.44),9,dt);eye.rotation.y=damp(eye.rotation.y,clamp(mx*motion*.48,-.52,.52),9,dt);}
        head.rotation.x=damp(head.rotation.x,(my*.22+scroll*.12)*motion,4,dt);head.rotation.y=damp(head.rotation.y,(mx*.42+scroll*.20)*motion,4,dt);head.rotation.z=damp(head.rotation.z,-mx*.055*motion,3,dt);
        if(face&&smileIndex!==undefined)face.morphTargetInfluences[smileIndex]=damp(face.morphTargetInfluences[smileIndex],scroll*.8*motion,2.5,dt);
      }
      if(verified)renderer.render(scene,camera);
    }
    requestAnimationFrame(tick);
  }
}
