import React, { useState, useEffect } from "react";
import { pipeline, env } from "@xenova/transformers";
import { ChevronLeft, ChevronRight, Terminal, Search } from "lucide-react";
// Import both chunkRenderers and renderChunk from your parser
import { renderChunk } from "./rag-files/chunkParser.js";

import "@fontsource-variable/inter";
import CustomCard from "./rag-files/cards.jsx";

// Configure environment explicitly to fetch from Hugging Face CDN
env.allowLocalModels = false;
env.allowRemoteModels = true;
env.remoteModelRepo = "https://huggingface.co";

export default function QueryWithRAG() {

  // State variables 
  // Making Encoder callable after loading with setEncoder
  const [encoder, setEncoder] = useState(null);
  // Texts from corpus
  const [texts, setTexts] = useState([]);
  // Embeddings and their dimensions/count
  const [embeddings, setEmbeddings] = useState(null);
  // Embedding dimensions and count
  const [dim, setDim] = useState(0);
  // Total number of texts/chunks
  const [count, setCount] = useState(0);
  // User query and results
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  // Loading and readiness status
  const [ready, setReady] = useState(false);
  // Status message for user feedback
  const [activeIndex, setActiveIndex] = useState(0);
  // Status message for user feedback
  const [status, setStatus] = useState("Loading model and corpus...");

  // function to load the all-MiniLM-L6-v2 model to use in mounting hook
  async function loadEncoder() {
    console.log("Loading all-MiniLM-L6-v2 model...");
    const mdl = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2",
      {
        quantized: false,
      }
    );
    // Bind an embedding helper ensuring full sequence and normalization
    // embed function to the model instance - ensuring it can be called after loading
    mdl.embed = async (texts) => {
      const out = await mdl(texts, {
        pooling: "mean",
        normalize: true,
        max_length: 512,
        truncation: true,
      });
      return out;
    };
    setEncoder(() => mdl);
    return mdl;
  }

  // ----------------- Query Embedding -----------------
  async function embed(text) {
    const out = await encoder.embed(text);
    return Array.from(out.data);
  }

  // cosineTopK function to find top K similar embeddings using cosine similarity
  // qvec: query vector, k: number of top results to return
  function cosineTopK(qvec, k = 5) {
    if (!embeddings || dim <= 0 || count <= 0) return [];

    // Normalize query vector again - should already be normalized
    let qnorm = Math.hypot(...qvec);
    if (qnorm === 0) qnorm = 1;
    // Normalized query vector - qvec.map means element-wise division and normalization
    const qv = qvec.map((x) => x / qnorm);
    // Compute cosine similarities and store in scores array
    const scores = new Float32Array(count);
    // Outer loop over all embeddings for cosine similarity computation
    for (let i = 0; i < count; i++) {
      // Initialize dot product sum and norm
      let s = 0,
        norm = 0;
      // Base index for the current embedding vector calculated from i and embedding dimension
      const base = i * dim;
      // Inner loop over dimensions to compute dot product and norm
      for (let j = 0; j < dim; j++) {
        // Dot product component
        s += qv[j] * embeddings[base + j];
        // Norm component
        norm += embeddings[base + j] ** 2;
      }
      // Final cosine similarity score normalized by embedding norm
      scores[i] = s / Math.sqrt(norm);
    }
    // Get top K indices based on scores
    const idx = Array.from({ length: count }, (_, i) => i);
    // Sort indices by descending scores
    idx.sort((a, b) => scores[b] - scores[a]);
    // Return top K results with their ids, texts, and scores
    return idx.slice(0, k).map((i) => ({
      id: texts[i].id,
      text: texts[i].text,
      score: scores[i].toFixed(3),
    }));
  }

  // ----------------- Handle Search -----------------
  // ----------------- Error & Status Handling -----------------
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);

  // ----------------- Handle Search -----------------
  async function handleSearch() {
    if (!encoder || !embeddings) {
      setError("AI Model not ready. Please wait.");
      return;
    }
    const t = query.trim();
    if (!t) return;

    try {
      setError(null);
      const qv = await embed(t);
      // increased from 3 to 10 for better recall
      const top = cosineTopK(qv, 10);

      // --- Deduplication Logic ---
      // We render them speculatively to see what "Title" they belong to.
      // If multiple chunks point to "Project Gridifix", we only show the first (highest score).
      const uniqueResults = [];
      const seenTitles = new Set();

      for (const result of top) {
        // We need to 'peek' at what this chunk renders into
        // Using a lightweight version of renderAdaptiveComponent logic just for title extraction
        // Note: renderChunk is synchronous so this is fast
        const rendered = renderChunk(result, texts);

        // Handle array returns (e.g. from Education)
        const titleKey = Array.isArray(rendered)
          ? (rendered[0]?.title || "Unknown")
          : (rendered.title || "Unknown");

        // If it's a generic text chunk (no title), treat it as unique enough (unless exact dup)
        if (!rendered.title && !Array.isArray(rendered)) {
          uniqueResults.push(result);
          continue;
        }

        if (!seenTitles.has(titleKey)) {
          seenTitles.add(titleKey);
          uniqueResults.push(result);
        }
      }

      setResults(uniqueResults.slice(0, 5)); // Keep top 5 unique cards
      setActiveIndex(0);
      console.log("Query:", t, "→ top raw:", top, "→ unique:", uniqueResults);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Search failed. Please try again.");
    }
  }

  // ----------------- Main Loading Hook -----------------
  useEffect(() => {
    (async () => {
      try {
        setReady(false);
        setError(null);
        setStatus("Loading portfolio data...");
        // Use a relative path that works both locally and in some deployments, but handle 404
        const resp = await fetch("/data/texts.json");
        if (!resp.ok) throw new Error(`Data fetch failed: ${resp.statusText}. Ensure texts.json is in public/`);
        const tjson = await resp.json();
        setTexts(tjson);

        setStatus("Loading AI model (all-MiniLM-L6-v2)...");
        const mdl = await loadEncoder();

        setStatus(`Embedding ${tjson.length} chunks...`);
        const corpusTexts = tjson.map((d) => d.text);
        const corpusEmbeddings = await mdl.embed(corpusTexts);

        setEmbeddings(corpusEmbeddings.data);
        setDim(corpusEmbeddings.dims[1]);
        setCount(corpusEmbeddings.dims[0]);

        setStatus("System Ready.");
        setReady(true);
      } catch (error) {
        console.error("RAG Init Error:", error);
        setError(`Initialization failed: ${error.message}`);
        setStatus("System Error.");
      }
    })();
  }, [retrying]);

  // ----------------- Render Logic -----------------
  function renderAdaptiveComponent(chunk) {
    if (!chunk) return null;
    try {
      const rendered = renderChunk(chunk, texts);
      return (
        <CustomCard
          key={chunk.id}
          {...(Array.isArray(rendered) ? { title: rendered } : rendered)}
        />
      );
    } catch (e) {
      return <div className="text-red-400 p-4 border border-red-500 rounded">Error rendering chunk: {e.message}</div>;
    }
  }

  return (
    <div className="z-10 w-full md:w-[90%] max-w-5xl min-h-[80vh] flex flex-col my-8">

      {/* Terminal Header */}
      <div className="flex items-center justify-between px-6 py-4 glass-nav rounded-t-2xl border-b-0">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-sm"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-sm"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-sm"></div>
        </div>
        <div className="text-xs font-mono text-(--text-secondary) tracking-widest uppercase">
          Interactive RAG Terminal
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 glass-card hover:scale-100 border-t-0 rounded-b-2xl p-4 md:p-8 flex flex-col relative overflow-hidden">

        {/* Output Display */}
        <div className="relative flex-1 flex flex-col items-center justify-center min-h-[400px]">
          {error ? (
            <div className="flex flex-col items-center gap-4 text-center z-10">
              <div className="text-red-400 bg-red-950/30 border border-red-500/30 px-6 py-4 rounded-lg backdrop-blur-sm">
                <p className="font-mono text-sm">Error: {error}</p>
              </div>
              <button
                onClick={() => setRetrying(r => !r)}
                className="px-4 py-2 bg-(--text-secondary) hover:bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs rounded-full transition-colors"
              >
                Retry Initialization
              </button>
            </div>
          ) : (
            <>
              {/* Loading Overlay */}
              {!ready && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-(--bg-primary)/60 backdrop-blur-md transition-all duration-500">
                  <div className="glass-card p-8 rounded-2xl border border-(--glass-border) shadow-2xl flex flex-col items-center gap-6 max-w-sm w-full mx-4">
                    <div className="relative flex items-center justify-center w-16 h-16">
                      <div className="rounded-full border-4 border-(--text-secondary)/20 border-t-(--accent-solid) animate-spin absolute inset-0"></div>
                      <div className="relative z-10 text-accent animate-pulse">
                        <Search size={24} />
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-bold text-(--text-primary)">System Initializing</h3>
                      <p className="text-sm font-mono text-(--text-secondary)">{status}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Results Display */}
              {results.length > 0 ? (
                <div className={`w-full flex flex-col items-center transition-opacity duration-500 ${ready ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="w-full relative flex justify-center perspective-1000">
                    <div className="transform transition-all duration-500 ease-out-back w-full max-w-2xl">
                      {renderAdaptiveComponent(results[activeIndex] || results[0])}
                    </div>
                  </div>

                  {/* Pagination Controls */}
                  {results.length > 1 && (
                    <div className="flex items-center gap-4 mt-8">
                      <button
                        onClick={() => setActiveIndex((prev) => (prev - 1 + results.length) % results.length)}
                        className="p-2 rounded-full hover:bg-(--text-secondary)/10 text-(--text-secondary) hover:text-(--text-primary) transition-colors"
                        aria-label="Previous result"
                      >
                        <ChevronLeft size={20} />
                      </button>

                      <div className="flex gap-2">
                        {results.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveIndex(idx)}
                            className={`transition-all duration-300 rounded-full ${idx === activeIndex ? 'bg-(--accent) w-8 h-2' : 'bg-(--text-secondary) w-2 h-2 opacity-30 hover:opacity-100'}`}
                            aria-label={`Go to result ${idx + 1}`}
                          />
                        ))}
                      </div>

                      <button
                        onClick={() => setActiveIndex((prev) => (prev + 1) % results.length)}
                        className="p-2 rounded-full hover:bg-(--text-secondary)/10 text-(--text-secondary) hover:text-(--text-primary) transition-colors"
                        aria-label="Next result"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Empty State (Ready but no results yet) */
                ready && (
                  <div className="flex flex-col items-center justify-center text-(--text-secondary) gap-4 opacity-50">
                    <Terminal size={48} strokeWidth={1} />
                    <p className="font-mono text-sm tracking-wide">Ready for queries...</p>
                  </div>
                )
              )}
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="mt-8 relative z-20">
          <div className={`
                flex items-center gap-4 border transition-all duration-300 rounded-xl px-4 py-4
                ${ready ? 'border-(--glass-border) focus-within:border-(--text-secondary) shadow-lg bg-(--glass-bg)' : 'border-(--glass-border) opacity-50 pointer-events-none'}
            `}>
            <div className="shrink-0 text-green-500 font-mono text-sm select-none">
              user@divyesh:~ $
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Ask about my projects, skills, or background..."
              className="flex-1 bg-transparent border-none outline-none text-(--text-primary) placeholder-(--text-secondary) font-mono text-sm"
              disabled={!ready}
              autoComplete="off"
            />
            {ready && (
              <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded bg-(--text-primary)/10 border border-(--text-primary)/10">
                <span className="text-[10px] text-(--text-secondary) font-sans tracking-wide">ENTER</span>
                <svg className="w-3 h-3 text-(--text-secondary)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
