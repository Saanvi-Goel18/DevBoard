# DevBoard Nexus v4.0

DevBoard Nexus is a modern, full-stack enterprise Applicant Tracking System (ATS) and recruitment pipeline designed to streamline human resources workflows. The platform provides a highly responsive, state-driven interface for managing recruitment pipelines and leverages Large Language Models (LLMs) to automate traditional HR workflows like candidate evaluation and job description generation.

## 🚀 System Architecture

DevBoard Nexus is built on a scalable, containerized architecture focusing on robust state management, security, and enterprise standards.

*   **AI-Powered Applicant Evaluation:** Integrated with Google Gemini API. Applicants can upload their resumes, and HR admins can generate instant AI Match Scores (0-100) and qualification summaries against the job requirements.
*   **Automated Email Workflows:** Powered by `nodemailer`. As candidates are moved through the hiring pipeline, automated status update emails are dispatched asynchronously, eliminating manual HR follow-ups.
*   **Optimistic UI & State Management:** Powered by TanStack Query (React Query) and `@dnd-kit`. Drag-and-drop actions on the recruitment Kanban board execute instantly on the client while synchronizing with the backend.
*   **SecOps & API Hardening:** The Express server is fortified with `helmet` for Content Security Policies (CSP) and `express-rate-limit` to prevent brute-force attacks.
*   **Continuous Integration (CI/CD):** Fully integrated GitHub Actions workflows automatically install dependencies, check TypeScript types, and run production builds on every push to the `main` branch.
*   **Docker Containerization:** Standardized, multi-stage `Dockerfile` configurations allow the entire monorepo stack to be launched via a single `docker-compose up` command.

## ✨ Core Features

### HR / Administrator Portal
*   **Talent Pool Pipeline:** A fully interactive Kanban board to move candidates seamlessly between pipeline stages (`APPLIED`, `SHORTLISTED`, `INTERVIEWED`, `HIRED`).
*   **AI Candidate Scoring:** Click "Generate AI Score" in the pipeline drawer to instantly grade an applicant's resume against the role.
*   **AI Job Generation:** One-click deployment of professional job descriptions based on Role Title & Tech Stack.
*   **Metrics Dashboard:** Visual analytics built with `Recharts` to track application velocity, hiring funnels, and role distribution.

### Candidate Portal
*   **Application Flow:** Candidates can view open positions and submit their professional experience/resume directly via the portal.
*   **Role-Based Access:** A restricted, personalized dashboard where applicants can track their specific hiring progress via an interactive timeline.
*   **Automated Notifications:** Receive instant emails when your application status changes.

## 🛠️ Tech Stack

*   **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, TanStack Query, `@dnd-kit`, Recharts.
*   **Backend:** Node.js, Express, TypeScript, Prisma ORM, PostgreSQL (Supabase), Nodemailer, Google Generative AI (Gemini).
*   **DevOps & QA:** Docker, GitHub Actions, Vitest (Unit Testing).
*   **Authentication:** JSON Web Tokens (JWT) with secure Role-Based Access Control (RBAC).

## 🚦 Getting Started

### Prerequisites
*   Node.js (v18+) or Docker & Docker Compose
*   A Supabase PostgreSQL database URL (or local Postgres)
*   A Google Gemini API Key

### Installation (Local)

1.  Clone the repository and install dependencies:
    ```bash
    npm run install:all
    ```
2.  Configure your environment variables:
    *   Copy `backend/.env.example` to `backend/.env`
    *   Add your `DATABASE_URL` and `GEMINI_API_KEY`.
3.  Initialize the Prisma database:
    ```bash
    cd backend
    npx prisma db push
    npx prisma generate
    npx prisma db seed
    cd ..
    ```
4.  Start the application servers concurrently:
    ```bash
    npm start
    ```

### Installation (Docker)
Simply run the following command from the root directory to build and boot the entire stack:
```bash
docker-compose up --build
```

The application will launch at `http://localhost:5173`. You can register as an `APPLICANT`, `HR`, or `ADMIN` to experience the role-based routing firsthand.
