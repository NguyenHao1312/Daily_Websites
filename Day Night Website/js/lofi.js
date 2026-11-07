/* =================================================
   Lofi Radio — Equalizer, Ambient Tags & Local Player
   Supports Full Mode & Minimized Rhythm Spectrum Mode
   Matches Day Night Cycle Design Mockup (Image 1)
   ================================================= */
(() => {
    'use strict';

    const widget = document.getElementById('lofiWidget');
    const toggleBtn = document.getElementById('lofiToggle');
    const playIcon = document.getElementById('lofiPlayIcon');
    const pauseIcon = document.getElementById('lofiPauseIcon');
    const prevBtn = document.getElementById('lofiPrev');
    const nextBtn = document.getElementById('lofiNext');
    const volumeSlider = document.getElementById('lofiVolume');
    const volPercent = document.getElementById('volPercent');
    const channelSelect = document.getElementById('lofiChannel');
    const trackNameEl = document.getElementById('lofiTrackName');
    const ambientTagEl = document.getElementById('lofiAmbientTag');
    const moodQuoteEl = document.getElementById('lofiMoodQuote');
    const equalizerEl = document.getElementById('lofiEqualizer');

    // Minimized Mode Elements
    const minimizeBtn = document.getElementById('lofiMinimizeBtn');
    const fullBody = document.getElementById('lofiFullBody');
    const miniBody = document.getElementById('lofiMiniBody');
    const miniSelect = document.getElementById('lofiMiniSelect');
    const miniPlayBtn = document.getElementById('lofiMiniPlayBtn');
    const visualizerEl = document.getElementById('lofiMiniVisualizer');

    if (!toggleBtn || !channelSelect) return;

    const audio = new Audio();
    let isPlaying = false;
    let isMinimized = false;
    let animFrame = null;

    // Load initial track metadata
    function updateTrackInfo() {
        const selectedOpt = channelSelect.options[channelSelect.selectedIndex];
        if (!selectedOpt) return;

        const fullText = selectedOpt.textContent || '';
        const ambient = selectedOpt.getAttribute('data-ambient') || 'Lofi';
        const quote = selectedOpt.getAttribute('data-quote') || 'A little sound. A little stillness.';

        if (trackNameEl) trackNameEl.textContent = fullText;
        if (ambientTagEl) ambientTagEl.textContent = ambient;
        if (moodQuoteEl) moodQuoteEl.textContent = quote;

        // Sync mini select
        if (miniSelect) miniSelect.value = channelSelect.value;
    }

    function setPlayingState(playing) {
        isPlaying = playing;
        if (widget) {
            widget.classList.toggle('playing', playing);
        }
        if (equalizerEl) {
            equalizerEl.classList.toggle('playing', playing);
        }
        if (playIcon && pauseIcon) {
            playIcon.style.display = playing ? 'none' : 'block';
            pauseIcon.style.display = playing ? 'block' : 'none';
        }
        if (miniPlayBtn) {
            miniPlayBtn.textContent = playing ? '⏸' : '▶';
        }

        if (playing) {
            startSpectrumAnimation();
        } else {
            stopSpectrumAnimation();
        }
    }

    // ── Rhythm spectrum bar dynamic visualizer ──
    const rhythmBars = visualizerEl ? visualizerEl.querySelectorAll('.rhythm-bar') : [];

    function startSpectrumAnimation() {
        if (animFrame) cancelAnimationFrame(animFrame);

        function animate() {
            if (!isPlaying) return;
            const t = Date.now() * 0.005;
            rhythmBars.forEach((bar, i) => {
                // Organic harmonic wave function with beat pulses
                const wave1 = Math.sin(t * 1.8 + i * 0.45);
                const wave2 = Math.cos(t * 2.6 - i * 0.3);
                const beat = Math.pow(Math.abs(Math.sin(t * 0.9)), 3);
                const heightPercent = Math.max(8, Math.min(100, (wave1 * 0.35 + wave2 * 0.25 + beat * 0.4 + 0.5) * 100));
                bar.style.height = `${heightPercent}%`;
            });
            animFrame = requestAnimationFrame(animate);
        }
        animFrame = requestAnimationFrame(animate);
    }

    function stopSpectrumAnimation() {
        if (animFrame) {
            cancelAnimationFrame(animFrame);
            animFrame = null;
        }
        // Soft resting state
        rhythmBars.forEach((bar, i) => {
            const rest = 6 + Math.sin(i * 0.5) * 3;
            bar.style.height = `${rest}px`;
        });
    }

    function loadTrack(src, autoPlay = true) {
        const wasPlaying = isPlaying || autoPlay;
        audio.pause();
        audio.src = src;
        audio.volume = parseInt(volumeSlider.value, 10) / 100;
        audio.load();
        updateTrackInfo();
        if (wasPlaying) {
            play();
        }
    }

    function play() {
        if (!audio.src) {
            audio.src = channelSelect.value;
        }
        const promise = audio.play();
        if (promise !== undefined) {
            promise.then(() => {
                setPlayingState(true);
            }).catch(() => {
                setPlayingState(false);
            });
        }
    }

    function pause() {
        audio.pause();
        setPlayingState(false);
    }

    function nextTrack() {
        let idx = channelSelect.selectedIndex + 1;
        if (idx >= channelSelect.options.length) idx = 0;
        channelSelect.selectedIndex = idx;
        loadTrack(channelSelect.value, true);
    }

    function prevTrack() {
        let idx = channelSelect.selectedIndex - 1;
        if (idx < 0) idx = channelSelect.options.length - 1;
        channelSelect.selectedIndex = idx;
        loadTrack(channelSelect.value, true);
    }

    // ── Minimize / Maximize Toggle ──
    function toggleMinimize() {
        isMinimized = !isMinimized;
        widget.classList.toggle('minimized', isMinimized);

        if (fullBody && miniBody) {
            fullBody.style.display = isMinimized ? 'none' : 'block';
            miniBody.style.display = isMinimized ? 'block' : 'none';
        }

        if (minimizeBtn) {
            minimizeBtn.textContent = isMinimized ? '+' : '−';
            minimizeBtn.title = isMinimized ? 'Maximize Lofi Radio' : 'Minimize Lofi Radio';
        }

        if (isMinimized && isPlaying) {
            startSpectrumAnimation();
        }
    }

    minimizeBtn?.addEventListener('click', toggleMinimize);

    // ── Events ──
    toggleBtn.addEventListener('click', () => {
        if (isPlaying) pause(); else play();
    });

    miniPlayBtn?.addEventListener('click', () => {
        if (isPlaying) pause(); else play();
    });

    prevBtn?.addEventListener('click', prevTrack);
    nextBtn?.addEventListener('click', nextTrack);

    channelSelect.addEventListener('change', () => {
        loadTrack(channelSelect.value, isPlaying);
    });

    miniSelect?.addEventListener('change', () => {
        channelSelect.value = miniSelect.value;
        loadTrack(miniSelect.value, isPlaying);
    });

    // Volume Slider & Percent Readout
    if (volumeSlider) {
        volumeSlider.addEventListener('input', () => {
            const val = volumeSlider.value;
            audio.volume = parseInt(val, 10) / 100;
            if (volPercent) volPercent.textContent = val;
        });
    }

    // Auto-advance track on finish
    audio.addEventListener('ended', nextTrack);

    // Initial setup
    updateTrackInfo();
    audio.src = channelSelect.value;
    audio.volume = parseInt(volumeSlider.value, 10) / 100;
    if (volPercent) volPercent.textContent = volumeSlider.value;
    stopSpectrumAnimation();
})();
