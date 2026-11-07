/* =================================================
   Draggable Widgets — High Performance Vanilla JS
   Zero-reflow, RAF-throttled 60-120fps dragging
   ================================================= */
(() => {
    'use strict';

    function makeDraggable(elementId, handleId) {
        const el = document.getElementById(elementId);
        const handle = document.getElementById(handleId);
        if (!el || !handle) return;

        let startClientX = 0, startClientY = 0;
        let initialLeft = 0, initialTop = 0;
        let maxLeft = 0, maxTop = 0;
        let targetX = 0, targetY = 0;
        let isDragging = false;
        let rafId = null;

        handle.addEventListener('mousedown', dragStart);
        handle.addEventListener('touchstart', dragStart, { passive: false });

        function dragStart(e) {
            // Never trigger drag when clicking buttons, inputs, selects, or interactive elements
            if (e.target.closest('button, select, input, label, a, .no-drag')) return;

            const isTouch = e.type === 'touchstart';
            const touch = isTouch ? e.touches[0] : e;
            startClientX = touch.clientX;
            startClientY = touch.clientY;

            if (!isTouch) {
                e.preventDefault();
            }

            // Cache dimensions and bounds ONCE to eliminate layout thrashing
            const rect = el.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;
            targetX = initialLeft;
            targetY = initialTop;

            const winWidth = window.innerWidth;
            const winHeight = window.innerHeight;
            maxLeft = Math.max(0, winWidth - rect.width);
            maxTop = Math.max(0, winHeight - rect.height);

            // Convert position to explicit top/left and reset bottom/right
            el.style.transition = 'none';
            el.style.margin = '0';
            el.style.bottom = 'auto';
            el.style.right = 'auto';
            el.style.left = initialLeft + 'px';
            el.style.top = initialTop + 'px';
            el.style.willChange = 'left, top';

            isDragging = true;
            document.body.style.userSelect = 'none';

            if (isTouch) {
                document.addEventListener('touchmove', dragMove, { passive: false });
                document.addEventListener('touchend', dragEnd);
                document.addEventListener('touchcancel', dragEnd);
            } else {
                document.addEventListener('mousemove', dragMove);
                document.addEventListener('mouseup', dragEnd);
            }
        }

        function dragMove(e) {
            if (!isDragging) return;

            const isTouch = e.type === 'touchmove';
            if (isTouch) {
                e.preventDefault(); // Prevent touch scroll while dragging
            }

            const touch = isTouch ? e.touches[0] : e;
            const deltaX = touch.clientX - startClientX;
            const deltaY = touch.clientY - startClientY;

            // Clamped targets based on cached limits (zero DOM reads during movement!)
            targetX = Math.max(0, Math.min(initialLeft + deltaX, maxLeft));
            targetY = Math.max(0, Math.min(initialTop + deltaY, maxTop));

            // Throttle DOM writes strictly to display refresh rate via requestAnimationFrame
            if (!rafId) {
                rafId = requestAnimationFrame(renderDrag);
            }
        }

        function renderDrag() {
            rafId = null;
            if (!isDragging) return;
            el.style.left = targetX + 'px';
            el.style.top = targetY + 'px';
        }

        function dragEnd() {
            if (!isDragging) return;
            isDragging = false;

            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }

            // Apply final position cleanly
            el.style.left = targetX + 'px';
            el.style.top = targetY + 'px';
            el.style.willChange = 'auto';
            el.style.transition = '';
            document.body.style.userSelect = '';

            document.removeEventListener('mousemove', dragMove);
            document.removeEventListener('mouseup', dragEnd);
            document.removeEventListener('touchmove', dragMove);
            document.removeEventListener('touchend', dragEnd);
            document.removeEventListener('touchcancel', dragEnd);
        }

        function resetToDocked() {
            el.style.left = '';
            el.style.top = '';
            el.style.bottom = '';
            el.style.right = '';
            el.style.willChange = 'auto';
        }

        // Double-click handle to snap back to default responsive docked position (mouse)
        handle.addEventListener('dblclick', (e) => {
            if (e.target.closest('button, select, input, label, a, .no-drag')) return;
            resetToDocked();
        });

        // Double-tap handle to snap back to default responsive docked position (touch)
        let lastTapTime = 0;
        handle.addEventListener('touchend', (e) => {
            if (e.target.closest('button, select, input, label, a, .no-drag')) return;
            const now = Date.now();
            const tapGap = now - lastTapTime;
            if (tapGap > 0 && tapGap < 350) {
                resetToDocked();
                lastTapTime = 0;
            } else {
                lastTapTime = now;
            }
        });
    }

    // Keep all dragged widgets within bounds on viewport resize or device rotation
    function clampAllDraggables() {
        ['pomodoroWidget', 'lofiWidget'].forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            if (el.style.left || el.style.top) {
                const rect = el.getBoundingClientRect();
                const winWidth = window.innerWidth;
                const winHeight = window.innerHeight;
                const maxLeft = Math.max(0, winWidth - rect.width);
                const maxTop = Math.max(0, winHeight - rect.height);
                const curLeft = parseFloat(el.style.left);
                const curTop = parseFloat(el.style.top);

                if (!isNaN(curLeft)) {
                    el.style.left = Math.max(0, Math.min(curLeft, maxLeft)) + 'px';
                }
                if (!isNaN(curTop)) {
                    el.style.top = Math.max(0, Math.min(curTop, maxTop)) + 'px';
                }
            }
        });
    }

    // Initialize draggable for both widgets
    function init() {
        makeDraggable('pomodoroWidget', 'pomoHeader');
        makeDraggable('lofiWidget', 'lofiHeader');

        window.addEventListener('resize', clampAllDraggables);
        window.addEventListener('orientationchange', () => {
            setTimeout(clampAllDraggables, 120);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
