# Skillora — AI Career Copilot

AI-powered placement preparation platform with mock interviews, resume analysis, coding practice, aptitude tests, and more.

---

## Project Structure

```
├── backend/        FastAPI Python backend
└── frontend/       Next.js 16 frontend
```

---

## Setup & Run

### Backend

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Create .env file (copy from example below)
# Add your API keys

# Run
uvicorn main:app --reload --port 8000
```

**backend/.env** (create this file — never commit it):
```env
GROQ_API_KEY=your_groq_api_key_here
SMTP_EMAIL=your_gmail@gmail.com
SMTP_PASSWORD=your_app_password
FRONTEND_URL=http://localhost:3000
RAPIDAPI_KEY=
GITHUB_TOKEN=
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run
npm run dev
```

LIVE DEMO: **https://skillora-dun.vercel.app/**

---

## Features

| Feature | Description |
|---|---|
| 🗺️ AI Roadmap | Custom prep plan for any company & role |
| 📄 Resume ATS | Resume vs job match score + skill gaps |
| 🎤 Mock Interview | HR & Technical AI interview with scoring |
| 💻 Coding Platform | 75+ problems, 4 languages, instant judge |
| 🎯 Aptitude Tests | MCQs with explanations |
| 📚 Prep Hub | Topic-wise concepts (30 topics) |
| 📝 Resume Builder | 10 layouts, live preview, PDF export |
| 💼 LinkedIn Optimizer | AI headline & keyword analysis |
| 🐙 GitHub Optimizer | Profile fetch + README generator |
| 🔥 SkillMap | GitHub-style heatmap + radar chart |
| 🔐 Auth | Email-based login, route protection |
| 🛡️ Admin Panel | Login/logout tracking, user management |

---



---

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Backend**: FastAPI, Python 3.14, SQLite, Uvicorn
- **AI**: Groq (Llama 3.3 70B), Google Gemini
- **Email**: SMTP (Gmail)
