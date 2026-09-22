import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const base='http://127.0.0.1:8000/';
await mkdir('qa-artifacts',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const report={pages:[],consoleErrors:[],pageErrors:[],results:[]};
async function check(label,callback){try{await callback();report.results.push({label,status:'pass'});console.log('PASS',label);}catch(error){report.results.push({label,status:'fail',message:error.message});console.error('FAIL',label,error.message);}}
async function newPage(width,height){const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});page.on('pageerror',error=>report.pageErrors.push(error.message));page.on('console',message=>{if(message.type()==='error')report.consoleErrors.push(message.text());});return page;}
const desktop=await newPage(1440,900);
await check('Home renders the composition',async()=>{
  await desktop.goto(base,{waitUntil:'domcontentloaded'});
  await desktop.locator('body.composition-home.composition-v2').waitFor({timeout:25000});
  await desktop.locator('.concept-timeline .comp-process-video').waitFor({timeout:25000,state:'attached'});
  assert.equal(await desktop.locator('.portrait-stage canvas').count(),1);
  assert.equal(await desktop.locator('#hero-title .accent-italic').textContent(),'Designer');
  assert.equal(await desktop.locator('.comp-about').count(),1);
  await desktop.screenshot({path:'qa-artifacts/home-desktop.png',fullPage:true});
  report.pages.push('home-desktop.png');
});
await check('Workflow media loads and seeks on scroll',async()=>{
  await desktop.locator('.comp-process-video').evaluate(video=>new Promise((resolve,reject)=>{
    if(video.readyState>=1&&video.duration>0)return resolve();
    const t=setTimeout(()=>reject(Error('Video metadata timeout')),20000);
    video.addEventListener('loadedmetadata',()=>{clearTimeout(t);resolve();},{once:true});
    video.addEventListener('error',()=>{clearTimeout(t);reject(Error('Video failed to load'));},{once:true});
  }));
  const duration=await desktop.locator('.comp-process-video').evaluate(video=>video.duration);
  assert(duration>9&&duration<11,`Unexpected duration ${duration}`);
  await desktop.locator('.concept-timeline').scrollIntoViewIfNeeded();
  await desktop.evaluate(()=>window.scrollBy(0,220));await desktop.waitForTimeout(250);
  const index=await desktop.locator('.concept-step.is-current').count();assert.equal(index,1);
  report.videoDuration=duration;
});
await check('Work archive renders and filtering responds',async()=>{
  await desktop.goto(base+'work/',{waitUntil:'domcontentloaded'});
  await desktop.locator('body.composition-work').waitFor({timeout:15000});
  assert((await desktop.locator('[data-project-card]').count())>5);
  await desktop.locator('[data-filter="email-design"]').click();
  assert((await desktop.locator('[data-project-card]:visible').count())>0,'Filter produced no visible projects');
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
  await desktop.screenshot({path:'qa-artifacts/experience-desktop.png',fullPage:true});report.pages.push('experience-desktop.png');
});
const mobile=await newPage(390,844);
await check('Home responsive layout avoids horizontal overflow',async()=>{
  await mobile.goto(base,{waitUntil:'domcontentloaded'});
  await mobile.locator('body.composition-home.composition-v2').waitFor({timeout:15000});
  await mobile.waitForTimeout(800);
  const overflow=await mobile.evaluate(()=>document.documentElement.scrollWidth>innerWidth+4);
  assert(!overflow,'Home page has horizontal overflow');
  await mobile.screenshot({path:'qa-artifacts/home-mobile.png',fullPage:true});report.pages.push('home-mobile.png');
});
await check('Experience responsive layout avoids horizontal overflow',async()=>{
  await mobile.goto(base+'experience/',{waitUntil:'domcontentloaded'});
  await mobile.locator('body.composition-experience.composition-v2').waitFor({timeout:15000});
  const overflow=await mobile.evaluate(()=>document.documentElement.scrollWidth>innerWidth+4);
  assert(!overflow,'Experience page has horizontal overflow');
  await mobile.screenshot({path:'qa-artifacts/experience-mobile.png',fullPage:true});report.pages.push('experience-mobile.png');
});
await browser.close();
await writeFile('qa-artifacts/report.json',JSON.stringify(report,null,2));
console.log('Results:',JSON.stringify(report.results));
if(report.results.some(item=>item.status==='fail'))process.exitCode=1;
