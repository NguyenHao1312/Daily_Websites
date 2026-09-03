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

        handle.onmousedown = dragMouseDown;
        
        // Touch support for mobile
        handle.ontouchstart = function(e) {
            e.preventDefault(); // prevent scrolling
            const touch = e.touches[0];
            dragMouseDown({
                clientX: touch.clientX,
                clientY: touch.clientY,
                type: 'touchstart',
                preventDefault: () => {}
            });
        };

        function dragMouseDown(e) {
            e = e || window.event;
            // Prevent default unless it's a button click inside the header
            if (e.target.tagName.toLowerCase() === 'button') return;
            e.preventDefault();

            // Get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;

            // Disable transition to prevent dragging lag
            el.style.transition = 'none';

            // Convert CSS positioning to top/left explicitly to prevent stretching
            const rect = el.getBoundingClientRect();
            // Need to set margin to 0 just in case
            el.style.margin = '0';
            el.style.bottom = 'auto';
            el.style.right = 'auto';
            el.style.left = rect.left + 'px';
            el.style.top = rect.top + 'px';

            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;

            // Touch events
            document.ontouchend = closeDragElement;
            document.ontouchmove = function(e) {
                const touch = e.touches[0];
                elementDrag({
                    clientX: touch.clientX,
                    clientY: touch.clientY,
                    preventDefault: () => {}
                });
            };
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // Calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            // Limit drag to window bounds
            let newTop = el.offsetTop - pos2;
            let newLeft = el.offsetLeft - pos1;

            newTop = Math.max(0, Math.min(newTop, window.innerHeight - el.offsetHeight));
            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - el.offsetWidth));

            // Set the element's new position:
            el.style.top = newTop + "px";
            el.style.left = newLeft + "px";
        }

        function closeDragElement() {
            // Restore transition
            el.style.transition = '';
            
            // Stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
            document.ontouchend = null;
            document.ontouchmove = null;
        }
    }

    // Initialize draggable for both widgets
    document.addEventListener('DOMContentLoaded', () => {
        makeDraggable('pomodoroWidget', 'pomoHeader');
        makeDraggable('lofiWidget', 'lofiHeader');
    });
})();
