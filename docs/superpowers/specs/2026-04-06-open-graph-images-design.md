# 2026-04-06-open-graph-images-design

## Objetivo

Gerar Open Graph images automaticamente para resultados de roast compartilhados via link.

## Escopo

- API route `/api/og/[id]` usando Takumi
- Integração com `generateMetadata` na página de results
- Design basado no frame "Screen 4 - OG Image" do Pencil

## Estrutura de Arquivos

```
src/app/api/og/[id]/
└── route.ts          # Endpoint que gera a imagem OG
```

### Alterações em Arquivos Existentes

- `src/app/results/[id]/page.tsx` - Adicionar `openGraph` no metadata
- `next.config.ts` - Configurar `serverExternalPackages` para Takumi

## Dados do OG Image

| Campo | Fonte | Transformação |
|-------|-------|----------------|
| Score | `roast.score / 10` | Inteiro (ex: 3.5) |
| Verdict | `roast.verdict` | lowercase + underscore |
| Linguagem | `submission.language` | Do schema |
| Linhas | `submission.code.split('\n').length` | Inteiro |
| Quote | `roast.feedback` | Truncar em 100 chars + "..." |

## Design (Frame "Screen 4 - OG Image")

- Largura: 1200px
- Altura: 630px
- Background: #0A0A0A
- Logo: "> devroast" em verde (#10B981)
- Score: Número grande em amarelo (#F59E0B) com "/10" em cinza
- Verdict: Dot + texto em vermelho (#EF4444)
- Info: "lang: {lang} · {lines} lines" em cinza (#4B5563)
- Quote: Feedback entre aspas em branco (#FAFAFA)

## Dependências

- `takumi-js` - Biblioteca de geração de imagens
- Configurar `serverExternalPackages` em `next.config.ts`

## Checklist de Implementação

- [ ] Instalar `takumi-js`
- [ ] Configurar `next.config.ts`
- [ ] Criar API route `/api/og/[id]`
- [ ] Implementar componente OgImage com Takumi
- [ ] Adicionar openGraph no generateMetadata
- [ ] Testar geração de imagem
- [ ] Validar com lint
