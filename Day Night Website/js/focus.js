/* =================================================
   Focus Mode — Hide all widgets, show only clock
   ================================================= */
(() => {
    'use strict';

    const focusBtn = document.getElementById('focusBtn');
    if (!focusBtn) return;

    // Restore focus state from settings
    function restoreFocus() {
        try {
            const raw = localStorage.getItem('daynight_settings');
            if (raw) {
                const s = JSON.parse(raw);
                if (s.focusMode) {
                    document.body.classList.add('focus-mode');
                    focusBtn.classList.add('active');
                }
            }
        } catch(e) {}
    }

    function toggleFocus() {
        const isActive = document.body.classList.toggle('focus-mode');
        focusBtn.classList.toggle('active', isActive);

        // Save to settings
        try {
            const raw = localStorage.getItem('daynight_settings');
            const s = raw ? JSON.parse(raw) : {};
            s.focusMode = isActive;
            localStorage.setItem('daynight_settings', JSON.stringify(s));
        } catch(e) {}
    }

    focusBtn.addEventListener('click', toggleFocus);

    // Escape key to exit focus mode
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && document.body.classList.contains('focus-mode')) {
            toggleFocus();
        }
    });

    restoreFocus();
})();
