import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const origin = 'http://127.0.0.1:8000/';
const paths = ['', 'work/', 'experience/', 'contact/', 'work/brand-systems/'];
let failed = false;

async function waitForStylesheet(page, selector) {
  const link = page.locator(selector);
  await link.waitFor({ state: 'attached', timeout: 15000 });
  await link.evaluate(node => node.sheet ? undefined : new Promise((resolve, reject) => {
    node.addEventListener('load', resolve, { once: true });
    node.addEventListener('error', () => reject(new Error(`Stylesheet failed to load: ${node.href}`)), { once: true });
  }));
}

for (const path of paths) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    await page.goto(origin + path, { waitUntil: 'domcontentloaded' });
    await waitForStylesheet(page, 'link[data-site-navigation]');
    if (!path) {
      await page.locator('body.composition-home.composition-v2').waitFor({ timeout: 15000 });
      await waitForStylesheet(page, 'link[href*="home-nav-layout-fix.css"]');
    }
    if (path === 'experience/') await page.locator('body.composition-experience.composition-v2').waitFor({ timeout: 15000 });
    await page.waitForTimeout(200);
    const nav = await page.evaluate(() => {
      const header = document.querySelector('.site-header');
      const bar = header.querySelector('.nav-bar');
      const menu = document.querySelector('#primary-nav');
      const anchors = [...menu.querySelectorAll('ul a')];
      const button = menu.querySelector('.nav-resume-btn');
      const headerRect = header.getBoundingClientRect();
      const barRect = bar.getBoundingClientRect();
      const logoRect = header.querySelector('.nav-logo').getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      return {
        headerBackground: getComputedStyle(header).backgroundColor,
        menuBackground: getComputedStyle(menu).backgroundColor,
        labels: anchors.map(link => link.textContent.trim()),
        hrefs: anchors.map(link => new URL(link.href).pathname),
        linkBackgrounds: anchors.map(link => getComputedStyle(link).backgroundColor),
        buttonBackground: getComputedStyle(button).backgroundColor,
        buttonHref: new URL(button.href).pathname,
        logoHref: new URL(header.querySelector('.nav-logo').href).pathname,
        headerPosition: getComputedStyle(header).position,
        headerCssTop: getComputedStyle(header).top,
        headerTop: headerRect.top,
        headerWidth: headerRect.width,
        barLeft: barRect.left,
        barRight: barRect.right,
        barWidth: barRect.width,
        logoLeft: logoRect.left,
        buttonRight: buttonRect.right,
        viewport: innerWidth
      };
    });
    assert.deepEqual(nav.labels, ['Home', 'Work', 'Experience']);
    assert.deepEqual(nav.hrefs, ['/', '/work/', '/experience/']);
    assert.equal(nav.buttonHref, '/contact/');
    assert.equal(nav.logoHref, '/');
    assert.equal(nav.headerBackground, 'rgb(16, 17, 15)');
    assert.equal(nav.menuBackground, 'rgba(0, 0, 0, 0)');
    assert(nav.linkBackgrounds.every(background => background === 'rgba(0, 0, 0, 0)'), `Gray nav link background: ${nav.linkBackgrounds}`);
    if (!path) assert.equal(nav.buttonBackground, 'rgb(113, 33, 202)');
    assert.equal(nav.headerPosition, 'sticky');
    assert(Math.abs(nav.headerWidth - nav.viewport) <= 2);
    assert(nav.barWidth <= 1122, `${path || 'home'} nav container incorrectly spans ${nav.barWidth}px`);
    assert(Math.abs((nav.barLeft + nav.barRight) / 2 - nav.viewport / 2) <= 2, `${path || 'home'} nav container is not centered`);
    assert(nav.logoLeft >= nav.barLeft - 2, `${path || 'home'} logo escaped shared nav container`);
    assert(nav.buttonRight <= nav.barRight + 2, `${path || 'home'} contact button escaped shared nav container`);
    if (!path) {
      assert.equal(nav.headerCssTop, '0px', `Homepage sticky header top offset is ${nav.headerCssTop}`);
      assert(Math.abs(nav.headerTop) <= 2, `Homepage nav starts ${nav.headerTop}px below the viewport`);
    }
    await page.evaluate(() => { document.documentElement.classList.remove('dark'); });
    assert.equal(await page.locator('.site-header').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(16, 17, 15)');
    console.log(`PASS shared centered dark navigation on ${path || 'home'} (header top ${nav.headerTop}px)`);
  } catch (error) {
    failed = true;
    console.error(`FAIL shared navigation on ${path || 'home'}: ${error.stack}`);
  } finally {
    await page.close();
  }
}

for (const path of ['', 'work/', 'experience/', 'contact/']) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  try {
    await page.goto(origin + path, { waitUntil: 'domcontentloaded' });
    await waitForStylesheet(page, 'link[data-site-navigation]');
    if (!path) {
      await page.locator('body.composition-home.composition-v2').waitFor({ timeout: 15000 });
      await waitForStylesheet(page, 'link[href*="home-nav-layout-fix.css"]');
      const header = await page.locator('.site-header').evaluate(el => ({ top: el.getBoundingClientRect().top, cssTop: getComputedStyle(el).top }));
      assert.equal(header.cssTop, '0px', `Homepage mobile sticky offset is ${header.cssTop}`);
      assert(Math.abs(header.top) <= 2, `Homepage mobile nav begins ${header.top}px below viewport`);
    }
    const toggle = page.locator('.nav-toggle');
    await toggle.click();
    await page.locator('#primary-nav[data-open="true"]').waitFor({ timeout: 5000 });
    assert.equal(await page.locator('#primary-nav').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(16, 17, 15)');
    assert.equal(await page.locator('#primary-nav .nav-resume-btn').evaluate(el => new URL(el.href).pathname), '/contact/');
    assert((await page.evaluate(() => document.documentElement.scrollWidth)) <= 393, 'Horizontal overflow');
    await page.keyboard.press('Escape');
    assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
    console.log(`PASS mobile dark navigation on ${path || 'home'}`);
  } catch (error) {
    failed = true;
    console.error(`FAIL mobile navigation on ${path || 'home'}: ${error.stack}`);
  } finally {
    await page.close();
  }
}
await browser.close();
if (failed) process.exitCode = 1;
