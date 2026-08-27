/* =================================================
   Day & Night Cycle — Dynamic Seasons & Leaves
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

/* ── STATE ── */
let currentOffset = -(new Date().getTimezoneOffset() / 60);
let currentSeason = '';

/* ── SEASONAL LOGIC ── */
function getSeason(month) {
    if (month >= 2 && month <= 4) return 'Spring';
    if (month >= 5 && month <= 7) return 'Summer';
    if (month >= 8 && month <= 10) return 'Autumn';
    return 'Winter'; // 11, 0, 1
}

function getSeasonColors(season) {
    if (season === 'Spring') return ['#4CAF50', '#81C784', '#A5D6A7']; // Xanh mơn mởn
    if (season === 'Summer') return ['#D4E157', '#FFEE58', '#FFCA28']; // Xanh pha vàng nhẹ
    if (season === 'Autumn') return ['#FF9800', '#F57C00', '#E65100', '#8D6E63']; // Vàng đậm, cam đỏ
    if (season === 'Winter') return ['#FFFFFF', '#E0F7FA', '#F1F8E9']; // Trắng tuyết
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
    
    // Tăng số lượng hạt lên một chút khi đã giảm kích thước
    const count = season === 'Winter' ? 90 : 55; 
    
    for (let i = 0; i < count; i++) {
        seasonParts.push({
            x: Math.random() * sCvs2.offsetWidth,
            y: Math.random() * sCvs2.offsetHeight,
            vx: (Math.random() - 0.5) * 2,             // Gió tạt ngang ngẫu nhiên hơn
            vy: 0.5 + Math.random() * 2.5,             // Tốc độ rơi từ chậm đến nhanh
            size: season === 'Winter' ? (1.5 + Math.random() * 2) : (2 + Math.random() * 3), // Scale nhỏ lại đáng kể
            angle: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 0.1,         // Độ xoay liên tục
            swayOffset: Math.random() * Math.PI * 2,
            swaySpeed: 0.0005 + Math.random() * 0.002, // Tần số lượn sóng
            swayAmp: 0.2 + Math.random() * 1.5,        // Biên độ lượn sóng (Có lá lượn mạnh, lá lượn nhẹ)
            c: colors[Math.floor(Math.random() * colors.length)]
        });
    }
}

function drawSeasonParticles(t, dayFade) {
    const w = sCvs2.offsetWidth, h = sCvs2.offsetHeight;
    sCtx2.clearRect(0, 0, w, h);
    
    // Tự động ngắt hiệu ứng lá rơi vào ban đêm (mờ dần theo độ tối của bầu trời)
    if (dayFade < 0.02) return; 
    sCtx2.globalAlpha = Math.min(1, dayFade * 2);

    seasonParts.forEach(p => {
        p.y += p.vy;
        
        // Dao động lướt lượn ngang
        p.x += Math.sin(t * p.swaySpeed + p.swayOffset) * p.swayAmp + p.vx;
        
        // Độ xoay lật (spin) + một chút lắc lư theo nhịp sóng (cosine)
        p.angle += p.spin + Math.cos(t * p.swaySpeed + p.swayOffset) * 0.03;
        
        // Reset khi bay khỏi khung hình
        if (p.y > h + 30) { p.y = -30; p.x = Math.random() * w; }
        if (p.x > w + 30) p.x = -30;
        if (p.x < -30) p.x = w + 30;
        
        sCtx2.save();
        sCtx2.translate(p.x, p.y);
        sCtx2.rotate(p.angle);
        
        if (currentSeason === 'Winter') {
            // Hạt tuyết
            sCtx2.beginPath();
            sCtx2.arc(0, 0, p.size * 0.7, 0, Math.PI * 2);
            sCtx2.fillStyle = p.c;
            sCtx2.fill();
        } else {
            // Vẽ lá rụng chi tiết với hệ trục thu nhỏ (scale ratio 0.2)
            sCtx2.scale(p.size * 0.2, p.size * 0.2);
            
            // Viền thân lá uốn lượn
            sCtx2.beginPath();
            sCtx2.moveTo(0, 15);
            sCtx2.bezierCurveTo(-15, 5, -10, -10, 0, -15);
            sCtx2.bezierCurveTo(10, -10, 15, 5, 0, 15);
            sCtx2.fillStyle = p.c;
            sCtx2.fill();
            
            // Hệ thống gân lá (Xương lá)
            sCtx2.beginPath();
            sCtx2.moveTo(0, 15); sCtx2.lineTo(0, -12); // Gân chính
            sCtx2.moveTo(0, 7);  sCtx2.lineTo(-6, 1);  // Nhánh phụ trái 1
            sCtx2.moveTo(0, 6);  sCtx2.lineTo(6, 0);   // Nhánh phụ phải 1
            sCtx2.moveTo(0, -1); sCtx2.lineTo(-5, -6); // Nhánh phụ trái 2
            sCtx2.moveTo(0, -2); sCtx2.lineTo(5, -7);  // Nhánh phụ phải 2
            sCtx2.moveTo(0, 15); sCtx2.lineTo(0, 19);  // Cuống lá
            
            sCtx2.strokeStyle = 'rgba(0,0,0,0.2)'; 
            sCtx2.lineWidth = 1;
            sCtx2.stroke();
        }
        
        sCtx2.restore();
    });
}

/* ── REGIONAL TIMEZONES ── */
const tzData = [
    { group: "Asia", zones: [
        { name: "Ha Noi, Ho Chi Minh", tz: "Asia/Ho_Chi_Minh" },
        { name: "Bangkok, Jakarta", tz: "Asia/Bangkok" },
        { name: "Singapore, Kuala Lumpur", tz: "Asia/Singapore" },
        { name: "Beijing, Shanghai", tz: "Asia/Shanghai" },
        { name: "Tokyo, Osaka", tz: "Asia/Tokyo" },
        { name: "Seoul", tz: "Asia/Seoul" },
        { name: "Dubai", tz: "Asia/Dubai" },
        { name: "Mumbai, New Delhi", tz: "Asia/Kolkata" }
    ]},
    { group: "Europe", zones: [
        { name: "London, Dublin", tz: "Europe/London" },
        { name: "Paris, Berlin, Rome", tz: "Europe/Paris" },
        { name: "Athens, Istanbul", tz: "Europe/Athens" },
        { name: "Moscow", tz: "Europe/Moscow" }
    ]},
    { group: "America", zones: [
        { name: "New York, Toronto", tz: "America/New_York" },
        { name: "Chicago", tz: "America/Chicago" },
        { name: "Denver", tz: "America/Denver" },
        { name: "Los Angeles", tz: "America/Los_Angeles" },
        { name: "Sao Paulo", tz: "America/Sao_Paulo" }
    ]},
    { group: "Australia & Pacific", zones: [
        { name: "Sydney, Melbourne", tz: "Australia/Sydney" },
        { name: "Auckland", tz: "Pacific/Auckland" }
    ]},
    { group: "Africa", zones: [
        { name: "Cairo", tz: "Africa/Cairo" },
        { name: "Johannesburg", tz: "Africa/Johannesburg" }
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

function initGMTSelector() {
    gmtSelect.innerHTML = '';
    tzData.forEach(g => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = g.group;
        g.zones.forEach(z => {
            const off = getOffset(z.tz);
            const sign = off >= 0 ? '+' : '';
            const hrs = Math.floor(Math.abs(off));
            const mins = (Math.abs(off) % 1) * 60;
            const minStr = mins === 0 ? '' : `:${mins.toString().padStart(2, '0')}`;
            
            const opt = document.createElement('option');
            opt.value = off;
            opt.dataset.tz = z.tz;
            opt.textContent = `${z.name} - GMT${sign}${hrs}${minStr}`;
            optgroup.appendChild(opt);
        });
        gmtSelect.appendChild(optgroup);
    });

    gmtSelect.value = currentOffset;
    gmtSelect.addEventListener('change', (e) => { currentOffset = parseFloat(e.target.value); });
}

async function detectLocation() {
    locText.textContent = "Detecting Location...";
    let detectedTz = null, detectedCountry = null;

    try {
        const r1 = await fetch('https://get.geojs.io/v1/ip/geo.json');
        const d1 = await r1.json();
        if (d1.timezone) { detectedCountry = d1.country; detectedTz = d1.timezone; }
    } catch(e) {}

    if (!detectedTz) {
        try {
            const r2 = await fetch('https://ipwho.is/');
            const d2 = await r2.json();
            if (d2.success) { detectedCountry = d2.country; detectedTz = d2.timezone.id; }
        } catch(e) {}
    }

    if (detectedTz) {
        locText.textContent = `Country / ${detectedCountry}`;
        const off = getOffset(detectedTz);
        currentOffset = off;
        
        let opt = Array.from(gmtSelect.options).find(o => o.dataset.tz === detectedTz) || 
                  Array.from(gmtSelect.options).find(o => parseFloat(o.value) === off);
        
        if (opt) {
            gmtSelect.value = opt.value;
        } else {
            const sign = off >= 0 ? '+' : '';
            const hrs = Math.floor(Math.abs(off));
            const mins = (Math.abs(off) % 1) * 60;
            const minStr = mins === 0 ? '' : `:${mins.toString().padStart(2, '0')}`;

            const customGroup = document.createElement('optgroup');
            customGroup.label = "Detected Location";
            const customOpt = document.createElement('option');
            customOpt.value = off;
            customOpt.dataset.tz = detectedTz;
            customOpt.textContent = `Country / ${detectedCountry} - GMT${sign}${hrs}${minStr}`;
            customGroup.appendChild(customOpt);
            gmtSelect.insertBefore(customGroup, gmtSelect.firstChild);
            gmtSelect.value = off;
        }
    } else {
        const tzName = Intl.DateTimeFormat().resolvedOptions().timeZone;
        locText.textContent = tzName ? `Location / ${tzName.split('/')[1]?.replace('_',' ') || tzName}` : "Local Time";
        currentOffset = -(new Date().getTimezoneOffset() / 60);
        let opt = Array.from(gmtSelect.options).find(o => parseFloat(o.value) === currentOffset);
        if(opt) gmtSelect.value = opt.value;
    }
}

/* ── PALETTE ── */
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
function initParts() { pCvs.width=pCvs.offsetWidth*devicePixelRatio; pCvs.height=pCvs.offsetHeight*devicePixelRatio; pCtx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0); parts=[]; for(let i=0;i<40;i++) parts.push({x:Math.random()*pCvs.offsetWidth,y:pCvs.offsetHeight*.35+Math.random()*pCvs.offsetHeight*.55,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.2,r:1.2+Math.random()*1.8,ph:Math.random()*Math.PI*2}) }
function drawParts(t,sOp) { const w=pCvs.offsetWidth,h=pCvs.offsetHeight; pCtx.clearRect(0,0,w,h); const isN=sOp>.3,bOp=isN?Math.min(1,sOp):.15; if(!isN&&sOp<.05) return; for(const p of parts){ p.x+=p.vx; p.y+=p.vy; if(p.x<0)p.x=w; if(p.x>w)p.x=0; if(p.y<h*.3)p.y=h*.85; if(p.y>h)p.y=h*.35; const gl=.3+.7*(.5+.5*Math.sin(t*.0018+p.ph)),a=gl*bOp; if(isN){ const g=pCtx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*7); g.addColorStop(0,`rgba(190,255,100,${a*.4})`); g.addColorStop(1,'rgba(190,255,100,0)'); pCtx.fillStyle=g; pCtx.fillRect(p.x-p.r*7,p.y-p.r*7,p.r*14,p.r*14); pCtx.beginPath(); pCtx.arc(p.x,p.y,p.r*.7,0,Math.PI*2); pCtx.fillStyle=`rgba(220,255,140,${a})`; pCtx.fill() }else{ pCtx.beginPath(); pCtx.arc(p.x,p.y,p.r*.5,0,Math.PI*2); pCtx.fillStyle=`rgba(255,255,255,${a*.3})`; pCtx.fill() } } }

let lastSh = 0;
function maybeShoot(t,sOp) { if(sOp<.3) return; if(t-lastSh<5000+Math.random()*10000) return; lastSh=t; const el=document.createElement('div'); el.className='shooting-star'; el.style.top=Math.random()*35+'%'; el.style.left=30+Math.random()*55+'%'; document.getElementById('shootingStars').appendChild(el); setTimeout(()=>el.remove(),1200) }

/* ── Celestial ── */
function posCel(hf) {
    const vw = innerWidth, vh = innerHeight, gY = vh * .6, r = Math.min(vw*.44, vh*.48), cx = vw/2, cy = gY;
    
    if (hf >= 5.5 && hf <= 18.5) {
        const p = (hf-5.5)/13, a = Math.PI*(1-p);
        sunW.style.left = (cx+r*Math.cos(a)-65)+'px'; sunW.style.top = (cy-r*Math.sin(a)-65)+'px';
        sunW.style.opacity = '1'; sunW.style.transform = `scale(${.65+.35*Math.sin(p*Math.PI)})`;
    } else { sunW.style.opacity = '0'; }
    
    let mp; if(hf>=18) mp=(hf-18)/12; else if(hf<=6) mp=(hf+6)/12; else mp=-1;
    if (mp >= 0 && mp <= 1) {
        const a = Math.PI*(1-mp);
        moonW.style.left = (cx+r*Math.cos(a)-55)+'px'; moonW.style.top = (cy-r*Math.sin(a)-55)+'px';
        moonW.style.opacity = '1'; moonW.style.transform = `scale(${.65+.35*Math.sin(mp*Math.PI)})`;
    } else { moonW.style.opacity = '0'; }
}

/* ── MAIN LOOP ── */
function update(ts) {
    const d = new Date();
    const utcTime = d.getTime() + (d.getTimezoneOffset() * 60000);
    const targetDate = new Date(utcTime + (3600000 * currentOffset));
    
    // Check Season globally
    const season = getSeason(targetDate.getMonth());
    if (currentSeason !== season) {
        currentSeason = season;
        initSeasonParticles(season);
    }
    
    const hf = targetDate.getHours() + targetDate.getMinutes()/60 + targetDate.getSeconds()/3600;
    const c = getC(hf);
    
    // Calculate daylight intensity (1 at noon, 0 at night)
    const dayFade = Math.max(0, Math.min(1, 1 - Math.abs(hf - 12) / 5.5)); 

    // OVERRIDE: Seasonal Sky Tint
    let tintC = 'transparent', tintO = 0;
    if (currentSeason === 'Autumn') { tintC = '#FFB300'; tintO = 0.15; }
    if (currentSeason === 'Winter') { tintC = '#FFFFFF'; tintO = 0.2; }
    seasonTint.style.background = tintC;
    seasonTint.style.opacity = tintO * dayFade;

    // OVERRIDE: Winter Mountain Peaks (Snow coverage)
    if (currentSeason === 'Winter') {
        const blendS = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
        const snowDay = [240, 248, 255];
        const snowNight = [40, 50, 80];
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

    // Dynamic UI Contrast and Brightness
    s.setProperty('--glow-contrast', `rgba(${c.tP[0]}, ${c.tP[1]}, ${c.tP[2]}, 0.6)`);
    s.setProperty('--select-bg', `rgba(255,255,255,${0.15 + dayFade * 0.2})`); // Brighter during day

    posCel(hf);

    const hh = String(targetDate.getHours()).padStart(2,'0');
    const mm = String(targetDate.getMinutes()).padStart(2,'0');
    const ss = String(targetDate.getSeconds()).padStart(2,'0');
    clockTime.textContent = `${hh}:${mm}:${ss}`;
    clockDate.textContent = targetDate.toLocaleDateString('en-US', {weekday:'long', year:'numeric', month:'long', day:'numeric'});
    greetEl.textContent = c.greet;

    drawStars(ts); drawParts(ts, c.star); maybeShoot(ts, c.star);
    drawSeasonParticles(ts, dayFade); // Render Detailed Leaves or Snow

    requestAnimationFrame(update);
}

function init() {
    initGMTSelector();
    detectLocation();
    initStars(); initParts();
    window.addEventListener('resize', () => { 
        initStars(); initParts(); 
        if(currentSeason) initSeasonParticles(currentSeason); 
    });
    requestAnimationFrame(update);
}

init();

})();
