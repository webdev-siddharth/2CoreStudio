# 2coreStudio

> Brand hub for the 2coreStudio indie studio — a catalog of multi-platform apps (web, Windows, Mac, Android, iOS, Linux) with auth-gated downloads.

[![Visit Website](https://img.shields.io/badge/🌐_Visit_Website-live-brightgreen?style=for-the-badge)](https://web.2corestudio.workers.dev/)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 — neo-brutalist "arcade marquee" theme (dark/light) |
| Backend | Supabase (Postgres + Auth + RLS), `@supabase/ssr` |
| 3D | Three.js / React Three Fiber — homepage hero, lazy-loaded |
| Deploy | Cloudflare Workers (via OpenNext) |

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Typecheck + prod build |
| `npm run preview` | Preview on Cloudflare Workers locally |
| `npm run deploy` | Build + deploy to Cloudflare |
| `npm run lint` | ESLint |

## Project Structure

```
src/
  app/            Routes (App Router)
    (site)/       Public site (header, marquee, footer)
    admin/        Admin CMS (role-gated)
    profile/      Sign in / sign up
    auth/         Auth callback
  components/     Client + shared UI
  lib/
    supabase/     Browser + server Supabase clients
  middleware.ts   Session refresh (Edge middleware)
supabase/
  *.sql           Schema + seed
```
