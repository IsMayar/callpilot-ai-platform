import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Building2, CreditCard, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/common/page-header";
import { StateBlock } from "@/components/common/state-block";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetCurrentPlanQuery } from "@/features/billing/billingApi";
import type { SubscriptionPlanStatus } from "@/features/billing/types";
import { cn } from "@/lib/utils";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium"
});

const statusStyles: Record<SubscriptionPlanStatus, string> = {
  TRIAL: "border-primary/20 bg-primary/10 text-primary",
  ACTIVE: "border-chart-2/20 bg-chart-2/10 text-chart-2",
  PAST_DUE: "border-chart-5/20 bg-chart-5/10 text-chart-5",
  CANCELLED: "border-destructive/20 bg-destructive/10 text-destructive"
};

export function BillingPage() {
  const { data: plan, error, isFetching } = useGetCurrentPlanQuery();
  const needsBusinessSetup = isNotFoundError(error);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing"
        description="Review the current subscription placeholder before Stripe is connected."
        icon={CreditCard}
        actions={
          <Button type="button" disabled>
            <Lock className="size-4" aria-hidden="true" />
            Upgrade Plan
          </Button>
        }
      />

      {needsBusinessSetup ? (
        <StateBlock
          title="Business setup required"
          description="Complete your business profile before viewing billing details."
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
          title="Unable to load billing"
          description="Refresh the page or try again in a moment."
        />
      ) : null}

      {isFetching && !plan ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-lg border bg-card p-5 shadow-sm"
            >
              <div className="mb-5 h-4 w-24 rounded bg-muted" />
              <div className="h-8 w-32 rounded bg-muted" />
            </div>
          ))}
        </section>
      ) : null}

      {plan ? (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <PlanDetail label="Current plan" value={plan.planName} />
            <PlanDetail
              label="Monthly price"
              value={currencyFormatter.format(plan.monthlyPrice)}
            />
            <div className="rounded-lg border bg-card p-5 shadow-sm">
              <p className="text-sm font-medium text-muted-foreground">
                Billing status
              </p>
              <div className="mt-3">
                <Badge
                  variant="outline"
                  className={cn(statusStyles[plan.status])}
                >
                  {statusLabel(plan.status)}
                </Badge>
              </div>
            </div>
            <PlanDetail
              label="Renewal date"
              value={dateFormatter.format(new Date(plan.renewsAt))}
            />
          </section>

          <section className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h3 className="text-base font-semibold">Stripe integration coming later</h3>
                <p className="text-sm text-muted-foreground">
                  Plan upgrades, invoices, payment methods, and cancellation flows will be connected when billing is ready.
                </p>
              </div>
              <Button type="button" variant="outline" disabled>
                <Lock className="size-4" aria-hidden="true" />
                Manage billing
              </Button>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}

function PlanDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card p-5 shadow-sm">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-3 truncate text-2xl font-semibold tracking-normal">
        {value}
      </p>
    </div>
  );
}

function statusLabel(status: SubscriptionPlanStatus) {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
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
