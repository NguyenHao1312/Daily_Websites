/* =================================================
   Pomodoro Timer — Work/Break Cycles
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

    if (!display) return;

    const DURATIONS = { work: 25 * 60, break: 5 * 60 };
    let mode = 'work';
    let timeLeft = DURATIONS[mode];
    let running = false;
    let intervalId = null;

    function formatTime(sec) {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    function updateDisplay() {
        display.textContent = formatTime(timeLeft);
        // Glow color based on mode
        if (mode === 'work') {
            display.style.textShadow = '0 0 20px rgba(255,100,100,0.3)';
        } else {
            display.style.textShadow = '0 0 20px rgba(80,200,120,0.3)';
        }
    }

    function tick() {
        if (timeLeft <= 0) {
            stop();
            // Auto-switch mode
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
        timeLeft = DURATIONS[mode];
        updateDisplay();
    }

    function switchMode(newMode) {
        mode = newMode;
        timeLeft = DURATIONS[mode];
        modeBtns.forEach(b => {
            b.classList.toggle('active', b.dataset.mode === mode);
        });
        updateDisplay();
    }

    // Events
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

    // Init
    updateDisplay();
})();
