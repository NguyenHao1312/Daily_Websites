"""
database.py - SQLAlchemy database setup for the Day Night Dashboard.

Configures SQLite database connection, session factory, declarative base,
and safe auto-migration for missing columns.
"""

from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLite database file stored alongside the server code
SQLALCHEMY_DATABASE_URL = "sqlite:///./daynight.db"

# Create the SQLAlchemy engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
)

# SessionLocal factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all ORM models
Base = declarative_base()


def get_db():
    """
    FastAPI dependency that provides a database session.
    Yields a session and ensures it is closed after the request completes.
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
        
        # Check preferences table columns
        if "preferences" in inspector.get_table_names():
            existing_cols = {col["name"] for col in inspector.get_columns("preferences")}
            expected_cols = {
                "theme": "TEXT DEFAULT 'night'",
                "language": "TEXT DEFAULT 'en'",
                "pomo_work_min": "INTEGER DEFAULT 25",
                "pomo_break_min": "INTEGER DEFAULT 5",
                "lofi_track": "TEXT DEFAULT 'assets/music/Window.mp3'",
                "lofi_volume": "INTEGER DEFAULT 65",
                "updated_at": "DATETIME",
            }
            for col_name, col_type in expected_cols.items():
                if col_name not in existing_cols:
                    try:
                        conn.execute(text(f"ALTER TABLE preferences ADD COLUMN {col_name} {col_type}"))
                        conn.commit()
                    except Exception as e:
                        print(f"[Migration Warning] Could not add column {col_name} to preferences: {e}")
                        
        # Check todos table columns
        if "todos" in inspector.get_table_names():
            existing_cols = {col["name"] for col in inspector.get_columns("todos")}
            expected_cols = {
                "tag": "TEXT",
                "subtitle": "TEXT",
                "category": "TEXT DEFAULT 'up_next'",
                "order_index": "INTEGER DEFAULT 0",
                "updated_at": "DATETIME",
            }
            for col_name, col_type in expected_cols.items():
                if col_name not in existing_cols:
                    try:
                        conn.execute(text(f"ALTER TABLE todos ADD COLUMN {col_name} {col_type}"))
                        conn.commit()
                    except Exception as e:
                        print(f"[Migration Warning] Could not add column {col_name} to todos: {e}")
