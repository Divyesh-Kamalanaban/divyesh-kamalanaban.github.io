# Design Documentation - Divyesh Portfolio

## Overview
The divyesh-portfolio employs a modern, dark-first design system with support for light mode. The design language emphasizes glass-morphism, neumorphism, and gradient accents with smooth animations and responsive typography.

---

## Color Palette & CSS Variables

### Light Mode (Default)
Located in [src/index.css](../src/index.css#L88-L98):

| Variable | Value | Usage |
|----------|-------|-------|
| `--bg-primary` | `#ffffff` | Main background |
| `--bg-secondary` | `#f3f4f6` | Secondary/card backgrounds |
| `--text-primary` | `#121212` | Primary text color |
| `--text-secondary` | `#4b5563` | Secondary/muted text |
| `--glass-bg` | `rgba(255, 255, 255, 0.7)` | Glass-morphism backgrounds |
| `--glass-border` | `rgba(0, 0, 0, 0.1)` | Glass card borders |
| `--btn-primary-bg` | `#121212` | Primary button background |
| `--btn-primary-text` | `#ffffff` | Primary button text |
| `--accent` | `linear-gradient(45deg, rgb(242, 113, 33), rgb(233, 64, 87), rgb(138, 35, 135))` | Accent gradient (orange → red → purple) |
| `--accent-solid` | `rgb(233, 64, 87)` | Solid accent red |

### Dark Mode
Activated via `.dark` class in [src/index.css](../src/index.css#L101-L118):

| Variable | Value | Usage |
|----------|-------|-------|
| `--bg-primary` | `#1F1F1F` | Main background |
| `--bg-secondary` | `#1f2937` | Secondary/card backgrounds |
| `--text-primary` | `#ffffff` | Primary text color |
| `--text-secondary` | `#9ca3af` | Secondary/muted text |
| `--glass-bg` | `rgba(255, 255, 255, 0.05)` | Glass-morphism backgrounds (very subtle) |
| `--glass-border` | `rgba(255, 255, 255, 0.1)` | Glass card borders |
| `--btn-primary-bg` | `#ffffff` | Primary button background |
| `--btn-primary-text` | `#000000` | Primary button text |
| `--neu-shadow-dark` | `#141414` | Neumorphism dark shadow |
| `--neu-shadow-light` | `#2a2a2a` | Neumorphism light shadow |
| `--accent` | `linear-gradient(45deg, rgb(242, 113, 33), rgb(233, 64, 87), rgb(138, 35, 135))` | Same accent gradient |
| `--accent-solid` | `rgb(233, 64, 87)` | Same solid accent red |

### Theme Toggle Implementation
Theme switching is managed in [src/App.jsx](../src/App.jsx#L56-L75):
- Reads from `localStorage.theme` or system preference
- Adds/removes `.dark` class on `documentElement`
- Provides smooth 500ms transition between themes
- Sun/Moon icons from Lucide React indicate current theme

---

## Typography System

### Font Stack
Imported at the top of [src/App.jsx](../src/App.jsx#L1-L5):

| Font | Weight Variants | Usage | Source |
|------|-----------------|-------|--------|
| **Manrope Variable** | 400-700 | Default body text, `<p>` tags | `@fontsource-variable/manrope` |
| **Inter Variable** | 400-700 | Headings (`<h1>`-`<h6>`), nav | `@fontsource-variable/inter` |
| **Abril Fatface** | 400 | Display/hero titles | `@fontsource/abril-fatface` |
| **IBM Plex Serif** | 400, 400-italic | Subtitles, decorative text | `@fontsource/ibm-plex-serif` |

### Base Typography Rules
From [src/index.css](../src/index.css#L1-L45):

```css
/* Root typography */
font-family: 'Manrope Variable', system-ui, sans-serif;
font-size: clamp(16px, 2vw, 19px);  /* Fluid scaling */
line-height: 1.6;
font-weight: 400;

/* Headings */
h1-h6: font-family: 'Inter Variable', system-ui, sans-serif;
        letter-spacing: -0.025em;    /* tracking-tight */

/* Heading sizes */
h1: font-size: 3.2em; line-height: 1.1;
```

### Responsive Typography
- Uses `clamp()` for fluid scaling between viewport sizes
- Tight letter-spacing on headings (tracking-tight: -0.025em)
- Base font size fluently scales from 16px to 19px

---

## Design System Components

### Glass-Morphism Cards
Class: `.glass-card` in [src/index.css](../src/index.css#L138-L149):

```css
.glass-card {
  backdrop-filter: blur(md) = 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  background-color: var(--glass-bg);
  border: 1px solid var(--glass-border);
  transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.glass-card:hover {
  background-color: color-mix(in srgb, var(--glass-bg), var(--text-primary) 5%);
  border-color: color-mix(in srgb, var(--glass-border), var(--text-primary) 10%);
}
```

**Dark Mode Override**: Uses neumorphic shadows instead of glass effect:
```css
:is(.dark .glass-card) {
  background-color: var(--bg-primary);
  border: none;
  box-shadow: 8px 8px 16px var(--neu-shadow-dark), -8px -8px 16px var(--neu-shadow-light);
}
```

### Navigation Bar
Class: `.glass-nav` in [src/index.css](../src/index.css#L167-L170):

```css
.glass-nav {
  backdrop-filter: blur(xl) = 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease;
  background-color: var(--glass-bg);
  border: 1px solid var(--glass-border);
}
```

### Primary Button
Class: `.btn-primary` in [src/index.css](../src/index.css#L177-L183):

```css
.btn-primary {
  padding: 1.5rem 1.5rem;  /* px-6 py-3 */
  border-radius: 9999px;   /* rounded-full */
  font-weight: 600;        /* font-semibold */
  background: var(--accent);  /* Gradient */
  color: white;
  box-shadow: 0 4px 15px rgba(233, 64, 87, 0.3);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  opacity: 0.95;
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(233, 64, 87, 0.4);
}
```

### Global Background
Class: `.global-bg` in [src/index.css](../src/index.css#L124-L135):

- Fixed, full-viewport background
- Smooth 500ms transitions between light/dark mode
- Includes subtle noise texture overlay (opacity 3%)
- Masks noise with radial gradient for smooth edges

---

## Animation System

### Core Keyframes
All animations defined in [src/index.css](../src/index.css#L220-L241):

#### `fadeIn` (0.5s ease-out)
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```
**Usage**: Section entries (e.g., portfolio sections)

#### `slideUp` (0.8s ease-out)
```css
@keyframes slideUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
```
**Usage**: Hero section title in [src/sections/portfolio/header.jsx](../src/sections/portfolio/header.jsx#L37)

#### `rotateBg` (20s linear infinite)
Defined in [src/sections/portfolio/header.css](../src/sections/portfolio/header.css#L52-L60):
```css
@keyframes rotateBg {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```
**Usage**: Dynamic gradient background rotation in header

#### `scrollLeft` (40s linear infinite)
Defined in [src/sections/portfolio/header.css](../src/sections/portfolio/header.css#L117-L123):
```css
@keyframes scrollLeft {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
```
**Usage**: Continuous horizontal scroll of tech icon row

### Advanced Animation Features

**Smooth Scroll Setup** ([src/App.jsx](../src/App.jsx#L84-L101)):
- Uses **Lenis** library for physics-based smooth scrolling
- Easing: `Math.min(1, 1.001 - Math.pow(2, -10 * t))` (smooth deceleration)
- Duration: 1.2 seconds
- Integrates with GSAP ScrollTrigger for animation coordination

**GSAP Integration** ([src/App.jsx](../src/App.jsx#L103-L110)):
- ScrollTrigger plugin for scroll-driven animations
- Lenis RAF loop synchronized with GSAP ticker
- Enables complex entrance and scroll animations

---

## Responsive Design

### Tailwind CSS Breakpoints
Used throughout the codebase via standard Tailwind utilities:

| Breakpoint | Media Query | Usage | Examples |
|-----------|-------------|-------|----------|
| `sm` | 640px | Small tablets | `sm:text-lg` |
| `md` | 768px | Medium tablets, small desktops | `md:w-[90%]`, `md:text-2xl`, `md:flex-row` |
| `lg` | 1024px | Large desktops | `lg:text-10xl` |
| `xl` | 1280px | Extra large screens | Limited use |

### Specific Responsive Adjustments

**Header Hero** ([src/sections/portfolio/header.jsx](../src/sections/portfolio/header.jsx#L43-L44)):
```jsx
<h1 className="text-7xl md:text-9xl lg:text-10xl">
  Divyesh Kamalanaban
</h1>
```
Scales from 7xl (56px) → 9xl (96px) → 10xl (128px)

**Navigation** ([src/App.jsx](../src/App.jsx#L26)):
```jsx
<div className="glass-nav rounded-full p-1.5 flex items-center gap-1">
```
Responsive gap and padding adjust automatically

**Subtle Grid Mask** ([src/sections/portfolio/header.css](../src/sections/portfolio/header.css#L77-L83)):
```css
@media (hover: none) or (pointer: coarse) {
  .section-bg {
    mask-image: none;
    opacity: 0.3;  /* Simplified for touch devices */
  }
}
```
Disables cursor-following grid on touch devices; increases visibility instead.

---

## Visual Effects & Interactions

### Gradient Text (Accent)
Class: `.text-accent` in [src/index.css](../src/index.css#L214-L219):
```css
.text-accent {
  background: var(--accent);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;  /* Text filled with gradient */
}
```

### Cursor-Following Grid
Implemented in header via CSS mask-image ([src/sections/portfolio/header.css](../src/sections/portfolio/header.css#L73-L82)):
- Uses `--mouse-x` and `--mouse-y` CSS custom properties
- Updated via `onMouseMove` handler in [header.jsx](../src/sections/portfolio/header.jsx#L13-L19)
- Creates dynamic spotlight effect following cursor
- Fallback: keeps grid visible on touch devices

### Hover States
All interactive elements include smooth transitions:
- `.glass-card:hover` - Subtle color mixing for depth
- `.btn-primary:hover` - Scale 1.05 + opacity reduction
- `.lucide-icon:hover` - Scale 1.1 + drop-shadow
- Transitions use `duration-300` to `duration-500` (300-500ms)

---

## Design Language Summary

### Core Principles
1. **Modern & Minimalist** - Clean visual hierarchy, ample whitespace
2. **Accessible** - High contrast, readable fonts, clear CTA buttons
3. **Animated** - Entrance animations, scroll effects, micro-interactions
4. **Dark-First with Light Alternative** - Designed for dark mode, light mode is secondary
5. **Gradient Accents** - Orange → Red → Purple gradient unifies the design
6. **Glass & Neumorphism** - Layered visual approach using transparency and depth effects

### Color Philosophy
- **Accent Gradient**: Warm (orange) → Bold (red) → Cool (purple) creates energy and sophistication
- **Dark Background**: Reduces eye strain, emphasizes bright accent colors
- **Neutral Grays**: Text colors maintain readability in both modes
- **Subtle Borders**: Define structure without harsh lines

### Motion Philosophy
- **Entrance Animations**: Smooth fade-in + slide-up for sections
- **Continuous Animations**: Rotating backgrounds and scrolling icon rows add life
- **Smooth Scrolling**: Lenis prevents jarring jumps; GSAP enables advanced animations
- **Interactive Feedback**: Hover states provide immediate visual response

---

## Implementation Checklist

- [x] Dual light/dark theme with CSS variables
- [x] Fluid typography with clamp()
- [x] Glass-morphism cards with hover states
- [x] Neumorphism fallback for dark mode
- [x] Gradient accent system
- [x] Smooth scrolling and scroll-driven animations
- [x] Responsive breakpoint coverage (sm, md, lg)
- [x] Cursor-following visual effects
- [x] Accessibility considerations (high contrast, readable fonts)
- [x] Animation keyframes with staggered delays

---

## Future Improvements

1. **Color Accessibility**: Add WCAG contrast verification tool
2. **Design Tokens**: Consider exporting CSS variables to Tailwind config
3. **Animation Performance**: Profile GPU usage of complex animations
4. **Mobile Optimization**: Enhance touch interactions and gesture support
5. **Theming**: Support additional color schemes beyond light/dark
