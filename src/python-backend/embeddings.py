import json, numpy as np
from sentence_transformers import SentenceTransformer

# ------------------- Load Model -------------------
print("Loading all-MiniLM-L6-v2...")
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

# ------------------- Load Corpus -------------------
with open("src/python-backend/texts.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Embed the raw text directly. This model is symmetric.
texts = [d["text"] for d in data]

# ------------------- Encode -------------------
print(f"Embedding {len(texts)} chunks...")
embeddings = model.encode(texts, normalize_embeddings=True)
x = np.array(embeddings, dtype="float32")

print("Shape:", x.shape)
expected_size = x.shape[0] * x.shape[1]
print(f"Expected size = {expected_size}, Actual size = {x.size}")

# ------------------- Export -------------------
x.tofile("src/python-backend/embeddings.f32")
with open("src/python-backend/dim.json", "w") as f:
    json.dump({"dim": x.shape[1], "count": x.shape[0]}, f)

# Sanity check
print("Sample similarity matrix (3x3):")
sim = np.dot(x[:3], x[:3].T)
print(sim)
