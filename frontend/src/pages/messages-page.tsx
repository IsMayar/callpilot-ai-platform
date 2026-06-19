import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, MessageSquareText, Search, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { MessageStatusBadge } from "@/features/messages/components/message-status-badge";
import {
  useCreateMessageMutation,
  useGetMessagesQuery
} from "@/features/messages/messagesApi";
import type { Message } from "@/features/messages/types";
import { cn } from "@/lib/utils";

const messageFormSchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, "Message body is required.")
    .max(2000, "Message body must be 2000 characters or fewer.")
});

type MessageFormValues = z.infer<typeof messageFormSchema>;

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short"
});

export function MessagesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const { data, error, isFetching } = useGetMessagesQuery({
    search: search.trim(),
    page,
    size: pageSize
  });
  const [createMessage, createState] = useCreateMessageMutation();
  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      body: ""
    }
  });

  useEffect(() => {
    setPage(0);
  }, [search]);

  const messages = data?.content ?? [];
  const conversationMessages = [...messages].reverse();
  const needsBusinessSetup = isNotFoundError(error);
  const isEmpty = !isFetching && !error && messages.length === 0;

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await createMessage({
        customerId: null,
        leadId: null,
        direction: "OUTBOUND",
        channel: "SMS",
        body: values.body.trim()
      }).unwrap();
      form.reset({ body: "" });
    } catch {
      return;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-normal">Messages</h2>
          <p className="text-sm text-muted-foreground">
            Review SMS follow-ups and send mock outbound messages.
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

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
        <section className="rounded-lg border bg-card shadow-sm">
          <div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <h3 className="text-base font-semibold">Message history</h3>
              <p className="text-sm text-muted-foreground">
                Paginated SMS activity for the current business.
              </p>
            </div>

            <div className="relative w-full lg:max-w-sm">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9"
                placeholder="Search messages"
                aria-label="Search messages"
              />
            </div>
          </div>

          {needsBusinessSetup ? (
            <div className="p-10 text-center">
              <h3 className="text-base font-semibold">Business setup required</h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                Complete your business profile before sending and viewing messages.
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
              <h3 className="text-base font-semibold">Unable to load messages</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Refresh the page or try again in a moment.
              </p>
            </div>
          ) : null}

          {isFetching && !data ? <LoadingRows /> : null}

          {isEmpty ? (
            <div className="p-10 text-center">
              <MessageSquareText
                className="mx-auto size-10 text-muted-foreground"
                aria-hidden="true"
              />
              <h3 className="mt-4 text-base font-semibold">No messages found</h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                Send a message or adjust the search filter.
              </p>
            </div>
          ) : null}

          {messages.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Message</TableHead>
                    <TableHead>Direction</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell className="max-w-80">
                        <p className="truncate font-medium">{message.body}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {message.channel}
                        </p>
                      </TableCell>
                      <TableCell>{messageDirectionLabel(message.direction)}</TableCell>
                      <TableCell>
                        <MessageStatusBadge status={message.status} />
                      </TableCell>
                      <TableCell>
                        {dateFormatter.format(new Date(message.createdAt))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex flex-col gap-3 border-t p-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <p>
                  Showing page {(data?.number ?? 0) + 1} of {Math.max(data?.totalPages ?? 1, 1)}.
                  Total messages: {data?.totalElements ?? 0}.
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

        <aside className="space-y-6">
          <section className="rounded-lg border bg-card p-5 shadow-sm">
            <h3 className="text-base font-semibold">Send message</h3>
            <form className="mt-4 space-y-4" onSubmit={onSubmit}>
              <div className="space-y-2">
                <Label htmlFor="message-body">Message</Label>
                <Textarea
                  id="message-body"
                  className="min-h-32"
                  disabled={createState.isLoading || needsBusinessSetup}
                  {...form.register("body")}
                />
                {form.formState.errors.body?.message ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.body.message}
                  </p>
                ) : null}
              </div>

              {createState.error ? (
                <p role="alert" className="text-sm text-destructive">
                  {getApiErrorMessage(createState.error)}
                </p>
              ) : null}

              <Button
                type="submit"
                disabled={createState.isLoading || needsBusinessSetup}
                className="w-full"
              >
                <Send className="size-4" aria-hidden="true" />
                {createState.isLoading ? "Sending" : "Send SMS"}
              </Button>
            </form>
          </section>

          <section className="rounded-lg border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold">Conversation</h3>
                <p className="text-sm text-muted-foreground">
                  Latest page of SMS messages.
                </p>
              </div>
            </div>

            <div className="mt-5 max-h-[32rem] space-y-3 overflow-y-auto pr-1">
              {conversationMessages.length === 0 ? (
                <p className="rounded-md border bg-background p-4 text-sm text-muted-foreground">
                  No conversation messages to show.
                </p>
              ) : null}

              {conversationMessages.map((message) => (
                <ConversationBubble key={message.id} message={message} />
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function ConversationBubble({ message }: { message: Message }) {
  const isOutbound = message.direction === "OUTBOUND";

  return (
    <div className={cn("flex", isOutbound ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-md border p-3 text-sm shadow-sm",
          isOutbound
            ? "border-primary bg-primary text-primary-foreground"
            : "bg-background"
        )}
      >
        <p className="whitespace-pre-wrap leading-6">{message.body}</p>
        <div
          className={cn(
            "mt-2 flex flex-wrap items-center gap-2 text-xs",
            isOutbound ? "text-primary-foreground/80" : "text-muted-foreground"
          )}
        >
          <span>{messageDirectionLabel(message.direction)}</span>
          <span>{dateFormatter.format(new Date(message.createdAt))}</span>
        </div>
      </div>
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

function messageDirectionLabel(direction: Message["direction"]) {
  return direction
    .toLowerCase()
    .split("_")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

function getApiErrorMessage(error: unknown) {
  if (isFetchBaseQueryError(error)) {
    const data = error.data as { detail?: string; title?: string } | undefined;
    return data?.detail ?? data?.title ?? "Unable to send message.";
  }

  return "Unable to send message.";
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
