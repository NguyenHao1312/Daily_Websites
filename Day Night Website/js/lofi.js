/* =================================================
   Lofi / White Noise Player — HTML5 Audio Streams
   Works on file:// protocol (no YouTube API needed)
   ================================================= */
(() => {
    'use strict';

    const toggleBtn = document.getElementById('lofiToggle');
    const volumeSlider = document.getElementById('lofiVolume');
    const channelSelect = document.getElementById('lofiChannel');

    if (!toggleBtn) return;

    let audio = null;
    let isPlaying = false;

    function createAudio(src) {
        if (audio) {
            audio.pause();
            audio.removeAttribute('src');
            audio.load();
        }
        audio = new Audio();
        audio.crossOrigin = 'anonymous';
        audio.volume = parseInt(volumeSlider.value) / 100;
        audio.src = src;

        // Handle playback errors
        audio.addEventListener('error', () => {
            console.warn('Audio stream error, trying next source...');
            toggleBtn.textContent = '⚠';
            toggleBtn.classList.remove('playing');
            isPlaying = false;
            setTimeout(() => { toggleBtn.textContent = '▶'; }, 2000);
        });

        // Sync UI when audio actually starts playing
        audio.addEventListener('playing', () => {
            isPlaying = true;
            toggleBtn.textContent = '⏸';
            toggleBtn.classList.add('playing');
        });

        // Handle stream ending
        audio.addEventListener('pause', () => {
            if (!isPlaying) return; // Only update if user didn't pause
        });

        return audio;
    }

    function play() {
        try {
            if (!audio) {
                createAudio(channelSelect.value);
            }
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    isPlaying = true;
                    toggleBtn.textContent = '⏸';
                    toggleBtn.classList.add('playing');
                }).catch(err => {
                    console.warn('Audio play blocked:', err.message);
                    toggleBtn.textContent = '⚠';
                    setTimeout(() => { toggleBtn.textContent = '▶'; }, 2000);
                });
            }
        } catch(e) {
            console.warn('Audio play error:', e);
        }
    }

    function pause() {
        if (audio) {
            audio.pause();
        }
        isPlaying = false;
        toggleBtn.textContent = '▶';
        toggleBtn.classList.remove('playing');
    }

    // ── Events ──
    toggleBtn.addEventListener('click', () => {
        if (isPlaying) { pause(); } else { play(); }
    });

    volumeSlider.addEventListener('input', () => {
        if (audio) {
            audio.volume = parseInt(volumeSlider.value) / 100;
        }
    });

    channelSelect.addEventListener('change', () => {
        const wasPlaying = isPlaying;
        if (audio) { audio.pause(); }
        createAudio(channelSelect.value);
        if (wasPlaying) { play(); }
    });
})();
