import json
import urllib.request
from typing import Dict, List

from ..config import (
    LLM_PROVIDER,
    OLLAMA_BASE_URL,
    LLM_BASE_URL,
    LLM_MODEL,
    LLM_API_KEY,
    LLM_TIMEOUT,
)




def stream_chat_completion(messages: List[Dict[str, str]], temperature: float = 0.0):

    if LLM_PROVIDER == "ollama":
        url = f"{OLLAMA_BASE_URL.rstrip('/')}/api/chat"
        payload = {
            "model": LLM_MODEL,
            "messages": messages,
            "stream": True,
            "options": {"temperature": temperature}
        }
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=LLM_TIMEOUT) as resp:
                for line in resp:
                    if line:
                        data = json.loads(line.decode("utf-8"))
                        if "message" in data and "content" in data["message"]:
                            yield data["message"]["content"]
        except Exception as exc:
            yield f"\n[Lỗi kết nối Ollama: {exc}]"
    else:
        base = LLM_BASE_URL.rstrip("/")
        url = f"{base}/chat/completions" if base.endswith("/v1") else f"{base}/v1/chat/completions"
        payload = {
            "model": LLM_MODEL,
            "messages": messages,
            "temperature": temperature,
            "stream": True
        }
        headers = {"Content-Type": "application/json"}
        if LLM_API_KEY:
            headers["Authorization"] = f"Bearer {LLM_API_KEY}"
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers=headers,
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=LLM_TIMEOUT) as resp:
                for line in resp:
                    line = line.decode("utf-8").strip()
                    if line.startswith("data: ") and line != "data: [DONE]":
                        try:
                            data = json.loads(line[6:])
                            if "choices" in data and len(data["choices"]) > 0:
                                delta = data["choices"][0].get("delta", {})
                                if "content" in delta and delta["content"]:
                                    yield delta["content"]
                        except json.JSONDecodeError:
                            pass
        except Exception as exc:
            yield f"\n[Lỗi kết nối API: {exc}]"


def check_ollama_health() -> bool:

    url = f"{OLLAMA_BASE_URL.rstrip('/')}/api/tags"
    req = urllib.request.Request(url, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=5):
            return True
    except Exception:
        return False


