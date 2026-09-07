"""
Email service — uses Gmail SMTP (works for ANY email address worldwide).
No domain verification needed. Just Gmail + App Password.
"""

import os, smtplib, threading
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv(override=True)

SMTP_EMAIL    = os.getenv("SMTP_EMAIL", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SMTP_HOST     = "smtp.gmail.com"
SMTP_PORT     = 587


# ── Core send function ─────────────────────────────────────────────────────────

def send_email(to: str, subject: str, html_body: str) -> bool:
    """
    Send HTML email via Gmail SMTP.
    Works for ANY recipient email — gmail, yahoo, outlook, company mails, etc.
    Returns True on success, False on failure.
    """
    # Re-read from env each call so .env changes are picked up without restart
    smtp_email    = os.getenv("SMTP_EMAIL", "")
    smtp_password = os.getenv("SMTP_PASSWORD", "")

    if not smtp_email or not smtp_password or smtp_email == "your_gmail@gmail.com":
        print("[SMTP] SMTP_EMAIL / SMTP_PASSWORD not set in .env — skipping.")
        return False

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"]    = f"Skillora AI <{smtp_email}>"
        msg["To"]      = to

        msg.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.ehlo()
            server.starttls()
            server.login(smtp_email, smtp_password)
            server.sendmail(smtp_email, [to], msg.as_string())

        print(f"[SMTP] ✓ Email sent to {to} | subject: {subject}")
        return True

    except smtplib.SMTPAuthenticationError:
        print("[SMTP] ✗ Authentication failed. Check SMTP_EMAIL and SMTP_PASSWORD in .env")
        print("[SMTP]   Make sure you're using an App Password, not your real Gmail password.")
        return False
    except smtplib.SMTPRecipientsRefused:
        print(f"[SMTP] ✗ Recipient refused — {to} may not exist.")
        return False
    except Exception as e:
        print(f"[SMTP] ✗ Failed to send to {to}: {e}")
        return False


def send_email_async(to: str, subject: str, html_body: str):
    """Send email in a background thread — non-blocking."""
    t = threading.Thread(target=send_email, args=(to, subject, html_body), daemon=True)
    t.start()


# ── HTML Templates ─────────────────────────────────────────────────────────────

def _base(content: str) -> str:
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Skillora AI</title>
<style>
  *{{margin:0;padding:0;box-sizing:border-box}}
  body{{background:#0d0d0d;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#f0f0f0;-webkit-font-smoothing:antialiased}}
  .shell{{max-width:580px;margin:32px auto;border-radius:20px;overflow:hidden;border:1px solid #1e1e1e;box-shadow:0 24px 80px rgba(0,0,0,0.6)}}
  .hdr{{background:linear-gradient(135deg,#6b0000 0%,#b91c1c 50%,#dc2626 100%);padding:36px 44px;text-align:center;position:relative;overflow:hidden}}
  .hdr::before{{content:'';position:absolute;inset:0;background-image:radial-gradient(circle at 1px 1px,rgba(255,255,255,0.05) 1px,transparent 0);background-size:20px 20px}}
  .logo{{font-size:28px;font-weight:900;color:#fff;letter-spacing:-0.5px;position:relative;display:flex;align-items:center;justify-content:center;gap:10px}}
  .logo-icon{{font-size:36px}}
  .logo sub{{color:rgba(255,255,255,0.55);font-weight:400;font-size:11px;display:block;margin-top:3px;letter-spacing:3px;text-transform:uppercase}}
  .bdy{{background:#111;padding:40px 44px}}
  .bdy p{{font-size:15px;line-height:1.75;color:#bbb;margin-bottom:16px}}
  .bdy strong{{color:#fff}}
  .badge{{display:inline-flex;align-items:center;gap:6px;background:rgba(220,38,38,0.12);border:1px solid rgba(220,38,38,0.25);color:#f87171;font-size:11px;font-weight:700;padding:5px 14px;border-radius:100px;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:24px}}
  .cta{{display:inline-block;background:linear-gradient(135deg,#b91c1c,#dc2626);color:#fff !important;font-weight:700;font-size:15px;padding:15px 36px;border-radius:14px;text-decoration:none;margin:24px 0;box-shadow:0 6px 24px rgba(220,38,38,0.4);letter-spacing:0.3px}}
  .divider{{border:none;border-top:1px solid #222;margin:28px 0}}
  .features{{display:flex;flex-direction:column;gap:12px;margin:20px 0}}
  .feat{{background:#181818;border:1px solid #242424;border-radius:12px;padding:16px 18px;display:flex;align-items:flex-start;gap:14px}}
  .feat-icon{{font-size:22px;line-height:1;margin-top:1px;flex-shrink:0}}
  .feat-body strong{{font-size:14px;color:#eee;display:block;margin-bottom:3px}}
  .feat-body p{{font-size:13px;color:#666;margin:0}}
  .info-box{{background:#1a1a1a;border:1px solid #2a2a2a;border-radius:12px;padding:16px 18px;margin:20px 0}}
  .info-row{{display:flex;align-items:center;gap:10px;margin-bottom:8px}}
  .info-row:last-child{{margin-bottom:0}}
  .info-label{{font-size:12px;color:#555;min-width:100px}}
  .info-val{{font-size:13px;color:#ddd;font-weight:500}}
  .ftr{{background:#0a0a0a;padding:24px 44px;text-align:center;border-top:1px solid #1a1a1a}}
  .ftr p{{font-size:12px;color:#3d3d3d;line-height:1.8}}
  .ftr a{{color:#dc2626;text-decoration:none}}
</style>
</head>
<body>
<div class="shell">
  <div class="hdr">
    <div class="logo">
      <span class="logo-icon">⚡</span>
      <div><span>Skillora AI</span><sub>AI-Powered Career Copilot</sub></div>
    </div>
  </div>
  <div class="bdy">{content}</div>
  <div class="ftr">
    <p>© 2026 Skillora AI · Built to get you placed<br/>
    <a href="#">Unsubscribe</a> &nbsp;·&nbsp; <a href="#">Privacy Policy</a></p>
  </div>
</div>
</body>
</html>"""


def welcome_email(name: str, email: str) -> str:
    first = name.split()[0] if name else "there"
    content = f"""
    <div class="badge">🎉 Welcome to Skillora AI</div>
    <p>Hi <strong>{first}</strong>,</p>
    <p>Congratulations! 🎊 You've successfully joined <strong>Skillora AI</strong> — your personal AI-powered placement prep copilot.</p>
    <p>You now have access to <strong>10+ AI tools</strong> to prepare for your dream job:</p>
    <div class="features">
      <div class="feat">
        <span class="feat-icon">🗺️</span>
        <div class="feat-body"><strong>AI Roadmap Generator</strong><p>Get a custom step-by-step prep plan for any company and role.</p></div>
      </div>
      <div class="feat">
        <span class="feat-icon">🎤</span>
        <div class="feat-body"><strong>AI Mock Interviews</strong><p>Practice HR &amp; Technical rounds. Get scored on confidence, communication &amp; depth.</p></div>
      </div>
      <div class="feat">
        <span class="feat-icon">💻</span>
        <div class="feat-body"><strong>Coding Assessment</strong><p>500+ curated problems — LeetCode-style with test cases &amp; instant feedback.</p></div>
      </div>
      <div class="feat">
        <span class="feat-icon">📄</span>
        <div class="feat-body"><strong>ATS Resume Analyzer</strong><p>Match your resume to any job description. Get score + missing keywords.</p></div>
      </div>
      <div class="feat">
        <span class="feat-icon">🎯</span>
        <div class="feat-body"><strong>Aptitude &amp; Reasoning</strong><p>Timed mock tests + topic-wise practice with explanations.</p></div>
      </div>
    </div>
    <hr class="divider"/>
    <p style="text-align:center;margin-bottom:8px">Ready to start your placement prep?</p>
    <p style="text-align:center">
      <a href="https://placement-preparation-v6do.onrender.com" class="cta">🚀 Open Your Dashboard</a>
    </p>
    <p style="font-size:12px;color:#444;text-align:center;margin-top:16px">Registered with: {email}</p>
    """
    return _base(content)


def login_email(name: str, email: str) -> str:
    from datetime import datetime, timezone
    now = datetime.now(timezone.utc).strftime("%d %b %Y at %I:%M %p UTC")
    first = name.split()[0] if name else "there"
    content = f"""
    <div class="badge">🔐 New Sign-In Detected</div>
    <p>Hi <strong>{first}</strong>,</p>
    <p>A successful sign-in was just detected on your <strong>Skillora AI</strong> account.</p>
    <div class="info-box">
      <div class="info-row">
        <span class="info-label">📧 Account</span>
        <span class="info-val">{email}</span>
      </div>
      <div class="info-row">
        <span class="info-label">🕐 Time</span>
        <span class="info-val">{now}</span>
      </div>
      <div class="info-row">
        <span class="info-label">📍 Platform</span>
        <span class="info-val">Skillora AI Web App</span>
      </div>
    </div>
    <p>✅ If this was you — you&apos;re all set! Continue your prep journey.</p>
    <p style="color:#888">⚠️ If you did <strong style="color:#f87171">not</strong> sign in, please change your password immediately.</p>
    <hr class="divider"/>
    <p style="text-align:center">
      <a href="https://placement-preparation-v6do.onrender.com" class="cta">Go to Dashboard →</a>
    </p>
    """
    return _base(content)
