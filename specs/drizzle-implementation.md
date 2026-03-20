# Drizzle ORM Implementation Specification

## Overview

- **ORM**: Drizzle ORM
- **Database**: PostgreSQL via Docker Compose
- **Auth**: Anonymous (no tracking)
- **Reviews**: AI-generated (provider-agnostic)

---

## Database Schema

### Enums

#### `roast_mode`
```typescript
roastModeEnum = enum('roast_mode', ['honest', 'roast'])
```

#### `submission_language`
```typescript
languageEnum = enum('submission_language', [
  'javascript', 'typescript', 'python', 'rust', 'go', 
  'java', 'c', 'cpp', 'csharp', 'ruby', 'php', 'swift',
  'kotlin', 'sql', 'html', 'css', 'shell', 'other'
])
```

#### `verdict`
```typescript
verdictEnum = enum('verdict', ['good', 'warning', 'error'])
```

#### `severity`
```typescript
severityEnum = enum('severity', ['info', 'warning', 'error', 'critical'])
```

---

### Tables

#### `submissions`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | `primary key, default gen_random_uuid()` | Unique identifier |
| `code` | `text` | `not null` | Submitted code |
| `language` | `submission_language` | `not null, default 'other'` | Programming language |
| `roast_mode` | `roast_mode` | `not null, default 'honest'` | Feedback mode |
| `created_at` | `timestamp` | `not null, default now()` | Submission timestamp |

#### `roasts`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | `primary key, default gen_random_uuid()` | Unique identifier |
| `submission_id` | `uuid` | `not null, foreign key -> submissions.id, on delete cascade, index` | Parent submission |
| `verdict` | `verdict` | `not null` | Overall verdict (good/warning/error) |
| `severity` | `severity` | `not null` | Highest severity found |
| `feedback` | `text` | `not null` | AI-generated review text |
| `created_at` | `timestamp` | `not null, default now()` | Generation timestamp |

#### `roast_findings`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | `primary key, default gen_random_uuid()` | Unique identifier |
| `roast_id` | `uuid` | `not null, foreign key -> roasts.id, on delete cascade, index` | Parent roast |
| `severity` | `severity` | `not null` | Finding severity level |
| `line` | `integer` | `nullable` | Line number (if applicable) |
| `message` | `text` | `not null` | Finding description |
| `suggestion` | `text` | `nullable` | How to fix it |

---

## Docker Compose Configuration

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16-alpine
    container_name: devroast-db
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: devroast
      POSTGRES_PASSWORD: devroast
      POSTGRES_DB: devroast
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U devroast"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

**Env file** (`.env.local`):
```
DATABASE_URL=postgresql://devroast:devroast@localhost:5432/devroast
```

---

## Drizzle Configuration

```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
})
```

---

## Project Structure

```
src/
├── db/
│   ├── index.ts          # DB connection singleton
│   ├── schema.ts         # All table definitions
│   └── migrations/       # Drizzle migrations
drizzle.config.ts
docker-compose.yml
.env.local
```

---

## To-Dos

### Phase 1: Setup (Done)
- [x] Install dependencies: `npm install drizzle-orm`
- [x] Install dev deps: `npm install -D drizzle-kit`
- [x] Create `docker-compose.yml` with Postgres 16
- [x] Create `.env.local` with `DATABASE_URL`
- [x] Create `drizzle.config.ts`
- [ ] Run `docker compose up -d` to start Postgres

### Phase 2: Schema (Done)
- [x] Create `src/db/schema.ts` with enums and tables
- [ ] Run `drizzle-kit generate` to create initial migration
- [ ] Run `drizzle-kit push` (or `migrate`) to apply schema

### Phase 3: Database Connection (Done)
- [x] Create `src/db/index.ts` with connection singleton
- [x] Export typed queries from schema

### Phase 4: API Integration
- [ ] Create submission endpoint: `POST /api/submissions`
- [ ] Create roast generation endpoint: `POST /api/roasts`
- [ ] Create leaderboard endpoint: `GET /api/leaderboard`
- [ ] Wire up UI to API calls

### Phase 5: Stats (Optional)
- [ ] Add global stats query (total submissions, avg score)
- [ ] Cache with ISR or revalidate

---

## Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `db:generate` | `drizzle-kit generate` | Generate migrations |
| `db:migrate` | `drizzle-kit migrate` | Apply migrations |
| `db:push` | `drizzle-kit push` | Push schema (dev) |
| `db:studio` | `drizzle-kit studio` | Visual DB explorer |

Add to `package.json`:
```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

---

## Notes

- **AI integration**: Abstract behind a `RoastService` interface for provider flexibility
- **Leaderboard**: Ordered by severity (critical > error > warning > info), then by newest
