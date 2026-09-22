import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
let failed=false;
for(const width of [1440,768,390]){
  const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
  try{
    await page.goto('http://127.0.0.1:8000/',{waitUntil:'domcontentloaded'});
    const stage=page.locator('.concept-timeline.workflow-stage');
    await stage.waitFor({timeout:25000});
    await page.waitForFunction(()=>[...document.styleSheets].some(s=>s.href?.includes('composition-workflow-stage.css')),{timeout:12000});
    await page.addStyleTag({content:'html,body{scroll-behavior:auto!important}'});
    assert.equal(await stage.locator('.workflow-stage-step').count(),6);
    assert.equal(await stage.locator('.workflow-stage-card').count(),6);
    const initial=await stage.evaluate(s=>{
      const sticky=s.querySelector('.workflow-stage-sticky'),video=s.querySelector('video');
      const film=video.getBoundingClientRect(),view=sticky.getBoundingClientRect();
      const card=s.querySelector('.workflow-stage-card');
      const light=getComputedStyle(s.querySelector('.workflow-stage-light')).backgroundImage;
      const shade=getComputedStyle(s.querySelector('.workflow-stage-shade')).backgroundImage;
      const rgba=[...light.matchAll(/rgba?\([^)]*\)/g),...shade.matchAll(/rgba?\([^)]*\)/g)].map(m=>m[0]).filter(c=>c.startsWith('rgba'));
      const opacities=rgba.map(c=>Number(c.split(',').at(-1).replace(')','').trim()));
      return {height:s.offsetHeight,viewport:innerHeight,sticky:getComputedStyle(sticky).position,videoFit:getComputedStyle(video).objectFit,film:{w:film.width,h:film.height},view:{w:view.width,h:view.height},light,shade,maxOpacity:Math.max(...opacities),cardBackground:getComputedStyle(card).backgroundColor,cardText:getComputedStyle(card.querySelector('h3')).color,rail:getComputedStyle(s.querySelector('.workflow-stage-rail')).position,activeHidden:getComputedStyle(s.querySelector('.workflow-stage-active')).clip};
    });
    assert.equal(initial.sticky,'sticky');assert.equal(initial.videoFit,'cover');
    assert(initial.height>=initial.viewport*5,'Six stages require generous scroll length');
    assert(initial.film.w>=initial.view.w*.99&&initial.film.h>=initial.view.h*.99,'Film must fill sticky viewport edge to edge');
    assert(initial.light.includes('gradient')&&initial.shade.includes('gradient'),'Subtle gradients retained');
    assert(initial.maxOpacity<=.021,`Film gradient exceeds 2%: ${initial.maxOpacity}`);
    assert.equal(initial.rail,'absolute');
    assert(initial.cardBackground.includes('0.94')||initial.cardBackground.includes('0.96'),'Localized card must be opaque enough for readable text');
    assert.equal(initial.cardText,'rgb(255, 255, 255)','Card titles need high-contrast white');
    await stage.evaluate(s=>scrollTo({top:s.getBoundingClientRect().top+scrollY,behavior:'instant'}));
    await page.waitForTimeout(200);
    for(const index of [0,2,4,5]){
      await stage.evaluate((s,i)=>scrollTo({top:s.getBoundingClientRect().top+scrollY+(s.offsetHeight-innerHeight)*((i+.25)/6),behavior:'instant'}),index);
      await page.waitForTimeout(220);
      const current=await stage.locator('.workflow-stage-step.is-current').count();
      assert.equal(current,1,`Stage ${index}: expected one active step`);
      assert.equal(await stage.locator('.workflow-stage-step.is-current').getAttribute('data-workflow-index'),String(index));
      const position=await stage.locator('.workflow-stage-sticky').evaluate(el=>{const r=el.getBoundingClientRect();return {top:r.top,height:r.height};});
      assert(Math.abs(position.top)<3,`Film remains pinned: ${JSON.stringify(position)}`);
      const visible=await stage.locator('.workflow-stage-step.is-current .workflow-stage-card').evaluate(el=>{
        const r=el.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width};
      });
      assert(visible.left>=-2&&visible.right<=width+2,`Active card fits ${width}px width: ${JSON.stringify(visible)}`);
      assert(visible.top>=-2&&visible.bottom<=902,`Active card stays visible: ${JSON.stringify(visible)}`);
      assert(visible.width>=width*.25,'Card should remain readable');
    }
    assert((await page.evaluate(()=>document.documentElement.scrollWidth))<=width+3,'Horizontal overflow');
    console.log(`PASS full-bleed film, 2% overlay, readable passing cards and six-stage scroll at ${width}px`);
  }catch(error){failed=true;console.error(`FAIL workflow ${width}px: ${error.stack}`);}finally{await page.close();}
}
// Reduced-motion visitors see all six readable cards in document flow without scroll transforms.
const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
try{
  await page.goto('http://127.0.0.1:8000/',{waitUntil:'domcontentloaded'});
  const stage=page.locator('.concept-timeline.workflow-stage');await stage.waitFor({timeout:25000});
  await page.waitForFunction(()=>[...document.styleSheets].some(s=>s.href?.includes('composition-workflow-stage.css')),{timeout:12000});
  const state=await stage.evaluate(s=>({position:getComputedStyle(s.querySelector('.workflow-stage-sticky')).position,cards:[...s.querySelectorAll('.workflow-stage-step')].map(c=>({position:getComputedStyle(c).position,opacity:getComputedStyle(c).opacity,transform:getComputedStyle(c).transform}))}));
  assert.equal(state.position,'relative');assert.equal(state.cards.length,6);
  assert(state.cards.every(c=>c.position==='relative'&&c.opacity==='1'&&c.transform==='none'));
  console.log('PASS reduced-motion six-card accessible reading layout');
}catch(error){failed=true;console.error(`FAIL reduced-motion workflow: ${error.stack}`);}finally{await page.close();}
await browser.close();if(failed)process.exitCode=1;
