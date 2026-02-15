"""Scoring engine for mastery computation."""

from typing import Any, Dict, List

from constants import (
    ACCURACY_WEIGHT,
    CONSISTENCY_WEIGHT,
    CONCEPTS,
    CRITICAL_THRESHOLD,
    DIFFICULTY_WEIGHT,
    MODERATE_THRESHOLD,
    TIME_WEIGHT,
    WEAK_THRESHOLD,
)


def compute_subconcept_mastery(responses: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Compute mastery as a weighted blend of accuracy, difficulty, time, and consistency."""
    total_attempts = len(responses)
    if total_attempts < 3:
        return {"status": "Insufficient Data", "mastery_score": None}

    correct_count = sum(1 for response in responses if response.get("is_correct"))
    difficulty_attempted = sum(int(response.get("difficulty", 0)) for response in responses)
    difficulty_correct = sum(
        int(response.get("difficulty", 0))
        for response in responses
        if response.get("is_correct")
    )

    accuracy = correct_count / total_attempts if total_attempts else 0.0
    difficulty_weighted_accuracy = (
        difficulty_correct / difficulty_attempted if difficulty_attempted else 0.0
    )

    time_scores = []
    for response in responses:
        expected_time = int(response.get("expected_time", 0))
        if expected_time <= 0:
            continue
        time_taken = int(response.get("time_taken", 0))
        time_ratio = time_taken / expected_time

        if time_ratio <= 1:
            time_scores.append(1.0)
        elif time_ratio <= 2:
            time_scores.append(1.0 - (time_ratio - 1.0))
        else:
            time_scores.append(0.0)

    average_time_score = sum(time_scores) / len(time_scores) if time_scores else 0.0

    avg_attempts = (
        sum(int(response.get("attempts", 0)) for response in responses) / len(responses)
        if responses
        else 0.0
    )
    consistency_score = min(1.0 / avg_attempts, 1.0) if avg_attempts else 0.0

    mastery = (
        (ACCURACY_WEIGHT * accuracy)
        + (DIFFICULTY_WEIGHT * difficulty_weighted_accuracy)
        + (TIME_WEIGHT * average_time_score)
        + (CONSISTENCY_WEIGHT * consistency_score)
    )
    mastery_score = mastery * 100.0

    return {
        "status": "Evaluated",
        "mastery_score": mastery_score,
        "accuracy": accuracy,
        "difficulty_weighted_accuracy": difficulty_weighted_accuracy,
        "time_score": average_time_score,
        "consistency_score": consistency_score,
        "total_attempts": total_attempts,
    }


def compute_concept_mastery(
    subconcept_results: Dict[str, Dict[str, Any]]
) -> Dict[str, Any]:
    """Aggregate sub-concept mastery into concept-level mastery averages."""
    concept_mastery: Dict[str, Any] = {}

    for concept, sub_concepts in CONCEPTS.items():
        mastery_scores = []
        for sub_concept in sub_concepts:
            result = subconcept_results.get(sub_concept)
            if not result or result.get("status") == "Insufficient Data":
                continue
            mastery_score = result.get("mastery_score")
            if mastery_score is None:
                continue
            mastery_scores.append(float(mastery_score))

        if not mastery_scores:
            concept_mastery[concept] = {"status": "Not Attempted"}
        else:
            concept_mastery[concept] = {
                "status": "Evaluated",
                "mastery_score": sum(mastery_scores) / len(mastery_scores),
            }

    return concept_mastery


def compute_overall_mastery(subconcept_results: Dict[str, Dict[str, Any]]) -> float:
    """Compute overall mastery weighted by total attempts per sub-concept."""
    weighted_sum = 0.0
    total_attempts = 0

    for result in subconcept_results.values():
        if result.get("status") == "Insufficient Data":
            continue
        mastery_score = result.get("mastery_score")
        attempts = int(result.get("total_attempts", 0))
        if mastery_score is None or attempts <= 0:
            continue
        weighted_sum += float(mastery_score) * attempts
        total_attempts += attempts

    if total_attempts == 0:
        return 0.0

    return weighted_sum / total_attempts


def get_top_weak_areas(
    subconcept_results: Dict[str, Dict[str, Any]], top_n: int = 3
) -> List[Dict[str, Any]]:
    """Return the weakest sub-concepts ordered by mastery score."""
    evaluated = []
    for sub_concept, result in subconcept_results.items():
        if result.get("status") != "Evaluated":
            continue
        mastery_score = result.get("mastery_score")
        if mastery_score is None:
            continue
        mastery_score = float(mastery_score)

        if mastery_score < CRITICAL_THRESHOLD:
            status = "Critical"
        elif mastery_score < WEAK_THRESHOLD:
            status = "Weak"
        elif mastery_score < MODERATE_THRESHOLD:
            status = "Moderate"
        else:
            status = "Strong"

        if status == "Strong":
            continue

        evaluated.append(
            {
                "sub_concept": sub_concept,
                "mastery_score": mastery_score,
                "status": status,
            }
        )

    evaluated.sort(key=lambda item: item["mastery_score"])
    return evaluated[:top_n]
