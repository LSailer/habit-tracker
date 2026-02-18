# Habit Tracker

Mobile-first habit tracker — React + Vite + TypeScript + Tailwind + Recharts. All data in `localStorage`.

**Live:** https://lsailer.github.io/habit-tracker/

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS (dark mode via `prefers-color-scheme`)
- Recharts for dashboard bar charts
- localStorage for persistence (no backend)

## Views

| View | Description |
|------|-------------|
| **Today** | Check off habits for today with tap animation |
| **Config** | Add/edit/delete habits (future months only; current/past locked) |
| **Dashboard** | Monthly stats, bar chart per habit, end-of-month summary |

## Dev

```bash
npm install
npm run dev      # http://localhost:5173/habit-tracker/
npm run build    # production build → dist/
```

## Deploy

Pushes to `main` auto-deploy via GitHub Actions → `gh-pages` branch → GitHub Pages.

Requires a PAT with the `workflow` scope to push `.github/workflows/deploy.yml`.

## Branches

| Branch | Purpose |
|--------|---------|
| `main` | stable / production |
| `develop` | active development |
