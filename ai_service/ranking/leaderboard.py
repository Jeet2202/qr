"""
leaderboard.py
--------------
Deterministic scoring and ranking for PPT submissions.

Final score formula (weights must sum to 1.0):
    Innovation  40%
    Technical   30%
    Clarity     20%
    Design      10%
"""


WEIGHTS = {
    "innovation_percentage": 0.40,
    "technical_percentage":  0.30,
    "clarity_percentage":    0.20,
    "design_percentage":     0.10,
}


def calculate_final_score(scores: dict) -> float:
    """
    Compute the weighted final score from dimension percentages.

    Args:
        scores: Dict with innovation_percentage, technical_percentage,
                clarity_percentage, design_percentage (all 0-100).

    Returns:
        final_score as a float rounded to 1 decimal place (0-100).
    """
    raw = (
        WEIGHTS["innovation_percentage"] * scores["innovation_percentage"] +
        WEIGHTS["technical_percentage"]  * scores["technical_percentage"]  +
        WEIGHTS["clarity_percentage"]    * scores["clarity_percentage"]    +
        WEIGHTS["design_percentage"]     * scores["design_percentage"]
    )
    return round(raw, 1)


def rank_submissions(results: list) -> list:
    """
    Sort a list of evaluation result dicts by final_score descending
    and assign a rank field (1 = highest).

    Args:
        results: List of dicts, each containing at least 'final_score'.

    Returns:
        Same list sorted in-place with 'rank' integer added to each item.
    """
    ranked = sorted(results, key=lambda x: x["final_score"], reverse=True)
    for index, team in enumerate(ranked):
        team["rank"] = index + 1
    return ranked