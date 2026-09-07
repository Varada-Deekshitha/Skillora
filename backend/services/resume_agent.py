from services.groq_service import client
import json, re

def analyze_resume_job(resume_text: str, job_description: str) -> dict:
    if not job_description or not job_description.strip():
        job_context = "No specific job description provided. Perform a general tech resume audit."
    else:
        job_context = f"Job Description:\n{job_description[:3000]}"

    prompt = f"""/no_think
You are a senior ATS expert and career coach. Analyze this resume against the job description.

Resume:
{resume_text[:3000]}

{job_context}

Return ONLY valid JSON with EXACTLY these keys:
{{
  "match_score": <integer 0-100, realistic ATS keyword match>,
  "ats_grade": "<one of: Excellent / Good / Average / Poor>",
  "matched_keywords": ["keyword1", "keyword2", ...],
  "missing_keywords": ["keyword1", "keyword2", ...],
  "missing_skills": ["skill1", "skill2", ...],
  "suggestions": ["actionable improvement 1", "actionable improvement 2", ...],
  "resume_improvements": ["specific resume fix 1", "specific resume fix 2", ...],
  "strengths": ["strength 1", "strength 2", ...],
  "roadmap": ["prep step 1", "prep step 2", "prep step 3"],
  "interview_questions": ["question 1", "question 2", "question 3", "question 4", "question 5"],
  "tips": ["ATS tip 1", "ATS tip 2", "ATS tip 3"]
}}

Rules:
- match_score: base it on keyword overlap between resume and job description
- matched_keywords: skills/tools/technologies present in BOTH resume and job description  
- missing_keywords: important keywords from job description NOT in resume
- suggestions: 3-5 specific, actionable tips to improve ATS score
- resume_improvements: 3-5 specific resume formatting/content improvements
- strengths: 2-3 things the candidate is already doing well
- roadmap: 3-5 step plan to bridge skill gaps
- interview_questions: 5 likely interview questions for this role
- tips: 3 pro ATS tips specific to this resume/role combination
Return ONLY the JSON object. No markdown, no explanation."""

    try:
        response = client.chat.completions.create(
            model="qwen/qwen3.8-27b",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=1500,
        )
        text = response.choices[0].message.content.strip()

        # Extract JSON
        match = re.search(r"\{.*\}", text, re.DOTALL)
        cleaned = match.group(0) if match else text.replace("```json","").replace("```","").strip()
        data = json.loads(cleaned)

        # Ensure all fields present
        score = int(data.get("match_score", 50))
        grade = data.get("ats_grade") or (
            "Excellent" if score >= 85 else
            "Good"      if score >= 70 else
            "Average"   if score >= 50 else "Poor"
        )

        return {
            "match_score":         score,
            "ats_grade":           grade,
            "matched_keywords":    data.get("matched_keywords",    []),
            "missing_keywords":    data.get("missing_keywords",    []),
            "missing_skills":      data.get("missing_skills",      []),
            "suggestions":         data.get("suggestions",         []),
            "resume_improvements": data.get("resume_improvements", []),
            "strengths":           data.get("strengths",           []),
            "roadmap":             data.get("roadmap",             []),
            "interview_questions": data.get("interview_questions", []),
            "tips":                data.get("tips",                []),
        }

    except Exception as e:
        print(f"[RESUME AGENT] Error: {e}")
        return {
            "match_score": 0,
            "ats_grade": "Poor",
            "matched_keywords": [],
            "missing_keywords": [],
            "missing_skills": [],
            "suggestions": ["Could not analyze. Check backend logs."],
            "resume_improvements": [],
            "strengths": [],
            "roadmap": [],
            "interview_questions": [],
            "tips": [],
            "error": str(e),
        }
