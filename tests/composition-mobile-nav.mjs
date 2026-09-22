import {chromium} from 'playwright';
import assert from 'node:assert/strict';

const browser = await chromium.launch({headless:true,args:['--no-sandbox']});
const origin = 'http://127.0.0.1:8000/';
let failed = false;
for (const route of ['', 'experience/', 'work/']) {
  const page = await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
  try {
    await page.goto(origin+route,{waitUntil:'domcontentloaded'});
    if(route!=='work/') await page.locator('body.composition-v2').waitFor({timeout:20000});
    else await page.locator('body.composition-work').waitFor({timeout:20000});
    if(route!=='work/') await page.waitForFunction(()=>[...document.styleSheets].some(s=>s.href?.includes('composition-finishing.css')),{timeout:15000});
    await page.evaluate(async()=>{
      for(let y=0;y<document.body.scrollHeight;y+=500){window.scrollTo(0,y);await new Promise(done=>setTimeout(done,35));}
      window.scrollTo(0,0);
    });
    await page.waitForTimeout(500);
    const sizes=await page.evaluate(()=>({viewport:innerWidth,root:document.documentElement.scrollWidth,body:document.body.scrollWidth}));
    assert(sizes.root<=sizes.viewport+2,`${route||'home'} root overflow ${JSON.stringify(sizes)}`);
    assert(sizes.body<=sizes.viewport+2,`${route||'home'} body overflow ${JSON.stringify(sizes)}`);
    const menu=page.locator('#primary-nav');
    const toggle=page.locator('.nav-toggle');
    await toggle.click();
    await menu.waitFor({state:'visible',timeout:5000});
    assert.equal(await toggle.getAttribute('aria-expanded'),'true');
    await page.keyboard.press('Escape');
    assert.equal(await toggle.getAttribute('aria-expanded'),'false');
    const after=await page.evaluate(()=>({viewport:innerWidth,root:document.documentElement.scrollWidth,body:document.body.scrollWidth}));
    assert(after.root<=after.viewport+2&&after.body<=after.viewport+2,`${route||'home'} closed menu overflow ${JSON.stringify(after)}`);
    console.log(`PASS mobile overflow and navigation: ${route||'home'} ${JSON.stringify(after)}`);
  } catch(error){failed=true;console.error(`FAIL mobile navigation: ${route||'home'} ${error.message}`);}
  finally{await page.close();}
}
await browser.close();
if(failed)process.exitCode=1;
