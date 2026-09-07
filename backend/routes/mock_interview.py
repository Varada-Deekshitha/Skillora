from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from services.groq_service import client
from services.question_bank import get_questions_for_round
import json, re, random, os

router = APIRouter()

# ── Step 1: Generate questions using real question bank ────────────────────────
class QuestionRequest(BaseModel):
    round_type: str        # hr | technical
    company:    str = ""
    role:       str = ""

@router.post("/mock-interview/questions")
def get_questions(data: QuestionRequest):
    import random
    pool = get_questions_for_round(data.round_type.lower(), count=30)

    # Try AI if key is available, else fallback to direct bank
    api_key = os.getenv("GROQ_API_KEY", "")
    if api_key and api_key != "your_groq_api_key_here":
        try:
            sample_qs = "\n".join(f"- {q}" for q in pool[:15])
            company_ctx = f" The candidate is targeting {data.company} for the role of {data.role}." if data.company else ""
            round_label = "HR behavioral" if data.round_type.lower() == "hr" else "Technical"
            prompt = f"""/no_think
You are an expert {round_label} interviewer.{company_ctx}
Pick exactly 5 of the most relevant questions from this pool:
{sample_qs}
Return ONLY a JSON array of 5 strings. No markdown."""
            response = client.chat.completions.create(
                model="qwen/qwen3.8-27b",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.5, max_tokens=600,
            )
            text = response.choices[0].message.content.strip()
            match = re.search(r"\[.*\]", text, re.DOTALL)
            cleaned = match.group(0) if match else text.replace("```json","").replace("```","").strip()
            questions = json.loads(cleaned)
            if questions and len(questions) >= 5:
                return {"questions": questions[:5]}
        except Exception:
            pass

    # Fallback: direct from question bank (always works, no API needed)
    questions = random.sample(pool, min(5, len(pool)))
    return {"questions": questions}


# ── Step 2: Evaluate a single answer ──────────────────────────────────────────
class EvalRequest(BaseModel):
    question:   str
    answer:     str
    round_type: str

@router.post("/mock-interview/evaluate")
def evaluate_answer(data: EvalRequest):
    api_key = os.getenv("GROQ_API_KEY", "")
    if not api_key or api_key == "your_groq_api_key_here":
        # Basic fallback scoring based on answer length & content
        length = len(data.answer.strip())
        base = min(40 + (length // 10), 75)
        import random as rnd
        return {
            "score": base + rnd.randint(0, 15),
            "confidence_score": base + rnd.randint(-5, 10),
            "communication_score": base + rnd.randint(-5, 10),
            "strengths": ["Attempted the question", "Provided some relevant points"],
            "weaknesses": ["Could be more detailed", "Add specific examples"],
            "ideal_answer_hint": "A strong answer uses the STAR method (Situation, Task, Action, Result) with specific examples.",
            "improvements": ["Add more technical depth", "Use structured format (STAR)", "Include real examples from experience"]
        }

    prompt = f"""/no_think
You are an expert interview evaluator for a {data.round_type} round.

Question: {data.question}
Candidate Answer: {data.answer}

Evaluate strictly and return ONLY valid JSON:
{{
  "score": <integer 0-100>,
  "confidence_score": <integer 0-100>,
  "communication_score": <integer 0-100>,
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "ideal_answer_hint": "Brief 2-3 sentence ideal answer hint",
  "improvements": ["tip 1", "tip 2"]
}}"""
    response = client.chat.completions.create(
        model="qwen/qwen3.8-27b",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.4, max_tokens=600,
    )
    text = response.choices[0].message.content.strip()
    match = re.search(r"\{.*\}", text, re.DOTALL)
    cleaned = match.group(0) if match else text.replace("```json","").replace("```","").strip()
    try:
        return json.loads(cleaned)
    except Exception:
        return {
            "score": 55, "confidence_score": 55, "communication_score": 55,
            "strengths": ["Attempted the answer"],
            "weaknesses": ["Needs more detail"],
            "ideal_answer_hint": "Please try again with a more structured answer.",
            "improvements": ["Add more technical depth", "Use STAR method"]
        }


# ── Step 3: Final interview report ────────────────────────────────────────────
class ReportRequest(BaseModel):
    round_type: str
    evaluations: List[dict]   # list of evaluate responses

@router.post("/mock-interview/report")
def generate_report(data: ReportRequest):
    if not data.evaluations:
        return {"error": "No evaluations provided"}

    scores     = [e.get("score", 50) for e in data.evaluations]
    conf       = [e.get("confidence_score", 50) for e in data.evaluations]
    comm       = [e.get("communication_score", 50) for e in data.evaluations]
    avg_score  = round(sum(scores) / len(scores))
    avg_conf   = round(sum(conf) / len(conf))
    avg_comm   = round(sum(comm) / len(comm))

    all_weak   = []
    all_improv = []
    for e in data.evaluations:
        all_weak.extend(e.get("weaknesses", []))
        all_improv.extend(e.get("improvements", []))

    # Deduplicate
    seen = set()
    unique_weak   = [x for x in all_weak   if not (x in seen or seen.add(x))][:5]  # type: ignore
    seen2 = set()
    unique_improv = [x for x in all_improv if not (x in seen2 or seen2.add(x))][:5] # type: ignore

    # Grade
    if avg_score >= 85: grade, verdict = "A", "Excellent — Ready to interview!"
    elif avg_score >= 70: grade, verdict = "B", "Good — Minor improvements needed."
    elif avg_score >= 55: grade, verdict = "C", "Average — Focused practice required."
    else: grade, verdict = "D", "Needs Work — Significant preparation needed."

    return {
        "overall_score":      avg_score,
        "confidence_score":   avg_conf,
        "communication_score":avg_comm,
        "grade":              grade,
        "verdict":            verdict,
        "round_type":         data.round_type,
        "questions_attempted":len(data.evaluations),
        "top_improvements":   unique_improv,
        "weak_areas":         unique_weak,
    }


# ── Step 4: Get ideal answer for a question ────────────────────────────────────

# Curated model answers for common interview questions (no API key needed)
HR_MODEL_ANSWERS = {
    "tell me about yourself": """Start with your name and current role/education. Briefly mention your background (2-3 years), highlight your top 2-3 relevant skills with one achievement each, then state why you're excited about this opportunity.

Structure: "I'm [Name], a [role] with [X] years of experience in [domain]. I've worked on [achievement 1] and [achievement 2]. I'm passionate about [relevant area] and I'm excited about this opportunity because [specific reason]."

Key tips: Keep it under 2 minutes, make it job-relevant, end with why you want THIS role.""",

    "why should we hire you": """Connect your unique skills directly to the job requirements. Use 3 pillars: (1) your relevant experience, (2) a specific achievement that proves your value, (3) your enthusiasm for the company.

Example: "You should hire me because I bring [specific skill] that directly addresses [company's challenge]. In my previous role, I [specific achievement with metric]. I've researched [company] and I'm excited to contribute to [specific goal]."

Key: Be specific, quantify impact, show you've done your research.""",

    "what is your greatest strength": """Choose a strength directly relevant to the job. Prove it with a specific example, then connect it to the role.

Structure: State the strength → Give a real example with result → Connect to this role.

Example: "My greatest strength is problem-solving. At [Company], when [situation], I [action taken], which resulted in [measurable outcome]. This skill directly applies to this role because [connection]."

Avoid generic answers like 'hardworking' — use specifics.""",

    "what is your greatest weakness": """Choose a real weakness you've actively improved. Never say "I'm a perfectionist" — interviewers see through it.

Structure: State a genuine weakness → Show self-awareness → Describe concrete steps to improve → Show progress.

Example: "I used to struggle with public speaking. I recognized it was limiting my career, so I joined Toastmasters and volunteered to lead team presentations. Now I regularly present to 50+ people. I still practice before important talks but it's no longer a barrier."

This shows self-awareness, growth mindset, and honesty.""",

    "where do you see yourself in 5 years": """Show ambition aligned with the company's growth path. Research the career trajectory for this role.

Good answer: "In 5 years, I see myself as a senior [role] with deep expertise in [domain], ideally having led a team or major project. I'd like to grow within [Company] because [specific reason]. I'm excited to contribute first by [near-term goal] and build from there."

Avoid: "I want your job" or "I don't know" — both are red flags.""",

    "tell me about a time you failed": """Use STAR method. Choose a real failure, take ownership, focus on what you learned.

Structure: Situation (briefly) → Task → What went wrong (your responsibility) → What you learned → How you applied that learning.

Example: "Early in my career, I underestimated the timeline for a project [Situation]. I failed to communicate delays early [Action], which caused the team stress [Result]. I learned to build buffer time and give early warnings on risks. Since then, I've never missed a deadline because I now track milestones weekly and escalate early."

Interviewers want to see: honesty, ownership, growth.""",
}

TECH_MODEL_ANSWERS = {
    "what is object-oriented programming": """OOP is a programming paradigm based on objects that encapsulate data and behavior. It has 4 core pillars:

1. **Encapsulation**: Bundling data and methods together, hiding implementation details (e.g., private variables with getters/setters).
2. **Abstraction**: Showing only essential features, hiding complexity (e.g., abstract classes/interfaces).
3. **Inheritance**: A class inheriting properties and methods from a parent class, enabling code reuse.
4. **Polymorphism**: Same interface, different implementations — method overloading (compile-time) and overriding (runtime).

Real-world analogy: A Car class has attributes (speed, fuel) and methods (drive, brake). A SportsCar inherits from Car and overrides the drive() method.""",

    "explain time complexity": """Time complexity measures how an algorithm's execution time grows with input size n.

Common complexities (best to worst):
- O(1): Constant — array access, hash map lookup
- O(log n): Logarithmic — binary search
- O(n): Linear — simple loop through array
- O(n log n): Linearithmic — merge sort, heap sort
- O(n²): Quadratic — nested loops, bubble sort
- O(2ⁿ): Exponential — recursive Fibonacci without memoization

To analyze: count the dominant operations. Drop constants and lower-order terms. Example: a loop with n iterations → O(n). Nested loops → O(n²).""",

    "what is a linked list": """A linked list is a linear data structure where elements (nodes) are stored non-contiguously, connected via pointers.

Each node has: (1) data, (2) pointer to next node.

Types: Singly (one direction), Doubly (both directions), Circular (last points to first).

Advantages over arrays: Dynamic size, O(1) insertion/deletion at known position.
Disadvantages: O(n) search, no random access, extra memory for pointers.

Use when: Frequent insertions/deletions at beginning/middle, unknown size at compile time.""",

    "difference between stack and queue": """Both are linear data structures with different access patterns:

Stack (LIFO — Last In First Out):
- Operations: push (add top), pop (remove top), peek (view top)
- Use cases: function call stack, undo operations, expression evaluation
- Example: Browser back button

Queue (FIFO — First In First Out):
- Operations: enqueue (add rear), dequeue (remove front)
- Use cases: BFS traversal, task scheduling, printer queue
- Example: Waiting line at a counter

Implementation: Both can be implemented using arrays or linked lists.""",

    "what is recursion": """Recursion is when a function calls itself to solve a smaller version of the same problem.

Every recursive function needs:
1. Base case: the stopping condition (prevents infinite recursion)
2. Recursive case: where the function calls itself with a smaller input

Example — Factorial:
```
def factorial(n):
    if n == 0: return 1  # base case
    return n * factorial(n-1)  # recursive case
```

Advantages: Clean code for divide-and-conquer problems (trees, graphs, DFS).
Disadvantages: Stack overflow risk, higher memory use than iteration.

When to use: Tree traversals, DFS, backtracking, divide & conquer algorithms.""",
}


def get_model_answer_fallback(question: str, round_type: str) -> str:
    """Return a curated model answer based on keyword matching."""
    q_lower = question.lower()

    bank = HR_MODEL_ANSWERS if round_type.lower() == "hr" else TECH_MODEL_ANSWERS

    for key, answer in bank.items():
        if any(word in q_lower for word in key.split()):
            return answer

    # Generic fallback
    if round_type.lower() == "hr":
        return """Use the STAR method (Situation, Task, Action, Result) for all behavioral questions.

Structure your answer:
1. Situation: Set the context briefly (1-2 sentences)
2. Task: What was your responsibility?
3. Action: What specific steps did YOU take? (use "I", not "we")
4. Result: Quantify the outcome — "increased by 30%", "reduced time by 2 weeks"

Key tips:
- Keep answers 1-2 minutes long
- Use specific numbers and metrics wherever possible
- Always end with what you learned or the positive outcome
- Prepare 5-8 STAR stories covering: leadership, conflict, failure, success, teamwork"""
    else:
        return """For technical questions, structure your answer clearly:

1. Define the concept in 1-2 sentences
2. Explain the key components or properties
3. Give a real code example or analogy
4. Mention trade-offs (advantages vs disadvantages)
5. State when you'd use it in practice

For coding problems:
1. Clarify constraints and edge cases first
2. Think out loud — state your approach before coding
3. Start with brute force, then optimize
4. Analyze time and space complexity
5. Test with examples including edge cases"""


class IdealAnswerRequest(BaseModel):
    question:   str
    round_type: str = "hr"


@router.post("/mock-interview/ideal-answer")
def get_ideal_answer(data: IdealAnswerRequest):
    """Return a comprehensive model answer for any interview question."""
    api_key = os.getenv("GROQ_API_KEY", "")

    if api_key and api_key != "your_groq_api_key_here":
        try:
            round_label = "HR behavioral" if data.round_type.lower() == "hr" else "Technical"
            prompt = f"""/no_think
You are an expert {round_label} interviewer and career coach.

Question: {data.question}

Provide a comprehensive model answer that a top candidate would give. Include:
1. The ideal answer structure/framework to use
2. A complete sample answer (2-3 paragraphs)
3. Key points that MUST be mentioned
4. What interviewers specifically look for
5. Common mistakes to avoid

Write in a clear, practical format that helps candidates understand both WHAT to say and HOW to say it. No markdown headers — use plain text with numbered points."""

            response = client.chat.completions.create(
                model="qwen/qwen3.8-27b",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.6,
                max_tokens=800,
            )
            answer = response.choices[0].message.content.strip()
            return {"answer": answer, "source": "ai"}
        except Exception as e:
            print(f"[IDEAL ANSWER] Groq failed: {e}")

    # Fallback — curated model answers
    answer = get_model_answer_fallback(data.question, data.round_type)
    return {"answer": answer, "source": "fallback"}
