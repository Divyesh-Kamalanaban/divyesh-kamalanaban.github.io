# RAG Section Guide - Divyesh Portfolio

## Overview
The RAG (Retrieval-Augmented Generation) section provides an interactive terminal-style interface for users to query the portfolio using natural language. The system loads a corpus of portfolio data (projects, experience, skills) and uses transformer-based embeddings to find semantically similar chunks.

---

## Architecture

### System Flow
```
User Input (Query)
      │
      ▼
Encode Query → all-MiniLM-L6-v2 Model (384-dim vector)
      │
      ▼
Cosine Similarity Search (against corpus embeddings)
      │
      ▼
Top 5 Results (deduplicated by title)
      │
      ▼
Render Chunks (chunkParser extracts structure)
      │
      ▼
Display Cards (CustomCard UI component)
```

---

## RAG Implementation Details

### File Structure
```
src/sections/
├── rag.jsx                 # Main RAG component & logic
└── rag-files/
    ├── chunkParser.js      # Chunk parsing & rendering
    └── cards.jsx           # Card display component

public/data/
├── texts.json              # Corpus (source of truth)
├── embeddings.f32          # Optional precomputed embeddings
└── dim.json                # Embedding metadata
```

---

## 1. Corpus Management

### Data Source
**Location**: `public/data/texts.json`

**Structure**:
```json
[
  {
    "id": "summary_0001",
    "text": "AI Engineer & Systems Developer..."
  },
  {
    "id": "[PROJECTS]_gridifix",
    "text": "[PROJECTS]\nProject: Gridifix...\nDeveloped...\nLink: https://..."
  },
  {
    "id": "[EXPERIENCE]_nit_trichy",
    "text": "[EXPERIENCE]\nNIT Trichy — Research Intern..."
  },
  ...
]
```

### Corpus Origin
**Primary Source**: [src/python-backend/texts.json](../src/python-backend/texts.json)
- Maintained by portfolio-updater agent
- Pulled from GitHub repos, LinkedIn certifications, etc.
- Format: Header with `[CATEGORY]` tag + content

### Corpus Sections
| Tag | Purpose | Parser Function |
|-----|---------|-----------------|
| `[SUMMARY]` | Profile overview | `chunkRenderers['[SUMMARY]']` |
| `[PROJECTS]` | GitHub/portfolio projects | `chunkRenderers['[PROJECTS]']` |
| `[EXPERIENCE]` | Work experience & internships | `chunkRenderers['[EXPERIENCE]']` |
| `[CERTIFICATIONS]` | Professional certifications | `chunkRenderers['[CERTIFICATIONS]']` |
| `[EDUCATION]` | Academic background | `chunkRenderers['[EDUCATION]']` |

### Loading Corpus ([src/sections/rag.jsx](https://github.com/Divyesh-Kamalanaban/divyesh-portfolio/blob/main/src/sections/rag.jsx#L169-L172))
```javascript
async function () {
  setStatus("Loading portfolio data...");
  const resp = await fetch("/data/texts.json");
  if (!resp.ok) throw new Error(`Data fetch failed: ${resp.statusText}`);
  const tjson = await resp.json();
  setTexts(tjson);
  // tjson = Array<{ id: string, text: string }>
}
```

---

## 2. Model Loading & Initialization

### Model: Xenova/all-MiniLM-L6-v2
- **Source**: Hugging Face Hub
- **Architecture**: DistilBERT-based sentence transformer
- **Dimensions**: 384-dimensional embeddings
- **Performance**: ~50-100ms per 100 tokens on CPU
- **License**: Apache 2.0

### Loading Function ([src/sections/rag.jsx](https://github.com/Divyesh-Kamalanaban/divyesh-portfolio/blob/main/src/sections/rag.jsx#L35-L54))
```javascript
async function loadEncoder() {
  console.log("Loading all-MiniLM-L6-v2 model...");
  const mdl = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2",
    { quantized: false }
  );
  
  // Attach custom embed helper
  mdl.embed = async (texts) => {
    const out = await mdl(texts, {
      pooling: "mean",       // Aggregate token embeddings
      normalize: true,       // L2 normalization for cosine similarity
      max_length: 512,       // Truncation length
      truncation: true,      // Enable truncation
    });
    return out;  // Returns { data: Float32Array, dims: [count, 384] }
  };
  
  setEncoder(() => mdl);
  return mdl;
}
```

### Configuration ([src/sections/rag.jsx](https://github.com/Divyesh-Kamalanaban/divyesh-portfolio/blob/main/src/sections/rag.jsx#L11-L13))
```javascript
env.allowLocalModels = false;
env.allowRemoteModels = true;
env.remoteModelRepo = "https://huggingface.co";
```
- Forces remote model download from Hugging Face
- No local model caching (future optimization)

---

## 3. Embedding Computation

### Corpus Embedding ([src/sections/rag.jsx](https://github.com/Divyesh-Kamalanaban/divyesh-portfolio/blob/main/src/sections/rag.jsx#L174-L177))
```javascript
setStatus(`Embedding ${tjson.length} chunks...`);
const corpusTexts = tjson.map((d) => d.text);           // Extract text
const corpusEmbeddings = await mdl.embed(corpusTexts);  // Compute all at once

// Store results
setEmbeddings(corpusEmbeddings.data);      // Float32Array (flattened)
setDim(corpusEmbeddings.dims[1]);          // 384
setCount(corpusEmbeddings.dims[0]);        // Number of chunks (e.g., 450)
```

### Storage Format

**Memory Layout** (Float32Array):
```
embeddings[i * dim + j] = embedding[i][j]

For 450 chunks × 384 dims:
- Size: 450 × 384 × 4 bytes = 691.2 KB
- Layout: [chunk0_dim0, chunk0_dim1, ..., chunk0_dim383, chunk1_dim0, ...]
```

### Precomputed Embeddings (Optional)
**Files**: `public/data/embeddings.f32` + `public/data/dim.json`

**Current Usage**: Not loaded in app (future optimization)
**Generated by**: [src/python-backend/embeddings.py](../src/python-backend/embeddings.py)

**Metadata Format** (dim.json):
```json
{
  "dim": 384,
  "count": 450
}
```

---

## 4. Query Processing & Search

### Query Embedding ([src/sections/rag.jsx](https://github.com/Divyesh-Kamalanaban/divyesh-portfolio/blob/main/src/sections/rag.jsx#L61-L65))
```javascript
async function embed(text) {
  const out = await encoder.embed(text);
  return Array.from(out.data);  // Convert to JS array for manipulation
}
```

### Search Algorithm: Cosine Similarity ([src/sections/rag.jsx](https://github.com/Divyesh-Kamalanaban/divyesh-portfolio/blob/main/src/sections/rag.jsx#L68-L98))

```javascript
function cosineTopK(qvec, k = 5) {
  if (!embeddings || dim <= 0 || count <= 0) return [];

  // Step 1: Normalize query vector
  let qnorm = Math.hypot(...qvec);  // Euclidean norm
  if (qnorm === 0) qnorm = 1;       // Prevent division by zero
  const qv = qvec.map((x) => x / qnorm);

  // Step 2: Compute cosine similarity for all documents
  const scores = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    let s = 0,      // Dot product accumulator
        norm = 0;   // Document norm

    const base = i * dim;  // Start index for document i
    
    // Inner loop: compute dot product & norm
    for (let j = 0; j < dim; j++) {
      const val = embeddings[base + j];
      s += qv[j] * val;        // Dot product
      norm += val ** 2;        // Accumulate squared values
    }
    
    // Final cosine similarity = dot_product / (||q|| × ||doc||)
    // Already normalized query: ||q|| = 1, so just divide by ||doc||
    scores[i] = s / Math.sqrt(norm);
  }

  // Step 3: Extract top K indices
  const idx = Array.from({ length: count }, (_, i) => i);
  idx.sort((a, b) => scores[b] - scores[a]);  // Sort descending

  // Step 4: Return top K with metadata
  return idx.slice(0, k).map((i) => ({
    id: texts[i].id,
    text: texts[i].text,
    score: scores[i].toFixed(3),  // String: "0.987"
  }));
}
```

**Complexity**: O(count × dim) = O(450 × 384) ≈ 173K operations ≈ 50-100ms

### Deduplication ([src/sections/rag.jsx](https://github.com/Divyesh-Kamalanaban/divyesh-portfolio/blob/main/src/sections/rag.jsx#L124-L150))
```javascript
const uniqueResults = [];
const seenTitles = new Set();

for (const result of top) {
  const rendered = renderChunk(result, texts);
  
  // Extract title for deduplication
  const titleKey = Array.isArray(rendered)
    ? (rendered[0]?.title || "Unknown")
    : (rendered.title || "Unknown");

  // Skip if duplicate title already seen
  if (!seenTitles.has(titleKey)) {
    seenTitles.add(titleKey);
    uniqueResults.push(result);
  }
}

setResults(uniqueResults.slice(0, 5));  // Keep top 5 unique
```

**Rationale**: Multiple chunks may describe same project; show only top-scoring one.

---

## 5. Chunk Parsing & Rendering

### File: [src/sections/rag-files/chunkParser.js](../src/sections/rag-files/chunkParser.js)

### Exported Interface
```javascript
export { chunkRenderers, renderChunk };

// renderChunk(chunk, texts) → parsed object or array of objects
// Handles all [CATEGORY] types and plain text fallback
```

### Parser Functions by Category

#### Summary Parser ([lines 10-31](../src/sections/rag-files/chunkParser.js#L10-L31))
```javascript
"[SUMMARY]": (chunks = []) => ({
  title: "Summary",
  items: chunks
    .filter((c) => c.id && c.id.startsWith("summary_"))
    .map((c) => c.text.replace(/^\[SUMMARY\]\s*/i, "").trim()),
})
```

#### Projects Parser ([lines 36-158](../src/sections/rag-files/chunkParser.js#L36-L158))
Extracts:
- Project title and description
- GitHub links
- Technology stack (keyword scanning)
- Implements fuzzy matching for multi-chunk projects

**Example Parsing**:
```
Input:  "Project: SleeQC — Sleep Quality Tracker\nDeveloped...\nStack: Python, TensorFlow"
Output: {
  title: "SleeQC",
  details: ["Sleep Quality Tracker", "Developed..."],
  categories: { "Tech Stack": ["Python", "TensorFlow"] },
  link: "https://..."
}
```

#### Experience Parser ([lines 160-290](../src/sections/rag-files/chunkParser.js#L160-L290))
Extracts:
- Organization and job title
- Role description
- Skills and tools used
- Implements multi-chunk grouping with `—` separator

**Example**:
```
Input:  "NIT Trichy — Research Intern\nFocused on ML..."
Output: {
  org: "NIT Trichy",
  role: "Research Intern",
  details: ["Focused on ML..."]
}
```

### Tech Keyword Extraction
**List**: 30+ technologies ([lines 7-13](../src/sections/rag-files/chunkParser.js#L7-L13))
```javascript
const TECH_KEYWORDS = [
  "Python", "JavaScript", "TypeScript", "React", "TensorFlow", "PyTorch",
  "C++", "Docker", "Kubernetes", "AWS", "GCP", "Azure", ...
];
```

**Usage**: Automatic tech stack detection via regex matching (case-insensitive)

### Fuzzy Matching Algorithm ([lines 193-227](../src/sections/rag-files/chunkParser.js#L193-L227))
For multi-chunk grouping:
1. Try exact ID match first
2. If not found, calculate token overlap ratio
3. Match if overlap ≥ 30%

```javascript
const hitTokens = new Set(hit.split(" "));
const partTokens = new Set(parts.split(" "));
let overlap = 0;
for (const t of hitTokens) if (partTokens.has(t)) overlap++;
const ratio = overlap / Math.max(1, hitTokens.size);
```

---

## 6. Result Rendering (UI)

### Card Component: [src/sections/rag-files/cards.jsx](../src/sections/rag-files/cards.jsx)

### CustomCard Props
```jsx
<CustomCard
  title={string | array}        // Single title or array of card objects
  subtitle={string}              // Optional subtitle
  details={string | array}       // Bullet points or single paragraph
  categories={object}            // { "Tech Stack": [...], "Skills": [...] }
  items={array}                  // For summary list rendering
  link={string}                  // External URL (GitHub, etc.)
  score={string}                 // Confidence score (e.g., "0.987")
/>
```

### Accordion UI ([lines 12-65](../src/sections/rag-files/cards.jsx#L12-L65))
- Multiple cards in array → accordion behavior
- Click to expand/collapse individual cards
- Visual feedback: highlight border, background color change
- Smooth grid-transition collapse animation

### Card Sections
1. **Title** - Bold, with icon (Terminal)
2. **Subtitle** - Italic, serif font (IBM Plex Serif)
3. **Details** - Bullet list with accent dots
4. **Categories** - Tagged tech skills with `Layers` icon
5. **Link** - External link with `ExternalLink` icon
6. **Score** - Confidence score badge (top-right)

### Visual Styling
- **Glass card background** - `var(--glass-bg)`
- **Border transitions** - On open, changes to `--accent-solid` with ring
- **Icon colors** - Icons toggle between muted and accent color
- **Spacing** - `pl-2` (left border), `gap-2` between items

### Responsive Design
```jsx
<div className="w-full max-w-4xl mx-auto space-y-4">
  {/* Cards stack vertically, max-width 4xl */}
</div>
```

---

## 7. Loading States & Status Messages

### Initialization Flow ([src/sections/rag.jsx](https://github.com/Divyesh-Kamalanaban/divyesh-portfolio/blob/main/src/sections/rag.jsx#L187-L255))

```javascript
useEffect(() => {
  (async () => {
    try {
      setReady(false);
      setError(null);
      setStatus("Loading portfolio data...");
      // 1. Load corpus
      
      setStatus("Loading AI model (all-MiniLM-L6-v2)...");
      const mdl = await loadEncoder();
      // 2. Load model
      
      setStatus(`Embedding ${tjson.length} chunks...`);
      const corpusEmbeddings = await mdl.embed(corpusTexts);
      // 3. Compute embeddings
      
      setStatus("System Ready.");
      setReady(true);
    } catch (error) {
      setError(`Initialization failed: ${error.message}`);
      setStatus("System Error.");
    }
  })();
}, [retrying]);  // Re-trigger on retry button click
```

### Loading Overlay ([src/sections/rag.jsx](https://github.com/Divyesh-Kamalanaban/divyesh-portfolio/blob/main/src/sections/rag.jsx#L239-L265))
```jsx
{!ready && (
  <div className="absolute inset-0 z-50 backdrop-blur-md">
    <div className="glass-card p-8 rounded-2xl">
      <div className="animate-spin">
        <Search size={24} className="animate-pulse" />
      </div>
      <h3>System Initializing</h3>
      <p className="font-mono">{status}</p>  {/* Dynamic status text */}
    </div>
  </div>
)}
```

### Error Handling ([src/sections/rag.jsx](https://github.com/Divyesh-Kamalanaban/divyesh-portfolio/blob/main/src/sections/rag.jsx#L226-L237))
```jsx
{error ? (
  <div className="text-red-400 bg-red-950/30 border border-red-500/30">
    <p className="font-mono text-sm">Error: {error}</p>
  </div>
) : (
  // Results display
)}
```

---

## 8. Search UI & Interaction

### Search Input ([src/sections/rag.jsx](../src/sections/rag.jsx#L300-L350) - not shown in excerpts)
Typical implementation:
```jsx
<input
  type="text"
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
  placeholder="Ask about projects, skills, experience..."
  className="glass-card px-6 py-3..."
/>
<button onClick={handleSearch}>
  <Search /> Search
</button>
```

### Pagination Controls ([src/sections/rag.jsx](../src/sections/rag.jsx#L277-L298))
```jsx
{results.length > 1 && (
  <div className="flex items-center gap-4 mt-8">
    <button onClick={() => setActiveIndex((prev) => (prev - 1 + results.length) % results.length)}>
      <ChevronLeft />
    </button>
    
    <div className="flex gap-2">
      {results.map((_, idx) => (
        <button
          key={idx}
          onClick={() => setActiveIndex(idx)}
          className={`transition-all rounded-full ${
            idx === activeIndex 
              ? "bg-accent w-8 h-2"
              : "bg-text-secondary w-2 h-2 opacity-30"
          }`}
        />
      ))}
    </div>
    
    <button onClick={() => setActiveIndex((prev) => (prev + 1) % results.length)}>
      <ChevronRight />
    </button>
  </div>
)}
```

**Features**:
- Left/right arrow buttons for navigation
- Dot indicators showing active result
- Click dot to jump to specific result
- Wraps around (circular navigation)

---

## 9. Terminal-Style Header

### Design Components ([src/sections/rag.jsx](../src/sections/rag.jsx#L258-L265))
```jsx
<div className="flex items-center justify-between px-6 py-4 glass-nav rounded-t-2xl">
  <div className="flex items-center gap-2">
    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />  {/* Red */}
    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />  {/* Yellow */}
    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />  {/* Green */}
  </div>
  <div className="text-xs font-mono uppercase tracking-widest">
    Interactive RAG Terminal
  </div>
</div>
```

**Styling**:
- Mimics macOS terminal window controls
- Glass-nav background with subtle blur
- Monospace font for authentic terminal feel

---

## 10. State Management

### Hooks Usage
```javascript
// Model & Data
const [encoder, setEncoder] = useState(null);
const [texts, setTexts] = useState([]);
const [embeddings, setEmbeddings] = useState(null);
const [dim, setDim] = useState(0);
const [count, setCount] = useState(0);

// Query & Results
const [query, setQuery] = useState("");
const [results, setResults] = useState([]);
const [activeIndex, setActiveIndex] = useState(0);

// UI State
const [ready, setReady] = useState(false);
const [status, setStatus] = useState("Loading...");
const [error, setError] = useState(null);
const [retrying, setRetrying] = useState(false);
```

### Data Flow Summary
```
texts: {id, text}[]
     ↓
embeddings: Float32Array (flattened, dim=384)
dim, count: metadata
     ↓
encoder: Xenova pipeline (callable)
     ↓
[User enters query] → embed(query) → cosineTopK() → results
     ↓
results: {id, text, score}[]
     ↓
renderChunk(result) → parsed structure
     ↓
<CustomCard {...parsed} />
```

---

## 11. Performance Optimizations

### Current
1. **Lazy Loading**: Model loaded only on RAG section mount
2. **Batch Embedding**: All corpus chunks embedded together (efficient)
3. **Deduplication**: Avoids showing multiple chunks from same project
4. **Top-K Limit**: Limits search to top 10, displays top 5 unique

### Potential Future Improvements
1. **IndexedDB Caching**: Cache model weights to avoid re-download
2. **Web Workers**: Move embedding computation to background thread
3. **Precomputed Embeddings**: Load from `embeddings.f32` instead of computing
4. **Sparse Retrieval**: BM25-style keyword matching as first-pass filter
5. **Server-Side Option**: Fallback to server-side embeddings for large corpora
6. **Streaming Results**: Show results as they're ranked, not all at once

---

## 12. Debugging & Testing

### Console Logs
```javascript
// In cosineTopK and handleSearch
console.log("Query:", t, "→ top raw:", top, "→ unique:", uniqueResults);
```

### Error Scenarios to Test
1. Network error loading texts.json → shows error message
2. Model download failure → retry button available
3. Empty query → silently ignored
4. Very long query (>512 tokens) → truncated by model
5. No matching results → empty results array

### Manual Testing Checklist
- [ ] Test various queries (skills, projects, experience)
- [ ] Verify pagination works with multiple results
- [ ] Check responsive layout on mobile
- [ ] Monitor network tab for model download
- [ ] Check console for errors/warnings
- [ ] Test theme switching doesn't reset RAG state

---

## Integration Points

### With Main App
- **Activation**: Set `activeSection === "rag-query"` in [App.jsx](../src/App.jsx#L128)
- **Theme Sync**: Uses global `--bg-primary`, `--text-primary` variables
- **Animations**: Inherits Lenis smooth scroll and GSAP setup (no per-section config)

### With Data Management
- **Corpus Updates**: Pull from portfolio-updater agent output
- **Embedding Updates**: Recompute if corpus changes significantly
- **Version Control**: Track embeddings.f32 version with dim.json

---

## References

- [Xenova Transformers](https://github.com/xenova/transformers.js)
- [all-MiniLM-L6-v2 Model Card](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2)
- [Cosine Similarity](https://en.wikipedia.org/wiki/Cosine_similarity)
- [Mean Pooling for Embeddings](https://huggingface.co/tasks/feature-extraction)

