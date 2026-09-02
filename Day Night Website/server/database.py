"""
database.py - SQLAlchemy database setup for the Day Night Dashboard.

Configures SQLite database connection, session factory, and declarative base.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLite database file stored alongside the server code
SQLALCHEMY_DATABASE_URL = "sqlite:///./daynight.db"

# Create the SQLAlchemy engine
# connect_args={"check_same_thread": False} is required for SQLite
# to allow multiple threads to access the database (FastAPI uses threads)
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
)

# SessionLocal factory - each call creates a new database session
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
