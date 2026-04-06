import { sql } from "drizzle-orm";
import { cacheLife } from "next/cache";
import { db } from "@/db";
import { roasts, submissions } from "@/db/schema";
import { ShameLeaderboardUI } from "./shame-leaderboard-ui";

export default async function ShameLeaderboard() {
  "use cache";
  cacheLife("hours");

  const totalRoastsResult = await db.execute<{ count: number }>(
    sql`SELECT COUNT(*) as count FROM ${roasts}`
  );
  const totalRoasts = totalRoastsResult[0]?.count ?? 0;

  const topShameResult = await db.execute<{
    id: string;
    code: string;
    language: string;
    score: number;
  }>(
    sql`
      SELECT 
        s.id,
        s.code,
        s.language,
        r.score
      FROM ${submissions} s
      INNER JOIN ${roasts} r ON r.submission_id = s.id
      ORDER BY r.score ASC
      LIMIT 3
    `
  );

  const topThree = topShameResult.map((row) => ({
    id: row.id,
    code: row.code,
    language: row.language,
    score: row.score / 10,
  }));

  const data = {
    topThree,
    totalRoasts,
  };

  return <ShameLeaderboardUI data={data} />;
}
