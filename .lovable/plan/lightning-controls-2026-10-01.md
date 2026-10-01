# Lightning controls

## What will change
- Add a small lightning settings control near the existing theme controls.
- Let visitors choose Off, Subtle, Normal, or Vivid lightning intensity.
- Persist the selected setting across reloads.
- Apply the setting only to lightning brightness; clouds, stars, navigation sparkles, and all other motion stay unchanged.

## Technical details
- Pass a lightning intensity value into the existing cloud canvas.
- Add a dedicated shader uniform that scales the bolt, cloud flash, and lightning glow without affecting cloud movement.
- Use the existing button styling, theme tokens, and icon set for an accessible compact menu.
- Verify the menu and effect state on desktop and mobile, including reload persistence.
