import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Building2, Edit, Eye, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { LeadFormModal } from "@/features/leads/components/lead-form-modal";
import { LeadStatusBadge } from "@/features/leads/components/lead-status-badge";
import {
  useDeleteLeadMutation,
  useGetLeadsQuery
} from "@/features/leads/leadsApi";
import { leadStatuses, statusLabel } from "@/features/leads/status";
import type { Lead, LeadStatus } from "@/features/leads/types";
import { cn } from "@/lib/utils";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

export function LeadsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<LeadStatus | "ALL">("ALL");
  const [page, setPage] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const pageSize = 10;

  const { data, error, isFetching } = useGetLeadsQuery({
    search: search.trim(),
    status: status === "ALL" ? undefined : status,
    page,
    size: pageSize
  });
  const [deleteLead, deleteState] = useDeleteLeadMutation();

  useEffect(() => {
    setPage(0);
  }, [search, status]);

  const leads = data?.content ?? [];
  const needsBusinessSetup = isNotFoundError(error);
  const isEmpty = !isFetching && !error && leads.length === 0;

  const handleDelete = async (lead: Lead) => {
    if (!window.confirm(`Delete ${lead.customerName}?`)) {
      return;
    }

    await deleteLead(lead.id).unwrap();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-normal">Leads</h2>
          <p className="text-sm text-muted-foreground">
            Track incoming opportunities for the current business.
          </p>
        </div>

        {needsBusinessSetup ? (
          <Button asChild>
            <Link to="/app/onboarding/business">
              <Building2 className="size-4" aria-hidden="true" />
              Set up business
            </Link>
          </Button>
        ) : (
          <Button type="button" onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" aria-hidden="true" />
            New lead
          </Button>
        )}
      </div>

      <section className="rounded-lg border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-9"
              placeholder="Search by name"
              aria-label="Search leads by name"
            />
          </div>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as LeadStatus | "ALL")}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base shadow-sm transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:w-52 md:text-sm"
            )}
            aria-label="Filter leads by status"
          >
            <option value="ALL">All statuses</option>
            {leadStatuses.map((leadStatus) => (
              <option key={leadStatus} value={leadStatus}>
                {statusLabel(leadStatus)}
              </option>
            ))}
          </select>
        </div>

        {needsBusinessSetup ? (
          <div className="p-10 text-center">
            <h3 className="text-base font-semibold">Business setup required</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Complete your business profile before creating and managing leads.
            </p>
            <Button asChild className="mt-5">
              <Link to="/app/onboarding/business">
                <Building2 className="size-4" aria-hidden="true" />
                Set up business
              </Link>
            </Button>
          </div>
        ) : null}

        {error && !needsBusinessSetup ? (
          <div className="p-8 text-center">
            <h3 className="text-base font-semibold">Unable to load leads</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Refresh the page or try again in a moment.
            </p>
          </div>
        ) : null}

        {isFetching && !data ? <LoadingRows /> : null}

        {isEmpty ? (
          <div className="p-10 text-center">
            <h3 className="text-base font-semibold">No leads found</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Create a lead or adjust the search and status filters.
            </p>
            <Button type="button" className="mt-5" onClick={() => setCreateOpen(true)}>
              <Plus className="size-4" aria-hidden="true" />
              Create lead
            </Button>
          </div>
        ) : null}

        {leads.length > 0 ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="w-40 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{lead.customerName}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {lead.email ?? "No email"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{lead.phoneNumber}</TableCell>
                    <TableCell className="max-w-56 truncate">
                      {lead.serviceNeeded}
                    </TableCell>
                    <TableCell>
                      <LeadStatusBadge status={lead.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {currencyFormatter.format(lead.estimatedValue)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button asChild variant="ghost" size="icon" aria-label="View lead">
                          <Link to={`/app/leads/${lead.id}`}>
                            <Eye className="size-4" aria-hidden="true" />
                          </Link>
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="Edit lead"
                          onClick={() => setEditingLead(lead)}
                        >
                          <Edit className="size-4" aria-hidden="true" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="Delete lead"
                          disabled={deleteState.isLoading}
                          onClick={() => void handleDelete(lead)}
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex flex-col gap-3 border-t p-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <p>
                Showing page {(data?.number ?? 0) + 1} of {Math.max(data?.totalPages ?? 1, 1)}.
                Total leads: {data?.totalElements ?? 0}.
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={data?.first ?? true}
                  onClick={() => setPage((current) => Math.max(current - 1, 0))}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={data?.last ?? true}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </section>

      <LeadFormModal open={createOpen} onOpenChange={setCreateOpen} />
      <LeadFormModal
        lead={editingLead}
        open={Boolean(editingLead)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingLead(null);
          }
        }}
      />
    </div>
  );
}

function LoadingRows() {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="h-14 animate-pulse rounded-md bg-muted" />
      ))}
    </div>
  );
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
