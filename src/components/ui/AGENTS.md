# Padrões para Componentes UI

## Visão Geral

Este documento estabelece os padrões para criação de componentes UI neste projeto.

## Stack

- **Framework**: Next.js 16 (App Router)
- **Estilização**: Tailwind CSS v4
- **Variants**: tailwind-variants (tv)
- **Utils**: clsx + tailwind-merge (cn)
- **UI Primitives**: @base-ui/react, @radix-ui/react-switch
- **Syntax Highlighting**: shiki (tema vesper)
- **Linting**: Biome (2 espaços)
- **Linguagem**: TypeScript

## Estrutura de Arquivos

```
src/components/
├── ui/
│   ├── button.tsx          # Botões
│   ├── card.tsx            # Cards
│   ├── code-block.tsx      # Bloco de código com shiki
│   ├── badge.tsx           # Badges e dots
│   ├── toggle.tsx          # Toggle switch
│   ├── table.tsx           # Tabela
│   ├── diff-line.tsx       # Linha de diff
│   ├── score-ring.tsx      # Score circular com gradiente
│   ├── issue-card.tsx      # Card de análise de issues
│   └── leaderboard-entry.tsx # Card de entrada do leaderboard
├── code-editor.tsx         # Editor de código (maior, específico)
└── navbar.tsx             # Navbar (maior, específico)
```

## Fontes

- **Texto tradicional**: `font-secondary` (sans-serif)
- **Texto monospaced**: `font-primary` (JetBrains Mono)

```typescript
class="font-primary"
```

## Padrões Obrigatórios

### 1. Named Exports

**SEMPRE** use named exports. Nunca use default exports.

```typescript
// ✅ Correto
export interface ButtonProps { }
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(...);
export { Button, buttonVariants };

// ❌ Errado
export default function Button() { }
```

### 2. Estender Props Nativas

Todos os componentes devem estender as props nativas do elemento HTML.

```typescript
import { type ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  // props customizadas
}
```

### 3. Variants com tailwind-variants

Use `tv` para criar variantes do componente.

```typescript
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const buttonVariants = tv({
  base: "inline-flex items-center justify-center gap-2 font-medium transition-colors",
  variants: {
    variant: {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90",
      secondary: "border border-border-primary bg-transparent hover:bg-surface",
    },
    size: {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 text-sm",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});
```

### 4. Tokens do Tema (Formato Padrão Tailwind)

**SEMPRE** use os tokens no formato padrão do Tailwind.

```typescript
// ✅ Correto
"bg-primary"
"text-foreground"
"border-border-primary"

// ❌ Errado
"bg-[var(--color-primary)]"
```

### 5. Forward Ref

Use `forwardRef` para permitir ref forwarding.

```typescript
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
```

### 6. Server Components para Componentes Pesados

Componentes que usam shiki devem ser Server Components.

```typescript
// code-block.tsx (Server Component)
export async function CodeBlock({ code, lang = "javascript" }: CodeBlockProps) {
  const html = await codeToHtml(code, { lang, theme: "vesper" });
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
```

## Componentes UI e Animados

### Componentes UI Disponíveis

| Componente | Arquivo | Descrição |
|------------|---------|-----------|
| Button | button.tsx | Botões com variants |
| Toggle | toggle.tsx | Toggle switch (Radix) |
| Badge | badge.tsx | Badges e BadgeDot |
| Card | card.tsx | Card com Header, Title, Description |
| CodeBlock | code-block.tsx | Syntax highlighting (Server) |
| DiffLine | diff-line.tsx | Linha de diff |
| Table | table.tsx | Tabela |
| ScoreRing | score-ring.tsx | Score circular com gradiente |
| IssueCard | issue-card.tsx | Card de análise de issues |
| LeaderboardEntry | leaderboard-entry.tsx | Card de entrada do leaderboard |

### Componentes de Animação

| Componente | Arquivo | Descrição |
|------------|---------|-----------|
| AnimatedNumber | animated-number.tsx | Número animado com number-flow |

## Tokens Disponíveis

### Cores Principais

| Token | Uso |
|-------|-----|
| `primary` | Cor principal da marca (#FF8400) |
| `primary-foreground` | Texto sobre primary |
| `secondary` | Cor secundária |
| `background` | Background da página |
| `foreground` | Texto principal |
| `card` | Background de cards |
| `border` | Bordas |
| `border-primary` | Bordas principais (#2A2A2A) |

### Accent Colors

| Token | Cor |
|-------|-----|
| `accent-green` | #22C55E |
| `accent-amber` | #F59E0B |
| `accent-red` | #EF4444 |
| `accent-cyan` | #06B6D4 |

### Text Colors

| Token | Uso |
|-------|-----|
| `text-primary` | Texto principal (light) |
| `text-secondary` | Texto secundário |
| `text-tertiary` | Texto terciário |
| `text-muted` | Texto muted |

### Background Colors

| Token | Cor |
|-------|-----|
| `bg-page` | #0A0A0A |
| `bg-surface` | #0F0F0F |
| `bg-input` | #111111 |
| `bg-surface-elevated` | #1A1A1A |

## Pattern: CodeBlock com showHeader

O `CodeBlock` tem prop `showHeader` para controlar se mostra o header com bolinhas coloridas.

```typescript
// Com header (padrão) - para exibição standalone
<CodeBlock code={code} lang="javascript" />

// Sem header - para uso em cards/containers
<CodeBlock code={code} lang="javascript" showHeader={false} />
```

## Pattern: ScoreRing com Gradiente

O `ScoreRing` usa gradiente vermelho → âmbar → verde baseado no score.

```typescript
// Score < 3: vermelho
// Score 3-6: âmbar
// Score > 6: verde
<ScoreRing score={3.5} maxScore={10} />
```

## Pattern: IssueCard com Severity

O `IssueCard` mostra severidade com cor e badge.

```typescript
<IssueCard
  severity="error"
  line={10}
  message="Using 'var' instead of 'const'"
  suggestion="Use const or let instead"
/>
```

## Checklist de Criação de Componente

- [ ] Criar arquivo em `src/components/ui/<nome>.tsx`
- [ ] Usar named exports
- [ ] Estender props nativas do HTML
- [ ] Usar `tv` para variantes
- [ ] Usar tokens no formato padrão Tailwind
- [ ] Usar `cn()` para mesclar classes
- [ ] Adicionar `displayName`
- [ ] Para shiki, usar Server Component
- [ ] Adicionar exemplo na página `/exemplos`
- [ ] Testar lint
