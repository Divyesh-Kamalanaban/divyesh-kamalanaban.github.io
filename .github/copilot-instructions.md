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

**Where to extend or add tests**

- Add unit tests for `cosineTopK` and any utilities in `src/sections/rag-files/`.
- If adding precomputed embeddings, add an integration check that `dim.json` matches the `embeddings.f32` layout and that `texts.json` length equals `count`.

**Contact / Next steps**

- I added these instructions to help AI coding agents and new contributors boot quickly. If you want, I can also:
  - Add a short script to load precomputed `embeddings.f32` into the client for faster startup.
  - Add a small integration test validating corpus/embeddings consistency.
