(function () {
  'use strict';

  var data = window.portfolioPlaceholderData;
  var indexRoot = document.getElementById('category-index');
  var workRoot = document.getElementById('work');
  if (!data || !indexRoot || !workRoot) return;

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function placeholder(media) {
    var wrap = element('div', 'project-media project-media--' + (media.ratio || 'landscape'));
    if (media.src) {
      var image = element('img');
      image.src = media.src;
      image.alt = media.alt || '';
      image.loading = 'lazy';
      wrap.appendChild(image);
      return wrap;
    }
    wrap.setAttribute('role', 'img');
    wrap.setAttribute('aria-label', media.alt || media.label || 'Project media placeholder');
    wrap.appendChild(element('span', 'project-media-label', media.label || '[PROJECT MEDIA]'));
    var marker = element('i', 'project-media-marker');
    marker.setAttribute('aria-hidden', 'true');
    wrap.appendChild(marker);
    return wrap;
  }

  function gallery(media) {
    var grid = element('div', 'placeholder-gallery');
    var count = media.count || 4;
    for (var i = 0; i < count; i += 1) {
      var item = placeholder(media);
      item.setAttribute('aria-label', (media.alt || media.label) + ' ' + (i + 1));
      grid.appendChild(item);
    }
    return grid;
  }

  function tags(project) {
    var values = (project.services || []).concat(project.technologies || []);
    if (!values.length) return null;
    var list = element('ul', 'project-tags');
    values.forEach(function (value) { list.appendChild(element('li', '', value)); });
    return list;
  }

  function meta(project) {
    var values = [project.category, project.role, project.year].filter(Boolean);
    if (!values.length) return null;
    var list = element('ul', 'project-meta');
    values.forEach(function (value) { list.appendChild(element('li', '', value)); });
    return list;
  }

  function details(project) {
    var body = element('div', 'project-card-body');
    var heading = element('h3', '', project.title);
    if (project.url) {
      var link = element('a', '', project.title);
      link.href = project.url;
      heading.textContent = '';
      heading.appendChild(link);
    }
    body.appendChild(heading);
    if (project.description) body.appendChild(element('p', '', project.description));
    var metadata = meta(project);
    var tagList = tags(project);
    if (metadata) body.appendChild(metadata);
    if (tagList) body.appendChild(tagList);
    if (project.url) {
      var cta = element('a', 'project-link', 'View project ↗');
      cta.href = project.url;
      body.appendChild(cta);
    }
    return body;
  }

  function card(project, layout) {
    var article = element('article', 'portfolio-card' + (project.featured ? ' portfolio-card--featured' : ''));
    article.dataset.projectId = project.id;
    if (project.media) article.appendChild(project.media.type === 'gallery' ? gallery(project.media) : placeholder(project.media));
    article.appendChild(details(project));
    if (layout === 'video' && project.media && project.media.type === 'video') {
      var play = element('span', 'video-play', 'Play');
      play.setAttribute('aria-hidden', 'true');
      article.querySelector('.project-media').appendChild(play);
    }
    return article;
  }

  function campaign(project) {
    var article = element('article', 'campaign-card');
    article.appendChild(element('span', 'campaign-marker', '●'));
    article.appendChild(element('h3', '', project.title));
    article.appendChild(element('p', '', [project.category, project.year].filter(Boolean).join(' · ')));
    return article;
  }

  function sectionHeader(section) {
    var header = element('header', 'portfolio-section-header');
    var number = element('div', 'portfolio-section-number', section.index);
    var copy = element('div', 'portfolio-section-copy');
    copy.appendChild(element('p', 'eyebrow', section.label));
    copy.appendChild(element('h2', '', section.title));
    copy.appendChild(element('p', '', section.description));
    header.appendChild(number);
    header.appendChild(copy);
    return header;
  }

  function renderSection(section) {
    var node = element('section', 'section portfolio-work-section portfolio-layout--' + section.layout);
    node.id = section.id;
    node.setAttribute('aria-labelledby', section.id + '-title');
    var container = element('div', 'container');
    var header = sectionHeader(section);
    header.querySelector('h2').id = section.id + '-title';
    container.appendChild(header);
    var grid = element('div', 'portfolio-projects');
    section.projects.forEach(function (project) {
      grid.appendChild(section.layout === 'campaigns' ? campaign(project) : card(project, section.layout));
    });
    container.appendChild(grid);
    node.appendChild(container);
    return node;
  }

  var indexFragment = document.createDocumentFragment();
  var workFragment = document.createDocumentFragment();
  data.sections.forEach(function (section) {
    var item = element('li');
    var link = element('a');
    link.href = '#' + section.id;
    link.appendChild(element('span', '', section.index));
    link.appendChild(document.createTextNode(section.label));
    item.appendChild(link);
    indexFragment.appendChild(item);
    workFragment.appendChild(renderSection(section));
  });
  indexRoot.appendChild(indexFragment);
  workRoot.appendChild(workFragment);

  var rails = document.querySelectorAll('.portfolio-layout--rail .portfolio-projects');
  rails.forEach(function (rail) {
    rail.tabIndex = 0;
    rail.setAttribute('aria-label', 'Scrollable email project gallery');
  });
}());
