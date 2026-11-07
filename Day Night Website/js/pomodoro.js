/* =================================================
   Pomodoro Timer — Mode Switching, Steppers & Controls
   Matches Day Night Cycle Design Mockup (Image 1)
   ================================================= */
(() => {
    'use strict';

    const widget = document.getElementById('pomodoroWidget');
    const display = document.getElementById('pomoDisplay');
    const subtitle = document.getElementById('pomoSubtitle');
    const playBtn = document.getElementById('pomoPlay');
    const pauseBtn = document.getElementById('pomoPause');
    const resetBtn = document.getElementById('pomoReset');
    const skipBtn = document.getElementById('pomoSkip');
    const minimizeBtn = document.getElementById('pomoMinimize');
    const miniTime = document.getElementById('pomoMiniTime');
    const miniPlay = document.getElementById('pomoMiniPlay');
    const body = document.getElementById('pomoBody');
    const modeBtns = document.querySelectorAll('.pomo-mode-btn');

    const workMinVal = document.getElementById('pomoWorkMinVal');
    const workSecVal = document.getElementById('pomoWorkSecVal');
    const workMinInput = document.getElementById('pomoWorkMin');
    const workSecInput = document.getElementById('pomoWorkSec');
    const breakMinInput = document.getElementById('pomoBreakMin');
    const breakSecInput = document.getElementById('pomoBreakSec');

    if (!display) return;

    let workMin = 25, workSec = 0;
    let breakMin = 5, breakSec = 0;

    let mode = 'work'; // 'work' or 'break'
    let running = false;
    let timerId = null;

    function getTargetDuration(m) {
        return m === 'work' ? (workMin * 60 + workSec) : (breakMin * 60 + breakSec);
    }

    let timeLeft = getTargetDuration(mode);

    function formatTime(sec) {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    function updateDisplay() {
        const formatted = formatTime(timeLeft);
        display.textContent = formatted;
        if (miniTime) miniTime.textContent = formatted;
        const lang = window.appLanguage || 'en';
        const labels = {
            en: { work: 'TIME TO FOCUS', break: 'TIME FOR A BREAK' },
            vi: { work: 'THỜI GIAN TẬP TRUNG', break: 'THỜI GIAN NGHỈ NGƠI' },
            th: { work: 'ถึงเวลาโฟกัส', break: 'ถึงเวลาพักสายตา' }
        };
        const dict = labels[lang] || labels.en;
        if (mode === 'work') {
            display.style.textShadow = '0 0 20px rgba(56, 189, 248, 0.45)';
            if (subtitle) subtitle.textContent = dict.work;
        } else {
            display.style.textShadow = '0 0 20px rgba(74, 222, 128, 0.45)';
            if (subtitle) subtitle.textContent = dict.break;
        }
    }

    function updateStepperDisplay() {
        if (mode === 'work') {
            if (workMinVal) workMinVal.textContent = `${String(workMin).padStart(2, '0')} m`;
            if (workSecVal) workSecVal.textContent = `${String(workSec).padStart(2, '0')} s`;
        } else {
            if (workMinVal) workMinVal.textContent = `${String(breakMin).padStart(2, '0')} m`;
            if (workSecVal) workSecVal.textContent = `${String(breakSec).padStart(2, '0')} s`;
        }
    }

    function tick() {
        if (timeLeft <= 0) {
            stop();
            // Switch mode automatically
            switchMode(mode === 'work' ? 'break' : 'work');
            try {
                // Subtle audio chime
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
                gain.gain.setValueAtTime(0.15, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
                osc.start();
                osc.stop(ctx.currentTime + 1.2);
            } catch(e) {}
            return;
        }
        timeLeft--;
        updateDisplay();
    }

    function start() {
        if (running) return;
        running = true;
        timerId = setInterval(tick, 1000);
        if (playBtn) playBtn.style.display = 'none';
        if (pauseBtn) pauseBtn.style.display = 'flex';
        if (miniPlay) miniPlay.textContent = '⏸';
    }

    function stop() {
        running = false;
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        }
        if (playBtn) playBtn.style.display = 'flex';
        if (pauseBtn) pauseBtn.style.display = 'none';
        if (miniPlay) miniPlay.textContent = '▶';
    }

    function reset() {
        stop();
        timeLeft = getTargetDuration(mode);
        updateDisplay();
    }

    function switchMode(newMode) {
        mode = newMode;
        timeLeft = getTargetDuration(mode);
        modeBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        updateDisplay();
        updateStepperDisplay();
    }

    // ── Mode Buttons ──
    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.dataset.mode !== mode) {
                stop();
                switchMode(btn.dataset.mode);
            }
        });
    });

    // ── Steppers ──
    document.querySelectorAll('.pomo-step-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target; // 'min' or 'sec'
            const dir = parseInt(btn.dataset.dir, 10); // 1 or -1

            if (mode === 'work') {
                if (target === 'min') {
                    workMin = Math.max(1, Math.min(120, workMin + dir));
                } else {
                    workSec = (workSec + dir * 15 + 60) % 60;
                }
            } else {
                if (target === 'min') {
                    breakMin = Math.max(1, Math.min(60, breakMin + dir));
                } else {
                    breakSec = (breakSec + dir * 15 + 60) % 60;
                }
            }

            if (!running) {
                timeLeft = getTargetDuration(mode);
                updateDisplay();
            }
            updateStepperDisplay();
        });
    });

    // ── Action Controls ──
    playBtn?.addEventListener('click', start);
    pauseBtn?.addEventListener('click', stop);
    resetBtn?.addEventListener('click', reset);
    skipBtn?.addEventListener('click', () => {
        stop();
        switchMode(mode === 'work' ? 'break' : 'work');
    });

    // ── Mini Play Toggle ──
    miniPlay?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (running) stop();
        else start();
    });

    // ── Minimize / Maximize ──
    minimizeBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!widget) return;
        const isMin = widget.classList.toggle('minimized');
        minimizeBtn.textContent = isMin ? '+' : '−';
        minimizeBtn.title = isMin ? 'Maximize Pomodoro' : 'Minimize Pomodoro';
    });

    // Initial render
    updateDisplay();
    updateStepperDisplay();

    // Listen to global language changes
    window.addEventListener('appLanguageChanged', () => {
        updateDisplay();
    });
})();
