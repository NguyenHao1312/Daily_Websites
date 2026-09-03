/* =================================================
   Day & Night Cycle — Weather, Settings & Seasons
   ================================================= */
(() => {
"use strict";

const root = document.documentElement;
const scene = document.getElementById('scene');
const sunW = document.getElementById('sunWrap'), moonW = document.getElementById('moonWrap');
const clockTime = document.getElementById('clockTime'), clockDate = document.getElementById('clockDate');
const greetEl = document.getElementById('greeting');
const locText = document.getElementById('locText'), gmtSelect = document.getElementById('gmtSelect');
const seasonTint = document.getElementById('seasonTint');

/* ══════════════════════════════════════════
   MODULE 3: SETTINGS & LOCAL STORAGE
   ══════════════════════════════════════════ */
const SETTINGS_KEY = 'daynight_settings';
const DEFAULTS = { timezone: null, is12h: false, showFireflies: true, tempUnit: 'C', focusMode: false };
let settings = { ...DEFAULTS };

function loadSettings() {
    try {
        const raw = localStorage.getItem(SETTINGS_KEY);
        if (raw) { const parsed = JSON.parse(raw); settings = { ...DEFAULTS, ...parsed }; }
    } catch(e) { settings = { ...DEFAULTS }; }
}

function saveSettings() {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch(e) {}
}

/* ── STATE ── */
let currentOffset = -(new Date().getTimezoneOffset() / 60);
let currentSeason = '';
let weatherLat = null, weatherLon = null;
let lastWeatherFetch = 0;

/* ── MOUSE TRACKING (for firefly attraction) ── */
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
    const count = season === 'Winter' ? 90 : 55;
    for (let i = 0; i < count; i++) {
        seasonParts.push({
            x: Math.random() * sCvs2.offsetWidth,
            y: Math.random() * sCvs2.offsetHeight,
            vx: (Math.random() - 0.5) * 2,
            vy: 0.5 + Math.random() * 2.5,
            size: season === 'Winter' ? (1.5 + Math.random() * 2) : (2 + Math.random() * 3),
            angle: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 0.1,
            swayOffset: Math.random() * Math.PI * 2,
            swaySpeed: 0.0005 + Math.random() * 0.002,
            swayAmp: 0.2 + Math.random() * 1.5,
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
            sCtx2.moveTo(0, -1); sCtx2.lineTo(-5, -6);
            sCtx2.moveTo(0, -2); sCtx2.lineTo(5, -7);
            sCtx2.moveTo(0, 15); sCtx2.lineTo(0, 19);
            sCtx2.strokeStyle = 'rgba(0,0,0,0.2)'; sCtx2.lineWidth = 1; sCtx2.stroke();
        }
        sCtx2.restore();
    });
}

/* ══════════════════════════════════════════
   MODULE 1: WEATHER WIDGET (Open-Meteo API)
   ══════════════════════════════════════════ */
const weatherIcon = document.getElementById('weatherIcon');
const weatherTemp = document.getElementById('weatherTemp');
const weatherDesc = document.getElementById('weatherDesc');
const weatherCity = document.getElementById('weatherCity');

// WMO Weather Code → Emoji + Description
function wmoToWeather(code, isDay) {
    if (code === 0) return { icon: isDay ? '☀️' : '🌙', desc: 'Clear Sky' };
    if (code <= 3) return { icon: isDay ? '⛅' : '☁️', desc: ['Mainly Clear','Partly Cloudy','Overcast'][code-1] };
    if (code <= 48) return { icon: '🌫️', desc: 'Foggy' };
    if (code <= 57) return { icon: '🌦️', desc: 'Drizzle' };
    if (code <= 67) return { icon: '🌧️', desc: 'Rain' };
    if (code <= 77) return { icon: '🌨️', desc: 'Snow' };
    if (code <= 82) return { icon: '🌦️', desc: 'Rain Showers' };
    if (code <= 86) return { icon: '🌨️', desc: 'Snow Showers' };
    if (code <= 99) return { icon: '⛈️', desc: 'Thunderstorm' };
    return { icon: '🌡️', desc: 'Unknown' };
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
            const w = wmoToWeather(code, isDay);
            weatherIcon.textContent = w.icon;
            weatherDesc.textContent = w.desc;
            updateTempDisplay(tempC);
        }
    } catch(e) {
        weatherDesc.textContent = 'Unavailable';
    }
}

function updateTempDisplay(tempC) {
    if (tempC == null) return;
    window._lastTempC = tempC;
    if (settings.tempUnit === 'F') {
        weatherTemp.textContent = `${Math.round(tempC * 9/5 + 32)}°F`;
    } else {
        weatherTemp.textContent = `${Math.round(tempC)}°C`;
    }
}

function initWeather() {
    // Try GPS first
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            pos => {
                weatherLat = pos.coords.latitude;
                weatherLon = pos.coords.longitude;
                weatherCity.textContent = `GPS Location`;
                fetchWeather(weatherLat, weatherLon);
            },
            () => { fallbackWeatherLocation(); },
            { timeout: 8000 }
        );
    } else {
        fallbackWeatherLocation();
    }
}

async function fallbackWeatherLocation() {
    // Try GeoJS for coordinates
    try {
        const r = await fetch('https://get.geojs.io/v1/ip/geo.json');
        const d = await r.json();
        if (d.latitude && d.longitude) {
            weatherLat = parseFloat(d.latitude);
            weatherLon = parseFloat(d.longitude);
            weatherCity.textContent = d.city ? `${d.city}, ${d.country}` : (d.country || 'IP Location');
            fetchWeather(weatherLat, weatherLon);
            return;
        }
    } catch(e) {}
    
    // Hard fallback: Ha Noi
    weatherLat = 21.03; weatherLon = 105.85;
    weatherCity.textContent = 'Ha Noi (Default)';
    fetchWeather(weatherLat, weatherLon);
}

function autoRefreshWeather() {
    // Refresh every 10 minutes
    setInterval(() => {
        if (weatherLat != null && weatherLon != null) {
            fetchWeather(weatherLat, weatherLon);
        }
    }, 600000);
}

/* ══════════════════════════════════════════
   REGIONAL TIMEZONES (EXPANDED)
   ══════════════════════════════════════════ */
const tzData = [
    { group: "Asia", zones: [
        { name: "Ha Noi, Ho Chi Minh", tz: "Asia/Ho_Chi_Minh" },
        { name: "Bangkok, Jakarta", tz: "Asia/Bangkok" },
        { name: "Singapore, Kuala Lumpur", tz: "Asia/Singapore" },
        { name: "Beijing, Shanghai", tz: "Asia/Shanghai" },
        { name: "Hong Kong", tz: "Asia/Hong_Kong" },
        { name: "Taipei", tz: "Asia/Taipei" },
        { name: "Tokyo, Osaka", tz: "Asia/Tokyo" },
        { name: "Seoul", tz: "Asia/Seoul" },
        { name: "Manila", tz: "Asia/Manila" },
        { name: "Yangon", tz: "Asia/Yangon" },
        { name: "Phnom Penh", tz: "Asia/Phnom_Penh" },
        { name: "Dubai, Abu Dhabi", tz: "Asia/Dubai" },
        { name: "Riyadh", tz: "Asia/Riyadh" },
        { name: "Doha", tz: "Asia/Qatar" },
        { name: "Tehran", tz: "Asia/Tehran" },
        { name: "Mumbai, New Delhi", tz: "Asia/Kolkata" },
        { name: "Dhaka", tz: "Asia/Dhaka" },
        { name: "Karachi, Islamabad", tz: "Asia/Karachi" },
        { name: "Colombo", tz: "Asia/Colombo" },
        { name: "Almaty", tz: "Asia/Almaty" },
        { name: "Tashkent", tz: "Asia/Tashkent" },
        { name: "Kathmandu", tz: "Asia/Kathmandu" },
        { name: "Jerusalem, Tel Aviv", tz: "Asia/Jerusalem" },
        { name: "Tbilisi", tz: "Asia/Tbilisi" },
        { name: "Ulaanbaatar", tz: "Asia/Ulaanbaatar" }
    ]},
    { group: "Europe", zones: [
        { name: "London, Dublin", tz: "Europe/London" },
        { name: "Paris, Brussels", tz: "Europe/Paris" },
        { name: "Berlin, Frankfurt", tz: "Europe/Berlin" },
        { name: "Rome, Milan", tz: "Europe/Rome" },
        { name: "Madrid, Barcelona", tz: "Europe/Madrid" },
        { name: "Amsterdam", tz: "Europe/Amsterdam" },
        { name: "Zurich, Geneva", tz: "Europe/Zurich" },
        { name: "Vienna", tz: "Europe/Vienna" },
        { name: "Stockholm", tz: "Europe/Stockholm" },
        { name: "Oslo", tz: "Europe/Oslo" },
        { name: "Copenhagen", tz: "Europe/Copenhagen" },
        { name: "Helsinki", tz: "Europe/Helsinki" },
        { name: "Warsaw", tz: "Europe/Warsaw" },
        { name: "Prague", tz: "Europe/Prague" },
        { name: "Budapest", tz: "Europe/Budapest" },
        { name: "Bucharest", tz: "Europe/Bucharest" },
        { name: "Athens", tz: "Europe/Athens" },
        { name: "Istanbul", tz: "Europe/Istanbul" },
        { name: "Lisbon", tz: "Europe/Lisbon" },
        { name: "Moscow", tz: "Europe/Moscow" },
        { name: "Kyiv", tz: "Europe/Kyiv" }
    ]},
    { group: "Americas", zones: [
        { name: "New York, Toronto", tz: "America/New_York" },
        { name: "Chicago, Houston", tz: "America/Chicago" },
        { name: "Denver", tz: "America/Denver" },
        { name: "Los Angeles, Vancouver", tz: "America/Los_Angeles" },
        { name: "Anchorage", tz: "America/Anchorage" },
        { name: "Honolulu", tz: "Pacific/Honolulu" },
        { name: "Mexico City", tz: "America/Mexico_City" },
        { name: "Bogota", tz: "America/Bogota" },
        { name: "Lima", tz: "America/Lima" },
        { name: "Santiago", tz: "America/Santiago" },
        { name: "Buenos Aires", tz: "America/Argentina/Buenos_Aires" },
        { name: "Sao Paulo", tz: "America/Sao_Paulo" },
        { name: "Caracas", tz: "America/Caracas" },
        { name: "Havana", tz: "America/Havana" },
        { name: "Panama", tz: "America/Panama" },
        { name: "Santo Domingo", tz: "America/Santo_Domingo" }
    ]},
    { group: "Australia & Pacific", zones: [
        { name: "Sydney, Melbourne", tz: "Australia/Sydney" },
        { name: "Perth", tz: "Australia/Perth" },
        { name: "Brisbane", tz: "Australia/Brisbane" },
        { name: "Adelaide", tz: "Australia/Adelaide" },
        { name: "Auckland", tz: "Pacific/Auckland" },
        { name: "Fiji", tz: "Pacific/Fiji" },
        { name: "Samoa", tz: "Pacific/Apia" },
        { name: "Papua New Guinea", tz: "Pacific/Port_Moresby" }
    ]},
    { group: "Africa", zones: [
        { name: "Cairo", tz: "Africa/Cairo" },
        { name: "Lagos", tz: "Africa/Lagos" },
        { name: "Johannesburg, Cape Town", tz: "Africa/Johannesburg" },
        { name: "Nairobi, Addis Ababa", tz: "Africa/Nairobi" },
        { name: "Casablanca", tz: "Africa/Casablanca" },
        { name: "Accra", tz: "Africa/Accra" },
        { name: "Algiers, Tunis", tz: "Africa/Algiers" },
        { name: "Dar es Salaam", tz: "Africa/Dar_es_Salaam" },
        { name: "Kinshasa", tz: "Africa/Kinshasa" }
    ]}
];

function getOffset(timeZone) {
    try {
        const date = new Date();
        const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
        const tzDate = new Date(date.toLocaleString('en-US', { timeZone }));
        return (tzDate - utcDate) / 3600000;
    } catch(e) { return 0; }
}

function fmtOffset(off) {
    const sign = off >= 0 ? '+' : '-';
    const hrs = Math.floor(Math.abs(off));
    const mins = Math.round((Math.abs(off) % 1) * 60);
    const minStr = mins === 0 ? '' : `:${mins.toString().padStart(2, '0')}`;
    return `GMT${sign}${hrs}${minStr}`;
}

function populateTimezoneSelect(selectEl) {
    selectEl.innerHTML = '';
    tzData.forEach(g => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = g.group;
        g.zones.forEach(z => {
            const off = getOffset(z.tz);
            const opt = document.createElement('option');
            opt.value = off;
            opt.dataset.tz = z.tz;
            opt.textContent = `${z.name} - ${fmtOffset(off)}`;
            optgroup.appendChild(opt);
        });
        selectEl.appendChild(optgroup);
    });
}

function initGMTSelector() {
    populateTimezoneSelect(gmtSelect);
    const setTzSelect = document.getElementById('setTimezone');
    populateTimezoneSelect(setTzSelect);

    // Sync both selectors
    gmtSelect.addEventListener('change', (e) => {
        currentOffset = parseFloat(e.target.value);
        settings.timezone = e.target.options[e.target.selectedIndex]?.dataset.tz || null;
        saveSettings();
        // Sync settings selector
        syncTzSelectors(gmtSelect, setTzSelect);
    });

    setTzSelect.addEventListener('change', (e) => {
        currentOffset = parseFloat(e.target.value);
        settings.timezone = e.target.options[e.target.selectedIndex]?.dataset.tz || null;
        saveSettings();
        syncTzSelectors(setTzSelect, gmtSelect);
    });
}

function syncTzSelectors(source, target) {
    target.value = source.value;
}

function selectTimezone(tz, country) {
    const off = getOffset(tz);
    currentOffset = off;
    
    let opt = Array.from(gmtSelect.options).find(o => o.dataset.tz === tz) || 
              Array.from(gmtSelect.options).find(o => parseFloat(o.value) === off);
    
    if (opt) {
        gmtSelect.value = opt.value;
    } else {
        const customGroup = document.createElement('optgroup');
        customGroup.label = "📍 Your Location";
        const customOpt = document.createElement('option');
        customOpt.value = off;
        customOpt.dataset.tz = tz;
        const cityName = tz.split('/').pop().replace(/_/g, ' ');
        customOpt.textContent = `${cityName} - ${fmtOffset(off)}`;
        customGroup.appendChild(customOpt);
        gmtSelect.insertBefore(customGroup, gmtSelect.firstChild);
        gmtSelect.value = off;

        // Also add to settings selector
        const setTzSelect = document.getElementById('setTimezone');
        const cg2 = customGroup.cloneNode(true);
        setTzSelect.insertBefore(cg2, setTzSelect.firstChild);
    }

    // Sync both selects
    const setTzSelect = document.getElementById('setTimezone');
    setTzSelect.value = gmtSelect.value;
}

async function detectLocation() {
    locText.textContent = "Detecting Location...";
    let detectedTz = null, detectedCountry = null;

    // If settings has a saved timezone, use that instead
    if (settings.timezone) {
        const off = getOffset(settings.timezone);
        currentOffset = off;
        const cityName = settings.timezone.split('/').pop().replace(/_/g, ' ');
        locText.textContent = `Saved / ${cityName}`;
        selectTimezone(settings.timezone, cityName);
        return;
    }

    // Step 1: Try IPAPI (Very accurate for Vietnam)
    try {
        const r0 = await fetch('https://ipapi.co/json/');
        const d0 = await r0.json();
        if (d0.country_name) { detectedCountry = d0.country_name; detectedTz = d0.timezone; }
    } catch(e) {}

    // Step 2: Fallback to GeoJS
    if (!detectedTz) {
        try {
            const r1 = await fetch('https://get.geojs.io/v1/ip/geo.json');
            const d1 = await r1.json();
            if (d1.timezone) { detectedCountry = d1.country; detectedTz = d1.timezone; }
        } catch(e) {}
    }

    // Step 3: Fallback to IPWhoIs
    if (!detectedTz) {
        try {
            const r2 = await fetch('https://ipwho.is/');
            const d2 = await r2.json();
            if (d2.success) { detectedCountry = d2.country; detectedTz = d2.timezone?.id; }
        } catch(e) {}
    }

    if (detectedTz) {
        locText.textContent = `Country / ${detectedCountry}`;
        selectTimezone(detectedTz, detectedCountry);
    } else {
        locText.textContent = "Local Time";
        currentOffset = -(new Date().getTimezoneOffset() / 60);
        let opt = Array.from(gmtSelect.options).find(o => parseFloat(o.value) === currentOffset);
        if(opt) gmtSelect.value = opt.value;
    }
}

/* ══════════════════════════════════════════
   PALETTE
   ══════════════════════════════════════════ */
const P = [
{h:0, skyT:[15,12,60], skyM:[28,18,80], skyB:[45,30,105], rad:'radial-gradient(ellipse at 50% 100%,rgba(60,40,120,.25) 0%,transparent 65%)', haze:'rgba(40,25,80,.06)', l1:[[45,40,95], [20,16,60]], l2:[[35,30,80], [16,13,50]], l3:[[28,24,65], [12,10,40]], l4:[[22,18,50], [8,7,30]], l5:[[15,12,35], [5,4,22]], gnd:[6,5,22], star:1, rayC:'rgba(100,80,180,0)', rayOp:0, hor:[70,45,125], horOp:.12, tP:[255,255,255], tS:[200,200,230,.7], glow:[200,200,255,.15], greet:'Good Night'},
{h:4.5, skyT:[45,25,90], skyM:[85,50,105], skyB:[140,80,115], rad:'radial-gradient(ellipse at 50% 95%,rgba(180,100,100,.2) 0%,transparent 60%)', haze:'rgba(120,60,80,.06)', l1:[[110,70,110], [50,30,75]], l2:[[90,55,90], [40,25,60]], l3:[[70,40,70], [30,20,48]], l4:[[50,30,55], [22,14,35]], l5:[[35,20,40], [15,10,25]], gnd:[15,10,25], star:.3, rayC:'rgba(200,120,80,.08)', rayOp:.2, hor:[170,85,100], horOp:.4, tP:[235,230,245], tS:[195,185,215,.75], glow:[180,150,200,.18], greet:'Early Morning'},
{h:5.8, skyT:[110,170,230], skyM:[210,160,150], skyB:[255,195,115], rad:'radial-gradient(ellipse at 50% 90%,rgba(255,180,80,.35) 0%,transparent 55%)', haze:'rgba(255,200,140,.08)', l1:[[255,200,160], [160,120,100]], l2:[[210,160,130], [120,95,85]], l3:[[160,120,100], [85,75,70]], l4:[[110,85,75], [55,55,55]], l5:[[70,55,50], [35,38,40]], gnd:[35,38,40], star:0, rayC:'rgba(255,200,100,.18)', rayOp:.65, hor:[255,175,75], horOp:.75, tP:[55,55,75], tS:[75,75,100,.8], glow:[100,100,140,.1], greet:'Good Morning'},
{h:8, skyT:[75,185,250], skyM:[125,210,252], skyB:[185,232,252], rad:'radial-gradient(ellipse at 50% 80%,rgba(200,230,255,.2) 0%,transparent 60%)', haze:'rgba(180,210,240,.04)', l1:[[240,245,255], [100,170,190]], l2:[[210,230,250], [75,145,165]], l3:[[170,210,240], [55,120,140]], l4:[[120,175,205], [40,95,115]], l5:[[80,140,160], [28,70,85]], gnd:[30,75,90], star:0, rayC:'rgba(255,240,180,0)', rayOp:0, hor:[175,218,252], horOp:.06, tP:[48,48,68], tS:[68,68,95,.8], glow:[80,90,150,.08], greet:'Good Morning'},
{h:12, skyT:[25,145,242], skyM:[60,182,255], skyB:[115,208,255], rad:'radial-gradient(ellipse at 50% 20%,rgba(255,250,220,.12) 0%,transparent 50%)', haze:'rgba(150,200,250,.03)', l1:[[255,255,255], [80,160,195]], l2:[[220,240,255], [55,135,170]], l3:[[180,215,245], [35,110,145]], l4:[[130,175,210], [22,85,115]], l5:[[80,135,165], [15,65,90]], gnd:[15,65,90], star:0, rayC:'rgba(255,250,200,0)', rayOp:0, hor:[140,200,248], horOp:.03, tP:[38,38,58], tS:[58,58,85,.8], glow:[55,70,130,.08], greet:'Good Afternoon'},
{h:15, skyT:[42,155,245], skyM:[82,190,255], skyB:[138,215,255], rad:'radial-gradient(ellipse at 50% 60%,rgba(220,230,255,.1) 0%,transparent 55%)', haze:'rgba(170,210,248,.03)', l1:[[250,250,255], [90,165,190]], l2:[[215,235,250], [65,140,165]], l3:[[175,210,240], [45,115,140]], l4:[[125,170,205], [30,90,110]], l5:[[75,130,160], [20,70,85]], gnd:[20,70,85], star:0, rayC:'rgba(255,245,190,0)', rayOp:0, hor:[155,208,250], horOp:.04, tP:[42,42,62], tS:[62,62,88,.8], glow:[65,75,135,.08], greet:'Good Afternoon'},
{h:17, skyT:[78,148,218], skyM:[160,178,210], skyB:[225,198,168], rad:'radial-gradient(ellipse at 50% 85%,rgba(255,200,130,.22) 0%,transparent 55%)', haze:'rgba(240,200,160,.05)', l1:[[255,230,200], [135,135,150]], l2:[[230,205,180], [105,110,125]], l3:[[195,175,155], [75,85,100]], l4:[[145,135,125], [50,60,75]], l5:[[95,100,95], [35,45,55]], gnd:[35,45,55], star:0, rayC:'rgba(255,200,100,.1)', rayOp:.2, hor:[242,182,118], horOp:.28, tP:[58,52,68], tS:[82,78,98,.8], glow:[118,100,130,.12], greet:'Good Afternoon'},
{h:18.2, skyT:[125,55,145], skyM:[210,82,100], skyB:[255,145,68], rad:'radial-gradient(ellipse at 50% 92%,rgba(255,150,50,.4) 0%,transparent 50%)', haze:'rgba(255,140,80,.08)', l1:[[255,160,110], [160,75,85]], l2:[[220,120,95], [115,50,75]], l3:[[180,85,75], [75,35,65]], l4:[[120,55,55], [45,20,50]], l5:[[75,30,40], [25,12,35]], gnd:[25,12,35], star:0, rayC:'rgba(255,160,60,.22)', rayOp:.8, hor:[255,115,42], horOp:.88, tP:[255,238,228], tS:[228,208,208,.8], glow:[255,180,120,.22], greet:'Good Evening'},
{h:19.5, skyT:[28,28,78], skyM:[78,48,88], skyB:[165,82,58], rad:'radial-gradient(ellipse at 50% 95%,rgba(180,80,40,.25) 0%,transparent 55%)', haze:'rgba(100,50,60,.05)', l1:[[140,90,120], [65,40,75]], l2:[[110,70,100], [45,30,60]], l3:[[85,55,80], [30,22,48]], l4:[[60,40,65], [20,15,35]], l5:[[40,25,45], [12,10,25]], gnd:[12,10,25], star:.25, rayC:'rgba(180,80,30,.08)', rayOp:.3, hor:[178,78,38], horOp:.5, tP:[228,222,238], tS:[188,182,208,.75], glow:[198,148,128,.18], greet:'Good Evening'},
{h:20.8, skyT:[14,14,52], skyM:[24,18,68], skyB:[38,28,88], rad:'radial-gradient(ellipse at 50% 100%,rgba(55,38,110,.22) 0%,transparent 62%)', haze:'rgba(35,22,70,.05)', l1:[[60,50,110], [25,20,65]], l2:[[45,40,95], [20,15,55]], l3:[[35,30,80], [15,12,45]], l4:[[28,24,65], [10,8,35]], l5:[[20,18,50], [6,5,22]], gnd:[6,5,22], star:.88, rayC:'rgba(80,60,140,0)', rayOp:0, hor:[48,32,78], horOp:.1, tP:[218,222,248], tS:[168,172,208,.7], glow:[138,148,218,.18], greet:'Good Night'},
{h:22, skyT:[18,14,58], skyM:[30,20,78], skyB:[48,32,98], rad:'radial-gradient(ellipse at 50% 100%,rgba(60,40,115,.24) 0%,transparent 64%)', haze:'rgba(38,24,75,.05)', l1:[[65,55,120], [28,22,72]], l2:[[50,45,105], [22,18,60]], l3:[[40,35,85], [18,14,50]], l4:[[30,26,70], [12,10,38]], l5:[[22,20,55], [9,8,28]], gnd:[9,8,28], star:1, rayC:'rgba(85,65,145,0)', rayOp:0, hor:[55,38,88], horOp:.12, tP:[210,215,245], tS:[160,165,200,.7], glow:[148,155,218,.16], greet:'Good Night'},
{h:24, skyT:[15,12,60], skyM:[28,18,80], skyB:[45,30,105], rad:'radial-gradient(ellipse at 50% 100%,rgba(60,40,120,.25) 0%,transparent 65%)', haze:'rgba(40,25,80,.06)', l1:[[45,40,95], [20,16,60]], l2:[[35,30,80], [16,13,50]], l3:[[28,24,65], [12,10,40]], l4:[[22,18,50], [8,7,30]], l5:[[15,12,35], [5,4,22]], gnd:[6,5,22], star:1, rayC:'rgba(100,80,180,0)', rayOp:0, hor:[70,45,125], horOp:.12, tP:[255,255,255], tS:[200,200,230,.7], glow:[200,200,255,.15], greet:'Good Night'}
];

const lerp = (a,b,t) => a+(b-a)*t;
const lerpA = (a,b,t) => a.map((v,i) => lerp(v,b[i],t));
const lerpA2 = (a,b,t) => [lerpA(a[0],b[0],t), lerpA(a[1],b[1],t)];
const rgb = a => `rgb(${a[0]|0},${a[1]|0},${a[2]|0})`;

function getC(hf) {
    let p=P[0], n=P[P.length-1];
    for(let i=0; i<P.length-1; i++) if(hf>=P[i].h && hf<P[i+1].h){ p=P[i]; n=P[i+1]; break; }
    const t = (hf-p.h)/(n.h-p.h), pick = (a,b) => t<.5 ? a : b;
    return {
        skyT:lerpA(p.skyT,n.skyT,t), skyM:lerpA(p.skyM,n.skyM,t), skyB:lerpA(p.skyB,n.skyB,t),
        rad:pick(p.rad,n.rad), haze:pick(p.haze,n.haze),
        l1:lerpA2(p.l1,n.l1,t), l2:lerpA2(p.l2,n.l2,t), l3:lerpA2(p.l3,n.l3,t), 
        l4:lerpA2(p.l4,n.l4,t), l5:lerpA2(p.l5,n.l5,t), gnd:lerpA(p.gnd,n.gnd,t),
        star:lerp(p.star,n.star,t), rayC:pick(p.rayC,n.rayC), rayOp:lerp(p.rayOp,n.rayOp,t),
        hor:lerpA(p.hor,n.hor,t), horOp:lerp(p.horOp,n.horOp,t),
        tP:lerpA(p.tP,n.tP,t), tS:lerpA(p.tS,n.tS,t), glow:lerpA(p.glow,n.glow,t), greet:pick(p.greet,n.greet)
    };
}

/* ── Canvases ── */
const sCvs = document.getElementById('starsCanvas'), sCtx = sCvs.getContext('2d');
let stars = [];
function initStars() { sCvs.width=sCvs.offsetWidth*devicePixelRatio; sCvs.height=sCvs.offsetHeight*devicePixelRatio; sCtx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0); stars=[]; const n=Math.min(300,(sCvs.offsetWidth*sCvs.offsetHeight/2600)|0); for(let i=0;i<n;i++) stars.push({x:Math.random()*sCvs.offsetWidth,y:Math.random()*sCvs.offsetHeight,r:.35+Math.random()*1.7,ph:Math.random()*Math.PI*2,sp:.35+Math.random()*2}) }
function drawStars(t) { const w=sCvs.offsetWidth,h=sCvs.offsetHeight; sCtx.clearRect(0,0,w,h); for(const s of stars){ const tw=.5+.5*Math.sin(t*.001*s.sp+s.ph),a=.25+.75*tw; sCtx.beginPath(); sCtx.arc(s.x,s.y,s.r,0,Math.PI*2); sCtx.fillStyle=`rgba(255,255,255,${a})`; sCtx.fill(); if(s.r>1.2){ sCtx.beginPath(); sCtx.arc(s.x,s.y,s.r*3,0,Math.PI*2); sCtx.fillStyle=`rgba(210,220,255,${a*.1})`; sCtx.fill() } } }

const pCvs = document.getElementById('particlesCanvas'), pCtx = pCvs.getContext('2d');
let parts = [];
function initParts() {
    pCvs.width=pCvs.offsetWidth*devicePixelRatio; pCvs.height=pCvs.offsetHeight*devicePixelRatio; 
    pCtx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0); 
    parts=[]; 
    for(let i=0;i<45;i++) {
        parts.push({
            x: Math.random()*pCvs.offsetWidth,
            y: Math.random()*pCvs.offsetHeight, // Allow full screen height
            vx: 0, vy: 0,
            bx: (Math.random()-.5)*0.4, // Base wandering X
            by: (Math.random()-.5)*0.3, // Base wandering Y
            r: 1.2+Math.random()*1.8,
            ph: Math.random()*Math.PI*2,
            orbit: Math.random()*Math.PI*2, // Angle for orbiting mouse
            orbitSpeed: 0.02 + Math.random()*0.05
        });
    }
}

function drawParts(t,sOp) {
    const w=pCvs.offsetWidth,h=pCvs.offsetHeight; pCtx.clearRect(0,0,w,h);
    if (!settings.showFireflies) return;
    const isN=sOp>.3, bOp=isN?Math.min(1,sOp):.15;
    if(!isN&&sOp<.05) return;
    
    for(const p of parts){
        let tx = p.bx, ty = p.by; // Target velocity is base wandering by default
        
        // Firefly smooth cursor attraction & orbiting at night
        if (isN && mouseActive && mouseX > 0) {
            const dx = mouseX - p.x, dy = mouseY - p.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist < 350) {
                // Smooth, slow pull towards cursor
                const pull = (1 - dist/350) * 0.5;
                tx += dx * 0.005 * pull;
                ty += dy * 0.005 * pull;
                
                // When close, orbit around instead of hitting dead center
                if (dist < 120) {
                    p.orbit += p.orbitSpeed;
                    tx += Math.cos(p.orbit) * 1.5;
                    ty += Math.sin(p.orbit) * 1.5;
                }
            }
        }
        
        // Easing current velocity towards target velocity
        p.vx += (tx - p.vx) * 0.05;
        p.vy += (ty - p.vy) * 0.05;
        
        p.x += p.vx; 
        p.y += p.vy;
        
        // Screen wrapping (full height allowed)
        if(p.x < -20) p.x = w+20; 
        if(p.x > w+20) p.x = -20;
        if(p.y < -20) p.y = h+20; 
        if(p.y > h+20) p.y = -20;
        
        // Drawing logic
        const gl=.3+.7*(.5+.5*Math.sin(t*.0018+p.ph)),a=gl*bOp;
        if(isN){
            const g=pCtx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*7);
            g.addColorStop(0,`rgba(190,255,100,${a*.4})`);
            g.addColorStop(1,'rgba(190,255,100,0)');
            pCtx.fillStyle=g;
            pCtx.fillRect(p.x-p.r*7,p.y-p.r*7,p.r*14,p.r*14);
            pCtx.beginPath(); pCtx.arc(p.x,p.y,p.r*.7,0,Math.PI*2);
            pCtx.fillStyle=`rgba(220,255,140,${a})`; pCtx.fill();
        } else {
            pCtx.beginPath(); pCtx.arc(p.x,p.y,p.r*.5,0,Math.PI*2);
            pCtx.fillStyle=`rgba(255,255,255,${a*.3})`; pCtx.fill();
        }
    }
}

let lastSh = 0;
function maybeShoot(t,sOp) { if(sOp<.3) return; if(t-lastSh<5000+Math.random()*10000) return; lastSh=t; const el=document.createElement('div'); el.className='shooting-star'; el.style.top=Math.random()*35+'%'; el.style.left=30+Math.random()*55+'%'; document.getElementById('shootingStars').appendChild(el); setTimeout(()=>el.remove(),1200) }

/* ── Celestial (Responsive Orbit) ── */
function posCel(hf) {
    const vw = innerWidth, vh = innerHeight;
    const isMobile = vw <= 480;
    const isTablet = vw <= 768;
    // Push the orbit center (gY) slightly higher to clear the newly enlarged clock panel
    const gY = isMobile ? vh * 0.48 : (isTablet ? vh * 0.52 : vh * 0.6);
    const r  = isMobile ? Math.min(vw * 0.42, vh * 0.35) : (isTablet ? Math.min(vw * 0.42, vh * 0.40) : Math.min(vw * 0.44, vh * 0.48));
    const cx = vw / 2, cy = gY;
    const sunOff = isMobile ? 35 : 65;
    const moonOff = isMobile ? 29 : 55;
    
    if (hf >= 5.5 && hf <= 18.5) {
        const p = (hf-5.5)/13, a = Math.PI*(1-p);
        sunW.style.left = (cx+r*Math.cos(a)-sunOff)+'px'; sunW.style.top = (cy-r*Math.sin(a)-sunOff)+'px';
        sunW.style.opacity = '1'; sunW.style.transform = `scale(${.65+.35*Math.sin(p*Math.PI)})`;
    } else { sunW.style.opacity = '0'; }
    
    let mp; if(hf>=18) mp=(hf-18)/12; else if(hf<=6) mp=(hf+6)/12; else mp=-1;
    if (mp >= 0 && mp <= 1) {
        const a = Math.PI*(1-mp);
        moonW.style.left = (cx+r*Math.cos(a)-moonOff)+'px'; moonW.style.top = (cy-r*Math.sin(a)-moonOff)+'px';
        moonW.style.opacity = '1'; moonW.style.transform = `scale(${.65+.35*Math.sin(mp*Math.PI)})`;
    } else { moonW.style.opacity = '0'; }
}

/* ══════════════════════════════════════════
   MODULE 3: SETTINGS UI (DRAWER)
   ══════════════════════════════════════════ */
function initSettingsUI() {
    const btn = document.getElementById('settingsBtn');
    const overlay = document.getElementById('settingsOverlay');
    const drawer = document.getElementById('settingsDrawer');
    const closeBtn = document.getElementById('settingsClose');

    function openDrawer() { drawer.classList.add('open'); overlay.classList.add('open'); }
    function closeDrawer() { drawer.classList.remove('open'); overlay.classList.remove('open'); }
    btn.addEventListener('click', openDrawer);
    overlay.addEventListener('click', closeDrawer);
    closeBtn.addEventListener('click', closeDrawer);

    // --- Fireflies toggle ---
    const firefliesCheck = document.getElementById('setFireflies');
    firefliesCheck.checked = settings.showFireflies;
    firefliesCheck.addEventListener('change', () => {
        settings.showFireflies = firefliesCheck.checked;
        saveSettings();
    });

    // --- Temperature Unit ---
    document.querySelectorAll('input[name="tempUnit"]').forEach(r => {
        if (r.value === settings.tempUnit) r.checked = true;
        r.addEventListener('change', () => {
            settings.tempUnit = r.value;
            saveSettings();
            if (window._lastTempC != null) updateTempDisplay(window._lastTempC);
        });
    });

    // --- Time Format ---
    const fmt12hCheckbox = document.getElementById('fmt12h');
    fmt12hCheckbox.checked = settings.is12h;
    document.querySelectorAll('input[name="timeFormat"]').forEach(r => {
        if ((r.value === '12') === settings.is12h) r.checked = true;
        r.addEventListener('change', () => {
            settings.is12h = (r.value === '12');
            fmt12hCheckbox.checked = settings.is12h;
            saveSettings();
        });
    });

    // Clock panel 12h toggle (sync with settings)
    fmt12hCheckbox.addEventListener('change', () => {
        settings.is12h = fmt12hCheckbox.checked;
        // Sync settings radio
        document.querySelectorAll('input[name="timeFormat"]').forEach(r => {
            r.checked = (r.value === '12') === settings.is12h;
        });
        saveSettings();
    });
}

/* ── MAIN LOOP ── */
function update(ts) {
    const d = new Date();
    const utcTime = d.getTime() + (d.getTimezoneOffset() * 60000);
    const targetDate = new Date(utcTime + (3600000 * currentOffset));
    
    const season = getSeason(targetDate.getMonth());
    if (currentSeason !== season) {
        currentSeason = season;
        initSeasonParticles(season);
    }
    
    const hf = targetDate.getHours() + targetDate.getMinutes()/60 + targetDate.getSeconds()/3600;
    const c = getC(hf);
    const dayFade = Math.max(0, Math.min(1, 1 - Math.abs(hf - 12) / 5.5)); 

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

    scene.style.background = `linear-gradient(180deg, ${rgb(c.skyT)} 0%, ${rgb(c.skyM)} 48%, ${rgb(c.skyB)} 100%)`;
    document.getElementById('skyRadial').style.background = c.rad;
    document.getElementById('skyHaze').style.background = c.haze;

    const s = root.style;
    s.setProperty('--star-opacity', c.star);
    s.setProperty('--ray-color', c.rayC); s.setProperty('--ray-opacity', c.rayOp);
    s.setProperty('--horizon-color', rgb(c.hor)); s.setProperty('--horizon-opacity', c.horOp);
    s.setProperty('--l1-peak', rgb(c.l1[0])); s.setProperty('--l1-body', rgb(c.l1[1]));
    s.setProperty('--l2-peak', rgb(c.l2[0])); s.setProperty('--l2-body', rgb(c.l2[1]));
    s.setProperty('--l3-peak', rgb(c.l3[0])); s.setProperty('--l3-body', rgb(c.l3[1]));
    s.setProperty('--l4-peak', rgb(c.l4[0])); s.setProperty('--l4-body', rgb(c.l4[1]));
    s.setProperty('--l5-peak', rgb(c.l5[0])); s.setProperty('--l5-body', rgb(c.l5[1]));
    s.setProperty('--gnd-color', rgb(c.gnd));
    s.setProperty('--text-primary', rgb(c.tP)); s.setProperty('--text-secondary', `rgba(${c.tS[0]},${c.tS[1]},${c.tS[2]},${c.tS[3]})`); s.setProperty('--clock-glow', `rgba(${c.glow[0]},${c.glow[1]},${c.glow[2]},${c.glow[3]})`);
    s.setProperty('--glow-contrast', `rgba(${c.tP[0]}, ${c.tP[1]}, ${c.tP[2]}, 0.6)`);
    s.setProperty('--select-bg', `rgba(255,255,255,${0.15 + dayFade * 0.2})`);

    posCel(hf);

    // ── MODULE 2: TIME FORMAT (12h / 24h) ──
    const hours24 = targetDate.getHours();
    const mm = String(targetDate.getMinutes()).padStart(2,'0');
    const ss = String(targetDate.getSeconds()).padStart(2,'0');
    
    // Wrap digits in fixed-width spans to prevent Orbitron jittering
    const wrapDigits = (str) => {
        return str.split('').map(char => {
            if (!isNaN(char)) {
                return `<span class="digit">${char}</span>`;
            }
            return `<span class="colon">${char}</span>`; // for colon
        }).join('');
    };
    
    if (settings.is12h) {
        const period = hours24 >= 12 ? 'PM' : 'AM';
        const h12 = hours24 % 12 || 12;
        const timeString = `${String(h12).padStart(2,'0')}:${mm}:${ss}`;
        clockTime.innerHTML = `${wrapDigits(timeString)}<span class="ampm">${period}</span>`;
    } else {
        const timeString = `${String(hours24).padStart(2,'0')}:${mm}:${ss}`;
        clockTime.innerHTML = wrapDigits(timeString);
    }

    clockDate.textContent = targetDate.toLocaleDateString('en-US', {weekday:'long', year:'numeric', month:'long', day:'numeric'});
    greetEl.textContent = c.greet;

    drawStars(ts); drawParts(ts, c.star); maybeShoot(ts, c.star);
    drawSeasonParticles(ts, dayFade);

    requestAnimationFrame(update);
}

/* ══════════════════════════════════════════
   INIT
   ══════════════════════════════════════════ */
function init() {
    // 1. Load saved settings FIRST
    loadSettings();
    
    // 2. Init timezone selectors
    initGMTSelector();
    
    // 3. Detect location (or use saved timezone)
    detectLocation();
    
    // 4. Init canvases
    initStars(); initParts();
    
    // 5. Init Settings UI (bind events)
    initSettingsUI();
    
    // 6. Init Weather
    initWeather();
    autoRefreshWeather();
    
    // 7. Resize handler
    window.addEventListener('resize', () => { 
        initStars(); initParts(); 
        if(currentSeason) initSeasonParticles(currentSeason); 
    });
    
    // 8. Start render loop
    requestAnimationFrame(update);
}

init();

})();
