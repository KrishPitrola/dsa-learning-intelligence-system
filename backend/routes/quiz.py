"""Quiz routes."""

from datetime import datetime
from typing import Any, Dict, List, Optional

from fastapi import APIRouter
from pydantic import BaseModel

from database import get_database
from services.scoring_engine import compute_subconcept_mastery, get_top_weak_areas

router = APIRouter()


class QuizResponse(BaseModel):
	question_id: str
	selected_option: str
	time_taken: int


class QuizSubmission(BaseModel):
	user_id: str
	responses: List[QuizResponse]


@router.get("/quiz")
async def get_quiz(user_id: Optional[str] = None) -> List[Dict[str, Any]]:
	"""Return quiz questions, optionally adapted by user history."""
	db = get_database()
	questions_collection = db["questions"]

	async def sample_questions(
		size: int,
		match: Optional[Dict[str, Any]] = None,
		exclude_ids: Optional[List[str]] = None,
	) -> List[Dict[str, Any]]:
		pipeline: List[Dict[str, Any]] = []
		match_stage: Dict[str, Any] = {}
		if match:
			match_stage.update(match)
		if exclude_ids:
			match_stage["question_id"] = {"$nin": exclude_ids}
		if match_stage:
			pipeline.append({"$match": match_stage})
		pipeline.append({"$sample": {"size": size}})
		pipeline.append({"$project": {"_id": 0, "correct_option": 0}})
		return await questions_collection.aggregate(pipeline).to_list(None)

	if not user_id:
		return await sample_questions(10)

	responses = await db["user_responses"].find({"user_id": user_id}).to_list(None)
	if not responses:
		return await sample_questions(10)

	question_ids = list({response.get("question_id") for response in responses if response.get("question_id")})
	if not question_ids:
		return await sample_questions(10)

	questions = await questions_collection.find({"question_id": {"$in": question_ids}}).to_list(None)
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

	weak_areas = get_top_weak_areas(subconcept_results)
	if not weak_areas:
		return await sample_questions(10)

	selected: List[Dict[str, Any]] = []
	selected_ids: List[str] = []

	def add_unique(items: List[Dict[str, Any]]) -> int:
		added = 0
		for item in items:
			question_id = item.get("question_id")
			if not question_id or question_id in selected_ids:
				continue
			selected_ids.append(question_id)
			selected.append(item)
			added += 1
		return added

	weakness_scores = [
		{
			"sub_concept": area["sub_concept"],
			"weakness_score": 100.0 - float(area.get("mastery_score", 0.0)),
		}
		for area in weak_areas
	]

	total_weakness = sum(item["weakness_score"] for item in weakness_scores)
	if total_weakness <= 0:
		return await sample_questions(10)

	allocations: Dict[str, int] = {}
	for item in weakness_scores:
		share = (item["weakness_score"] / total_weakness) * 10
		allocations[item["sub_concept"]] = max(1, int(round(share)))

	allocated_total = sum(allocations.values())
	if allocated_total != 10:
		sorted_by_weakness = sorted(
			weakness_scores, key=lambda entry: entry["weakness_score"], reverse=True
		)
		while allocated_total > 10:
			for entry in sorted_by_weakness:
				sub_concept = entry["sub_concept"]
				if allocations[sub_concept] > 1:
					allocations[sub_concept] -= 1
					allocated_total -= 1
					break
		while allocated_total < 10:
			for entry in sorted_by_weakness:
				sub_concept = entry["sub_concept"]
				allocations[sub_concept] += 1
				allocated_total += 1
				break

	for sub_concept, count in allocations.items():
		result = subconcept_results.get(sub_concept, {})
		mastery_score = result.get("mastery_score")
		mastery_value = float(mastery_score) if mastery_score is not None else 0.0

		if mastery_value < 40:
			easy_ratio, medium_ratio, hard_ratio = 0.6, 0.3, 0.1
		elif mastery_value < 80:
			easy_ratio, medium_ratio, hard_ratio = 0.4, 0.4, 0.2
		else:
			easy_ratio, medium_ratio, hard_ratio = 0.2, 0.5, 0.3

		easy_count = int(round(count * easy_ratio))
		medium_count = int(round(count * medium_ratio))
		hard_count = count - easy_count - medium_count

		added = 0
		if easy_count > 0:
			added += add_unique(
				await sample_questions(
					easy_count,
					{"sub_concept": sub_concept, "difficulty": 1},
					selected_ids,
				)
			)
		if medium_count > 0:
			added += add_unique(
				await sample_questions(
					medium_count,
					{"sub_concept": sub_concept, "difficulty": 2},
					selected_ids,
				)
			)
		if hard_count > 0:
			added += add_unique(
				await sample_questions(
					hard_count,
					{"sub_concept": sub_concept, "difficulty": 3},
					selected_ids,
				)
			)

		remaining = count - added
		if remaining > 0:
			add_unique(
				await sample_questions(
					remaining,
					{"sub_concept": sub_concept},
					selected_ids,
				)
			)

	if len(selected) < 10:
		add_unique(await sample_questions(10 - len(selected), None, selected_ids))

	return selected[:10]


@router.post("/quiz/submit")
async def submit_quiz(submission: QuizSubmission) -> Dict[str, Any]:
	"""Store quiz responses and return a summary of results."""
	db = get_database()
	questions_collection = db["questions"]
	responses_collection = db["user_responses"]

	question_ids = [response.question_id for response in submission.responses]
	questions = await questions_collection.find(
		{"question_id": {"$in": question_ids}}
	).to_list(None)
	questions_by_id = {question.get("question_id"): question for question in questions}

	payload: List[Dict[str, Any]] = []
	correct_answers = 0
	for response in submission.responses:
		question = questions_by_id.get(response.question_id, {})
		correct_option = question.get("correct_option")
		is_correct = response.selected_option == correct_option
		if is_correct:
			correct_answers += 1
		payload.append(
			{
				"user_id": submission.user_id,
				"question_id": response.question_id,
				"is_correct": is_correct,
				"time_taken": response.time_taken,
				"attempts": 1,
				"timestamp": datetime.utcnow(),
			}
		)

	if payload:
		await responses_collection.insert_many(payload)

	total_questions = len(submission.responses)
	accuracy = correct_answers / total_questions if total_questions else 0.0

	return {
		"total_questions": total_questions,
		"accuracy": accuracy,
	}
