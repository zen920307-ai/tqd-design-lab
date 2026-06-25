final result: blocked

Checked:
- Production build passes after the full-screen redesign pass.
- Installed GSAP skills from `greensock/gsap-skills`: core, timeline, ScrollTrigger, React, performance, utils, plugins, frameworks.
- Added `@gsap/react` and migrated motion setup to `useGSAP` with scoped cleanup.
- Added the React Bits `BorderGlow` component with blue/cyan/white system colors.
- Rebuilt the site into full-screen snap sections: hero, career, system, cases, visual works, leadership, contact.
- Project cards now open a full project detail overlay with left vertical image carousel and right case-content table.
- Visual Works reads image assets from `src/assets` and opens them in a lightbox.

Notes:
- Visual browser QA is blocked in this environment because browser use rejected further access to `http://127.0.0.1:5173/`.
- Re-check visually in the local browser before treating the current pass as final.
