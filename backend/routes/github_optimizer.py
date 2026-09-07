from fastapi import APIRouter
from pydantic import BaseModel
import requests, os, json, re
from services.groq_service import client

router = APIRouter()

class GithubRequest(BaseModel):
    username:      str
    target_role:   str = ""
    target_company: str = ""

def fetch_github_data(username: str) -> dict:
    """Fetch real GitHub profile + repos via GitHub public API."""
    headers = {"Accept": "application/vnd.github.v3+json"}
    token = os.getenv("GITHUB_TOKEN", "")
    if token:
        headers["Authorization"] = f"token {token}"

    base = "https://api.github.com"

    # Profile
    profile_res = requests.get(f"{base}/users/{username}", headers=headers, timeout=10)
    if profile_res.status_code == 404:
        return {"error": f"GitHub user '{username}' not found."}
    if profile_res.status_code != 200:
        return {"error": "GitHub API error. Try again."}

    profile = profile_res.json()

    # Repos (top 30 by stars)
    repos_res = requests.get(
        f"{base}/users/{username}/repos?sort=stars&per_page=30",
        headers=headers, timeout=10
    )
    repos = repos_res.json() if repos_res.status_code == 200 else []

    # Languages
    lang_count: dict = {}
    for repo in repos[:10]:
        lang = repo.get("language")
        if lang:
            lang_count[lang] = lang_count.get(lang, 0) + 1

    top_langs = sorted(lang_count, key=lang_count.get, reverse=True)[:6]  # type: ignore

    repo_summary = [
        {
            "name": r.get("name", ""),
            "desc": r.get("description", "") or "",
            "stars": r.get("stargazers_count", 0),
            "forks": r.get("forks_count", 0),
            "lang": r.get("language", ""),
            "topics": r.get("topics", []),
        }
        for r in repos[:15]
    ]

    return {
        "login":       profile.get("login", ""),
        "name":        profile.get("name", "") or "",
        "bio":         profile.get("bio", "") or "",
        "company":     profile.get("company", "") or "",
        "location":    profile.get("location", "") or "",
        "blog":        profile.get("blog", "") or "",
        "email":       profile.get("email", "") or "",
        "twitter":     profile.get("twitter_username", "") or "",
        "public_repos":  profile.get("public_repos", 0),
        "followers":     profile.get("followers", 0),
        "following":     profile.get("following", 0),
        "avatar_url":    profile.get("avatar_url", ""),
        "html_url":      profile.get("html_url", ""),
        "created_at":    profile.get("created_at", ""),
        "top_languages": top_langs,
        "repos":         repo_summary,
        "total_stars":   sum(r.get("stargazers_count", 0) for r in repos),
    }


@router.post("/github/optimize")
def optimize_github(data: GithubRequest):
    if not data.username.strip():
        return {"error": "Username is required."}

    gh = fetch_github_data(data.username.strip())
    if "error" in gh:
        return gh

    api_key = os.getenv("GROQ_API_KEY", "")
    if not api_key or api_key == "your_groq_api_key_here":
        return _fallback(gh, data)

    repo_text = "\n".join(
        f"- {r['name']} ({r['lang'] or 'N/A'}, ⭐{r['stars']}): {r['desc'][:80]}"
        for r in gh["repos"][:10]
    )
    top_langs = ", ".join(gh["top_languages"]) or "Not detected"

    prompt = f"""/no_think
You are a GitHub profile expert helping developers get noticed by recruiters and open-source communities.

GitHub Profile Data:
- Username: {gh['login']}
- Name: {gh['name'] or 'Not set'}
- Bio: {gh['bio'] or 'Not set'}
- Location: {gh['location'] or 'Not set'}
- Blog/Website: {gh['blog'] or 'Not set'}
- Company: {gh['company'] or 'Not set'}
- Public Repos: {gh['public_repos']}
- Followers: {gh['followers']} | Following: {gh['following']}
- Total Stars: {gh['total_stars']}
- Top Languages: {top_langs}
- Target Role: {data.target_role or 'Software Engineer'}
- Target Company: {data.target_company or 'Top Tech Company'}

Top Repositories:
{repo_text}

Analyze this GitHub profile and return ONLY valid JSON:
{{
  "profile_score": <0-100>,
  "grade": "<A/B/C/D>",
  "verdict": "<one line verdict>",
  "optimized_bio": "<compelling bio under 160 chars, keyword-rich for {data.target_role or 'software engineer'}>",
  "bio_tips": ["tip1","tip2","tip3"],
  "readme_template": "<markdown README.md template with emojis, About Me, Tech Stack, Stats, Contact — ready to use>",
  "top_repos_to_pin": ["repo1","repo2","repo3","repo4","repo5","repo6"],
  "repo_improvement_tips": ["tip1","tip2","tip3"],
  "languages_to_learn": ["lang1","lang2","lang3"],
  "contribution_tips": ["tip1","tip2","tip3"],
  "profile_strengths": ["strength1","strength2","strength3"],
  "profile_weaknesses": ["weakness1","weakness2","weakness3"],
  "quick_wins": ["quick improvement 1","quick improvement 2","quick improvement 3","quick improvement 4"]
}}"""

    try:
        response = client.chat.completions.create(
            model="qwen/qwen3.8-27b",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.6, max_tokens=2500,
        )
        text = response.choices[0].message.content.strip()
        match = re.search(r"\{.*\}", text, re.DOTALL)
        cleaned = match.group(0) if match else text.replace("```json","").replace("```","").strip()
        result = json.loads(cleaned)
        result["github_data"] = gh
        return result
    except Exception:
        result = _fallback(gh, data)
        result["github_data"] = gh
        return result


def _fallback(gh: dict, data: GithubRequest) -> dict:
    role = data.target_role or "Software Engineer"
    score = 20
    if gh.get("bio"):         score += 15
    if gh.get("name"):        score += 10
    if gh.get("location"):    score += 5
    if gh.get("blog"):        score += 10
    if gh.get("total_stars", 0) > 10: score += 15
    if gh.get("public_repos", 0) > 5: score += 10
    if gh.get("followers", 0) > 10:   score += 10
    score = min(score, 85)

    top_repos = [r["name"] for r in sorted(gh.get("repos", []), key=lambda x: x["stars"], reverse=True)[:6]]
    langs = gh.get("top_languages", [])

    return {
        "profile_score": score,
        "grade": "A" if score>=85 else "B" if score>=70 else "C" if score>=50 else "D",
        "verdict": "Good profile — a few improvements will make it stand out to recruiters.",
        "optimized_bio": f"{'| '.join(langs[:3]) + ' Developer' if langs else role} | Building impactful projects | Open to {data.target_company or 'top tech'} opportunities",
        "bio_tips": [
            "Include your top 2-3 tech stack keywords in the bio",
            "Mention what you're currently building or learning",
            "Add a CTA like 'Open to opportunities' or 'Check my projects below'"
        ],
        "readme_template": f"""# Hi there, I'm {gh.get('name') or gh.get('login')} 👋

## 🚀 About Me
- 🔭 I'm currently working on **[Your Project]**
- 🌱 I'm learning **{', '.join(langs[:3]) if langs else 'new technologies'}**
- 💼 Open to **{role}** roles at **{data.target_company or 'top tech companies'}**
- 📫 Reach me at: **{gh.get('email') or '[your email]'}**

## 🛠️ Tech Stack
![Languages]({gh.get('html_url', '') + '#gh-languages'})

## 📊 GitHub Stats
![Stats](https://github-readme-stats.vercel.app/api?username={gh.get('login')}&show_icons=true&theme=radical)
![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username={gh.get('login')}&layout=compact&theme=radical)

## 🔥 Streak
![Streak](https://github-readme-streak-stats.herokuapp.com?user={gh.get('login')}&theme=radical)

## 📫 Connect With Me
{'- 🌐 [Website](' + gh.get('blog') + ')' if gh.get('blog') else ''}
{'- 🐦 [Twitter](https://twitter.com/' + gh.get('twitter') + ')' if gh.get('twitter') else ''}
- 💼 [LinkedIn](https://linkedin.com/in/{gh.get('login')})
""",
        "top_repos_to_pin": top_repos or ["Add your best repositories here"],
        "repo_improvement_tips": [
            "Add detailed README.md to every repository with screenshots",
            "Add topics/tags to repos so they appear in search results",
            "Include a live demo link or deployment URL in repo description"
        ],
        "languages_to_learn": ["TypeScript", "Go", "Rust"] if not langs else ["Cloud (AWS/GCP)", "Docker", "Kubernetes"],
        "contribution_tips": [
            "Contribute to popular open-source projects — even small fixes count",
            "Maintain a consistent contribution streak (daily commits)",
            "Create GitHub Actions workflows to automate your projects"
        ],
        "profile_strengths": [
            f"{gh.get('public_repos', 0)} public repositories" if gh.get('public_repos') else "Active GitHub account",
            f"⭐ {gh.get('total_stars', 0)} total stars across repositories" if gh.get('total_stars') else "Projects visible publicly",
            f"Top languages: {', '.join(langs[:3])}" if langs else "Diverse project portfolio"
        ],
        "profile_weaknesses": [
            "Bio is empty — add your skills and goals" if not gh.get("bio") else "Bio could be more keyword-rich",
            "No website/portfolio link" if not gh.get("blog") else "Profile photo and name look good",
            "Profile README is missing — it's the first thing recruiters see"
        ],
        "quick_wins": [
            "Add a Profile README (create repo named same as your username)",
            "Pin your 6 best repositories to the profile",
            "Add website/portfolio URL to profile",
            "Enable GitHub Sponsors and add social links"
        ],
        "github_data": gh,
    }
