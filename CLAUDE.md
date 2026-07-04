# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Restaurant Queueing System: a Next.js frontend + ASP.NET Core Web API backend for managing restaurant waitlists in real time (kiosk join-queue flow, a live "now serving" display, and an admin dashboard). Live updates are pushed via SignalR (no polling). Both projects have unit test suites (xUnit / Vitest) and CI gates on them.

## Commands

### Backend (`back-end/`, ASP.NET Core 8, C#)
```bash
cd back-end
dotnet restore
dotnet run                # http://localhost:5272, Swagger UI at /swagger in dev
```
No lint script is configured for the backend. On startup the app runs `db.Database.Migrate()` automatically — no manual migration step needed.

Tests: `dotnet test back-end.sln` (from `back-end/`) runs `back-end.Tests` (xUnit), which unit-tests the `Services/` layer against EF Core's in-memory provider with a mocked `IHubContext<QueueHub>`. Note: `AdminService.GetCurrentQueueAsync` and `DisplayService.GetUpNextAsync` use `EF.Functions.DateDiffMinute`, a SQL Server-only translation that throws against the in-memory provider — they aren't covered by these tests (would need a real SQL Server integration test).

Before first run, copy `appsettings.example.json` values into `appsettings.json` (gitignored) — needs a SQL Server `DefaultConnection` string, `ApiKey`, `AllowedOrigins`, `Jwt:Secret`, and `Admin:Username`/`Admin:PasswordHash` (generate the hash with `Microsoft.AspNetCore.Identity.PasswordHasher<object>`).

To add a new migration after changing `Models/` or `Data/AppDbContext.cs`: `dotnet ef migrations add <Name> --output-dir Migrations` (requires the `dotnet-ef` global tool).

### Frontend (`front-end/`, Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4)
```bash
cd front-end
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint      # eslint
```
Needs a `.env.local` with `NEXT_PUBLIC_API_URL` (e.g. `http://localhost:5272/api`) and `NEXT_PUBLIC_API_KEY` matching the backend's `ApiKey`.

Tests: `npm run test` runs Vitest + React Testing Library (`vitest.config.ts`/`vitest.setup.ts`) against hooks (`src/hooks/__tests__/`), `apiClient` (`src/lib/__tests__/`), and a few key components (`__tests__/` folders next to the component). Network calls (`apiClient`, `fetch`, `@microsoft/signalr`) are mocked with `vi.mock`/`vi.stubGlobal` — no real backend/server needed.

Set `NEXT_PUBLIC_DEMO_MODE=true` plus `NEXT_PUBLIC_DEMO_ADMIN_USERNAME`/`NEXT_PUBLIC_DEMO_ADMIN_PASSWORD` (see `front-end/.env.example`) to show a "Continue as Demo Admin" button on `/admin/login` — useful for a portfolio deployment where visitors shouldn't need real credentials. Leave it unset/`false` for a normal deployment.

### Docker
```bash
cp .env.example .env   # fill in SA_PASSWORD, API_KEY, JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD_HASH
docker compose up -d   # db (SQL Server) + backend + frontend
```
`docker-compose.yml` at the repo root builds both Dockerfiles and brings up a SQL Server container; the backend auto-migrates against it on first boot.

### CI
`.github/workflows/ci.yml` runs on push/PR to `main`: backend build+test (`dotnet test back-end/back-end.sln`), frontend lint+test+build, and a Docker build check for both Dockerfiles (no images are pushed).

## Architecture

### Backend: Controller → Service (interface) → EF Core `AppDbContext`
Each area (`Kiosk`, `Display`, `Admin`, `Auth`) has a `Controller`, an `I*Service`/`*Service` pair registered in `Program.cs` via `AddScoped` (services are implemented in the file literally named `I{Area}Service.cs` — the interface itself lives in `{Area}Service.cs`; the naming is swapped from the usual convention, check the actual file content, not just the filename), and its own DTO folder under `DTO/{Area}/`. Controllers are thin — they call the service and wrap the result in `{ message, data }`. There are two EF models: `QueueTickets` (the core queue entity: ticket number, guest, party size, section, status, timestamps) and `ActivityLogs` (audit trail of queue actions), both in `Models/`, both registered as `DbSet`s in `Data/AppDbContext.cs`. EF Core migrations live in `back-end/Migrations/`.

Cross-cutting request pipeline (order matters, wired in `Program.cs`): CORS (`AllowFrontend` policy, origins from config, explicit methods/headers) → `ApiKeyMiddleware` (only guards `/api/kiosk` and `/api/display`, checked with a fixed-time comparison) → rate limiting (`UseRateLimiter`, named per-endpoint policies like `kiosk-read`/`kiosk-write`/`admin-read`/`admin-write`/`display-read` applied via `[EnableRateLimiting]`) → JWT auth/`UseAuthorization`. `AdminController` is `[Authorize(Roles = "Admin")]` at the class level — admin no longer uses the shared API key at all, only a bearer JWT issued by `POST /api/auth/login` (`AuthController.cs`). A global `UseExceptionHandler` returns a generic 500 JSON body instead of leaking exception details. When adding a new endpoint, pick/add a rate-limit policy and apply `[EnableRateLimiting]` consistent with whether it's a read or write.

Live updates: `Hubs/QueueHub.cs` is a push-only, anonymous SignalR hub mapped at `/hubs/queue`. `KioskService.CreateTicketAsync` and `AdminService.DeleteQueueAsync`/`UpdateQueueStatusAsync` broadcast a bare `"queueUpdated"` event via `IHubContext<QueueHub>` after each write — clients don't get a payload, they just refetch the relevant REST endpoint(s) on receipt ("notify, then refetch"). Don't add new DTO payloads to the hub itself; keep broadcasting the same bare event and let the frontend re-run its existing loaders.

Adding a new backend feature typically touches: a DTO in `DTO/{Area}/`, a method on `I{Area}Service`/`{Area}Service`, and a controller action returning the `{ message, data }` shape. If it's testable in isolation (i.e. lives in `Services/`), add coverage to `back-end.Tests/` (a sibling project at the repo root, referenced by `back-end/back-end.sln` — kept outside `back-end/` so the Docker build context, scoped to `back-end/`, never picks it up).

### Frontend: route groups per surface, shared data hooks, no global state
Three top-level surfaces under `src/app/`, each a distinct experience: `(kiosk)` (guest join-queue flow), `display` (public now-serving/up-next screen), `admin` (staff dashboard, gated by `src/proxy.ts` — Next's renamed `middleware.ts` convention). Each surface has matching components under `src/components/{kiosk,display,admin}/`, plus `src/components/layout/` (Navbar, shared) and `src/providers/ToastProvider.tsx` (toast notifications, mounted in root `layout.tsx`).

Data fetching goes through `src/lib/apiClient.ts` — a thin `fetch` wrapper that prefixes `NEXT_PUBLIC_API_URL` for kiosk/display calls (attaching `x-api-key` from `NEXT_PUBLIC_API_KEY`), but routes any endpoint starting with `/admin` through the local Next.js proxy at `src/app/api/admin/[...path]/route.ts` instead — that route reads the `admin_token` httpOnly cookie and attaches it as a `Bearer` token server-side, so the JWT never reaches client JS. Login/logout go through `src/app/api/auth/login|logout/route.ts`, which set/clear the cookie. Don't call `fetch` directly from components; use or extend the hooks in `src/hooks/` (`useFetch`, `usePost`, `usePatch`, `useDelete`, `useQueueUpdates`), which wrap `apiClient` (or, for `useQueueUpdates`, a `@microsoft/signalr` connection to `/hubs/queue`) with `loading` state. Components that need live data call `useQueueUpdates(refetchFn)` alongside their normal fetch-on-mount effect. Types for each surface's API responses live in `src/types/{kiosk,display,admin}.types.ts` and should mirror the backend DTOs in `back-end/DTO/{Area}/`.

Styling is Tailwind CSS 4 with custom theme tokens (`bg-cream`, `text-text`, `text-brand`, `border-border`, etc. — see `globals.css`) rather than default Tailwind palette classes; match these existing tokens instead of introducing raw hex/Tailwind defaults.

### Backend/frontend contract
Kiosk/Display: connected via the versioned `NEXT_PUBLIC_API_URL` HTTP contract and the shared `x-api-key` secret — no shared types or codegen. Admin: connected via the Next.js proxy routes + an httpOnly JWT cookie, never a shared static secret. When changing a backend DTO shape, update the corresponding frontend type in `src/types/` and any component consuming it.

## Commit conventions

Use conventional commit prefixes (`feat:`, `fix:`, `refactor:`, `chore:`), keep the message short but descriptive, and never include Claude attribution (no name, no `Co-Authored-By` trailer).
