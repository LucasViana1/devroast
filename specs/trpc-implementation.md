# tRPC Implementation Specification

## Overview

- **Type**: API layer with type-safe RPC
- **Framework**: tRPC v11 + TanStack React Query v5
- **Integration**: Next.js 16 App Router with Server Components
- **Database**: Drizzle ORM + PostgreSQL (existing)

---

## Funcionalidades

### API Layer
- [ ] tRPC router with Drizzle integration
- [ ] Procedures for submissions CRUD
- [ ] Procedures for roasts/feedback
- [ ] Procedures for leaderboard/stats

### Client Integration
- [ ] TRPCProvider for Client Components
- [ ] Server Components prefetching support
- [ ] TanStack Query hydration

### Roteamento
- [ ] API route em `/api/trpc/[trpc]`
- [ ] Fetch adapter para Next.js

---

## Estrutura de Arquivos

```
src/
├── trpc/
│   ├── init.ts              # initTRPC, context, router helpers
│   ├── query-client.ts      # QueryClient factory
│   ├── client.tsx           # Client components provider
│   ├── server.tsx           # Server components helpers
│   └── routers/
│       └── _app.ts          # Main router (exports AppRouter type)
└── app/
    └── api/trpc/[trpc]/route.ts
```

---

## Dependências

```bash
npm install @trpc/server @trpc/client @trpc/tanstack-react-query @tanstack/react-query zod client-only server-only
```

---

## API Routes (Procedures)

### Submissions
| Procedure | Type | Description |
|-----------|------|-------------|
| `submission.create` | mutation | Create new submission |
| `submission.getById` | query | Get submission by ID |
| `submission.list` | query | List recent submissions |

### Roasts
| Procedure | Type | Description |
|-----------|------|-------------|
| `roast.create` | mutation | Generate roast for submission |
| `roast.getBySubmission` | query | Get roast for submission |

### Leaderboard
| Procedure | Type | Description |
|-----------|------|-------------|
| `leaderboard.getTop` | query | Get top worst scores |
| `stats.getGlobal` | query | Get total submissions, avg score |

---

## To-Dos

### Fase 1: Setup
- [ ] Install dependencies
- [ ] Create `trpc/init.ts` with context and router helpers
- [ ] Create `trpc/query-client.ts` factory
- [ ] Create API route handler at `app/api/trpc/[trpc]/route.ts`

### Fase 2: Router
- [ ] Create `trpc/routers/_app.ts` with procedures
- [ ] Integrate Drizzle with procedures
- [ ] Export `AppRouter` type

### Fase 3: Client Provider
- [ ] Create `trpc/client.tsx` with TRPCProvider
- [ ] Add provider to `app/layout.tsx`

### Fase 4: Server Components
- [ ] Create `trpc/server.tsx` with prefetch helpers
- [ ] Add `HydrateClient` wrapper

### Fase 5: Integration
- [ ] Wire up homepage with tRPC queries
- [ ] Implement submission mutation
- [ ] Update leaderboard with real data

---

## Notas

- Usar `server-only` para arquivos server-side
- Usar `client-only` para arquivos client-side
- Prefetch queries em Server Components antes de passar para Client Components
- Usar `createCallerFactory` para chamadas diretas em Server Components
