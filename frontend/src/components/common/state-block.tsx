import type { LucideIcon } from "lucide-react";
import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type StateBlockVariant = "empty" | "error" | "loading" | "info";

type StateBlockProps = {
  title: string;
  description?: string;
  variant?: StateBlockVariant;
  icon?: LucideIcon;
  action?: ReactNode;
  className?: string;
};

const variantStyles: Record<StateBlockVariant, string> = {
  empty: "border-border bg-card text-foreground",
  error: "border-destructive/30 bg-destructive/10 text-destructive",
  loading: "border-border bg-card text-foreground",
  info: "border-border bg-card text-foreground"
};

export function StateBlock({
  title,
  description,
  variant = "info",
  icon,
  action,
  className
}: StateBlockProps) {
  const Icon = icon ?? defaultIcon(variant);

  return (
    <section
      className={cn(
        "rounded-lg border p-8 text-center shadow-sm",
        variantStyles[variant],
        className
      )}
    >
      <Icon
        className={cn(
          "mx-auto size-9",
          variant === "loading" && "animate-spin",
          variant !== "error" && "text-muted-foreground"
        )}
        aria-hidden="true"
      />
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      {description ? (
        <p
          className={cn(
            "mx-auto mt-2 max-w-md text-sm",
            variant === "error" ? "text-destructive" : "text-muted-foreground"
          )}
        >
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </section>
  );
}

function defaultIcon(variant: StateBlockVariant) {
  if (variant === "error") {
    return AlertCircle;
  }

  if (variant === "loading") {
    return Loader2;
  }

  return Inbox;
}
