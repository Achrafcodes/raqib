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
- **Auth:** JWT stored in httpOnly cookie (set by backend, sent automatically via `withCredentials`)
- **PDF Generation:** pdf-lib (not yet implemented)
- **Email:** Resend API (not yet implemented)
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
│   │   ├── routes/          auth, client, project, invoice, reminder, dashboard
│   │   ├── controllers/     one file per resource
│   │   ├── middleware/       auth.middleware.ts, error.middleware.ts
│   │   ├── types/           index.ts (AuthRequest interface)
│   │   └── utils/           generatePDF.ts, sendEmail.ts
│   ├── .env
│   ├── tsconfig.json
│   └── server.ts
│
└── frontend/
    └── src/
        ├── components/
        │   ├── ui/
        │   │   ├── StatCard.tsx
        │   │   ├── StatusBadge.tsx     ← handles ALL statuses (client + project + invoice)
        │   │   ├── Avatar.tsx          ← deterministic color from name, initials
        │   │   ├── Modal.tsx           ← reusable modal shell (Escape + outside click)
        │   │   ├── DateTimePicker.tsx  ← custom dark calendar picker with time
        │   │   ├── LoadingScreen.tsx   ← animated spark logo on auth check
        │   │   └── Icons.tsx           ← inline SVG icon library
        │   ├── layout/
        │   │   ├── Navbar.tsx          ← 60px, spark logo, pill tabs, avatar logout
        │   │   ├── Layout.tsx          ← shell: navbar + main + sidebar
        │   │   └── Sidebar.tsx         ← This Month, Quick Actions, Follow-ups, Active Projects
        │   ├── charts/
        │   │   ├── EarningsChart.tsx   ← accepts { data, totalEarned } props
        │   │   └── PipelineChart.tsx   ← accepts { segments } props, empty state
        │   ├── clients/
        │   │   └── AddClientModal.tsx
        │   ├── projects/
        │   │   └── AddProjectModal.tsx
        │   ├── invoices/
        │   │   └── AddInvoiceModal.tsx ← line items, tax, live totals
        │   └── reminders/
        │       └── AddReminderModal.tsx ← uses DateTimePicker
        ├── pages/
        │   ├── Dashboard.tsx           ← real API data, search filter on activity
        │   ├── Login.tsx
        │   └── Register.tsx
        ├── context/
        │   ├── AuthContext.tsx          ← cookie-based, /me on mount
        │   └── RefreshContext.tsx       ← global tick — increment to trigger refetch everywhere
        ├── types/
        │   └── index.ts                ← User, Client, Project, Invoice, Reminder, DashboardStats
        └── utils/
            └── api.ts                  ← axios with withCredentials: true
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
  userId: ObjectId (ref: User),  // ALWAYS filter by this
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
  invoiceNumber: String,          // "INV-001", auto-generated
  items: [{ description, quantity, unitPrice, total }],
  subtotal: Number,
  tax: Number (default: 0),       // percentage
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

### Auth
```
POST /api/auth/register   → sets httpOnly cookie
POST /api/auth/login      → sets httpOnly cookie
POST /api/auth/logout     → clears cookie
GET  /api/auth/me         → JWT required (reads from cookie)
```

### Dashboard (JWT required)
```
GET /api/dashboard/stats
→ returns: totalEarned, activeProjects, unpaidInvoices,
           followUpsDueToday, earningsChart (last 12 months),
           pipelineBreakdown, recentActivity
```

### Clients / Projects / Invoices / Reminders (JWT required)
```
GET    /api/:resource
POST   /api/:resource
GET    /api/:resource/:id
PUT    /api/:resource/:id
DELETE /api/:resource/:id
PATCH  /api/reminders/:id/done   → mark reminder done
GET    /api/invoices/:id/pdf     → PDF buffer (not yet implemented)
```

---

## Auth Rules
- Cookie: httpOnly, SameSite: lax, 7 day maxAge
- `secure: true` only in production (`NODE_ENV === 'production'`)
- `withCredentials: true` on all axios requests
- CORS: allows `localhost:5173` and `localhost:5174` with `credentials: true`
- `authMiddleware` reads from `req.cookies.token` first, falls back to `Authorization: Bearer` header
- No 401 interceptor on frontend — `ProtectedRoute` handles redirect to `/login`
- `GuestRoute` redirects already-logged-in users away from `/login` and `/register`

---

## Environment Variables

```
# Backend (.env)
MONGO_URI=
JWT_SECRET=
JWT_EXPIRES_IN=7d
RESEND_API_KEY=
CLIENT_URL=http://localhost:5174
PORT=5000

# Frontend (.env)
VITE_API_URL=http://localhost:5000
```

Vite dev server runs on port **5174** (set in `vite.config.ts` with `strictPort: true`).

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
- Global refresh via `RefreshContext` — call `refresh()` after any mutation; Dashboard + Sidebar both listen to `tick`
- Modals: use `<Modal>` shell, close on Escape + outside click
- No `Co-Authored-By: Claude` in git commits

---

## Component Patterns

### Adding a new "create" modal
1. Create `src/components/<resource>/Add<Resource>Modal.tsx`
2. Use `<Modal>` shell, `useRefresh()` for post-save refresh
3. Add state + button in `Sidebar.tsx` Quick Actions
4. `refresh()` call triggers Dashboard + Sidebar refetch automatically

### RefreshContext
```ts
const { refresh } = useRefresh();  // call after any POST/PUT/DELETE
const { tick } = useRefresh();     // add to useEffect deps to auto-refetch
```

### StatusBadge
Handles every possible status string — client, project, invoice statuses all covered.
Fallback: shows raw status string with muted styling if unknown.

### DateTimePicker
Reusable dark calendar picker at `components/ui/DateTimePicker.tsx`.
Props: `value: string` (ISO "YYYY-MM-DDTHH:mm"), `onChange: (v: string) => void`.

---

## Key Decisions
- MongoDB over Supabase → MERN consistency, no inactivity pause
- Vite over CRA → faster dev
- Space Grotesk over Inter → better CRM/dashboard personality
- httpOnly cookies over localStorage → XSS-proof token storage
- pdf-lib → free PDF generation, no external service
- Recharts → free, easy dark theme customization
- No Redux → `RefreshContext` + local state enough for this scope
- No icon library → inline SVG icons (zero dependency, consistent style)
- Spark chart polyline as logo → mirrors the earnings chart, represents business growth

---

## Progress Summary

### Design & UI
- Dark minimal dashboard built pixel-close to Figma reference
- Layout: 60px navbar (spark logo + pill tabs + icon buttons + avatar) | main content (max-w 1180px) | 320px sidebar
- Figma reference converted manually to React + Tailwind — no Figma plugin used
- All emojis replaced with inline SVG icons (Heroicons style, 1.8px stroke)
- Font: Space Grotesk (replaced Inter)
- Spacing root cause fixed: Tailwind v4 global reset must be in `@layer base {}` or it nukes all utility padding/margin

### What's Done

| Area | Status | Notes |
|---|---|---|
| Backend API | ✅ Complete | All 5 resources + dashboard stats |
| Auth (httpOnly cookie) | ✅ Complete | Login, register, logout, /me |
| Loading screen | ✅ Complete | Animated spark logo, fades in |
| Login / Register pages | ✅ Complete | Dark form, redirects if already logged in |
| Dashboard page | ✅ Complete | Real API data, search, stat cards, charts, activity table |
| Earnings chart | ✅ Complete | Real data, monthly/yearly toggle, dynamic Y-axis |
| Pipeline chart | ✅ Complete | Real data, empty state when no clients |
| Sidebar | ✅ Complete | This Month (real), Follow-ups (real), Active Projects (real) |
| Quick Actions | ✅ Complete | All 4 buttons open working modals |
| Add Client modal | ✅ Complete | Full form, POST /api/clients |
| Add Project modal | ✅ Complete | Client dropdown, POST /api/projects |
| Add Invoice modal | ✅ Complete | Line items, tax, live totals, POST /api/invoices |
| Add Reminder modal | ✅ Complete | Calendar date picker, POST /api/reminders |
| Real-time refresh | ✅ Complete | RefreshContext — any modal save updates dashboard + sidebar instantly |
| StatusBadge | ✅ Complete | All statuses handled (client + project + invoice) |
| DateTimePicker | ✅ Complete | Custom dark calendar, month grid, time inputs, quick pills |

### What's Next

| Area | Status | Notes |
|---|---|---|
| Clients page (`/clients`) | 🔲 Not started | Full list, edit, delete, status filter |
| Projects page (`/projects`) | 🔲 Not started | Full list, edit, delete, status filter |
| Invoices page (`/invoices`) | 🔲 Not started | Full list, edit, mark paid, PDF download |
| Reminders page (`/reminders`) | 🔲 Not started | Full list, mark done, overdue highlight |
| Settings page (`/settings`) | 🔲 Not started | Profile form, currency preference |
| PDF invoice generation | 🔲 Not started | pdf-lib, GET /api/invoices/:id/pdf |
| Email notifications | 🔲 Not started | Resend API |
| Navbar tab routing | 🔲 Not started | Tabs currently don't navigate to pages |
| Deployment | 🔲 Not started | Vercel (frontend) + Railway (backend) |

### Known Issues / TODOs
- Navbar pill tabs are visual-only — clicking them doesn't navigate (router not wired to tabs yet)
- Active Projects in sidebar shows fixed 50% progress bar — no real progress tracking in schema
- Invoice `invoiceNumber` auto-generation (INV-001) needs to be verified in backend
- Email verification flow (`isEmailVerified`) is in the schema but not enforced or implemented
