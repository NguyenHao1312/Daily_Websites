"""
main.py - FastAPI application for the Day Night Dashboard backend.

Provides REST API endpoints for user preferences, to-do items, quote of the day,
health check, security headers, and static file serving.
"""

from contextlib import asynccontextmanager
from datetime import datetime, timezone
import html
from pathlib import Path
from typing import List, Optional

from fastapi import Depends, FastAPI, HTTPException, Request, Response
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from database import auto_migrate, get_db
from models import Preference, Todo


# ---------------------------------------------------------------------------
# Pydantic schemas for request / response validation
# ---------------------------------------------------------------------------

class PreferenceOut(BaseModel):
    """Schema returned when reading preferences."""
    id: int
    user_id: str
    timezone: Optional[str] = "Asia/Ho_Chi_Minh"
    is12h: bool = False
    show_fireflies: bool = True
    temp_unit: str = "C"
    focus_mode: bool = False
    theme: str = "night"
    language: str = "en"
    pomo_work_min: int = 25
    pomo_break_min: int = 5
    lofi_track: str = "assets/music/Window.mp3"
    lofi_volume: int = 65

    model_config = {"from_attributes": True}


class PreferenceUpdate(BaseModel):
    """Schema for updating preferences (all fields optional)."""
    timezone: Optional[str] = None
    is12h: Optional[bool] = None
    show_fireflies: Optional[bool] = None
    temp_unit: Optional[str] = None
    focus_mode: Optional[bool] = None
    theme: Optional[str] = None
    language: Optional[str] = None
    pomo_work_min: Optional[int] = Field(None, ge=1, le=1440)
    pomo_break_min: Optional[int] = Field(None, ge=1, le=1440)
    lofi_track: Optional[str] = None
    lofi_volume: Optional[int] = Field(None, ge=0, le=100)


class TodoOut(BaseModel):
    """Schema returned when reading a to-do item."""
    id: int
    user_id: str
    text: str
    tag: Optional[str] = None
    subtitle: Optional[str] = None
    category: Optional[str] = "up_next"
    done: bool = False
    order_index: int = 0
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class TodoCreate(BaseModel):
    """Schema for creating a new to-do item."""
    text: str = Field(..., min_length=1, max_length=255)
    tag: Optional[str] = Field(None, max_length=50)
    subtitle: Optional[str] = Field(None, max_length=150)
    category: Optional[str] = Field("up_next", max_length=30)


class TodoUpdate(BaseModel):
    """Schema for updating an existing to-do item (all fields optional)."""
    text: Optional[str] = Field(None, min_length=1, max_length=255)
    tag: Optional[str] = Field(None, max_length=50)
    subtitle: Optional[str] = Field(None, max_length=150)
    category: Optional[str] = Field(None, max_length=30)
    done: Optional[bool] = None
    order_index: Optional[int] = None


class QuoteOut(BaseModel):
    """Schema for quote of the day."""
    text: str
    author: str


# ---------------------------------------------------------------------------
# Security Headers Middleware
# ---------------------------------------------------------------------------

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "SAMEORIGIN"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        return response


# ---------------------------------------------------------------------------
# Application lifecycle
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create all database tables and perform migration on startup."""
    auto_migrate()
    yield


# ---------------------------------------------------------------------------
# FastAPI app instance
# ---------------------------------------------------------------------------

app = FastAPI(
    title="Day Night Dashboard API",
    description="Backend API for Day Night Cycle with UI/UX upgrades and security features.",
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
# Healthcheck endpoint
# ---------------------------------------------------------------------------

@app.get("/api/health")
def healthcheck():
    """Returns the API health status and timestamp."""
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "service": "Day Night Dashboard API",
        "version": "2.0.0",
    }


# ---------------------------------------------------------------------------
# Preferences endpoints
# ---------------------------------------------------------------------------

@app.get("/api/preferences", response_model=PreferenceOut)
def get_preferences(db: Session = Depends(get_db)):
    """
    Retrieve the default user's preferences.
    If no preferences exist yet, create and return default values.
    """
    pref = db.query(Preference).filter(Preference.user_id == "default").first()
    if not pref:
        pref = Preference(
            user_id="default",
            timezone="Asia/Ho_Chi_Minh",
            is12h=False,
            show_fireflies=True,
            temp_unit="C",
            focus_mode=False,
            theme="night",
            language="en",
            pomo_work_min=25,
            pomo_break_min=5,
            lofi_track="assets/music/Window.mp3",
            lofi_volume=65,
        )
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
    Only provided fields are updated; others remain unchanged.
    """
    pref = db.query(Preference).filter(Preference.user_id == "default").first()
    if not pref:
        pref = Preference(user_id="default")
        db.add(pref)
        db.commit()
        db.refresh(pref)

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(pref, field, value)

    pref.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(pref)
    return pref


# ---------------------------------------------------------------------------
# To-do endpoints
# ---------------------------------------------------------------------------

@app.get("/api/todos", response_model=List[TodoOut])
def list_todos(db: Session = Depends(get_db)):
    """Return all to-do items, sorted by done status and order/creation time."""
    todos = (
        db.query(Todo)
        .filter(Todo.user_id == "default")
        .order_by(Todo.done.asc(), Todo.order_index.asc(), Todo.created_at.desc())
        .all()
    )
    return todos


@app.post("/api/todos", response_model=TodoOut, status_code=201)
def create_todo(data: TodoCreate, db: Session = Depends(get_db)):
    """Create a new to-do item with sanitized text and optional tag/subtitle."""
    safe_text = html.escape(data.text.strip())
    safe_tag = html.escape(data.tag.strip()) if data.tag else None
    safe_subtitle = html.escape(data.subtitle.strip()) if data.subtitle else None
    safe_category = html.escape(data.category.strip()) if data.category else "up_next"

    todo = Todo(
        text=safe_text,
        tag=safe_tag,
        subtitle=safe_subtitle,
        category=safe_category,
        user_id="default",
        done=False,
    )
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
    """Update an existing to-do item by ID."""
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if isinstance(value, str):
            value = html.escape(value.strip())
        setattr(todo, field, value)

    todo.updated_at = datetime.now(timezone.utc)
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


@app.post("/api/todos/seed-default", response_model=List[TodoOut])
def seed_default_todos(db: Session = Depends(get_db)):
    """
    Seed initial tasks matching the design mockup if no tasks exist.
    """
    count = db.query(Todo).filter(Todo.user_id == "default").count()
    if count == 0:
        sample_tasks = [
            Todo(
                user_id="default",
                text="Finish the landing page",
                tag="Design",
                subtitle="Your next focus",
                category="up_next",
                done=False,
                order_index=1,
            ),
            Todo(
                user_id="default",
                text="Read 10 pages",
                tag="Personal",
                subtitle="A little every day",
                category="up_next",
                done=False,
                order_index=2,
            ),
            Todo(
                user_id="default",
                text="Plan tomorrow's priorities",
                tag="Planning",
                subtitle="Before you log off",
                category="up_next",
                done=False,
                order_index=3,
            ),
            Todo(
                user_id="default",
                text="Take a mindful break",
                tag="Wellbeing",
                subtitle="Just 5 minutes",
                category="up_next",
                done=False,
                order_index=4,
            ),
            Todo(
                user_id="default",
                text="Clear the desk",
                tag="Environment",
                subtitle="A fresh start",
                category="completed",
                done=True,
                order_index=5,
            ),
        ]
        db.add_all(sample_tasks)
        db.commit()

    return (
        db.query(Todo)
        .filter(Todo.user_id == "default")
        .order_by(Todo.done.asc(), Todo.order_index.asc())
        .all()
    )


# ---------------------------------------------------------------------------
# Quote endpoint
# ---------------------------------------------------------------------------

@app.get("/api/quote", response_model=QuoteOut)
def get_quote():
    """Returns the daily calm quote with author."""
    return QuoteOut(
        text="The only way to do great work is to love what you do.",
        author="Steve Jobs",
    )


# ---------------------------------------------------------------------------
# Root redirect & Static files mounting
# ---------------------------------------------------------------------------

@app.get("/", include_in_schema=False)
async def root():
    """Redirect root path to index.html."""
    return RedirectResponse(url="/index.html")


_frontend_dir = Path(__file__).resolve().parent.parent
app.mount("/", StaticFiles(directory=str(_frontend_dir), html=True), name="static")
