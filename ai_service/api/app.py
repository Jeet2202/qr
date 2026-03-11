"""
app.py
------
FastAPI service — PPT / PDF evaluation endpoint.

POST /evaluate-ppt
    Multipart form upload of a .pptx or .pdf file.
    Returns JSON with dimension scores and final score (0-100).

GET /health
    Returns {"status": "ok"} for health checks.

Run from ai_service/ with venv activated:
    uvicorn api.app:app --host 0.0.0.0 --port 8000 --reload
"""

import os
import uuid
import logging
import tempfile

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from inference.evaluator import evaluate_ppt

# Load environment variables (.env contains GEMINI_API_KEY)
load_dotenv()

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s",
)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(
    title="PPT / PDF Evaluation AI Service",
    description="Evaluates hackathon PPT and PDF submissions and returns numeric scores for organizer ranking.",
    version="3.1.0",
)

# Allow the React frontend (different port) to call this service
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # tighten to specific origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Response schema — enforced by Pydantic
# ---------------------------------------------------------------------------
class EvaluationResult(BaseModel):
    innovation_percentage: float
    technical_percentage:  float
    clarity_percentage:    float
    design_percentage:     float
    final_score:           float


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------
@app.get("/health")
async def health():
    """Health-check endpoint for uptime monitoring."""
    return {"status": "ok"}


@app.post("/evaluate-ppt", response_model=EvaluationResult)
async def evaluate(file: UploadFile = File(...)):
    """
    Evaluate a PPTX or PDF file and return numeric scores for organizer ranking.

    - **file**: A .pptx or .pdf file uploaded as multipart/form-data.

    Returns dimension scores (0-100) and a weighted final score (0-100).
    """
    # Validate file type
    allowed = (".pptx", ".pdf")
    if not file.filename or not file.filename.lower().endswith(allowed):
        raise HTTPException(
            status_code=400,
            detail="Only .pptx and .pdf files are supported.",
        )

    # Write to a uniquely-named temp file (avoids filename collisions and path traversal)
    tmp_path = None
    try:
        content: bytes = await file.read()
        # Preserve the original extension (.pptx or .pdf) in the temp filename
        ext = "." + file.filename.lower().rsplit(".", 1)[-1]
        suffix = f"_{uuid.uuid4().hex}{ext}"

        with tempfile.NamedTemporaryFile(
            delete=False, suffix=suffix, prefix="ppt_eval_", mode="wb"
        ) as tmp:
            tmp.write(content)
            tmp_path = tmp.name

        logger.info(f"Evaluating '{file.filename}' -> temp file '{tmp_path}'")
        result = evaluate_ppt(tmp_path)
        return result

    except HTTPException:
        raise

    except Exception as e:
        logger.exception(f"Evaluation failed for '{file.filename}': {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Evaluation error: {str(e)}",
        )

    finally:
        # Always clean up the temp file regardless of success or failure
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)
            logger.info(f"Cleaned up temp file: {tmp_path}")