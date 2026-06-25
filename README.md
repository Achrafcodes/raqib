# Raqib — Freelancer CRM

> Keep an eye on your business

A dark-themed freelancer CRM built for solo developers & freelancers. Track clients, projects, invoices, follow-up reminders, and income — all in one place.

## Stack
- **Frontend:** React + TypeScript + Tailwind CSS v4 (Vite)
- **Backend:** Node.js + Express + TypeScript
- **Database:** MongoDB Atlas
- **Auth:** JWT in httpOnly cookies + Google/GitHub OAuth
- **Email:** Resend API
- **Charts:** Recharts
- **PDF:** pdf-lib

## Features
- Dashboard with earnings chart and client pipeline
- Client, project, invoice, and reminder management
- Email verification on signup
- OAuth sign-in (Google + GitHub)
- Daily email notifications for upcoming reminders and overdue invoices
- PDF invoice generation
- Fully responsive (mobile bottom nav, desktop sidebar)

## Getting Started

```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Set up environment variables
cp backend/.env.example backend/.env
# Fill in MONGO_URI, JWT_SECRET, RESEND_API_KEY, etc.

# Run dev servers
bash dev.sh
```

Frontend runs on `http://localhost:5174`, backend on `http://localhost:5000`.
