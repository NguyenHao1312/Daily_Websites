# 🌤️ ClockTime33 — Day Night Cycle Dashboard

> An aesthetic ambient dashboard featuring dynamic 24-hour day/night cycles, photorealistic lunar visualization, 4-season climate particle simulations, Pomodoro focus timer, Lofi radio with animated rhythm equalizer, 50 luminary poems, and full multilingual support.

[![Netlify Deploy](https://img.shields.io/badge/Hosted_on-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://clock-time-33.netlify.app/)
[![QA Test Suite](https://img.shields.io/badge/QA_Tests-24%2F24_PASS-brightgreen?style=for-the-badge&logo=checkmarx&logoColor=white)](./test_daynight.py)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](../LICENSE)

---

## 🔗 Live Production Demo
- **URL:** [https://clock-time-33.netlify.app/](https://clock-time-33.netlify.app/)
- **Hosting Partner:** **Netlify**

---

## ✨ Features

- 🌓 **Dynamic Day / Night Cycles:**
  - Smooth background gradient transitions corresponding to local time: Dawn, Day, Noon, Sunset, Night, and Midnight.
  - Photorealistic SVG moon with surface crater topology and atmospheric soft halo.
- 🕒 **Adaptive Clock Card (Desktop Bottom / Mobile Centered):**
  - **Desktop / PC:** Positioned gracefully near the bottom (`bottom: 26px`), keeping the upper sky and mountain vistas wide open.
  - **Mobile & Tablet Portrait:** Elevated to the **vertical center** (`top: 48% / 50%`, `transform: translate(-50%, -50%)`), acting as the primary hero focal point.
  - Neon cyan LED display with 12H/24H formats and worldwide regional timezone selector.
  - Responsive `fitClockTime()` auto-scaler with dynamic padding measurement preventing typography frame overflow.
- 🍅 **Pomodoro Timer Widget:**
  - Work & Break interval steppers with quick controls.
  - Collapsible Minimized Mode with ultra-compact `130px` readout and hidden redundant labels.
  - Zero-lag 60–120fps draggable anywhere on the screen with touch Double-Tap / mouse Double-Click reset.
- 🎵 **Lofi Radio Widget:**
  - Multiple curated chill streams (Chillhop, Morning Coffee, Midnight Lofi, Rainy Days, Study Focus).
  - 18-bar dynamic rhythm spectrum equalizer in minimized mode (`138px` footprint).
  - Flex child protection (`min-width: 0`) and track name ellipsis truncation.
- 📜 **Top Poem Banner:**
  - 50 timeless literary masterpieces from world-renowned thinkers and poets.
  - Subtle fade-in every 5 minutes (visible for 30s or dismiss on tap).
- 🌐 **Multilingual Interface (i18n):**
  - Instant reactive DOM language switching for **English (EN)**, **Tiếng Việt (VI)**, and **ไทย (TH)**.
- 📱 **Deep Mobile & Tablet UX & Landscape Support:**
  - **Portrait Layout:** Centered clock hero with Pomodoro (`min(136px)`) and Lofi Radio (`min(144px)`) docked at bottom corners with safe-area insets.
  - **Landscape Layout:** Mathematically calibrated 3-column layout (22vw / 40vw / 24vw) guaranteeing 0px horizontal collision between clock and companion widgets.
  - Complete safe area insets (`env(safe-area-inset-*)`) support via `viewport-fit=cover`.
- ⚡ **Full-Stack REST Backend:**
  - Python FastAPI + SQLAlchemy + SQLite with automated database schema migration.
  - Production-ready SQL Server (SSMS 22) T-SQL migration script.
  - Full XSS input sanitization.

---

## 🚀 Deployment

The static frontend is configured for deployment on **Netlify** via [`netlify.toml`](./netlify.toml):
```toml
[build]
  publish = "."

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

---

## 🧪 Testing & Verification

Run the full automated QA verification suite (24 tests covering database migrations, API endpoints, DOM structure, CSS tokens, landscape layout, and drag performance):

```bash
python test_daynight.py
```
*(All 24 test cases pass with 100% success rate)*
