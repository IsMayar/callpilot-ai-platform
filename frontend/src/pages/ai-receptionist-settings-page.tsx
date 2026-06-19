import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bot, Building2, Save } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { PageHeader } from "@/components/common/page-header";
import { StateBlock } from "@/components/common/state-block";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetAiConfigQuery,
  useUpdateAiConfigMutation
} from "@/features/ai-config/aiConfigApi";
import type { AiReceptionistConfigRequest } from "@/features/ai-config/types";

const aiConfigSchema = z.object({
  greetingMessage: z
    .string()
    .trim()
    .min(10, "Greeting message must be at least 10 characters.")
    .max(1000, "Greeting message must be 1000 characters or fewer."),
  afterHoursMessage: z
    .string()
    .trim()
    .min(10, "After-hours message must be at least 10 characters.")
    .max(1000, "After-hours message must be 1000 characters or fewer."),
  emergencyInstructions: z
    .string()
    .trim()
    .min(10, "Emergency instructions must be at least 10 characters.")
    .max(2000, "Emergency instructions must be 2000 characters or fewer."),
  bookingRules: z
    .string()
    .trim()
    .min(10, "Booking rules must be at least 10 characters.")
    .max(4000, "Booking rules must be 4000 characters or fewer."),
  servicesOffered: z
    .string()
    .trim()
    .min(2, "Services offered are required.")
    .max(4000, "Services offered must be 4000 characters or fewer."),
  fallbackPhoneNumber: z
    .string()
    .trim()
    .max(32, "Fallback phone number must be 32 characters or fewer.")
    .refine(
      (value) => value === "" || /^\+?[0-9 .()-]{7,32}$/.test(value),
      "Fallback phone number must contain 7 to 32 valid phone characters."
    )
});

type AiConfigFormValues = z.infer<typeof aiConfigSchema>;

export function AiReceptionistSettingsPage() {
  const { data: config, error, isFetching } = useGetAiConfigQuery();
  const [updateAiConfig, updateState] = useUpdateAiConfigMutation();
  const needsBusinessSetup = isNotFoundError(error);

  const form = useForm<AiConfigFormValues>({
    resolver: zodResolver(aiConfigSchema),
    defaultValues: defaultValues()
  });

  useEffect(() => {
    if (config) {
      form.reset({
        greetingMessage: config.greetingMessage,
        afterHoursMessage: config.afterHoursMessage,
        emergencyInstructions: config.emergencyInstructions,
        bookingRules: config.bookingRules,
        servicesOffered: config.servicesOffered,
        fallbackPhoneNumber: config.fallbackPhoneNumber ?? ""
      });
    }
  }, [config, form]);

  const isSaving = updateState.isLoading;

  const onSubmit = form.handleSubmit(async (values) => {
    const body: AiReceptionistConfigRequest = {
      greetingMessage: values.greetingMessage.trim(),
      afterHoursMessage: values.afterHoursMessage.trim(),
      emergencyInstructions: values.emergencyInstructions.trim(),
      bookingRules: values.bookingRules.trim(),
      servicesOffered: values.servicesOffered.trim(),
      fallbackPhoneNumber: emptyToNull(values.fallbackPhoneNumber)
    };

    try {
      await updateAiConfig(body).unwrap();
    } catch {
      return;
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Settings"
        description="Tune how the receptionist greets callers, handles urgent requests, and captures bookings."
        icon={Bot}
        actions={
          <Button
            type="submit"
            form="ai-config-form"
            disabled={isFetching || isSaving || needsBusinessSetup}
          >
            <Save className="size-4" aria-hidden="true" />
            {isSaving ? "Saving" : "Save settings"}
          </Button>
        }
      />

      {needsBusinessSetup ? (
        <StateBlock
          title="Business setup required"
          description="Complete your business profile before configuring the AI receptionist."
          action={
            <Button asChild>
              <Link to="/app/onboarding/business">
                <Building2 className="size-4" aria-hidden="true" />
                Set up business
              </Link>
            </Button>
          }
        />
      ) : null}

      {error && !needsBusinessSetup ? (
        <StateBlock
          variant="error"
          title="Unable to load AI settings"
          description="Refresh the page or try again in a moment."
        />
      ) : null}

      {isFetching && !config ? (
        <section className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="grid gap-5 lg:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-28 animate-pulse rounded-md bg-muted" />
            ))}
          </div>
        </section>
      ) : null}

      {config ? (
        <section className="rounded-lg border bg-card p-6 shadow-sm">
          <form id="ai-config-form" className="space-y-5" onSubmit={onSubmit}>
            <div className="grid gap-5 lg:grid-cols-2">
              <Field
                id="greeting-message"
                label="Greeting message"
                error={form.formState.errors.greetingMessage?.message}
              >
                <Textarea
                  id="greeting-message"
                  className="min-h-32"
                  disabled={isSaving}
                  {...form.register("greetingMessage")}
                />
              </Field>

              <Field
                id="after-hours-message"
                label="After-hours message"
                error={form.formState.errors.afterHoursMessage?.message}
              >
                <Textarea
                  id="after-hours-message"
                  className="min-h-32"
                  disabled={isSaving}
                  {...form.register("afterHoursMessage")}
                />
              </Field>

              <Field
                id="emergency-instructions"
                label="Emergency instructions"
                error={form.formState.errors.emergencyInstructions?.message}
              >
                <Textarea
                  id="emergency-instructions"
                  className="min-h-36"
                  disabled={isSaving}
                  {...form.register("emergencyInstructions")}
                />
              </Field>

              <Field
                id="booking-rules"
                label="Booking rules"
                error={form.formState.errors.bookingRules?.message}
              >
                <Textarea
                  id="booking-rules"
                  className="min-h-36"
                  disabled={isSaving}
                  {...form.register("bookingRules")}
                />
              </Field>

              <Field
                id="services-offered"
                label="Services offered"
                error={form.formState.errors.servicesOffered?.message}
              >
                <Textarea
                  id="services-offered"
                  className="min-h-32"
                  disabled={isSaving}
                  {...form.register("servicesOffered")}
                />
              </Field>

              <Field
                id="fallback-phone-number"
                label="Fallback phone number"
                error={form.formState.errors.fallbackPhoneNumber?.message}
              >
                <Input
                  id="fallback-phone-number"
                  type="tel"
                  autoComplete="tel"
                  disabled={isSaving}
                  {...form.register("fallbackPhoneNumber")}
                />
              </Field>
            </div>

            {updateState.error ? (
              <p role="alert" className="text-sm text-destructive">
                {getApiErrorMessage(updateState.error)}
              </p>
            ) : null}
          </form>
        </section>
      ) : null}
    </div>
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

function defaultValues(): AiConfigFormValues {
  return {
    greetingMessage: "",
    afterHoursMessage: "",
    emergencyInstructions: "",
    bookingRules: "",
    servicesOffered: "",
    fallbackPhoneNumber: ""
  };
}

function emptyToNull(value: string) {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function getApiErrorMessage(error: unknown) {
  if (isFetchBaseQueryError(error)) {
    const data = error.data as { detail?: string; title?: string } | undefined;
    return data?.detail ?? data?.title ?? "Unable to save AI settings.";
  }

  return "Unable to save AI settings.";
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
