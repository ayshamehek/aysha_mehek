# Portfolio micro-interactions

## What will change
Add six coordinated, low-key interactions to the existing portfolio without changing its content or layout:
1. A smooth accent marker that tracks the active navigation item, with a refined hover response.
2. A springy, cross-fading sun/moon icon on the theme control.
3. Gentle pointer attraction and press feedback on the two Hero calls to action.
4. A restrained pointer-reactive tilt on the profile photo, preserving its existing drag behavior.
5. A theme-aware cursor-following light on the draggable project card, without interfering with card dragging.
6. A short, staggered accent response on experience bullets when the card is hovered or keyboard-focused.

## Guardrails
Keep the existing visual design, content, links, and controls intact. Use semantic theme colors, honor reduced-motion preferences, and avoid pointer-only effects on touch devices. Verify the page and interactions at desktop and mobile sizes, then check the preview diagnostics.

## Technical approach
Implement the focused changes in `src/components/Portfolio.tsx` using the existing Framer Motion setup and CSS variables. Keep the project card's drag gesture and existing accessibility semantics intact; do not add dependencies or routes.
