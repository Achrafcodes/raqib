# Raqib — CLAUDE.md
> "Keep an eye on your business"
> Freelancer CRM — built for solo developers & freelancers

---

## Project Overview
Raqib is a dark-themed freelancer CRM web app.
Freelancers use it to track clients, projects, invoices,
follow-up reminders, and income — all in one place.
No bloat. No team features. Built for the solo freelancer.

---

## Tech Stack
- **Frontend:** React (Vite) + TypeScript + Tailwind CSS v4
- **Backend:** Node.js + Express + TypeScript
- **Database:** MongoDB Atlas (Mongoose)
- **Auth:** JWT in httpOnly cookie + Google OAuth + GitHub OAuth (passport.js)
- **Email:** Nodemailer + Gmail SMTP (no domain required)
- **PDF Generation:** pdf-lib
- **Charts:** Recharts
- **Font:** Space Grotesk (Google Fonts)
- **Deployment:** Vercel (frontend) + Railway (backend)

---

## Brand & Design System

```
Background:     #0C0E14  (--bg)
Surface:        #141920  (--surface, cards)
Surface-2:      #1A2030  (--surface-2, hover bg)
Border:         #1E2533  (--border)
Border-2:       #2D3748  (--border-2, stronger border)
Accent green:   #4ADE80  (--accent, primary CTA, positive)
Text primary:   #F1F5F9  (--text-1)
Text secondary: #94A3B8  (--text-2)
Text muted:     #8899AA  (--text-3, labels, timestamps)
Status paid:    #4ADE80
Status pending: #FBBF24
Status overdue: #F87171
Status lead:    #60A5FA
Status lost:    #8899AA

Font: Space Grotesk (400/500/600/700)
Border radius: 8px cards, 12px larger cards
```

Tailwind v4 custom tokens live in `@theme {}` block in `index.css`.
CSS custom properties (`var(--accent)` etc.) used for dynamic values.
The global reset MUST be inside `@layer base {}` — otherwise it overrides all Tailwind utilities (v4 cascade layer bug).

---

## Folder Structure

```
raqib/
├── backend/
│   ├── src/
│   │   ├── models/          User, Client, Project, Invoice, Reminder
│   │   ├── routes/          auth, client, project, invoice, reminder, dashboard, user
│   │   ├── controllers/     one file per resource
│   │   ├── middleware/      auth.middleware.ts (authMiddleware + validateObjectId)
│   │   ├── types/           index.ts (AuthRequest interface)
│   │   └── utils/
│   │       ├── generatePDF.ts       ← pdf-lib dark A4 invoice
│   │       ├── sendEmail.ts         ← nodemailer Gmail SMTP (reminders, overdue, invoice PDF)
│   │       ├── notificationCron.ts  ← daily 9am cron (node-cron)
│   │       └── passport.ts          ← Google + GitHub OAuth strategies
│   ├── .env
│   ├── tsconfig.json
│   └── server.ts
│
└── frontend/
    └── src/
        ├── components/
        │   ├── ui/
        │   │   ├── StatCard.tsx
        │   │   ├── StatusBadge.tsx     ← handles ALL statuses
        │   │   ├── Avatar.tsx          ← deterministic color from name, initials
        │   │   ├── Modal.tsx           ← reusable modal shell (Escape + outside click)
        │   │   ├── DateTimePicker.tsx  ← custom dark calendar picker with time
        │   │   ├── LoadingScreen.tsx   ← animated spark logo on auth check
        │   │   ├── PageLoader.tsx      ← in-page spark loader
        │   │   ├── Icons.tsx           ← inline SVG icon library
        │   │   ├── Select.tsx          ← portal-based themed dropdown
        │   │   ├── ConfirmModal.tsx    ← themed delete dialog
        │   │   └── OAuthButtons.tsx    ← Google + GitHub sign-in buttons
        │   ├── layout/
        │   │   ├── Navbar.tsx          ← 60px, spark logo, Link-based pill tabs, bell, avatar
        │   │   ├── Layout.tsx          ← shell: navbar + main + sidebar
        │   │   └── Sidebar.tsx         ← This Month, Quick Actions, Follow-ups, Active Projects
        │   ├── charts/
        │   │   ├── EarningsChart.tsx
        │   │   └── PipelineChart.tsx
        │   ├── clients/
        │   │   └── AddClientModal.tsx
        │   ├── projects/
        │   │   └── AddProjectModal.tsx
        │   ├── invoices/
        │   │   └── AddInvoiceModal.tsx
        │   └── reminders/
        │       └── AddReminderModal.tsx
        ├── pages/
        │   ├── Dashboard.tsx
        │   ├── Clients.tsx
        │   ├── Projects.tsx
        │   ├── Invoices.tsx      ← send invoice by email (paper plane icon)
        │   ├── Reminders.tsx
        │   ├── Settings.tsx
        │   ├── Login.tsx         ← email/password + OAuth buttons
        │   ├── Register.tsx      ← email/password + OAuth buttons
        │   ├── VerifyEmail.tsx   ← /verify-email?token= (kept for legacy links)
        │   └── CheckEmail.tsx    ← /check-email (kept for legacy links)
        ├── context/
        │   ├── AuthContext.tsx   ← cookie-based, /me on mount, register auto-logs in
        │   └── RefreshContext.tsx
        ├── types/
        │   └── index.ts
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
  password: String (bcrypt, cost 12),
  freelanceTitle: String,
  currency: String (default: "USD"),  // whitelist-validated on update
  isEmailVerified: Boolean (default: false),
  emailVerificationToken: String,     // legacy, not used in current flow
  emailVerificationExpires: Date,
  createdAt: Date
}
```

### Client / Project / Invoice / Reminder
Same as before — see schemas above in original file.

---

## API Routes

### Auth
```
POST /api/auth/register          → sets httpOnly cookie, auto-logs in
POST /api/auth/login             → sets httpOnly cookie
POST /api/auth/logout            → clears cookie
GET  /api/auth/me                → JWT required
GET  /api/auth/google            → redirect to Google OAuth
GET  /api/auth/google/callback   → sets cookie, redirect to CLIENT_URL
GET  /api/auth/github            → redirect to GitHub OAuth
GET  /api/auth/github/callback   → sets cookie, redirect to CLIENT_URL
```

### Dashboard (JWT required)
```
GET /api/dashboard/stats
→ totalEarned, activeProjects, unpaidInvoices, followUpsDueToday,
  earningsChart, earningsYearlyChart, pipelineBreakdown, recentActivity
```

### Clients / Projects / Reminders (JWT required)
```
GET    /api/:resource
POST   /api/:resource
GET    /api/:resource/:id        ← validateObjectId middleware
PUT    /api/:resource/:id        ← validateObjectId middleware
DELETE /api/:resource/:id        ← validateObjectId middleware
PATCH  /api/reminders/:id/done
```

### Invoices (JWT required)
```
GET    /api/invoices
POST   /api/invoices
GET    /api/invoices/:id
PUT    /api/invoices/:id
DELETE /api/invoices/:id
GET    /api/invoices/:id/pdf     → PDF buffer download
POST   /api/invoices/:id/send   → generate PDF + email to client via Gmail
```

### User (JWT required)
```
PUT /api/user/profile    → name, freelanceTitle, currency (whitelist validated)
PUT /api/user/password   → verify current, hash new
```

---

## Auth Rules
- Cookie: httpOnly, SameSite: lax, 7 day maxAge, secure in production
- `withCredentials: true` on all axios requests
- CORS: whitelist of allowed origins with `credentials: true`
- `authMiddleware` reads from `req.cookies.token` → falls back to `Authorization: Bearer`
- `validateObjectId` middleware on all `/:id` routes — returns 400 for malformed IDs
- OAuth users created with `isEmailVerified: true` (Google/GitHub already trusted)
- No email verification gate — register goes straight to dashboard

---

## Environment Variables

```
# Backend (.env)
MONGO_URI=
JWT_SECRET=
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5174
PORT=5000

# Email (Gmail SMTP)
GMAIL_USER=your.gmail@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx   # Google App Password (not account password)

# OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Frontend (.env)
VITE_API_URL=http://localhost:5000
```

**Gmail App Password setup:** Google Account → Security → 2-Step Verification → App passwords → create "Raqib"
**OAuth callback URLs:**
- Google: `{SERVER_URL}/api/auth/google/callback`
- GitHub: `{SERVER_URL}/api/auth/github/callback`

Vite dev server runs on port **5174** (`vite.config.ts` with `strictPort: true`).

---

## Security — All Fixed

| Finding | Fix |
|---|---|
| H1 Mass assignment on create | Destructure allowed fields only before `Model.create()` |
| H2 Mass assignment on update | Destructure allowed fields only before `findOneAndUpdate()` |
| M1 No rate limiting | `express-rate-limit` — 10 req/15min on `/auth/login` + `/auth/register` |
| M2 No helmet | `helmet()` on all responses |
| M3 Invalid ObjectId → 500 | `validateObjectId` middleware → 400 |
| M4 No numeric bounds | Invoice: subtotal/tax/total ≥ 0, tax ≤ 100. Project: price ≥ 0 |
| L1 JWT_SECRET undefined | Startup guard — `process.exit(1)` if missing |
| L2 No body size limit | `express.json({ limit: '50kb' })` |
| L3 Currency accepts anything | Whitelist of 20 ISO currency codes in `updateProfile` |

---

## Coding Rules — STRICT
- TypeScript everywhere — no `any` type
- ES Modules (import/export) everywhere
- async/await ONLY — never .then().catch()
- Every controller wrapped in try/catch
- ALWAYS filter by `userId` — never return another user's data
- Success: `{ success: true, data: {...} }`
- Error: `{ success: false, message: "..." }`
- Never return raw MongoDB errors
- Never use `var` — only `const` / `let`
- Never hardcode secrets — always `process.env`
- Define types/interfaces in `src/types/index.ts`

---

## Frontend Rules
- Tailwind CSS only — no component libraries
- Colors via CSS variables (`var(--accent)`) or Tailwind tokens (`bg-r-accent`)
- All pages use `<Layout>` wrapper
- API calls go through `utils/api.ts` (axios instance with `withCredentials`)
- Auth state managed by `AuthContext` (cookie-based)
- Global refresh via `RefreshContext` — call `refresh()` after any mutation
- Modals: use `<Modal>` shell, close on Escape + outside click
- Nav tabs use `<Link to="...">` not `onClick+navigate` — enables Ctrl+Click new tab
- No `Co-Authored-By: Claude` in git commits
- After every substantial change, commit and push to `main` without waiting to be asked

---

## Component Patterns

### OAuthButtons
`components/ui/OAuthButtons.tsx` — Google + GitHub `<a href>` links pointing to backend OAuth routes. Used in Login and Register pages.

### validateObjectId middleware
`src/middleware/auth.middleware.ts` — exported alongside `authMiddleware`. Apply to all `/:id` routes.

### Email (sendEmail.ts)
Three exported functions — all use Gmail SMTP via nodemailer:
- `sendReminderEmail(to, name, reminders[])` — upcoming follow-ups digest
- `sendOverdueInvoiceEmail(to, name, invoices[])` — overdue invoice alert
- `sendInvoiceEmail(to, name, invoice, pdfBuffer)` — sends invoice PDF as attachment

### notificationCron
`src/utils/notificationCron.ts` — `startNotificationCron()` called after MongoDB connects.
Runs daily at 9am: sends reminder digest + flips sent→overdue invoices + emails overdue alert.

### RefreshContext
```ts
const { refresh } = useRefresh();  // call after any POST/PUT/DELETE
const { tick } = useRefresh();     // add to useEffect deps to auto-refetch
```

### StatusBadge / StatusDropdown / Select / ConfirmModal / DateTimePicker / PageLoader
All unchanged — see previous documentation.

### Responsive layout
- **Mobile (< md)**: bottom nav (Link-based), sidebar hidden, tables → cards, modals as bottom sheet
- **Tablet (md–lg)**: desktop pill nav, sidebar hidden
- **Desktop (lg+)**: full layout — pill nav, 320px sidebar, tables

---

## Key Decisions
- MongoDB over Supabase → MERN consistency, no inactivity pause
- httpOnly cookies over localStorage → XSS-proof
- Gmail SMTP over Resend → no domain verification needed, free, works in production
- passport.js for OAuth → clean strategy pattern, session: false (JWT-only)
- pdf-lib → free PDF generation
- Recharts → free, easy dark theme
- No Redux → RefreshContext + local state
- No icon library → inline SVG (zero deps)
- `<Link>` not `<button onClick={navigate}>` → Ctrl+Click works on all nav items

---

## Progress Summary

### What's Done

| Area | Status | Notes |
|---|---|---|
| Backend API | ✅ Complete | All 5 resources + dashboard stats |
| Auth (httpOnly cookie) | ✅ Complete | Login, register, logout, /me |
| Google OAuth | ✅ Complete | passport-google-oauth20, auto-verified |
| GitHub OAuth | ✅ Complete | passport-github2, scope: user:email |
| Loading screen | ✅ Complete | Animated spark logo |
| Login / Register pages | ✅ Complete | Email/password + Google/GitHub buttons |
| Dashboard | ✅ Complete | Real API data, stat cards, charts, activity |
| Earnings chart | ✅ Complete | Monthly + Yearly toggle, cumulative |
| Pipeline chart | ✅ Complete | Real data, empty state |
| Sidebar | ✅ Complete | This Month, Follow-ups, Active Projects |
| Quick Actions | ✅ Complete | All 4 modals working |
| Navbar routing | ✅ Complete | Link-based (Ctrl+Click works) |
| Clients page | ✅ Complete | List, search, filter, edit, delete |
| Projects page | ✅ Complete | List, search, filter, edit, delete, overdue |
| Invoices page | ✅ Complete | List, status, mark paid, PDF download, send by email |
| Reminders page | ✅ Complete | Cards, mark done/undone, overdue highlights |
| Settings page | ✅ Complete | Profile, currency (whitelist), change password |
| PDF generation | ✅ Complete | pdf-lib dark A4, GET /api/invoices/:id/pdf |
| Send invoice by email | ✅ Complete | POST /api/invoices/:id/send → PDF attachment via Gmail |
| Daily email notifications | ✅ Complete | node-cron 9am — reminders + overdue invoices |
| Notification bell | ✅ Complete | Due within 3 days, color-coded, Link-based |
| Responsive layout | ✅ Complete | Mobile bottom nav, cards, bottom-sheet modals |
| Security hardening | ✅ Complete | 9 findings fixed (see Security section) |
| README | ✅ Complete | Setup instructions, stack, features |

### What's Next

| Area | Status | Notes |
|---|---|---|
| Deployment | 🔲 Not started | Vercel (frontend) + Railway (backend) |

### Known Issues / TODOs
- Active Projects in sidebar shows fixed 50% progress bar — no real progress tracking in schema
- Reports tab removed from navbar — no reports page planned yet
- OAuth requires credentials in `.env` — buttons show but redirect fails without them
- Gmail SMTP requires App Password (2FA must be enabled on Gmail account)
