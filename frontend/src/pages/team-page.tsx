import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Building2, Edit, Plus, ShieldOff, Trash2, UserRoundPlus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/common/page-header";
import { StateBlock } from "@/components/common/state-block";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  TeamRoleBadge,
  TeamStatusBadge
} from "@/features/team/components/team-member-badges";
import { TeamMemberFormModal } from "@/features/team/components/team-member-form-modal";
import {
  useDeleteTeamMemberMutation,
  useGetTeamMembersQuery,
  useUpdateTeamMemberMutation
} from "@/features/team/teamApi";
import type { TeamMember } from "@/features/team/types";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short"
});

export function TeamPage() {
  const [page, setPage] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingTeamMember, setEditingTeamMember] =
    useState<TeamMember | null>(null);
  const pageSize = 10;

  const { data, error, isFetching } = useGetTeamMembersQuery({
    page,
    size: pageSize
  });
  const [deleteTeamMember, deleteState] = useDeleteTeamMemberMutation();
  const [updateTeamMember, updateState] = useUpdateTeamMemberMutation();

  const teamMembers = data?.content ?? [];
  const needsBusinessSetup = isNotFoundError(error);
  const isEmpty = !isFetching && !error && teamMembers.length === 0;

  const handleDisable = async (teamMember: TeamMember) => {
    await updateTeamMember({
      id: teamMember.id,
      body: {
        userId: teamMember.userId,
        fullName: teamMember.fullName,
        email: teamMember.email,
        role: teamMember.role,
        status: "DISABLED"
      }
    }).unwrap();
  };

  const handleDelete = async (teamMember: TeamMember) => {
    if (!window.confirm(`Remove ${teamMember.fullName} from the team?`)) {
      return;
    }

    await deleteTeamMember(teamMember.id).unwrap();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team"
        description="Invite teammates, manage roles, and control account access."
        icon={UserRoundPlus}
        actions={
          needsBusinessSetup ? (
            <Button asChild>
              <Link to="/app/onboarding/business">
                <Building2 className="size-4" aria-hidden="true" />
                Set up business
              </Link>
            </Button>
          ) : (
            <Button type="button" onClick={() => setCreateOpen(true)}>
              <Plus className="size-4" aria-hidden="true" />
              Invite member
            </Button>
          )
        }
      />

      {needsBusinessSetup ? (
        <StateBlock
          title="Business setup required"
          description="Complete your business profile before inviting team members."
          action={
            <Button asChild>
              <Link to="/app/onboarding/business">
                <Building2 className="size-4" aria-hidden="true" />
                Set up business
              </Link>
            </Button>
          }
        />
      ) : null}

      {error && !needsBusinessSetup ? (
        <StateBlock
          variant="error"
          title="Unable to load team"
          description="Refresh the page or try again in a moment."
        />
      ) : null}

      {isFetching && !data ? (
        <section className="space-y-3 rounded-lg border bg-card p-4 shadow-sm">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-14 animate-pulse rounded-md bg-muted" />
          ))}
        </section>
      ) : null}

      {isEmpty ? (
        <StateBlock
          title="No team members found"
          description="Invite your first team member to start assigning roles."
          action={
            <Button type="button" onClick={() => setCreateOpen(true)}>
              <Plus className="size-4" aria-hidden="true" />
              Invite member
            </Button>
          }
        />
      ) : null}

      {teamMembers.length > 0 ? (
        <section className="overflow-hidden rounded-lg border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-44 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((teamMember) => (
                  <TableRow key={teamMember.id}>
                    <TableCell>
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {teamMember.fullName}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {teamMember.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <TeamRoleBadge role={teamMember.role} />
                    </TableCell>
                    <TableCell>
                      <TeamStatusBadge status={teamMember.status} />
                    </TableCell>
                    <TableCell>
                      {dateFormatter.format(new Date(teamMember.createdAt))}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="Edit team member"
                          onClick={() => setEditingTeamMember(teamMember)}
                        >
                          <Edit className="size-4" aria-hidden="true" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="Disable team member"
                          disabled={
                            teamMember.status === "DISABLED" ||
                            updateState.isLoading
                          }
                          onClick={() => void handleDisable(teamMember)}
                        >
                          <ShieldOff className="size-4" aria-hidden="true" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="Remove team member"
                          disabled={deleteState.isLoading}
                          onClick={() => void handleDelete(teamMember)}
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-3 border-t p-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing page {(data?.number ?? 0) + 1} of {Math.max(data?.totalPages ?? 1, 1)}.
              Total members: {data?.totalElements ?? 0}.
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
        </section>
      ) : null}

      <TeamMemberFormModal open={createOpen} onOpenChange={setCreateOpen} />
      <TeamMemberFormModal
        teamMember={editingTeamMember}
        open={Boolean(editingTeamMember)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingTeamMember(null);
          }
        }}
      />
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
