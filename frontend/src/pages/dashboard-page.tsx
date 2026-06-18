import { Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useGetCurrentBusinessQuery } from "@/features/business/businessApi";

export function DashboardPage() {
  const { data: business } = useGetCurrentBusinessQuery();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-normal">Dashboard</h2>
        <p className="text-sm text-muted-foreground">CallPilot AI</p>
      </div>

      <section className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="grid size-10 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
              <Building2 className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 space-y-1">
              <h3 className="truncate text-base font-semibold">
                {business?.name ?? "Business profile"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {business
                  ? `${business.industry} | ${business.phoneNumber} | ${business.timezone}`
                  : "Complete onboarding to activate the business workspace."}
              </p>
            </div>
          </div>

          <Button asChild variant={business ? "outline" : "default"}>
            <Link to="/app/onboarding/business">
              {business ? "Edit business" : "Set up business"}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
