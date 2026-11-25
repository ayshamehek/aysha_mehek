# Profile photo pin tether

## What will change
- Add a small visible pin beside the profile photo and a fine elastic tether that follows the photo while it is dragged.
- Keep the existing drag-and-return behavior, photo styling, and page content unchanged.

## Technical approach
- Keep the interaction in `src/components/Portfolio.tsx`, using Framer Motion values for tether movement and existing semantic theme colors.
- Check the preview at desktop and mobile sizes and review build diagnostics.
