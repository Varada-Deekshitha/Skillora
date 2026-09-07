from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import httpx, base64, time, os, json
from services.problem_bank import get_all_problems, get_problem
from services.extended_problems import get_extended_problems, get_extended_problem_meta
from services.groq_service import client as groq_client

router = APIRouter()

JUDGE0_URL = "https://judge0-ce.p.rapidapi.com"
RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY", "")

LANG_IDS = {
    "python": 71, "javascript": 63, "java": 62, "cpp": 54, "c": 50,
}

def run_python_locally(code: str, stdin: str = "") -> dict:
    import subprocess, sys, tempfile, os
    with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False) as f:
        f.write(code); fname = f.name
    try:
        result = subprocess.run([sys.executable, fname], input=stdin, capture_output=True, text=True, timeout=5)
        return {"stdout": result.stdout.strip(), "stderr": result.stderr.strip(),
                "status": "Accepted" if result.returncode == 0 else "Runtime Error", "time": "< 1s", "memory": "N/A"}
    except subprocess.TimeoutExpired:
        return {"stdout": "", "stderr": "Time Limit Exceeded", "status": "TLE", "time": ">5s", "memory": "N/A"}
    except Exception as e:
        return {"stdout": "", "stderr": str(e), "status": "Error", "time": "N/A", "memory": "N/A"}
    finally:
        try: os.unlink(fname)
        except: pass


class RunRequest(BaseModel):
    code: str; language: str = "python"; stdin: str = ""

class SubmitRequest(BaseModel):
    problem_id: int; code: str; language: str = "python"


@router.get("/coding/problems")
def list_problems():
    base = get_all_problems()          # IDs 1-76 (full problems)
    ext  = get_extended_problems()     # IDs 77-500 (metadata)
    return {"problems": base + ext}


@router.get("/coding/problem/{problem_id}")
def get_problem_detail(problem_id: int):
    # Try static bank first (IDs 1–76)
    p = get_problem(problem_id)
    if p:
        return p
    # Extended problem — generate details via Groq
    meta = get_extended_problem_meta(problem_id)
    if not meta:
        return {"error": "Problem not found"}
    return _generate_problem_details(meta)


def _generate_problem_details(meta: dict) -> dict:
    """Generate full problem details using Groq AI for extended problems."""
    try:
        client = groq_client
        prompt = f"""/no_think
Generate a complete coding problem for:
Title: {meta['title']}
Difficulty: {meta['difficulty']}
Tags: {', '.join(meta['tags'])}

Return ONLY valid JSON with this exact structure:
{{
  "id": {meta['id']},
  "title": "{meta['title']}",
  "slug": "{meta['slug']}",
  "difficulty": "{meta['difficulty']}",
  "tags": {json.dumps(meta['tags'])},
  "acceptance": {meta['acceptance']},
  "description": "Full problem description with examples and constraints (use \\n for newlines)",
  "starter": {{
    "python": "Python starter code with function signature and example call",
    "javascript": "JavaScript starter code",
    "java": "Java starter code with main method",
    "cpp": "C++ starter code with main"
  }},
  "test_cases": [
    {{"input": "example input 1", "expected": "expected output 1"}},
    {{"input": "example input 2", "expected": "expected output 2"}},
    {{"input": "edge case input", "expected": "edge case output"}}
  ]
}}
Make the starter code actually compilable/runnable. For python use simple print statement."""

        response = client.chat.completions.create(
            model="qwen/qwen3.8-27b",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=2000,
        )
        text = response.choices[0].message.content.strip()
        # Extract JSON
        if "```json" in text: text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:   text = text.split("```")[1].split("```")[0].strip()
        return json.loads(text)
    except Exception as e:
        # Fallback: return meta with placeholder details
        return {
            **meta,
            "description": f"**{meta['title']}**\n\nDifficulty: {meta['difficulty']}\nTags: {', '.join(meta['tags'])}\n\nSolve this problem using the concepts from: {', '.join(meta['tags'][:3])}.\n\nCheck the constraints and examples carefully.",
            "starter": {
                "python": f"# {meta['title']}\n# Tags: {', '.join(meta['tags'])}\n\ndef solve():\n    # Write your solution here\n    pass\n\nprint(solve())",
                "javascript": f"// {meta['title']}\nfunction solve() {{\n    // Write your solution\n}}\nconsole.log(solve());",
                "java": f"// {meta['title']}\nclass Solution {{\n    public static void main(String[] args) {{\n        // Write your solution\n    }}\n}}",
                "cpp": f"// {meta['title']}\n#include<bits/stdc++.h>\nusing namespace std;\nint main(){{\n    // Write your solution\n    return 0;\n}}",
            },
            "test_cases": [{"input": "sample", "expected": "output"}],
        }


@router.post("/coding/run")
def run_code(data: RunRequest):
    lang = data.language.lower()
    if lang == "python" and not RAPIDAPI_KEY:
        return run_python_locally(data.code, data.stdin)
    lang_id = LANG_IDS.get(lang)
    if not lang_id:
        return {"error": f"Language '{lang}' not supported."}
    return _judge0_run(data.code, lang_id, data.stdin)


@router.post("/coding/submit")
def submit_code(data: SubmitRequest):
    # Try static bank first
    problem = get_problem(data.problem_id)
    if not problem:
        # Generate for extended
        meta = get_extended_problem_meta(data.problem_id)
        if not meta: return {"error": "Problem not found"}
        problem = _generate_problem_details(meta)

    lang = data.language.lower()
    results = []; passed = 0

    for tc in problem.get("test_cases", []):
        if lang == "python" and not RAPIDAPI_KEY:
            r = run_python_locally(data.code, tc["input"])
        else:
            lang_id = LANG_IDS.get(lang)
            if not lang_id: return {"error": f"Language '{lang}' not supported."}
            r = _judge0_run(data.code, lang_id, tc["input"])

        actual = r.get("stdout", "").strip()
        expected = tc["expected"].strip()
        ok = actual == expected
        if ok: passed += 1
        results.append({"input": tc["input"], "expected": expected, "actual": actual,
                        "passed": ok, "status": r.get("status"), "time": r.get("time"), "stderr": r.get("stderr","")})

    total = len(problem.get("test_cases", []))
    return {"passed": passed, "total": total, "accepted": passed == total,
            "verdict": "Accepted ✓" if passed == total else f"Wrong Answer ({passed}/{total} passed)",
            "results": results}


def _judge0_run(code: str, lang_id: int, stdin: str = "") -> dict:
    headers = {"content-type": "application/json", "x-rapidapi-host": "judge0-ce.p.rapidapi.com"}
    if RAPIDAPI_KEY: headers["x-rapidapi-key"] = RAPIDAPI_KEY
    encoded_code  = base64.b64encode(code.encode()).decode()
    encoded_stdin = base64.b64encode(stdin.encode()).decode() if stdin else ""
    payload = {"language_id": lang_id, "source_code": encoded_code, "stdin": encoded_stdin, "base64_encoded": True, "wait": True}
    try:
        with httpx.Client(timeout=15) as client:
            res = client.post(f"{JUDGE0_URL}/submissions?base64_encoded=true&wait=true", json=payload, headers=headers)
            if res.status_code != 201:
                return {"stdout": "", "stderr": f"Judge0 error {res.status_code}", "status": "Error", "time": "N/A", "memory": "N/A"}
            data = res.json()
            stdout = base64.b64decode(data.get("stdout") or "").decode().strip()
            stderr = base64.b64decode(data.get("stderr") or "").decode().strip()
            compile_err = base64.b64decode(data.get("compile_output") or "").decode().strip()
            status = data.get("status", {}).get("description", "Unknown")
            exec_time = data.get("time", "N/A"); memory = data.get("memory", "N/A")
            return {"stdout": stdout, "stderr": stderr or compile_err, "status": status,
                    "time": f"{exec_time}s" if exec_time and exec_time != "N/A" else "N/A",
                    "memory": f"{memory} KB" if memory and memory != "N/A" else "N/A"}
    except Exception as e:
        return {"stdout": "", "stderr": str(e), "status": "Connection Error", "time": "N/A", "memory": "N/A"}
