import { Switch } from "@base-ui/react/switch";

import { cn } from "@/lib/utils";

interface ToggleProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
  className?: string;
}

const sizes = {
  sm: { track: "w-8 h-3 p-0.5", thumb: "w-2.5 h-2.5" },
  md: { track: "w-10 h-[22px] p-[3px]", thumb: "w-4 h-4" },
  lg: { track: "w-12 h-6 p-1", thumb: "w-4 h-4" },
};

export function Toggle({
  checked,
  defaultChecked,
  onChange,
  size = "md",
  children,
  className,
}: ToggleProps) {
  return (
    <Switch.Root
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={onChange}
      className={cn("inline-flex items-center gap-3 font-primary cursor-pointer", className)}
    >
      <div
        className={cn(
          "relative rounded-full transition-colors",
          sizes[size].track,
          checked ? "bg-accent-green" : "bg-border-primary"
        )}
      >
        <Switch.Thumb
          className={cn(
            "block rounded-full transition-transform",
            sizes[size].thumb,
            checked ? "translate-x-full bg-zinc-950" : "translate-x-0 bg-gray-500"
          )}
        />
      </div>
      {children && (
        <span className={cn(checked ? "text-accent-green" : "text-text-secondary")}>
          {children}
        </span>
      )}
    </Switch.Root>
  );
}
