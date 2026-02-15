"""Analytics routes."""

from typing import Any, Dict, List

from fastapi import APIRouter

from database import get_database
from services.scoring_engine import (
	compute_concept_mastery,
	compute_overall_mastery,
	compute_subconcept_mastery,
	get_top_weak_areas,
)

from services.recommendation_engine import generate_recommendations
router = APIRouter()


@router.get("/analytics/{user_id}")
async def get_analytics(user_id: str) -> Dict[str, Any]:
	"""Return mastery analytics and recommendations for a user."""
	db = get_database()
	responses = await db["user_responses"].find({"user_id": user_id}).to_list(None)

	if not responses:
		return {"message": "No data available"}

	question_ids = list({response.get("question_id") for response in responses})
	questions = await db["questions"].find({"question_id": {"$in": question_ids}}).to_list(None)
	questions_by_id = {question.get("question_id"): question for question in questions}

	merged: List[Dict[str, Any]] = []
	for response in responses:
		question = questions_by_id.get(response.get("question_id"))
		if not question:
			continue
		merged.append(
			{
				**response,
				"difficulty": question.get("difficulty"),
				"expected_time": question.get("expected_time"),
				"sub_concept": question.get("sub_concept"),
			}
		)

	grouped: Dict[str, List[Dict[str, Any]]] = {}
	for item in merged:
		sub_concept = item.get("sub_concept")
		if not sub_concept:
			continue
		grouped.setdefault(sub_concept, []).append(item)

	subconcept_results: Dict[str, Dict[str, Any]] = {}
	for sub_concept, items in grouped.items():
		subconcept_results[sub_concept] = compute_subconcept_mastery(items)

	concept_mastery = compute_concept_mastery(subconcept_results)
	overall_mastery = compute_overall_mastery(subconcept_results)
	weak_areas = get_top_weak_areas(subconcept_results)

	recommendations = await generate_recommendations(weak_areas, db)

	return {
		"overall_mastery": overall_mastery,
		"concept_mastery": concept_mastery,
		"subconcept_mastery": subconcept_results,
		"weak_areas": weak_areas,
		"recommendations": recommendations,
	}
