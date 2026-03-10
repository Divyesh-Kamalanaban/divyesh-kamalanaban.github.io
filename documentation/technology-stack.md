# Technology Stack Documentation - Divyesh Portfolio

## Overview
The divyesh-portfolio is a single-page React application built with Vite, featuring a client-side RAG (Retrieval-Augmented Generation) demo powered by transformer models. The stack prioritizes performance, modularity, and modern development practices.

---

## Core Frontend Technologies

### React 18+
- **Version**: 19.1.1 (from [package.json](../package.json#L12))
- **Purpose**: Component-based UI framework
- **Key Usage**:
  - [App.jsx](../src/App.jsx) - Main app component with theme switching and section routing
  - [src/sections/](../src/sections/) - Portfolio sections (Header, About, Projects, Experience, Certifications)
  - [RAG query interface](../src/sections/rag.jsx) - Interactive RAG demo
- **Hooks Used**:
  - `useState` - Theme state, query/results state, loading state
  - `useEffect` - Initialization, theme synchronization, scroll setup
  - `useRef` - Header animations, scroll tracking

### Vite
- **Version**: 7.1.14 via Rolldown-Vite (from [package.json](../package.json#L39))
- **Configuration**: [vite.config.js](../vite.config.js)
- **Features**:
  - Lightning-fast dev server with HMR (Hot Module Replacement)
  - Optimized production builds via Rolldown
  - Proxy configuration for Hugging Face CDN access (line 9-14)
- **Build Commands**:
  - `npm run dev` - Start dev server on localhost:5173 (default)
  - `npm run build` - Production build to `dist/`
  - `npm run preview` - Serve production build locally

### Tailwind CSS v4
- **Version**: 4.1.17 (from [package.json](../package.json#L10-L11))
- **Setup**: 
  - `@tailwindcss/postcss` - PostCSS plugin
  - `@tailwindcss/vite` - Vite integration plugin
- **Integration**: Imported at top of [src/index.css](../src/index.css#L1) via `@import "tailwindcss";`
- **Usage**:
  - Utility-first styling throughout all components
  - Custom CSS variables integrated with Tailwind classes
  - Responsive breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- **Custom Classes**:
  - `.glass-nav`, `.glass-card` - Glass-morphism utilities
  - `.btn-primary`, `.btn-secondary` - Button styles
  - `.section-container`, `.content-wrapper` - Layout utilities

---

## RAG & AI Technologies

### Xenova Transformers
- **Package**: `@xenova/transformers` v2.17.2 (from [package.json](../package.json#L15))
- **Alternative**: `@huggingface/transformers` v3.7.6 (redundant dependency, can be removed)
- **Purpose**: Client-side transformer model inference
- **Configuration** ([src/sections/rag.jsx](../src/sections/rag.jsx#L11-L13)):
  ```javascript
  env.allowLocalModels = false;
  env.allowRemoteModels = true;
  env.remoteModelRepo = "https://huggingface.co";
  ```

### Embedding Model: all-MiniLM-L6-v2
- **Model**: Xenova/all-MiniLM-L6-v2 (lightweight, 384-dim embeddings)
- **Pipeline**: feature-extraction with pooling ("mean") and normalization
- **Loading**: Lazy-loaded on RAG section mount ([rag.jsx line 39-54](../src/sections/rag.jsx#L39-L54))
- **Inference**: Runs entirely in browser (no server required)
- **Max Sequence Length**: 512 tokens with truncation
- **Speed**: ~100-200ms per embedding on modern GPUs/CPUs

### RAG Pipeline Components

#### 1. Corpus Loading
**File**: [src/sections/rag.jsx](../src/sections/rag.jsx#L169-L172)
```javascript
const resp = await fetch("/data/texts.json");
const tjson = await resp.json();  // Array of { id, text } objects
```
**Data Structure** (public/data/texts.json):
```json
[
  { "id": "summary_0001", "text": "AI Engineer & Systems Developer..." },
  { "id": "project_0001", "text": "[PROJECTS]\nProject: SleeQC - Sleep Quality Tracker..." },
  ...
]
```

#### 2. Embedding Computation
**Location**: [src/sections/rag.jsx](../src/sections/rag.jsx#L174-L177)
```javascript
const corpusTexts = tjson.map((d) => d.text);
const corpusEmbeddings = await mdl.embed(corpusTexts);

setEmbeddings(corpusEmbeddings.data);        // Float32Array
setDim(corpusEmbeddings.dims[1]);            // 384 for all-MiniLM-L6-v2
setCount(corpusEmbeddings.dims[0]);          // Number of chunks
```

**Embedding Storage**:
- Format: Flattened Float32Array
- Layout: `[vec0[0], vec0[1], ..., vec0[383], vec1[0], vec1[1], ...]`
- Indexing: `embeddings[i * dim + j]` for chunk i, dimension j
- Memory: ~(count × 384 × 4 bytes) = ~154KB per 100 chunks

#### 3. Query Embedding & Search
**Query Embedding** ([src/sections/rag.jsx](../src/sections/rag.jsx#L61-L65)):
```javascript
async function embed(text) {
  const out = await encoder.embed(text);
  return Array.from(out.data);  // 384-dim vector
}
```

**Cosine Similarity Search** ([src/sections/rag.jsx](../src/sections/rag.jsx#L68-L98)):
```javascript
function cosineTopK(qvec, k = 5) {
  // Normalize query vector
  let qnorm = Math.hypot(...qvec);
  const qv = qvec.map((x) => x / qnorm);
  
  // Compute dot product & norm for each document
  const scores = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    let s = 0, norm = 0;
    const base = i * dim;
    for (let j = 0; j < dim; j++) {
      s += qv[j] * embeddings[base + j];
      norm += embeddings[base + j] ** 2;
    }
    scores[i] = s / Math.sqrt(norm);  // Cosine similarity
  }
  
  // Return top K results
  return Array.from(scores)
    .map((score, i) => ({ id: i, text: texts[i].text, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}
```

**Complexity**: O(count × dim) per query (~50ms for 1000 chunks)

#### 4. Chunk Parsing & Rendering
**Parser**: [src/sections/rag-files/chunkParser.js](../src/sections/rag-files/chunkParser.js)
- Exports `renderChunk(result, texts)` function
- Handles multiple chunk types: `[SUMMARY]`, `[PROJECTS]`, `[EXPERIENCE]`, `[CERTIFICATIONS]`, `[EDUCATION]`
- Tech keyword extraction from 30+ known technologies
- Fuzzy matching for multi-chunk grouping
- Returns structured data for CustomCard rendering

**Rendering**: [src/sections/rag-files/cards.jsx](../src/sections/rag-files/cards.jsx)
- `CustomCard` component for displaying RAG results
- Accordion UI for expandable results
- Confidence scores, categories (tech stack), external links
- Icons from Lucide React

---

## Styling & Animation

### PostCSS & CSS Utilities
- **Config**: Implicit (handled by Tailwind v4)
- **Features**:
  - CSS variables for theming
  - Custom class definitions via `@layer`
  - Smooth transitions and animations

### GSAP (Greensock Animation Platform)
- **Version**: 3.13.0 (from [package.json](../package.json#L16))
- **Plugin**: `@gsap/react` 2.1.2
- **Usage** ([src/App.jsx](../src/App.jsx#L103-L110)):
  ```javascript
  gsap.registerPlugin(ScrollTrigger);
  // Scroll animations triggered via ScrollTrigger
  ```
- **Features**: Smooth scrolling sync, advanced animation timelines

### Lenis (Smooth Scroll Engine)
- **Version**: 1.3.17 (from [package.json](../package.json#L17))
- **Setup** ([src/App.jsx](../src/App.jsx#L84-L101)):
  - Duration: 1.2 seconds
  - Easing: Custom deceleration curve
  - Momentum-based physics
  - Synchronized with GSAP ticker

---

## Component Libraries

### Lucide React Icons
- **Version**: 0.553.0 (from [package.json](../package.json#L18))
- **Usage**: UI icons throughout the app
- **Icons Used**:
  - `Sun`, `Moon` - Theme toggle ([App.jsx](../src/App.jsx#L14))
  - `ChevronLeft`, `ChevronRight`, `Terminal`, `Search` - RAG interface
  - `Code`, `ExternalLink`, `Layers`, `Mail`, `Github`, `Linkedin`, `Globe`, `FileText`, `User` - Card elements
  - Various tech logos (architecture, infrastructure, etc.)
- **Benefits**: Tree-shakeable, lightweight, customizable size & color

---

## Build Tools & Configuration

### ESLint
- **Version**: 9.36.0 (from [package.json](../package.json#L31))
- **Configuration**: [eslint.config.js](../eslint.config.js)
- **Extends**:
  - `js.configs.recommended` - Core JavaScript rules
  - `reactHooks.configs.recommended-latest` - React hooks rules
  - `reactRefresh.configs.vite` - Vite Fast Refresh rules
- **Custom Rules** ([eslint.config.js](../eslint.config.js#L19-L21)):
  ```javascript
  'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }]
  // Allow unused uppercase vars (common for React components)
  ```
- **Global Ignores**: `dist/`, `divyesh-kamalanaban.github.io/`
- **Run**: `npm run lint`

### Package.json Overrides
[package.json](../package.json#L38-L40):
```json
"overrides": {
  "vite": "npm:rolldown-vite@7.1.14"
}
```
Replaces standard Vite with Rolldown-based version for faster builds.

---

## Data Files & Assets

### Corpus Data
**Location**: `public/data/texts.json` (sourced from [src/python-backend/texts.json](../src/python-backend/texts.json))

**Structure**:
```json
[
  {
    "id": "summary_0001",
    "text": "AI Engineer & Systems Developer..."
  },
  {
    "id": "[PROJECTS]_gridifix",
    "text": "[PROJECTS]\nProject: Gridifix - Smart Grid Analysis..."
  }
  ...
]
```

### Precomputed Embeddings
**Location**: `public/data/embeddings.f32` and `public/data/dim.json`

**Purpose**: 
- Optional offline precomputation to avoid runtime embedding cost
- Generated by [src/python-backend/embeddings.py](../src/python-backend/embeddings.py)
- Can be loaded instead of computing embeddings on client

**Format**:
- **embeddings.f32**: Raw binary Float32 array (little-endian)
- **dim.json**: `{ "dim": 384, "count": 450 }` metadata

### Image Assets
**Location**: `public/assets/`
- `background.png` - Optional background texture
- `github-profile-banner.png` - GitHub profile image
- `gridifix.png`, `seaquenced.png`, `sleeqc.png` - Project screenshots
- `resume.pdf` - Download link target

---

## Development Workflow

### Dependencies Overview
```
Core: React 18+, Vite, Tailwind CSS v4
AI: @xenova/transformers (browser-based embeddings)
Animation: GSAP, Lenis, Lucide Icons
Styling: PostCSS, Tailwind utilities
Dev: ESLint, Rolldown-Vite
```

### Key Npm Scripts
| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `vite` | Start dev server with HMR |
| `build` | `vite build` | Optimize & bundle for production |
| `preview` | `vite preview` | Serve production build locally |
| `lint` | `eslint .` | Check code quality |

### Node Version
- Recommended: Node 18+ (supports ES2020 features, modern npm)
- [vite.config.js](../vite.config.js) targets `ecmaVersion: 2020`

---

## Performance Characteristics

### Bundle Size (Estimated)
- React + DOM: ~40KB (gzipped)
- Tailwind CSS: ~30KB (gzipped, with utilities)
- GSAP + Lenis: ~50KB (gzipped)
- Transformers.js (all-MiniLM-L6-v2): ~230MB download (first load), cached
- Total gzipped: ~120KB (excluding models)

### Runtime Performance
- **Initial Load**: 2-5 seconds (model download + initialization)
- **Query Speed**: 50-200ms (800-1000 chunks)
- **Rendering**: <50ms (React/Tailwind)
- **Memory**: ~50MB (embeddings for 450 chunks + model)

### Optimization Strategies
1. **Lazy Model Loading**: Transformer loaded only when RAG section accessed
2. **Precomputed Embeddings**: Optional pre-embedding via Python backend
3. **Code Splitting**: Vite automatically splits chunks by route
4. **CSS Purging**: Tailwind removes unused utilities in production

---

## Deployment Considerations

### Production Build
- Located in `dist/` folder
- Rolldown-optimized for minimal size
- Static files ready for deployment to GitHub Pages or other hosts

### GitHub Pages Deployment
- Deployed to `divyesh-kamalanaban.github.io/` subdirectory
- Build output in [divyesh-kamalanaban.github.io/](../divyesh-kamalanaban.github.io/) folder
- Contains pre-built assets, data, and scripts

### Environment-Specific Configs
- **Development**: Local `public/data/` fetch
- **Production**: Deployed to `/data/` on GitHub Pages
- Model loading: Always from Hugging Face CDN (no changes needed)

---

## Technical Debt & Improvements

### Current Issues
1. **Redundant Dependency**: `@huggingface/transformers` unused (line 14, [package.json](../package.json#L14))
2. **Model Caching**: Large model download not persistently cached
3. **Embedding Computation**: No server-side fallback if client-side fails
4. **TypeScript**: Not used; type safety could improve maintainability

### Recommended Enhancements
1. Remove unused transformer dependency
2. Implement IndexedDB caching for model weights
3. Add progress indicators for long-running embeddings
4. Consider TypeScript migration for type safety
5. Add unit tests for RAG algorithms (cosineTopK, renderChunk)
6. Performance monitoring via Web Vitals

---

## Architecture Diagram

```
┌─────────────────────────────────────────────┐
│           App.jsx (React Root)              │
├─────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌────────────────┐  │
│  │  Portfolio View  │  │   RAG View     │  │
│  ├──────────────────┤  ├────────────────┤  │
│  │ Header           │  │ Query Input    │  │
│  │ About            │  │ Corpus Load    │  │
│  │ Projects         │  │ Embeddings     │  │
│  │ Experience       │  │ Search Results │  │
│  │ Certifications   │  │ CustomCard UI  │  │
│  │ Footer           │  │                │  │
│  └──────────────────┘  └────────────────┘  │
└─────────────────────────────────────────────┘
         │                       │
         ├─ Lenis/GSAP          ├─ @xenova/transformers
         ├─ Tailwind CSS        ├─ chunkParser.js
         └─ Lucide Icons        └─ cards.jsx
                                     │
                                     ├─ /data/texts.json (corpus)
                                     ├─ /data/embeddings.f32 (optional)
                                     └─ Hugging Face CDN (models)
```

