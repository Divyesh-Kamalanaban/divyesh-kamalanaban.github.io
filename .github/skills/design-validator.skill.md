# Design Validator Skill

This skill tracks the design consistency, responsive behavior, and UX validation processes executed by the `design-validator` agent. It documents validation patterns, common design issues found, and lessons learned when reviewing portfolio updates for visual compliance and accessibility.

## Purpose

- Maintain a record of design validations performed and issues identified
- Document responsive design breakpoints and CSS patterns used in the portfolio
- Capture lessons from design consistency reviews and accessibility audits
- Provide guidance for future design validations and improvements

## Guidelines

- Always verify responsive design across mobile (320px), tablet (768px), and desktop (1200px+) breakpoints
- Check CSS variable usage: `--text-primary`, `--text-secondary`, `--bg-primary`, `--bg-secondary`, `--accent`, `--glass-border`
- Validate Tailwind utility classes: sm:, md:, lg:, xl: prefixes for responsiveness
- Verify glass-card styling consistency (opacity, backdrop-filter, border)
- Test dark mode toggle and ensure color contrast meets WCAG AA+ standards
- Check animation performance (avoid jank on lower-end devices)
- Update this skill after each validation run with patterns observed and any issues discovered

## Design System Reference

### CSS Variables (from src/index.css)
```css
--text-primary: Main heading/text color
--text-secondary: Secondary body text
--accent: Brand/highlight color (default: cyan/blue)
--bg-primary: Primary background
--bg-secondary: Secondary background
--glass-border: Border color for glass-card components
```

### Key Components
- **glass-card**: Frosted glass effect with backdrop-filter and opacity
- **btn-primary**: Primary action button with hover states
- **section-container**: Full-width section wrapper
- **content-wrapper**: Centered content with max-width constraint

### Responsive Breakpoints
- Mobile: 320px—767px
- Tablet: 768px—1023px
- Desktop: 1024px+

### Dark Mode
Portfolio supports dark/light mode toggle via CSS variable switching. Verify both modes after changes.

## Validation Checklist

When reviewing design changes:
- [ ] Responsive classes present (sm:, md:, lg: prefixes)
- [ ] CSS variables used, not hardcoded colors
- [ ] Glass-card styling consistent
- [ ] Text contrast passes WCAG AA (4.5:1 minimum)
- [ ] Animations smooth without jank
- [ ] Dark/light mode both functional
- [ ] Images/icons load and scale correctly
- [ ] No horizontal scroll on mobile
- [ ] Touch targets at least 44x44px on mobile
- [ ] Font sizes readable at 320px viewport

## Example Findings & Patterns

### Pattern: Glass Card Styling
Glass cards throughout portfolio use consistent pattern:
```css
glass-card rounded-2xl overflow-hidden p-2
ring-1 ring-white/10 shadow-2xl
```
When adding new cards, maintain this pattern for consistency.

### Common Issue: Missing Responsive Classes
Projects component section originally missing `md:` prefixes in layout. Fixed by adding:
```jsx
className={`grid grid-cols-1 lg:grid-cols-2 gap-12`}
```

### Color Contrast Verification
Accent color (cyan) contrast checked against backgrounds:
- Accent on primary bg: ✓ 5.2:1
- Accent on secondary bg: ✓ 4.8:1
- Both exceed WCAG AA minimum (4.5:1)

## Change Log

- *2026-03-10*: Skill created to support design-validator agent. Added design system reference, validation checklist, and responsive breakpoints.
- *2026-03-10*: Included CSS variable reference and glass-card styling patterns for consistency checking.

---

This skill evolves as design patterns are refined and validation techniques improve with each review cycle.
