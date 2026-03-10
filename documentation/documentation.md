# Project Documentation Index - Divyesh Portfolio

This folder contains comprehensive documentation for the divyesh-portfolio application. Use the index below to find information about specific areas of the project.

## 📚 Documentation Files

### 1. [Design Documentation](./design-documentation.md)
- Color palettes and CSS variables (light & dark mode)
- Typography system (fonts, sizing, hierarchy)
- Component design system (glass-morphism, neumorphism, buttons)
- Animation keyframes and effects
- Responsive design breakpoints
- Visual design patterns and principles

### 2. [Technology Stack](./technology-stack.md)
- Frontend technologies (React 18+, Vite, Tailwind CSS v4)
- RAG & AI components (@xenova/transformers, embeddings)
- Styling & animation tools (GSAP, Lenis)
- Build tools and configuration (ESLint, Rolldown-Vite)
- Performance characteristics and optimization strategies
- Architecture diagrams

### 3. [RAG Section Guide](./rag-section-guide.md)
- Complete RAG pipeline workflow
- Corpus loading and embedding computation
- Cosine similarity search algorithm
- Chunk parsing and rendering system
- Query processing and result display
- State management and performance optimizations
- Debugging and testing strategies

### 4. [Development Workflow](./development-workflow.md)
- Project setup and installation
- Development server (Vite) usage
- Build and production deployment process
- ESLint linting configuration
- Project structure overview
- Development best practices
- Troubleshooting common issues
- Git workflow and version control

### 5. [SEO/GEO Analysis](./seo-geo-analysis.md)
- Current meta tags and configuration
- Open Graph (OG) tags for social sharing
- Twitter Card tags
- Schema.org structured data (Person schema)
- robots.txt and sitemap.xml optimization
- Mobile optimization status
- Content optimization and keyword strategy
- Geographic/localization considerations
- Monitoring and maintenance checklist

### 6. [Portfolio Update Process](./portfolio-update-process.md)
- Complete system architecture for portfolio updates
- Data sources (GitHub repos, LinkedIn certifications)
- Agent workflow (portfolio-updater → about-editor → validators → deployment)
- File formats and standards (texts.json, about-data.txt)
- Data flow examples for common scenarios
- RAG corpus synchronization
- Troubleshooting and maintenance guide
- Testing checklist before deployment

---

## 🎯 Quick Navigation by Use Case

**I want to...**
- **Design or style something** → See [Design Documentation](./design-documentation.md)
- **Add a new dependency or understand the tech** → See [Technology Stack](./technology-stack.md)
- **Work on the RAG query feature** → See [RAG Section Guide](./rag-section-guide.md)
- **Set up development environment** → See [Development Workflow](./development-workflow.md)
- **Improve SEO/share on social media** → See [SEO/GEO Analysis](./seo-geo-analysis.md)
- **Update portfolio content from GitHub/LinkedIn** → See [Portfolio Update Process](./portfolio-update-process.md)

---

## 📋 Legacy Documentation

### Original Visual Effects Reference

This section preserves information about visual effects systems. See Design Documentation for comprehensive design system guidance.

This document serves as a comprehensive reference for all visual effects, animation logic, and architectural decisions in the project. It will be updated as new features are implemented.

## 1. Core Technology Stack & Dependencies

*   **React**: UI Library.
*   **Vite**: Build tool and dev server.
*   **Tailwind CSS**: Utility-first CSS framework.
*   **GSAP (GreenSock Animation Platform)**: Powerful animation library for scroll-triggered effects.
    *   `@gsap/react`: React hook integration.
    *   `ScrollTrigger`: Plugin for scroll-based animations.
*   **Lenis**: Specialized library for smooth, momentum-based scrolling.
*   **Lucide React**: Icon library.

## 2. Visual Effects Systems

### 2.1. Procedural Tech Background (Header)

A "living" dark mode background implemented purely in CSS to ensure performance.

*   **Implementation**: `Header.css` -> `.tech-gradient-bg`
*   **Logic**:
    *   **Base Layer**: A dark container (`#050505`) with two static radial gradients (Purple top-left, Cyan bottom-right) for depth.
    *   **Animated Overlay**: A pseudo-element `::before` with a large radial gradient (Blue/Dark Slate) that rotates 360 degrees infinitely.
    *   **Animation**: `rotateBg` keyframe animation (20s duration, linear, infinite).
*   **CSS Details**:
    *   Multiple `radial-gradient` layers used for complex color blending.
    *   `opacity` tuned to `0.3` - `0.4` for visible but subtle glow.

### 2.2. Interactive Flashlight Grid Reveal (Header)

A tech-inspired grid that is only visible around the user's cursor.

*   **Implementation**: `Header.jsx` (Logic) + `Header.css` (Style).
*   **Logic (JS)**:
    *   `onMouseMove` event handler tracks cursor position relative to the header container.
    *   Updates CSS Variables `--mouse-x` and `--mouse-y` on the container element in real-time.
*   **Style (CSS)**:
    *   **The Grid**: Created using `linear-gradient` patterns on `background-image` (1px lines, 40px spacing).
    *   **The Reveal**: `mask-image` (and `-webkit-mask-image`) uses a `radial-gradient` centered at `var(--mouse-x), var(--mouse-y)`.
        *   The mask is opaque (black) at the center and transparent at the edges, hiding the grid everywhere except the "flashlight" area.
    *   **Color**: Cyan/Electric Blue (`rgba(6, 182, 212, 0.1)`) to pop against the dark background.

### 2.3. Smooth Scrolling (Lenis)

Provides a premium, "heavy" scroll feel similar to native mobile apps but on desktop.

*   **Implementation**: `App.jsx`.
*   **Configuration**:
    *   `duration: 1.2`: Slower, more deliberate scroll physics.
    *   `easing`: Custom exponential easing function `(t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))` for a snappy start and smooth finish.
    *   **Touch Handling**: Optimized settings to ensure it doesn't fight native touch scrolling on mobile.
*   **Integration**: Syncs with GSAP's `ScrollTrigger` via `requestAnimationFrame`.

### 2.4. Scroll-Triggered Animations (GSAP)

A centralized system for animating elements as they enter the viewport.

*   **Implementation**: `hooks/useScrollAnimation.js`.
*   **Mechanism**: A custom React hook that takes a `ref` object.
*   **Animation Presets**:
    1.  **Fade Up** (`.animate-fade-up`): Element translates Y (50px -> 0) and fades in (0 -> 1).
    2.  **Stagger Container** (`.animate-stagger-container`): Parent wrapper.
        *   **Stagger Item** (`.animate-stagger-item`): Children animate in sequence with `0.1s` delay between each.
    3.  **Scale In** (`.animate-scale-in`): Element scales (0.9 -> 1) with a bouncy `back.out(1.7)` ease.
*   **Optimization**:
    *   `toggleActions: "play none none reverse"`: Plays on enter, reverses on leave (upwards).
    *   `force3D: true`: Forces hardware acceleration (GPU) to prevent jitter.
    *   `will-change`: Applied in CSS for complex elements to hint the browser.

### 2.5. Glassmorphism System

A reusable design language for cards and containers.

*   **Implementation**: `index.css` -> `.glass-card`.
*   **Styles**:
    *   `backdrop-blur-md`: Blurs content behind the card.
    *   `background-color`: Semi-transparent white/black (`rgba(255, 255, 255, 0.05)` in dark mode).
    *   `border`: 1px solid thin white border (`rgba(255, 255, 255, 0.1)`).
    *   `shadow-xl`: Deep drop shadow for elevation.
*   **Optimizations**:
    *   Removed `transition: all` to prevent conflicts with GSAP.
    *   Uses specific property transitions (`background-color`, `border-color`, `box-shadow`) for hover effects.

## 3. Component Architecture

### 3.1. Header Component
*   **DOM Structure**:
    *   `ref` container (for GSAP & Mouse Tracking).
    *   `.tech-gradient-bg` (Bottom layer).
    *   `.section-bg` (Grid layer, masked).
    *   `.hero` (Content layer, z-indexed above background).
*   **Performance**:
    *   Mouse event throttling is implicit (React synthesis), but logic is lightweight (CSS variable updates).
    *   Background animations are CSS-only (off main thread).

### 3.3. Projects Section
*   **Architecture**:
    *   **Main Container**: Iterates through project data and renders `ProjectSection` components.
    *   **ProjectSection**: A self-contained component that acts as a full-screen viewport section (`min-h-[80vh]`).
        *   **Top Section**: A 2-column layout (LG screens) with Text/Actions on the left and the Hero Image on the right.
        *   **Feature Grid**: Key features displayed in a 3-column grid below the main content.
        *   **Tech Stack**: Displayed as pill badges under the description.
*   **Animations**:
    *   Each `ProjectSection` has its own `useScrollAnimation` hook scope.
    *   Elements animate in sequence: Title -> Hero Image -> Feature Cards (Staggered) -> Tech Stack.

## 4. Known Optimizations & Fixes

1.  **React Ref Handling**:
    *   **Problem**: Passing `ref.current` to the animation hook initially resulted in `null` because the hook runs before the DOM is painted.
    *   **Fix**: Passed the full `ref` object. Used `useGSAP`'s dependency tracking to wait for `current` to be populated.

2.  **Animation Jitter / "Wavering"**:
    *   **Problem**: CSS `transition: all` on cards was fighting with GSAP's frame-by-frame transform updates.
    *   **Fix**: Removed `transition: all` and used specific transitions. Added `force3D: true` to GSAP tweens.

3.  **Mobile Performance**:
    *   **Logic**: Complex masks and heavy blurs can be taxing on mobile GPUs.
    *   **Future/Current**: Fallback media queries reduce effect complexity (e.g., removing the flashlight mask on touch devices to show the grid permanently).
