import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)

LLM_PROVIDER = os.getenv("LLM_PROVIDER", "ollama")

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
LLM_MODEL = os.getenv("LLM_MODEL", "qwen3:1.7b")
LLM_TIMEOUT = int(os.getenv("LLM_TIMEOUT", "120"))


LLM_BASE_URL = os.getenv("LLM_BASE_URL", "http://localhost:11434/v1")
LLM_API_KEY = os.getenv("LLM_API_KEY", "")


LLM_CACHE_DIR = DATA_DIR / "cache"
LLM_CACHE_DIR.mkdir(parents=True, exist_ok=True)

EMBED_MODEL = os.getenv("EMBED_MODEL", "BAAI/bge-m3")
EMBED_DEVICE = os.getenv("EMBED_DEVICE", "cpu")
BATCH_SIZE = int(os.getenv("BATCH_SIZE", "32"))


DENSE_WEIGHT = float(os.getenv("DENSE_WEIGHT", "0.7"))
BM25_WEIGHT = float(os.getenv("BM25_WEIGHT", "0.3"))

RERANKER_ENABLED = os.getenv("RERANKER_ENABLED", "true").lower() == "true"
RERANKER_MODEL = os.getenv("RERANKER_MODEL", "cross-encoder/mmarco-mMiniLMv2-L12-H384-v1")




MIN_CHUNK_CHARS = int(os.getenv("MIN_CHUNK_CHARS", "80"))
MAX_CHUNK_CHARS = int(os.getenv("MAX_CHUNK_CHARS", "2000"))

MAX_CHUNKS_PER_DOC = int(os.getenv("MAX_CHUNKS_PER_DOC", "30"))
