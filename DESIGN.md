# Raqib — DESIGN.md
> Design system & UI specs for Claude Code
> Style: Ultra minimal, Linear-inspired, dark navy + sage green

---

## Design Philosophy
- Every element must have a reason to exist
- Typography and spacing do the heavy lifting
- NO decorative elements, NO gradients, NO shadows
- NO glassmorphism, NO glow effects, NO AI vibes
- YES sharp edges, YES subtle borders, YES precise spacing

---

## Color Tokens

### CSS Variables (copy this into index.css)
```css
:root {
  /* Light theme */
  --bg:             #F8FAFC;
  --surface:        #FFFFFF;
  --border:         #E2E8F0;
  --accent:         #16A34A;
  --accent-hover:   #15803D;
  --text:           #0F172A;
  --muted:          #64748B;
}

.dark {
  /* Dark theme */
  --bg:             #0F1117;
  --surface:        #161B27;
  --border:         #1F2937;
  --accent:         #4ADE80;
  --accent-hover:   #22C55E;
  --text:           #F9FAFB;
  --muted:          #6B7280;
}

/* Status colors — same in both themes */
--status-paid:      #4ADE80;
--status-pending:   #FBBF24;
--status-overdue:   #F87171;
--status-lead:      #60A5FA;
--status-lost:      #6B7280;
--status-active:    #4ADE80;
--status-draft:     #6B7280;
```

### Tailwind Config (tailwind.config.js)
```js
theme: {
  extend: {
    colors: {
      raqib: {
        bg:       'var(--bg)',
        surface:  'var(--surface)',
        border:   'var(--border)',
        accent:   'var(--accent)',
        'accent-hover': 'var(--accent-hover)',
        text:     'var(--text)',
        muted:    'var(--muted)',
      },
      status: {
        paid:     '#4ADE80',
        pending:  '#FBBF24',
        overdue:  '#F87171',
        lead:     '#60A5FA',
        lost:     '#6B7280',
        active:   '#4ADE80',
        draft:    '#6B7280',
      }
    }
  }
}
```

---

## Typography

| Element          | Size | Weight    | Color         |
|-----------------|------|-----------|---------------|
| Page title       | 20px | SemiBold  | var(--text)   |
| Section label    | 11px | Medium    | var(--muted)  UPPERCASE tracking-widest |
| Stat number      | 28px | Bold      | var(--text)   |
| Stat label       | 12px | Regular   | var(--muted)  |
| Body text        | 14px | Regular   | var(--text)   |
| Table text       | 13px | Regular   | var(--text)   |
| Table header     | 11px | Medium    | var(--muted)  UPPERCASE |
| Badge text       | 11px | Medium    | status color  |
| Muted/sub text   | 12px | Regular   | var(--muted)  |
| Nav tabs         | 13px | Medium    | var(--muted)  |
| Nav active       | 13px | Medium    | var(--accent) |

Font family: Inter (all weights)

---

## Spacing System
```
Base unit:        4px
Element gap:      8px
Component gap:    16px
Section gap:      32px
Card padding:     20px 24px
Page padding:     32px
Sidebar padding:  24px
```

---

## Border & Radius Rules
```
Border:           1px solid var(--border)
Border radius:    6px on ALL components
Progress bars:    2px radius
NO border radius above 8px
NO box shadows anywhere
NO outline on focus (use border color change)
```

---

## Components

### StatCard
```jsx
// Usage: <StatCard label="TOTAL EARNED" value="$12,400" sub="↑ 24% this month" subColor="accent" />
className="bg-raqib-surface border border-raqib-border rounded-[6px] p-5"

Structure:
  - label:  text-[11px] font-medium text-raqib-muted uppercase tracking-widest mb-3
  - value:  text-[28px] font-bold text-raqib-text mb-1
  - sub:    text-[12px] text-raqib-accent (or status color)
```

### StatusBadge
```jsx
// Usage: <StatusBadge status="paid" />
// status: paid | pending | overdue | lead | lost | draft | active

Structure:
  - container: inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px]
  - bg: status color at 15% opacity  (e.g. bg-[#4ADE80]/15)
  - dot: w-1.5 h-1.5 rounded-full bg-[statusColor]
  - text: text-[11px] font-medium text-[statusColor]
```

### Card (generic wrapper)
```jsx
className="bg-raqib-surface border border-raqib-border rounded-[6px]"
// add padding per use case
// NEVER add shadow
```

### Button — Primary
```jsx
className="bg-raqib-accent hover:bg-raqib-accent-hover 
           text-[#0F1117] text-[13px] font-medium 
           px-4 py-2 rounded-[6px] transition-colors"
```

### Button — Ghost
```jsx
className="border border-raqib-border hover:border-raqib-accent
           text-raqib-muted hover:text-raqib-text
           text-[13px] font-medium
           px-4 py-2 rounded-[6px] transition-colors"
```

### Section Label
```jsx
className="text-[11px] font-medium text-raqib-muted uppercase tracking-widest"
// always use this for section titles
// example: "RECENT ACTIVITY", "QUICK ACTIONS"
```

### Table
```jsx
// Header row
<th className="text-[11px] font-medium text-raqib-muted uppercase 
               tracking-widest pb-3 border-b border-raqib-border">

// Body row
<tr className="border-b border-raqib-border 
               hover:bg-raqib-surface/50 transition-colors">
<td className="text-[13px] text-raqib-text py-3">
```

### NavTab
```jsx
// Active
className="text-[13px] font-medium text-raqib-accent 
           bg-raqib-surface px-3 py-1.5 rounded-[6px]"

// Inactive
className="text-[13px] font-medium text-raqib-muted 
           hover:text-raqib-text px-3 py-1.5 
           rounded-[6px] transition-colors"
```

### Progress Bar
```jsx
// Track
<div className="w-full h-[3px] bg-raqib-border rounded-[2px]">
  // Fill
  <div className="h-full bg-raqib-accent rounded-[2px]" 
       style={{ width: `${percent}%` }} />
</div>
```

### Avatar (initials)
```jsx
// 28px for tables, 32px for navbar
className="w-7 h-7 rounded-full flex items-center justify-center
           text-[11px] font-medium text-white"
// bg: use muted colors — bg-[#374151], bg-[#1E3A5F], bg-[#3D2B1F]
// generate from name initials
```

### Input / Form Field
```jsx
className="w-full bg-raqib-surface border border-raqib-border 
           rounded-[6px] px-3 py-2 text-[13px] text-raqib-text
           placeholder:text-raqib-muted
           focus:outline-none focus:border-raqib-accent
           transition-colors"
```

---

## Layout Structure

### Navbar (48px height)
```
[R logo] [Raqib wordmark]    [Dashboard|Clients|Projects|Invoices|Reports]    [🔔] [Avatar]
border-bottom: 1px solid var(--border)
bg: var(--bg)
px-6
```

### Main Layout
```
┌─────────────────────────────────────────┬──────────────┐
│                                         │              │
│   MAIN CONTENT (75%)                    │  SIDEBAR     │
│   px-8 py-8                             │  (25%)       │
│                                         │  px-6 py-6   │
│                                         │  border-left │
└─────────────────────────────────────────┴──────────────┘
```

### Dashboard Page Structure
```
1. Page header (title + date)
2. 4 StatCards (grid-cols-4 gap-4)
3. Row 2 — EarningsChart (58%) + PipelineChart (42%)
4. Recent Activity table (full width)
```

### Sidebar Structure
```
1. This Month card (accent bg subtle)
2. Quick Actions (2x2 grid)
3. Follow-ups list
4. Active Projects list
```

---

## Charts (Recharts)

### Line Chart (Earnings)
```jsx
// Colors
stroke="#4ADE80"          // line color
strokeWidth={1.5}         // thin line
dot={false}               // no dots on line
// Grid
CartesianGrid — horizontal only
stroke="#1F2937"          // border color
strokeDasharray="0"       // solid not dashed
// Axes
XAxis/YAxis — stroke="#6B7280" fontSize={11}
// No fill under line (no Area, use Line only)
```

### Donut Chart (Pipeline)
```jsx
// Recharts PieChart with innerRadius
innerRadius={55}
outerRadius={75}
strokeWidth={0}           // no gap between slices
// Colors per status
Lead:        "#60A5FA"
Negotiating: "#FBBF24"
Active:      "#4ADE80"
Done:        "#6B7280"
```

---

## Dark/Light Toggle
```jsx
// In Layout.jsx or ThemeContext
const toggleTheme = () => {
  document.documentElement.classList.toggle('dark')
  localStorage.setItem('theme', 
    document.documentElement.classList.contains('dark') 
    ? 'dark' : 'light'
  )
}

// On mount
const saved = localStorage.getItem('theme') || 'dark'
document.documentElement.classList.toggle('dark', saved === 'dark')
```

---

## What Claude Should NEVER Generate
- ❌ className with shadow (shadow-*, drop-shadow)
- ❌ gradient classes (bg-gradient-*, from-*, to-*)
- ❌ rounded-full on cards or buttons (only on avatars/dots)
- ❌ border-radius above rounded-lg (8px)
- ❌ backdrop-blur or backdrop-filter
- ❌ ring-* classes
- ❌ Any inline color not from the token system above
- ❌ Tailwind colors directly (blue-500, green-400) — use raqib tokens
- ❌ text-white or text-black — use text-raqib-text