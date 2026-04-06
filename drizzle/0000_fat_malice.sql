CREATE TYPE "public"."roast_mode" AS ENUM('honest', 'roast');--> statement-breakpoint
CREATE TYPE "public"."severity" AS ENUM('info', 'warning', 'error', 'critical');--> statement-breakpoint
CREATE TYPE "public"."submission_language" AS ENUM('javascript', 'typescript', 'python', 'rust', 'go', 'java', 'c', 'cpp', 'csharp', 'ruby', 'php', 'swift', 'kotlin', 'sql', 'html', 'css', 'shell', 'other');--> statement-breakpoint
CREATE TYPE "public"."verdict" AS ENUM('good', 'warning', 'error');--> statement-breakpoint
CREATE TABLE "roast_findings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"roast_id" uuid NOT NULL,
	"severity" "severity" NOT NULL,
	"line" integer,
	"message" text NOT NULL,
	"suggestion" text
);
--> statement-breakpoint
CREATE TABLE "roasts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"verdict" "verdict" NOT NULL,
	"severity" "severity" NOT NULL,
	"score" integer NOT NULL,
	"feedback" text NOT NULL,
	"diff" json,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"language" "submission_language" DEFAULT 'other' NOT NULL,
	"roast_mode" "roast_mode" DEFAULT 'honest' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "roast_findings" ADD CONSTRAINT "roast_findings_roast_id_roasts_id_fk" FOREIGN KEY ("roast_id") REFERENCES "public"."roasts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roasts" ADD CONSTRAINT "roasts_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;