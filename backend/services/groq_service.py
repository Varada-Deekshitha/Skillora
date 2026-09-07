from groq import Groq
from dotenv import load_dotenv
import os
import json

load_dotenv()

# Lazy client — only instantiated when actually needed so the server
# starts even without a GROQ_API_KEY configured.
_client = None

def _get_client():
    global _client
    if _client is None:
        api_key = os.getenv("GROQ_API_KEY", "")
        if not api_key or api_key == "your_groq_api_key_here":
            raise RuntimeError(
                "GROQ_API_KEY is not set. Add it to backend/.env to enable AI features."
            )
        _client = Groq(api_key=api_key)
    return _client

# Keep `client` as a convenience alias used by other modules
class _LazyClient:
    def __getattr__(self, name):
        return getattr(_get_client(), name)

client = _LazyClient()
def generate_ai_plan(company, skill_level, goal):

    prompt = f"""
You are an expert placement mentor.

Company: {company}
Skill Level: {skill_level}
Goal: {goal}

Return ONLY valid JSON.

{{
    "roadmap": [
        "step 1",
        "step 2",
        "step 3"
    ],
    "resume_tips": [
        "tip 1",
        "tip 2",
        "tip 3"
    ],
    "interview_questions": [
        "question 1",
        "question 2",
        "question 3"
    ]
}}
"""
    print("\n===== PROMPT =====\n")
    print(prompt)
    print("\n==================\n")

    response = client.chat.completions.create(
        model="qwen/qwen3.8-27b",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.7
    )

    text = response.choices[0].message.content

    print("\n========== RAW RESPONSE ==========\n")
    print(text)
    print("\n==================================\n")

    import json

    cleaned = text.replace("```json", "").replace("```", "").strip()

    return json.loads(cleaned)