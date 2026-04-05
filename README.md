# Campaign Task

A TypeScript-based Express API for managing campaign lifecycle operations, including campaign creation, start/pause/resume actions, and status retrieval. The project uses Prisma with MySQL for database connectivity and includes a modular structure for clean service, controller, and routing separation.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)

## Prerequisites

- Node.js 20+ installed
- npm available
- MySQL database accessible
- A `DATABASE_URL` connection string for Prisma

## Installation

1. Clone the repository

```bash
git clone <repository-url>
cd "Campaign Task"
```

2. Install dependencies

```bash
npm install
```

3. Generate Prisma client

```bash
npm run prisma:generate
```

4. Apply the Prisma migration

```bash
npm run prisma:migrate
```

5. Seed the database (optional)

```bash
npm run seed
```

## Environment Variables

Create a `.env` file at the project root with the following values:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
PORT=3000
NODE_ENV=development
```

- `DATABASE_URL` is required for Prisma to connect to MySQL.
- `PORT` is optional and defaults to `3000`.
- `NODE_ENV` is optional and defaults to `development`.

## Database Setup

This app uses Prisma with MySQL. The schema is defined in `prisma/schema.prisma` and includes a `Campaign` model.

If you change the schema, regenerate Prisma client and apply migrations again:

```bash
npm run prisma:generate
npm run prisma:migrate
```

## Running the Project

- Development mode (hot reload):

```bash
npm run dev
```

- Build and run production mode:

```bash
npm run build
npm run start
```

The application starts in `src/server.ts`, which connects to the database and launches the Express app.

## API Endpoints

The API is mounted under `/api/campaigns`.

### Create campaign

- `POST /api/campaigns`
- Request body:

```json
{
  "customerList": ["+15551234567", "+15557654321"],
  "startTime": "08:00",
  "endTime": "17:00",
  "maxConcurrentCalls": 3,
  "maxDailyMinutes": 120,
  "maxRetries": 2,
  "retryDelayMs": 3600000,
  "timezone": "UTC"
}
```

### Start campaign

- `POST /api/campaigns/:id/start`

### Pause campaign

- `POST /api/campaigns/:id/pause`

### Resume campaign

- `POST /api/campaigns/:id/resume`

### Get campaign status

- `GET /api/campaigns/:id`

Responses follow a JSON success wrapper provided by `ApiResponse`, with details in the `data` field.

## Project Structure

```text
.
├── package.json
├── tsconfig.json
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   │   └── database/
│   │       ├── database.service.ts
│   │       └── prismaClient.ts
│   ├── core/
│   │   ├── clock/
│   │   │   └── system.clock.ts
│   │   ├── response/
│   │   │   └── api.response.ts
│   │   └── utils/
│   │       ├── catchAsync.ts
│   │       └── time.util.ts
│   ├── middleware/
│   │   ├── error.middleware.ts
│   │   └── validation.middleware.ts
│   ├── modules/
│   │   └── campaign/
│   │       ├── campaign.controller.ts
│   │       ├── campaign.dto.ts
│   │       ├── campaign.engine.ts
│   │       ├── campaign.routes.ts
│   │       ├── campaign.service.ts
│   │       └── campaign.types.ts
│   └── routes/
│       └── index.ts
```

### Key areas

- `src/server.ts`: Bootstraps the app, connects to the database, and starts the HTTP server.
- `src/app.ts`: Configures Express, JSON body parsing, routing, and error handling.
- `src/config/database/`: Contains Prisma client setup and database connection service.
- `src/core/`: Shared utilities, response formatting, and clock abstraction.
- `src/middleware/`: Validation and centralized error handling.
- `src/modules/campaign/`: Campaign domain module with DTO validation, controller actions, business service, and engine logic.
- `prisma/`: Database schema, migrations, and seed script.

## Notes

- Campaign lifecycle operations are managed in-memory via `CampaignEngine`.
- The MySQL database is used for persistent storage via Prisma, while the campaign execution queue is retained in the app runtime.
- Use `npm run prisma:studio` to view database records in Prisma Studio.
