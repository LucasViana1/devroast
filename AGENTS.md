# DevRoast - Padrões Globais

## Stack
- **Framework**: Next.js 16 (App Router) + TypeScript
- **Estilização**: Tailwind CSS v4
- **UI**: @base-ui/react + @radix-ui/react-switch
- **Syntax Highlighting**: shiki (tema vesper)
- **API**: tRPC + React Query
- **Database**: Drizzle ORM + PostgreSQL

## Estrutura de Diretórios

```
src/
├── app/              # Pages (App Router)
├── components/        # Componentes React
│   └── ui/           # Componentes reutilizáveis (Button, Card, etc.)
├── lib/              # Utilitários
└── trpc/             # tRPC setup
    ├── client.tsx    # TRPCReactProvider
    ├── init.ts       # tRPC initialization
    ├── query-client.ts
    ├── server.tsx    # tRPC server
    └── routers/       # API routers
        └── _app.ts   # Main router
```

## Padrões de Commits

- **NUNCA faça commit sem autorização explícita do usuário**
- Aguarde o usuário solicitar o commit antes de executá-lo
- Após implementar funcionalidades, aguarde análise do código antes de commitar
- Sempre mostre o plano antes de implementar

## Validação

- Nas validações, rode apenas `npm run lint` por padrão
- Execute `npm run build` apenas quando o usuário solicitar explicitamente

## Padrões Gerais

### Named Exports
**SEMPRE** use named exports. Nunca use default exports.

```typescript
// ✅ Correto
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(...);

// ❌ Errado
export default function Button() { }
```

### Tokens Tailwind
Use tokens no formato padrão do Tailwind, não `var()`.

```typescript
// ✅ Correto
"bg-primary"
"text-text-secondary"
"accent-green"

// ❌ Errado
"bg-[var(--color-primary)]"
```

### Fontes
- **Texto tradicional**: `font-secondary` (sans-serif)
- **Texto monospaced**: `font-primary` (JetBrains Mono)

## Cores do Projeto

| Token | Cor Hex | Uso |
|-------|---------|-----|
| `accent-green` | #22C55E | Sucesso, ações positivas |
| `accent-red` | #EF4444 | Erros, alertas críticos |
| `accent-amber` | #F59E0B | Avisos, destaques |
| `accent-cyan` | #06B6D4 | Info, links |
| `text-primary` | #F2F3F0 | Texto principal (dark) |
| `text-secondary` | #A3A3A3 | Texto secundário |
| `text-tertiary` | #737373 | Texto terciário |
| `bg-page` | #0A0A0A | Background da página |
| `bg-surface` | #0F0F0F | Background de superfície |
| `bg-input` | #111111 | Background de inputs |
| `border-primary` | #2A2A2A | Bordas principais |

## Documentação Específica por Área

| Diretório | Arquivo | Descrição |
|-----------|---------|-----------|
| `src/components/ui/` | AGENTS.md | Padrões de componentes UI |
| `src/app/` | AGENTS.md | Padrões de páginas e Server/Client Components |
| `src/trpc/` | AGENTS.md | Padrões de tRPC e React Query |
| `src/db/` | AGENTS.md | Padrões de banco de dados |
| `specs/` | AGENTS.md | Padrões para criar especificações |

## Workflow de Implementação

1. **Análise**: Entender o que o usuário quer
2. **Plano**: Mostrar plano detalhado antes de implementar
3. **Confirmação**: Aguardar "sim" ou "pode prosseguir"
4. **Implementação**: Codificar seguindo os padrões
5. **Validação**: Rodar lint e verificar
6. **Revisão**: Aguardar análise do código
7. **Commit**: Apenas quando usuário solicitar
