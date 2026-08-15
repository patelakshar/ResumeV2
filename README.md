# AI Resume Analyzer

A full-stack app that analyzes resumes against ATS scoring and job descriptions
using the Google Gemini API. See `backend/PROJECT,md` for the full project spec.

## Stack

- **Frontend:** React (Vite), Tailwind CSS, React Router, Axios, Recharts, Framer Motion
- **Backend:** Node.js, Express, MongoDB + Mongoose, JWT + bcrypt
- **AI:** Google Gemini API (`@google/genai`), called only from the backend
- **File parsing:** pdf-parse (PDF), mammoth (DOCX)
- **PDF reports:** pdfkit

## Project layout

```
backend/    Express API, MongoDB models, Gemini integration
frontend/   React app (Vite)
```

## Local setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# then fill in .env with your real values (see table below)
npm run dev
```

The backend runs on `http://localhost:5001` by default (or whatever `PORT` you set).

**Note (macOS only):** port 5000 is used by macOS's AirPlay Receiver
(ControlCenter), so this project defaults to port **5001** to avoid the
conflict. If you see connection issues on port 5000, that's why.

#### Backend environment variables

| Variable | Description |
| --- | --- |
| `PORT` | Port the server listens on (defaults to 5001 locally; Render sets its own automatically in production) |
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Any long random string, used to sign login tokens |
| `GEMINI_API_KEY` | API key from Google AI Studio |
| `FRONTEND_URL` | The deployed frontend's URL, used to lock down CORS in production. Leave unset locally. |

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# .env already points at http://localhost:5001/api, which matches the backend above
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

#### Frontend environment variables

| Variable | Description |
| --- | --- |
| `VITE_API_URL` | Full URL (including `/api`) of the backend the frontend should call |

## Production builds

```bash
# Backend - just run the server directly, there's no separate build step
cd backend && npm start

# Frontend - builds static files into frontend/dist
cd frontend && npm run build
npm run preview   # optional: preview the production build locally
```

## Deploying (manual, CLI-based, no GitHub)

These steps assume you already have a MongoDB Atlas cluster (the one in
`backend/.env` works fine) and a Gemini API key.

### MongoDB Atlas: allow your deployed backend to connect

Atlas blocks connections from IPs that aren't whitelisted. Since Render's
outbound IP isn't fixed on the free tier, the simplest fix for a project like
this is:

1. Go to your Atlas project → **Network Access**.
2. Add `0.0.0.0/0` (allow from anywhere). This is fine for a personal/demo
   project relying on the JWT + bcrypt auth already in place, but is not
   recommended for handling sensitive production data.

### Frontend → Vercel (Vercel CLI, no GitHub)

Vercel's CLI can deploy a local folder directly, with no Git repo needed.

```bash
npm install -g vercel
cd frontend
vercel login                 # opens a browser to authenticate
vercel                       # first deploy - follow the prompts:
                             #   - set up and deploy: yes
                             #   - link to existing project: no (first time)
                             #   - framework preset: Vite
                             #   - build command / output dir: accept defaults
```

Set the production environment variable, then deploy to production:

```bash
vercel env add VITE_API_URL production
# paste your deployed backend URL + /api, e.g. https://resume-analyzer-api.onrender.com/api

vercel --prod
```

Any time you change the frontend, redeploy with `vercel --prod` from the
`frontend` folder.

### Backend → Render (Docker image, no GitHub)

Render can deploy from either a connected Git repo or a container image from
a registry. Since we're avoiding GitHub, we use the **Docker image** path:
build the image locally, push it to Docker Hub, then point Render at it.

```bash
# 1. Install Docker Desktop and sign in to Docker Hub
docker login

# 2. Build and push the image (from the backend/ folder)
cd backend
docker build -t <your-dockerhub-username>/resume-analyzer-backend:latest .
docker push <your-dockerhub-username>/resume-analyzer-backend:latest
```

Then, one-time only, create the Render service (this uses the Render
dashboard, not GitHub, since Render doesn't yet have a way to create a brand
new service purely from the CLI without either a Git connection or an image
reference — pointing it at your Docker Hub image is the no-GitHub path):

1. Render dashboard → **New** → **Web Service** → **Deploy an existing image
   from a registry**.
2. Image URL: `docker.io/<your-dockerhub-username>/resume-analyzer-backend:latest`
3. Add the environment variables from the table above (`MONGO_URI`,
   `JWT_SECRET`, `GEMINI_API_KEY`, `FRONTEND_URL`). Leave `PORT` unset — Render
   sets this automatically and the app already reads `process.env.PORT`.
4. Create the service. Render pulls the image and starts it.

For every future change, you only need the CLI:

```bash
cd backend
docker build -t <your-dockerhub-username>/resume-analyzer-backend:latest .
docker push <your-dockerhub-username>/resume-analyzer-backend:latest
```

Then trigger a redeploy of the same image tag from Render — either with the
[Render CLI](https://render.com/docs/cli) (`render deploys create <service-id>`)
or the dashboard's "Manual Deploy" button. No GitHub account or repo is
involved at any point.

### After both are deployed

1. Update the frontend's `VITE_API_URL` (via `vercel env`) to the real Render
   URL if you hadn't set it yet, then `vercel --prod` again.
2. Update the backend's `FRONTEND_URL` env var in Render to the real Vercel
   URL, so CORS allows it.
