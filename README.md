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

## 🚀 Getting Started

### Prerequisites

* Node.js 20+
* PNPM
* Docker (Optional)

Install PNPM:

```bash
npm install -g pnpm
```

---

## 📥 Installation

Clone the repository:

```bash
git clone https://github.com/mahdi-i/auth-Next-Nest.git
cd auth-Next-Nest
```

Install dependencies:

```bash
pnpm install
```

Create environment variables:

```bash
cp .env.example .env
```

Update the environment values according to your setup.

---

## 🏃 Development

Run all applications:

```bash
pnpm dev
```

Run frontend only:

```bash
pnpm --filter web dev
```

Run backend only:

```bash
pnpm --filter api dev
```

---

## 🏗 Build

Build all applications:

```bash
pnpm build
```

Or:

```bash
turbo run build
```

---

## 🧹 Lint

```bash
pnpm lint
```

---

## 🐳 Docker

Start containers:

```bash
docker-compose up -d
```

Stop containers:

```bash
docker-compose down
```

---

## 📜 Available Scripts

| Command           | Description                 |
| ----------------- | --------------------------- |
| `pnpm dev`        | Run all apps in development |
| `pnpm build`      | Build all applications      |
| `pnpm lint`       | Run linting                 |
| `pnpm test`       | Run tests                   |
| `turbo run build` | Build using TurboRepo       |

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
