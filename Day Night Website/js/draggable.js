/* =================================================
   Draggable Widgets — Vanilla JS
   ================================================= */
(() => {
    'use strict';

    function makeDraggable(elementId, handleId) {
        const el = document.getElementById(elementId);
        const handle = document.getElementById(handleId);
        if (!el || !handle) return;

        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        // Mouse Events
        handle.addEventListener('mousedown', dragStart);
        // Touch Events
        handle.addEventListener('touchstart', dragStart, { passive: false });

        function dragStart(e) {
            if (e.target.tagName.toLowerCase() === 'button') return;
            
            // Get initial positions based on event type
            if (e.type === 'touchstart') {
                pos3 = e.touches[0].clientX;
                pos4 = e.touches[0].clientY;
            } else {
                e.preventDefault();
                pos3 = e.clientX;
                pos4 = e.clientY;
            }

            // Disable transition to prevent dragging lag
            el.style.transition = 'none';

            // Convert CSS positioning to top/left explicitly to prevent stretching
            const rect = el.getBoundingClientRect();
            el.style.margin = '0';
            el.style.bottom = 'auto';
            el.style.right = 'auto';
            el.style.left = rect.left + 'px';
            el.style.top = rect.top + 'px';

            if (e.type === 'touchstart') {
                document.addEventListener('touchmove', dragMove, { passive: false });
                document.addEventListener('touchend', dragEnd);
            } else {
                document.addEventListener('mousemove', dragMove);
                document.addEventListener('mouseup', dragEnd);
            }
        }

        function dragMove(e) {
            e.preventDefault(); // Prevent scrolling while dragging

            let clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            let clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

            // Calculate the new cursor position:
            pos1 = pos3 - clientX;
            pos2 = pos4 - clientY;
            pos3 = clientX;
            pos4 = clientY;
            
            // Limit drag to window bounds
            let newTop = el.offsetTop - pos2;
            let newLeft = el.offsetLeft - pos1;

            newTop = Math.max(0, Math.min(newTop, window.innerHeight - el.offsetHeight));
            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - el.offsetWidth));

            // Set the element's new position:
            el.style.top = newTop + "px";
            el.style.left = newLeft + "px";
        }

        function dragEnd() {
            // Restore transition
            el.style.transition = '';
            
            // Remove listeners
            document.removeEventListener('mousemove', dragMove);
            document.removeEventListener('mouseup', dragEnd);
            document.removeEventListener('touchmove', dragMove);
            document.removeEventListener('touchend', dragEnd);
        }
    }

    // Initialize draggable for both widgets
    document.addEventListener('DOMContentLoaded', () => {
        makeDraggable('pomodoroWidget', 'pomoHeader');
        makeDraggable('lofiWidget', 'lofiHeader');
    });
})();
