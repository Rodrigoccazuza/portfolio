# Theme and motion update

The supplied light/dark OKLCH values are preserved in css/theme.css and mapped to the existing portfolio tokens. Shared pages load the theme and early preference initialization. A hero toggle saves the selection in localStorage; system preference is used until an explicit choice is saved. Storage-denied browsing still permits toggling. The Array face remains on Designer and existing fonts are otherwise retained. Yellow folders retain their intentional asset color.

The hero typing effect adapts the supplied TextType behavior to the existing static runtime: Multimedia, Graphic, E-mail, Web, VibeCode, AI, Motion, Video, Creative; 75ms typing, 30ms deleting, 1400ms pause, block cursor. It pauses offscreen or in a hidden tab, supports an explicit pause button and respects reduced motion. Assistive technology receives a static description.

Video rails receive an original native pointer-drag and scroll-linked parallax treatment. Touch scrolling, keyboard navigation, full media previews and mute controls remain available. This is NOT React Bits Pro's Parallax Carousel. The exact Pro component is not installed: no REACTBITS_LICENSE_KEY is configured, and this static repository has no React/shadcn build. Official instructions: https://pro.reactbits.dev/docs/installation and https://pro.reactbits.dev/docs/components/parallax-carousel. A licensed installation requires a React build and its documented registry configuration; never put license keys in source control or browser assets.

Verification: JavaScript syntax, shared-page theme asset paths, and preference initialization/storage behavior. Browser-rendered visual QA remains outstanding because the session's browser previously blocked local previews.
