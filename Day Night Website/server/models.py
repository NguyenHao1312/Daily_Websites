"""
models.py - SQLAlchemy ORM models for the Day Night Dashboard.

Defines the `preferences` and `todos` tables with extended fields
for themes, audio/timer settings, tags, and subtitles.
"""

from datetime import datetime, timezone
from sqlalchemy import Boolean, Column, DateTime, Integer, String
from database import Base


class Preference(Base):
    """
    Stores per-user dashboard preferences (theme, units, audio, Pomodoro, and display options).
    Uses a unique user_id with a default of "default" for single-user setups.
    """

    __tablename__ = "preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=True, default="default", index=True)
    timezone = Column(String, default="Asia/Ho_Chi_Minh", nullable=True)
    is12h = Column(Boolean, default=False)
    show_fireflies = Column(Boolean, default=True)
    temp_unit = Column(String, default="C")
    focus_mode = Column(Boolean, default=False)
    theme = Column(String, default="night")  # auto, night, dawn, day, noon, dusk
    language = Column(String, default="en")  # en, vi, th
    pomo_work_min = Column(Integer, default=25)
    pomo_break_min = Column(Integer, default=5)
    lofi_track = Column(String, default="assets/music/Window.mp3")
    lofi_volume = Column(Integer, default=65)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )


class Todo(Base):
    """
    Stores individual to-do items for the dashboard's task list.
    Each item supports text, category tag, subtitle/note, completion status,
    and timestamps.
    """

    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    user_id = Column(String, default="default", index=True)
    text = Column(String, nullable=False)
    tag = Column(String, nullable=True)         # e.g., "Design", "Personal", "Planning"
    subtitle = Column(String, nullable=True)    # e.g., "Your next focus", "A fresh start"
    category = Column(String, default="up_next") # "up_next" or "completed"
    done = Column(Boolean, default=False)
    order_index = Column(Integer, default=0)
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
