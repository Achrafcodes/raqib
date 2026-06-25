# Cyber Sec — Security Findings Checklist

## 🔴 High

- [x] **H1 — Mass Assignment on Create**
  `client.controller.ts:16`, `project.controller.ts:18`, `invoice.controller.ts:27`, `reminder.controller.ts:18`
  Attacker injects `userId`, `status`, or `invoiceNumber` via `req.body` spread into `Model.create()`.

- [x] **H2 — Mass Assignment on Update**
  `client.controller.ts:38`, `project.controller.ts:43`, `invoice.controller.ts:51`, `reminder.controller.ts:28`
  Attacker PUTs `{ userId: "victimId" }` to reassign record ownership to another user.

---

## 🟠 Medium

- [x] **M1 — No Rate Limiting on Auth Routes**
  `server.ts` — no `express-rate-limit` on `/api/auth/login` or `/api/auth/register`.
  Enables brute-force password attacks with no throttling.

- [x] **M2 — No `helmet` Middleware**
  `server.ts:16` — missing security headers (X-Frame-Options, X-Content-Type-Options, HSTS, etc.).
  Enables clickjacking and MIME sniffing attacks.

- [x] **M3 — Invalid ObjectId Params Cause 500**
  All by-ID controllers — no `mongoose.isValidObjectId()` check before querying.
  Malformed `:id` triggers Mongoose CastError returned as 500 instead of 400.

- [x] **M4 — No Numeric Bounds Validation**
  `invoice.controller.ts:27`, `project.controller.ts:18` — `subtotal`, `total`, `price` have no `min` in schema.
  Attacker saves negative totals, corrupting earnings stats.

---

## 🟡 Low

- [x] **L1 — JWT_SECRET Falls Back to `"undefined"` String**
  `auth.controller.ts:14`, `auth.middleware.ts:25` — no startup guard if env var is missing.
  Tokens silently signed with a known secret if server starts without `.env`.

- [x] **L2 — No Body Size Limit on `express.json()`**
  `server.ts:31` — default 100kb limit not tightened.
  Attacker POSTs large payloads causing memory spikes.

- [x] **L3 — Currency Field Accepts Arbitrary Strings**
  `user.controller.ts:16` — no whitelist or sanitization on `currency` input.
  Stored XSS vector if currency value is ever rendered as raw HTML.
