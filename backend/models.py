"""Pydantic models for the application."""

from datetime import datetime
from typing import List

from pydantic import BaseModel, Field


class BaseDocument(BaseModel):
    """Shared fields for all documents."""

    class Config:
        arbitrary_types_allowed = True


class User(BaseDocument):
    """User profile document."""

    user_id: str = Field(
        ...,
        example="3fa85f64-5717-4562-b3fc-2c963f66afa6",
        description="UUID string",
    )
    name: str = Field(..., example="Ada Lovelace")
    created_at: datetime = Field(..., example="2026-02-14T12:00:00Z")


class Question(BaseDocument):
    """DSA question document."""

    question_id: str = Field(
        ...,
        example="b2f1c2f8-3a75-4dbb-9f2e-0a73b8f5e2a1",
    )
    title: str = Field(..., example="Find the maximum subarray sum")
    options: List[str] = Field(
        ...,
        example=["-1", "0", "6", "7"],
    )
    correct_option: str = Field(..., example="6")
    concept: str = Field(..., example="Arrays")
    sub_concept: str = Field(..., example="Kadane")
    difficulty: int = Field(..., ge=1, le=3, example=2)
    expected_time: int = Field(..., example=90, description="Seconds")


class UserResponse(BaseDocument):
    """User response document."""

    user_id: str = Field(
        ...,
        example="3fa85f64-5717-4562-b3fc-2c963f66afa6",
    )
    question_id: str = Field(
        ...,
        example="b2f1c2f8-3a75-4dbb-9f2e-0a73b8f5e2a1",
    )
    is_correct: bool = Field(..., example=True)
    time_taken: int = Field(..., example=80, description="Seconds")
    attempts: int = Field(..., example=1)
    timestamp: datetime = Field(..., example="2026-02-14T12:05:00Z")


class QuizSubmissionItem(BaseModel):
    question_id: str
    selected_option: str
    time_taken: int

class QuizSubmission(BaseModel):
    user_id: str
    responses: List[QuizSubmissionItem]