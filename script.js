const API_URL = 'http://localhost:5001/api';

// --- Core Navigation & Screen Switching ---
function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    
    if (screenId === 'main-dashboard') {
        setTimeout(initCharts, 100);
        loadEscalations();
    }
}

function switchView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        const onclick = btn.getAttribute('onclick');
        if (onclick && onclick.includes(viewId)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    const filterBar = document.getElementById('filter-bar');
    if (viewId === 'overview' || viewId === 'tickets' || viewId === 'escalations') {
        filterBar.style.display = 'flex';
    } else {
        filterBar.style.display = 'none';
    }

    if (viewId === 'escalations') {
        loadEscalations();
    }
}

// --- Auth Logic ---
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');
    errorEl.style.display = 'none';

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            updateUserUI(data.user);
            switchScreen('main-dashboard');
        } else {
            errorEl.innerText = data.error || 'Login failed';
            errorEl.style.display = 'block';
        }
    } catch (err) {
        errorEl.innerText = 'Server unreachable';
        errorEl.style.display = 'block';
    }
}

async function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const role = document.getElementById('signup-role').value;
    const errorEl = document.getElementById('signup-error');
    errorEl.style.display = 'none';

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Registration successful! Please login.');
            switchScreen('login-screen');
        } else {
            errorEl.innerText = data.error || 'Registration failed';
            errorEl.style.display = 'block';
        }
    } catch (err) {
        errorEl.innerText = 'Server unreachable';
        errorEl.style.display = 'block';
    }
}

function updateUserUI(user) {
    const nameEl = document.getElementById('header-user-name');
    const initialsEl = document.getElementById('header-user-initials');
    
    nameEl.innerText = user.name;
    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    initialsEl.innerText = initials;
}

function logout() {
    switchScreen('login-screen');
}

// --- Escalations Logic ---
async function loadEscalations() {
    const listEl = document.getElementById('escalation-list');
    const errorEl = document.getElementById('escalation-error');
    errorEl.style.display = 'none';

    try {
        const response = await fetch(`${API_URL}/escalations`);
        const result = await response.json();

        if (result.success) {
            renderEscalations(result.data);
        } else {
            errorEl.innerText = result.error || 'Failed to load escalations';
            errorEl.style.display = 'block';
        }
    } catch (err) {
        errorEl.innerText = 'Server unreachable';
        errorEl.style.display = 'block';
    }
}

function renderEscalations(escalations) {
    const listEl = document.getElementById('escalation-list');
    if (escalations.length === 0) {
        listEl.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 40px;">No escalations found.</p>';
        return;
    }

    listEl.innerHTML = escalations.map(esc => `
        <div class="alert-item" style="border-left-color: ${getSeverityColor(esc.severity)}">
            <div style="flex: 1;">
                <div style="display: flex; justify-content: space-between;">
                    <h4 style="margin-bottom: 5px;">${esc.ticket_id} - ${esc.client_name}</h4>
                    <span class="badge badge-${esc.status.toLowerCase().replace(' ', '-')}" style="height: fit-content;">${esc.status}</span>
                </div>
                <p><strong>Severity:</strong> ${esc.severity} | <strong>Agent:</strong> ${esc.assigned_agent}</p>
                ${esc.supervisor_notes ? `<p style="margin-top: 5px; font-style: italic; color: var(--text-muted);">"${esc.supervisor_notes}"</p>` : ''}
                <p style="font-size: 0.75rem; margin-top: 5px; color: var(--text-muted);">Created: ${new Date(esc.created_at).toLocaleString()}</p>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px; margin-left: 20px;">
                <button class="btn-main" onclick='openEscalationModal(${JSON.stringify(esc)})' style="width: 80px; padding: 6px; font-size: 0.8rem; background: var(--primary);">Edit</button>
                <button class="btn-main" onclick="deleteEscalation(${esc.id})" style="width: 80px; padding: 6px; font-size: 0.8rem; background: var(--crimson);">Delete</button>
            </div>
        </div>
    `).join('');
}

function getSeverityColor(severity) {
    switch (severity) {
        case 'Critical': return 'var(--crimson)';
        case 'High': return 'var(--amber)';
        case 'Medium': return 'var(--primary)';
        default: return 'var(--border)';
    }
}

function openEscalationModal(esc = null) {
    const modal = document.getElementById('escalation-modal');
    const form = document.getElementById('escalation-form');
    const title = document.getElementById('modal-title');

    form.reset();
    document.getElementById('escalation-id').value = '';

    if (esc) {
        title.innerText = 'Edit Escalation';
        document.getElementById('escalation-id').value = esc.id;
        document.getElementById('esc-ticket-id').value = esc.ticket_id;
        document.getElementById('esc-client-name').value = esc.client_name;
        document.getElementById('esc-severity').value = esc.severity;
        document.getElementById('esc-agent').value = esc.assigned_agent;
        document.getElementById('esc-status').value = esc.status;
        document.getElementById('esc-notes').value = esc.supervisor_notes || '';
    } else {
        title.innerText = 'New Escalation';
    }

    modal.style.display = 'flex';
}

function closeEscalationModal() {
    document.getElementById('escalation-modal').style.display = 'none';
}

async function handleEscalationSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('escalation-id').value;
    const payload = {
        ticket_id: document.getElementById('esc-ticket-id').value,
        client_name: document.getElementById('esc-client-name').value,
        severity: document.getElementById('esc-severity').value,
        assigned_agent: document.getElementById('esc-agent').value,
        status: document.getElementById('esc-status').value,
        supervisor_notes: document.getElementById('esc-notes').value
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/escalations/${id}` : `${API_URL}/escalations`;

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.success) {
            closeEscalationModal();
            loadEscalations();
        } else {
            alert(result.error || 'Failed to save escalation');
        }
    } catch (err) {
        alert('Server unreachable');
    }
}

async function deleteEscalation(id) {
    if (!confirm('Are you sure you want to delete this escalation?')) return;

    try {
        const response = await fetch(`${API_URL}/escalations/${id}`, { method: 'DELETE' });
        const result = await response.json();

        if (result.success) {
            loadEscalations();
        } else {
            alert(result.error || 'Failed to delete escalation');
        }
    } catch (err) {
        alert('Server unreachable');
    }
}

// --- Theme & Mock Data (kept for UI) ---
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const targetTheme = currentTheme === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', targetTheme);
    document.getElementById('theme-icon').className = targetTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    initCharts();
}

function populateMockData() {
    // Kept for Ticket Queue and Leaderboard UI
    const ticketBody = document.getElementById('ticket-body');
    if (ticketBody) {
        ticketBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:20px;">Loading live queue...</td></tr>';
        setTimeout(() => {
            const ticketTypes = ['MT5 Execution', 'Deposit Error', 'KYC Document', 'Spread Inquiry'];
            let html = '';
            for(let i=0; i<8; i++) {
                html += `<tr>
                    <td><strong>FX-90${i}</strong></td>
                    <td>Client ${1000+i}</td>
                    <td>${ticketTypes[i%4]}</td>
                    <td><span class="badge badge-pending">Pending</span></td>
                    <td>Agent ${i}</td>
                    <td>${i+5}m</td>
                </tr>`;
            }
            ticketBody.innerHTML = html;
        }, 800);
    }

    const leaderboard = document.getElementById('leaderboard');
    if (leaderboard) {
        leaderboard.innerHTML = '<div class="leaderboard-item"><span style="font-weight: 800; color: var(--primary);">98%</span> Elena Rodriguez <span class="status-badge status-top-performer">Top Performer</span></div>';
    }
}

// --- Chart Engine (Chart.js) ---
let volumeChartInstance = null;
function initCharts() {
    const ctx = document.getElementById('volumeChart');
    if (!ctx) return;
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const colorMain = isDark ? '#f8fafc' : '#1e293b';
    if (volumeChartInstance) volumeChartInstance.destroy();
    volumeChartInstance = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{ label: 'Chat Volume', data: [420, 580, 510, 690, 820, 310, 250], borderColor: '#3b82f6', fill: false }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: colorMain } } } }
    });
}

populateMockData();
