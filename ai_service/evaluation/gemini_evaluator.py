"""
gemini_evaluator.py
-------------------
Evaluates a PPT/PDF using google-genai SDK.
Uses gemini-2.0-flash-lite — cheapest model, highest rate limits.

Returns 4 scores (0-100): innovation, technical, clarity, design.
"""

import os
import re
import json
import logging

from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

logger = logging.getLogger(__name__)

_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Cheapest model, highest rate limits, perfectly capable for structured scoring
_MODEL = "gemini-2.0-flash-lite"

_SYSTEM = (
    "You are a hackathon judge. Score this presentation on 4 criteria (0-100 each). "
    "Be fair — a solid presentation earns 65-75, good earns 75-85, excellent earns 85+. "
    "Return ONLY JSON, no other text: "
    '{"innovation_percentage":<int>,"technical_percentage":<int>,"clarity_percentage":<int>,"design_percentage":<int>}'
)


def _clamp(v) -> float:
    try:
        return max(0.0, min(100.0, float(v)))
    except Exception:
        return 65.0


def _extract_json(text: str) -> dict:
    # Strip thinking tags and markdown fences
    text = re.sub(r"<thinking>.*?</thinking>", "", text, flags=re.DOTALL)
    text = re.sub(r"```(?:json)?\s*|```", "", text).strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    m = re.search(r'\{[^{}]+\}', text, re.DOTALL)
    if m:
        return json.loads(m.group())
    raise ValueError(f"No JSON in: {text[:200]}")


def evaluate_with_gemini(slides_text: str, metrics: dict) -> dict:
    # Keep prompt small — fewer tokens = cheaper + faster
    if len(slides_text) > 4000:
        slides_text = slides_text[:4000] + "\n[truncated]"

    prompt = (
        f"Slides: {metrics['slide_count']} | "
        f"Avg words/slide: {metrics['avg_words_per_slide']:.0f} | "
        f"Images: {metrics['image_count']}\n\n"
        f"CONTENT:\n{slides_text}"
    )

    for attempt in range(3):
        try:
            response = _client.models.generate_content(
                model=_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=_SYSTEM,
                    temperature=0.3,
                    max_output_tokens=128,
                ),
            )
            raw = response.text
            logger.info(f"Gemini response: {raw!r}")
            parsed = _extract_json(raw)
            return {
                "innovation_percentage": _clamp(parsed["innovation_percentage"]),
                "technical_percentage":  _clamp(parsed["technical_percentage"]),
                "clarity_percentage":    _clamp(parsed["clarity_percentage"]),
                "design_percentage":     _clamp(parsed["design_percentage"]),
            }

        except Exception as exc:
            err_str = str(exc)
            is_rate_limit = (
                "429" in err_str
                or "quota" in err_str.lower()
                or "rate" in err_str.lower()
                or "resource_exhausted" in err_str.lower()
                or "resourceexhausted" in err_str.lower()
            )
            if is_rate_limit:
                # Extract the exact retry delay Gemini tells us (e.g. "retryDelay": "53s")
                m = re.search(r"retryDelay['\"]?\s*[:'\"]+\s*['\"]?(\d+)s", err_str)
                wait = int(m.group(1)) + 2 if m else 65
                logger.warning(
                    f"Rate limit on attempt {attempt + 1} — "
                    f"waiting {wait}s as instructed by Gemini..."
                )
                import time; time.sleep(wait)
            else:
                logger.error(f"Gemini failed (attempt {attempt + 1}): {exc}", exc_info=True)
                break   # non-rate-limit — don't retry

    logger.error("All Gemini attempts failed — returning fallback scores")
    return {
        "innovation_percentage": 65.0,
        "technical_percentage":  65.0,
        "clarity_percentage":    65.0,
        "design_percentage":     65.0,
    }