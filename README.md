FORFX Supervisor Dashboard
A high-performance, data-dense command center designed specifically for the Support Supervisor and Mentor role at FORFX. This dashboard provides a real-time "bird's-eye view" of the support floor, enabling rapid intervention and agent coaching.

 Live Features
Advanced KPI Monitoring
The dashboard features an expanded grid of critical metrics to ensure SLA compliance:

Response Metrics: Real-time tracking of First Response Time (FRT) and Average Resolution Time.

Quality Metrics: First Contact Resolution (FCR %) and Daily CSAT scores.

Operational Health: Escalation Rate, 24h Backlog Growth, and real-time Agent Online/Offline status.

Critical Alerts: A pulsing SLA Breaching card that highlights urgent tickets requiring immediate supervisor intervention.

Multi-Dimensional Filtering
A dedicated management bar allows for deep-dive analysis across several vectors:

Temporal: Today, Last 7 Days, Last 30 Days, or Custom ranges.

Operations: Filter by Shift (Morning/Evening/Night) and Department (Payments, Trading, KYC, Technical).

Communications: Filter by Channel (Live Chat, Telegram, WhatsApp, Email) and Language (EN, FA, AR).

Mentoring & Performance Hub
Tiered Status Badges: Identify team needs at a glance with color-coded performance tiers:

🔵 Top Performer (High efficiency)

🟢 On Target (Steady performance)

🟡 Needs Attention (Coaching required)

🔴 Underperforming (Immediate intervention)

Live Mentor Feed: A simulated transcript view for monitoring agent-client interactions in real-time.

Technical Stack
Frontend: Pure HTML5, CSS3 (Modern Flexbox/Grid), and Vanilla JavaScript.

Data Visualization: Chart.js for interactive volume and resolution trending.

Architecture: Single Page Application (SPA) simulation with internal view routing.

Icons & Typography: FontAwesome 6.4 and Google Fonts (Inter).

Theme Engine: Robust Light/Dark mode toggle with persisted CSS variables.

 Project Structure
support-dashboard/
│
├── index.html          # Entire application logic, styles, and structure
└── README.md           # Documentation
## Setup & Usage

### 1. Clone the Repository
```bash
git clone https://github.com/ramin-alizade/support-dashboard.git
cd support-dashboard
```

### 2. Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database

### 3. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Copy `.env.example` to `.env`.
   - Update the `.env` file with your database credentials and preferred settings.
4. Set up the database (using Prisma):
   ```bash
   npx prisma migrate dev
   ```
5. Start the backend server:
   ```bash
   npm start
   ```
   The backend will run on `http://localhost:5001`.

### 4. Frontend Setup
1. Ensure the backend is running.
2. From the project root, open `index.html` using a local web server (e.g., VS Code Live Server).
3. The frontend is configured to communicate with the backend at `http://localhost:5001`.
   - If using VS Code Live Server, it typically runs on `http://localhost:5500`.

### Authentication
The login screen now connects to the backend API. Use the credentials created during the registration process or as seeded in your database.

Deployment:
This project is optimized for GitHub Pages. Enable it in your repository settings under the "Pages" tab to host the dashboard live.

 Support Context
This dashboard is configured for the FORFX brokerage environment, focusing on high-stakes escalations such as VIP withdrawal delays, MT5 server connectivity issues, and margin call support.

Maintained by the FORFX Support Team.
