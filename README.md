# Axe Build Website

A recruiting-first website and future digital-content platform for Axe Build, LLC. The first release presents Axe as both a construction company and a growing fabrication/manufacturing operation, with polished Home and Careers experiences and structured supporting pages.

## Prerequisites

- Node.js 20.9 or newer
- npm 10 or newer
- A Supabase project only when database-backed features are ready to be developed

## Installation

```bash
npm install
```

## Local development

1. Copy `.env.example` to `.env.local`.
2. Leave the values blank for the current static experience, or add credentials for a dedicated website Supabase project.
3. Run `npm run dev` and open `http://localhost:3000`.

## Environment variables

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Only variables beginning with `NEXT_PUBLIC_` are available in browser code. `SUPABASE_SERVICE_ROLE_KEY` is server-only and must never be imported into a client component, committed, or shared publicly.

## Quality commands

```bash
npm run lint
npm run build
npm start
```

## Deployment overview

Deploy to a standard Next.js host such as Vercel or another Node-compatible platform. Configure secrets in the host settings and use dedicated preview and production Supabase credentials. Do not deploy until approved content, contact routing, privacy language, and form handling are ready.

## Current limitations

- Media frames are labeled placeholders; no remote stock imagery is used.
- Logo treatment is temporary.
- Job records are local development samples and visibly marked as non-active.
- Careers and contact forms do not submit or store data.
- Resume upload is disabled until secure storage and retention rules are approved.
- Supabase clients are prepared, but no schema, table, migration, or remote connection is active.
- Contact information, company story, services, benefits, compensation, and schedules need leadership approval.

## Adding real brand assets and media

- Add approved logo files to `public/logos/`.
- Add approved photographs to `public/images/`.
- Add optimized, muted footage to `public/videos/`.
- Replace `MediaPlaceholder` instances with `next/image` or accessible video elements after assets are approved and optimized.

See `docs/architecture.md` and `docs/content-needed.md` for next steps.
