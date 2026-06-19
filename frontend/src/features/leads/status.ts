import type { LeadStatus } from "./types";

export const leadStatuses: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "BOOKED",
  "CLOSED",
  "LOST"
];

export function statusLabel(status: LeadStatus) {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

