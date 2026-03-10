**Repository Overview**

- **Type**: Single-page React app built with `Vite` and Tailwind.
- **Purpose**: Personal portfolio with a switchable RAG (retrieval-augmented generation) demo that embeds a local corpus in the browser.
- **Key files**: `src/App.jsx`, `src/sections/rag.jsx`, `src/sections/rag-files/chunkParser.js`, `src/sections/rag-files/cards.jsx`, `public/data/texts.json`.

**Architecture & Data Flow**

- **Client-only RAG pipeline**: The app loads the corpus (`/data/texts.json`) in the browser and uses `@xenova/transformers` (`pipeline('feature-extraction')`) to compute embeddings at runtime in `src/sections/rag.jsx`.
- **Embedding storage**: Embeddings are kept in memory in a flattened Float32Array (`embeddings`) and indexed by computed `dim` and `count` (see `corpusEmbeddings.dims`). There is no vector DB or server by default.
- **Search**: Cosine similarity is computed in JS (`cosineTopK` in `rag.jsx`) over the flattened embeddings array and returns the top-K results.
- **Rendering**: Retrieved chunks are adapted for display by `renderChunk` (`src/sections/rag-files/chunkParser.js`) and rendered by card components in `src/sections/rag-files/cards.jsx`.

**Important Integration Points**

- `@xenova/transformers` config: `env.allowLocalModels = false; env.allowRemoteModels = true; env.remoteModelRepo = "https://huggingface.co"` (see `src/sections/rag.jsx`). The app expects to fetch models remotely.
- Corpus location: `public/data/texts.json` (the UI fetches `/data/texts.json`).
- Optional precomputed artifacts: There is a python helper folder `src/assets/python-backend/` that contains scripts and produced artifacts (e.g. `embeddings.f32`, `dim.json`, `texts.json`) — these can be used to precompute embeddings offline and serve them from `public/data/` to avoid runtime embedding costs.

**Developer Workflows**

- Install & Run (dev): `npm install` then `npm run dev` (uses `vite`).
- Build: `npm run build` then `npm run preview` to locally preview the production build.
- Lint: `npm run lint` runs ESLint across the repo.
- Note: `package.json` overrides `vite` with `rolldown-vite` — if you see unexpected behavior from Vite, check the `overrides` and `devDependencies` entries.

**Project-specific Patterns & Conventions**

- Fonts: Uses `@fontsource` packages imported at the top of `src/App.jsx` and sections — keep these imports in entry points.
- UI switching: `App.jsx` toggles between the static portfolio (`Header` in `src/sections/portfolio/header.jsx`) and the RAG demo (`QueryWithRAG` in `src/sections/rag.jsx`) using a simple `activeSection` state.
- Embeddings API: After loading a Xenova pipeline, the code attaches an `embed` helper to the model instance (see `loadEncoder` in `rag.jsx`) so later calls use `encoder.embed(texts)`.
- In-memory layout: Embeddings are a flattened array with layout [vec0, vec1, ...]; the dimension (`dim`) and count (`count`) determine indexing (`i*dim + j`). Follow this pattern if adding new similarity code.

**Examples from the codebase**

- Load corpus: `const tjson = await fetch("/data/texts.json").then((r) => r.json());` (`src/sections/rag.jsx`).
- Compute embeddings and set metadata:
  - `const corpusEmbeddings = await mdl.embed(corpusTexts);`
  - `setEmbeddings(corpusEmbeddings.data); setDim(corpusEmbeddings.dims[1]); setCount(corpusEmbeddings.dims[0]);`
- Search: `cosineTopK(qv, 3)` uses a flattened Float32Array and returns `{id, text, score}` objects.

**What to watch for / gotchas**

- Network/model access: The RAG demo requires network access to fetch remote models from Hugging Face (unless you preconfigure and serve local models). If running in restricted environments, precompute embeddings using the python helpers and serve the static `embeddings.f32` + `dim.json` from `public/data/`.
- Memory & performance: The current approach keeps all embeddings in memory — large corpora may cause memory pressure in the browser. Use precomputed top-level filtering or a server-side vector DB for large datasets.
- Vite override: Because `vite` is aliased to `rolldown-vite` in `package.json`, standard Vite behavior may differ slightly; if dev server issues occur, inspect `package.json` and `node_modules`.
- Duplicate Tailwind imports: Having multiple `@import "tailwindcss";` statements in CSS files can cause conflicts and result in blank pages. Ensure only one import in the main CSS file (typically `src/index.css`).
- Animation container requirement: Components using `.animate-stagger-item` cards must have a parent container with `.animate-stagger-container` class. Without this parent, the `useScrollAnimation` hook cannot find and animate the cards, leaving them invisible at `opacity-0`. This applies to all portfolio sections (Projects, Experience, Certifications).
- Async data + animations: When a component loads data asynchronously (e.g., certifications.jsx fetches from `/about-data.txt`), the scroll animation hook may run on mount BEFORE the data arrives, finding zero elements. Use a separate `useGSAP` effect with the data as a dependency to set up animations AFTER the data is loaded. Example: component loads items via `useState` + `useEffect`, then has a second `useGSAP` effect with `dependencies: [items]` to set up stagger animations once items exist in DOM.

**Where to extend or add tests**

- Add unit tests for `cosineTopK` and any utilities in `src/sections/rag-files/`.
- If adding precomputed embeddings, add an integration check that `dim.json` matches the `embeddings.f32` layout and that `texts.json` length equals `count`.

**AI Agent Workflow & Documentation Responsibilities**

All AI agents (lead-developer, documenter, etc.) must follow this process after completing each successful step or task:

1. **Update this file** (`copilot-instructions.md`) with any discovered gotchas, bugs, patterns, or lessons learned.
2. **Update respective skill files** if the agent has a dedicated skill file (e.g., `lead-developer` skill file). Record:
   - What problem was solved
   - What approach was used
   - Any mistakes encountered and how they were fixed
   - Best practices or patterns to follow for future similar tasks
3. **Keep documentation current** — if a bug is fixed, update the "What to watch for / gotchas" section. If a new pattern is established, add it to "Project-specific Patterns & Conventions".
4. **Do NOT create separate markdown files** to document individual tasks or changes unless explicitly requested. Keep all knowledge centralized in existing documentation files.

This ensures that the collective knowledge of all agents working on this project accumulates and future agents have access to proven solutions and lessons learned.

**Contact / Next steps**

- I added these instructions to help AI coding agents and new contributors boot quickly. If you want, I can also:
  - Add a short script to load precomputed `embeddings.f32` into the client for faster startup.
  - Add a small integration test validating corpus/embeddings consistency.
- **Documentation responsibility**: The `documenter` agent should maintain and update this file whenever bugs are discovered, fixes are applied, or new gotchas are encountered. When issues like the duplicate Tailwind import problem occur and are resolved, the documenter must update the "What to watch for / gotchas" section to prevent future occurrences.
