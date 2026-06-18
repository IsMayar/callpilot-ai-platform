import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Building2, Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateBusinessMutation,
  useGetCurrentBusinessQuery,
  useUpdateBusinessMutation
} from "@/features/business/businessApi";
import type { UpsertBusinessRequest } from "@/features/business/types";
import { cn } from "@/lib/utils";

const industries = [
  "Healthcare",
  "Home services",
  "Legal",
  "Real estate",
  "Financial services",
  "Education",
  "Retail",
  "Hospitality",
  "Technology",
  "Other"
];

const timezones = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Dubai",
  "Asia/Kabul",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Australia/Sydney",
  "UTC"
];

const businessSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Business name must be at least 2 characters.")
    .max(160, "Business name must be 160 characters or fewer."),
  industry: z
    .string()
    .trim()
    .min(2, "Industry is required.")
    .max(100, "Industry must be 100 characters or fewer."),
  phoneNumber: z
    .string()
    .trim()
    .regex(
      /^\+?[0-9 .()-]{7,32}$/,
      "Phone number must contain 7 to 32 valid phone characters."
    ),
  timezone: z
    .string()
    .trim()
    .min(1, "Timezone is required.")
    .max(64, "Timezone must be 64 characters or fewer.")
});

type BusinessFormValues = z.infer<typeof businessSchema>;

const defaultTimezone =
  Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

export function BusinessOnboardingPage() {
  const navigate = useNavigate();
  const {
    data: currentBusiness,
    error: currentBusinessError,
    isFetching: isFetchingCurrentBusiness
  } = useGetCurrentBusinessQuery();
  const [createBusiness, createBusinessState] = useCreateBusinessMutation();
  const [updateBusiness, updateBusinessState] = useUpdateBusinessMutation();

  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: "",
      industry: "",
      phoneNumber: "",
      timezone: timezones.includes(defaultTimezone) ? defaultTimezone : "UTC"
    }
  });

  useEffect(() => {
    if (currentBusiness) {
      form.reset({
        name: currentBusiness.name,
        industry: currentBusiness.industry,
        phoneNumber: currentBusiness.phoneNumber,
        timezone: currentBusiness.timezone
      });
    }
  }, [currentBusiness, form]);

  const isSaving = createBusinessState.isLoading || updateBusinessState.isLoading;
  const saveError = createBusinessState.error ?? updateBusinessState.error;
  const showCurrentBusinessError =
    currentBusinessError && !isNotFoundError(currentBusinessError);

  const onSubmit = form.handleSubmit(async (values) => {
    const body: UpsertBusinessRequest = {
      name: values.name.trim(),
      industry: values.industry.trim(),
      phoneNumber: values.phoneNumber.trim(),
      timezone: values.timezone.trim()
    };

    try {
      if (currentBusiness) {
        await updateBusiness({ id: currentBusiness.id, body }).unwrap();
      } else {
        await createBusiness(body).unwrap();
      }

      navigate("/app/dashboard", { replace: true });
    } catch {
      return;
    }
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-start gap-4">
        <div className="grid size-11 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
          <Building2 className="size-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 space-y-1">
          <h2 className="text-2xl font-semibold tracking-normal">
            Business onboarding
          </h2>
          <p className="text-sm text-muted-foreground">
            Set up the business profile used across CallPilot AI.
          </p>
        </div>
      </div>

      <section className="rounded-lg border bg-card p-6 shadow-sm">
        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              id="business-name"
              label="Business name"
              error={form.formState.errors.name?.message}
            >
              <Input
                id="business-name"
                autoComplete="organization"
                aria-invalid={Boolean(form.formState.errors.name)}
                disabled={isFetchingCurrentBusiness || isSaving}
                {...form.register("name")}
              />
            </Field>

            <Field
              id="industry"
              label="Industry"
              error={form.formState.errors.industry?.message}
            >
              <select
                id="industry"
                className={selectClassName}
                aria-invalid={Boolean(form.formState.errors.industry)}
                disabled={isFetchingCurrentBusiness || isSaving}
                {...form.register("industry")}
              >
                <option value="">Select an industry</option>
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
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
                aria-invalid={Boolean(form.formState.errors.phoneNumber)}
                disabled={isFetchingCurrentBusiness || isSaving}
                {...form.register("phoneNumber")}
              />
            </Field>

            <Field
              id="timezone"
              label="Timezone"
              error={form.formState.errors.timezone?.message}
            >
              <select
                id="timezone"
                className={selectClassName}
                aria-invalid={Boolean(form.formState.errors.timezone)}
                disabled={isFetchingCurrentBusiness || isSaving}
                {...form.register("timezone")}
              >
                {timezones.map((timezone) => (
                  <option key={timezone} value={timezone}>
                    {timezone}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {showCurrentBusinessError ? (
            <AlertMessage message="Unable to load the current business profile." />
          ) : null}

          {saveError ? (
            <AlertMessage message={getApiErrorMessage(saveError)} />
          ) : null}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isFetchingCurrentBusiness || isSaving}
            >
              <Save className="size-4" aria-hidden="true" />
              {isSaving ? "Saving" : "Save business"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
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

function AlertMessage({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}

function isNotFoundError(error: unknown) {
  return isFetchBaseQueryError(error) && error.status === 404;
}

function getApiErrorMessage(error: unknown) {
  if (isFetchBaseQueryError(error)) {
    const data = error.data as { detail?: string; title?: string } | undefined;
    return data?.detail ?? data?.title ?? "Unable to save business.";
  }

  return "Unable to save business.";
}

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === "object" && error !== null && "status" in error;
}

const selectClassName = cn(
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base shadow-sm transition-colors",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
);

