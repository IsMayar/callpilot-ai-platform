import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation
} from "@/features/appointments/appointmentsApi";
import {
  appointmentStatuses,
  appointmentStatusLabel
} from "@/features/appointments/status";
import type {
  Appointment,
  AppointmentRequest
} from "@/features/appointments/types";
import { cn } from "@/lib/utils";

const appointmentFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, "Title must be at least 2 characters.")
      .max(160, "Title must be 160 characters or fewer."),
    description: z
      .string()
      .trim()
      .max(2000, "Description must be 2000 characters or fewer."),
    scheduledStart: z.string().min(1, "Scheduled start is required."),
    scheduledEnd: z.string().min(1, "Scheduled end is required."),
    status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED", "NO_SHOW"]),
    address: z
      .string()
      .trim()
      .max(320, "Address must be 320 characters or fewer.")
  })
  .refine(
    (values) =>
      new Date(values.scheduledEnd).getTime() >
      new Date(values.scheduledStart).getTime(),
    {
      message: "Scheduled end must be after scheduled start.",
      path: ["scheduledEnd"]
    }
  );

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

type AppointmentFormModalProps = {
  appointment?: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AppointmentFormModal({
  appointment,
  open,
  onOpenChange
}: AppointmentFormModalProps) {
  const [createAppointment, createState] = useCreateAppointmentMutation();
  const [updateAppointment, updateState] = useUpdateAppointmentMutation();
  const isEditing = Boolean(appointment);
  const isSaving = createState.isLoading || updateState.isLoading;
  const saveError = createState.error ?? updateState.error;

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: defaultValues()
  });

  useEffect(() => {
    if (open) {
      form.reset(appointment ? valuesFromAppointment(appointment) : defaultValues());
    }
  }, [appointment, form, open]);

  const onSubmit = form.handleSubmit(async (values) => {
    const body: AppointmentRequest = {
      customerId: appointment?.customerId ?? null,
      leadId: appointment?.leadId ?? null,
      title: values.title.trim(),
      description: emptyToNull(values.description),
      scheduledStart: new Date(values.scheduledStart).toISOString(),
      scheduledEnd: new Date(values.scheduledEnd).toISOString(),
      status: values.status,
      address: emptyToNull(values.address)
    };

    try {
      if (appointment) {
        await updateAppointment({ id: appointment.id, body }).unwrap();
      } else {
        await createAppointment(body).unwrap();
      }

      onOpenChange(false);
    } catch {
      return;
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit appointment" : "Create appointment"}
          </DialogTitle>
          <DialogDescription>
            Schedule and manage service appointments for the current business.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="appointment-title"
              label="Title"
              error={form.formState.errors.title?.message}
            >
              <Input
                id="appointment-title"
                disabled={isSaving}
                {...form.register("title")}
              />
            </Field>

            <Field
              id="appointment-status"
              label="Status"
              error={form.formState.errors.status?.message}
            >
              <select
                id="appointment-status"
                className={selectClassName}
                disabled={isSaving}
                {...form.register("status")}
              >
                {appointmentStatuses.map((status) => (
                  <option key={status} value={status}>
                    {appointmentStatusLabel(status)}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              id="scheduled-start"
              label="Scheduled start"
              error={form.formState.errors.scheduledStart?.message}
            >
              <Input
                id="scheduled-start"
                type="datetime-local"
                disabled={isSaving}
                {...form.register("scheduledStart")}
              />
            </Field>

            <Field
              id="scheduled-end"
              label="Scheduled end"
              error={form.formState.errors.scheduledEnd?.message}
            >
              <Input
                id="scheduled-end"
                type="datetime-local"
                disabled={isSaving}
                {...form.register("scheduledEnd")}
              />
            </Field>

            <Field
              id="appointment-address"
              label="Address"
              error={form.formState.errors.address?.message}
            >
              <Input
                id="appointment-address"
                autoComplete="street-address"
                disabled={isSaving}
                {...form.register("address")}
              />
            </Field>
          </div>

          <Field
            id="appointment-description"
            label="Description"
            error={form.formState.errors.description?.message}
          >
            <Textarea
              id="appointment-description"
              disabled={isSaving}
              {...form.register("description")}
            />
          </Field>

          {saveError ? (
            <p role="alert" className="text-sm text-destructive">
              {getApiErrorMessage(saveError)}
            </p>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isSaving}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              <Save className="size-4" aria-hidden="true" />
              {isSaving ? "Saving" : "Save appointment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
};

function Field({ id, label, error, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}

function defaultValues(): AppointmentFormValues {
  const start = new Date();
  start.setMinutes(0, 0, 0);
  start.setHours(start.getHours() + 1);
  const end = new Date(start.getTime() + 60 * 60 * 1000);

  return {
    title: "",
    description: "",
    scheduledStart: toDateTimeLocal(start.toISOString()),
    scheduledEnd: toDateTimeLocal(end.toISOString()),
    status: "SCHEDULED",
    address: ""
  };
}

function valuesFromAppointment(appointment: Appointment): AppointmentFormValues {
  return {
    title: appointment.title,
    description: appointment.description ?? "",
    scheduledStart: toDateTimeLocal(appointment.scheduledStart),
    scheduledEnd: toDateTimeLocal(appointment.scheduledEnd),
    status: appointment.status,
    address: appointment.address ?? ""
  };
}

function toDateTimeLocal(value: string) {
  const date = new Date(value);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);

  return local.toISOString().slice(0, 16);
}

function emptyToNull(value: string) {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function getApiErrorMessage(error: unknown) {
  if (isFetchBaseQueryError(error)) {
    const data = error.data as { detail?: string; title?: string } | undefined;
    return data?.detail ?? data?.title ?? "Unable to save appointment.";
  }

  return "Unable to save appointment.";
}

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === "object" && error !== null && "status" in error;
}

const selectClassName = cn(
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base shadow-sm transition-colors",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
);
