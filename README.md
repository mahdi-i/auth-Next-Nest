# 🔐 Auth Next Nest

A modern full-stack authentication starter built with **Next.js**, **NestJS**, **TurboRepo**, and **PNPM Workspaces**.

Designed as a scalable monorepo architecture with secure JWT authentication, refresh token flow, and a clean separation between frontend and backend applications.

---

## ✨ Features

* 🔑 JWT Authentication
* 🔄 Refresh Token Flow
* 🛡 Protected Routes & APIs
* 🔒 Password Hashing
* ⚡ Next.js Frontend
* 🚀 NestJS Backend
* 📦 Monorepo Architecture
* 🔧 TurboRepo Caching
* 🐳 Docker Support
* 📝 TypeScript Everywhere
* 🏗 Scalable Project Structure

---

## 📂 Project Structure

```text
.
├── apps
│   ├── api/        # NestJS Backend
│   └── web/        # Next.js Frontend
│
├── packages/       # Shared Packages
│
├── .env.example
├── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

---

# 🚀 Getting Started (Monorepo)

This project is a **Turborepo + PNPM workspace** containing:

* `apps/web` → Next.js (Frontend)
* `apps/api` → NestJS (Backend)
* `packages/*` → Shared packages (optional)

---

## 📦 Prerequisites

* Node.js 20+
* PNPM (recommended)
* Docker (optional → only DB & Redis)

Install PNPM:

```bash
npm install -g pnpm
```

---

## 📥 Installation

Clone repository:

```bash id="1qk3dp"
git clone https://github.com/mahdi-i/auth-Next-Nest.git
cd auth-Next-Nest
```

Install all dependencies:

```bash id="l9q1xa"
pnpm install
```

> ✔ Installs dependencies for **all apps automatically (web + api + packages)**

---

## ⚙️ Environment Setup

### 🧩 1. Root Environment

Create:

```bash id="9v2n2a"
cp .env.example .env
```

---

### 🧩 2. Backend Environment

```bash id="q9w2mz"
cp apps/api/.env.example apps/api/.env
```

---

### 🧩 3. Frontend Environment

```bash id="x2m8ks"
cp apps/web/.env.example apps/web/.env
```

## 🐳 Docker (Optional)

Only for database & redis:

```bash id="docker-up"
docker compose up -d
```

Stop:

```bash id="docker-down"
docker compose down
```

> ⚠️ Docker is NOT required for running apps

---

## 🏃 Development

### 🚀 Run full stack (recommended)

```bash id="turbo-dev"
pnpm dev
```

👉 This runs automatically:

* Next.js → `apps/web`
* NestJS → `apps/api`

via **TurboRepo pipeline**

---

## 🏗 Build

```bash id="build-all"
pnpm build
```

or:

```bash id="turbo-build"
turbo run build
```

---

## 🧹 Quality

```bash id="lint"
pnpm lint
pnpm format
pnpm check-types
```

---

## 📌 Scripts Summary

| Command                 | Description                                      |
| ----------------------- | ------------------------------------------------ |
| `pnpm install`          | Install all workspace dependencies               |
| `pnpm dev`              | Run **frontend + backend automatically (Turbo)** |
| `pnpm build`            | Build all apps                                   |
| `pnpm lint`             | Lint all apps                                    |
| `pnpm format`           | Format code                                      |
| `pnpm check-types`      | Type check                                       |
| `pnpm --filter web dev` | Run frontend only                                |
| `pnpm --filter api dev` | Run backend only                                 |

---

## 🚀 Recommended Workflow

```bash id="workflow"
docker compose up -d
pnpm install
pnpm dev
```

---

## 📦 Monorepo Benefits

This repository uses **TurboRepo** and **PNPM Workspaces** to:

* Share code between applications
* Speed up builds through caching
* Simplify dependency management
* Scale multiple applications in a single repository

---

## 🛠 Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

### Backend

* NestJS
* TypeScript
* JWT
* Passport
* PostgreSQL

### Tooling

* TurboRepo
* PNPM Workspaces
* Docker

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push your branch
5. Open a Pull Request

---
