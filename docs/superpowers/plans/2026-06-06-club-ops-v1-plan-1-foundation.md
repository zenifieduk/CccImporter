# Club Ops Platform — v1 Plan 1: Foundation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up a deployable Next.js 16 skeleton for `app.classiccarclubs.uk` on the prospect house stack — Prisma + Supabase Postgres, Auth.js v5 with route protection, a collapsible app shell, and a tenancy-scoping service helper — with CI and a green build.

**Architecture:** A standalone Next.js 16 (App Router) application in its own repo. Prisma is the ORM against a Supabase Postgres database. Auth.js v5 (NextAuth) with the Prisma adapter handles identity; tenancy is enforced in a small service layer (`requireClubContext`) that scopes every query by the signed-in user's club, not by Postgres RLS. UI uses Tailwind v4 + shadcn/ui (new-york, neutral) mirroring prospect.

**Tech Stack:** Next.js 16, React 19, TypeScript 5.8+, Tailwind v4, shadcn/ui, Prisma 6, Supabase Postgres, Auth.js v5 (`next-auth@5`), `@tanstack/react-query`, zod, Vitest + Testing Library.

---

## Decisions locked for this plan

- **Repo location:** new repo at `/Users/james/classiccarclubs-app` (separate from the 11ty directory at `/Users/james/Desktop/CLASSICCC`). Deploys to `app.classiccarclubs.uk` on Vercel. *(If you'd rather monorepo it, change before Task 1; everything downstream uses this path.)*
- **Auth:** Auth.js v5 with Prisma adapter + Nodemailer email provider (magic link) pointed at SendGrid SMTP. Foundation tests cover route protection only (no email send required).
- **DB:** Supabase Postgres. `DATABASE_URL` = pooled connection (port 6543, `pgbouncer=true`); `DIRECT_URL` = direct (port 5432) for migrations.
- **This plan is foundation only.** No club/member/payments domain logic beyond a `Club` stub needed by the schema and the tenancy helper. Those are Plans 2–6.

## File structure produced by this plan

```
classiccarclubs-app/
├── next.config.ts                      # standalone output, bundle analyzer
├── components.json                     # shadcn config (new-york, neutral)
├── vitest.config.ts                    # Vitest + jsdom + react plugin
├── vitest.setup.ts                     # Testing Library matchers
├── .env.example                        # documented env vars
├── prisma/
│   └── schema.prisma                   # NextAuth tables + Club stub + ClubAdmin
├── src/
│   ├── app/
│   │   ├── globals.css                 # Tailwind v4 + shadcn CSS vars
│   │   ├── layout.tsx                  # root layout + providers
│   │   ├── (app)/dashboard/page.tsx    # protected landing
│   │   ├── signin/page.tsx             # Auth.js sign-in
│   │   ├── api/auth/[...nextauth]/route.ts
│   │   └── api/health/route.ts         # liveness probe
│   ├── components/
│   │   ├── app-layout.tsx              # shell: sidebar + content
│   │   ├── sidebar.tsx                 # collapsible left nav
│   │   ├── providers.tsx               # SessionProvider + react-query
│   │   └── ui/                         # shadcn components
│   ├── contexts/
│   │   └── sidebar-context.tsx         # collapse state
│   └── lib/
│       ├── prisma.ts                   # Prisma singleton
│       ├── auth.ts                     # Auth.js v5 config (handlers, auth, signIn)
│       ├── club-context.ts             # requireClubContext (tenancy helper)
│       └── utils.ts                    # cn() (shadcn)
├── middleware.ts                       # route protection
└── .github/workflows/ci.yml            # type-check + lint + test
```

---

### Task 1: Scaffold the Next.js 16 app

**Files:**
- Create: `/Users/james/classiccarclubs-app/` (whole project)

- [ ] **Step 1: Create the app with create-next-app (pulls Next 16)**

Run:
```bash
cd /Users/james
npx create-next-app@latest classiccarclubs-app \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --use-npm --no-turbopack
```
When prompted, accept defaults. Expected: a `classiccarclubs-app/` directory with `next` at ^16 in `package.json`.

- [ ] **Step 2: Verify the Next major version is 16**

Run: `cd /Users/james/classiccarclubs-app && node -p "require('./package.json').dependencies.next"`
Expected: a string starting `^16` or `16.`. If it is 15, stop and install Next 16 explicitly: `npm i next@^16 react@^19 react-dom@^19`.

- [ ] **Step 3: Verify dev server boots**

Run: `npm run dev` then in another shell `curl -sI http://localhost:3000 | head -1`
Expected: `HTTP/1.1 200 OK`. Stop the dev server afterwards (Ctrl-C).

- [ ] **Step 4: Initialise git and commit**

```bash
cd /Users/james/classiccarclubs-app
git init -q
git add -A
git commit -q -m "chore: scaffold Next.js 16 app"
```

---

### Task 2: Add house tooling (Prettier, Vitest, react-query, zod)

**Files:**
- Create: `vitest.config.ts`, `vitest.setup.ts`, `.prettierrc`
- Modify: `package.json` (scripts)

- [ ] **Step 1: Install dev + runtime deps**

```bash
cd /Users/james/classiccarclubs-app
npm i @tanstack/react-query zod
npm i -D prettier vitest @vitejs/plugin-react jsdom \
  @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 2: Create `vitest.config.ts`**

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: { '@': resolve(__dirname, './src') },
  },
})
```

- [ ] **Step 3: Create `vitest.setup.ts`**

```typescript
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 4: Create `.prettierrc`**

```json
{
  "semi": false,
  "singleQuote": true,
  "printWidth": 100,
  "trailingComma": "es5"
}
```

- [ ] **Step 5: Add scripts to `package.json`**

Add these entries to the `"scripts"` object:
```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "type-check": "tsc --noEmit",
  "prettier": "prettier --write .",
  "prettier:check": "prettier --check ."
}
```

- [ ] **Step 6: Add a smoke test to prove Vitest works**

Create `src/lib/__tests__/smoke.test.ts`:
```typescript
import { describe, it, expect } from 'vitest'

describe('toolchain smoke test', () => {
  it('runs vitest', () => {
    expect(1 + 1).toBe(2)
  })
})
```

- [ ] **Step 7: Run the smoke test**

Run: `npm test`
Expected: 1 passing test, exit code 0.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -q -m "chore: add prettier, vitest, react-query, zod"
```

---

### Task 3: Configure shadcn/ui (new-york, neutral)

**Files:**
- Create: `components.json`, `src/lib/utils.ts`, `src/components/ui/*`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Initialise shadcn**

Run:
```bash
cd /Users/james/classiccarclubs-app
npx shadcn@latest init
```
Choose: style **new-york**, base colour **neutral**, CSS variables **yes**, components dir `@/components`, utils `@/lib/utils`, css `src/app/globals.css`. This writes `components.json` and `src/lib/utils.ts` (with `cn()`).

- [ ] **Step 2: Add the base components used across the app**

Run:
```bash
npx shadcn@latest add button card input label badge separator \
  dropdown-menu dialog sonner skeleton
```
Expected: files created under `src/components/ui/`.

- [ ] **Step 3: Verify type-check passes with the new components**

Run: `npm run type-check`
Expected: no errors, exit code 0.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -q -m "chore: configure shadcn/ui (new-york, neutral)"
```

---

### Task 4: Prisma + Supabase schema (NextAuth tables + Club stub)

**Files:**
- Create: `prisma/schema.prisma`, `src/lib/prisma.ts`, `.env.example`
- Create: `.env` (local, gitignored)

- [ ] **Step 1: Install Prisma and the Auth.js adapter**

```bash
cd /Users/james/classiccarclubs-app
npm i @prisma/client @auth/prisma-adapter
npm i -D prisma
npx prisma init --datasource-provider postgresql
```

- [ ] **Step 2: Write `prisma/schema.prisma`**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// ---- Auth.js (NextAuth) core tables ----
model User {
  id            String       @id @default(cuid())
  name          String?
  email         String?      @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  clubAdmins    ClubAdmin[]
  createdAt     DateTime     @default(now())
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// ---- Domain stub (full model in Plan 2) ----
enum ClubStatus {
  unclaimed
  claimed
}

enum ClubRole {
  owner
  treasurer
  secretary
  events
  committee
}

model Club {
  id        String      @id @default(cuid())
  name      String
  slug      String      @unique
  status    ClubStatus  @default(unclaimed)
  admins    ClubAdmin[]
  createdAt DateTime    @default(now())
}

model ClubAdmin {
  id     String   @id @default(cuid())
  userId String
  clubId String
  role   ClubRole @default(committee)
  user   User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  club   Club     @relation(fields: [clubId], references: [id], onDelete: Cascade)

  @@unique([userId, clubId])
}
```

- [ ] **Step 3: Write `.env.example` (committed) and `.env` (local, not committed)**

`.env.example`:
```bash
# Supabase Postgres — pooled for app, direct for migrations
DATABASE_URL="postgresql://USER:PASSWORD@HOST:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/postgres"

# Auth.js
AUTH_SECRET="generate with: npx auth secret"
AUTH_URL="http://localhost:3000"

# Email (SendGrid SMTP) for magic-link sign-in
EMAIL_SERVER="smtp://apikey:SENDGRID_API_KEY@smtp.sendgrid.net:587"
EMAIL_FROM="noreply@classiccarclubs.uk"
```
Create a real `.env` from this with your Supabase + SendGrid values. Confirm `.env` is in `.gitignore` (create-next-app adds it).

- [ ] **Step 4: Write the Prisma singleton `src/lib/prisma.ts`**

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

- [ ] **Step 5: Run the first migration against Supabase**

Run: `npx prisma migrate dev --name init`
Expected: migration created under `prisma/migrations/`, "Your database is now in sync with your schema." If it cannot connect, fix `DIRECT_URL` before continuing.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -q -m "feat: prisma schema (auth tables + club stub) and supabase setup"
```

---

### Task 5: Auth.js v5 with Prisma adapter + route protection

**Files:**
- Create: `src/lib/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`, `src/app/signin/page.tsx`, `middleware.ts`
- Test: `src/lib/__tests__/auth-config.test.ts`

- [ ] **Step 1: Install Auth.js v5 and nodemailer**

```bash
cd /Users/james/classiccarclubs-app
npm i next-auth@beta nodemailer
```

- [ ] **Step 2: Write the failing test for the auth config shape**

Create `src/lib/__tests__/auth-config.test.ts`:
```typescript
import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/prisma', () => ({ prisma: {} }))

describe('auth config', () => {
  it('exports handlers, auth, signIn, signOut', async () => {
    const mod = await import('@/lib/auth')
    expect(typeof mod.auth).toBe('function')
    expect(typeof mod.signIn).toBe('function')
    expect(typeof mod.signOut).toBe('function')
    expect(mod.handlers).toBeTruthy()
    expect(mod.handlers.GET).toBeTruthy()
    expect(mod.handlers.POST).toBeTruthy()
  })
})
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm test -- auth-config`
Expected: FAIL — cannot resolve `@/lib/auth`.

- [ ] **Step 4: Write `src/lib/auth.ts`**

```typescript
import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Nodemailer from 'next-auth/providers/nodemailer'
import { prisma } from '@/lib/prisma'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'database' },
  pages: { signIn: '/signin' },
  providers: [
    Nodemailer({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
})
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- auth-config`
Expected: PASS.

- [ ] **Step 6: Wire the Auth.js route handler**

Create `src/app/api/auth/[...nextauth]/route.ts`:
```typescript
import { handlers } from '@/lib/auth'

export const { GET, POST } = handlers
```

- [ ] **Step 7: Add the sign-in page**

Create `src/app/signin/page.tsx`:
```tsx
import { signIn } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SignInPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="text-sm text-muted-foreground">
          We&apos;ll email you a magic link.
        </p>
      </div>
      <form
        action={async (formData) => {
          'use server'
          await signIn('nodemailer', {
            email: formData.get('email') as string,
            redirectTo: '/dashboard',
          })
        }}
        className="flex flex-col gap-3"
      >
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
        <Button type="submit">Send magic link</Button>
      </form>
    </div>
  )
}
```

- [ ] **Step 8: Protect app routes with middleware**

Create `middleware.ts`:
```typescript
import { auth } from '@/lib/auth'

export default auth((req) => {
  const isAuthed = !!req.auth
  const { pathname } = req.nextUrl
  const isProtected = pathname.startsWith('/dashboard')
  if (isProtected && !isAuthed) {
    const url = new URL('/signin', req.nextUrl.origin)
    return Response.redirect(url)
  }
})

export const config = {
  matcher: ['/dashboard/:path*'],
}
```

- [ ] **Step 9: Verify type-check and tests pass**

Run: `npm run type-check && npm test`
Expected: both green.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -q -m "feat: auth.js v5 with prisma adapter, magic-link sign-in, route protection"
```

---

### Task 6: App shell — collapsible sidebar + protected dashboard

**Files:**
- Create: `src/contexts/sidebar-context.tsx`, `src/components/sidebar.tsx`, `src/components/app-layout.tsx`, `src/components/providers.tsx`, `src/app/(app)/dashboard/page.tsx`
- Modify: `src/app/layout.tsx`
- Test: `src/components/__tests__/sidebar-context.test.tsx`

- [ ] **Step 1: Write the failing test for sidebar collapse state**

Create `src/components/__tests__/sidebar-context.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SidebarProvider, useSidebar } from '@/contexts/sidebar-context'

function Probe() {
  const { collapsed, toggle } = useSidebar()
  return (
    <button onClick={toggle}>{collapsed ? 'collapsed' : 'expanded'}</button>
  )
}

describe('sidebar context', () => {
  it('defaults to expanded and toggles', async () => {
    render(
      <SidebarProvider>
        <Probe />
      </SidebarProvider>
    )
    expect(screen.getByText('expanded')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByText('collapsed')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- sidebar-context`
Expected: FAIL — cannot resolve `@/contexts/sidebar-context`.

- [ ] **Step 3: Implement `src/contexts/sidebar-context.tsx`**

```tsx
'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

interface SidebarContextValue {
  collapsed: boolean
  toggle: () => void
}

const SidebarContext = createContext<SidebarContextValue | null>(null)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <SidebarContext.Provider
      value={{ collapsed, toggle: () => setCollapsed((c) => !c) }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider')
  return ctx
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- sidebar-context`
Expected: PASS.

- [ ] **Step 5: Implement `src/components/sidebar.tsx`**

```tsx
'use client'

import Link from 'next/link'
import { Home, Users, Calendar, CreditCard, PanelLeft } from 'lucide-react'
import { useSidebar } from '@/contexts/sidebar-context'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/members', label: 'Members', icon: Users },
  { href: '/events', label: 'Events', icon: Calendar },
  { href: '/payments', label: 'Payments', icon: CreditCard },
]

export function Sidebar() {
  const { collapsed, toggle } = useSidebar()
  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r bg-background transition-[width]',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      <div className="flex items-center justify-between p-3">
        {!collapsed && <span className="font-semibold">Club Ops</span>}
        <button aria-label="Toggle sidebar" onClick={toggle} className="p-1">
          <PanelLeft className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex flex-col gap-1 p-2">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-accent"
          >
            <Icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
```

- [ ] **Step 6: Implement `src/components/app-layout.tsx`**

```tsx
import { Sidebar } from './sidebar'

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="sticky top-0 hidden h-screen md:flex">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-x-hidden p-6">{children}</main>
    </div>
  )
}
```

- [ ] **Step 7: Implement `src/components/providers.tsx`**

```tsx
'use client'

import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { SidebarProvider } from '@/contexts/sidebar-context'

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <SidebarProvider>{children}</SidebarProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}
```

- [ ] **Step 8: Wrap the root layout with Providers**

Replace `src/app/layout.tsx` body to wrap children:
```tsx
import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers'

export const metadata: Metadata = {
  title: 'Club Ops — Classic Car Clubs',
  description: 'Membership and operations for UK classic car clubs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

- [ ] **Step 9: Add the protected dashboard page**

Create `src/app/(app)/dashboard/page.tsx`:
```tsx
import { auth } from '@/lib/auth'
import { AppLayout } from '@/components/app-layout'
import { Card } from '@/components/ui/card'

export default async function DashboardPage() {
  const session = await auth()
  return (
    <AppLayout>
      <h1 className="mb-4 text-2xl font-semibold">Dashboard</h1>
      <Card className="p-4">
        Signed in as {session?.user?.email ?? 'unknown'}.
      </Card>
    </AppLayout>
  )
}
```

- [ ] **Step 10: Verify type-check, tests, and build**

Run: `npm run type-check && npm test && npm run build`
Expected: all green; build completes with `/dashboard` and `/signin` routes listed.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -q -m "feat: app shell with collapsible sidebar and protected dashboard"
```

---

### Task 7: Tenancy service helper (`requireClubContext`)

**Files:**
- Create: `src/lib/club-context.ts`
- Test: `src/lib/__tests__/club-context.test.ts`

This is the seam that Plans 2–6 build on: every domain query is scoped by the
club(s) the signed-in user administers. It lives in the service layer so the
future mobile API reuses it.

- [ ] **Step 1: Write the failing test**

Create `src/lib/__tests__/club-context.test.ts`:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

const authMock = vi.fn()
const findManyMock = vi.fn()

vi.mock('@/lib/auth', () => ({ auth: authMock }))
vi.mock('@/lib/prisma', () => ({
  prisma: { clubAdmin: { findMany: findManyMock } },
}))

import { requireClubContext } from '@/lib/club-context'

beforeEach(() => {
  authMock.mockReset()
  findManyMock.mockReset()
})

describe('requireClubContext', () => {
  it('throws when there is no session', async () => {
    authMock.mockResolvedValue(null)
    await expect(requireClubContext()).rejects.toThrow('Not authenticated')
  })

  it('throws when the user administers no clubs', async () => {
    authMock.mockResolvedValue({ user: { id: 'u1' } })
    findManyMock.mockResolvedValue([])
    await expect(requireClubContext()).rejects.toThrow('No club access')
  })

  it('returns userId and the set of club ids the user administers', async () => {
    authMock.mockResolvedValue({ user: { id: 'u1' } })
    findManyMock.mockResolvedValue([
      { clubId: 'c1', role: 'treasurer' },
      { clubId: 'c2', role: 'committee' },
    ])
    const ctx = await requireClubContext()
    expect(ctx.userId).toBe('u1')
    expect(ctx.clubIds).toEqual(['c1', 'c2'])
    expect(ctx.roleFor('c1')).toBe('treasurer')
    expect(ctx.roleFor('cX')).toBeNull()
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- club-context`
Expected: FAIL — cannot resolve `@/lib/club-context`.

- [ ] **Step 3: Implement `src/lib/club-context.ts`**

```typescript
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export interface ClubContext {
  userId: string
  clubIds: string[]
  roleFor: (clubId: string) => string | null
}

export async function requireClubContext(): Promise<ClubContext> {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) throw new Error('Not authenticated')

  const memberships = await prisma.clubAdmin.findMany({
    where: { userId },
    select: { clubId: true, role: true },
  })
  if (memberships.length === 0) throw new Error('No club access')

  const roleByClub = new Map(memberships.map((m) => [m.clubId, m.role]))
  return {
    userId,
    clubIds: memberships.map((m) => m.clubId),
    roleFor: (clubId: string) => roleByClub.get(clubId) ?? null,
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- club-context`
Expected: PASS (all 3 cases).

- [ ] **Step 5: Ensure the session carries `user.id`**

Auth.js database sessions expose `user.id` by default via the adapter. Confirm by
adding a type check: run `npm run type-check`. If `session.user.id` is typed as
`undefined`, add `src/types/next-auth.d.ts`:
```typescript
import { type DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: { id: string } & DefaultSession['user']
  }
}
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -q -m "feat: requireClubContext tenancy helper"
```

---

### Task 8: Health route, env config note, and CI

**Files:**
- Create: `src/app/api/health/route.ts`, `.github/workflows/ci.yml`
- Test: `src/app/api/health/__tests__/health.test.ts`

- [ ] **Step 1: Write the failing test for the health route**

Create `src/app/api/health/__tests__/health.test.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import { GET } from '@/app/api/health/route'

describe('GET /api/health', () => {
  it('returns ok', async () => {
    const res = await GET()
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body.status).toBe('ok')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- health`
Expected: FAIL — cannot resolve `@/app/api/health/route`.

- [ ] **Step 3: Implement `src/app/api/health/route.ts`**

```typescript
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ status: 'ok' })
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- health`
Expected: PASS.

- [ ] **Step 5: Add CI workflow `.github/workflows/ci.yml`**

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npx prisma generate
      - run: npm run type-check
      - run: npm run lint
      - run: npm test
```

- [ ] **Step 6: Full local gate**

Run: `npm run type-check && npm run lint && npm test && npm run build`
Expected: all green.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -q -m "feat: health route and CI workflow"
```

---

### Task 9: Deploy to Vercel (`app.classiccarclubs.uk`)

**Files:** none (configuration)

- [ ] **Step 1: Create the Vercel project and link**

Run:
```bash
cd /Users/james/classiccarclubs-app
npx vercel link
```
Create a new project (suggested name `classiccarclubs-app`).

- [ ] **Step 2: Add environment variables in Vercel**

Add `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `AUTH_URL` (set to `https://app.classiccarclubs.uk`), `EMAIL_SERVER`, `EMAIL_FROM` for Production and Preview.

- [ ] **Step 3: Add the build step for Prisma**

Set the Vercel build command to `prisma generate && next build` (or add a `postinstall: prisma generate` script to `package.json`). Verify a preview deploy builds.

- [ ] **Step 4: Point the subdomain**

In Vercel project Domains, add `app.classiccarclubs.uk` and follow the DNS CNAME instructions. Verify `https://app.classiccarclubs.uk/api/health` returns `{"status":"ok"}`.

- [ ] **Step 5: Push to GitHub and confirm CI + deploy**

```bash
git add -A
git commit -q -m "chore: vercel config" --allow-empty
git remote add origin <new github repo url>
git push -u origin main
```
Expected: CI green; Vercel production deploy live.

---

## Self-review notes

- **Spec coverage (Foundation slice):** stack alignment (§6) → Tasks 1–4; NextAuth + service-layer tenancy (§8) → Tasks 5, 7; app shell / master-detail prerequisites (§6.1) → Task 6 (sidebar + AppLayout; the master-detail body itself is Plan 4); hosting (§6 Vercel, §11) → Task 9; API-first seam (§5) → Task 7 `requireClubContext`. Domain models (members, vehicles, payments, events, import) are intentionally deferred to Plans 2–6 and only the `Club`/`ClubAdmin` stub needed by auth + tenancy is created here.
- **No placeholders:** every code step contains complete code; config tasks use exact commands with expected output.
- **Type consistency:** `requireClubContext` returns `{ userId, clubIds, roleFor }` used consistently; `Club`/`ClubAdmin`/`ClubRole` names match the schema in Task 4 and the spec ERD.

## Next plans (not in this document)

- **Plan 2:** Club & member data layer + seed the 791 clubs from `src/_data/clubs.js`.
- **Plan 3:** AI spreadsheet migration.
- **Plan 4:** Member database UI (master-detail, per prospect /vehicles).
- **Plan 5:** Subscriptions & payments (Stripe + GoCardless).
- **Plan 6:** Member portal (PWA).
