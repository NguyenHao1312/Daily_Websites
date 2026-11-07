/* =================================================
   Day & Night Cycle — Dynamic Aesthetics & Time Engine
   Enhanced for Night (Midnight Observatory), Dawn, Day, Noon, Dusk
   ================================================= */
(() => {
"use strict";

const root = document.documentElement;
const scene = document.getElementById('scene');
const sunW = document.getElementById('sunWrap'), moonW = document.getElementById('moonWrap');
const clockTime = document.getElementById('clockTime'), clockDate = document.getElementById('clockDate');
const greetEl = document.getElementById('greeting');
const seasonTint = document.getElementById('seasonTint');

/* ══════════════════════════════════════════
   SETTINGS & API / LOCAL STORAGE SYNC
   ══════════════════════════════════════════ */
const SETTINGS_KEY = 'daynight_settings';
const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8000/api'
    : '/api';

const DEFAULTS = {
    timezone: 'Asia/Ho_Chi_Minh',
    is12h: false,
    showFireflies: true,
    tempUnit: 'C',
    focusMode: false,
    theme: 'night', // 'night', 'dawn', 'day', 'noon', 'dusk', 'auto'
    language: 'en'
};
let settings = { ...DEFAULTS };

// Theme profiles
const THEMES = [
    { id: 'night', name: 'Midnight observatory', desc: 'Your evening escape', badge: 'Night', fixedH: 22.0 },
    { id: 'dawn', name: 'Misty Dawn', desc: 'Soft morning awakening', badge: 'Dawn', fixedH: 5.6 },
    { id: 'day', name: 'Clear Sky Morning', desc: 'Vibrant fresh daylight', badge: 'Day', fixedH: 9.5 },
    { id: 'noon', name: 'Golden Sun Noon', desc: 'Radiant midday focus', badge: 'Noon', fixedH: 12.0 },
    { id: 'dusk', name: 'Amber Twilight', desc: 'Warm sunset calm', badge: 'Dusk', fixedH: 18.5 },
    { id: 'auto', name: 'Auto Dynamic Cycle', desc: 'Flows with the 24h real clock', badge: 'Auto', fixedH: null }
];

function loadLocalSettings() {
    try {
        const raw = localStorage.getItem(SETTINGS_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            settings = { ...DEFAULTS, ...parsed };
        }
    } catch(e) {
        settings = { ...DEFAULTS };
    }
}

function saveLocalSettings() {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch(e) {}
}

async function syncWithBackend() {
    try {
        const res = await fetch(`${API_BASE}/preferences`, { signal: AbortSignal.timeout(1800) });
        if (res.ok) {
            const data = await res.json();
            settings.timezone = data.timezone || settings.timezone;
            settings.is12h = data.is12h ?? settings.is12h;
            settings.showFireflies = data.show_fireflies ?? settings.showFireflies;
            settings.tempUnit = data.temp_unit || settings.tempUnit;
            settings.focusMode = data.focus_mode ?? settings.focusMode;
            settings.theme = data.theme || settings.theme;
            settings.language = data.language || settings.language;
            saveLocalSettings();
            applySettingsToUI();
        }
    } catch(e) {
        // Backend offline, fallback smoothly to local storage
    }
}

let prefSaveDebounce = null;
function pushSettingsToBackend() {
    saveLocalSettings();
    clearTimeout(prefSaveDebounce);
    prefSaveDebounce = setTimeout(async () => {
        try {
            await fetch(`${API_BASE}/preferences`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    timezone: settings.timezone,
                    is12h: settings.is12h,
                    show_fireflies: settings.showFireflies,
                    temp_unit: settings.tempUnit,
                    focus_mode: settings.focusMode,
                    theme: settings.theme,
                    language: settings.language
                })
            });
        } catch(e) {}
    }, 400);
}

/* ── TIMEZONE DIRECTORY ── */
const TIMEZONES = [
    { id: 'Asia/Ho_Chi_Minh', label: 'Asia/Ho_Chi_Minh', city: 'Ha Noi', country: 'VN', gmt: '+7', offset: 7, lat: 21.0285, lon: 105.8542 },
    { id: 'Asia/Bangkok', label: 'Asia/Bangkok', city: 'Bangkok', country: 'TH', gmt: '+7', offset: 7, lat: 13.7563, lon: 100.5018 },
    { id: 'Asia/Tokyo', label: 'Asia/Tokyo', city: 'Tokyo', country: 'JP', gmt: '+9', offset: 9, lat: 35.6762, lon: 139.6503 },
    { id: 'Asia/Seoul', label: 'Asia/Seoul', city: 'Seoul', country: 'KR', gmt: '+9', offset: 9, lat: 37.5665, lon: 126.9780 },
    { id: 'Asia/Singapore', label: 'Asia/Singapore', city: 'Singapore', country: 'SG', gmt: '+8', offset: 8, lat: 1.3521, lon: 103.8198 },
    { id: 'Europe/London', label: 'Europe/London', city: 'London', country: 'UK', gmt: '+0', offset: 0, lat: 51.5074, lon: -0.1278 },
    { id: 'Europe/Paris', label: 'Europe/Paris', city: 'Paris', country: 'FR', gmt: '+1', offset: 1, lat: 48.8566, lon: 2.3522 },
    { id: 'America/New_York', label: 'America/New_York', city: 'New York', country: 'US', gmt: '-5', offset: -5, lat: 40.7128, lon: -74.0060 },
    { id: 'America/Los_Angeles', label: 'America/Los_Angeles', city: 'Los Angeles', country: 'US', gmt: '-8', offset: -8, lat: 34.0522, lon: -118.2437 },
    { id: 'Australia/Sydney', label: 'Australia/Sydney', city: 'Sydney', country: 'AU', gmt: '+11', offset: 11, lat: -33.8688, lon: 151.2093 }
];

let currentTimezoneObj = TIMEZONES[0];
let currentOffset = currentTimezoneObj.offset;
let currentSeason = '';
let weatherLat = currentTimezoneObj.lat, weatherLon = currentTimezoneObj.lon;
let lastWeatherFetch = 0;
let cachedTempC = 28;

/* ── MOUSE TRACKING (Firefly attraction) ── */
let mouseX = -1, mouseY = -1, mouseActive = false;
document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; mouseActive = true; });
document.addEventListener('mouseleave', () => { mouseActive = false; });
document.addEventListener('touchmove', e => {
    const t = e.touches[0];
    if (t) { mouseX = t.clientX; mouseY = t.clientY; mouseActive = true; }
}, { passive: true });
document.addEventListener('touchend', () => { mouseActive = false; });

/* ══════════════════════════════════════════
   SEASONAL LOGIC
   ══════════════════════════════════════════ */
function getSeason(month) {
    if (month >= 2 && month <= 4) return 'Spring';
    if (month >= 5 && month <= 7) return 'Summer';
    if (month >= 8 && month <= 10) return 'Autumn';
    return 'Winter';
}

function getSeasonColors(season) {
    if (season === 'Spring') return ['#4CAF50', '#81C784', '#A5D6A7'];
    if (season === 'Summer') return ['#D4E157', '#FFEE58', '#FFCA28'];
    if (season === 'Autumn') return ['#FF9800', '#F57C00', '#E65100', '#8D6E63'];
    if (season === 'Winter') return ['#FFFFFF', '#E0F7FA', '#F1F8E9'];
    return ['#FFFFFF'];
}

const sCvs2 = document.getElementById('seasonCanvas'), sCtx2 = sCvs2.getContext('2d');
let seasonParts = [];

function initSeasonParticles(season) {
    sCvs2.width = sCvs2.offsetWidth * devicePixelRatio;
    sCvs2.height = sCvs2.offsetHeight * devicePixelRatio;
    sCtx2.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    seasonParts = [];
    const colors = getSeasonColors(season);
    const count = season === 'Winter' ? 80 : 45;
    for (let i = 0; i < count; i++) {
        seasonParts.push({
            x: Math.random() * sCvs2.offsetWidth,
            y: Math.random() * sCvs2.offsetHeight,
            vx: (Math.random() - 0.5) * 1.8,
            vy: 0.5 + Math.random() * 2.2,
            size: season === 'Winter' ? (1.5 + Math.random() * 2) : (2 + Math.random() * 3),
            angle: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 0.08,
            swayOffset: Math.random() * Math.PI * 2,
            swaySpeed: 0.0006 + Math.random() * 0.002,
            swayAmp: 0.3 + Math.random() * 1.4,
            c: colors[Math.floor(Math.random() * colors.length)]
        });
    }
}

function drawSeasonParticles(t, dayFade) {
    const w = sCvs2.offsetWidth, h = sCvs2.offsetHeight;
    sCtx2.clearRect(0, 0, w, h);
    if (dayFade < 0.02) return;
    sCtx2.globalAlpha = Math.min(1, dayFade * 2);
    seasonParts.forEach(p => {
        p.y += p.vy;
        p.x += Math.sin(t * p.swaySpeed + p.swayOffset) * p.swayAmp + p.vx;
        p.angle += p.spin + Math.cos(t * p.swaySpeed + p.swayOffset) * 0.03;
        if (p.y > h + 30) { p.y = -30; p.x = Math.random() * w; }
        if (p.x > w + 30) p.x = -30;
        if (p.x < -30) p.x = w + 30;
        sCtx2.save();
        sCtx2.translate(p.x, p.y);
        sCtx2.rotate(p.angle);
        if (currentSeason === 'Winter') {
            sCtx2.beginPath(); sCtx2.arc(0, 0, p.size * 0.7, 0, Math.PI * 2);
            sCtx2.fillStyle = p.c; sCtx2.fill();
        } else {
            sCtx2.scale(p.size * 0.2, p.size * 0.2);
            sCtx2.beginPath();
            sCtx2.moveTo(0, 15);
            sCtx2.bezierCurveTo(-15, 5, -10, -10, 0, -15);
            sCtx2.bezierCurveTo(10, -10, 15, 5, 0, 15);
            sCtx2.fillStyle = p.c; sCtx2.fill();
            sCtx2.beginPath();
            sCtx2.moveTo(0, 15); sCtx2.lineTo(0, -12);
            sCtx2.moveTo(0, 7);  sCtx2.lineTo(-6, 1);
            sCtx2.moveTo(0, 6);  sCtx2.lineTo(6, 0);
            sCtx2.strokeStyle = 'rgba(0,0,0,0.2)'; sCtx2.lineWidth = 1; sCtx2.stroke();
        }
        sCtx2.restore();
    });
}

/* ══════════════════════════════════════════
   WEATHER WIDGET (Open-Meteo & SVG Icons)
   ══════════════════════════════════════════ */
const weatherIconWrap = document.getElementById('weatherIconWrap');
const weatherTemp = document.getElementById('weatherTemp');
const weatherDesc = document.getElementById('weatherDesc');
const weatherCity = document.getElementById('weatherCity');

function getSvgIcon(code, isDay) {
    if (code === 0) {
        if (isDay) {
            // Sun icon
            return `<svg class="weather-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
            </svg>`;
        }
        // Clear Moon icon
        return `<svg class="weather-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>`;
    }
    if (code <= 3) {
        // Cloud icon
        return `<svg class="weather-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
        </svg>`;
    }
    if (code <= 67 || (code >= 80 && code <= 82)) {
        // Rain icon
        return `<svg class="weather-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <line x1="16" y1="13" x2="16" y2="21"></line>
            <line x1="8" y1="13" x2="8" y2="21"></line>
            <line x1="12" y1="15" x2="12" y2="23"></line>
            <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path>
        </svg>`;
    }
    if (code <= 77 || code >= 85) {
        // Snow / snowflake
        return `<svg class="weather-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <line x1="12" y1="2" x2="12" y2="22"></line>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
            <line x1="19.07" y1="4.93" x2="4.93" y2="19.07"></line>
        </svg>`;
    }
    return `<svg class="weather-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <circle cx="12" cy="12" r="4"></circle>
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2"></path>
    </svg>`;
}

function wmoDesc(code) {
    if (code === 0) return 'Clear Sky';
    if (code === 1) return 'Mainly Clear';
    if (code === 2) return 'Partly Cloudy';
    if (code === 3) return 'Overcast';
    if (code <= 48) return 'Foggy';
    if (code <= 57) return 'Drizzle';
    if (code <= 67) return 'Rain';
    if (code <= 77) return 'Snow';
    if (code <= 82) return 'Rain Showers';
    if (code <= 86) return 'Snow Showers';
    if (code <= 99) return 'Thunderstorm';
    return 'Clear Sky';
}

function updateTempDisplay(tempC) {
    cachedTempC = tempC;
    if (settings.tempUnit === 'F') {
        const tempF = Math.round((tempC * 9/5) + 32);
        weatherTemp.textContent = `${tempF}°F`;
    } else {
        weatherTemp.textContent = `${Math.round(tempC)}°C`;
    }
}

async function fetchWeather(lat, lon) {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.current) {
            const tempC = data.current.temperature_2m;
            const code = data.current.weather_code;
            const isDay = data.current.is_day === 1;
            updateTempDisplay(tempC);
            weatherDesc.textContent = wmoDesc(code);
            weatherIconWrap.innerHTML = getSvgIcon(code, isDay);
            weatherCity.textContent = `${currentTimezoneObj.city}, ${currentTimezoneObj.country}`;
        }
    } catch(e) {
        // Offline default fallback
        updateTempDisplay(28);
        weatherDesc.textContent = 'Clear Sky';
        weatherIconWrap.innerHTML = getSvgIcon(0, false);
        weatherCity.textContent = `${currentTimezoneObj.city}, ${currentTimezoneObj.country}`;
    }
}

/* ══════════════════════════════════════════
   COLOR PALETTE FOR 24H CYCLE
   ══════════════════════════════════════════ */
const P = [
    // Midnight (0h / 24h)
    {h:0, skyT:[11,9,40], skyM:[22,17,66], skyB:[38,26,98], rad:'radial-gradient(ellipse at 50% 90%,rgba(65,45,135,.42) 0%,transparent 68%)', haze:'rgba(60,38,120,.08)', l1:[[71,43,132], [50,28,100]], l2:[[57,32,111], [40,20,84]], l3:[[44,22,90], [28,13,64]], l4:[[30,14,65], [19,8,46]], l5:[[19,7,45], [10,4,27]], gnd:[7,3,20], star:1, rayC:'rgba(100,80,180,0)', rayOp:0, hor:[75,48,130], horOp:.2, tP:[255,255,255], tS:[215,228,255,.72], glow:[56,189,248,.65], greet:'GOOD NIGHT'},
    // Pre-Dawn (4.5h)
    {h:4.5, skyT:[28,20,70], skyM:[65,40,95], skyB:[115,65,115], rad:'radial-gradient(ellipse at 50% 95%,rgba(160,90,110,.25) 0%,transparent 60%)', haze:'rgba(100,50,80,.06)', l1:[[105,65,115], [52,32,78]], l2:[[85,50,95], [42,26,65]], l3:[[65,38,75], [32,20,50]], l4:[[48,28,58], [22,14,38]], l5:[[32,18,42], [15,10,26]], gnd:[15,10,26], star:.35, rayC:'rgba(200,120,80,.08)', rayOp:.2, hor:[160,80,105], horOp:.35, tP:[235,230,248], tS:[195,190,225,.75], glow:[168,140,220,.2], greet:'EARLY MORNING'},
    // Dawn / Golden Sunrise (5.8h)
    {h:5.8, skyT:[90,145,215], skyM:[195,145,145], skyB:[255,185,115], rad:'radial-gradient(ellipse at 50% 90%,rgba(255,180,90,.38) 0%,transparent 55%)', haze:'rgba(255,190,130,.08)', l1:[[245,190,150], [150,115,95]], l2:[[200,150,125], [115,90,80]], l3:[[150,115,95], [80,70,68]], l4:[[105,80,72], [52,52,52]], l5:[[68,52,48], [35,38,40]], gnd:[35,38,40], star:0, rayC:'rgba(255,200,100,.25)', rayOp:.65, hor:[255,170,75], horOp:.75, tP:[240,245,255], tS:[205,215,240,.8], glow:[255,190,100,.35], greet:'GOOD MORNING'},
    // Morning (8h)
    {h:8, skyT:[55,160,240], skyM:[110,195,248], skyB:[175,225,250], rad:'radial-gradient(ellipse at 50% 80%,rgba(190,225,255,.22) 0%,transparent 60%)', haze:'rgba(160,200,240,.04)', l1:[[230,240,255], [95,160,185]], l2:[[200,225,245], [70,138,160]], l3:[[160,200,235], [50,112,135]], l4:[[115,168,200], [36,90,110]], l5:[[75,132,155], [25,65,80]], gnd:[28,70,85], star:0, rayC:'rgba(255,240,180,.05)', rayOp:.1, hor:[170,212,250], horOp:.1, tP:[245,250,255], tS:[210,225,250,.85], glow:[100,180,255,.3], greet:'GOOD MORNING'},
    // Noon (12h)
    {h:12, skyT:[18,130,230], skyM:[50,168,245], skyB:[105,198,250], rad:'radial-gradient(ellipse at 50% 20%,rgba(255,250,210,.18) 0%,transparent 50%)', haze:'rgba(140,195,248,.03)', l1:[[245,250,255], [75,150,188]], l2:[[210,232,250], [50,128,162]], l3:[[170,208,240], [32,102,138]], l4:[[122,168,205], [20,80,108]], l5:[[75,128,158], [14,60,85]], gnd:[14,60,85], star:0, rayC:'rgba(255,245,190,.12)', rayOp:.2, hor:[135,195,245], horOp:.05, tP:[250,252,255], tS:[220,235,255,.85], glow:[56,189,248,.35], greet:'GOOD AFTERNOON'},
    // Afternoon (15h)
    {h:15, skyT:[35,145,235], skyM:[75,178,248], skyB:[130,205,250], rad:'radial-gradient(ellipse at 50% 60%,rgba(215,225,255,.12) 0%,transparent 55%)', haze:'rgba(160,205,245,.03)', l1:[[242,245,255], [85,155,182]], l2:[[208,228,245], [60,132,158]], l3:[[168,202,235], [42,108,132]], l4:[[118,162,198], [28,85,105]], l5:[[70,122,152], [18,65,80]], gnd:[18,65,80], star:0, rayC:'rgba(255,240,180,.05)', rayOp:.1, hor:[148,200,245], horOp:.06, tP:[248,250,255], tS:[215,230,250,.85], glow:[56,189,248,.3], greet:'GOOD AFTERNOON'},
    // Late Afternoon (17h)
    {h:17, skyT:[68,135,208], skyM:[148,165,200], skyB:[215,188,158], rad:'radial-gradient(ellipse at 50% 85%,rgba(255,190,120,.24) 0%,transparent 55%)', haze:'rgba(230,190,150,.05)', l1:[[245,220,190], [128,128,142]], l2:[[220,195,170], [98,102,118]], l3:[[185,165,145], [70,78,92]], l4:[[138,128,118], [46,55,70]], l5:[[90,95,90], [32,42,50]], gnd:[32,42,50], star:0, rayC:'rgba(255,190,90,.15)', rayOp:.3, hor:[235,172,110], horOp:.32, tP:[245,248,255], tS:[210,225,245,.8], glow:[255,175,100,.3], greet:'GOOD AFTERNOON'},
    // Sunset / Dusk (18.5h)
    {h:18.5, skyT:[115,48,138], skyM:[198,75,95], skyB:[248,138,62], rad:'radial-gradient(ellipse at 50% 92%,rgba(255,140,45,.45) 0%,transparent 50%)', haze:'rgba(255,130,75,.08)', l1:[[245,150,105], [150,70,80]], l2:[[210,112,90], [108,46,70]], l3:[[170,80,70], [70,32,60]], l4:[[112,50,52], [42,18,46]], l5:[[70,28,38], [22,10,32]], gnd:[22,10,32], star:0, rayC:'rgba(255,150,55,.3)', rayOp:.85, hor:[248,108,38], horOp:.9, tP:[255,240,230], tS:[230,215,215,.85], glow:[255,165,80,.4], greet:'GOOD EVENING'},
    // Twilight (20h)
    {h:20, skyT:[22,22,68], skyM:[65,40,78], skyB:[145,70,52], rad:'radial-gradient(ellipse at 50% 95%,rgba(165,70,35,.28) 0%,transparent 55%)', haze:'rgba(90,45,55,.05)', l1:[[128,80,110], [58,35,68]], l2:[[100,62,90], [40,26,55]], l3:[[76,48,72], [26,18,42]], l4:[[54,35,58], [18,12,32]], l5:[[35,22,40], [10,8,22]], gnd:[10,8,22], star:.3, rayC:'rgba(165,70,25,.08)', rayOp:.3, hor:[165,70,35], horOp:.45, tP:[235,230,245], tS:[195,190,220,.8], glow:[210,150,130,.25], greet:'GOOD EVENING'},
    // Night (21.8h / 22h - Matches Screenshot)
    {h:21.8, skyT:[11,9,40], skyM:[22,17,66], skyB:[38,26,98], rad:'radial-gradient(ellipse at 50% 90%,rgba(65,45,135,.42) 0%,transparent 68%)', haze:'rgba(60,38,120,.08)', l1:[[71,43,132], [50,28,100]], l2:[[57,32,111], [40,20,84]], l3:[[44,22,90], [28,13,64]], l4:[[30,14,65], [19,8,46]], l5:[[19,7,45], [10,4,27]], gnd:[7,3,20], star:1, rayC:'rgba(85,65,145,0)', rayOp:0, hor:[75,48,130], horOp:.2, tP:[255,255,255], tS:[215,228,255,.72], glow:[56,189,248,.65], greet:'GOOD EVENING'},
    // Cycle End (24h)
    {h:24, skyT:[11,9,40], skyM:[22,17,66], skyB:[38,26,98], rad:'radial-gradient(ellipse at 50% 90%,rgba(65,45,135,.42) 0%,transparent 68%)', haze:'rgba(60,38,120,.08)', l1:[[71,43,132], [50,28,100]], l2:[[57,32,111], [40,20,84]], l3:[[44,22,90], [28,13,64]], l4:[[30,14,65], [19,8,46]], l5:[[19,7,45], [10,4,27]], gnd:[7,3,20], star:1, rayC:'rgba(100,80,180,0)', rayOp:0, hor:[75,48,130], horOp:.2, tP:[255,255,255], tS:[215,228,255,.72], glow:[56,189,248,.65], greet:'GOOD NIGHT'}
];

const lerp = (a, b, t) => a + (b - a) * t;
const lerpA = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));
const lerpA2 = (a, b, t) => [lerpA(a[0], b[0], t), lerpA(a[1], b[1], t)];
const rgb = a => `rgb(${a[0]|0},${a[1]|0},${a[2]|0})`;

function getC(hf) {
    let p = P[0], n = P[P.length - 1];
    for (let i = 0; i < P.length - 1; i++) {
        if (hf >= P[i].h && hf < P[i+1].h) {
            p = P[i];
            n = P[i+1];
            break;
        }
    }
    const t = (hf - p.h) / (n.h - p.h);
    const pick = (a, b) => t < 0.5 ? a : b;
    return {
        skyT: lerpA(p.skyT, n.skyT, t), skyM: lerpA(p.skyM, n.skyM, t), skyB: lerpA(p.skyB, n.skyB, t),
        rad: pick(p.rad, n.rad), haze: pick(p.haze, n.haze),
        l1: lerpA2(p.l1, n.l1, t), l2: lerpA2(p.l2, n.l2, t), l3: lerpA2(p.l3, n.l3, t), 
        l4: lerpA2(p.l4, n.l4, t), l5: lerpA2(p.l5, n.l5, t), gnd: lerpA(p.gnd, n.gnd, t),
        star: lerp(p.star, n.star, t), rayC: pick(p.rayC, n.rayC), rayOp: lerp(p.rayOp, n.rayOp, t),
        hor: lerpA(p.hor, n.hor, t), horOp: lerp(p.horOp, n.horOp, t),
        tP: lerpA(p.tP, n.tP, t), tS: lerpA(p.tS, n.tS, t), glow: lerpA(p.glow, n.glow, t),
        greet: pick(p.greet, n.greet)
    };
}

/* ── Stars Canvas ── */
const sCvs = document.getElementById('starsCanvas'), sCtx = sCvs.getContext('2d');
let stars = [];
function initStars() {
    sCvs.width = sCvs.offsetWidth * devicePixelRatio;
    sCvs.height = sCvs.offsetHeight * devicePixelRatio;
    sCtx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    stars = [];
    const n = Math.min(320, (sCvs.offsetWidth * sCvs.offsetHeight / 2500) | 0);
    for (let i = 0; i < n; i++) {
        stars.push({
            x: Math.random() * sCvs.offsetWidth,
            y: Math.random() * sCvs.offsetHeight,
            r: 0.4 + Math.random() * 1.8,
            ph: Math.random() * Math.PI * 2,
            sp: 0.4 + Math.random() * 2
        });
    }
}
function drawStars(t) {
    const w = sCvs.offsetWidth, h = sCvs.offsetHeight;
    sCtx.clearRect(0, 0, w, h);
    for (const s of stars) {
        const tw = 0.5 + 0.5 * Math.sin(t * 0.001 * s.sp + s.ph);
        const a = 0.25 + 0.75 * tw;
        sCtx.beginPath();
        sCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        sCtx.fillStyle = `rgba(255,255,255,${a})`;
        sCtx.fill();
        if (s.r > 1.3) {
            sCtx.beginPath();
            sCtx.arc(s.x, s.y, s.r * 2.8, 0, Math.PI * 2);
            sCtx.fillStyle = `rgba(210,230,255,${a * 0.15})`;
            sCtx.fill();
        }
    }
}

/* ── Fireflies Particles Canvas ── */
const pCvs = document.getElementById('particlesCanvas'), pCtx = pCvs.getContext('2d');
let parts = [];
function initParts() {
    pCvs.width = pCvs.offsetWidth * devicePixelRatio;
    pCvs.height = pCvs.offsetHeight * devicePixelRatio;
    pCtx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    parts = [];
    for (let i = 0; i < 50; i++) {
        parts.push({
            x: Math.random() * pCvs.offsetWidth,
            y: Math.random() * pCvs.offsetHeight,
            vx: 0, vy: 0,
            bx: (Math.random() - 0.5) * 0.4,
            by: (Math.random() - 0.5) * 0.3,
            r: 1.2 + Math.random() * 1.8,
            ph: Math.random() * Math.PI * 2,
            orbit: Math.random() * Math.PI * 2,
            orbitSpeed: 0.02 + Math.random() * 0.05
        });
    }
}

function drawParts(t, sOp) {
    const w = pCvs.offsetWidth, h = pCvs.offsetHeight;
    pCtx.clearRect(0, 0, w, h);
    if (!settings.showFireflies) return;
    const isN = sOp > 0.3, bOp = isN ? Math.min(1, sOp) : 0.15;
    if (!isN && sOp < 0.05) return;

    for (const p of parts) {
        let tx = p.bx, ty = p.by;
        if (isN && mouseActive && mouseX > 0) {
            const dx = mouseX - p.x, dy = mouseY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 350) {
                const pull = (1 - dist / 350) * 0.5;
                tx += dx * 0.005 * pull;
                ty += dy * 0.005 * pull;
                if (dist < 120) {
                    p.orbit += p.orbitSpeed;
                    tx += Math.cos(p.orbit) * 1.5;
                    ty += Math.sin(p.orbit) * 1.5;
                }
            }
        }
        p.vx += (tx - p.vx) * 0.05;
        p.vy += (ty - p.vy) * 0.05;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        const gl = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * 0.0018 + p.ph));
        const a = gl * bOp;
        if (isN) {
            const g = pCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 8);
            g.addColorStop(0, `rgba(56, 189, 248, ${a * 0.5})`);
            g.addColorStop(0.5, `rgba(180, 255, 120, ${a * 0.25})`);
            g.addColorStop(1, 'rgba(56, 189, 248, 0)');
            pCtx.fillStyle = g;
            pCtx.fillRect(p.x - p.r * 8, p.y - p.r * 8, p.r * 16, p.r * 16);
            pCtx.beginPath();
            pCtx.arc(p.x, p.y, p.r * 0.75, 0, Math.PI * 2);
            pCtx.fillStyle = `rgba(220, 255, 200, ${a})`;
            pCtx.fill();
        } else {
            pCtx.beginPath();
            pCtx.arc(p.x, p.y, p.r * 0.5, 0, Math.PI * 2);
            pCtx.fillStyle = `rgba(255, 255, 255, ${a * 0.3})`;
            pCtx.fill();
        }
    }
}

let lastSh = 0;
function maybeShoot(t, sOp) {
    if (sOp < 0.3) return;
    if (t - lastSh < 5000 + Math.random() * 9000) return;
    lastSh = t;
    const el = document.createElement('div');
    el.className = 'shooting-star';
    el.style.top = (Math.random() * 32) + '%';
    el.style.left = (35 + Math.random() * 50) + '%';
    document.getElementById('shootingStars').appendChild(el);
    setTimeout(() => el.remove(), 1100);
}

/* ── Celestial Positioning ── */
function posCel(hf) {
    const vw = innerWidth, vh = innerHeight;
    const isMobile = vw <= 480;
    const isTablet = vw <= 768;
    const gY = isMobile ? vh * 0.48 : (isTablet ? vh * 0.52 : vh * 0.6);
    const r = isMobile ? Math.min(vw * 0.42, vh * 0.35) : (isTablet ? Math.min(vw * 0.42, vh * 0.40) : Math.min(vw * 0.44, vh * 0.48));
    const cx = vw / 2, cy = gY;
    const sunOff = isMobile ? 35 : 65;
    const moonOff = isMobile ? 35 : 60;

    // Sun movement
    if (hf >= 5.5 && hf <= 18.5) {
        const p = (hf - 5.5) / 13, a = Math.PI * (1 - p);
        sunW.style.left = (cx + r * Math.cos(a) - sunOff) + 'px';
        sunW.style.top = (cy - r * Math.sin(a) - sunOff) + 'px';
        sunW.style.opacity = '1';
        sunW.style.transform = `scale(${0.65 + 0.35 * Math.sin(p * Math.PI)})`;
    } else {
        sunW.style.opacity = '0';
    }

    // Moon movement (or static iconic placement in Night theme)
    let mp;
    if (hf >= 18) mp = (hf - 18) / 12;
    else if (hf <= 6) mp = (hf + 6) / 12;
    else mp = -1;

    if (mp >= 0 && mp <= 1) {
        const a = Math.PI * (1 - mp);
        // Position moon gracefully in the upper right sky quadrant
        moonW.style.left = (cx + r * Math.cos(a) - moonOff) + 'px';
        moonW.style.top = (cy - r * Math.sin(a) - moonOff) + 'px';
        moonW.style.opacity = '1';
        moonW.style.transform = `scale(${0.7 + 0.3 * Math.sin(mp * Math.PI)})`;
    } else {
        moonW.style.opacity = '0';
    }
}

/* ══════════════════════════════════════════
   TIMEZONE & SETTINGS UI WIRING
   ══════════════════════════════════════════ */
const setTimezoneSelect = document.getElementById('setTimezone');
const gmtSelect = document.getElementById('gmtSelect');
const tzPillBtn = document.getElementById('tzPillBtn');
const tzPillText = document.getElementById('tzPillText');
const tzSubCaption = document.getElementById('tzSubCaption');

const seg12h = document.getElementById('seg12h');
const seg24h = document.getElementById('seg24h');

const themeCardSelector = document.getElementById('themeCardSelector');
const themeCardName = document.getElementById('themeCardName');
const themeCardDesc = document.getElementById('themeCardDesc');
const themeCardBadge = document.getElementById('themeCardBadge');

function initTimezoneUI() {
    if (setTimezoneSelect) {
        setTimezoneSelect.innerHTML = '';
        TIMEZONES.forEach(tz => {
            const opt = document.createElement('option');
            opt.value = tz.id;
            opt.textContent = `${tz.city} (${tz.label}, GMT${tz.gmt})`;
            setTimezoneSelect.appendChild(opt);
        });

        setTimezoneSelect.value = settings.timezone || 'Asia/Ho_Chi_Minh';
        applyTimezoneSelection(setTimezoneSelect.value);

        setTimezoneSelect.addEventListener('change', () => {
            applyTimezoneSelection(setTimezoneSelect.value);
            pushSettingsToBackend();
        });
    }

    if (tzPillBtn) {
        tzPillBtn.addEventListener('click', () => {
            // Open settings drawer with smooth focus on timezone
            const settingsDrawer = document.getElementById('settingsDrawer');
            const settingsOverlay = document.getElementById('settingsOverlay');
            if (settingsDrawer && settingsOverlay) {
                settingsDrawer.classList.add('open');
                settingsOverlay.classList.add('open');
                if (setTimezoneSelect) setTimezoneSelect.focus();
            }
        });
    }
}

function applyTimezoneSelection(tzId) {
    const found = TIMEZONES.find(t => t.id === tzId);
    if (found) {
        currentTimezoneObj = found;
        currentOffset = found.offset;
        settings.timezone = found.id;
        weatherLat = found.lat;
        weatherLon = found.lon;

        if (tzPillText) tzPillText.textContent = `${found.city}, GMT${found.gmt}`;
        if (tzSubCaption) tzSubCaption.textContent = `${found.city}, ${found.country === 'VN' ? 'Viet Nam' : found.country} • GMT${found.gmt}`;
        if (weatherCity) weatherCity.textContent = `${found.city}, ${found.country}`;

        fetchWeather(weatherLat, weatherLon);
    }
}

/* ══════════════════════════════════════════
   MULTILINGUAL I18N SYSTEM (EN, VI, TH)
   ══════════════════════════════════════════ */
const I18N = {
    en: {
        locale: 'en-US',
        brandSubtitle: 'YOUR QUIET SPACE',
        lblMakeSpace: 'MAKE SPACE',
        lblYourTodo: 'Your To-Do',
        lblTodoSub: "One thing at a time. You've got this.",
        todoPlaceholder: "What's on your mind?",
        lblTodaysWins: "Today's little wins",
        lblUpNext: 'UP NEXT',
        lblCompleted: 'COMPLETED',
        lblTodoFooter: 'Your tasks stay in this quiet little space.',
        lblMakeItYours: 'MAKE IT YOURS',
        lblSettingsTitle: 'Settings',
        lblSettingsSub: 'Small details. Your kind of calm.',
        lblLanguageGroup: 'LANGUAGE / NGÔN NGỮ',
        lblLanguageTitle: 'Interface Language',
        lblLanguageDesc: 'Instantly adapts all text across the space.',
        lblAtmosphereGroup: 'ATMOSPHERE',
        lblFireflies: 'Fireflies',
        lblFirefliesDesc: 'A little light in the landscape.',
        lblClockWeatherGroup: 'CLOCK & WEATHER',
        lblTemperature: 'Temperature',
        lblTemperatureDesc: 'Choose how the weather feels.',
        lblTimeFormat: 'Time format',
        lblTimeFormatDesc: 'A familiar rhythm for your day.',
        lblTimezone: 'Regional timezone',
        lblTimezoneDesc: 'Keep your clock close to home.',
        lblSettingsFooter: 'Your preferences are saved, quietly.',
        exitFocusText: 'Exit focus',
        pomoTitle: 'Pomodoro',
        pomoModeWork: 'Work',
        pomoModeBreak: 'Break',
        lofiTitle: 'Lofi Radio',
        greetings: {
            'GOOD NIGHT': 'GOOD NIGHT',
            'EARLY MORNING': 'EARLY MORNING',
            'GOOD MORNING': 'GOOD MORNING',
            'GOOD AFTERNOON': 'GOOD AFTERNOON',
            'GOOD EVENING': 'GOOD EVENING'
        },
        themeDesc: {
            night: { name: 'Midnight observatory', desc: 'Your evening escape' },
            dawn: { name: 'Misty Dawn', desc: 'Soft morning awakening' },
            day: { name: 'Clear Sky Morning', desc: 'Vibrant fresh daylight' },
            noon: { name: 'Golden Sun Noon', desc: 'Radiant midday focus' },
            dusk: { name: 'Amber Twilight', desc: 'Warm sunset calm' },
            auto: { name: 'Auto Dynamic Cycle', desc: 'Flows with the 24h real clock' }
        }
    },
    vi: {
        locale: 'vi-VN',
        brandSubtitle: 'KHÔNG GIAN YÊN TĨNH CỦA BẠN',
        lblMakeSpace: 'TẠO KHÔNG GIAN',
        lblYourTodo: 'Việc Cần Làm',
        lblTodoSub: 'Từng việc một thôi. Bạn làm được mà.',
        todoPlaceholder: 'Bạn đang nghĩ gì thế?',
        lblTodaysWins: 'Thành tựu nhỏ hôm nay',
        lblUpNext: 'TIẾP THEO',
        lblCompleted: 'ĐÃ HOÀN THÀNH',
        lblTodoFooter: 'Nhiệm vụ của bạn được lưu an toàn tại đây.',
        lblMakeItYours: 'TÙY BIẾN THEO Ý BẠN',
        lblSettingsTitle: 'Cài Đặt',
        lblSettingsSub: 'Từng chi tiết nhỏ. Bình yên theo cách bạn muốn.',
        lblLanguageGroup: 'NGÔN NGỮ / LANGUAGE',
        lblLanguageTitle: 'Ngôn ngữ giao diện',
        lblLanguageDesc: 'Thay đổi tức thì toàn bộ văn bản trong ứng dụng.',
        lblAtmosphereGroup: 'KHÔNG KHÍ KHÔNG GIAN',
        lblFireflies: 'Đom đóm',
        lblFirefliesDesc: 'Những đốm sáng lung linh trong cảnh đêm.',
        lblClockWeatherGroup: 'ĐỒNG HỒ & THỜI TIẾT',
        lblTemperature: 'Nhiệt độ',
        lblTemperatureDesc: 'Chọn thang đo nhiệt độ phù hợp.',
        lblTimeFormat: 'Định dạng giờ',
        lblTimeFormatDesc: 'Nhịp thời gian quen thuộc cho ngày của bạn.',
        lblTimezone: 'Múi giờ khu vực',
        lblTimezoneDesc: 'Giữ đồng hồ chuẩn xác theo vị trí của bạn.',
        lblSettingsFooter: 'Tùy chọn của bạn được lưu tự động, êm đềm.',
        exitFocusText: 'Thoát tập trung',
        pomoTitle: 'Pomodoro',
        pomoModeWork: 'Làm việc',
        pomoModeBreak: 'Nghỉ ngơi',
        lofiTitle: 'Đài Lofi',
        greetings: {
            'GOOD NIGHT': 'CHÚC NGỦ NGON',
            'EARLY MORNING': 'SÁNG SỚM TINH MƠ',
            'GOOD MORNING': 'CHÀO BUỔI SÁNG',
            'GOOD AFTERNOON': 'CHÀO BUỔI TRƯA',
            'GOOD EVENING': 'CHÀO BUỔI TỐI'
        },
        themeDesc: {
            night: { name: 'Đài thiên văn nửa đêm', desc: 'Không gian tĩnh lặng buổi tối' },
            dawn: { name: 'Bình minh sương mai', desc: 'Đánh thức buổi sáng êm đềm' },
            day: { name: 'Nắng sớm trong trẻo', desc: 'Năng lượng ban ngày tươi sáng' },
            noon: { name: 'Trưa nắng vàng rực', desc: 'Tập trung cao độ giữa ngày' },
            dusk: { name: 'Hoàng hôn hổ phách', desc: 'Phút thư thái lúc chiều tà' },
            auto: { name: 'Chu kỳ 24h tự nhiên', desc: 'Chuyển động nhịp nhàng theo thời gian thực' }
        }
    },
    th: {
        locale: 'th-TH',
        brandSubtitle: 'พื้นที่เงียบสงบของคุณ',
        lblMakeSpace: 'สร้างพื้นที่',
        lblYourTodo: 'รายการสิ่งที่ต้องทำ',
        lblTodoSub: 'ทีละขั้นตอน คุณทำได้แน่นอน',
        todoPlaceholder: 'คุณกำลังคิดอะไรอยู่?',
        lblTodaysWins: 'ความสำเร็จเล็กๆ วันนี้',
        lblUpNext: 'ถัดไป',
        lblCompleted: 'เสร็จสิ้นแล้ว',
        lblTodoFooter: 'งานของคุณจะถูกเก็บไว้อย่างปลอดภัยที่นี่',
        lblMakeItYours: 'ปรับแต่งตามใจคุณ',
        lblSettingsTitle: 'การตั้งค่า',
        lblSettingsSub: 'ทุกรายละเอียดเล็กๆ เพื่อความสงบของคุณ',
        lblLanguageGroup: 'ภาษา / LANGUAGE',
        lblLanguageTitle: 'ภาษาของอินเทอร์เฟซ',
        lblLanguageDesc: 'ปรับเปลี่ยนข้อความทั้งหมดในทันที',
        lblAtmosphereGroup: 'บรรยากาศ',
        lblFireflies: 'หิ่งห้อย',
        lblFirefliesDesc: 'แสงระยิบระยับในทิวทัศน์ยามค่ำคืน',
        lblClockWeatherGroup: 'นาฬิกาและสภาพอากาศ',
        lblTemperature: 'อุณหภูมิ',
        lblTemperatureDesc: 'เลือกหน่วยวัดอุณหภูมิที่คุณต้องการ',
        lblTimeFormat: 'รูปแบบเวลา',
        lblTimeFormatDesc: 'จังหวะเวลาที่คุณคุ้นเคย',
        lblTimezone: 'เขตเวลาภูมิภาค',
        lblTimezoneDesc: 'ตั้งนาฬิกาให้ตรงกับที่ที่คุณอยู่',
        lblSettingsFooter: 'การตั้งค่าของคุณถูกบันทึกไว้อย่างเงียบสงบ',
        exitFocusText: 'ออกจากโหมดโฟกัส',
        pomoTitle: 'โพโมโดโร',
        pomoModeWork: 'ทำงาน',
        pomoModeBreak: 'พักผ่อน',
        lofiTitle: 'วิทยุโลไฟ',
        greetings: {
            'GOOD NIGHT': 'ราตรีสวัสดิ์',
            'EARLY MORNING': 'เช้าตรู่',
            'GOOD MORNING': 'สวัสดีตอนเช้า',
            'GOOD AFTERNOON': 'สวัสดีตอนบ่าย',
            'GOOD EVENING': 'สวัสดีตอนเย็น'
        },
        themeDesc: {
            night: { name: 'หอดูดาวเที่ยงคืน', desc: 'พื้นที่พักผ่อนยามค่ำคืนของคุณ' },
            dawn: { name: 'รุ่งอรุณเคล้าหมอก', desc: 'การเริ่มต้นวันใหม่อันอ่อนโยน' },
            day: { name: 'ท้องฟ้าสดใสยามเช้า', desc: 'แสงสว่างยามกลางวันที่สดใส' },
            noon: { name: 'แสงทองยามเที่ยงวัน', desc: 'โฟกัสอย่างเต็มที่ในตอนเที่ยง' },
            dusk: { name: 'สายัณห์สีอำพัน', desc: 'ความสงบยามพระอาทิตย์ตกดิน' },
            auto: { name: 'หมุนเวียนอัตโนมัติตามเวลาจริง', desc: 'ลื่นไหลตามเวลาจริงตลอด 24 ชั่วโมง' }
        }
    }
};

function applyLanguage(lang) {
    const safeLang = (lang === 'vi' || lang === 'th') ? lang : 'en';
    settings.language = safeLang;
    window.appLanguage = safeLang;
    const dict = I18N[safeLang] || I18N.en;

    const setText = (id, val) => {
        const el = document.getElementById(id);
        if (el && val !== undefined) el.textContent = val;
    };

    setText('brandSubtitle', dict.brandSubtitle);
    setText('lblMakeSpace', dict.lblMakeSpace);
    setText('lblYourTodo', dict.lblYourTodo);
    setText('lblTodoSub', dict.lblTodoSub);
    setText('lblTodaysWins', dict.lblTodaysWins);
    setText('lblUpNext', dict.lblUpNext);
    setText('lblCompleted', dict.lblCompleted);
    setText('lblTodoFooter', dict.lblTodoFooter);

    setText('lblMakeItYours', dict.lblMakeItYours);
    setText('lblSettingsTitle', dict.lblSettingsTitle);
    setText('lblSettingsSub', dict.lblSettingsSub);
    setText('lblLanguageGroup', dict.lblLanguageGroup);
    setText('lblLanguageTitle', dict.lblLanguageTitle);
    setText('lblLanguageDesc', dict.lblLanguageDesc);
    setText('lblAtmosphereGroup', dict.lblAtmosphereGroup);
    setText('lblFireflies', dict.lblFireflies);
    setText('lblFirefliesDesc', dict.lblFirefliesDesc);
    setText('lblClockWeatherGroup', dict.lblClockWeatherGroup);
    setText('lblTemperature', dict.lblTemperature);
    setText('lblTemperatureDesc', dict.lblTemperatureDesc);
    setText('lblTimeFormat', dict.lblTimeFormat);
    setText('lblTimeFormatDesc', dict.lblTimeFormatDesc);
    setText('lblTimezone', dict.lblTimezone);
    setText('lblTimezoneDesc', dict.lblTimezoneDesc);
    setText('lblSettingsFooter', dict.lblSettingsFooter);

    setText('exitFocusText', dict.exitFocusText);
    setText('pomoTitle', dict.pomoTitle);
    setText('pomoModeWork', dict.pomoModeWork);
    setText('pomoModeBreak', dict.pomoModeBreak);
    setText('lofiTitle', dict.lofiTitle);

    const todoInp = document.getElementById('todoInput');
    if (todoInp && dict.todoPlaceholder) {
        todoInp.placeholder = dict.todoPlaceholder;
    }

    updateThemeUI();

    window.dispatchEvent(new CustomEvent('appLanguageChanged', { detail: { lang: safeLang, dict } }));
}

function updateThemeUI() {
    const safeLang = settings.language || 'en';
    const dict = I18N[safeLang] || I18N.en;
    const themeInfo = dict.themeDesc?.[settings.theme];
    const defaultT = THEMES.find(t => t.id === settings.theme) || THEMES[0];

    if (themeCardName) themeCardName.textContent = themeInfo ? themeInfo.name : defaultT.name;
    if (themeCardDesc) themeCardDesc.textContent = themeInfo ? themeInfo.desc : defaultT.desc;
    if (themeCardBadge) themeCardBadge.textContent = defaultT.badge;
}

function cycleTheme() {
    const idx = THEMES.findIndex(t => t.id === settings.theme);
    const nextIdx = (idx + 1) % THEMES.length;
    settings.theme = THEMES[nextIdx].id;
    updateThemeUI();
    pushSettingsToBackend();
}

function applySettingsToUI() {
    // 1. Time format pills
    if (settings.is12h) {
        seg12h?.classList.add('active');
        seg24h?.classList.remove('active');
    } else {
        seg24h?.classList.add('active');
        seg12h?.classList.remove('active');
    }

    // 2. Settings radios
    document.querySelectorAll('input[name="timeFormat"]').forEach(r => {
        r.checked = (r.value === '12') === settings.is12h;
    });
    document.querySelectorAll('input[name="tempUnit"]').forEach(r => {
        r.checked = (r.value === settings.tempUnit);
    });

    // Language radios
    document.querySelectorAll('input[name="appLang"]').forEach(r => {
        r.checked = (r.value === (settings.language || 'en'));
    });

    // 3. Fireflies checkbox
    const setFireflies = document.getElementById('setFireflies');
    if (setFireflies) setFireflies.checked = settings.showFireflies;

    // 4. Timezone
    if (setTimezoneSelect) setTimezoneSelect.value = settings.timezone;
    applyTimezoneSelection(settings.timezone);

    // 5. Language & Theme card
    applyLanguage(settings.language || 'en');
    updateThemeUI();
    updateTempDisplay(cachedTempC);
}

function initSettingsListeners() {
    // 12H / 24H segmented pills
    seg12h?.addEventListener('click', () => {
        settings.is12h = true;
        applySettingsToUI();
        pushSettingsToBackend();
    });
    seg24h?.addEventListener('click', () => {
        settings.is12h = false;
        applySettingsToUI();
        pushSettingsToBackend();
    });

    // Drawer settings radios
    document.querySelectorAll('input[name="timeFormat"]').forEach(r => {
        r.addEventListener('change', () => {
            settings.is12h = (r.value === '12');
            applySettingsToUI();
            pushSettingsToBackend();
        });
    });

    document.querySelectorAll('input[name="tempUnit"]').forEach(r => {
        r.addEventListener('change', () => {
            settings.tempUnit = r.value;
            applySettingsToUI();
            pushSettingsToBackend();
        });
    });

    // Language radio change listeners
    document.querySelectorAll('input[name="appLang"]').forEach(r => {
        r.addEventListener('change', () => {
            if (r.checked) {
                applyLanguage(r.value);
                pushSettingsToBackend();
            }
        });
    });

    // Fireflies toggle
    const setFireflies = document.getElementById('setFireflies');
    setFireflies?.addEventListener('change', () => {
        settings.showFireflies = setFireflies.checked;
        pushSettingsToBackend();
    });

    // Theme selector click to cycle
    themeCardSelector?.addEventListener('click', cycleTheme);

    // Settings drawer open/close
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsOverlay = document.getElementById('settingsOverlay');
    const settingsDrawer = document.getElementById('settingsDrawer');
    const settingsClose = document.getElementById('settingsClose');

    const openSettings = () => {
        settingsDrawer?.classList.add('open');
        settingsOverlay?.classList.add('open');
    };
    const closeSettings = () => {
        settingsDrawer?.classList.remove('open');
        settingsOverlay?.classList.remove('open');
    };

    settingsBtn?.addEventListener('click', openSettings);
    settingsOverlay?.addEventListener('click', closeSettings);
    settingsClose?.addEventListener('click', closeSettings);
}

/* ══════════════════════════════════════════
   50 FAMOUS POEMS & 5-MIN CYCLING ENGINE
   ══════════════════════════════════════════ */
const POEMS_50 = [
    { text: "Shall I compare thee to a summer's day? Thou art more lovely and more temperate.", author: "William Shakespeare" },
    { text: "Two roads diverged in a wood, and I— I took the one less traveled by, and that has made all the difference.", author: "Robert Frost" },
    { text: "Hope is the thing with feathers that perches in the soul and sings the tune without the words.", author: "Emily Dickinson" },
    { text: "You may write me down in history with your bitter, twisted lies, but still, like dust, I'll rise.", author: "Maya Angelou" },
    { text: "Clouds come floating into my life, no longer to carry rain or usher storm, but to add color to my sunset sky.", author: "Rabindranath Tagore" },
    { text: "A thing of beauty is a joy for ever: Its loveliness increases; it will never pass into nothingness.", author: "John Keats" },
    { text: "I celebrate myself, and sing myself, and what I assume you shall assume.", author: "Walt Whitman" },
    { text: "Let everything happen to you: beauty and terror. Just keep going. No feeling is final.", author: "Rainer Maria Rilke" },
    { text: "Out beyond ideas of wrongdoing and rightdoing there is a field. I'll meet you there.", author: "Rumi" },
    { text: "Out of suffering have emerged the strongest souls; the most massive characters are seared with scars.", author: "Kahlil Gibran" },
    { text: "If Winter comes, can Spring be far behind?", author: "Percy Bysshe Shelley" },
    { text: "She walks in beauty, like the night of cloudless climes and starry skies.", author: "Lord Byron" },
    { text: "I wandered lonely as a cloud that floats on high o'er vales and hills.", author: "William Wordsworth" },
    { text: "All that we see or seem is but a dream within a dream.", author: "Edgar Allan Poe" },
    { text: "Do not wait to strike till the iron is hot; but make it hot by striking.", author: "W. B. Yeats" },
    { text: "Hold fast to dreams, for if dreams die, life is a broken-winged bird that cannot fly.", author: "Langston Hughes" },
    { text: "Tell me, what is it you plan to do with your one wild and precious life?", author: "Mary Oliver" },
    { text: "I love you without knowing how, or when, or from where. I love you simply, without problems or pride.", author: "Pablo Neruda" },
    { text: "Only those who will risk going too far can possibly find out how far one can go.", author: "T. S. Eliot" },
    { text: "The old pond; a frog leaps into the water, a sound of water.", author: "Matsuo Basho" },
    { text: "Even the darkest night will end and the sun will rise.", author: "Victor Hugo" },
    { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", author: "Ralph Waldo Emerson" },
    { text: "Go confidently in the direction of your dreams. Live the life you have imagined.", author: "Henry David Thoreau" },
    { text: "Do not go gentle into that good night. Rage, rage against the dying of the light.", author: "Dylan Thomas" },
    { text: "How do I love thee? Let me count the ways. I love thee to the depth and breadth and height my soul can reach.", author: "Elizabeth Barrett Browning" },
    { text: "Be always drunken. With wine, with poetry, or with virtue, as you will. But be drunken.", author: "Charles Baudelaire" },
    { text: "To see a World in a Grain of Sand and a Heaven in a Wild Flower, hold Infinity in the palm of your hand.", author: "William Blake" },
    { text: "We are all in the gutter, but some of us are looking at the stars.", author: "Oscar Wilde" },
    { text: "Whatever you can do, or dream you can, begin it. Boldness has genius, power, and magic in it.", author: "Johann Wolfgang von Goethe" },
    { text: "The love that moves the sun and the other stars.", author: "Dante Alighieri" },
    { text: "The wound is the place where the Light enters you.", author: "Jalal al-Din Rumi" },
    { text: "Lives of great men all remind us we can make our lives sublime, and departing leave footprints on sands of time.", author: "Henry Wadsworth Longfellow" },
    { text: "To strive, to seek, to find, and not to yield.", author: "Alfred Lord Tennyson" },
    { text: "Remember me when I am gone away, gone far away into the silent land.", author: "Christina Rossetti" },
    { text: "Wandering between two worlds, one dead, the other powerless to be born.", author: "Matthew Arnold" },
    { text: "Grow old along with me! The best is yet to be.", author: "Robert Browning" },
    { text: "Whatever our souls are made of, his and mine are the same.", author: "Emily Brontë" },
    { text: "The mind is its own place, and in itself can make a heaven of hell, a hell of heaven.", author: "John Milton" },
    { text: "A thousand dreams within me softly burn.", author: "Arthur Rimbaud" },
    { text: "The green is longing to be green; the wind is longing to be wind.", author: "Federico García Lorca" },
    { text: "Tears fall in my heart like the rain on the town.", author: "Paul Verlaine" },
    { text: "I loved you: and the feeling, why should it be hidden?", author: "Alexander Pushkin" },
    { text: "There is a time for many words, and there is also a time for sleep.", author: "Homer" },
    { text: "Dwell on the beauty of life. Watch the stars, and see yourself running with them.", author: "Marcus Aurelius" },
    { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
    { text: "A Book of Verses underneath the Bough, a Jug of Wine, a Loaf of Bread—and Thou.", author: "Omar Khayyam" },
    { text: "I am a part of all that I have met.", author: "Lord Tennyson" },
    { text: "I carry your heart with me (I carry it in my heart).", author: "E. E. Cummings" },
    { text: "I took a deep breath and listened to the old brag of my heart: I am, I am, I am.", author: "Sylvia Plath" },
    { text: "Beauty is not in the face; beauty is a light in the heart.", author: "Kahlil Gibran" }
];

let poemIndex = 0;
let poemDisappearTimer = null;
let poemReappearTimer = null;
const poemBar = document.getElementById('topPoemBar');
const poemText = document.getElementById('topPoemText');
const poemAuthor = document.getElementById('topPoemAuthor');

const POEM_VISIBLE_MS = 30 * 1000;       // 30 seconds visible if not clicked
const POEM_COOLDOWN_MS = 5 * 60 * 1000;  // 5 minutes sleep before next appearance

function setPoemDisplay(idx) {
    poemIndex = (idx + POEMS_50.length) % POEMS_50.length;
    const p = POEMS_50[poemIndex];
    if (poemText) poemText.textContent = `"${p.text}"`;
    if (poemAuthor) poemAuthor.textContent = `— ${p.author}`;
}

function hidePoemAndSchedule() {
    if (!poemBar) return;
    clearTimeout(poemDisappearTimer);
    clearTimeout(poemReappearTimer);

    // Fade out smoothly
    poemBar.classList.add('fading-out');

    // Wait 5 minutes, then show next poem
    poemReappearTimer = setTimeout(() => {
        showNextPoem();
    }, POEM_COOLDOWN_MS);
}

function showNextPoem() {
    if (!poemBar) return;
    clearTimeout(poemDisappearTimer);
    clearTimeout(poemReappearTimer);

    // Pick next poem from collection
    setPoemDisplay(poemIndex + 1);

    // Fade in smoothly
    poemBar.classList.remove('fading-out');

    // If user doesn't click, automatically disappear after 30 seconds
    poemDisappearTimer = setTimeout(() => {
        hidePoemAndSchedule();
    }, POEM_VISIBLE_MS);
}

function initPoemBar() {
    if (!poemBar) return;
    setPoemDisplay(0);
    poemBar.classList.remove('fading-out');

    // Initial appearance: automatically disappear after 30s if not clicked
    poemDisappearTimer = setTimeout(() => {
        hidePoemAndSchedule();
    }, POEM_VISIBLE_MS);

    // If clicked, immediately turn off and schedule reappear in 5 minutes
    poemBar.addEventListener('click', (e) => {
        e.stopPropagation();
        hidePoemAndSchedule();
    });
}

function fitClockTime() {
    if (!clockTime) return;
    clockTime.style.fontSize = '';
    const container = document.getElementById('clockPanel');
    const maxAllowed = container ? (container.clientWidth - 56) : clockTime.clientWidth;
    const contentWidth = clockTime.scrollWidth;
    if (maxAllowed > 0 && contentWidth > maxAllowed) {
        const scale = maxAllowed / contentWidth;
        const currentPx = parseFloat(window.getComputedStyle(clockTime).fontSize);
        clockTime.style.fontSize = Math.floor(currentPx * scale * 0.98) + 'px';
    }
}

/* ══════════════════════════════════════════
   MAIN ANIMATION LOOP
   ══════════════════════════════════════════ */
function update(ts) {
    const d = new Date();
    const utcTime = d.getTime() + (d.getTimezoneOffset() * 60000);
    const targetDate = new Date(utcTime + (3600000 * currentOffset));

    const season = getSeason(targetDate.getMonth());
    if (currentSeason !== season) {
        currentSeason = season;
        initSeasonParticles(season);
    }

    // Determine visual hour of day based on theme setting
    let visualHour;
    const currentT = THEMES.find(t => t.id === settings.theme) || THEMES[0];
    if (currentT.fixedH !== null) {
        visualHour = currentT.fixedH;
    } else {
        visualHour = targetDate.getHours() + targetDate.getMinutes() / 60 + targetDate.getSeconds() / 3600;
    }

    const c = getC(visualHour);
    const dayFade = Math.max(0, Math.min(1, 1 - Math.abs(visualHour - 12) / 5.5));

    // Seasonal tint
    let tintC = 'transparent', tintO = 0;
    if (currentSeason === 'Autumn') { tintC = '#FFB300'; tintO = 0.15; }
    if (currentSeason === 'Winter') { tintC = '#FFFFFF'; tintO = 0.2; }
    seasonTint.style.background = tintC;
    seasonTint.style.opacity = tintO * dayFade;

    // Winter snow peaks
    if (currentSeason === 'Winter') {
        const blendS = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
        const snowDay = [240, 248, 255], snowNight = [40, 50, 80];
        const snowC = blendS(snowNight, snowDay, dayFade);
        c.l1[0] = blendS(c.l1[0], snowC, 0.85);
        c.l2[0] = blendS(c.l2[0], snowC, 0.88);
        c.l3[0] = blendS(c.l3[0], snowC, 0.91);
        c.l4[0] = blendS(c.l4[0], snowC, 0.94);
        c.l5[0] = blendS(c.l5[0], snowC, 0.98);
    }

    // Apply colors to scene & CSS variables
    scene.style.background = `linear-gradient(180deg, ${rgb(c.skyT)} 0%, ${rgb(c.skyM)} 48%, ${rgb(c.skyB)} 100%)`;
    document.getElementById('skyRadial').style.background = c.rad;
    document.getElementById('skyHaze').style.background = c.haze;

    const s = root.style;
    s.setProperty('--star-opacity', c.star);
    s.setProperty('--ray-color', c.rayC);
    s.setProperty('--ray-opacity', c.rayOp);
    s.setProperty('--horizon-color', rgb(c.hor));
    s.setProperty('--horizon-opacity', c.horOp);
    s.setProperty('--l1-peak', rgb(c.l1[0])); s.setProperty('--l1-body', rgb(c.l1[1]));
    s.setProperty('--l2-peak', rgb(c.l2[0])); s.setProperty('--l2-body', rgb(c.l2[1]));
    s.setProperty('--l3-peak', rgb(c.l3[0])); s.setProperty('--l3-body', rgb(c.l3[1]));
    s.setProperty('--l4-peak', rgb(c.l4[0])); s.setProperty('--l4-body', rgb(c.l4[1]));
    s.setProperty('--l5-peak', rgb(c.l5[0])); s.setProperty('--l5-body', rgb(c.l5[1]));
    s.setProperty('--gnd-color', rgb(c.gnd));

    // Update Celestial objects
    posCel(visualHour);

    // Format digital clock string
    const hours24 = targetDate.getHours();
    const mm = String(targetDate.getMinutes()).padStart(2, '0');
    const ss = String(targetDate.getSeconds()).padStart(2, '0');

    if (settings.is12h) {
        const period = hours24 >= 12 ? 'PM' : 'AM';
        const h12 = hours24 % 12 || 12;
        clockTime.innerHTML = `${String(h12).padStart(2, '0')}:${mm}:${ss}<span class="clock-period">${period}</span>`;
    } else {
        clockTime.innerHTML = `${String(hours24).padStart(2, '0')}:${mm}:${ss}`;
    }
    fitClockTime();

    // Format date string (e.g. "Thursday, Nov 6, 2026")
    const dateLocales = { en: 'en-US', vi: 'vi-VN', th: 'th-TH' };
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    clockDate.textContent = targetDate.toLocaleDateString(dateLocales[settings.language] || 'en-US', dateOptions);

    const curDict = I18N[settings.language] || I18N.en;
    greetEl.textContent = curDict.greetings?.[c.greet] || c.greet;

    // Draw particle canvases
    drawStars(ts);
    drawParts(ts, c.star);
    maybeShoot(ts, c.star);
    drawSeasonParticles(ts, dayFade);

    // Auto-remove any injected Netlify badge/drawer
    const clearNetlifyInjections = () => {
        document.querySelectorAll('#netlify-drawer, #netlify-drawer-iframe, netlify-drawer, .netlify-badge, [data-netlify-drawer]').forEach(el => el.remove());
    };
    clearNetlifyInjections();
    if (window.MutationObserver) {
        new MutationObserver(clearNetlifyInjections).observe(document.body, { childList: true, subtree: true });
    }

    requestAnimationFrame(update);
}

/* ══════════════════════════════════════════
   INITIALIZATION
   ══════════════════════════════════════════ */
async function init() {
    loadLocalSettings();
    initTimezoneUI();
    initSettingsListeners();
    applySettingsToUI();
    initPoemBar();

    initStars();
    initParts();

    window.addEventListener('resize', () => {
        initStars();
        initParts();
        if (currentSeason) initSeasonParticles(currentSeason);
        fitClockTime();
    });

    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            initStars();
            initParts();
            if (currentSeason) initSeasonParticles(currentSeason);
            fitClockTime();
        }, 120);
    });

    // Start background sync with backend
    syncWithBackend();

    // Fetch initial weather
    fetchWeather(weatherLat, weatherLon);
    setInterval(() => fetchWeather(weatherLat, weatherLon), 15 * 60 * 1000);

    // Auto-remove any injected Netlify badge/drawer
    const clearNetlifyInjections = () => {
        document.querySelectorAll('#netlify-drawer, #netlify-drawer-iframe, netlify-drawer, .netlify-badge, [data-netlify-drawer]').forEach(el => el.remove());
    };
    clearNetlifyInjections();
    if (window.MutationObserver) {
        new MutationObserver(clearNetlifyInjections).observe(document.body, { childList: true, subtree: true });
    }

    requestAnimationFrame(update);
}

init();

})();
