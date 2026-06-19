import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({
  title,
  description,
  icon: Icon,
  actions,
  className
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="flex min-w-0 items-start gap-4">
        {Icon ? (
          <div className="grid size-11 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
            <Icon className="size-5" aria-hidden="true" />
          </div>
        ) : null}
        <div className="min-w-0 space-y-1">
          <h2 className="truncate text-2xl font-semibold tracking-normal">
            {title}
          </h2>
          {description ? (
            <p className="max-w-3xl text-sm text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
