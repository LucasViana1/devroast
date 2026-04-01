import { sql } from "drizzle-orm";
import { roasts, submissions } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "../init";

function normalizeScore(avgSeverity: number): number {
  return Math.max(0, Math.min(10, 10 - ((avgSeverity - 1) / 3) * 10));
}

export const appRouter = createTRPCRouter({
  shame: createTRPCRouter({
    getTopShame: baseProcedure.query(async ({ ctx }) => {
      const totalRoastsResult = await ctx.db.execute<{ count: number }>(
        sql`SELECT COUNT(*) as count FROM ${roasts}`
      );
      const totalRoasts = totalRoastsResult[0]?.count ?? 0;

      const topShameResult = await ctx.db.execute<{
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

      return {
        topThree,
        totalRoasts,
      };
    }),
    getLeaderboard: baseProcedure.query(async ({ ctx }) => {
      const totalRoastsResult = await ctx.db.execute<{ count: number }>(
        sql`SELECT COUNT(*) as count FROM ${roasts}`
      );
      const totalRoasts = totalRoastsResult[0]?.count ?? 0;

      const leaderboardResult = await ctx.db.execute<{
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
          LIMIT 20
        `
      );

      const entries = leaderboardResult.map((row, index) => ({
        rank: index + 1,
        id: row.id,
        code: row.code,
        language: row.language,
        score: row.score / 10,
      }));

      return {
        entries,
        totalRoasts,
      };
    }),
  }),
  stats: createTRPCRouter({
    getGlobal: baseProcedure.query(async ({ ctx }) => {
      const totalResult = await ctx.db.execute<{ count: number }>(
        sql`SELECT COUNT(*) as count FROM ${submissions}`
      );
      const totalSubmissions = totalResult[0]?.count ?? 0;

      const avgResult = await ctx.db.execute<{ avg: number | null }>(
        sql`
          SELECT AVG(
            CASE 
              WHEN severity = 'critical' THEN 1
              WHEN severity = 'error' THEN 2
              WHEN severity = 'warning' THEN 3
              WHEN severity = 'info' THEN 4
              ELSE 3
            END
          ) as avg FROM ${roasts}
        `
      );
      const avgSeverity = avgResult[0]?.avg ?? 3;

      return {
        totalSubmissions,
        avgScore: Math.round(normalizeScore(avgSeverity) * 10) / 10,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
