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
  useCreateLeadMutation,
  useUpdateLeadMutation
} from "@/features/leads/leadsApi";
import { leadStatuses, statusLabel } from "@/features/leads/status";
import type { Lead, LeadRequest } from "@/features/leads/types";
import { cn } from "@/lib/utils";

const urgencies = ["Low", "Medium", "High", "Urgent"];

const leadFormSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Customer name must be at least 2 characters.")
    .max(160, "Customer name must be 160 characters or fewer."),
  phoneNumber: z
    .string()
    .trim()
    .regex(
      /^\+?[0-9 .()-]{7,32}$/,
      "Phone number must contain 7 to 32 valid phone characters."
    ),
  email: z
    .string()
    .trim()
    .max(160, "Email must be 160 characters or fewer.")
    .refine(
      (value) => value === "" || z.string().email().safeParse(value).success,
      "Email must be valid."
    ),
  serviceNeeded: z
    .string()
    .trim()
    .min(2, "Service needed is required.")
    .max(160, "Service needed must be 160 characters or fewer."),
  urgency: z
    .string()
    .trim()
    .min(1, "Urgency is required.")
    .max(40, "Urgency must be 40 characters or fewer."),
  status: z.enum(["NEW", "CONTACTED", "BOOKED", "CLOSED", "LOST"]),
  estimatedValue: z
    .string()
    .trim()
    .min(1, "Estimated value is required.")
    .regex(/^\d+(\.\d{1,2})?$/, "Estimated value must be a valid amount."),
  notes: z
    .string()
    .trim()
    .max(2000, "Notes must be 2000 characters or fewer.")
});

type LeadFormValues = z.infer<typeof leadFormSchema>;

type LeadFormModalProps = {
  lead?: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function LeadFormModal({ lead, open, onOpenChange }: LeadFormModalProps) {
  const [createLead, createState] = useCreateLeadMutation();
  const [updateLead, updateState] = useUpdateLeadMutation();
  const isEditing = Boolean(lead);
  const isSaving = createState.isLoading || updateState.isLoading;
  const saveError = createState.error ?? updateState.error;

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: defaultValues()
  });

  useEffect(() => {
    if (open) {
      form.reset(lead ? valuesFromLead(lead) : defaultValues());
    }
  }, [form, lead, open]);

  const onSubmit = form.handleSubmit(async (values) => {
    const body: LeadRequest = {
      customerName: values.customerName.trim(),
      phoneNumber: values.phoneNumber.trim(),
      email: emptyToNull(values.email),
      serviceNeeded: values.serviceNeeded.trim(),
      urgency: values.urgency.trim(),
      status: values.status,
      estimatedValue: Number(values.estimatedValue),
      notes: emptyToNull(values.notes)
    };

    try {
      if (lead) {
        await updateLead({ id: lead.id, body }).unwrap();
      } else {
        await createLead(body).unwrap();
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
          <DialogTitle>{isEditing ? "Edit lead" : "Create lead"}</DialogTitle>
          <DialogDescription>
            Capture lead details for the current business workspace.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="customer-name"
              label="Customer name"
              error={form.formState.errors.customerName?.message}
            >
              <Input
                id="customer-name"
                autoComplete="name"
                disabled={isSaving}
                {...form.register("customerName")}
              />
            </Field>

            <Field
              id="phone-number"
              label="Phone number"
              error={form.formState.errors.phoneNumber?.message}
            >
              <Input
                id="phone-number"
                type="tel"
                autoComplete="tel"
                disabled={isSaving}
                {...form.register("phoneNumber")}
              />
            </Field>

            <Field
              id="email"
              label="Email"
              error={form.formState.errors.email?.message}
            >
              <Input
                id="email"
                type="email"
                autoComplete="email"
                disabled={isSaving}
                {...form.register("email")}
              />
            </Field>

            <Field
              id="service-needed"
              label="Service needed"
              error={form.formState.errors.serviceNeeded?.message}
            >
              <Input
                id="service-needed"
                disabled={isSaving}
                {...form.register("serviceNeeded")}
              />
            </Field>

            <Field
              id="urgency"
              label="Urgency"
              error={form.formState.errors.urgency?.message}
            >
              <select
                id="urgency"
                className={selectClassName}
                disabled={isSaving}
                {...form.register("urgency")}
              >
                {urgencies.map((urgency) => (
                  <option key={urgency} value={urgency}>
                    {urgency}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              id="status"
              label="Status"
              error={form.formState.errors.status?.message}
            >
              <select
                id="status"
                className={selectClassName}
                disabled={isSaving}
                {...form.register("status")}
              >
                {leadStatuses.map((status) => (
                  <option key={status} value={status}>
                    {statusLabel(status)}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              id="estimated-value"
              label="Estimated value"
              error={form.formState.errors.estimatedValue?.message}
            >
              <Input
                id="estimated-value"
                inputMode="decimal"
                disabled={isSaving}
                {...form.register("estimatedValue")}
              />
            </Field>
          </div>

          <Field
            id="notes"
            label="Notes"
            error={form.formState.errors.notes?.message}
          >
            <Textarea id="notes" disabled={isSaving} {...form.register("notes")} />
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
              {isSaving ? "Saving" : "Save lead"}
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

function defaultValues(): LeadFormValues {
  return {
    customerName: "",
    phoneNumber: "",
    email: "",
    serviceNeeded: "",
    urgency: "Medium",
    status: "NEW",
    estimatedValue: "0",
    notes: ""
  };
}

function valuesFromLead(lead: Lead): LeadFormValues {
  return {
    customerName: lead.customerName,
    phoneNumber: lead.phoneNumber,
    email: lead.email ?? "",
    serviceNeeded: lead.serviceNeeded,
    urgency: lead.urgency,
    status: lead.status,
    estimatedValue: String(lead.estimatedValue),
    notes: lead.notes ?? ""
  };
}

function emptyToNull(value: string) {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function getApiErrorMessage(error: unknown) {
  if (isFetchBaseQueryError(error)) {
    const data = error.data as { detail?: string; title?: string } | undefined;
    return data?.detail ?? data?.title ?? "Unable to save lead.";
  }

  return "Unable to save lead.";
}

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === "object" && error !== null && "status" in error;
}

const selectClassName = cn(
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base shadow-sm transition-colors",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
);
