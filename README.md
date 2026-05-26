# Nature's Remedy — Dispensary Web App

Cannabis dispensary ordering system serving Murang'a, Kenya. Customers browse strains, request pickups, and admins manage orders — all with real-time Supabase sync.

## Tech Stack

Vite · React 18 · TypeScript · shadcn/ui · Tailwind CSS · Supabase · React Query · GSAP

## Pages

- `/` — Landing (hero, products, about, contact, age gate)
- `/search` — Strain explorer with search/filter
- `/request-pickup` — Customer pickup form (submits to Supabase)
- `/admin/login` — Admin auth (Supabase email/password)
- `/admin/dashboard` — Live orders table with real-time updates
- `/admin/calendar` — Calendar view of scheduled pickups
- `/admin/messages` — Customer message inbox
- `/admin/ratings` — Customer feedback management
- `/admin/settings` — Profile, notifications, display, user roles

## Local Setup

```sh
git clone <repo-url>
cd remedy-web-flow
npm install
npm run dev
```

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Update `src/lib/supabase.ts` with your project URL and anon key
3. Run the SQL migrations in `supabase/migrations/` via the SQL Editor
4. Add admin users in **Authentication → Users**
5. Set their role in the `profiles` table (admin / assistant / viewer)

## Roles

| Role | Permissions |
|------|-------------|
| Admin | Full access to all features |
| Assistant | Can view and manage pickup requests |
| Viewer | Read-only dashboard access |

Built with [Lovable.dev](https://lovable.dev)
