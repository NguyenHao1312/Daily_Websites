# 🌐 Daily Websites

> A collection of compact, everyday life-oriented websites — from birthday greetings, weather forecasts, and music players, to aesthetic clocks & productivity tools. Each website provides a delightful experience, created to serve memorable moments in daily life.

[![Netlify Status](https://img.shields.io/badge/Deployed_with-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://clock-time-33.netlify.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](./LICENSE)
[![Tests](https://img.shields.io/badge/QA_Tests-24%2F24_PASS-brightgreen?style=for-the-badge&logo=checkmarx&logoColor=white)](./Day%20Night%20Website/test_daynight.py)

---

## ✨ Introduction

This repository is a curated collection of **mini-websites** built for personal productivity, mindfulness, and sharing with the community. Each project is a standalone website, focusing on a unique theme related to everyday activities.

**Philosophy:** *Simple — Beautiful — Useful*

---

## 📂 Projects List

| # | Project | Live Demo / Link | Description | Technologies | Status |
|---|---------|------------------|-------------|--------------|--------|
| 1 | [🎂 Happy Birthday Website](./Happy%20Birthday%20Website) | *Local / Coming soon* | A beautiful animated birthday greeting website with music and confetti | HTML, CSS, JavaScript | ✅ Stable |
| 2 | [🌤️ Day Night Website](./Day%20Night%20Website) | [🔗 **clock-time-33.netlify.app**](https://clock-time-33.netlify.app/) | Dynamic aesthetic clock (ClockTime33) with realistic day/night cycles, lunar crater SVG, 4-season weather, Lofi Radio, Pomodoro, and global timezones | HTML5, CSS3, Vanilla JS, FastAPI, SQLite | 🚀 Live (v2.0) |
| ... | *More coming soon...* | | | | ⏳ In Planning |

---

## 🚀 Current Progress & Highlights (Tiến Trình Hiện Tại)

### 🌟 Day Night Cycle Dashboard (ClockTime33 v2.0) — Major Upgrade
- **Photorealistic Night & Moon Theme:**
  - High-precision SVG lunar surface with realistic crater textures, atmospheric glow rings, and neon cyan LED clock numerals.
  - Multi-layered procedural mountain parallax background with seasonal particle systems (fireflies, sakura, autumn leaves, snow).
- **Productivity Companion Widgets:**
  - **Pomodoro Timer:** Work/break intervals, numeric steppers, and sleek minimized mode.
  - **Lofi Radio:** Ambient soundscapes, multi-channel streams, and an interactive 18-bar rhythm spectrum equalizer.
  - **60–120fps Draggable System:** RAF-throttled zero-layout-thrashing dragging, with **Double-Tap (touch)** and **Double-Click (mouse)** reset to responsive docking.
- **Top Poem Banner:**
  - Displays 50 celebrated literary masterpieces from world-renowned luminaries.
  - Cycles every 5 minutes with smooth fade animations; stays visible for 30s or auto-hides immediately upon user tap/click.
- **Full Multilingual Architecture (i18n):**
  - Instant reactive DOM language switching for **English (EN)**, **Tiếng Việt (VI)**, and **ไทย (TH)**.
  - Seamless persistence synchronized with backend user preferences.
- **Deep Mobile & Tablet Landscape UX:**
  - Complete safe-area insets (`env(safe-area-inset-*)`) support via `viewport-fit=cover`.
  - Dedicated landscape layouts for phones and tablets with calibrated width proportions (22vw / 40vw / 24vw) guaranteeing 0px horizontal collision.
  - Clock Card elevated comfortably above mobile navigation gesture bars.
- **Backend & Database Infrastructure:**
  - High-performance **Python FastAPI** REST API with SQLite automated self-migration.
  - Full production SQL Server (SSMS 22) T-SQL migration script.
  - Comprehensive input sanitization against XSS attacks.
- **Quality Assurance:**
  - Complete test suite at [`Day Night Website/test_daynight.py`](./Day%20Night%20Website/test_daynight.py) with **24/24 passing tests (100% PASS)**.

---

## 🤝 Partners & Deployment (Đối Tác & Triển Khai)

### 🌐 Official Cloud Hosting Partner: **Netlify**
[![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://www.netlify.com/)

- **Production Live URL:** [https://clock-time-33.netlify.app/](https://clock-time-33.netlify.app/)
- Continuous Deployment (CD) connected directly with Git version control.
- Edge CDN caching and automated static site deployment configured via [`netlify.toml`](./Day%20Night%20Website/netlify.toml).
- Optimized headers, asset routing, and seamless modern web experience.

---

## 🛠️ Tech Stack

### Currently Active
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)

### Planned for the Future
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white)

---

## 💡 Upcoming Ideas

- 🌤️ **Weather Dashboard** — Visual location-based weather board
- 🎵 **Music Player** — Personal online music player
- ⏰ **Clock & Alarm** — Aesthetic clock and alarm
- 📝 **Daily Notes** — Quick daily note-taking app
- 🧮 **Calculator** — Modern glassmorphic calculator
- 📅 **Calendar & Events** — Personal calendar and events
- 🍳 **Recipe Book** — Cooking recipe handbook
- 💰 **Expense Tracker** — Personal finance management

---

## 🚀 How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/Daily_Websites.git
   cd Daily_Websites
   ```

2. Open the desired website:
   - For **Happy Birthday Website**: Open `Happy Birthday Website/index.html` in your browser.
   - For **Day Night Website (Frontend)**: Open `Day Night Website/index.html` in your browser or visit [clock-time-33.netlify.app](https://clock-time-33.netlify.app/).

3. Run the optional FastAPI backend (for Day Night Website task & preference sync):
   ```bash
   cd "Day Night Website/server"
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000
   ```

4. Run the automated test verification suite:
   ```bash
   python "Day Night Website/test_daynight.py"
   ```

---

## 📄 License

Distributed under the [MIT License](./LICENSE). © 2026 Henry

---

<p align="center">
  ⭐ If you find this repository inspiring or useful, please give it a star! ⭐
</p>
