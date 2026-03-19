"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";

import { tv } from "tailwind-variants";

import { cn } from "@/lib/utils";

const codeEditorVariants = tv({
  base: "w-full min-h-[200px] bg-background-secondary border border-border-primary rounded-md p-4 font-primary text-sm text-text-primary resize-none focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-text-muted",
});

export interface CodeEditorProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

const CodeEditor = forwardRef<HTMLTextAreaElement, CodeEditorProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(codeEditorVariants({ className }))}
        spellCheck={false}
        {...props}
      />
    );
  }
);

CodeEditor.displayName = "CodeEditor";

export { CodeEditor };
