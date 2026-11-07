"""
main.py - FastAPI application for the Happy Birthday Website backend.

Provides REST API endpoints for:
- Guestbook Wishes Wall (List, Create, Like)
- Personalized Birthday Cards (Create, Retrieve, Increment views)
- Security Audit Logging (SKILL_CUSTOM_1305 §7.2)
- Health check and security headers
"""

from contextlib import asynccontextmanager
from datetime import datetime, timezone
import hashlib
import html
import os
from pathlib import Path
from typing import List, Optional
import uuid

from fastapi import Depends, FastAPI, HTTPException, Request, Response, Query
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from database import auto_migrate, get_db
from models import BirthdayCard, GuestbookWish, BirthdayAuditLog


# ---------------------------------------------------------------------------
# Pydantic schemas for request / response validation
# ---------------------------------------------------------------------------

class HealthOut(BaseModel):
    status: str
    app: str
    version: str


class WishOut(BaseModel):
    id: int
    card_id: Optional[str] = None
    author_name: str
    author_emoji: str
    message_text: str
    theme_color: str
    like_count: int
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class WishCreate(BaseModel):
    card_id: Optional[str] = Field(None, max_length=64)
    author_name: str = Field(..., min_length=1, max_length=50)
    author_emoji: str = Field("🎂", max_length=16)
    message_text: str = Field(..., min_length=1, max_length=500)
    theme_color: str = Field("rose", max_length=32)


class CardOut(BaseModel):
    card_id: str
    recipient_name: str
    sender_name: str
    age: Optional[int] = None
    wish_message: str
    theme_color: str
    candle_count: int
    view_count: int
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class CardCreate(BaseModel):
    recipient_name: str = Field(..., min_length=1, max_length=50)
    sender_name: str = Field(..., min_length=1, max_length=50)
    age: Optional[int] = Field(None, ge=1, le=120)
    wish_message: str = Field(..., min_length=1, max_length=600)
    theme_color: str = Field("rose", max_length=32)
    candle_count: Optional[int] = Field(5, ge=1, le=20)


class LikeOut(BaseModel):
    id: int
    like_count: int


# ---------------------------------------------------------------------------
# Security Helpers & Middleware
# ---------------------------------------------------------------------------

def hash_client_ip(ip: str) -> str:
    """
    Hashes the client IP with SHA-256 to prevent storing raw PII
    while still enabling rate limiting and anomaly detection.
    Adheres to SKILL_CUSTOM_1305 §7.2.
    """
    if not ip:
        return "unknown"
    return hashlib.sha256(ip.encode("utf-8")).hexdigest()[:32]


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "SAMEORIGIN"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        return response


# ---------------------------------------------------------------------------
# Application Lifecycle & App Instance
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Run SQLite auto-migration on server startup."""
    auto_migrate()
    yield


app = FastAPI(
    title="Happy Birthday Magic API",
    description="Backend API for Birthday Wishes Wall, Personalized Cards, and Security Audit Logs.",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(SecurityHeadersMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# API Endpoints
# ---------------------------------------------------------------------------

@app.get("/api/health", response_model=HealthOut)
def health_check():
    """Health status endpoint."""
    return HealthOut(
        status="ok",
        app="Happy Birthday Magic API",
        version="2.0.0"
    )


@app.get("/api/wishes", response_model=List[WishOut])
def get_wishes(
    card_id: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """
    Retrieves approved birthday wishes for the Wishes Wall.
    Seeds default wishes if table is empty.
    """
    query = db.query(GuestbookWish).filter(GuestbookWish.is_approved == True)
    if card_id:
        query = query.filter(GuestbookWish.card_id == card_id)

    results = query.order_by(GuestbookWish.created_at.desc()).offset(offset).limit(limit).all()

    # Seed defaults if completely empty
    if not results and offset == 0 and not card_id:
        defaults = [
            GuestbookWish(
                author_name="Bảo Trâm",
                author_emoji="🎂",
                message_text="Chúc mừng sinh nhật bạn hiền! Tuổi mới luôn rạng ngời, may mắn ngập tràn và thành công rực rỡ nha!",
                theme_color="rose",
                like_count=12
            ),
            GuestbookWish(
                author_name="Emma Watson",
                author_emoji="🌟",
                message_text="Happiest birthday to one of the most wonderful souls! May your year ahead be pure magic!",
                theme_color="violet",
                like_count=14
            ),
            GuestbookWish(
                author_name="Tuấn Anh",
                author_emoji="🚀",
                message_text="Chúc bạn tuổi mới bứt phá mọi mục tiêu, tiền tài danh vọng đều thăng hoa rực rỡ!",
                theme_color="sunset",
                like_count=15
            )
        ]
        for d in defaults:
            db.add(d)
        db.commit()
        for d in defaults:
            db.refresh(d)
        results = defaults

    return results


@app.post("/api/wishes", response_model=WishOut, status_code=201)
def create_wish(
    wish_in: WishCreate,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Creates a new wish on the Wishes Wall with OWASP XSS sanitization,
    SHA-256 IP hashing, and audit log generation.
    """
    client_ip = request.client.host if request.client else "unknown"
    ip_hash = hash_client_ip(client_ip)

    # Sanitize inputs (OWASP CWE-79)
    safe_author = html.escape(wish_in.author_name.strip())
    safe_msg = html.escape(wish_in.message_text.strip())

    new_wish = GuestbookWish(
        card_id=wish_in.card_id,
        author_name=safe_author,
        author_emoji=wish_in.author_emoji,
        message_text=safe_msg,
        theme_color=wish_in.theme_color,
        like_count=1,
        is_approved=True,
        client_ip_hash=ip_hash,
    )
    db.add(new_wish)
    db.commit()
    db.refresh(new_wish)

    # Record Audit Log
    audit = BirthdayAuditLog(
        action="CREATE_WISH",
        target_entity="GuestbookWish",
        entity_id=str(new_wish.id),
        status_code=201,
        details=f"Author: {safe_author[:20]}, IP Hash: {ip_hash[:8]}"
    )
    db.add(audit)
    db.commit()

    return new_wish


@app.post("/api/wishes/{wish_id}/like", response_model=LikeOut)
def like_wish(
    wish_id: int,
    db: Session = Depends(get_db)
):
    """Increments the like counter for a specific wish."""
    wish = db.query(GuestbookWish).filter(GuestbookWish.id == wish_id).first()
    if not wish:
        raise HTTPException(status_code=404, detail="Wish not found")

    wish.like_count += 1
    db.commit()
    db.refresh(wish)

    # Record Audit Log
    audit = BirthdayAuditLog(
        action="LIKE_WISH",
        target_entity="GuestbookWish",
        entity_id=str(wish_id),
        status_code=200,
        details=f"New like count: {wish.like_count}"
    )
    db.add(audit)
    db.commit()

    return LikeOut(id=wish.id, like_count=wish.like_count)


@app.post("/api/cards", response_model=CardOut, status_code=201)
def create_card(
    card_in: CardCreate,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Generates a shareable personalized birthday greeting card.
    """
    card_id = str(uuid.uuid4())[:8]

    # Sanitize inputs
    safe_recipient = html.escape(card_in.recipient_name.strip())
    safe_sender = html.escape(card_in.sender_name.strip())
    safe_msg = html.escape(card_in.wish_message.strip())

    new_card = BirthdayCard(
        card_id=card_id,
        recipient_name=safe_recipient,
        sender_name=safe_sender,
        age=card_in.age,
        wish_message=safe_msg,
        theme_color=card_in.theme_color,
        candle_count=card_in.candle_count or 5,
        is_public=True,
        view_count=0
    )
    db.add(new_card)
    db.commit()
    db.refresh(new_card)

    # Record Audit Log
    audit = BirthdayAuditLog(
        action="CREATE_CARD",
        target_entity="BirthdayCard",
        entity_id=card_id,
        status_code=201,
        details=f"Recipient: {safe_recipient[:20]}, Sender: {safe_sender[:20]}"
    )
    db.add(audit)
    db.commit()

    return new_card


@app.get("/api/cards/{card_id}", response_model=CardOut)
def get_card(
    card_id: str,
    db: Session = Depends(get_db)
):
    """Retrieves a personalized card by its unique identifier and increments its view count."""
    card = db.query(BirthdayCard).filter(BirthdayCard.card_id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Birthday card not found")

    card.view_count += 1
    db.commit()
    db.refresh(card)

    return card


# Mount static files to serve the frontend when running fullstack via Uvicorn
STATIC_DIR = Path(__file__).resolve().parent.parent
if STATIC_DIR.exists():
    app.mount("/", StaticFiles(directory=str(STATIC_DIR), html=True), name="static")
