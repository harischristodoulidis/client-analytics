# Client Analytics

A business analytics dashboard for managing clients, tracking sales, and monitoring revenue KPIs. Built with React 19, TypeScript, and Supabase.

## Features

- **Dashboard** — Revenue chart and KPI cards (Revenue, Sales, Clients, Growth) with period filtering (1m, 3m, 6m, 1y, 2y, custom date range)
- **Clients** — Paginated client list with search, status filtering (active/inactive/pending), sortable columns, and full CRUD (add, edit, delete via modals)
- **Client Details** — Per-client detail view with contact info, financial summary, and recent activity
- **Sales** — Sales list with a revenue bar chart and full CRUD for transactions; each sale is linked to a client
- **Transaction Details** — Individual transaction detail view

## Tech Stack

| Category       | Library                    |
| -------------- | -------------------------- |
| Framework      | React 19 + TypeScript      |
| Build          | Vite 8                     |
| Routing        | React Router 7             |
| Server state   | TanStack Query v5          |
| Backend / DB   | Supabase (PostgreSQL)      |
| Charts         | Recharts                   |
| UI primitives  | Radix UI (Popover, Select) |
| Styling        | Tailwind CSS v4, CVA       |
| Date utilities | date-fns, react-day-picker |
| Icons          | Lucide React               |

## Project Structure

```
src/
├── app/
│   ├── App.tsx                  # Root component
│   ├── providers/               # QueryProvider (TanStack Query)
│   └── router/routes.tsx        # Browser router definition
├── layouts/
│   └── DashboardLayout.tsx      # Sidebar + top header shell
├── pages/                       # Route-level page components
│   ├── DashboardPage.tsx
│   ├── ClientsPage.tsx
│   ├── ClientDetailsPage.tsx
│   ├── SalesPage.tsx
│   ├── TransactionDetailsPage.tsx
│   └── ErrorPage.tsx
├── components/
│   ├── content/                 # Feature-specific components
│   │   ├── dashboard/           # KPIs, RevenueChart, PeriodSelector
│   │   ├── clients/             # ClientsList, ClientModal, filters, pagination
│   │   ├── clientDetails/       # ClientDetailsCard, ClientDetailsHeader
│   │   └── sales/               # SalesList, SalesChart, SaleModal
│   └── ui/                      # Generic UI: Button, Input, Select, ConfirmModal…
├── shared/
│   ├── api/
│   │   ├── clientsApi.ts        # Supabase CRUD for clients
│   │   ├── salesApi.ts          # Supabase CRUD for sales
│   │   ├── revenueApi.ts        # Mock KPI + revenue chart data
│   │   └── types/               # TypeScript interfaces (Client, Sale, KPIs…)
│   ├── hooks/                   # Custom hooks (useClients, useFetchSales, useKPIs…)
│   ├── components/              # Shared UI: EmptyState, LoadingSkeleton
│   └── utils/                   # supabase client, cn helper
└── styles/                      # Tailwind entry, theme, CVA variants
```

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project with `clients`, `sales`, and `kpis` tables

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

### Install & Run

```bash
npm install
npm run dev
```

### Other Scripts

```bash
npm run build    # Type-check + production build
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

## Supabase Schema

The app expects the following tables:

**clients**
| Column | Type |
|---|---|
| id | uuid (PK) |
| name | text |
| username | text |
| email | text |
| status | text (`active` \| `inactive` \| `pending`) |
| total_spent | numeric |
| joinedDate | date |

**sales**
| Column | Type |
|---|---|
| id | uuid (PK) |
| client_id | uuid (FK → clients) |
| amount | numeric |
| date | date |
| status | text (`completed` \| `pending` \| `failed`) |
| created_at | timestamptz |

> **Note:** Revenue chart and KPI data on the Dashboard is currently generated client-side with mock data. The `kpis` table integration is wired up but the dashboard defaults to mock values.
