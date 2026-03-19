import { forwardRef, type HTMLAttributes } from "react";

import { tv } from "tailwind-variants";

import { cn } from "@/lib/utils";

const tableVariants = tv({
  base: "w-full text-left text-sm font-primary",
});

const tableHeaderVariants = tv({
  base: "border-b border-border-primary bg-muted/30",
});

const tableBodyVariants = tv({
  base: "[&_tr:last-child]:border-0",
});

const tableRowVariants = tv({
  base: "border-b border-border-primary transition-colors hover:bg-muted/20",
});

const tableHeadVariants = tv({
  base: "h-9 px-3 text-xs text-text-secondary font-normal",
});

const tableCellVariants = tv({
  base: "p-3 text-text-primary align-middle",
});

export interface TableProps extends HTMLAttributes<HTMLTableElement> {}

const Table = forwardRef<HTMLTableElement, TableProps>(({ className, ...props }, ref) => {
  return (
    <div className="relative w-full overflow-auto">
      <table ref={ref} className={cn(tableVariants({ className }))} {...props} />
    </div>
  );
});

Table.displayName = "Table";

export interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {}

const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }, ref) => {
    return <thead ref={ref} className={cn(tableHeaderVariants({ className }))} {...props} />;
  }
);

TableHeader.displayName = "TableHeader";

export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {}

const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => {
    return <tbody ref={ref} className={cn(tableBodyVariants({ className }))} {...props} />;
  }
);

TableBody.displayName = "TableBody";

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {}

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(({ className, ...props }, ref) => {
  return <tr ref={ref} className={cn(tableRowVariants({ className }))} {...props} />;
});

TableRow.displayName = "TableRow";

export interface TableHeadProps extends HTMLAttributes<HTMLTableCellElement> {}

const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, ...props }, ref) => {
    return <th ref={ref} className={cn(tableHeadVariants({ className }))} {...props} />;
  }
);

TableHead.displayName = "TableHead";

export interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {}

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => {
    return <td ref={ref} className={cn(tableCellVariants({ className }))} {...props} />;
  }
);

TableCell.displayName = "TableCell";

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
