# 🚀 NEO Tracker - NASA Asteroids Dashboard

[![React](https://img.shields.io/badge/React-18.2-blue?logo=react)](https://react.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.3-purple?logo=tailwind-css)](https://tailwindcss.com/)
[![NASA API](https://img.shields.io/badge/NASA_API-NeoWs-green)](https://api.nasa.gov/)

<details>
<summary>📌 Table of Contents</summary>

1. [Features](#-features)
2. [Screenshots](#-screenshots) 
3. [Installation](#-installation)
4. [Configuration](#%EF%B8%8F-configuration)
5. [Run Locally](#-run-locally)
6. [Tech Stack](#-tech-stack)
7. [FAQ](#-faq)
</details>

## 🌟 Features
- Real-time asteroid tracking
- Interactive charts (Bar/Area)
- Hazardous asteroid alerts
- 7-day search history
- Responsive design


// Example API call
fetch(`https://api.nasa.gov/neo/rest/v1/feed?api_key=${API_KEY}`)
  .then(res => res.json())
  .then(data => setAsteroids(data));
🖼️ Screenshots
Dashboard and	Asteroid Details
<img width="1884" height="677" alt="image" src="https://github.com/user-attachments/assets/cd6757cf-9fca-4738-b994-a47c5cee80e5" />


<img width="1901" height="752" alt="image" src="https://github.com/user-attachments/assets/7cd77787-cd46-447a-87aa-643ae886c1f3" />


<img width="1893" height="895" alt="image" src="https://github.com/user-attachments/assets/85d1ce1f-fd30-4033-9561-6b3b37296faa" />


<img width="1895" height="932" alt="image" src="https://github.com/user-attachments/assets/a1c8b2bd-35ba-4d22-b514-999450a9cddf" />




📥 Installation
bash
git clone https://github.com/your-repo/neo-tracker.git
cd neo-tracker
npm install
⚙️ Configuration
Get NASA API key here

Create .env file:

env
VITE_NASA_API_KEY=your_api_key_here
🏃 Run Locally
bash
npm run dev
Then open: http://localhost:5173

<details> <summary>🛠 Build Commands</summary>
Command	Action
npm run build	Production build
npm run preview	Test production build
npm run lint	Run ESLint
</details>
🧰 Tech Stack
Frontend: React + Vite

Styling: Tailwind CSS

Charts: Recharts

Icons: Lucide React

Date Handling: date-fns

❓ FAQ
<details> <summary>Why are my charts not full-width?</summary>
Add this to your chart container:

jsx
<div className="w-full h-[400px]">
  <ResponsiveContainer width="100%" height="100%">
    {/* Chart components */}
  </ResponsiveContainer>
</div>
</details><details> <summary>How to fix API rate limits?</summary>
NASA's API has 1000 requests/hour limit. Cache responses using:

javascript
const [data, setData] = useState(() => {
  const cached = localStorage.getItem('asteroidData');
  return cached ? JSON.parse(cached) : null;
});
</details>
📜 License
MIT © Shaishta Parween 

text

**Interactive Features:**
1. Collapsible sections (click to expand)
2. Copy-paste ready code blocks
3. Badges for quick tech overview
4. Responsive image placeholders
5. FAQ with solutions to common issues

To use this:
1. Save as `README.md`
2. Replace placeholder images with your actual screenshots
3. Update the NASA API key instructions
4. Add your license info


