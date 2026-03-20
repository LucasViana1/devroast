import type { Metadata } from "next";

import { CodeBlock } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import { IssueCard } from "@/components/ui/issue-card";
import { ScoreRing } from "@/components/ui/score-ring";

export interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Roast Result ${id} | devroast`,
    description: "See how your code got roasted",
  };
}

const mockData = {
  score: 3.5,
  verdict: "needs_serious_help",
  quote: '"this code looks like it was written during a power outage... in 2005."',
  language: "javascript",
  lines: 7,
  code: `var total = 0;
for (var i = 0; i < items.length; i++) {
  total = total + items[i].price;
  console.log("Item " + i);
}
document.write(total);`,
  issues: [
    {
      id: 1,
      severity: "error" as const,
      line: 1,
      message: "Using 'var' instead of 'const' or 'let'",
      suggestion: "Use const for values that won't change, let for mutable values",
    },
    {
      id: 2,
      severity: "error" as const,
      line: 2,
      message: "Unnecessary loop complexity",
      suggestion: "Consider using reduce() for aggregation operations",
    },
    {
      id: 3,
      severity: "warning" as const,
      line: 3,
      message: "Console.log in production code",
      suggestion: "Remove or replace with a proper logging solution",
    },
    {
      id: 4,
      severity: "critical" as const,
      line: 5,
      message: "Using document.write() is dangerous and deprecated",
      suggestion: "Use document.getElementById() and textContent instead",
    },
  ],
  diff: {
    from: "your_code.js",
    to: "improved_code.js",
    lines: [
      { type: "context" as const, content: "const items = [...];" },
      { type: "removed" as const, content: "var total = 0;" },
      { type: "removed" as const, content: "for (var i = 0; i < items.length; i++) {" },
      { type: "removed" as const, content: "  total = total + items[i].price;" },
      { type: "removed" as const, content: "  console.log('Item ' + i);" },
      { type: "removed" as const, content: "}" },
      { type: "added" as const, content: "const total = items.reduce((sum, item) => {" },
      { type: "added" as const, content: "  console.log('Processing item ' + item.name);" },
      { type: "added" as const, content: "  return sum + item.price;" },
      { type: "added" as const, content: "}, 0);" },
      { type: "context" as const, content: "// Use a proper DOM update method" },
    ],
  },
};

export default async function ResultsPage({ params }: PageProps) {
  const { id: submissionId } = await params;

  void submissionId;

  return (
    <main className="min-h-screen bg-bg-page">
      <div className="mx-auto max-w-5xl px-10 py-10">
        <section className="mb-12 flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:gap-12">
          <ScoreRing score={mockData.score} />

          <div className="flex flex-1 flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent-red" />
              <span className="font-primary text-sm font-medium uppercase tracking-wide text-accent-red">
                verdict: {mockData.verdict}
              </span>
            </div>

            <h1 className="font-secondary text-xl leading-relaxed text-text-primary">
              {mockData.quote}
            </h1>

            <div className="flex items-center gap-4 font-primary text-xs text-text-tertiary">
              <span>lang: {mockData.language}</span>
              <span>·</span>
              <span>{mockData.lines} lines</span>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                className="flex items-center gap-2 rounded-sm border border-border-primary bg-transparent px-4 py-2 font-primary text-xs uppercase tracking-wider text-text-secondary transition-colors hover:border-border-primary hover:bg-surface"
              >
                share
              </button>
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
                code={mockData.code}
                lang={mockData.language}
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
            {mockData.issues.map((issue) => (
              <IssueCard
                key={issue.id}
                severity={issue.severity}
                line={issue.line}
                message={issue.message}
                suggestion={issue.suggestion}
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

          <div className="overflow-hidden rounded-sm border border-border-primary bg-bg-input">
            <div className="flex items-center border-b border-border-primary px-4 py-3">
              <span className="font-primary text-xs font-medium text-text-secondary">
                {mockData.diff.from} → {mockData.diff.to}
              </span>
            </div>
            <div className="p-1">
              {mockData.diff.lines.map((line) => (
                <DiffLine
                  key={`${line.type}-${line.content.substring(0, 15)}`}
                  type={line.type}
                  prefix={line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
                  content={line.content}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
