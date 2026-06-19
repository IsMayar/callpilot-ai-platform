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
  useCreateCustomerMutation,
  useUpdateCustomerMutation
} from "@/features/customers/customersApi";
import type {
  Customer,
  CustomerRequest
} from "@/features/customers/types";

const customerFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters.")
    .max(160, "Full name must be 160 characters or fewer."),
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
  address: z
    .string()
    .trim()
    .max(320, "Address must be 320 characters or fewer."),
  notes: z
    .string()
    .trim()
    .max(2000, "Notes must be 2000 characters or fewer.")
});

type CustomerFormValues = z.infer<typeof customerFormSchema>;

type CustomerFormModalProps = {
  customer?: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CustomerFormModal({
  customer,
  open,
  onOpenChange
}: CustomerFormModalProps) {
  const [createCustomer, createState] = useCreateCustomerMutation();
  const [updateCustomer, updateState] = useUpdateCustomerMutation();
  const isEditing = Boolean(customer);
  const isSaving = createState.isLoading || updateState.isLoading;
  const saveError = createState.error ?? updateState.error;

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: defaultValues()
  });

  useEffect(() => {
    if (open) {
      form.reset(customer ? valuesFromCustomer(customer) : defaultValues());
    }
  }, [customer, form, open]);

  const onSubmit = form.handleSubmit(async (values) => {
    const body: CustomerRequest = {
      fullName: values.fullName.trim(),
      phoneNumber: values.phoneNumber.trim(),
      email: emptyToNull(values.email),
      address: emptyToNull(values.address),
      notes: emptyToNull(values.notes)
    };

    try {
      if (customer) {
        await updateCustomer({ id: customer.id, body }).unwrap();
      } else {
        await createCustomer(body).unwrap();
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
            {isEditing ? "Edit customer" : "Create customer"}
          </DialogTitle>
          <DialogDescription>
            Manage customer contact details for the current business workspace.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="full-name"
              label="Full name"
              error={form.formState.errors.fullName?.message}
            >
              <Input
                id="full-name"
                autoComplete="name"
                disabled={isSaving}
                {...form.register("fullName")}
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
              id="address"
              label="Address"
              error={form.formState.errors.address?.message}
            >
              <Input
                id="address"
                autoComplete="street-address"
                disabled={isSaving}
                {...form.register("address")}
              />
            </Field>
          </div>

          <Field
            id="notes"
            label="Notes"
            error={form.formState.errors.notes?.message}
          >
            <Textarea
              id="notes"
              disabled={isSaving}
              {...form.register("notes")}
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
              {isSaving ? "Saving" : "Save customer"}
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

function defaultValues(): CustomerFormValues {
  return {
    fullName: "",
    phoneNumber: "",
    email: "",
    address: "",
    notes: ""
  };
}

function valuesFromCustomer(customer: Customer): CustomerFormValues {
  return {
    fullName: customer.fullName,
    phoneNumber: customer.phoneNumber,
    email: customer.email ?? "",
    address: customer.address ?? "",
    notes: customer.notes ?? ""
  };
}

function emptyToNull(value: string) {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function getApiErrorMessage(error: unknown) {
  if (isFetchBaseQueryError(error)) {
    const data = error.data as { detail?: string; title?: string } | undefined;
    return data?.detail ?? data?.title ?? "Unable to save customer.";
  }

  return "Unable to save customer.";
}

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === "object" && error !== null && "status" in error;
}

