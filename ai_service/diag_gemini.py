"""
Run this directly to see exactly what Gemini returns or what error occurs.
Usage (with venv activated):
    python diag_gemini.py
"""
from dotenv import load_dotenv
load_dotenv()

import os
from google import genai
from google.genai import types

api_key = os.getenv("GEMINI_API_KEY")
print(f"API key loaded: {bool(api_key)} | starts with: {api_key[:8] if api_key else 'NONE'}")

client = genai.Client(api_key=api_key)

SYSTEM = (
    "You are a hackathon judge. Score this presentation on 4 criteria (0-100 each). "
    "Return ONLY this JSON and nothing else: "
    '{"innovation_percentage":72,"technical_percentage":68,"clarity_percentage":75,"design_percentage":70}'
)

try:
    print("\nCalling gemini-2.0-flash-lite...")
    response = client.models.generate_content(
        model="gemini-2.0-flash-lite",
        contents="Test presentation: A mobile app that detects potholes using phone camera and reports them to municipalities automatically.",
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM,
            temperature=0.3,
            max_output_tokens=128,
        ),
    )
    print(f"SUCCESS! Raw response:\n{repr(response.text)}")

except Exception as e:
    print(f"ERROR: {type(e).__name__}: {e}")
