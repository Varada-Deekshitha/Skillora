from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from services.aptitude_bank import (
    get_categories, get_questions_by_category,
    get_mock_test, check_answers
)

router = APIRouter()


class Submission(BaseModel):
    id:       int
    selected: int   # 0-indexed option chosen by user

class SubmitRequest(BaseModel):
    submissions: List[Submission]

class MockTestRequest(BaseModel):
    section: Optional[str] = "all"   # Aptitude | Reasoning | Verbal Ability | all
    count:   Optional[int] = 20

class CategoryRequest(BaseModel):
    cat_id: str
    count:  Optional[int] = 10


@router.get("/aptitude/categories")
def list_categories():
    return {"categories": get_categories()}


@router.post("/aptitude/questions")
def get_questions(data: CategoryRequest):
    questions = get_questions_by_category(data.cat_id, data.count)
    return {"questions": questions, "total": len(questions)}


@router.post("/aptitude/mock-test")
def generate_mock_test(data: MockTestRequest):
    questions = get_mock_test(data.section, data.count)
    return {
        "questions":  questions,
        "total":      len(questions),
        "section":    data.section,
        "time_limit": len(questions) * 1.5,   # 1.5 min per question
    }


@router.post("/aptitude/submit")
def submit_answers(data: SubmitRequest):
    subs = [{"id": s.id, "selected": s.selected} for s in data.submissions]
    result = check_answers(subs)
    return result
