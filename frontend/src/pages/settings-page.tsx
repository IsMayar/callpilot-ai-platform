import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LucideIcon } from "lucide-react";
import { Bell, Building2, Lock, Save, Settings, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useAppSelector } from "@/app/hooks";
import { PageHeader } from "@/components/common/page-header";
import { StateBlock } from "@/components/common/state-block";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { selectAuthUser } from "@/features/auth/authSlice";
import {
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

export function SettingsPage() {
  const user = useAppSelector(selectAuthUser);
  const {
    data: currentBusiness,
    error: currentBusinessError,
    isFetching
  } = useGetCurrentBusinessQuery();
  const [updateBusiness, updateBusinessState] = useUpdateBusinessMutation();
  const needsBusinessSetup = isNotFoundError(currentBusinessError);

  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: "",
      industry: "",
      phoneNumber: "",
      timezone: "UTC"
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

  const onSubmit = form.handleSubmit(async (values) => {
    if (!currentBusiness) {
      return;
    }

    const body: UpsertBusinessRequest = {
      name: values.name.trim(),
      industry: values.industry.trim(),
      phoneNumber: values.phoneNumber.trim(),
      timezone: values.timezone.trim()
    };

    try {
      await updateBusiness({ id: currentBusiness.id, body }).unwrap();
    } catch {
      return;
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage account details, business profile, security placeholders, and notification preferences."
        icon={Settings}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,0.55fr)]">
        <div className="space-y-6">
          <SettingsSection
            icon={UserRound}
            title="Profile"
            description="Signed-in user details for this workspace."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="profile-name" label="Name">
                <Input id="profile-name" value={user?.name ?? "Demo Admin"} readOnly />
              </Field>
              <Field id="profile-email" label="Email">
                <Input
                  id="profile-email"
                  value={user?.email ?? "admin@callpilot.ai"}
                  readOnly
                />
              </Field>
            </div>
          </SettingsSection>

          <SettingsSection
            icon={Building2}
            title="Business"
            description="Core business details used across AI, routing, and reporting."
          >
            {needsBusinessSetup ? (
              <StateBlock
                title="Business setup required"
                description="Complete onboarding before editing business settings."
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

            {currentBusinessError && !needsBusinessSetup ? (
              <StateBlock
                variant="error"
                title="Unable to load business settings"
                description="Refresh the page or try again in a moment."
              />
            ) : null}

            {isFetching && !currentBusiness ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-20 animate-pulse rounded-md bg-muted" />
                ))}
              </div>
            ) : null}

            {currentBusiness ? (
              <form className="space-y-5" onSubmit={onSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    id="settings-business-name"
                    label="Business name"
                    error={form.formState.errors.name?.message}
                  >
                    <Input
                      id="settings-business-name"
                      autoComplete="organization"
                      disabled={updateBusinessState.isLoading}
                      {...form.register("name")}
                    />
                  </Field>

                  <Field
                    id="settings-industry"
                    label="Industry"
                    error={form.formState.errors.industry?.message}
                  >
                    <select
                      id="settings-industry"
                      className={selectClassName}
                      disabled={updateBusinessState.isLoading}
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
                    id="settings-phone"
                    label="Phone number"
                    error={form.formState.errors.phoneNumber?.message}
                  >
                    <Input
                      id="settings-phone"
                      type="tel"
                      autoComplete="tel"
                      disabled={updateBusinessState.isLoading}
                      {...form.register("phoneNumber")}
                    />
                  </Field>

                  <Field
                    id="settings-timezone"
                    label="Timezone"
                    error={form.formState.errors.timezone?.message}
                  >
                    <select
                      id="settings-timezone"
                      className={selectClassName}
                      disabled={updateBusinessState.isLoading}
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

                {updateBusinessState.error ? (
                  <p role="alert" className="text-sm text-destructive">
                    {getApiErrorMessage(updateBusinessState.error)}
                  </p>
                ) : null}

                <div className="flex justify-end">
                  <Button type="submit" disabled={updateBusinessState.isLoading}>
                    <Save className="size-4" aria-hidden="true" />
                    {updateBusinessState.isLoading ? "Saving" : "Save business"}
                  </Button>
                </div>
              </form>
            ) : null}
          </SettingsSection>
        </div>

        <div className="space-y-6">
          <SettingsSection
            icon={Lock}
            title="Security"
            description="Security controls are staged for a future user-management release."
          >
            <div className="rounded-md border bg-background p-4">
              <p className="text-sm font-medium">Password and MFA controls</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Password changes, multi-factor authentication, and session history will be available after real user accounts replace demo auth.
              </p>
            </div>
          </SettingsSection>

          <SettingsSection
            icon={Bell}
            title="Notifications"
            description="Workspace alerts will be configurable when delivery providers are connected."
          >
            <div className="grid gap-3">
              <PlaceholderRow label="Missed call alerts" enabled />
              <PlaceholderRow label="New lead alerts" enabled />
              <PlaceholderRow label="Appointment reminders" />
            </div>
          </SettingsSection>
        </div>
      </div>
    </div>
  );
}

type SettingsSectionProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
};

function SettingsSection({
  icon: Icon,
  title,
  description,
  children
}: SettingsSectionProps) {
  return (
    <section className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-start gap-3">
        <div className="grid size-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
          <Icon className="size-4" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </section>
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

function PlaceholderRow({
  label,
  enabled = false
}: {
  label: string;
  enabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border bg-background p-3">
      <span className="text-sm font-medium">{label}</span>
      <span
        className={cn(
          "rounded-md border px-2 py-1 text-xs font-medium",
          enabled
            ? "border-chart-2/20 bg-chart-2/10 text-chart-2"
            : "border-muted-foreground/20 bg-muted text-muted-foreground"
        )}
      >
        {enabled ? "On" : "Planned"}
      </span>
    </div>
  );
}

function getApiErrorMessage(error: unknown) {
  if (isFetchBaseQueryError(error)) {
    const data = error.data as { detail?: string; title?: string } | undefined;
    return data?.detail ?? data?.title ?? "Unable to save business settings.";
  }

  return "Unable to save business settings.";
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
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
);
