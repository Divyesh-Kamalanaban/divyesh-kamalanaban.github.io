# Retrieval-Augmented Generation (RAG) System Documentation

This document provides a comprehensive overview of the client-side RAG implementation used in the portfolio. It details the architecture, logic, and component interactions that enable the "Interactive RAG Terminal" feature.

## 1. System Overview

The RAG system is fully client-side, leveraging WebAssembly (WASM - using existing model) to run a quantized Transformer model directly in the browser. This ensures zero latency provided by server round-trips and complete privacy.

**Core Libraries:**
*   `@xenova/transformers`: Runs the embedding model in-browser.
*   `React`: Manages UI state and rendering.

**Data Flow:**
1.  **Load:** Fetch `texts.json` (corpus) and load the AI model (`all-MiniLM-L6-v2`).
2.  **Embed:** Generate vector embeddings for the corpus at startup.
3.  **Search:** Accept user query -> Embed query -> Compute Cosine Similarity -> Rank results.
4.  **Parse:** Identify the context of the retrieved text (Project? Experience?) using `chunkParser.js`.
5.  **Render:** Display the structured data using `cards.jsx` with the appropriate theme.

## 2. Component Logic

### 2.1 Main Interface (`src/sections/rag.jsx`)

This component orchestrates the entire lifecycle.

**Key Functions:**
*   `loadEncoder()`: Initializes the `feature-extraction` pipeline. It binds an `embed()` function to the model instance to handle normalization and pooling.
*   `embed(text)`: Converts a string into a 384-dimensional vector.
*   `cosineTopK(queryVec, k)`:
    *   Computes the dot product between the query vector and every corpus vector.
    *   Returns the top `k` indices sorted by similarity score.
*   `handleSearch()`: Triggers the embedding and search process when the user types a query.
*   `renderAdaptiveComponent(chunk)`: Passes the raw retrieval result to the parser for formatting.

**State Management:**
*   `ready`: Boolean ensuring the UI doesn't allow interaction until the heavy model is loaded.
*   `results`: Array of retrieved matches.
*   `activeIndex`: Controls the pagination/carousel of results.

### 2.2 The Parser (`src/sections/rag-files/chunkParser.js`)

This file is responsible for turning raw text chunks into structured UI objects. It uses regex and heuristic logic to "understand" what a chunk represents.

**Core Concept: Group Renderers**
Instead of showing just a single matching sentence, the parser retrieves *associated* chunks to present a complete picture.

**Key Renderers:**
*   **`[PROJECTS]`**:
    *   **Trigger:** When a chunk ID starts with `proj_`.
    *   **Logic:** It fetches *all* project chunks from the corpus. It then iterates through them to build a structured list of projects (Title, Description, Details, Tech Stack).
    *   **Fuzzy Focus:** It uses the *specific* text that matched the user's query ("focusChunk") to highlight the most relevant project from the list. It calculates fuzzy Token Overlap to find the best match.
    *   **Tech Stack Extraction:** It parses lines starting with "Stack:" or "Technologies:" to populate the `categories` field for pill rendering.
    *   **Keyword Scanning:** It automatically scans the text for known technologies (React, Python, etc.) to populate the stack even if believe labels are missing.
    *   **ID-Based Context Linking:** (New) It tracks the IDs of all chunks belonging to a project. If a user query matches a specific *detail* chunk (e.g., `proj_0012`), the parser uses this ID to instantly retrieve the **full project context** instead of relying on fuzzy text matching, eliminating "meaningless" isolated results.

*   **`[EXPERIENCE]`**:
    *   **Trigger:** Chunk ID starts with `exp_`.
    *   **Logic:** Similar to generic projects, but parses "Role" and "Company" structure from lines containing `—` (em-dash).
    *   **Logic:** Extracts "Skills" or "Tools" into categories.

*   **`renderChunk(chunk, allChunks)`**: The entry point. It determines which specialized renderer to use based on the chunk ID.

### 2.3 The View Layer (`src/sections/rag-files/cards.jsx`)

Renders the structured object returned by the parser.

**`CustomCard` Component:**
*   **Theme:** Uses `glass-card` classes and CSS variables (`var(--accent)`, `var(--text-primary)`) for full integration with the site's theme (Light/Dark mode compatible).
*   **Accordion:** If the data is an array (e.g., multiple matched projects), it renders an accordion list.
    *   **Active State:** Uses `bg-[var(--accent-solid)]/10` to highlight the open item.
*   **Single Card:** Renders a standard card with:
    *   Title (`text-accent`)
    *   Subtitle/Description
    *   **Categories:** Renders keys like "Tech Stack" as groups of pill badges (`bg-[var(--bg-secondary)]`).
    *   Details List
    *   Action Link (Button with accent gradient).

## 3. Data Structure (`texts.json`)

The corpus is a JSON array of objects:
```json
[
  {
    "id": "proj_crm_01",
    "text": "[PROJECTS] Project: Internship CRM — Developed a full-stack..."
  },
  {
     "id": "proj_crm_stack",
     "text": "Tech Stack: React, Node.js, MongoDB"
  }
]
```

## 4. Customization Guide

*   **Adding New Data:** Add entries to `public/texts.json`. Ensure IDs follow the convention (`proj_`, `exp_`, `edu_`) to trigger the correct parser logic.
*   **Styling:** Modify `cards.jsx` to change the layout or `index.css` to adjust the global accent variables.
*   **Search Tuning:** Adjust the `topK` parameter in `rag.jsx` (default 3) or the fuzzy matching threshold in `chunkParser.js` (default 0.3) to control result strictness.

## 5. Optimizations & Intelligence

### 5.1 Corpus Contextualization
To improve embedding retrieval accuracy, the `texts.json` corpus is pre-processed to ensure every detail chunk carries its parent context.
*   **Before:** `"Implemented a dynamic PQC engine..."` (Vague, low retrieval score for project-specific queries).
*   **After:** `"SleeQC: Implemented a dynamic PQC engine..."` (Specific, high retrieval score).

### 5.2 Context Stripping (Clean UI)
While the context prefixes ("SleeQC: ") are crucial for the AI, they are redundant for the user when displayed inside a project card.
*   The `chunkParser.js` automatically **strips** these prefixes before rendering the bullet points.
*   **Result:** The UI remains clean ("• Implemented...") while the backend enjoys high-accuracy retrieval.

### 5.3 Result Deduplication
Because the system now retrieves more candidates (`top-k=10` instead of 3) to ensure it catches relevant details, it often retrieves multiple chunks from the same project.
*   **Logic:** `rag.jsx` speculatively renders the chunks to check their Parent Title.
*   **Filter:** It filters the list to ensure **only one card per project** is displayed (the one with the highest confidence score).
*   **Benefit:** Prevents the UI from being cluttered with 3 separate cards for "Gridifix".

### 5.4 Confidence Scoring
Every result card displays a **Confidence Score** (0.00 - 1.00) derived from the Cosine Similarity between the user's query vector and the chunk's vector.
*   **Single Card:** Displayed in the top-right corner.
*   **Accordion:** Displayed as a summary badge.
*   **Utility:** Helps users understand *why* a result was returned (Opacity/Relevance).
