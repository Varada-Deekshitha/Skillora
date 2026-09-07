from fastapi import APIRouter, BackgroundTasks
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, EmailStr, validator
from services.email_service import send_email, send_email_async, welcome_email, login_email
from services.database import record_register, record_login, record_logout
import os, re, httpx, urllib.parse

router = APIRouter()

FRONTEND_URL         = os.getenv("FRONTEND_URL", "http://localhost:3000")
GOOGLE_CLIENT_ID     = os.getenv("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "")
GITHUB_CLIENT_ID     = os.getenv("GITHUB_CLIENT_ID", "")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET", "")


class RegisterRequest(BaseModel):
    name:  str
    email: EmailStr

    @validator("email")
    def email_must_be_valid(cls, v):
        # Basic format check (Pydantic EmailStr already does this)
        pattern = r"^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
        if not re.match(pattern, v):
            raise ValueError("Invalid email format")
        return v


class LoginRequest(BaseModel):
    name:  str = ""
    email: EmailStr


# ── Register — send welcome email, return result synchronously ────────────────

@router.post("/auth/register")
def register(data: RegisterRequest):
    """
    Validate email + send welcome email via SMTP.
    Returns success/failure so frontend can show proper message.
    """
    # Record in DB
    record_register(data.email, data.name)

    ok = send_email(
        to=data.email,
        subject="🎉 Welcome to Skillora AI — You're in!",
        html_body=welcome_email(data.name, data.email),
    )
    if ok:
        return {"success": True, "message": f"Welcome email sent to {data.email}"}
    else:
        smtp_set = bool(os.getenv("SMTP_EMAIL", "").strip()) and \
                   os.getenv("SMTP_EMAIL") != "your_gmail@gmail.com"
        if not smtp_set:
            return {"success": True, "message": "Registered! (Configure SMTP_EMAIL in .env to send emails)", "email_sent": False}
        return {"success": False, "message": f"Could not deliver email to {data.email}. Please check the address.", "email_sent": False}


# ── Login — send login notification ──────────────────────────────────────────

@router.post("/auth/login")
def login_notify(data: LoginRequest):
    """Record login in DB and send login notification email asynchronously."""
    record_login(data.email, data.name)
    send_email_async(
        to=data.email,
        subject="🔐 New sign-in to your Skillora AI account",
        html_body=login_email(data.name, data.email),
    )
    return {"success": True, "message": "Login notification sent."}


class LogoutRequest(BaseModel):
    email: EmailStr


@router.post("/auth/logout")
def logout(data: LogoutRequest):
    """Record logout event in DB."""
    record_logout(data.email)
    return {"success": True}


# ── Email validation endpoint ──────────────────────────────────────────────────

@router.post("/auth/validate-email")
def validate_email_endpoint(data: RegisterRequest):
    """
    Check if email format is valid.
    Returns 200 if valid, 422 if invalid (Pydantic handles that automatically).
    """
    return {"valid": True, "email": data.email}


# ── Google OAuth ───────────────────────────────────────────────────────────────

@router.get("/auth/google")
def google_login():
    if not GOOGLE_CLIENT_ID:
        return {"error": "GOOGLE_CLIENT_ID not set in .env"}
    params = urllib.parse.urlencode({
        "client_id":     GOOGLE_CLIENT_ID,
        "redirect_uri":  f"{FRONTEND_URL}/api/auth/google/callback",
        "response_type": "code",
        "scope":         "openid email profile",
        "access_type":   "offline",
        "prompt":        "select_account",
    })
    return RedirectResponse(f"https://accounts.google.com/o/oauth2/v2/auth?{params}")


@router.get("/auth/google/callback")
async def google_callback(code: str, background_tasks: BackgroundTasks):
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        return RedirectResponse(f"{FRONTEND_URL}/login?error=google_not_configured")
    try:
        async with httpx.AsyncClient() as client:
            token_res = await client.post("https://oauth2.googleapis.com/token", data={
                "code": code, "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "redirect_uri": f"{FRONTEND_URL}/api/auth/google/callback",
                "grant_type": "authorization_code",
            })
            tokens = token_res.json()
            user_res = await client.get("https://www.googleapis.com/oauth2/v3/userinfo",
                headers={"Authorization": f"Bearer {tokens.get('access_token','')}"})
            user = user_res.json()
            name = user.get("name", ""); email = user.get("email", "")
        if email:
            background_tasks.add_task(send_email, to=email,
                subject="🎉 Welcome to Skillora AI — You're in!", html_body=welcome_email(name, email))
        params = urllib.parse.urlencode({"name": name, "email": email, "provider": "google"})
        return RedirectResponse(f"{FRONTEND_URL}/theme-select?{params}")
    except Exception as e:
        print(f"[GOOGLE OAuth] Error: {e}")
        return RedirectResponse(f"{FRONTEND_URL}/login?error=google_failed")


@router.get("/auth/github")
def github_login():
    if not GITHUB_CLIENT_ID:
        return {"error": "GITHUB_CLIENT_ID not set in .env"}
    params = urllib.parse.urlencode({
        "client_id": GITHUB_CLIENT_ID,
        "redirect_uri": f"{FRONTEND_URL}/api/auth/github/callback",
        "scope": "user:email",
    })
    return RedirectResponse(f"https://github.com/login/oauth/authorize?{params}")


@router.get("/auth/github/callback")
async def github_callback(code: str, background_tasks: BackgroundTasks):
    if not GITHUB_CLIENT_ID or not GITHUB_CLIENT_SECRET:
        return RedirectResponse(f"{FRONTEND_URL}/login?error=github_not_configured")
    try:
        async with httpx.AsyncClient() as client:
            token_res = await client.post("https://github.com/login/oauth/access_token",
                data={"client_id": GITHUB_CLIENT_ID, "client_secret": GITHUB_CLIENT_SECRET,
                      "code": code, "redirect_uri": f"{FRONTEND_URL}/api/auth/github/callback"},
                headers={"Accept": "application/json"})
            tokens = token_res.json()
            access_token = tokens.get("access_token", "")
            user_res = await client.get("https://api.github.com/user",
                headers={"Authorization": f"Bearer {access_token}", "Accept": "application/json"})
            user = user_res.json()
            name = user.get("name") or user.get("login", "")
            email = user.get("email") or ""
            if not email:
                emails_res = await client.get("https://api.github.com/user/emails",
                    headers={"Authorization": f"Bearer {access_token}", "Accept": "application/json"})
                emails = emails_res.json()
                primary = next((e for e in emails if e.get("primary")), None)
                email = primary["email"] if primary else ""
        if email:
            background_tasks.add_task(send_email, to=email,
                subject="🎉 Welcome to Skillora AI — You're in!", html_body=welcome_email(name, email))
        params = urllib.parse.urlencode({"name": name, "email": email, "provider": "github"})
        return RedirectResponse(f"{FRONTEND_URL}/theme-select?{params}")
    except Exception as e:
        print(f"[GITHUB OAuth] Error: {e}")
        return RedirectResponse(f"{FRONTEND_URL}/login?error=github_failed")
