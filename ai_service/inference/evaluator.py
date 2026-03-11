"""
evaluator.py
------------
Main evaluation pipeline entry point.

Supports both .pptx and .pdf input files.
Given a file path, returns:
    innovation_percentage : float  (0-100)
    technical_percentage  : float  (0-100)
    clarity_percentage    : float  (0-100)
    design_percentage     : float  (0-100)
    final_score           : float  (0-100, weighted)
"""

import logging

from pipelines.ppt_parser import extract_ppt_content
from pipelines.pdf_parser import extract_pdf_content
from analysis.presentation_metrics import compute_metrics
from evaluation.gemini_evaluator import evaluate_with_gemini
from ranking.leaderboard import calculate_final_score

logger = logging.getLogger(__name__)

# Max characters of slide text sent to Gemini (handled again in evaluator for safety)
_MAX_SLIDES_TEXT = 8000


def _build_slides_text(slides: list) -> str:
    """Format extracted slides into a readable text block for Gemini."""
    parts = []
    for slide in slides:
        part = (
            f"--- Slide {slide['slide_number']} ---\n"
            f"Title: {slide['title']}\n"
            f"Content: {slide['content']}"
        )
        parts.append(part)
    return "\n\n".join(parts)


def evaluate_ppt(file_path: str) -> dict:
    """
    Full evaluation pipeline for a single PPTX file.

    Args:
        file_path: Absolute path to the uploaded .pptx file.

    Returns:
        Dict with exactly 5 keys:
            innovation_percentage, technical_percentage,
            clarity_percentage, design_percentage, final_score

    Raises:
        Exception: Propagated from ppt_parser or Gemini on unrecoverable errors.
    """
    logger.info(f"Evaluating: {file_path}")

    # 1. Extract slide/page content — route by file extension
    ext = file_path.lower().rsplit(".", 1)[-1]
    if ext == "pdf":
        slides = extract_pdf_content(file_path)
    elif ext == "pptx":
        slides = extract_ppt_content(file_path)
    else:
        raise ValueError(f"Unsupported file type: .{ext} — only .pptx and .pdf are supported")

    logger.info(f"Extracted {len(slides)} slides/pages")

    # 2. Build slide text for Gemini
    slides_text = _build_slides_text(slides)

    # 3. Compute structural metrics
    metrics = compute_metrics(slides)
    logger.info(f"Metrics: {metrics}")

    # 4. Gemini evaluation — returns 4 dimension percentages
    scores = evaluate_with_gemini(slides_text, metrics)
    logger.info(f"Gemini scores: {scores}")

    # 5. Compute final score deterministically in Python
    final_score = calculate_final_score(scores)
    logger.info(f"Final score: {final_score}")

    # 6. Return strict output schema — only these 5 keys
    return {
        "innovation_percentage": round(scores["innovation_percentage"], 1),
        "technical_percentage":  round(scores["technical_percentage"], 1),
        "clarity_percentage":    round(scores["clarity_percentage"], 1),
        "design_percentage":     round(scores["design_percentage"], 1),
        "final_score":           final_score,
    }