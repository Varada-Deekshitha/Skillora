from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from services.groq_service import client
import json, re, os

router = APIRouter()

class LinkedInRequest(BaseModel):
    current_headline:  str = ""
    current_summary:   str = ""
    current_experience: str = ""
    current_skills:    str = ""
    target_role:       str = ""
    target_company:    str = ""
    years_experience:  str = ""
    key_achievements:  str = ""

@router.post("/linkedin/optimize")
def optimize_linkedin(data: LinkedInRequest):
    api_key = os.getenv("GROQ_API_KEY", "")

    # Fallback when no API key
    if not api_key or api_key == "your_groq_api_key_here":
        return _fallback_optimize(data)

    prompt = f"""/no_think
You are a LinkedIn profile expert and career coach with 10+ years of experience optimizing profiles that get recruiter attention.

Candidate Profile:
- Current Headline: {data.current_headline or 'Not provided'}
- Current Summary: {data.current_summary or 'Not provided'}
- Experience: {data.current_experience or 'Not provided'}
- Skills: {data.current_skills or 'Not provided'}
- Target Role: {data.target_role or 'Not specified'}
- Target Company: {data.target_company or 'Not specified'}
- Years of Experience: {data.years_experience or 'Not specified'}
- Key Achievements: {data.key_achievements or 'Not provided'}

Analyze and optimize this LinkedIn profile. Return ONLY valid JSON with these exact keys:
{{
  "profile_score": <integer 0-100, current profile strength>,
  "optimized_headline": "<powerful headline under 220 chars, keyword-rich>",
  "optimized_summary": "<compelling 3-paragraph About section, 2000 chars max, first-person, ends with CTA>",
  "headline_tips": ["tip 1", "tip 2", "tip 3"],
  "summary_tips": ["tip 1", "tip 2", "tip 3"],
  "skills_to_add": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "skills_to_remove": ["outdated skill1", "outdated skill2"],
  "experience_tips": ["tip 1", "tip 2", "tip 3"],
  "keyword_gaps": ["missing keyword 1", "missing keyword 2", "missing keyword 3"],
  "profile_photo_tips": ["tip 1", "tip 2"],
  "engagement_tips": ["how to get more views tip 1", "tip 2", "tip 3"],
  "overall_improvements": ["priority improvement 1", "priority improvement 2", "priority improvement 3"],
  "seo_keywords": ["keyword 1", "keyword 2", "keyword 3", "keyword 4", "keyword 5"]
}}"""

    try:
        response = client.chat.completions.create(
            model="qwen/qwen3.8-27b",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.6,
            max_tokens=2000,
        )
        text = response.choices[0].message.content.strip()
        match = re.search(r"\{.*\}", text, re.DOTALL)
        cleaned = match.group(0) if match else text.replace("```json","").replace("```","").strip()
        return json.loads(cleaned)
    except Exception as e:
        return _fallback_optimize(data)


def _fallback_optimize(data: LinkedInRequest) -> dict:
    role = data.target_role or "Software Engineer"
    headline = data.current_headline or ""
    score = 30
    if headline: score += 15
    if data.current_summary: score += 20
    if data.current_skills:  score += 15
    if data.current_experience: score += 15
    score = min(score, 75)

    return {
        "profile_score": score,
        "optimized_headline": f"{role} | Building Scalable Solutions | Open to {data.target_company or 'Top Tech Companies'} | {data.years_experience or '2+'}yrs Experience",
        "optimized_summary": f"Passionate {role} with {data.years_experience or '2+'} years of experience building impactful products.\n\nI specialize in translating complex technical challenges into elegant solutions. My work spans across {data.current_skills or 'full-stack development'}, and I'm driven by creating technology that makes a difference.\n\n{('Key achievement: ' + data.key_achievements) if data.key_achievements else 'I believe in continuous learning and collaboration.'} Currently open to exciting opportunities at {data.target_company or 'innovative companies'}. Let's connect!",
        "headline_tips": [
            "Include your current role + specialization + value proposition",
            "Add keywords recruiters search for (e.g. 'Full Stack | React | Node.js')",
            "Mention your target role or 'Open to Work' if job searching"
        ],
        "summary_tips": [
            "Start with a powerful hook — your biggest achievement or passion",
            "Use keywords from job descriptions you're targeting",
            "End with a clear call-to-action (DM me, connect, visit portfolio)"
        ],
        "skills_to_add": ["Communication", "Problem Solving", "Agile", "System Design", "Leadership"],
        "skills_to_remove": ["Outdated frameworks specific to old jobs"],
        "experience_tips": [
            "Use bullet points starting with action verbs (Built, Led, Reduced, Increased)",
            "Quantify achievements: 'Improved performance by 40%' not 'Improved performance'",
            "Add media, links, or project attachments to each experience"
        ],
        "keyword_gaps": ["System Design", "Cloud (AWS/GCP/Azure)", "Team Leadership", "Agile/Scrum"],
        "profile_photo_tips": [
            "Use a professional headshot with clean background",
            "Smile, make eye contact with camera, wear professional attire"
        ],
        "engagement_tips": [
            "Post 2-3 times per week about your work, learnings, or industry insights",
            "Comment on posts from leaders in your target company",
            "Share your projects with detailed write-ups"
        ],
        "overall_improvements": [
            "Complete all profile sections (Photo, Banner, Featured, Recommendations)",
            "Get 5+ endorsements for your top skills from colleagues",
            "Request at least 2-3 recommendations from managers or peers"
        ],
        "seo_keywords": [role, "Software Development", "Problem Solving", "Open to Work", "Tech Innovation"]
    }
