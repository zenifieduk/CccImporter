# Club Ops SaaS — Handover, 8 June 2026

Written for a fresh Claude Code session continuing this work with no shared
conversation history. Pick up from here.

## What we're building

**Club Ops** — a membership/operations SaaS for **UK classic car club committees**
(treasurer/secretary), sold through the existing `classiccarclubs.uk` directory
(791 clubs, SEO) as the distribution channel. B2B first: the committee is the
payer. The wedge is a modern, self-serve, all-in-one tool whose hero feature is
**AI-powered spreadsheet migration** (import a club's messy member spreadsheet in
minutes) — that neutralises switching inertia, which is the real moat. Honest
scale: low-thousands of UK clubs at ~£400–£1,200/yr = a high-margin niche
business, not venture scale. The consumer/community "place" (a la the old Frost
Hub) is deliberately deferred to a later phase.

Full reasoning, competitor teardown, and architecture are in the spec (below).

## Two codebases

| Repo | Path | What | Remote |
|------|------|------|--------|
| Marketing + directory site | `/Users/james/Desktop/CLASSICCC` | 11ty static site, the 791-club directory | GitHub mirror `zenifieduk/CccImporter` via `git push origin main` (NOT the deployed `deploy` remote) |
| **The SaaS app** | `/Users/james/classiccarclubs-app` | Next.js 16 app, deploys to `app.classiccarclubs.uk` | `github.com/zenifieduk/classiccarclubs-app` (`git push origin main`) |

Specs and plans live in `CLASSICCC/docs/superpowers/` and are readable on phone
via the `CccImporter` GitHub repo. This handover sits in `CLASSICCC/docs/`.

- Architecture spec: `docs/superpowers/specs/2026-06-06-club-ops-platform-architecture-design.md`
- Plan 1 (Foundation, DONE): `docs/superpowers/plans/2026-06-06-club-ops-v1-plan-1-foundation.md`

## Current state — Foundation is DONE and LIVE

Plan 1 was built and executed task-by-task (subagent-driven). The app is
**deployed and working end-to-end** at `https://app.classiccarclubs.uk`:

- `/` → redirects to `/dashboard` → proxy bounces unauthenticated users to
  `/signin` (which renders correctly). `/api/health` returns `{"status":"ok"}`.
- DB is migrated and connected. Auth (`AUTH_SECRET` + Supabase) verified working
  on Vercel.
- Local: 7 tests green, `npm run build` clean.

**The only thing not yet functional: sending the sign-in email (Resend).** Until
Resend is configured, the magic-link won't actually send, so no one can complete
a login. Everything else works.

### Stack (the `prospect` house stack at `/Users/james/prospect`)
Next.js **16.2.7** · React 19 · TypeScript · Tailwind v4 · shadcn/ui (new-york/
neutral) · **Prisma 6** (pinned) + Supabase Postgres · **Auth.js v5**
(`next-auth@5`, Resend provider) · @tanstack/react-query · zod · Vitest. Tenancy
is enforced in the service layer (`src/lib/club-context.ts` → `requireClubContext`),
not Supabase RLS.

### Gotchas already discovered (don't relearn these)
1. `npm i prisma` pulls **Prisma 7** which breaks `directUrl`/needs driver
   adapters — **pin `prisma@^6` / `@prisma/client@^6`**.
2. Next 16 **deprecated `middleware.ts` → `proxy.ts`** (Node runtime). Route
   protection is `src/proxy.ts`; this lets Auth.js v5 + Prisma adapter + database
   sessions work with no edge split-config.
3. shadcn v4.10 renamed the "new-york" style to the `radix-nova` preset.
4. **DB env on Vercel is zero-config:** the Prisma datasource uses
   `env("POSTGRES_PRISMA_URL")` / `env("POSTGRES_URL_NON_POOLING")` — the names
   the Vercel–Supabase integration injects automatically. Locally they live in
   `.env.local` (gitignored). Run Prisma via `npm run db:migrate|db:deploy|db:studio`
   (these use `dotenv-cli -e .env.local`).

### Accounts / infra
- **Supabase** project "Clubs", ref `jxjvieatetethxitloxz`, region eu-west-1,
  Postgres 17 (Vercel-managed integration). Migration `20260607212820_init`
  applied: tables `User, Account, Session, VerificationToken, Club, ClubAdmin`.
- **Vercel:** project linked via GitHub integration (auto-deploys on push to
  `main`). Env vars set so far: `AUTH_SECRET`, `AUTH_URL`
  (`https://app.classiccarclubs.uk`). DB vars are auto-injected by the Supabase
  integration. (The `AUTH_SECRET` value is in Vercel — not duplicated here.)
- **Domain:** `app.classiccarclubs.uk` live on Vercel (DNS works).

## Next actions when resuming (in order)

1. **Finish login — set up Resend.**
   - Sign up at resend.com → create an API key (`re_…`).
   - In Vercel → Settings → Environment Variables, add `AUTH_RESEND_KEY` (the key)
     and `EMAIL_FROM`. For a first test use `EMAIL_FROM=onboarding@resend.dev`
     (Resend's built-in sender; only delivers to the account owner's own email).
     For production, verify the `classiccarclubs.uk` domain in Resend (Domains →
     Add Domain → add the shown DNS records) and set
     `EMAIL_FROM=noreply@classiccarclubs.uk`.
   - Redeploy. Then test: go to `/signin`, enter your email, click the magic link,
     confirm you land on `/dashboard` ("Signed in as …").

2. **Write & execute Plan 2 — club + member data layer.** Not yet written.
   Scope: the full domain schema (members, vehicles, membership types, memberships)
   on top of the `Club`/`ClubAdmin` stub; **seed the 791 clubs** from
   `CLASSICCC/src/_data/clubs.js` into Postgres as `unclaimed` records; a
   **"claim your club"** onboarding flow; and **wire `requireClubContext` into the
   dashboard/pages** (it's fully unit-tested but currently unexercised — a
   clubless authenticated user should see an onboarding prompt, not an error).

3. **Then Plans 3–6** (each its own spec→plan→build): 3 = AI spreadsheet
   migration (the hero); 4 = member DB UI (master-detail, modelled on the
   `prospect` app's `/vehicles` Helm page — left queue + collapsible section-shell
   workspace); 5 = subs + payments (Stripe + GoCardless); 6 = member portal (PWA).

## Working conventions
- UK English. Keep responses brief.
- Estimate in agent-hours, not human-days.
- Stack/UI: follow the `prospect` house app conventions; UI follows its
  `/vehicles` master-detail pattern (see spec §6.1).
- Pin Prisma 6. Use `proxy.ts` not `middleware.ts`. Read
  `node_modules/next/dist/docs/` for Next 16 specifics (the app's AGENTS.md says
  so — Next 16 has real breaking changes).

## How to verify state on resume
```bash
# app builds + tests
cd /Users/james/classiccarclubs-app && npm run build && npm test
# DB in sync
npm run db:migrate -- --name check   # or: npx dotenv -e .env.local -- prisma migrate status
# live site
curl -s https://app.classiccarclubs.uk/api/health   # {"status":"ok"}
```
Memory file: `~/.claude/projects/-Users-james/memory/project_classiccarclubs_saas.md`.
