# Job Tracker

A full-stack job application tracker built as a portfolio project. Search real job listings across multiple sources, score how well each role matches your background using AI, and manage every application through your personal pipeline — from first look to offer or rejection.

**Live demo:** https://farouk-afolabi.github.io/Job-Tracker

---

## Features

### Authentication
- Register and log in with email and password
- Passwords hashed with bcrypt — never stored in plaintext
- JWT-based auth — token issued on login, verified on every protected request
- Persistent session on page refresh via token validation on app load
- Auto-redirect to login for unauthenticated users

### Multi-Source Job Search
- Searches **three sources in parallel** — Adzuna US, Adzuna Canada, and Jooble
- Each result is labelled by source (USA / Canada / Jooble)
- If one source is slow or down, results from the others still return immediately
- Filter by keywords, location, salary range, and job type
- One-click tracking from any search result

### Application Tracking
- Personal pipeline scoped entirely to your account — no data is shared
- Track applications through five stages: **Interested → Applied → Interview → Offer → Rejected**
- Add notes and set an interview date when you reach that stage
- Full **status history timeline** on every card — see every stage change with its date and notes
- Duplicate prevention — the same job cannot be tracked twice

### AI Job Match Scoring
- Save your profile (target role, skills, experience summary)
- Click **"AI Match Score"** on any job listing to get an instant Claude-powered evaluation
- Returns a **0–100 match score**, one-sentence verdict, matched **strengths**, and skill **gaps**
- Scores are colour-coded: green (≥70), amber (≥40), red (<40)
- Rate-limited to 30 requests per hour to control API costs

### Analytics Dashboard
- **4 stat cards** — total tracked, applications sent, interviews, offers
- **Horizontal bar chart** — application count at each pipeline stage
- **Interview rate indicator** — percentage of applications that led to an interview, benchmarked against the industry average
- **Weekly activity chart** — jobs tracked over the last 8 weeks

### Follow-Up Reminders
- **In-app:** a warning banner lists every application stuck at "applied" for 14+ days with the number of days elapsed
- **Email:** a daily cron job (9 AM) sends one summary email per user listing all stale applications
- Red badge on the Dashboard nav link shows the current reminder count
- Email reminders activate automatically when `EMAIL_USER` and `EMAIL_PASS` are configured

### CSV Export
- Export your full tracked jobs list as a `.csv` file with one click
- Includes title, company, location, status, notes, salary, date tracked, and last status change date
- Opens directly in Excel or Google Sheets

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router v7, Material UI v7 |
| Charts | Recharts |
| State management | React Context API |
| Backend | Node.js, Express 5 |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT (jsonwebtoken), bcryptjs |
| AI | Anthropic Claude API (claude-haiku-4-5) |
| Job data | Adzuna Jobs API (US + CA), Jooble API |
| Background jobs | node-cron |
| Email | Nodemailer (Gmail SMTP) |
| Security | express-rate-limit, environment-based CORS |
| Deployment | GitHub Pages (frontend), Render (backend) |

---

## Project Structure

```
Job-Tracker/
├── backend/
│   ├── models/
│   │   ├── User.js              # User schema — email, hashed password, profile, JWT method
│   │   └── TrackedJob.js        # Job schema — status, history, notes, interview date, owner
│   ├── server.js                # Express app — all routes, middleware, cron job
│   ├── .env                     # Environment variables (not committed)
│   └── package.json
│
└── frontend/
    └── src/
        ├── components/
        │   ├── analytics/
        │   │   └── Analytics.jsx        # Dashboard with charts and stats
        │   ├── auth/
        │   │   ├── Login.jsx
        │   │   └── Register.jsx
        │   ├── jobs/
        │   │   ├── JobBoard.jsx         # Tab container — search and tracked views
        │   │   ├── JobCard.jsx          # Search result card with AI match scoring
        │   │   ├── JobList.jsx          # Search results list
        │   │   ├── JobFilters.jsx       # Search form
        │   │   ├── TrackedJobsPanel.jsx # Tracked jobs list with reminders + CSV export
        │   │   ├── TrackedJobCard.jsx   # Tracked job card with history timeline
        │   │   └── JobStatusModal.jsx   # Update status / notes modal
        │   ├── layout/
        │   │   ├── NavBar.jsx           # Nav with reminder badge
        │   │   └── ProtectedRoutes.jsx
        │   └── profile/
        │       └── Profile.jsx          # Skills and experience form for AI scoring
        ├── context/
        │   └── AuthContext.js           # Global auth state — login, logout, register
        ├── services/
        │   └── api.js                   # All API calls in one place
        ├── theme.js                     # MUI theme config
        └── App.js                       # Routes
```

---

## How It Works

**Authentication**
1. User registers — password is hashed with bcrypt, JWT is returned
2. Frontend stores the JWT in `localStorage`
3. Every API request attaches the JWT in the `Authorization: Bearer <token>` header
4. The backend `authenticate` middleware verifies the token on every protected route
5. On page load, `/api/auth/verify` checks if the stored token is still valid — restoring the session silently

**Multi-source job search**
1. User submits the search form
2. Backend fires three requests simultaneously — Adzuna US, Adzuna CA, and Jooble — using `Promise.allSettled`
3. Each source's response is normalised to a common shape and tagged with a `source` field
4. All results are merged and returned. API keys never leave the server
5. Each job card displays a colour-coded source badge (blue USA, green Canada, orange Jooble)

**AI match scoring**
1. User saves their profile — target role, skills list, experience summary
2. User clicks "AI Match Score" on a job card
3. Backend sends the user's profile + job title and description to the Claude API
4. Claude returns a structured JSON score (0–100), summary, strengths, and gaps
5. Result renders inline on the card with colour-coded chips

**Follow-up reminders**
1. Every time a job's status changes, `statusChangedAt` is updated
2. `GET /api/jobs/reminders` returns jobs where `status === 'applied'` and `statusChangedAt` is older than 14 days
3. The frontend fetches this on load and displays a warning banner and nav badge
4. A `node-cron` job runs at 9 AM daily, queries all users for stale applications, and sends one summary email per user via Nodemailer

**Status history**
1. When a job is first tracked, an initial history entry is written
2. Every `PUT /api/jobs/tracked/:id` call that changes status pushes a new entry (`{ status, changedAt, notes }`) to the `statusHistory` array
3. The frontend renders the history as a collapsible reverse-chronological timeline with colour-coded dots

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/auth/verify` | Yes | Validate stored token |
| GET | `/api/profile` | Yes | Get saved profile |
| PUT | `/api/profile` | Yes | Save profile (skills, experience) |
| GET | `/api/jobs/search` | Yes | Search Adzuna US + CA + Jooble in parallel |
| POST | `/api/jobs/match` | Yes | AI match score for a job against user profile |
| POST | `/api/jobs/track` | Yes | Save a job to your pipeline |
| GET | `/api/jobs/tracked` | Yes | Get your tracked jobs |
| PUT | `/api/jobs/tracked/:id` | Yes | Update status / notes (writes history entry) |
| DELETE | `/api/jobs/tracked/:id` | Yes | Remove a tracked job |
| GET | `/api/jobs/reminders` | Yes | Get applications needing follow-up |
| GET | `/api/health` | No | Server + database status check |

---

## Running Locally

**Prerequisites:** Node.js 18+, a MongoDB Atlas account, Adzuna API credentials, and a Jooble API key.

**1. Clone the repo**
```bash
git clone https://github.com/farouk-afolabi/Job-Tracker.git
cd Job-Tracker
```

**2. Create `backend/.env`**
```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
JWT_LIFETIME=30d
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key
JOOBLE_API_KEY=your_jooble_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
PORT=5001
ALLOWED_ORIGINS=http://localhost:3000

# Optional — enables daily follow-up reminder emails
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
```

**3. Start the backend**
```bash
cd backend
npm install
npm run dev
```

**4. Start the frontend**
```bash
cd frontend
npm install
npm start
```

App runs at `http://localhost:3000`.

---

## Deployment

**Backend → Render**
- Connect the GitHub repo, set root directory to `backend`
- Build command: `npm install` — Start command: `npm start`
- Add all `.env` variables in Render's Environment settings
- Set `ALLOWED_ORIGINS=https://farouk-afolabi.github.io`

**Frontend → GitHub Pages**
- Create `frontend/.env.production` with `REACT_APP_API_URL=https://your-render-url.onrender.com/api`
- Run `npm run deploy` from the `frontend` directory to build and publish

---

## API Keys

| Service | Free tier | Get it at |
|---|---|---|
| Adzuna | 250 req/day | developer.adzuna.com |
| Jooble | Free with signup | jooble.org/api/about |
| Anthropic | Pay-as-you-go | console.anthropic.com |
| MongoDB Atlas | 512 MB free | mongodb.com/atlas |

---

## Author

Farouk Afolabi
