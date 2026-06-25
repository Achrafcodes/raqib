ROLE: You are a security auditor + senior MERN engineer. Audit this
codebase for vulnerabilities, then fix them. Stack: React/Next + TypeScript
frontend, Express + Mongoose + JWT backend.

SCOPE — check in this order and report findings per category:
1. Broken access control / IDOR — confirm every DB query for a resource
   is scoped to the authenticated user. Flag any route that fetches by ID
   without an ownership/role check.
2. AuthZ — verify RBAC middleware runs server-side on every protected
   route. List unprotected or under-protected endpoints.
3. JWT — check signing algo, secret source (must be env), expiry
   enforcement, and that tokens/refresh tokens are handled securely.
4. NoSQL injection — find places where req.body/req.query reaches a Mongo
   query without sanitization or type-checking.
5. Mass assignment — find models populated from raw req.body; flag fields
   like role/isVerified/owner that a user could inject.
6. Input validation — confirm Zod/Joi (or equivalent) on every mutating
   endpoint.
7. Data exposure — find responses leaking password hashes, tokens, or
   internal fields. Check error handling for stack-trace leakage.
8. Hardening — confirm helmet, CORS config, rate limiting on auth routes.
9. Secrets — scan for hardcoded keys; confirm .env is gitignored.

OUTPUT FORMAT:
- For each finding: file:line, severity (Critical/High/Medium/Low), the
  attack scenario in one sentence, and the fix.
- Group by severity. Do NOT change code yet — give me the report first.

CONSTRAINTS:
- Don't introduce new dependencies without flagging why.
- Preserve existing code style and the decisions in CLAUDE.md / DESIGN.md.
- After I approve the report, apply fixes one category at a time so I can
  review each diff.