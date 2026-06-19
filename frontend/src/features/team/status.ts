import type { TeamMemberRole, TeamMemberStatus } from "./types";

export const teamMemberRoles: TeamMemberRole[] = [
  "OWNER",
  "ADMIN",
  "MANAGER",
  "STAFF"
];

export const teamMemberStatuses: TeamMemberStatus[] = [
  "ACTIVE",
  "INVITED",
  "DISABLED"
];

export function teamLabel(value: TeamMemberRole | TeamMemberStatus) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}
