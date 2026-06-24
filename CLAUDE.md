# Raqib — CLAUDE.md
> "Keep an eye on your business" 👁️
> Freelancer CRM — built for solo developers & freelancers

---

## Project Overview
Raqib is a dark-themed freelancer CRM web app.
Freelancers use it to track clients, projects, invoices,
follow-up reminders, and income — all in one place.
No bloat. No team features. Built for the solo freelancer.

---

## Tech Stack
- **Frontend:** React (Vite) + TypeScript + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript
- **Database:** MongoDB Atlas (Mongoose)
- **Auth:** JWT (access token in localStorage)
- **PDF Generation:** pdf-lib
- **Email:** Resend API
- **Charts:** Recharts
- **Deployment:** Vercel (frontend) + Railway (backend)

---

## Brand & Design System
```
Background:     #0A0A0A  (main bg)
Cards:          #111111  (card bg)
Card border:    #1A1A1A  (subtle border)
Accent green:   #00C896  (primary CTA, positive stats)
Accent dark:    #1E3A2F  (hover states, sidebar card)
Text primary:   #FFFFFF
Text secondary: #6B7280
Status paid:    #00C896
Status pending: #F59E0B
Status overdue: #EF4444
Status lead:    #6366F1

Font: Inter (all weights)
Border radius: 8px on all cards
Card padding: 24px
```

---

## Folder Structure
```
raqib/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Client.ts
│   │   │   ├── Project.ts
│   │   │   ├── Invoice.ts
│   │   │   └── Reminder.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── client.routes.ts
│   │   │   ├── project.routes.ts
│   │   │   ├── invoice.routes.ts
│   │   │   ├── reminder.routes.ts
│   │   │   └── dashboard.routes.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── client.controller.ts
│   │   │   ├── project.controller.ts
│   │   │   ├── invoice.controller.ts
│   │   │   ├── reminder.controller.ts
│   │   │   └── dashboard.controller.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   └── error.middleware.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── utils/
│   │       ├── generatePDF.ts
│   │       └── sendEmail.ts
│   ├── .env
│   ├── tsconfig.json
│   └── server.ts
│
└── frontend/
    └── src/
        ├── components/
        │   ├── ui/
        │   │   ├── StatCard.tsx
        │   │   ├── StatusBadge.tsx
        │   │   ├── TableRow.tsx
        │   │   └── Button.tsx
        │   ├── layout/
        │   │   ├── Navbar.tsx
        │   │   └── Layout.tsx
        │   └── charts/
        │       ├── EarningsChart.tsx
        │       └── PipelineChart.tsx
        ├── pages/
        │   ├── Dashboard.tsx
        │   ├── Clients.tsx
        │   ├── Projects.tsx
        │   ├── Invoices.tsx
        │   ├── Reminders.tsx
        │   └── Settings.tsx
        ├── types/
        │   └── index.ts
        ├── context/
        │   └── AuthContext.tsx
        ├── hooks/
        │   └── useAuth.ts
        └── utils/
            └── api.ts
```

---

## MongoDB Schemas

### User
```js
{
  name: String,
  email: String (unique),
  password: String (bcrypt),
  freelanceTitle: String,
  currency: String (default: "USD"),
  isEmailVerified: Boolean (default: false),
  createdAt: Date
}
```

### Client
```js
{
  userId: ObjectId (ref: User), // ALWAYS filter by this
  name: String,
  email: String,
  phone: String,
  company: String,
  source: enum [upwork, fiverr, instagram, referral, cold-email, other],
  status: enum [lead, negotiating, active, done, lost],
  notes: String,
  createdAt: Date
}
```

### Project
```js
{
  userId: ObjectId (ref: User),
  clientId: ObjectId (ref: Client),
  title: String,
  description: String,
  price: Number,
  currency: String (default: "USD"),
  status: enum [not-started, in-progress, review, done, cancelled],
  deadline: Date,
  createdAt: Date
}
```

### Invoice
```js
{
  userId: ObjectId (ref: User),
  clientId: ObjectId (ref: Client),
  projectId: ObjectId (ref: Project),
  invoiceNumber: String, // "INV-001"
  items: [{
    description: String,
    quantity: Number,
    unitPrice: Number,
    total: Number
  }],
  subtotal: Number,
  tax: Number (default: 0),
  total: Number,
  status: enum [draft, sent, paid, overdue],
  dueDate: Date,
  paidAt: Date,
  createdAt: Date
}
```

### Reminder
```js
{
  userId: ObjectId (ref: User),
  clientId: ObjectId (ref: Client),
  title: String,
  note: String,
  dueDate: Date,
  isDone: Boolean (default: false),
  createdAt: Date
}
```

---

## API Routes

### Auth (public)
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/verify-email
GET  /api/auth/me          → JWT required
```

### Dashboard (JWT required)
```
GET /api/dashboard/stats
→ returns: totalEarned, activeProjects,
           unpaidInvoices, followUpsDueToday,
           earningsChart (last 12 months),
           pipelineBreakdown, recentActivity
```

### Clients (JWT required)
```
GET    /api/clients
POST   /api/clients
GET    /api/clients/:id
PUT    /api/clients/:id
DELETE /api/clients/:id
```

### Projects (JWT required)
```
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id
```

### Invoices (JWT required)
```
GET    /api/invoices
POST   /api/invoices
GET    /api/invoices/:id
PUT    /api/invoices/:id
DELETE /api/invoices/:id
GET    /api/invoices/:id/pdf   → returns PDF buffer
```

### Reminders (JWT required)
```
GET    /api/reminders
POST   /api/reminders
PUT    /api/reminders/:id
DELETE /api/reminders/:id
PATCH  /api/reminders/:id/done → mark as done
```

---

## Auth Rules
- Public: /api/auth/register, /api/auth/login, /api/auth/verify-email
- ALL other routes → JWT required via authMiddleware
- JWT stored in localStorage on frontend
- Token: Bearer <token>
- authMiddleware adds req.user = { id, email } to request

---

## Coding Rules — STRICT
- TypeScript everywhere — no `any` type allowed
- ES Modules (import/export) everywhere
- async/await ONLY — never .then().catch()
- Every controller wrapped in try/catch
- ALWAYS filter by userId — never return another user's data
- Success: { success: true, data: {...} }
- Error: { success: false, message: "..." }
- Never return raw MongoDB errors
- Never use var — only const / let
- Never hardcode secrets — always process.env
- Define types/interfaces in src/types/index.ts

---

## Frontend Rules
- Tailwind CSS only — no component libraries
- All colors from design system (use bg-[#111111] syntax)
- All pages use Layout.jsx wrapper
- API calls go through utils/api.js (axios instance)
- Auth state managed by AuthContext
- Protect all routes — redirect to /login if no token

---

## Environment Variables
```
# Backend
MONGO_URI=
JWT_SECRET=
JWT_EXPIRES_IN=7d
RESEND_API_KEY=
CLIENT_URL=http://localhost:5173
PORT=5000

# Frontend
VITE_API_URL=http://localhost:5000
```

---

## Pages Overview
| Page      | Route      | Description                        |
|-----------|------------|------------------------------------|
| Dashboard | /          | Stats, charts, recent activity     |
| Clients   | /clients   | List + add + edit clients          |
| Projects  | /projects  | List + add + edit projects         |
| Invoices  | /invoices  | List + create + PDF download       |
| Reminders | /reminders | Follow-up list + mark done         |
| Settings  | /settings  | Profile + currency preference      |

---

## Current Build Phase
```
Phase 1 — Backend Foundation:
- [x] server.ts + MongoDB connection (TypeScript, tsx watch)
- [x] User model + auth routes (register, login, /me)
- [x] JWT middleware (authMiddleware, req.user injection)
- [x] Test auth endpoints (201 register, 200 login confirmed)

Phase 2 — Core Models & Routes:
- [x] Client CRUD (5 routes, userId-filtered)
- [x] Project CRUD (5 routes, populated clientId)
- [x] Invoice CRUD (5 routes, auto invoiceNumber INV-001)
- [x] Reminder CRUD (5 routes + PATCH /done)
- [x] Dashboard stats endpoint (totalEarned, activeProjects,
      unpaidInvoices, followUpsDueToday, earningsChart,
      pipelineBreakdown, recentActivity)

Phase 3 — Frontend:
- [x] Vite + React + TypeScript + Tailwind v4 setup
- [x] AuthContext + protected routes (JWT, auto 401 redirect)
- [x] Layout + Navbar (active bottom-border indicator)
- [x] Sidebar (This Month, Quick Actions, Follow-ups, Active Projects)
- [x] Dashboard page (unified stat bar + count-up + charts)
- [x] Clients page (full CRUD + status filter)
- [x] Projects page (full CRUD + status filter)
- [x] Invoices page (full CRUD + line items + tax calc)
- [x] Reminders page (full CRUD + mark done + overdue highlight)
- [x] Settings page (profile form + theme toggle)
- [x] Login / Register (split-layout brand + form)

Phase 4 — Polish:
- [ ] PDF invoice (pdf-lib)
- [ ] Email (Resend)
- [ ] Deploy (Vercel + Railway)
```

---

## Key Decisions
- MongoDB over Supabase → MERN consistency, no inactivity pause
- Vite over CRA → faster dev
- pdf-lib → free PDF generation, no external service
- Resend → already used in Hustl, 3000 emails/month free
- JWT in localStorage → simple, enough for solo app
- Recharts → free, easy dark theme customization
- No Redux → Context API enough for this scope