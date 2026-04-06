import { ImageResponse } from "@takumi-rs/image-response";
import { db } from "@/db";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
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
    roast.feedback.length > 100 ? `${roast.feedback.slice(0, 100)}...` : roast.feedback;

  const score = roast.score / 10;
  const scoreStr = score.toFixed(1);

  return new ImageResponse(
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
        <span
          style={{ color: "#10B981", fontSize: 24, fontWeight: 700, fontFamily: "JetBrains Mono" }}
        >
          &gt;
        </span>
        <span
          style={{ color: "#FAFAFA", fontSize: 20, fontWeight: 500, fontFamily: "JetBrains Mono" }}
        >
          devroast
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
        <span
          style={{
            color: "#F59E0B",
            fontSize: 160,
            fontWeight: 900,
            fontFamily: "JetBrains Mono",
            lineHeight: 1,
          }}
        >
          {scoreStr}
        </span>
        <span style={{ color: "#4B5563", fontSize: 56, fontFamily: "JetBrains Mono" }}>/10</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#EF4444" }} />
        <span style={{ color: "#EF4444", fontSize: 20, fontFamily: "JetBrains Mono" }}>
          {roast.verdict}
        </span>
      </div>

      <span style={{ color: "#4B5563", fontSize: 16, fontFamily: "JetBrains Mono" }}>
        lang: {submission.language} · {lines} lines
      </span>

      <span
        style={{
          color: "#FAFAFA",
          fontSize: 22,
          fontFamily: "IBM Plex Mono",
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        "{feedback}"
      </span>
    </div>,
    {
      width: 1200,
      height: 630,
    }
  );
}
