import {
  CalendarCheck,
  DollarSign,
  Phone,
  PhoneMissed,
  RefreshCcw,
  UserPlus
} from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { StateBlock } from "@/components/common/state-block";
import { Button } from "@/components/ui/button";
import { useGetDashboardSummaryQuery } from "@/features/dashboard/dashboardApi";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

export function DashboardPage() {
  const {
    data: summary,
    error,
    isFetching,
    refetch
  } = useGetDashboardSummaryQuery();

  const stats = summary
    ? [
        {
          label: "Calls Today",
          value: summary.callsToday.toLocaleString(),
          icon: Phone,
          iconClassName: "bg-primary/10 text-primary"
        },
        {
          label: "New Leads",
          value: summary.newLeads.toLocaleString(),
          icon: UserPlus,
          iconClassName: "bg-chart-3/10 text-chart-3"
        },
        {
          label: "Appointments Booked",
          value: summary.appointmentsBooked.toLocaleString(),
          icon: CalendarCheck,
          iconClassName: "bg-chart-4/10 text-chart-4"
        },
        {
          label: "Missed Calls Recovered",
          value: summary.missedCallsRecovered.toLocaleString(),
          icon: PhoneMissed,
          iconClassName: "bg-chart-2/10 text-chart-2"
        },
        {
          label: "Estimated Revenue Saved",
          value: currencyFormatter.format(summary.estimatedRevenueSaved),
          icon: DollarSign,
          iconClassName: "bg-chart-5/10 text-chart-5"
        }
      ]
    : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Your daily business recovery snapshot."
        actions={
          <Button
            type="button"
            variant="outline"
            onClick={() => void refetch()}
            disabled={isFetching}
          >
            <RefreshCcw className="size-4" aria-hidden="true" />
            {isFetching ? "Refreshing" : "Refresh"}
          </Button>
        }
      />

      {error ? (
        <StateBlock
          variant="error"
          title="Unable to load dashboard summary"
          description="Refresh the page or try again in a moment."
        />
      ) : null}

      {isFetching && !summary ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-lg border bg-card p-5 shadow-sm"
            >
              <div className="mb-8 size-10 rounded-md bg-muted" />
              <div className="mb-3 h-4 w-28 rounded bg-muted" />
              <div className="h-8 w-20 rounded bg-muted" />
            </div>
          ))}
        </section>
      ) : null}

      {summary ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {stats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-lg border bg-card p-5 shadow-sm transition-colors hover:border-primary/40"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="truncate text-3xl font-semibold tracking-normal">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={[
                    "grid size-10 shrink-0 place-items-center rounded-md",
                    stat.iconClassName
                  ].join(" ")}
                >
                  <stat.icon className="size-5" aria-hidden="true" />
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : null}
    </div>
  );
}
