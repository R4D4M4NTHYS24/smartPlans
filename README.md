# SmartPlans (Frontend)

SmartPlans is a lightweight planning dashboard to create, edit, and track strategic plans.  
It connects to the SmartPlans API to generate AI feedback (risks, suggestions, and estimated impact) for each plan.

## Tech stack
- React + TypeScript + Vite
- Material UI (MUI)

## Prerequisites
- Node.js (recommended: LTS)
- npm (or pnpm/yarn)

## Local setup

### 1) Clone the repository
git clone https://github.com/R4D4M4NTHYS24/smartPlans.git
cd smartPlans

### 2) Install dependencies
npm install

### 3) Configure the API URL
Create a .env.local file in the project root:
VITE_API_URL=http://localhost:8000

### 4) Run the dev server
npm run dev

### Open:
- http://localhost:5173

### Production build
- npm run build
- npm run preview

### Notes
- Make sure the backend is running (default: http://localhost:8000).
- If you see CORS errors in the browser, review the backend CORS configuration.
