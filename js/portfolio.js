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

  function websiteLayer(project, index) {
    var article = element('article', 'website-layer' + (index === 0 ? ' is-selected' : ''));
    article.dataset.projectId = project.id;
    article.style.setProperty('--layer-index', index);
    var selector = element('button', 'website-layer-selector');
    selector.type = 'button';
    selector.setAttribute('aria-expanded', index === 0 ? 'true' : 'false');
    selector.setAttribute('aria-controls', project.id + '-details');
    selector.setAttribute('aria-label', 'Select ' + project.title);
    var dots = element('span', 'website-window-dots');
    dots.setAttribute('aria-hidden', 'true');
    dots.textContent = '● ● ●';
    selector.appendChild(dots);
    selector.appendChild(element('strong', '', project.title));
    selector.appendChild(element('span', 'website-layer-category', project.category));
    var status = element('span', 'website-layer-status', index === 0 ? 'Selected' : 'Select');
    selector.appendChild(status);
    article.appendChild(selector);

    var panel = element('div', 'website-layer-panel');
    panel.id = project.id + '-details';
    panel.appendChild(element('p', 'website-layer-description', project.description));
    var metadata = meta(project);
    if (metadata) panel.appendChild(metadata);
    panel.appendChild(placeholder(project.media));
    if (project.url) {
      var visit = element('a', 'btn btn-primary website-visit', 'Visit Website ↗');
      visit.href = project.url;
      visit.target = '_blank';
      visit.rel = 'noopener noreferrer';
      panel.appendChild(visit);
    } else {
      var pending = element('span', 'btn btn-primary website-visit is-disabled', 'Visit Website ↗');
      pending.setAttribute('aria-disabled', 'true');
      panel.appendChild(pending);
    }
    article.appendChild(panel);
    return article;
  }

  function websiteTools() {
    var area = element('div', 'website-tools');
    area.appendChild(element('p', 'website-support-label', 'Tools'));
    var grid = element('ul', 'website-tools-grid');
    data.websiteTools.forEach(function (tool) {
      var item = element('li');
      item.setAttribute('aria-label', tool.name);
      item.title = tool.name;
      if (tool.src) {
        var icon = element('img');
        icon.src = tool.src;
        icon.alt = '';
        icon.width = 48;
        icon.height = 48;
        icon.loading = 'lazy';
        item.appendChild(icon);
      } else {
        item.appendChild(element('span', 'website-tool-mark', tool.mark));
      }
      item.appendChild(element('strong', '', tool.name));
      grid.appendChild(item);
    });
    area.appendChild(grid);
    return area;
  }

  function websiteProcess() {
    var area = element('div', 'website-process');
    area.appendChild(element('p', 'website-support-label', 'From concept to build'));
    var list = element('ol', 'website-process-list');
    data.websiteProcess.forEach(function (step, index) {
      var item = element('li');
      item.appendChild(element('span', 'website-process-icon', String(index + 1).padStart(2, '0')));
      item.appendChild(element('strong', '', step));
      list.appendChild(item);
    });
    area.appendChild(list);
    area.appendChild(element('p', 'website-process-copy', 'Each website begins with understanding the idea, audience and objective. I move from research and early sketches into wireframes and interactive prototypes before translating the final experience into a responsive, production-ready implementation.'));
    return area;
  }

  function renderWebsitesSection(section) {
    var node = element('section', 'section websites-showcase');
    node.id = section.id;
    node.setAttribute('aria-labelledby', section.id + '-title');
    var container = element('div', 'container');
    var label = element('h2', 'eyebrow portfolio-category-label', 'Websites');
    label.id = section.id + '-title';
    container.appendChild(label);
    var composition = element('div', 'websites-composition');
    var stack = element('div', 'website-stack');
    section.projects.forEach(function (project, index) { stack.appendChild(websiteLayer(project, index)); });
    var support = element('aside', 'website-support', '');
    support.setAttribute('aria-label', 'Website tools and process');
    support.appendChild(websiteTools());
    support.appendChild(websiteProcess());
    composition.appendChild(stack);
    composition.appendChild(support);
    container.appendChild(composition);
    node.appendChild(container);

    var layers = Array.prototype.slice.call(stack.querySelectorAll('.website-layer'));
    layers.forEach(function (layer) {
      layer.querySelector('.website-layer-selector').addEventListener('click', function () {
        layers.forEach(function (candidate) {
          var selected = candidate === layer;
          candidate.classList.toggle('is-selected', selected);
          candidate.querySelector('.website-layer-selector').setAttribute('aria-expanded', String(selected));
          candidate.querySelector('.website-layer-status').textContent = selected ? 'Selected' : 'Select';
        });
      });
    });
    window.requestAnimationFrame(function () { stack.classList.add('is-ready'); });
    return node;
  }

  function systemCanvas(project, index) {
    var button = element('button', 'system-canvas');
    button.type = 'button';
    button.dataset.projectId = project.id;
    button.dataset.canvasIndex = index;
    button.setAttribute('aria-label', 'Select design system: ' + project.title);
    button.setAttribute('aria-pressed', index === 2 ? 'true' : 'false');
    button.style.setProperty('--canvas-index', index);
    var visual = element('span', 'system-canvas-visual');
    visual.setAttribute('aria-hidden', 'true');
    visual.appendChild(element('i', 'system-canvas-type', 'Aa'));
    var rings = element('i', 'system-canvas-rings');
    visual.appendChild(rings);
    var components = element('i', 'system-canvas-components');
    components.appendChild(element('b', '', 'Button'));
    components.appendChild(element('b', '', 'Secondary'));
    components.appendChild(element('b', '', '•••'));
    visual.appendChild(components);
    button.appendChild(visual);
    var caption = element('span', 'system-canvas-caption');
    caption.appendChild(element('strong', '', project.title));
    caption.appendChild(element('span', '', project.category));
    button.appendChild(caption);
    return button;
  }

  function renderDesignSystemDetails(root, project) {
    root.textContent = '';
    root.appendChild(element('p', 'design-system-accent', '[SYSTEM POSITIONING STATEMENT]'));
    root.appendChild(element('h3', '', project.title));
    if (project.description) root.appendChild(element('p', '', project.description));
    var metadata = meta(project);
    if (metadata) root.appendChild(metadata);
    var elements = element('ul', 'system-elements');
    data.designSystemElements.forEach(function (systemElement, index) {
      var item = element('li');
      item.appendChild(element('span', 'system-element-icon', String(index + 1).padStart(2, '0')));
      var copy = element('span');
      copy.appendChild(element('strong', '', systemElement.title));
      copy.appendChild(element('small', '', systemElement.description));
      item.appendChild(copy);
      elements.appendChild(item);
    });
    root.appendChild(elements);
    if (project.url) {
      var link = element('a', 'btn btn-primary system-cta', 'View System ↗');
      link.href = project.url;
      root.appendChild(link);
    } else {
      var disabled = element('span', 'btn btn-primary system-cta is-disabled', 'View System ↗');
      disabled.setAttribute('aria-disabled', 'true');
      root.appendChild(disabled);
    }
  }

  function renderDesignSystemsSection(section) {
    var node = element('section', 'section design-systems-showcase');
    node.id = section.id;
    node.setAttribute('aria-labelledby', section.id + '-title');
    var container = element('div', 'container');
    var label = element('h2', 'eyebrow portfolio-category-label', 'Design Systems');
    label.id = section.id + '-title';
    container.appendChild(label);
    var composition = element('div', 'design-systems-composition');
    var stage = element('div', 'system-canvas-stage');
    var detailsRoot = element('div', 'design-system-details');
    detailsRoot.setAttribute('aria-live', 'polite');
    section.projects.forEach(function (project, index) { stage.appendChild(systemCanvas(project, index)); });
    composition.appendChild(stage);
    composition.appendChild(detailsRoot);
    container.appendChild(composition);
    node.appendChild(container);

    var activeIndex = Math.min(2, section.projects.length - 1);
    var canvases = Array.prototype.slice.call(stage.querySelectorAll('.system-canvas'));
    function selectSystem(index) {
      activeIndex = index;
      canvases.forEach(function (canvas, canvasIndex) {
        var selected = canvasIndex === activeIndex;
        canvas.classList.toggle('is-selected', selected);
        canvas.setAttribute('aria-pressed', String(selected));
      });
      renderDesignSystemDetails(detailsRoot, section.projects[activeIndex]);
    }
    canvases.forEach(function (canvas, index) { canvas.addEventListener('click', function () { selectSystem(index); }); });
    selectSystem(activeIndex);
    window.requestAnimationFrame(function () { stage.classList.add('is-ready'); });
    return node;
  }

  function emailCard(project, index) {
    var button = element('button', 'email-deck-card');
    button.type = 'button';
    button.dataset.cardIndex = index;
    button.setAttribute('aria-label', 'Select email campaign: ' + project.title);
    var frame = element('span', 'email-card-frame');
    if (project.media.src) {
      var image = element('img');
      image.src = project.media.src;
      image.alt = '';
      image.loading = 'lazy';
      frame.appendChild(image);
    } else {
      frame.appendChild(element('span', 'email-card-brand', '[EMAIL HEADER]'));
      frame.appendChild(element('strong', 'email-card-headline', project.title));
      frame.appendChild(element('span', 'email-card-copy', '[EMAIL CREATIVE PREVIEW]'));
      frame.appendChild(element('span', 'email-card-button', '[CTA]'));
      frame.appendChild(element('i', 'email-card-art'));
    }
    button.appendChild(frame);
    return button;
  }

  function renderEmailDetails(root, project) {
    root.textContent = '';
    var copy = element('div');
    copy.appendChild(element('h3', '', project.title));
    if (project.description) copy.appendChild(element('p', '', project.description));
    var metadata = meta(project);
    if (metadata) copy.appendChild(metadata);
    root.appendChild(copy);
    if (project.url) {
      var link = element('a', 'btn btn-primary', 'View Campaign ↗');
      link.href = project.url;
      root.appendChild(link);
    } else {
      var disabled = element('span', 'btn btn-primary is-disabled', 'View Campaign ↗');
      disabled.setAttribute('aria-disabled', 'true');
      root.appendChild(disabled);
    }
  }

  function renderEmailSection(section) {
    var node = element('section', 'section email-showcase');
    node.id = section.id;
    node.setAttribute('aria-labelledby', section.id + '-title');
    var container = element('div', 'container');
    var label = element('h2', 'eyebrow portfolio-category-label', 'Email Campaigns');
    label.id = section.id + '-title';
    container.appendChild(label);
    var intro = element('div', 'email-showcase-intro');
    intro.appendChild(element('h3', '', section.title));
    intro.appendChild(element('p', '', section.description));
    container.appendChild(intro);
    var deckShell = element('div', 'email-deck-shell');
    var previous = element('button', 'email-deck-control email-deck-previous', '←');
    previous.type = 'button';
    previous.setAttribute('aria-label', 'Previous email campaign');
    var next = element('button', 'email-deck-control email-deck-next', '→');
    next.type = 'button';
    next.setAttribute('aria-label', 'Next email campaign');
    var deck = element('div', 'email-deck');
    deck.tabIndex = 0;
    deck.setAttribute('aria-label', 'Email campaign deck. Use left and right arrow keys to navigate.');
    section.projects.forEach(function (project, index) { deck.appendChild(emailCard(project, index)); });
    deckShell.appendChild(previous);
    deckShell.appendChild(deck);
    deckShell.appendChild(next);
    container.appendChild(deckShell);
    var detailsRoot = element('div', 'email-selected-details');
    detailsRoot.setAttribute('aria-live', 'polite');
    container.appendChild(detailsRoot);
    var disciplines = element('ul', 'email-disciplines');
    data.emailDisciplines.forEach(function (discipline) { disciplines.appendChild(element('li', '', discipline)); });
    container.appendChild(disciplines);
    node.appendChild(container);

    var cards = Array.prototype.slice.call(deck.querySelectorAll('.email-deck-card'));
    var activeIndex = Math.floor(cards.length / 2);
    function selectEmail(index) {
      activeIndex = (index + cards.length) % cards.length;
      cards.forEach(function (card, cardIndex) {
        var offset = cardIndex - activeIndex;
        if (offset > cards.length / 2) offset -= cards.length;
        if (offset < cards.length / -2) offset += cards.length;
        card.style.setProperty('--email-offset', offset);
        card.style.setProperty('--email-x', (offset * 13) + 'rem');
        card.style.zIndex = String(10 - Math.abs(offset));
        card.dataset.distance = Math.abs(offset);
        card.classList.toggle('is-selected', cardIndex === activeIndex);
        card.setAttribute('aria-pressed', String(cardIndex === activeIndex));
      });
      renderEmailDetails(detailsRoot, section.projects[activeIndex]);
    }
    cards.forEach(function (card, index) { card.addEventListener('click', function () { selectEmail(index); }); });
    previous.addEventListener('click', function () { selectEmail(activeIndex - 1); });
    next.addEventListener('click', function () { selectEmail(activeIndex + 1); });
    deck.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') { event.preventDefault(); selectEmail(activeIndex - 1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); selectEmail(activeIndex + 1); }
    });
    selectEmail(activeIndex);
    window.requestAnimationFrame(function () { deck.classList.add('is-ready'); });
    return node;
  }

  function mediaRailTile(project, itemIndex) {
    var article = element('article', 'media-rail-card');
    article.setAttribute('aria-label', project.format + ' creative ' + (itemIndex + 1));
    var media = placeholder({
      src: '',
      alt: project.media.alt + ' ' + (itemIndex + 1),
      label: project.media.label + ' ' + String(itemIndex + 1).padStart(2, '0'),
      ratio: 'portrait'
    });
    article.appendChild(media);
    if (project.format === 'Video') {
      var play = element('span', 'media-rail-play', '▶ [DURATION]');
      play.setAttribute('aria-hidden', 'true');
      media.appendChild(play);
    }
    return article;
  }

  function renderMediaRailSection(section) {
    var node = element('section', 'section media-rails-showcase media-rails--' + section.id);
    node.id = section.id;
    node.setAttribute('aria-labelledby', section.id + '-title');
    var container = element('div', 'container');
    var label = element('h2', 'eyebrow portfolio-category-label', section.label);
    label.id = section.id + '-title';
    container.appendChild(label);
    var rows = element('div', 'media-rows');
    section.projects.forEach(function (project, rowIndex) {
      var row = element('div', 'media-row');
      var previous = element('button', 'media-row-control media-row-previous', '←');
      previous.type = 'button';
      previous.setAttribute('aria-label', 'Previous ' + project.format.toLowerCase() + ' creatives');
      var viewport = element('div', 'media-row-viewport');
      viewport.tabIndex = 0;
      viewport.setAttribute('aria-label', project.format + ' creative gallery');
      var track = element('div', 'media-row-track');
      for (var index = 0; index < project.media.count; index += 1) track.appendChild(mediaRailTile(project, index));
      viewport.appendChild(track);
      var next = element('button', 'media-row-control media-row-next', '→');
      next.type = 'button';
      next.setAttribute('aria-label', 'Next ' + project.format.toLowerCase() + ' creatives');
      var format = element('p', 'media-row-format', project.format);
      function move(direction) {
        var maximum = viewport.scrollWidth - viewport.clientWidth;
        if (direction > 0 && viewport.scrollLeft >= maximum - 4) viewport.scrollTo({ left: 0, behavior: 'smooth' });
        else if (direction < 0 && viewport.scrollLeft <= 4) viewport.scrollTo({ left: maximum, behavior: 'smooth' });
        else viewport.scrollBy({ left: direction * viewport.clientWidth * .72, behavior: 'smooth' });
      }
      previous.addEventListener('click', function () { move(-1); });
      next.addEventListener('click', function () { move(1); });
      viewport.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
        if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
      });
      row.appendChild(previous);
      row.appendChild(viewport);
      row.appendChild(next);
      row.appendChild(format);
      rows.appendChild(row);
      if (rowIndex < section.projects.length - 1) rows.appendChild(element('hr', 'media-row-divider'));
    });
    container.appendChild(rows);
    node.appendChild(container);
    return node;
  }

  function renderMultimediaSection(section) {
    var node = element('section', 'section multimedia-showcase');
    node.id = section.id;
    node.setAttribute('aria-labelledby', section.id + '-title');
    var container = element('div', 'container');
    var label = element('h2', 'eyebrow portfolio-category-label', 'Other');
    label.id = section.id + '-title';
    container.appendChild(label);
    var mosaic = element('div', 'multimedia-mosaic');
    section.projects.forEach(function (project) {
      var article = element('article', 'multimedia-tile');
      article.appendChild(placeholder(project.media));
      var overlay = element('div', 'multimedia-tile-copy');
      overlay.appendChild(element('h3', '', project.title));
      if (project.description) overlay.appendChild(element('p', '', project.description));
      article.appendChild(overlay);
      mosaic.appendChild(article);
    });
    container.appendChild(mosaic);
    node.appendChild(container);
    return node;
  }

  function renderYouTubePlayer(root, project) {
    root.textContent = '';
    var screen = element('div', 'youtube-player-screen');
    screen.appendChild(placeholder({ src: project.media.src, alt: project.media.alt, label: project.media.label, ratio: 'video' }));
    var copy = element('div', 'youtube-player-copy');
    copy.appendChild(element('h3', '', project.title));
    if (project.description) copy.appendChild(element('p', '', project.description));
    screen.appendChild(copy);
    var play = element('button', 'youtube-play-button', '▶');
    play.type = 'button';
    play.setAttribute('aria-label', 'Play placeholder video: ' + project.title);
    screen.appendChild(play);
    var controls = element('div', 'youtube-player-controls');
    controls.setAttribute('aria-hidden', 'true');
    controls.appendChild(element('span', '', '▶  |◀  🔊'));
    controls.appendChild(element('i'));
    controls.appendChild(element('span', '', '[TIME] / [DURATION]  ⚙  ⛶'));
    screen.appendChild(controls);
    root.appendChild(screen);
  }

  function renderYouTubeSection(section) {
    var node = element('section', 'section youtube-showcase');
    node.id = section.id;
    node.setAttribute('aria-labelledby', section.id + '-title');
    var container = element('div', 'container');
    var label = element('h2', 'eyebrow portfolio-category-label', 'YouTube');
    label.id = section.id + '-title';
    container.appendChild(label);
    var layout = element('div', 'youtube-layout');
    var player = element('div', 'youtube-player');
    player.setAttribute('aria-live', 'polite');
    var sidebar = element('aside', 'youtube-playlist');
    sidebar.setAttribute('aria-label', 'Video playlist');
    var list = element('div', 'youtube-playlist-list');
    section.projects.forEach(function (project, index) {
      var button = element('button', 'youtube-playlist-item');
      button.type = 'button';
      button.setAttribute('aria-label', 'Select video: ' + project.title);
      button.dataset.videoIndex = index;
      var thumb = element('span', 'youtube-playlist-thumb', '[THUMBNAIL]');
      button.appendChild(thumb);
      var copy = element('span');
      copy.appendChild(element('strong', '', project.title));
      copy.appendChild(element('small', '', '[DURATION]'));
      button.appendChild(copy);
      list.appendChild(button);
    });
    sidebar.appendChild(list);
    var filters = element('div', 'youtube-filters');
    ['All', 'Branding', 'Design', 'Strategy', 'Process'].forEach(function (filter, index) {
      var button = element('button', index === 0 ? 'is-active' : '', filter);
      button.type = 'button';
      button.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
      button.addEventListener('click', function () {
        Array.prototype.forEach.call(filters.querySelectorAll('button'), function (candidate) {
          var active = candidate === button;
          candidate.classList.toggle('is-active', active);
          candidate.setAttribute('aria-pressed', String(active));
        });
      });
      filters.appendChild(button);
    });
    sidebar.appendChild(filters);
    layout.appendChild(player);
    layout.appendChild(sidebar);
    container.appendChild(layout);
    node.appendChild(container);
    var playlistItems = Array.prototype.slice.call(list.querySelectorAll('.youtube-playlist-item'));
    function selectVideo(index) {
      playlistItems.forEach(function (item, itemIndex) { item.classList.toggle('is-selected', itemIndex === index); });
      renderYouTubePlayer(player, section.projects[index]);
    }
    playlistItems.forEach(function (item, index) { item.addEventListener('click', function () { selectVideo(index); }); });
    selectVideo(0);
    return node;
  }

  function renderCampaignsSection(section) {
    var node = element('section', 'section compact-campaigns');
    node.id = section.id;
    node.setAttribute('aria-labelledby', section.id + '-title');
    var container = element('div', 'container');
    var heading = element('h2', '', 'Campaigns');
    heading.id = section.id + '-title';
    container.appendChild(heading);
    var grid = element('div', 'compact-campaigns-grid');
    section.projects.forEach(function (project) {
      var article = element('article', 'compact-campaign-card');
      article.appendChild(element('h3', '', project.title));
      article.appendChild(element('span', '', '↗'));
      grid.appendChild(article);
    });
    container.appendChild(grid);
    node.appendChild(container);
    return node;
  }

  function renderSection(section) {
    if (section.layout === 'websites') return renderWebsitesSection(section);
    if (section.layout === 'systems') return renderDesignSystemsSection(section);
    if (section.layout === 'rail') return renderEmailSection(section);
    if (section.id === 'social' || section.id === 'ads') return renderMediaRailSection(section);
    if (section.layout === 'asymmetric') return renderMultimediaSection(section);
    if (section.layout === 'video') return renderYouTubeSection(section);
    if (section.layout === 'campaigns') return renderCampaignsSection(section);
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

}());
