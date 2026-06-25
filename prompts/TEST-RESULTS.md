You are a senior QA engineer re-running only the failed tests for Raqib CRM.

App:
- Frontend: http://localhost:5174
- Backend: http://localhost:5000

## Context
A previous test run registered testqa@raqib.com — the account already exists.
Use it to LOGIN (not register) for all tests below.
Credentials: testqa@raqib.com / Test1234!

## Failed Tests to Re-Run

### Test 1 — Register with duplicate email shows correct error
1. Go to /register
2. Fill: name="QA Tester", email="testqa@raqib.com", password="Test1234!"
3. Submit
4. EXPECT: stays on /register, shows a visible error message (e.g. "already exists" or "email taken")
5. Take screenshot

### Test 2 — Dashboard loads with real data after login
1. POST to /api/auth/logout to clear any stale cookie
2. Go to /login, fill credentials, submit
3. Wait for redirect to /
4. EXPECT: URL is / or /dashboard (not /login)
5. EXPECT: stat cards visible with numeric values
6. EXPECT: at least 1 recharts chart rendered (.recharts-wrapper)
7. Take screenshot of full dashboard

### Test 3 — Charts render correctly when authenticated
1. While logged in from Test 2, verify:
   - Earnings chart renders (line/area chart visible)
   - Pipeline chart renders OR shows empty state message
   - No "NaN" text anywhere in the page
2. Toggle chart between Monthly and Yearly if toggle exists
3. Take screenshot of charts area

## Report Format
For each test:
- ✅ Pass / ❌ Fail
- Screenshot filename
- Any console errors
- Exact failure reason if failed
