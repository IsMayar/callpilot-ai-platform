import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Building2, CalendarDays, Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { AppointmentFormModal } from "@/features/appointments/components/appointment-form-modal";
import { AppointmentStatusBadge } from "@/features/appointments/components/appointment-status-badge";
import {
  useDeleteAppointmentMutation,
  useGetAppointmentsQuery
} from "@/features/appointments/appointmentsApi";
import {
  appointmentStatuses,
  appointmentStatusLabel
} from "@/features/appointments/status";
import type {
  Appointment,
  AppointmentStatus
} from "@/features/appointments/types";
import { cn } from "@/lib/utils";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short"
});

export function AppointmentsPage() {
  const [status, setStatus] = useState<AppointmentStatus | "ALL">("ALL");
  const [page, setPage] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const pageSize = 10;

  const { data, error, isFetching } = useGetAppointmentsQuery({
    status: status === "ALL" ? undefined : status,
    page,
    size: pageSize
  });
  const [deleteAppointment, deleteState] = useDeleteAppointmentMutation();

  useEffect(() => {
    setPage(0);
  }, [status]);

  const appointments = data?.content ?? [];
  const needsBusinessSetup = isNotFoundError(error);
  const isEmpty = !isFetching && !error && appointments.length === 0;

  const handleDelete = async (appointment: Appointment) => {
    if (!window.confirm(`Delete ${appointment.title}?`)) {
      return;
    }

    await deleteAppointment(appointment.id).unwrap();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-normal">
            Appointments
          </h2>
          <p className="text-sm text-muted-foreground">
            Schedule and manage booked service appointments.
          </p>
        </div>

        {needsBusinessSetup ? (
          <Button asChild>
            <Link to="/app/onboarding/business">
              <Building2 className="size-4" aria-hidden="true" />
              Set up business
            </Link>
          </Button>
        ) : (
          <Button type="button" onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" aria-hidden="true" />
            New appointment
          </Button>
        )}
      </div>

      <section className="rounded-lg border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center lg:justify-end">
          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as AppointmentStatus | "ALL")
            }
            className={selectClassName}
            aria-label="Filter appointments by status"
          >
            <option value="ALL">All statuses</option>
            {appointmentStatuses.map((appointmentStatus) => (
              <option key={appointmentStatus} value={appointmentStatus}>
                {appointmentStatusLabel(appointmentStatus)}
              </option>
            ))}
          </select>
        </div>

        {needsBusinessSetup ? (
          <div className="p-10 text-center">
            <h3 className="text-base font-semibold">Business setup required</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Complete your business profile before creating appointments.
            </p>
            <Button asChild className="mt-5">
              <Link to="/app/onboarding/business">
                <Building2 className="size-4" aria-hidden="true" />
                Set up business
              </Link>
            </Button>
          </div>
        ) : null}

        {error && !needsBusinessSetup ? (
          <div className="p-8 text-center">
            <h3 className="text-base font-semibold">Unable to load appointments</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Refresh the page or try again in a moment.
            </p>
          </div>
        ) : null}

        {isFetching && !data ? <LoadingRows /> : null}

        {isEmpty ? (
          <div className="p-10 text-center">
            <CalendarDays
              className="mx-auto size-10 text-muted-foreground"
              aria-hidden="true"
            />
            <h3 className="mt-4 text-base font-semibold">No appointments found</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Create an appointment or adjust the status filter.
            </p>
            <Button
              type="button"
              className="mt-5"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="size-4" aria-hidden="true" />
              Create appointment
            </Button>
          </div>
        ) : null}

        {appointments.length > 0 ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="w-32 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{appointment.title}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {appointment.description ?? "No description"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-0 text-sm">
                        <p className="truncate">
                          {dateFormatter.format(new Date(appointment.scheduledStart))}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          Ends {dateFormatter.format(new Date(appointment.scheduledEnd))}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <AppointmentStatusBadge status={appointment.status} />
                    </TableCell>
                    <TableCell className="max-w-64 truncate">
                      {appointment.address ?? "No address"}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="Edit appointment"
                          onClick={() => setEditingAppointment(appointment)}
                        >
                          <Edit className="size-4" aria-hidden="true" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="Delete appointment"
                          disabled={deleteState.isLoading}
                          onClick={() => void handleDelete(appointment)}
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex flex-col gap-3 border-t p-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <p>
                Showing page {(data?.number ?? 0) + 1} of {Math.max(data?.totalPages ?? 1, 1)}.
                Total appointments: {data?.totalElements ?? 0}.
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={data?.first ?? true}
                  onClick={() => setPage((current) => Math.max(current - 1, 0))}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={data?.last ?? true}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </section>

      <AppointmentFormModal open={createOpen} onOpenChange={setCreateOpen} />
      <AppointmentFormModal
        appointment={editingAppointment}
        open={Boolean(editingAppointment)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingAppointment(null);
          }
        }}
      />
    </div>
  );
}

function LoadingRows() {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="h-14 animate-pulse rounded-md bg-muted" />
      ))}
    </div>
  );
}

function isNotFoundError(error: unknown) {
  return (
    isFetchBaseQueryError(error) &&
    (error.status === 404 ||
      ("originalStatus" in error && error.originalStatus === 404))
  );
}

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === "object" && error !== null && "status" in error;
}

const selectClassName = cn(
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base shadow-sm transition-colors",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:w-56 md:text-sm"
);
