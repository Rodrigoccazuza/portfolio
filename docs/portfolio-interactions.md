# Portfolio interaction refresh

Based on `new_portfolio` (the existing redesign), not the older default branch.

The uploaded reference's four interactions are adapted to the site's native HTML/CSS/JavaScript runtime in `components/ui/portfolio-interactions.js` and its companion stylesheet. `js/portfolio.js` supplies existing project data and the existing accessible media viewer. There are no new runtime dependencies or build requirements.

- Websites: centered sticky cards, scroll-linked scaling, existing live links, full screenshot previews.
- Tools: three rotating rings with existing tool identities, pause control, offscreen pause and reduced-motion support.
- Process: centered six-step timeline using existing step names, progressive reveal and connected markers.
- Ads / Other: folders containing all 12 static ads, 3 video ads and 5 additional pieces. Mouse drag-down, Escape and close-button dismissal; native touch scrolling; full media viewer.
- Small-height and reduced-motion layouts use ordinary document flow so cards remain readable. Keyboard focus lifts a covered card.

## Optional React setup

This repository has no React, TypeScript, Tailwind or package build pipeline. The supplied TSX cannot execute directly in its static pages. For a future React migration, scaffold a Vite React TypeScript application (`npm create vite@latest portfolio-react -- --template react-ts`), install Tailwind's Vite integration (`npm install tailwindcss @tailwindcss/vite`), register the Tailwind Vite plugin, and add `@import "tailwindcss"` to the main CSS file. Configure the `@/*` TypeScript and Vite alias to the source directory, then run `npx shadcn@latest init`. Install the reference dependencies with `npm install framer-motion lenis lucide-react react-icons class-variance-authority @radix-ui/react-scroll-area`. Keep reusable UI adapters under `src/components/ui` (aliased as `@/components/ui`) to separate interaction primitives from portfolio content. Migrate page rendering before substituting the TSX references, and carry over the existing brand tokens instead of globally replacing them with the sample theme.

## Verification

JavaScript syntax and local content-path checks passed. Browser preview was attempted but this session's browser blocked the local preview URL (`ERR_BLOCKED_BY_CLIENT`); rendered desktop/mobile validation remains outstanding. Review card stacking at 1440px and 390px, folders and media previews, and reduced-motion behavior before merging.
