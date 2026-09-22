import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
let failed=false;
for(const width of [1440,390]){
  const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
  try{
    await page.goto('http://127.0.0.1:8000/',{waitUntil:'domcontentloaded'});
    const stage=page.locator('.concept-timeline.workflow-stage');
    await stage.waitFor({timeout:25000});
    await page.waitForFunction(()=>[...document.styleSheets].some(s=>s.href?.includes('composition-workflow-stage.css')),{timeout:12000});
    assert.equal(await stage.locator('.workflow-stage-step').count(),6);
    const initial=await stage.evaluate(s=>({height:s.offsetHeight,viewport:innerHeight,sticky:getComputedStyle(s.querySelector('.workflow-stage-sticky')).position,videoFit:getComputedStyle(s.querySelector('video')).objectFit,videoRect:s.querySelector('video').getBoundingClientRect().width,stageRect:s.getBoundingClientRect().width,overlay:getComputedStyle(s.querySelector('.workflow-stage-light')).backgroundImage}));
    assert.equal(initial.sticky,'sticky');assert.equal(initial.videoFit,'cover');assert(initial.height>=initial.viewport*5);assert(initial.videoRect>=initial.stageRect*.95);assert(initial.overlay.includes('gradient'));
    await stage.evaluate(s=>scrollTo(0,s.getBoundingClientRect().top+scrollY));
    await page.waitForTimeout(350);
    for(const index of [0,2,4,5]){
      await stage.evaluate((s,i)=>scrollTo(0,s.getBoundingClientRect().top+scrollY+(s.offsetHeight-innerHeight)*((i+.25)/6)),index);
      await page.waitForTimeout(140);
      const current=await stage.locator('.workflow-stage-step.is-current').count();
      assert.equal(current,1,`Stage ${index}: expected one active step`);
      assert.equal(await stage.locator('.workflow-stage-step.is-current').getAttribute('data-workflow-index'),String(index));
      const position=await stage.locator('.workflow-stage-sticky').evaluate(el=>{const r=el.getBoundingClientRect();return {top:r.top,height:r.height};});
      assert(Math.abs(position.top)<3,`Sticky stage should remain at top while its contents center: ${JSON.stringify(position)}`);
    }
    assert((await page.evaluate(()=>document.documentElement.scrollWidth))<=width+3,'Horizontal overflow');
    console.log(`PASS workflow video background, sticky center, six steps and scroll transitions at ${width}px`);
  }catch(error){failed=true;console.error(`FAIL workflow ${width}px: ${error.stack}`);}finally{await page.close();}
}
await browser.close();if(failed)process.exitCode=1;
