# Waitlist → Service Providers

Frontend Developer Assessment — the **Waitlist → Service Providers** dashboard page,
built from the provided Figma design.

**Live demo:** https://gler-eight.vercel.app

**Stack:** React 18 + TypeScript + Vite. Styling is plain CSS Modules with design
tokens (`src/styles/tokens.css`) — no UI framework.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
```

## Deployment

Hosted on **Vercel** (zero-config Vite preset). Every push to `main` triggers a
production deploy; pull requests get preview URLs.

| Setting           | Value           |
| ----------------- | --------------- |
| Framework preset  | Vite            |
| Build command     | `npm run build` (`tsc --noEmit && vite build`) |
| Output directory  | `dist`          |
| Node version      | 22.x (`engines` in `package.json`) |
| Environment vars  | none            |

| Script              | Purpose                          |
| ------------------- | -------------------------------- |
| `npm run dev`       | Start the Vite dev server        |
| `npm run build`     | Type-check (`tsc`) + production build |
| `npm run preview`   | Preview the production build     |
| `npm run typecheck` | Type-check only                  |

The dataset is mock data generated deterministically in
`src/data/providers.ts` (64 rows → 7 pages at 10 rows/page).

## What's implemented

### 1. Table (`src/components/waitlist/ProvidersTable.tsx`)
- Columns: **Email, Phone Number, Postcode, Vendor Type, Service Offering, Signup Date,
  Status, Actions** — plus a selection checkbox column.
- **10 rows per page** with pagination (7 pages; compact `1 … 4 [5] 6 … 12` layout with
  prev/next).
- **Sorting** on every data column — click a header to cycle asc → desc → off.
- **Filtering across every column** via the toggleable **Column filters** row
  (text match for email/phone/postcode, dropdowns for vendor type / service offering /
  status, a from–to range for signup date).
- **Row selection** with a header **Select All** (per page, with indeterminate state) and
  a live "N selected" indicator.
- **Actions:** the pencil opens the **User Details modal**; the arrow performs a
  **dummy redirect** (`window.open` to a placeholder profile URL) with a toast.

### 2. Sidebar filters (`src/components/filters/FilterPanel.tsx`)
- **Postcode** — UK ZIP text input.
- **Registration Status** — Onboarded / Rejected checkboxes.
- **Date Registered** — Start + End fields, **MM/DD/YYYY** (masked text input with an
  attached calendar picker; invalid input is flagged).
- **Vendor Type** — Independent / Company checkboxes.
- **Service Offering** — Housekeeping / Window Cleaning / Car Valet checkboxes.
- **Apply Filters** — commits every selection at once (sidebar filters are draft state
  until applied). **Clear Filters** — resets sidebar filters, column filters, search and
  sort.

### 3. Main content
- **Search bar** top-right above the table. Filters live (250 ms debounce) and
  immediately on **Enter**; trims whitespace and matches partial input across all text
  columns.
- **Status** column renders `Onboarded` / `Rejected` badges (and `—` for not-yet-decided
  rows, matching the Figma).
- The **User Details modal** mirrors the Figma layout — contact info, vendor details,
  service offering, editable internal note, and **Onboard / Reject** actions that update
  the row and raise a toast.

### 4. Responsiveness
- Below **1024px** the sidebar collapses into a slide-in drawer (opened from the top-nav
  menu button or the toolbar **Filters** button; closes on overlay click / `Esc`).
- The table scrolls horizontally within its container on small screens.

### 5. Enhancements
- Success / info toasts after applying or clearing filters and after row actions
  (`src/hooks/useToast.tsx`, `src/components/ui/Toast.tsx`).
- Hover states and `cubic-bezier` transitions on rows, buttons, inputs, pagination,
  toasts and the modal.

## Project layout

```
src/
├── components/
│   ├── filters/     FilterPanel, DateField
│   ├── layout/      TopNav, Sidebar
│   ├── modal/       ProviderModal
│   ├── ui/          Icon, Checkbox, Toast
│   └── waitlist/    WaitlistPage (orchestrator), ProvidersTable, SearchBar,
│                    Pagination, TabSwitcher, StatusBadge
├── data/            providers.ts (mock dataset)
├── hooks/           useToast
├── lib/             filtering.ts (query pipeline), format.ts (date helpers)
├── styles/          tokens.css, global.css
└── types.ts
```

The query pipeline (`src/lib/filtering.ts`) runs in one memoized pass:
**sidebar filters → search → column filters → sort → paginate.**
