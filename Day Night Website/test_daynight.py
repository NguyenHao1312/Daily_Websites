"""
test_daynight.py - Comprehensive Verification & Test Suite
Project: Day Night Cycle UI/UX & Backend Upgrade
Department: Test and Quality (QA) — SKILL_CUSTOM_1305
"""

import html
import os
import re
import sys
from pathlib import Path

# Setup paths (supports running from inside Day Night Website or from project root)
CUR_DIR = Path(__file__).resolve().parent
if (CUR_DIR / "server").exists():
    BASE_DIR = CUR_DIR
else:
    BASE_DIR = CUR_DIR / "Day Night Website"

SERVER_DIR = BASE_DIR / "server"
HTML_PATH = BASE_DIR / "index.html"
CSS_PATH = BASE_DIR / "style.css"
WIDGETS_CSS_PATH = BASE_DIR / "css" / "widgets.css"
SCRIPT_PATH = BASE_DIR / "script.js"
DRAG_PATH = BASE_DIR / "js" / "draggable.js"

sys.path.insert(0, str(SERVER_DIR))

import database
import models
import main
from pydantic import ValidationError

passed_tests = []
failed_tests = []

def run_test(test_id, description, func):
    try:
        func()
        passed_tests.append((test_id, description))
        print(f"  [PASS] {test_id}: {description}")
    except AssertionError as ae:
        failed_tests.append((test_id, description, str(ae)))
        print(f"  [FAIL] {test_id}: {description} - Assertion: {ae}")
    except Exception as e:
        failed_tests.append((test_id, description, str(e)))
        print(f"  [ERROR] {test_id}: {description} - Exception: {e}")

print("======================================================================")
print("DAY NIGHT DASHBOARD — TEST AND QUALITY (QA) VERIFICATION SUITE")
print("======================================================================\n")

# --- Backend Tests ---
print("--- [QA-1 & QA-5] BACKEND & DATABASE TESTS ---")

def test_tc001_db_migration():
    database.auto_migrate()
    inspector = database.inspect(database.engine)
    tables = inspector.get_table_names()
    assert "preferences" in tables, "Table 'preferences' missing"
    assert "todos" in tables, "Table 'todos' missing"
    
    # Check preferences columns
    pref_cols = {c["name"] for c in inspector.get_columns("preferences")}
    for required in ["theme", "pomo_work_min", "pomo_break_min", "lofi_track", "lofi_volume", "timezone", "is12h", "temp_unit", "language"]:
        assert required in pref_cols, f"Column '{required}' missing in preferences table"
    
    # Check todos columns
    todo_cols = {c["name"] for c in inspector.get_columns("todos")}
    for required in ["tag", "subtitle", "category", "done", "text", "order_index"]:
        assert required in todo_cols, f"Column '{required}' missing in todos table"

run_test("TC-001", "Database auto-migration & schema column verification", test_tc001_db_migration)

def test_tc002_healthcheck():
    res = main.healthcheck()
    assert res["status"] == "healthy", f"Expected healthy, got {res.get('status')}"
    assert res["version"] == "2.0.0", f"Expected version 2.0.0, got {res.get('version')}"

run_test("TC-002", "API health check endpoint", test_tc002_healthcheck)

def test_tc003_preferences_crud():
    db = next(database.get_db())
    # 1. Get
    pref = main.get_preferences(db)
    assert pref.user_id == "default"
    
    # 2. Update theme to night & language to vi
    update_data = main.PreferenceUpdate(theme="night", is12h=False, lofi_volume=70, language="vi")
    updated = main.update_preferences(update_data, db)
    assert updated.theme == "night"
    assert updated.is12h is False
    assert updated.lofi_volume == 70
    assert updated.language == "vi"

run_test("TC-003", "Preferences retrieval and update", test_tc003_preferences_crud)

def test_tc004_todos_crud():
    db = next(database.get_db())
    # 1. Create task
    new_todo = main.TodoCreate(
        text="Test Landing Page Feature",
        tag="Design",
        subtitle="Your next focus",
        category="up_next"
    )
    created = main.create_todo(new_todo, db)
    assert created.id is not None
    assert created.text == "Test Landing Page Feature"
    assert created.tag == "Design"
    assert created.done is False
    
    # 2. Toggle done
    updated = main.update_todo(created.id, main.TodoUpdate(done=True), db)
    assert updated.done is True
    
    # 3. Clean up
    main.delete_todo(created.id, db)
    deleted_check = db.query(models.Todo).filter(models.Todo.id == created.id).first()
    assert deleted_check is None

run_test("TC-004", "To-Do task lifecycle (Create, Update status, Delete)", test_tc004_todos_crud)

def test_tc005_xss_sanitization():
    db = next(database.get_db())
    xss_payload = "<script>alert('xss')</script>Test XSS"
    created = main.create_todo(main.TodoCreate(text=xss_payload), db)
    assert "<script>" not in created.text, "Unescaped HTML script tags found in text!"
    assert "&lt;script&gt;" in created.text, "Expected HTML escaped string"
    main.delete_todo(created.id, db)

run_test("TC-005", "XSS injection prevention & input sanitization", test_tc005_xss_sanitization)

def test_tc006_quote_endpoint():
    q = main.get_quote()
    assert len(q.text) > 5
    assert len(q.author) > 2

run_test("TC-006", "Quote of the day endpoint", test_tc006_quote_endpoint)

def test_tc007_seed_default_todos():
    db = next(database.get_db())
    seeded = main.seed_default_todos(db)
    assert len(seeded) >= 5, f"Expected at least 5 seeded tasks, got {len(seeded)}"
    texts = [t.text for t in seeded]
    assert "Finish the landing page" in texts
    assert "Read 10 pages" in texts
    assert "Plan tomorrow's priorities" in texts

run_test("TC-007", "Default to-do seed matching mockup design", test_tc007_seed_default_todos)

# --- Frontend Structure & Assets Tests ---
print("\n--- [QA-6] FRONTEND DOM & ASSETS VERIFICATION ---")

def test_tc008_html_dom_elements():
    with open(HTML_PATH, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Crucial elements matching mockups & new requirements
    required_ids = [
        "brandHeader", "brandSubtitle", "weatherWidget", "weatherTemp", "weatherDesc", "weatherCity",
        "clockPanel", "greeting", "clockTime", "clockDate", "formatSegmented", "seg12h", "seg24h",
        "tzPillBtn", "tzPillText", "topBtnGroup", "focusBtn", "todoBtn", "settingsBtn",
        "exitFocusBanner", "exitFocusBtn",
        # Top poem bar (replaced bottom quote)
        "topPoemBar", "topPoemText", "topPoemAuthor",
        # Pomodoro & minimize button
        "pomodoroWidget", "pomoDisplay", "pomoPlay", "pomoPause", "pomoReset", "pomoSkip", "pomoMinimize",
        # Lofi player & minimize button, mini body, mini selector, equalizer visualizer
        "lofiWidget", "lofiEqualizer", "lofiMinimizeBtn", "lofiFullBody", "lofiMiniBody", "lofiMiniSelect",
        "lofiMiniPlayBtn", "lofiMiniVisualizer", "lofiTrackName", "lofiAmbientTag", "lofiVolume", "volPercent",
        # To-Do panel & minimize button
        "todoPanel", "todoMinimize", "todoClose", "todoInput", "todoAdd", "todoProgressFill", "todoProgressStats",
        "todoListUpNext", "todoListCompleted", "upNextCount", "completedCount",
        # Settings drawer & multilingual language options
        "settingsDrawer", "themeCardSelector", "themeCardName", "setTimezone", "setFireflies",
        "lblLanguageGroup", "lblLanguageTitle", "lblLanguageDesc"
    ]
    for el_id in required_ids:
        assert f'id="{el_id}"' in content, f"Missing required ID '{el_id}' in index.html"
    
    # Verify bottom quote widget was removed
    assert 'id="quoteWidget"' not in content, "quoteWidget should have been removed from the bottom as requested"
    
    # Verify language options (English, Tiếng Việt, Thai)
    assert 'name="appLang"' in content, "Missing appLang radio group in index.html"
    assert 'value="en"' in content and 'value="vi"' in content and 'value="th"' in content

run_test("TC-008", "Presence of all essential widgets, minimize controls, top poem bar, and language radios", test_tc008_html_dom_elements)

def test_tc009_realistic_moon_svg():
    with open(HTML_PATH, "r", encoding="utf-8") as f:
        content = f.read()
    assert "moon-body-realistic" in content, "Missing realistic moon container"
    assert "moonBase" in content, "Missing moon SVG base gradient"
    assert "moon-halo" in content, "Missing moon atmospheric halo"
    assert "moonSphereClip" in content, "Missing moon sphere clip"

run_test("TC-009", "Photorealistic lunar crater SVG and halo structure", test_tc009_realistic_moon_svg)

def test_tc010_css_design_tokens():
    with open(CSS_PATH, "r", encoding="utf-8") as f:
        css = f.read()
    for token in ["--sky-top", "--sky-mid", "--sky-bottom", "--l1-peak", "--neon-cyan", "--clock-glow", "--card-bg"]:
        assert token in css, f"Missing CSS token '{token}' in style.css"

run_test("TC-010", "Modern CSS design tokens & midnight color gradients", test_tc010_css_design_tokens)

def test_tc011_widgets_css_rules():
    with open(WIDGETS_CSS_PATH, "r", encoding="utf-8") as f:
        w_css = f.read()
    for rule in [".pomodoro-widget", ".lofi-widget", ".drawer-panel", ".task-card", ".exit-focus-banner", "body.focus-mode"]:
        assert rule in w_css, f"Missing CSS selector '{rule}' in widgets.css"
    
    # Minimized lofi rhythm visualizer bars
    assert ".lofi-widget.minimized" in w_css
    assert ".lofi-mini-body" in w_css
    assert ".rhythm-bar" in w_css

run_test("TC-011", "Widget, drawer, and minimized lofi rhythm equalizer styling in widgets.css", test_tc011_widgets_css_rules)

def test_tc012_sql_server_tsql_script():
    tsql_path = SERVER_DIR / "sql" / "V001__init_schema.sql"
    assert tsql_path.exists(), "SQL Server T-SQL script missing!"
    with open(tsql_path, "r", encoding="utf-8") as f:
        tsql = f.read()
    assert "CREATE TABLE [dbo].[preferences]" in tsql
    assert "CREATE TABLE [dbo].[todos]" in tsql
    assert "sp_UpsertPreferences" in tsql
    assert "[language]" in tsql, "Missing [language] column in SQL Server schema"
    assert "@language" in tsql, "Missing @language parameter in sp_UpsertPreferences"

run_test("TC-012", "SQL Server (SSMS 22) T-SQL migration script compliance with [language]", test_tc012_sql_server_tsql_script)

def test_tc013_clock_position_at_bottom():
    with open(CSS_PATH, "r", encoding="utf-8") as f:
        css = f.read()
    # Clock card positioned at the lower bottom
    assert "bottom: 26px" in css, "Clock card must be positioned near bottom: 26px"
    assert "left: 50%" in css, "Clock card must be centered horizontally"

run_test("TC-013", "Clock Card relocated to bottom center opening upper sky", test_tc013_clock_position_at_bottom)

def test_tc014_focus_mode_clock_fade_out():
    with open(WIDGETS_CSS_PATH, "r", encoding="utf-8") as f:
        w_css = f.read()
    assert "body.focus-mode .clock-panel" in w_css, "Missing focus-mode rule for clock-panel"
    assert "filter: blur(10px) !important;" in w_css, "Missing blur fade-out filter for clock-panel in focus mode"
    assert "opacity: 0 !important;" in w_css, "Clock card must have opacity 0 in focus mode"
    assert "visibility: hidden !important;" in w_css, "Clock card must be hidden in focus mode"

run_test("TC-014", "Focus mode hides Clock Card with blur fade animation", test_tc014_focus_mode_clock_fade_out)

def test_tc015_50_poems_and_i18n_dictionary():
    with open(SCRIPT_PATH, "r", encoding="utf-8") as f:
        js = f.read()
    # Check 50 poems
    assert "POEMS_50" in js, "POEMS_50 array missing in script.js"
    # Match poem items
    poem_matches = re.findall(r'\{\s*text:\s*"[^"]+",\s*author:\s*"[^"]+"\s*\}', js)
    assert len(poem_matches) >= 50, f"Expected at least 50 poems, found {len(poem_matches)}"
    
    # Check I18N dictionary covering en, vi, th
    assert "const I18N = {" in js, "I18N dictionary missing in script.js"
    assert "en:" in js and "vi:" in js and "th:" in js, "Missing language keys in I18N"
    assert "applyLanguage" in js, "applyLanguage function missing"
    assert "initPoemBar" in js, "initPoemBar function missing"

run_test("TC-015", "50 Famous Poems collection and multilingual I18N dictionary (EN/VI/TH)", test_tc015_50_poems_and_i18n_dictionary)

def test_tc016_pomodoro_minimize():
    with open(HTML_PATH, "r", encoding="utf-8") as f:
        html_code = f.read()
    with open(WIDGETS_CSS_PATH, "r", encoding="utf-8") as f:
        css_code = f.read()
    assert "pomoMiniMeta" in html_code, "pomoMiniMeta missing in HTML"
    assert "pomoMiniTime" in html_code, "pomoMiniTime missing in HTML"
    assert "pomoMiniPlay" in html_code, "pomoMiniPlay missing in HTML"
    assert ".pomodoro-widget.minimized" in css_code, ".pomodoro-widget.minimized missing in CSS"
    assert ".pomo-mini-meta" in css_code, ".pomo-mini-meta missing in CSS"

run_test("TC-016", "Pomodoro Widget Minimize & mini display integration", test_tc016_pomodoro_minimize)

def test_tc017_draggable_performance_raf():
    with open(DRAG_PATH, "r", encoding="utf-8") as f:
        js = f.read()
    assert "requestAnimationFrame" in js, "Draggable must use requestAnimationFrame for 60fps"
    assert "willChange" in js, "Draggable must set willChange for GPU acceleration"
    assert "closest('button, select, input" in js, "Draggable must not intercept clicks on buttons or controls"

run_test("TC-017", "High-performance RAF throttled zero-lag dragging", test_tc017_draggable_performance_raf)

def test_tc018_poem_timing_and_click_off():
    with open(SCRIPT_PATH, "r", encoding="utf-8") as f:
        js = f.read()
    assert "POEM_VISIBLE_MS = 30 * 1000" in js, "Poem must stay visible for 30 seconds"
    assert "POEM_COOLDOWN_MS = 5 * 60 * 1000" in js, "Poem must sleep for 5 minutes after hiding"
    assert "hidePoemAndSchedule" in js, "Poem must immediately hide on click and schedule 5-min reappear"

run_test("TC-018", "Poem 30s auto-disappear & 5-minute cooldown with immediate click-to-hide", test_tc018_poem_timing_and_click_off)

def test_tc019_clock_time_overflow_locking():
    with open(SCRIPT_PATH, "r", encoding="utf-8") as f:
        js = f.read()
    with open(CSS_PATH, "r", encoding="utf-8") as f:
        css = f.read()
    assert "fitClockTime" in js, "fitClockTime auto-scaling function missing in script.js"
    assert "overflow: hidden" in css, "Clock panel must have overflow: hidden"
    assert "clamp(2.2rem, 4.4vw, 3.6rem)" in css, "Clock time font size must be clamped to prevent overflow"

run_test("TC-019", "Clock Time overflow prevention & responsive auto-fit", test_tc019_clock_time_overflow_locking)

def test_tc020_mobile_tablet_collision_prevention():
    with open(WIDGETS_CSS_PATH, "r", encoding="utf-8") as f:
        w_css = f.read()
    with open(CSS_PATH, "r", encoding="utf-8") as f:
        css = f.read()
    # Ensure tablet and mobile media queries exist
    assert "@media (max-width: 860px)" in w_css
    assert "@media (max-width: 480px)" in w_css
    # Central hero Clock Card on mobile and tablet portrait
    assert "top: 50%" in css, "Clock Card must be vertically centered on tablet portrait"
    assert "top: 48%" in css, "Clock Card must be vertically centered on mobile portrait"
    assert "transform: translate(-50%, -50%)" in css, "Clock must use translate(-50%, -50%) to center"
    # Ensure tablet landscape query does not leak into portrait tablets
    assert "(min-width: 769px) and (max-width: 1100px)" not in css, "Tablet landscape must not match portrait tablets"
    assert "(min-width: 769px) and (max-width: 1100px)" not in w_css, "Tablet landscape in widgets.css must not match portrait tablets"
    # Focus mode smooth transition from centered clock
    assert "calc(-50% + 15px)" in w_css, "Focus mode on mobile/tablet must preserve centered vertical offset"
    # Mobile safe-area top support
    assert "env(safe-area-inset-top" in css, "style.css must support safe area top insets for notch/island"
    assert "env(safe-area-inset-top" in w_css, "widgets.css must support safe area top insets"
    # Compact docked widgets at bottom corners with safe-area insets
    assert "bottom: max(22px" in w_css, "Widgets must dock at bottom on tablet portrait"
    assert "bottom: max(14px" in w_css, "Widgets must dock at bottom on mobile portrait"

run_test("TC-020", "Mobile and Tablet layout collision prevention & centered clock", test_tc020_mobile_tablet_collision_prevention)

def test_tc021_mobile_tablet_landscape_support():
    with open(CSS_PATH, "r", encoding="utf-8") as f:
        css = f.read()
    with open(WIDGETS_CSS_PATH, "r", encoding="utf-8") as f:
        w_css = f.read()
    with open(HTML_PATH, "r", encoding="utf-8") as f:
        html_code = f.read()

    # Viewport-fit=cover in HTML
    assert "viewport-fit=cover" in html_code, "HTML meta viewport must specify viewport-fit=cover for safe-area insets"

    # Landscape & short viewport media queries in style.css
    assert "@media (orientation: landscape)" in css, "style.css must support orientation: landscape"
    assert "env(safe-area-inset-bottom" in css, "style.css must support safe area bottom insets"

    # Landscape layout in widgets.css
    assert "@media (orientation: landscape)" in w_css, "widgets.css must support orientation: landscape"
    assert "bottom: max(10px, env(safe-area-inset-bottom" in w_css, "Widgets must dock at bottom in landscape"

run_test("TC-021", "Mobile & Tablet landscape orientation and safe area support", test_tc021_mobile_tablet_landscape_support)

def test_tc022_mobile_compact_sizing_and_elevated_clock():
    with open(CSS_PATH, "r", encoding="utf-8") as f:
        css = f.read()
    with open(WIDGETS_CSS_PATH, "r", encoding="utf-8") as f:
        w_css = f.read()

    # Desktop Clock Card remains at bottom
    assert "bottom: 26px" in css, "Desktop clock panel must sit near bottom: 26px"

    # Mobile portrait clock panel is centered vertically
    assert "top: 48%" in css, "Mobile portrait clock panel must be centered vertically"
    assert "bottom: auto" in css, "Mobile portrait clock panel must set bottom: auto"

    # Sleek compact mobile controls and narrowed frames
    assert "pomo-stepper { padding: 2px 3px" in w_css, "Mobile Pomodoro steppers must be compact"
    assert "width: 130px !important;" in w_css, "Minimized Pomodoro must be sleek and compact on mobile"
    assert "width: 138px !important;" in w_css, "Minimized Lofi must be sleek and compact on mobile"

run_test("TC-022", "Mobile compact widget sizing & vertically centered clock", test_tc022_mobile_compact_sizing_and_elevated_clock)

def test_tc023_draggable_viewport_clamping_and_reset():
    with open(DRAG_PATH, "r", encoding="utf-8") as f:
        js = f.read()

    assert "clampAllDraggables" in js, "Draggable must clamp widgets on resize and rotation"
    assert "orientationchange" in js, "Draggable must listen to device orientationchange"
    assert "dblclick" in js, "Draggable handle must support double click reset to docked position"
    assert "touchend" in js, "Draggable handle must support touch events for mobile double tap reset"

run_test("TC-023", "Draggable viewport clamping and double-click/double-tap reset", test_tc023_draggable_viewport_clamping_and_reset)

def test_tc024_tablet_landscape_and_drag_freedom():
    with open(CSS_PATH, "r", encoding="utf-8") as f:
        css = f.read()
    with open(WIDGETS_CSS_PATH, "r", encoding="utf-8") as f:
        w_css = f.read()
    with open(SCRIPT_PATH, "r", encoding="utf-8") as f:
        js = f.read()

    # Tablet landscape media query exists in both style.css and widgets.css
    tablet_landscape_query = "@media (min-width: 769px) and (max-width: 1200px) and (orientation: landscape)"
    assert tablet_landscape_query in css, "style.css must support tablet landscape orientation"
    assert tablet_landscape_query in w_css, "widgets.css must support tablet landscape orientation"

    # Drag freedom: widgets in landscape must NOT lock coordinates with !important so drag works smoothly
    assert ".pomodoro-widget {\n        bottom: max(10px, env(safe-area-inset-bottom, 0px));" in w_css, \
        "Pomodoro widget must not have !important locking bottom in landscape"
    assert ".lofi-widget {\n        bottom: max(10px, env(safe-area-inset-bottom, 0px));" in w_css, \
        "Lofi widget must not have !important locking bottom in landscape"

    # Mobile landscape width proportions ensure 0 collision
    assert "width: min(150px, 22vw);" in w_css, "Pomodoro width in landscape must be compact to prevent clock collision"
    assert "width: min(160px, 24vw);" in w_css, "Lofi width in landscape must be compact to prevent clock collision"
    assert "width: min(340px, 40vw);" in css, "Clock width in landscape must be calibrated to prevent widget overlap"

    # script.js listens to orientationchange
    assert "orientationchange" in js, "script.js must listen to orientationchange to resize canvas and clock auto-fit"

run_test("TC-024", "Tablet landscape support, mobile clearance math & draggable freedom", test_tc024_tablet_landscape_and_drag_freedom)

print("\n======================================================================")
print(f"RESULTS: {len(passed_tests)} PASSED, {len(failed_tests)} FAILED")
print("======================================================================")

if failed_tests:
    sys.exit(1)
