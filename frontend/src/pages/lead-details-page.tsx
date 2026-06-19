import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LeadFormModal } from "@/features/leads/components/lead-form-modal";
import { LeadStatusBadge } from "@/features/leads/components/lead-status-badge";
import {
  useDeleteLeadMutation,
  useGetLeadQuery
} from "@/features/leads/leadsApi";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short"
});

export function LeadDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const { data: lead, error, isFetching } = useGetLeadQuery(id ?? "", {
    skip: !id
  });
  const [deleteLead, deleteState] = useDeleteLeadMutation();

  const handleDelete = async () => {
    if (!lead || !window.confirm("Delete this lead?")) {
      return;
    }

    await deleteLead(lead.id).unwrap();
    navigate("/app/leads", { replace: true });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Button asChild variant="ghost" className="-ml-3">
            <Link to="/app/leads">
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to leads
            </Link>
          </Button>
          <h2 className="text-2xl font-semibold tracking-normal">
            {lead?.customerName ?? "Lead details"}
          </h2>
        </div>

        {lead ? (
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setEditOpen(true)}>
              <Edit className="size-4" aria-hidden="true" />
              Edit
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={deleteState.isLoading}
              onClick={() => void handleDelete()}
            >
              <Trash2 className="size-4" aria-hidden="true" />
              Delete
            </Button>
          </div>
        ) : null}
      </div>

      {isFetching ? (
        <section className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 rounded bg-muted" />
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-16 rounded bg-muted" />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {error ? (
        <section className="rounded-lg border bg-card p-8 text-center shadow-sm">
          <h3 className="text-base font-semibold">Unable to load lead</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            The lead may have been deleted or you may not have access.
          </p>
        </section>
      ) : null}

      {lead ? (
        <section className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Detail label="Status">
              <LeadStatusBadge status={lead.status} />
            </Detail>
            <Detail label="Phone number">{lead.phoneNumber}</Detail>
            <Detail label="Email">{lead.email ?? "Not provided"}</Detail>
            <Detail label="Service needed">{lead.serviceNeeded}</Detail>
            <Detail label="Urgency">{lead.urgency}</Detail>
            <Detail label="Estimated value">
              {currencyFormatter.format(lead.estimatedValue)}
            </Detail>
            <Detail label="Created">
              {dateFormatter.format(new Date(lead.createdAt))}
            </Detail>
            <Detail label="Updated">
              {dateFormatter.format(new Date(lead.updatedAt))}
            </Detail>
            <Detail label="Business ID">{lead.businessId}</Detail>
          </div>

          <div className="mt-6 border-t pt-6">
            <p className="text-sm font-medium text-muted-foreground">Notes</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
              {lead.notes ?? "No notes added."}
            </p>
          </div>
        </section>
      ) : null}

      <LeadFormModal lead={lead} open={editOpen} onOpenChange={setEditOpen} />
    </div>
  );
}

type DetailProps = {
  label: string;
  children: ReactNode;
};

function Detail({ label, children }: DetailProps) {
  return (
    <div className="min-w-0 rounded-md border bg-background p-4">
      <p className="text-xs font-medium uppercase tracking-normal text-muted-foreground">
        {label}
      </p>
      <div className="mt-2 truncate text-sm font-medium">{children}</div>
    </div>
  );
}
