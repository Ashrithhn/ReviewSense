# ReviewSense 🚀

**ReviewSense** is an AI-powered customer feedback analyzer built as a modern, full-stack SaaS application. It allows businesses to upload raw customer reviews (via text or CSV) and instantly generates actionable insights using the Google Gemini AI.

## 💻 Tech Stack
* **Frontend:** React (Vite), React Router, Axios, Recharts, PapaParse
* **Backend:** Node.js, Express, CORS
* **Database & Auth:** Supabase (PostgreSQL, JWT Authentication)
* **AI Engine:** Google Gemini (`gemini-flash-latest`)
* **Deployment:** Vercel (Frontend), Render (Backend)

---

## 🗺️ The Development Journey (How We Built This)

Here is a step-by-step record of everything we achieved from scratch:

### 1. Architecture Setup
* Split a standard React repository into a professional monorepo structure with isolated `frontend` and `backend` directories.
* Established a robust communication bridge using Axios and CORS to allow the frontend to safely talk to the Express API.

### 2. AI Integration & Prompt Engineering
* Integrated the `@google/generative-ai` SDK.
* Used advanced Prompt Engineering to force the Gemini model to return a strict, predictable JSON schema containing: `overall_sentiment`, `sentiment_score`, `summary`, `themes`, `top_praises`, and `top_complaints`.

### 3. Dashboard & UI Polish
* Refactored the UI into reusable React components (`ResultsCard.jsx`).
* Implemented **Recharts** to dynamically visualize the sentiment score.
* Added a custom CSS loading spinner and built a responsive grid layout.

### 4. CSV Upload Engine
* Integrated `PapaParse` to allow businesses to bulk-upload `.csv` files.
* Wrote dynamic logic to auto-detect the correct "review" column from the spreadsheet and pipe it directly into the AI analyzer.

### 5. Deployment & CI/CD
* Deployed the Node.js backend to **Render** and the React frontend to **Vercel**.
* Learned the critical difference between local and production Environment Variables (`.env`).
* Established a CI/CD pipeline where `git push` automatically triggers live production builds.
* Handled a real-world security event (a leaked API key) by rotating keys and implementing a proper `.gitignore`.

### 6. Database Integration
* Provisioned a PostgreSQL database using **Supabase**.
* Created a `reports` table to persistently store every AI analysis.
* Implemented graceful degradation in the backend so the app continues functioning even if the database connection fails.

### 7. Authentication & Security
* Implemented **React Router** to create a multi-page application (`/` for Login, `/dashboard` for the app).
* Integrated Supabase Auth to handle secure user sign-ups and logins.
* **JWT Security:** Updated the frontend to send secure Session Tokens (JWTs) in the Axios `Authorization` header.
* Updated the Express backend to securely verify the JWT with Supabase, extract the verified `user_id`, and attach it to the database insert so every user securely "owns" their generated reports.

### 8. Premium Features
* Added a CSS-variable driven **Dark Mode** toggle.
* Implemented `localStorage` persistence so the browser remembers the user's theme preference across sessions.

---

*Built with ❤️ Ashrith H N"
