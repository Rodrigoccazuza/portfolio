/* Shared campaign relationships used by the homepage and every campaign detail route. */
(function () {
  function asset(src, title, category) { return { src: src, title: title, alt: title, type: 'image', category: category }; }
  function files(root, category, names) { return names.map(function (name) { return asset(root + '/' + name, name.replace(/\.[^.]+$/, '').replace(/\s+1$/, ''), category); }); }

  window.portfolioCampaigns = [
    {
      id: 'valentines-day', slug: 'valentines-day', title: 'Valentine’s Day', category: 'Seasonal Campaign',
      description: 'Email, paid-social, and supporting campaign creative developed as one Valentine’s Day collection.',
      assets: {
        email: files('assets/campaigns/valentines-day/email', 'Email Campaigns', ["VALENTINE'S DAY 1.png", "VALENTINE'S DAYS 2 1.png"]),
        adsStatic: files('assets/campaigns/valentines-day/ads', 'Ads', ['1 1.png','2 1.png','3 1.png','4 1.png','5 1.png','6 1.png','7 1.png']),
        other: files('assets/campaigns/valentines-day/other', 'Other Related Assets', ['Red Modern Valentine’s Day Sale Email Header (200 x 200 px) 1.png','Red Modern Valentine’s Day Sale Email Header 1.png'])
      }
    },
    {
      id: 'masseter-minimizing', slug: 'masseter-minimizing', title: 'Masseter Minimizing', category: 'Treatment Campaign',
      description: 'Treatment education translated across email and organic social content.',
      assets: {
        email: files('assets/campaigns/masseter-minimizing/email', 'Email Campaigns', ['6 9207.png','7 91860.png','8 210.png']),
        socialStatic: files('assets/campaigns/masseter-minimizing/social', 'Social Media', ['1 2.png','2 2.png','3 2.png'])
      }
    },
    {
      id: 'black-friday', slug: 'black-friday', title: 'Black Friday', category: 'Retail Campaign',
      description: 'A six-part promotional email sequence spanning early access through final offer messaging.',
      assets: { email: files('assets/campaigns/black-friday/email', 'Email Campaigns', ['BF EARLY ACCESS 1.png','Group 28.png','Group 29.png','Group 30.png','Group 31.png','Group 32.png']) }
    },
    {
      id: 'spring-sale', slug: 'spring-sale', title: 'Spring Sale', category: 'Seasonal Campaign',
      description: 'A coordinated three-part spring email series.',
      assets: { email: files('assets/campaigns/spring-sale/email', 'Email Campaigns', ['SPRING SERIES 3 1.png','SPRING SERIES 4.png','SPRING SERIES2 1.png']) }
    },
    {
      id: 'wrinkle-treatment', slug: 'wrinkle-treatment', title: 'Wrinkle Treatment', category: 'Treatment Campaign',
      description: 'A treatment campaign bringing together email and paid before-and-after creative.',
      assets: {
        email: files('assets/campaigns/wrinkle-treatment/email', 'Email Campaigns', ['1 82133.png','2 (2) 1.png','2 855537100.png','3 58433863.png']),
        adsStatic: files('assets/campaigns/wrinkle-treatment/ads', 'Ads', ['1 1.png','2 1.png','3 1.png','4 1.png','5 1.png','6 1.png','7 1.png'])
      }
    },
    {
      id: '4th-of-july', slug: '4th-of-july', title: 'Fourth of July', category: 'Seasonal Campaign',
      description: 'A seven-message campaign sequence from early access and proof through last chance.',
      assets: { email: files('assets/campaigns/4th-of-july/email', 'Email Campaigns', ['PRE-EMAIL (sends Jun 24) 1.png','JULY 1, early access opens_ ANCHOR 1.png','JULY 3, value + proof 1.png','JULY 4, the 4th 1.png','JULY 6, ends tomorrow 1.png','JULY 7,  alternate  for  non-openers 1.png','JULY 7, last chance_  ANCHOR 1.png']) }
    }
  ];
}());
