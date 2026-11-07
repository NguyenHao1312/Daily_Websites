# 🎂 Birthday Magic — Interactive Celebration & Greeting Platform (v2.0)

> A modern, interactive birthday celebration website featuring a 3D tiered celebration cake with flame-blowing and microphone breath detection, an interactive 3D surprise gift box with unwrapping physics, personalized greeting cards with safe shareable URLs, an online birthday wishes wall (guestbook), a photo memory keepsake booth, a polyphonic Web Audio API music & sound studio, and full 6-language reactive localization.

[![Netlify Deploy](https://img.shields.io/badge/Hosted_on-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](./netlify.toml)
[![QA Test Suite](https://img.shields.io/badge/QA_Tests-22%2F22_PASS-brightgreen?style=for-the-badge&logo=checkmarx&logoColor=white)](./test_birthday.py)
[![Languages](https://img.shields.io/badge/Languages-VI%20%7C%20EN%20%7C%20TH%20%7C%20ZH%20%7C%20JA%20%7C%20ES-blueviolet?style=for-the-badge)](./script.js)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](../LICENSE)

---

## ✨ Features

### 🎂 1. 3D Interactive Celebration Cake & Candle Blowing
- **Tiered 3D Cake Design:** Multi-tier celebration cake with dripping frosting, strawberries, cherry toppers, and a reflective golden platter.
- **Interactive Candle Flames:** Sequential candles with realistic SVG flickering flames, wicks, and smoke particle physics when blown out.
- **Multiple Blowing Modes:**
  - **Click / Tap:** Blow out candles individually with tactile audio feedback.
  - **Blow All:** Auto-blow all candles in a smooth animated cascade.
  - **Microphone Air Detection:** Use your phone or computer's microphone to blow out the candles with real breath (`navigator.mediaDevices.getUserMedia`).
  - **Relight:** Light up all candles again instantly.
- **Cosmic Secret Wish Reveal:** Unlocks an animated congratulatory popup card with fanfare when all candles are extinguished.

### 🎁 2. Interactive 3D Surprise Gift Box
- **Physical Unwrapping Physics:** 3D perspective gift box with tied ribbons and bow.
- **Touch / Click Trigger:** Tapping the box causes the ribbon to untie, the lid to pop off with rotation physics, and confetti to burst.
- **Polaroid Keepsake Card Reveal:** Discloses a personalized Polaroid greeting card with heartfelt wishes and a re-wrap action button.

### 💌 3. Card Personalizer & Safe Shareable URLs (XSS Protected)
- **Instant Customization Drawer:** Personalize Recipient Name, Custom Age, Sender Name, and Heartfelt Wishes.
- **Quick Preset Wishes:** Warm, Funny, Inspirational, and Romantic templates.
- **Shareable Link Generation:** Generates a clean URL parameter link (e.g., `index.html?name=Alex&from=Jordan&age=21&msg=...`) with 1-click clipboard copy and toast notifications.
- **OWASP CWE-79 XSS Protection:** Complete HTML entity sanitization (`escapeHtml`) ensuring zero script injection vulnerabilities.

### 📸 4. Photo Memory Keepsake Booth
- **Upload & Custom Framing:** Upload personal photos to preview inside 4 distinct designer frames: **Polaroid**, **Royal Gold**, **Neon Party**, and **Vintage Film**.
- **Interactive Sticker Palette:** Stamp party hats, sunglasses, crowns, balloons, hearts, and confetti onto photos.
- **HTML5 Canvas Export:** Export and download the decorated keepsake as a high-resolution PNG card.

### 📝 5. Birthday Wishes Wall (Online Guestbook)
- **Interactive Masonry Grid:** Leave warm wishes with customizable avatar emojis (🎂, 🎉, 🌟, 💖, 🥳, 🎁) and 5 aesthetic color themes (Rose, Violet, Sunset, Ocean, Emerald).
- **Heart Like Counters:** Interactive like buttons with counter increments.
- **LocalStorage Persistence:** Retains wishes across sessions with graceful fallback.

### 🎵 6. Polyphonic Web Audio Synthesizer & SFX Soundboard
- **100% Native Web Audio API:** Zero external MP3/WAV files required; 100% offline capability with zero lag.
- **3 Distinct Melodies:**
  1. *Classic Happy Birthday* (Warm music box with harmonic sub-chords)
  2. *Lively Celebration Ragtime* (Upbeat celebratory jazz)
  3. *Royal Celebration Fanfare* (Majestic brass and chimes)
- **18-Bar Reactive Rhythm Visualizer:** Equalizer bars that dance in real-time with playback.
- **Party Soundboard Pad:** Tactile sound effects including Party Horn (sawtooth sweep), Balloon Pop, Applause & Cheers, and Magic Sparkle Chimes.

### 🌐 7. Comprehensive 6-Language Reactive i18n
- **Full Localization:** Instant DOM switching across **Tiếng Việt (VI)**, **English (EN)**, **ไทย (TH)**, **中文 (ZH)**, **日本語 (JA)**, and **Español (ES)**.
- **100% Dictionary Symmetry:** All 6 languages maintain complete parity with identical key mappings and natural translations.

### 📱 8. Ultra-Responsive & Accessible UI/UX
- **Modern Glassmorphism:** Subtle borders, multi-layered drop shadows, and `backdrop-filter: blur(20px)`.
- **Viewport & Inset Aware:** Full support for `viewport-fit=cover` and `env(safe-area-inset-*)`.
- **Accessibility:** Skip-to-content links, ARIA labels, semantic landmark elements, keyboard focus (`tabindex="0"`, `Enter`/`Space`), and `prefers-reduced-motion` compliance.

---

## 🚀 Deployment

The project is pre-configured for static edge deployment on **Netlify** via [`netlify.toml`](./netlify.toml):

```toml
[build]
  publish = "."

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(self), geolocation=()"
```

---

## 🧪 Testing & Verification

Run the full automated QA verification suite (22 tests covering DOM structure, i18n dictionary symmetry, CSS tokens, Web Audio API, XSS prevention, Netlify config, and SQL Server schema):

```bash
python test_birthday.py
```

*(All 22 test cases pass with 100% success rate)*

---

## 🗄️ Database Architecture (SQL Server SSMS 22)

For teams extending the project into a persistent enterprise cloud backend, a production T-SQL migration script adhering to **SKILL_CUSTOM_1305 §7.2** is available at [`server/sql/V001__init_birthday_schema.sql`](./server/sql/V001__init_birthday_schema.sql):
- `BirthdayCards`: Stores generated cards and view metrics.
- `GuestbookWishes`: Stores moderated wishes with SHA-256 IP hashing (preventing PII leaks).
- `BirthdayAuditLogs`: High-density security audit logging.

---

## 📄 License

Distributed under the [MIT License](../LICENSE). © 2026 Daily Websites Project.
