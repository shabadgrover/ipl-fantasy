<div align="center">
  <img src="public/Logos/dark/csk.png" alt="CSK" width="50" height="50" style="margin: 0 5px;" />
  <img src="public/Logos/dark/dc.png" alt="DC" width="50" height="50" style="margin: 0 5px;" />
  <img src="public/Logos/dark/gt.png" alt="GT" width="50" height="50" style="margin: 0 5px;" />
  <img src="public/Logos/dark/kkr.png" alt="KKR" width="50" height="50" style="margin: 0 5px;" />
  <img src="public/Logos/dark/lsg.png" alt="LSG" width="50" height="50" style="margin: 0 5px;" />
  <img src="public/Logos/dark/mi.png" alt="MI" width="50" height="50" style="margin: 0 5px;" />
  <img src="public/Logos/dark/pbks.png" alt="PBKS" width="50" height="50" style="margin: 0 5px;" />
  <img src="public/Logos/dark/rcb.png" alt="RCB" width="50" height="50" style="margin: 0 5px;" />
  <img src="public/Logos/dark/rr.png" alt="RR" width="50" height="50" style="margin: 0 5px;" />
  <img src="public/Logos/dark/srh.png" alt="SRH" width="50" height="50" style="margin: 0 5px;" />
  
  <h1 align="center">🏏 IPL Fantasy League 2026</h1>
  
  <p align="center">
    <strong>The Ultimate Fantasy Cricket Experience for the Indian Premier League</strong>
  </p>

  <p align="center">
    <a href="https://ipl-fantasy-swart.vercel.app/" target="_blank">
      <img src="https://img.shields.io/badge/Live_Website-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Website" />
    </a>
  </p>

  <p align="center">
    <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /></a>
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" /></a>
    <a href="https://www.framer.com/motion/"><img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" /></a>
  </p>
</div>

<hr />

## 📖 Overview

A visually stunning, dynamic web application that allows users to track their custom fantasy cricket teams for the Indian Premier League. Built with modern web technologies, this platform delivers real-time leaderboard updates, comprehensive squad performance analytics, and a beautiful UI/UX designed specifically for the ultimate cricket enthusiast.

## 🌟 Key Features

- **🏆 Dynamic Leaderboard System**
  - Live tracking of fantasy team points.
  - Trend indicators (⬆️ ⬇️) visualizing rank progression between matches.
  - Detailed point breakdown by individual player.

- **📊 Squad Insights & Progression**
  - Comprehensive team management views.
  - Visual tracking of point accumulation throughout the season.
  - Strategy analysis for upcoming fixtures and potential impact players.

- **📅 Automated Schedule & Match Tracking**
  - Full tournament fixture tracking from Match 1 to the Final.
  - Real-time status differentiation for completed vs. upcoming matches.

- **✨ Stunning Modern UI/UX**
  - Built with **Framer Motion** for smooth, buttery animations and micro-interactions.
  - Glassmorphism design elements and highly responsive layouts.
  - Seamless **Dark / Light Mode** adaptation.

## 🛠️ Technology Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend Framework** | React.js, Vite |
| **Styling & Layout** | Tailwind CSS, PostCSS |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Data Processing** | Node.js (Scripts), `xlsx` (Excel Parsing) |

## 📂 Project Architecture

```text
ipl-fantasy/
├── backend/                # Node.js / Express API (Phase 2+)
│   └── src/                # routes, controllers, services, middleware
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets (Logos, Excel data files)
├── src/                    # React frontend source code
│   ├── config/             # Season-specific configuration (season2026.js)
│   ├── domain/             # Pure fantasy/domain logic (Phase 1)
│   ├── components/         # React components
│   ├── data/               # Static application data (matches.js)
│   └── utils/              # Excel parser, snapshot helpers
├── scripts/                # Node.js scripts for match calculation & data ingestion
├── data_dumps/             # Historical data backups and JSON state dumps
├── package.json            # Frontend dependencies and root scripts
└── vite.config.js          # Vite bundler configuration
```

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v16.x or higher recommended)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shabadgrover/ipl-fantasy.git
   cd ipl-fantasy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **View the application**
   Open your browser and navigate to `http://localhost:5173`

## 🗄️ Backend Setup (Phase 2)

The backend is a separate Express API in `backend/` using Prisma and PostgreSQL. The existing React frontend continues to use `public/data.xlsx` independently.

### Prerequisites

- **Node.js** v18.x or higher (v20+ recommended)
- **PostgreSQL** 14+ running locally or remotely

### Environment variables

Copy the example file and edit your local values:

```bash
cp .env.example .env
```

Required variables:

| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string, e.g. `postgresql://postgres:password@localhost:5432/ipl_fantasy?schema=public` |
| `PORT` | Backend port (default `3001`) |
| `JWT_SECRET` | Secret key for signing authentication tokens |
| `JWT_EXPIRES_IN` | Token lifetime (default `7d`) |

### Install and migrate

```bash
# Frontend dependencies (root)
npm install

# Backend dependencies
cd backend && npm install && cd ..

# Generate Prisma Client
npm run db:generate

# Apply database migrations
npm run db:migrate:deploy
```

For local development with migration creation:

```bash
npm run db:migrate
```

### Start the backend

```bash
npm run backend:dev
```

The API listens on `http://localhost:3001` by default.

### Test the health endpoint

```bash
curl http://localhost:3001/api/health
```

Expected response when the database is connected:

```json
{
  "status": "ok",
  "message": "IPL Fantasy API is running",
  "database": "connected",
  "timestamp": "..."
}
```

### Run backend tests

Requires PostgreSQL configured in `.env`:

```bash
npm run test:backend
```

### Current database tables

| Table | Purpose |
| :--- | :--- |
| `User` | Platform users (id, name, email) |
| `League` | Fantasy leagues (name, owner, invite code, privacy, status) |
| `LeagueMember` | User membership in a league (role: OWNER / MEMBER) |
| `Season` | Seasons within a league (year, status) |

### Authentication API (Phase 3)

```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Shabad", "email": "shabad@example.com", "password": "securepass123"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "shabad@example.com", "password": "securepass123"}'

# Current user (requires Bearer token from register/login)
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer <token>"
```

The React frontend still uses the 2026 access-code login independently. Backend auth will be connected in a later phase.

### League API (Phase 2)

```bash
# Create a league (owner must exist in User table first)
curl -X POST http://localhost:3001/api/leagues \
  -H "Content-Type: application/json" \
  -d '{"name": "My IPL League", "ownerId": "<user-id>"}'

# Retrieve a league
curl http://localhost:3001/api/leagues/<league-id>
```

## ⚙️ How Data is Processed

This application relies on a modular data ingestion pipeline:
1. **Data Ingestion:** Match points are generated via modular Node.js scripts located in the `scripts/` directory after every real-world IPL match.
2. **State Updates:** Computed points are pushed to `public/data.xlsx` and parsed dynamically on the client side using the `xlsx` utility.
3. **Rank Processing:** `App.jsx` handles ranking differences and passes trending data to the `Leaderboard` component to generate visual UI shifts and arrows.

## 🤝 Contributing

Contributions, issues, and feature requests are always welcome! 

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Authors

**Shabad Grover & Ankit Kumar**  
- GitHub: [@shabadgrover](https://github.com/shabadgrover/)
- GitHub: [@Ankit2729](https://github.com/Ankit2729)

<hr />
<p align="center">
  PLease star my repo:).
</p>
