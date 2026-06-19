import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Building2, Eye, PhoneCall, Search } from "lucide-react";
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
import { CallStatusBadge } from "@/features/calls/components/call-status-badge";
import { useGetCallRecordsQuery } from "@/features/calls/callsApi";
import { callStatuses, callStatusLabel } from "@/features/calls/status";
import type { CallStatus } from "@/features/calls/types";
import { cn } from "@/lib/utils";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short"
});

export function CallsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CallStatus | "ALL">("ALL");
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const { data, error, isFetching } = useGetCallRecordsQuery({
    search: search.trim(),
    status: status === "ALL" ? undefined : status,
    page,
    size: pageSize
  });

  useEffect(() => {
    setPage(0);
  }, [search, status]);

  const calls = data?.content ?? [];
  const needsBusinessSetup = isNotFoundError(error);
  const isEmpty = !isFetching && !error && calls.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-normal">Calls</h2>
          <p className="text-sm text-muted-foreground">
            Review call records, transcripts, and AI-generated summaries.
          </p>
        </div>

        {needsBusinessSetup ? (
          <Button asChild>
            <Link to="/app/onboarding/business">
              <Building2 className="size-4" aria-hidden="true" />
              Set up business
            </Link>
          </Button>
        ) : null}
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
              placeholder="Search calls"
              aria-label="Search calls"
            />
          </div>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as CallStatus | "ALL")}
            className={selectClassName}
            aria-label="Filter calls by status"
          >
            <option value="ALL">All statuses</option>
            {callStatuses.map((callStatus) => (
              <option key={callStatus} value={callStatus}>
                {callStatusLabel(callStatus)}
              </option>
            ))}
          </select>
        </div>

        {needsBusinessSetup ? (
          <div className="p-10 text-center">
            <h3 className="text-base font-semibold">Business setup required</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Complete your business profile before reviewing call records.
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
            <h3 className="text-base font-semibold">Unable to load calls</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Refresh the page or try again in a moment.
            </p>
          </div>
        ) : null}

        {isFetching && !data ? <LoadingRows /> : null}

        {isEmpty ? (
          <div className="p-10 text-center">
            <PhoneCall className="mx-auto size-10 text-muted-foreground" aria-hidden="true" />
            <h3 className="mt-4 text-base font-semibold">No calls found</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              New call records will appear here after they are captured.
            </p>
          </div>
        ) : null}

        {calls.length > 0 ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Caller</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Intent</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calls.map((call) => (
                  <TableRow key={call.id}>
                    <TableCell>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{call.callerPhone}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {call.customerId ? "Linked customer" : "No customer linked"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <CallStatusBadge status={call.callStatus} />
                    </TableCell>
                    <TableCell>{formatDuration(call.durationSeconds)}</TableCell>
                    <TableCell className="max-w-48 truncate">
                      {call.intent ?? "Unknown"}
                    </TableCell>
                    <TableCell>{call.urgency ?? "Not set"}</TableCell>
                    <TableCell>{dateFormatter.format(new Date(call.createdAt))}</TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <Button asChild variant="ghost" size="icon" aria-label="View call">
                          <Link to={`/app/calls/${call.id}`}>
                            <Eye className="size-4" aria-hidden="true" />
                          </Link>
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
                Total calls: {data?.totalElements ?? 0}.
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

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
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
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:w-56 md:text-sm"
);
