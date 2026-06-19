import { Badge } from "@/components/ui/badge";
import { appointmentStatusLabel } from "@/features/appointments/status";
import type { AppointmentStatus } from "@/features/appointments/types";
import { cn } from "@/lib/utils";

const statusStyles: Record<AppointmentStatus, string> = {
  SCHEDULED: "border-primary/20 bg-primary/10 text-primary",
  COMPLETED: "border-chart-2/20 bg-chart-2/10 text-chart-2",
  CANCELLED: "border-destructive/20 bg-destructive/10 text-destructive",
  NO_SHOW: "border-chart-4/20 bg-chart-4/10 text-chart-4"
};

type AppointmentStatusBadgeProps = {
  status: AppointmentStatus;
  className?: string;
};

export function AppointmentStatusBadge({
  status,
  className
}: AppointmentStatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn(statusStyles[status], className)}>
      {appointmentStatusLabel(status)}
    </Badge>
  );
}
