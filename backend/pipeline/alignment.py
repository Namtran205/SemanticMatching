import re
import numpy as np
from typing import List, Dict, Any, Optional

from ..core.bm25_scorer import BM25Scorer
from ..core.embedding_manager import get_embedder
from ..config import DENSE_WEIGHT, BM25_WEIGHT

def _compute_dense_scores(texts_a: List[str], texts_b: List[str],
                          vecs_a: Optional[np.ndarray] = None,
                          vecs_b: Optional[np.ndarray] = None) -> np.ndarray:
    if vecs_a is not None and vecs_b is not None:
        return np.dot(vecs_a, vecs_b.T)

    embedder = get_embedder()
    vecs_a = embedder.encode(texts_a, normalize_embeddings=True)
    vecs_b = embedder.encode(texts_b, normalize_embeddings=True)
    return np.dot(vecs_a, vecs_b.T)

def _compute_bm25_scores(texts_a: List[str], texts_b: List[str]) -> np.ndarray:
    bm25 = BM25Scorer(texts_b)
    sparse_scores = np.array([bm25.score(t) for t in texts_a])
    max_sparse = sparse_scores.max()
    if max_sparse > 0:
        sparse_scores = sparse_scores / max_sparse
    return sparse_scores

def _hybrid_score_matrix(texts_a: List[str], texts_b: List[str],
                         vecs_a: Optional[np.ndarray] = None,
                         vecs_b: Optional[np.ndarray] = None) -> np.ndarray:
    dense_scores = _compute_dense_scores(texts_a, texts_b, vecs_a, vecs_b)
    sparse_scores = _compute_bm25_scores(texts_a, texts_b)
    return DENSE_WEIGHT * dense_scores + BM25_WEIGHT * sparse_scores


