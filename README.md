# Job Tracker

Full-stack job application tracker built with Next.js, TypeScript, 
and MongoDB. Search live job listings via the Adzuna API, save 
them, and manage your applications in one place.

🔗 **Live Demo:** [job-tracker-dikuo.vercel.app](https://job-tracker-dikuo.vercel.app/)

## Features

- JWT auth with bcrypt password hashing
- Full CRUD for job applications (add, edit, delete, view)
- Search live job listings via Adzuna API, with pagination
- Save search results directly to your tracker
- Dark mode (flash-free, synced before React hydration)
- Protected routes with loading states
- 11 Jest unit tests + 10 Playwright E2E tests
- CI pipeline via GitHub Actions (tests + build on every push)

## Tech Stack

**Frontend:** Next.js (App Router), TypeScript, React, Tailwind CSS  
**Backend:** Next.js API Routes, MongoDB, Mongoose  
**Auth:** JWT, bcrypt  
**Testing:** Jest, Playwright  
**CI/CD:** GitHub Actions  
**Deployment:** Vercel

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB Atlas (or local MongoDB)
- Adzuna API credentials ([developer.adzuna.com](https://developer.adzuna.com/))

### Setup

\`\`\`bash
git clone https://github.com/dikuo/job-tracker.git
cd job-tracker
npm install
\`\`\`

Create \`.env.local\`:
\`\`\`
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_ADZUNA_APP_ID=your_adzuna_app_id
NEXT_PUBLIC_ADZUNA_APP_KEY=your_adzuna_app_key
\`\`\`

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

## Testing

Unit tests (Jest):
\`\`\`bash
npm test
\`\`\`
Covers password hashing, JWT, and Jobs API CRUD with a mocked database.

E2E tests (Playwright):
\`\`\`bash
npx playwright test
\`\`\`
Covers login/auth, job CRUD, search, dark mode, and the Adzuna search flow.

> E2E tests need local env vars + MongoDB connection — run locally, not in CI.