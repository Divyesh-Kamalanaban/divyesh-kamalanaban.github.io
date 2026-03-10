import re
import json
import numpy as np
from sentence_transformers import SentenceTransformer
from tensorboard import summary

# -------- Load Embedding Model --------
print("Loading model: all-MiniLM-L6-v2 ...")
model = SentenceTransformer("all-MiniLM-L6-v2")

# -------- Sentence Splitter --------
def naive_sent_split(text):
    text = re.sub(r"\s+", " ", text).strip()
    sentences = re.split(r"(?<=[.!?])\s+(?=[A-Z])", text)
    return [s.strip() for s in sentences if s.strip()]

# -------- Semantic Chunking --------
def semantic_chunk(paragraph, threshold=0.58, max_chunk_size=5):
    text = re.sub(r"\s+", " ", paragraph).replace("–", "-").strip()
    sentences = naive_sent_split(text)
    if not sentences:
        return []

    merged = []
    buffer = ""
    for s in sentences:
        if len(s.split()) < 3:
            buffer += " " + s
        else:
            if buffer:
                merged.append((buffer + " " + s).strip())
                buffer = ""
            else:
                merged.append(s)
    if buffer:
        if merged:
            merged[-1] += " " + buffer
        else:
            merged.append(buffer.strip())

    if len(merged) <= 1:
        return [text]

    embeddings = model.encode(merged, normalize_embeddings=True)
    chunks, current_chunk = [merged[0]], []

    for i in range(1, len(merged)):
        sim = np.dot(embeddings[i - 1], embeddings[i])
        if sim < threshold or len(current_chunk) >= max_chunk_size:
            chunks.append(" ".join(current_chunk))
            current_chunk = [merged[i]]
        else:
            current_chunk.append(merged[i])

    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return [c.strip() for c in chunks if c.strip()]

def derive_prefix(line, prev_prefix):
    l = line.lower()
    if "[summary]" in l:
        return "summary"
    if "[projects]" in l or "project:" in l:
        return "proj"
    if "[experience]" in l or "intern" in l:
        return "exp"
    if "[certifications]" in l or "certificate" in l or "certification" in l:
        return "cert"
    if "[skills]" in l:
        return "skills"
    if "[education]" in l or "bachelor" in l or "cgpa" in l or "study" in l:
        return "edu"
    if "[contact]" in l or "email" in l or "linkedin" in l or "github" in l:
        return "contact"
    # if no new tag, keep previous section
    return prev_prefix

def treegenerator ():
    section_names = ["summary", "proj", "exp", "cert", "skills", "edu", "contact"]
    tree = {"name": "root", "children": []}
    for section in section_names:
        tree["children"].append({"name": section, "children": []})
    
    return tree

# ------------------ main ------------------
if __name__ == "__main__":
    with open("src/python-backend/portfolio.txt", "r", encoding="utf-8") as f:
        text = f.read()

    paragraphs = [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]

    output = []
    section_counters = {}
    current_prefix = "summary"
    tree = treegenerator()
    defaultType = {
        "summary": "overview",
        "proj": "implementation",
        "exp": "practical",
        "skills": "meta",
        "cert": "credential",
        "edu": "background",
        "contact": "meta"
    };
    tagKeywords = {
        "tinyml": ["tinyml", "tensorflow lite", "tflm"],
        "esp32": ["esp32", "esp-idf"],
        "cryptography": ["cryptograph", "pqc", "dilithium", "ml-dsa"],
        "ml": ["machine learning", "deep learning", "neural"],
        "ai": ["ai", "artificial intelligence"],
        "web": ["react", "node", "frontend", "backend", "mern"],
        "python": ["python"],
        "power": ["grid", "power flow", "pandapower"],
        "bio": ["edna", "bioinformatic", "taxonomy"]
    };


    for para in paragraphs:
        current_prefix = derive_prefix(para, current_prefix)
        sub_chunks = semantic_chunk(para, threshold=0.58, max_chunk_size=5)

        for chunk in sub_chunks:
            section_counters[current_prefix] = section_counters.get(current_prefix, 0) + 1
            chunk_id = f"{current_prefix}_{section_counters[current_prefix]:04d}"
            token_count = len(chunk.split())
            tree["children"][["summary", "proj", "exp", "cert", "skills", "edu", "contact"].index(current_prefix)]["children"].append({
                "id": chunk_id,
                "text": chunk,
                "tokens": token_count,
                "category": current_prefix,
                "type": defaultType[current_prefix],
                "tags": [tag for tag, keywords in tagKeywords.items() if any(kw in chunk.lower() for kw in keywords)],
                "abstraction-level": "detailed" if token_count > 50 else "concise" if token_count > 20 else "brief"
            })
            output.append({
                "id": chunk_id,
                "text": chunk,
                "tokens": token_count,
                "category": current_prefix
            })

    with open("src/python-backend/texts.json", "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    with open("src/python-backend/tree.json", "w", encoding="utf-8") as f:
        json.dump(tree, f, indent=2, ensure_ascii=False)
    print(tree)
    print(f"Generated {len(output)} chunks across {len(section_counters)} sections.")
