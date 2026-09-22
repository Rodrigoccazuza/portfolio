import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
let failed=false;
for(const width of [1440,768,390]){
  const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
  try{
    await page.goto('http://127.0.0.1:8000/',{waitUntil:'domcontentloaded'});
    const section=page.locator('.concept-timeline.workflow-stage.workflow-video-only');
    await section.waitFor({timeout:25000});
    await page.waitForFunction(()=>[...document.styleSheets].some(s=>s.href?.includes('composition-workflow-stage.css')),{timeout:15000});
    await page.addStyleTag({content:'html,body{scroll-behavior:auto!important}'});
    assert.equal(await section.locator('video').count(),1);
    assert.equal(await section.locator('h1,h2,h3,p,ol,li,.workflow-stage-card,.workflow-stage-footer,.workflow-stage-light,.workflow-stage-shade').count(),0,'All overlay text, steps and gradients removed');
    const metrics=await section.evaluate(s=>{
      const sticky=s.querySelector('.workflow-stage-sticky'),video=s.querySelector('video');
      const film=video.getBoundingClientRect(),viewport=sticky.getBoundingClientRect();
      return {sectionHeight:s.offsetHeight,sticky:getComputedStyle(sticky).position,fit:getComputedStyle(video).objectFit,filter:getComputedStyle(video).filter,film:{w:film.width,h:film.height},view:{w:viewport.width,h:viewport.height},children:sticky.children.length};
    });
    assert.equal(metrics.sticky,'sticky');assert.equal(metrics.fit,'contain','Full video frame must be visible without cropping');
    assert.equal(metrics.filter,'none');assert.equal(metrics.children,1,'Only the video occupies the viewport');
    assert(metrics.sectionHeight>metrics.view.h*2,'Scrolling must provide a timeline');
    assert(metrics.film.w>=metrics.view.w*.99&&metrics.film.h>=metrics.view.h*.99,'Video fits the entire viewing stage');
    await section.scrollIntoViewIfNeeded();
    await page.waitForFunction(()=>{const v=document.querySelector('.workflow-video-only video');return v?.readyState>=1&&v.duration>0;},null,{timeout:25000});
    const samples=[];
    for(const progress of [.12,.5,.86]){
      await section.evaluate((s,p)=>{const top=s.getBoundingClientRect().top+scrollY;const h=s.offsetHeight-s.querySelector('.workflow-stage-sticky').getBoundingClientRect().height;scrollTo({top:top+h*p,behavior:'instant'});},progress);
      await page.waitForFunction(p=>{const s=document.querySelector('.workflow-video-only');return Math.abs(Number(s?.dataset.scrollProgress)-p)<.08;},progress,{timeout:5000});
      samples.push(await section.evaluate(s=>({progress:Number(s.dataset.scrollProgress),target:Number(s.querySelector('video').dataset.scrubTarget),duration:s.querySelector('video').duration})));
      const stickyTop=await section.locator('.workflow-stage-sticky').evaluate(el=>el.getBoundingClientRect().top);
      assert(Math.abs(stickyTop)<3,'Video stays pinned while scrubbing');
    }
    assert(samples[0].progress<samples[1].progress&&samples[1].progress<samples[2].progress,`Forward scroll must increase scrub progress: ${JSON.stringify(samples)}`);
    assert(samples[0].target<samples[1].target&&samples[1].target<samples[2].target,`Forward scroll must increase target time: ${JSON.stringify(samples)}`);
    assert(samples[2].target-samples[0].target>3.5,`Scrub target should cover a meaningful portion of film: ${JSON.stringify(samples)}`);
    await section.evaluate(s=>{const top=s.getBoundingClientRect().top+scrollY;const h=s.offsetHeight-s.querySelector('.workflow-stage-sticky').getBoundingClientRect().height;scrollTo({top:top+h*.28,behavior:'instant'});});
    await page.waitForFunction(()=>Number(document.querySelector('.workflow-video-only')?.dataset.scrollProgress)<.38,null,{timeout:5000});
    const reverse=await section.evaluate(s=>({progress:Number(s.dataset.scrollProgress),target:Number(s.querySelector('video').dataset.scrubTarget)}));
    assert(reverse.target<samples[2].target-2,`Reverse scroll must move target time backward: ${JSON.stringify(reverse)} vs ${JSON.stringify(samples[2])}`);
    assert((await page.evaluate(()=>document.documentElement.scrollWidth))<=width+3,'No horizontal overflow');
    console.log(`PASS video-only full-frame bidirectional scrub mapping and responsive fit at ${width}px`,samples,reverse);
  }catch(error){failed=true;console.error(`FAIL workflow ${width}px: ${error.stack}`);}finally{await page.close();}
}
const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
try{
  await page.goto('http://127.0.0.1:8000/',{waitUntil:'domcontentloaded'});
  const section=page.locator('.workflow-video-only');await section.waitFor({timeout:25000});
  await page.waitForFunction(()=>[...document.styleSheets].some(s=>s.href?.includes('composition-workflow-stage.css')),{timeout:15000});
  const metrics=await section.evaluate(s=>({sticky:getComputedStyle(s.querySelector('.workflow-stage-sticky')).position,controls:s.querySelector('video').controls,fit:getComputedStyle(s.querySelector('video')).objectFit,sectionHeight:s.offsetHeight}));
  assert.equal(metrics.sticky,'relative');assert.equal(metrics.controls,true,'Reduced-motion users get native playback controls');assert.equal(metrics.fit,'contain');
  console.log('PASS reduced-motion video controls and full-frame fit');
}catch(error){failed=true;console.error(`FAIL reduced-motion workflow: ${error.stack}`);}finally{await page.close();}
await browser.close();if(failed)process.exitCode=1;
