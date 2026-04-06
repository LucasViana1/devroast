# Open Graph Images Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Gerar Open Graph images automaticamente para resultados de roast compartilhados via link

**Architecture:** API route `/api/og/[id]` usando Takumi para renderizar imagens OG baseadas no design do frame "Screen 4 - OG Image". Metadata da página aponta para a rota de imagem.

**Tech Stack:** Takumi (takumi-js), Next.js App Router, Drizzle ORM

---

### Task 1: Instalar dependência Takumi

**Files:**
- Modify: `package.json` (adicionar dependência)

- [ ] **Step 1: Instalar takumi-js**

```bash
npm install takumi-js
```

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add takumi-js dependency"
```

---

### Task 2: Configurar next.config.ts

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Adicionar serverExternalPackages ao config**

Abra o arquivo `next.config.ts` e adicione:

```typescript
const config: NextConfig = {
  serverExternalPackages: ["@takumi-rs/core"],
  // ...outras configurações existentes
};
```

- [ ] **Step 2: Commit**

```bash
git add next.config.ts
git commit -m "feat: configure Takumi as external package"
```

---

### Task 3: Criar API route para OG image

**Files:**
- Create: `src/app/api/og/[id]/route.ts`
- Modify: `src/trpc/routers/_app.ts` (verificar queries disponíveis para busca de roast)

- [ ] **Step 1: Criar diretório e arquivo da route**

Criar: `src/app/api/og/[id]/route.ts`

```typescript
import { ImageResponse } from "takumi-js/response";
import { db, roastFindings, roasts, submissions } from "@/db";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const submission = await db.query.submissions.findFirst({
    where: (tbl, { eq }) => eq(tbl.id, id),
  });

  if (!submission) {
    return new Response("Not found", { status: 404 });
  }

  const roast = await db.query.roasts.findFirst({
    where: (tbl, { eq }) => eq(tbl.submissionId, id),
  });

  if (!roast) {
    return new Response("Not found", { status: 404 });
  }

  const lines = submission.code.split("\n").length;
  const feedback =
    roast.feedback.length > 100
      ? roast.feedback.slice(0, 100) + "..."
      : roast.feedback;

  const score = roast.score / 10;
  const scoreStr = score.toFixed(1);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#0A0A0A",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 28,
          padding: 64,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#10B981", fontSize: 24, fontWeight: 700, fontFamily: "JetBrains Mono" }}>&gt;</span>
          <span style={{ color: "#FAFAFA", fontSize: 20, fontWeight: 500, fontFamily: "JetBrains Mono" }}>devroast</span>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
          <span style={{ color: "#F59E0B", fontSize: 160, fontWeight: 900, fontFamily: "JetBrains Mono", lineHeight: 1 }}>
            {scoreStr}
          </span>
          <span style={{ color: "#4B5563", fontSize: 56, fontFamily: "JetBrains Mono" }}>/10</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#EF4444" }} />
          <span style={{ color: "#EF4444", fontSize: 20, fontFamily: "JetBrains Mono" }}>{roast.verdict}</span>
        </div>

        <span style={{ color: "#4B5563", fontSize: 16, fontFamily: "JetBrains Mono" }}>
          lang: {submission.language} · {lines} lines
        </span>

        <span style={{ color: "#FAFAFA", fontSize: 22, fontFamily: "IBM Plex Mono", textAlign: "center", lineHeight: 1.5 }}>
          "{feedback}"
        </span>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      emoji: "twemoji",
    }
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/og/\[id\]/route.ts
git commit -m "feat: add OG image generation API route"
```

---

### Task 4: Atualizar generateMetadata na página de results

**Files:**
- Modify: `src/app/results/[id]/page.tsx`

- [ ] **Step 1: Adicionar openGraph ao generateMetadata**

Modificar a função `generateMetadata` existente para adicionar:

```typescript
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
  
  return {
    title: `Roast Result ${id} | devroast`,
    description: "See how your code got roasted",
    openGraph: {
      images: [`${baseUrl}/api/og/${id}`],
    },
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/results/\[id\]/page.tsx
git commit -m "feat: link OG image in metadata"
```

---

### Task 5: Validar implementação

**Files:**
- N/A

- [ ] **Step 1: Rodar lint**

```bash
npm run lint
```

- [ ] **Step 2: Testar a rota**

Iniciar o servidor e testar:
```bash
npm run dev
# Abrir http://localhost:3000/api/og/[id] no navegador
```

- [ ] **Step 3: Commit final**

```bash
git add .
git commit -m "feat: complete OG image generation"
```
