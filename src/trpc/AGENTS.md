# Padrões para tRPC

## Visão Geral

Este documento estabelece os padrões para configuração e uso do tRPC v11 + TanStack React Query v5 neste projeto.

## Stack

- **tRPC**: v11
- **React Query**: TanStack React Query v5
- **Adapter**: Fetch adapter para Next.js

## Estrutura de Arquivos

```
src/trpc/
├── client.tsx        # TRPCReactProvider (Client Component)
├── init.ts          # initTRPC, context, router helpers
├── query-client.ts  # React Query client factory
├── server.tsx       # Helpers para Server Components
├── routers/
│   └── _app.ts      # Main router (exporta AppRouter type)
└── AGENTS.md        # Este arquivo
```

## Configuração

### 1. init.ts - Inicialização

```typescript
import { initTRPC } from "@trpc/server";
import { cache } from "react";
import { db } from "@/db";

export const createTRPCContext = cache(async () => {
  return { db };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({});

export const createTRPCRouter = t.router;
export const baseProcedure = t.procedure;
```

### 2. query-client.ts - Factory do QueryClient

```typescript
import { QueryClient } from "@tanstack/react-query";
import { defaultShouldDehydrateQuery } from "@tanstack/react-query";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  });
}
```

### 3. server.tsx - Helpers para Server Components

```typescript
import "server-only";
import { cache } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { makeQueryClient } from "./query-client";
import { createTRPCContext } from "./init";
import { appRouter } from "./routers/_app";
import type { AppRouter } from "./routers/_app";

export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy<AppRouter>({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
});

export function HydrateClient(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}
```

### 4. client.tsx - TRPCProvider

```typescript
"use client";

import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import { useState } from "react";
import { makeQueryClient } from "./query-client";
import type { AppRouter } from "./routers/_app";

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: `${getUrl()}/api/trpc`,
        }),
      ],
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
```

## API Route

### src/app/api/trpc/[trpc]/route.ts

```typescript
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createTRPCContext } from "@/trpc/init";
import { appRouter } from "@/trpc/routers/_app";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });

export { handler as GET, handler as POST };
```

## Routers

### Estrutura do _app.ts

```typescript
import { createTRPCRouter, baseProcedure } from "../init";

export const appRouter = createTRPCRouter({
  stats: createTRPCRouter({
    getGlobal: baseProcedure.query(async ({ ctx }) => {
      // Implementação da procedure
      return { totalSubmissions: 0, avgScore: 0 };
    }),
  }),
});

export type AppRouter = typeof appRouter;
```

## Uso em Componentes

### Client Component (com hooks)

```typescript
"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function MyComponent() {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(trpc.stats.getGlobal.queryOptions());

  return <div>{data?.totalSubmissions}</div>;
}
```

### Server Component com Suspense

```typescript
import { Suspense } from "react";
import { MyComponentSkeleton } from "./my-component-skeleton";
import { MyComponent } from "./my-component";

export default async function Page() {
  return (
    <Suspense fallback={<MyComponentSkeleton />}>
      <MyComponent />
    </Suspense>
  );
}
```

## Padrões Importantes

### Client/Server Components

- Páginas devem ser Server Components
- Extrair lógica interativa para Client Components separados
- Usar `Suspense` com skeleton para loading states

### Skeleton Components

Criar skeleton para cada componente que faz fetch de dados:

```typescript
export function MyComponentSkeleton() {
  return <div className="animate-pulse bg-surface h-10 w-32" />;
}
```

### number-flow para Animações

Usar `@number-flow/react` para números animados:

```typescript
import NumberFlow from "@number-flow/react";

<NumberFlow value={count} className="tabular-nums" />
```

## Comandos npm

| Comando | Descrição |
|---------|-----------|
| `npm run lint` | Verificação de lint |
| `npm run build` | Build de produção |

## Checklist de Nova Procedure

- [ ] Adicionar procedure no router `_app.ts`
- [ ] Exportar tipo se necessário
- [ ] Criar Client Component se usar hooks
- [ ] Criar Skeleton component
- [ ] Integrar com Suspense em Server Component
- [ ] Testar lint
