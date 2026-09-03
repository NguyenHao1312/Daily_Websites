"""
models.py - SQLAlchemy ORM models for the Day Night Dashboard.

Defines the `preferences` and `todos` tables.
"""

from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, Integer, String  # pyright: ignore[reportMissingImports]

from database import Base


class Preference(Base):
    """
    Stores per-user dashboard preferences (theme, units, display options).
    Uses a unique user_id with a default of "default" for single-user setups.
    """

    __tablename__ = "preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=True, default="default", index=True)
    timezone = Column(String, nullable=True)
    is12h = Column(Boolean, default=False)
    show_fireflies = Column(Boolean, default=True)
    temp_unit = Column(String, default="C")
    focus_mode = Column(Boolean, default=False)


class Todo(Base):
    """
    Stores individual to-do items for the dashboard's task list.
    Each item has text, a done flag, and a creation timestamp.
    """

    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    user_id = Column(String, default="default", index=True)
    text = Column(String, nullable=False)
    done = Column(Boolean, default=False)
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )
