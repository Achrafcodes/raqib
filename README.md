# Raqib — Freelancer CRM

> Keep an eye on your business

A dark-themed freelancer CRM built for solo developers & freelancers. Track clients, projects, invoices, follow-up reminders, and income — all in one place. No bloat. No team features. Built for the solo freelancer.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React + TypeScript + Tailwind CSS v4 (Vite) |
| Backend | Node.js + Express + TypeScript |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT in httpOnly cookies + Google OAuth + GitHub OAuth (passport.js) |
| Email | Nodemailer + Gmail SMTP |
| PDF | pdf-lib |
| Charts | Recharts |
| Font | Space Grotesk |
| Deployment | Vercel (frontend) + Railway (backend) |

---

## Features

- **Dashboard** — stat cards (total earned, active projects, unpaid invoices, follow-ups due today), monthly/yearly earnings chart, client pipeline chart, recent activity feed
- **Clients** — add, edit, delete, search, filter by status (lead, active, inactive, lost)
- **Projects** — add, edit, delete, search, filter by status, overdue highlighting
- **Invoices** — create, mark paid, PDF download, send invoice PDF by email (Gmail SMTP)
- **Reminders** — card view, mark done/undone, overdue highlights, notification bell (due within 3 days)
- **Daily email notifications** — 9am cron: upcoming reminder digest + overdue invoice alerts
- **Settings** — update profile (name, title, currency), change password
- **Auth** — email/password register/login + Google OAuth + GitHub OAuth, all via httpOnly cookie (no localStorage)
- **Responsive** — mobile bottom nav + bottom-sheet modals, tablet, and full desktop layout with sidebar

---

## Security

| Finding | Fix |
|---|---|
| Mass assignment on create/update | Destructure allowed fields only |
| No rate limiting | `express-rate-limit` — 10 req/15min on auth routes |
| No security headers | `helmet()` on all responses |
| Invalid ObjectId → 500 | `validateObjectId` middleware → 400 |
| No numeric bounds | Invoice subtotal/tax/total ≥ 0, tax ≤ 100 |
| JWT_SECRET undefined | Startup guard — `process.exit(1)` if missing |
| No body size limit | `express.json({ limit: '50kb' })` |
| Currency accepts anything | Whitelist of 20 ISO currency codes |

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas cluster
- Gmail account with [App Password](https://myaccount.google.com/apppasswords) (2FA required)
- (Optional) Google and GitHub OAuth apps

### Environment Variables

**`backend/.env`**
```env
MONGO_URI=
JWT_SECRET=
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5174
PORT=5000

# Gmail SMTP
GMAIL_USER=your.gmail@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx

# OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

**`frontend/.env`**
```env
VITE_API_URL=http://localhost:5000
```

### Run Locally

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5174` — Backend: `http://localhost:5000`

---

## OAuth Setup

**Google:** Google Cloud Console → OAuth 2.0 → Authorized redirect URI: `{SERVER_URL}/api/auth/google/callback`

**GitHub:** GitHub → Settings → Developer settings → OAuth Apps → Callback URL: `{SERVER_URL}/api/auth/github/callback`

---

## Design System

```
Background:     #0C0E14
Surface:        #141920  (cards)
Surface-2:      #1A2030  (hover)
Border:         #1E2533
Accent green:   #4ADE80  (primary CTA, positive)
Text primary:   #F1F5F9
Text secondary: #94A3B8
Status paid:    #4ADE80
Status pending: #FBBF24
Status overdue: #F87171
Status lead:    #60A5FA
```

Font: Space Grotesk (400/500/600/700) — Border radius: 8px cards, 12px larger cards

---

## Project Structure

```
raqib/
├── backend/
│   ├── src/
│   │   ├── models/       User, Client, Project, Invoice, Reminder
│   │   ├── routes/       auth, client, project, invoice, reminder, dashboard, user
│   │   ├── controllers/  one file per resource
│   │   ├── middleware/   authMiddleware, validateObjectId
│   │   └── utils/        generatePDF, sendEmail, notificationCron, passport
│   └── server.ts
└── frontend/
    └── src/
        ├── components/   ui/, layout/, charts/, modals/
        ├── pages/        Dashboard, Clients, Projects, Invoices, Reminders, Settings, Login, Register
        ├── context/      AuthContext, RefreshContext
        └── utils/        api.ts (axios + withCredentials)
```

---

## Deployment

- **Frontend:** Vercel — connects to GitHub, auto-deploys on push. All `/api/*` requests are proxied to the backend via `vercel.json`.
- **Backend:** Railway — Node.js service, environment variables set in Railway dashboard.
