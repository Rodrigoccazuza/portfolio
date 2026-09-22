import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const base='http://127.0.0.1:8000/';
const results=[];
async function check(name,fn){try{await fn();results.push([name,'pass']);console.log('PASS',name);}catch(error){results.push([name,'fail']);console.error('FAIL',name,error.message);}}
const desktop=await browser.newPage({viewport:{width:1440,height:900}});
await check('Finished desktop hero appears, is tall, centered and unclipped',async()=>{
 await desktop.goto(base,{waitUntil:'domcontentloaded'});
 await desktop.waitForFunction(()=>document.documentElement.classList.contains('composition-ready'),null,{timeout:15000});
 const data=await desktop.evaluate(()=>{const hero=document.querySelector('.portfolio-hero'),designer=document.querySelector('#hero-title .accent-italic'),portrait=document.querySelector('.portrait-stage'),intro=document.querySelector('.hero-intro'),statement=document.querySelector('.hero-statement');const h=hero.getBoundingClientRect(),d=designer.getBoundingClientRect(),p=portrait.getBoundingClientRect(),i=intro.getBoundingClientRect(),s=statement.getBoundingClientRect();return {heroHeight:h.height,designerFont:parseFloat(getComputedStyle(designer).fontSize),designerCenter:d.x+d.width/2,portraitCenter:p.x+p.width/2,viewport:innerWidth,statementX:s.left,statementBottom:h.bottom-s.bottom,introBottom:i.bottom,portraitTop:p.top,designerLeft:d.left,designerRight:d.right,opacity:getComputedStyle(document.body).opacity};});
 assert(data.heroHeight>=900,JSON.stringify(data));
 assert(data.designerFont<=270,JSON.stringify(data));
 assert(Math.abs(data.designerCenter-data.viewport/2)<data.viewport*.08,JSON.stringify(data));
 assert(Math.abs(data.portraitCenter-data.viewport/2)<data.viewport*.06,JSON.stringify(data));
 assert(data.statementX<data.viewport*.1&&data.statementBottom>=0,JSON.stringify(data));
 assert(data.designerLeft>=-35&&data.designerRight<=data.viewport+35,JSON.stringify(data));
});
await check('Website buttons and dots use brand green',async()=>{
 const found=await desktop.evaluate(()=>{const dots=document.querySelector('.stack-dots'),btn=document.querySelector('.stack-copy .btn');return {dots:dots&&getComputedStyle(dots).color,button:btn&&getComputedStyle(btn).backgroundColor};});
 assert(found.dots==='rgb(102, 212, 135)',JSON.stringify(found));
 assert(found.button==='rgb(102, 212, 135)',JSON.stringify(found));
});
await check('Workflow gradient is two percent and video is not darkened by filters',async()=>{
 await desktop.locator('.concept-timeline.workflow-stage').waitFor({timeout:15000});
 const style=await desktop.evaluate(()=>({light:getComputedStyle(document.querySelector('.workflow-stage-light')).backgroundImage,shade:getComputedStyle(document.querySelector('.workflow-stage-shade')).backgroundImage,filter:getComputedStyle(document.querySelector('.workflow-stage-video')).filter}));
 assert(style.light.includes('0.02')&&style.shade.includes('0.02'),JSON.stringify(style));
 assert(style.filter==='none',JSON.stringify(style));
});
const footerSamples=[];
await check('Home, Work, Experience and Contact have the same footer',async()=>{
 for(const path of ['','work/','experience/','contact/']){await desktop.goto(base+path,{waitUntil:'domcontentloaded'});await desktop.waitForFunction(()=>document.querySelector('.site-footer .footer-panel-intro')!==null,{timeout:15000});if(path!=='contact/')await desktop.waitForTimeout(200);footerSamples.push(await desktop.locator('.site-footer').evaluate(node=>[...node.querySelectorAll('.footer-columns h3')].map(x=>x.textContent.trim()).join('|')));}
 assert.equal(new Set(footerSamples).size,1,JSON.stringify(footerSamples));
});
const mobile=await browser.newPage({viewport:{width:390,height:844}});
await check('Mobile portrait is centered, copy follows it, and CTAs stack',async()=>{
 await mobile.goto(base,{waitUntil:'domcontentloaded'});
 await mobile.waitForFunction(()=>document.documentElement.classList.contains('composition-ready'),null,{timeout:15000});
 const d=await mobile.evaluate(()=>{const face=document.querySelector('.portrait-stage').getBoundingClientRect(),copy=document.querySelector('.hero-statement').getBoundingClientRect(),buttons=[...document.querySelectorAll('.hero-actions .btn')].map(n=>n.getBoundingClientRect());return {faceCenter:face.left+face.width/2,copyTop:copy.top,faceBottom:face.bottom,copyCenter:copy.left+copy.width/2,buttons:buttons.map(b=>({x:b.x,y:b.y,width:b.width})),screen:innerWidth,overflow:document.documentElement.scrollWidth-innerWidth};});
 assert(Math.abs(d.faceCenter-195)<20,JSON.stringify(d));
 assert(Math.abs(d.copyCenter-195)<20,JSON.stringify(d));
 assert(d.buttons.length===2&&d.buttons[1].y>d.buttons[0].y&&d.buttons[0].width>=330,JSON.stringify(d));
 assert(d.overflow<=4,JSON.stringify(d));
});
await check('Mobile About image retains natural proportions',async()=>{
 const image=mobile.locator('.comp-about > img');await image.waitFor();
 const v=await image.evaluate(im=>({fit:getComputedStyle(im).objectFit,ratio:getComputedStyle(im).aspectRatio,height:getComputedStyle(im).height}));
 assert.equal(v.fit,'contain',JSON.stringify(v));assert.equal(v.ratio,'auto',JSON.stringify(v));
});
await browser.close();
if(results.some(item=>item[1]==='fail'))process.exitCode=1;
