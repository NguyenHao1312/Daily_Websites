# 🎂 Birthday Magic — Interactive Celebration & Greeting Platform (v2.0)

> A modern, interactive birthday celebration website featuring a 3D tiered celebration cake with flame-blowing and microphone breath detection, an interactive 3D surprise gift box with unwrapping physics, personalized greeting cards with safe shareable URLs, an online birthday wishes wall (guestbook), a photo memory keepsake booth, a polyphonic Web Audio API music & sound studio, and full 6-language reactive localization.

[![Netlify Status](https://img.shields.io/badge/Deployed_with-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://happy-birthday-1305.netlify.app/)
[![Live Demo](https://img.shields.io/badge/Live_Demo-happy--birthday--1305.netlify.app-ff69b4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://happy-birthday-1305.netlify.app/)
[![QA Test Suite](https://img.shields.io/badge/QA_Tests-30%2F30_PASS-brightgreen?style=for-the-badge&logo=checkmarx&logoColor=white)](./test_birthday.py)
[![Languages](https://img.shields.io/badge/Languages-VI%20%7C%20EN%20%7C%20TH%20%7C%20ZH%20%7C%20JA%20%7C%20ES-blueviolet?style=for-the-badge)](./script.js)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](../LICENSE)

---

## ✨ Features

### 🎂 1. 3D Interactive Celebration Cake & Candle Blowing
- **Tiered 3D Cake Design:** Multi-tier celebration cake with dripping frosting, strawberries, cherry toppers, and a reflective golden platter.
- **Interactive Candle Flames:** Sequential candles with realistic SVG flickering flames, wicks, and smoke particle physics when blown out.
- **Multiple Blowing Modes:**
  - **Click / Tap:** Blow out candles individually with tactile audio feedback.
  - **Blow All:** Auto-blow all candles in a smooth animated cascade with race-condition timeout cancellation.
  - **Microphone Air Detection:** Use your phone or computer's microphone to blow out the candles with real breath (`navigator.mediaDevices.getUserMedia`).
  - **Relight:** Light up all candles again instantly without stale timeout triggers.
- **Cosmic Secret Wish Reveal:** Unlocks an animated congratulatory popup card with fanfare when all candles are extinguished.

### 🎁 2. Interactive 3D Surprise Gift Box
- **Physical Unwrapping Physics:** 3D perspective gift box with tied ribbons and bow.
- **Touch / Click Trigger:** Tapping the box causes the ribbon to untie, the lid to pop off with rotation physics, and confetti to burst.
- **Polaroid Keepsake Card Reveal:** Discloses a personalized Polaroid greeting card with heartfelt wishes and a re-wrap action button.

### 💌 3. Card Personalizer & Safe Shareable URLs (XSS Protected)
- **Instant Customization Drawer:** Personalize Recipient Name, Custom Age, Sender Name, and Heartfelt Wishes.
- **Quick Preset Wishes:** Warm, Funny, Inspirational, and Romantic templates.
- **Shareable Link Generation:** Generates a clean URL parameter link (e.g., `index.html?name=Alex&from=Jordan&age=21&msg=...`) and backend card ID lookup (`?card_id=...`).
- **OWASP CWE-79 XSS Protection:** Complete HTML entity sanitization (`escapeHtml` and backend sanitization) ensuring zero script injection vulnerabilities.

### 📸 4. Photo Memory Keepsake Booth
- **Upload & Custom Framing:** Upload personal photos to preview inside 4 distinct designer frames: **Polaroid**, **Royal Gold**, **Neon Party**, and **Vintage Film**.
- **Interactive Sticker Palette:** Stamp party hats, sunglasses, crowns, balloons, hearts, and confetti onto photos.
- **HTML5 Canvas Export:** Complete canvas renderer drawing the selected designer frame, user image, all placed stickers at their exact coordinates, and personalized captions into a downloadable PNG.

### 📝 5. Birthday Wishes Wall (Online Guestbook & Full-Stack REST Backend)
- **Interactive Masonry Grid:** Leave warm wishes with customizable avatar emojis (🎂, 🎉, 🌟, 💖, 🥳, 🎁) and 5 aesthetic color themes (Rose, Violet, Sunset, Ocean, Emerald).
- **Heart Like Counters:** Interactive like buttons with counter increments.
- **Full-Stack REST API & LocalStorage Fallback:** Powered by FastAPI, SQLAlchemy, SQLite auto-migrations, and SHA-256 IP hashing with seamless offline fallback.

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
- **100% Dictionary Symmetry:** All 6 languages maintain complete parity across all UI strings, toasts, and localized default wishes.

### 📱 8. Ultra-Responsive & Accessible UI/UX
- **Modern Glassmorphism:** Subtle borders, multi-layered drop shadows, and `backdrop-filter: blur(20px)`.
- **Viewport & Inset Aware:** Full support for `viewport-fit=cover` and `env(safe-area-inset-*)`.
- **Accessibility:** Skip-to-content links, ARIA labels, semantic landmark elements, keyboard focus (`tabindex="0"`, `Enter`/`Space`), and `prefers-reduced-motion` compliance.

---

## 🚀 Deployment

- **Production Live URL:** [https://happy-birthday-1305.netlify.app/](https://happy-birthday-1305.netlify.app/)
- Continuous Deployment (CD) connected directly with Git version control.
- Edge CDN caching and automated static site deployment configured via [`netlify.toml`](./netlify.toml):

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

Run the full automated QA verification suite (30 tests covering backend database migrations, REST endpoints, audit logs, DOM structure, i18n dictionary symmetry, CSS tokens, Web Audio API, XSS prevention, canvas frame rendering, and race-condition safety):

```bash
python test_birthday.py
```

*(All 30 test cases pass with 100% success rate)*

---

## 🗄️ Database Architecture (SQL Server SSMS 22 & SQLite)

The backend provides dual database support adhering to standard enterprise architectural standards:
- **SQLite Engine (`server/database.py`, `server/models.py`, `server/main.py`)**: Local development and automated testing with auto-migrations.
- **SQL Server SSMS 22 (`server/sql/V001__init_birthday_schema.sql`)**: Production T-SQL migration script for enterprise deployment with indexed audit logs and SHA-256 IP hashing.
- `BirthdayCards`: Stores generated cards and view metrics.
- `GuestbookWishes`: Stores moderated wishes with SHA-256 IP hashing (preventing PII leaks).
- `BirthdayAuditLogs`: High-density security audit logging.

---

## 📋 Tiến Trình Nâng Cấp Chi Tiết (Detailed Upgrade Milestones & Changelog)

Dưới đây là chi tiết các tiến trình nâng cấp kỹ thuật đã hoàn thành cho dự án:

1. **Giai đoạn 1 — Kiến trúc Backend REST API & Cơ sở dữ liệu:**
   - Xây dựng module kết nối và tự động migrate bảng biểu bằng SQLAlchemy (`server/database.py`).
   - Định nghĩa ORM Models (`server/models.py`) cho thiệp chúc mừng, lưu bút khách và nhật ký kiểm toán.
   - Phát triển máy chủ FastAPI (`server/main.py`) với đầy đủ endpoints cho việc lấy/tạo lời chúc, bấm thích, lưu/mở thiệp cá nhân hóa.
   - Tích hợp middleware bảo mật Security Headers (`nosniff`, `SAMEORIGIN`, `1; mode=block`).

2. **Giai đoạn 2 — Hoàn thiện tính năng Photo Booth & Xuất ảnh Canvas Kỷ niệm:**
   - Khắc phục lỗi bảo mật tainted canvas bằng việc thêm `crossorigin="anonymous"` cho ảnh xem trước.
   - Nâng cấp bộ máy vẽ Canvas `exportPhotoKeepsake` trong `script.js`:
     - Tự động áp dụng khung viền theo chủ đề (Polaroid, Royal Gold, Neon Party, Vintage Film).
     - Duyệt qua toàn bộ sticker đã dán trên ảnh và định vị chính xác tỷ lệ phần trăm lên canvas xuất bản.
     - Định dạng typography tiêu đề và lời chúc trang trọng trước khi tải file PNG.

3. **Giai đoạn 3 — Đồng bộ hóa đối xứng Đa ngôn ngữ (i18n):**
   - Hoàn thiện 100% đối xứng bộ từ điển cho 6 ngôn ngữ: **Tiếng Việt (`vi`)**, **Tiếng Anh (`en`)**, **Tiếng Thái (`th`)**, **Tiếng Trung (`zh`)**, **Tiếng Nhật (`ja`)**, **Tiếng Tây Ban Nha (`es`)**.
   - Bổ sung các thông báo toast, danh xưng tuổi, badge và lời chúc mẫu mặc định được bản địa hóa riêng cho từng ngôn ngữ.

4. **Giai đoạn 4 — Khắc phục bất đồng bộ và Race Conditions nến sinh nhật:**
   - Quản lý mảng định thời `candleTimeouts` cho chuỗi hiệu ứng thổi nến.
   - Thêm hàm `clearCandleTimeouts()` giúp triệt tiêu hoàn toàn các timer mồ côi khi người dùng bấm "Thắp lại nến" ngay sau khi chọn "Thổi tất cả nến".

5. **Giai đoạn 5 — Tự động hóa kiểm thử chất lượng (QA Automation):**
   - Mở rộng bộ kiểm thử tự động `test_birthday.py` lên **30/30 test cases** toàn diện, kiểm tra từ tầng database auto-migration, API endpoints, mã hóa ẩn danh IP đến giao diện DOM, Web Audio và chống tấn công XSS.

---

## 📄 License

Distributed under the [MIT License](../LICENSE). © 2026 Daily Websites Project.
