import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
for(const route of ['','experience/']){
 const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
 await page.goto('http://127.0.0.1:8000/'+route,{waitUntil:'domcontentloaded'});
 await page.locator('body.composition-v2').waitFor({timeout:20000});
 await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=550){scrollTo(0,y);await new Promise(done=>setTimeout(done,45));}scrollTo(0,0);});
 await page.waitForTimeout(600);
 const data=await page.evaluate(()=>({width:innerWidth,root:document.documentElement.scrollWidth,body:document.body.scrollWidth,offenders:[...document.querySelectorAll('*')].map(e=>{const r=e.getBoundingClientRect();return {name:e.tagName.toLowerCase(),id:e.id,cls:typeof e.className==='string'?e.className.slice(0,100):'',left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width),scrollWidth:e.scrollWidth};}).filter(e=>e.right>innerWidth+5||e.left< -5).sort((a,b)=>b.right-a.right).slice(0,25)}));
 console.log('OVERFLOW',route||'home',JSON.stringify(data));await page.close();
}
await browser.close();
