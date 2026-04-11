🟣 FORFX Supervisor Dashboard
A high-performance, data-dense command center designed specifically for the Support Supervisor and Mentor role at FORFX. This dashboard provides a real-time "bird's-eye view" of the support floor, enabling rapid intervention and agent coaching.

🚀 Live Features
📊 Advanced KPI Monitoring
The dashboard features an expanded grid of critical metrics to ensure SLA compliance:

Response Metrics: Real-time tracking of First Response Time (FRT) and Average Resolution Time.

Quality Metrics: First Contact Resolution (FCR %) and Daily CSAT scores.

Operational Health: Escalation Rate, 24h Backlog Growth, and real-time Agent Online/Offline status.

Critical Alerts: A pulsing SLA Breaching card that highlights urgent tickets requiring immediate supervisor intervention.

🔍 Multi-Dimensional Filtering
A dedicated management bar allows for deep-dive analysis across several vectors:

Temporal: Today, Last 7 Days, Last 30 Days, or Custom ranges.

Operations: Filter by Shift (Morning/Evening/Night) and Department (Payments, Trading, KYC, Technical).

Communications: Filter by Channel (Live Chat, Telegram, WhatsApp, Email) and Language (EN, FA, AR).

🤝 Mentoring & Performance Hub
Tiered Status Badges: Identify team needs at a glance with color-coded performance tiers:

🔵 Top Performer (High efficiency)

🟢 On Target (Steady performance)

🟡 Needs Attention (Coaching required)

🔴 Underperforming (Immediate intervention)

Live Mentor Feed: A simulated transcript view for monitoring agent-client interactions in real-time.

🛠 Technical Stack
Frontend: Pure HTML5, CSS3 (Modern Flexbox/Grid), and Vanilla JavaScript.

Data Visualization: Chart.js for interactive volume and resolution trending.

Architecture: Single Page Application (SPA) simulation with internal view routing.

Icons & Typography: FontAwesome 6.4 and Google Fonts (Inter).

Theme Engine: Robust Light/Dark mode toggle with persisted CSS variables.

📂 Project Structure
Plaintext
support-dashboard/
│
├── index.html          # Entire application logic, styles, and structure
└── README.md           # Documentation
💻 Setup & Usage
Clone the Repository:

Bash
git clone https://github.com/ramin-alizade/support-dashboard.git
Run Locally:
Simply open the index.html file in any modern web browser (Chrome, Safari, or Edge).

Authentication:
The login screen is currently simulated. Click "Initialize Session" with the default credentials to enter the dashboard.

Deployment:
This project is optimized for GitHub Pages. Enable it in your repository settings under the "Pages" tab to host the dashboard live.

🛡️ Support Context
This dashboard is configured for the FORFX brokerage environment, focusing on high-stakes escalations such as VIP withdrawal delays, MT5 server connectivity issues, and margin call support.

Maintained by the FORFX Support Team.
