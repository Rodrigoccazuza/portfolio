  // Existing data keeps its organization; imported media fills the same collections.
  function upgrade(value) {
    if (!value || typeof value !== 'object') return;
    if (value.src && replacements[value.src]) value.src = replacements[value.src];
    if (value.src) {
      var match = imported.find(function (item) { return item.src === value.src; });
      if (match) { value.thumbnail = match.thumbnail; value.width = match.width; value.height = match.height; }
    }
    Object.keys(value).forEach(function (key) { if (typeof value[key] === 'object') upgrade(value[key]); });
  }
  function addUnique(items, added) {
    var seen = new Set();
    return items.concat(added).filter(function (item) { if (seen.has(item.src)) return false; seen.add(item.src); return true; });
  }
  function campaignFor(item) {
    var s = item.source.toLowerCase();
    if (/valentine/.test(s)) return 'valentines-day';
    if (/black.friday|cyber/.test(s)) return 'black-friday';
    if (/masseter/.test(s)) return 'masseter-minimizing';
    if (/spring.sale/.test(s)) return 'spring-sale';
    if (/4thofjuly|4th-july/.test(s)) return '4th-of-july';
    if (/botox|wrinkle/.test(s)) return 'wrinkle-treatment';
    return '';
  }
  upgrade(window.portfolioPlaceholderData);
  upgrade(window.portfolioCampaigns);
  var data = window.portfolioPlaceholderData;
  if (data) {
    function get(id) { return data.sections.find(function (section) { return section.id === id; }); }
    [['social', 'social-static', 'image'], ['social', 'social-video', 'video'], ['ads', 'ads-static', 'image'], ['ads', 'ads-video', 'video']].forEach(function (config) {
      var section = get(config[0]);
      var project = section && section.projects.find(function (p) { return p.id === config[1]; });
      if (!project) return;
      var added = imported.filter(function (item) {
        if (item.type !== config[2] || /_Raw_|Raw Footage/.test(item.source)) return false;
        return config[0] === 'ads' ? item.section.indexOf('meta-ad-creatives-') === 0 : item.section === 'social-media-bodyfactory-instagram' || item.section === 'video-instagram-feed';
      });
      project.media.items = addUnique(project.media.items, added);
    });
    var social = get('social');
    var community = imported.filter(function (item) { return item.section === 'social-media-mydatamymoney-instagram' && item.type === 'image'; });
    if (social && community.length) social.projects.push({id:'data-money-static',title:'Your Data Your Money',description:'Social-impact campaign content.',category:'Organic Social',format:'Static',media:{type:'gallery',alt:'Your Data Your Money social campaign',items:addUnique([],community)}});
    var email = get('email');
    if (email) {
      var groups = new Set();
      email.projects.forEach(function (project) { if (!project.url && !project.campaign) project.url = 'projects/email-design-body-factory-e-mail-campaigns-designs/#asset-library'; });
      imported.filter(function (item) { return item.section.indexOf('email-design-') === 0; }).forEach(function (item) {
        if (groups.has(item.group)) return;
        groups.add(item.group);
        if (email.projects.some(function (project) { return project.media.src === item.src; })) return;
        email.projects.push({id:'import-email-'+groups.size,title:item.group.split('/').pop().trim(),description:'Email creative and the complete collection of related campaign assets.',category:'Email Design',role:'Email Design',campaign:campaignFor(item),url:'projects/'+item.section+'/#asset-library',media:item});
      });
    }
    var systems = get('design-systems');
    if (systems) systems.projects.forEach(function (project) {
      var names = {'bodyfactory-system':'bodyfactory','taina-system':'taina-photography','prisma-system':'prisma-providers','data-system':'social-project'};
      if (names[project.id]) project.assetsUrl = 'projects/brand-systems-'+names[project.id]+'/#asset-library';
    });
  }
  (window.portfolioCampaigns || []).forEach(function (campaign) {
    imported.forEach(function (item) {
      if (campaignFor(item) !== campaign.slug || /_Raw_|Raw Footage/.test(item.source)) return;
      var key = item.section.indexOf('email-design-') === 0 ? 'email' : item.section.indexOf('meta-ad-creatives-') === 0 ? (item.type === 'video' ? 'adsVideo' : 'adsStatic') : item.section.indexOf('social-media-') === 0 || item.section === 'video-instagram-feed' ? (item.type === 'video' ? 'socialVideo' : 'socialStatic') : '';
      if (key) campaign.assets[key] = addUnique(campaign.assets[key] || [], [item]);
    });
  });
