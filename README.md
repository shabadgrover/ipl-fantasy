<div align="center">
  <img src="public/Logos/CSK.png" alt="CSK" width="50" height="50" style="margin: 0 5px;" />
  <img src="public/Logos/DC.png" alt="DC" width="50" height="50" style="margin: 0 5px;" />
  <img src="public/Logos/GT.png" alt="GT" width="50" height="50" style="margin: 0 5px;" />
  <img src="public/Logos/KKR.png" alt="KKR" width="50" height="50" style="margin: 0 5px;" />
  <img src="public/Logos/LSG.png" alt="LSG" width="50" height="50" style="margin: 0 5px;" />
  <img src="public/Logos/MI.png" alt="MI" width="50" height="50" style="margin: 0 5px;" />
  <img src="public/Logos/PBKS.png" alt="PBKS" width="50" height="50" style="margin: 0 5px;" />
  <img src="public/Logos/RCB.png" alt="RCB" width="50" height="50" style="margin: 0 5px;" />
  <img src="public/Logos/RR.png" alt="RR" width="50" height="50" style="margin: 0 5px;" />
  <img src="public/Logos/SRH.png" alt="SRH" width="50" height="50" style="margin: 0 5px;" />
  
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
├── public/                 # Static assets (Logos, Excel data files)
├── src/                    # Main Frontend Source Code
│   ├── components/         # React Components (Leaderboard, Teams, Schedule, etc.)
│   ├── data/               # Static application data (matches.js)
│   ├── utils/              # Helper functions (excelParser.js, etc.)
│   ├── App.jsx             # Root React component
│   └── index.css           # Global Tailwind styles
├── scripts/                # Node.js scripts for match calculation & data ingestion
├── data_dumps/             # Historical data backups and JSON state dumps
├── README.md               # Project documentation
├── package.json            # Node dependencies and scripts
├── tailwind.config.js      # Tailwind theme and plugin configuration
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
  Built with ❤️ for cricket fans worldwide.
</p>
