from sentence_transformers import SentenceTransformer
from ..config import EMBED_MODEL, EMBED_DEVICE

_embedder = None


def get_embedder() -> SentenceTransformer:
    global _embedder
    if _embedder is None:
        print(f"Loading embedding model: {EMBED_MODEL} on {EMBED_DEVICE}...")
        _embedder = SentenceTransformer(EMBED_MODEL, device=EMBED_DEVICE)
        print(f"Embedding model loaded.")
    return _embedder


