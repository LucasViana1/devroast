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

export function ShameLeaderboardSkeleton() {
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
            <TableRow>
              <TableCell className="text-accent-amber">1</TableCell>
              <TableCell className="font-bold">
                <div className={`h-4 w-8 ${skeletonVariants()}`} />
              </TableCell>
              <TableCell className="font-primary text-xs">
                <div className="space-y-1">
                  <div className={`h-4 w-48 ${skeletonVariants()}`} />
                  <div className={`h-4 w-36 ${skeletonVariants()}`} />
                  <div className={`h-4 w-24 ${skeletonVariants()}`} />
                </div>
              </TableCell>
              <TableCell>
                <div className={`h-4 w-16 ${skeletonVariants()}`} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-text-secondary">2</TableCell>
              <TableCell className="font-bold">
                <div className={`h-4 w-8 ${skeletonVariants()}`} />
              </TableCell>
              <TableCell className="font-primary text-xs">
                <div className="space-y-1">
                  <div className={`h-4 w-40 ${skeletonVariants()}`} />
                  <div className={`h-4 w-32 ${skeletonVariants()}`} />
                </div>
              </TableCell>
              <TableCell>
                <div className={`h-4 w-16 ${skeletonVariants()}`} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-text-secondary">3</TableCell>
              <TableCell className="font-bold">
                <div className={`h-4 w-8 ${skeletonVariants()}`} />
              </TableCell>
              <TableCell className="font-primary text-xs">
                <div className="space-y-1">
                  <div className={`h-4 w-44 ${skeletonVariants()}`} />
                  <div className={`h-4 w-28 ${skeletonVariants()}`} />
                </div>
              </TableCell>
              <TableCell>
                <div className={`h-4 w-16 ${skeletonVariants()}`} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>

      <p className="mt-4 text-center font-secondary text-xs text-text-tertiary">
        <span className="inline-block">
          <div className={`h-3 w-32 ${skeletonVariants()} inline-block`} />
        </span>
      </p>
    </>
  );
}
