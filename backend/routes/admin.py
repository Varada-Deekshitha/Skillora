"""
Admin-only API routes.
Only skillora215@gmail.com can access these endpoints.
"""

from fastapi import APIRouter, Header, HTTPException
from services.database import get_all_users, get_sessions, get_stats

router = APIRouter()

ADMIN_EMAIL = "skillora215@gmail.com"


def require_admin(x_admin_email: str = Header(default="")):
    if x_admin_email.strip().lower() != ADMIN_EMAIL:
        raise HTTPException(status_code=403, detail="Access denied. Admins only.")


@router.get("/admin/stats")
def admin_stats(x_admin_email: str = Header(default="")):
    require_admin(x_admin_email)
    return get_stats()


@router.get("/admin/users")
def admin_users(x_admin_email: str = Header(default="")):
    require_admin(x_admin_email)
    return get_all_users()


@router.get("/admin/sessions")
def admin_sessions(x_admin_email: str = Header(default=""), limit: int = 200):
    require_admin(x_admin_email)
    return get_sessions(limit)
