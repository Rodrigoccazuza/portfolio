import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
let failed=false;
const linear=x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4;};
const luminance=rgb=>rgb.map(linear).reduce((sum,x,i)=>sum+x*[.2126,.7152,.0722][i],0);
function contrast(color,bg){
  const fg=color.match(/[\d.]+/g).map(Number).slice(0,3);
  const [r,g,b,a]=bg.match(/[\d.]+/g).map(Number);
  // Worst case: the translucent dark card is over a white video frame.
  const worst=[r,g,b].map(x=>x*a+255*(1-a));
  const l1=luminance(fg),l2=luminance(worst);
  return (Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);
}
for(const width of [1440,768,390]){
  const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
  try{
    await page.goto('http://127.0.0.1:8000/',{waitUntil:'domcontentloaded'});
    const stage=page.locator('.concept-timeline.workflow-stage');await stage.waitFor({timeout:25000});
    await page.waitForFunction(()=>[...document.styleSheets].some(s=>s.href?.includes('workflow-card-cascade-fix.css')),{timeout:15000});
    await page.addStyleTag({content:'html,body{scroll-behavior:auto!important}'});
    assert.equal(await stage.locator('.workflow-stage-step').count(),6);
    assert.equal(await stage.locator('.workflow-stage-card').count(),6);
    const initial=await stage.evaluate(s=>{
      const sticky=s.querySelector('.workflow-stage-sticky'),video=s.querySelector('video'),film=video.getBoundingClientRect(),view=sticky.getBoundingClientRect();
      const card=s.querySelector('.workflow-stage-card'),light=getComputedStyle(s.querySelector('.workflow-stage-light')).backgroundImage,shade=getComputedStyle(s.querySelector('.workflow-stage-shade')).backgroundImage;
      const rgba=[...light.matchAll(/rgba?\([^)]*\)/g),...shade.matchAll(/rgba?\([^)]*\)/g)].map(m=>m[0]).filter(c=>c.startsWith('rgba'));
      return {height:s.offsetHeight,viewport:innerHeight,sticky:getComputedStyle(sticky).position,videoFit:getComputedStyle(video).objectFit,film:{w:film.width,h:film.height},view:{w:view.width,h:view.height},light,shade,maxOpacity:Math.max(...rgba.map(c=>Number(c.split(',').at(-1).replace(')','').trim()))),cardBackground:getComputedStyle(card).backgroundColor,cardText:getComputedStyle(card.querySelector('h3')).color,bodyText:getComputedStyle(card.querySelector('p')).color,rail:getComputedStyle(s.querySelector('.workflow-stage-rail')).position};
    });
    assert.equal(initial.sticky,'sticky');assert.equal(initial.videoFit,'cover');
    assert(initial.height>=initial.viewport*5,'Six stages need generous scroll length');
    assert(initial.film.w>=initial.view.w*.99&&initial.film.h>=initial.view.h*.99,'Film must fill the viewport');
    assert(initial.light.includes('gradient')&&initial.shade.includes('gradient'),'Subtle gradients retained');
    assert(initial.maxOpacity<=.021,`Film overlay exceeds 2%: ${initial.maxOpacity}`);
    assert.equal(initial.rail,'absolute','Cards must overlay the film instead of entering page flow');
    assert(contrast(initial.cardText,initial.cardBackground)>=7,'Card heading must pass WCAG AAA contrast');
    assert(contrast(initial.bodyText,initial.cardBackground)>=7,'Card description must pass WCAG AAA contrast');
    await stage.evaluate(s=>scrollTo({top:s.getBoundingClientRect().top+scrollY,behavior:'instant'}));
    await page.waitForTimeout(150);
    for(const index of [0,2,4,5]){
      await stage.evaluate((s,i)=>scrollTo({top:s.getBoundingClientRect().top+scrollY+(s.offsetHeight-innerHeight)*((i+.25)/6),behavior:'instant'}),index);
      await page.waitForTimeout(200);
      assert.equal(await stage.locator('.workflow-stage-step.is-current').count(),1);
      assert.equal(await stage.locator('.workflow-stage-step.is-current').getAttribute('data-workflow-index'),String(index));
      const view=await stage.locator('.workflow-stage-sticky').evaluate(el=>el.getBoundingClientRect().top);
      assert(Math.abs(view)<3,'Film remains pinned during scroll');
      const card=await stage.locator('.workflow-stage-step.is-current .workflow-stage-card').evaluate(el=>{const r=el.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width};});
      assert(card.left>=-2&&card.right<=width+2,`Card fits ${width}px width: ${JSON.stringify(card)}`);
      assert(card.top>=-2&&card.bottom<=902,`Card fits viewport: ${JSON.stringify(card)}`);
      assert(card.width>=width*.25,'Card stays readable');
    }
    assert((await page.evaluate(()=>document.documentElement.scrollWidth))<=width+3,'No horizontal overflow');
    console.log(`PASS full-bleed video, 2% gradient, AAA text contrast and scrolling cards at ${width}px`);
  }catch(error){failed=true;console.error(`FAIL workflow ${width}px: ${error.stack}`);}finally{await page.close();}
}
const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
try{
  await page.goto('http://127.0.0.1:8000/',{waitUntil:'domcontentloaded'});
  const stage=page.locator('.concept-timeline.workflow-stage');await stage.waitFor({timeout:25000});
  await page.waitForFunction(()=>[...document.styleSheets].some(s=>s.href?.includes('workflow-card-cascade-fix.css')),{timeout:15000});
  const state=await stage.evaluate(s=>({position:getComputedStyle(s.querySelector('.workflow-stage-sticky')).position,cards:[...s.querySelectorAll('.workflow-stage-step')].map(c=>({position:getComputedStyle(c).position,opacity:getComputedStyle(c).opacity,transform:getComputedStyle(c).transform}))}));
  assert.equal(state.position,'relative');assert.equal(state.cards.length,6);
  assert(state.cards.every(c=>c.position==='relative'&&c.opacity==='1'&&c.transform==='none'),`Reduced-motion cards must stay in flow: ${JSON.stringify(state)}`);
  console.log('PASS accessible reduced-motion six-card reading layout');
}catch(error){failed=true;console.error(`FAIL reduced-motion workflow: ${error.stack}`);}finally{await page.close();}
await browser.close();if(failed)process.exitCode=1;
