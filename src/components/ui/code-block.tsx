import { codeToHtml } from "shiki";

interface CodeBlockProps {
  code: string;
  lang?: string;
  showLineNumbers?: boolean;
}

export async function CodeBlock({
  code,
  lang = "javascript",
  showLineNumbers = true,
}: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang,
    theme: "vesper",
  });

  return (
    <div className="border border-border-primary bg-bg-input overflow-hidden">
      {showLineNumbers && (
        <div className="flex items-center gap-3 h-10 px-4 border-b border-border-primary">
          <span className="w-2.5 h-2.5 rounded-full bg-accent-red" />
          <span className="w-2.5 h-2.5 rounded-full bg-accent-amber" />
          <span className="w-2.5 h-2.5 rounded-full bg-accent-green" />
          <div className="flex-1" />
          <span className="font-primary text-xs text-text-tertiary">{lang}</span>
        </div>
      )}
      <div
        className="font-primary text-[13px] p-3"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: shiki returns safe HTML
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
