# Development Workflow Documentation - Divyesh Portfolio

## Overview
This document outlines the complete development workflow for the divyesh-portfolio, including local setup, development server usage, build processes, linting, and best practices.

---

## Table of Contents
1. [Project Setup](#project-setup)
2. [Development Server](#development-server)
3. [Build Process](#build-process)
4. [Linting & Code Quality](#linting--code-quality)
5. [Project Structure](#project-structure)
6. [Development Best Practices](#development-best-practices)
7. [Troubleshooting](#troubleshooting)
8. [Git Workflow](#git-workflow)

---

## Project Setup

### Prerequisites
- **Node.js**: 18+ (LTS recommended)
- **npm**: 9+ (included with Node.js)
- **Git**: For version control
- **Code Editor**: VS Code recommended

### Initial Setup Steps

#### 1. Clone Repository
```bash
git clone https://github.com/Divyesh-Kamalanaban/divyesh-portfolio.git
cd divyesh-portfolio
```

#### 2. Install Dependencies
```bash
npm install
```

**What this installs** ([package.json](../package.json)):
- **Production** (15 packages): React, Vite, Tailwind, GSAP, Transformers, @fontsource variants, Lenis, Lucide, etc.
- **Development** (9 packages): ESLint + 3 plugins, TypeScript types, Vitejs/plugin-react, globals, vite (rolldown-vite override)
- **Overrides**: Replaces Vite with rolldown-vite for faster builds

**Duration**: Typically 2-5 minutes (first time with full downloads)

#### 3. Verify Installation
```bash
npm run lint          # Should pass with 0 errors
npm run dev          # Start dev server (Ctrl+C to stop)
```

### Tree Structure Overview
```
divyesh-portfolio/
├── package.json              # Dependencies & scripts
├── vite.config.js            # Build configuration
├── eslint.config.js          # Linting rules
├── index.html                # HTML entry point (important!)
│
├── src/
│   ├── App.jsx               # Root component
│   ├── App.css               # Legacy styles (minimal)
│   ├── index.css             # Global styles & Tailwind import
│   ├── main.jsx              # React app mount point
│   │
│   ├── hooks/
│   │   └── useScrollAnimation.js
│   │
│   ├── sections/
│   │   ├── rag.jsx           # RAG query interface
│   │   └── portfolio/        # Portfolio sections
│   │       ├── header.jsx
│   │       ├── about.jsx
│   │       ├── projects.jsx
│   │       ├── experience.jsx
│   │       ├── certifications.jsx
│   │       ├── footer.jsx
│   │       └── header.css
│   │
│   ├── rag-files/
│   │   ├── chunkParser.js    # RAG parsing logic
│   │   └── cards.jsx         # Results rendering
│   │
│   ├── assets/
│   └── python-backend/       # Optional python utilities
│       ├── embeddings.py     # Precompute embeddings
│       └── chunker.py        # Corpus generation
│
├── public/
│   ├── assets/
│   │   ├── resume.pdf
│   │   └── images/
│   ├── data/
│   │   ├── texts.json        # Corpus
│   │   ├── embeddings.f32    # Optional precomputed
│   │   └── dim.json          # Embedding metadata
│   ├── robots.txt
│   └── sitemap.xml
│
├── documentation/            # Documentation files
├── dist/                    # Build output (generated)
└── divyesh-kamalanaban.github.io/  # GitHub Pages deployment
```

---

## Development Server

### Starting Dev Server
```bash
npm run dev
```

**Output**:
```
  VITE v7.1.14  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

### Features
- **HMR (Hot Module Replacement)**: Changes reflect instantly
- **Fast Refresh**: Preserves component state when editing
- **Automatic Reload**: On CSS changes, HTML updates
- **Error Overlay**: Displays errors directly in browser

### Accessing the App
1. Open browser to `http://localhost:5173/`
2. Two main sections:
   - **Portfolio Mode**: Default view showing header, projects, experience
   - **RAG Mode**: Query interface (click "RAG Mode" in nav)

### Dev Server Configuration
[vite.config.js](../vite.config.js):
```javascript
export default {
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/hf": {
        target: "https://huggingface.co",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/hf/, ""),
      },
    },
  },
};
```

**Proxy Note**: `/hf` routes redirect to Hugging Face (currently unused, for future optimization)

### Stopping Dev Server
- Terminal: `Ctrl+C` or `Cmd+C`
- Browser: Just close the tab (port is freed)

---

## Build Process

### Production Build
```bash
npm run build
```

**What Happens**:
1. Imports Vite & Tailwind config
2. Bundles all JS/JSX files
3. Minifies CSS (removes unused Tailwind utilities)
4. Optimizes images & assets
5. Generates source maps (if enabled)
6. Outputs to `dist/` folder

**Duration**: 10-30 seconds
**Output Size** (estimated):
- `dist/index.html`: ~2KB
- `dist/index-*.js`: ~120KB (gzipped)
- `dist/index-*.css`: ~30KB (gzipped)

### Preview Production Build
```bash
npm run preview
```

**What Happens**:
1. Builds project (if not already built)
2. Serves `dist/` folder locally
3. Allows testing production bundle before deployment

**Important**: Preview does NOT use HMR; changes require manual rebuild + refresh

### Build Output Example
```
dist/
├── index.html                    # Minified entry
├── index-CdCOSNbE.js            # Main bundle (hashed)
├── index-DAnf3uEt.css           # Compiled CSS
└── vite.svg                      # Copied assets

# Also served:
public/
├── assets/resume.pdf
├── data/texts.json
└── robots.txt
```

### Build Configuration Details
- **Bundler**: Rolldown (Rust-based, faster than esbuild)
- **CSS Purging**: Tailwind automatically removes unused utilities
- **Code Splitting**: Lazy-loaded components split into separate chunks
- **Source Maps**: Generated for debugging (can be disabled for smaller build)

---

## Linting & Code Quality

### Running ESLint
```bash
npm run lint
```

**Output Examples**:
```
# No errors
✓ No errors found

# With errors
src/App.jsx
  10:5  error  Unused variable 'foo'
```

### ESLint Configuration
[eslint.config.js](../eslint.config.js):

```javascript
export default defineConfig([
  globalIgnores(['dist', 'divyesh-kamalanaban.github.io']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
]);
```

### Extended Rule Sets

| Config | Purpose | Rules Applied |
|--------|---------|----------------|
| `js.configs.recommended` | Core JavaScript | no-unused-vars, no-undef, etc. |
| `react-hooks` | React Hooks validation | dependency-list, rules of hooks |
| `react-refresh` | Hot Module Replacement safe | Prevents invalid Fast Refresh |

### Custom Rules

**`no-unused-vars` Exception**: 
- Allows unused uppercase identifiers (`^[A-Z_]`)
- Reason: React components (PascalCase) sometimes imported for side effects
- Example: Importing a component but not rendering it in JSX

### Fixing Linting Errors
Most errors can be auto-fixed:

```bash
# Attempt auto-fix (not all rules can be fixed automatically)
npx eslint . --fix
```

**Common Fixable Issues**:
- Unused variables (delete them)
- Missing semicolons
- Quote inconsistencies
- Whitespace problems

**Manual Review Required**:
- React hooks dependency issues
- Logic errors (no-unreachable, etc.)

---

## Project Structure Guide

### src/ Directory

#### Entry Point
- **main.jsx**: Mounts React app to #app div
- **App.jsx**: Root component with routing logic, theme management
- **index.css**: Global styles, Tailwind import, CSS variables

#### Components Organization
```
sections/
├── rag.jsx                          # RAG interface (~350 lines)
└── portfolio/
    ├── header.jsx                   # Hero section
    ├── about.jsx
    ├── projects.jsx
    ├── experience.jsx
    ├── certifications.jsx
    ├── footer.jsx
    └── header.css                   # Header-specific styles

rag-files/
├── chunkParser.js                   # Chunk parsing logic
└── cards.jsx                        # Result card rendering
```

#### Styles
```
src/
├── App.css                          # Legacy (minimal)
├── index.css                        # Primary global styles
│   - Tailwind import
│   - CSS variables
│   - Custom utility classes
│   - Keyframe animations
│
sections/portfolio/
└── header.css                       # Header-specific animations
```

#### Utilities
```
hooks/
└── useScrollAnimation.js            # Hook for scroll animations
```

#### Assets
```
assets/
├── react.svg                        # Logo
└── python-backend/                  # Optional Python utilities
    ├── chunker.py                   # Corpus generator
    ├── embeddings.py                # Embedding pre-computation
    └── texts.json                   # Source data reference
```

### public/ Directory
Static files, NOT processed by Vite, served as-is:

```
public/
├── assets/
│   ├── resume.pdf                   # Download link
│   ├── github-profile-banner.png
│   ├── gridifix.png                 # Project screenshots
│   ├── seaquenced.png
│   └── sleeqc.png
│
├── data/
│   ├── texts.json                   # Corpus (fetched by RAG)
│   ├── embeddings.f32               # Optional precomputed
│   ├── dim.json                     # Embedding metadata
│   └── portfolio.txt                # Legacy reference
│
├── robots.txt                       # SEO: search engine rules
├── sitemap.xml                      # SEO: site structure
└── about-data.txt                   # Generated by portfolio-updater
```

**Important**: Public files are served at root `/`:
- `/data/texts.json` (not `/public/data/texts.json`)
- `/assets/resume.pdf` (not `/public/assets/resume.pdf`)

### Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies, scripts, metadata |
| `vite.config.js` | Build & dev server configuration |
| `eslint.config.js` | Linting rules |
| `index.html` | HTML template, meta tags (SEO) |
| `tailwind.config.js` | Not present (Vite plugin handles it) |

---

## Development Best Practices

### Naming Conventions
- **Components**: PascalCase (e.g., `Header`, `CustomCard`)
- **Variables/Functions**: camelCase (e.g., `setStatus`, `renderChunk`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `TECH_KEYWORDS`)
- **CSS Classes**: kebab-case (e.g., `glass-card`, `hero-text`)

### File Organization
1. **Imports**: First external, then relative (alphabetical)
   ```javascript
   import React, { useState } from "react";
   import "@fontsource-variable/manrope";
   import { renderChunk } from "./chunkParser.js";
   ```

2. **Functions**: Avoid top-level async functions in components
   ```javascript
   // ❌ Bad
   export default async function MyComponent() { }
   
   // ✅ Good
   export default function MyComponent() {
     useEffect(() => { async function... }, [])
   }
   ```

3. **Props**: Destructure in function signature
   ```javascript
   // ✅ Good
   function CustomCard({ title, details, link }) { }
   
   // ❌ Avoid
   function CustomCard(props) { const { title } = props; }
   ```

### State Management
- **Local State**: Use `useState` for component-specific state
- **Global State**: CSS variables for theme, localStorage for persistence
- **Effects**: Use `useEffect` with proper dependency arrays
  ```javascript
  // ❌ Bad - infinite loop
  useEffect(() => { setState(...) }) // Missing deps
  
  // ✅ Good
  useEffect(() => { setState(...) }, [dependency])
  
  // ✅ Good - no dependencies needed
  useEffect(() => { ... }, [])
  ```

### Styling Guidelines
1. **Utility First**: Prefer Tailwind utilities over custom CSS
   ```jsx
   {/* ✅ Good */}
   <div className="px-6 py-4 rounded-lg bg-gray-100">
   
   {/* ❌ Avoid when possible */}
   <div style={{ padding: '24px 24px', borderRadius: '8px' }}>
   ```

2. **CSS Variables**: Use theme variables for consistency
   ```css
   /* ✅ Good */
   color: var(--text-primary);
   background: var(--glass-bg);
   
   /* ❌ Avoid hardcoding */
   color: #121212;
   ```

3. **Responsive**: Use Tailwind breakpoints
   ```jsx
   {/* ✅ Good */}
   <h1 className="text-7xl md:text-9xl lg:text-10xl">
   
   {/* ❌ Avoid inline media queries if possible */}
   <h1 style="@media (min-width: 768px) { font-size: 96px; }">
   ```

### Performance Considerations
1. **Lazy Components**: Use React.lazy for route-based splitting
   ```javascript
   const RAGComponent = lazy(() => import('./rag.jsx'));
   ```

2. **Memoization**: Use when props don't change frequently
   ```javascript
   export default memo(function Card({ data }) { ... })
   ```

3. **Key Props**: Always provide unique keys in lists
   ```jsx
   {results.map((r, idx) => (
     <CustomCard key={r.id || idx} {...r} />
   ))}
   ```

### Error Handling
```javascript
// ✅ Try-catch for async
try {
  const data = await fetch('/data/texts.json');
} catch (error) {
  console.error('Fetch error:', error);
  setError(error.message);
}

// ✅ Error boundaries for React errors
{error && (
  <div className="text-red-400">
    Error: {error}
    <button onClick={retry}>Retry</button>
  </div>
)}

// ❌ Avoid silent failures
// const data = await fetch(...); // No error handling!
```

---

## Troubleshooting

### Common Issues

#### 1. Port 5173 Already in Use
```bash
# Error: EADDRINUSE: address already in use :::5173

# Solution 1: Find & kill process
lsof -i :5173
kill -9 <PID>

# Solution 2: Use different port
npm run dev -- --port 3000
```

#### 2. Module Not Found Errors
```bash
# Error: Cannot find module './src/sections/RAG.jsx'

# Causes: Case sensitivity (Windows vs. Linux), missing file
# Solution: Check actual filename (case-sensitive!)
ls src/sections/ | grep -i rag  # Verify exact name
```

#### 3. Styling Issues in Dev vs. Production
```bash
# Dev looks correct, production doesn't

# Cause: Tailwind CSS purging in production
# Solution: Check that class names are complete:

# ❌ Wrong - dynamic, gets purged
<div className={`p-${spacing}`}>

# ✅ Right - static class names
<div className={spacing === 'lg' ? 'p-6' : 'p-4'}>

# Or use inline fallback:
<div style={{ padding: `${spacing}px` }}>
```

#### 4. Git Conflicts After Pull
```bash
# Error: CONFLICT (content merge): src/sections/rag.jsx

# Resolve:
git status                           # See conflicts
git diff                             # Review changes
# Edit files manually to resolve
git add <file>
git commit -m "Resolve merge conflict"
git push
```

#### 5. Out of Disk Space for node_modules
```bash
# node_modules/ can be large (~500MB uncompressed)

# Solutions:
npm ci                               # Cleaner install
npm ci --prefer-offline              # Faster (uses cache)
rm -rf node_modules && npm install   # Fresh start

# Check size:
du -sh node_modules
```

### Debug Mode

#### Browser DevTools
1. **F12 or DevTools** - Open developer tools
2. **Console Tab** - Check for errors
   - Look for RAG initialization logs
   - Check fetch requests to `/data/texts.json`
3. **Network Tab** - Monitor:
   - Model download (large file from Hugging Face)
   - Corpus JSON request
4. **Storage Tab** - Check localStorage for theme setting

#### Server-Side Debugging
```javascript
// In rag.jsx, add logging:
console.log("Query:", query);
console.log("Embeddings shape:", dim, count);
console.log("Top results:", results);

// Watch state:
console.log("Status:", status, "Ready:", ready);
```

#### Performance Profiling
```javascript
// Measure embedding time:
console.time("embeddings");
const corpusEmbeddings = await mdl.embed(corpusTexts);
console.timeEnd("embeddings");

// Output: "embeddings: 2345ms"
```

---

## Git Workflow

### Branch Strategy
- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/***: Individual feature/bug fixes

### Typical Workflow
```bash
# 1. Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/add-dark-mode

# 2. Make changes & commit locally
git add src/App.jsx
git commit -m "feat: implement dark mode toggle"

# 3. Push to remote
git push origin feature/add-dark-mode

# 4. Create Pull Request (GitHub UI)
# - Review, discuss, request changes
# - CI runs linting & tests

# 5. Merge to develop
git checkout develop
git pull origin develop
git merge feature/add-dark-mode
git push origin develop

# 6. Deploy develop to production when ready
```

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: feat, fix, docs, refactor, perf, test
**Scope**: Component name or feature area
**Subject**: Brief, imperative tense (max 50 chars)

**Examples**:
```
feat(rag): add deduplication for search results
fix(header): resolve animation timing issue
docs(setup): add installation instructions
refactor(styles): consolidate CSS variables
```

### Before Committing
```bash
npm run lint           # Fix linting errors
npm run build         # Ensure build succeeds
git status            # Review changes
```

---

## Environment Variables (Optional)

Currently, no `.env` file is used. If needed in future:

```bash
# Create .env in project root
VITE_API_URL=https://api.example.com
VITE_MODEL_NAME=Xenova/all-MiniLM-L6-v2

# Access in code:
console.log(import.meta.env.VITE_API_URL)

# Add to .gitignore
.env
.env.local
```

**Note**: Only variables prefixed with `VITE_` are exposed to client code for security.

---

## Deployment

### Build & Deploy to GitHub Pages
```bash
# 1. Build project
npm run build

# 2. Copy dist/ to deployment folder
cp -r dist/* divyesh-kamalanaban.github.io/

# 3. Commit & push
cd divyesh-kamalanaban.github.io
git add .
git commit -m "deploy: update portfolio"
git push origin main
```

### Verification
- Site live at: https://divyesh-kamalanaban.github.io/
- Check: `public/data/texts.json` is accessible at `/data/texts.json`
- Check: `public/robots.txt` is served at `/robots.txt`

---

## Performance Optimization Checklist

- [ ] Run `npm run build` and check bundle size
- [ ] Use Lighthouse to audit performance
- [ ] Check network tab for unused dependencies
- [ ] Verify CSS is minified in production
- [ ] Test on slow 3G network (DevTools throttling)
- [ ] Minimize re-renders with memoization where needed
- [ ] Lazy-load routes if adding more pages

