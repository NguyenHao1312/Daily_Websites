/* =================================================
   Focus Mode — Deep Calm with Instant Exit
   Matches Day Night Cycle Design Mockup (Image 4)
   ================================================= */
(() => {
    'use strict';

    const focusBtn = document.getElementById('focusBtn');
    const exitFocusBtn = document.getElementById('exitFocusBtn');
    const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:8000/api'
        : '/api';

    function setFocusMode(active) {
        document.body.classList.toggle('focus-mode', active);
        if (focusBtn) focusBtn.classList.toggle('active', active);

        // Save local settings
        try {
            const raw = localStorage.getItem('daynight_settings');
            const s = raw ? JSON.parse(raw) : {};
            s.focusMode = active;
            localStorage.setItem('daynight_settings', JSON.stringify(s));
        } catch(e) {}

        // Sync with API
        try {
            fetch(`${API_BASE}/preferences`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ focus_mode: active })
            }).catch(() => {});
        } catch(e) {}
    }

    function toggleFocus() {
        const isActive = document.body.classList.contains('focus-mode');
        setFocusMode(!isActive);
    }

    focusBtn?.addEventListener('click', toggleFocus);
    exitFocusBtn?.addEventListener('click', () => setFocusMode(false));

    // Keyboard shortcut: Escape exits focus mode
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && document.body.classList.contains('focus-mode')) {
            setFocusMode(false);
        }
    });

    // Restore state on load
    try {
        const raw = localStorage.getItem('daynight_settings');
        if (raw) {
            const s = JSON.parse(raw);
            if (s.focusMode) {
                setFocusMode(true);
            }
        }
    } catch(e) {}
})();
