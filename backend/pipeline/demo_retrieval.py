import time
import numpy as np
from typing import List, Dict, Any
from .alignment import _hybrid_score_matrix
from ..core.reranker import rerank_matrix, is_reranker_available

def run_demo_retrieval(chunks_a: List[Dict], chunks_b: List[Dict], top_k: int = 5) -> Dict[str, Any]:
    pipeline_start = time.time()
    
    texts_a = [ca.get("embed_text", ca.get("content", "")) for ca in chunks_a]
    texts_b = [cb.get("embed_text", cb.get("content", "")) for cb in chunks_b]
    
    vecs_a = None
    vecs_b = None
    if all("_vector" in c for c in chunks_a):
        vecs_a = np.array([c["_vector"] for c in chunks_a])
    if all("_vector" in c for c in chunks_b):
        vecs_b = np.array([c["_vector"] for c in chunks_b])
        
    print(f"Calculating hybrid scores for {len(texts_a)}x{len(texts_b)} matrix...")
    hybrid_scores = _hybrid_score_matrix(texts_a, texts_b, vecs_a, vecs_b)
    
    final_scores = hybrid_scores
    
    if is_reranker_available() and len(texts_a) * len(texts_b) <= 500: # Increased limit for demo
        print(f"Applying cross-encoder reranking...")
        reranker_scores = rerank_matrix(texts_a, texts_b)
        if reranker_scores is not None:
            final_scores = 0.7 * hybrid_scores + 0.3 * reranker_scores
            
    details = []
    
    for i, ca in enumerate(chunks_a):
        scores_for_a = final_scores[i]
        
        top_indices = np.argsort(scores_for_a)[::-1][:top_k]
        
        matches = []
        for rank, j in enumerate(top_indices):
            cb = chunks_b[j]
            score = float(scores_for_a[j])
            matches.append({
                "rank": rank + 1,
                "target_chunk_id": f"B_{cb.get('clause_no', j)}",
                "target_clause_no": cb.get('clause_no', 'N/A'),
                "section_title_b": cb.get('section_title', ''),
                "content_b": cb.get('content', ''),
                "score": round(score, 4)
            })
            
        details.append({
            "source_chunk_id": f"A_{ca.get('clause_no', i)}",
            "source_clause_no": ca.get('clause_no', 'N/A'),
            "section_title_a": ca.get('section_title', ''),
            "content_a": ca.get('content', ''),
            "matches": matches
        })
        
    def sort_key(d):
        no = d.get("source_clause_no", "0")
        try:
            return (0, int(no))
        except (ValueError, TypeError):
            return (1, str(no))
            
    details = sorted(details, key=sort_key)
    
    total_time = time.time() - pipeline_start
    print(f"Demo retrieval completed in {total_time:.2f}s")
    
    return {
        "summary": {
            "total_clauses_compared": len(chunks_a),
            "total_targets": len(chunks_b)
        },
        "details": details,
        "full_text_a": "\n\n".join(c.get("content", "") for c in chunks_a),
        "full_text_b": "\n\n".join(c.get("content", "") for c in chunks_b),
    }
