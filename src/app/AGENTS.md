# Padrões para Páginas (App Router)

## Visão Geral

Este documento estabelece os padrões para criação de páginas neste projeto.

## Estrutura de Arquivos

```
src/app/
├── page.tsx              # Home page (/)
├── layout.tsx            # Root layout
├── globals.css           # Estilos globais + design tokens
├── leaderboard/
│   └── page.tsx         # Leaderboard page
├── results/
│   └── [id]/
│       └── page.tsx      # Results page (dynamic route)
└── exemplos/
    └── page.tsx         # Exemplos de componentes
```

## Padrões de Página

### 1. SSR para Páginas Indexáveis

Todas as páginas devem ser Server Components para SEO e indexação.

```typescript
// ✅ Correto - Server Component
export default function Page() {
  return <main>...</main>;
}

// ❌ Errado - Client Component desnecessário
"use client";
export default function Page() {
  return <main>...</main>;
}
```

### 2. Metadata para SEO

Adicione `generateMetadata` ou `metadata` export para todas as páginas públicas.

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Title | devroast",
  description: "Page description for SEO",
};

export default function Page() {
  return <main>...</main>;
}
```

### 3. Dynamic Routes para IDs

Para páginas com parâmetros dinâmicos (UUID, slug, etc.), use a estrutura de diretório com colchetes.

```typescript
// src/app/results/[id]/page.tsx
export interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Result ${id} | devroast`,
  };
}

export default async function ResultsPage({ params }: PageProps) {
  const { id } = await params;
  // ... implementação
}
```

### 4. Layout Compartilhado

O `layout.tsx` raiz contém o Navbar que é compartilhado em todas as páginas.

```typescript
// src/app/layout.tsx
import { Navbar } from "@/components/navbar";
import { TRPCReactProvider } from "@/trpc/client";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body>
        <TRPCReactProvider>
          <Navbar />
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
```

### 5. Background e Classes Globais

Use `bg-bg-page` para o background principal da página.

```typescript
export default function Page() {
  return (
    <main className="min-h-screen bg-bg-page">
      {/* conteúdo */}
    </main>
  );
}
```

## Componentes de Página Disponíveis

| Componente | Arquivo | Descrição |
|------------|---------|-----------|
| Navbar | `src/components/navbar.tsx` | Barra de navegação |
| LeaderboardEntry | `src/components/ui/leaderboard-entry.tsx` | Card de entrada do leaderboard |
| ScoreRing | `src/components/ui/score-ring.tsx` | Score circular com gradiente |
| IssueCard | `src/components/ui/issue-card.tsx` | Card de análise de issues |
| CodeBlock | `src/components/ui/code-block.tsx` | Bloco de código com syntax highlighting |

## Tokens de Layout

| Token | Uso |
|-------|-----|
| `min-h-screen` | Altura mínima da tela |
| `mx-auto` | Margem horizontal automática |
| `max-w-5xl` | Largura máxima (1024px) |
| `px-10` | Padding horizontal (40px) |
| `py-10` | Padding vertical (40px) |
| `gap-5` | Gap entre elementos (20px) |
| `mb-10` | Margin bottom (40px) |

## Checklist de Criação de Página

- [ ] Usar Server Component (sem "use client")
- [ ] Adicionar metadata para SEO
- [ ] Usar Navbar do layout raiz
- [ ] Usar `bg-bg-page` para background
- [ ] Adicionar padding/margin consistentes
- [ ] Para dynamic routes, extrair `params` corretamente
- [ ] Testar lint e build

## Exemplo de Página

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Title | devroast",
  description: "Page description",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-bg-page">
      <div className="mx-auto max-w-5xl px-10 py-10">
        <h1 className="mb-4 font-primary text-2xl font-bold text-text-primary">
          Título da Página
        </h1>
        <p className="font-secondary text-sm text-text-secondary">
          Descrição da página
        </p>
      </div>
    </main>
  );
}
```

## Server e Client Components

### Princípios

1. **Páginas devem ser Server Components** por padrão
2. **Extrair lógica interativa** para Client Components separados
3. **Usar Suspense + Skeleton** para loading states
4. **Manter components pequeños** com responsabilidade única

### Estrutura Recomendada

```
src/app/
├── page.tsx              # Server Component (página)
├── home-client.tsx       # Client Component (lógica interativa)
└── components/
    ├── my-feature.tsx    # Client Component
    └── my-feature-skeleton.tsx # Skeleton para loading
```

### Exemplo: Server + Client + Suspense

```typescript
// page.tsx (Server Component)
import { Suspense } from "react";
import { MyComponent } from "./my-component";
import { MyComponentSkeleton } from "./my-component-skeleton";

export default function Page() {
  return (
    <main>
      <h1>Minha Página</h1>
      <Suspense fallback={<MyComponentSkeleton />}>
        <MyComponent />
      </Suspense>
    </main>
  );
}

// my-component.tsx (Client Component)
"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function MyComponent() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.stats.getGlobal.queryOptions());
  return <div>{data?.totalSubmissions}</div>;
}

// my-component-skeleton.tsx (Skeleton)
export function MyComponentSkeleton() {
  return (
    <div className="flex gap-4">
      <div className="h-4 w-20 animate-pulse bg-surface rounded" />
      <div className="h-4 w-16 animate-pulse bg-surface rounded" />
    </div>
  );
}
```

### Quando Criar Client Component

| Situação | Usar Client Component? |
|----------|------------------------|
| `useState`, `useEffect` | Sim |
| Event handlers (onClick, onChange) | Sim |
| tRPC hooks (useQuery, useMutation) | Sim |
| Apenas renderização de dados | Não (Server Component) |
| Fetch de dados sem interatividade | Considerar Server Component |

## number-flow para Números Animados

Para animações de números (contadores, scores), usar `@number-flow/react`.

```typescript
import NumberFlow from "@number-flow/react";

<NumberFlow value={count} className="tabular-nums" />
```

Criar wrapper se necessário:

```typescript
// animated-number.tsx
"use client";

import NumberFlow from "@number-flow/react";

interface AnimatedNumberProps {
  value: number;
}

export function AnimatedNumber({ value }: AnimatedNumberProps) {
  return <NumberFlow value={value} className="tabular-nums" />;
}
```

## Checklist de Nova Feature

- [ ] Criar spec em `specs/` antes de implementar
- [ ] Usar Server Component para página
- [ ] Extrair lógica interativa para Client Component
- [ ] Criar Skeleton para loading states
- [ ] Usar Suspense wrapping
- [ ] Para números animados, usar number-flow
- [ ] Testar lint
