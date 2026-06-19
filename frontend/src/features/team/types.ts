export type TeamMemberRole = "OWNER" | "ADMIN" | "MANAGER" | "STAFF";

export type TeamMemberStatus = "ACTIVE" | "INVITED" | "DISABLED";

export type TeamMember = {
  id: string;
  businessId: string;
  userId: string | null;
  fullName: string;
  email: string;
  role: TeamMemberRole;
  status: TeamMemberStatus;
  createdAt: string;
  updatedAt: string;
};

export type TeamMemberRequest = {
  userId: string | null;
  fullName: string;
  email: string;
  role: TeamMemberRole;
  status: TeamMemberStatus;
};

export type TeamListParams = {
  page?: number;
  size?: number;
};

export type TeamMemberPage = {
  content: TeamMember[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
};
