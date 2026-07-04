# 🍽️ Restaurant Queing System

[![CI](https://github.com/wilfredo-domanico-jr/restaurant-queing-system/actions/workflows/ci.yml/badge.svg)](https://github.com/wilfredo-domanico-jr/restaurant-queing-system/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-blue)](https://tailwindcss.com/)
[![ASP.NET Core](https://img.shields.io/badge/ASP.NET_Core-8-purple)](https://dotnet.microsoft.com/)
[![SignalR](https://img.shields.io/badge/SignalR-Real--Time-orange)](https://dotnet.microsoft.com/apps/aspnet/signalr)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 📌 Project Description

**Restaurant Queueing System** is a modern web application that helps restaurants manage customer queues, seating, and live waiting lists in real time.

It is built with:

- ⚛️ **Next.js + Tailwind CSS** (Frontend)
- 🧠 **ASP.NET Core Web API** (Backend)
- 🔴 **SignalR** for live, push-based updates (no polling)

The system provides a fast, responsive, and scalable solution for managing restaurant flow efficiently.

---

## 📸 Screenshot

<img src="screenshots/kiosk.png" alt="Kiosk Screenshot" width="auto">
 <h4 align="center"> Kiosk Page Preview </h4>
<img src="screenshots/display.png" alt="Display Screenshot" width="auto">
 <h4 align="center"> Display Page Preview </h4>
<img src="screenshots/admin.png" alt="Admin Screenshot" width="auto">
 <h4 align="center"> Admin Page Preview </h4>

---

## ⚡ Features

- 🎟 Kiosk system for customers to join queue
- 📺 Live display screen (Now Serving / Up Next), updated instantly via SignalR
- ⚙️ Admin dashboard for staff, protected by JWT authentication
- 🎭 Portfolio demo mode — one-click "Continue as Demo Admin" login
- 🪑 Party size selection
- 🍽 Seating preference (Indoor / Outdoor / Bar / VIP)
- 📊 Live queue tracking
- 📣 Manage queue (call, seat, mark no-show, remove)
- ⏱ Estimated wait time
- 📱 Responsive design for tablets & kiosks
- 🐳 Dockerized, with a docker-compose stack (frontend + backend + SQL Server)
- ✅ Unit-tested (xUnit + Vitest) and CI-gated on every push

---

## 🏗️ Project Structure

```
RestaurantQueueSystem/
├── front-end/       (Next.js + Tailwind CSS)
├── back-end/        (ASP.NET Core Web API)
├── back-end.Tests/  (xUnit unit tests)
└── docker-compose.yml
```

---

## ⚙️ Backend Setup (ASP.NET Core Web API)

### 📁 Go to backend folder

```bash
cd back-end
```

### 🔑 Configure secrets

Copy `appsettings.example.json` values into `appsettings.json` (gitignored) and fill in a SQL Server connection string, an `ApiKey`, a `Jwt:Secret`, and an `Admin:Username`/`Admin:PasswordHash` (generate the hash with `Microsoft.AspNetCore.Identity.PasswordHasher<object>`).

### ▶️ Run backend

```bash
dotnet restore
dotnet run
```

The database schema is applied automatically on startup via EF Core migrations — no manual migration step needed.

### 🌐 Default API URLs

```
http://localhost:5272
https://localhost:7046
```

### 🧪 Run backend tests

```bash
dotnet test back-end.sln
```

---

## 💻 Frontend Setup (Next.js)

### 📁 Go to frontend folder

```bash
cd front-end
```

### 📦 Install dependencies

```bash
npm install
```

### 🔑 Configure environment

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_API_URL`/`NEXT_PUBLIC_API_KEY` to match the backend. Optionally set `NEXT_PUBLIC_DEMO_MODE=true` plus demo admin credentials to show a one-click demo login on `/admin/login`.

### 🚀 Start development server

```bash
npm run dev
```

### 🌐 Open app

```
http://localhost:3000
```

### 🧪 Run frontend tests

```bash
npm run test
```

---

## 🐳 Run with Docker

```bash
cp .env.example .env   # fill in SA_PASSWORD, API_KEY, JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD_HASH
docker compose up -d --build
```

Brings up a SQL Server container, the backend (auto-migrated), and the frontend — no local .NET/Node install required.

---

## 🧠 Tech Stack

### Frontend

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- SignalR client (`@microsoft/signalr`)
- Vitest + React Testing Library

### Backend

- ASP.NET Core 8 Web API
- C#
- Entity Framework Core (SQL Server)
- SignalR
- JWT authentication
- xUnit + Moq

### Infrastructure

- Docker & Docker Compose
- GitHub Actions CI (build, lint, test, Docker build check)

---

## 🚀 Future Improvements

- 📲 QR ticket system for guests
- 📊 Analytics dashboard
- 🔔 SMS / Email notifications
- 🧑‍🍳 Kitchen display system (KDS)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
