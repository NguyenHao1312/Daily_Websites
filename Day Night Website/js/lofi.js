/* =================================================
   Lofi Radio — Local Music Player
   Plays MP3 files from assets/music/
   Auto-advances to next track when finished
   ================================================= */
(() => {
    'use strict';

    const toggleBtn = document.getElementById('lofiToggle');
    const prevBtn = document.getElementById('lofiPrev');
    const nextBtn = document.getElementById('lofiNext');
    const volumeSlider = document.getElementById('lofiVolume');
    const channelSelect = document.getElementById('lofiChannel');
    const trackNameEl = document.getElementById('lofiTrackName');

    if (!toggleBtn || !channelSelect) return;

    let audio = new Audio();
    let isPlaying = false;

    // ── Helpers ──
    function getTrackName(src) {
        // Extract filename without extension from path
        const parts = src.split('/');
        const filename = parts[parts.length - 1];
        return filename.replace('.mp3', '');
    }

    function updateTrackDisplay() {
        const name = getTrackName(channelSelect.value);
        if (trackNameEl) trackNameEl.textContent = name;
    }

    // ── Core Playback ──
    function loadTrack(src) {
        const wasPlaying = isPlaying;
        audio.pause();
        audio.src = src;
        audio.volume = parseInt(volumeSlider.value) / 100;
        audio.load();
        updateTrackDisplay();
        if (wasPlaying) play();
    }

    function play() {
        if (!audio.src) {
            loadTrack(channelSelect.value);
        }
        const p = audio.play();
        if (p !== undefined) {
            p.then(() => {
                isPlaying = true;
                toggleBtn.textContent = '⏸';
                toggleBtn.classList.add('playing');
            }).catch(err => {
                console.warn('Audio play error:', err.message);
            });
        }
    }

    function pause() {
        audio.pause();
        isPlaying = false;
        toggleBtn.textContent = '▶';
        toggleBtn.classList.remove('playing');
    }

    // ── Navigation ──
    function nextTrack() {
        const opts = channelSelect.options;
        let idx = channelSelect.selectedIndex + 1;
        if (idx >= opts.length) idx = 0; // Loop back to first
        channelSelect.selectedIndex = idx;
        loadTrack(channelSelect.value);
        if (!isPlaying) play(); // Auto-play on next
    }

    function prevTrack() {
        const opts = channelSelect.options;
        let idx = channelSelect.selectedIndex - 1;
        if (idx < 0) idx = opts.length - 1; // Loop to last
        channelSelect.selectedIndex = idx;
        loadTrack(channelSelect.value);
        if (!isPlaying) play(); // Auto-play on prev
    }

    // ── Events ──

    // Play/Pause toggle
    toggleBtn.addEventListener('click', () => {
        if (isPlaying) { pause(); } else { play(); }
    });

    // Previous track
    prevBtn.addEventListener('click', prevTrack);

    // Next track
    nextBtn.addEventListener('click', nextTrack);

    // Volume control
    volumeSlider.addEventListener('input', () => {
        audio.volume = parseInt(volumeSlider.value) / 100;
    });

    // Track selection from dropdown
    channelSelect.addEventListener('change', () => {
        loadTrack(channelSelect.value);
    });

    // Auto-play next track when current one ends
    audio.addEventListener('ended', () => {
        nextTrack();
    });

    // ── Init ──
    updateTrackDisplay();
})();
