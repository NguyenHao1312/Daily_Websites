"""
database.py - SQLAlchemy database setup for the Happy Birthday Website.

Configures SQLite database connection, session factory, declarative base,
and safe auto-migration for birthday cards, guestbook wishes, and audit logs.
Adheres to SKILL_CUSTOM_1305 §7.2 (Data Protection, Audit Trail, Least Privilege).
"""

from sqlalchemy import create_engine, inspect, text
import os
from pathlib import Path
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLite database file stored alongside the server code for dev & automated testing
DB_PATH = Path(__file__).resolve().parent / "birthday.db"
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """
    FastAPI dependency that provides a database session.
    Yields a session and ensures it is closed after request completes.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def auto_migrate():
    """
    Safely creates tables and adds any missing columns to existing SQLite tables
    without dropping data.
    """
    Base.metadata.create_all(bind=engine)

    with engine.connect() as conn:
        inspector = inspect(engine)
        existing_tables = inspector.get_table_names()

        # Check birthday_cards table columns
        if "birthday_cards" in existing_tables:
            existing_cols = {col["name"] for col in inspector.get_columns("birthday_cards")}
            expected_cols = {
                "theme_color": "TEXT DEFAULT 'rose'",
                "candle_count": "INTEGER DEFAULT 5",
                "is_public": "BOOLEAN DEFAULT 1",
                "view_count": "INTEGER DEFAULT 0",
                "expires_at": "DATETIME",
            }
            for col_name, col_type in expected_cols.items():
                if col_name not in existing_cols:
                    try:
                        conn.execute(text(f"ALTER TABLE birthday_cards ADD COLUMN {col_name} {col_type}"))
                        conn.commit()
                    except Exception as e:
                        print(f"[Migration Warning] Could not add column {col_name} to birthday_cards: {e}")

        # Check guestbook_wishes table columns
        if "guestbook_wishes" in existing_tables:
            existing_cols = {col["name"] for col in inspector.get_columns("guestbook_wishes")}
            expected_cols = {
                "card_id": "TEXT",
                "author_emoji": "TEXT DEFAULT '🎂'",
                "theme_color": "TEXT DEFAULT 'rose'",
                "like_count": "INTEGER DEFAULT 0",
                "is_approved": "BOOLEAN DEFAULT 1",
                "client_ip_hash": "TEXT",
            }
            for col_name, col_type in expected_cols.items():
                if col_name not in existing_cols:
                    try:
                        conn.execute(text(f"ALTER TABLE guestbook_wishes ADD COLUMN {col_name} {col_type}"))
                        conn.commit()
                    except Exception as e:
                        print(f"[Migration Warning] Could not add column {col_name} to guestbook_wishes: {e}")

        # Check birthday_audit_logs table columns
        if "birthday_audit_logs" in existing_tables:
            existing_cols = {col["name"] for col in inspector.get_columns("birthday_audit_logs")}
            expected_cols = {
                "entity_id": "TEXT",
                "details": "TEXT",
            }
            for col_name, col_type in expected_cols.items():
                if col_name not in existing_cols:
                    try:
                        conn.execute(text(f"ALTER TABLE birthday_audit_logs ADD COLUMN {col_name} {col_type}"))
                        conn.commit()
                    except Exception as e:
                        print(f"[Migration Warning] Could not add column {col_name} to birthday_audit_logs: {e}")
