import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import { IssueCard } from "@/components/ui/issue-card";
import { ScoreRing } from "@/components/ui/score-ring";
import { db, roastFindings, roasts, submissions } from "@/db";

export interface PageProps {
  params: Promise<{ id: string }>;
}

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

export default async function ResultsPage({ params }: PageProps) {
  const { id: submissionId } = await params;

  const submission = await db.query.submissions.findFirst({
    where: (tbl, { eq }) => eq(tbl.id, submissionId),
  });

  if (!submission) {
    notFound();
  }

  const roast = await db.query.roasts.findFirst({
    where: (tbl, { eq }) => eq(tbl.submissionId, submissionId),
  });

  if (!roast) {
    notFound();
  }

  const findings = await db.query.roastFindings.findMany({
    where: (tbl, { eq }) => eq(tbl.roastId, roast.id),
  });

  const lines = submission.code.split("\n").length;
  const diff = roast.diff as {
    from: string;
    to: string;
    lines: Array<{ type: "added" | "removed" | "context"; content: string }>;
  } | null;

  return (
    <main className="min-h-screen bg-bg-page">
      <div className="mx-auto max-w-5xl px-10 py-10">
        <section className="mb-12 flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:gap-12">
          <ScoreRing score={roast.score / 10} />

          <div className="flex flex-1 flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent-red" />
              <span className="font-primary text-sm font-medium uppercase tracking-wide text-accent-red">
                verdict: {roast.verdict}
              </span>
            </div>

            <h1 className="font-secondary text-xl leading-relaxed text-text-primary">
              {roast.feedback}
            </h1>

            <div className="flex items-center gap-4 font-primary text-xs text-text-tertiary">
              <span>lang: {submission.language}</span>
              <span>·</span>
              <span>{lines} lines</span>
            </div>
          </div>
        </section>

        <div className="mb-10 h-px w-full bg-border-primary" />

        <section className="mb-10 flex flex-col gap-4">
          <h2 className="flex items-center gap-2 font-primary text-sm font-bold text-text-primary">
            <span className="text-accent-green">{"//"}</span>
            your_submission
          </h2>
          <div className="overflow-hidden rounded-sm border border-border-primary bg-bg-input">
            <div className="max-h-[424px] overflow-y-auto">
              <CodeBlock
                code={submission.code}
                lang={submission.language}
                showHeader={false}
                showLineNumbers={true}
              />
            </div>
          </div>
        </section>

        <div className="mb-10 h-px w-full bg-border-primary" />

        <section className="mb-10 flex flex-col gap-6">
          <h2 className="flex items-center gap-2 font-primary text-sm font-bold text-text-primary">
            <span className="text-accent-green">{"//"}</span>
            detailed_analysis
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            {findings.map((finding) => (
              <IssueCard
                key={finding.id}
                severity={finding.severity}
                line={finding.line ?? undefined}
                message={finding.message}
                suggestion={finding.suggestion ?? undefined}
              />
            ))}
          </div>
        </section>

        <div className="mb-10 h-px w-full bg-border-primary" />

        <section className="flex flex-col gap-6">
          <h2 className="flex items-center gap-2 font-primary text-sm font-bold text-text-primary">
            <span className="text-accent-green">{"//"}</span>
            suggested_fix
          </h2>

          {diff && diff.lines.length > 0 ? (
            <div className="overflow-hidden rounded-sm border border-border-primary bg-bg-input">
              <div className="flex items-center border-b border-border-primary px-4 py-3">
                <span className="font-primary text-xs font-medium text-text-secondary">
                  {diff.from} → {diff.to}
                </span>
              </div>
              <div className="p-1">
                {diff.lines.map((line) => (
                  <DiffLine
                    key={`${line.type}-${btoa(line.content).slice(0, 20)}`}
                    type={line.type}
                    prefix={line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
                    content={line.content}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-sm border border-border-primary bg-bg-input px-4 py-8 text-center">
              <p className="font-primary text-sm text-text-tertiary">
                No diff available for this code
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
