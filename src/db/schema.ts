import { integer, json, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const roastModeEnum = pgEnum("roast_mode", ["honest", "roast"]);

export const submissionLanguageEnum = pgEnum("submission_language", [
  "javascript",
  "typescript",
  "python",
  "rust",
  "go",
  "java",
  "c",
  "cpp",
  "csharp",
  "ruby",
  "php",
  "swift",
  "kotlin",
  "sql",
  "html",
  "css",
  "shell",
  "other",
]);

export const verdictEnum = pgEnum("verdict", ["good", "warning", "error"]);

export const severityEnum = pgEnum("severity", ["info", "warning", "error", "critical"]);

export const submissions = pgTable("submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").notNull(),
  language: submissionLanguageEnum("language").notNull().default("other"),
  roastMode: roastModeEnum("roast_mode").notNull().default("honest"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const roasts = pgTable("roasts", {
  id: uuid("id").defaultRandom().primaryKey(),
  submissionId: uuid("submission_id")
    .notNull()
    .references(() => submissions.id, { onDelete: "cascade" }),
  verdict: verdictEnum("verdict").notNull(),
  severity: severityEnum("severity").notNull(),
  score: integer("score").notNull(),
  feedback: text("feedback").notNull(),
  diff: json("diff"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const roastFindings = pgTable("roast_findings", {
  id: uuid("id").defaultRandom().primaryKey(),
  roastId: uuid("roast_id")
    .notNull()
    .references(() => roasts.id, { onDelete: "cascade" }),
  severity: severityEnum("severity").notNull(),
  line: integer("line"),
  message: text("message").notNull(),
  suggestion: text("suggestion"),
});

export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;

export type Roast = typeof roasts.$inferSelect;
export type NewRoast = typeof roasts.$inferInsert;

export type RoastFinding = typeof roastFindings.$inferSelect;
export type NewRoastFinding = typeof roastFindings.$inferInsert;
