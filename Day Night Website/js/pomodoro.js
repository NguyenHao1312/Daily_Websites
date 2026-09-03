/* =================================================
   Pomodoro Timer — Adjustable Work/Break Cycles
   ================================================= */
(() => {
    'use strict';

    const display = document.getElementById('pomoDisplay');
    const playBtn = document.getElementById('pomoPlay');
    const pauseBtn = document.getElementById('pomoPause');
    const resetBtn = document.getElementById('pomoReset');
    const minimizeBtn = document.getElementById('pomoMinimize');
    const body = document.getElementById('pomoBody');
    const modeBtns = document.querySelectorAll('.pomo-mode-btn');
    const adjBtns = document.querySelectorAll('.pomo-adj-btn');
    
    const workMinEl = document.getElementById('pomoWorkMin');
    const workSecEl = document.getElementById('pomoWorkSec');
    const breakMinEl = document.getElementById('pomoBreakMin');
    const breakSecEl = document.getElementById('pomoBreakSec');

    if (!display) return;

    // Adjustable durations
    let workMin = 25, workSec = 0;
    let breakMin = 5, breakSec = 0;

    function getDuration(m) { return m === 'work' ? (workMin * 60 + workSec) : (breakMin * 60 + breakSec); }

    let mode = 'work';
    let timeLeft = getDuration(mode);
    let running = false;
    let intervalId = null;

    function formatTime(sec) {
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = sec % 60;
        
        if (h > 0) {
            // Include hours if duration >= 60 minutes
            return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        }
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    function updateDisplay() {
        display.textContent = formatTime(timeLeft);
        if (mode === 'work') {
            display.style.textShadow = '0 0 20px rgba(255,100,100,0.3)';
        } else {
            display.style.textShadow = '0 0 20px rgba(80,200,120,0.3)';
        }
    }

    function updateAdjDisplay() {
        if (workMinEl) workMinEl.value = workMin;
        if (workSecEl) workSecEl.value = workSec;
        if (breakMinEl) breakMinEl.value = breakMin;
        if (breakSecEl) breakSecEl.value = breakSec;
    }

    function tick() {
        if (timeLeft <= 0) {
            stop();
            switchMode(mode === 'work' ? 'break' : 'work');
            start();
            return;
        }
        timeLeft--;
        updateDisplay();
    }

    function start() {
        if (running) return;
        running = true;
        intervalId = setInterval(tick, 1000);
        playBtn.style.display = 'none';
        pauseBtn.style.display = 'flex';
    }

    function stop() {
        running = false;
        if (intervalId) { clearInterval(intervalId); intervalId = null; }
        playBtn.style.display = 'flex';
        pauseBtn.style.display = 'none';
    }

    function reset() {
        stop();
        timeLeft = getDuration(mode);
        updateDisplay();
    }

    function switchMode(newMode) {
        mode = newMode;
        timeLeft = getDuration(mode);
        modeBtns.forEach(b => {
            b.classList.toggle('active', b.dataset.mode === mode);
        });
        updateDisplay();
    }

    // ── Events ──
    playBtn.addEventListener('click', start);
    pauseBtn.addEventListener('click', stop);
    resetBtn.addEventListener('click', reset);

    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            stop();
            switchMode(btn.dataset.mode);
        });
    });

    minimizeBtn.addEventListener('click', () => {
        body.classList.toggle('collapsed');
        minimizeBtn.textContent = body.classList.contains('collapsed') ? '+' : '−';
    });

    // Handle manual input
    [workMinEl, workSecEl, breakMinEl, breakSecEl].forEach(input => {
        if (!input) return;
        input.addEventListener('change', (e) => {
            let val = parseInt(e.target.value) || 0;
            
            if (e.target.id === 'pomoWorkMin') {
                workMin = Math.max(0, Math.min(1440, val));
                e.target.value = workMin;
            } else if (e.target.id === 'pomoWorkSec') {
                workSec = Math.max(0, Math.min(59, val));
                e.target.value = workSec;
            } else if (e.target.id === 'pomoBreakMin') {
                breakMin = Math.max(0, Math.min(1440, val));
                e.target.value = breakMin;
            } else if (e.target.id === 'pomoBreakSec') {
                breakSec = Math.max(0, Math.min(59, val));
                e.target.value = breakSec;
            }

            if (!running) {
                // Determine if we need to update the display based on mode
                if ((mode === 'work' && e.target.id.includes('Work')) ||
                    (mode === 'break' && e.target.id.includes('Break'))) {
                    timeLeft = getDuration(mode);
                    updateDisplay();
                }
            }
        });
    });

    // ── Time Adjustment Buttons ──
    adjBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target; // 'work' or 'break'
            const dir = parseInt(btn.dataset.dir); // +1 or -1

            if (target === 'work') {
                workMin = Math.max(0, Math.min(1440, workMin + dir));
            } else {
                breakMin = Math.max(0, Math.min(1440, breakMin + dir));
            }

            updateAdjDisplay();

            // If not running and current mode matches, update timer
            if (!running && mode === target) {
                timeLeft = getDuration(mode);
                updateDisplay();
            }
        });
    });

    // ── Init ──
    updateAdjDisplay();
    updateDisplay();
})();
