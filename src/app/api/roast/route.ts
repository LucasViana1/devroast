import { NextResponse } from "next/server";
import { db, roastFindings, roasts, submissions } from "@/db";
import { roastModeEnum, submissionLanguageEnum } from "@/db/schema";
import { analyzeCode } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, language, roastMode } = body;

    if (!code || typeof code !== "string" || code.trim() === "") {
      return NextResponse.json({ error: "Code is required and cannot be empty" }, { status: 400 });
    }

    const validLanguage = submissionLanguageEnum.enumValues.includes(language) ? language : "other";
    const validRoastMode = roastModeEnum.enumValues.includes(roastMode) ? roastMode : "honest";

    const analysis = await analyzeCode(code, validLanguage, validRoastMode);

    const result = await db.transaction(async (tx) => {
      const [submission] = await tx
        .insert(submissions)
        .values({
          code,
          language: validLanguage,
          roastMode: validRoastMode,
        })
        .returning();

      const [roast] = await tx
        .insert(roasts)
        .values({
          submissionId: submission.id,
          verdict: analysis.verdict,
          severity: analysis.severity,
          score: analysis.score,
          feedback: analysis.feedback,
          diff: analysis.diff,
        })
        .returning();

      if (analysis.findings && analysis.findings.length > 0) {
        await tx.insert(roastFindings).values(
          analysis.findings.map((finding) => ({
            roastId: roast.id,
            severity: finding.severity,
            line: finding.line,
            message: finding.message,
            suggestion: finding.suggestion,
          }))
        );
      }

      return { submissionId: submission.id };
    });

    return NextResponse.json({ submissionId: result.submissionId });
  } catch (error) {
    console.error("Error in POST /api/roast:", error);
    return NextResponse.json({ error: "Failed to analyze code" }, { status: 500 });
  }
}
