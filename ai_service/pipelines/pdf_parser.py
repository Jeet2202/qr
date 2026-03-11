"""
pdf_parser.py
-------------
Extracts structured slide-like data from a PDF file.
Each PDF page is treated as a "slide".

Returns a list of dicts matching the same schema as ppt_parser.extract_ppt_content:
    slide_number : int
    title        : str  (first non-empty line of the page, used as title)
    content      : str  (remaining text joined)
    bullet_points: list[str]
    image_count  : int  (number of images detected on the page)
"""

import logging

import pdfplumber

logger = logging.getLogger(__name__)


def extract_pdf_content(file_path: str) -> list:
    """
    Parse a PDF and extract per-page content in the same schema as ppt_parser.

    Args:
        file_path: Absolute path to the .pdf file.

    Returns:
        List of dicts with keys:
            slide_number, title, content, bullet_points, image_count
    """
    slides = []

    with pdfplumber.open(file_path) as pdf:
        logger.info(f"PDF has {len(pdf.pages)} pages: {file_path}")

        for index, page in enumerate(pdf.pages):
            raw_text = page.extract_text() or ""
            lines = [line.strip() for line in raw_text.splitlines() if line.strip()]

            # First non-empty line becomes the title
            title = str(lines[0]) if lines else f"Page {index + 1}"
            content_lines: list[str] = [str(l) for l in lines[1:]] if len(lines) > 1 else []
            content = " ".join(content_lines)

            # Lines that look like bullet points (start with -, •, *, numbers)
            bullet_points = [
                line for line in content_lines
                if line.startswith(("-", "•", "*", "·"))
                or (len(line) > 2 and line[0].isdigit() and line[1] in (".", ")"))
            ]

            # Count images on the page
            image_count = len(page.images) if hasattr(page, "images") else 0

            slides.append({
                "slide_number": index + 1,
                "title":        title,
                "content":      content,
                "bullet_points": bullet_points,
                "image_count":  image_count,
            })

    return slides
