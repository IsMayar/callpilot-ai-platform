import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ArrowLeft, Building2, Edit, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CustomerFormModal } from "@/features/customers/components/customer-form-modal";
import {
  useDeleteCustomerMutation,
  useGetCustomerQuery
} from "@/features/customers/customersApi";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short"
});

export function CustomerDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const { data: customer, error, isFetching } = useGetCustomerQuery(id ?? "", {
    skip: !id
  });
  const [deleteCustomer, deleteState] = useDeleteCustomerMutation();
  const needsBusinessSetup = isNotFoundError(error);

  const handleDelete = async () => {
    if (!customer || !window.confirm("Delete this customer?")) {
      return;
    }

    await deleteCustomer(customer.id).unwrap();
    navigate("/app/customers", { replace: true });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Button asChild variant="ghost" className="-ml-3">
            <Link to="/app/customers">
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to customers
            </Link>
          </Button>
          <h2 className="text-2xl font-semibold tracking-normal">
            {customer?.fullName ?? "Customer details"}
          </h2>
        </div>

        {customer ? (
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
              {Array.from({ length: 7 }).map((_, index) => (
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
            Complete your business profile before viewing customers.
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
          <h3 className="text-base font-semibold">Unable to load customer</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            The customer may have been deleted or you may not have access.
          </p>
        </section>
      ) : null}

      {customer ? (
        <section className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Detail label="Phone number">{customer.phoneNumber}</Detail>
            <Detail label="Email">{customer.email ?? "Not provided"}</Detail>
            <Detail label="Address">{customer.address ?? "Not provided"}</Detail>
            <Detail label="Created">
              {dateFormatter.format(new Date(customer.createdAt))}
            </Detail>
            <Detail label="Updated">
              {dateFormatter.format(new Date(customer.updatedAt))}
            </Detail>
            <Detail label="Business ID">{customer.businessId}</Detail>
          </div>

          <div className="mt-6 border-t pt-6">
            <p className="text-sm font-medium text-muted-foreground">Notes</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
              {customer.notes ?? "No notes added."}
            </p>
          </div>
        </section>
      ) : null}

      <CustomerFormModal
        customer={customer}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
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

