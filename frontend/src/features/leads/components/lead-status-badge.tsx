import { Badge } from "@/components/ui/badge";
import { statusLabel } from "@/features/leads/status";
import type { LeadStatus } from "@/features/leads/types";
import { cn } from "@/lib/utils";

const statusStyles: Record<LeadStatus, string> = {
  NEW: "border-primary/20 bg-primary/10 text-primary",
  CONTACTED: "border-chart-3/20 bg-chart-3/10 text-chart-3",
  BOOKED: "border-chart-4/20 bg-chart-4/10 text-chart-4",
  CLOSED: "border-chart-2/20 bg-chart-2/10 text-chart-2",
  LOST: "border-destructive/20 bg-destructive/10 text-destructive"
};

type LeadStatusBadgeProps = {
  status: LeadStatus;
  className?: string;
};

export function LeadStatusBadge({ status, className }: LeadStatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn(statusStyles[status], className)}>
      {statusLabel(status)}
    </Badge>
  );
}
