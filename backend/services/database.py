"""
SQLite database service — tracks user registrations, logins, and logouts.
DB file: backend/skillora.db
"""

import sqlite3
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "skillora.db")


def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Create tables if they don't exist."""
    with get_conn() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                email       TEXT    NOT NULL UNIQUE,
                name        TEXT    NOT NULL DEFAULT '',
                created_at  TEXT    NOT NULL,
                login_count INTEGER NOT NULL DEFAULT 0,
                last_login  TEXT,
                last_logout TEXT
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS sessions (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                email      TEXT NOT NULL,
                event      TEXT NOT NULL,   -- 'login' | 'logout' | 'register'
                timestamp  TEXT NOT NULL
            )
        """)
        conn.commit()


def record_register(email: str, name: str):
    now = datetime.utcnow().isoformat()
    with get_conn() as conn:
        # Insert or ignore if user already exists
        conn.execute("""
            INSERT INTO users (email, name, created_at, login_count, last_login)
            VALUES (?, ?, ?, 1, ?)
            ON CONFLICT(email) DO UPDATE SET
                name       = excluded.name,
                login_count = login_count + 1,
                last_login  = excluded.last_login
        """, (email, name, now, now))
        conn.execute(
            "INSERT INTO sessions (email, event, timestamp) VALUES (?, 'register', ?)",
            (email, now)
        )
        conn.commit()


def record_login(email: str, name: str):
    now = datetime.utcnow().isoformat()
    with get_conn() as conn:
        conn.execute("""
            INSERT INTO users (email, name, created_at, login_count, last_login)
            VALUES (?, ?, ?, 1, ?)
            ON CONFLICT(email) DO UPDATE SET
                name        = CASE WHEN excluded.name != '' THEN excluded.name ELSE name END,
                login_count = login_count + 1,
                last_login  = excluded.last_login
        """, (email, name, now, now))
        conn.execute(
            "INSERT INTO sessions (email, event, timestamp) VALUES (?, 'login', ?)",
            (email, now)
        )
        conn.commit()


def record_logout(email: str):
    now = datetime.utcnow().isoformat()
    with get_conn() as conn:
        conn.execute(
            "UPDATE users SET last_logout = ? WHERE email = ?",
            (now, email)
        )
        conn.execute(
            "INSERT INTO sessions (email, event, timestamp) VALUES (?, 'logout', ?)",
            (email, now)
        )
        conn.commit()


def get_all_users():
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT * FROM users ORDER BY last_login DESC NULLS LAST"
        ).fetchall()
        return [dict(r) for r in rows]


def get_sessions(limit: int = 100):
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT * FROM sessions ORDER BY timestamp DESC LIMIT ?",
            (limit,)
        ).fetchall()
        return [dict(r) for r in rows]


def get_stats():
    with get_conn() as conn:
        total_users   = conn.execute("SELECT COUNT(*) FROM users").fetchone()[0]
        total_logins  = conn.execute("SELECT COUNT(*) FROM sessions WHERE event='login'").fetchone()[0]
        total_logouts = conn.execute("SELECT COUNT(*) FROM sessions WHERE event='logout'").fetchone()[0]
        today = datetime.utcnow().date().isoformat()
        today_logins  = conn.execute(
            "SELECT COUNT(*) FROM sessions WHERE event='login' AND timestamp LIKE ?",
            (f"{today}%",)
        ).fetchone()[0]
        return {
            "total_users":   total_users,
            "total_logins":  total_logins,
            "total_logouts": total_logouts,
            "today_logins":  today_logins,
        }


# Auto-init on import
init_db()
