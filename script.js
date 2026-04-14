// --- Core Navigation & Screen Switching ---
function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    
    if (screenId === 'main-dashboard') {
        // Initialize Charts only after dashboard becomes visible
        setTimeout(initCharts, 100);
    }
}

function switchView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick').includes(viewId));
    });

    // Show/Hide filter bar based on view
    const filterBar = document.getElementById('filter-bar');
    if (viewId === 'overview' || viewId === 'tickets' || viewId === 'escalations') {
        filterBar.style.display = 'flex';
    } else {
        filterBar.style.display = 'none';
    }
}

// --- Filter Management Logic ---
function setShift(btn, shift) {
    const group = btn.parentElement;
    group.querySelectorAll('.segment-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilters();
}

function applyFilters() {
    const viewContainer = document.querySelector('.view-container');
    viewContainer.classList.add('loading-blur');
    
    setTimeout(() => {
        viewContainer.classList.remove('loading-blur');
        
        // Randomize KPI values
        document.querySelectorAll('.kpi-card').forEach(card => {
            const labelEl = card.querySelector('.kpi-label');
            if (!labelEl) return;
            const label = labelEl.innerText;
            const valueEl = card.querySelector('.kpi-value');
            if (!valueEl) return;
            
            if (label.includes('Avg Response Time') || label.includes('First Response')) {
                valueEl.innerText = Math.floor(Math.random() * 40 + 20) + 's';
            } else if (label.includes('CSAT')) {
                valueEl.innerText = (4.5 + Math.random() * 0.5).toFixed(1) + '/5.0';
            } else if (label.includes('Active Live Chats') || label.includes('Open Global Tickets')) {
                valueEl.innerText = Math.floor(Math.random() * 150 + 20);
            } else if (label.includes('Avg Resolution Time')) {
                valueEl.innerText = Math.floor(Math.random() * 10 + 10) + 'm ' + Math.floor(Math.random() * 60) + 's';
            } else if (label.includes('FCR') || label.includes('Escalation Rate')) {
                valueEl.innerText = (Math.random() * 15 + 80).toFixed(0) + '%';
                if (label.includes('Escalation')) valueEl.innerText = (Math.random() * 5 + 2).toFixed(1) + '%';
            } else if (label.includes('Backlog Growth')) {
                valueEl.innerText = '+' + Math.floor(Math.random() * 20 + 5) + ' tickets';
            } else if (label.includes('Agents Status')) {
                const online = Math.floor(Math.random() * 10 + 10);
                valueEl.innerText = `${online} Online / ${Math.floor(Math.random() * 5)} Offline`;
            } else if (label.includes('SLA Breaching')) {
                valueEl.innerText = Math.floor(Math.random() * 5) + ' Tickets';
            }
        });
        
        populateMockData();
        initCharts(true); // true means randomized
    }, 500);
}

function handleLogin(e) {
    e.preventDefault();
    switchScreen('main-dashboard');
}

// --- Theme Engine ---
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const targetTheme = currentTheme === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', targetTheme);
    document.getElementById('theme-icon').className = targetTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    // Re-render charts for theme visibility
    initCharts();
}

// --- Mock Data Population ---
function populateMockData() {
    const channel = document.getElementById('filter-channel')?.value || 'Live Chat';
    const lang = document.getElementById('filter-lang')?.value || 'EN';
    const dept = document.getElementById('filter-dept')?.value || 'Trading';
    
    // Populate Ticket Table
    const ticketTypes = ['MT5 Execution', 'Deposit Error', 'KYC Document', 'Spread Inquiry', 'Withdrawal', 'MT5 Login', 'API Issue', 'Speed Delay'];
    const statuses = ['Open', 'Pending', 'Resolved'];
    const agents = ['Elena R.', 'Marcus C.', 'Sarah S.', 'Kevin M.'];
    
    const tickets = [];
    for (let i = 0; i < 12; i++) {
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        tickets.push({
            id: `FX-${900 + i}`,
            name: `Client ${Math.floor(Math.random() * 9000 + 1000)}`,
            type: `${ticketTypes[Math.floor(Math.random() * ticketTypes.length)]} (${channel} - ${lang.split(' ')[0]})`,
            status: status,
            agent: status === 'Open' && Math.random() > 0.5 ? 'None' : agents[Math.floor(Math.random() * agents.length)],
            wait: Math.floor(Math.random() * 45 + 1) + 'm'
        });
    }

    const ticketBody = document.getElementById('ticket-body');
    if (ticketBody) {
        ticketBody.innerHTML = tickets.map(t => `
            <tr>
                <td><strong>${t.id}</strong></td>
                <td>${t.name}</td>
                <td>${t.type}</td>
                <td><span class="badge badge-${t.status.toLowerCase()}">${t.status}</span></td>
                <td>${t.agent}</td>
                <td>${t.wait}</td>
            </tr>
        `).join('');
    }

    // Update Escalations to reflect filters
    const escalationList = document.querySelector('.escalation-list');
    if (escalationList) {
        escalationList.innerHTML = `
            <div class="alert-item">
                <div><h4>VIP Withdrawal Delay (${dept})</h4><p>Client: #88219 | ${channel} | Language: ${lang} | Delay: 4h+</p></div>
                <button class="btn-main" style="width: auto; padding: 10px 20px; background: var(--crimson);">Intervene</button>
            </div>
            <div class="alert-item">
                <div><h4>High Volume Alert: ${channel}</h4><p>${Math.floor(Math.random()*40 + 20)} sessions active in ${lang} queue for ${dept}.</p></div>
                <button class="btn-main" style="width: auto; padding: 10px 20px; background: var(--crimson);">Escalate</button>
            </div>
        `;
    }

    // Populate Leaderboard
    const agentList = [
        { name: 'Elena Rodriguez', score: 98, status: 'Top Performer', class: 'top-performer', dot: 'blue' },
        { name: 'Marcus Chen', score: 94, status: 'On Target', class: 'on-target', dot: 'green' },
        { name: 'Sarah Smith', score: 91, status: 'On Target', class: 'on-target', dot: 'green' },
        { name: 'David Miller', score: 88, status: 'On Target', class: 'on-target', dot: 'green' },
        { name: 'Kevin Durant', score: 72, status: 'Needs Attention', class: 'needs-attention', dot: 'amber' },
        { name: 'Linda Carter', score: 64, status: 'Underperforming', class: 'underperforming', dot: 'red' }
    ];

    const leaderboard = document.getElementById('leaderboard');
    if (leaderboard) {
        leaderboard.innerHTML = agentList.map(a => `
            <div class="leaderboard-item">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="font-weight: 800; color: var(--primary); width: 40px;">${a.score}%</span>
                    <span style="font-weight: 600;">${a.name}</span>
                </div>
                <span class="status-badge status-${a.class}">
                    <div class="status-dot dot-${a.dot}"></div>
                    ${a.status}
                </span>
            </div>
        `).join('');
    }
}

// --- Chart Engine ---
let volumeChartInstance = null;

function initCharts(randomize = false) {
    const ctx = document.getElementById('volumeChart');
    if (!ctx) return;

    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const colorMain = isDark ? '#f8fafc' : '#1e293b';
    const colorGrid = isDark ? '#1e293b' : '#e2e8f0';

    if (volumeChartInstance) volumeChartInstance.destroy();

    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    let volumeData = [420, 580, 510, 690, 820, 310, 250];
    let rateData = [92, 88, 95, 85, 98, 99, 97];

    if (randomize) {
        volumeData = labels.map(() => Math.floor(Math.random() * 600 + 200));
        rateData = labels.map(() => Math.floor(Math.random() * 15 + 85));
    }

    volumeChartInstance = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Chat Volume',
                    data: volumeData,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Resolution Rate (%)',
                    data: rateData,
                    borderColor: '#10b981',
                    borderDash: [5, 5],
                    tension: 0.4,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: colorMain, font: { weight: 'bold' } } } },
            scales: {
                y: { 
                    beginAtZero: true, grid: { color: colorGrid }, 
                    ticks: { color: colorMain }, title: { display: true, text: 'Volume', color: colorMain }
                },
                y1: { 
                    position: 'right', grid: { display: false }, 
                    ticks: { color: colorMain }, title: { display: true, text: 'Resolution %', color: colorMain }
                },
                x: { grid: { display: false }, ticks: { color: colorMain } }
            }
        }
    });
}

// Initialize Mock Data on Script Load
populateMockData();
