from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.hello import router as hello_router
from routes.roadmap import router as roadmap_router
from routes.resume_match import router as resume_match_router
from routes.voice_chat import router as voice_chat_router
from routes.auth import router as auth_router
from routes.mock_interview import router as mock_interview_router
from routes.linkedin_optimizer import router as linkedin_router
from routes.github_optimizer import router as github_router
from routes.coding import router as coding_router
from routes.aptitude import router as aptitude_router
from routes.topics import router as topics_router
from routes.admin import router as admin_router

app = FastAPI()

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(hello_router)
app.include_router(roadmap_router)
app.include_router(resume_match_router)
app.include_router(voice_chat_router)
app.include_router(auth_router)
app.include_router(mock_interview_router)
app.include_router(linkedin_router)
app.include_router(github_router)
app.include_router(coding_router)
app.include_router(aptitude_router)
app.include_router(topics_router)
app.include_router(admin_router)
@app.get("/")
def home():
    return {"message": "Backend Running"}

# @app.get("/hello")
# def hello():
#     return {"message": "Hello from FastAPI Backend"}