
## Yêu cầu Hệ thống
- **Node.js** >= 18
- **Python** >= 3.10
- **Ollama** (chạy Local LLM tại `http://localhost:11434`)

## Hướng dẫn cài đặt
1. Cài đặt các thư viện Backend (đứng tại thư mục gốc):
   ```bash
   python -m pip install -r backend/requirements.txt
   ```
2. Cài đặt các thư viện Frontend:
   ```bash
   cd frontend
   npm install
   ```
3. Cài đặt Model cho Ollama:
   ```bash
   ollama pull qwen3:1.7b
   ```

## Hướng dẫn chạy

Bạn cần mở 2 Terminal để chạy riêng biệt cho Backend và Frontend.

**Terminal 1 (Backend - chạy từ thư mục gốc dự án):**
```bash
python -m uvicorn backend.main:app --reload --port 8000
```

**Terminal 2 (Frontend - chạy từ thư mục frontend):**
```bash
cd frontend
npm run dev
```

Sau khi khởi động thành công, mở trình duyệt truy cập: **http://localhost:5173**
