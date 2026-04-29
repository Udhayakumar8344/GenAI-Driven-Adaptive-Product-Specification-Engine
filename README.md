# GenAI-Driven Adaptive Product Specification Engine

Welcome to the full project scaffold for the Xebia Hackathon 2026! 🚀

## 🏗️ Project Architecture

This repository is built according to the High-Level Design (HLD) Document provided. It contains:
- **`frontend/`**: Enterprise-ready React.js + Tailwind CSS UI scaffolding.
- **`backend/`**: Python FastAPI backend skeleton pre-configured for LLM AI Orchestration.
- **`docker-compose.yml`**: Local database infrastructure (PostgreSQL & Redis).

## 🚀 How to Run Locally

### 1. Start the Databases (PostgreSQL + Redis)
Make sure you have Docker installed.
```bash
cd GenAI-Spec-Engine
docker-compose up -d
```

### 2. Start the Backend (FastAPI)
It's recommended to use a Python virtual environment.
```bash
cd GenAI-Spec-Engine/backend
python -m venv venv
.\venv\Scripts\activate   # On Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```
The API will be running on `http://127.0.0.1:8000/docs` (Swagger UI).

### 3. Start the Frontend (React Vite)
```bash
cd GenAI-Spec-Engine/frontend
npm install
npm run dev
```
The UI dashboard will be running on the Localhost port provided by Vite (e.g. `http://localhost:5173/`).

---
🌟 *Ready for your hackathon submission! Happy Coding!* 🌟
