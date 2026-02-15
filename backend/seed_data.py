"""Seed questions data into MongoDB."""

import asyncio
import os
import random
import uuid
from typing import Dict, List, Tuple

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

from constants import CONCEPTS


def _build_subconcept_plan(total_questions: int) -> List[Tuple[str, str]]:
    """Create a list of (concept, sub_concept) pairs for even distribution."""
    pairs: List[Tuple[str, str]] = []
    for concept, sub_concepts in CONCEPTS.items():
        for sub_concept in sub_concepts:
            pairs.append((concept, sub_concept))

    base = total_questions // len(pairs)
    remainder = total_questions % len(pairs)

    plan: List[Tuple[str, str]] = []
    for index, pair in enumerate(pairs):
        count = base + (1 if index < remainder else 0)
        plan.extend([pair] * count)

    random.shuffle(plan)
    return plan


def _build_question(index: int, concept: str, sub_concept: str) -> Dict[str, object]:
    """Create a question payload for insertion."""
    options = ["Option A", "Option B", "Option C", "Option D"]
    return {
        "question_id": str(uuid.uuid4()),
        "title": f"Practice question {index} for {sub_concept}",
        "options": options,
        "correct_option": random.choice(options),
        "concept": concept,
        "sub_concept": sub_concept,
        "difficulty": random.randint(1, 3),
        "expected_time": random.randint(45, 120),
    }


async def main() -> None:
    """Connect to MongoDB and seed questions."""
    load_dotenv()
    mongo_uri = os.getenv("MONGO_URI")
    database_name = os.getenv("DATABASE_NAME")
    if not mongo_uri or not database_name:
        raise ValueError("MONGO_URI and DATABASE_NAME must be set")

    client = AsyncIOMotorClient(mongo_uri)
    db = client[database_name]

    await db["questions"].delete_many({})

    plan = _build_subconcept_plan(120)
    payload = [
        _build_question(index + 1, concept, sub_concept)
        for index, (concept, sub_concept) in enumerate(plan)
    ]
    await db["questions"].insert_many(payload)

    client.close()


if __name__ == "__main__":
    asyncio.run(main())
