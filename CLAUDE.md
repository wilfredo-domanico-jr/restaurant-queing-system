# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Restaurant Queueing System: a Next.js frontend + ASP.NET Core Web API backend for managing restaurant waitlists in real time (kiosk join-queue flow, a live "now serving" display, and an admin dashboard). There is no SignalR/websocket layer yet despite the README mentioning it — the admin/display pages poll the REST API. No automated test suite exists in either project.

## Commands

### Backend (`back-end/`, ASP.NET Core 8, C#)
```bash
cd back-end
dotnet restore
dotnet run                # runs on http://localhost:5272 / https://localhost:7046, Swagger UI at /swagger in dev
```
No lint/test scripts are configured for the backend.

Before first run, copy `appsettings.example.json` values into `appsettings.json` (gitignored) — needs a SQL Server `DefaultConnection` string, an `ApiKey`, and `AllowedOrigins` (defaults to `http://localhost:3000`).

### Frontend (`front-end/`, Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4)
```bash
cd front-end
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint      # eslint
```
Needs a `.env.local` with `NEXT_PUBLIC_API_URL` (e.g. `http://localhost:5272/api`) and `NEXT_PUBLIC_API_KEY` matching the backend's `ApiKey`. No test runner is configured.

## Architecture

### Backend: Controller → Service (interface) → EF Core `AppDbContext`
Each area (`Kiosk`, `Display`, `Admin`) has a `Controller`, an `I*Service`/`*Service` pair registered in `Program.cs` via `AddScoped`, and its own DTO folder under `DTO/{Area}/`. Controllers are thin — they call the service and wrap the result in `{ message, data }`. There are two EF models: `QueueTickets` (the core queue entity: ticket number, guest, party size, section, status, timestamps) and `ActivityLogs` (audit trail of queue actions), both in `Models/`, both registered as `DbSet`s in `Data/AppDbContext.cs`.

Cross-cutting request pipeline (order matters, wired in `Program.cs`): CORS (`AllowFrontend` policy, origins from config) → rate limiting (`UseRateLimiter`, named per-endpoint policies like `kiosk-read`/`kiosk-write`/`admin-read`/`admin-write`/`display-read` applied via `[EnableRateLimiting]`) → `ApiKeyMiddleware` (checks `x-api-key` header against config `ApiKey`, returns 401/403) → `UseAuthorization`. When adding a new endpoint, pick/add a rate-limit policy and apply `[EnableRateLimiting]` consistent with whether it's a read or write.

Adding a new backend feature typically touches: a DTO in `DTO/{Area}/`, a method on `I{Area}Service`/`{Area}Service`, and a controller action returning the `{ message, data }` shape.

### Frontend: route groups per surface, shared data hooks, no global state
Three top-level surfaces under `src/app/`, each a distinct experience: `(kiosk)` (guest join-queue flow), `display` (public now-serving/up-next screen), `admin` (staff dashboard). Each surface has matching components under `src/components/{kiosk,display,admin}/`, plus `src/components/layout/` (Navbar, shared) and `src/providers/ToastProvider.tsx` (toast notifications, mounted in root `layout.tsx`).

Data fetching goes through `src/lib/apiClient.ts` — a thin `fetch` wrapper that prefixes `NEXT_PUBLIC_API_URL`, attaches `x-api-key` from `NEXT_PUBLIC_API_KEY`, and throws on non-OK responses. Don't call `fetch` directly from components; use or extend the hooks in `src/hooks/` (`useFetch`, `usePost`, `usePatch`, `useDelete`), which wrap `apiClient` with `loading` state. Types for each surface's API responses live in `src/types/{kiosk,display,admin}.types.ts` and should mirror the backend DTOs in `back-end/DTO/{Area}/`.

Styling is Tailwind CSS 4 with custom theme tokens (`bg-cream`, `text-text`, `text-brand`, `border-border`, etc. — see `globals.css`) rather than default Tailwind palette classes; match these existing tokens instead of introducing raw hex/Tailwind defaults.

### Backend/frontend contract
The two projects are only connected via the versioned `NEXT_PUBLIC_API_URL` HTTP contract and the shared `x-api-key` secret — no shared types or codegen. When changing a backend DTO shape, update the corresponding frontend type in `src/types/` and any component consuming it.
