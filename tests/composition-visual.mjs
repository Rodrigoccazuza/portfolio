import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const base='http://127.0.0.1:8000/';
await mkdir('qa-artifacts',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const report={pages:[],consoleErrors:[],pageErrors:[],videoResponses:[],results:[]};
async function check(label,callback){try{await callback();report.results.push({label,status:'pass'});console.log('PASS',label);}catch(error){report.results.push({label,status:'fail',message:error.message});console.error('FAIL',label,error.message);}}
async function newPage(width,height){const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});page.on('pageerror',error=>report.pageErrors.push(error.message));page.on('console',message=>{if(message.type()==='error')report.consoleErrors.push(message.text());});page.on('response',response=>{if(response.url().includes('concept-to-implementation.mp4'))report.videoResponses.push({status:response.status(),url:response.url()});});return page;}
async function revealFullPage(page){await page.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=650){scrollTo(0,y);await new Promise(resolve=>setTimeout(resolve,22));}scrollTo(0,0);});await page.waitForTimeout(500);}
const desktop=await newPage(1440,900);
await check('Home renders the composition without the old hero artwork',async()=>{
  await desktop.goto(base,{waitUntil:'domcontentloaded'});
  await desktop.locator('body.composition-home.composition-v2').waitFor({timeout:25000});
  await desktop.locator('.concept-timeline .comp-process-video').waitFor({timeout:25000,state:'attached'});
  await desktop.waitForFunction(()=>document.querySelector('.hero-background')?.hidden===true,{timeout:15000});
  assert.equal(await desktop.locator('.portrait-stage canvas').count(),1);
  assert.equal(await desktop.locator('#hero-title .accent-italic').textContent(),'Designer');
  assert.equal(await desktop.locator('.comp-about').count(),1);
  await desktop.waitForTimeout(1400);
  report.homeMetrics=await desktop.evaluate(()=>({heroBackgroundDisplay:getComputedStyle(document.querySelector('.hero-background')).display,portraitState:document.querySelector('.portrait-stage')?.dataset.modelState,videoState:document.querySelector('.comp-process-video')?.readyState,videoNetwork:document.querySelector('.comp-process-video')?.networkState,videoError:document.querySelector('.comp-process-video')?.error?.code||null}));
  console.log('HOME METRICS',JSON.stringify(report.homeMetrics));
  assert.equal(report.homeMetrics.heroBackgroundDisplay,'none','Former hero graphic still displayed');
  await revealFullPage(desktop);
  await desktop.screenshot({path:'qa-artifacts/home-desktop.png',fullPage:true});report.pages.push('home-desktop.png');
});
await check('Workflow media loads and seeks on scroll',async()=>{
  const video=desktop.locator('.comp-process-video');
  await video.evaluate(video=>{video.hidden=false;video.preload='auto';if(video.readyState<1)video.load();});
  try{await desktop.waitForFunction(()=>{const v=document.querySelector('.comp-process-video');return v&&((v.readyState>=1&&v.duration>0)||v.error);},{timeout:18000});}catch(error){console.error('VIDEO RESPONSE',JSON.stringify(report.videoResponses));throw error;}
  const metrics=await video.evaluate(v=>({src:v.currentSrc,readyState:v.readyState,networkState:v.networkState,error:v.error?.code||null,duration:v.duration}));report.videoMetrics=metrics;console.log('VIDEO METRICS',JSON.stringify(metrics));
  assert(!metrics.error,`Video element error code ${metrics.error} (${metrics.src})`);
  assert(metrics.duration>9&&metrics.duration<11,`Unexpected duration ${metrics.duration}`);
  await desktop.locator('.concept-timeline').scrollIntoViewIfNeeded();
  await desktop.evaluate(()=>window.scrollBy(0,220));await desktop.waitForTimeout(350);
  assert.equal(await desktop.locator('.concept-step.is-current').count(),1);
});
await check('Work archive renders and filtering responds',async()=>{
  await desktop.goto(base+'work/',{waitUntil:'domcontentloaded'});
  await desktop.locator('body.composition-work').waitFor({timeout:15000});
  assert((await desktop.locator('[data-project-card]').count())>5);
  await desktop.locator('[data-filter="email-design"]').click();
  assert((await desktop.locator('[data-project-card]:visible').count())>0,'Filter produced no visible projects');
  await revealFullPage(desktop);
  await desktop.screenshot({path:'qa-artifacts/work-desktop.png',fullPage:true});report.pages.push('work-desktop.png');
});
await check('Experience retains real career and supporting documents',async()=>{
  await desktop.goto(base+'experience/',{waitUntil:'domcontentloaded'});
  await desktop.locator('body.composition-experience.composition-v2').waitFor({timeout:15000});
  assert((await desktop.locator('.comp-exp-list li').count())>=8);
  assert((await desktop.locator('.comp-exp-list').textContent()).includes('2024 — 2025'));
  assert.equal(await desktop.locator('.composition-preserved-projects').count(),1);
  assert.equal(await desktop.locator('.composition-preserved-education').count(),1);
  assert.equal(await desktop.locator('#asset-library').count(),1);
  await revealFullPage(desktop);
  await desktop.screenshot({path:'qa-artifacts/experience-desktop.png',fullPage:true});report.pages.push('experience-desktop.png');
});
const mobile=await newPage(390,844);
await check('Home mobile avoids overflow and does not show old background',async()=>{
  await mobile.goto(base,{waitUntil:'domcontentloaded'});
  await mobile.locator('body.composition-home.composition-v2').waitFor({timeout:15000});
  await mobile.waitForFunction(()=>document.querySelector('.hero-background')?.hidden===true,{timeout:15000});
  await mobile.waitForTimeout(800);
  assert(!(await mobile.evaluate(()=>document.documentElement.scrollWidth>innerWidth+4)),'Home has horizontal overflow');
  await revealFullPage(mobile);
  await mobile.screenshot({path:'qa-artifacts/home-mobile.png',fullPage:true});report.pages.push('home-mobile.png');
});
await check('Experience mobile avoids overflow',async()=>{
  await mobile.goto(base+'experience/',{waitUntil:'domcontentloaded'});
  await mobile.locator('body.composition-experience.composition-v2').waitFor({timeout:15000});
  assert(!(await mobile.evaluate(()=>document.documentElement.scrollWidth>innerWidth+4)),'Experience has horizontal overflow');
  await revealFullPage(mobile);
  await mobile.screenshot({path:'qa-artifacts/experience-mobile.png',fullPage:true});report.pages.push('experience-mobile.png');
});
await browser.close();
await writeFile('qa-artifacts/report.json',JSON.stringify(report,null,2));
console.log('Results:',JSON.stringify(report.results));
if(report.results.some(result=>result.status==='fail'))process.exitCode=1;
