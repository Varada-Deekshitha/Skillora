from fastapi import APIRouter, UploadFile, File, Form
from typing import Optional

from services.resume_parser import extract_text
from services.resume_agent import analyze_resume_job
from services.job_scraper import scrape_job

router = APIRouter()


@router.post("/resume-match")
async def resume_match(
    resume: UploadFile = File(...),
    job_link: Optional[str] = Form(default="")
):
    try:
        resume_text = extract_text(resume)
    except Exception as e:
        return {"error": f"Failed to read resume: {str(e)}", "match_score": 0}

    # Scrape job description only if link provided
    job_description = ""
    if job_link and job_link.strip():
        try:
            job_description = scrape_job(job_link.strip())
        except Exception:
            job_description = ""

    if not job_description:
        job_description = "General software engineering position. Evaluate resume for technical skills, experience, projects, and overall quality."

    try:
        result = analyze_resume_job(resume_text, job_description)
        return result
    except Exception as e:
        return {
            "error": f"Analysis failed: {str(e)}",
            "match_score": 0,
            "matched_keywords": [],
            "missing_keywords": [],
            "suggestions": ["Make sure the backend GROQ_API_KEY is set in .env"]
        }
