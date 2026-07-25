# [FUTRIX](https://github.com/kartikey-ag12/Futrix)

Centralized financial intelligence platform — dashboards, reporting, forecasting, and AI insights, integrating Xero and Tally.

## Tech Stack

- **Frontend**: React.js, Next.js 15 (App Router), TypeScript, Tailwind CSS, TanStack Table, Recharts
- **Backend**: Node.js, Next.js API Routes
- **Integrations**: Xero OAuth2, TallyPrime HTTP XML Server
- **AI**: OpenAI API (`gpt-4o-mini`) + Futrix Financial Engine
- **Deployment**: Vercel

## 🚀 Key Features

1. **Futrli-Inspired Financial Dashboard**: Real-time KPI metric tracking, live revenue trend area charts, cash flow velocity projections, and AI financial health scoring.
2. **Dual Accounting Software Integrations**:
   - **Xero**: OAuth2 connection, invoice generation modal, and auto-synced ledgers.
   - **TallyPrime**: 30-day persistent session connection, step-by-step Tally HTTP Server setup guide, and Indian GST voucher sync.
3. **Profit & Loss (P&L) Statement & Reports (`/reports`)**:
   - GAAP/IFRS aligned P&L financial statement.
   - Categorized department expense tracking for **Worker Salaries**, **Electricity & Utilities**, **Building Maintenance**, **Cloud SaaS**, and **Marketing Campaigns**.
   - Dynamic time-range switching (*This Month*, *Q3 2026*, *YTD 2026*, *Full Year 2025*).
   - Printable PDF formatting and CSV/Excel exports.
4. **AI Customer Support Assistant**: Interactive 24/7 AI support chatbot drawer (`SupportModal.tsx`) with 1-click quick-ask chips.
5. **Interactive Cash Flow Forecasting (`/forecasting`)**: Base, Best (+20% Rev), and Worst (+15% Exp) scenario planning with Q3 milestone tracking.
6. **Transactions Ledger (`/transactions`)**: Searchable, sortable data table with quick card filters for Inflow and Outflow.

## Team

| Name | Role | Responsibility |
| :--- | :--- | :--- |
| **Kartikey** | Team Lead / Frontend | Owns UI architecture, layout, component structure, review & merge approvals |
| **Aman** | Backend | API routes, business logic, integrations (Xero) |
| **Nayan** | Backend | Database schema, Prisma models, integrations (Tally), AI insights engine |
| **Ashutosh** | QA / Testing | Test cases, bug tracking, regression testing, release sign-off |

## Branching Strategy

```text
main (production-ready only, protected, no direct pushes)
 └── dev (integration branch, all features merge here first)
      ├── feature/kartikey-* (frontend work)
      ├── feature/aman-* (backend — Xero, API)
      ├── feature/nayan-* (backend — DB, Tally, AI)
      └── feature/ashutosh-* (test suites, bugfix branches)
```

**Rules:**
1. `main` only updates via PR from `dev` after Ashutosh's QA sign-off.
2. `dev` only updates via PR from a feature branch, reviewed by Kartikey (frontend) or the relevant backend peer.
3. No one pushes directly to `main` or `dev`.

## Setup

```bash
git clone https://github.com/kartikey-ag12/Futrix.git
cd Futrix
npm install
cp .env.example .env
npm run dev
```

## Git Workflow — Per Person

**1. Start from updated dev:**
```bash
git checkout dev
git pull origin dev
```

**2. Create your feature branch:**
```bash
# Kartikey (Frontend)
git checkout -b feature/kartikey-dashboard-ui

# Aman (Backend - Xero/API)
git checkout -b feature/aman-xero-integration

# Nayan (Backend - DB/Tally/AI)
git checkout -b feature/nayan-forecast-engine

# Ashutosh (QA/Testing)
git checkout -b feature/ashutosh-auth-tests
```

**3. Stage and commit:**
```bash
git add .
git commit -m "feat: added new dashboard layout"
```

*Conventional Commits:*
| Prefix | Use Case |
| :--- | :--- |
| `feat:` | A new feature |
| `fix:` | A bug fix |
| `test:` | Adding or updating tests |
| `refactor:`| Code change that neither fixes a bug nor adds a feature |
| `chore:` | Updating build tasks, package manager configs, etc. |
| `docs:` | Documentation changes only |

**4. Push:**
```bash
# Example
git push origin feature/kartikey-dashboard-ui
```

**5. Open a Pull Request (PR):**
- Open a PR on GitHub from your feature branch into `dev`.
- **Kartikey** reviews frontend PRs.
- **Aman** and **Nayan** review each other's backend PRs.
- **Ashutosh** reviews everything before merging into `main`.

**6. Post-merge cleanup:**
After your PR is merged, clean up your local and remote branches:
```bash
git checkout dev
git pull origin dev
git branch -d <branch-name>
git push origin --delete <branch-name>
```

**7. Rebase workflow (if dev moves ahead):**
If `dev` is updated while you are working on your feature branch, rebase to keep history clean:
```bash
git fetch origin
git rebase origin/dev
git push origin <branch-name> --force-with-lease
```

## Rules
1. Never commit directly to `main` or `dev`.
2. Always pull before pushing.
3. One feature/fix per branch.
4. Write meaningful commit messages.
5. Run `npm run lint` and `npm run build` before opening a PR.
6. Ashutosh writes/updates tests for any new feature before it merges to `main`.
