import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const output=[];let errors=0;
await mkdir('qa-artifacts',{recursive:true});
for(const [width,height] of [[1100,782],[1440,1024],[390,844]]){
 const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
 try{
  await page.goto('http://127.0.0.1:8000/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.documentElement.classList.contains('composition-ready')&&document.querySelector('.hero-kicker')?.textContent==="Hey, I'm a",null,{timeout:22000});
  await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(500);
  const rects=await page.evaluate(()=>{const get=selector=>{const el=document.querySelector(selector);if(!el)return null;const r=el.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom};};return{hero:get('.portfolio-hero'),header:get('.site-header'),intro:get('.hero-intro'),word:get('#hero-title .accent-italic'),portrait:get('.portrait-stage'),copy:get('.hero-statement'),actions:get('.hero-actions'),kicker:document.querySelector('.hero-kicker')?.textContent,statement:document.querySelector('.hero-statement-title')?.textContent,nav:[...document.querySelectorAll('#primary-nav ul a')].map(el=>el.textContent.trim()),font:getComputedStyle(document.querySelector('#hero-title .accent-italic')).fontFamily,fontSize:parseFloat(getComputedStyle(document.querySelector('#hero-title .accent-italic')).fontSize),scrollWidth:document.documentElement.scrollWidth};});
  assert.equal(rects.kicker,"Hey, I'm a");
  assert.equal(rects.statement,'Design, marketing, and front-end development in one creative practice.');
  assert.deepEqual(rects.nav,['Home','Work','Experience']);
  assert(rects.font.toLowerCase().includes('array'),'Array font should remain in use');
  assert(rects.scrollWidth<=width+4,`Overflow: ${rects.scrollWidth}/${width}`);
  if(width>860){
   assert(rects.hero.height>=Math.max(900,height*1.08)-5,`Hero needs more vertical room: ${rects.hero.height}`);
   assert(rects.fontSize<=270,`Designer remains oversized: ${rects.fontSize}`);
   assert(Math.abs(rects.intro.x+rects.intro.width/2-width/2)<4,'Intro not centered');
   assert(Math.abs(rects.portrait.x+rects.portrait.width/2-width/2)<4,'Portrait not centered');
   assert(rects.word.x>=-20&&rects.word.right<=width+20,`Designer clipped: ${JSON.stringify(rects.word)}`);
   assert(Math.abs(rects.copy.x-rects.word.x)<4,`Copy must align exactly below the D: ${JSON.stringify(rects)}`);
   assert(rects.copy.width<=365,`Copy column must stay constrained: ${rects.copy.width}`);
   assert(rects.copy.y>rects.hero.height*.49&&rects.copy.bottom<rects.hero.height*.98,`Copy not in lower hero: ${JSON.stringify(rects.copy)}`);
  }else{
   assert(rects.word.x>=-15&&rects.word.right<=width+15,`Mobile Designer clipped: ${JSON.stringify(rects.word)}`);
   assert(Math.abs(rects.copy.x+rects.copy.width/2-width/2)<4,'Mobile copy is not centered');
  }
  output.push({viewport:`${width}x${height}`,status:'pass',rects});await page.screenshot({path:`qa-artifacts/hero-reference-${width}.png`});console.log('PASS Designer-aligned hero geometry',`${width}x${height}`);
 }catch(error){errors++;output.push({viewport:`${width}x${height}`,status:'fail',error:error.message});console.error('FAIL Designer-aligned hero geometry',`${width}x${height}`,error.stack);await page.screenshot({path:`qa-artifacts/hero-reference-${width}-failure.png`}).catch(()=>{});}finally{await page.close();}
}
await browser.close();await writeFile('qa-artifacts/hero-alignment-report.json',JSON.stringify(output,null,2));if(errors)process.exitCode=1;
