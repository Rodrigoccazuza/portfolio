const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SITE_URL = 'https://rodrigocazuza.com';
const DEFAULT_IMAGE = `${SITE_URL}/images/site/hero.jpg`;

const MAIN_META = {
  'index.html': {
    title: 'Rodrigo Cazuza | Multimedia Designer and Front-End Developer NYC',
    description: 'New York City multimedia designer and front-end developer creating brand systems, email campaigns, paid social creative, websites, and video content.'
  },
  'work/index.html': {
    title: 'Design and Marketing Portfolio | Rodrigo Cazuza NYC',
    description: 'Explore branding, email design, Meta ads, social media, video, and web design projects by New York City multimedia designer Rodrigo Cazuza.'
  },
  'experience/index.html': {
    title: 'Creative and Front-End Experience | Rodrigo Cazuza NYC',
    description: 'Explore Rodrigo Cazuza’s experience in multimedia design, marketing, front-end development, content production, and creative project management in New York City.'
  },
  'contact/index.html': {
    title: 'Contact Rodrigo Cazuza | NYC Multimedia Designer',
    description: 'Contact Rodrigo Cazuza for multimedia design, branding, email marketing, social media creative, video production, and front-end web development projects.'
  },
  'contact/thanks/index.html': {
    title: 'Thank You | Rodrigo Cazuza',
    description: 'Thank you for contacting Rodrigo Cazuza about your creative or web development project.',
    noindex: true
  },
  'resume/index.html': {
    title: 'Resume | Rodrigo Cazuza, Multimedia Designer NYC',
    description: 'View Rodrigo Cazuza’s resume, skills, education, and experience in multimedia design, marketing, content production, and front-end development.'
  },
  'brand-guidelines/index.html': {
    title: 'Brand Identity and Guidelines Portfolio | Rodrigo Cazuza',
    description: 'Explore brand identity systems, visual guidelines, typography, color, and creative direction projects designed by Rodrigo Cazuza.'
  },
  'brand-guidelines/bodyfactory/index.html': {
    title: 'BodyFactory Brand Guidelines Archive | Rodrigo Cazuza',
    description: 'This archived BodyFactory brand guidelines page points visitors to the current brand identity portfolio.',
    noindex: true
  },
  'brand-guidelines/taina-photography/index.html': {
    title: 'Taina Photography Brand Archive | Rodrigo Cazuza',
    description: 'This archived Taina Photography brand page points visitors to the current brand identity portfolio.',
    noindex: true
  },
  '404.html': {
    title: 'Page Not Found | Rodrigo Cazuza',
    description: 'The requested portfolio page could not be found.',
    noindex: true
  }
};

const CATEGORY_NAMES = {
  'brand-systems': 'Brand Identity and Design Systems',
  'email-design': 'Email Design and Lifecycle Marketing',
  'meta-ad-creatives': 'Meta Ad Creative',
  'social-media': 'Social Media Design',
  'video': 'Video Editing and Production',
  'web-design': 'Web Design and Front-End Development',
  'youtube': 'YouTube Video Production'
};

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (['.git', 'node_modules', 'assets', 'images'].includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(fullPath));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(fullPath);
  }
  return files;
}

function normalizeRel(filePath) {
  return path.relative(ROOT, filePath).split(path.sep).join('/');
}

function pageUrl(rel) {
  if (rel === 'index.html') return `${SITE_URL}/`;
  if (rel === '404.html') return `${SITE_URL}/404.html`;
  return `${SITE_URL}/${rel.replace(/index\.html$/, '')}`;
}

function stripTags(text) {
  return text.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&rsquo;/g, '’').replace(/&quot;/g, '"').trim();
}

function escapeAttribute(value) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function escapeText(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function titleFromHtml(html) {
  const match = html.match(/<title>([\s\S]*?)<\/title>/i);
  return match ? stripTags(match[1]).split('|')[0].trim() : 'Portfolio Project';
}

function descriptionFromHtml(html) {
  const match = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']\s*\/?>/i);
  return match ? stripTags(match[1]) : '';
}

function humanizeSlug(slug) {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/Meta Ad Creatives/i, 'Meta Ad Creative')
    .replace(/Web Design/i, 'Web Design')
    .replace(/Youtube/i, 'YouTube');
}

function projectCategory(rel) {
  const slug = rel.split('/')[1] || '';
  const found = Object.keys(CATEGORY_NAMES).find((key) => slug.startsWith(`${key}-`));
  return found ? CATEGORY_NAMES[found] : 'Creative Project';
}

function deriveMeta(rel, html) {
  if (MAIN_META[rel]) return MAIN_META[rel];

  if (/^work\/[^/]+\/index\.html$/.test(rel)) {
    const slug = rel.split('/')[1];
    const name = CATEGORY_NAMES[slug] || humanizeSlug(slug);
    return {
      title: `${name} Portfolio | Rodrigo Cazuza`,
      description: `Explore ${name.toLowerCase()} projects by Rodrigo Cazuza, a New York City multimedia designer and front-end developer.`
    };
  }

  if (/^projects\/[^/]+\/index\.html$/.test(rel)) {
    const existingTitle = titleFromHtml(html);
    const category = projectCategory(rel);
    const existingDescription = descriptionFromHtml(html);
    const fallback = `${existingTitle} is a ${category.toLowerCase()} project by New York City multimedia designer Rodrigo Cazuza.`;
    const description = existingDescription && !/collection\.?$/i.test(existingDescription)
      ? `${existingDescription.replace(/[.\s]+$/, '')}. ${category} project by Rodrigo Cazuza.`
      : fallback;
    return {
      title: `${existingTitle} | ${category}`.slice(0, 65),
      description: description.slice(0, 158)
    };
  }

  if (/^brand-guidelines\/[^/]+\/index\.html$/.test(rel)) {
    const name = humanizeSlug(rel.split('/')[1]);
    return {
      title: `${name} Brand Guidelines | Rodrigo Cazuza`,
      description: `Explore the ${name} brand identity, visual guidelines, typography, color, and design system created by Rodrigo Cazuza.`
    };
  }

  return {
    title: titleFromHtml(html),
    description: descriptionFromHtml(html) || 'Creative portfolio work by New York City multimedia designer and front-end developer Rodrigo Cazuza.'
  };
}

function replaceOrInsert(html, regex, replacement, insertAfterRegex) {
  if (regex.test(html)) return html.replace(regex, replacement);
  return html.replace(insertAfterRegex, (match) => `${match}\n${replacement}`);
}

function cleanDashStyle(html) {
  return html
    .replace(/(\d{4})\s*[—–]\s*Present/g, '$1 to Present')
    .replace(/(\d{4})\s*[—–]\s*(\d{4})/g, '$1 to $2')
    .replace(/How I work\s*[—–]\s*/gi, 'How I work: ')
    .replace(/Rodrigo Cazuza\s*[—–]\s*home/gi, 'Rodrigo Cazuza home')
    .replace(/\s*(?:—|&mdash;|&#8212;|&#x2014;)\s*/gi, ', ')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/,\s*,/g, ',');
}

function updateInternalRootPaths(html) {
  return html
    .replace(/https:\/\/rodrigoccazuza\.github\.io\/portfolio/g, SITE_URL)
    .replace(/((?:href|src|action|poster|content)=["'])\/portfolio\//gi, '$1/');
}

function applyHomepageCopy(html) {
  const replacements = new Map([
    ['Creativity and technology should feel like one idea.', 'Design, marketing, and front-end development in one creative practice.'],
    ['From brand systems to front-end builds, I create visual experiences that connect, communicate, and perform.', 'I create brand systems, email campaigns, paid social assets, websites, and video content that help businesses communicate clearly and grow.'],
    ['I&rsquo;m a multimedia designer, marketing creative, content producer, and front-end developer based in New York City. I connect visual design with practical production—from brand systems and lifecycle campaigns to coded websites and creator-led video.', 'I&rsquo;m a New York City multimedia designer and front-end developer working across branding, email marketing, paid social, web design, and video production. I connect clear visual systems with practical digital execution.'],
    ['My background spans design, technology, customer experience, education, and collaborative problem solving. That range helps me understand both the creative idea and the people who need to use it.', 'My background in design, technology, marketing, education, and customer experience helps me build creative work that is visually strong, easy to use, and aligned with real business goals.'],
    ['I coordinate the complete creative process—from research and strategy through design, production, publishing, and optimization.', 'I manage the creative process from research and strategy to design, development, publishing, and performance optimization.'],
    ['Color, typography, and identity work.', 'Brand identity, typography, color, and visual guidelines.'],
    ['Lifecycle and campaign email design.', 'Email campaigns, lifecycle flows, and conversion-focused design.'],
    ['Paid social ad creative for Meta placements.', 'Static, carousel, and video ads for Meta campaigns.'],
    ['Organic content design for social platforms.', 'Social media graphics, carousels, and campaign content.'],
    ['Short-form video edits and motion content.', 'Short-form video editing, reels, and motion content.'],
    ['Websites designed and/or built end-to-end.', 'Responsive websites designed and built from strategy to launch.'],
    ['Long-form and personal creator video work.', 'Long-form YouTube editing and creator-focused video production.']
  ]);
  for (const [from, to] of replacements) html = html.split(from).join(to);
  return html;
}

function applyWorkCopy(html) {
  return html.replace(
    'A collection of email, paid social, organic content, brand, and web-design work. Every category below has its own dedicated page — this index also includes an optional in-page filter.',
    'Explore selected branding, email marketing, Meta advertising, social media, video production, and web design projects. Use the filters to browse work by creative specialty.'
  );
}

function addHomepageStructuredData(html) {
  if (html.includes('"@type":"Person"') || html.includes('"@type": "Person"')) return html;
  const schema = `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@graph": [\n    {\n      "@type": "WebSite",\n      "@id": "${SITE_URL}/#website",\n      "url": "${SITE_URL}/",\n      "name": "Rodrigo Cazuza Portfolio",\n      "description": "Portfolio of New York City multimedia designer and front-end developer Rodrigo Cazuza"\n    },\n    {\n      "@type": "Person",\n      "@id": "${SITE_URL}/#person",\n      "name": "Rodrigo Cazuza",\n      "url": "${SITE_URL}/",\n      "image": "${SITE_URL}/images/site/about-new.jpg",\n      "jobTitle": "Multimedia Designer and Front-End Developer",\n      "address": {\n        "@type": "PostalAddress",\n        "addressLocality": "New York City",\n        "addressRegion": "NY",\n        "addressCountry": "US"\n      },\n      "sameAs": [\n        "https://github.com/Rodrigoccazuza",\n        "https://www.linkedin.com/in/rodrigocazuza/",\n        "https://www.youtube.com/@Drigoverse"\n      ]\n    }\n  ]\n}\n</script>`;
  return html.replace('</head>', `${schema}\n</head>`);
}

function updateHead(html, rel, meta) {
  const url = pageUrl(rel);
  const robots = meta.noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large';
  const safeTitle = escapeAttribute(meta.title);
  const safeDescription = escapeAttribute(meta.description);

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeText(meta.title)}</title>`);
  html = html.replace(/<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/i, `<meta name="description" content="${safeDescription}">`);
  html = html.replace(/<link\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i, `<link rel="canonical" href="${url}">`);
  html = html.replace(/<meta\s+property=["']og:title["']\s+content=["'][^"']*["']\s*\/?>/i, `<meta property="og:title" content="${safeTitle}">`);
  html = html.replace(/<meta\s+property=["']og:description["']\s+content=["'][^"']*["']\s*\/?>/i, `<meta property="og:description" content="${safeDescription}">`);
  html = html.replace(/<meta\s+property=["']og:url["']\s+content=["'][^"']*["']\s*\/?>/i, `<meta property="og:url" content="${url}">`);

  html = replaceOrInsert(html, /<meta\s+name=["']robots["'][^>]*>/i, `<meta name="robots" content="${robots}">`, /<meta\s+name=["']description["'][^>]*>/i);
  html = replaceOrInsert(html, /<meta\s+name=["']author["'][^>]*>/i, '<meta name="author" content="Rodrigo Cazuza">', /<meta\s+name=["']robots["'][^>]*>/i);
  html = replaceOrInsert(html, /<meta\s+property=["']og:image["'][^>]*>/i, `<meta property="og:image" content="${DEFAULT_IMAGE}">`, /<meta\s+property=["']og:site_name["'][^>]*>/i);
  html = replaceOrInsert(html, /<meta\s+property=["']og:image:alt["'][^>]*>/i, '<meta property="og:image:alt" content="Rodrigo Cazuza multimedia design portfolio">', /<meta\s+property=["']og:image["'][^>]*>/i);
  html = replaceOrInsert(html, /<meta\s+name=["']twitter:title["'][^>]*>/i, `<meta name="twitter:title" content="${safeTitle}">`, /<meta\s+name=["']twitter:card["'][^>]*>/i);
  html = replaceOrInsert(html, /<meta\s+name=["']twitter:description["'][^>]*>/i, `<meta name="twitter:description" content="${safeDescription}">`, /<meta\s+name=["']twitter:title["'][^>]*>/i);
  html = replaceOrInsert(html, /<meta\s+name=["']twitter:image["'][^>]*>/i, `<meta name="twitter:image" content="${DEFAULT_IMAGE}">`, /<meta\s+name=["']twitter:description["'][^>]*>/i);

  return html;
}

function processHtml(filePath) {
  const rel = normalizeRel(filePath);
  let html = fs.readFileSync(filePath, 'utf8');
  const original = html;

  html = updateInternalRootPaths(html);
  if (rel === 'index.html') html = applyHomepageCopy(html);
  if (rel === 'work/index.html') html = applyWorkCopy(html);
  html = cleanDashStyle(html);

  const meta = deriveMeta(rel, html);
  html = updateHead(html, rel, meta);
  if (rel === 'index.html') html = addHomepageStructuredData(html);

  if (html !== original) {
    fs.writeFileSync(filePath, html, 'utf8');
    return true;
  }
  return false;
}

function updateSupportingFiles() {
  const sitemapPath = path.join(ROOT, 'sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    let sitemap = fs.readFileSync(sitemapPath, 'utf8');
    sitemap = sitemap.replace(/https:\/\/rodrigoccazuza\.github\.io\/portfolio/g, SITE_URL);
    sitemap = sitemap
      .split('\n')
      .filter((line) => !/\/(?:contact\/thanks|brand-guidelines\/(?:bodyfactory|taina-photography))\//.test(line))
      .join('\n');
    fs.writeFileSync(sitemapPath, sitemap, 'utf8');
  }

  const robotsPath = path.join(ROOT, 'robots.txt');
  if (fs.existsSync(robotsPath)) {
    let robots = fs.readFileSync(robotsPath, 'utf8');
    robots = robots.replace(/https:\/\/rodrigoccazuza\.github\.io\/portfolio\/sitemap\.xml/g, `${SITE_URL}/sitemap.xml`);
    if (!/Sitemap:/i.test(robots)) robots = `${robots.trim()}\nSitemap: ${SITE_URL}/sitemap.xml\n`;
    fs.writeFileSync(robotsPath, robots, 'utf8');
  }
}

const htmlFiles = walk(ROOT);
let changed = 0;
for (const file of htmlFiles) {
  if (processHtml(file)) changed += 1;
}
updateSupportingFiles();
console.log(`SEO and copy cleanup complete. Updated ${changed} HTML files.`);
