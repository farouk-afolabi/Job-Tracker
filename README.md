# Job Tracker

A full-stack job application tracker. Search real job listings from the Adzuna API, save the ones you're interested in, and track each application through your pipeline — from first look to offer or rejection.

Built as a portfolio project to demonstrate end-to-end full-stack development: REST API design, JWT authentication, MongoDB data modeling, and a React frontend.

---

## Features

**Authentication**
- Register and log in with email and password
- Passwords hashed with bcrypt — never stored in plaintext
- JWT-based auth — token is issued on login and verified on every protected request
- Auto-redirect to login for unauthenticated users; persistent session on page refresh

**Job Search**
- Live job search powered by the Adzuna API
- Filter by keywords, location, salary range, and job type
- One-click tracking from search results to your personal list

**Application Tracking**
- Personal tracked jobs list — data is scoped to your account, never shared
- Update status at each stage: Interested → Applied → Interview → Offer → Rejected
- Add notes and set an interview date when you reach that stage
- Delete jobs you're no longer pursuing

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router v7, Material UI v7 |
| State management | React Context API |
| Backend | Node.js, Express 5 |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT (jsonwebtoken), bcryptjs |
| External data | Adzuna Jobs API |
| Security | express-rate-limit, environment-based CORS |

---

## Project Structure

```
Job-Tracker/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema — email, hashed password, JWT method
│   │   └── TrackedJob.js    # Job schema — status, notes, interview date, owner
│   ├── server.js            # Express app — all routes and middleware
│   ├── .env                 # Environment variables (not committed)
│   └── package.json
│
└── frontend/
    └── src/
        ├── components/
        │   ├── auth/
        │   │   ├── Login.jsx
        │   │   └── Register.jsx
        │   ├── jobs/
        │   │   ├── JobBoard.jsx        # Tab container for search and tracked views
        │   │   ├── JobCard.jsx         # Single search result card
        │   │   ├── JobList.jsx         # Search results list
        │   │   ├── JobFilters.jsx      # Search form
        │   │   ├── TrackedJobsPanel.jsx # User's tracked jobs list
        │   │   ├── TrackedJobCard.jsx  # Single tracked job card
        │   │   └── JobStatusModal.jsx  # Update status / notes modal
        │   ├── layout/
        │   │   ├── NavBar.jsx
        │   │   └── ProtectedRoutes.jsx
        │   └── ui/
        │       └── Spinner.jsx
        ├── context/
        │   └── AuthContext.js   # Global auth state — login, logout, register
        ├── services/
        │   └── api.js           # All fetch calls in one place
        ├── theme.js             # MUI theme config
        └── App.js               # Routes
```

---

## How It Works

**Authentication flow:**
1. User registers — password is hashed, user is saved to MongoDB, JWT is returned
2. Frontend stores the JWT in localStorage
3. Every API request attaches the JWT in the `Authorization: Bearer <token>` header
4. The backend's `authenticate` middleware verifies the token on every protected route
5. On page load, the frontend calls `/api/auth/verify` to check if the stored token is still valid

**Job search flow:**
1. User submits the search form
2. Frontend calls `GET /api/jobs/search?keywords=react&location=new+york`
3. Backend proxies the request to Adzuna — API keys stay server-side, never exposed to the browser
4. Results are returned to the frontend

**Job tracking flow:**
1. User clicks "Track Job" on a search result
2. Frontend calls `POST /api/jobs/track` with the job data
3. Backend checks for duplicates (compound unique index on job ID + user ID)
4. Job is saved with `status: 'interested'` and linked to the user's ID
5. The tracked jobs tab re-fetches automatically

**Data ownership:**
Every tracked-job query includes `user: req.user._id` — users can only ever read, update, or delete their own data.

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/auth/verify` | Yes | Validate stored token |
| GET | `/api/jobs/search` | Yes | Search Adzuna job listings |
| POST | `/api/jobs/track` | Yes | Save a job to your list |
| GET | `/api/jobs/tracked` | Yes | Get your tracked jobs |
| PUT | `/api/jobs/tracked/:id` | Yes | Update status / notes |
| DELETE | `/api/jobs/tracked/:id` | Yes | Remove a tracked job |

---

## Running Locally

**Prerequisites:** Node.js, a MongoDB Atlas account, and Adzuna API credentials (free tier).

**1. Clone the repo**
```bash
git clone https://github.com/farouk-afolabi/Job-Tracker.git
cd Job-Tracker
```

**2. Set up environment variables**

Create `backend/.env`:
```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key_here
JWT_LIFETIME=30d
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key
PORT=5001
ALLOWED_ORIGINS=http://localhost:3000
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
- Set all `.env` variables in Render's environment settings
- Set `ALLOWED_ORIGINS` to your Netlify URL (e.g. `https://your-app.netlify.app`)
- Build command: `npm install` — Start command: `node server.js`

**Frontend → Netlify**
- Set `REACT_APP_API_URL` to your Render backend URL (e.g. `https://your-api.onrender.com/api`)
- Build command: `npm run build` — Publish directory: `build`

---

## Author

Farouk Afolabi
