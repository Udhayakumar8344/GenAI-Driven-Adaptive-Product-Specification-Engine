import os
import hashlib
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime

app = FastAPI(title="GenAI Spec Engine API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Step 6: Output state
DB_DOCUMENTS = []
DB_CHANGES = []
DB_CONFLICTS = []

def generate_mock_analysis(filename: str, content: str):
    import uuid
    import time
    time.sleep(2) # Simulating AI processing delay
    
    doc_id = str(uuid.uuid4())
    content_hash = hashlib.sha256(content.encode()).hexdigest()
    
    # Step 2: Change Detection - System checks if doc changed (Simulated by checking if we have existing docs)
    is_second_doc = len(DB_DOCUMENTS) > 0
    health_score = 100.0 if not is_second_doc else 85.0
    
    new_doc = {
        "id": doc_id,
        "filename": filename,
        "doc_type": "PRD" if "prd" in filename.lower() else "API_SPEC",
        "upload_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "health_score": health_score,
        "content_hash": content_hash,
        "content": content
    }
    DB_DOCUMENTS.append(new_doc)
    
    if is_second_doc:
        # Step 3: AI Analysis - AI compares old vs new content & generates summary of changes
        change = {
            "id": str(uuid.uuid4()),
            "doc_id": doc_id,
            "summary": f"AI Output: Compared old vs new content. New authentication mechanism introduced in documents."
        }
        if len(DB_CHANGES) == 0:
            DB_CHANGES.append(change)
        
        # Step 4 & 5: Consistency Check & Conflict Detection
        conflict = {
            "id": str(uuid.uuid4()),
            "doc_a_id": doc_id,
            "doc_b_id": DB_DOCUMENTS[0]['id'],
            "description": f"PRD says OTP login. API says password login 👉 Conflict detected ⚠️",
            "severity": "CRITICAL"
        }
        if len(DB_CONFLICTS) == 0:
            DB_CONFLICTS.append(conflict)

@app.get("/api/v1/stats")
async def get_stats():
    return {
        "total_docs": len(DB_DOCUMENTS),
        "total_conflicts": len(DB_CONFLICTS),
        "total_changes": len(DB_CHANGES),
        "health_score": 75 if len(DB_CONFLICTS) > 0 else 100
    }

@app.get("/api/v1/documents")
async def get_documents():
    return DB_DOCUMENTS

@app.get("/api/v1/conflicts")
async def get_conflicts():
    return DB_CONFLICTS

@app.get("/api/v1/changes")
async def get_changes():
    return DB_CHANGES

@app.post("/api/v1/upload")
async def upload_document(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    # Step 1: Document Upload
    content = await file.read()
    background_tasks.add_task(generate_mock_analysis, file.filename, "Extracted Content...")
    return {"message": f"Document {file.filename} uploaded."}
