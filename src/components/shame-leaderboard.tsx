"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTRPC } from "@/trpc/client";

export function ShameLeaderboard() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.shame.getTopShame.queryOptions());
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const codePreview = (code: string, entryId: string) => {
    const codeLines = code.split("\n");
    const lines = codeLines.slice(0, 3);
    const isExpanded = expandedIds.has(entryId);
    const hasMoreThan3Lines = codeLines.length > 3;

    return (
      <div className="space-y-1">
        {(isExpanded ? codeLines : lines).map((line, lineIndex) => {
          const lineKey = `${entryId}-${line.slice(0, 20).replace(/\s+/g, "-")}-${lineIndex}`;
          return <p key={lineKey}>{line.length > 60 ? `${line.slice(0, 60)}...` : line}</p>;
        })}
        {hasMoreThan3Lines && (
          <Button
            variant="ghost"
            variantSize="link"
            onClick={() => toggleExpand(entryId)}
            className="h-auto p-0 text-xs text-text-secondary hover:text-text-primary"
          >
            {isExpanded ? "ver menos" : "ver mais"}
          </Button>
        )}
      </div>
    );
  };

  return (
    <>
      <Card>
        <Table>
          <TableHeader>
            <TableRow className="bg-bg-surface">
              <TableHead className="w-12">#</TableHead>
              <TableHead className="w-16">score</TableHead>
              <TableHead>code</TableHead>
              <TableHead className="w-24">lang</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.topThree.map((entry, index) => (
              <TableRow key={entry.id}>
                <TableCell className={index === 0 ? "text-accent-amber" : "text-text-secondary"}>
                  {index + 1}
                </TableCell>
                <TableCell className="font-bold text-accent-red">{entry.score}</TableCell>
                <TableCell className="font-primary text-xs">
                  {codePreview(entry.code, entry.id)}
                </TableCell>
                <TableCell className="text-text-secondary">{entry.language}</TableCell>
              </TableRow>
            ))}
            {(!data?.topThree || data.topThree.length === 0) && (
              <TableRow>
                <TableCell className="text-center text-text-tertiary py-8">
                  no roasts yet. be the first to be shamed!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <p className="mt-4 text-center font-secondary text-xs text-text-tertiary">
        showing top 3 of {data?.totalRoasts.toLocaleString() ?? 0} roasts ·{" "}
        <Link href="/leaderboard" className="text-text-secondary hover:underline">
          view full leaderboard &gt;&gt;
        </Link>
      </p>
    </>
  );
}
