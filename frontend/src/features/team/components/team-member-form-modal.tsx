import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  teamLabel,
  teamMemberRoles,
  teamMemberStatuses
} from "@/features/team/status";
import {
  useCreateTeamMemberMutation,
  useUpdateTeamMemberMutation
} from "@/features/team/teamApi";
import type {
  TeamMember,
  TeamMemberRequest
} from "@/features/team/types";
import { cn } from "@/lib/utils";

const teamMemberFormSchema = z.object({
  userId: z
    .string()
    .trim()
    .max(160, "User ID must be 160 characters or fewer."),
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters.")
    .max(160, "Full name must be 160 characters or fewer."),
  email: z
    .string()
    .trim()
    .email("Email must be valid.")
    .max(160, "Email must be 160 characters or fewer."),
  role: z.enum(["OWNER", "ADMIN", "MANAGER", "STAFF"]),
  status: z.enum(["ACTIVE", "INVITED", "DISABLED"])
});

type TeamMemberFormValues = z.infer<typeof teamMemberFormSchema>;

type TeamMemberFormModalProps = {
  teamMember?: TeamMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TeamMemberFormModal({
  teamMember,
  open,
  onOpenChange
}: TeamMemberFormModalProps) {
  const [createTeamMember, createState] = useCreateTeamMemberMutation();
  const [updateTeamMember, updateState] = useUpdateTeamMemberMutation();
  const isEditing = Boolean(teamMember);
  const isSaving = createState.isLoading || updateState.isLoading;
  const saveError = createState.error ?? updateState.error;

  const form = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberFormSchema),
    defaultValues: defaultValues()
  });

  useEffect(() => {
    if (open) {
      form.reset(teamMember ? valuesFromTeamMember(teamMember) : defaultValues());
    }
  }, [form, open, teamMember]);

  const onSubmit = form.handleSubmit(async (values) => {
    const body: TeamMemberRequest = {
      userId: emptyToNull(values.userId),
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      role: values.role,
      status: values.status
    };

    try {
      if (teamMember) {
        await updateTeamMember({ id: teamMember.id, body }).unwrap();
      } else {
        await createTeamMember(body).unwrap();
      }

      onOpenChange(false);
    } catch {
      return;
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit team member" : "Invite team member"}
          </DialogTitle>
          <DialogDescription>
            Manage user access for the current CallPilot AI business.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="team-full-name"
              label="Full name"
              error={form.formState.errors.fullName?.message}
            >
              <Input
                id="team-full-name"
                autoComplete="name"
                disabled={isSaving}
                {...form.register("fullName")}
              />
            </Field>

            <Field
              id="team-email"
              label="Email"
              error={form.formState.errors.email?.message}
            >
              <Input
                id="team-email"
                type="email"
                autoComplete="email"
                disabled={isSaving}
                {...form.register("email")}
              />
            </Field>

            <Field
              id="team-role"
              label="Role"
              error={form.formState.errors.role?.message}
            >
              <select
                id="team-role"
                className={selectClassName}
                disabled={isSaving}
                {...form.register("role")}
              >
                {teamMemberRoles.map((role) => (
                  <option key={role} value={role}>
                    {teamLabel(role)}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              id="team-status"
              label="Status"
              error={form.formState.errors.status?.message}
            >
              <select
                id="team-status"
                className={selectClassName}
                disabled={isSaving}
                {...form.register("status")}
              >
                {teamMemberStatuses.map((status) => (
                  <option key={status} value={status}>
                    {teamLabel(status)}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              id="team-user-id"
              label="User ID"
              error={form.formState.errors.userId?.message}
            >
              <Input
                id="team-user-id"
                disabled={isSaving}
                {...form.register("userId")}
              />
            </Field>
          </div>

          {saveError ? (
            <p role="alert" className="text-sm text-destructive">
              {getApiErrorMessage(saveError)}
            </p>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isSaving}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              <Save className="size-4" aria-hidden="true" />
              {isSaving ? "Saving" : "Save member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
};

function Field({ id, label, error, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}

function defaultValues(): TeamMemberFormValues {
  return {
    userId: "",
    fullName: "",
    email: "",
    role: "STAFF",
    status: "INVITED"
  };
}

function valuesFromTeamMember(teamMember: TeamMember): TeamMemberFormValues {
  return {
    userId: teamMember.userId ?? "",
    fullName: teamMember.fullName,
    email: teamMember.email,
    role: teamMember.role,
    status: teamMember.status
  };
}

function emptyToNull(value: string) {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function getApiErrorMessage(error: unknown) {
  if (isFetchBaseQueryError(error)) {
    const data = error.data as { detail?: string; title?: string } | undefined;
    return data?.detail ?? data?.title ?? "Unable to save team member.";
  }

  return "Unable to save team member.";
}

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === "object" && error !== null && "status" in error;
}

const selectClassName = cn(
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base shadow-sm transition-colors",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
);
