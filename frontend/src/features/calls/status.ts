import type { CallStatus } from "./types";

export const callStatuses: CallStatus[] = [
  "ANSWERED_BY_AI",
  "MISSED",
  "VOICEMAIL",
  "ESCALATED",
  "COMPLETED"
];

export function callStatusLabel(status: CallStatus) {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}
