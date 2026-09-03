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
    const breakMinEl = document.getElementById('pomoBreakMin');

    if (!display) return;

    // Adjustable durations (in minutes)
    let workMin = 25;
    let breakMin = 5;

    function getDuration(m) { return m === 'work' ? workMin * 60 : breakMin * 60; }

    let mode = 'work';
    let timeLeft = getDuration(mode);
    let running = false;
    let intervalId = null;

    function formatTime(sec) {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
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
        if (workMinEl) workMinEl.textContent = workMin;
        if (breakMinEl) breakMinEl.textContent = breakMin;
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

    // ── Time Adjustment ──
    adjBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target; // 'work' or 'break'
            const dir = parseInt(btn.dataset.dir); // +1 or -1

            if (target === 'work') {
                workMin = Math.max(1, Math.min(120, workMin + dir * 5));
            } else {
                breakMin = Math.max(1, Math.min(60, breakMin + dir));
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
