from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
import os, random, re

router = APIRouter()

# ── System prompt for Groq ─────────────────────────────────────────────────────
SYSTEM_PROMPT = """/no_think
You are Skillora, a friendly and expert AI career coach and interview preparation assistant.

Your job is to help users:
- Prepare for technical and behavioral interviews at top tech companies
- Build strong resumes and cover letters
- Create personalized study roadmaps
- Answer career and job-search questions
- Practice mock interview questions and give detailed feedback

Guidelines:
- Be concise — responses will be spoken aloud, so keep answers under 4 sentences
- Be warm, encouraging, and professional
- Share company-specific insights when asked about Google, Amazon, Microsoft, etc.
- Always end with a follow-up question or actionable tip
- Do NOT use markdown, bullet points, or special characters — plain conversational text only
"""

# ── Smart fallback responses (no API key needed) ───────────────────────────────
FALLBACK_RESPONSES = {
    # Greetings
    "hello|hi|hey|good morning|good evening|good afternoon": [
        "Hey! I'm Skillora, your AI career coach. I'm here to help you ace interviews and land your dream job. What would you like to work on today — interview prep, resume tips, or a study roadmap?",
        "Hi there! Great to meet you. I'm Skillora, your personal career coach. Whether it's cracking Google, building a stronger resume, or practicing mock interviews, I've got you covered. Where should we start?",
    ],
    # Resume
    "resume|cv|ats": [
        "Your resume is your first impression — make it count. Use strong action verbs, quantify your achievements with numbers, and tailor keywords to match the job description. Would you like me to give you specific tips for your target role?",
        "A great resume has three things: clear formatting, quantified impact, and role-specific keywords. Recruiters spend only 7 seconds on a resume, so your top third must immediately show value. What role are you targeting?",
        "For ATS optimization, mirror exact phrases from the job description, use standard section headings, and avoid tables or graphics. Would you like to go through your experience section together?",
    ],
    # Interview
    "interview|prepare|preparation|questions": [
        "Interview prep comes down to three pillars: technical depth, behavioral stories, and company research. For behavioral questions, use the STAR method — Situation, Task, Action, Result. Want me to walk you through a practice question?",
        "The best way to prepare is to practice out loud. Most people think through answers in their head, but speaking them reveals gaps in your structure. What company are you interviewing with?",
        "For technical interviews, focus on problem-solving patterns — two pointers, sliding window, BFS, DP. For behavioral rounds, prepare 5 to 8 STAR stories covering leadership, conflict, failure, and success. Which area feels weakest for you?",
    ],
    # DSA / Coding
    "coding|dsa|algorithm|leetcode|data structure": [
        "For DSA prep, I recommend mastering these patterns in order: arrays and hash maps, two pointers, sliding window, binary search, BFS and DFS, then dynamic programming. Each pattern covers dozens of problems. Which pattern should we start with?",
        "LeetCode grinding works best with a structured plan. Spend 2 weeks on easy problems to build confidence, then move to medium. Focus on one pattern at a time rather than random problems. What's your current comfort level with coding problems?",
        "The key to coding interviews is thinking out loud. Interviewers care more about your problem-solving process than the final answer. Always clarify constraints, explain your approach before coding, and analyze time and space complexity. Want to try a practice problem?",
    ],
    # Roadmap
    "roadmap|plan|study plan|how to prepare|where to start": [
        "Here's a 3-month placement roadmap: Month one, strengthen DSA fundamentals and solve 50 easy LeetCode problems. Month two, tackle medium problems and build or polish two strong projects. Month three, mock interviews daily and company-specific research. Does this match your timeline?",
        "A solid prep plan has four tracks running in parallel: DSA practice, core subject revision like OS, DBMS, and networks, project work, and soft skills. Spending 4 to 6 hours daily across these tracks for 8 to 12 weeks is what most successful candidates do. What's your target date?",
    ],
    # Company specific
    "google|amazon|microsoft|apple|meta|flipkart|uber|netflix": [
        "Top tech companies love candidates who can think at scale. Focus on system design concepts like load balancing, caching, and database sharding alongside strong DSA fundamentals. Which company are you targeting and what role?",
        "For FAANG interviews, the process typically has 4 to 6 rounds covering coding, system design, and behavioral questions. Each company has its own culture — Amazon emphasizes leadership principles, Google values clean code and analytical thinking. Want specific tips for your target company?",
    ],
    # Salary / offer
    "salary|offer|negotiate|package|ctc": [
        "Never accept the first offer — always negotiate. Research market rates on Glassdoor, LinkedIn Salary, and Levels.fyi. Have a specific number in mind, justify it with your skills and market data, and practice saying it out loud without flinching. What offer are you evaluating?",
    ],
    # Confidence / motivation
    "nervous|scared|anxious|confident|confidence|motivation|stressed|afraid": [
        "Interview nerves are completely normal — even experienced engineers feel them. The antidote is preparation and perspective. Remember, the interviewer wants you to succeed. Treat it as a collaborative problem-solving session, not an exam. What specific part makes you most nervous?",
        "Confidence comes from preparation. The more mock interviews you do, the more comfortable you get. Start with easy problems to build momentum, and remind yourself that every rejection is data that helps you improve. What would help you feel more prepared today?",
    ],
    # LinkedIn / GitHub
    "linkedin|github|profile|portfolio": [
        "A strong LinkedIn profile has a keyword-rich headline, an engaging About section with a call to action, and quantified experience bullets. Recruiters actively search LinkedIn, so treating it like a professional landing page pays off. Want tips on optimizing a specific section?",
        "Your GitHub profile is your live portfolio. Pin your 6 best repositories, add detailed README files with screenshots, and maintain a consistent contribution streak. Even small open-source contributions build credibility. What projects do you currently have?",
    ],
    # Default fallback
    "default": [
        "That's a great question. Career preparation is all about consistency and strategy. Whether you're working on coding skills, communication, or company research, I'm here to guide you every step. Could you tell me more about what you're working on?",
        "I'm here to help you land your dream role. Tell me more about your target company, role, or what specific aspect of your preparation you'd like to work on, and I'll give you actionable guidance.",
        "Great topic! Success in placements comes from focused effort on the right things. Let me know your target role and current skill level, and I'll help you build a plan that actually works.",
    ],
}

def get_fallback_reply(message: str) -> str:
    """Match message to a response category and return a relevant answer."""
    msg_lower = message.lower()
    for pattern, replies in FALLBACK_RESPONSES.items():
        if pattern == "default":
            continue
        if re.search(pattern, msg_lower):
            return random.choice(replies)
    return random.choice(FALLBACK_RESPONSES["default"])


# ── Models ─────────────────────────────────────────────────────────────────────
class Message(BaseModel):
    role: str
    content: str

class VoiceChatRequest(BaseModel):
    message: str
    history: List[Message] = []


# ── Route ──────────────────────────────────────────────────────────────────────
@router.post("/voice-chat")
def voice_chat(data: VoiceChatRequest):
    api_key = os.getenv("GROQ_API_KEY", "")

    # Use Groq AI if key is available
    if api_key and api_key != "your_groq_api_key_here":
        try:
            from services.groq_service import client
            messages = [{"role": "system", "content": SYSTEM_PROMPT}]
            for msg in data.history[-12:]:
                messages.append({"role": msg.role, "content": msg.content})
            messages.append({"role": "user", "content": data.message})

            response = client.chat.completions.create(
                model="qwen/qwen3.8-27b",
                messages=messages,
                temperature=0.75,
                max_tokens=300,
            )
            reply = response.choices[0].message.content.strip()
            return {"reply": reply, "source": "ai"}
        except Exception as e:
            print(f"[VOICE] Groq failed: {e}, using fallback")

    # Fallback — smart pre-written responses (works without API key)
    reply = get_fallback_reply(data.message)
    return {"reply": reply, "source": "fallback"}
