import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ArrowLeft, Building2, ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CallStatusBadge } from "@/features/calls/components/call-status-badge";
import { useGetCallRecordQuery } from "@/features/calls/callsApi";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short"
});

export function CallDetailsPage() {
  const { id } = useParams();
  const { data: call, error, isFetching } = useGetCallRecordQuery(id ?? "", {
    skip: !id
  });
  const needsBusinessSetup = isNotFoundError(error);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Button asChild variant="ghost" className="-ml-3">
            <Link to="/app/calls">
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to calls
            </Link>
          </Button>
          <h2 className="text-2xl font-semibold tracking-normal">
            {call?.callerPhone ?? "Call details"}
          </h2>
        </div>
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

      {needsBusinessSetup ? (
        <section className="rounded-lg border bg-card p-10 text-center shadow-sm">
          <h3 className="text-base font-semibold">Business setup required</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Complete your business profile before viewing call records.
          </p>
          <Button asChild className="mt-5">
            <Link to="/app/onboarding/business">
              <Building2 className="size-4" aria-hidden="true" />
              Set up business
            </Link>
          </Button>
        </section>
      ) : null}

      {error && !needsBusinessSetup ? (
        <section className="rounded-lg border bg-card p-8 text-center shadow-sm">
          <h3 className="text-base font-semibold">Unable to load call</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            The call record may have been deleted or you may not have access.
          </p>
        </section>
      ) : null}

      {call ? (
        <>
          <section className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Detail label="Status">
                <CallStatusBadge status={call.callStatus} />
              </Detail>
              <Detail label="Caller">{call.callerPhone}</Detail>
              <Detail label="Duration">{formatDuration(call.durationSeconds)}</Detail>
              <Detail label="Intent">{call.intent ?? "Unknown"}</Detail>
              <Detail label="Urgency">{call.urgency ?? "Not set"}</Detail>
              <Detail label="Created">
                {dateFormatter.format(new Date(call.createdAt))}
              </Detail>
              <Detail label="Customer ID">{call.customerId ?? "Not linked"}</Detail>
              <Detail label="Lead ID">{call.leadId ?? "Not linked"}</Detail>
              <Detail label="Business ID">{call.businessId}</Detail>
            </div>

            {call.recordingUrl ? (
              <div className="mt-6 border-t pt-6">
                <Button asChild variant="outline">
                  <a href={call.recordingUrl} target="_blank" rel="noreferrer">
                    <ExternalLink className="size-4" aria-hidden="true" />
                    Open recording
                  </a>
                </Button>
              </div>
            ) : null}
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-base font-semibold">Transcript</h3>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                {call.transcript ?? "No transcript captured for this call."}
              </p>
            </article>

            <article className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-base font-semibold">AI Summary</h3>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                {call.aiSummary ?? "No AI summary generated for this call."}
              </p>
            </article>
          </section>
        </>
      ) : null}
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
