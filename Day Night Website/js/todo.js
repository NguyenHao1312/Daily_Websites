/* =================================================
   To-Do List — CRUD with localStorage & API fallback
   ================================================= */
(() => {
    'use strict';

    const STORAGE_KEY = 'daynight_todos';
    const API_BASE = 'http://localhost:8000/api';

    const todoBtn = document.getElementById('todoBtn');
    const overlay = document.getElementById('todoOverlay');
    const panel = document.getElementById('todoPanel');
    const closeBtn = document.getElementById('todoClose');
    const input = document.getElementById('todoInput');
    const addBtn = document.getElementById('todoAdd');
    const listEl = document.getElementById('todoList');

    if (!panel) return;

    let todos = [];
    let useAPI = false; // Will be set to true if backend is available

    // ── Panel open/close ──
    function openPanel() { panel.classList.add('open'); overlay.classList.add('open'); input.focus(); }
    function closePanel() { panel.classList.remove('open'); overlay.classList.remove('open'); }

    todoBtn.addEventListener('click', openPanel);
    overlay.addEventListener('click', closePanel);
    closeBtn.addEventListener('click', closePanel);

    // ── localStorage helpers ──
    function saveLocal() {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(todos)); } catch(e) {}
    }

    function loadLocal() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) todos = JSON.parse(raw);
        } catch(e) { todos = []; }
    }

    // ── API helpers (Phase 4) ──
    async function checkAPI() {
        try {
            const r = await fetch(`${API_BASE}/todos`, { method: 'GET', signal: AbortSignal.timeout(2000) });
            if (r.ok) { useAPI = true; return true; }
        } catch(e) {}
        return false;
    }

    async function loadFromAPI() {
        try {
            const r = await fetch(`${API_BASE}/todos`);
            const data = await r.json();
            todos = data.map(t => ({
                id: t.id, text: t.text, done: t.done,
                createdAt: t.created_at || new Date().toISOString()
            }));
            saveLocal(); // Sync to local as backup
        } catch(e) { loadLocal(); }
    }

    async function apiPost(text) {
        try {
            const r = await fetch(`${API_BASE}/todos`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });
            return await r.json();
        } catch(e) { return null; }
    }

    async function apiToggle(id, done) {
        try {
            await fetch(`${API_BASE}/todos/${id}`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ done })
            });
        } catch(e) {}
    }

    async function apiDelete(id) {
        try {
            await fetch(`${API_BASE}/todos/${id}`, { method: 'DELETE' });
        } catch(e) {}
    }

    // ── CRUD ──
    async function addTodo(text) {
        text = text.trim();
        if (!text) return;

        if (useAPI) {
            const result = await apiPost(text);
            if (result) {
                todos.unshift({ id: result.id, text: result.text, done: result.done, createdAt: result.created_at });
            }
        } else {
            const todo = {
                id: Date.now(),
                text, done: false,
                createdAt: new Date().toISOString()
            };
            todos.unshift(todo);
        }
        saveLocal();
        render();
    }

    async function toggleTodo(id) {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;
        todo.done = !todo.done;
        if (useAPI) await apiToggle(id, todo.done);
        saveLocal();
        render();
    }

    async function deleteTodo(id) {
        todos = todos.filter(t => t.id !== id);
        if (useAPI) await apiDelete(id);
        saveLocal();
        render();
    }

    // ── Render ──
    function render() {
        listEl.innerHTML = '';
        if (todos.length === 0) {
            listEl.innerHTML = '<li style="text-align:center;opacity:.4;padding:20px;font-size:.85rem;">No tasks yet. Add one above! ✨</li>';
            return;
        }
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.className = 'todo-item' + (todo.done ? ' done' : '');

            const check = document.createElement('input');
            check.type = 'checkbox';
            check.className = 'todo-check';
            check.checked = todo.done;
            check.addEventListener('change', () => toggleTodo(todo.id));

            const text = document.createElement('span');
            text.className = 'todo-text';
            text.textContent = todo.text;

            const del = document.createElement('button');
            del.className = 'todo-delete';
            del.textContent = '🗑';
            del.addEventListener('click', () => deleteTodo(todo.id));

            li.append(check, text, del);
            listEl.appendChild(li);
        });
    }

    // ── Events ──
    addBtn.addEventListener('click', () => { addTodo(input.value); input.value = ''; });
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') { addTodo(input.value); input.value = ''; }
    });

    // ── Init ──
    async function init() {
        loadLocal();
        render();
        // Try connecting to backend API (Phase 4)
        const apiAvailable = await checkAPI();
        if (apiAvailable) {
            await loadFromAPI();
            render();
        }
    }

    init();
})();
