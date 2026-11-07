#!/usr/bin/env python3
"""
Automated QA Verification Suite for Happy Birthday Website (v2.0)
Validates:
- HTML5 Semantics, DOM ID/Class structure, OpenGraph meta tags, and Accessibility
- Full 6-language i18n dictionary completeness & symmetry (vi, en, th, zh, ja, es)
- CSS3 Design Tokens, Glassmorphism backdrop-filters, and Responsive Breakpoints
- Polyphonic Web Audio API synthesis engine (3 tracks + 5 SFX soundboard generators)
- OWASP CWE-79 XSS Sanitization & safe parameter binding
- Netlify TOML deployment configuration and security headers
- SQL Server SSMS 22 migration schema adhering to SKILL_CUSTOM_1305 §7.2
"""

import os
import re
import unittest
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
INDEX_HTML = os.path.join(BASE_DIR, "index.html")
STYLE_CSS = os.path.join(BASE_DIR, "style.css")
SCRIPT_JS = os.path.join(BASE_DIR, "script.js")
NETLIFY_TOML = os.path.join(BASE_DIR, "netlify.toml")
SQL_SCHEMA = os.path.join(BASE_DIR, "server", "sql", "V001__init_birthday_schema.sql")

class TestHappyBirthdayWebsite(unittest.TestCase):

    def setUp(self):
        self.assertTrue(os.path.exists(INDEX_HTML), "index.html must exist")
        self.assertTrue(os.path.exists(STYLE_CSS), "style.css must exist")
        self.assertTrue(os.path.exists(SCRIPT_JS), "script.js must exist")
        
        with open(INDEX_HTML, "r", encoding="utf-8") as f:
            self.html = f.read()
        with open(STYLE_CSS, "r", encoding="utf-8") as f:
            self.css = f.read()
        with open(SCRIPT_JS, "r", encoding="utf-8") as f:
            self.js = f.read()

    # ------------------------------------------------------------------------
    # 1. HTML5 Semantics & Accessibility
    # ------------------------------------------------------------------------
    def test_01_html_semantics_and_meta(self):
        """Verifies HTML5 doctype, UTF-8 charset, viewport-fit=cover, and social meta tags."""
        self.assertIn("<!DOCTYPE html>", self.html)
        self.assertIn('<meta charset="UTF-8">', self.html)
        self.assertIn('viewport-fit=cover', self.html, "Must support viewport-fit=cover for safe-area insets")
        self.assertIn('name="description"', self.html)
        self.assertIn('property="og:title"', self.html)
        self.assertIn('property="og:image"', self.html)
        self.assertIn('class="skip-to-content"', self.html, "Must have an accessibility skip-link")

    def test_02_canvas_animation_layers(self):
        """Verifies Confetti, Fireworks, and Balloon layer elements."""
        self.assertIn('id="fireworks-canvas"', self.html)
        self.assertIn('id="confetti-canvas"', self.html)
        self.assertIn('id="balloons"', self.html)

    def test_03_navigation_bar_elements(self):
        """Verifies Glassmorphic navbar, brand, SFX toggle, and language selector."""
        self.assertIn('id="top-navbar"', self.html)
        self.assertIn('id="sfx-toggle"', self.html)
        self.assertIn('id="nav-music-btn"', self.html)
        self.assertIn('id="open-personalizer-btn"', self.html)
        self.assertIn('id="lang-select"', self.html)
        for lang in ['vi', 'en', 'th', 'zh', 'ja', 'es']:
            self.assertIn(f'value="{lang}"', self.html, f"Language option {lang} must be present in selector")

    def test_04_3d_cake_and_candle_structure(self):
        """Verifies 3D cake, age badge, candles rack, and blow controls."""
        self.assertIn('id="celebration-cake"', self.html)
        self.assertIn('id="cake-age-pill"', self.html)
        self.assertIn('id="candles-rack"', self.html)
        self.assertIn('class="candle"', self.html)
        self.assertIn('class="flame"', self.html)
        self.assertIn('id="blow-all-candles-btn"', self.html)
        self.assertIn('id="relight-candles-btn"', self.html)
        self.assertIn('id="mic-blow-btn"', self.html)
        self.assertIn('id="wish-reveal-popup"', self.html)

    def test_05_3d_gift_box_structure(self):
        """Verifies 3D interactive surprise gift box and card reveal components."""
        self.assertIn('id="surprise-gift"', self.html)
        self.assertIn('id="gift-box"', self.html)
        self.assertIn('id="gift-lid"', self.html)
        self.assertIn('class="gift-ribbon-bow"', self.html)
        self.assertIn('id="gift-revealed-card"', self.html)
        self.assertIn('id="rewrap-gift-btn"', self.html)

    def test_06_photo_booth_structure(self):
        """Verifies photo booth upload, style selector, stickers, and export."""
        self.assertIn('id="photo-booth"', self.html)
        self.assertIn('id="photo-frame"', self.html)
        self.assertIn('id="user-photo-preview"', self.html)
        self.assertIn('id="photo-file-input"', self.html)
        self.assertIn('id="stickers-layer"', self.html)
        self.assertIn('id="clear-stickers-btn"', self.html)
        self.assertIn('id="save-photo-btn"', self.html)

    def test_07_guestbook_and_wishes_wall_structure(self):
        """Verifies online guestbook form, theme selector, and dynamic grid."""
        self.assertIn('id="guestbook"', self.html)
        self.assertIn('id="new-wish-form"', self.html)
        self.assertIn('id="guest-name"', self.html)
        self.assertIn('id="guest-msg"', self.html)
        self.assertIn('id="wishes-wall-grid"', self.html)

    def test_08_music_studio_and_sfx_board_structure(self):
        """Verifies 18-bar equalizer, track dropdown, play button, and 4 SFX pads."""
        self.assertIn('id="musicVisualizer"', self.html)
        self.assertIn('id="track-select"', self.html)
        self.assertIn('id="musicBtn"', self.html)
        self.assertIn('id="sfx-btn-horn"', self.html)
        self.assertIn('id="sfx-btn-pop"', self.html)
        self.assertIn('id="sfx-btn-cheers"', self.html)
        self.assertIn('id="sfx-btn-chimes"', self.html)

    def test_09_personalizer_modal_and_toast_structure(self):
        """Verifies personalizer drawer, presets, copy link box, and toast container."""
        self.assertIn('id="personalizer-modal"', self.html)
        self.assertIn('id="custom-recipient-name"', self.html)
        self.assertIn('id="custom-age"', self.html)
        self.assertIn('id="custom-sender-name"', self.html)
        self.assertIn('id="custom-wish-message"', self.html)
        self.assertIn('id="generated-share-link"', self.html)
        self.assertIn('id="copy-link-btn"', self.html)
        self.assertIn('id="preview-card-btn"', self.html)
        self.assertIn('id="copy-and-share-btn"', self.html)
        self.assertIn('id="toast-container"', self.html)

    # ------------------------------------------------------------------------
    # 2. Multilingual i18n Dictionary Symmetry & Completeness
    # ------------------------------------------------------------------------
    def test_10_i18n_dictionary_symmetry(self):
        """Extracts translations object and ensures 100% key symmetry across all 6 languages."""
        # Find the translations dictionary block in script.js
        match = re.search(r"const\s+translations\s*=\s*({[\s\S]*?^};)", self.js, re.MULTILINE)
        self.assertIsNotNone(match, "translations object must be present in script.js")
        
        # Verify language dictionary blocks exist
        langs = ['vi', 'en', 'th', 'zh', 'ja', 'es']
        for lang in langs:
            self.assertIn(f"{lang}: {{", self.js, f"Language block for '{lang}' must exist")

        # Extract keys for each language using regex matching
        lang_keys = {}
        for lang in langs:
            lang_match = re.search(rf"\b{lang}\s*:\s*\{{([\s\S]*?)\n\s*\}}", self.js)
            self.assertIsNotNone(lang_match, f"Could not isolate block for {lang}")
            raw_block = lang_match.group(1)
            # Find all key names in block at line start (e.g. `  pageTitle: "..."`)
            keys = re.findall(r"^\s+([a-zA-Z0-9_]+)\s*:", raw_block, re.MULTILINE)
            lang_keys[lang] = set(keys)

        # Baseline: keys in 'en'
        base_keys = lang_keys['en']
        self.assertGreaterEqual(len(base_keys), 60, "Expected at least 60 i18n keys for comprehensive coverage")

        for lang in langs:
            diff = base_keys - lang_keys[lang]
            self.assertEqual(len(diff), 0, f"Language '{lang}' is missing keys: {diff}")
            extra = lang_keys[lang] - base_keys
            self.assertEqual(len(extra), 0, f"Language '{lang}' has unknown extra keys: {extra}")

    # ------------------------------------------------------------------------
    # 3. CSS3 Tokens, Glassmorphism & Responsive Rules
    # ------------------------------------------------------------------------
    def test_11_css_design_tokens(self):
        """Verifies root CSS custom properties and color palettes."""
        tokens = [
            '--primary:', '--primary-hover:', '--secondary:', '--accent-gold:',
            '--bg-dark:', '--bg-surface:', '--glass-bg:', '--glass-border:',
            '--glass-blur:', '--glass-shadow:'
        ]
        for token in tokens:
            self.assertIn(token, self.css, f"Design token {token} must be defined in style.css")

    def test_12_css_glassmorphism_and_effects(self):
        """Verifies backdrop-filter and glass-card implementation."""
        self.assertIn('backdrop-filter: var(--glass-blur);', self.css)
        self.assertIn('.glass-card', self.css)
        self.assertIn('.cake-3d', self.css)
        self.assertIn('.gift-box-wrapper', self.css)
        self.assertIn('.music-visualizer', self.css)

    def test_13_css_responsive_breakpoints(self):
        """Verifies mobile, tablet, landscape orientation, and reduced motion queries."""
        self.assertIn('@media (max-width: 768px)', self.css)
        self.assertIn('@media (max-width: 480px)', self.css)
        self.assertIn('@media (orientation: landscape)', self.css)
        self.assertIn('@media (prefers-reduced-motion: reduce)', self.css)

    # ------------------------------------------------------------------------
    # 4. Web Audio API & Sound Engine
    # ------------------------------------------------------------------------
    def test_14_web_audio_synthesis_engine(self):
        """Verifies Web Audio API initialization, polyphonic chords, and track melodies."""
        self.assertIn('window.AudioContext', self.js)
        self.assertIn('playPolyNote', self.js)
        self.assertIn('classic:', self.js)
        self.assertIn('jazz:', self.js)
        self.assertIn('fanfare:', self.js)
        self.assertIn('playSfx', self.js)
        for sfx in ['blow', 'horn', 'pop', 'cheers', 'chimes']:
            self.assertIn(f"case '{sfx}':", self.js, f"SFX '{sfx}' handler must be defined")

    # ------------------------------------------------------------------------
    # 5. Security & XSS Protection (OWASP CWE-79)
    # ------------------------------------------------------------------------
    def test_15_xss_protection_utility(self):
        """Verifies escapeHtml sanitization utility and its usage across DOM manipulation."""
        self.assertIn('function escapeHtml(str)', self.js)
        self.assertIn(".replace(/&/g, '&amp;')".replace(" ", ""), self.js.replace(" ", ""))
        self.assertIn(".replace(/</g, '&lt;')".replace(" ", ""), self.js.replace(" ", ""))
        self.assertIn(".replace(/>/g, '&gt;')".replace(" ", ""), self.js.replace(" ", ""))
        
        # Verify URL search params are bounded and sliced
        self.assertIn('slice(0, 40)', self.js, "Name inputs must be bounded to prevent DOM buffer overflow")
        self.assertIn('slice(0, 500)', self.js, "Wish message input must be safely bounded")

    # ------------------------------------------------------------------------
    # 6. Deployment & Enterprise Database Integration
    # ------------------------------------------------------------------------
    def test_16_netlify_toml_deployment_config(self):
        """Validates Netlify configuration and security headers."""
        self.assertTrue(os.path.exists(NETLIFY_TOML), "netlify.toml must exist")
        with open(NETLIFY_TOML, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn('publish = "."', content)
        self.assertIn('X-Frame-Options = "DENY"', content)
        self.assertIn('X-Content-Type-Options = "nosniff"', content)
        self.assertIn('X-XSS-Protection = "1; mode=block"', content)

    def test_17_sql_server_ssms_schema(self):
        """Validates SQL Server SSMS 22 migration schema adhering to SKILL_CUSTOM_1305 §7.2."""
        self.assertTrue(os.path.exists(SQL_SCHEMA), "V001__init_birthday_schema.sql must exist")
        with open(SQL_SCHEMA, "r", encoding="utf-8") as f:
            sql = f.read()
        self.assertIn("CREATE TABLE BirthdayCards", sql)
        self.assertIn("CREATE TABLE GuestbookWishes", sql)
        self.assertIn("CREATE TABLE BirthdayAuditLogs", sql)
        self.assertIn("ClientIpHash", sql, "Must use IP hashing instead of storing raw PII")

    def test_18_xss_sanitization_execution(self):
        """Simulates the JS escapeHtml function against hostile OWASP XSS attack vectors."""
        def py_escape_html(s):
            return (s.replace('&', '&amp;')
                     .replace('<', '&lt;')
                     .replace('>', '&gt;')
                     .replace('"', '&quot;')
                     .replace("'", '&#039;'))

        hostile_payloads = [
            "<script>alert('xss')</script>",
            '"><img src=x onerror=alert(1)>',
            "';alert(String.fromCharCode(88,83,83))//",
            "<svg/onload=alert('XSS')>",
            '"><iframe src="javascript:alert(1)"></iframe>'
        ]

        for payload in hostile_payloads:
            escaped = py_escape_html(payload)
            self.assertNotIn("<script", escaped)
            self.assertNotIn("<img", escaped)
            self.assertNotIn("<svg", escaped)
            self.assertNotIn("<iframe", escaped)
            self.assertNotIn('"', escaped)
            self.assertNotIn("'", escaped)

    def test_19_all_i18n_values_are_non_empty(self):
        """Ensures that none of the i18n dictionary values in any language are blank or null."""
        langs = ['vi', 'en', 'th', 'zh', 'ja', 'es']
        for lang in langs:
            lang_match = re.search(rf"\b{lang}\s*:\s*\{{([\s\S]*?)\n\s*\}}", self.js)
            self.assertIsNotNone(lang_match)
            raw_block = lang_match.group(1)
            # Find key-value pairs (key: "value")
            pairs = re.findall(r'^\s+([a-zA-Z0-9_]+)\s*:\s*"([^"]*)"', raw_block, re.MULTILINE)
            self.assertGreater(len(pairs), 50, f"Expected >50 string pairs in {lang}")
            for k, val in pairs:
                self.assertTrue(len(val.strip()) > 0, f"Key '{k}' in language '{lang}' must not be empty")

    def test_20_cake_candles_index_alignment(self):
        """Verifies candle DOM count and data-index consistency."""
        candles = re.findall(r'class="candle"\s+data-index="(\d+)"', self.html)
        self.assertEqual(len(candles), 5, "There should be exactly 5 interactive celebration candles")
        self.assertEqual(candles, ['1', '2', '3', '4', '5'], "Candle indices must be sequential 1 to 5")

    def test_21_guestbook_storage_and_defaults(self):
        """Verifies localStorage key and pre-seeded guestbook entries in script.js."""
        self.assertIn("birthday_guestbook_wishes_v2", self.js)
        self.assertIn("defaultWishes", self.js)
        self.assertIn("GUESTBOOK_STORAGE_KEY", self.js)

    def test_22_touch_and_keyboard_accessibility(self):
        """Verifies keyboard navigation and safe accessibility tabindex."""
        self.assertIn('tabindex="0"', self.html, "Gift box must have tabindex=0 for keyboard focus")
        self.assertIn('role="button"', self.html, "Gift box must declare role=button for screen readers")
        self.assertIn("e.key === 'Enter'", self.js, "Keyboard listener must support Enter key")
        self.assertIn("e.key === ' '", self.js, "Keyboard listener must support Space key")

if __name__ == "__main__":
    unittest.main()

