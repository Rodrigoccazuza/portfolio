(function () {
  'use strict';

  var data = window.portfolioPlaceholderData;
  var workRoot = document.getElementById('work');
  var showcaseRoot = document.getElementById('behind-designs-gallery');
  var showcaseModal = document.getElementById('showcase-modal');
  if (!data || !workRoot) return;

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

  function renderShowcase() {
    if (!showcaseRoot || !showcaseModal || !data.behindDesigns) return;
    var modalTitle = showcaseModal.querySelector('#showcase-modal-title');
    var modalMedia = showcaseModal.querySelector('.showcase-modal-media');
    var closeButton = showcaseModal.querySelector('.showcase-modal-close');

    function openPreview(item) {
      modalTitle.textContent = item.label;
      modalMedia.textContent = '';
      modalMedia.setAttribute('aria-label', item.alt);
      if (item.src) {
        var fullImage = element('img');
        fullImage.src = item.src;
        fullImage.alt = item.alt;
        modalMedia.appendChild(fullImage);
      } else {
        modalMedia.appendChild(element('span', '', '[FULL PROJECT IMAGE]'));
      }
      showcaseModal.showModal();
    }

    var track = element('div', 'behind-designs-track');
    function createGroup(isDuplicate) {
      var group = element('div', 'behind-designs-group');
      if (isDuplicate) group.setAttribute('aria-hidden', 'true');
      data.behindDesigns.forEach(function (item, index) {
        var button = element('button', 'showcase-tile');
        button.type = 'button';
        button.setAttribute('aria-label', 'Open full preview: ' + item.label);
        button.style.setProperty('--showcase-delay', (index * -1.4) + 's');
        if (isDuplicate) button.tabIndex = -1;
        var media = element('span', 'showcase-tile-media');
        if (item.src) {
          var image = element('img');
          image.src = item.src;
          image.alt = '';
          image.loading = 'lazy';
          media.appendChild(image);
        } else {
          media.appendChild(element('span', 'showcase-tile-label', item.label));
        }
        button.appendChild(media);
        button.addEventListener('click', function () { openPreview(item); });
        group.appendChild(button);
      });
      return group;
    }
    track.appendChild(createGroup(false));
    track.appendChild(createGroup(true));
    showcaseRoot.appendChild(track);

    closeButton.addEventListener('click', function () { showcaseModal.close(); });
    showcaseModal.addEventListener('click', function (event) {
      if (event.target === showcaseModal) showcaseModal.close();
    });
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

  var workFragment = document.createDocumentFragment();
  data.sections.forEach(function (section) {
    workFragment.appendChild(renderSection(section));
  });
  workRoot.appendChild(workFragment);
  renderShowcase();

  var rails = document.querySelectorAll('.portfolio-layout--rail .portfolio-projects');
  rails.forEach(function (rail) {
    rail.tabIndex = 0;
    rail.setAttribute('aria-label', 'Scrollable email project gallery');
  });
}());
