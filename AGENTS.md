# DevRoast

## Stack
- **Framework**: Next.js 16 (App Router) + TypeScript
- **Estilização**: Tailwind CSS v4
- **UI**: @base-ui/react + @radix-ui/react-switch
- **Syntax Highlighting**: shiki (tema vesper)

## Estrutura
```
src/
├── app/                    # Pages (App Router)
├── components/
│   ├── ui/                 # Componentes reutilizáveis
│   ├── code-editor.tsx     # Editor de código
│   └── navbar.tsx          # Navbar
└── lib/
    └── utils.ts            # cn()
```

## Padrões
- **Named exports** sempre (sem default exports)
- **Tokens Tailwind** padrão: `bg-primary`, `text-text-secondary`, etc.
- **Fontes**: `font-primary` (JetBrains Mono), `font-secondary` (sans-serif)
- **Componentes grandes** (CodeEditor, Navbar) ficam fora de `ui/`
- **Server Components** para componentes pesados (shiki)

## Cores
| Token | Cor |
|-------|-----|
| accent-green | #22C55E |
| accent-red | #EF4444 |
| accent-amber | #F59E0B |

## Componentes UI
Ver `src/components/ui/AGENTS.md`
