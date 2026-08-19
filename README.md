# 2coreStudio

Brand hub for the 2coreStudio indie studio — a catalog of multi-platform apps
(web, Windows, Mac, Android, iOS, Linux) with auth-gated downloads.

- **Framework:** Next.js 16 (App Router, TypeScript, `src/` dir)
- **Styling:** Tailwind CSS v4 — neo-brutalist "arcade marquee" theme (dark/light)
- **Backend:** Supabase (Postgres + Auth + RLS), `@supabase/ssr` for sessions
- **3D:** three / @react-three/fiber — homepage hero only, lazy-loaded

## Getting started

```bash
npm install
npm run dev
```

### Supabase setup

1. Create a project at [supabase.com](https://supabase.com/dashboard).
2. Run `supabase/2corestudio_schema.sql` in the SQL Editor (top to bottom).
3. Run `supabase/seed.sql` for the demo catalog.
4. Copy `.env.local.example` → `.env.local` and paste your
   `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   (Project Settings → API).
5. Sign up via the Profile (`/profile`), then run the commented admin
   self-promote snippet at the bottom of `seed.sql` to make yourself admin.

### Types

`src/types/database.types.ts` is generated, not hand-written:

```bash
supabase link --project-ref <your-project-ref>
supabase gen types typescript --project-id <your-project-ref> > src/types/database.types.ts
```

### Notes for Next.js 16

- `middleware.ts` is now `src/proxy.ts` — it refreshes the Supabase session.
- Dynamic route `params` / `searchParams` are Promises — always `await`.
- Caching is opt-in (`"use cache"`); public pages fetch fresh on request so
  publish/unpublish shows immediately.

## Scripts

| Command          | Purpose                    |
| ---------------- | -------------------------- |
| `npm run dev`    | Dev server (Turbopack)     |
| `npm run build`  | Typecheck + prod build     |
| `npm run start`  | Serve prod build           |
| `npm run lint`   | ESLint                     |

## Repo layout

```
src/
  app/            Routes (App Router)
    (site)/       Public site chrome (header, marquee, footer)
    admin/        Admin CMS (server-gated by role)
    profile/      Sign in / sign up
    auth/         Auth callback route
  components/     Client + shared UI
  lib/
    supabase/     Browser + server Supabase clients
    types.ts      Lightweight row types (pre-generated types)
  proxy.ts        Session refresh (Next 16 middleware replacement)
supabase/
  *.sql           Schema + seed
```
