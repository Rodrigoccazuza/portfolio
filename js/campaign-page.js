(function () {
  'use strict';
  var headerRoot = document.getElementById('campaign-header');
  var mainRoot = document.getElementById('main-content');
  var footerRoot = document.getElementById('campaign-footer');
  var slug = document.body.dataset.campaign;
  var campaign = (window.portfolioCampaigns || []).find(function (item) { return item.slug === slug; });
  if (!campaign) { mainRoot.innerHTML = '<section class="campaign-hero"><div class="container"><h1>Campaign not found.</h1><a class="btn btn-primary" href="">Return home</a></div></section>'; return; }

  headerRoot.innerHTML = '<div class="container nav-bar"><a class="nav-logo" href="" aria-label="Rodrigo Cazuza home"><img src="images/site/rodrigo-cazuza-wordmark.png" alt="" width="180" height="180"></a><button class="nav-toggle" aria-expanded="false" aria-controls="primary-nav" aria-label="Open menu"><span class="bar"></span><span class="bar"></span><span class="bar"></span></button><nav id="primary-nav" class="nav-links" aria-label="Primary"><ul><li><a href="work/">Work</a></li><li><a href="experience/">Experience</a></li><li><a href="contact/">Contact</a></li></ul><a class="btn btn-primary nav-resume-btn" href="contact/">Get in touch <i class="bi bi-arrow-right" aria-hidden="true"></i></a></nav></div><div class="nav-scrim"></div>';
  mainRoot.innerHTML = '<section class="campaign-hero"><div class="container"><a class="campaign-back" href="#campaigns"><i class="bi bi-arrow-left" aria-hidden="true"></i> Campaign archive</a><p class="eyebrow">' + campaign.category + '</p><div class="campaign-hero-copy"><h1>' + campaign.title + '</h1><p>' + campaign.description + '</p></div></div></section><div id="campaign-assets"></div>';
  footerRoot.innerHTML = '<footer class="site-footer"><div class="container footer-cta-wrap"><div class="footer-cta"><div class="footer-cta-copy"><p class="eyebrow">Have a project in mind?</p><h2>Ready to bring<br>your vision to <span class="accent-italic">life?</span></h2><p>Let&rsquo;s turn your next campaign, brand system, video, or website into something clear, useful, and memorable.</p><a class="btn btn-primary" href="contact/">Start a project <i class="bi bi-arrow-right" aria-hidden="true"></i></a></div><img class="footer-portrait" src="images/site/footer-portrait.png" alt="Rodrigo Cazuza wearing sunglasses and a purple shirt" width="1536" height="1024" loading="lazy"></div></div><div class="container footer-panel"><div class="footer-panel-intro"><p class="footer-identity">Rodrigo<br>Cazuza.</p><p>Multimedia design and front-end development shaped around strategy, story, and real-world production.</p></div><div class="footer-columns"><div><h3>Services</h3><ul class="footer-links"><li><a href="work/brand-systems/">Brand systems</a></li><li><a href="work/email-design/">Email design</a></li><li><a href="work/meta-ad-creatives/">Meta ad creative</a></li><li><a href="work/video/">Video production</a></li><li><a href="work/web-design/">Web design</a></li></ul></div><nav aria-label="Footer"><h3>Explore</h3><ul class="footer-links"><li><a href="work/">Work</a></li><li><a href="experience/">Experience</a></li><li><a href="resume/">Résumé</a></li><li><a href="contact/">Contact</a></li></ul></nav><div><h3>Let&rsquo;s connect</h3><a class="footer-email" href="mailto:visualdesigner@rodrigocazuza.com">visualdesigner@rodrigocazuza.com</a><ul class="social-row"><li><a href="https://github.com/Rodrigoccazuza" target="_blank" rel="noopener noreferrer">GitHub</a></li><li><a href="https://www.linkedin.com/in/rodrigocazuza/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li><li><a href="https://www.youtube.com/@Drigoverse" target="_blank" rel="noopener noreferrer">YouTube</a></li></ul></div><div><h3>Location</h3><p>New York City</p><p>Available for freelance and collaborative projects.</p></div></div></div><div class="container footer-bottom"><p>&copy; 2026 Rodrigo Cazuza. All rights reserved.</p><a href="#main-content">Back to top <i class="bi bi-arrow-up" aria-hidden="true"></i></a></div></footer>';

  var labels = { email: 'Email Campaigns', socialStatic: 'Social Media', socialVideo: 'Social Video', adsStatic: 'Ads', adsVideo: 'Video Ads', other: 'Other Related Assets' };
  var assetsRoot = document.getElementById('campaign-assets');
  Object.keys(labels).forEach(function (key) {
    var assets = campaign.assets[key] || [];
    if (!assets.length) return;
    var section = document.createElement('section');
    section.className = 'campaign-asset-section';
    var container = document.createElement('div');
    container.className = 'container';
    container.innerHTML = '<header class="campaign-asset-heading"><h2>' + labels[key] + '</h2><span>' + assets.length + ' selected pieces</span></header>';
    var grid = document.createElement('div');
    grid.className = 'campaign-asset-grid';
    assets.forEach(function (asset, index) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'campaign-asset';
      button.setAttribute('aria-label', 'Open ' + asset.title);
      var media = document.createElement('span');
      media.className = 'campaign-asset-media';
      var image = document.createElement('img');
      image.src = asset.src;
      image.alt = asset.alt;
      image.loading = 'lazy';
      media.appendChild(image);
      button.appendChild(media);
      var name = document.createElement('strong');
      name.textContent = asset.title;
      button.appendChild(name);
      button.addEventListener('click', function () { if (window.PortfolioMediaViewer) window.PortfolioMediaViewer.open(assets, index, button); });
      grid.appendChild(button);
    });
    container.appendChild(grid);
    section.appendChild(container);
    assetsRoot.appendChild(section);
  });

  var dialog = document.createElement('dialog');
  dialog.className = 'media-viewer';
  dialog.id = 'media-viewer';
  dialog.setAttribute('aria-labelledby', 'media-viewer-title');
  dialog.innerHTML = '<div class="media-viewer-panel"><header class="media-viewer-header"><div><p class="eyebrow">Media preview</p><h2 id="media-viewer-title">Selected work</h2><p id="media-viewer-count" class="media-viewer-count"></p></div><div class="media-viewer-tools"><button type="button" data-viewer-action="zoom-out" aria-label="Zoom out"><i class="bi bi-zoom-out"></i></button><button type="button" data-viewer-action="zoom-in" aria-label="Zoom in"><i class="bi bi-zoom-in"></i></button><button type="button" data-viewer-action="reset" aria-label="Reset zoom"><i class="bi bi-arrow-counterclockwise"></i></button><button type="button" data-viewer-action="fullscreen" aria-label="Enter fullscreen"><i class="bi bi-arrows-fullscreen"></i></button><button type="button" data-viewer-action="close" aria-label="Close viewer"><i class="bi bi-x-lg"></i></button></div></header><div class="media-viewer-body"><button type="button" class="media-viewer-nav" data-viewer-action="previous" aria-label="Previous media"><i class="bi bi-arrow-left"></i></button><div class="media-viewer-viewport"><div class="media-viewer-stage"></div></div><button type="button" class="media-viewer-nav" data-viewer-action="next" aria-label="Next media"><i class="bi bi-arrow-right"></i></button></div></div>';
  document.body.appendChild(dialog);
  document.title = campaign.title + ' Campaign | Rodrigo Cazuza';
}());
