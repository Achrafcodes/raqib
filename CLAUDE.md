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
GET    /api/invoices/:id/pdf     → PDF buffer (pdf-lib, dark branded A4)
PUT    /api/user/profile         → update name, freelanceTitle, currency
PUT    /api/user/password        → verify current password, hash new one
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
- After every substantial change, commit and push to `main` without waiting to be asked

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

### Select (custom dropdown)
Reusable themed dropdown at `components/ui/Select.tsx`. Replaces all native `<select>` — uses `createPortal` to escape `overflow-hidden` containers.
Props: `value`, `onChange`, `options: { value, label }[]`, `disabled?`, `className?`.

### ConfirmModal
Themed delete confirmation at `components/ui/ConfirmModal.tsx`. Red trash icon, backdrop blur, Escape to cancel.
Props: `title`, `message`, `confirmLabel?`, `onConfirm`, `onCancel`, `loading?`.

### StatusDropdown (inline, per-page)
Colored inline dropdown used in Clients, Projects, Invoices tables. Built per-page (not a shared component) because each resource has different status options and colors. Always uses `createPortal` to avoid clipping.

### Form validation pattern
All forms use a `validate(form) → Errs` function + `touched` state map. Errors show inline below each field (icon + red text) only after blur or submit attempt. Invalid fields get `border-[var(--overdue)]`. Server errors render as a red banner. `noValidate` on all forms to suppress browser popups.

### PageLoader
Reusable in-page loader at `components/ui/PageLoader.tsx`. Used at the top of every page while data fetches (`if (loading) return <PageLoader />`). Smaller version of LoadingScreen — spark draw animation + pulsing dots, centered with `min-h-[60vh]`.

### Notification bell
Built into `Navbar.tsx`. Fetches reminders + projects + invoices on mount and on every `tick`. Shows items due within 3 days. Color-coded: red = overdue/today, yellow = tomorrow, green = 2–3 days. Count badge on bell. Each item navigates to its page on click.

### Responsive layout
- **Mobile (< md)**: bottom nav bar with 5 icon+label tabs, sidebar hidden, tables replaced with cards, filters stack vertically, modals slide up as bottom sheet
- **Tablet (md–lg)**: desktop pill nav, sidebar still hidden
- **Desktop (lg+)**: full layout — pill nav, 320px sidebar, tables
- Modal: `items-end sm:items-center`, `rounded-t-[16px] sm:rounded-[12px]`, scrollable body with `max-h-[92dvh]`

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
| Login / Register pages | ✅ Complete | Dark form, regex validation, inline errors, redirects if logged in |
| Dashboard page | ✅ Complete | Real API data, search, stat cards, charts, activity table; Active Projects card navigates to /projects |
| Dashboard stats bug fix | ✅ Complete | `aggregate` $match needs `new ObjectId(userId)` — string won't match |
| Earnings chart | ✅ Complete | Monthly (cumulative daily, stops at today) + Yearly (cumulative monthly, stops at current month), dynamic Y-axis |
| Pipeline chart | ✅ Complete | Real data, empty state when no projects; colors map project statuses: not-started=grey, in-progress=blue, review=yellow, done=green, cancelled=red |
| Sidebar | ✅ Complete | This Month (real), Follow-ups (real), Active Projects (real) |
| Quick Actions | ✅ Complete | All 4 buttons open working modals |
| Navbar tab routing | ✅ Complete | useNavigate + useLocation, active tab from URL |
| Custom Select dropdown | ✅ Complete | Themed, portal-based, replaces all native <select> |
| ConfirmModal | ✅ Complete | Themed delete dialog, Escape to cancel |
| Form validation | ✅ Complete | All forms: regex, touched state, inline errors, red borders, server error banner |
| Favicon | ✅ Complete | Spark logo SVG favicon matching app logo |
| Scrollbars | ✅ Complete | Custom dark themed scrollbars (webkit + firefox) |
| Clients page (`/clients`) | ✅ Complete | List, search, status filter, inline status dropdown, edit, delete |
| Edit Client modal | ✅ Complete | Pre-filled, same validation as Add |
| Projects page (`/projects`) | ✅ Complete | List, search, status filter, inline status dropdown, overdue deadline, edit, delete |
| Edit Project modal | ✅ Complete | Pre-filled, handles clientId as object or string |
| Invoices page (`/invoices`) | ✅ Complete | List, summary cards, status dropdown, mark paid (stamps paidAt), delete |
| Reminders page (`/reminders`) | ✅ Complete | Card list, mark done/undone, overdue/today highlights, sort by due date |
| Add Client modal | ✅ Complete | Full form + validation, POST /api/clients |
| Add Project modal | ✅ Complete | Client dropdown + validation, POST /api/projects |
| Add Invoice modal | ✅ Complete | Line items, tax, live totals, POST /api/invoices |
| Add Reminder modal | ✅ Complete | Calendar date picker, POST /api/reminders |
| Edit Invoice modal | ✅ Complete | Pre-filled, line items, auto-stamps paidAt when marked paid |
| Real-time refresh | ✅ Complete | RefreshContext — any modal save updates dashboard + sidebar instantly |
| StatusBadge | ✅ Complete | All statuses handled (client + project + invoice) |
| DateTimePicker | ✅ Complete | Custom dark calendar, month grid, time inputs, quick pills |
| PageLoader | ✅ Complete | In-page spark animation, shown while data fetches on every page |
| Settings page (`/settings`) | ✅ Complete | Profile (name, title, currency), read-only email, change password |
| PDF invoice generation | ✅ Complete | pdf-lib dark A4 layout, GET /api/invoices/:id/pdf, blob download |
| Avatar dropdown | ✅ Complete | Name/email header, Settings link, Sign out — replaces direct logout |
| Notification bell | ✅ Complete | Reminders/projects/invoices due within 3 days, color-coded by urgency |
| Responsive layout | ✅ Complete | Mobile bottom nav, sidebar hidden <lg, tables → cards on mobile, modals as bottom sheet |

### What's Next

| Area | Status | Notes |
|---|---|---|
| Email notifications | 🔲 Not started | Resend API |
| Deployment | 🔲 Not started | Vercel (frontend) + Railway (backend) |

### Known Issues / TODOs
- Active Projects in sidebar shows fixed 50% progress bar — no real progress tracking in schema
- Email verification flow (`isEmailVerified`) is in the schema but not enforced or implemented
- Reports tab removed from navbar (replaced with Reminders) — no reports page planned yet
