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
import { CustomerFormModal } from "@/features/customers/components/customer-form-modal";
import {
  useDeleteCustomerMutation,
  useGetCustomersQuery
} from "@/features/customers/customersApi";
import type { Customer } from "@/features/customers/types";

export function CustomersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const pageSize = 10;

  const { data, error, isFetching } = useGetCustomersQuery({
    search: search.trim(),
    page,
    size: pageSize
  });
  const [deleteCustomer, deleteState] = useDeleteCustomerMutation();

  useEffect(() => {
    setPage(0);
  }, [search]);

  const customers = data?.content ?? [];
  const needsBusinessSetup = isNotFoundError(error);
  const isEmpty = !isFetching && !error && customers.length === 0;

  const handleDelete = async (customer: Customer) => {
    if (!window.confirm(`Delete ${customer.fullName}?`)) {
      return;
    }

    await deleteCustomer(customer.id).unwrap();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-normal">Customers</h2>
          <p className="text-sm text-muted-foreground">
            Manage customer contact records for the current business.
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
            New customer
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
              placeholder="Search customers"
              aria-label="Search customers"
            />
          </div>
        </div>

        {needsBusinessSetup ? (
          <div className="p-10 text-center">
            <h3 className="text-base font-semibold">Business setup required</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Complete your business profile before creating and managing customers.
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
            <h3 className="text-base font-semibold">Unable to load customers</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Refresh the page or try again in a moment.
            </p>
          </div>
        ) : null}

        {isFetching && !data ? <LoadingRows /> : null}

        {isEmpty ? (
          <div className="p-10 text-center">
            <h3 className="text-base font-semibold">No customers found</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Create a customer or adjust the search filter.
            </p>
            <Button type="button" className="mt-5" onClick={() => setCreateOpen(true)}>
              <Plus className="size-4" aria-hidden="true" />
              Create customer
            </Button>
          </div>
        ) : null}

        {customers.length > 0 ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="w-40 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <p className="truncate font-medium">{customer.fullName}</p>
                    </TableCell>
                    <TableCell>{customer.phoneNumber}</TableCell>
                    <TableCell className="max-w-56 truncate">
                      {customer.email ?? "No email"}
                    </TableCell>
                    <TableCell className="max-w-64 truncate">
                      {customer.address ?? "No address"}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          aria-label="View customer"
                        >
                          <Link to={`/app/customers/${customer.id}`}>
                            <Eye className="size-4" aria-hidden="true" />
                          </Link>
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="Edit customer"
                          onClick={() => setEditingCustomer(customer)}
                        >
                          <Edit className="size-4" aria-hidden="true" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="Delete customer"
                          disabled={deleteState.isLoading}
                          onClick={() => void handleDelete(customer)}
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
                Total customers: {data?.totalElements ?? 0}.
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

      <CustomerFormModal open={createOpen} onOpenChange={setCreateOpen} />
      <CustomerFormModal
        customer={editingCustomer}
        open={Boolean(editingCustomer)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingCustomer(null);
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

