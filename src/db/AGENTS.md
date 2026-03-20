# Padrões para Banco de Dados (Drizzle ORM)

## Visão Geral

Este documento estabelece os padrões para criação e manipulação do banco de dados.

## Estrutura de Arquivos

```
src/db/
├── index.ts          # Conexão e instância do db
├── schema.ts         # Definições das tabelas
├── seed.ts           # Script de seed para desenvolvimento
└── AGENTS.md         # Este arquivo
```

## Schema

### 1. Estrutura de Tabelas

Use enums do Drizzle para valores pré-definidos.

```typescript
import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

// Enum para roast mode
export const roastModeEnum = pgEnum("roast_mode", ["honest", "roast"]);

// Tabela submissions
export const submissions = pgTable("submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").notNull(),
  language: submissionLanguageEnum("language").notNull().default("other"),
  roastMode: roastModeEnum("roast_mode").notNull().default("honest"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

### 2. Relacionamentos

Use `references()` com `onDelete: "cascade"` para chaves estrangeiras.

```typescript
export const roasts = pgTable("roasts", {
  id: uuid("id").defaultRandom().primaryKey(),
  submissionId: uuid("submission_id")
    .notNull()
    .references(() => submissions.id, { onDelete: "cascade" }),
  verdict: verdictEnum("verdict").notNull(),
  severity: severityEnum("severity").notNull(),
  feedback: text("feedback").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

### 3. Tipos Inferidos

Exporte tipos inferidos do schema para uso na aplicação.

```typescript
export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;
export type Roast = typeof roasts.$inferSelect;
export type NewRoast = typeof roasts.$inferInsert;
```

## Conexão com o Banco

### 1. Instância Global

Use uma instância global para evitar múltiplas conexões em desenvolvimento.

```typescript
// src/db/index.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const client = postgres(connectionString);
export const db = drizzle(client, { schema });

export * from "./schema";
```

## Scripts de Seed

### 1. Script de Seed Manual

Prefira criar inserts manuais ao invés de usar bibliotecas de seed.

```typescript
// src/db/seed.ts
import "dotenv/config";
import { db, submissions, roasts, roastFindings } from "./index";

async function seed() {
  console.log("🌱 Starting seed...");

  // Limpar dados existentes
  await db.delete(roastFindings);
  await db.delete(roasts);
  await db.delete(submissions);

  // Inserir submissions
  const [submission] = await db
    .insert(submissions)
    .values({
      code: "const x = 1;",
      language: "javascript",
      roastMode: "roast",
    })
    .returning();

  // Inserir roasts
  const [roast] = await db
    .insert(roasts)
    .values({
      submissionId: submission.id,
      verdict: "error",
      severity: "critical",
      feedback: "This code is terrible!",
    })
    .returning();

  console.log("✅ Seed completed!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
```

### 2. Comando npm

Adicione o script no `package.json`.

```json
{
  "scripts": {
    "db:seed": "tsx src/db/seed.ts"
  }
}
```

## Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run db:docker:start` | Inicia container Docker do PostgreSQL |
| `npm run db:docker:stop` | Para container Docker |
| `npm run db:generate` | Gera migrations do Drizzle Kit |
| `npm run db:migrate` | Executa migrations pendentes |
| `npm run db:push` | Push schema direto no banco (desenvolvimento) |
| `npm run db:studio` | Abre Drizzle Studio |
| `npm run db:setup` | Inicia Docker + push schema |
| `npm run db:seed` | Executa script de seed |

## Checklist de Seed

- [ ] Limpar tabelas em ordem reversa de dependência
- [ ] Usar `.returning()` para obter IDs gerados
- [ ] Fazer `process.exit(0)` no sucesso
- [ ] Fazer `process.exit(1)` no erro
- [ ] Carregar `.env` com `dotenv/config` no início
- [ ] Usar `tsx` para executar o script
