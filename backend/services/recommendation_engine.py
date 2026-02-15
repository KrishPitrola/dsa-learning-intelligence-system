async def generate_recommendations(weak_areas: list, db):
    if not weak_areas:
        return []

    recommendations = []
    allowed_statuses = {"Critical", "Weak", "Moderate"}

    for area in weak_areas:
        if area.get("status") not in allowed_statuses:
            continue
        sub_concept = area.get("sub_concept")
        if not sub_concept:
            continue

        easy = await db.questions.find(
            {"sub_concept": sub_concept, "difficulty": 1}
        ).to_list(length=5)

        medium = await db.questions.find(
            {"sub_concept": sub_concept, "difficulty": 2}
        ).to_list(length=3)

        hard = await db.questions.find(
            {"sub_concept": sub_concept, "difficulty": 3}
        ).to_list(length=1)

        # REMOVE _id from documents
        for group in (easy, medium, hard):
            for doc in group:
                doc.pop("_id", None)

        recommendations.append(
            {
                "sub_concept": sub_concept,
                "classification": area.get("status"),
                "practice_questions": {
                    "easy": easy,
                    "medium": medium,
                    "hard": hard,
                },
            }
        )

    return recommendations