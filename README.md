# 🏆 DAIT QUIZ MASTERY — College Technical Quiz Championship Engine

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0.7-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Realtime%20PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Netlify](https://img.shields.io/badge/Deploy-Netlify-00C7B7?style=for-the-badge&logo=netlify)](https://netlify.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

> **🏛️ Presented by:**  
> **Dhaanish Ahmed Institute of Technology, Coimbatore**  
> *Department of Computer Science & Engineering*  
> **👨‍💻 Created by:** **Suhail (CSE III Year)**

---

## 🌟 Overview

**DAIT Quiz Mastery** is an auditorium-grade, multi-device, real-time college quiz championship web application. Designed for stage projectors, multi-computer team battles, mobile participants, and live audiences, it pairs high-speed UI responsiveness with sub-millisecond cloud synchronization via **Supabase Realtime PostgreSQL**.

Whether running a 4-team simultaneous arena round, an instant fastest-finger buzzer challenge, or an interactive question sheet with rebound pass questions, **DAIT Quiz Mastery** ensures zero-lag updates without manual page refreshes.

---

## 🎯 Tournament Modules & Features

```
                                  ┌───────────────────────────┐
                                  │   ✦ CINEMATIC INTRO ✦     │
                                  │   Dhaanish Ahmed Inst.    │
                                  └─────────────┬─────────────┘
                                                │
         ┌──────────────────────────────────────┼──────────────────────────────────────┐
         │                                      │                                      │
         ▼                                      ▼                                      ▼
┌──────────────────┐                  ┌──────────────────┐                  ┌──────────────────┐
│  ⚔️ BATTLE ARENA  │                  │  ⚡ BUZZER ARENA  │                  │  📝 QUESTION TAB  │
│  4-Team Realtime │                  │  Fastest Finger  │                  │  Sheet Submit &  │
│  Simultaneous    │                  │  Instant Winner  │                  │  Pass Questions  │
└────────┬─────────┘                  └────────┬─────────┘                  └────────┬─────────┘
         │                                      │                                      │
         └──────────────────────────────────────┼──────────────────────────────────────┘
                                                │
                                                ▼
                                  ┌───────────────────────────┐
                                  │   🏆 SCORES & CERTIFICATES │
                                  │   3D Podium + A4 Gold Cert│
                                  └───────────────────────────┘
```

### 1. ✦ 7-Second Cinematic Presentation Intro
- **Institutional Branding**: Features *Dhaanish Ahmed Institute of Technology, Coimbatore* and *Department of Computer Science & Engineering*.
- **Smooth Gradient Progress**: Neon-lit 7-second countdown animation with instant skip capability (**`🚀 ENTER ARENA NOW →`**).
- **Attribution**: Permanent developer acknowledgment (*Created by Suhail, CSE III Year*).

### 2. ⚔️ Live 4-Team Simultaneous Battle Matrix
- **Equal Question Partitioning**: Evenly slices tournament question sets across all active teams.
- **Persistent Single-Team Device Lock**:
  - Each participant computer or mobile phone claims a specific team (**Kernel Kings**, **Daemon Knights**, **Byte Warriors**, **Process Titans**).
  - Selected teams **automatically disappear from other devices' selection hubs** to prevent duplicate claims.
  - Bound devices automatically reopen straight into their assigned team on tab switch or page refresh.
- **Dual-Clock Realtime Engine**: Synchronous question countdown timers (20s) and total round clocks (120s) with audio ticks.
- **Admin Battle Matrix**: Real-time progress bars, live answering indicators, and exclusive **`🎮 Play →`** controls.

### 3. ⚡ Fastest Finger Buzzer Arena
- **Pre-Start Security Gate**: Admin authorization protects questions from premature leaks.
- **Sub-Millisecond Multi-Device Sync**: Mobile buzzers, physical keyboard keys (`Q`, `W`, `E`, `R` / `1`, `2`, `3`, `4`), and instant winner spotlights.
- **Zero-Refresh Answer Reveal**: Admin broadcast reveals correct answers instantly across all connected screens.

### 4. 📝 Interactive Questions Sheet & Pass Round (+5 pts)
- **Grant & Submit Flow**: Once a team finishes their set, clicking **`🎯 Grant & Submit Sheet Answers`** locks their score and removes them from subsequent primary selection.
- **Universal Pass Questions**: All remaining teams can answer passed questions to earn **+5 bonus points**.

### 5. 👥 Dedicated Teams Management Tab
- **Admin-Controlled Team Count**: Select between 2 to 6 participating teams.
- **Independent Team Name Editing**:
  - Customize team names with a dedicated **`💾 Save Team [X]`** button.
  - Saved teams disappear immediately from the editing queue into a locked state (**`🎉 All Team Names Saved & Locked!`**).

### 6. 📜 Golden Certificate of Excellence (A4 Printable)
- **Official Recognition**: Golden double-bordered certificate with institutional crest, student/team achievement, category, score, and formal commendation text.
- **Clean Signature Line**: Elegant verification area for faculty and institutional dignitaries.
- **Instant Browser Print & PDF Export**: Optimized CSS `@media print` ensures full-page landscape layout without blank pages.

### 7. 🏆 3D Podium & Real-Time Leaderboard
- **3D Championship Heights**: Dynamic gold (1st), silver (2nd), and bronze (3rd) pillars with floating medals.
- **Live Score Carousel**: Top navbar marquee tracks scores in real time across all views.

### 8. 🛡️ Master Tournament Reset (Admin Exclusivity)
- Single-click **`🔄 Reset Tournament`** cleans scores to `0 pts`, resets team device bindings, purges local caches, and updates Supabase Cloud across all connected devices simultaneously.

---

## 📸 Interface Showcase

| View | Highlights |
| :--- | :--- |
| **Intro Presentation** | Full-screen institutional presentation with neon countdown animation |
| **Battle Matrix** | Real-time 4-team progress cards with live answer streaming |
| **Buzzer Gate** | Secure Quizmaster launch gate with sub-millisecond reaction tracking |
| **Question Sheet** | Sequential question answering, automatic scoring & passed rebounds |
| **Certificate Generator** | High-resolution gold-trimmed award ready for 1-click printing |
| **Leaderboard Podium** | Ranked podium heights with gold/silver/bronze trophies & confetti |

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | [React 18](https://react.dev/) | High-performance reactive UI with custom engine hooks |
| **Build Tool & Bundler** | [Vite 6](https://vitejs.dev/) | Instant hot-reloading and optimized production builds |
| **Cloud Database** | [Supabase](https://supabase.com/) | Realtime WebSocket channels & PostgreSQL state persistence |
| **Styling & Theme** | Modern Glassmorphism CSS3 | High-contrast dark typography on light buttons, responsive layouts |
| **Hosting & CI/CD** | [Netlify](https://netlify.com/) | Global CDN deployment with SPA rewrite rules (`netlify.toml`) |

---

## 🚀 Quick Start & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/)

### 1. Clone & Install
```bash
git clone https://github.com/your-username/antigravity-quiz-app.git
cd antigravity-quiz-app
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL=https://odjwbefjlelbxaimboyc.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Start Local Development Server
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

### 4. Production Build
```bash
npm run build
```

---

## 🌐 Netlify Deployment

1. Push your repository to **GitHub**.
2. Link the repository in your [Netlify Dashboard](https://app.netlify.com/).
3. Configure Build Settings:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
4. Add Environment Variables in **Site configuration → Environment variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy Site** — your live quiz championship is online!

---

## 👨‍💻 Author & Institutional Credits

- **Developer:** **Suhail** (CSE III Year)
- **Institution:** **Dhaanish Ahmed Institute of Technology, Coimbatore**
- **Department:** Department of Computer Science & Engineering
- **Tournament:** **DAIT Quiz Mastery**

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
