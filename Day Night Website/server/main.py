"""
main.py - FastAPI application for the Day Night Dashboard backend.

Provides REST API endpoints for user preferences and to-do items,
serves the static frontend files, and initializes the database on startup.
"""

from contextlib import asynccontextmanager
from pathlib import Path
from typing import Optional

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from models import Preference, Todo


# ---------------------------------------------------------------------------
# Pydantic schemas for request / response validation
# ---------------------------------------------------------------------------

class PreferenceOut(BaseModel):
    """Schema returned when reading preferences."""
    id: int
    user_id: str
    timezone: Optional[str] = None
    is12h: bool = False
    show_fireflies: bool = True
    temp_unit: str = "C"
    focus_mode: bool = False

    model_config = {"from_attributes": True}


class PreferenceUpdate(BaseModel):
    """Schema for updating preferences (all fields optional)."""
    timezone: Optional[str] = None
    is12h: Optional[bool] = None
    show_fireflies: Optional[bool] = None
    temp_unit: Optional[str] = None
    focus_mode: Optional[bool] = None


class TodoOut(BaseModel):
    """Schema returned when reading a to-do item."""
    id: int
    user_id: str
    text: str
    done: bool = False
    created_at: Optional[str] = None

    model_config = {"from_attributes": True}


class TodoCreate(BaseModel):
    """Schema for creating a new to-do item."""
    text: str


class TodoUpdate(BaseModel):
    """Schema for updating an existing to-do item (all fields optional)."""
    text: Optional[str] = None
    done: Optional[bool] = None


# ---------------------------------------------------------------------------
# Application lifecycle (create tables on startup)
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create all database tables when the application starts."""
    Base.metadata.create_all(bind=engine)
    yield


# ---------------------------------------------------------------------------
# FastAPI app instance
# ---------------------------------------------------------------------------

app = FastAPI(
    title="Day Night Dashboard API",
    description="Backend API for the Day Night Dashboard app.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware - allow all origins so the frontend works from
# file:// URLs, localhost, and any other origin during development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Root redirect
# ---------------------------------------------------------------------------

@app.get("/", include_in_schema=False)
async def root():
    """Redirect the root URL to the static index.html."""
    return RedirectResponse(url="/index.html")


# ---------------------------------------------------------------------------
# Preferences endpoints
# ---------------------------------------------------------------------------

@app.get("/api/preferences", response_model=PreferenceOut)
def get_preferences(db: Session = Depends(get_db)):
    """
    Retrieve the default user's preferences.
    If no preferences exist yet, create and return the defaults.
    """
    pref = db.query(Preference).filter(Preference.user_id == "default").first()
    if not pref:
        pref = Preference(user_id="default")
        db.add(pref)
        db.commit()
        db.refresh(pref)
    return pref


@app.post("/api/preferences", response_model=PreferenceOut)
def update_preferences(
    data: PreferenceUpdate,
    db: Session = Depends(get_db),
):
    """
    Update the default user's preferences.
    Only provided (non-None) fields are updated; others are left unchanged.
    """
    pref = db.query(Preference).filter(Preference.user_id == "default").first()
    if not pref:
        pref = Preference(user_id="default")
        db.add(pref)
        db.commit()
        db.refresh(pref)

    # Apply only the fields that were explicitly sent in the request
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(pref, field, value)

    db.commit()
    db.refresh(pref)
    return pref


# ---------------------------------------------------------------------------
# To-do endpoints
# ---------------------------------------------------------------------------

@app.get("/api/todos", response_model=list[TodoOut])
def list_todos(db: Session = Depends(get_db)):
    """Return all to-do items, newest first."""
    todos = (
        db.query(Todo)
        .filter(Todo.user_id == "default")
        .order_by(Todo.created_at.desc())
        .all()
    )
    return todos


@app.post("/api/todos", response_model=TodoOut, status_code=201)
def create_todo(data: TodoCreate, db: Session = Depends(get_db)):
    """Create a new to-do item with the given text."""
    todo = Todo(text=data.text, user_id="default")
    db.add(todo)
    db.commit()
    db.refresh(todo)
    return todo


@app.put("/api/todos/{todo_id}", response_model=TodoOut)
def update_todo(
    todo_id: int,
    data: TodoUpdate,
    db: Session = Depends(get_db),
):
    """
    Update an existing to-do item by ID.
    Accepts optional text and/or done fields.
    """
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(todo, field, value)

    db.commit()
    db.refresh(todo)
    return todo


@app.delete("/api/todos/{todo_id}", status_code=204)
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    """Delete a to-do item by ID."""
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    db.delete(todo)
    db.commit()
    return None


# ---------------------------------------------------------------------------
# Static file serving (must be mounted LAST so API routes take priority)
# ---------------------------------------------------------------------------

# Serve the frontend files from the parent directory (Day Night Website/)
_frontend_dir = Path(__file__).resolve().parent.parent
app.mount("/", StaticFiles(directory=str(_frontend_dir), html=True), name="static")
