/* Production content from main and the supplied media archive. */
(function () {
  var imageItems = function (folder, names) { return names.map(function (name) { return { src: 'assets/content/' + folder + '/' + name + '.png', alt: name.replace(/-/g, ' ') }; }); };
  var socialNames = ['skin-types-01','skin-types-02','boy-tox-01','boy-tox-02','coolsculpting-01','coolsculpting-02','hydrafacial-01','hydrafacial-02','masseter-01','masseter-02','microneedling-01','microneedling-02','treatment-covers-01','treatment-covers-02'];
  var adNames = ['campaign-01','campaign-02','campaign-03','campaign-04','valentines-01','valentines-02','valentines-03','valentines-04','wrinkle-before-after-01','wrinkle-before-after-02','wrinkle-before-after-03','wrinkle-before-after-04'];
  var email = function (id, title, file, category, description) { return { id: id, title: title, description: description, category: category, role: 'Email Design', media: { type: 'image', src: 'assets/content/email/' + file + '.png', alt: title + ' email design' } }; };
  window.portfolioPlaceholderData = {
    websiteTools: [
      { name: 'WordPress', src: 'images/tools/wordpress.png' }, { name: 'Elementor', src: 'images/tools/elementor.png' }, { name: 'Webflow', src: 'images/tools/webflow.png' },
      { name: 'Framer', mark: 'F' }, { name: 'Claude', mark: '✣' }, { name: 'VS Code', src: 'images/tools/vscode.png' },
      { name: 'HTML5', src: 'images/tools/html5.png' }, { name: 'CSS3', src: 'images/tools/css3.png' }, { name: 'JavaScript', src: 'images/tools/javascript.png' }
    ],
    websiteProcess: ['Concept', 'Research', 'Sketch', 'Wireframes', 'Prototype', 'Implementation'],
    designSystemElements: [
      { title: 'Design Tokens', description: 'Colors, type, spacing, radius, and motion.' }, { title: 'Brand Guidelines', description: 'Clear rules for voice, visuals, and usage.' },
      { title: 'Component Library', description: 'Reusable, accessible, production-ready patterns.' }, { title: 'Documentation', description: 'Guidance built for teams and long-term scale.' }
    ],
    emailDisciplines: ['Strategy', 'Copy Direction', 'Layout', 'Responsive Email', 'Development', 'Testing'],
    behindDesigns: [
      { id: 'showcase-one', label: 'Skin Types', alt: 'Skin types social media artwork', src: 'assets/content/social/skin-types-01.png' },
      { id: 'showcase-two', label: 'Valentine’s Day', alt: 'Valentine’s Day campaign artwork', src: 'assets/content/ads/valentines-01.png' },
      { id: 'showcase-three', label: 'Hydrafacial', alt: 'Hydrafacial social media artwork', src: 'assets/content/social/hydrafacial-01.png' },
      { id: 'showcase-four', label: 'Spring Sale', alt: 'Spring sale email campaign', src: 'assets/content/email/spring-sale.png' },
      { id: 'showcase-five', label: 'Microneedling', alt: 'Microneedling social media artwork', src: 'assets/content/social/microneedling-01.png' },
      { id: 'showcase-six', label: 'Wrinkle Treatment', alt: 'Wrinkle treatment ad artwork', src: 'assets/content/ads/wrinkle-before-after-01.png' },
      { id: 'showcase-seven', label: 'Mother’s Day', alt: 'Mother’s Day artwork', src: 'assets/content/other/mothers-day.png' }
    ],
    sections: [
      { id: 'websites', index: '01', label: 'Websites', layout: 'websites', title: 'Web experiences built with intent', description: 'Selected websites combining brand thinking, clear UX, and front-end implementation.', projects: [
        { id: 'prisma', title: 'Prisma Providers', description: 'A multilingual website supporting a clear path through a complex life process.', category: 'Multilingual Brand Site', role: 'Design & Development', media: { type: 'image', src: 'images/site/hero.jpg', alt: 'Prisma Providers website preview' }, url: 'https://prismaproviders.com/' },
        { id: 'cuia', title: 'Cuia Restaurant', description: 'A contemporary restaurant website shaped around atmosphere, menu, and discovery.', category: 'Hospitality Website', role: 'Design & Development', media: { type: 'image', src: 'assets/content/other/valentines-header.png', alt: 'Cuia Restaurant website preview' }, url: 'https://rodrigoccazuza.github.io/Cuiarestaurant/' },
        { id: 'data-money', title: 'Your Data Your Money', description: 'A digital experience about ownership, privacy, and the value of personal data.', category: 'Campaign Website', role: 'Design & Framer Build', media: { type: 'image', src: 'images/generated-thumbs/WEB DESIGN/SOCIAL PROJECT/screencapture-yourdatayourmoney-framer-website-2025-07-17-00_00_53.jpg', alt: 'Your Data Your Money website preview' }, url: 'https://yourdatayourmoney.framer.website/' },
        { id: 'taina', title: 'Tainá Borges Photography', description: 'A warm editorial portfolio for a New York photographer.', category: 'Creative Portfolio', role: 'Design & Development', media: { type: 'image', src: 'images/generated-thumbs/WEB DESIGN/TAINA WEBSITE/taina-borges-website/project/assets/IMG_0122.jpg', alt: 'Tainá Borges Photography website preview' }, url: 'https://rodrigoccazuza.github.io/taina-borges-website/' },
        { id: 'bmi', title: 'BMI Calculator', description: 'A focused browser tool for quick body-mass-index calculations.', category: 'Interactive Web Tool', role: 'Front-End Development', media: { type: 'image', src: 'assets/content/social/coolsculpting-01.png', alt: 'BMI Calculator preview' }, url: 'https://rodrigoccazuza.github.io/calculadoraIMC/' }
      ] },
      { id: 'design-systems', index: '02', label: 'Design Systems', layout: 'systems', title: 'Scalable visual systems', description: 'Brand foundations and reusable components built to stay consistent across every touchpoint.', projects: [
        { id: 'bodyfactory-system', title: 'BodyFactory', statement: 'A premium wellness system designed for clarity and consistency.', description: 'Brand guidelines and visual-system source material for a multi-service wellness brand.', category: 'Brand Foundations', role: 'Visual System', url: 'projects/brand-systems-bodyfactory/' },
        { id: 'prisma-system', title: 'Prisma Providers', statement: 'A clear, multilingual path through a complex life process.', description: 'A multilingual system that makes complex information feel human and navigable.', category: 'Multilingual System', role: 'Brand & Digital', url: 'projects/brand-systems-prisma-providers/' },
        { id: 'data-system', title: 'Your Data Your Money', statement: 'Own it. Earn it. Your data has value.', description: 'A bold campaign identity translated into a flexible digital visual language.', category: 'Campaign System', role: 'Brand & Web', url: 'projects/brand-systems-social-project/' },
        { id: 'taina-system', title: 'Tainá Photography', statement: 'Warm, natural photography with an editorial New York point of view.', description: 'A restrained portfolio system that lets image-making remain the focus.', category: 'Portfolio System', role: 'Brand & Web', url: 'projects/brand-systems-taina-photography/' }
      ] },
      { id: 'email', index: '03', label: 'Email', layout: 'rail', title: 'E-mail campaigns', description: 'Lifecycle and seasonal email creative designed as connected campaign systems.', projects: [
        email('email-july', 'Fourth of July', 'fourth-of-july', 'Seasonal Campaign', 'A multi-send promotion from early access through last chance.'),
        email('email-welcome', 'Welcome Flow', 'welcome-flow', 'Lifecycle Flow', 'A connected welcome sequence introducing the brand and its services.'),
        email('email-winter', 'Winter Campaign', 'winter-campaign', 'Seasonal Campaign', 'Coordinated seasonal campaign creative.'),
        email('email-masseter', 'Masseter Minimizing', 'masseter-minimizing', 'Treatment Campaign', 'Treatment-focused creative with a clear educational hierarchy.'),
        email('email-valentine', 'Valentine’s Day', 'valentines-day', 'Seasonal Campaign', 'A two-part Valentine’s Day offer campaign.'),
        email('email-spring', 'Spring Sale', 'spring-sale', 'Seasonal Campaign', 'A coordinated spring promotional series.'),
        email('email-black-friday', 'Black Friday', 'black-friday', 'Retail Campaign', 'Early-access and event-day creative.'),
        email('email-coolsculpting', 'CoolSculpting', 'coolsculpting', 'Treatment Campaign', 'Service-focused education and conversion creative.'),
        email('email-cyber', 'Cyber Monday', 'cyber-monday', 'Retail Campaign', 'Anticipation and promotional messaging for Cyber Monday.'),
        email('email-wrinkle', 'Flat-Fee Wrinkle Treatment', 'wrinkle-treatment', 'Treatment Campaign', 'A direct treatment-focused value proposition.')
      ] },
      { id: 'social', index: '04', label: 'Social Media', layout: 'rows', title: 'Social media systems', description: 'Static and motion-led content organized as repeatable campaign families.', projects: [
        { id: 'social-static', title: 'BodyFactory Feed Content', description: 'Educational, promotional, and treatment-focused feed content.', category: 'Organic Social', format: 'Static', media: { type: 'gallery', alt: 'BodyFactory social creative', items: imageItems('social', socialNames) } },
        { id: 'social-video', title: 'Social Video Content', description: 'Short-form edits for Instagram feeds and creator-led social storytelling.', category: 'Organic Social', format: 'Video', media: { type: 'gallery', alt: 'Social video', items: [
          { src: 'assets/portfolio-media-web/SOCIAL MEDIA/MYDATAMYMONEY - INSTAGRAM/better audio final version.m4v', alt: 'Your Data Your Money social video' }, { src: 'assets/portfolio-media-web/SOCIAL MEDIA/MYDATAMYMONEY - INSTAGRAM/videotwofinal.m4v', alt: 'Your Data Your Money video edit' },
          { src: 'assets/portfolio-media-web/VIDEO EDITING/INSTAGRAM FEED/2 FORMATOS.m4v', alt: 'Instagram format edit' }, { src: 'assets/portfolio-media-web/VIDEO EDITING/INSTAGRAM FEED/HYDRAFACIAL PRO IG .m4v', alt: 'Hydrafacial Pro Instagram video' }, { src: 'assets/portfolio-media-web/VIDEO EDITING/INSTAGRAM FEED/POV FACIAL.m4v', alt: 'POV facial Instagram video' }
        ] } }
      ] },
      { id: 'ads', index: '05', label: 'Ads', layout: 'rows', title: 'Paid media creative', description: 'Static and video ad concepts structured for campaign variation and performance testing.', projects: [
        { id: 'ads-static', title: 'BodyFactory Paid Social', description: 'Promotional, seasonal, and before-and-after advertising creative.', category: 'Paid Social', format: 'Static', media: { type: 'gallery', alt: 'Paid social ad', items: imageItems('ads', adNames) } },
        { id: 'ads-video', title: 'Meta Video Ads', description: 'Short paid-media edits organized as a dedicated video-ad set.', category: 'Meta Ads', format: 'Video', media: { type: 'gallery', alt: 'Meta video ad', items: [
          { src: 'assets/portfolio-media-web/META ADS/VIDEO AD/A615C244-3978-4652-B612-7C476AF936CD.m4v', alt: 'BodyFactory Meta video ad' }, { src: 'assets/portfolio-media-web/META ADS/VIDEO AD/BLOND_POV_AD_16.9.m4v', alt: 'Blond POV Meta video ad' }, { src: 'assets/portfolio-media-web/META ADS/VIDEO AD/BLOND_RESULTS_ADS_16.9.m4v', alt: 'Blond results Meta video ad' }
        ] } }
      ] },
      { id: 'multimedia', index: '06', label: 'Multimedia', layout: 'asymmetric', title: 'Additional creative work', description: 'Campaign extensions, link-in-bio experiences, and supporting digital pieces.', projects: [
        { id: 'other-one', title: 'Mother’s Day', description: 'Seasonal campaign artwork.', media: { type: 'image', src: 'assets/content/other/mothers-day.png', alt: 'Mother’s Day artwork', ratio: 'wide' }, featured: true },
        { id: 'other-two', title: 'Linktree Experience', description: 'Branded link-in-bio design.', media: { type: 'image', src: 'assets/content/other/linktree-01.png', alt: 'Linktree experience' } },
        { id: 'other-three', title: 'Linktree System', description: 'Supporting link-in-bio screen.', media: { type: 'image', src: 'assets/content/other/linktree-02.png', alt: 'Linktree system' } },
        { id: 'other-four', title: 'Hydrafacial Promotion', description: 'Promotional campaign extension.', media: { type: 'image', src: 'assets/content/other/hydrafacial-promo.png', alt: 'Hydrafacial promotion' } },
        { id: 'other-five', title: 'Valentine’s Header', description: 'Seasonal email and social header.', media: { type: 'image', src: 'assets/content/other/valentines-header.png', alt: 'Valentine’s header' } }
      ] },
      { id: 'youtube', index: '07', label: 'YouTube', layout: 'video', title: 'Documenting the creative process', description: 'Creator-led films about making work, building consistency, video journaling, and life in New York City.', channelUrl: 'https://www.youtube.com/@Drigoverse', projects: [
        { id: 'video-one', title: 'Vlogged for 90+ days with my Osmo Pocket 3 in NYC and somethings changed...', description: 'A reflection on documenting life with the Osmo Pocket 3 in New York City.', category: 'Video Journal', youtubeId: 'DKAxc6Bq5tw', media: { src: 'https://i.ytimg.com/vi/DKAxc6Bq5tw/hqdefault.jpg', alt: 'Osmo Pocket 3 video thumbnail' }, url: 'https://www.youtube.com/watch?v=DKAxc6Bq5tw' },
        { id: 'video-two', title: 'The Only Ability That Keeps You Consistent (It’s Not Motivation)', description: 'A creator’s perspective on consistency.', category: 'Creative Process', youtubeId: 'C2iItT8LrdM', media: { src: 'https://i.ytimg.com/vi/C2iItT8LrdM/hqdefault.jpg', alt: 'Consistency video thumbnail' } },
        { id: 'video-three', title: 'If It Serves No Purpose, Why Do We Create?', description: 'A reflection on creativity and purpose.', category: 'Creative Process', youtubeId: 'iUdTDfxJh58', media: { src: 'https://i.ytimg.com/vi/iUdTDfxJh58/hqdefault.jpg', alt: 'Why we create video thumbnail' } },
        { id: 'video-four', title: 'Things I wish I knew before starting as a small creator', description: 'Lessons from building a small creator practice.', category: 'Creator Journal', youtubeId: 'bjqbUIukLDk', media: { src: 'https://i.ytimg.com/vi/bjqbUIukLDk/hqdefault.jpg', alt: 'Small creator video thumbnail' } },
        { id: 'video-five', title: 'The raw reality of documenting the process', description: 'An honest look at documenting creative work.', category: 'Creator Journal', youtubeId: 'jbLNX6MIYDY', media: { src: 'https://i.ytimg.com/vi/jbLNX6MIYDY/hqdefault.jpg', alt: 'Documenting the process thumbnail' } }
      ] },
      { id: 'campaigns', index: '08', label: 'Campaigns', layout: 'campaigns', title: 'Campaign archive', description: 'Seasonal and treatment-focused campaign families.', projects: [
        { id: 'campaign-one', title: 'Valentine’s Day', category: 'Seasonal' }, { id: 'campaign-two', title: 'Masseter Minimizing', category: 'Treatment' }, { id: 'campaign-three', title: 'Black Friday', category: 'Retail' }, { id: 'campaign-four', title: 'Spring Sale', category: 'Seasonal' }, { id: 'campaign-five', title: 'Wrinkle Treatment', category: 'Treatment' }, { id: 'campaign-six', title: 'Fourth of July', category: 'Seasonal' }
      ] }
    ]
  };
}());
