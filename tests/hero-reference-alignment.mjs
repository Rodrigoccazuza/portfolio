import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const browser = await chromium.launch({headless:true,args:['--no-sandbox']});
const output = [];
let errors = 0;
await mkdir('qa-artifacts',{recursive:true});
for (const [width,height] of [[1100,782],[1440,1024],[390,844]]) {
  const page = await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  try {
    await page.goto('http://127.0.0.1:8000/',{waitUntil:'domcontentloaded'});
    await page.waitForFunction(() => !!document.querySelector('link[href*="composition-hero-alignment.css"]') && document.querySelector('.hero-kicker')?.textContent === "Hey, I'm a",null,{timeout:22000});
    await page.evaluate(()=>document.fonts.ready);
    await page.waitForTimeout(650);
    const rects = await page.evaluate(() => {
      const get = selector => {const el=document.querySelector(selector);if(!el)return null;const r=el.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom};};
      return {hero:get('.portfolio-hero'),header:get('.site-header'),intro:get('.hero-intro'),word:get('#hero-title .accent-italic'),portrait:get('.portrait-stage'),copy:get('.hero-statement'),actions:get('.hero-actions'),kicker:document.querySelector('.hero-kicker')?.textContent,statement:document.querySelector('.hero-statement-title')?.textContent,nav:[...document.querySelectorAll('#primary-nav ul a')].map(el=>el.textContent.trim()),font:getComputedStyle(document.querySelector('#hero-title .accent-italic')).fontFamily,scrollWidth:document.documentElement.scrollWidth};
    });
    assert.equal(rects.kicker,"Hey, I'm a");
    assert.equal(rects.statement,'Design, marketing, and front-end development in one creative practice.');
    assert.deepEqual(rects.nav,['Home','Work','Experience']);
    assert(rects.font.toLowerCase().includes('array'),'Array font should remain in use');
    assert(rects.scrollWidth <= width+4,`Overflow: ${rects.scrollWidth}/${width}`);
    if (width>860) {
      const target=71.11/100*width;
      assert(Math.abs(rects.hero.height-target)<18,`Hero target height ${target}, got ${rects.hero.height}`);
      assert(Math.abs(rects.intro.x+rects.intro.width/2-width/2)<3,'Intro not centered');
      assert(Math.abs(rects.portrait.x+rects.portrait.width/2-width/2)<4,'Portrait not centered');
      assert(rects.word.x>=-16 && rects.word.right<=width+16,`Designer word clipped: ${JSON.stringify(rects.word)}`);
      assert(rects.copy.y > rects.hero.height*.54 && rects.copy.bottom<rects.hero.height*.96,`Copy placement incorrect: ${JSON.stringify(rects.copy)}`);
      assert(rects.portrait.y < rects.hero.height*.36,'Portrait too low');
    } else {
      assert(rects.word.x>=-10 && rects.word.right<=width+10,`Mobile Designer word clipped: ${JSON.stringify(rects.word)}`);
    }
    output.push({viewport:`${width}x${height}`,status:'pass',rects});
    await page.screenshot({path:`qa-artifacts/hero-reference-${width}.png`});
    console.log(`PASS screenshot-matched hero geometry ${width}x${height}`,JSON.stringify(rects));
  } catch(error) {
    errors++;
    output.push({viewport:`${width}x${height}`,status:'fail',error:error.message});
    console.error(`FAIL hero geometry ${width}x${height}:`,error.stack);
    await page.screenshot({path:`qa-artifacts/hero-reference-${width}-failure.png`}).catch(()=>{});
  } finally {await page.close();}
}
await browser.close();
await writeFile('qa-artifacts/hero-alignment-report.json',JSON.stringify(output,null,2));
if(errors)process.exitCode=1;
