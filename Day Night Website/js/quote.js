/* =================================================
   Quote of the Day — API + localStorage Cache
   ================================================= */
(() => {
    'use strict';

    const CACHE_KEY = 'daynight_quote';
    const textEl = document.getElementById('quoteText');
    const authorEl = document.getElementById('quoteAuthor');

    if (!textEl) return;

    function todayStr() {
        return new Date().toISOString().slice(0, 10); // "2026-09-02"
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

    // API 1: ZenQuotes (most reliable, CORS-friendly)
    async function fetchZenQuotes() {
        const r = await fetch('https://zenquotes.io/api/random');
        const data = await r.json();
        if (data && data[0]) {
            return { text: data[0].q, author: data[0].a };
        }
        return null;
    }

    // API 2: Quotable API (backup)
    async function fetchQuotable() {
        const r = await fetch('https://api.quotable.io/random');
        const data = await r.json();
        if (data && data.content) {
            return { text: data.content, author: data.author };
        }
        return null;
    }

    // Fallback quotes (offline)
    const FALLBACK_QUOTES = [
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
        { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
        { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
        { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
        { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
        { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
        { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" }
    ];

    function getRandomFallback() {
        const idx = Math.floor(Math.random() * FALLBACK_QUOTES.length);
        return FALLBACK_QUOTES[idx];
    }

    async function loadQuote() {
        // Check cache first
        const cached = getCached();
        if (cached) {
            displayQuote(cached.text, cached.author);
            return;
        }

        // Try APIs
        let quote = null;
        try { quote = await fetchZenQuotes(); } catch(e) {}
        if (!quote) {
            try { quote = await fetchQuotable(); } catch(e) {}
        }

        // Use fallback if all APIs fail
        if (!quote) {
            quote = getRandomFallback();
        }

        displayQuote(quote.text, quote.author);
        cacheQuote(quote.text, quote.author);
    }

    loadQuote();
})();
