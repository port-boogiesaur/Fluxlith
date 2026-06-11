<div align="center">
  <h1>🎬 FLUXLITH</h1>
  <p><strong>A Premium Cinematic Streaming & Discovery Interface</strong></p>

  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
</div>

<br />

> Fluxlith bridges the gap between massive media databases and seamless user experience through a fast, highly responsive, and beautifully designed streaming application architecture.

---

## 📋 Table of Contents
1. [Core Features](#-core-features)
2. [Project Structure](#-project-structure)
3. [Prerequisites](#-prerequisites)
4. [Local Development Setup](#-local-development-setup)
5. [Database & API Guidelines](#%EF%B8%8F-database--api-guidelines)
6. [Component Standards](#-component-standards)

---

## ✨ Core Features

* **Cinematic UI/UX:** A dark-themed, edge-to-edge design with premium CSS hover states, custom scrollbars, and a native-app feel.
* **Dynamic Sidebar:** A fluid, Gemini-style collapsible navigation sidebar that preserves layout integrity.
* **Live Search:** Instant, debounced search functionality querying the entire TMDB database with click-outside closure.
* **Auto-Scaling Grid:** A smart CSS grid layout (`repeat(auto-fill, minmax)`) that perfectly scales movie posters without awkward stretching.
* **Dedicated Playback:** Integrated watch pages for Movies, TV Shows, and Anime via Vidsync.

---

## 🏗️ Project Structure

```text
fluxlith/
├── public/                 # Static assets
├── src/
│   ├── lib/                # Utilities and error handling (errorHandler.ts)
│   ├── App.tsx             # Root router & layout wrapper
│   ├── PlayerPage.tsx      # Dynamic media player component
│   ├── index.css           # Global styles and Tailwind imports
│   └── main.tsx            # React DOM entry point
├── .env                    # Local environment variables (IGNORED BY GIT)
├── eslint.config.js        # Linter configuration
└── vite.config.ts          # Vite bundler configuration
```

---

## 📦 Prerequisites

Before cloning the repository, ensure you have the following installed:

* [Node.js](https://nodejs.org/) (v18 or higher)
* [Git](https://git-scm.com/)
* A free API key from [The Movie Database (TMDB)](https://www.themoviedb.org/documentation/api)

---

## 💻 Local Development Setup

### 1. Clone & Install
```bash
git clone
cd fluxlith
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory. **Do not commit this file.** 
```env
VITE_TMDB_API_KEY=<insert-your-tmdb-api-key>
```

### 3. Launch the App
```bash
npm run dev
```
The application will boot up at `http://localhost:3000` or `http://localhost:5173` (depending on your Vite config).

---

## 🗄️ Database & API Guidelines

### Naming Conventions & Data Mapping
* **Frontend (React):** Strictly use `camelCase` (e.g., `tmdbId`, `mediaType`).
* **Backend (TMDB API):** The API returns data in `snake_case` (e.g., `poster_path`, `vote_average`). 
* *Note: Always map the TMDB API responses to our internal `MediaItem` TypeScript types immediately after fetching to prevent `snake_case` from leaking into the UI components.*

---

## 🎨 Component Standards

* **Global Scaling:** The app relies on a `font-size: 90%` rule on the HTML root to achieve a compact, premium desktop scaling. Use `rem` (Tailwind defaults) for sizing to respect this scale.
* **Pass through classes:** Custom components should be built flexibly to accept layout overrides via a `className` prop when necessary.
* **Smart Defaults:** Design components so they require minimal props for standard usage (e.g., Fallback images for missing TMDB posters).