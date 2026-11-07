"""
models.py - SQLAlchemy ORM models for Happy Birthday Website.

Defines schemas for:
1. BirthdayCard: Personalized shared birthday greetings
2. GuestbookWish: Online guestbook (Wishes Wall) entries
3. BirthdayAuditLog: Security audit log (OWASP / SKILL_CUSTOM_1305 §7.2)
"""

from datetime import datetime, timezone
from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text
from database import Base


class BirthdayCard(Base):
    """
    Stores personalized birthday greeting cards created by users to share with friends.
    """
    __tablename__ = "birthday_cards"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    card_id = Column(String(64), unique=True, nullable=False, index=True)
    recipient_name = Column(String(100), nullable=False)
    sender_name = Column(String(100), nullable=False)
    age = Column(Integer, nullable=True)
    wish_message = Column(Text, nullable=False)
    theme_color = Column(String(32), default="rose")
    candle_count = Column(Integer, default=5)
    is_public = Column(Boolean, default=True)
    view_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    expires_at = Column(DateTime, nullable=True)


class GuestbookWish(Base):
    """
    Stores messages pinned to the Birthday Wishes Wall (Guestbook).
    ClientIpHash is a SHA-256 hash to allow rate limiting without storing raw PII.
    """
    __tablename__ = "guestbook_wishes"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    card_id = Column(String(64), nullable=True, index=True)
    author_name = Column(String(100), nullable=False)
    author_emoji = Column(String(16), default="🎂")
    message_text = Column(String(1000), nullable=False)
    theme_color = Column(String(32), default="rose")
    like_count = Column(Integer, default=0)
    is_approved = Column(Boolean, default=True)
    client_ip_hash = Column(String(64), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class BirthdayAuditLog(Base):
    """
    Audit log for tracking operations, card creations, and wish postings.
    Conforms to SKILL_CUSTOM_1305 §7.2.
    """
    __tablename__ = "birthday_audit_logs"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    action = Column(String(64), nullable=False)
    target_entity = Column(String(64), nullable=False)
    entity_id = Column(String(64), nullable=True)
    status_code = Column(Integer, nullable=False)
    details = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
