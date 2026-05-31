# DevBoard Nexus

DevBoard Nexus is a modern, full-stack Applicant Tracking System (ATS) and recruitment pipeline designed to streamline human resources workflows. The platform provides a highly responsive, state-driven interface for managing recruitment pipelines and leverages Large Language Models (LLMs) to automate traditional HR data entry.

## 🚀 System Architecture

DevBoard Nexus is built on a scalable, typed architecture focusing on zero-latency user interactions and robust state management.

*   **Optimistic UI Engine:** Powered by TanStack Query (React Query). Drag-and-drop actions on the recruitment pipeline execute immediately on the client-side while seamlessly synchronizing with the backend database in the background, ensuring zero perceived latency.
*   **Complex State Management:** The Kanban pipeline utilizes `@dnd-kit` to manage the complex drag-and-drop physics, collision detection, and multi-column state required for a fluid tracking system.
*   **Automated Intelligence:** Integrated with the Google Gemini API to automate the generation of structured, professional job descriptions dynamically based on input parameters (Role Title & Tech Stack).
*   **Type Safety & Error Boundaries:** Strict TypeScript enforcement across the entire monorepo, utilizing Axios error type-narrowing and standardized HTTP error responses to prevent data leakage in production.

## ✨ Core Features

### HR / Administrator Portal
*   **Talent Pool Pipeline:** A fully interactive Kanban board to move candidates seamlessly between pipeline stages (`APPLIED`, `SHORTLISTED`, `INTERVIEWED`, `HIRED`).
*   **AI Job Generation:** One-click deployment of professional job descriptions using Google Gemini.
*   **Metrics Dashboard:** Visual analytics built with `Recharts` to track application velocity and interview conversion rates.

### Candidate Portal
*   **Role-Based Access:** A restricted, personalized dashboard where applicants can track their specific hiring progress via an interactive timeline.

## 🛠️ Tech Stack

*   **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, TanStack Query, `@dnd-kit`, Recharts.
*   **Backend:** Node.js, Express, TypeScript, Prisma ORM, SQLite.
*   **Authentication:** JSON Web Tokens (JWT) with secure Role-Based Access Control (RBAC).

## 🚦 Getting Started

A root workspace `package.json` is provided for rapid initialization.

### Prerequisites
*   Node.js (v18+)
*   npm

### Installation

1.  Clone the repository and install dependencies across the monorepo:
    ```bash
    npm run install:all
    ```
2.  Initialize the Prisma database and seed it with demo data:
    ```bash
    cd backend
    npx prisma db push
    npx prisma db seed
    cd ..
    ```
3.  Start the application servers concurrently:
    ```bash
    npm start
    ```

The application will launch at `http://localhost:5173`. You can register as an `APPLICANT`, `HR`, or `ADMIN` to experience the role-based routing firsthand.
