import { type HTMLAttributes } from "react";
import { codeToHtml } from "shiki";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const codeBlockVariants = tv({
  base: "border border-border-primary bg-bg-input overflow-hidden",
  variants: {
    showHeader: {
      true: "",
      false: "",
    },
  },
});

const headerVariants = tv({
  base: "flex items-center h-10 px-4 border-b border-border-primary gap-3",
});

const codeContentVariants = tv({
  base: "font-primary p-4",
  variants: {
    showHeader: {
      true: "",
      false: "py-3.5",
    },
  },
});

export interface CodeBlockProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof codeBlockVariants> {
  code: string;
  lang?: string;
  showLineNumbers?: boolean;
  showHeader?: boolean;
}

export async function CodeBlock({
  code,
  lang = "javascript",
  showLineNumbers = true,
  showHeader = true,
  className,
  ...props
}: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang,
    theme: "vesper",
  });

  const codeLines = code.split("\n");
  const lineNumbers = codeLines.map((_, i) => i + 1);

  return (
    <div className={cn(codeBlockVariants({ showHeader }), className)} {...props}>
      {showHeader && (
        <div className={headerVariants()}>
          <span className="w-2.5 h-2.5 rounded-full bg-accent-red" />
          <span className="w-2.5 h-2.5 rounded-full bg-accent-amber" />
          <span className="w-2.5 h-2.5 rounded-full bg-accent-green" />
          <div className="flex-1" />
          <span className="font-primary text-xs text-text-tertiary">{lang}</span>
        </div>
      )}
      {showLineNumbers && !showHeader && (
        <div className="flex">
          <div className="flex w-10 flex-col items-end border-r border-border-primary bg-surface px-2.5 py-3.5 gap-1.5 font-primary text-[12px] text-text-tertiary">
            {lineNumbers.map((num) => (
              <span key={num}>{num}</span>
            ))}
          </div>
          <div
            className={cn(codeContentVariants({ showHeader }), "flex-1 pl-4")}
            // biome-ignore lint/security/noDangerouslySetInnerHtml: shiki returns safe HTML
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      )}
      {(!showLineNumbers || showHeader) && (
        <div
          className={cn(
            codeContentVariants({ showHeader }),
            showHeader ? "" : "pl-[calc(2.5rem+16px)]"
          )}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: shiki returns safe HTML
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </div>
  );
}
