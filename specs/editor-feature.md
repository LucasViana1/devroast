# Code Editor Feature Specification

## Overview

- **Tipo**: Editor editável com syntax highlighting em tempo real
- **Referência visual**: ray.so (interface limpa, código colorido)
- **Detecção de linguagem**: Híbrido (automática + manual)

---

## Funcionalidades

### Editor Editável
- [ ] Textarea invisível sobre código syntax-highlighted
- [ ] Sync de scroll entre textarea e highlight
- [ ] Funciona com Ctrl+V para colar código
- [ ] Permite digitação/edição direta

### Syntax Highlighting
- [ ] Tema "vesper" (já instalado via Shiki)
- [ ] Palavras-chave coloridas conforme gramática
- [ ] Comentários, strings, números com cores distintas
- [ ] Atualização em tempo real enquanto digita

### Números de Linha
- [ ] Exibidos à esquerda do código
- [ ] Alinhados com o conteúdo
- [ ] Scroll sincronizado com o editor

### Detecção de Linguagem Híbrida
- [ ] **Automática**: Detecta linguagem quando código é colado
- [ ] **Manual**: Dropdown para selecionar linguagem
- [ ] **Indicador visual**: Mostra linguagem detectada atual
- [ ] **Troca permitido**: Usuário pode sobrescrever detecção

---

## Bibliotecas

### Opção Recomendada: `prism-code-editor`
- ~15KB (core)
- Suporte a Prism/Highlight.js grammars
- Line numbers built-in
- Event hooks para detecção de linguagem

**Alternativas**:
- `@uiw/react-textarea-code-editor` (~50KB)
- `react-simple-code-editor` (~10KB)
- `prism-code-editor` com React wrapper

### Detecção de Linguagem: `flourite`
- ~15KB
- Detecta 25+ linguagens
- Output compatível com Shiki
- Sem dependências externas

---

## Componentes

### `CodeEditor` (Client Component)
```
src/components/code-editor.tsx
```

**Props**:
```typescript
interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  onLanguageChange?: (language: string) => void;
  placeholder?: string;
  detectedLanguage?: string;
  className?: string;
}
```

**Features**:
- State interno para `value` e `language`
- Executa `flourite` no paste (onChange)
- Renderiza highlight com Shiki internamente
- Sincroniza scroll entre textarea e code layer

### `LanguageSelector` (Client Component)
```
src/components/language-selector.tsx
```

**Features**:
- Dropdown com linguagens suportadas
- Mostra linguagem detectada com badge
- Permite override manual
- Sincroniza com CodeEditor

---

## Estrutura de Arquivos

```
src/
├── components/
│   ├── code-editor.tsx      # Editor principal (Client)
│   ├── language-selector.tsx # Selector de linguagem
│   └── ui/                  # Componentes reutilizáveis
```

---

## Fluxo de Dados

```
1. Usuário cola código
   ↓
2. CodeEditor detecta mudança
   ↓
3. Executa flourite.detect(code)
   ↓
4. Atualiza detectedLanguage state
   ↓
5. Executa shiki.codeToHtml(code, { lang })
   ↓
6. Renderiza highlight + textarea sincronizados
   ↓
7. onLanguageChange?(detectedLanguage) para通知父组件
```

---

## Linguagens Suportadas (prioridade)

1. JavaScript / TypeScript
2. Python
3. Rust
4. Go
5. Java
6. C / C++
7. C#
8. Ruby
9. PHP
10. Swift
11. Kotlin
12. SQL
13. HTML / CSS
14. Shell (Bash)
15. JSON / YAML
16. Markdown
17. Other (fallback)

---

## To-Dos

### Fase 1: Setup
- [ ] Avaliar e escolher biblioteca final (prism-code-editor vs @uiw)
- [ ] Instalar dependência escolhida
- [ ] Instalar `flourite` para detecção
- [ ] Testar com Shiki já instalado

### Fase 2: CodeEditor Component
- [ ] Criar componente base com textarea
- [ ] Implementar highlight layer
- [ ] Sincronizar scroll
- [ ] Testar paste e edição

### Fase 3: Line Numbers
- [ ] Adicionar coluna de números
- [ ] Sincronizar scroll com editor
- [ ] Estilizar com tema

### Fase 4: Language Detection
- [ ] Integrar flourite no onChange
- [ ] Mostrar linguagem detectada
- [ ] Criar LanguageSelector dropdown

### Fase 5: Integração
- [ ] Substituir CodeEditor atual na homepage
- [ ] Testar com dados de exemplo
- [ ] Verificar acessibilidade

---

## Perguntas em Aberto

1. **Server vs Client**: O highlight deve ser feito no servidor (Server Component com Suspense) ou no cliente (Client Component)?
   - Recomendação: Client Component para edição em tempo real

2. **Performance**: Para código grande (>1000 linhas), deve haver debounce na detecção?
   - Recomendação: Sim, debounce de 300ms

3. **Persistência**: Salvar linguagem selecionada em localStorage?

---

## Notas

- Manter compatibilidade com Shiki já instalado
- Usar tema "vesper" para consistência visual
- Código existente em `src/components/code-editor.tsx` será refatorado
- Não alterar cor de fundo (mantém tema da página)
