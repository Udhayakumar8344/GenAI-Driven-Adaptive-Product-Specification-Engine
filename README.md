# 🍋 GenAI-Driven Adaptive Product Specification Engine
### *The Ultimate AI Orchestrator for Real-time Specification Synchronization*

**GenAI-Adaptive-Spec-Engine** is an enterprise-grade solution built for the Xebia Hackathon 2026. It solves the critical problem of **Logical Drift** between Product Requirements (PRDs), Developer Code, and Technical Documentation.

## 🚀 The Core Problem
In traditional software development, documents are stored in silos (PRDs, Jira, API docs). When developers update code, documents often become outdated, leading to:
- Team confusion & miscommunication
- Incorrect feature implementations
- Costly bugs and delivery delays

## ✨ Key Features
- **Neural Alignment Engine**: Uses heuristic-guided AI to cross-reference multiple documents and isolate architectural drifts instantly.
- **Autonomous Project Isolation**: Intelligently detects project domains (e.g., Bus Booking vs. Food App) to ensure no project context leakage.
- **Synthesized Architecture Export**: Automatically generates and merges specifications into a professional, aligned PDF report.
- **Cyber-Lime Premium UI**: A high-performance, responsive admin dashboard with real-time telemetry and a state-of-the-art aesthetic.
- **Resilient Data Layer**: Persistent PostgreSQL storage with an autonomous in-memory fallback for high-availability demos.

## 🏗️ Technical Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS, Framer Motion, Lucide, jsPDF.
- **Backend**: FastAPI (Python), SQLAlchemy, pypdf, Uvicorn.
- **Infrastructure**: PostgreSQL, Docker Compose.

## 🚀 Setup & Execution

### 1. Ingest Database Services
```bash
docker compose up -d
```

### 2. Neural Backend Initialization
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --port 8000 --reload
```

### 3. Command Center UI Startup
```bash
cd frontend
npm install
npm run dev
```

---
🌟 **Built with 💚 for Xebia Hackathon 2026** 🌟
