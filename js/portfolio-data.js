/* Central placeholder content contract. Replace this object when final data arrives. */
window.portfolioPlaceholderData = {
  websiteTools: [
    { name: 'WordPress', src: 'images/tools/wordpress.png' },
    { name: 'Elementor', src: 'images/tools/elementor.png' },
    { name: 'Webflow', src: 'images/tools/webflow.png' },
    { name: 'Framer', mark: 'F' },
    { name: 'Claude', mark: '✣' },
    { name: 'VS Code', src: 'images/tools/vscode.png' },
    { name: 'HTML5', src: 'images/tools/html5.png' },
    { name: 'CSS3', src: 'images/tools/css3.png' },
    { name: 'JavaScript', src: 'images/tools/javascript.png' }
  ],
  websiteProcess: ['Concept', 'Research', 'Sketch', 'Wireframes', 'Prototype', 'Implementation'],
  designSystemElements: [
    { title: 'Design Tokens', description: 'Colors, type, spacing, radius, and motion.' },
    { title: 'Brand Guidelines', description: 'Clear rules for voice, visuals, and usage.' },
    { title: 'Component Library', description: 'Reusable, accessible, production-ready patterns.' },
    { title: 'Documentation', description: 'Guidance built for teams and long-term scale.' }
  ],
  emailDisciplines: ['Strategy', 'Copy Direction', 'Layout', 'Responsive Email', 'Development', 'Testing'],
  behindDesigns: [
    { id: 'showcase-one', label: '[PROJECT IMAGE 01]', alt: '[PROJECT IMAGE ALT 01]', src: '' },
    { id: 'showcase-two', label: '[PROJECT IMAGE 02]', alt: '[PROJECT IMAGE ALT 02]', src: '' },
    { id: 'showcase-three', label: '[PROJECT IMAGE 03]', alt: '[PROJECT IMAGE ALT 03]', src: '' },
    { id: 'showcase-four', label: '[PROJECT IMAGE 04]', alt: '[PROJECT IMAGE ALT 04]', src: '' },
    { id: 'showcase-five', label: '[PROJECT IMAGE 05]', alt: '[PROJECT IMAGE ALT 05]', src: '' },
    { id: 'showcase-six', label: '[PROJECT IMAGE 06]', alt: '[PROJECT IMAGE ALT 06]', src: '' },
    { id: 'showcase-seven', label: '[PROJECT IMAGE 07]', alt: '[PROJECT IMAGE ALT 07]', src: '' }
  ],
  sections: [
    {
      id: 'websites', index: '01', label: 'Websites', layout: 'websites', title: '[WEBSITE SECTION HEADLINE]',
      description: '[SECTION DESCRIPTION — editorial web design and front-end implementation context.]',
      projects: [
        { id: 'website-one', title: '[WEBSITE PROJECT 01]', description: '[PROJECT DESCRIPTION — concise context for the selected website, objective, and implementation.]', category: '[WEBSITE CATEGORY]', year: '[YEAR]', role: '[ROLE]', media: { type: 'image', src: '', alt: '[WEBSITE PREVIEW ALT 01]', label: '[WEBSITE PREVIEW 01]', ratio: 'wide' }, url: '' },
        { id: 'website-two', title: '[WEBSITE PROJECT WITH A LONGER TITLE]', description: '[SHORT PROJECT DESCRIPTION]', category: '[WEBSITE CATEGORY]', year: '', role: '[ROLE]', media: { type: 'image', src: '', alt: '[WEBSITE PREVIEW ALT 02]', label: '[WEBSITE PREVIEW 02]', ratio: 'wide' }, url: '' },
        { id: 'website-three', title: '[WEBSITE PROJECT 03]', description: '[PROJECT DESCRIPTION WITH A REALISTIC TWO-LINE LENGTH]', category: '[WEBSITE CATEGORY]', year: '[YEAR]', role: '', media: { type: 'image', src: '', alt: '[WEBSITE PREVIEW ALT 03]', label: '[WEBSITE PREVIEW 03]', ratio: 'wide' }, url: '' },
        { id: 'website-four', title: '[SHORT WEBSITE TITLE]', description: '[SHORT PROJECT DESCRIPTION]', category: '[WEBSITE CATEGORY]', year: '', role: '[ROLE]', media: { type: 'image', src: '', alt: '[WEBSITE PREVIEW ALT 04]', label: '[WEBSITE PREVIEW 04]', ratio: 'wide' }, url: '' },
        { id: 'website-five', title: '[WEBSITE PROJECT 05]', description: '[PROJECT DESCRIPTION — optional content-length test.]', category: '[WEBSITE CATEGORY]', year: '[YEAR]', role: '[ROLE]', media: { type: 'image', src: '', alt: '[WEBSITE PREVIEW ALT 05]', label: '[WEBSITE PREVIEW 05]', ratio: 'wide' }, url: '' }
      ]
    },
    {
      id: 'design-systems', index: '02', label: 'Design Systems', layout: 'systems', title: '[DESIGN SYSTEMS SECTION HEADLINE]',
      description: '[SECTION DESCRIPTION — reusable visual language, components, and consistency.]',
      projects: [
        { id: 'system-one', title: '[DESIGN SYSTEM TITLE]', description: '[SYSTEM DESCRIPTION WITH REALISTIC LENGTH]', category: '[SYSTEM CATEGORY]', year: '[YEAR]', role: '[ROLE]', services: ['[FOUNDATIONS]', '[COMPONENTS]'], technologies: [], media: { type: 'image', src: '', alt: '[SYSTEM PREVIEW ALT]', label: '[FOUNDATIONS PREVIEW]', ratio: 'square' }, url: '' },
        { id: 'system-two', title: '[LONGER DESIGN SYSTEM PROJECT TITLE]', description: '[SHORT SYSTEM DESCRIPTION]', category: '[SYSTEM CATEGORY]', year: '', role: '', services: ['[TOKENS]', '[PATTERNS]', '[DOCUMENTATION]'], technologies: [], media: { type: 'image', src: '', alt: '[SYSTEM PREVIEW ALT]', label: '[COMPONENT PREVIEW]', ratio: 'square' }, url: '' },
        { id: 'system-three', title: '[DESIGN SYSTEM TITLE]', description: '', category: '[SYSTEM CATEGORY]', year: '[YEAR]', role: '[ROLE]', services: ['[GUIDELINES]'], technologies: [], media: { type: 'image', src: '', alt: '[SYSTEM PREVIEW ALT]', label: '[PATTERN PREVIEW]', ratio: 'square' }, url: '' }
      ]
    },
    {
      id: 'email', index: '03', label: 'Email', layout: 'rail', title: '[EMAIL CAMPAIGNS SECTION HEADLINE]',
      description: '[SECTION DESCRIPTION — modular campaign and lifecycle email design.]',
      projects: [
        { id: 'email-one', title: '[FEATURED EMAIL CAMPAIGN TITLE]', description: '[CAMPAIGN DESCRIPTION — realistic multi-line context for the featured composition.]', category: '[EMAIL CATEGORY]', year: '[YEAR]', role: '[ROLE]', services: ['[SERVICE]', '[SERVICE]'], technologies: [], media: { type: 'image', src: '', alt: '[EMAIL PREVIEW ALT]', label: '[FEATURED EMAIL CREATIVE]', ratio: 'portrait' }, url: '', featured: true },
        { id: 'email-two', title: '[EMAIL CAMPAIGN TITLE]', description: '[SHORT CAMPAIGN DESCRIPTION]', category: '[EMAIL CATEGORY]', year: '', role: '', services: ['[SERVICE]'], technologies: [], media: { type: 'image', src: '', alt: '[EMAIL PREVIEW ALT]', label: '[EMAIL CREATIVE]', ratio: 'portrait' }, url: '' },
        { id: 'email-three', title: '[LONGER EMAIL CAMPAIGN TITLE FOR WRAPPING]', description: '', category: '[EMAIL CATEGORY]', year: '[YEAR]', role: '', services: [], technologies: [], media: { type: 'image', src: '', alt: '[EMAIL PREVIEW ALT]', label: '[EMAIL CREATIVE]', ratio: 'portrait' }, url: '' },
        { id: 'email-four', title: '[EMAIL CAMPAIGN TITLE 04]', description: '[SHORT CAMPAIGN DESCRIPTION]', category: '[EMAIL CATEGORY]', year: '', role: '[ROLE]', services: ['[SERVICE]'], technologies: [], media: { type: 'image', src: '', alt: '[EMAIL PREVIEW ALT 04]', label: '[EMAIL CREATIVE 04]', ratio: 'portrait' }, url: '' },
        { id: 'email-five', title: '[EMAIL CAMPAIGN TITLE 05]', description: '[CAMPAIGN DESCRIPTION WITH A REALISTIC TWO-LINE LENGTH]', category: '[EMAIL CATEGORY]', year: '[YEAR]', role: '', services: ['[SERVICE]'], technologies: [], media: { type: 'image', src: '', alt: '[EMAIL PREVIEW ALT 05]', label: '[EMAIL CREATIVE 05]', ratio: 'portrait' }, url: '' }
      ]
    },
    {
      id: 'social', index: '04', label: 'Social Media', layout: 'rows', title: '[SOCIAL MEDIA SECTION HEADLINE]',
      description: '[SECTION DESCRIPTION — cohesive social campaigns and content systems.]',
      projects: [
        { id: 'social-one', title: '[SOCIAL CAMPAIGN TITLE]', description: '[CAMPAIGN DESCRIPTION]', category: '[SOCIAL CATEGORY]', year: '[YEAR]', role: '[ROLE]', services: ['[SERVICE]'], technologies: [], media: { type: 'gallery', src: '', alt: '[SOCIAL CREATIVE ALT]', label: '[SOCIAL CREATIVE]', ratio: 'square', count: 4 }, url: '' },
        { id: 'social-two', title: '[LONGER SOCIAL CAMPAIGN TITLE]', description: '[A LONGER DESCRIPTION TO TEST HOW SUPPORTING COPY WRAPS ON SMALLER VIEWPORTS.]', category: '[SOCIAL CATEGORY]', year: '', role: '', services: ['[SERVICE]', '[SERVICE]'], technologies: [], media: { type: 'gallery', src: '', alt: '[SOCIAL CREATIVE ALT]', label: '[SOCIAL CREATIVE]', ratio: 'square', count: 4 }, url: '' }
      ]
    },
    {
      id: 'ads', index: '05', label: 'Ads', layout: 'rows', title: '[PAID ADVERTISING SECTION HEADLINE]',
      description: '[SECTION DESCRIPTION — campaign-ready creative across paid-media formats.]',
      projects: [
        { id: 'ads-one', title: '[AD CAMPAIGN TITLE]', description: '[PAID-MEDIA CAMPAIGN DESCRIPTION]', category: '[AD CATEGORY]', year: '[YEAR]', role: '[ROLE]', services: ['[SERVICE]'], technologies: [], media: { type: 'gallery', src: '', alt: '[AD CREATIVE ALT]', label: '[AD CREATIVE]', ratio: 'portrait', count: 4 }, url: '' },
        { id: 'ads-two', title: '[LONGER AD CAMPAIGN TITLE]', description: '', category: '[AD CATEGORY]', year: '', role: '', services: ['[SERVICE]', '[FORMAT]'], technologies: [], media: { type: 'gallery', src: '', alt: '[AD CREATIVE ALT]', label: '[AD CREATIVE]', ratio: 'portrait', count: 4 }, url: '' }
      ]
    },
    {
      id: 'multimedia', index: '06', label: 'Multimedia', layout: 'asymmetric', title: '[MULTIMEDIA SECTION HEADLINE]',
      description: '[SECTION DESCRIPTION — selected work across additional creative disciplines.]',
      projects: [
        { id: 'other-one', title: '[FEATURED MULTIMEDIA PROJECT TITLE]', description: '[MULTIMEDIA PROJECT DESCRIPTION WITH REALISTIC LENGTH]', category: '[PROJECT CATEGORY]', year: '[YEAR]', role: '[ROLE]', services: ['[SERVICE]'], technologies: [], media: { type: 'image', src: '', alt: '[MULTIMEDIA PREVIEW ALT]', label: '[MULTIMEDIA IMAGE]', ratio: 'wide' }, url: '', featured: true },
        { id: 'other-two', title: '[MULTIMEDIA PROJECT TITLE]', description: '[SHORT DESCRIPTION]', category: '[PROJECT CATEGORY]', year: '', role: '', services: [], technologies: [], media: { type: 'image', src: '', alt: '[MULTIMEDIA PREVIEW ALT]', label: '[PROJECT IMAGE]', ratio: 'square' }, url: '' },
        { id: 'other-three', title: '[SHORT TITLE]', description: '', category: '[PROJECT CATEGORY]', year: '[YEAR]', role: '', services: [], technologies: [], media: { type: 'image', src: '', alt: '[MULTIMEDIA PREVIEW ALT]', label: '[PROJECT IMAGE]', ratio: 'landscape' }, url: '' }
      ]
    },
    {
      id: 'video', index: '07', label: 'Video / YouTube', layout: 'video', title: '[VIDEO SECTION HEADLINE]',
      description: '[SECTION DESCRIPTION — long-form, short-form, motion, and production context.]',
      projects: [
        { id: 'video-one', title: '[FEATURED VIDEO TITLE]', description: '[VIDEO DESCRIPTION — supporting information with a realistic two-line length.]', category: '[VIDEO CATEGORY]', year: '[YEAR]', role: '[ROLE]', services: ['[EDITING]', '[PRODUCTION]'], technologies: [], media: { type: 'video', src: '', alt: '[VIDEO THUMBNAIL ALT]', label: '[VIDEO THUMBNAIL]', ratio: 'video' }, url: '', featured: true },
        { id: 'video-two', title: '[SECONDARY VIDEO TITLE]', description: '[SHORT VIDEO DESCRIPTION]', category: '[VIDEO CATEGORY]', year: '', role: '', services: ['[SERVICE]'], technologies: [], media: { type: 'video', src: '', alt: '[VIDEO THUMBNAIL ALT]', label: '[VIDEO THUMBNAIL]', ratio: 'video' }, url: '' }
      ]
    },
    {
      id: 'campaigns', index: '08', label: 'Campaigns', layout: 'campaigns', title: '[CAMPAIGNS SECTION HEADLINE]',
      description: '[SECTION DESCRIPTION — integrated and seasonal campaign modules.]',
      projects: [
        { id: 'campaign-one', title: '[CAMPAIGN TITLE]', category: '[CAMPAIGN CATEGORY]', year: '[YEAR]' },
        { id: 'campaign-two', title: '[LONGER CAMPAIGN TITLE]', category: '[CAMPAIGN CATEGORY]', year: '' },
        { id: 'campaign-three', title: '[CAMPAIGN TITLE]', category: '[CAMPAIGN CATEGORY]', year: '[YEAR]' },
        { id: 'campaign-four', title: '[SHORT TITLE]', category: '[CAMPAIGN CATEGORY]', year: '' },
        { id: 'campaign-five', title: '[CAMPAIGN TITLE]', category: '[CAMPAIGN CATEGORY]', year: '[YEAR]' },
        { id: 'campaign-six', title: '[LONG CAMPAIGN TITLE FOR RESPONSIVE TESTING]', category: '[CAMPAIGN CATEGORY]', year: '' }
      ]
    }
  ]
};
