import { Badge } from "@/components/ui/badge";
import { callStatusLabel } from "@/features/calls/status";
import type { CallStatus } from "@/features/calls/types";
import { cn } from "@/lib/utils";

const statusStyles: Record<CallStatus, string> = {
  ANSWERED_BY_AI: "border-primary/20 bg-primary/10 text-primary",
  MISSED: "border-destructive/20 bg-destructive/10 text-destructive",
  VOICEMAIL: "border-chart-3/20 bg-chart-3/10 text-chart-3",
  ESCALATED: "border-chart-4/20 bg-chart-4/10 text-chart-4",
  COMPLETED: "border-chart-2/20 bg-chart-2/10 text-chart-2"
};

type CallStatusBadgeProps = {
  status: CallStatus;
  className?: string;
};

export function CallStatusBadge({ status, className }: CallStatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn(statusStyles[status], className)}>
      {callStatusLabel(status)}
    </Badge>
  );
}
