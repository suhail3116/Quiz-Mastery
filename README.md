# 🚀 Antigravity — College Technical Quiz Arena & Real-Time Tournament Engine

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0.7-646CFF?logo=vite)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Realtime%20Cloud-3ECF8E?logo=supabase)](https://supabase.com/)
[![Netlify](https://img.shields.io/badge/Deploy-Netlify-00C7B7?logo=netlify)](https://netlify.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Presented by:**  
> **Dhaanish Ahmed Institute of Technology, Coimbatore**  
> *Department of Computer Science & Engineering*  
> **Created by:** **Suhail (CSE III Year)**

---

## 🌟 Overview

**Antigravity** is a high-performance, real-time college quiz championship web application engineered for auditoriums, big-screen projectors, live stage competitions, and multi-device interactive participation.

Built with **React 18**, **Vite**, and **Supabase Realtime PostgreSQL**, the application orchestrates continuous synchronous timers, instant fastest-finger buzzers, balanced rebound passing, privacy curtains for simultaneous team performance, and instant cloud-wide answer reveals without page refreshes.

---

## 🎯 Key Features & Tournament Modes

### 1. ✦ Cinematic Intro Splash Page
- Displays official institution presentation: **Dhaanish Ahmed Institute of Technology, Coimbatore**.
- Dynamic cloud asset initialization bar with smooth transitions.
- Developer attribution: *Created by Suhail (CSE III Year)*.

### 2. 🎮 Main Arena Stage (Equal Bucket Round)
- **Automatic Equal Partitioning**: Distributes tournament questions equally across teams (e.g. 65 questions divided among 4 teams).
- **Dual-Clock Engine**:
  - **⏱️ Per-Question Timer (20s)**: Auto-skips to the next question upon timeout with smooth circular SVG countdown.
  - **⏳ Continuous Total Round Timer (120s)**: Uninterrupted team round clock that transitions seamlessly to the Round Summary when expired.
- **Interactive Lifelines**: 50:50, Time Freeze (+15s), Double Down (+20 / -10 pts), and Audience Poll.

### 3. ⚡ Fastest Finger Buzzer Arena (Sub-Millisecond Multi-Device Sync)
- **Pre-Start Quizmaster Gate**: Master Key (**`123`**) authorization prevents premature question leaks.
- **Instant Game Launch**: Submitting the key simultaneously reveals the question, starts the reaction clock, and activates mobile buzzers.
- **Multi-Device Support**: Keyboards (`Q`, `W`, `E`, `R`), mobile touch buzzers (via QR code), and live winner spotlight.
- **Instant Zero-Refresh Answer Reveal**: Clicking `👁️ Reveal Answer` broadcasts immediately across all auditorium screens via WebSockets.

### 4. 🔄 In-Page Balance Rebound Round
- Questions unanswered or timed out during a team's round enter the **Balance Rebound Pool**.
- Stolen bonus points (+5 pts) are awarded dynamically to opposing teams.

### 5. 🔒 Simultaneous Team Privacy Mask
- Mask non-active team sheets (`🔒 Question Content Masked for Privacy`) to prevent peeking in auditoriums where teams sit side-by-side.

### 6. 📺 Fullscreen Theater Mode
- Massive font typography, live scoreboard carousel, and **fully interactive option selection (`A`, `B`, `C`, `D` or Keys `1`, `2`, `3`, `4`)** for stage projectors.

### 7. 🏆 3D Podium & Printable Certificates
- Live ranked leaderboard with gold, silver, and bronze podium heights.
- High-resolution gold-trimmed **Certificate of Excellence** generator with 1-click browser printing.

### 8. ⚙️ Admin Control Panel
- Manage team names, colors, timers, speed presets (Speed, Standard, Relaxed), question bank editor, CSV export, and complete tournament reset.
- Reset Admin Phone: `9043356776` | Default Admin Password: `123`.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | [React 18](https://react.dev/) (Functional Components & Custom Hooks) |
| **Build Tool & Bundler** | [Vite 6](https://vitejs.dev/) |
| **Database & Realtime Sync** | [Supabase](https://supabase.com/) (PostgreSQL & Realtime WebSocket Channels) |
| **Styling & Design System** | Custom CSS3 Vibrant Crystal Light Glassmorphism (`index.css`) |
| **Icons & Typography** | [Lucide React](https://lucide.dev/), Google Fonts (*Outfit*, *Plus Jakarta Sans*, *JetBrains Mono*) |
| **Deployment** | [Netlify](https://www.netlify.com/) (Single Page Application Redirects via `netlify.toml`) |

---

## 🚀 Quick Start & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/antigravity-quiz-app.git
cd antigravity-quiz-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Supabase Environment Variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://odjwbefjlelbxaimboyc.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Start Local Development Server
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

### 5. Build for Production
```bash
npm run build
```

---

## 🌐 Deploying to Netlify

1. Connect your GitHub repository to [Netlify](https://app.netlify.com/).
2. Build Settings:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
3. Environment Variables:
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Netlify will automatically handle SPA routing using the included `netlify.toml`.

---

## 👨‍💻 Author & Credits

- **Developer:** **Suhail** (CSE III Year)
- **Institution:** **Dhaanish Ahmed Institute of Technology, Coimbatore**
- **Department:** Department of Computer Science & Engineering

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
