# ITZFIZZ — Scroll-Driven Supercar Hero Animation 🏎️⚡

An interactive, scroll-driven hero section web animation featuring dynamic kinetic motion, McLaren 720S top-down telemetry, letter-by-letter kinetic text illumination, floating glassmorphic metric cards, and synthesized audio.

---

## 🚀 Live Demo & Links

- **Live Demo (GitHub Pages):** [https://avni2511.github.io/itzfizz/](https://avni2511.github.io/itzfizz/)
- **GitHub Repository:** [https://github.com/Avni2511/itzfizz](https://github.com/Avni2511/itzfizz)

---

## ✨ Features

1. **Scroll-Driven Kinetic Motion**:
   - Supercar traverses the horizontal road track mapped directly to the user's scroll progress using GSAP ScrollTrigger with buttery smooth scrubbing (`scrub: 1.2`).
   - Dynamic glowing neon trail expands behind the vehicle in real-time.
   - Dual high-beam projection headlight effects and chassis underglow.

2. **Kinetic Letter-by-Letter Reveal**:
   - The headline `WELCOME ITZFIZZ` is dynamically illuminated letter-by-letter as the supercar's headlights cross each character's spatial bounding box.

3. **Floating Metric Cards & Animated Counters**:
   - Four glassmorphic statistic cards (`58%`, `23%`, `27%`, `40%`) animate smoothly into view along the scroll path.
   - Animated count-up numbers and progress bars.
   - Interactive 3D tilt micro-interactions on mouse hover.

4. **Live Telemetry & Cockpit HUD**:
   - Dynamic speedometer calculating real-time KM/H (0 to 341 km/h) based on scroll velocity and position.
   - Automatic dual-clutch transmission gear shift indicator (`N` -> `1ST` -> `7TH`).
   - Supercharger boost meter and scroll progress readout.

5. **Web Audio API Engine Synthesizer**:
   - Optional interactive engine sound generator that dynamically shifts pitch and filter resonance based on your scroll acceleration.

---

## 🛠️ Tech Stack

- **HTML5** (Semantic Structure & SEO)
- **CSS3** (Custom Properties, Glassmorphism, Responsive Grid & Flexbox)
- **JavaScript (ES6+)**
- **GSAP 3.12** & **ScrollTrigger** (Scroll Physics & Pinning)
- **Lenis** (Momentum Smooth Scroll)
- **Web Audio API** (Procedural Engine Audio)
- **Lucide Icons**

---

## 💻 Local Setup & Development

1. Clone the repository:
   ```bash
   git clone https://github.com/Avni2511/itzfizz.git
   cd itzfizz
   ```

2. Open `index.html` in any modern web browser or start a local server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   ```
   Open `http://localhost:8000` in your browser.

---

## 🌐 GitHub Pages Deployment

To enable GitHub Pages:
1. Go to repository **Settings** -> **Pages**.
2. Under **Build and deployment** -> **Branch**, select `main` (or `master`) and folder `/ (root)`.
3. Click **Save**. The live URL will be accessible at: `https://avni2511.github.io/itzfizz/`
