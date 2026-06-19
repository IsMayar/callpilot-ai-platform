import { Badge } from "@/components/ui/badge";
import type { MessageStatus } from "@/features/messages/types";
import { cn } from "@/lib/utils";

const statusStyles: Record<MessageStatus, string> = {
  QUEUED: "border-muted-foreground/20 bg-muted text-muted-foreground",
  SENT: "border-chart-2/20 bg-chart-2/10 text-chart-2",
  FAILED: "border-destructive/20 bg-destructive/10 text-destructive",
  RECEIVED: "border-primary/20 bg-primary/10 text-primary"
};

type MessageStatusBadgeProps = {
  status: MessageStatus;
  className?: string;
};

export function MessageStatusBadge({
  status,
  className
}: MessageStatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn(statusStyles[status], className)}>
      {messageStatusLabel(status)}
    </Badge>
  );
}

function messageStatusLabel(status: MessageStatus) {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}
