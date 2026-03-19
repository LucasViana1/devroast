# Padrões para Criação de Componentes UI

## Visão Geral

Este documento estabelece os padrões para criação de componentes UI neste projeto.

## Stack

- **Framework**: Next.js 16 (App Router)
- **Estilização**: Tailwind CSS v4
- **Variants**: tailwind-variants (tv)
- **Utils**: clsx + tailwind-merge (cn)
- **UI Primitives**: @base-ui/react (comportamentos), @radix-ui/react-switch (toggle)
- **Syntax Highlighting**: shiki (tema vesper)
- **Linting**: Biome (2 espaços)
- **Linguagem**: TypeScript

## Estrutura de Arquivos

```
src/
├── components/
│   ├── ui/
│   │   └── <component-name>.tsx    # Componentes UI pequenos e reutilizáveis
│   ├── code-editor.tsx             # Editor de código (maior, específico)
│   └── navbar.tsx                  # Navbar (maior, específico)
└── lib/
    └── utils.ts
```

> **Nota**: Componentes maiores e pouco reaproveitáveis (como `CodeEditor` e `Navbar`) ficam na raiz de `src/components/`, fora da pasta `ui/`.

## Fontes

- **Texto tradicional**: sans-serif (padrão do sistema)
- **Texto monospaced**: JetBrains Mono (via token `font-primary`)

Para usar a fonte monospaced em componentes, use o token `font-primary`:
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

Use `tv` para criar variantes do componente. Para casos onde cada variante tem seu próprio tamanho e font específicos, use `variantSize` com `compoundVariants`.

```typescript
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const componentVariants = tv({
  base: "base-classes-obrigatorias",
  variants: {
    variant: {
      primary: "bg-primary text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground",
    },
    variantSize: {
      primary: "py-2.5 px-6 text-[13px] font-medium",
      secondary: "py-2 px-4 text-[12px] font-normal",
    },
  },
  compoundVariants: [
    {
      variant: "primary",
      variantSize: "primary",
      class: "font-[family-name:var(--font-primary)]",
    },
  ],
  defaultVariants: {
    variant: "primary",
    variantSize: "primary",
  },
});
```

### 4. Usar Tokens do Tema (Formato Padrão Tailwind)

**SEMPRE** use os tokens no formato padrão do Tailwind. Não use a sintaxe `var()`.

```typescript
// ✅ Correto - formato padrão Tailwind
"bg-primary"
"text-foreground"
"border-border"
"bg-muted"

// ❌ Errado - usando var()
"bg-[var(--color-primary)]"
"text-[var(--color-foreground)]"
```

### 5. Forward Ref

Use `forwardRef` para permitir ref forwarding.

```typescript
const Component = forwardRef<HTMLElementType, ComponentProps>(
  ({ className, ...props }, ref) => {
    return <element ref={ref} className={cn(...)} {...props} />;
  }
);
Component.displayName = "Component";
```

### 6. Usar Next.js Link

Quando um botão precisar funcionar como link, use `asChild` com `Link` do Next.js.

```typescript
import Link from "next/link";

// No componente Button:
const Comp = asChild ? Link : "button";

if (asChild) {
  const { href, ...linkProps } = props;
  return <Link href={href || "/"} {...linkProps} />;
}
```

Uso:
```tsx
<Button asChild>
  <Link href="/dashboard">Dashboard</Link>
</Button>
```

### 7. Server Components para CodeBlock

Componentes que usam shiki ou outras bibliotecas de renderização pesada devem ser Server Components.

```typescript
// code-block.tsx (Server Component)
export async function CodeBlock({ code, lang = "javascript" }: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang,
    theme: "vesper",
  });

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
```

### 8. Arquivo utils.ts

Mantenha o utilitário `cn` em `src/lib/utils.ts`.

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 9. Adicionar à Página de Exemplos

Todo novo componente deve ser adicionado à página `/exemplos` com exemplos de suas variações.

## Tokens Disponíveis

### Cores Principais

| Token | Uso |
|-------|-----|
| `primary` | Cor principal da marca |
| `primary-foreground` | Texto sobre primary |
| `secondary` | Cor secundária |
| `secondary-foreground` | Texto sobre secondary |
| `destructive` | Ações destructivas |
| `muted` | Fundos sutis |
| `muted-foreground` | Texto em background muted |
| `accent` | Destaque |
| `accent-foreground` | Texto sobre accent |
| `background` | Background da página |
| `foreground` | Texto principal |
| `card` | Background de cards |
| `card-foreground` | Texto em cards |
| `border` | Bordas |
| `border-primary` | Bordas principais |
| `border-secondary` | Bordas secundárias |
| `input` | Inputs |
| `ring` | Focus rings |
| `popover` | Popovers |
| `popover-foreground` | Texto em popovers |

### Cores Semânticas

| Token | Descrição |
|-------|-----------|
| `success` | Background sucesso |
| `success-foreground` | Texto sucesso |
| `warning` | Background aviso |
| `warning-foreground` | Texto aviso |
| `error` | Background erro |
| `error-foreground` | Texto erro |
| `info` | Background info |
| `info-foreground` | Texto info |

### Accent Colors

| Token |
|-------|
| `accent-green` |
| `accent-amber` |
| `accent-red` |
| `accent-cyan` |
| `accent-blue` |

### Text

| Token |
|-------|
| `text-primary` |
| `text-secondary` |
| `text-tertiary` |
| `text-muted` |

### Radius

| Token | Valor |
|-------|-------|
| `radius-none` | 0 |
| `radius-sm` | 4px |
| `radius-md` | 8px |
| `radius-lg` | 16px |
| `radius-pill` | 9999px |

### Font

| Token | Descrição |
|-------|-----------|
| `font-primary` | JetBrains Mono (monospaced) |
| `font-secondary` | sans-serif (padrão do sistema) |

## Componentes UI Disponíveis

| Componente | Arquivo | Biblioteca |
|------------|---------|-----------|
| Button | button.tsx | - |
| Toggle | toggle.tsx | @radix-ui/react-switch |
| Badge | badge.tsx | - |
| BadgeDot | badge.tsx | - |
| Card | card.tsx | - |
| CardHeader | card.tsx | - |
| CardTitle | card.tsx | - |
| CardDescription | card.tsx | - |
| CodeBlock | code-block.tsx | shiki (server) |
| DiffLine | diff-line.tsx | - |
| Table | table.tsx | - |
| TableHeader | table.tsx | - |
| TableBody | table.tsx | - |
| TableRow | table.tsx | - |
| TableHead | table.tsx | - |
| TableCell | table.tsx | - |

## Outros Componentes

| Componente | Arquivo | Descrição |
|------------|---------|-----------|
| CodeEditor | code-editor.tsx | Editor de código com textarea |
| Navbar | navbar.tsx | Barra de navegação do site |

## Checklist de Criação de Componente

- [ ] Criar arquivo em `src/components/ui/<nome>.tsx`
- [ ] Usar named exports
- [ ] Estender props nativas do HTML
- [ ] Usar `forwardRef`
- [ ] Usar `tv` para variantes
- [ ] Usar tokens no formato padrão Tailwind (ex: `bg-primary`, não `bg-[var(--color-primary)]`)
- [ ] Usar `cn()` para mesclar classes
- [ ] Adicionar `displayName`
- [ ] Para links, usar `Link` do Next.js com `asChild`
- [ ] Para componentes pesados (shiki), usar Server Component
- [ ] Adicionar exemplo na página `/exemplos`
- [ ] Testar lint e build

## Exemplo Completo

```typescript
import { type HTMLAttributes, forwardRef } from "react";

import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "@/lib/utils";

const componentVariants = tv({
  base: "base-classes-with-tokens",
  variants: {
    variant: {
      primary: "bg-primary text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground",
    },
    variantSize: {
      primary: "py-2.5 px-6 text-[13px] font-medium",
      secondary: "py-2 px-4 text-[12px] font-normal",
    },
  },
  compoundVariants: [
    {
      variant: "primary",
      variantSize: "primary",
      class: "font-[family-name:var(--font-primary)]",
    },
  ],
  defaultVariants: {
    variant: "primary",
    variantSize: "primary",
  },
});

export interface ComponentProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {
  // custom props
}

const Component = forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant, variantSize, ...props }, ref) => {
    return (
      <div
        className={cn(componentVariants({ variant, variantSize, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Component.displayName = "Component";

export { Component, componentVariants };
```
