from fastapi import APIRouter
from services.topic_content import get_topic_list, get_topic_content

router = APIRouter()


@router.get("/topics")
def list_topics():
    return {"topics": get_topic_list()}


@router.get("/topics/{slug}")
def get_topic(slug: str):
    content = get_topic_content(slug)
    if not content:
        return {"error": f"Topic '{slug}' not found."}
    return content
