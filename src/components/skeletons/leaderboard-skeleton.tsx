import { tv } from "tailwind-variants";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const skeletonVariants = tv({
  base: "bg-bg-surface animate-pulse rounded",
});

export function LeaderboardSkeleton() {
  const skeletonRows = Array.from({ length: 20 }, (_, i) => i);

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
            {skeletonRows.map((rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell className={rowIndex < 3 ? "text-accent-amber" : "text-text-secondary"}>
                  <div className={`h-4 w-6 ${skeletonVariants()}`} />
                </TableCell>
                <TableCell className="font-bold">
                  <div className={`h-4 w-8 ${skeletonVariants()}`} />
                </TableCell>
                <TableCell className="font-primary text-xs">
                  <div className="space-y-1">
                    <div
                      className={`h-4 w-${rowIndex % 2 === 0 ? "48" : "40"} ${skeletonVariants()}`}
                    />
                    <div
                      className={`h-4 w-${rowIndex % 3 === 0 ? "32" : "44"} ${skeletonVariants()}`}
                    />
                    {rowIndex % 4 === 0 && <div className={`h-4 w-24 ${skeletonVariants()}`} />}
                  </div>
                </TableCell>
                <TableCell>
                  <div className={`h-4 w-16 ${skeletonVariants()}`} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <p className="mt-4 text-center font-secondary text-xs text-text-tertiary">
        <span className="inline-block">
          <div className={`h-3 w-40 ${skeletonVariants()} inline-block`} />
        </span>
      </p>
    </>
  );
}
