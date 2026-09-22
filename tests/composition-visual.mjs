import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const base='http://127.0.0.1:8000/';
await mkdir('qa-artifacts',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const report={pages:[],consoleErrors:[],pageErrors:[],videoResponses:[],results:[]};
async function check(label,callback){try{await callback();report.results.push({label,status:'pass'});console.log('PASS',label);}catch(error){report.results.push({label,status:'fail',message:error.message});console.error('FAIL',label,error.message);}}
async function newPage(width,height){const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});page.on('pageerror',error=>report.pageErrors.push(error.message));page.on('console',message=>{if(message.type()==='error')report.consoleErrors.push(message.text());});page.on('response',response=>{if(response.url().includes('concept-to-implementation.mp4'))report.videoResponses.push({status:response.status(),url:response.url()});});return page;}
async function revealFullPage(page){await page.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=650){scrollTo(0,y);await new Promise(resolve=>setTimeout(resolve,35));}scrollTo(0,0);});await page.waitForTimeout(400);}
const desktop=await newPage(1440,900);
await check('Home renders composition and removes old hero artwork',async()=>{
  await desktop.goto(base,{waitUntil:'domcontentloaded'});
  await desktop.locator('body.composition-home.composition-v2').waitFor({timeout:25000});
  await desktop.locator('.concept-timeline .comp-process-video').waitFor({timeout:25000,state:'attached'});
  await desktop.waitForFunction(()=>document.querySelector('.hero-background')?.hidden===true,{timeout:15000});
  assert.equal(await desktop.locator('.portrait-stage canvas').count(),1);
  assert.equal(await desktop.locator('#hero-title .accent-italic').textContent(),'Designer');
  assert.equal(await desktop.locator('.comp-about').count(),1);
  await desktop.waitForTimeout(1300);
  report.homeMetrics=await desktop.evaluate(()=>({heroBackgroundDisplay:getComputedStyle(document.querySelector('.hero-background')).display,portraitState:document.querySelector('.portrait-stage')?.dataset.modelState}));
  assert.equal(report.homeMetrics.heroBackgroundDisplay,'none');
  await revealFullPage(desktop);
  await desktop.screenshot({path:'qa-artifacts/home-desktop.png',fullPage:true});report.pages.push('home-desktop.png');
});
await check('Workflow video loads, seeks and contains no overlay content',async()=>{
  await desktop.addStyleTag({content:'html,body{scroll-behavior:auto!important}'});
  const section=desktop.locator('.concept-timeline.workflow-video-only');
  await section.scrollIntoViewIfNeeded();
  await desktop.waitForFunction(()=>{const v=document.querySelector('.workflow-video-only video');return !!v&&((v.readyState>=1&&v.duration>0)||!!v.error);},null,{timeout:20000});
  const video=section.locator('video');
  const metrics=await video.evaluate(v=>({src:v.currentSrc,error:v.error?.code||null,duration:v.duration,fit:getComputedStyle(v).objectFit}));
  report.videoMetrics=metrics;
  assert(!metrics.error,`Video error ${metrics.error} (${metrics.src})`);
  assert(metrics.duration>9&&metrics.duration<11,`Unexpected duration ${metrics.duration}`);
  assert.equal(metrics.fit,'contain');
  assert.equal(await section.locator('h1,h2,h3,p,ol,li,.workflow-stage-card,.workflow-stage-footer').count(),0);
  await section.evaluate(s=>{const top=s.getBoundingClientRect().top+scrollY;scrollTo(0,top+(s.offsetHeight-innerHeight)*.55);});
  await desktop.waitForTimeout(700);
  const time=await video.evaluate(v=>v.currentTime);
  assert(time>1,`Expected scroll-scrubbed progress, got ${time}`);
});
await check('Work archive renders and filters',async()=>{
  await desktop.goto(base+'work/',{waitUntil:'domcontentloaded'});
  await desktop.locator('body.composition-work').waitFor({timeout:15000});
  assert((await desktop.locator('[data-project-card]').count())>5);
  await desktop.locator('[data-filter="email-design"]').click();
  assert((await desktop.locator('[data-project-card]:visible').count())>0);
  await revealFullPage(desktop);await desktop.screenshot({path:'qa-artifacts/work-desktop.png',fullPage:true});report.pages.push('work-desktop.png');
});
await check('Experience retains original career projects education and library',async()=>{
  await desktop.goto(base+'experience/',{waitUntil:'domcontentloaded'});
  await desktop.locator('body.composition-experience.composition-v2').waitFor({timeout:15000});
  assert((await desktop.locator('.comp-exp-list li').count())>=8);
  assert((await desktop.locator('.comp-exp-list').textContent()).includes('2024 — 2025'));
  assert.equal(await desktop.locator('.composition-preserved-projects').count(),1);
  assert.equal(await desktop.locator('.composition-preserved-education').count(),1);
  assert.equal(await desktop.locator('#asset-library').count(),1);
  await revealFullPage(desktop);await desktop.screenshot({path:'qa-artifacts/experience-desktop.png',fullPage:true});report.pages.push('experience-desktop.png');
});
const mobile=await newPage(390,844);
await check('Home mobile has no horizontal overflow',async()=>{
  await mobile.goto(base,{waitUntil:'domcontentloaded'});
  await mobile.locator('body.composition-home.composition-v2').waitFor({timeout:15000});
  await mobile.waitForFunction(()=>document.querySelector('.hero-background')?.hidden===true,{timeout:15000});
  await mobile.waitForTimeout(700);
  assert(!(await mobile.evaluate(()=>document.documentElement.scrollWidth>innerWidth+4)),'Home horizontal overflow');
  await revealFullPage(mobile);await mobile.screenshot({path:'qa-artifacts/home-mobile.png',fullPage:true});report.pages.push('home-mobile.png');
});
await check('Experience mobile has no horizontal overflow',async()=>{
  await mobile.goto(base+'experience/',{waitUntil:'domcontentloaded'});
  await mobile.locator('body.composition-experience.composition-v2').waitFor({timeout:15000});
  assert(!(await mobile.evaluate(()=>document.documentElement.scrollWidth>innerWidth+4)),'Experience horizontal overflow');
  await revealFullPage(mobile);await mobile.screenshot({path:'qa-artifacts/experience-mobile.png',fullPage:true});report.pages.push('experience-mobile.png');
});
await browser.close();await writeFile('qa-artifacts/report.json',JSON.stringify(report,null,2));
console.log('Results:',JSON.stringify(report.results));
if(report.results.some(result=>result.status==='fail'))process.exitCode=1;
