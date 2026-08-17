const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const GITHUB_HOST = 'rodrigoccazuza.github.io';
const GITHUB_PROJECT_PATH = '/portfolio/';

const BASE_BLOCK = `<base id="site-base" href="/">
<script>
(function () {
  if (window.location.hostname === '${GITHUB_HOST}') {
    document.getElementById('site-base').setAttribute('href', '${GITHUB_PROJECT_PATH}');
  }
}());
</script>`;

function walk(dir, extensions) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (['.git', 'node_modules', 'assets', 'images', 'scripts', '.github'].includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...walk(fullPath, extensions));
    } else if (entry.isFile() && extensions.some((ext) => entry.name.endsWith(ext))) {
      files.push(fullPath);
    }
  }

  return files;
}

function addBaseBlock(html) {
  if (html.includes('id="site-base"')) return html;
  return html.replace(/<head(\s[^>]*)?>/i, (match) => `${match}\n${BASE_BLOCK}`);
}

function makeHtmlPathsBaseRelative(html) {
  // Keep canonical, Open Graph and other absolute https:// URLs untouched.
  // Convert only site-root URLs so the <base> element can resolve them for
  // both rodrigocazuza.com (/) and GitHub Project Pages (/portfolio/).
  const urlAttributes = [
    'href',
    'src',
    'action',
    'poster',
    'data-src',
    'data-href',
    'data-poster',
    'data-viewer-src',
    'data-video-src'
  ].join('|');

  const attrRegex = new RegExp(`((?:${urlAttributes})=["'])\\/(?!\\/)`, 'gi');
  html = html.replace(attrRegex, '$1');

  // Handle responsive image candidates such as srcset="/image-a.jpg 1x, /image-b.jpg 2x".
  html = html.replace(/(srcset=["'])([^"']*)(["'])/gi, (match, open, value, close) => {
    const rewritten = value
      .split(',')
      .map((candidate) => candidate.replace(/^(\s*)\/(?!\/)/, '$1'))
      .join(',');
    return `${open}${rewritten}${close}`;
  });

  // Inline CSS URLs resolve against the document base, so make them base-relative too.
  html = html.replace(/url\((['"]?)\/(?!\/)/gi, 'url($1');

  return html;
}

function normalizeHtml(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  let html = original;

  html = addBaseBlock(html);
  html = makeHtmlPathsBaseRelative(html);

  if (html !== original) {
    fs.writeFileSync(filePath, html, 'utf8');
    return true;
  }
  return false;
}

function normalizeCss(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  // Stylesheets live in /css/. Turn root-relative asset URLs into paths
  // relative to that directory, which works at both hosting base paths.
  const css = original.replace(/url\((['"]?)\/(?!\/)/gi, 'url($1../');

  if (css !== original) {
    fs.writeFileSync(filePath, css, 'utf8');
    return true;
  }
  return false;
}

const htmlFiles = walk(ROOT, ['.html']);
const cssDir = path.join(ROOT, 'css');
const cssFiles = fs.existsSync(cssDir)
  ? fs.readdirSync(cssDir)
      .filter((name) => name.endsWith('.css'))
      .map((name) => path.join(cssDir, name))
  : [];

let htmlChanged = 0;
let cssChanged = 0;

for (const file of htmlFiles) {
  if (normalizeHtml(file)) htmlChanged += 1;
}

for (const file of cssFiles) {
  if (normalizeCss(file)) cssChanged += 1;
}

console.log(`GitHub Pages path normalization complete. Updated ${htmlChanged} HTML files and ${cssChanged} CSS files.`);
