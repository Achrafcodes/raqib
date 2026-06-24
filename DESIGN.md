# Raqib — DESIGN.md v3
> NUCLEAR RESET — Delete everything and rebuild from scratch
> No screenshots needed. Every pixel is defined here.

---

## STEP 0 — BEFORE YOU WRITE A SINGLE LINE

Read this entire file first.
Then delete ALL existing frontend components.
Then rebuild from scratch following this spec exactly.
No assumptions. No defaults. No Tailwind base styles leaking in.

---

## THE ONE RULE

> If it's not in this file, don't invent it.
> Every color, every size, every spacing value is here.

---

## 1. GLOBAL SETUP

### index.css — paste this exactly, nothing else
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --bg:              #0C0E14;
  --surface:         #141920;
  --surface-2:       #1A2030;
  --border:          #1E2533;
  --border-2:        #2D3748;
  --accent:          #4ADE80;
  --accent-dim:      rgba(74, 222, 128, 0.08);
  --text-1:          #F1F5F9;
  --text-2:          #94A3B8;
  --text-3:          #475569;
  --paid:            #4ADE80;
  --paid-bg:         rgba(74,222,128,0.10);
  --pending:         #FBBF24;
  --pending-bg:      rgba(251,191,36,0.10);
  --overdue:         #F87171;
  --overdue-bg:      rgba(248,113,113,0.10);
  --lead:            #60A5FA;
  --lead-bg:         rgba(96,165,250,0.10);
  --lost:            #475569;
  --lost-bg:         rgba(71,85,105,0.10);
}

html, body, #root {
  height: 100%;
  width: 100%;
  background: var(--bg);
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 14px;
  color: var(--text-1);
  -webkit-font-smoothing: antialiased;
}

* { font-family: 'Inter', system-ui, sans-serif; }
```

### tailwind.config.js — paste this exactly
```js
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        r: {
          bg:       'var(--bg)',
          surface:  'var(--surface)',
          s2:       'var(--surface-2)',
          border:   'var(--border)',
          b2:       'var(--border-2)',
          accent:   'var(--accent)',
          1:        'var(--text-1)',
          2:        'var(--text-2)',
          3:        'var(--text-3)',
        }
      },
      fontSize: {
        '10': ['10px', { lineHeight: '14px', letterSpacing: '0.06em' }],
        '11': ['11px', { lineHeight: '16px' }],
        '12': ['12px', { lineHeight: '18px' }],
        '13': ['13px', { lineHeight: '20px' }],
        '14': ['14px', { lineHeight: '22px' }],
        '18': ['18px', { lineHeight: '26px' }],
        '22': ['22px', { lineHeight: '30px', letterSpacing: '-0.01em' }],
        '30': ['30px', { lineHeight: '38px', letterSpacing: '-0.02em' }],
      }
    }
  }
}
```

---

## 2. APP LAYOUT — App.tsx

```
Full screen split:
┌─────────────────────────────────────────────────────┐
│                  NAVBAR (h-12 = 48px)               │
├─────────────────────────────────────── ┬────────────┤
│                                        │            │
│         MAIN CONTENT                   │  SIDEBAR   │
│         flex-1                         │  w-[260px] │
│         overflow-y-auto                │            │
│         px-8 py-8                      │  px-5 py-6 │
│                                        │            │
└────────────────────────────────────────┴────────────┘

html structure:
<div class="flex flex-col h-screen bg-r-bg overflow-hidden">
  <Navbar />
  <div class="flex flex-1 overflow-hidden">
    <main class="flex-1 overflow-y-auto px-8 py-8">
      {page content}
    </main>
    <Sidebar />
  </div>
</div>
```

---

## 3. NAVBAR COMPONENT

```
Height: h-12 (48px)
Background: bg-r-bg
Border bottom: border-b border-r-border
Padding: px-6
Position: sticky top-0 z-50
Layout: flex items-center justify-between

LEFT — Logo + Wordmark:
  Logo mark:
    w-7 h-7 (28px square)
    bg-r-accent
    rounded-[6px]
    flex items-center justify-center
    text-[13px] font-bold text-[#0C0E14]
    letter: "R"
  
  Gap between logo and wordmark: gap-2
  
  Wordmark:
    text-[15px] font-semibold text-r-1

CENTER — Nav tabs:
  Container:
    flex items-center
    bg-r-surface
    border border-r-border
    rounded-[8px]
    p-[3px]
    gap-[2px]
  
  Each tab:
    text-[12px] font-medium
    px-3 py-[5px]
    rounded-[6px]
    cursor-pointer
    transition-colors duration-100
    
    INACTIVE: text-r-3 hover:text-r-2
    ACTIVE: 
      bg-r-bg
      border border-r-border
      text-r-accent

  Tabs: Dashboard | Clients | Projects | Invoices | Reports

RIGHT — Icons:
  gap-3 flex items-center
  Bell icon: 16px text-r-3
  Avatar: 
    w-8 h-8 rounded-full
    bg-r-surface
    border border-r-b2
    text-[11px] font-semibold text-r-2
    flex items-center justify-center
```

---

## 4. SIDEBAR COMPONENT

```
Width: w-[260px] (fixed, never shrink)
Background: bg-r-bg
Border left: border-l border-r-border
Padding: px-5 py-6
overflow-y-auto
flex flex-col gap-6

─────────────────────────────
SECTION 1 — THIS MONTH CARD
─────────────────────────────
Container:
  bg-r-surface
  border border-r-b2
  rounded-[8px]
  p-4

Label: "THIS MONTH"
  text-[10px] font-medium text-r-3
  uppercase tracking-[0.08em]
  mb-2

Value: "$4,200"
  text-[24px] font-bold text-r-1
  letter-spacing: -0.02em
  tabular-nums

Sub: "↑ 18% vs last month"
  text-[11px] text-r-accent mt-1

Progress bar (mt-3):
  Track: h-[2px] w-full bg-r-border rounded-full
  Fill: h-full bg-r-accent rounded-full width=68%

─────────────────────────────
SECTION 2 — QUICK ACTIONS
─────────────────────────────
Label: "QUICK ACTIONS"
  text-[10px] font-medium text-r-3
  uppercase tracking-[0.08em]
  mb-3

Grid: grid grid-cols-2 gap-[6px]

Each button (4 total):
  bg-r-surface
  border border-r-border
  rounded-[6px]
  p-3
  flex flex-col items-center gap-[6px]
  cursor-pointer
  hover:border-r-b2 transition-colors

  Icon: text-r-accent text-[15px]
  Label: text-[10px] text-r-3 text-center

  Buttons:
    [+ icon] "New Client"
    [folder icon] "New Project"
    [file icon] "Invoice"
    [bell icon] "Reminder"

─────────────────────────────
SECTION 3 — FOLLOW-UPS
─────────────────────────────
Header row: flex justify-between items-center mb-3
  Label: "FOLLOW-UPS" — same style as above
  "+" icon: text-r-3 text-[14px] cursor-pointer

Each follow-up item (gap-[10px] between):
  flex flex-col gap-[4px]
  
  Top row: flex justify-between
    Name: text-[12px] font-medium text-r-1
    Time: text-[11px] text-r-3
  
  Bar: h-[2px] w-full rounded-full
    TODAY → bg-[var(--overdue)]
    TOMORROW → bg-[var(--pending)]
    3+ DAYS → bg-[var(--paid)]

Sample data:
  "Ahmed S." | "Today" | red bar
  "Sara M." | "Tomorrow" | yellow bar
  "John D." | "In 3 days" | green bar

─────────────────────────────
SECTION 4 — ACTIVE PROJECTS
─────────────────────────────
Header row: flex justify-between items-center mb-3
  Label: "ACTIVE PROJECTS"
  "All →": text-[11px] text-r-accent cursor-pointer

Each project item (gap-[10px] between):
  flex items-center gap-[8px]
  
  Icon box:
    w-[26px] h-[26px]
    bg-r-s2
    border border-r-border
    rounded-[5px]
    flex items-center justify-center
    text-[10px] font-semibold text-r-accent
    (first letter of project name)
  
  Info: flex-1 min-w-0
    Name: text-[12px] font-medium text-r-1 truncate
    Client: text-[10px] text-r-3
    Progress bar (mt-[3px]):
      h-[2px] bg-r-border rounded-full
      fill: bg-r-accent rounded-full
  
  Percent: text-[10px] text-r-3 ml-1

Sample data:
  "B" | "Brand Identity" | "Ahmed S." | 80%
  "W" | "Web Dev" | "Sara M." | 45%
  "S" | "SEO Campaign" | "John D." | 20%
```

---

## 5. DASHBOARD PAGE

```
Container: flex flex-col gap-8

─────────────────────────────
A. PAGE HEADER
─────────────────────────────
Title: "Dashboard"
  text-[20px] font-semibold text-r-1

Sub: current date (e.g. "Wednesday, 24 June 2026")
  text-[12px] text-r-3 mt-[2px]

─────────────────────────────
B. STAT CARDS ROW
─────────────────────────────
Grid: grid grid-cols-4 gap-4

Each StatCard:
  bg-r-surface
  border border-r-b2
  rounded-[8px]
  p-6
  flex flex-col gap-0
  hover:border-r-border transition-colors

  Label (top):
    text-[10px] font-medium text-r-3
    uppercase tracking-[0.08em]
    mb-3

  Value:
    text-[30px] font-bold text-r-1
    tabular-nums tracking-tight
    mb-2

  Sub row (flex items-center gap-1):
    Trend: text-[11px] font-medium
    Rest: text-[11px] text-r-3

  The 4 cards:
  
  Card 1 — TOTAL EARNED
    value: "$0" (from API)
    sub trend: "↑ 24%" color var(--paid)
    sub text: "· this month"
  
  Card 2 — ACTIVE PROJECTS
    value: "0"
    sub trend: "+ 2 new" color var(--paid)
    sub text: "· this month"
  
  Card 3 — UNPAID INVOICES
    value: "$0"
    sub trend: "0 unpaid" color var(--overdue)
    sub text: "· awaiting"
  
  Card 4 — FOLLOW-UPS DUE
    value: "0"
    sub trend: "due today" color var(--pending)

─────────────────────────────
C. CHARTS ROW
─────────────────────────────
Grid: grid grid-cols-5 gap-4

LEFT — Earnings Overview (col-span-3):
  bg-r-surface border border-r-b2 rounded-[8px] p-6

  Header: flex justify-between items-center mb-5
    Title: "EARNINGS OVERVIEW"
      text-[10px] font-medium text-r-3 uppercase tracking-[0.08em]
    
    Toggle group:
      flex bg-r-bg border border-r-border rounded-[6px] p-[2px]
      Each btn: text-[11px] font-medium px-[10px] py-[3px] rounded-[4px]
      INACTIVE: text-r-3
      ACTIVE: bg-r-s2 text-r-accent

  Chart (Recharts LineChart):
    height: 160px
    NO fill under line
    Line: stroke var(--accent) strokeWidth 1.5 dot=false
    Grid: horizontal only stroke var(--border) strokeDasharray="0"
    XAxis: fontSize 10 fill var(--text-3) tickLine=false axisLine=false
    YAxis: fontSize 10 fill var(--text-3) tickLine=false axisLine=false
           tickFormatter: (v) => `$${v}k`
    Tooltip: bg var(--surface) border var(--border) text-r-1 text-[12px]

RIGHT — Client Pipeline (col-span-2):
  bg-r-surface border border-r-b2 rounded-[8px] p-6

  Header: mb-4
    Title: "CLIENT PIPELINE"
    Sub: "Stage breakdown" text-[11px] text-r-3 mt-[2px]

  Content: flex flex-col items-center gap-4

  Donut (Recharts PieChart 130×130):
    innerRadius: 40
    outerRadius: 58
    paddingAngle: 2
    strokeWidth: 0
    NO labels inside
    
    Segments:
      Lead:        #60A5FA  30%
      Negotiating: #FBBF24  20%
      Active:      #4ADE80  35%
      Done:        #475569  15%

  Legend (w-full):
    Each item: flex justify-between items-center py-[3px]
    Left: flex items-center gap-2
      Dot: w-[6px] h-[6px] rounded-full bg=[segmentColor]
      Label: text-[11px] text-r-2
    Right: text-[11px] text-r-3 tabular-nums

─────────────────────────────
D. RECENT ACTIVITY TABLE
─────────────────────────────
Container: bg-r-surface border border-r-b2 rounded-[8px] p-6

Header: flex justify-between items-center mb-5
  Title: "RECENT ACTIVITY"
    text-[10px] font-medium text-r-3 uppercase tracking-[0.08em]
  "View all →": text-[11px] text-r-accent cursor-pointer

Table: w-full border-collapse

TH:
  text-[10px] font-medium text-r-3 uppercase tracking-[0.06em]
  text-left pb-3 border-b border-r-border

Columns: CLIENT | PROJECT | AMOUNT | STATUS | ACTION

TD:
  text-[13px] text-r-1
  py-[13px]
  border-b border-r-border
  last row: border-b-0

  CLIENT cell:
    flex items-center gap-[10px]
    Avatar: w-[28px] h-[28px] rounded-full
            text-[10px] font-semibold text-white
            bg = deterministic muted color from name
            (use: #1E3A5F | #3D1F5F | #3D2B1F | #1F3D2B | #3D3D1F)
    Name: text-[13px] font-medium text-r-1

  PROJECT cell: text-r-3 text-[13px]
  
  AMOUNT cell: text-r-1 text-[13px] tabular-nums
  
  STATUS cell:
    StatusBadge component:
      inline-flex items-center gap-[5px]
      px-2 py-[2px] rounded-[4px]
      bg = status var bg
      text = status var color
      text-[11px] font-medium
      
      Dot: w-[5px] h-[5px] rounded-full bg=statusColor
      
      Values: Paid | Pending | Overdue | Lead | Lost

  ACTION cell:
    "···" text-r-3 hover:text-r-1
    opacity-0 on row, opacity-100 on row hover

Row hover: bg-r-s2 transition-colors duration-75

Empty state (when no data):
  py-16 text-center
  Icon: text-r-3 text-[32px] mb-3
  Text: "No invoices yet" text-[13px] text-r-2
  Sub: "Create your first invoice →"
       text-[12px] text-r-accent cursor-pointer mt-1
```

---

## 6. REUSABLE COMPONENTS

### StatCard.tsx
```tsx
interface StatCardProps {
  label: string
  value: string
  trendValue: string
  trendText: string
  trendColor: string
}
// use exact specs from section 5B above
```

### StatusBadge.tsx
```tsx
type Status = 'paid' | 'pending' | 'overdue' | 'lead' | 'lost'
// use CSS variables for colors
// dot + text inside pill
// exact specs from section 5D above
```

### SectionLabel.tsx
```tsx
// reusable uppercase label component
className="text-[10px] font-medium text-r-3 uppercase tracking-[0.08em]"
```

---

## 7. WHAT IS STRICTLY FORBIDDEN

```
NEVER use these — instant rejection:

❌ shadow-* or drop-shadow anywhere
❌ bg-gradient-* / from-* / to-*
❌ backdrop-blur or backdrop-filter
❌ rounded-full on anything except avatars and dots
❌ border-radius above rounded-lg (8px) on cards
❌ any Tailwind color directly: blue-500, green-400, gray-700
   → use CSS variables only
❌ text-white or text-black
   → use text-r-1 or text-r-3
❌ font size below text-[10px]
❌ p-2 or p-3 on main cards
   → minimum p-6
❌ gap-1 or gap-2 between sections
   → minimum gap-4
❌ more than 2 font weights on same element
❌ colored card backgrounds (accent bg on cards)
❌ any decorative element not listed above
```

---

## 8. PROMPT TO START

After reading this file, tell Claude Code:

```
Delete ALL existing files in src/components/ and src/pages/
Read DESIGN.md v3 completely
Rebuild from scratch in this order:
1. index.css (exact CSS variables from section 1)
2. tailwind.config.js (exact config from section 1)
3. Layout component (section 2)
4. Navbar component (section 3)
5. Sidebar component (section 4)
6. StatCard component (section 6)
7. StatusBadge component (section 6)
8. Dashboard page (section 5)

Do NOT start next component until current one compiles.
Do NOT invent anything not in DESIGN.md.
```