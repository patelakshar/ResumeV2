# ResumeV2

A full-stack AI-powered resume analyzer that evaluates resumes against ATS scoring and job descriptions using the Google Gemini API. ResumeV2 provides actionable insights to help users improve their job applications one at a time.

## Features

- **AI-Powered Analysis**: Uses Google Gemini API to analyze resume content
- **ATS Scoring**: Evaluates how well your resume matches job descriptions
- **Job Matching**: Compare your resume against specific job postings
- **Visual Reports**: Generate PDF reports of your analysis
- **User Dashboard**: Track your analysis history and improvements
- **Multi-format Support**: Parse PDF and DOCX resume files

## Tech Stack

### Frontend
- React 19 (Vite)
- Tailwind CSS v4
- React Router v7
- Framer Motion (animations)
- Recharts (data visualization)
- Axios (HTTP client)

### Backend
- Node.js
- Express 5
- MongoDB + Mongoose
- JWT + bcrypt (authentication)
- Multer (file uploads)

### AI & File Processing
- Google Gemini API (`@google/genai`)
- pdf-parse (PDF extraction)
- mammoth (DOCX parsing)
- pdfkit (PDF report generation)

## Project Structure

```
ResumeV2/
├── backend/
│   ├── server.js              # Express server entry point
│   ├── routes/                # API routes
│   ├── models/                # MongoDB models
│   ├── services/              # Business logic & AI integration
│   ├── middleware/            # Authentication middleware
│   └── ...
├── frontend/
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── App.jsx            # Main app router
│   │   └── ...
│   ├── vite.config.js         # Vite configuration
│   └── ...
├── README.md                  # This file
└── render.yaml                # Render deployment configuration
```

---

## Installation & Setup

### Prerequisites

Ensure you have the following installed:

- **Node.js** v18 or higher
- **npm** v9 or higher
- **MongoDB Atlas** account (for database)
- **Google Cloud** account (for Gemini API key)

### 1. Clone the Repository

```bash
cd /path/to/your/projects
git clone <repository-url> ResumeV2
cd ResumeV2
```

### 2. Install Dependencies

Install both frontend and backend dependencies:

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install

# Return to root
cd ..
```

### 3. Environment Configuration

#### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your configuration:

```env
PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ResumeV2?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
GEMINI_API_KEY=your-google-gemini-api-key
FRONTEND_URL=http://localhost:5173
```

> **Note**: Port 5001 is used to avoid macOS AirPlay Receiver conflict on port 5000.

#### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:5001/api
```

---

## Running the Application

### Development Mode

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

- Backend: `http://localhost:5001`
- Frontend: `http://localhost:5173`

### Production Build

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview  # Optional: preview production build
```

---

## Requirements

### Backend Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@google/genai` | ^2.17.1 | Google Gemini AI integration |
| `bcrypt` | ^6.0.0 | Password hashing |
| `cors` | ^2.8.6 | CORS middleware |
| `dotenv` | ^17.4.2 | Environment variables |
| `express` | ^5.2.1 | Web framework |
| `jsonwebtoken` | ^9.0.3 | JWT authentication |
| `mammoth` | ^1.12.1 | DOCX parsing |
| `mongoose` | ^9.9.2 | MongoDB ODM |
| `multer` | ^2.2.0 | File upload handling |
| `pdf-parse` | ^1.1.1 | PDF text extraction |
| `pdfkit` | ^0.19.1 | PDF report generation |

### Frontend Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `axios` | ^1.19.0 | HTTP client |
| `framer-motion` | ^13.1.0 | Animations |
| `react` | ^19.2.8 | React library |
| `react-dom` | ^19.2.8 | React DOM |
| `react-router-dom` | ^7.18.2 | Routing |
| `recharts` | ^3.10.1 | Charts |
| `@tailwindcss/postcss` | ^4.3.3 | Tailwind CSS |
| `@vitejs/plugin-react` | ^6.0.4 | Vite React plugin |
| `tailwindcss` | ^4.3.3 | CSS framework |
| `vite` | ^8.2.0 | Build tool |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| GET | `/api/resume` | Get user's resumes |
| POST | `/api/resume/upload` | Upload resume |
| POST | `/api/resume/analyze` | Analyze resume |
| POST | `/api/jobmatch` | Match resume to job description |
| GET | `/api/history` | Get analysis history |

---

## Deployment

### Option 1: Vercel (Frontend) + Render (Backend)

#### Frontend to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy frontend:
   ```bash
   cd frontend
   vercel login
   vercel
   # Follow prompts: setup project, framework preset = Vite
   ```

3. Set production environment variable:
   ```bash
   vercel env add VITE_API_URL production
   # Enter your deployed backend URL + /api
   vercel --prod
   ```

#### Backend to Render

1. Create a new Web Service on Render dashboard
2. Connect your repository
3. Set environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `GEMINI_API_KEY`
   - `FRONTEND_URL` (your Vercel frontend URL)
4. Deploy

### Option 2: Docker Deployment

Build and push backend Docker image:

```bash
cd backend
docker build -t yourusername/resumev2-backend:latest .
docker push yourusername/resumev2-backend:latest
```

---

## Environment Variables Summary

### Backend (`backend/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5001) |
| `MONGO_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT signing key | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | No |

### Frontend (`frontend/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | Yes |

---

## Getting API Keys

### Google Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create a new project or select existing
3. Go to **Get API Key** section
4. Create API key for Gemini
5. Copy the key to your `GEMINI_API_KEY`

### MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. Create a new cluster (free tier available)
3. Whitelist your IP address (or use `0.0.0.0/0` for development)
4. Create a database user
5. Get connection string and add to `MONGO_URI`

---

## Troubleshooting

### Common Issues

**Backend connection refused:**
- Ensure backend is running: `cd backend && npm run dev`
- Check port is 5001 (not 5000 on macOS)

**CORS errors:**
- Ensure `FRONTEND_URL` is set correctly in backend `.env`
- Verify `VITE_API_URL` points to correct backend URL in frontend `.env`

**Gemini API errors:**
- Verify API key is valid
- Check your Google Cloud billing is enabled

**File upload issues:**
- Supported formats: PDF, DOCX
- Maximum file size: 5MB

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

---

## License

This project is licensed under the ISC License.

---

## Acknowledgments

- [React](https://react.dev/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Google Gemini](https://ai.google/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Built for job seekers everywhere**

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
