/* =================================================
   To-Do List — Categorized, Progress Tracking & API Sync
   Matches Day Night Cycle Design Mockup (Image 2)
   ================================================= */
(() => {
    'use strict';

    const STORAGE_KEY = 'daynight_todos';
    const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:8000/api'
        : '/api';

    const todoBtn = document.getElementById('todoBtn');
    const overlay = document.getElementById('todoOverlay');
    const panel = document.getElementById('todoPanel');
    const closeBtn = document.getElementById('todoClose');
    const minimizeBtn = document.getElementById('todoMinimize');
    const input = document.getElementById('todoInput');
    const addBtn = document.getElementById('todoAdd');

    const listUpNext = document.getElementById('todoListUpNext');
    const listCompleted = document.getElementById('todoListCompleted');
    const upNextCountEl = document.getElementById('upNextCount');
    const completedCountEl = document.getElementById('completedCount');
    const progressStatsEl = document.getElementById('todoProgressStats');
    const progressFillEl = document.getElementById('todoProgressFill');

    if (!panel) return;

    let todos = [];
    let useAPI = false;

    // ── Open / Close drawer ──
    function openPanel() {
        panel.classList.remove('minimized');
        if (minimizeBtn) minimizeBtn.textContent = '−';
        panel.classList.add('open');
        overlay.classList.add('open');
        input?.focus();
    }
    function closePanel() {
        panel.classList.remove('open');
        panel.classList.remove('minimized');
        overlay.classList.remove('open');
        if (minimizeBtn) minimizeBtn.textContent = '−';
    }

    todoBtn?.addEventListener('click', openPanel);
    overlay?.addEventListener('click', closePanel);
    closeBtn?.addEventListener('click', closePanel);

    // Minimize / Maximize drawer
    minimizeBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        const isMin = panel.classList.toggle('minimized');
        minimizeBtn.textContent = isMin ? '+' : '−';
        minimizeBtn.title = isMin ? 'Expand To-Do' : 'Minimize To-Do';
        if (overlay) overlay.classList.toggle('open', !isMin);
    });

    panel?.addEventListener('click', () => {
        if (panel.classList.contains('minimized')) {
            panel.classList.remove('minimized');
            if (minimizeBtn) {
                minimizeBtn.textContent = '−';
                minimizeBtn.title = 'Minimize To-Do';
            }
            if (overlay) overlay.classList.add('open');
        }
    });

    // ── Local Storage Helpers ──
    function saveLocal() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
        } catch(e) {}
    }

    function loadLocal() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) todos = JSON.parse(raw);
        } catch(e) {
            todos = [];
        }
    }

    // Default sample tasks if none exist
    const DEFAULT_SEED_TASKS = [
        { id: 1, text: "Finish the landing page", tag: "Design", subtitle: "Your next focus", done: false },
        { id: 2, text: "Read 10 pages", tag: "Personal", subtitle: "A little every day", done: false },
        { id: 3, text: "Plan tomorrow's priorities", tag: "Planning", subtitle: "Before you log off", done: false },
        { id: 4, text: "Take a mindful break", tag: "Wellbeing", subtitle: "Just 5 minutes", done: false },
        { id: 5, text: "Clear the desk", tag: "Environment", subtitle: "A fresh start", done: true }
    ];

    // ── API Operations ──
    async function checkAPI() {
        try {
            const r = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(1500) });
            if (r.ok) {
                useAPI = true;
                return true;
            }
        } catch(e) {}
        return false;
    }

    async function loadFromAPI() {
        try {
            const r = await fetch(`${API_BASE}/todos`);
            if (r.ok) {
                const data = await r.json();
                if (data && data.length > 0) {
                    todos = data.map(t => ({
                        id: t.id,
                        text: t.text,
                        tag: t.tag || "Personal",
                        subtitle: t.subtitle || "A little every day",
                        done: t.done
                    }));
                } else {
                    // Seed from API
                    const seedRes = await fetch(`${API_BASE}/todos/seed-default`, { method: 'POST' });
                    if (seedRes.ok) {
                        const seeded = await seedRes.json();
                        todos = seeded.map(t => ({
                            id: t.id,
                            text: t.text,
                            tag: t.tag || "Personal",
                            subtitle: t.subtitle || "A little every day",
                            done: t.done
                        }));
                    }
                }
                saveLocal();
            }
        } catch(e) {
            loadLocal();
        }
    }

    async function apiCreateTodo(text, tag, subtitle) {
        try {
            const r = await fetch(`${API_BASE}/todos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, tag, subtitle, category: 'up_next' })
            });
            if (r.ok) return await r.json();
        } catch(e) {}
        return null;
    }

    async function apiToggleTodo(id, done) {
        try {
            await fetch(`${API_BASE}/todos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ done })
            });
        } catch(e) {}
    }

    async function apiDeleteTodo(id) {
        try {
            await fetch(`${API_BASE}/todos/${id}`, { method: 'DELETE' });
        } catch(e) {}
    }

    // ── User Actions ──
    async function addTodo(text) {
        text = text.trim();
        if (!text) return;

        // Auto assign helpful tags based on keywords
        let tag = "Focus";
        let subtitle = "Your next focus";
        const lower = text.toLowerCase();
        if (lower.includes('read') || lower.includes('book') || lower.includes('study')) {
            tag = "Personal";
            subtitle = "A little every day";
        } else if (lower.includes('plan') || lower.includes('email') || lower.includes('schedule')) {
            tag = "Planning";
            subtitle = "Before you log off";
        } else if (lower.includes('break') || lower.includes('relax') || lower.includes('walk') || lower.includes('water')) {
            tag = "Wellbeing";
            subtitle = "Just 5 minutes";
        } else if (lower.includes('design') || lower.includes('landing') || lower.includes('ui') || lower.includes('code')) {
            tag = "Design";
            subtitle = "Your next focus";
        }

        if (useAPI) {
            const res = await apiCreateTodo(text, tag, subtitle);
            if (res) {
                todos.unshift({
                    id: res.id,
                    text: res.text,
                    tag: res.tag || tag,
                    subtitle: res.subtitle || subtitle,
                    done: res.done
                });
            } else {
                todos.unshift({ id: Date.now(), text, tag, subtitle, done: false });
            }
        } else {
            todos.unshift({ id: Date.now(), text, tag, subtitle, done: false });
        }

        saveLocal();
        render();
    }

    async function toggleTodo(id) {
        const item = todos.find(t => t.id === id);
        if (!item) return;
        item.done = !item.done;

        if (useAPI) {
            apiToggleTodo(id, item.done);
        }
        saveLocal();
        render();
    }

    async function deleteTodo(id) {
        todos = todos.filter(t => t.id !== id);
        if (useAPI) {
            apiDeleteTodo(id);
        }
        saveLocal();
        render();
    }

    // ── Render ──
    function renderTaskCard(task) {
        const li = document.createElement('li');
        li.className = 'task-card' + (task.done ? ' done' : '');

        // Checkbox
        const checkWrap = document.createElement('div');
        checkWrap.className = 'task-checkbox-wrap';
        const check = document.createElement('input');
        check.type = 'checkbox';
        check.className = 'task-check';
        check.checked = task.done;
        check.addEventListener('change', () => toggleTodo(task.id));
        checkWrap.appendChild(check);

        // Content
        const content = document.createElement('div');
        content.className = 'task-content';

        const title = document.createElement('div');
        title.className = 'task-title';
        title.textContent = task.text;

        const meta = document.createElement('div');
        meta.className = 'task-meta';
        meta.innerHTML = `<span class="task-meta-dot">•</span> <span>${task.tag || 'Task'}</span> <span class="task-meta-dot">•</span> <span>${task.subtitle || 'Everyday'}</span>`;

        content.append(title, meta);

        // Delete button
        const delBtn = document.createElement('button');
        delBtn.className = 'task-delete-btn';
        delBtn.title = 'Delete task';
        delBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>`;
        delBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTodo(task.id);
        });

        li.append(checkWrap, content, delBtn);
        return li;
    }

    function render() {
        if (!listUpNext || !listCompleted) return;

        listUpNext.innerHTML = '';
        listCompleted.innerHTML = '';

        const upNextTasks = todos.filter(t => !t.done);
        const completedTasks = todos.filter(t => t.done);

        // Update counters
        if (upNextCountEl) {
            upNextCountEl.textContent = String(upNextTasks.length).padStart(2, '0');
        }
        if (completedCountEl) {
            completedCountEl.textContent = String(completedTasks.length).padStart(2, '0');
        }

        // Render Up Next list
        const lang = window.appLanguage || 'en';
        const emptyUp = {
            en: 'All clear for now. Take a deep breath ✨',
            vi: 'Hiện không có việc gì. Hít một hơi thật sâu nào ✨',
            th: 'ทุกอย่างเรียบร้อย หายใจเข้าลึกๆ ✨'
        };
        const emptyComp = {
            en: 'No completed tasks yet.',
            vi: 'Chưa có việc nào hoàn thành.',
            th: 'ยังไม่มีงานที่เสร็จสิ้น'
        };

        if (upNextTasks.length === 0) {
            const empty = document.createElement('li');
            empty.style.cssText = 'padding:14px;text-align:center;font-size:0.75rem;color:rgba(255,255,255,0.4);';
            empty.textContent = emptyUp[lang] || emptyUp.en;
            listUpNext.appendChild(empty);
        } else {
            upNextTasks.forEach(task => {
                listUpNext.appendChild(renderTaskCard(task));
            });
        }

        // Render Completed list
        if (completedTasks.length === 0) {
            const empty = document.createElement('li');
            empty.style.cssText = 'padding:10px;text-align:center;font-size:0.72rem;color:rgba(255,255,255,0.3);';
            empty.textContent = emptyComp[lang] || emptyComp.en;
            listCompleted.appendChild(empty);
        } else {
            completedTasks.forEach(task => {
                listCompleted.appendChild(renderTaskCard(task));
            });
        }

        // Update progress bar
        const total = todos.length;
        const done = completedTasks.length;
        if (progressStatsEl) {
            if (lang === 'vi') {
                progressStatsEl.textContent = `${done} / ${total} hoàn thành`;
            } else if (lang === 'th') {
                progressStatsEl.textContent = `เสร็จสิ้น ${done} จาก ${total}`;
            } else {
                progressStatsEl.textContent = `${done} of ${total} done`;
            }
        }
        if (progressFillEl) {
            const percent = total > 0 ? Math.round((done / total) * 100) : 0;
            progressFillEl.style.width = `${percent}%`;
        }
    }

    // ── Event Handlers ──
    addBtn?.addEventListener('click', () => {
        if (input) {
            addTodo(input.value);
            input.value = '';
        }
    });

    input?.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            addTodo(input.value);
            input.value = '';
        }
    });

    // ── Initialize ──
    async function init() {
        loadLocal();
        if (todos.length === 0) {
            todos = [...DEFAULT_SEED_TASKS];
            saveLocal();
        }
        render();

        const hasAPI = await checkAPI();
        if (hasAPI) {
            await loadFromAPI();
            render();
        }
    }

    init();

    // Listen to global language changes
    window.addEventListener('appLanguageChanged', () => {
        render();
    });
})();
