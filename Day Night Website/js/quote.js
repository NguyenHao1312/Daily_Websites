/* =================================================
   Quote of the Day — API & Local Cache Engine
   Matches Day Night Cycle Design Mockup (Image 1)
   ================================================= */
(() => {
    'use strict';

    const CACHE_KEY = 'daynight_quote';
    const API_BASE = 'http://localhost:8000/api';
    const textEl = document.getElementById('quoteText');
    const authorEl = document.getElementById('quoteAuthor');

    if (!textEl || !authorEl) return;

    const FALLBACK_QUOTES = [
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
        { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
        { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
        { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
        { text: "Peace comes from within. Do not seek it without.", author: "Buddha" },
        { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" }
    ];

    function todayStr() {
        return new Date().toISOString().slice(0, 10);
    }

    function displayQuote(text, author) {
        textEl.textContent = `"${text}"`;
        authorEl.textContent = `— ${author}`;
    }

    function getCached() {
        try {
            const raw = localStorage.getItem(CACHE_KEY);
            if (raw) {
                const q = JSON.parse(raw);
                if (q.date === todayStr()) return q;
            }
        } catch(e) {}
        return null;
    }

    function cacheQuote(text, author) {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                text, author, date: todayStr()
            }));
        } catch(e) {}
    }

    async function fetchFromBackend() {
        try {
            const res = await fetch(`${API_BASE}/quote`, { signal: AbortSignal.timeout(1500) });
            if (res.ok) {
                const data = await res.json();
                if (data.text) return data;
            }
        } catch(e) {}
        return null;
    }

    async function loadQuote() {
        const cached = getCached();
        if (cached) {
            displayQuote(cached.text, cached.author);
            return;
        }

        let quote = await fetchFromBackend();

        if (!quote) {
            const idx = Math.floor(Math.random() * FALLBACK_QUOTES.length);
            quote = FALLBACK_QUOTES[idx];
        }

        displayQuote(quote.text, quote.author);
        cacheQuote(quote.text, quote.author);
    }

    loadQuote();
})();
