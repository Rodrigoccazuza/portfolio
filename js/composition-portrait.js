/* Actual portrait model + control names from 3DModel_portfolio/hero-v2.
   Source asset: https://github.com/Rodrigoccazuza/3DModel_portfolio/tree/hero-v2/public
   The GLB remains referenced from its source repository rather than duplicated. */
import * as THREE from 'https://esm.sh/three@0.179.1';
import { GLTFLoader } from 'https://esm.sh/three@0.179.1/examples/jsm/loaders/GLTFLoader.js';

const stage = document.querySelector('.composition-home .portrait-stage');
const canvas = document.querySelector('#composition-portrait');
const hero = document.querySelector('.composition-home .portfolio-hero');
if (stage && canvas && hero) {
  const loading = stage.querySelector('.model-loading');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, .1, 100);
  camera.position.set(0,.51,2.4);camera.lookAt(0,.49,0);
  let renderer;
  try { renderer = new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'}); }
  catch (error) { loading.textContent = 'Interactive 3D is unavailable in this browser'; console.error(error); }
  if (renderer) {
    renderer.setClearColor(0x000000,0);
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.35;
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
    scene.add(new THREE.HemisphereLight(0xf8f0db,0x4f5e50,2.2));
    const key=new THREE.DirectionalLight(0xfff5e8,3.1);key.position.set(-2,3,4);scene.add(key);
    const rim=new THREE.DirectionalLight(0xffba8a,2.6);rim.position.set(2,1,-2);scene.add(rim);
    let model,head,eyeL,eyeR,face,smileIndex;
    let mouseX=0,mouseY=0,scroll=0,hover=false,visible=true,last=performance.now();
    const clamp=THREE.MathUtils.clamp,damp=THREE.MathUtils.damp;
    function resize(){const w=Math.max(1,stage.clientWidth),h=Math.max(1,stage.clientHeight);camera.aspect=w/h;camera.position.z=w<400?2.4:2.3;camera.updateProjectionMatrix();renderer.setSize(w,h,false);}
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(stage);else addEventListener('resize',resize);
    resize();
    const source='https://raw.githubusercontent.com/Rodrigoccazuza/3DModel_portfolio/hero-v2/public/portrait-interactive.glb';
    new GLTFLoader().load(source,gltf=>{
      model=gltf.scene;head=model.getObjectByName('CTRL_Head');eyeL=model.getObjectByName('CTRL_Eye_L');eyeR=model.getObjectByName('CTRL_Eye_R');face=model.getObjectByName('HeroHead_webMesh');
      if(!head||!eyeL||!eyeR){loading.textContent='Portrait controls are unavailable';model=null;return;}
      smileIndex=face?.morphTargetDictionary?.smile;
      scene.add(model);stage.dataset.modelState='interactive';
      renderer.render(scene,camera);stage.classList.add('model-ready');
    },undefined,error=>{loading.textContent='3D portrait could not load';stage.dataset.modelState='load-error';console.error('Portrait GLB loading:',error);});
    function pointer(x,y){const r=hero.getBoundingClientRect();mouseX=clamp(((x-r.left)/r.width-.5)*2.4,-1,1);mouseY=clamp(((y-r.top)/r.height-.5)*2.2,-1,1);}
    addEventListener('pointermove',e=>{if(e.pointerType!=='touch')pointer(e.clientX,e.clientY);},{passive:true});
    stage.addEventListener('pointerenter',e=>{hover=true;pointer(e.clientX,e.clientY);});stage.addEventListener('pointerleave',()=>{hover=false;});
    hero.addEventListener('touchstart',e=>{if(e.touches[0]){hover=true;pointer(e.touches[0].clientX,e.touches[0].clientY);}},{passive:true});
    hero.addEventListener('touchmove',e=>{if(e.touches[0])pointer(e.touches[0].clientX,e.touches[0].clientY);},{passive:true});
    hero.addEventListener('touchend',()=>{hover=false;mouseX=0;mouseY=0;},{passive:true});
    addEventListener('pointerleave',()=>{mouseX=0;mouseY=0;});
    addEventListener('scroll',()=>{const r=hero.getBoundingClientRect();scroll=clamp(-r.top/Math.max(r.height*.7,1),0,1);},{passive:true});
    if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;},{rootMargin:'100px'}).observe(stage);
    canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();stage.classList.remove('model-ready');stage.dataset.modelState='context-lost';loading.textContent='3D stopped: reload to restore';});
    function tick(now){requestAnimationFrame(tick);const dt=Math.min((now-last)/1000,.05);last=now;if(!visible||document.hidden||stage.dataset.modelState==='context-lost')return;
      if(model&&head&&eyeL&&eyeR){const motion=reduced.matches?.45:1;
        model.scale.setScalar(damp(model.scale.x,hover?(reduced.matches?1.025:1.085):1,6,dt));
        for(const eye of [eyeL,eyeR]){eye.rotation.x=damp(eye.rotation.x,clamp(mouseY*motion*.29,-.44,.44),9,dt);eye.rotation.y=damp(eye.rotation.y,clamp(mouseX*motion*.48,-.52,.52),9,dt);}
        head.rotation.x=damp(head.rotation.x,(mouseY*.22+scroll*.12)*motion,4,dt);
        head.rotation.y=damp(head.rotation.y,(mouseX*.42+scroll*.20)*motion,4,dt);
        head.rotation.z=damp(head.rotation.z,-mouseX*.055*motion,3,dt);
        if(face&&smileIndex!==undefined)face.morphTargetInfluences[smileIndex]=damp(face.morphTargetInfluences[smileIndex],scroll*.8*motion,2.5,dt);
      }
      renderer.render(scene,camera);
    }
    requestAnimationFrame(tick);
  }
}
